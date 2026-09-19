import { test, expect } from "@playwright/test";
import { preparePage } from "./prepare-page";

test.beforeEach(async ({ page }) => preparePage(page));

test("visitors can use navigation with the keyboard", async ({
  page,
  isMobile,
}) => {
  const nav = page.getByRole("navigation");
  const about = nav.getByRole("link", { name: "Go to about section" });
  const toggle = nav.getByRole("button", { name: "Navigation menu toggler" });
  if (isMobile) {
    await expect(about).toBeHidden();
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  } else {
    await expect(toggle).toBeHidden();
  }
  await expect(about).toBeVisible();
  await about.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#about$/);
  if (isMobile) {
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(about).toBeHidden();
  }
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("hero content, navigation destinations, and assets are preserved", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("heading", { level: 1, name: "Janaka Vithanage" }),
  ).toBeVisible();
  await expect(
    page.getByText("Hello, my name is", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Full Stack Developer", { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath("hero.png") });
  const nav = page.getByRole("navigation");
  if (isMobile)
    await nav.getByRole("button", { name: "Navigation menu toggler" }).click();
  for (const [name, href] of [
    ["Go to about section", "#about"],
    ["Go to skill section", "#skills"],
    ["Go to career section", "#career"],
    ["Go to portfolio section", "#portfolio"],
    ["Visit graphics portfolio", "https://graphics.jkvithanage.com"],
  ]) {
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      href,
    );
  }
  await page.screenshot({ path: testInfo.outputPath("navigation.png") });
  await expect(
    nav.getByRole("link", { name: "Visit graphics portfolio" }),
  ).toHaveAttribute("target", "_blank");
  await expect(
    nav.getByRole("img", { name: "Janaka Vithanage brand logo" }),
  ).toBeVisible();
  expect(
    await nav.getByRole("img").evaluate((image) => image.naturalWidth),
  ).toBeGreaterThan(0);
  if (isMobile) await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "See my work", exact: true }).click();
  await expect(page).toHaveURL(/#portfolio$/);
  await expect(
    page.getByRole("heading", { name: "Portfolio", exact: true }),
  ).toBeInViewport();
});

test("contact handoff closes navigation and retains scroll locking until dismissal", async ({
  page,
  isMobile,
}) => {
  const nav = page.getByRole("navigation");
  const toggle = nav.getByRole("button", { name: "Navigation menu toggler" });
  if (isMobile) await toggle.click();
  const contact = nav.getByRole("button", {
    name: "Open contact form to send a message to Janaka",
  });
  await contact.click();
  const dialog = page.getByRole("dialog", { name: "Let's work together" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close contact form" }),
  ).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  if (isMobile) await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(isMobile ? toggle : contact).toBeFocused();

  // The contact callout uses the same dialog and close button.
  await page
    .getByRole("button", {
      name: "Open contact form to send a message to Janaka",
    })
    .last()
    .click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close contact form" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("mobile menu supports Space, Escape, focus containment, and resizing", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile menu behavior");
  const nav = page.getByRole("navigation");
  const toggle = nav.getByRole("button", { name: "Navigation menu toggler" });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await nav.getByRole("link", { name: "Email address of Janaka" }).focus();
  await page.keyboard.press("Tab");
  await expect(
    nav.getByRole("link", { name: "Janaka Vithanage brand logo" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await toggle.click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(toggle).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.setViewportSize({ width: 393, height: 727 });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("header hides on downward scrolling and returns on upward scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const nav = page.getByRole("navigation");
  await page.mouse.move(0, 400);
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect
    .poll(async () => {
      const box = await nav.boundingBox();
      return box.y + box.height;
    })
    .toBeLessThanOrEqual(0);
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(nav).toBeInViewport();
});

test("header still hides and returns on scroll after clicking a theme icon", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const nav = page.getByRole("navigation");
  const toggle = nav.getByRole("button", { name: "Navigation menu toggler" });
  if (isMobile) await toggle.click();
  await nav.getByRole("button", { name: "Dark theme", exact: true }).click();
  if (isMobile) {
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await toggle.click();
  }
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.mouse.move(0, 400);
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(nav).toHaveClass(/nav--hidden/);
  await expect.poll(async () => {
    const box = await nav.boundingBox();
    return box.y + box.height;
  }).toBeLessThanOrEqual(0);
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(nav).toBeInViewport();
});

test("header remains visible while navigation has keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const nav = page.getByRole("navigation");
  const logo = nav.getByRole("link", { name: "Janaka Vithanage brand logo" });
  await logo.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(logo).toBeFocused();
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(nav).toHaveClass(/nav--hidden/);
  await expect(nav).toBeInViewport();
});

test("reduced motion disables hero and navigation animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const heading = page.getByRole("heading", {
    name: "Janaka Vithanage",
    exact: true,
  });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("animation-name", "none");
  await expect(page.getByRole("navigation")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
