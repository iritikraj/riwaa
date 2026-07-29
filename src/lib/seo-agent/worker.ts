// src/lib/seo-agent/worker.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { Worker } from 'bullmq';
import { redisOptions, spiderQueue } from './queue';
import { runDomainSpider } from './spider';
import { scrapeWithPuppeteer } from './scraper';
import { analyzeEntities } from './nlp';
import { GoogleGenAI } from '@google/genai';
import { runHeavyAiAudit } from './ai-audit';
import {
  updateAuditInStrapi,
  appendResultToStrapi,
  fetchPageSpeedData,
  updateCompetitorAuditInStrapi,
  updateComplianceAuditInStrapi
} from './strapi';

import * as mammoth from 'mammoth';
import { extractComplianceData, parseBriefWithGemini, runComparisonEngine } from './compliance/scrapper';
import { generateContentBrief } from './content-brief/generator';
import { extractBriefArchitecture, scrapeMultipleCompetitors } from './content-brief/scrapper';
import { fetchGcpKnowledgeGraphEntities } from './content-brief/gcp-entities';
import { logger as defaultLogger } from '@/lib/logs/logger';

const isDevelopment = process.env.NODE_ENV === 'development';

console.log("🤖 Background Workers Started and Listening for Jobs...");

/* 1. STANDARD AUDIT AI WORKER (Runs First) */
const createAiAuditWorker = () => new Worker('ai-audit-queue', async job => {
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
  connection: redisOptions as any,
  concurrency: 5
});

/* 2. DOMAIN SPIDER WORKER (Runs Second, triggered by AI Worker) */
const createSpiderWorker = () => new Worker('domain-spider-queue', async job => {
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
}, { connection: redisOptions as any });

/* COMPETITOR HELPER FUNCTIONS */
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

const createCompetitorWorker = () => new Worker('competitor-audit-queue', async job => {
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
  connection: redisOptions as any,
  concurrency: 2
});

