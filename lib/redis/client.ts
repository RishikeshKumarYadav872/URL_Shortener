import { Redis } from "@upstash/redis";

function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("⚠️ Redis not configured. Running without cache.");
    return null;
  }

  return new Redis({ url, token });
}

export const redis = createRedisClient();
export default redis;
