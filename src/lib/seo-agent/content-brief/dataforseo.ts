/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger as defaultLogger } from '@/utils/logs/logger';
import type { Logger } from 'pino';

export async function fetchKeywordData(topic: string, parentLogger: Logger = defaultLogger) {
  const dataForSeoLogger = parentLogger.child({ module: 'dataforseo_api', topic });

  const LOGIN = process.env.DATAFORSEO_LOGIN;
  const PASSWORD = process.env.DATAFORSEO_PASSWORD;

  if (!LOGIN || !PASSWORD) {
    dataForSeoLogger.warn({ event: 'dataforseo_missing_credentials' }, 'Missing DataForSEO credentials. Returning fallback keywords.');
    return [{ keyword: topic, search_volume: 'N/A', competition: 'N/A' }];
  }

  const authHeader = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64');

  try {
    dataForSeoLogger.info({ event: 'dataforseo_request_started' });

    const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/keyword_ideas/live', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        "keywords": [topic],
        "language_name": "English",
        // We can make this dynamic later, but hardcoding UAE as the default for your real estate market
        "location_name": "United Arab Emirates",
        "include_adult_keywords": false
      }])
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DataForSEO API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Safety check on response structure
    if (!data.tasks || !data.tasks[0] || !data.tasks[0].result || data.tasks[0].result.length === 0) {
      dataForSeoLogger.warn({ event: 'dataforseo_no_results' }, 'No keywords returned from DataForSEO.');
      return [{ keyword: topic, search_volume: 'N/A', competition: 'N/A' }];
    }

    // Extract the raw keyword ideas
    const rawKeywords = data.tasks[0].result[0].items || [];

    // Map and clean the data
    const cleanedKeywords = rawKeywords.map((item: any) => ({
      keyword: item.keyword,
      search_volume: item.keyword_info?.search_volume || 0,
      competition: item.keyword_info?.competition_level || 'UNKNOWN',
      cpc: item.keyword_info?.cpc || 0
    }));

    // Sort by search volume (descending) and take the top 20
    const topKeywords = cleanedKeywords
      .sort((a: any, b: any) => b.search_volume - a.search_volume)
      .slice(0, 20);

    dataForSeoLogger.info({
      event: 'dataforseo_request_success',
      keywordsExtracted: topKeywords.length
    });

    return topKeywords;

  } catch (error: any) {
    dataForSeoLogger.error({
      event: 'dataforseo_request_failed',
      err: error
    }, 'Failed to fetch keywords. Falling back to base topic.');

    // Return a fallback so the brief generation pipeline doesn't crash completely over a keyword API blip
    return [{ keyword: topic, search_volume: 'N/A', competition: 'N/A' }];
  }
}