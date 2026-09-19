import React, { useEffect, useRef, useState } from "react";

const siteKey = "6LeLGbwmAAAAAK2z7ZzW_hDef9Ll9RI2RCf0RglP";

/** @param {AbortSignal} signal @returns {Promise<string>} */
function acquireToken(signal) {
  // ready() is callback-based; neither readiness nor execute may be skipped.
  return new Promise((resolve, reject) => {
    const failure = new Error("Unable to verify reCAPTCHA. Please try again.");
    let settled = false;
    const timer = window.setTimeout(() => finish(failure), 15000);
    const abort = () => finish(signal.reason);
    /** @param {Error | null} error @param {string} [token] */
    function finish(error, token) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      if (error) reject(error);
      else resolve(token);
    }
    signal.addEventListener("abort", abort, { once: true });
    const captcha = /** @type {Window & {grecaptcha?: {ready: (callback: () => void) => void, execute: (key: string, options: {action: string}) => Promise<string>}}} */ (window).grecaptcha;
    if (!captcha) return finish(failure);
    try {
      captcha.ready(() => {
        if (settled || signal.aborted) return;
        Promise.resolve().then(() => captcha.execute(siteKey, { action: "submit" }))
          .then((token) => finish(token ? null : failure, token), () => finish(failure));
      });
    } catch {
      finish(failure);
    }
  });
}

export function ContactForm() {
  const [startedAt] = useState(() => String(Date.now()));
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const requestRef = useRef(/** @type {AbortController | null} */ (null));
  const successRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  /** @param {React.FormEvent<HTMLFormElement>} event */
  async function submit(event) {
    event.preventDefault();
    if (requestRef.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const request = new AbortController();
    requestRef.current = request;
    setError("");
    setStatus("pending");
    try {
      const token = await acquireToken(request.signal);
      request.signal.throwIfAborted();
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: request.signal,
        body: JSON.stringify({
          name: fields.get("name"), email: fields.get("email"),
          phone: fields.get("phone"), subject: fields.get("subject"),
          message: fields.get("message"), website: fields.get("website"),
          formStartedAt: startedAt, "g-recaptcha-response": token,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const messages = Array.isArray(data?.errors)
          ? data.errors.map((error) => error?.message).filter((message) => typeof message === "string").join(", ")
          : "";
        throw new Error(messages || "Unable to send your message. Please try again.");
      }
      setStatus("success");
    } catch (error) {
      if (request.signal.aborted) return;
      setError(error instanceof TypeError
        ? "Unable to connect. Please check your connection and try again."
        : error.message);
      setStatus("error");
    } finally {
      requestRef.current = null;
    }
  }

  if (status === "success") return (
    <div className="notice-success" role="status" tabIndex={-1} ref={successRef}>
      <span className="icon-success" aria-hidden="true" />
      <p>Thanks for contacting me. I will get back to you ASAP.</p>
    </div>
  );

  return (
    <form className="contact-form" action="/api/send-email" method="post" name="Contact Janaka Vithanage" onSubmit={submit}>
      <input className="contact-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="form-started-at" value={startedAt} />
      <p className="form-status" role="status" hidden={status !== "pending"}>{status === "pending" ? "Sending your message…" : ""}</p>
      {error && <p className="form-status" role="alert">{error}</p>}
      <label className="visually-hidden" htmlFor="name">Your Name</label>
      <input type="text" id="name" name="name" placeholder="Your Name" className="form-input" autoComplete="name" required />
      <div className="input-group">
        <label className="visually-hidden" htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" placeholder="Email Address" className="form-input" autoComplete="email" required />
        <label className="visually-hidden" htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" placeholder="Phone Number" className="form-input" autoComplete="tel" required />
      </div>
      <label className="visually-hidden" htmlFor="subject">Subject</label>
      <input type="text" id="subject" name="subject" placeholder="Subject" className="form-input" required />
      <label className="visually-hidden" htmlFor="message">Message</label>
      <textarea id="message" name="message" placeholder="Message" className="form-textarea" required />
      <button type="submit" className="btn btn-lg btn-black btn-form" disabled={status === "pending"}>{status === "pending" ? "Sending…" : "Send Message"}</button>
    </form>
  );
}
