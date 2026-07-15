/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/seo-agent/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { fetchPageSpeedData, saveAuditToStrapi } from '@/lib/seo-agent/strapi';
import { scrapeWithPuppeteer } from '@/lib/seo-agent/scraper';
import { analyzeEntities } from '@/lib/seo-agent/nlp';
import { withLogger } from '@/lib/logs/withLogger'; // Your custom logger
import { generateKeywordMatrix } from '@/lib/seo-agent/keyword-research';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const POST = withLogger('/api/seo-agent/audit', async (req: NextRequest, routeLogger) => {
  try {
    const { url, industry, skipSave } = await req.json();

    if (!url) {
      routeLogger.warn({ event: 'audit_aborted', reason: 'Missing URL' });
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    routeLogger.info({ event: 'audit_started', url, industry }, `Initiating enterprise SEO audit for: ${url}`);
    const timestamp = new Date().toISOString();

    // 1. Run network-heavy tasks concurrently
    routeLogger.info({ event: 'fetching_deterministic_data' }, 'Spinning up Puppeteer and requesting PageSpeed metrics...');
    const [scraperResult, psiData] = await Promise.all([
      scrapeWithPuppeteer(url),
      fetchPageSpeedData(url)
    ]);

    if (!scraperResult) {
      throw new Error("Failed to render and scrape the target URL. Check EC2 Puppeteer configuration.");
    }

    routeLogger.info({
      event: 'deterministic_data_retrieved',
      hasScraperData: !!scraperResult,
      schemasFound: scraperResult.metadata.detected_schemas?.length || 0,
      h1Count: scraperResult.metadata.headings?.h1?.length || 0,
      psiScore: psiData?.scores?.performance || 'Unavailable'
    }, 'DOM and Web Vitals successfully extracted.');

    // 2. Run NLP Analysis on the extracted text
    routeLogger.info({ event: 'nlp_analysis_started' }, 'Analyzing extracted text via Google Cloud NLP...');
    const nlpEntities = await analyzeEntities(scraperResult.rawText);

    routeLogger.info({
      event: 'nlp_analysis_complete',
      entitiesFound: nlpEntities.length
    }, `Extracted ${nlpEntities.length} salient entities from the raw text.`);

    // ==========================================
    // 2.5: KEYWORD & SEARCH OPPORTUNITY AUDIT
    // ==========================================
    routeLogger.info({ event: 'keyword_research_started' }, 'Extracting seed keyword and fetching live SERP data...');

    // Guess the primary keyword from the page's structure, fallback to industry
    const h1Text = scraperResult.metadata.headings?.h1?.[0];
    const titleText = scraperResult.metadata.title?.text;
    const seedKeyword = h1Text || titleText || industry || 'General Business';

    const keywordMatrix = await generateKeywordMatrix(seedKeyword);

    routeLogger.info({
      event: 'keyword_research_complete',
      seedKeyword,
      hasMatrix: !!keywordMatrix
    }, 'Live keyword opportunities successfully generated.');

    // 3. Assemble the Master Context for the AI Engine
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
      ====================================

      CRITICAL AGENT INSTRUCTIONS:
      1. Respond ONLY with a raw JSON object matching the exact schema below. No markdown.
      2. Categorize technical issues into: "Performance", "Accessibility", "Best Practices", or "SEO".
      3. Analyze the "headings" object. If H1-H6 tags skip levels (e.g., H1 jumps directly to H3), flag this as an On-Page SEO issue.
      4. Analyze the "social_graph". If OG tags or Twitter Cards are missing, flag them.
      5. Read the "RAW TEXT CONTENT" to calculate a Readability Score (0-100) and evaluate Tone Consistency.
      6. Use "word_count" to determine if Thin Content is detected (usually < 300 words).
      
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
          "grammar_issues_found": ["issue 1", "issue 2"],
          "tone_consistency": "Highly consistent, professional luxury tone.", 
          "missing_semantic_topics": ["topic1", "topic2"] 
        }
      }
    `;

    // 4. Execute the AI Engine
    routeLogger.info({ event: 'ai_engine_started', model: 'gemini-2.5-flash' }, 'Synthesizing data through AI Engine...');
    const response: any = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.15,
      },
    });

    let rawText = typeof response.text === 'function' ? response.text() : (response.text || '');
    rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();

    let auditData;
    try {
      auditData = JSON.parse(rawText);
      // 1. Inject the Keyword Matrix (Bucket 3)
      auditData.keyword_opportunities = keywordMatrix;

      // 2. Inject the Raw DOM & Meta Data (Bucket 1)
      auditData.raw_dom_data = scraperResult.metadata;

      // 3. Inject the Raw Google NLP Data 
      auditData.raw_nlp_entities = nlpEntities;

      // 4. Inject the Raw PageSpeed / Core Web Vitals Data
      auditData.raw_pagespeed_data = psiData;

      routeLogger.info({
        event: 'ai_engine_completed',
        seoScore: auditData.seo_health_score,
        geoScore: auditData.geo_visibility_score
      }, 'AI Engine successfully generated and parsed the JSON report.');
    } catch (parseError) {
      routeLogger.error({ event: 'ai_parse_failed', rawText }, 'Failed to parse AI JSON response.');
      throw new Error("AI Engine response failed structural JSON validation");
    }

    // 5. Persist to Strapi
    routeLogger.info({ event: 'strapi_save_started' }, 'Persisting audit to database...');

    if (!skipSave) {
      routeLogger.info({ event: 'strapi_save_started' }, 'Persisting audit to database...');
      const strapiRecord = await saveAuditToStrapi({
        target_url: url,
        industry,
        audit_data: auditData,
        audit_status: 'completed',
      });
      routeLogger.info({ event: 'audit_success', documentId: strapiRecord.id }, 'Audit completed and saved successfully.');
      return NextResponse.json({ success: true, documentId: strapiRecord.id, audit: auditData });
    }

    return NextResponse.json({ success: true, audit: auditData });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'audit_failed' }, `Master Orchestrator Error: ${error.message}`);
    return NextResponse.json({ error: error.message || 'Failed to process enterprise analysis' }, { status: 500 });
  }
});