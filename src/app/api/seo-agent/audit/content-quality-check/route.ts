/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/api/seo-agent/audit/content-quality-check/route.ts
import { NextResponse } from 'next/server';
import { scrapeWithPuppeteer } from '@/lib/seo-agent/scraper';
import { calculateKeywordDensity, checkGrammar } from '@/lib/seo-agent/audit/content-analysis';

export async function POST(req: Request) {
  try {
    const { url, targetKeyword } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Scrape the page (This natively runs the Jaccard Duplicate Check inside it)
    const scraperResult = await scrapeWithPuppeteer(url);

    if (!scraperResult) {
      return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 500 });
    }

    // 2. Determine the seed keyword (Fallback to H1 or Title if user didn't provide one)
    const h1Text = scraperResult.metadata.headings?.h1?.[0];
    const titleText = scraperResult.metadata.title?.text;
    const seedKeyword = targetKeyword || h1Text || titleText || 'Target Keyword';

    // 3. Run Deterministic Checks in parallel
    const [densityReport, grammarReport] = await Promise.all([
      calculateKeywordDensity(scraperResult.rawText, [seedKeyword]),
      checkGrammar(scraperResult.rawText)
    ]);

    // 4. Format the output to perfectly match what ContentQualityCard expects
    const instantResult = {
      content_quality: {
        deterministic_keyword_density: densityReport,
        grammar_issues_found: grammarReport.issues,
        grammar_total_errors: grammarReport.total_errors,
        readability_score: '--',
      },
      raw_dom_data: scraperResult.metadata // Required for the Duplicate Content tab
    };

    return NextResponse.json({ success: true, data: instantResult });

  } catch (error: any) {
    console.error('Instant Check Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}