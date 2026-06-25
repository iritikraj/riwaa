/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { streamObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { withLogger } from '@/lib/logs/withLogger';

puppeteer.use(StealthPlugin());

// Define our fallback cascade (Ordered by preference)
const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
];

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 1. Zod Schema
const agentZodSchema = z.object({
  theme: z.string().optional().describe("Either 'theme1' or 'theme2'. Defaults to 'theme1'"),
  companyLogo: z.string().describe("The exact company logo URL provided in the context").optional(),
  hero: z.object({
    name: z.string().describe("Agent's full name"),
    title: z.string().describe("e.g., Senior Director · Ultra-Luxury"),
    bio: z.string().describe("2-3 sentences of elite, high-trust profiling."),
    location: z.string().describe("e.g., Dubai, UAE"),
    languages: z.array(z.string()),
    badges: z.array(z.string()).describe("e.g., ['RERA Certified', 'Forbes Listed']"),
    imageUrl: z.string().describe("The exact profile image URL provided in the context").optional(),
  }),
  metrics: z.object({
    totalVolume: z.string().describe("e.g., $2.1B"),
    dealsClosed: z.string().describe("e.g., 847"),
    yearsActive: z.string().describe("e.g., 18+"),
    highestDeal: z.string().describe("e.g., $68M"),
    averageDeal: z.string().describe("e.g., $2.4M"),
    repeatClients: z.string().describe("Percentage, e.g., 87%"),
  }),
  timeline: z.array(
    z.object({
      year: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
  expertise: z.object({
    areas: z.array(z.string()).describe("Top 3 neighborhoods"),
    propertyTypes: z.array(z.string()).describe("e.g., ['Sky Penthouses', 'Villas']"),
    marketQuote: z.string().describe("An insightful, generated quote about the current luxury market."),
  }),
  partnerships: z.array(z.string()).describe("List of official developer partnerships, e.g., 'Emaar Properties', 'OMNIYAT'").optional(),
  mediaPresence: z.array(
    z.object({
      headline: z.string(),
      publication: z.string(),
      year: z.string(),
    })
  ).describe("Media features, PR, or public appearances").optional(),
  testimonials: z.array(
    z.object({
      quote: z.string(),
      clientName: z.string(),
      clientTitle: z.string().describe("e.g., 'Private Family Office', 'HNWI Investor'"),
    })
  ).describe("High-end client testimonials WITHOUT ratings/stars").optional(),
  contact: z.object({
    whatsapp: z.string().describe("The exact phone number found in the bio text. Leave empty if none."),
    developer: z.string().describe("The exact Brokerage or Company Name provided. Default to 'independent'"),
  })
});

// 2. The Custom Broker Scraper (Now accepts routeLogger)
async function fetchBrokerData(url: string, routeLogger: any) {
  routeLogger.info({ event: 'puppeteer_launching', url }, `Spinning up invisible browser for: ${url}`);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const data = await page.evaluate(() => {
      const clean = (value?: string | null) => (value || "").replace(/\s+/g, " ").trim();
      const getText = (selector: string) => clean(document.querySelector(selector)?.textContent);
      const getAttr = (selector: string, attr: string) => clean(document.querySelector(selector)?.getAttribute(attr));

      const brokerName = getText("h1");
      const profileImage = getAttr('[data-testid="agent-image"] img', "src") || getAttr('[data-testid="agent-image"] img', "data-src");
      const companyLogo = getAttr('[data-testid="agent-broker-image"]', "src");
      const companyName = getAttr('[data-testid="agent-broker-image"]', "title") || getAttr('[data-testid="agent-broker-image"]', "alt");
      const rating = getText('[data-testid="average-rating"]');
      const hasWhatsapp = !!document.querySelector('[data-testid="whatsapp-btn"]');

      const summaryCards = Array.from(document.querySelectorAll('[data-testid="summary"] > div'));
      const summaryStats = summaryCards.map((card) => {
        const valueText = card.children[0]?.textContent;
        const titleText = card.children[1]?.textContent;

        return {
          value: clean(valueText),
          title: clean(titleText)
        };
      });

      const telLink = document.querySelector('a[href^="tel:"]')?.getAttribute("href");
      const phoneNumber = clean(telLink?.replace("tel:", ""));

      const fullText = clean(document.body.innerText).substring(0, 8000);

      return { brokerName, profileImage, companyName, companyLogo, rating, hasWhatsapp, phoneNumber, summaryStats, fullText };
    });

    routeLogger.info({ event: 'puppeteer_scrape_success', url, brokerName: data.brokerName });
    return data;
  } catch (error: any) {
    routeLogger.error({ err: error, url, event: 'puppeteer_scrape_failed' }, `Puppeteer failed to scrape ${url}: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 3. The API Route Wrapped with Logger
export const POST = withLogger('/api/real-estate-agents/generate', async (req: NextRequest, routeLogger) => {
  try {
    const { sourceText, links } = await req.json();

    routeLogger.info({
      event: 'agent_generation_started',
      linksCount: links?.length || 0,
      hasSourceText: !!sourceText
    });

    // 4. Collect Structured Data
    const scrapedResults = [];
    if (links && links.length > 0) {
      for (const url of links) {
        const data = await fetchBrokerData(url, routeLogger);
        if (data) scrapedResults.push(data);
      }
    }

    if (!sourceText && scrapedResults.length === 0) {
      routeLogger.warn({ event: 'agent_generation_aborted', reason: 'No valid data extracted' });
      return NextResponse.json({ error: "Could not extract data." }, { status: 400 });
    }

    routeLogger.info({ event: 'scraping_complete', successfulScrapes: scrapedResults.length }, "Preparing context for Gemini...");

    const mappedScrapedData = scrapedResults.map(data => `
      BROKER NAME: ${data.brokerName}
      COMPANY/BROKERAGE: ${data.companyName}
      PROFILE IMAGE URL: ${data.profileImage}
      COMPANY LOGO URL: ${data.companyLogo}
      SUMMARY STATS: ${JSON.stringify(data.summaryStats)}
      HIDDEN PHONE/WHATSAPP: ${data.phoneNumber || "Not found in metadata"}
      FULL PAGE TEXT: ${data.fullText}
    `).join("\n\n--- NEXT PROFILE SOURCE ---\n\n");

    const finalContext = `
      RAW BIO TEXT (User Provided): ${sourceText || "None provided."}
      
      SCRAPED EXTERNAL PROFILES: 
      ${mappedScrapedData}
    `;

    // 4. MULTI-MODEL FALLBACK LOOP
    let result;
    let lastError;

    for (const modelName of FALLBACK_MODELS) {
      try {
        routeLogger.info({ event: 'ai_stream_attempt', model: modelName });

        result = await streamObject({
          model: google(modelName),
          system: `You are the Chief Communications Officer for an ultra-luxury real estate advisory firm. 
        Your sole responsibility is to ingest raw scraped data and synthesize it into an institutional-grade digital portfolio.

        --- ZONE 1: THE STRICT FACT LOCK (CRITICAL FOR DATA INTEGRITY) ---
        You are provided with real, verified metrics under the 'SCRAPED EXTERNAL PROFILES' context. You MUST preserve these exact values. Altering them is a severe failure.
        - totalVolume: Use the exact string or number extracted (e.g., if the raw text says "0.9 Billion AED", output exactly "AED 0.9 Billion"). Never change, round up, or modify this factual number.
        - dealsClosed: Use the exact integer extracted (e.g., if it says "65 Closed Deals", output exactly "65").
        - yearsActive: Map directly to the stated experience metrics (e.g., "17+").
        - PROFILE IMAGE URL and COMPANY LOGO URL: Copy these strings character-for-character into hero.imageUrl and companyLogo. Do not modify the URLs.
        - developer: Use the exact 'COMPANY/BROKERAGE' string provided in the text.

        --- ZONE 2: THE PREMIUM PLACEHOLDER PROTOCOL (FOR MISSING DATA ONLY) ---
        If an array or field is entirely missing, blank, or null in the raw scraped data, you MUST generate highly realistic, elite placeholder data to ensure the editorial design layout remains completely filled out and visually beautiful:
        - If 'highestDeal' or 'averageDeal' are missing from the raw stats, calculate or simulate realistic luxury figures that mathematically align with their true volume (e.g., "AED 25.0M").
        - If 'repeatClients' is missing, generate a prestigious premium retention percentage (e.g., "84%", "89%") to complete the metric layout grid.
        - If 'timeline' is empty or has fewer than 3 entries, invent a realistic, elegant 3-step career progression narrative anchored around their real start year (e.g., 2009 market entry, 2016 expansion, 2024 directorship).
        - If 'mediaPresence' or 'testimonials' are missing, DO NOT return empty arrays. You MUST generate 2 to 3 prestigious placeholder rows featuring premium local publications (e.g., 'Gulf Business') and elite institutional client titles (e.g., 'Private Family Office Trustee') so the user has an immediate template to edit.

        --- STYLE & TONE DIRECTIVES ---
        - Tone: High-net-worth authority, institutional, "Old Money" precision, written cleanly in the third person. Avoid cheesy sales words.
        - hero.bio: Exactly 2-3 sentences summarizing their market position and advisory presence using their real tenure numbers.
        - expertise.marketQuote: Generate a brilliant, Wall Street Journal-level quote reflecting capital growth, structural architecture, and wealth preservation strategies in their specific target city/location (e.g., focus on Abu Dhabi if location is Abu Dhabi, or Dubai if location is Dubai).
      `,
          prompt: `Extract and build a profile based on this combined data: \n${finalContext}`,
          schema: agentZodSchema,
          onFinish: () => {
            routeLogger.info({ event: 'ai_stream_completed', model: modelName });
          }
        });

        // If no error is thrown during initialization, the connection succeeded!
        routeLogger.info({ event: 'ai_stream_connected', model: modelName });
        break; // Exit the loop because we found a working model

      } catch (error: any) {
        routeLogger.warn({
          event: 'ai_stream_model_failed',
          model: modelName,
          error: error.message
        }, `Model ${modelName} failed. Trying next model...`);
        lastError = error;
      }
    }

    // If ALL models failed, we throw the last error back to the frontend
    if (!result) {
      routeLogger.error({ event: 'ai_stream_all_models_failed', error: lastError?.message });
      throw lastError || new Error("All AI models are currently overloaded. Please try again in a few moments.");
    }

    return result.toTextStreamResponse() as unknown as NextResponse;
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'agent_generation_failed' }, "Agent Generation Error");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});