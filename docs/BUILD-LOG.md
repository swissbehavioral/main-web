# Build Log

Running record of what has been implemented against `docs/BUILD-PLAN.md`.
Source of truth for scope: the FAVIF Digital ↔ Swiss Behavioral Health service
agreement (effective 2026-10-01).

---

## Deliverables completed

### Exhibit A — public pages (16/16)

| # | Page | Route | Status |
|---|---|---|---|
| 1 | Home | `/` | ✅ Hero, stats, about, approach, programs, therapies, families, insurance, admissions, FAQ teaser, contact |
| 2 | About Us | `/about` | ✅ |
| 3 | Our Team | `/team` | ✅ Data-driven roster; publishes verified staff only, otherwise an explicit "pending verification" state |
| 4 | Licensing & Accreditation | `/licensing` | ✅ DCF licensure (pending) + LegitScript (in progress) with status badges |
| 5 | Treatment Programs (overview) | `/treatment` | ✅ |
| 6 | Program page — PHP | `/treatment/php` | ✅ |
| 7 | Program page — IOP | `/treatment/iop` | ✅ |
| 8 | Program page — OP | `/treatment/op` | ✅ |
| 9 | 4th program page | — | ⏸ Reserved; build only if the Client is licensed for an additional level |
| 10 | Admissions Process | `/admissions` | ✅ |
| 11 | Insurance & Payment | `/insurance` | ✅ Includes the insurance verification request form (`#verify`) |
| 12 | Contact & Location | `/contact` | ✅ Address, click-to-call, Google map embed, inquiry form, live-chat entry |
| 13 | FAQ | `/faq` | ✅ Grouped accordions + `FAQPage` structured data |
| 14 | Resources / Blog | `/resources`, `/resources/:slug` | ✅ 4 articles + `Article` structured data |
| 15 | Privacy Policy & Notice of Privacy Practices | `/privacy` | ✅ Both documents, cross-linked index |
| 16 | Terms of Use | `/terms` | ✅ |

### Admin dashboard (non-public)

| Feature | Status |
|---|---|
| `/admin` protected by a layout loader (redirects to login) | ✅ |
| Login (`/admin/login`) — shared password **or** Appwrite Auth | ✅ |
| Logout (`/admin/logout`) | ✅ |
| Leads list with counts, search + type/status filters (URL-driven) | ✅ |
| Lead detail with status workflow (new → contacted → qualified → admitted → closed) and internal notes | ✅ |
| `noindex, nofollow` on every admin route | ✅ |
| Provider + health indicator in the header | ✅ |

### Features (§3.1)

| Feature | Status |
|---|---|
| Live chat widget with lead capture + call/email fallbacks | ✅ |
| Contact / inquiry form with server-side validation + honeypot | ✅ |
| Insurance verification request form | ✅ |
| Click-to-call (header, hero, footer, sticky mobile bar, CTAs) | ✅ |
| Mobile-responsive layout | ✅ |
| Lead persistence (Appwrite **or** local file store) | ✅ |
| LegitScript content disclosures (address, services, staff, licensing, cost/insurance, HIPAA-conscious privacy) | ✅ |

### Backend — Appwrite

| Item | Status |
|---|---|
| `node-appwrite` server SDK wired (`app/lib/appwrite.server.ts`) | ✅ |
| Provider facade with `appwrite` / `file` selection at boot | ✅ |
| Appwrite Databases lead provider | ✅ |
| Appwrite Auth admin provider (opt-in via `APPWRITE_AUTH_ENABLED`) | ✅ |
| Idempotent schema bootstrap (`npm run setup:appwrite`) | ✅ |
| Health probe surfaced in the admin UI and `/healthz` | ✅ |
| No silent failover — visible error + "call us" fallback when the backend is down | ✅ |
| Operator runbook + compliance notes (`docs/APPWRITE.md`) | ✅ |

### SEO (§4 groundwork)

| Item | Status |
|---|---|
| Per-route title/description; Open Graph on articles | ✅ |
| `/sitemap.xml` generated from routes + programs + articles (19 URLs) | ✅ |
| `public/robots.txt` (allows public pages, blocks `/admin`, `/api/`, `/healthz`) | ✅ |
| JSON-LD: `MedicalBusiness`, `FAQPage`, `Article` | ✅ |
| `/healthz` uptime probe | ✅ |

---

## Verification performed

