# Editing portfolio content

Work Experience and Education entries live in `src/content/career.js`;
Projects live in `src/content/projects.js`. These are ordinary JavaScript
objects checked against the JSDoc types in `src/content/models.js`. Keep the
data serializable: use strings, arrays, and objects rather than JSX or HTML.
For articles, use the separate [Blog publishing guide](blog-publishing.md).

## Work Experience and Education

Edit `workExperiences` or `educationEntries` in `src/content/career.js`.
Both use the same entry format:

```js
{
  organization: {
    name: "Example Company",
    href: "https://example.com/",
    label: "Visit Example Company website",
  },
  title: "Software Developer",
  dates: "Jan 2025 - Present",
  description: [
    [{ type: "text", content: "Built an inventory management system." }],
    [
      { type: "text", content: "Read about " },
      {
        type: "link",
        content: "the project",
        href: "https://example.com/project",
        label: "Read about the inventory management project",
      },
      { type: "text", content: "." },
    ],
  ],
}
```

`organization.name`, `title`, `dates`, and `description` are required. Omit
both `organization.href` and `organization.label` for an organization without
a website. When adding a link, supply a useful accessible `label` describing
the destination. `dates` is display text, not a parsed date range.

Each inner `description` array becomes one list item. Within an item, text
and link blocks appear consecutively; include spaces and punctuation in the
strings where needed. Link blocks require `content`, `href`, and `label`;
text blocks require `content`.

Array order is display order. Entries are not sorted by date. Arrange each
list in the intended chronology, with current/recent entries first. Keep
organization/title combinations distinct because the timeline uses them as
React keys.

## Projects

Edit the `projects` array in `src/content/projects.js`. A Project has this
shape (the example reuses an existing image key):

```js
{
  title: "Example Project",
  summary: "A short project summary.",
  description: [
    { type: "text", content: "Built with " },
    {
      type: "link",
      content: "Ruby on Rails",
      href: "https://rubyonrails.org/",
      label: "Visit Ruby on Rails",
    },
    { type: "text", content: "." },
  ],
  image: { asset: "myCashFlow", alt: "Screenshot of the project dashboard" },
  preview: { href: "https://example.com/", label: "Visit Example Project" },
  tags: ["Ruby on Rails", "PostgreSQL"],
  actions: [
    {
      type: "link",
      label: "Live",
      href: "https://example.com/",
      ariaLabel: "Visit Example Project",
    },
    { type: "disabled", label: "GitHub" },
  ],
}
```

All the fields above are required. Unlike a career entry, a Project's
`description` is a single flat array of text/link blocks rendered as one
paragraph. `preview` links both the title and the main image. `tags` and
`actions` retain their array order. A disabled action needs only `type` and
`label`; use it when there is no available destination instead of inventing a
URL. A link action needs the visible `label` and descriptive `ariaLabel`.
Project titles and action labels within each Project should be distinct,
since they are also React keys.

Projects appear in array order, with no automatic sorting. The optional
`additionalImage` uses the same `{ asset, alt }` shape as `image` and appears
after the description.

## Project images

`asset` is a named image key, not a URL or filename. Existing keys are
`myCashFlow`, `portfolio`, `portfolioPageSpeed`, `invoicePortal`, and
`astrolog`.

To add a new image:

1. Put the image in `src/assets/screenshots/`.
2. Import it in `src/components/PortfolioSection.jsx` and add a corresponding
   entry to `projectImageSources`.
3. Add that key to the `ProjectImageAsset` type in `src/content/models.js`.
4. Reference the key from the Project's `image` or `additionalImage` and
   provide meaningful alternative text describing the screenshot.

## Preview and verify

Run `npm start` and inspect `/#career` and `/#portfolio` on desktop and mobile.
Check wording, chronology, images, links, keyboard focus, and action labels.
Then run:

```sh
npm run typecheck
npm test -- tests/content-models.spec.js tests/career-and-portfolio.spec.js
npm run build
```

Existing tests contain assertions about the current portfolio content. When
intentionally changing that content, update the corresponding expectations
to match the intended result. Commit the content, any new assets/image-key
changes, and updated tests together, and submit the change through a pull
request.
