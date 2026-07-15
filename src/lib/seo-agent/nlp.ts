/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/seo-agent/nlp.ts

export async function analyzeEntities(text: string) {
  // Gracefully exit if the text is too short
  if (!text || text.length < 50) return [];

  const apiKey = process.env.GOOGLE_NLP_API_KEY;
  if (!apiKey) {
    console.warn("Missing GOOGLE_NLP_API_KEY. Skipping entity extraction.");
    return [];
  }

  // Google Cloud Natural Language REST Endpoint
  const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          // Cap at 5,000 characters to optimize API cost while retaining core semantic context
          content: text.substring(0, 5000),
        },
        encodingType: 'UTF8',
      }),
    });

    if (!response.ok) {
      console.error(`Google NLP API Error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const entities = data.entities || [];

    // Filter, sort, and format the top 15 most salient (important) entities
    return entities
      .filter((e: any) => e.salience && e.salience > 0.01) // Ignore background noise
      .sort((a: any, b: any) => b.salience - a.salience)
      .slice(0, 15)
      .map((e: any) => ({
        name: e.name,
        type: e.type,
        google_salience_score: parseFloat(e.salience.toFixed(3))
      }));

  } catch (error) {
    console.error("NLP Fetch Error:", error);
    return [];
  }
}