/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { Queue } from 'bullmq';
import { redisConnection, spiderQueue, aiAuditQueue, contentBriefQueue, developerAgentQueue } from './src/lib/seo-agent/queue';

const competitorQueue = new Queue('competitor-audit-queue', { connection: redisConnection as any });
const complianceQueue = new Queue('compliance-audit-queue', { connection: redisConnection as any });

async function wipeQueues() {
  console.log('🧹 Wiping Domain Spider Queue...');
  await spiderQueue.obliterate({ force: true });

  console.log('🧹 Wiping AI Audit Queue...');
  await aiAuditQueue.obliterate({ force: true });

  console.log('🧹 Wiping Competitor Audit Queue...');
  await competitorQueue.obliterate({ force: true });

  console.log('🧹 Wiping Compliance Audit Queue...');
  await complianceQueue.obliterate({ force: true });

  console.log('🧹 Wiping Content Brief Queue...');
  await contentBriefQueue.obliterate({ force: true });

  console.log('🧹 Wiping Developer Agent Queue...');
  await developerAgentQueue.obliterate({ force: true });
  process.exit(0);
}

wipeQueues().catch(console.error);