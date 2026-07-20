/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { Queue, Worker } from 'bullmq';
import { runDomainSpider } from './spider';
import IORedis from 'ioredis';
import { updateAuditInStrapi } from './strapi';
import { runHeavyAiAudit } from './ai-audit';
import { appendResultToStrapi } from './strapi';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;
const isDevelopment = process.env.NODE_ENV === 'development';

// 1. Safe Redis Configuration
const redisOptions = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    if (isDevelopment && times > 1) {
      console.warn('⚠️ Local Redis server not found. Queue worker resting in standby mode.');
      return null;
    }
    return Math.min(times * 100, 3000);
  }
};

export const redisConnection = new IORedis(redisOptions);

redisConnection.on('error', (err: any) => {
  if (isDevelopment && err.code === 'ECONNREFUSED') return;
  console.error('Redis Connection Error:', err);
});

// 2. Create the Queues
export const spiderQueue = new Queue('domain-spider-queue', { connection: redisConnection as any });
export const aiAuditQueue = new Queue('ai-audit-queue', { connection: redisConnection as any }); // NEW: AI Fan-Out Queue

// 3. Define the Spider Worker
export const spiderWorker = new Worker('domain-spider-queue', async job => {
  // Grab industry from job.data so we can pass it to the AI workers
  const { startUrl, documentId, industry } = job.data;
  console.log(`[Queue] Starting background spider for ${startUrl}`);

  try {
    // Step A: Run the Site-Wide Spider
    const spiderResults = await runDomainSpider(startUrl);

    // Step B: DETERMINISTIC CROSS-REFERENCE ENGINE
    console.log(`[Queue] Running deterministic cross-reference on ${spiderResults.length} pages...`);

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

    const domain_architecture = {
      duplicate_titles,
      duplicate_descriptions,
      orphan_pages
    };

    // Step C: Save Raw Spider Data to Strapi
    const backgroundPayload = {
      raw_spider_data: spiderResults,
      domain_architecture: domain_architecture
    };

    console.log(`[Queue] Saving Raw Spider Map to Document ${documentId}...`);
    await updateAuditInStrapi(documentId, backgroundPayload);
    console.log(`[Queue] Successfully updated Strapi. Found ${orphan_pages.length} orphans.`);

    // Step D: THE FAN-OUT (Trigger AI Workers)
    console.log(`[Queue] Fanning out ${spiderResults.length} pages to AI Audit Queue...`);

    // const aiJobs = spiderResults.map((page: any) => ({
    //   name: 'audit-page',
    //   data: {
    //     url: page.url,
    //     documentId,
    //     industry: industry || 'General Business'
    //   }
    // }));

    // Find the exact root URL object from the spider map
    const rootPage = spiderResults.find((page: any) => page.url.replace(/\/$/, "") === cleanStartUrl);
    const targetUrl = rootPage ? rootPage.url : startUrl;

    const aiJobs = [{
      name: 'audit-page',
      data: {
        url: targetUrl,
        documentId,
        industry: industry || 'General Business'
      }
    }];

    // Instantly dump all URLs into the new queue
    await aiAuditQueue.addBulk(aiJobs);
    console.log(`[Queue] Successfully pushed ${aiJobs.length} jobs to AI Audit Queue.`);

    return backgroundPayload;

  } catch (error) {
    console.error(`[Queue] Failed to process spider job for ${startUrl}:`, error);
    throw error;
  }
}, { connection: redisConnection as any });


// 4. Define the AI Audit Worker
export const aiAuditWorker = new Worker('ai-audit-queue', async job => {
  const { url, documentId, industry } = job.data;
  console.log(`[AI Worker] Analyzing ${url}...`);

  try {
    // 1. Run the heavy AI Logic safely in the background
    const auditData = await runHeavyAiAudit(url, industry);

    // 2. Append the success result to the Strapi document
    await appendResultToStrapi(documentId, url, auditData, null);

    console.log(`[AI Worker] Successfully audited and saved ${url}`);
  } catch (error: any) {
    console.error(`[AI Worker] Failed to audit ${url}:`, error.message);

    // 3. If it fails, append the error to Strapi so the UI can show a "Failed" badge for this URL
    await appendResultToStrapi(documentId, url, null, error.message || "AI Processing Failed");
  }
}, {
  connection: redisConnection as any,
  concurrency: 5
});


// 5. Observability Listeners
spiderWorker.on('completed', job => console.log(`[Spider Queue] Job ${job.id} completed successfully`));
spiderWorker.on('failed', (job, err) => {
  if (isDevelopment && err.message.includes('ECONNREFUSED')) return;
  console.log(`[Spider Queue] Job ${job?.id} failed with ${err.message}`);
});

aiAuditWorker.on('completed', job => console.log(`[AI Queue] Job ${job.id} completed successfully`));
aiAuditWorker.on('failed', (job, err) => {
  if (isDevelopment && err.message.includes('ECONNREFUSED')) return;
  console.log(`[AI Queue] Job ${job?.id} failed with ${err.message}`);
});