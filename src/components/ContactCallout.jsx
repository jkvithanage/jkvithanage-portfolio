import React from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

/** @param {{onContact: (returnFocus: HTMLElement) => void}} props */
export function ContactCallout({ onContact }) {
  const revealRef = useScrollReveal();

  return (
    <section className="section-full callout" ref={revealRef}>
      <div className="callout-content">
        <p className="callout-message">
          Let me know if you're interested in working together or just say hello
          to me.
        </p>
        <button
          className="btn btn-lg btn-solid btn-contact"
          type="button"
          aria-label="Open contact form to send a message to Janaka"
          onClick={(event) => onContact(event.currentTarget)}
        >
          Get in touch
        </button>
      </div>
    </section>
  );
}
