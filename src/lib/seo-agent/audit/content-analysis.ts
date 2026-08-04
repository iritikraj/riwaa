/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/lib/seo-agent/audit/content-analysis.ts
import { GoogleGenAI } from '@google/genai';
/**
 * Calculates Keyword Density for an array of target keywords.
 * Formula: ((Keyword Count * Words in Keyword) / Total Word Count) * 100
 */
export function calculateKeywordDensity(rawText: string, keywords: string[]) {
  const cleanText = rawText.replace(/\s\s+/g, ' ').trim().toLowerCase();
  const words = cleanText.match(/\b\w+\b/g) || [];
  const totalWords = words.length;

  if (totalWords === 0) return [];

  return keywords.map(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    // Escape special characters to prevent Regex crashes
    const escapedKeyword = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'g');

    const matches = cleanText.match(regex);
    const count = matches ? matches.length : 0;

    const keywordWordCount = lowerKeyword.split(/\s+/).length;
    const density = ((count * keywordWordCount) / totalWords) * 100;

    let status = 'Optimal';
    if (density >= 5) status = 'Critical (Stuffing)';
    else if (density >= 3) status = 'Warning (High)';
    else if (density < 0.5) status = 'Low (Under-optimized)';

    return {
      keyword,
      count,
      density: Number(density.toFixed(2)),
      status
    };
  });
}

/**
 * Calculates Jaccard Similarity between two strings.
 * Returns a score between 0.0 (completely different) and 1.0 (identical).
 */
export function getJaccardSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.toLowerCase().match(/\b\w+\b/g) || []);
  const set2 = new Set(str2.toLowerCase().match(/\b\w+\b/g) || []);

  if (set1.size === 0 && set2.size === 0) return 0;

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