| Check | Result |
|---|---|
| `npm run typecheck` (typegen + strict `tsc`) | ✅ exit 0 |
| `npm run build` (client + SSR) | ✅ exit 0 |
| All 16 public routes | ✅ HTTP 200 |
| Unknown route | ✅ HTTP 404 |
| `/sitemap.xml` | ✅ 200, `application/xml`, 19 `<loc>` entries |
| `/healthz` | ✅ reports active provider |
| `/admin` unauthenticated | ✅ 302 → `/admin/login?redirectTo=…` |
| Login (shared password) | ✅ 302 + session cookie; wrong password → 401 |
| Lead API — valid inquiry + insurance | ✅ 201 with lead IDs, persisted |
| Lead API — missing consent | ✅ 400 with field errors |
| Admin lead detail + status/notes update | ✅ persisted |
| Appwrite configured but unreachable | ✅ `provider: appwrite`, `reachable: false`; lead POST → 502 with "call us" message; **file store untouched** (no silent failover) |
| Appwrite Auth enabled but unreachable | ✅ 401 "Invalid email or password." (no crash) |

---

## Content governance notes

- **No fabricated clinical data.** The team roster ships empty and renders a
  "pending verification" state; licence numbers are published only once issued.
  Program schedules are labelled "typical" with the exact schedule deferred to
  admissions. This is deliberate — fake credentials or invented schedules would
  be a compliance and reputational failure.
- **No PHI.** Lead forms have no clinical fields and every form warns against
  submitting medical information; the admin UI repeats the warning on notes.
- **Legal drafts.** Privacy/NPP/Terms are professionally structured starting
  drafts that require Client + counsel review before launch (see README).

---

## Outstanding (Client inputs required before launch)

Carried from `docs/BUILD-PLAN.md` §12:

1. Verified staff names, roles, credentials and licence numbers for `/team`.
2. Actual licence numbers / accrediting bodies for `/licensing`.
3. Confirmation of which levels of care are licensed (and whether a 4th program
   page is needed).
4. Accepted insurance carriers / payment policy for `/insurance`.
5. Confirmed hours of operation.
6. Admin credentials (and/or Appwrite user provisioning).
7. Decision on the optional CRM/email lead integration (§3.1, quoted separately).
8. Real live-chat provider, if they want one instead of the built-in widget.
9. Appwrite instance details (endpoint, project ID, API key) if self-hosting.
10. Legal review of Privacy/NPP/Terms.
## October 25, 2026 — Admin workflow cleanup

Separated the page directory and blog library into searchable, paginated views. Page editing uses collapsed text blocks with a text finder. The blog editor now includes SEO title/description controls, slug editing, a search-result preview and safe inline article links. Published articles emit canonical, Open Graph and Twitter metadata, author information and structured Article data; supplied sources appear on the article.

Administrator-only staff creation is prominent rather than hidden in a disclosure. Chat now has Open/Closed/Trash queues, ownership search, a clearer message workspace, recoverable removal and restore. Trash retains messages; visitors can reopen their own conversations. Permissions are checked server-side.

Lead filters are collapsed above the lead table, summary cards are neutral, and public-site/form links explicitly open new tabs without signing out. Recovery full text opens in a native modal dialog with keyboard dismissal and focus return, independent of card dimensions.

Verification uses the isolated file-store workflow and in-memory Appwrite doubles for staff creation, denied non-admin access, chat Trash/restore, and visitor reopening. No remote staff accounts or chat records were created or changed for QA.

## October 25, 2026 — Public language navigation

Public English/Español copy now uses a local server-loaded dictionary and a saved first-party language preference. Language links perform a full GET navigation, preserve the current route/query/section, and work before client JavaScript loads. Public internal links retain Spanish; administrative routes retain English. English client copy remains the source fallback.

The notice and language control share one compact utility row above the existing white navigation. Verified 40px height in both languages at 320px, 390px and desktop widths. Spanish navigation labels have spacing appropriate to their length. Browser checks covered switching in both directions and switching on the FAQ page while retaining its route; fresh loads produced no browser errors.

Regression coverage includes language URL preservation, external/admin link exclusion, translated metadata, saved-cookie selection, explicit English override, invalid input and admin isolation. Existing 25 unit checks and all 15 page-layout checks pass. Translation entries need to be updated when new client copy is added through the CMS; visitor chat messages retain their original text.

## October 26, 2026 — Restored supplied staff and facility sections

Recovered the commented leadership, environment and lodging sections from `/Users/fidaali/swissbehavioural`. Home and About now show leadership portraits; Team includes all three supplied profiles, credentials and complete biographies in native reading dialogs. Home and Treatment include the two facility photographs, source environment/lodging copy and the local Philippe Park video. Existing English copy elsewhere remains unchanged; supplied Spanish translations were imported alongside the recovered text.

The five photos were converted to WebP (approximately 740 KB combined). The video has an actual-frame poster, native controls, no autoplay and no video preload. Verified playback reached `readyState=4` with no media error. All three portraits and both facility photos loaded successfully. Mobile Spanish pages have no horizontal overflow; the biography dialog fits the viewport and closes with Escape.

