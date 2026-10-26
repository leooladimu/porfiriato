import { describe, expect, it } from "vitest";
import {
  looksLikeSpam,
  normalizeEmailForDedupe,
  stripLineBreaks,
} from "@/lib/contact-guard";

describe("looksLikeSpam", () => {
  it("rejects the observed bot submission", () => {
    // Real payload from the form logs: random mixed-case strings, no spaces.
    expect(
      looksLikeSpam({ name: "FuqMZALRvVitpZmk", message: "MoyrVLgGvvgEFSLGS" }),
    ).toBe("heuristic");
  });

  it("rejects a gibberish name even with a decent message", () => {
    expect(
      looksLikeSpam({
        name: "FuqMZALRvVitpZmk",
        message: "I would like a quote for a new website please",
      }),
    ).toBe("heuristic");
  });

  it("rejects messages that are too short", () => {
    expect(looksLikeSpam({ name: "Ada", message: "hi" })).toBe("heuristic");
  });

  it("rejects a long message with no spaces", () => {
    expect(
      looksLikeSpam({ name: "Ada Lovelace", message: "abcdefghijklmnop" }),
    ).toBe("heuristic");
  });

  it("rejects messages with more than two URLs", () => {
    expect(
      looksLikeSpam({
        name: "Ada Lovelace",
        message:
          "check https://a.example and https://b.example and www.c.example now",
      }),
    ).toBe("heuristic");
  });

  it.each([
    ["Ọládimú", "Hello Leo, I would like to talk about a project."],
    ["Mary-Jane O'Neil", "Can you build a site for my bakery in Joshua Tree?"],
    ["Cher", "Do you take on freelance work for small businesses?"],
    ["Li", "Quick question about your rates for a landing page."],
    ["Mary Smith", "Need help, please call me"],
    ["DeShawnMcKinley", "Looking for a developer for our team, are you free?"],
    ["Zoë Müller", "Hallo! I found your site and love the work you do."],
    ["Ada Lovelace", "See my portfolio at https://example.com when you can."],
  ])("lets a real person through: %s", (name, message) => {
    expect(looksLikeSpam({ name, message })).toBeNull();
  });
});

describe("normalizeEmailForDedupe", () => {
  it("strips dots from the observed bot address", () => {
    expect(normalizeEmailForDedupe("c.o.s.ir.e.c.e.s.7.3.7@gmail.com")).toBe(
      "cosireces737@gmail.com",
    );
  });

  it("drops +suffixes and lowercases", () => {
    expect(normalizeEmailForDedupe("Leo.O+news@Gmail.com")).toBe(
      "leoo@gmail.com",
    );
  });

  it("treats googlemail.com as gmail.com", () => {
    expect(normalizeEmailForDedupe("a.b@googlemail.com")).toBe("ab@gmail.com");
  });

  it("leaves other providers' dots alone", () => {
    expect(normalizeEmailForDedupe("first.last@Example.com")).toBe(
      "first.last@example.com",
    );
  });

  it("does not throw on junk", () => {
    expect(normalizeEmailForDedupe("not-an-email")).toBe("not-an-email");
  });
});

describe("stripLineBreaks", () => {
  it("removes CR and LF so a value cannot inject headers", () => {
    expect(stripLineBreaks("Bob\r\nBcc: victim@example.com")).toBe(
      "Bob Bcc: victim@example.com",
    );
  });
});
