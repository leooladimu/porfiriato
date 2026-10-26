import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { POST } from "@/app/api/contact/route";
import { issueFormToken } from "@/lib/form-token";

const SECRET = "test-form-secret";
const goodToken = () => issueFormToken(SECRET, Date.now() - 10_000);

const human = {
  name: "Ọládimú Adeyemi",
  email: "person@example.com",
  message: "Hi Leo, I would like a quote for a new website for my shop.",
};

let ipCounter = 0;
function request(body: unknown, overrides: Record<string, unknown> = {}) {
  const payload = {
    ...(body as object),
    formToken: goodToken(),
    turnstileToken: "good-token",
    website: "",
    ...overrides,
  };
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // Unique IP per request so the rate limiter doesn't bleed between tests.
      "x-forwarded-for": `10.0.0.${++ipCounter}`,
    },
    body: JSON.stringify(payload),
  });
}

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "abc" }, error: null });
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("EMAIL_TO", "owner@example.com");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "ts-secret");
  vi.stubEnv("FORM_TOKEN_SECRET", SECRET);
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init: { body: URLSearchParams }) => ({
      json: async () => ({ success: init.body.get("response") === "good-token" }),
    })),
  );
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("POST /api/contact", () => {
  it("sends one notification to the owner for a real submission", async () => {
    const res = await POST(request(human));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
    const args = send.mock.calls[0][0];
    expect(args.to).toBe("owner@example.com");
    expect(args.replyTo).toBe("person@example.com");
  });

  it("returns a fake success and sends nothing when the honeypot is filled", async () => {
    const res = await POST(request(human, { website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("returns a fake success and sends nothing for the observed bot payload", async () => {
    const res = await POST(
      request({
        name: "FuqMZALRvVitpZmk",
        email: "c.o.s.ir.e.c.e.s.7.3.7@gmail.com",
        message: "MoyrVLgGvvgEFSLGS",
      }),
    );
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("silently drops submissions made faster than 3 seconds after render", async () => {
    const res = await POST(
      request(human, { formToken: issueFormToken(SECRET, Date.now() - 500) }),
    );
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("silently drops a missing or forged token", async () => {
    for (const formToken of [undefined, "1700000000000.deadbeef", 12345]) {
      const res = await POST(request(human, { formToken }));
      expect(res.status).toBe(200);
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("asks a real user to refresh when the token is older than 24h", async () => {
    const old = issueFormToken(SECRET, Date.now() - 25 * 60 * 60 * 1000);
    const res = await POST(request(human, { formToken: old }));
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a missing Turnstile token without sending", async () => {
    const res = await POST(request(human, { turnstileToken: undefined }));
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a Turnstile token Cloudflare says is invalid", async () => {
    const res = await POST(request(human, { turnstileToken: "bad-token" }));
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects invalid input with 400 and sends nothing", async () => {
    for (const bad of [
      { ...human, email: "not-an-email" },
      { ...human, name: "x".repeat(101) },
      { ...human, message: "y ".repeat(2600) },
      { ...human, name: undefined },
    ]) {
      const res = await POST(request(bad));
      expect(res.status).toBe(400);
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("strips line breaks so a name cannot inject email headers", async () => {
    await POST(request({ ...human, name: "Bob\r\nBcc: victim@example.com" }));
    const args = send.mock.calls[0][0];
    expect(args.subject).not.toMatch(/[\r\n]/);
    expect(args).not.toHaveProperty("bcc");
    expect(args).not.toHaveProperty("cc");
    expect(args.to).toBe("owner@example.com");
  });

  it("never sends to a submitter-supplied address", async () => {
    await POST(
      request({ ...human, to: "victim@example.com", cc: "v2@example.com" }),
    );
    const args = send.mock.calls[0][0];
    expect(args.to).toBe("owner@example.com");
    expect(args.cc).toBeUndefined();
  });

  it("rate limits an IP after 5 submissions", async () => {
    const make = () =>
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" },
        body: JSON.stringify({
          ...human,
          formToken: goodToken(),
          turnstileToken: "good-token",
          website: "",
        }),
      });
    for (let i = 0; i < 5; i++) expect((await POST(make())).status).toBe(200);
    expect((await POST(make())).status).toBe(429);
  });

  it("rejects a non-JSON or oversized body", async () => {
    const junk = new Request("http://localhost/api/contact", {
      method: "POST",
      body: "not json",
    });
    expect((await POST(junk)).status).toBe(400);
    const huge = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ message: "a".repeat(100_000) }),
    });
    expect((await POST(huge)).status).toBe(400);
  });
});
