# React foundation and temporary integration

Implemented for issue #26, following the [component structure](react-component-structure.md).
The remaining slices are #27–#30; themes and the full contact rewrite remain there.

`src/react/main.jsx` is the only browser entry point. Its App owns one React root
and renders portals into the `#header`, `#hero-root`, `#career-root`, and
`#portfolio-root` slots in `index.html`. The header slot supplies the semantic
header, and the section slots supply their React-owned sections. The root itself
adds no layout around the legacy page.

To migrate another section, replace only that section's static markup with a slot,
then add a portal in App. Keep its original section ID on the rendered section so
anchor navigation continues to work. Remove the corresponding legacy listeners
and SCSS when React takes ownership. React effects must release listeners,
observers, and scroll locks on cleanup. Ultimately App can render the entire page
and the temporary portals/slots can be removed.

Navigation owns mobile menu state, keyboard interaction, and scroll-driven header
visibility. Its links and mobile social links share one responsive implementation.
The legacy controller no longer queries navigation or installs navigation listeners.

App passes the exported `openLegacyContact(returnFocus)` callback from
`src/js/controller.js` to SiteHeader. Navigation invokes it and closes its menu.
Pass a visible element to restore focus to when the dialog closes; mobile navigation
passes its toggle. The legacy controller alone owns static contact triggers, dialog
dismissal, spam fields, form submission, skill icons, reveals for the still-static
sections, footer year, and Vercel analytics. React-owned sections use the shared
`useScrollReveal` hook from `src/react/useScrollReveal.js`; the controller
excludes their IDs. It initializes once at module load. The Google analytics and
reCAPTCHA scripts remain in `index.html`. The email request contract is unchanged;
the asynchronous token/submission redesign belongs to #29.

Both overlays call `setScrollLock(owner, locked)` from `src/js/scroll-lock.js`, with
distinct `navigation` and `contact` owners. Closing one overlay releases only that
owner. Use this boundary for any additional temporary overlay. Do not directly
toggle the body overflow class from a component.

`src/css/shared.css` supplies shared values, fonts, base styles, buttons, social
icons, layout utilities, and animations; it imports the vendored ordinary-CSS
normalize reset. Navigation, hero, career, and portfolio have their own CSS
files. `src/scss/main.scss` imports only the styles/helpers still needed by
static sections and the dialog. React-owned project images are imported from
their source assets so Vite emits them in production.
Reduced-motion preferences disable animation and smooth scrolling for the page.
Public metadata assets and the manifest are served from Vite's `public/` directory.

The agreed test seam is the visitor-facing page, using Playwright on desktop and
mobile Chromium. See the README for commands. External email and reCAPTCHA are
mocked; other external traffic is blocked. Run checks against the production build
to catch asset paths that Vite's development fallback might conceal.
