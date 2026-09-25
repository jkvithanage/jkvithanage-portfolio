import { expect, test } from "@playwright/test";

test.skip(Boolean(process.env.PLAYWRIGHT_TEST_BUILD), "Draft preview is local only");

test("a local draft is clearly marked and renders technical Markdown on a direct load", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|did not match/i.test(message.text())) errors.push(message.text());
  });
  await page.goto("/blog/example-post/");

  await expect(page.getByRole("heading", { level: 1, name: "Example technical post" })).toBeVisible();
  await expect(page.getByText("Draft preview", { exact: true })).toBeVisible();
  await expect(page.locator("article pre code")).toContainText("console.log");
  await expect(page.locator("article table")).toContainText("Markdown");
  await expect(page.locator("article ul")).toContainText("portfolio");
  await expect(page.locator("article").getByRole("link", { name: "portfolio", exact: true })).toHaveAttribute("href", "/#portfolio");
  await expect(page.locator("article img").first()).toHaveAttribute("alt", "Example post diagram");
  expect(errors).toEqual([]);
});

test("the local Blog and latest-posts area identify drafts", async ({ page }) => {
  await page.goto("/blog/");
  await expect(page.getByRole("link", { name: "Example technical post" })).toBeVisible();
  await expect(page.getByText("Draft preview", { exact: true })).toBeVisible();
  await page.goto("/");
  await expect(page.locator("#latest-posts").getByRole("link", { name: "Example technical post" })).toBeVisible();
  await expect(page.locator("#latest-posts").getByText("Draft preview", { exact: true })).toBeVisible();
});
