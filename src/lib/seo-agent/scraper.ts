// riwaa/src/lib/seo-agent/scraper.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { getJaccardSimilarity } from './audit/content-analysis';

puppeteer.use(StealthPlugin());

export async function scrapeWithPuppeteer(url: string) {
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

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const html = await page.content();
    const rawText = await page.evaluate(() => document.body.innerText.substring(0, 8000));
    const wordCount = rawText.split(/\s+/).filter(word => word.length > 0).length;

    const $ = cheerio.load(html);
    const urlObj = new URL(url);

    // ==========================================
    // DEEP RAW DATA EXTRACTION (The 13 Points)
    // ==========================================

    // 1 & 2. URL & Slug Raw Data
    const url_analysis = {
      raw_url: url,
      slug: urlObj.pathname,
      query_parameters: urlObj.search,
    };

    // 3. Breadcrumb Raw Data (Extracting the actual text trail)
    const breadcrumbs = $('nav[aria-label="breadcrumb"] a, .breadcrumb a, #breadcrumbs a, [class*="breadcrumb"] a')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    // 4 & 5. Heading Hierarchy Raw Data (Extracting the actual content of every heading)
    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean),
      h2: $('h2').map((_, el) => $(el).text().trim()).get().filter(Boolean),
      h3: $('h3').map((_, el) => $(el).text().trim()).get().filter(Boolean),
      h4: $('h4').map((_, el) => $(el).text().trim()).get().filter(Boolean),
      h5: $('h5').map((_, el) => $(el).text().trim()).get().filter(Boolean),
      h6: $('h6').map((_, el) => $(el).text().trim()).get().filter(Boolean),
    };

    // 6 & 7. Title & Meta Description Raw Data
    const title = $('title').text().trim() || null;
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;

    // 8 & 9. Open Graph & Twitter Cards Raw Data
    const social_graph = {
      og_title: $('meta[property="og:title"]').attr('content')?.trim() || null,
      og_description: $('meta[property="og:description"]').attr('content')?.trim() || null,
      og_image: $('meta[property="og:image"]').attr('content')?.trim() || null,
      twitter_card: $('meta[name="twitter:card"]').attr('content')?.trim() || null,
      twitter_title: $('meta[name="twitter:title"]').attr('content')?.trim() || null,
      twitter_description: $('meta[name="twitter:description"]').attr('content')?.trim() || null,
    };

    // 10 & 11. Robots & Canonical Raw Data
    const robots = $('meta[name="robots"]').attr('content')?.trim() || null;
    const canonical = $('link[rel="canonical"]').attr('href')?.trim() || null;

    // 12. Pagination Raw Data (Extracting actual next/prev URLs)
    const pagination = {
      next_url: $('link[rel="next"]').attr('href')?.trim() || null,
      prev_url: $('link[rel="prev"]').attr('href')?.trim() || null,
    };

    // 13. Anchor Text Raw Data
    const baseDomain = urlObj.hostname;
    const internalHrefs = new Set<string>(); // Storing exact URLs
    const externalHrefs = new Set<string>(); // Storing exact external URLs
    let externalLinks = 0;
    const genericAnchorsFound: { text: string, href: string }[] = [];
    const genericWords = ['click here', 'read more', 'learn more', 'link', 'go', 'here', 'more', 'view all'];

    $('a[href]').each((_, el) => {
      let href = $(el).attr('href');
      const anchorText = $(el).text().trim();
      if (!href) return;

      // Normalize relative links to absolute for accurate cross-referencing
      if (href.startsWith('/')) {
        href = `${urlObj.origin}${href}`;
      }

      // Track exact internal links
      if (href.includes(baseDomain)) {
        // Strip trailing slashes and hash links so they match perfectly
        const cleanHref = href.split('#')[0].replace(/\/$/, "");
        internalHrefs.add(cleanHref);
      } else if (href.startsWith('http')) {
        externalHrefs.add(href);
        externalLinks++;
      }

      if (genericWords.includes(anchorText.toLowerCase())) {
        genericAnchorsFound.push({ text: anchorText, href });
      }
    });

    // Content Quality Indicators
    const imagesTotal = $('img').length;
    const imagesMissingAlt = $('img:not([alt]), img[alt=""]').length;

    // ==========================================
    // NEW: IN-PAGE DUPLICATE CONTENT CHECK
    // ==========================================
    const textChunks: string[] = [];
    // Extract substantive text blocks (paragraphs, lists, subheadings)
    $('p, h2, h3, h4, li').each((_, el) => {
      const text = $(el).text().trim().replace(/\s\s+/g, ' ');
      // Only check blocks that have at least 15 words to avoid flagging standard UI elements
      if (text.split(/\s+/).length > 15) {
        textChunks.push(text);
      }
    });

    const internalDuplicates: { text: string; similarity: number }[] = [];
    const JACCARD_THRESHOLD = 0.85;

    for (let i = 0; i < textChunks.length; i++) {
      for (let j = i + 1; j < textChunks.length; j++) {
        const sim = getJaccardSimilarity(textChunks[i], textChunks[j]);
        if (sim >= JACCARD_THRESHOLD) {
          internalDuplicates.push({
            text: textChunks[i],
            similarity: Number(sim.toFixed(2))
          });
        }
      }
    }

    const uniqueDuplicates = Array.from(new Set(internalDuplicates.map(d => d.text)))
      .map(text => internalDuplicates.find(d => d.text === text))
      .filter(Boolean);

    // Schema Extraction
    const schemaTypes: Set<string> = new Set();
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const parsed = JSON.parse($(el).html() || '{}');
        if (parsed['@type']) {
          Array.isArray(parsed['@type']) ? parsed['@type'].forEach((t: string) => schemaTypes.add(t)) : schemaTypes.add(parsed['@type']);
        }
      } catch (err) { }
    });

    return {
      metadata: {
        url_metrics: url_analysis,
        title: { text: title, length: title?.length || 0 },
        description: { text: metaDescription, length: metaDescription?.length || 0 },
        canonical_url: canonical,
        robots_meta: robots,
        social_graph,
        headings,
        breadcrumbs,
        pagination,
        link_architecture: {
          internal_links: Array.from(internalHrefs),
          external_links: externalLinks,
          external_links_array: Array.from(externalHrefs),
          unoptimized_anchors: genericAnchorsFound
        },
        content_metrics: {
          word_count: wordCount,
          images_total: imagesTotal,
          images_missing_alt: imagesMissingAlt,
          internal_duplicates_found: uniqueDuplicates,
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