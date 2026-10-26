"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal typing for the parts of Cloudflare's Turnstile API we use.
type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      appearance: "interaction-only";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Signed "when was this form rendered" token from the server. The server
  // rejects submissions that arrive too fast or too late after it was issued.
  const formToken = useRef("");
  const turnstileToken = useRef("");
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidget = useRef<string | null>(null);

  const loadFormToken = useCallback(async () => {
    try {
      const res = await fetch("/api/contact/token", { cache: "no-store" });
      const data = await res.json();
      formToken.current = typeof data.token === "string" ? data.token : "";
    } catch {
      formToken.current = "";
    }
  }, []);

  useEffect(() => {
    loadFormToken();
  }, [loadFormToken]);

  // Turnstile runs in interaction-only mode: invisible unless Cloudflare
  // decides a visitor needs to be challenged.
  useEffect(() => {
    if (!SITE_KEY) return;

    const mount = () => {
      const container = turnstileContainer.current;
      if (!window.turnstile || !container || turnstileWidget.current) return;
      turnstileWidget.current = window.turnstile.render(container, {
        sitekey: SITE_KEY,
        appearance: "interaction-only",
        callback: (token) => {
          turnstileToken.current = token;
        },
        "expired-callback": () => {
          turnstileToken.current = "";
        },
        "error-callback": () => {
          turnstileToken.current = "";
        },
      });
    };

    if (window.turnstile) {
      mount();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SRC}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = TURNSTILE_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", mount);
    return () => script.removeEventListener("load", mount);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Honeypot: real people never see this field, so it is empty for them.
    const website = String(new FormData(e.currentTarget).get("website") ?? "");

    if (SITE_KEY && !turnstileToken.current) {
      alert("Still verifying you're human. Please try again in a moment.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          website,
          formToken: formToken.current,
          turnstileToken: turnstileToken.current,
        }),
      });
      if (response.ok) {
        alert("Thank you for your message! I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        alert(data.error || "Failed to send message. Please try again later.");
      }
    } catch {
      alert("Failed to send message. Please try again later.");
    } finally {
      // Turnstile tokens are single-use and the render token should restart
      // its clock, so refresh both for any follow-up message.
      turnstileToken.current = "";
      if (window.turnstile && turnstileWidget.current) {
        window.turnstile.reset(turnstileWidget.current);
      }
      loadFormToken();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="page-content">
      <div className="page-hero">
        <h1>Get In Touch</h1>

        <div className="contact-container">
          <div className="contact-info">
            <h2>Let&apos;s Connect</h2>
            <p>
              Have a project in mind or just want to say hello? I&apos;d love to hear
              from you.
            </p>

            <div className="contact-methods">
              <div className="contact-method">
                <h3>Email</h3>
                <a href="mailto:leo@oleo.dev">leo@oleo.dev</a>
              </div>

              <div className="contact-method">
                <h3>Socials</h3>
                <div className="social-links">
                  <a
                    href="https://github.com/leooladimu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/oleodev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Honeypot: off-screen and hidden from assistive tech. Bots fill
                it in; people can't reach it. */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div ref={turnstileContainer} />

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
