export async function register() {
  // We strictly check for 'nodejs' so it doesn't accidentally try to run 
  // BullMQ on the Vercel Edge network or browser client environments.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('🤖 Next.js Server Booting: Initializing BullMQ Background Workers...');

    // Dynamically import the worker file so it executes and starts listening to Redis
    await import('./lib/seo-agent/worker');
  }
}