import { test, expect } from "@playwright/test";
import { preparePage } from "./prepare-page";

test.beforeEach(async ({ page }) => preparePage(page));

test("renders employment and education entries through reusable timelines", async ({
  page,
}) => {
  const career = page.locator("#career");
  await expect(career.getByRole("heading", { name: "Career", exact: true })).toBeVisible();
  await expect(career.locator(".timeline")).toHaveCount(2);
  await expect(career.locator(".timeline--employment .timeline-entry")).toHaveCount(4);
  await expect(career.locator(".timeline--education .timeline-entry")).toHaveCount(3);

  await expect(career).toContainText("Swivel Group Pty Ltd");
  await expect(career).toContainText("Ruby on Rails Developer");
  await expect(career).toContainText("Optimized performance-critical endpoints");
  await expect(career).toContainText("Torrens University Australia");
  await expect(career).toContainText("Master of Business Information Systems");
  await expect(career).toContainText("biogas production using sugar industry waste");
  await expect(
    career.getByRole("link", { name: "Read my final research publication" }),
  ).toHaveAttribute("href", /dropbox\.com/);
});

test("renders all projects with metadata, rich content, and actions", async ({
  page,
}) => {
  const portfolio = page.locator("#portfolio");
  const projects = portfolio.locator("article.project-card");
  await expect(projects).toHaveCount(4);
  for (const image of await projects.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0))
      .toBeTruthy();
  }

  for (const title of [
    "My Cash Flow",
    "My Portfolio Website",
    "Customer Invoice Portal",
    "Astrolog",
  ]) {
    await expect(projects.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }

  await expect(portfolio.getByRole("img", { name: /PageSpeed Insights/ })).toHaveAttribute(
    "src",
    /portfolio_pagespeed_insights.*\.png$/,
  );
  await expect(portfolio.getByRole("link", { name: "Visit Google PageSpeed Insights" })).toHaveAttribute(
    "href",
    /pagespeed\.web\.dev/,
  );

  const invoice = projects.filter({ hasText: "Customer Invoice Portal" });
  await expect(invoice.getByRole("button", { name: "GitHub" })).toBeDisabled();
  await expect(invoice.getByRole("button", { name: "GitHub" })).not.toHaveAttribute("href");

  await expect(
    projects.filter({ hasText: "My Cash Flow" }).getByRole("link", { name: "Visit My Cash Flow GitHub repository" }),
  ).toHaveAttribute("href", "https://github.com/jkvithanage/mycashflow");
});

test("reveals career and portfolio sections as they enter the viewport", async ({
  page,
}) => {
  await expect(page.locator("#career")).not.toHaveClass(/\breveal\b/);
  await page.locator("#career").scrollIntoViewIfNeeded();
  await expect(page.locator("#career")).toHaveClass(/\breveal\b/);
  await page.locator("#portfolio").scrollIntoViewIfNeeded();
  await expect(page.locator("#portfolio")).toHaveClass(/\breveal\b/);
});

test("reduced motion reveals sections without waiting for an animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("#career")).toHaveClass(/\breveal\b/);
  await expect(page.locator("#portfolio")).toHaveClass(/\breveal\b/);
  await expect(page.locator("#career")).toHaveCSS("animation-name", "none");
});
