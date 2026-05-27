export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { streamObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// 1. Zod Schema (Updated to include images and contact)
const agentZodSchema = z.object({
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

// 2. The Custom Broker Scraper
async function fetchBrokerData(url: string) {
  console.log(`Spinning up invisible browser for: ${url}`);
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
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
        const spans = Array.from(card.querySelectorAll("span"));
        return { value: clean(spans?.[0]?.textContent), title: clean(spans?.[1]?.textContent) };
      });

      const telLink = document.querySelector('a[href^="tel:"]')?.getAttribute("href");
      const phoneNumber = clean(telLink?.replace("tel:", ""));

      const fullText = clean(document.body.innerText).substring(0, 8000);

      return { brokerName, profileImage, companyName, companyLogo, rating, hasWhatsapp, phoneNumber, summaryStats, fullText };
    });

    return data;
  } catch (error: any) {
    console.error(`Puppeteer failed to scrape ${url}:`, error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function POST(req: Request) {
  try {
    const { sourceText, links } = await req.json();

    // 3. Collect Structured Data
    const scrapedResults = [];
    if (links && links.length > 0) {
      for (const url of links) {
        const data = await fetchBrokerData(url);
        if (data) scrapedResults.push(data);
      }
    }

    if (!sourceText && scrapedResults.length === 0) {
      return NextResponse.json({ error: "Could not extract data." }, { status: 400 });
    }

    console.log("Scraping complete. Preparing context for Gemini...");

    console.log(scrapedResults);

    console.log('---------------------------------------------------------------------------');

    // 4. Construct Highly Structured Context for Gemini
    const mappedScrapedData = scrapedResults.map(data => `
      BROKER NAME: ${data.brokerName}
      COMPANY/BROKERAGE: ${data.companyName}
      PROFILE IMAGE URL: ${data.profileImage}
      COMPANY LOGO URL: ${data.companyLogo}
      SUMMARY STATS: ${JSON.stringify(data.summaryStats)}
      HIDDEN PHONE/WHATSAPP: ${data.phoneNumber || "Not found in metadata"}
      FULL PAGE TEXT: ${data.fullText}
    `).join("\n\n--- NEXT PROFILE SOURCE ---\n\n");

    console.log(mappedScrapedData);

    const finalContext = `
      RAW BIO TEXT (User Provided): ${sourceText || "None provided."}
      
      SCRAPED EXTERNAL PROFILES: 
      ${mappedScrapedData}
    `;
    // 5. Stream Generation
    const result = await streamObject({
      model: google('gemini-flash-latest'),
      system: `You are the Chief Communications Officer for a sovereign wealth fund and ultra-luxury real estate advisory firm based in Dubai. 
        Your sole responsibility is to ingest raw, unformatted, or incomplete data about a real estate agent and synthesize it into a highly polished, institutional-grade digital portfolio.

        --- 0. GROUND TRUTH DIRECTIVE (CRITICAL) ---
        You will be provided with raw text, scraped external profiles, and structured metadata. 
        - You MUST map the provided 'PROFILE IMAGE URL' directly to \`hero.imageUrl\`.
        - You MUST map the provided 'COMPANY LOGO URL' directly to \`companyLogo\`.
        - You MUST use the exact 'COMPANY/BROKERAGE' name for \`contact.developer\`.
        - If a fact exists (e.g., exact sales volumes, years of experience, languages, neighborhoods, actual name, phone numbers), you MUST extract and use the real data. 
        - You must prioritize numerical data found in the 'Track Record' or 'Properties' sections. If a total volume is mentioned in the text use that exact figure. Do not invent a different volume if the source provides one.

        --- 1. TONE & PERSONA ---
        - Tone: "Old Money," high-trust, institutional, discreet, and fiercely competent. 
        - Avoid: "Salesy" language, exclamation points, emojis, or terms like "hustle," "grind," "number one," or "best."
        - Vocabulary: Use terms like "advisory," "portfolio management," "wealth preservation," "discretion," "mandate," "institutional," and "generational wealth."
        - Perspective: Write in the third person (e.g., "Khalid manages...", not "I manage...").

        --- 2. HANDLING MISSING DATA (THE 'PLACEHOLDER' PROTOCOL) ---
        The user may provide sparse information. ONLY if specific metrics or timeline events are entirely missing from the input text, you must confidently extrapolate realistic placeholders that the user can edit later.
        - If 'totalVolume' is missing, default to a realistic ultra-luxury figure (e.g., "$1.2B+", "$850M+").
        - If 'dealsClosed' is missing, default to (e.g., "300+", "145").
        - If 'highestDeal' is missing, default to (e.g., "$45M", "$82M").
        - If 'timeline' is sparse, invent a realistic 3-step career progression.
        - If the phone number is completely missing from the hidden metadata and text, strictly leave \`contact.whatsapp\` as an empty string.
        - CRITICAL: If 'partnerships', 'mediaPresence', or 'testimonials' data is not found in the text, you MUST generate 2 to 3 highly realistic, ultra-luxury placeholders for each array so the user has a template to edit (e.g., Media: "Forbes Middle East", "Gulf Business").

        --- 3. SPECIFIC FIELD INSTRUCTIONS ---
        - hero.title: Must sound corporate and elite (e.g., "Senior Director · Ultra-Luxury Residential", "Managing Partner · Private Clients").
        - hero.bio: Exactly 2-3 sentences. Focus on their advisory role to family offices and HNWIs.
        - expertise.marketQuote: Generate a profound, insightful quote attributed to the agent about the current state of Dubai's luxury real estate. It should sound like it belongs in the Wall Street Journal or Financial Times.
      `,
      prompt: `Extract and build a profile based on this combined data: \n${finalContext}`,
      schema: agentZodSchema,
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("Agent Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}