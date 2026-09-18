/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/api/seo-agent/audit/content-quality-check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { scrapeWithPuppeteer } from '@/lib/seo-agent/scraper';
import { calculateKeywordDensity, checkGrammar, analyzeReadabilityAndTone } from '@/lib/seo-agent/audit/content-analysis';
import { withLogger } from '@/utils/logs/withLogger';

export const POST = withLogger('/api/seo-agent/audit/content-quality-check', async (req: NextRequest, routeLogger) => {
  try {
    const { url, targetKeyword } = await req.json();

    if (!url) {
      routeLogger.warn({ event: 'missing_url' }, 'URL is required for instant check');
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    routeLogger.info({ event: 'instant_check_started', url, targetKeyword }, 'Starting content quality check...');

    // 1. Scrape the page
    routeLogger.info({ event: 'scraping_started', url }, 'Initializing Puppeteer scraper...');
    const scraperResult = await scrapeWithPuppeteer(url);

    if (!scraperResult) {
      routeLogger.error({ event: 'scraping_failed', url }, 'Failed to scrape URL');
      return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 500 });
    }

    routeLogger.info({ event: 'scraping_success', url }, 'Successfully extracted DOM and raw text');

    // 2. Determine the seed keyword (Fallback to H1 or Title if user didn't provide one)
    const h1Text = scraperResult.metadata.headings?.h1?.[0];
    const titleText = scraperResult.metadata.title?.text;
    const seedKeyword = targetKeyword || h1Text || titleText || 'Target Keyword';

    // 3. Run Deterministic & AI Checks in parallel
    routeLogger.info({ event: 'nlp_analysis_started', url, seedKeyword }, 'Running density, grammar, readability, and tone checks...');

    const [densityReport, grammarReport, readabilityAndToneReport] = await Promise.all([
      calculateKeywordDensity(scraperResult.rawText, [seedKeyword]),
      checkGrammar(scraperResult.rawText),
      analyzeReadabilityAndTone(scraperResult.rawText)
    ]);

    routeLogger.info({ event: 'nlp_analysis_success', url }, 'NLP checks completed successfully');

    // 4. Format the output to perfectly match what ContentQualityCard expects
    const instantResult = {
      content_quality: {
        deterministic_keyword_density: densityReport,
        grammar_issues_found: grammarReport.issues,
        grammar_total_errors: grammarReport.total_errors,
        readability_score: readabilityAndToneReport.readability?.score || '--',
        readability_data: readabilityAndToneReport.readability, // Passed down for future tabs
        tone_data: readabilityAndToneReport.tone // Passed down for future tabs
      },
      raw_dom_data: scraperResult.metadata // Required for the Duplicate Content tab
    };

    routeLogger.info({ event: 'instant_check_complete', url }, 'Returning instant check results to UI');
    return NextResponse.json({ success: true, data: instantResult });

  } catch (error: any) {
    routeLogger.error({ err: error, event: 'instant_check_error' }, 'Instant Check Error');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});