import React, { useState } from "react";
import { SiteHeader } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { SkillsSection } from "./components/SkillsSection";
import { CareerSection } from "./components/CareerSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { SocialLinks } from "./components/SocialLinks";
import { ContactCallout } from "./components/ContactCallout";
import { SiteFooter } from "./components/SiteFooter";
import { ContactDialog } from "./components/ContactDialog";
import { ThemeProvider } from "./theme/ThemeProvider";

function PortfolioApp() {
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

export function App() {
  return <ThemeProvider><PortfolioApp /></ThemeProvider>;
}
