import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/lib/redis/client";

// Only create rate limiters if Redis is configured
export const shortenRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 m"),
      analytics: true,
      prefix: "ratelimit:shorten",
    })
  : null;

export const analyticsRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(120, "1 m"),
      analytics: true,
      prefix: "ratelimit:analytics",
    })
  : null;

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; remaining?: number; reset?: number }> {
  if (!limiter) return { success: true };

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (e) {
    console.error("Rate limit check error:", e);
    // Fail open if rate limiter is broken
    return { success: true };
  }
}