const createComplianceWorker = () => new Worker('compliance-audit-queue', async job => {
  const { documentId, targetUrl, fileUrl, pageType } = job.data;
  console.log(`[Compliance Worker] Starting ${pageType} audit for Document ID: ${documentId} on ${targetUrl}`);

  try {
    // 1. Download Docx from Strapi Media Library (MICRO-UPDATE 1)
    await updateComplianceAuditInStrapi(documentId, 'downloading_brief');

    console.log(`[Compliance Worker] Downloading brief from ${fileUrl}...`);
    const fileRes = await fetch(fileUrl, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });

    if (!fileRes.ok) throw new Error('Failed to download document from Strapi');
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Extract Structured HTML using Mammoth
    console.log(`[Compliance Worker] Extracting structured HTML via Mammoth...`);
    const { value: rawText } = await mammoth.convertToHtml({ buffer });

    // 3. AI Structuring
    console.log(`[Compliance Worker] Mapping brief to JSON via Gemini...`);
    const expectedData = await parseBriefWithGemini(rawText);

    // 4. Scrape Live Target Page (MICRO-UPDATE 2)
    await updateComplianceAuditInStrapi(documentId, 'scraping_live_url');

    console.log(`[Compliance Worker] Extracting live DOM from ${targetUrl}...`);
    const actualData = await extractComplianceData(targetUrl);

    // 5. Run Comparison Engine (MICRO-UPDATE 3)
    await updateComplianceAuditInStrapi(documentId, 'running_ai_analysis');
    console.log(`[Compliance Worker] Running strict comparison engine...`);
    const { report, overall_score } = runComparisonEngine(expectedData, actualData, pageType);

    const finalReportPayload = {
      page_type: pageType,
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
  connection: redisOptions as any,
  concurrency: 3
});

/* 4. CONTENT BRIEF WORKER */
const createContentBriefWorker = () => new Worker('content-brief-queue', async job => {
  const { documentId, topic, pageTypeId, urlPattern, internalBlueprintUrl, referenceUrls } = job.data;

  // Create localized child logger for worker job execution
  const workerLogger = defaultLogger.child({
    module: 'content_brief_worker',
    jobId: job.id,
    documentId,
    topic
  });

  workerLogger.info({ event: 'content_brief_job_started' }, `Starting job for Topic: "${topic}"`);

  // Helper function to update micro-statuses in Strapi
  const updateStatus = async (status: string, data: any = null) => {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;
    const res = await fetch(`${strapiUrl}/api/content-briefs/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          audit_status: status,
          ...(data && { generated_data: data })
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      workerLogger.error({ event: 'strapi_update_failed', status, errText }, 'Failed to update Strapi status');
      throw new Error(`Strapi update failed: ${res.statusText}`);
    }
  };

  try {
    // Step 1: Fetch Page Type Rules from Strapi
    workerLogger.debug({ event: 'fetching_page_type_rules' });
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;
    const ruleRes = await fetch(`${strapiUrl}/api/page-type-rules/${pageTypeId}`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });

    if (!ruleRes.ok) throw new Error(`Failed to fetch Page Type Rules for ID ${pageTypeId}`);
    const ruleJson = await ruleRes.json();
    const pageTypeRules = ruleJson.data?.attributes ? { id: ruleJson.data.id, ...ruleJson.data.attributes } : ruleJson.data;

    // Step 2: Scrape User-Provided Competitor URLs & Internal Blueprint
    await updateStatus('scraping_competitors');
    workerLogger.info({ event: 'scraping_competitors_started', urlCount: referenceUrls?.length || 0 });
    const competitorData = await scrapeMultipleCompetitors(referenceUrls || []);

    let internalBlueprintData = null;
    if (pageTypeRules?.requires_internal_blueprint && internalBlueprintUrl) {
      workerLogger.info({ event: 'extracting_internal_blueprint', internalBlueprintUrl });
      internalBlueprintData = await extractBriefArchitecture(internalBlueprintUrl);
    }

    // Step 3: Fetch GCP Knowledge Graph Entities
    await updateStatus('extracting_entities');
    workerLogger.info({ event: 'fetching_gcp_entities_started' });
    const entityData = await fetchGcpKnowledgeGraphEntities(topic, workerLogger);

    // Step 4: Run 3-Step Gemini Synthesis Chain (Architect -> Strategist -> Writer)
    await updateStatus('generating_ai_brief');
    workerLogger.info({ event: 'gemini_synthesis_started' });
    const finalBriefJson = await generateContentBrief(
      topic,
      urlPattern,
      pageTypeRules,
      entityData,            // Passes Knowledge Graph LSI entities to Gemini
      competitorData,        // Passes scraped competitor heading trees
      internalBlueprintData, // Passes client blueprint (if present)
      workerLogger
    );

    // Step 5: Save Final Brief & Mark Completed
    workerLogger.info({ event: 'saving_brief_to_strapi' });
    await updateStatus('completed', finalBriefJson);

    workerLogger.info({ event: 'content_brief_job_completed' }, `Job ${job.id} fully completed.`);
    return { documentId };

  } catch (error: any) {
    workerLogger.error({
      err: error,
      event: 'content_brief_job_failed'
    }, `Failed job for document ${documentId}: ${error.message}`);

    await updateStatus('failed');
    throw error;
  }
}, {
  connection: redisOptions as any,
  concurrency: 2
});

/* 2. SINGLETON CACHE (This permanently fixes the stalling/zombie issue) */

const globalForWorkers = globalThis as unknown as {
  aiAuditWorker: Worker;
  spiderWorker: Worker;
  competitorWorker: Worker;
  complianceWorker: Worker;
  contentBriefWorker: Worker;
};

export const aiAuditWorker = globalForWorkers.aiAuditWorker || createAiAuditWorker();
export const spiderWorker = globalForWorkers.spiderWorker || createSpiderWorker();
export const competitorWorker = globalForWorkers.competitorWorker || createCompetitorWorker();
export const complianceWorker = globalForWorkers.complianceWorker || createComplianceWorker();
export const contentBriefWorker = globalForWorkers.contentBriefWorker || createContentBriefWorker();

if (process.env.NODE_ENV !== 'production') {
  globalForWorkers.aiAuditWorker = aiAuditWorker;
  globalForWorkers.spiderWorker = spiderWorker;
  globalForWorkers.competitorWorker = competitorWorker;
  globalForWorkers.complianceWorker = complianceWorker;
  globalForWorkers.contentBriefWorker = contentBriefWorker;
}

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

contentBriefWorker.on('completed', job => console.log(`[Brief Queue] Job ${job.id} completed successfully`));
contentBriefWorker.on('failed', (job, err) => {
  if (isDevelopment && err.message.includes('ECONNREFUSED')) return;
  console.log(`[Brief Queue] Job ${job?.id} failed with ${err.message}`);
});