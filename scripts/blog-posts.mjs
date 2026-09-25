import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, language) {
    if (!language || !hljs.getLanguage(language)) return "";
    return `<pre class="hljs"><code class="language-${language}">${hljs.highlight(code, { language }).value}</code></pre>`;
  },
});

const requiredText = ["title", "slug", "description", "date"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function fail(file, message) {
  throw new Error(`${file}: ${message}`);
}

function localPath(url) {
  if (typeof url !== "string") return null;
  if (!url.startsWith("/") || url.startsWith("//")) return null;
  try {
    return decodeURIComponent(url.split(/[?#]/, 1)[0]);
  } catch {
    return null;
  }
}

async function validateAsset(url, { file, publicDirectory, draft, slug }) {
  const path = localPath(url);
  if (!path || path.includes("\\") || path.split("/").includes("..")) {
    fail(file, `use a root-relative local asset path: ${url}`);
  }
  if (draft && !path.startsWith(`/blog-assets/${slug}/`)) {
    fail(file, `draft assets must be stored under /blog-assets/${slug}/ so they can be excluded from production: ${url}`);
  }
  const target = resolve(publicDirectory, `.${path}`);
  if (!target.startsWith(`${publicDirectory}${sep}`)) fail(file, `invalid asset path: ${url}`);
  try {
    if (!(await stat(target)).isFile()) fail(file, `missing local asset: ${url}`);
  } catch (error) {
    if (error.code === "ENOENT") fail(file, `missing local asset: ${url}`);
    throw error;
  }
  return path;
}

async function validateMarkdown(tokens, context, links, assets) {
  for (const token of tokens) {
    if (token.type === "image") {
      const src = token.attrGet("src");
      if (!/^https?:\/\//.test(src)) assets.add(await validateAsset(src, context));
    }
    if (token.type === "link_open") {
      const href = token.attrGet("href");
      if (!/^(https?:|mailto:|#|\/)/.test(href) || href.startsWith("//")) fail(context.file, `use a root-relative or external link: ${href}`);
      const path = localPath(href);
      if (href.startsWith("/") && !path) fail(context.file, `invalid local link: ${href}`);
      if (path?.startsWith("/blog/") && path !== "/blog/") links.push(path);
      else if (path && path !== "/" && path !== "/blog/") assets.add(await validateAsset(href, context));
    }
    if (token.children) await validateMarkdown(token.children, context, links, assets);
  }
}

/** Read and validate the repository's Blog Posts before Vite bundles any content. */
export async function loadBlogPosts({ directory = "content/blog", publicDirectory = "public", includeDrafts = false } = {}) {
  const postsDirectory = resolve(directory);
  const assetsDirectory = resolve(publicDirectory);
  const files = (await readdir(postsDirectory)).filter((name) => name.endsWith(".md")).sort();
  const posts = [];
  const slugs = new Set();
  const allPosts = [];

  for (const name of files) {
    const file = join(postsDirectory, name);
    let parsed;
    try {
      parsed = matter(await readFile(file, "utf8"));
    } catch (error) {
      fail(file, `invalid front matter: ${error.message}`);
    }
    const { data, content } = parsed;
    for (const field of requiredText) {
      if (typeof data[field] !== "string" || !data[field].trim()) fail(file, `required metadata ${field} must be a non-empty string`);
    }
    if (!slugPattern.test(data.slug)) fail(file, `slug must use lowercase letters, digits, and single hyphens: ${data.slug}`);
    if (slugs.has(data.slug)) fail(file, `duplicate slug: ${data.slug}`);
    slugs.add(data.slug);
    const parsedDate = typeof data.date === "string" && datePattern.test(data.date) ? new Date(`${data.date}T00:00:00Z`) : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== data.date) {
      fail(file, `date must be a real YYYY-MM-DD date: ${data.date}`);
    }
    if (typeof data.draft !== "boolean") fail(file, "draft must be true or false");
    const context = { file, publicDirectory: assetsDirectory, draft: data.draft, slug: data.slug };
    const assets = new Set();
    if (data.cover !== undefined) {
      if (typeof data.cover !== "string" || !data.cover.trim()) fail(file, "cover must be a local asset path");
      if (typeof data.coverAlt !== "string" || !data.coverAlt.trim()) fail(file, "coverAlt is required when cover is set");
      assets.add(await validateAsset(data.cover, context));
    }
    const tokens = markdown.parse(content, {});
    const links = [];
    await validateMarkdown(tokens, context, links, assets);
    allPosts.push({ file, slug: data.slug, draft: data.draft, links, assets });
    if (data.draft && !includeDrafts) continue;
    posts.push({
      title: data.title.trim(), slug: data.slug, description: data.description.trim(),
      date: data.date, draft: data.draft, cover: data.cover || null,
      coverAlt: data.coverAlt || null, html: markdown.renderer.render(tokens, markdown.options, {}),
      assets: [...assets],
    });
  }
  const draftSlugs = new Set(allPosts.filter(({ draft }) => draft).map(({ slug }) => slug));
  for (const post of allPosts) {
    if (post.draft) continue;
    for (const asset of post.assets) {
      const owner = /^\/blog-assets\/([^/]+)\//.exec(asset)?.[1];
      if (draftSlugs.has(owner)) fail(post.file, `published Blog Post references a draft asset: ${asset}`);
    }
    for (const path of post.links) {
      const match = /^\/blog\/([a-z0-9-]+)\/$/.exec(path);
      if (!match || !slugs.has(match[1])) fail(post.file, `Blog Post link has no target: ${path}`);
      if (!posts.some(({ slug }) => slug === match[1])) fail(post.file, `published Blog Post links to a draft: ${path}`);
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
