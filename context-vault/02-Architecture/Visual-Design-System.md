---
title: Visual design system
updated: 2026-10-19
tags: [sbh, context-vault, design]
---

# Visual design system

Implemented 2026-10-19 following the user's request to modernize the public site and admin panel around the official logo. Logo SVGs remain unchanged.

## Palette and typography

| Role | Color / treatment |
|---|---|
| Original logo navy | `#082E6B`, preserved in supplied artwork |
| Deep ink / major dark surfaces | `#102D50` |
| Logo mineral teal | `#5DA4A2` |
| Accessible darker teal for light-surface text | `#267B73` |
| Paper | `#FCFCFA` |
| Mist | `#EEF3F1` |
| Staff workspace canvas | `#F5F7F9` |

Public display typography uses Fraunces at restrained weights, with Inter for body text, navigation, program titles and controls. Admin uses Inter for information density and scanability. Existing Google Fonts loading remains in the root.

## Public site

- Light split hero with official brand mark, clear admissions actions and a dedicated phone strip.
- Thin rules, smaller radii, quiet surfaces and fewer nested cards.
- About section uses an editorial split layout; care/programs use divided columns.
- Therapies use compact rows; family support uses a light mist section.
- Shared interior hero removes the oversized decorative text.
- Header displays a larger logo. Existing licensing notice, forms, contact details and clinical-content caveats remain.
- No fabricated facility photography or staff imagery was added.

## Admin

`app/root.tsx` checks the route to omit public navigation/footer/chat/call bar from `/admin` and descendants. The guarded admin layout has its own responsive sidebar, account/sign-out controls, storage status, summary cards and white data surfaces. Login uses a separate two-column brand/form layout that collapses on mobile. Existing loaders/actions/providers are retained; login adds visible submitting feedback.

## Implementation map

- `app/app.css`: shared palette plus public hero, workspace and responsive styles.
- `app/components/hero.tsx`, `statistics.tsx`, section components: public composition.
- `app/components/ui/button.tsx`, `ui/section.tsx`: reusable controls/headings.
- `app/routes/admin.tsx`: staff shell.
- `app/routes/admin.login.tsx`: login.
- `app/routes/admin.dashboard.tsx`, `admin.lead.tsx`: table, filters, detail/workflow.

Hero marketing copy currently lives in `hero.tsx`; links/facts still use `app/data/site.ts`. Do not assume every displayed hero sentence comes from the content data module.

## Verification

Typecheck and production build passed after final edits. Browser review covered desktop (1440 × 900) and mobile (390 × 844), home, treatment, login, empty/populated admin, lead details and mobile menu. A synthetic local inquiry successfully submitted, appeared in admin, filtered, and saved status/notes; logout returned to login. Synthetic record was removed after verification. No live Appwrite acceptance or deployment was performed.

Preview images are under `docs/design-preview/` in the repository. The populated dashboard screenshot contains synthetic test data, not real leads. Local development preview is `http://127.0.0.1:5180/`; the process must be running. Port 5173 was occupied by a different project during this session.

Related: [[System-Architecture]], [[../05-Quality-and-Risks/Verification]], [[../07-Handoff/Next-Session]].

## 2026-10-20 — floating navbar and mega dropdowns

User supplied a reference with a dark pill-shaped bar, centered logo and wide white card dropdown. Implemented the floating composition in SBH colors. On user refinement, the final navbar is white with the original navy/teal logo, navy text, a subtle border/shadow and teal action button. Desktop disclosures: Explore, Treatment and About us; direct FAQs, Contact and insurance CTA. Dropdowns use four local SVG brand illustrations, descriptions, destination links and a utility footer. No third-party images or new dependencies.

Implementation: `app/components/site-header.tsx`, `app/components/navigation-art.tsx`, `app/data/navigation.ts`, plus navigation styles in `app/app.css`. Desktop panel content is centralized in navigation.ts; mobile route links continue to use navItems in site.ts. Breakpoint is 1100px, avoiding the former gap where desktop links and mobile controls were both hidden at some widths.

Disclosures open on desktop mouse hover as well as click/keyboard. Pointer exit closes after a 220ms grace period so movement across the gap remains usable. ArrowDown moves into the desktop panel. Escape returns focus to the trigger. Close button, outside pointer, focus leaving the header, route changes and breakpoint changes dismiss menus. Mobile uses expandable native details and a scrollable bounded panel. Backdrop dims/blurs the page.

