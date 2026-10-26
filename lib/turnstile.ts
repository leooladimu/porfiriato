/**
 * Server-side Cloudflare Turnstile verification.
 *
 * The widget token comes from the browser and is attacker-controlled; it only
 * means something once Cloudflare confirms it. In production a missing secret
 * or an unreachable Cloudflare fails CLOSED (rejects): silently accepting
 * would turn the main bot defense into a no-op.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: unknown,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] TURNSTILE_SECRET_KEY is not set; rejecting.");
      return false;
    }
    console.warn("[contact] TURNSTILE_SECRET_KEY not set; skipping (dev only).");
    return true;
  }

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return false;
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[contact] Turnstile verification failed:", error);
    return false;
  }
}
