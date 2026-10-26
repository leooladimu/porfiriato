import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Per-IP rate limit: 5 submissions per hour.
 *
 * Uses Upstash Redis when configured (counts are shared across all serverless
 * instances). If Redis isn't configured, or errors at runtime, we fall back to
 * a per-instance in-memory limiter instead of failing the form: a Redis outage
 * should degrade protection, not take the contact form down.
 */

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

// The Vercel/Upstash integration injects KV_REST_API_*; a manual setup uses
// UPSTASH_REDIS_REST_*. Accept both.
const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const upstash =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(LIMIT, "1 h"),
        prefix: "contact-form",
      })
    : null;

const hits = new Map<string, number[]>();

function checkMemory(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}

if (!upstash && process.env.NODE_ENV === "production") {
  console.warn(
    "[contact] Upstash Redis is not configured; using per-instance in-memory rate limiting.",
  );
}

/** Returns true if this IP may submit, false if it is over the limit. */
export async function allowSubmission(ip: string): Promise<boolean> {
  if (!upstash) return checkMemory(ip);
  try {
    const { success } = await upstash.limit(ip);
    return success;
  } catch (error) {
    console.error("[contact] Upstash rate limit failed, using memory:", error);
    return checkMemory(ip);
  }
}
