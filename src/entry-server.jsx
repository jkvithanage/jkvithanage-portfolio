import { renderToString } from "react-dom/server";
import { renderPageMetadata, renderPublicRoute } from "./publicRoutes";
import { blogPosts } from "./content/blogPosts";

export const publishedBlogPosts = blogPosts.filter((post) => !post.draft).map(({ slug, date, assets }) => ({ slug, date, assets }));

/** @param {string} pathname @param {number} year */
export function renderDocument(pathname, year) {
  const { page, metadata } = renderPublicRoute(pathname, year);
  return { content: renderToString(page), head: renderPageMetadata(metadata) };
}
