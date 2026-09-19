import React from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { SiteHeader } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { SkillsSection } from "./SkillsSection";
import { SocialLinks } from "./SocialLinks";
import { ContactCallout } from "./ContactCallout";
import { SiteFooter } from "./SiteFooter";
import { openLegacyContact } from "../js/controller";
import "../css/shared.css";
import "../css/about.css";
import "../css/skills.css";
import "../css/callout-footer.css";
import "../scss/main.scss";
import "../css/navigation.css";
import "../css/hero.css";

// One React tree, with portals into slots beside the still-static sections.
const headerSlot = /** @type {HTMLElement} */ (
  document.getElementById("header")
);
const heroSlot = /** @type {HTMLElement} */ (
  document.getElementById("hero-root")
);
const desktopSocialsSlot = /** @type {HTMLElement} */ (
  document.getElementById("socials-desktop-root")
);
const aboutSlot = /** @type {HTMLElement} */ (
  document.getElementById("about-root")
);
const skillsSlot = /** @type {HTMLElement} */ (
  document.getElementById("skills-root")
);
const calloutSlot = /** @type {HTMLElement} */ (
  document.getElementById("callout-root")
);
const footerSlot = /** @type {HTMLElement} */ (
  document.getElementById("footer-root")
);

function App() {
  return (
    <>
      {createPortal(<SiteHeader onContact={openLegacyContact} />, headerSlot)}
      {createPortal(<HeroSection />, heroSlot)}
      {createPortal(<SocialLinks />, desktopSocialsSlot)}
      {createPortal(<AboutSection />, aboutSlot)}
      {createPortal(<SkillsSection />, skillsSlot)}
      {createPortal(
        <ContactCallout onContact={openLegacyContact} />,
        calloutSlot,
      )}
      {createPortal(<SiteFooter />, footerSlot)}
    </>
  );
}

const root = createRoot(
  /** @type {HTMLElement} */ (document.getElementById("react-root")),
);
root.render(<App />);

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
