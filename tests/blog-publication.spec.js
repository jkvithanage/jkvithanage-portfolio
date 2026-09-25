import { expect, test } from "@playwright/test";
import { readFile, readdir, stat } from "node:fs/promises";

test.skip(!process.env.BLOG_TEST_FIXTURES || !process.env.PLAYWRIGHT_TEST_BUILD, "Requires a fixture production build");

test("published posts are newest first on the Blog and homepage", async ({ request }) => {
  for (const path of ["/", "/blog/"]) {
    const html = await (await request.get(path)).text();
    expect(html.indexOf('href="/blog/newer-post/"')).toBeLessThan(html.indexOf('href="/blog/older-post/"'));
    expect(html).not.toContain("Secret unpublished post");
  }
});

test("a published post is complete static HTML with article metadata and working assets", async ({ request, page }) => {
  const response = await request.get("/blog/newer-post/");
  const html = await response.text();
  expect(response.status()).toBe(200);
  expect(html).toContain("Newer published post");
  expect(html).toContain('class="hljs"');
  expect(html).toContain("<table>");
  expect(html).toContain('href="/blog/older-post/"');
  expect(html).toContain('<link rel="canonical" href="https://www.jkvithanage.com/blog/newer-post/"');
  expect(html).toContain('property="og:type" content="article"');
  expect(html).toContain('property="article:published_time" content="2026-06-20"');
  expect(html).toContain('name="twitter:title" content="Newer published post"');
  expect(html).toContain('type="application/ld+json"');
  expect(html).toContain('"@type":"BlogPosting"');
  expect(await readFile("dist/blog/newer-post/index.html", "utf8")).toBe(html);
  expect((await request.get("/blog-assets/newer-post/diagram.svg")).ok()).toBeTruthy();
  expect((await request.get("/blog-assets/shared/cover.svg")).ok()).toBeTruthy();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|did not match|server rendered/i.test(message.text())) errors.push(message.text());
  });
  await page.goto("/blog/newer-post/");
  await expect(page.getByRole("heading", { level: 1, name: "Newer published post" })).toBeVisible();
  await page.getByRole("link", { name: "older post" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Older published post" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("draft pages, content, assets, and sitemap entries are absent from production", async () => {
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  expect(sitemap).toContain("https://www.jkvithanage.com/blog/newer-post/");
  expect(sitemap).toContain("https://www.jkvithanage.com/blog/older-post/");
  expect(sitemap).not.toContain("unpublished-post");
  await expect(stat("dist/blog/unpublished-post/index.html")).rejects.toMatchObject({ code: "ENOENT" });
  await expect(stat("dist/blog-assets/example-post/diagram.svg")).rejects.toMatchObject({ code: "ENOENT" });
  await expect(stat("dist/blog-assets/unpublished-post/secret.svg")).rejects.toMatchObject({ code: "ENOENT" });
  for (const name of await readdir("dist/assets")) {
    if (!name.endsWith(".js")) continue;
    const js = await readFile(`dist/assets/${name}`, "utf8");
    expect(js).not.toContain("Secret draft body marker");
    expect(js).not.toContain("Secret unpublished post");
  }
});
