/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { Worker } from 'bullmq';
import { redisConnection, spiderQueue } from './queue';
import { runDomainSpider } from './spider';
import { scrapeWithPuppeteer } from './scraper';
import { analyzeEntities } from './nlp';
import { GoogleGenAI } from '@google/genai';
import { runHeavyAiAudit } from './ai-audit';
import {
  updateAuditInStrapi,
  appendResultToStrapi,
  fetchPageSpeedData,
  updateCompetitorAuditInStrapi
} from './strapi';

import * as mammoth from 'mammoth';
import { updateComplianceAuditInStrapi } from './strapi';
import { extractComplianceData, parseBriefWithGemini, runComparisonEngine } from './compliance/compliance-scrapper';

const isDevelopment = process.env.NODE_ENV === 'development';

console.log("🤖 Background Workers Started and Listening for Jobs...");

/* 1. STANDARD AUDIT AI WORKER (Runs First) */
export const aiAuditWorker = new Worker('ai-audit-queue', async job => {
  const { url, documentId, industry } = job.data;
  console.log(`[AI Worker] Analyzing ${url}...`);

  try {
    const auditData = await runHeavyAiAudit(url, industry);
    await appendResultToStrapi(documentId, url, auditData, null);
    console.log(`[AI Worker] Successfully audited and saved ${url}`);

    // THE DAISY CHAIN: Now that AI is done, silently trigger the spider
    console.log(`[AI Worker] Triggering Domain Spider in the background...`);
    await spiderQueue.add('crawl-domain', {
      startUrl: url,
      industry,
      documentId
    });

  } catch (error: any) {
    console.error(`[AI Worker] Failed to audit ${url}:`, error.message);
    await appendResultToStrapi(documentId, url, null, error.message || "AI Processing Failed");

    // Even if AI fails, map the domain architecture
    await spiderQueue.add('crawl-domain', {
      startUrl: url,
      industry,
      documentId
    });
  }
}, {
  connection: redisConnection as any,
  concurrency: 5
});

/* 2. DOMAIN SPIDER WORKER (Runs Second, triggered by AI Worker) */
export const spiderWorker = new Worker('domain-spider-queue', async job => {
  const { startUrl, documentId } = job.data;
  console.log(`[Spider Worker] Starting background crawl for ${startUrl}`);

  try {
    const spiderResults = await runDomainSpider(startUrl);
    console.log(`[Spider Worker] Running deterministic cross-reference on ${spiderResults.length} pages...`);

    const titleTracker: Record<string, string[]> = {};
    const descTracker: Record<string, string[]> = {};
    const orphan_pages: string[] = [];
    const cleanStartUrl = startUrl.replace(/\/$/, "");

    spiderResults.forEach((page: any) => {
      const cleanUrl = page.url.replace(/\/$/, "");
      if (page.title) {
        if (!titleTracker[page.title]) titleTracker[page.title] = [];
        titleTracker[page.title].push(page.url);
      }
      if (page.description) {
        if (!descTracker[page.description]) descTracker[page.description] = [];
        descTracker[page.description].push(page.url);
      }
      const links = page.inboundLinks ?? page.inboundLinkCount ?? 0;
      if (cleanUrl !== cleanStartUrl && links === 0) {
        orphan_pages.push(page.url);
      }
    });

    const duplicate_titles = Object.entries(titleTracker)
      .filter(([_, urls]) => urls.length > 1)
      .map(([title, urls]) => ({ title, urls }));

    const duplicate_descriptions = Object.entries(descTracker)
      .filter(([_, urls]) => urls.length > 1)
      .map(([description, urls]) => ({ description, urls }));

    const backgroundPayload = {
      raw_spider_data: spiderResults,
      domain_architecture: { duplicate_titles, duplicate_descriptions, orphan_pages }
    };

    console.log(`[Spider Worker] Saving Raw Spider Map to Document ${documentId}...`);
    await updateAuditInStrapi(documentId, backgroundPayload);
    console.log(`[Spider Worker] Successfully updated Strapi. Found ${orphan_pages.length} orphans.`);

    return backgroundPayload;
  } catch (error) {
    console.error(`[Spider Worker] Failed to process spider job for ${startUrl}:`, error);
    throw error;
  }
}, { connection: redisConnection as any });


