<h1 align="center">www.jkvithanage.com - My Portfolio Website</h1>

![jkvithanage](https://github.com/jkvithanage/jkvithanage-portfolio/assets/6828858/8c29d85b-54f2-468a-8209-c9064adc80da)

---

- Built with Vite and JavaScript. Navigation and hero use React and plain CSS;
  the remaining sections use static HTML and legacy SCSS during the migration.
- In terms of style, My goal was to do something simple and minimal. I used flat square-shaped elements throughout the design, avoiding rounded shapes as much as possible.

---

## Development and checks

```sh
npm ci
npm start
```

Open http://localhost:3000. Sass is temporarily required for unmigrated sections.

```sh
npx playwright install chromium
npm run typecheck
npm test -- tests/navigation.spec.js
npm run build
PLAYWRIGHT_TEST_BUILD=1 npm test
```

`typecheck` checks JavaScript/JSX in the React foundation; it does not convert the
project to TypeScript or check the legacy controller. `npm test` runs all page-level
checks against the development server; `PLAYWRIGHT_TEST_BUILD=1` uses the existing
production build. Stop any other server on port 3000 before switching modes.
`npm run test:ui` opens Playwright's UI. On systems with an existing Chromium,
set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` to use it instead.

Tests cover desktop/mobile navigation, hero content, contact handoff, scroll
locking, reduced motion, retained content, and assets. They intercept email and
reCAPTCHA and block other external requests. No real email is sent. Hero, menu,
and skills screenshots are saved under `test-results/` for visual inspection;
failure traces can be opened with `npx playwright show-trace <trace.zip>`.

See [the migration integration guide](docs/plans/react-foundation.md) before moving
another section into React.

#### Update 30/08/2025

Replaced Formspree for contact form submission with a serverless function (`/api/send-email`) using Nodemailer.
<br>The following environment variables needs to be added in Vercel:

- `SMTP_HOST`: SMTP server host (eg: `smtp.gmail.com`).
- `SMTP_PORT`: SMTP server port (`465` for SSL or `587` for TLS).
- `SMTP_USER`: SMTP username (your email address).
- `SMTP_PASS`: SMTP password (for Gmail, use an App Password).
- `MAIL_TO`: Destination email address.
- `RECAPTCHA_SECRET`: Legacy reCAPTCHA secret key.
