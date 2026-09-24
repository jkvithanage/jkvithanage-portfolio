import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { preparePage } from "./prepare-page";

test.skip(!process.env.PLAYWRIGHT_TEST_BUILD, "Checks generated production documents");

function captureHydrationErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|did not match|server rendered/i.test(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("the generated home document exposes portfolio content and metadata without JavaScript", async ({ request }) => {
  const response = await request.get("/");
  const html = await response.text();

  expect(response.status()).toBe(200);
  expect(html).toContain('<main class="main">');
  expect(html).toContain("Janaka Vithanage");
  expect(html).toContain('id="portfolio"');
  expect(html).toContain('<link rel="canonical" href="https://www.jkvithanage.com/"');
  expect(html).toContain('src="https://www.googletagmanager.com/gtag/js?id=G-0FCTN85P7Y"');
  expect(html).toMatch(/src="\/assets\/index-[^"]+\.js"/);
});

test("the generated not-found document has its own content and metadata", async () => {
  const html = await readFile("dist/404.html", "utf8");

  expect(html).toContain("Page not found");
  expect(html).toContain("<title>Page not found");
  expect(html).toContain('name="robots" content="noindex"');
  expect(html).not.toContain('id="portfolio"');
});

test("the generated blog index is a complete, discoverable empty state", async ({ request }) => {
  const response = await request.get("/blog/");
  const html = await response.text();

  expect(response.status()).toBe(200);
  expect(html).toContain('<h1');
  expect(html).toContain("Articles are coming soon");
  expect(html).toContain('<link rel="canonical" href="https://www.jkvithanage.com/blog/"');
  expect(html).toContain("<title>Blog | Janaka Vithanage</title>");
  expect(html).toContain('name="description" content="Technical articles by Janaka Vithanage are coming soon."');
  expect(html).toContain('property="og:url" content="https://www.jkvithanage.com/blog/"');
  expect(html).toContain('href="/#about"');
  expect(html).not.toContain('href="/blog/coming-soon/"');
  expect(await readFile("dist/blog/index.html", "utf8")).toBe(html);
});

test("the generated homepage links to Blog and previews the empty state", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const latest = html.indexOf('id="latest-posts"');
  const contact = html.indexOf('class="callout');

  expect(html).toContain('href="/blog/"');
  expect(latest).toBeGreaterThan(0);
  expect(contact).toBeGreaterThan(latest);
  expect(html).toContain("Articles are coming soon");
  expect(html).not.toContain('href="/blog/coming-soon/"');
});

test("the portfolio stays readable with the client bundle blocked", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/\/assets\/[^/]+\.js$/, (route) => route.abort());
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Janaka Vithanage", exact: true })).toBeVisible();
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#career")).toBeVisible();
  await expect(page.locator("#portfolio")).toBeVisible();
  await page.goto("/blog/");
  await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
  await expect(page.getByText("Articles are coming soon.")).toBeVisible();
});

test("the generated home hydrates without warnings and keeps the selected theme", async ({ page, isMobile }) => {
  const hydrationErrors = captureHydrationErrors(page);
  await page.addInitScript(() => localStorage.setItem("portfolio-theme", "dark"));
  await preparePage(page);

  expect(hydrationErrors).toEqual([]);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const navigation = page.getByRole("navigation");
  if (isMobile) await navigation.getByRole("button", { name: "Navigation menu toggler" }).click();
  await expect(navigation.getByRole("button", { name: "Dark theme" })).toHaveAttribute("aria-pressed", "true");
});

test("the Blog works on desktop and mobile after a direct load", async ({ page, isMobile }, testInfo) => {
  const hydrationErrors = captureHydrationErrors(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("portfolio-theme", "dark"));
  await page.goto("/blog/");

  await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
  await expect(page.getByText("Articles are coming soon.")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({ path: testInfo.outputPath("blog.png"), fullPage: true });
  const navigation = page.getByRole("navigation");
  const toggle = navigation.getByRole("button", { name: "Navigation menu toggler" });
  if (isMobile) {
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  }
  const about = navigation.getByRole("link", { name: "Go to about section" });
  await expect(about).toHaveAttribute("href", "/#about");
  await about.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.getByRole("heading", { level: 1, name: "Janaka Vithanage" })).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

test("an unknown Blog Post path shows the not-found page", async ({ page }) => {
  await page.goto("/blog/no-such-post/");

  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("Blog is reachable from the home navigation", async ({ page, isMobile }) => {
  await preparePage(page);
  const navigation = page.getByRole("navigation");
  if (isMobile) await navigation.getByRole("button", { name: "Navigation menu toggler" }).click();
  const blog = navigation.getByRole("link", { name: "Visit Blog" });
  await blog.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
});

test("the not-found document hydrates without warnings", async ({ page }) => {
  const hydrationErrors = captureHydrationErrors(page);
  await page.goto("/404.html");

  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page).toHaveTitle("Page not found | Janaka Vithanage");
  expect(hydrationErrors).toEqual([]);
});
