import React from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import { App } from "./App";
import "./styles/shared.css";
import "./styles/about.css";
import "./styles/skills.css";
import "./styles/career.css";
import "./styles/portfolio.css";
import "./styles/callout-footer.css";
import "./styles/contact.css";
import "./styles/navigation.css";
import "./styles/hero.css";

inject();

const root = createRoot(
  /** @type {HTMLElement} */ (document.getElementById("react-root")),
);
root.render(<App />);

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