/* 3. COMPETITOR ANALYSIS WORKER (New Module) */
async function extractPageMetrics(url: string) {
  console.log(`[Competitor Worker] Fetching raw DOM and PageSpeed for: ${url}`);
  const [scraperResult, psiData] = await Promise.all([
    scrapeWithPuppeteer(url),
    fetchPageSpeedData(url)
  ]);

  if (!scraperResult) throw new Error(`Failed to scrape ${url}`);
  const nlpEntities = await analyzeEntities(scraperResult.rawText);

  return {
    url,
    metadata: scraperResult.metadata,
    page_speed: psiData,
    nlp_entities: nlpEntities,
    raw_text_snippet: scraperResult.rawText ? scraperResult.rawText.substring(0, 2000) : ''
  };
}

async function runGeminiCompetitorComparison(targetData: any, competitorData: any[], industry: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    Perform an enterprise side-by-side SEO comparison between the Target URL and the Competitor URL(s).
    Target Industry Context: ${industry || 'General Business'}.

    === TARGET PAGE RAW DATA ===
    ${JSON.stringify(targetData, null, 2)}

    === COMPETITOR PAGE(S) RAW DATA ===
    ${JSON.stringify(competitorData, null, 2)}

    INSTRUCTIONS:
    1. Respond ONLY with a raw JSON object matching the exact schema below. No markdown fences.
    2. Score each category out of 10 for both Target and Competitor based on strict technical standards.
    3. Provide a clear, actionable "ai_opinion" detailing WHY the target scored less (or higher) than the competitor and exact steps to beat them.

    EXPECTED JSON SCHEMA:
    {
      "overall_winner": "target" | "competitor",
      "categories": {
        "page_speed": {
          "target_score": 7,
          "competitor_score": 9,
          "ai_opinion": {
            "deficit_reason": "Explanation of speed bottlenecks...",
            "actionable_fix": "Fix steps..."
          }
        },
        "meta_and_title": {
          "target_score": 5,
          "competitor_score": 8,
          "ai_opinion": {
            "deficit_reason": "Reason...",
            "actionable_fix": "Fix steps..."
          }
        },
        "heading_structure": {
          "target_score": 4,
          "competitor_score": 9,
          "ai_opinion": {
            "deficit_reason": "Reason...",
            "actionable_fix": "Fix steps..."
          }
        },
        "content_entities": {
          "target_score": 6,
          "competitor_score": 9,
          "ai_opinion": {
            "deficit_reason": "Reason...",
            "actionable_fix": "Fix steps..."
          }
        },
        "schema_and_meta": {
          "target_score": 3,
          "competitor_score": 8,
          "ai_opinion": {
            "deficit_reason": "Reason...",
            "actionable_fix": "Fix steps..."
          }
        },
        "link_architecture": {
          "target_score": 7,
          "competitor_score": 7,
          "ai_opinion": {
            "deficit_reason": "Reason...",
            "actionable_fix": "Fix steps..."
          }
        }
      }
    }
  `;

  const response: any = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { temperature: 0.2 },
  });

  let rawText = typeof response.text === 'function' ? response.text() : (response.text || '');
  rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();

  return JSON.parse(rawText);
}

export const competitorWorker = new Worker('competitor-audit-queue', async job => {
  const { targetUrl, competitorUrls, documentId, industry } = job.data;
  console.log(`[Competitor Worker] Initiating comparison for ${targetUrl} vs [${competitorUrls.join(', ')}]`);

  try {
    const [targetMetrics, ...competitorMetrics] = await Promise.all([
      extractPageMetrics(targetUrl),
      ...competitorUrls.map((url: string) => extractPageMetrics(url))
    ]);

    console.log(`[Competitor Worker] Running Gemini comparison analysis...`);
    const aiAnalysis = await runGeminiCompetitorComparison(targetMetrics, competitorMetrics, industry);

    const finalPayload = {
      raw_extraction: { target: targetMetrics, competitors: competitorMetrics },
      analysis: aiAnalysis
    };

    await updateCompetitorAuditInStrapi(documentId, finalPayload, 'completed');
    console.log(`[Competitor Worker] Successfully completed and saved comparison for ${documentId}`);

  } catch (error: any) {
    console.error(`[Competitor Worker] Job failed for document ${documentId}:`, error);
    await updateCompetitorAuditInStrapi(documentId, { error: error.message || 'Competitor Analysis Failed' }, 'failed');
  }
}, {
  connection: redisConnection as any,
  concurrency: 2
});

/* CONTENT COMPLIANCE WORKER */
export const complianceWorker = new Worker('compliance-audit-queue', async job => {
  const { documentId, targetUrl, fileUrl } = job.data;
  console.log(`[Compliance Worker] Starting audit for Document ID: ${documentId} on ${targetUrl}`);

  try {
    // 1. Download Docx from Strapi Media Library
    console.log(`[Compliance Worker] Downloading brief from ${fileUrl}...`);
    const fileRes = await fetch(fileUrl, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });

    if (!fileRes.ok) throw new Error('Failed to download document from Strapi');
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Extract Raw Text using Mammoth
    console.log(`[Compliance Worker] Extracting raw text via Mammoth...`);
    const { value: rawText } = await mammoth.extractRawText({ buffer });

    // 3. AI Structuring
    console.log(`[Compliance Worker] Mapping brief to JSON via Gemini...`);
    const expectedData = await parseBriefWithGemini(rawText);

    // 4. Scrape Live Target Page
    console.log(`[Compliance Worker] Extracting live DOM from ${targetUrl}...`);
    const actualData = await extractComplianceData(targetUrl);

    // 5. Run Comparison Engine
    console.log(`[Compliance Worker] Running strict comparison engine...`);
    const { report, overall_score } = runComparisonEngine(expectedData, actualData);

    const finalReportPayload = {
      raw_expected: expectedData,     // The pure JSON mapped from the Docx
      raw_actual: actualData,         // The pure JSON scraped from the live URL
      comparison_results: report      // The Pass/Warning/Fail analysis
    };

    // 6. Save back to Strapi
    console.log(`[Compliance Worker] Saving final payload to Strapi with score ${overall_score}%...`);
    await updateComplianceAuditInStrapi(documentId, 'completed', overall_score, finalReportPayload);

    console.log(`[Compliance Worker] Job ${job.id} fully completed.`);
    return { documentId, overall_score };

  } catch (error: any) {
    console.error(`[Compliance Worker] Failed job for document ${documentId}:`, error);
    await updateComplianceAuditInStrapi(documentId, 'failed');
    throw error;
  }
}, {
  connection: redisConnection as any,
  concurrency: 3
});

/* 4. OBSERVABILITY LISTENERS */
aiAuditWorker.on('completed', job => console.log(`[AI Queue] Job ${job.id} completed successfully`));
aiAuditWorker.on('failed', (job, err) => {
  if (isDevelopment && err.message.includes('ECONNREFUSED')) return;
  console.log(`[AI Queue] Job ${job?.id} failed with ${err.message}`);
});

spiderWorker.on('completed', job => console.log(`[Spider Queue] Job ${job.id} completed successfully`));
spiderWorker.on('failed', (job, err) => {
  if (isDevelopment && err.message.includes('ECONNREFUSED')) return;
  console.log(`[Spider Queue] Job ${job?.id} failed with ${err.message}`);
});

competitorWorker.on('completed', job => console.log(`[Competitor Queue] Job ${job.id} completed successfully`));
competitorWorker.on('failed', (job, err) => {
  if (isDevelopment && err.message.includes('ECONNREFUSED')) return;
  console.log(`[Competitor Queue] Job ${job?.id} failed with ${err.message}`);
});

complianceWorker.on('completed', job => console.log(`[Compliance Queue] Job ${job.id} completed successfully`));
complianceWorker.on('failed', (job, err) => {
  if (isDevelopment && err.message.includes('ECONNREFUSED')) return;
  console.log(`[Compliance Queue] Job ${job?.id} failed with ${err.message}`);
});