CMS sections were appended after existing slots. A read-time upgrade recognizes the previous Home/About/Team/Treatment schemas, preserves client edits and publication state, and adds the restored fields without writing to Appwrite. Regression checks cover edit preservation and rejection of unrelated or damaged schemas. All 27 unit tests and all 15 page-layout tests pass. See `docs/RECOVERED-CONTENT.md` for exact source provenance and maintenance details.

## October 26, 2026 — Navbar language, highlights and dedicated profiles

Moved the existing GET language switch into the white navbar. It remains directly visible on mobile beside the menu control. The announcement is separate and its dismissal leaves no empty language row. The original four post-hero highlights now use an asymmetric navy/teal editorial panel with twice-weekly therapy as the lead and three open supporting rows; all supplied values and descriptions remain unchanged. No image assets, animation dependencies or JavaScript interactions were added for these highlights.

Replaced staff biography dialogs with `/team/brian-gadbois`, `/team/angela-turner` and `/team/jey-roche`. Portraits sit beside the complete original biographies on desktop, with a stacked mobile layout. Directory portraits, names and biography links, as well as Home/About cards, lead directly to these pages. Profile copy is derived from the published Team CMS document, preserving existing edits; no extra biography paragraphs were written. Profiles include localized metadata, canonical/alternate links and sitemap entries. Invalid profile IDs return 404.

Verification: all 27 unit tests and 15 designed-page layout checks pass, including CMS biography edits rendering on profile pages and exact preservation of the supplied biographies. An isolated loader check covers all three routes, English/Spanish metadata, canonical URLs, sitemap inclusion and unknown-profile rejection. Browser checks cover desktop and mobile layouts, profile language switching and the navbar control. A pre-existing contact-grid minimum-width issue discovered at 320px was fixed; the Spanish homepage now has no horizontal overflow at that width.

## October 26, 2026 — About emphasis, wide screens and workspace navigation

Reworked About around the existing “14. By Design.” heading, emphasizing its numeric prefix in large display type. The quote, paragraphs and benefits remain supplied copy, with the existing CMS text mapping preserved. Clinical leadership now uses portrait-led editorial cards with overlapping name panels, clearer role/credential hierarchy and links to the existing dedicated profile pages. No biography text or logo artwork was altered.

The desktop logo is left aligned in a lightly tinted, bordered frame. The white navbar has stronger navy separation and shadow. Language selection is now a native details dropdown with a Phosphor translation symbol, current language, disclosure arrow, both language options and an active-language check. GET destinations preserve the page, query and section; Escape and outside pointer actions dismiss the dropdown. The compact mobile version shows EN/ES with the same recognizable controls.

Wide-screen styles begin at 1800px: default public containers use 88vw, while explicit reading-width containers remain constrained. Typography scales at 1800/2500/3200px, with larger hero artwork, headlines, About composition, leadership cards and recovery layout. Measured container widths were 2253px at a 2560px viewport and 3379px at a 3840px viewport; neither layout introduced horizontal overflow. The 320px Spanish layout and 1100px desktop navbar were also checked.

Added prominent contextual back links to the shared admin shell, covering staff/content directories, page and blog editors, previews, lead details and selected conversations. Conversation back links retain inbox filters. These destinations work for direct links without browser history. Existing duplicate small back links were removed.

Validation: 29 unit tests, all 15 CMS page-layout/edit checks, typecheck and production build pass. `scripts/test-admin-back-links.mjs` renders the real admin shell with local fixtures to verify six navigation contexts; no authentication or remote requests are used. Browser checks cover native language selection, Escape dismissal, responsive sizing and the refreshed public sections. Screenshots are in `docs/design-preview/about-fourteen-redesign.png` and `docs/design-preview/leadership-editorial-redesign.png`.

## October 26, 2026 — Navbar refinement, Team directory and admissions contrast

Removed the visible logo frame entirely: the official color artwork now sits directly on a continuous white/silver navbar tint. Computed browser checks confirm no logo border, background or shadow. Contact now sits beside FAQs in primary navigation; language selection and Verify Insurance remain together on the right.

The Team route uses alternating portrait-and-name spreads with clearer role, credentials and dedicated-biography links. Its discipline descriptions are open editorial rows instead of cards. All supplied text and existing CMS field mappings remain intact.

The final admissions invitation is now a separate light section before the dark footer, with a large navy call button showing the actual phone number and a distinct insurance action. Existing call and insurance destinations were verified. Treatment & Programs now occupies a high-contrast navy/teal chapter with large PHP/IOP/OP labels, open columns and explicit links to the three program routes. No program or biography claims were added. Spanish About-PHP/IOP/OP link labels now use complete translated phrases.

Validation: 29 unit checks, 15 CMS page-layout/edit checks, typecheck and production build pass. Browser checks covered the unboxed logo, Contact placement, Team directory, program links, separate admissions section, Spanish destinations and 320px layouts without horizontal overflow. Screenshots: `team-directory-refined.png`, `admissions-invitation-refined.png` and `programs-spotlight-refined.png` under `docs/design-preview/`.

