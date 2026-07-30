export async function fetchPageSpeedData(url: string) {
  // NEW: Strip any accidental leading/trailing spaces to prevent 400 Invalid Argument errors
  url = url.trim();

  const apiKey = process.env.GOOGLE_PSI_API_KEY || '';
  const strategy = 'mobile';

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=${strategy}${apiKey ? `&key=${apiKey}` : ''}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`PageSpeed API failed with status: ${response.status}. Details: ${errorText}`);
      return null;
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) return null;

    // 1. Extract the Core Category Scores (Multiplying by 100 to match your UI)
    const scores = {
      performance: lighthouse.categories?.performance?.score * 100 || 'Unknown',
      accessibility: lighthouse.categories?.accessibility?.score * 100 || 'Unknown',
      best_practices: lighthouse.categories?.['best-practices']?.score * 100 || 'Unknown',
      seo: lighthouse.categories?.seo?.score * 100 || 'Unknown',
    };

    // 2. Extract Core Web Vitals
    const web_vitals = {
      first_contentful_paint: lighthouse.audits['first-contentful-paint']?.displayValue || 'Unknown',
      largest_contentful_paint: lighthouse.audits['largest-contentful-paint']?.displayValue || 'Unknown',
      cumulative_layout_shift: lighthouse.audits['cumulative-layout-shift']?.displayValue || 'Unknown',
      total_blocking_time: lighthouse.audits['total-blocking-time']?.displayValue || 'Unknown',
      speed_index: lighthouse.audits['speed-index']?.displayValue || 'Unknown',
    };

    // 3. Extract Specific Diagnostics & Opportunities
    const rawAudits = lighthouse.audits;
    const diagnostics: string[] = [];

    for (const key in rawAudits) {
      const audit = rawAudits[key];
      if (audit.score !== null && audit.score < 1 && audit.displayValue) {
        diagnostics.push(`${audit.title} - ${audit.displayValue}`);
      } else if (audit.score !== null && audit.score < 1 && audit.details?.type === 'opportunity') {
        diagnostics.push(audit.title);
      }
    }

    const compiledData = {
      scores,
      web_vitals,
      critical_diagnostics: diagnostics.slice(0, 15)
    };

    console.log(`Expanded PageSpeed data fetched for ${url}. Issues found: ${compiledData.critical_diagnostics.length}`);
    return compiledData;

  } catch (error) {
    console.error("Failed to fetch PageSpeed data:", error);
    return null;
  }
}