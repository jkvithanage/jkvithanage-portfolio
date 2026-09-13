export async function preparePage(page) {
  // Only the local site is reachable; analytics and real email are never sent.
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/send-email") {
      return route.fulfill({ json: { success: true } });
    }
    if (url.pathname === "/recaptcha/api.js") {
      return route.fulfill({
        contentType: "application/javascript",
        body: "window.grecaptcha = { ready: callback => callback(), execute: async () => 'test-token' };",
      });
    }
    if (
      url.origin !== "http://127.0.0.1:3000" ||
      url.pathname.startsWith("/_vercel/")
    ) {
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("/");
}
