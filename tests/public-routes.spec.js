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

test("the portfolio stays readable with the client bundle blocked", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(/\/assets\/[^/]+\.js$/, (route) => route.abort());
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Janaka Vithanage", exact: true })).toBeVisible();
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#career")).toBeVisible();
  await expect(page.locator("#portfolio")).toBeVisible();
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

test("the not-found document hydrates without warnings", async ({ page }) => {
  const hydrationErrors = captureHydrationErrors(page);
  await page.goto("/404.html");

  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page).toHaveTitle("Page not found | Janaka Vithanage");
  expect(hydrationErrors).toEqual([]);
});
