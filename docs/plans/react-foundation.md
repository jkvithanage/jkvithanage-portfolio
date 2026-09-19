# React application structure

Implemented for issues #26–#29, following the
[component structure](react-component-structure.md). All portfolio sections and
contact now use React and ordinary CSS. Site-wide themes remain in #30.

`src/react/main.jsx` is the only browser entry point. App renders the page into
`#react-root` in `index.html`; there are no migration slots or section portals.
The original section IDs preserve anchor navigation. App owns contact visibility
and passes an explicit contact callback to navigation and the contact callout.

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

Both overlays call `setScrollLock(owner, locked)` from `src/js/scroll-lock.js`, with
distinct `navigation` and `contact` owners. Closing one overlay releases only that
owner. React effects release listeners, observers, and scroll locks on cleanup.

## Styling and integrations

`src/css/shared.css` supplies shared values, fonts, base styles, buttons, social
icons, layout utilities, and animations; it imports the vendored ordinary-CSS
normalize reset. Each section has ordinary CSS, including `src/css/contact.css`.
There are no SCSS sources or Sass build dependencies.

`useScrollReveal` in `src/react/useScrollReveal.js` is the shared reveal boundary;
it cleans up its observer and shows content immediately for reduced-motion users.
Reduced-motion preferences also disable animation and smooth scrolling for the
page. Public metadata assets and the manifest are served from Vite's `public/`
directory. Google analytics and reCAPTCHA scripts remain in `index.html`.
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
