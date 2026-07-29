// src/lib/seo-agent/content-brief/gcp-entities.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger as defaultLogger } from '@/lib/logs/logger';
import type { Logger } from 'pino';

export async function fetchGcpKnowledgeGraphEntities(topic: string, parentLogger: Logger = defaultLogger) {
  const kgLogger = parentLogger.child({ module: 'gcp_knowledge_graph', topic });
  const apiKey = process.env.GOOGLE_PSI_API_KEY;

  if (!apiKey) {
    kgLogger.warn({ event: 'missing_gcp_api_key' }, 'GOOGLE_PSI_API_KEY is missing. Skipping entity extraction.');
    return [];
  }

  try {
    kgLogger.info({ event: 'kg_request_started' });

    const url = `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(topic)}&key=${apiKey}&limit=10&indent=true`;

    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Knowledge Graph API Error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const items = data.itemListElement || [];

    const entities = items.map((item: any) => {
      const result = item.result;
      return {
        name: result.name,
        description: result.description || result.detailedDescription?.articleBody || '',
        types: result['@type'] || []
      };
    });

    kgLogger.info({ event: 'kg_request_success', count: entities.length });
    return entities;

  } catch (error: any) {
    kgLogger.error({ event: 'kg_request_failed', err: error }, 'Failed to fetch Knowledge Graph entities.');
    return [];
  }
}