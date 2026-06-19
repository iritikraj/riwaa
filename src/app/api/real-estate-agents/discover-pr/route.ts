/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { withLogger } from '@/lib/logs/withLogger'; // Import your logger

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Wrap the route with the logger HOC
export const POST = withLogger('/api/real-estate-agents/discover-pr', async (req: NextRequest, routeLogger) => {
  try {
    const { name, location = "UAE" } = await req.json();

    if (!name) {
      routeLogger.warn({ event: 'pr_discovery_aborted', reason: 'Missing agent name' });
      return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
    }

    routeLogger.info({ event: 'pr_discovery_started', agentName: name, location });

    // 1. The Parallel Fetch Strategy
    const targets = [
      `"${name}" "real estate"`,
      `"${name}" "property"`,
      `"${name}" "${location}"`,
      `"${name}" site:abu-dhabi.realestate`,
    ];

    routeLogger.info({ event: 'serper_api_fetching', targetsCount: targets.length });

    const fetchPromises = targets.map(query =>
      fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: query, num: 5 })
      }).then(res => res.json())
    );

    const results = await Promise.all(fetchPromises);

    // Combine organic results
    let allResults: any[] = [];
    results.forEach(data => {
      if (data.organic) allResults = [...allResults, ...data.organic];
    });

    // 2. Filter the combined results
    const spamDomains = ["linkedin", "facebook", "instagram", "tiktok", "/agent/"];
    const validResults = allResults
      .filter((result: any) => !spamDomains.some(domain => result.link.includes(domain)))
      .slice(0, 6);

    routeLogger.info({
      event: 'serper_api_completed',
      totalRawResults: allResults.length,
      filteredValidResults: validResults.length
    });

    // If no PR was found
    if (validResults.length === 0) {
      routeLogger.info({ event: 'pr_discovery_no_results', agentName: name });
      return NextResponse.json({
        message: "No public PR found, suggesting thought leadership topics.",
        mediaPresence: [
          { headline: `Market Outlook: The Shift in ${location} Luxury Real Estate`, publication: "Suggested Personal Blog", year: "2026" }
        ]
      });
    }

    routeLogger.info({ event: 'ai_generation_started', model: 'gemini-2.5-flash-lite' });

    // 3. Use Gemini to parse the messy Google snippets
    const { object } = await generateObject({
      model: google('gemini-2.5-flash-lite'),
      schema: z.object({
        mediaPresence: z.array(z.object({
          headline: z.string().describe("A professional, 1-2 sentence summary of the news snippet"),
          publication: z.string().describe("The name of the news outlet (e.g., 'Bayut Corporate', 'Abu Dhabi Real Estate')"),
          year: z.string().describe("The year it was published. Extract from text, default to current year if unknown.")
        }))
      }),
      system: `
        You are an elite PR Manager for ultra-luxury real estate agents. 
        You will receive raw Google Search snippets about an agent. 
        Extract the actual news features, clean up the headlines to sound highly professional, and identify the publication source.
      `,
      prompt: `Format these search results into our PR schema:\n\n${JSON.stringify(validResults, null, 2)}`
    });

    routeLogger.info({
      event: 'ai_generation_completed',
      extractedMediaCount: object.mediaPresence.length
    });

    return NextResponse.json(object);

  } catch (error: any) {
    routeLogger.error({ err: error, event: 'pr_discovery_failed' }, "PR Discovery Error");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});