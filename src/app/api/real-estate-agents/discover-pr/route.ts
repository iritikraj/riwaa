import { NextResponse } from "next/server";
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { name, location = "UAE" } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
    }

    // 1. The Parallel Fetch Strategy (Bypasses Free Tier Restrictions)
    // We break the complex query into three simple ones
    const targets = [
      `"${name}" "real estate"`,
      `"${name}" "property"`,
      `"${name}" "${location}"`,
      `"${name}" site:abu-dhabi.realestate`,
      // `"${name}" site:propertyfinder.ae`,
      // `"${name}" site:bayut.com`
    ];

    // Fetch all three simultaneously
    const fetchPromises = targets.map(query =>
      fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: query, num: 5 }) // Request fewer per query since we are doing 3
      }).then(res => res.json())
    );

    const results = await Promise.all(fetchPromises);

    // Combine all the "organic" results from the 3 queries into one master array
    let allResults: any[] = [];
    results.forEach(data => {
      if (data.organic) allResults = [...allResults, ...data.organic];
    });

    // 2. Filter the combined results
    const spamDomains = ["linkedin", "facebook", "instagram", "tiktok", "/agent/"];
    const validResults = allResults
      .filter((result: any) => !spamDomains.some(domain => result.link.includes(domain)))
      .slice(0, 6); // Keep the top 6 valid news links

    // If no PR was found across any of the sites
    if (validResults.length === 0) {
      return NextResponse.json({
        message: "No public PR found, suggesting thought leadership topics.",
        mediaPresence: [
          { headline: `Market Outlook: The Shift in ${location} Luxury Real Estate`, publication: "Suggested Personal Blog", year: "2026" }
        ]
      });
    }

    // 3. Use Gemini to parse the messy Google snippets into clean PR headlines
    const { object } = await generateObject({
      model: google('gemini-flash-latest'),
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

    return NextResponse.json(object);

  } catch (error: any) {
    console.error("PR Discovery Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}