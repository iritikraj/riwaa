
import Redis from 'ioredis';

const REDIS_HOST = '127.0.0.1'
const REDIS_PORT = 6379
const REDIS_PASSWORD = '@#$%RitikLovesSolvetude%$#@'

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD
});

console.log("Connecting to Redis...");
await redis.flushall();
console.log("✅ Ghost locks annihilated. Redis is completely clean.");
process.exit(0);