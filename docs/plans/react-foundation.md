# React foundation and migration integration

Implemented for issues #26, #27, and #28, following the
[component structure](react-component-structure.md). Navigation, hero, about,
skills, career, portfolio, social links, the contact callout, and footer now use React.
Contact and theme slices remain in #29–#30.

`src/react/main.jsx` is the only browser entry point. Its App owns one React root
and renders portals into the migration slots in `index.html`: `#header`,
`#hero-root`, `#socials-desktop-root`, `#about-root`, `#skills-root`,
`#career-root`, `#portfolio-root`, `#callout-root`, and `#footer-root`. The root itself adds no layout around the
remaining static page sections.

To migrate another section, replace only that section's static markup with a slot,
then add a portal in App. Keep its original section ID on the rendered section so
anchor navigation continues to work. Remove the corresponding legacy listeners
and SCSS when React takes ownership. React effects must release listeners,
observers, and scroll locks on cleanup. Ultimately App can render the entire page
and the temporary portals/slots can be removed.

Navigation owns mobile menu state, keyboard interaction, and scroll-driven header
visibility. Its links and mobile social links share one responsive implementation.
`SocialLinks` and its five-link collection are reused by the desktop side rail,
mobile menu, and footer. The legacy controller no longer queries navigation or
installs navigation listeners.

App passes the exported `openLegacyContact(returnFocus)` callback from
`src/js/controller.js` to SiteHeader. Navigation invokes it and closes its menu.
Pass a visible element to restore focus to when the dialog closes; mobile navigation
passes its toggle. The legacy controller owns the static contact dialog, spam fields,
form submission and Vercel analytics. React owns the
contact-callout trigger, skill icons, migrated section reveals, and footer year. It
initializes once at module load. The Google analytics and reCAPTCHA scripts remain
in `index.html`. The email request contract is unchanged; the asynchronous
token/submission redesign belongs to #29.

Both overlays call `setScrollLock(owner, locked)` from `src/js/scroll-lock.js`, with
distinct `navigation` and `contact` owners. Closing one overlay releases only that
owner. Use this boundary for any additional temporary overlay. Do not directly
toggle the body overflow class from a component.

`src/css/shared.css` supplies shared values, fonts, base styles, buttons, social
icons, layout utilities, and animations; it imports the vendored ordinary-CSS
normalize reset. Navigation, hero, about, skills, career, portfolio, and callout/footer have their
own ordinary CSS files. `src/scss/main.scss` imports only the styles/helpers still
needed by the static contact dialog.
`useScrollReveal` in `src/react/useScrollReveal.js` is the shared reveal boundary;
it cleans up its observer and shows content immediately for reduced-motion users.
Reduced-motion preferences also disable animation and smooth scrolling for the
page. Public metadata assets and the manifest are served from Vite's `public/`
directory.

The agreed test seam is the visitor-facing page, using Playwright on desktop and
mobile Chromium. `tests/about-skills.spec.js` covers the portrait, skill labels
and interactions, social destinations, callout contact opening, and footer year;
the career/portfolio suite covers timelines, project actions, assets, and reveals.
The existing suites cover navigation, assets, and mocked contact submission.
See the README for commands. External email and reCAPTCHA are mocked; other
external traffic is blocked. Run checks against the production build to catch asset
paths that Vite's development fallback might conceal.
