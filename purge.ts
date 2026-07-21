import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { spiderQueue, aiAuditQueue } from './src/lib/seo-agent/queue';

async function wipeQueues() {
  console.log('🧹 Wiping Domain Spider Queue...');
  // Force obliterate removes waiting, active, completed, and failed jobs
  await spiderQueue.obliterate({ force: true });

  console.log('🧹 Wiping AI Audit Queue...');
  await aiAuditQueue.obliterate({ force: true });

  console.log('✅ All queues completely cleared! You can now test your new URL.');
  process.exit(0);
}

wipeQueues().catch(console.error);