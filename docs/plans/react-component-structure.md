# Planned React component structure

Status: navigation and hero foundation implemented in issue #26's migration slice;
career timelines and the project portfolio implemented in issue #28; remaining
sections and themes are planned. See the
[temporary integration guide](react-foundation.md) for current mounting and contact boundaries.

Source specification: [React portfolio migration and site-wide themes, issue #25](https://github.com/jkvithanage/jkvithanage-portfolio/issues/25).

This record captures the component structure discussed during migration planning.
Implementation tickets should reference it and keep it current when decisions change.
The five-ticket breakdown is approved and published:
[foundation #26](https://github.com/jkvithanage/jkvithanage-portfolio/issues/26),
[about and skills #27](https://github.com/jkvithanage/jkvithanage-portfolio/issues/27),
[career and projects #28](https://github.com/jkvithanage/jkvithanage-portfolio/issues/28),
[contact and migration completion #29](https://github.com/jkvithanage/jkvithanage-portfolio/issues/29),
and [themes #30](https://github.com/jkvithanage/jkvithanage-portfolio/issues/30).
GitHub records their blocking dependencies; #26 can start immediately.

## Component tree

```text
App
└── ThemeProvider
    ├── SiteHeader
    │   └── Navigation
    │       ├── BrandLogo
    │       ├── MobileMenuToggle
    │       ├── NavigationLinks
    │       ├── ThemeSelector
    │       └── SocialLinks             [mobile menu]
    ├── SocialLinks                     [desktop side rail]
    ├── main
    │   ├── HeroSection
    │   ├── AboutSection
    │   ├── SkillsSection
    │   │   └── SkillGroup × 5
    │   │       └── SkillIcon
    │   ├── CareerSection
    │   │   ├── Timeline                [employment]
    │   │   │   └── TimelineEntry
    │   │   └── Timeline                [education]
    │   │       └── TimelineEntry
    │   └── PortfolioSection
    │       └── ProjectCard × 4
    ├── ContactCallout
    ├── SiteFooter
    │   └── SocialLinks                 [smaller screens]
    └── ContactDialog
        └── ContactForm
```

This is a composition tree, not a requirement for one file per component.
ThemeProvider supplies context without adding a layout wrapper.

## Responsibilities

- **SiteHeader / Navigation:** one responsive navigation implementation, including
  menu expansion and scroll-driven header visibility. Opening contact from the
  mobile menu closes the menu and opens the shared dialog.
- **SocialLinks:** the same five social links reused in the desktop side rail,
  mobile menu, and footer. CSS controls placement and responsive visibility.
- **HeroSection:** greeting, name, subtitle, work link, and decorative scroll
  indicator. Preserve the dark hero and provide a light-themed equivalent.
- **AboutSection:** responsive portrait and biography together; prose remains
  readable JSX.
- **SkillsSection / SkillGroup / SkillIcon:** render the five categories from
  data, preserving icon labels and brand-color interactions.
- **CareerSection / Timeline / TimelineEntry:** reuse the timeline layout for
  employment and education, including organization, title, dates, and rich
  descriptions. Education remains within the existing career section.
- **PortfolioSection / ProjectCard:** render project previews, descriptions,
  technology tags, and action links. Support the portfolio project's extra
  screenshot and the invoice project's unavailable GitHub link.
- **ContactCallout:** existing invitation and trigger for the shared dialog.
- **SiteFooter:** responsive social links, current year, and repository link.
- **ContactDialog:** accessible focus management, dismissal, and focus restoration.
- **ContactForm:** validation, anti-spam fields, reCAPTCHA, submission progress,
  duplicate-submit prevention, success, and recoverable errors. Preserve the
  existing email request contract.

## State and shared behavior

| Owner | Responsibility |
| --- | --- |
| App | Contact dialog visibility and coordination with mobile navigation |
| Navigation | Mobile menu state and header visibility |
| ThemeProvider | Selected preference, resolved theme, persistence, and device changes |
| ContactForm | Submission progress, success, and errors |

Use explicit callbacks to coordinate contact triggers. Coordinate body scroll
locking so closing one overlay cannot unlock the page while another remains open.
Keep submission details inside the contact form rather than distributing them
across callers.

Theme preference is System, Light, or Dark. Default to System, remember the choice,
and follow device changes only while System is selected. Apply the resolved theme
before the first paint. CSS custom properties carry theme colors to sections,
including dialog surfaces, without passing theme props through the tree.

Share scroll-reveal behavior through a hook with observer cleanup and
reduced-motion support.

## Data and CSS

- Keep social links, skill groups, timeline entries, and project metadata in data
  collections. Use JSX for rich descriptions containing links or additional images.
- Use plain CSS organized by section, with shared theme tokens, typography,
  resets, and common styles.
- Share button and heading treatments through CSS classes; extract additional
  components when they own repeated structure or behavior.
- Preserve existing content, anchor targets, responsive layouts, assets, metadata,
  and analytics. The live page is the migration source; the separate HTML snippets
  contain older versions.

## Migration and verification

Migrate navigation and hero first; then content sections; then contact and legacy
cleanup; finally introduce site-wide themes. Keep unmigrated sections functional
during intermediate steps. Temporary migration connections are not part of the
final component structure.

Use page-level Playwright tests as agreed in the specification. Verify visible
behavior and keyboard interaction, mock email and reCAPTCHA at their external
boundaries, inspect desktop/mobile layouts, and run the production build.
