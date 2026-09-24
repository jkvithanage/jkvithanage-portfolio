# Publishing Blog Posts

Blog Posts are Markdown files in `content/blog/`. The repository includes
`example-post.md` as an unpublished example. Copy it to start a new article.

## Metadata

Start each file with YAML front matter:

```yaml
---
title: A clear article title
slug: a-stable-url-slug
description: A short summary for the Blog and search results.
date: "2026-09-24"
draft: true
cover: /blog-assets/a-stable-url-slug/cover.webp
coverAlt: A description of the cover image
---
```

`title`, `slug`, `description`, `date`, and `draft` are required. Quote the date
so YAML keeps it as a string. Use a real `YYYY-MM-DD` date. Slugs use lowercase
letters, digits, and single hyphens; keep a published slug stable so existing
links keep working. The optional `cover` needs `coverAlt`.

## Write and preview

Use headings, links, lists, tables, images, and fenced code blocks. Add a
language after the opening code fence (such as `js` or `ruby`) for syntax
highlighting. Raw HTML in Markdown is escaped.

Put new article assets in `public/blog-assets/<slug>/` and refer to them
with root-relative paths such as `/blog-assets/a-stable-url-slug/cover.webp`.
Use root-relative internal links, for example `/blog/another-post/` or
`/#portfolio`. Relative links depend on the current page URL and are rejected.
Published articles cannot link to draft articles. The build validates referenced
local images, files, and Blog Post links. Published posts may also use shared
files already in `public/` with root-relative paths. Draft-owned assets must
be under `public/blog-assets/<slug>/` so the production build can leave them out.
Published posts cannot use assets in a draft post's folder.

Run `npm start` and open `/blog/` or `/blog/<slug>/`. Drafts appear locally with
a **Draft preview** label and `noindex` metadata. Editing a Markdown file
reloads the page. Before publishing, run `npm run typecheck`, `npm run build`,
and the tests in the README. Build errors include the file and problem, such as
a duplicate slug, invalid date, or missing asset.

## Publish

Change `draft` to `false` and commit the Markdown file and its assets. The
production build generates `/blog/<slug>/index.html`, adds the post to the
Blog and the homepage latest-posts area in date order, and adds its canonical
URL to `sitemap.xml`. Draft pages, draft text, and draft assets are excluded
from production output. Each article uses the existing Vercel Analytics
bootstrap; Google Analytics stays in `index.html`.