export async function checkGrammar(rawText: string) {
  if (!rawText || rawText.trim() === '') return { total_errors: 0, issues: [] };

  const rawTruncated = rawText.substring(0, 8000);
  const safeText = rawTruncated.substring(0, rawTruncated.lastIndexOf('.') + 1);
  // console.log(safeText);
  // console.log('----------------------------------------------------------------------------------------------------------------------------');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    You are a strict, mechanical spelling and grammar validator. You are NOT a writing coach, and you DO NOT give stylistic advice. Review the text STRICTLY for undeniable, objective typos and broken syntax.
    
    CRITICAL NEGATIVE CONSTRAINTS (YOU MUST OBEY THESE OR FAIL):
    1. NO STYLISTIC CRITIQUES: DO NOT flag phrases for being "awkward," "informal," "vague," "wordy," or "unprofessional." If a phrase is grammatically legal, you MUST ignore it, even if you think it sounds clunky.
    2. NO VOCABULARY UPGRADES: DO NOT suggest "more precise" or "better" synonyms. 
    3. IGNORE PERFECT SENTENCES: If a sentence has no objective errors, DO NOT include it. NEVER return a message saying a phrase is correct or sound.
    4. THE "8-WORD RULE": Completely ignore any sentence or phrase that is fewer than 8 words long.
    5. ACCEPT CREATIVE COPY: The text is highly stylized marketing copy. Conversational phrasing and compound descriptive clauses are intentional. Do not attempt to "fix" the tone.
    6. IGNORE REGIONAL TERMS: Do not flag Al Dhafra, Jebel, Falaj, Dirham, AED, Relaam, Ethmar, or Rabdan.
    7. IGNORE TRUNCATED ENDINGS: The provided text is programmatically truncated at 8,000 characters. If the very last sentence is cut off abruptly or ends mid-word (e.g., "services ranging fr"), you MUST completely ignore that final sentence. Do not flag it as a fragment, typo, or incomplete thought.
    
    Expected JSON Format (USE ONLY FOR INDISPUTABLE TYPOS OR BROKEN SYNTAX):
    [
      {
        "message": "Explanation of the undeniable error",
        "context": "The specific 4-5 word phrase containing the error",
        "suggestions": ["Fix 1", "Fix 2"],
        "rule_issue_type": "grammar"
      }
    ]

   --- EXAMPLES OF CORRECT BEHAVIOR ---
    
    Input Text: "The region supports the country's energy needs and also offers many activities for visitors. People come for desert drives, heritage festivals, and wildlife experiences."
    Output: []
    
    Input Text: "Staying here means trading skyscraper views for stars. Bab Al Nujoum Al Mugheirah Resort sits by the mangroves."
    Output: []

    Input Text: "The developmnt plans aim to add more waterfront retail at Al Mugheirah Bay."
    Output: 
    [
      {
        "message": "The word 'developmnt' is misspelled.",
        "context": "The developmnt plans aim to",
        "suggestions": ["development"],
        "rule_issue_type": "typo"
      }
    ]
    -----------------------------------

    FINAL INSTRUCTION: If there are no genuine typos, you MUST return []. Do not invent errors to fill the JSON.

    Text to analyze:
    "${safeText}"
  `;

  try {
    // Upgrading to the highly efficient Flash-Lite tier
    const response: any = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.0,
        responseMimeType: "application/json"
      },
    });

    const rawOutput = typeof response.text === 'function' ? response.text() : (response.text || '[]');
    const issues = JSON.parse(rawOutput);

    return {
      total_errors: issues.length,
      issues: issues.slice(0, 20),
    };
  } catch (error) {
    console.error('Failed to run AI grammar check:', error);
    return { total_errors: 0, issues: [], error: 'AI check failed' };
  }
}

export async function analyzeReadabilityAndTone(rawText: string) {
  if (!rawText || rawText.trim() === '') {
    return {
      readability: { score: 0, complexity_level: 'N/A', feedback: [] },
      tone: { primary_tone: 'N/A', is_consistent: true, inconsistencies: [] }
    };
  }

  // Safe truncation to avoid mid-word slicing
  const rawTruncated = rawText.substring(0, 8000);
  const safeText = rawTruncated.substring(0, rawTruncated.lastIndexOf('.') + 1) || rawTruncated;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    You are an expert SEO Content Strategist and Brand Auditor. Evaluate the following website copy for Readability and Tone Consistency.

    TASK 1: READABILITY ANALYSIS
    Evaluate how easy the text is to read.
    - Provide a 'score' from 0 to 100 (100 = very easy/conversational, 0 = highly dense/academic). A score of 60-80 is ideal for premium web copy.
    - Classify the 'complexity_level' (e.g., Easy, Moderate, Advanced).
    - Provide 1-2 short, actionable bullet points of 'feedback' regarding sentence structure or word complexity.
    - THE "10-WORD RULE": Completely ignore any sentence or phrase that is fewer than 10 words long.

    TASK 2: TONE CONSISTENCY
    Evaluate the brand voice. The baseline expectation is usually a premium, professional, or welcoming tone.
    - Identify the 'primary_tone' (e.g., "Luxurious and serene", "Corporate and professional").
    - Determine if the tone 'is_consistent' (boolean true/false).
    - If the tone breaks (e.g., a sudden drop into highly informal slang, overly aggressive sales pitches, or disjointed formatting), list the jarring phrases in 'inconsistencies'. If perfectly consistent, return an empty array [].
    - THE "10-WORD RULE": Completely ignore any sentence or phrase that is fewer than 10 words long.

    Expected JSON Format:
    {
      "readability": {
        "score": 75,
        "complexity_level": "Moderate",
        "feedback": ["Sentences flow well with a good mix of lengths.", "Vocabulary is accessible but retains a premium feel."]
      },
      "tone": {
        "primary_tone": "Premium and welcoming",
        "is_consistent": true,
        "inconsistencies": []
      }
    }

    Text to analyze:
    "${safeText}"
  `;

  try {
    const response: any = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.1, // Slight flexibility allowed for tone analysis
        responseMimeType: "application/json"
      },
    });

    const rawOutput = typeof response.text === 'function' ? response.text() : (response.text || '{}');
    return JSON.parse(rawOutput);
  } catch (error) {
    console.error('Failed to run AI readability/tone check:', error);
    return {
      readability: { score: '--', complexity_level: 'Error', feedback: [] },
      tone: { primary_tone: 'Error', is_consistent: false, inconsistencies: [] }
    };
  }
}