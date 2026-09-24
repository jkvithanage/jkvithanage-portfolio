import { build } from "vite";
import { readFile, writeFile, readdir, cp, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
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
const { renderDocument } = await import(pathToFileURL(join(serverDirectory, entry)).href);
const template = await readFile("dist/index.html", "utf8");
const year = new Date().getFullYear();

for (const [pathname, output] of [["/", "index.html"], ["/404.html", "404.html"]]) {
  const { content, head } = renderDocument(pathname, year);
  if (!template.includes("<!--page-metadata-->") || !template.includes("<!--page-content-->")) {
    throw new Error("The page rendering markers are missing from index.html");
  }
  const html = template
    .replace("<!--page-metadata-->", head)
    .replace('<div id="react-root">', `<div id="react-root" data-render-year="${year}">`)
    .replace("<!--page-content-->", content);
  await writeFile(join("dist", output), html);
}

// The SSR bundle is only a build tool; browser documents use the client bundle.
const serverAssets = join(serverDirectory, "assets");
try {
  await cp(serverAssets, resolve("dist/assets"), { recursive: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
await rm(serverDirectory, { recursive: true, force: true });
