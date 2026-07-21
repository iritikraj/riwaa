import { spiderWorker } from "@/lib/seo-agent/worker";

console.log('🕷️ Domain Spider Worker successfully booted and listening to Redis queue...');

// Graceful shutdown logic for PM2 restarts
process.on('SIGTERM', async () => {
  console.log('Shutting down spider worker gracefully...');
  await spiderWorker.close();
  process.exit(0);
});