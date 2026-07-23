/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';

puppeteer.use(StealthPlugin());

/**
 * Executes a fast static HTML fetch.
 * Returns the Cheerio instance and a boolean indicating if the page looks empty (needs JS rendering).
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

    // Check if the DOM is heavily reliant on client-side JS
    const title = $('title').first().text().trim();
    const bodyText = $('body').text().trim();
    const isClientRendered = !title && bodyText.length < 500;

    return { $, isClientRendered };
  } catch (error) {
    console.log(error);
    console.warn(`[Compliance Scraper] Fast fetch failed for ${url}, defaulting to Puppeteer.`);
    return { $: null, isClientRendered: true };
  }
}

/**
 * Spins up a headless browser to execute JavaScript and return the fully rendered HTML.
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
        '--window-size=1920x1080'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Give single-page applications a moment to hydrate
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const html = await page.content();
    return cheerio.load(html);

  } finally {
    if (browser) await browser.close();
  }
}

/**
 * The main extraction engine. Uses static fetch first, falls back to Puppeteer, then parses the DOM.
 */
export async function extractComplianceData(url: string) {
  console.log(`[Compliance Scraper] Initiating extraction for: ${url}`);

  // eslint-disable-next-line prefer-const
  let { $, isClientRendered } = await fastStaticFetch(url);

  if (isClientRendered || !$) {
    console.log(`[Compliance Scraper] Client-side rendering detected. Launching Puppeteer...`);
    $ = await deepPuppeteerFetch(url);
  }

  // ==========================================
  // COMPLIANCE DATA EXTRACTION
  // ==========================================

  const meta_title = $('title').text().trim();
  const meta_description = $('meta[name="description"]').attr('content')?.trim() || '';
  const h1 = $('h1').first().text().trim();

  const h2s: string[] = [];
  $('h2').each((_, el) => { h2s.push($(el).text().trim()); });

  const h3s: string[] = [];
  $('h3').each((_, el) => { h3s.push($(el).text().trim()); });

  // FAQ Schema Extraction (JSON-LD)
  let hasFaqSchema = false;
  const foundQuestions: string[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    const rawContent = $(el).html() || $(el).text() || '';

    if (!rawContent.trim()) return;

    try {
      const parsed = JSON.parse(rawContent.trim());

      const processSchema = (schemaObj: any) => {
        if (schemaObj['@type'] === 'FAQPage') {
          console.log(`[Compliance Scraper] Valid FAQPage Schema successfully parsed!`);
          hasFaqSchema = true;
          const entities = schemaObj.mainEntity || [];
          const questions = Array.isArray(entities) ? entities : [entities];

          questions.forEach((q: any) => {
            if (q['@type'] === 'Question' && q.name) {
              foundQuestions.push(q.name.trim());
            }
          });
        } else if (schemaObj['@graph'] && Array.isArray(schemaObj['@graph'])) {
          schemaObj['@graph'].forEach(processSchema);
        }
      };

      if (Array.isArray(parsed)) {
        parsed.forEach(processSchema);
      } else {
        processSchema(parsed);
      }

    } catch (e: any) {
      console.log(`[Compliance Scraper] JSON Parse Error on a script tag: ${e.message}`);

      if (rawContent.includes('"FAQPage"') || rawContent.includes("'FAQPage'")) {
        console.log(`[Compliance Scraper] Fallback trigger: Found FAQPage via raw string match despite broken JSON!`);
        hasFaqSchema = true;
      }
    }
  });

  return {
    meta_title,
    meta_description,
    h1,
    h2s,
    h3s,
    faq_schema: {
      has_schema: hasFaqSchema,
      extracted_questions: foundQuestions
    }
  };
}

export async function parseBriefWithGemini(rawText: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
    You are a strict SEO Content Auditor. Extract the target SEO elements from the following content brief into a strict JSON format. 
    If an element is missing, return an empty string or empty array.
    
    RAW BRIEF TEXT:
    ${rawText}

    EXPECTED JSON SCHEMA:
    {
      "meta_title": "String",
      "meta_description": "String",
      "h1": "String",
      "h2s": ["Array of Strings"],
      "h3s": ["Array of Strings"],
      "faqs": ["Array of FAQ Question Strings"]
    }
  `;

  const response: any = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { temperature: 0.1 },
  });

  let text = typeof response.text === 'function' ? response.text() : (response.text || '');
  text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
  return JSON.parse(text);
}

export function normalizeString(str: string) {
  if (!str) return '';
  // Strip out any instructional notes inside parentheses () or brackets []
  const stripInstructions = str.replace(/\s*[\(\[].*?[\)\]]\s*/g, ' ');
  // Lowercase, remove non-alphanumeric chars, and trim
  return stripInstructions.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
}

export function runComparisonEngine(expected: any, actual: any) {
  let totalPoints = 0;
  let earnedPoints = 0;

  const compareSingle = (exp: string, act: string, weight: number) => {
    totalPoints += weight;
    if (!exp) return { expected: exp, actual: act, status: 'pass', message: 'Not required in brief' };

    const normExp = normalizeString(exp);
    const normAct = normalizeString(act);

    if (normExp === normAct) {
      earnedPoints += weight;
      return { expected: exp, actual: act, status: 'pass' };
    } else if (normAct.includes(normExp) || normExp.includes(normAct)) {
      earnedPoints += (weight * 0.7); // Partial credit for fuzzy match
      return { expected: exp, actual: act, status: 'warning', message: 'Fuzzy match. May contain extra or missing words.' };
    }
    return { expected: exp, actual: act, status: 'fail', message: 'Element missing or completely mismatched.' };
  };

  const compareArrays = (expArr: string[], actArr: string[], weightPerItem: number) => {
    const missing: string[] = [];
    const found: string[] = [];
    const normActArr = actArr.map(normalizeString);

    expArr.forEach(exp => {
      totalPoints += weightPerItem;
      const normExp = normalizeString(exp);
      const isFound = normActArr.some(act => act.includes(normExp) || normExp.includes(act));
      if (isFound) {
        found.push(exp);
        earnedPoints += weightPerItem;
      } else {
        missing.push(exp);
      }
    });

    return {
      expected: expArr,
      actual: actArr,
      missing,
      status: missing.length === 0 ? 'pass' : missing.length === expArr.length ? 'fail' : 'warning'
    };
  };

  const report = {
    meta_title: compareSingle(expected.meta_title, actual.meta_title, 20),
    meta_description: compareSingle(expected.meta_description, actual.meta_description, 10),
    h1: compareSingle(expected.h1, actual.h1, 20),
    h2s: compareArrays(expected.h2s || [], actual.h2s || [], 5),
    h3s: compareArrays(expected.h3s || [], actual.h3s || [], 2),
    faq_schema: {
      expected_questions: expected.faqs || [],
      found_on_page: actual.faq_schema?.has_schema || false,
      status: (!expected.faqs || expected.faqs.length === 0) ? 'pass' : (actual.faq_schema?.has_schema ? 'pass' : 'fail'),
      message: actual.faq_schema?.has_schema ? 'Valid FAQPage Schema detected.' : 'FAQ Schema missing from DOM.'
    }
  };

  if (expected.faqs && expected.faqs.length > 0) {
    totalPoints += 15;
    if (actual.faq_schema?.has_schema) earnedPoints += 15;
  }

  const overall_score = totalPoints === 0 ? 100 : Math.round((earnedPoints / totalPoints) * 100);

  return { report, overall_score };
}