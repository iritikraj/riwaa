/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { withLogger } from '@/lib/logs/withLogger';

export const POST = withLogger('/api/real-estate-agents/discover-pr', async (req: NextRequest, routeLogger) => {
  try {
    const { name, location = "ae" } = await req.json();

    if (!name) {
      routeLogger.warn({ event: 'pr_discovery_aborted', reason: 'Missing agent name' });
      return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
    }

    routeLogger.info({ event: 'pr_discovery_started', agentName: name, location });

    // 1. Parallel Fetch Strategy using Serper News Endpoint
    const targets = [
      `"${name}" "real estate"`,
      `"${name}" property`,
      `"${name}"`,
    ];

    routeLogger.info({ event: 'serper_api_fetching', targetsCount: targets.length });

    const fetchPromises = targets.map(query =>
      fetch('https://google.serper.dev/news', {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: query,
          gl: location,
          num: 10
        })
      }).then(res => res.json())
    );

    const results = await Promise.all(fetchPromises);

    // 2. Combine results
    let allNews: any[] = [];
    results.forEach(data => {
      if (data.news) {
        allNews = [...allNews, ...data.news];
      }
    });

    // Deduplicate identical articles by link URL
    const uniqueNews = Array.from(new Map(allNews.map(item => [item.link, item])).values());

    routeLogger.info({
      event: 'serper_api_completed',
      totalRawResults: allNews.length,
      filteredValidResults: uniqueNews.length
    });

    // If no real PR news articles were discovered
    if (uniqueNews.length === 0) {
      routeLogger.info({ event: 'pr_discovery_no_results', agentName: name });
      return NextResponse.json({
        message: "No public PR found, suggesting thought leadership topics.",
        mediaPresence: [
          {
            headline: `Market Outlook: The Shift in ${location} Luxury Real Estate`,
            publication: "Suggested Personal Blog",
            year: new Date().getFullYear().toString(),
            link: "#"
          }
        ]
      });
    }

    // 3. Direct Mapping: Pure Native JavaScript parsing instead of LLM
    const mediaPresence = uniqueNews.map((item: any) => {
      // Safely extract 4-digit year from strings like "Sep 30, 2022" or "7 Oct 2025"
      const yearMatch = item.date ? item.date.match(/\d{4}/) : null;
      const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();

      return {
        headline: item.title || "",
        publication: item.source || "Media Feature",
        year: year,
        link: item.link || "#",
        imageUrl: item.imageUrl || null
      };
    });

    routeLogger.info({
      event: 'native_parsing_completed',
      extractedMediaCount: mediaPresence.length
    });

    return NextResponse.json({ mediaPresence });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'pr_discovery_failed' }, "PR Discovery Error");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});