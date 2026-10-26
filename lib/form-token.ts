import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed render-time token for the "too fast" check.
 *
 * The page is static, so the server can't stamp the render time into the HTML.
 * Instead the form fetches a token from /api/contact/token on mount. The token
 * is "<issuedAtMs>.<hmac>", so the server can later trust the timestamp
 * without storing anything: a bot can't forge an old timestamp without the
 * secret. It is NOT single-use; replay inside the 24h window is stopped by the
 * rate limit and Turnstile, not by this check.
 */

export const MIN_AGE_MS = 3_000;
export const MAX_AGE_MS = 24 * 60 * 60 * 1000;

const sign = (secret: string, issuedAt: string) =>
  createHmac("sha256", secret).update(issuedAt).digest("hex");

export function issueFormToken(secret: string, now = Date.now()): string {
  const issuedAt = String(now);
  return `${issuedAt}.${sign(secret, issuedAt)}`;
}

export type TokenCheck = "ok" | "too_fast" | "invalid" | "expired";

export function checkFormToken(
  token: unknown,
  secret: string,
  now = Date.now(),
): TokenCheck {
  // The token is attacker-controlled: type-check and shape-check before use.
  if (typeof token !== "string" || token.length > 200) return "invalid";
  const [issuedAt, mac, ...rest] = token.split(".");
  if (!issuedAt || !mac || rest.length > 0 || !/^\d{10,16}$/.test(issuedAt)) {
    return "invalid";
  }

  const expected = Buffer.from(sign(secret, issuedAt));
  const given = Buffer.from(mac);
  // timingSafeEqual throws on length mismatch, so compare lengths first.
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return "invalid";
  }

  const age = now - Number(issuedAt);
  if (age < MIN_AGE_MS) return "too_fast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}
