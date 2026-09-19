import { test, expect } from "@playwright/test";
import { preparePage } from "./prepare-page";
import { fillContact } from "./contact-fields";

test.use({ reducedMotion: "reduce" });

async function themeSelector(page, isMobile) {
  const navigation = page.getByRole("navigation");
  if (isMobile) {
    const toggle = navigation.getByRole("button", { name: "Navigation menu toggler" });
    if (await toggle.getAttribute("aria-expanded") === "false") await toggle.click();
  }
  return navigation.getByRole("combobox", { name: "Theme", exact: true });
}

test("System defaults to the device appearance and follows live changes", async ({ page, isMobile }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await preparePage(page);
  const selector = await themeSelector(page, isMobile);
  await expect(selector).toHaveValue("system");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(35, 35, 35)");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(selector).toHaveValue("system");
});

test("explicit choices persist, stay stable, and returning to System resumes device changes", async ({ page, isMobile }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await preparePage(page);
  for (const [choice, color] of [["light", "rgb(255, 255, 255)"], ["dark", "rgb(35, 35, 35)"]]) {
    const selector = await themeSelector(page, isMobile);
    await selector.selectOption(choice);
    await page.emulateMedia({ colorScheme: "light" });
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("body")).toHaveCSS("background-color", color);
    await page.reload();
    await expect(await themeSelector(page, isMobile)).toHaveValue(choice);
    await expect(page.locator("body")).toHaveCSS("background-color", color);
  }
  await (await themeSelector(page, isMobile)).selectOption("system");
  await page.reload();
  await expect(await themeSelector(page, isMobile)).toHaveValue("system");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("hero, navigation, content, and the open dialog share the selected appearance", async ({ page, isMobile }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await preparePage(page);
  await expect(page.getByRole("region", { name: "Janaka Vithanage", exact: true })).toHaveCSS("background-color", "rgb(244, 244, 239)");
  await expect(page.getByRole("navigation")).toHaveCSS("background-color", "rgb(244, 244, 239)");
  await (await themeSelector(page, isMobile)).selectOption("dark");
  await expect(page.locator("#about")).toHaveCSS("color", "rgb(245, 245, 245)");
  await page.getByRole("navigation").getByRole("button", { name: "Open contact form to send a message to Janaka" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveCSS("color", "rgb(245, 245, 245)");
  await expect(dialog.getByRole("textbox", { name: "Your name" })).toHaveCSS("background-color", "rgb(35, 35, 35)");
});

for (const storageFailure of ["invalid", "read denied", "write denied"]) {
  test(`${storageFailure} storage keeps theme selection usable`, async ({ page, isMobile }) => {
    await page.addInitScript((failure) => {
      if (failure === "invalid") localStorage.setItem("portfolio-theme", "sepia");
      if (failure === "read denied") Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
      if (failure === "write denied") Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError"); };
    }, storageFailure);
    await page.emulateMedia({ colorScheme: "dark" });
    await preparePage(page);
    const selector = await themeSelector(page, isMobile);
    await expect(selector).toHaveValue("system");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(35, 35, 35)");
    await selector.selectOption("light");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await selector.selectOption("system");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(35, 35, 35)");
  });
}

for (const [saved, device, expected] of [
  [null, "dark", "dark"], [null, "light", "light"],
  ["dark", "light", "dark"], ["light", "dark", "light"],
  ["system", "dark", "dark"], ["invalid", "dark", "dark"],
]) {
  test(`initial ${saved ?? "default"} preference paints ${expected} before React loads on a ${device} device`, async ({ page }) => {
    await preparePage(page);
    await page.emulateMedia({ colorScheme: device });
    await page.addInitScript((value) => {
      if (value === null) localStorage.removeItem("portfolio-theme");
      else localStorage.setItem("portfolio-theme", value);
    }, saved);
    // Exercise the head bootstrap independently of the deferred React application,
    // including the hashed entry used by the production browser suite.
    await page.route(/\/(src\/.*|assets\/[^/]+)\.(jsx?|tsx?)(\?.*)?$/, (route) => route.abort());
    const stylesheet = page.waitForResponse(
      (response) => new URL(response.url()).pathname === "/theme.css",
    );
    await page.reload();
    expect((await stylesheet).ok()).toBe(true);
    await expect(page.getByRole("heading", { name: "Janaka Vithanage", exact: true })).toHaveCount(0);
    await expect(page.locator("html")).toHaveCSS("color-scheme", expected);
    await expect(page.locator("html")).toHaveCSS("background-color", expected === "dark" ? "rgb(35, 35, 35)" : "rgb(255, 255, 255)");
  });
}

async function expectContrast(locator, minimum = 4.5, property = "color", pseudo = null) {
  const ratio = await locator.evaluate((element, { property, pseudo }) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d");
    const luminance = (color) => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map((v) => {
        const n = v / 255;
        return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    let background = "rgba(0, 0, 0, 0)";
    const backgroundElement = getComputedStyle(element).maskImage === "none" ? element : element.parentElement;
    for (let node = backgroundElement; node; node = node.parentElement) {
      background = getComputedStyle(node).backgroundColor;
      if (background !== "rgba(0, 0, 0, 0)") break;
    }
    const values = [luminance(getComputedStyle(element, pseudo)[property]), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  }, { property, pseudo });
  expect(ratio, `${await locator.getAttribute("class")} ${property} contrast`).toBeGreaterThanOrEqual(minimum);
}

for (const theme of ["light", "dark"]) {
  test(`${theme} skill icons and labels stay readable with keyboard focus`, async ({ page, isMobile }) => {
    await preparePage(page);
    await (await themeSelector(page, isMobile)).selectOption(theme);
    if (isMobile) await page.getByRole("button", { name: "Navigation menu toggler" }).click();
    await page.keyboard.press("Tab");
    const skills = page.locator("#skills").getByRole("button");
    for (const skill of await skills.all()) {
      await skill.focus();
      await expectContrast(skill, 3);
      await expectContrast(skill.locator(".icon-label"));
    }
  });
}

test("theme selection works from the keyboard without closing the mobile menu", async ({ page, isMobile }) => {
  await preparePage(page);
  const selector = await themeSelector(page, isMobile);
  await selector.focus();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(selector).toHaveValue("dark");
  await expect(selector).toBeFocused();
  await expect(selector).toHaveCSS("outline-style", "solid");
  await expectContrast(selector, 3, "outlineColor");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(selector).toHaveValue("light");
  if (isMobile) {
    await expect(page.getByRole("button", { name: "Navigation menu toggler" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Navigation menu toggler" })).toBeFocused();
  }
});

for (const theme of ["light", "dark"]) {
  test(`${theme} page and open overlays remain readable across every section`, async ({ page, isMobile }, testInfo) => {
    await page.emulateMedia({ colorScheme: theme });
    await preparePage(page);
    await page.evaluate(() => document.fonts.ready);
    const selector = await themeSelector(page, isMobile);
    await expectContrast(selector);
    await expectContrast(selector, 3, "borderTopColor");
    const logo = page.getByRole("img", { name: "Janaka Vithanage brand logo" });
    expect(await logo.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await page.screenshot({ path: testInfo.outputPath(`${theme}-navigation.png`) });
    if (isMobile) await page.getByRole("button", { name: "Navigation menu toggler" }).click();
    await page.screenshot({ path: testInfo.outputPath(`${theme}-hero.png`) });
    await expectContrast(page.getByText("Full Stack Developer", { exact: true }));
    for (const section of ["#about", "#skills", "#career", "#portfolio", ".callout", ".footer"]) {
      const content = page.locator(section);
      await content.scrollIntoViewIfNeeded();
      await expectContrast(content);
      await content.screenshot({ path: testInfo.outputPath(`${theme}-${section.slice(1)}.png`) });
    }
    for (const tag of await page.locator(".project__tag").all()) await expectContrast(tag);
    await expectContrast(page.locator(".project__buttons button:disabled"));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
    await page.getByRole("button", { name: "Open contact form to send a message to Janaka" }).last().click();
    const dialog = page.getByRole("dialog");
    const close = dialog.getByRole("button", { name: "Close contact form" });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(close).toBeFocused();
    await expectContrast(close, 3);
    await expectContrast(close, 3, "outlineColor");
    await page.screenshot({ path: testInfo.outputPath(`${theme}-dialog.png`) });
    // A System change while the modal is open must preserve fields and focus.
    const name = dialog.getByRole("textbox", { name: "Your Name", exact: true });
    await name.fill("Theme visitor");
    await page.emulateMedia({ colorScheme: theme === "dark" ? "light" : "dark" });
    await expect(dialog).toHaveCSS("color", theme === "dark" ? "rgb(46, 46, 46)" : "rgb(245, 245, 245)");
    await expect(name).toHaveValue("Theme visitor");
    await expect(name).toBeFocused();
    await page.emulateMedia({ colorScheme: theme });
    await expectContrast(name);
    await expectContrast(name, 4.5, "color", "::placeholder");
    await fillContact(dialog);
    let completeRequest;
    await page.route("**/api/send-email", async (route) => {
      await new Promise((resolve) => { completeRequest = resolve; });
      await route.fulfill({ status: 400, json: { errors: [{ message: "Please try again." }] } });
    });
    await dialog.getByRole("button", { name: "Send Message" }).click();
    const status = dialog.getByRole("status");
    await expect(status).toContainText("Sending");
    await expectContrast(status);
    await expectContrast(dialog.getByRole("button", { name: "Sending" }));
    await expect.poll(() => Boolean(completeRequest)).toBe(true);
    completeRequest();
    await expect(dialog.getByRole("alert")).toContainText("Please try again");
    await expectContrast(dialog.getByRole("alert"));
    await page.screenshot({ path: testInfo.outputPath(`${theme}-error.png`) });
    await page.route("**/api/send-email", (route) => route.fulfill({ json: { ok: true } }));
    await dialog.getByRole("button", { name: "Send Message" }).click();
    await expect(status).toContainText("Thanks for contacting me");
    await expectContrast(status);
    await expectContrast(dialog.locator(".icon-success"), 3);
    await page.screenshot({ path: testInfo.outputPath(`${theme}-success.png`) });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
}
