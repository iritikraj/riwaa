/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/lib/seo-agent/ai-audit.ts
import { GoogleGenAI } from '@google/genai';
import { fetchPageSpeedData } from '@/lib/seo-agent/google-tools/page-speed';
import { scrapeWithPuppeteer } from '@/lib/seo-agent/scraper';
import { analyzeEntities } from '@/lib/seo-agent/nlp';
import { generateKeywordMatrix } from '@/lib/seo-agent/keyword-research';
import { calculateKeywordDensity, checkGrammar } from './audit/content-analysis';

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function runHeavyAiAudit(url: string, industry: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const timestamp = new Date().toISOString();

  // 1. Concurrent Fetching
  const [scraperResult, psiData] = await Promise.all([
    scrapeWithPuppeteer(url),
    fetchPageSpeedData(url)
  ]);

  if (!scraperResult) throw new Error("Failed to render and scrape the target URL.");

  // 2. NLP Analysis
  const nlpEntities = await analyzeEntities(scraperResult.rawText);

  // 3. Keyword Matrix
  const h1Text = scraperResult.metadata.headings?.h1?.[0];
  const titleText = scraperResult.metadata.title?.text;
  const seedKeyword = h1Text || titleText || industry || 'General Business';
  const keywordMatrix = await generateKeywordMatrix(seedKeyword);


  // INJECT KEYWORD DENSITY MATH HERE
  const keywordsToCheck = [seedKeyword];
  if (keywordMatrix && keywordMatrix.length > 0) {
    keywordsToCheck.push(...keywordMatrix.slice(0, 2).map((k: any) => k.keyword));
  }

  const grammarReport = await checkGrammar(scraperResult.rawText);

  const promptGrammarReport = {
    total_errors: grammarReport.total_errors,
    sample_issues: grammarReport.issues.slice(0, 3)
  };

  // Pass the raw text and the target keywords to our new utility function
  const densityReport = calculateKeywordDensity(scraperResult.rawText, keywordsToCheck);

  const prompt = `
      [Request ID: ${timestamp}]
      Perform a comprehensive enterprise SEO and Content Quality analysis on the URL: ${url}.
      Target Industry Context: ${industry || 'General Business'}.
      
      === DETERMINISTIC INGESTION DATA ===
      The following data was compiled via headless Chromium, Google PageSpeed API, and Google Cloud NLP. Treat this as absolute ground truth:
      
      1. PAGE SPEED & LIGHTHOUSE DIAGNOSTICS:
      ${JSON.stringify(psiData || "Unavailable", null, 2)}
      
      2. DOM, META & CONTENT STRUCTURE (Puppeteer/Cheerio):
      ${JSON.stringify(scraperResult.metadata, null, 2)}
      
      3. RAW TEXT CONTENT (For Readability & Grammar Analysis):
      ${scraperResult.rawText ? scraperResult.rawText.substring(0, 3000) : "Unavailable"}
      
      4. KNOWLEDGE GRAPH ENTITIES (Google NLP API Salience):
      ${JSON.stringify(nlpEntities.length > 0 ? nlpEntities : "Unavailable", null, 2)}

      5. KEYWORD DENSITY & STUFFING REPORT:
      ${JSON.stringify(densityReport, null, 2)}

      6. GRAMMAR & READABILITY REPORT:
      ${JSON.stringify(promptGrammarReport, null, 2)}
      ====================================

      CRITICAL AGENT INSTRUCTIONS:
      1. Respond ONLY with a raw JSON object matching the exact schema below. No markdown.
      2. Categorize technical issues into: "Performance", "Accessibility", "Best Practices", or "SEO".
      3. Analyze the "headings" object. If H1-H6 tags skip levels (e.g., H1 jumps directly to H3), flag this as an On-Page SEO issue.
      4. Analyze the "social_graph". If OG tags or Twitter Cards are missing, flag them.
      5. Read the "RAW TEXT CONTENT" to calculate a Readability Score (0-100) and evaluate Tone Consistency.
      6. Use "word_count" to determine if Thin Content is detected (usually < 300 words).
      7. If "internal_duplicates_found" (in the DOM data) has items, flag duplicate content issues.
      8. Review the "KEYWORD DENSITY & STUFFING REPORT". If any keyword status is "Critical (Stuffing)", flag it severely in the content quality metrics.
      9. Use "GRAMMAR & READABILITY REPORT" to adjust the overall content health score. Do NOT attempt to list grammar errors in your JSON response.

      Expected JSON Format:
      {
        "seo_health_score": 85, 
        "geo_visibility_score": 70,
        "accessibility_score": 90,
        "best_practices_score": 96,
        "extracted_entities": ["entity1", "entity2"], 
        "technical_issues": [
          {
            "category": "Performance" | "Accessibility" | "Best Practices" | "SEO",
            "issue": "Specific pinpointed gap",
            "severity": "Low" | "Medium" | "High" | "Critical",
            "recommendation": "Precise dev-level execution steps"
          }
        ],
        "on_page_seo": {
          "heading_hierarchy_valid": true,
          "open_graph_optimized": false,
          "images_optimized": true,
          "link_ratio_healthy": true
        },
        "content_quality": {
          "thin_content_detected": false, 
          "readability_score": 82,
          "tone_consistency": "Highly consistent.", 
          "missing_semantic_topics": ["topic1", "topic2"],
          "keyword_stuffing_warnings": [{"keyword": "example", "density": 5.2, "status": "Critical (Stuffing)"}],
          "duplicate_content_detected": true
        }
      }
    `;

  const response: any = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { tools: [{ googleSearch: {} }], temperature: 0.15 },
  });

  let rawText = typeof response.text === 'function' ? response.text() : (response.text || '');
  rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();

  const auditData = JSON.parse(rawText);
  auditData.keyword_opportunities = keywordMatrix;
  auditData.raw_dom_data = scraperResult.metadata;
  auditData.raw_nlp_entities = nlpEntities;
  auditData.raw_pagespeed_data = psiData;
  if (!auditData.content_quality) auditData.content_quality = {};
  auditData.content_quality.deterministic_keyword_density = densityReport;
  auditData.content_quality.grammar_issues_found = grammarReport.issues;
  auditData.content_quality.grammar_total_errors = grammarReport.total_errors;

  return auditData;
}