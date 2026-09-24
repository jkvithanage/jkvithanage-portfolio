import { createRoot, hydrateRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import { renderPageMetadata, renderPublicRoute } from "./publicRoutes";
import "./styles/shared.css";
import "./styles/about.css";
import "./styles/skills.css";
import "./styles/career.css";
import "./styles/portfolio.css";
import "./styles/callout-footer.css";
import "./styles/contact.css";
import "./styles/navigation.css";
import "./styles/hero.css";
import "./styles/blog.css";

inject();

const container = /** @type {HTMLElement} */ (document.getElementById("react-root"));
const year = Number(container.dataset.renderYear) || new Date().getFullYear();
const { page, metadata } = renderPublicRoute(window.location.pathname, year);
if (!document.querySelector('meta[name="description"]')) {
  document.head.insertAdjacentHTML("beforeend", renderPageMetadata(metadata));
}
const hasStaticContent = container.children.length > 0;
const root = hasStaticContent
  ? hydrateRoot(container, page)
  : createRoot(container);
if (!hasStaticContent) root.render(page);

if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
