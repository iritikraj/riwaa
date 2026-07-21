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
const redisOptions = {
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

export const redisConnection = new IORedis(redisOptions);

redisConnection.on('error', (err: any) => {
  if (isDevelopment && err.code === 'ECONNREFUSED') return;
  console.error('Redis Connection Error:', err);
});

// 2. Export Queues (NO WORKER LOGIC HERE)
// These are imported by Next.js to add jobs to the Redis queue.
export const spiderQueue = new Queue('domain-spider-queue', { connection: redisConnection as any });
export const aiAuditQueue = new Queue('ai-audit-queue', { connection: redisConnection as any }); 
export const competitorQueue = new Queue('competitor-audit-queue', { connection: redisConnection as any });