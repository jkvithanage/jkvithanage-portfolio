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

  // Expected destinations and tags come from the original live-page content.
  const expectedProjects = [
    { title: "My Cash Flow", preview: "https://mycashflow.cc/", github: "https://github.com/jkvithanage/mycashflow", tags: ["Ruby on Rails", "Tabler UI", "PostgreSQL", "Stimulus", "Apexcharts"] },
    { title: "My Portfolio Website", preview: "https://www.jkvithanage.com/", github: "https://github.com/jkvithanage/jkvithanage-portfolio", tags: ["HTML5", "SCSS", "JavaScript", "Vite.js", "PostCSS"] },
    { title: "Customer Invoice Portal", preview: "https://invoices.christysoftware.com/", github: null, tags: ["JavaScript", "Bootstrap", "SCSS", "Fetch API", "Tagify", "jsPDF"] },
    { title: "Astrolog", preview: "https://astrolog.fly.dev", github: "https://github.com/McDrivin/astrolog", tags: ["Ruby on Rails", "PostgreSQL", "Bootstrap", "SCSS", "Cloudinary", "RESTful APIs"] },
  ];
  for (const expected of expectedProjects) {
    const heading = page.getByRole("heading", { name: expected.title, exact: true });
    const card = projects.filter({ has: heading });
    await expect(heading).toBeVisible();
    await expect(card.getByRole("link").filter({ has: page.getByRole("img") })).toHaveAttribute("href", expected.preview);
    await expect(card.getByRole("link").filter({ has: heading })).toHaveAttribute("href", expected.preview);
    await expect(card.getByRole("link").filter({ hasText: /^Live$/ })).toHaveAttribute("href", expected.preview);
    await expect(card.getByRole("listitem")).toHaveText(expected.tags);
    if (expected.github) {
      await expect(card.getByRole("link").filter({ hasText: /^GitHub$/ })).toHaveAttribute("href", expected.github);
    } else {
      await expect(card.getByRole("link").filter({ hasText: /^GitHub$/ })).toHaveCount(0);
    }
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
