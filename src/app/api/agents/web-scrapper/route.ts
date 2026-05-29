/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function fetchBrokerData(url: string) {
  console.log(`Spinning up invisible browser for: ${url}`);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production" ? true : false,
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
        // card.children[0] grabs the entire value block (e.g., "55" or "1 Billion AED")
        const valueText = card.children[0]?.textContent;
        // card.children[1] grabs the entire title block (e.g., "Properties for Sale")
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
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "Missing 'url' in request body" }), { status: 400 });
    }

    const data = await fetchBrokerData(url);
    if (!data) {
      return new Response(JSON.stringify({ error: "Failed to scrape data from the provided URL" }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/agents/web-scrapper:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}