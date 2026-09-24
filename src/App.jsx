import React from "react";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { SkillsSection } from "./components/SkillsSection";
import { CareerSection } from "./components/CareerSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { LatestPosts } from "./components/LatestPosts";
import { SiteLayout } from "./components/SiteLayout";
import { ThemeProvider } from "./theme/ThemeProvider";

/** @param {{year: number}} props */
function PortfolioApp({ year }) {
  return (
    <SiteLayout year={year} homePage contactCallout>
      <main className="main">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <CareerSection />
        <PortfolioSection />
        <LatestPosts />
      </main>
    </SiteLayout>
  );
}

/** @param {{year: number}} props */
export function App({ year }) {
  return <ThemeProvider><PortfolioApp year={year} /></ThemeProvider>;
}
