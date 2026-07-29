// src/lib/seo-agent/content-brief/scrapper.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

puppeteer.use(StealthPlugin());

/**
 * Fast static HTML fetch.
 */
async function fastStaticFetch(url: string) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RiwaaBot/1.0' },
      signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('title').first().text().trim();
    const bodyText = $('body').text().trim();
    const isClientRendered = !title && bodyText.length < 500;

    return { $, isClientRendered };
  } catch (error) {
    console.warn(`[Brief Scraper] Fast fetch failed for ${url}, defaulting to Puppeteer., error: ${error}`);
    return { $: null, isClientRendered: true };
  }
}

/**
 * Deep Puppeteer fetch for JS-rendered pages.
 */
async function deepPuppeteerFetch(url: string) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--single-process',
        '--no-zygote'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Hydration wait

    const html = await page.content();
    return cheerio.load(html);
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Extracts the exact structural architecture needed for a Content Brief.
 */
export async function extractBriefArchitecture(url: string) {
  console.log(`[Brief Scraper] Extracting architecture for: ${url}`);

  // eslint-disable-next-line prefer-const
  let { $, isClientRendered } = await fastStaticFetch(url);

  if (isClientRendered || !$) {
    console.log(`[Brief Scraper] Client-side rendering detected. Launching Puppeteer...`);
    $ = await deepPuppeteerFetch(url);
  }

  // We only need SEO architecture for the brief generator, no schemas required.
  const meta_title = $('title').text().trim();
  const meta_description = $('meta[name="description"]').attr('content')?.trim() || '';
  const h1 = $('h1').first().text().trim();

  const headings: { tag: string; text: string }[] = [];

  // Extract all headings sequentially to maintain document flow
  $('h2, h3, h4').each((_, el) => {
    const tagName = el.tagName.toLowerCase();
    const text = $(el).text().trim();
    if (text) {
      headings.push({ tag: tagName, text });
    }
  });

  return {
    url,
    meta_title,
    meta_description,
    h1,
    headings // Preserves the exact order the competitor wrote them in
  };
}

/**
 * Processes multiple URLs sequentially to avoid Puppeteer memory spikes.
 */
export async function scrapeMultipleCompetitors(urls: string[]) {
  const results = [];
  for (const url of urls) {
    if (!url) continue;
    try {
      const data = await extractBriefArchitecture(url);
      results.push(data);
    } catch (error: any) {
      console.error(`[Brief Scraper] Failed to scrape ${url}: ${error.message}`);
    }
  }
  return results;
}