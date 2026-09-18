import { test, expect } from "@playwright/test";
import { preparePage } from "./prepare-page";

test.beforeEach(async ({ page }) => preparePage(page));

test("about keeps the portrait, biography, and responsive image sources", async ({
  page,
}, testInfo) => {
  const portrait = page.locator("#about img");
  await expect(portrait).toHaveAttribute(
    "alt",
    "Portrait photo of Janaka Vithanage",
  );
  await expect(portrait).toHaveAttribute("loading", "lazy");
  await expect(page.locator("#about")).toContainText("Hello! My name is Janaka");
  await expect(page.locator("#about picture source")).toHaveCount(2);
  await portrait.scrollIntoViewIfNeeded();
  await expect
    .poll(() => portrait.evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath("about.png"), fullPage: false });
});

test("skills render all categories and support keyboard and pointer labels", async ({
  page,
  isMobile,
}, testInfo) => {
  const skills = page.locator("#skills");
  await skills.scrollIntoViewIfNeeded();
  await expect(skills.locator(".skills-card")).toHaveCount(5);
  await expect(skills.getByRole("heading", { level: 3 })).toHaveText([
    "Languages",
    "Development",
    "Tools",
    "Data & AI/ML",
    "Design",
  ]);

  const ruby = skills.getByRole("button", { name: "Ruby", exact: true });
  await expect(ruby).toBeVisible();
  await ruby.focus();
  await expect(ruby).toHaveCSS("color", "rgb(204, 52, 45)");
  await expect(ruby.locator(".icon-label")).toHaveCSS("opacity", "1");
  if (!isMobile) {
    await ruby.blur();
    await ruby.hover();
    await expect(ruby.locator(".icon-label")).toHaveCSS("opacity", "1");
  }
  await page.screenshot({ path: testInfo.outputPath("skills.png"), fullPage: false });
});

test("one social link collection serves the visible responsive placements", async ({
  page,
  isMobile,
}) => {
  const socialLinks = page.locator(".social-link");
  await expect(socialLinks).toHaveCount(15);
  const hrefs = await socialLinks.evaluateAll((links) =>
    links.slice(0, 5).map((link) => link.getAttribute("href")),
  );
  expect(hrefs).toEqual([
    "https://github.com/jkvithanage",
    "https://www.linkedin.com/in/jkvithanage/",
    "https://www.instagram.com/jkvithanage/",
    "https://twitter.com/jkvithanage",
    "mailto:jkvithana@gmail.com",
  ]);
  if (isMobile) {
    await expect(page.locator(".socials-footer")).toBeVisible();
  } else {
    await expect(page.locator(".socials-desktop")).toBeVisible();
  }
});

test("the React callout opens the existing contact dialog and footer stays current", async ({
  page,
}) => {
  const calloutButton = page.locator(".callout").getByRole("button");
  await calloutButton.scrollIntoViewIfNeeded();
  await calloutButton.click();
  const dialog = page.getByRole("dialog", { name: "Let's work together" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close contact form" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(calloutButton).toBeFocused();
  await expect(page.locator("footer #current-year")).toHaveText(
    String(new Date().getFullYear()),
  );
  await expect(page.getByRole("link", { name: "Go to GitHub repository of this website" })).toHaveAttribute(
    "href",
    "https://github.com/jkvithanage/jkvithanage-portfolio",
  );
});
