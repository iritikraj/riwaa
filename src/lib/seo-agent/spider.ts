import { CheerioCrawler, createCheerioRouter } from 'crawlee';

interface PageNode {
  url: string;
  title: string | null;
  h1: string | null;
  inboundLinkCount: number;
}

export async function runDomainSpider(startUrl: string) {
  // We use a Map to track how many times a URL is linked TO (for Orphan detection)
  const linkGraph = new Map<string, number>();
  const pageData: PageNode[] = [];

  const router = createCheerioRouter();

  router.addDefaultHandler(async ({ enqueueLinks, request, $, log }) => {
    log.info(`Spidering: ${request.loadedUrl}`);

    // Extract basic cannibalization metrics
    const title = $('title').text().trim() || null;
    const h1 = $('h1').first().text().trim() || null;

    pageData.push({
      url: request.loadedUrl || request.url,
      title,
      h1,
      inboundLinkCount: 0 // Will be calculated after the crawl finishes
    });

    // Find all internal links and add them to the queue
    const enqueued = await enqueueLinks({
      strategy: 'same-domain',
      transformRequestFunction(req) {
        // Strip tracking parameters to avoid duplicate crawling
        const urlObj = new URL(req.url);
        urlObj.search = '';
        urlObj.hash = '';
        req.url = urlObj.toString();

        // Track inbound links for Orphan Page detection
        const currentCount = linkGraph.get(req.url) || 0;
        linkGraph.set(req.url, currentCount + 1);

        return req;
      },
    });

    // UTILIZING ENQUEUED: Log exactly how many new, unique links this specific page yielded
    log.info(`Found ${enqueued.processedRequests.length} new internal links on ${request.loadedUrl}`);
  });

  const crawler = new CheerioCrawler({
    requestHandler: router,
    maxRequestsPerCrawl: 1000, // Safety limit for EC2 memory
    maxConcurrency: 10,       // Be polite to the target server
    failedRequestHandler({ request, log }) {
      log.error(`Spider failed to crawl ${request.url}`);
    },
  });

  console.log(`🚀 Initiating Domain Spider for: ${startUrl}`);
  await crawler.run([startUrl]);

  // Post-Crawl Processing: Attach the inbound link counts to finalize Orphan detection
  const finalMap = pageData.map(page => ({
    ...page,
    inboundLinkCount: linkGraph.get(page.url) || 0
  }));

  console.log(`✅ Spider complete. Mapped ${finalMap.length} pages.`);

  return finalMap;
}