// riwaa/src/lib/real-estate-agents/utils.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer';
import { GoogleGenAI } from '@google/genai';

/**
 * Scrapes PropertyFinder agent profiles for their bio, stats, and contact info.
 */
export async function fetchBrokerData(url: string, logger: any) {
  logger.info({ event: 'puppeteer_launching', url }, `Spinning up invisible browser for: ${url}`);
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

    logger.info({ event: 'puppeteer_scrape_success', url, brokerName: data.brokerName });
    return data;
  } catch (error: any) {
    logger.error({ err: error, url, event: 'puppeteer_scrape_failed' }, `Puppeteer failed to scrape ${url}: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Rewrites the scraped agent bio to position them as a specialist for a specific developer.
 */
export async function rewriteBioWithGemini(rawText: string, brokerName: string, developerConfig: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    You are an elite real estate copywriter. I am providing you with the raw scraped text from a real estate agent's profile, and a specific Master Developer they are now representing.
    
    Agent Name: ${brokerName}
    Target Developer: ${developerConfig.name}
    Developer Tagline: ${developerConfig.tagline}
    
    Raw Agent Profile Text:
    "${rawText}"

    INSTRUCTIONS:
    Write a highly professional, luxurious 2-paragraph bio for this agent. 
    1. Position them as an expert specialist in ${developerConfig.name} properties.
    2. Weave their existing experience and skills (from the raw text) seamlessly into this narrative.
    3. Ensure the tone builds credibility and trust with high-net-worth investors.
    4. Do not include placeholders or hallucinate credentials not supported by the raw text (other than establishing them as a specialist for the target developer).
    
    Output ONLY the rewritten bio text. No markdown, no preambles.
  `;

  try {
    const response: any = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.4 },
    });
    
    const text = typeof response.text === 'function' ? response.text() : response.text;
    return text.trim();
  } catch (error) {
    console.error("Gemini bio rewrite failed:", error);
    return "An experienced real estate professional ready to assist you with your property investments.";
  }
}