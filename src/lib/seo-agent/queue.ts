/* eslint-disable @typescript-eslint/no-explicit-any */
import { Queue, Worker } from 'bullmq';
import { runDomainSpider } from './spider';
import IORedis from 'ioredis';
import { updateAuditInStrapi } from './strapi';

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

// 2. Create the Queue
export const spiderQueue = new Queue('domain-spider-queue', { connection: redisConnection as any });

// 3. Define the Worker
export const spiderWorker = new Worker('domain-spider-queue', async job => {
  const { startUrl, documentId } = job.data;
  console.log(`[Queue] Starting background spider for ${startUrl}`);

  try {
    // Step A: Run the Site-Wide Spider
    const spiderResults = await runDomainSpider(startUrl);

    // Step B: DETERMINISTIC CROSS-REFERENCE ENGINE (No AI Used Here)
    console.log(`[Queue] Running deterministic cross-reference on ${spiderResults.length} pages...`);

    const titleTracker: Record<string, string[]> = {};
    const descTracker: Record<string, string[]> = {};
    const orphan_pages: string[] = [];
    const cleanStartUrl = startUrl.replace(/\/$/, "");

    spiderResults.forEach((page: any) => {
      const cleanUrl = page.url.replace(/\/$/, "");

      // 1. Map Titles
      if (page.title) {
        if (!titleTracker[page.title]) titleTracker[page.title] = [];
        titleTracker[page.title].push(page.url);
      }

      // 2. Map Descriptions 
      if (page.description) {
        if (!descTracker[page.description]) descTracker[page.description] = [];
        descTracker[page.description].push(page.url);
      }

      // 3. Detect Orphans (Assuming spider returns inboundLinks or inboundLinkCount)
      const links = page.inboundLinks ?? page.inboundLinkCount ?? 0;
      if (cleanUrl !== cleanStartUrl && links === 0) {
        orphan_pages.push(page.url);
      }
    });

    // Filter down to ONLY the duplicates
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

    // Step C: Bundle the Raw Data + Calculated Data and Save to Strapi
    const backgroundPayload = {
      raw_spider_data: spiderResults, // The raw proof
      domain_architecture: domain_architecture // The mathematical result
    };

    console.log(`[Queue] Saving Raw Spider Map & Architecture to Document ${documentId}...`);
    await updateAuditInStrapi(documentId, backgroundPayload);

    console.log(`[Queue] Successfully updated Strapi. Found ${orphan_pages.length} orphans.`);
    return backgroundPayload;

  } catch (error) {
    console.error(`[Queue] Failed to process spider job for ${startUrl}:`, error);
    throw error;
  }
}, { connection: redisConnection as any });

// 4. Observability Listeners
spiderWorker.on('completed', job => {
  console.log(`[Queue] Job ${job.id} completed successfully`);
});

spiderWorker.on('failed', (job, err) => {
  if (isDevelopment && err.message.includes('ECONNREFUSED')) return;
  console.log(`[Queue] Job ${job?.id} failed with ${err.message}`);
});