## 2026-10-26 — Open recovery reading and distinct program directory
- Replaced recovery previews and reading dialogs with full client-authored paragraphs in responsive label/copy rows. No fixed reading heights, masks, expansion buttons, or overlay dialogs remain in this component.
- Added generous uniform padding and a restrained whole-row hover tint; removed the narrow edge highlight by using new journal styles.
- Replaced the dark three-column programs chapter with a light split editorial directory: introduction at left, PHP/IOP/OP rows and direct program links at right. Original CMS wording and destinations retained.
- Verified desktop and mobile in the running site: complete recovery paragraphs have equal client/scroll heights and visible overflow; no horizontal main-content overflow at the mobile viewport. Saved desktop previews under docs/design-preview/recovery-full-reading.png and programs-editorial-directory.png.
- Validation: npm test (29 unit tests and all 15 CMS layout/edit checks), npm run typecheck, npm run build passed.

## 2026-10-26 — Homepage map, FAQ and admissions bento
- Restored the Google Maps embed below homepage contact details/form, using the existing consent-aware LocationMap and confirmed 209 State St E address. Existing directions link remains. Verified the actual Google map renders; iframe is lazy loaded and reserved-height.
- Common questions now use numbered, individually separated disclosures with larger targets, clear open state and roomy answer typography. Native keyboard/no-JavaScript behavior retained.
- Admissions is a responsive two-plus-three bento layout. A passive, requestAnimationFrame-throttled scroll listener advances a single highlighted step and completed progress traces in order. No content is gated, no timers or animation dependency; reduced motion uses a static presentation. All original steps and CTAs retained.
- Browser QA: desktop and mobile grid, advancing highlight, FAQ opening, live map rendering; mobile main width equals scroll width. npm test passed (29 units + 15 CMS-edit layouts), typecheck and production build passed.
- Preview: docs/design-preview/admissions-bento.png.

## 2026-10-26 — Dedicated verification, mobile CTA and equal clinical highlights
- Added /verify-insurance with localized heading, existing insurance LeadForm and existing /api/lead workflow, canonical metadata, sitemap entry and contextual insurance-information back link. Header, hero, homepage insurance CTA, footer invitation and mobile actions now open this page without a hash target.
- Added a visible Verify Insurance pill beside the mobile language menu; verified English and Spanish at mobile width without horizontal overflow. Existing insurance/payment information page remains available.
- Chat launcher now uses a brand navy/teal gradient, white separation border, stronger shadow and hover elevation with reduced-motion support.
- Replaced the dominant-first clinical feature composition with four equally sized and styled features: four columns on desktop, two by two on mobile. Preserved all original values and labels.
- Taking the First Step remains unchanged pending the user's reference.
- Verified actual desktop/mobile CTA navigation, Spanish route and form rendering, desktop/mobile clinical layout. No live lead submitted. npm test (29 units and 15 CMS-edit layouts), typecheck and build passed.
- Previews: docs/design-preview/clinical-highlights-mobile.png and clinical-highlights-equal.png.

## 2026-10-26 — Interactive treatment and therapies
- Replaced the static eight-name list with native expandable therapy cards, Phosphor duotone icons, numbered accents, roomy reading areas and admissions links. Uses brand navy/teal/white, responsive single-column mobile and two-column desktop layouts, restrained hover motion, reduced-motion support and visible keyboard focus.
- Preserved existing headings/modality names/note. Restored each original therapy introduction from /Users/fidaali/swissbehavioural/src/data/therapies.ts into app/data/therapy-explanations.ts, with matching supplied Spanish introductions in the shared dictionary. No new clinical claims authored.
- Checked desktop opening, mobile Enter-key disclosure, original Spanish explanation and no mobile horizontal overflow. No popups, images, added animation library or client-state dependency.
- npm test (29 units + 15 CMS layout checks), npm run typecheck and npm run build passed. Preview: docs/design-preview/therapy-explorer.png.

## 2026-10-26 — Public navigation and SSR SEO coverage
- Mobile navigation now places the language selector before Verify Insurance, matching desktop priority/order. Removed public mobile menu Staff Login; admin routes remain intact.
- Chat launcher has a continuous conic brand-color outline, implemented in CSS without moving the button/text; respects reduced-motion preferences. Browser confirmed animation angle advances.
- Added shared metadata defaults and public Organization/WebSite/WebPage/Breadcrumb/Profile JSON-LD, preserving specific article metadata/schema. Organization schema is no longer output on admin routes. Sitemap now includes English/Spanish entries and alternates.
- Raw-HTML audit passed for 46 public localized responses, admin indexing exclusion and unknown-route 404. Tests/typecheck/build passed. See docs/SEO-AUDIT.md.
