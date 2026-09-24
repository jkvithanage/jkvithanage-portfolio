import { expect, test } from "@playwright/test";
import { educationEntries, workExperiences } from "../src/content/career.js";
import { projects } from "../src/content/projects.js";
import { preparePage } from "./prepare-page";

test("stores Career and Portfolio content as serializable models", () => {
  const content = { workExperiences, educationEntries, projects };

  expect(JSON.parse(JSON.stringify(content))).toEqual(content);
  expect(workExperiences[0].description[3]).toEqual([
    {
      type: "link",
      content: "Find me on Upwork.",
      href: "https://www.upwork.com/freelancers/~01ac14c03ad8691410",
      label: "Hire me on Upwork",
    },
  ]);
  expect(projects[1].description).toContainEqual({
    type: "link",
    content: "Google PageSpeed Insights",
    href: "https://pagespeed.web.dev/analysis/https-www-jkvithanage-com/lpw35hijlz?form_factor=desktop",
    label: "Visit Google PageSpeed Insights",
  });
});

test("renders serialized links and project action variants", async ({ page }) => {
  await preparePage(page);

  const upworkLink = workExperiences[0].description[3][0];
  const pageSpeedLink = projects[1].description[1];
  const invoiceGitHubAction = projects[2].actions[1];
  const invoice = page.locator("article.project-card").filter({ hasText: projects[2].title });

  await expect(page.getByRole("link", { name: upworkLink.label })).toHaveAttribute("href", upworkLink.href);
  await expect(page.getByRole("link", { name: pageSpeedLink.label })).toHaveAttribute("href", pageSpeedLink.href);
  await expect(invoice.getByRole("button", { name: invoiceGitHubAction.label })).toBeDisabled();
});
