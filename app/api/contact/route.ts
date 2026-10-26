import { Resend } from "resend";
import { z } from "zod";
import {
  looksLikeSpam,
  normalizeEmailForDedupe,
  stripLineBreaks,
  type RejectReason,
} from "@/lib/contact-guard";
import { checkFormToken } from "@/lib/form-token";
import { allowSubmission } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * Contact form endpoint.
 *
 * Every field here is attacker-controlled. Checks run cheapest-first, and the
 * pipeline never sends mail to anything the submitter supplied: the only
 * recipient is EMAIL_TO from the environment; the submitter's address only
 * ever appears as Reply-To (after validation) and inside the escaped body.
 *
 *   honeypot -> signed render timestamp -> rate limit -> Turnstile
 *            -> schema validation -> content heuristics -> send
 *
 * Bot-signal rejections (honeypot, too fast, heuristics) return the normal
 * success response so the bot learns nothing. Rejections a real person could
 * hit (rate limit, Turnstile, bad input, stale page) return a real error.
 */

const MAX_BODY_CHARS = 20_000;

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(5000),
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const success = () => Response.json({ success: true });

// x-forwarded-for is set by Vercel's edge, so its first entry is the client.
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return ip.slice(0, 64);
}

// JSON.stringify escapes control characters, so attacker-controlled values
// can't forge extra log lines. Message bodies are deliberately never logged.
function logRejection(reason: RejectReason, ip: string, email: unknown) {
  console.warn(
    JSON.stringify({
      event: "contact_rejected",
      reason,
      ip,
      email:
        typeof email === "string"
          ? normalizeEmailForDedupe(email.slice(0, 254))
          : null,
    }),
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const raw = await request.text().catch(() => "");
  if (raw.length === 0 || raw.length > MAX_BODY_CHARS) {
    logRejection("validation", ip, null);
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    logRejection("validation", ip, null);
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // 1. Honeypot: invisible to people, tempting to bots.
  if (body.website) {
    logRejection("honeypot", ip, body.email);
    return success();
  }

  // 2. Signed render timestamp.
  const tokenSecret = process.env.FORM_TOKEN_SECRET;
  if (tokenSecret) {
    const tokenResult = checkFormToken(body.formToken, tokenSecret);
    if (tokenResult === "expired") {
      // A real person who left the tab open overnight: don't drop their message.
      logRejection("too_fast", ip, body.email);
      return Response.json(
        { error: "This page has expired. Please refresh and try again." },
        { status: 400 },
      );
    }
    if (tokenResult !== "ok") {
      logRejection("too_fast", ip, body.email);
      return success();
    }
  } else if (process.env.NODE_ENV === "production") {
    // Fail closed: without the secret we can't tell people from scripts.
    console.error("[contact] FORM_TOKEN_SECRET is not set; rejecting.");
    return Response.json({ error: "Service unavailable." }, { status: 503 });
  } else {
    console.warn("[contact] FORM_TOKEN_SECRET not set; skipping (dev only).");
  }

  // 3. Rate limit (before Turnstile so floods don't cost Cloudflare calls).
  if (!(await allowSubmission(ip))) {
    logRejection("rate_limit", ip, body.email);
    return Response.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  // 4. Cloudflare Turnstile.
  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    logRejection("turnstile", ip, body.email);
    return Response.json(
      { error: "Verification failed. Please refresh and try again." },
      { status: 400 },
    );
  }

  // 5. Schema validation: types, formats and length caps.
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    logRejection("validation", ip, body.email);
    return Response.json(
      { error: "Please check your details and try again." },
      { status: 400 },
    );
  }
  const { name, email, message } = parsed.data;

  // 6. Content heuristics (conservative; see lib/contact-guard.ts).
  if (looksLikeSpam({ name, message })) {
    logRejection("heuristic", ip, email);
    return success();
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromAddress =
      process.env.EMAIL_FROM || "Contact Form <onboarding@resend.dev>";
    const safeName = stripLineBreaks(name);
    const safeEmail = stripLineBreaks(email);

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      replyTo: safeEmail,
      to: process.env.EMAIL_TO as string,
      subject: `Contact from ${safeName} (${safeEmail})`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send email." }, { status: 500 });
    }

    console.log("Message sent:", data?.id);
    return success();
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json({ error: "Failed to send email." }, { status: 500 });
  }
}
