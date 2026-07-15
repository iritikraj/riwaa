import { Queue, Worker } from 'bullmq';
import { runDomainSpider } from './spider';
import { GoogleGenAI } from '@google/genai';
import { saveAuditToStrapi } from './strapi';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Assuming Redis is running locally on the standard port
const connection = {
  host: '127.0.0.1',
  port: 6379
};

// 1. Create the Queue
export const spiderQueue = new Queue('domain-spider-queue', { connection });

// 2. Define the Worker (The Background Process)
export const spiderWorker = new Worker('domain-spider-queue', async job => {
  const { startUrl, industry, documentId } = job.data;
  console.log(`[Queue] Starting background spider for ${startUrl}`);

  try {
    // Step A: Run the Site-Wide Spider
    const spiderResults = await runDomainSpider(startUrl);

    // Step B: Ask Gemini to analyze the site map for Cannibalization & Duplicates
    const prompt = `
      You are an Enterprise SEO Architect.
      I have crawled the domain ${startUrl} and mapped the internal link graph.
      
      === SPIDER RESULTS ===
      ${JSON.stringify(spiderResults.slice(0, 150), null, 2)} // Capped at 150 to protect context window
      ======================
      
      Analyze this map and return a strictly formatted JSON object matching this schema:
      {
        "duplicate_titles": [{"title": "The exact duplicate title", "urls": ["url1", "url2"]}],
        "orphan_pages": ["url1", "url2"],
        "keyword_cannibalization": [
          {
            "topic": "The competing topic/keyword",
            "competing_urls": ["url1", "url2"],
            "recommendation": "How to consolidate or de-optimize"
          }
        ]
      }
      
      Rules:
      1. An Orphan Page is any URL with "inboundLinkCount": 0.
      2. Keyword Cannibalization happens when multiple pages target the exact same intent in their H1/Title.
    `;

    const response: any = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.1 },
    });

    let rawText = typeof response.text === 'function' ? response.text() : (response.text || '');
    rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const aiAnalysis = JSON.parse(rawText);

    // Step C: Update the Strapi Document with the Spider Analysis
    // (We will need to add an update function to your strapi.ts file later)
    console.log(`[Queue] AI Analysis complete for ${startUrl}. Found ${aiAnalysis.orphan_pages?.length || 0} orphans.`);

    return aiAnalysis;

  } catch (error) {
    console.error(`[Queue] Failed to process spider job for ${startUrl}:`, error);
    throw error;
  }
}, { connection });

// 3. Setup Worker Listeners for Observability
spiderWorker.on('completed', job => {
  console.log(`[Queue] Job ${job.id} completed successfully`);
});

spiderWorker.on('failed', (job, err) => {
  console.log(`[Queue] Job ${job?.id} failed with ${err.message}`);
});