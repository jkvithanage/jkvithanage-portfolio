# Portfolio Website

Janaka Vithanage's personal portfolio and blog at [www.jkvithanage.com](https://www.jkvithanage.com).

![Portfolio website preview](https://github.com/jkvithanage/jkvithanage-portfolio/assets/6828858/8c29d85b-54f2-468a-8209-c9064adc80da)

## Features

- Responsive portfolio with desktop and mobile navigation.
- System, Light, and Dark themes, with saved preferences when browser storage
  is available.
- Markdown blog with local draft previews and generated article pages.
- Accessible contact dialog backed by a serverless email function and reCAPTCHA.

## Tech stack

The site uses React, JavaScript, and plain CSS with Vite. The blog build uses
Markdown-it for rendering and Highlight.js for code blocks. Deployment runs on
Vercel, where Nodemailer powers the contact email function. Playwright and
Node's test runner cover browser behavior and build validation.

## Getting started

The development tools require Node.js 20 or newer and npm.

```sh
git clone https://github.com/jkvithanage/jkvithanage-portfolio.git
cd jkvithanage-portfolio
npm ci
npm start
```

The development site runs at [localhost:3000](http://localhost:3000).
Vite serves the frontend; the contact API requires a Vercel environment.

To build and preview the production site locally:

```sh
npm run build
npm run preview
```

The build writes to `dist/` and excludes draft articles and their assets.

## Project structure

```text
api/                 Vercel contact email function
content/blog/        Markdown articles and an unpublished example
public/              Static metadata, theme stylesheet, and blog assets
scripts/             Blog build, validation, and deployment checks
src/
  assets/            Bundled images, fonts, and icons
  components/        Page sections, blog pages, and overlays
  content/           Portfolio data and content models
  hooks/             Shared behavior
  styles/            Plain CSS
  theme/             Theme provider
  App.jsx            Application composition
  main.jsx           React entry point
tests/               Playwright checks and blog fixtures
docs/                Editing, development, and agent guides
index.html           Vite HTML entry point
```

## Editing content

See these guides for detailed authoring instructions:

- [Editing portfolio content](docs/portfolio-editing.md): work experience,
  education, projects, images, and accessible links.
- [Publishing blog posts](docs/blog-publishing.md): Markdown metadata, drafts,
  images, validation, and publishing.
- [React application guide](docs/plans/react-foundation.md): component
  responsibilities and contact behavior.

## Testing

Run the following checks after installing dependencies:

```sh
npx playwright install chromium
npm run typecheck
npm run test:validation
npm run build
PLAYWRIGHT_TEST_BUILD=1 npm test
```

Browser tests cover desktop and mobile behavior, themes, content, routing,
and contact interactions. Contact tests intercept email and reCAPTCHA requests,
so they send no real email. Type checking validates JavaScript and JSX without
converting the project to TypeScript.

The [development guide](docs/development.md) covers development-server tests,
blog fixtures, browser setup, screenshots, traces, and deployment checks.

## Deployment

Deploy the frontend and `/api/send-email` function on Vercel, using
`npm run build` and the `dist/` output directory. Configure these server-side
environment variables for the contact function:

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` | SMTP server hostname. |
| `SMTP_PORT` | SMTP port; defaults to `465` (implicit TLS). Use `587` for STARTTLS. |
| `SMTP_USER` | SMTP authentication username and sender address. |
| `SMTP_PASS` | SMTP password or app password. |
| `MAIL_TO` | Destination email address. |
| `RECAPTCHA_SECRET` | Secret for server-side reCAPTCHA verification. |

The public reCAPTCHA site key is configured in
[src/components/ContactForm.jsx](src/components/ContactForm.jsx) and
[index.html](index.html); its allowed domains must cover the deployment.

Verify routing on the PR preview and again on production after merge using
the [deployment checks](docs/development.md#deployment-checks).

## Contributing

Specifications and work are tracked in [GitHub Issues](https://github.com/jkvithanage/jkvithanage-portfolio/issues).
The [agent instructions](AGENTS.md) define the branch workflow and pull request
requirements. Include relevant validation results
with changes submitted for review.

## License

The [package metadata](package.json) declares the MIT license. This repository
does not yet include a standalone license file.
