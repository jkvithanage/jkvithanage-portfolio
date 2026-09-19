import { test, expect } from "@playwright/test";
import { preparePage } from "./prepare-page";
import { fillContact } from "./contact-fields";

test.beforeEach(async ({ page }) => preparePage(page));

async function openContact(page) {
  await page.getByRole("button", {
    name: "Open contact form to send a message to Janaka",
  }).last().click();
  return page.getByRole("dialog", { name: "Let's work together" });
}

test("contact waits for a fresh token, prevents duplicate submissions, and announces success", async ({ page }, testInfo) => {
  const requests = [];
  let finishEmail;
  await page.route("**/api/send-email", async (route) => {
    requests.push(route.request().postDataJSON());
    await new Promise((resolve) => { finishEmail = resolve; });
    await route.fulfill({ json: { ok: true } });
  });
  await page.evaluate(() => {
    window.grecaptcha = {
      ready: (callback) => { window.recaptchaReady = callback; },
      execute: () => new Promise((resolve) => { window.finishToken = resolve; }),
    };
  });
  const openedAfter = await page.evaluate(() => Date.now());
  const dialog = await openContact(page);
  await fillContact(dialog);
  await page.screenshot({ path: testInfo.outputPath("contact.png") });
  await dialog.getByRole("button", { name: /^Send/ }).click();
  await expect(dialog.getByRole("status")).toContainText("Sending");
  await expect(dialog.getByRole("button", { name: "Sending" })).toBeDisabled();
  await dialog.getByRole("textbox", { name: "Subject" }).press("Enter");
  expect(requests).toHaveLength(0);
  await page.evaluate(() => window.recaptchaReady());
  expect(requests).toHaveLength(0);
  await page.evaluate(() => window.finishToken("fresh-token"));
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0]).toEqual({
    name: "Test Visitor", email: "visitor@example.com", phone: "0400000000",
    subject: "Portfolio inquiry", message: "This email is intercepted by Playwright.",
    website: "", formStartedAt: expect.any(String), "g-recaptcha-response": "fresh-token",
  });
  expect(Number(requests[0].formStartedAt)).toBeGreaterThanOrEqual(openedAfter);
  await dialog.getByRole("textbox", { name: "Subject" }).press("Enter");
  expect(requests).toHaveLength(1);
  finishEmail();
  await expect(dialog.getByRole("status")).toContainText("Thanks for contacting me.");
  await expect(dialog.getByRole("status")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close contact form" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Close contact form" })).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath("contact-success.png") });
});

for (const failure of ["server rejection", "network failure", "invalid server response"]) {
  test(`contact preserves fields and allows retry after ${failure}`, async ({ page }) => {
    let attempts = 0;
    await page.route("**/api/send-email", async (route) => {
      attempts++;
      if (attempts > 1) return route.fulfill({ json: { ok: true } });
      if (failure === "network failure") return route.abort("failed");
      if (failure === "invalid server response") return route.fulfill({ status: 502, body: "Bad gateway" });
      return route.fulfill({ status: 400, json: { errors: [{ message: "Please wait a couple seconds and try again." }] } });
    });
    const dialog = await openContact(page);
    await fillContact(dialog);
    await dialog.getByRole("button", { name: "Send Message" }).click();
    await expect(dialog.getByRole("alert")).toContainText(failure === "server rejection" ? "Please wait" : failure === "network failure" ? "check your connection" : "Please try again");
    await expect(dialog.getByRole("textbox", { name: "Your Name" })).toHaveValue("Test Visitor");
    await expect(dialog.getByRole("textbox", { name: "Email Address" })).toHaveValue("visitor@example.com");
    await expect(dialog.getByRole("textbox", { name: "Phone Number" })).toHaveValue("0400000000");
    await expect(dialog.getByRole("textbox", { name: "Subject" })).toHaveValue("Portfolio inquiry");
    await expect(dialog.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("This email is intercepted by Playwright.");
    await dialog.getByRole("button", { name: "Send Message" }).click();
    await expect(dialog.getByRole("status")).toContainText("Thanks for contacting me.");
    expect(attempts).toBe(2);
  });
}

for (const failure of ["rejected", "unavailable", "empty", "timeout"]) {
  test(`contact recovers from ${failure} reCAPTCHA without sending unverified email`, async ({ page }) => {
    const requests = [];
    page.on("request", (request) => {
      if (new URL(request.url()).pathname === "/api/send-email") requests.push(request.postDataJSON());
    });
    await page.evaluate((failure) => {
      window.grecaptcha = failure === "unavailable" ? undefined : {
        ready: (callback) => { if (failure !== "timeout") callback(); },
        execute: async () => {
          if (failure === "rejected") throw new Error("Token service failed");
          return "";
        },
      };
    }, failure);
    const dialog = await openContact(page);
    await fillContact(dialog);
    if (failure === "timeout") await page.clock.install();
    await dialog.getByRole("button", { name: "Send Message" }).click();
    if (failure === "timeout") await page.clock.fastForward(15001);
    await expect(dialog.getByRole("alert")).toContainText("Unable to verify reCAPTCHA");
    expect(requests).toHaveLength(0);
    await expect(dialog.getByRole("textbox", { name: "Subject" })).toHaveValue("Portfolio inquiry");
    await page.evaluate(() => {
      window.grecaptcha = { ready: (callback) => callback(), execute: async () => "retry-token" };
    });
    await dialog.getByRole("button", { name: "Send Message" }).click();
    await expect(dialog.getByRole("status")).toContainText("Thanks for contacting me.");
    expect(requests).toHaveLength(1);
    expect(requests[0]["g-recaptcha-response"]).toBe("retry-token");
  });
}

test("contact contains keyboard focus, validates required fields, and restores the trigger", async ({ page }) => {
  const dialog = await openContact(page);
  const close = dialog.getByRole("button", { name: "Close contact form" });
  const send = dialog.getByRole("button", { name: "Send Message" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(send).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("textbox", { name: "Your Name" })).toBeFocused();
  await send.click();
  await expect(dialog.getByRole("textbox", { name: "Your Name" })).toBeFocused();
  await fillContact(dialog);
  await dialog.getByRole("textbox", { name: "Email Address" }).fill("not-an-email");
  await send.click();
  await expect(dialog.getByRole("textbox", { name: "Email Address" })).toBeFocused();
  await expect(dialog.getByRole("status")).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  const callout = page.getByRole("button", { name: "Open contact form to send a message to Janaka" }).last();
  await expect(callout).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await callout.click();
  await expect(dialog.getByRole("textbox", { name: "Your Name" })).toBeEmpty();
  await close.click();
  await expect(callout).toBeFocused();
});

test("closing during token acquisition cannot send a stale message after reopening", async ({ page }) => {
  const requests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/send-email") requests.push(request);
  });
  await page.evaluate(() => {
    window.grecaptcha.execute = () => new Promise((resolve) => { window.finishToken = resolve; });
  });
  const dialog = await openContact(page);
  await fillContact(dialog);
  await dialog.getByRole("button", { name: "Send Message" }).click();
  await expect(dialog.getByRole("status")).toContainText("Sending");
  await page.keyboard.press("Escape");
  await openContact(page);
  await page.evaluate(() => window.finishToken("stale-token"));
  await expect(dialog.getByRole("button", { name: "Send Message" })).toBeEnabled();
  await expect(dialog.getByRole("textbox", { name: "Your Name" })).toBeEmpty();
  expect(requests).toHaveLength(0);
});