Typecheck/build passed. Browser checks at 1440px desktop, 1024px tablet and 390px mobile covered all desktop panels, program navigation, keyboard entry/Escape, mobile accordions, outside dismissal and overflow. Preview files: `docs/design-preview/navigation-desktop.png` and `navigation-mobile.png`.

Final color refinement (2026-10-20): user requested a white navbar. Desktop/mobile rendered previews verified and refreshed. Navy is retained for text and brand artwork rather than the navbar surface.

Navigation visibility refinement: labels are 14px semibold deep navy with fully visible chevrons; dropdown descriptions/footer links also darkened. Verified pointer-entry opening, travel into the panel and pointer-exit dismissal in the browser. Typecheck passed.


### Selective glass and soft surfaces — 2026-10-24

The public hero and three care pillars use translucent gradients, fine borders, and backdrop blur. Admissions step markers and callout use paired light/dark shadows; the insurance guidance uses inset shadows. The white navbar and readable navy/teal text are preserved. Opaque fallbacks cover unsupported blur and reduced transparency; forced colors removes decorative shadows. Styles live at the end of `app/app.css` and are scoped to public sections.


### Design scope correction — 2026-10-24

The user explicitly requires preserving the existing website copy and their navbar. Restore reference: `/tmp/sbh-content-before/app`. Header, navigation data, footer, site copy, FAQ, legal content and program data match that reference. New visual work must be confined to page layouts and surfaces. Original page views are under `app/components/original-pages/`; CMS publishing uses `customized: true` only after an explicit Publish action. Do not rewrite copy or redesign the navbar without a new user instruction. The fourth program page is an explicitly marked new boilerplate slot.

### Component libraries and contrast — October 25, 2026
The admin date picker now uses locally owned shadcn/ui Calendar, Button and Popover components (React DayPicker and Radix primitives). `DateField` preserves named ISO form values and the existing inclusive Eastern-time lead filter/export architecture. Generic shadcn tokens map to SBH navy and dark teal, each with white foreground text. Existing public `ButtonLink` remains available from `ui/button` via a re-export.

Aceternity UI Background Gradient wraps program cards using only SBH navy/teal hues; the component respects reduced-motion preferences. Shared `section-surface` classes provide navy/teal dark bands and warm sand/blue-gray light bands. Preserve readable light foregrounds on dark bands and keep CMS copy bindings intact when editing these components. Official component sources are credited in their files.

Verification: typecheck, production build, 15 unit tests and all-15-page CMS layout regression suite pass. Browser verified date selection, typed dates, filter application, range persistence into export links, keyboard dismissal, bounded mobile calendar and admin page width. Isolated endpoint checks verify filtered CSV contents and rejection of invalid/reversed dates. Real Appwrite records were not modified.

### Strict logo palette and dashboard hierarchy — October 25, 2026
The user requires only colors from the actual logo plus white. Approved base colors, verified in `SBH_Logo_Horizontal_Color.svg`: navy `#082E6B`, teals `#318F82`, `#5DA4A2`, `#5CA5A5`, silver `#D3D2D4`, and white `#FFFFFF`. All authored CSS/TSX color literals and non-brand Tailwind palettes were normalized to this set. Transparent tints and shadows use these same source colors. No beige, sage, red, amber or independent gray palette remains. Keep text labels/icons for status meaning; do not rely on non-brand warning colors.

Navy is the text/primary-action color, with white foreground on filled actions. Logo teal remains an accent rather than a replacement dark text color. The dashboard uses a navy sidebar/white logo, white selected navigation item with teal indicator, icon-led metric cards, a grouped filter panel, navy table headers and restrained silver borders. Existing shadcn date controls and CMS bindings remain intact.

`tests/brand-palette.test.mjs` derives approved colors from the logo and checks CSS/TSX/TS authored hex/RGB literals plus Tailwind color families. This check now runs in `npm test` alongside calendar/management tests and the 15-page layout regression suite. Build/typecheck pass; 16 unit tests pass. Date filter/CSV endpoint checks passed against isolated local synthetic records. Screenshot: `docs/design-preview/logo-palette-dashboard.png`.
