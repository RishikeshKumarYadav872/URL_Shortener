import redis from "./client";

export interface CachedUrl {
  id: string;
  slug: string;
  destination: string;
  expiresAt: string | null;
  isActive: boolean;
}

const CACHE_PREFIX = "url:";
const DEFAULT_TTL = 60 * 60 * 24; // 24 hours

function cacheKey(slug: string, host?: string): string {
  return `${CACHE_PREFIX}${host || "default"}:${slug}`;
}

export async function getCachedUrl(
  slug: string,
  host?: string
): Promise<CachedUrl | null> {
  if (!redis) return null;
  try {
    const data = await redis.get<CachedUrl>(cacheKey(slug, host));
    return data;
  } catch (e) {
    console.error("Redis GET error:", e);
    return null;
  }
}

export async function setCachedUrl(
  data: CachedUrl,
  host?: string
): Promise<void> {
  if (!redis) return;
  try {
    let ttl = DEFAULT_TTL;
    if (data.expiresAt) {
      const timeUntilExpiry = Math.floor(
        (new Date(data.expiresAt).getTime() - Date.now()) / 1000
      );
      if (timeUntilExpiry <= 0) return; // don't cache expired
      ttl = Math.min(ttl, timeUntilExpiry);
    }
    await redis.set(cacheKey(data.slug, host), data, { ex: ttl });
  } catch (e) {
    console.error("Redis SET error:", e);
  }
}

export async function invalidateCachedUrl(
  slug: string,
  host?: string
): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(cacheKey(slug, host));
  } catch (e) {
    console.error("Redis DEL error:", e);
  }
}
