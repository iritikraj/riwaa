/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

// Apply the stealth plugin to bypass Cloudflare/Bot protection
puppeteer.use(StealthPlugin());

export async function scrapeWithPuppeteer(url: string) {
  let browser;
  try {
    // Launch stealth Chromium (Optimized for your EC2/PM2 environment)
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

    // Fallback User Agent (Stealth plugin usually handles this, but it's good practice)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Wait for the JS frameworks (React/Next/Vue) to mount and render the DOM
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Give dynamic content a brief moment to paint
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 1. Extract the fully rendered HTML for Cheerio
    const html = await page.content();

    // 2. Extract plain text for the Google NLP Salience API
    const rawText = await page.evaluate(() => document.body.innerText.substring(0, 8000));
    const wordCount = rawText.split(/\s+/).filter(word => word.length > 0).length;

    const $ = cheerio.load(html);

    // 1. Core Meta & Social Tags (Open Graph / Twitter)
    const title = $('title').text().trim() || null;
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;
    const canonical = $('link[rel="canonical"]').attr('href')?.trim() || null;
    const robots = $('meta[name="robots"]').attr('content')?.trim() || null;

    const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || null;
    const ogDescription = $('meta[property="og:description"]').attr('content')?.trim() || null;
    const twitterCard = $('meta[name="twitter:card"]').attr('content')?.trim() || null;

    // 2. Heading Hierarchy (H1-H6 Check)
    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean),
      h2: $('h2').length,
      h3: $('h3').length,
      h4: $('h4').length,
      h5: $('h5').length,
      h6: $('h6').length,
    };

    // 3. Link Architecture (Internal vs External)
    const baseDomain = new URL(url).hostname;
    let internalLinks = 0;
    let externalLinks = 0;

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      if (href.startsWith('/') || href.includes(baseDomain)) {
        internalLinks++;
      } else if (href.startsWith('http')) {
        externalLinks++;
      }
    });

    // 4. Content Quality Indicators
    const imagesTotal = $('img').length;
    const imagesMissingAlt = $('img:not([alt]), img[alt=""]').length;
    const hasBreadcrumbs = $('nav[aria-label="breadcrumb"], .breadcrumb, #breadcrumbs').length > 0;

    // 5. Schema Extraction (Existing)
    const schemas: any[] = [];
    const schemaTypes: Set<string> = new Set();

    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const parsed = JSON.parse($(el).html() || '{}');
        schemas.push(parsed);
        if (parsed['@type']) {
          Array.isArray(parsed['@type'])
            ? parsed['@type'].forEach((t: string) => schemaTypes.add(t))
            : schemaTypes.add(parsed['@type']);
        }
      } catch (err) { console.log(err); }
    });

    return {
      metadata: {
        title: { text: title, length: title?.length || 0 },
        description: { text: metaDescription, length: metaDescription?.length || 0 },
        canonical_url: canonical,
        robots_meta: robots,
        social_graph: { og_title: ogTitle, og_description: ogDescription, twitter_card: twitterCard },
        headings: headings,
        link_architecture: { internal_links: internalLinks, external_links: externalLinks },
        content_metrics: {
          word_count: wordCount,
          images_total: imagesTotal,
          images_missing_alt: imagesMissingAlt,
          has_breadcrumbs: hasBreadcrumbs
        },
        detected_schemas: Array.from(schemaTypes),
      },
      rawText
    };

  } catch (error) {
    console.error(`Stealth Scraper failed for ${url}:`, error);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}