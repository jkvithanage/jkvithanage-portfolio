import React from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { SiteHeader } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { openLegacyContact } from "../js/controller";
import "../css/shared.css";
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

function App() {
  return (
    <>
      {createPortal(<SiteHeader onContact={openLegacyContact} />, headerSlot)}
      {createPortal(<HeroSection />, heroSlot)}
    </>
  );
}

const root = createRoot(
  /** @type {HTMLElement} */ (document.getElementById("react-root")),
);
root.render(<App />);

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
