import { renderToString } from "react-dom/server";
import { renderPageMetadata, renderPublicRoute } from "./publicRoutes";

/** @param {string} pathname @param {number} year */
export function renderDocument(pathname, year) {
  const { page, metadata } = renderPublicRoute(pathname, year);
  return { content: renderToString(page), head: renderPageMetadata(metadata) };
}
