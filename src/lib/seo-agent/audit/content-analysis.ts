/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/lib/seo-agent/audit/content-analysis.ts
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

/**
 * Pings the self-hosted LanguageTool Docker container to check for grammar,
 * spelling, and style issues.
 */
// export async function checkGrammar(rawText: string) {
//   if (!rawText || rawText.trim() === '') return { total_errors: 0, issues: [] };

//   // Safety constraint for the t4g.small instance: Limit to 5,000 characters
//   const safeText = rawText.substring(0, 5000);

//   try {
//     // const url = `http://127.0.0.1:8010/v2/check`; // Use localhost for Docker container
//     const url = `https://api.languagetoolplus.com/v2/check`;
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams({
//         text: safeText,
//         language: 'en-US',
//       }),
//     });

//     // Gracefully handle the strict rate limits of the free tier
//     if (response.status === 429) {
//       console.warn('LanguageTool API Rate Limit Exceeded (429). You hit the 75k chars/min cap.');
//       return { total_errors: 0, issues: [], error: 'Rate limit exceeded on free tier' };
//     }

//     if (!response.ok) {
//       console.warn(`LanguageTool API responded with status: ${response.status}`);
//       return { total_errors: 0, issues: [], error: 'Grammar check failed' };
//     }

//     const data = await response.json();
//     const matches = data.matches || [];

//     // Map the raw data into a clean, readable format for the frontend
//     const formattedIssues = matches.map((match: any) => ({
//       message: match.message,
//       context: match.context?.text,
//       suggestions: match.replacements?.slice(0, 3).map((r: any) => r.value) || [],
//       rule_issue_type: match.rule?.issueType || 'unknown',
//     }));

//     return {
//       total_errors: matches.length,
//       issues: formattedIssues.slice(0, 20),
//     };
//   } catch (error) {
//     console.error('Failed to connect to local LanguageTool container:', error);
//     return { total_errors: 0, issues: [], error: 'Container unreachable' };
//   }
// }

/**
 * Pings the public free-tier LanguageTool API to check for grammar,
 * spelling, and style issues.
 */
export async function checkGrammar(rawText: string) {
  if (!rawText || rawText.trim() === '') return { total_errors: 0, issues: [] };

  const safeText = rawText.substring(0, 1500);

  try {
    // IMPORTANT: Using the .org community endpoint, not the .com premium endpoint
    const url = `https://api.languagetool.org/v2/check`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Adding a User-Agent helps prevent the free API from blocking the request
        'User-Agent': 'Riwaa-SEO-Audit-Demo/1.0',
      },
      body: new URLSearchParams({
        text: safeText,
        language: 'en-US',
      }),
    });

    // Gracefully handle strict rate limits
    if (response.status === 429) {
      console.warn('LanguageTool API Rate Limit Exceeded (429).');
      return { total_errors: 0, issues: [], error: 'Rate limit exceeded on free tier' };
    }

    if (!response.ok) {
      console.warn(`LanguageTool API responded with status: ${response.status}`);
      return { total_errors: 0, issues: [], error: 'Grammar check failed' };
    }

    const data = await response.json();
    const matches = data.matches || [];

    // Map the raw data into a clean, readable format for the frontend
    const formattedIssues = matches.map((match: any) => ({
      message: match.message,
      context: match.context?.text,
      suggestions: match.replacements?.slice(0, 3).map((r: any) => r.value) || [],
      rule_issue_type: match.rule?.issueType || 'unknown',
    }));

    return {
      total_errors: matches.length,
      issues: formattedIssues.slice(0, 20),
    };
  } catch (error) {
    console.error('Failed to connect to LanguageTool API:', error);
    return { total_errors: 0, issues: [], error: 'API unreachable' };
  }
}