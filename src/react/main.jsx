import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import { SiteHeader } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { CareerSection } from "./CareerSection";
import { PortfolioSection } from "./PortfolioSection";
import "../css/career.css";
import "../css/portfolio.css";
import { AboutSection } from "./AboutSection";
import { SkillsSection } from "./SkillsSection";
import { SocialLinks } from "./SocialLinks";
import { ContactCallout } from "./ContactCallout";
import { SiteFooter } from "./SiteFooter";
import { ContactDialog } from "./ContactDialog";
import "../css/shared.css";
import "../css/about.css";
import "../css/skills.css";
import "../css/callout-footer.css";
import "../css/contact.css";
import "../css/navigation.css";
import "../css/hero.css";

function App() {
  const [contactTrigger, setContactTrigger] = useState(/** @type {HTMLElement | null} */ (null));
  return (
    <>
      <div className="socials-desktop"><SocialLinks /></div>
      <header id="header"><SiteHeader onContact={setContactTrigger} /></header>
      <main className="main">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <CareerSection />
        <PortfolioSection />
      </main>
      <ContactCallout onContact={setContactTrigger} />
      <SiteFooter />
      {contactTrigger && <ContactDialog returnFocus={contactTrigger} onClose={() => setContactTrigger(null)} />}
    </>
  );
}

// Initialize once at the entry point, outside component rendering.
inject();

const root = createRoot(
  /** @type {HTMLElement} */ (document.getElementById("react-root")),
);
root.render(<App />);

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
