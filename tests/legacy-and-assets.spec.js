import { test, expect } from "@playwright/test";
import { preparePage } from "./prepare-page";

test.beforeEach(async ({ page }) => preparePage(page));

test("metadata assets and manifest are served as their original file types", async ({
  page,
  request,
}) => {
  for (const selector of [
    'link[rel="icon"]',
    'link[rel="apple-touch-icon"]',
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
  ]) {
    const urls = await page
      .locator(selector)
      .evaluateAll((elements) =>
        elements.map(
          (element) =>
            element.getAttribute("href") || element.getAttribute("content"),
        ),
      );
    for (const url of urls) {
      const response = await request.get(url);
      expect(response.ok()).toBeTruthy();
      expect(response.headers()["content-type"]).toMatch(/^image\//);
    }
  }
  const manifestUrl = await page
    .locator('link[rel="manifest"]')
    .getAttribute("href");
  const manifest = await request.get(manifestUrl);
  const data = await manifest.json();
  for (const icon of data.icons) {
    const response = await request.get(new URL(icon.src, manifest.url()).href);
    expect(response.headers()["content-type"]).toMatch(/^image\//);
  }
});

test("unmigrated content, skill interactions, footer, and mock email submission work", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const id of ["about", "skills", "career", "portfolio"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
  const images = page.locator("img");
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element) => element.complete && element.naturalWidth > 0,
        ),
      )
      .toBeTruthy();
  }
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(page.getByText("Ruby", { exact: true }).first()).toBeAttached();
  if (!isMobile) {
    const ruby = page
      .locator("#skills li")
      .filter({ has: page.getByText("Ruby", { exact: true }) });
    await ruby.hover();
    await expect(ruby.getByText("Ruby", { exact: true }).filter({ visible: true })).toHaveCSS(
      "opacity",
      "1",
    );
  }
  await page.screenshot({ path: testInfo.outputPath("skills.png") });
  await expect(page.locator("footer")).toContainText(
    String(new Date().getFullYear()),
  );
  await page
    .getByRole("button", {
      name: "Open contact form to send a message to Janaka",
    })
    .last()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByPlaceholder("Your Name").fill("Test Visitor");
  await dialog.getByPlaceholder("Email Address").fill("visitor@example.com");
  await dialog.getByPlaceholder("Phone Number").fill("0400000000");
  await dialog.getByPlaceholder("Subject").fill("Portfolio inquiry");
  await dialog
    .getByPlaceholder("Message", { exact: true })
    .fill("This email is intercepted by Playwright.");
  const sent = page.waitForRequest(
    (request) => new URL(request.url()).pathname === "/api/send-email",
  );
  await dialog.getByRole("button", { name: "Send" }).click();
  expect((await sent).postDataJSON()).toMatchObject({
    name: "Test Visitor",
    email: "visitor@example.com",
    website: "",
  });
  await expect(dialog).toContainText("Thanks for contacting me.");
});
