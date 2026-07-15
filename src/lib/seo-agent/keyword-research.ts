/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/seo-agent/keyword-research.ts

export async function generateKeywordMatrix(primaryKeyword: string) {
  try {
    // 1. Fetch live Google SERP Data (PAA & Related Searches)
    // You will need to add SERPER_API_KEY to your .env file
    const serpResponse = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: primaryKeyword,
        gl: 'ae',
        hl: 'en',
      })
    });

    const serpData = await serpResponse.json();

    // Safely extract Google's live data
    const paa = serpData.peopleAlsoAsk?.map((item: any) => item.question) || [];
    const relatedSearches = serpData.relatedSearches?.map((item: any) => item.query) || [];

    // 2. Pass this live data to Gemini to generate Long-tail & Semantic equivalents
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an Enterprise SEO Keyword Strategist.
      The target seed keyword is: "${primaryKeyword}".
      
      I have scraped live Google SERP data for this keyword:
      People Also Ask (PAA): ${JSON.stringify(paa)}
      Related Searches: ${JSON.stringify(relatedSearches)}
      
      Based on this live data and the seed keyword, generate a structured keyword matrix.
      
      CRITICAL INSTRUCTIONS:
      Respond ONLY with a valid JSON object matching this exact schema:
      {
        "primary_keyword": "${primaryKeyword}",
        "question_keywords": ["..."], // Use the PAA data and expand on it
        "related_searches": ["..."], // Use the Related Searches data
        "long_tail_keywords": ["..."], // Generate 5 highly specific, lower-competition long-tail phrases
        "semantic_keywords": ["..."] // Generate 5 LSI/Semantic variations (same intent, different words)
      }
    `;

    const response: any = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.2 },
    });

    let rawText = typeof response.text === 'function' ? response.text() : (response.text || '');
    rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();

    return JSON.parse(rawText);

  } catch (error) {
    console.error("Keyword Matrix Generation Failed:", error);
    return null;
  }
}