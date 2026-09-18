import React from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { SiteHeader } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { CareerSection } from "./CareerSection";
import { PortfolioSection } from "./PortfolioSection";
import { openLegacyContact } from "../js/controller";
import "../css/shared.css";
import "../scss/main.scss";
import "../css/navigation.css";
import "../css/hero.css";
import "../css/career.css";
import "../css/portfolio.css";

// One React tree, with portals into slots beside the still-static sections.
const headerSlot = /** @type {HTMLElement} */ (
  document.getElementById("header")
);
const heroSlot = /** @type {HTMLElement} */ (
  document.getElementById("hero-root")
);
const careerSlot = /** @type {HTMLElement} */ (
  document.getElementById("career-root")
);
const portfolioSlot = /** @type {HTMLElement} */ (
  document.getElementById("portfolio-root")
);

function App() {
  return (
    <>
      {createPortal(<SiteHeader onContact={openLegacyContact} />, headerSlot)}
      {createPortal(<HeroSection />, heroSlot)}
      {createPortal(<CareerSection />, careerSlot)}
      {createPortal(<PortfolioSection />, portfolioSlot)}
    </>
  );
}

const root = createRoot(
  /** @type {HTMLElement} */ (document.getElementById("react-root")),
);
root.render(<App />);

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
