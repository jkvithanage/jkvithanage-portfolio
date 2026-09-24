import { build } from "vite";
import { readFile, writeFile, readdir, cp, rm, mkdir } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { pathToFileURL } from "node:url";

await build();
await build({
  build: {
    ssr: "src/entry-server.jsx",
    outDir: "dist/.server",
    emptyOutDir: true,
  },
});

const serverDirectory = resolve("dist/.server");
const entry = (await readdir(serverDirectory)).find((name) => name.startsWith("entry-server."));
if (!entry) throw new Error("The server rendering entry was not built");
const { renderDocument, publishedBlogPosts } = await import(pathToFileURL(join(serverDirectory, entry)).href);
const template = await readFile("dist/index.html", "utf8");
const year = new Date().getFullYear();

const routes = [["/", "index.html"], ["/blog/", "blog/index.html"], ["/404.html", "404.html"],
  ...publishedBlogPosts.map(({ slug }) => [`/blog/${slug}/`, `blog/${slug}/index.html`])];
for (const [pathname, output] of routes) {
  const { content, head } = renderDocument(pathname, year);
  if (!template.includes("<!--page-metadata-->") || !template.includes("<!--page-content-->")) {
    throw new Error("The page rendering markers are missing from index.html");
  }
  const html = template
    .replace("<!--page-metadata-->", head)
    .replace('<div id="react-root">', `<div id="react-root" data-render-year="${year}">`)
    .replace("<!--page-content-->", content);
  await mkdir(dirname(resolve("dist", output)), { recursive: true });
  await writeFile(join("dist", output), html);
}

const siteUrl = "https://www.jkvithanage.com";
const sitemapRoutes = ["/", "/blog/", ...publishedBlogPosts.map(({ slug }) => `/blog/${slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((path) => {
  const post = publishedBlogPosts.find(({ slug }) => path === `/blog/${slug}/`);
  return `  <url><loc>${siteUrl}${path}</loc>${post ? `<lastmod>${post.date}</lastmod>` : ""}</url>`;
}).join("\n")}\n</urlset>\n`;
await writeFile("dist/sitemap.xml", sitemap);

// Vite copies public/ wholesale. Keep only Blog assets used by published posts.
await rm("dist/blog-assets", { recursive: true, force: true });
const publishedAssets = new Set(publishedBlogPosts.flatMap(({ assets }) => assets));
for (const asset of publishedAssets) {
  if (!asset.startsWith("/blog-assets/")) continue;
  const destination = resolve("dist", `.${asset}`);
  await mkdir(dirname(destination), { recursive: true });
  await cp(resolve("public", `.${asset}`), destination);
}

// The SSR bundle is only a build tool; browser documents use the client bundle.
const serverAssets = join(serverDirectory, "assets");
try {
  await cp(serverAssets, resolve("dist/assets"), { recursive: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
await rm(serverDirectory, { recursive: true, force: true });
