# React application structure

Implemented for issues #26–#30, following the
[component structure](react-component-structure.md). All portfolio sections and
contact now use React and ordinary CSS, with site-wide System, Light, and Dark themes.

`src/main.jsx` is the Vite entry point: it imports application-wide CSS,
initializes analytics once, and hydrates the generated page (or mounts it in
development). `src/publicRoutes.jsx` selects the public page and its metadata
for both the browser and static generation. `scripts/build.mjs` builds the client,
renders `dist/index.html`, `dist/blog/index.html`, and `dist/404.html`, and inserts
their route metadata. `src/App.jsx` composes the home page, including the
latest-posts empty state. `src/components/BlogPage.jsx` renders the Blog index.
`SiteLayout` shares navigation, contact behavior, and footer between the pages.
The root `index.html` keeps the theme and analytics bootstraps plus
the page insertion markers; the original section IDs preserve anchor navigation.
The source tree groups page modules in `src/components`,
shared behavior in `src/hooks`, theme state in `src/theme`, styles in `src/styles`,
and imported images, fonts, and icons in `src/assets`.

Navigation owns mobile menu state, keyboard interaction, and scroll-driven header
visibility. Its links and mobile social links share one responsive implementation.
`SocialLinks` and its five-link collection are reused by the desktop side rail,
mobile menu, and footer.

## Contact lifecycle

`ContactDialog` uses a native modal dialog to make the background inert, moves
focus to the close button, contains Tab/Shift+Tab, and supports Escape and the
close button. Dismissal restores focus to the initiating control; mobile navigation
passes its visible toggle because its contact control disappears when the menu
closes. Opening contact closes the mobile menu.

`ContactForm` owns native required/email validation, submission feedback, and the
unchanged JSON contract at `/api/send-email`. Fields have accessible labels.
Each opening starts a fresh form with an empty honeypot and a timestamp. A failed
submission retains all entered fields and the timestamp for retry. Each attempt
awaits reCAPTCHA readiness and a fresh token before sending, including retries.
Unavailable, rejected, empty, or timed-out tokens produce a recoverable error
without sending email. Token acquisition times out after 15 seconds.

While pending, the send button is disabled and an immediate request guard prevents
duplicate submissions. Status and alert regions announce progress, success, and
errors; success receives focus when the form is replaced. Closing unmounts the
form and aborts pending client work, so a late token cannot send a stale message.
Aborting a request already received by the server cannot undo email delivery.

Both overlays use the `useScrollLock(owner, locked)` React hook from
`src/hooks/useScrollLock.js`, with distinct `navigation` and `contact` owners.
Closing or unmounting one overlay releases only that owner's lock. React effects
release listeners, observers, and scroll locks on cleanup.

## Styling and integrations

`index.html` runs a small synchronous theme bootstrap before loading styles or
React. It validates the `portfolio-theme` localStorage value (`system`, `light`,
or `dark`), defaults to System, and sets the initial appearance on the document.
The render-blocking `public/theme.css` stylesheet colors the canvas even while
the application is still downloading. Keep this stylesheet as a public asset in
the head: Vite does not emit files referenced only by a raw HTML source path.

`ThemeProvider` keeps the selected preference separate from the resolved
appearance. It adopts the bootstrap state, applies changes before React paints,
and subscribes to device changes only in System mode, cleaning up the subscription
when the preference changes. Explicit selections, including System, are persisted.
If storage is blocked or full, the page and selector still work for the current
visit. The native, labelled `ThemeSelector` is part of the same responsive
navigation on desktop and mobile and supports keyboard selection.

Colors travel through semantic custom properties in `theme.css`, not section
props. Use surface/raised-surface, text/muted-text, border, accent, label, and
disabled-control roles. Use `--color-accent` for readable accent text and focus
rings; use `--color-accent-fill` with `--color-on-accent` for filled yellow buttons.
`.btn-solid` and `.btn-outlined` replace the old color-specific button classes.
Skill hover/focus colors mix their brand hue with the theme text color to maintain
icon contrast. Social, close, and success SVG masks use their completed static
paths so they remain legible and respect reduced motion. Mask the close glyph,
not the button, to avoid clipping its keyboard focus outline.

The portrait border and timeline connectors have local stacking contexts so
their negative-z decorations remain above the themed page canvas. Project previews
use native lazy loading and their existing grayscale hover effect; the obsolete
legacy loading-blur class has been removed.

`src/styles/shared.css` supplies shared values, fonts, base styles, buttons, social
icons, layout utilities, and animations; it imports the vendored ordinary-CSS
normalize reset. Each section has ordinary CSS, including `src/styles/contact.css`.
There are no SCSS sources or Sass build dependencies.

`useScrollReveal` in `src/hooks/useScrollReveal.js` is the shared reveal boundary;
it cleans up its observer and shows content immediately for reduced-motion users.
Reduced-motion preferences also disable animation and smooth scrolling for the
page. `public/` holds the favicon, social preview, web manifest, and theme sheet
served at stable root URLs. `src/assets/` holds files imported by application
modules and bundled by Vite. `api/send-email.js` remains at the repository root
because Vercel discovers serverless endpoints in `/api`; it is independent of the
browser React app. `tests/` contains browser-level Playwright checks. Google analytics and reCAPTCHA scripts remain in `index.html`.
Vercel analytics initializes once at the entry point, outside component renders.
The server email handler and SMTP/reCAPTCHA environment contract are unchanged.

## Verification

The agreed test seam is the visitor-facing page, using Playwright on desktop and
mobile Chromium. The section suites cover content, assets, interactions, anchor
navigation, responsive layouts, and reduced motion. `tests/contact.spec.js` covers
validation, pending/success feedback, token ordering, duplicate submission
protection, retry after server/network/token failures, keyboard containment,
focus restoration, and cancellation during token acquisition. Navigation tests
also cover mobile contact handoff and scroll locking.

See the README for commands. External email and reCAPTCHA are mocked; other
external traffic is blocked. Run the full suite against the production build to
catch asset paths that Vite's development fallback might conceal. Tests save
desktop/mobile screenshots under `test-results/` for visual inspection.
