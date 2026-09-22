// riwaa/src/workers/queue.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;
const isDevelopment = process.env.NODE_ENV === 'development';

// 1. Safe Redis Configuration
export const redisOptions = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    if (isDevelopment && times > 1) {
      console.warn('⚠️ Local Redis server not found. Queue worker resting in standby mode.');
      return null;
    }
    return Math.min(times * 100, 3000);
  }
};

const globalForRedis = globalThis as unknown as { redisConnection: IORedis };
export const redisConnection = globalForRedis.redisConnection || new IORedis(redisOptions);

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redisConnection = redisConnection;
}

redisConnection.on('error', (err: any) => {
  if (isDevelopment && err.code === 'ECONNREFUSED') return;
  console.error('Redis Connection Error:', err);
});

const globalForQueues = globalThis as unknown as {
  spiderQueue: Queue;
  aiAuditQueue: Queue;
  competitorQueue: Queue;
  complianceQueue: Queue;
  contentBriefQueue: Queue;
  developerAgentQueue: Queue;
  creativeAgentQueue: Queue;
};

export const spiderQueue = globalForQueues.spiderQueue || new Queue('domain-spider-queue', { connection: redisOptions });
export const aiAuditQueue = globalForQueues.aiAuditQueue || new Queue('ai-audit-queue', { connection: redisOptions });
export const competitorQueue = globalForQueues.competitorQueue || new Queue('competitor-audit-queue', { connection: redisOptions });
export const complianceQueue = globalForQueues.complianceQueue || new Queue('compliance-audit-queue', { connection: redisOptions });
export const contentBriefQueue = globalForQueues.contentBriefQueue || new Queue('content-brief-queue', { connection: redisOptions });
export const developerAgentQueue = globalForQueues.developerAgentQueue || new Queue('developer-agent-queue', { connection: redisOptions });
export const creativeAgentQueue = globalForQueues.creativeAgentQueue || new Queue('creative-agent-queue', { connection: redisOptions });

if (process.env.NODE_ENV !== 'production') {
  globalForQueues.spiderQueue = spiderQueue;
  globalForQueues.aiAuditQueue = aiAuditQueue;
  globalForQueues.competitorQueue = competitorQueue;
  globalForQueues.complianceQueue = complianceQueue;
  globalForQueues.contentBriefQueue = contentBriefQueue;
  globalForQueues.developerAgentQueue = developerAgentQueue;
  globalForQueues.creativeAgentQueue = creativeAgentQueue;
}