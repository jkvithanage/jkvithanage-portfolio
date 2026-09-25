# Development and checks

Install dependencies with `npm ci` before running these checks. Scripts
are defined in [package.json](../package.json).

## Local checks

```sh
npx playwright install chromium
npm run typecheck
npm run test:validation
npm test -- tests/contact.spec.js
npm run build
PLAYWRIGHT_TEST_BUILD=1 npm test
```

To check published article generation with fixtures:

```sh
BLOG_POSTS_DIR=tests/fixtures/blog npm run build
BLOG_TEST_FIXTURES=1 PLAYWRIGHT_TEST_BUILD=1 npm test -- tests/blog-publication.spec.js
npm run build
```

`npm run test:validation` uses Node's test runner to check real production-build
failures for invalid Blog Posts and the deployment-check command's handling of
HTTP responses. Builds use temporary copies and fixtures, leave local content
and `dist/` untouched, and clean up afterward. Run `npm ci` first; these checks
reuse the installed dependencies and do not need a browser or external network.

## Deployment checks

Check deployed routing first on the PR's Vercel preview and then on
production after merge:

```sh
npm run test:deployment -- https://your-preview.vercel.app
npm run test:deployment -- https://www.jkvithanage.com
```

Supply the exact deployment origin, without a path or query. The command makes
HTTP GET requests and requires generated HTML with 200 responses for `/` and
`/blog/`, plus a custom, `noindex` 404 response for a unique missing article URL.
Redirects, login pages, generic hosting errors, and soft 404s fail the check.
The preview must be accessible to the command; an authentication failure is not
a passing check. Vite preview uses a different fallback from Vercel, so the
local Playwright not-found test only checks the visible page, not deployed
status behavior. These requests do not execute analytics or submit contact forms.

## Browser test behavior

`typecheck` checks application JavaScript and JSX; it does not convert the
project to TypeScript. `npm test` runs
all page-level checks against the development server; `PLAYWRIGHT_TEST_BUILD=1`
uses the existing production build. Stop any other server on port 3000 before
switching modes.
`npm run test:ui` opens Playwright's UI. On systems with an existing Chromium,
set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` to use it instead.

Tests cover desktop/mobile navigation, hero and about content, skill labels and
interactions, social destinations, contact handoff, scroll locking, reduced motion,
employment, education, project actions, retained content, footer year, and assets.
Contact checks cover validation, focus containment/restoration, fresh tokens,
pending submission protection, success, and retries after server, network, or
reCAPTCHA failures. They intercept email and reCAPTCHA and block other external
requests. No real email is sent. Hero, navigation, about, skills, and contact
screenshots are saved under `test-results/` for visual inspection;
failure traces can be opened with `npx playwright show-trace <trace.zip>`.

`tests/theme.spec.js` covers preference persistence, System/device changes,
invalid or unavailable storage, pre-React initial appearance, keyboard selection,
and theme changes with the menu/dialog open. It checks contrast for skill icons,
labels, tags, controls, focus indicators, and form feedback, and saves both-theme
screenshots of every section and contact state at desktop/mobile sizes. It also
runs against the production build, including its initial theme stylesheet.
