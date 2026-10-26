/**
 * Pure helpers for the contact form's spam defenses.
 *
 * Everything here takes untrusted strings (they come straight from the
 * request body) and returns plain values, so it is trivially unit-testable
 * and has no side effects. The Route Handler decides what to do with them.
 */

export type RejectReason =
  | "honeypot"
  | "too_fast"
  | "turnstile"
  | "rate_limit"
  | "heuristic"
  | "validation";

const URL_PATTERN = /(https?:\/\/|www\.)\S+/gi;

/**
 * Light-touch content heuristics. Returns "heuristic" when the submission
 * looks machine-generated, otherwise null.
 *
 * These are deliberately conservative: real names are messy (non-ASCII,
 * hyphens, single names, "DeShawnMcKinley"), and a false positive silently
 * drops a real person's message. Turnstile and the rate limit do the heavy
 * lifting; this only catches the obvious random-string wave.
 */
export function looksLikeSpam(input: {
  name: string;
  message: string;
}): "heuristic" | null {
  const name = input.name.trim();
  const message = input.message.trim();

  // Random mixed-case token, e.g. "FuqMZALRvVitpZmk": one token, letters and
  // digits only, long, and with a high share of capitals. The ratio keeps
  // camel-cased human names ("DeShawnMcKinley" ≈ 27%) below the line while
  // the bot samples sit around 50%.
  if (/^[A-Za-z0-9]{12,}$/.test(name)) {
    const upper = (name.match(/[A-Z]/g) ?? []).length;
    const hasLower = /[a-z]/.test(name);
    if (hasLower && upper / name.length >= 0.35) return "heuristic";
  }

  if (message.length < 10) return "heuristic";

  // A real message of any length has spaces; a long unbroken string is noise.
  if (message.length > 12 && !/\s/.test(message)) return "heuristic";

  // Link-dump spam. One or two links is normal ("here's my current site").
  if ((message.match(URL_PATTERN) ?? []).length > 2) return "heuristic";

  return null;
}

/**
 * Canonical form of an email for logging and dedupe ONLY. Never use this for
 * display or delivery: Gmail ignores dots and "+tags", so the bot's
 * "c.o.s.ir.e.c.e.s.7.3.7@gmail.com" and "cosireces737@gmail.com" are the
 * same mailbox. We collapse them so logs and rate analysis see one identity.
 */
export function normalizeEmailForDedupe(email: string): string {
  const lowered = email.trim().toLowerCase();
  const at = lowered.lastIndexOf("@");
  if (at < 1) return lowered;

  let local = lowered.slice(0, at);
  let domain = lowered.slice(at + 1);

  if (domain === "gmail.com" || domain === "googlemail.com") {
    domain = "gmail.com";
    local = local.split("+")[0].replace(/\./g, "");
  }
  return `${local}@${domain}`;
}

/**
 * Replace CR/LF with a space. Anything that ends up in an email header
 * (subject, reply-to) must not contain line breaks, or an attacker can
 * append their own headers (e.g. "Bcc: victim@example.com").
 */
export function stripLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}
