// @ts-expect-error Vite supplies this build-time module from repository Markdown.
import posts from "virtual:blog-posts";

/** @typedef {{title: string, slug: string, description: string, date: string, draft: boolean, cover: string | null, coverAlt: string | null, html: string, assets: string[]}} BlogPost */
/** @type {BlogPost[]} */
export const blogPosts = posts;
