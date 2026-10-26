# Swiss Behavioral Health — Website Build Plan

> **Source of truth:** *FAVIF Digital – Swiss Behavioral Health | Service Agreement*
> (Website Development & SEO Services Agreement, effective **October 1, 2026**).
> This document translates every promise in that agreement into a concrete,
> testable engineering plan, and records what has been built against it.

| | |
|---|---|
| **Agency** | FAVIF Digital — Fida Ali |
| **Client** | Swiss Behavioral Health — Ali Mirza |
| **Effective date** | October 1, 2026 |
| **Build window** | Oct 1 → Oct 21, 2026 (3 weeks) |
| **Website fee** | PKR 70,000 one-time (30% = 21,000 advance; balance 49,000 at launch) |
| **SEO fee** | PKR 50,000 / month × 6 months (first month advance 15,000) |
| **Due to commence** | PKR 36,000 |
| **Hosting** | Client-owned VPS (arranged separately per §3.4) |

---

## 1. What the agreement promises

### 1.1 Website Development (§3.1)
A professional, **mobile-responsive** website built to meet **LegitScript**'s
website-related requirements, including:

1. **All Exhibit A public pages**, with the content and disclosures LegitScript
   reviewers expect: physical address, detailed service descriptions, staff and
   licensing information, accurate cost/insurance information, and a
   HIPAA-conscious privacy policy.
2. **A live chat feature** plus the other compliance and lead-capture features:
   contact/inquiry forms, **click-to-call**, and an **insurance verification
   request form**.
3. **Admin dashboard** — a secure, password-protected admin panel where the
   Client can log in and view **all leads, inquiries and admissions** received
   through the website.
4. **Optional lead integration** — deliver leads to an external system (CRM or
   email). *Quoted separately before work begins (§3.1, §3.5).*

### 1.2 Timeline (§3.2)

| Week | Agreed milestone |
|---|---|
| Week 1 (Oct 1–7) | Sitemap, design direction, copy/content gathering, server setup on the Client's VPS |
| Week 2 (Oct 8–14) | Page development, live chat, forms, admin dashboard build |
| Week 3 (Oct 15–21) | Compliance review, testing, revisions, launch and handover walkthrough |

### 1.3 Other commitments
- **§3.3 LegitScript** — build to LegitScript website standards and fix
  website-related issues LegitScript identifies. Certification outcome is not
  guaranteed (depends on Client licensing/insurance/business practices).
- **§3.5** — anything beyond scope = additional work, priced in writing first.
- **§3.6** — 1-month post-launch warranty on defects in the delivered website.
- **§4 SEO** — 6 months of keyword research, on-page optimization, technical
  SEO, content recommendations, and regular progress reporting; full handover of
  work + access at the end; 1 month written notice for SEO early termination.
- **§7 Confidentiality** — no PHI access beyond incidental build/testing;
  Client remains responsible for its own HIPAA compliance.
- **§8 Ownership** — Client owns the final website and deliverables on full payment.

### 1.4 Exhibit A — the 16 public pages (+ admin)

| # | Page | Purpose / compliance content |
|---|---|---|
| 1 | Home | Clear description of facility and services, primary CTA, contact details |
| 2 | About Us | Mission, history, approach, facility information |
| 3 | Our Team | Clinical and medical staff with credentials |
| 4 | Licensing & Accreditation | State licences, accreditations, certifications |
| 5 | Treatment Programs (overview) | Summary of all levels of care |
| 6–9 | Program pages (up to 4) | One page per level of care actually offered, each with a detailed description |
| 10 | Admissions Process | Step-by-step admissions and intake information |
| 11 | Insurance & Payment | Accepted insurance, costs, verification request form |
| 12 | Contact & Location | Physical address, phone, map, inquiry form, live chat |
| 13 | FAQ | Common questions about treatment and admission |
| 14 | Resources / Blog | Educational content |
| 15 | Privacy Policy & Notice of Privacy Practices | HIPAA-conscious privacy disclosures |
| 16 | Terms of Use | Website terms and disclaimers |
| – | Admin Dashboard (non-public) | Secure login to view leads, inquiries and admissions |

---

## 2. Gap analysis — what exists vs. what is promised

The current codebase is a React Router v7 (framework mode) marketing site with
6 pages built from scraped content. Everything below must be added.

| Deliverable (agreement) | Status at start | Action |
|---|---|---|
| 1. Home | ✅ exists | Enhance: trust bar, program links, FAQ teaser |
| 2. About Us | ✅ exists | Add facility info, mission block |
| 3. Our Team | ❌ missing | **Build** (`/team`) — data-driven, credentials |
| 4. Licensing & Accreditation | ❌ missing | **Build** (`/licensing`) |
| 5. Treatment Programs overview | ✅ exists (`/treatment`) | Add program cards → detail links |
| 6–9. Program pages (up to 4) | ❌ missing | **Build** `/treatment/php`, `/treatment/iop`, `/treatment/op` (data-driven, 4th slot reserved) |
| 10. Admissions Process | ✅ exists | Add downloadable intake checklist |
| 11. Insurance & Payment | ⚠️ partial | Add **insurance verification request form** + costs section |
| 12. Contact & Location | ✅ exists | Add **map embed**, live-chat entry point |
| 13. FAQ | ❌ missing | **Build** (`/faq`) with accordion + FAQPage JSON-LD |
| 14. Resources / Blog | ❌ missing | **Build** `/resources` index + `/resources/:slug` |
| 15. Privacy Policy & NPP | ❌ missing | **Build** (`/privacy`) incl. Notice of Privacy Practices |
| 16. Terms of Use | ❌ missing | **Build** (`/terms`) |
| Admin Dashboard | ❌ missing | **Build** `/admin` (login + leads + admissions) |
| Live chat | ❌ missing | **Build** widget + lead capture |
| Click-to-call | ⚠️ partial | Add sticky mobile call bar + tel: links everywhere |
| Contact/inquiry form | ⚠️ client-only stub | Wire to a **real server action** + storage |
| Insurance verification form | ❌ missing | **Build** dedicated form |
| Lead storage | ❌ missing | **Build** server-side lead store |
| SEO (technical) | ⚠️ meta only | Sitemap, robots, JSON-LD, canonicals, OG |
| LegitScript disclosures | ⚠️ partial | Add compliance blocks + review checklist |

---

## 3. Architecture

**Framework:** React Router v7.18 (framework mode, SSR) + React 19 + Vite 8 +
Tailwind CSS v4. TypeScript strict. Node 24 on the Client's VPS.

**Why SSR:** LegitScript and admissions reviewers expect crawlable, fast,
server-rendered content; SSR also lets forms POST to real route actions stored
on the server (needed for the admin dashboard).

```
app/
├── root.tsx                     # Document shell, header/footer, chat + call bar
├── routes.ts                    # Full route table (below)
├── routes/                      # 16 public pages + admin + api + seo
├── components/                  # Feature components
│   ├── ui/                      # Container, SectionHeading, ButtonLink primitives
│   └── admin/                   # Dashboard-only components
├── data/                        # Typed content (single source of truth)
│   ├── site.ts                  # Brand, contact, nav, meta
│   ├── programs.ts              # Levels of care + program page content
│   ├── team.ts                  # Staff + credentials (Client-supplied)
│   ├── licensing.ts             # Licences, accreditations, certifications
│   ├── faqs.ts                  # FAQ groups
│   ├── resources.ts             # Blog/education posts
│   └── legal.ts                 # Privacy/NPP/Terms copy
└── lib/
    ├── cn.ts                    # class combiner
    ├── leads.server.ts          # Lead store (server-only, file-backed)
    ├── auth.server.ts           # Admin session + password check
    └── validation.ts            # Form parsing/validation helpers
storage/
└── leads.json                   # Runtime lead data (gitignored, created on demand)
```

**Server-only code** lives in `*.server.ts` modules or is imported from route
`loader`/`action` functions, so no filesystem/secret code reaches the browser
bundle (per the framework-mode rules in the React Router docs).

**Backend: Appwrite.** Lead storage and (optionally) admin authentication run on
Appwrite — see `docs/APPWRITE.md`. The site degrades gracefully to a local
file store when Appwrite is not configured, so development and offline builds
keep working. Server-only code lives in `*.server.ts` modules or is imported
from route `loader`/`action` functions, so no filesystem/secret code reaches the
browser bundle (per the framework-mode rules in the React Router docs).

```
app/lib/
├── appwrite.server.ts          # Server SDK client, config, health probe
├── leads.server.ts             # Provider facade (appwrite | file)
├── leads.appwrite.server.ts    # Appwrite Databases implementation
├── leads.file.server.ts        # Local JSON fallback implementation
├── leads.types.ts              # Shared types (no PHI fields, by design)
├── auth.server.ts              # Appwrite Auth or shared-password sessions
└── validation.ts               # Server-side form validation

scripts/appwrite-setup.mjs      # Idempotent schema bootstrap (database,
                                # collection, attributes, indexes, admin user)
```

Dependencies added for this: `node-appwrite` (server SDK). No client-side
Appwrite SDK is shipped to the browser — the API key never leaves the server.

The same `leads.server.ts` interface is the hook for the agreement's "optional
lead integration": a CRM webhook or email notification (Appwrite Function, or a
call inside `createLead`) can be added and quoted separately per §3.5.

---

## 4. Route map

| Route | File | Type | Notes |
|---|---|---|---|
| `/` | `routes/home.tsx` | page | Exhibit A #1 |
| `/about` | `routes/about.tsx` | page | #2 |
| `/team` | `routes/team.tsx` | page | #3 |
| `/licensing` | `routes/licensing.tsx` | page | #4 |
| `/treatment` | `routes/treatment.tsx` | page | #5 overview |
| `/treatment/php` | `routes/program.php.tsx` | page | #6 |
| `/treatment/iop` | `routes/program.iop.tsx` | page | #7 |
| `/treatment/op` | `routes/program.op.tsx` | page | #8 |
| *(reserved)* | `program.residential.tsx` | page | #9 — only if the Client is licensed for it |
| `/admissions` | `routes/admissions.tsx` | page | #10 |
| `/insurance` | `routes/insurance.tsx` | page | #11 + verification form |
| `/contact` | `routes/contact.tsx` | page | #12 + map + chat |
| `/faq` | `routes/faq.tsx` | page | #13 + FAQPage JSON-LD |
| `/resources` | `routes/resources.tsx` | page | #14 index |
| `/resources/:slug` | `routes/resource.tsx` | page | #14 article |
| `/privacy` | `routes/privacy.tsx` | page | #15 + NPP |
| `/terms` | `routes/terms.tsx` | page | #16 |
| `/admin/login` | `routes/admin.login.tsx` | page | public login form |
| `/admin` | `routes/admin.tsx` | layout | **requires session**, else redirect |
| `/admin` (index) | `routes/admin.dashboard.tsx` | page | leads/inquiries/admissions |
| `/admin/leads/:id` | `routes/admin.lead.tsx` | page | single lead + status update |
| `/admin/logout` | `routes/admin.logout.tsx` | action | destroys session |
| `/api/lead` | `routes/api.lead.tsx` | resource | POST target for all forms/chat |
| `/sitemap.xml` | `routes/sitemap.ts` | resource | XML sitemap |
| `/healthz` | `routes/health.tsx` | resource | VPS uptime check |

`public/robots.txt` is served statically (points at the sitemap).

---

## 5. Page-by-page specification

Each page carries: unique `<title>`/description, one `<h1>`, breadcrumbs,
"Speak With Admissions" + "Verify Insurance" CTAs, and the notice bar.

### #1 Home (`/`)
Hero (Small by Design. Personal by Nature.) → proof-point stats → 14-By-Design
about → approach (Clinical Excellence · Wellness · Family) → levels of care →
therapies → families → insurance → admissions steps → **FAQ teaser** → contact.
**LegitScript:** facility description, physical address, phone, and "pending DCF
licensure" status are visible above the fold or in the footer.

### #2 About Us (`/about`)
Mission/history, the 14-bed by-design model, quote, approach pillars, and a
*Facility* block (location, setting beside Philippe Park, lodging description).

### #3 Our Team (`/team`)
Data-driven grid (`data/team.ts`) of clinical/medical staff with **name, role,
credentials (e.g., MD, LMHC, LCSW), licence/registration number, and bio**.
Renders a clear "credentials pending Client confirmation" state for any entry
without verified data, so nothing unverified is published as fact.

### #4 Licensing & Accreditation (`/licensing`)
State licence(s), licence numbers, accrediting bodies, and certification status
including the current "Pending DCF Licensure" state, plus a plain-English
explanation of what is and isn't yet in place (`data/licensing.ts`).

### #5 Treatment Programs overview (`/treatment`)
The PHP · IOP · OP continuum, what "level of care" means, and cards linking to
each program page. States that program pages reflect the Client's **actual
licensed levels of care** (Exhibit A).

### #6–9 Program pages (`/treatment/:program`)
One page per level of care (PHP, IOP, OP), each with: definition of the level,
who it's for, schedule structure, therapies drawn on, family involvement, FAQ.
A single data-driven template renders all three from `data/programs.ts`. The
residential/detox slot stays unbuilt until the Client confirms licensure.

### #10 Admissions Process (`/admissions`)
The 5-step journey, what to prepare, insurance/payment review, and an intake
checklist. Emergencies route to emergency services.

### #11 Insurance & Payment (`/insurance`)
Accepted-insurance guidance, cost/coverage explanation, and the **Insurance
Verification Request form** (name, phone, email, insurer, member ID, optional
date of birth, consent) posting to `/api/lead` as `kind=insurance`. Explicit
HIPAA-conscious warning not to send medical records or diagnoses.

### #12 Contact & Location (`/contact`)
Address, click-to-call phone, email, embedded map, hours, general inquiry form,
and a "Start live chat" button that opens the chat widget.

### #13 FAQ (`/faq`)
Grouped accordions (Admissions, Treatment, Insurance, Privacy) on native
`<details>`; publishes `FAQPage` structured data.

### #14 Resources / Blog (`/resources`, `/resources/:slug`)
Educational, non-promissory articles (recovery basics, what to expect, family
support, insurance 101). Index with tags; article pages with `Article` JSON-LD
and a "general information, not medical advice" notice.

### #15 Privacy Policy & Notice of Privacy Practices (`/privacy`)
HIPAA-conscious policy covering what the website collects, how submissions are
used, cookies/session use, retention, and an NPP section describing how medical
information may be used/disclosed. Explicit statement that **the website does
not collect PHI**.

### #16 Terms of Use (`/terms`)
Website terms, permitted use, no medical advice / no doctor-patient
relationship, emergency disclaimer, IP, and limitation of liability (§10).

### Admin (`/admin`)
Login → dashboard listing **all leads / inquiries / admissions** with counts,
search, type filter, and status. Lead detail allows status update (new →
contacted → qualified → admitted → closed) and internal notes. Session-based,
password-protected, `noindex`.

---

## 6. Feature specifications

### 6.1 Lead capture pipeline
```
Visitor fills a form / uses chat
        ↓  useFetcher() POST (JSON or FormData)
  /api/lead  (resource route, action only)
        ↓  validate → normalise → stamp metadata
  storage/leads.json  ← app/lib/leads.server.ts (serialised writes)
        ↓
  /admin dashboard (loader reads the same store)
```
- All forms and the chat widget share one envelope: `kind` ∈
  `{ inquiry, insurance, chat }`.
- Each lead stores: `id` (random hex), `createdAt` (ISO), `kind`, `status`,
  form fields, `source` (pathname), `referrer`, `userAgent`.
- **Deliberately no PHI**: the schema has no diagnosis/medication/records
  fields, and every form shows the "do not include medical information" notice
  (§7 of the agreement).
- Validation happens server-side; the action returns `{ ok, errors }` so the
  form can render inline errors (React Router `data()` pattern).

### 6.2 Live chat
- Floating launcher (bottom-right) → panel with a short scripted intake
  (name → contact method → question) that submits as `kind=chat`.
- Operator-friendly: offers "Call now" (click-to-call) and "Email" fallbacks
  outside of hours, so no lead is lost without a live agent.
- Built provider-agnostically: swapping in a third-party chat SDK later means
  replacing one component; documented in the handover.

### 6.3 Click-to-call
- `tel:` links in the header, footer, notice bar, hero, and every CTA.
- **Sticky mobile call bar** (appears on scroll on small screens) with
  Call / Chat / Verify actions.

### 6.4 Lead integration & backends
- **Primary backend: Appwrite.** `leads.server.ts` selects the Appwrite provider
  when `APPWRITE_*` credentials are present, otherwise the local file store.
  Collections, attributes and indexes are created by `npm run setup:appwrite`.
- Optional CRM/email delivery is **out of initial scope**: `createLead()` is the
  single insertion point, so a webhook or Appwrite Function can be added and
  quoted separately per §3.5.
- Admins authenticate either via Appwrite Auth (`APPWRITE_AUTH_ENABLED=true`) or
  a shared password; both issue the same signed httpOnly cookie.
- Full operator runbook, compliance notes and troubleshooting live in
  `docs/APPWRITE.md`.

### 6.5 SEO (§4 groundwork)
- Per-route `meta` (title, description, Open Graph), canonical links.
- `/sitemap.xml` generated from the route list + resource posts.
- `robots.txt` allowing public pages, disallowing `/admin`.
- JSON-LD: `MedicalBusiness`/`LocalBusiness` org node, `FAQPage` on `/faq`,
  `Article` on resource posts.
- Semantic HTML, one `h1` per page, descriptive alt text, fast SSR payload.

---

## 7. Data models

```ts
type LeadKind = "inquiry" | "insurance" | "chat";
type LeadStatus = "new" | "contacted" | "qualified" | "admitted" | "closed";

interface Lead {
  id: string;
  kind: LeadKind;
  status: LeadStatus;
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
  name: string;
  email?: string;
  phone?: string;
  preferredContact?: "phone" | "email";
  bestTime?: string;
  reason?: string;         // inquiry
  message?: string;
  insurer?: string;        // insurance
  memberId?: string;
  consent: boolean;
  source: string;          // pathname the lead came from
  referrer?: string;
  userAgent?: string;
  notes?: string;          // admin-only
}

interface ResourcePost {
  slug: string; title: string; description: string;
  tag: "Recovery" | "Family" | "Insurance" | "Getting Help";
  readingMinutes: number; publishedAt: string;
  body: Section[];         // typed content blocks, no markdown dep
}

interface TeamMember {
  name: string; role: string; credentials: string;
  licenseNumber?: string; bio: string;
  verified: boolean;       // false → renders "pending confirmation" state
}
```

---

## 8. LegitScript & HIPAA-conscious compliance checklist

| Requirement (§3.1, §3.3) | Where it is satisfied |
|---|---|
| Physical address | Footer (all pages), Home, Contact & Location |
| Detailed service descriptions | Treatment overview + each program page |
| Staff & licensing information | Our Team, Licensing & Accreditation |
| Accurate cost/insurance information | Insurance & Payment (+ "speak with Admissions for the most current information") |
| HIPAA-conscious privacy policy | Privacy Policy & Notice of Privacy Practices |
| Clear facility description | Home hero + About Us |
| Legitimate contact methods | Phone (click-to-call), email, address, map, forms |
| No unsupported medical claims | Copy is educational; no outcome guarantees anywhere |
| Accuracy of licensure status | "Pending DCF Licensure" notice bar + Licensing page |
| Third-party certification outcome | Disclaimed in Terms; agency guarantees website standards only (§3.3) |

**Data-protection posture.** The site collects *inquiry* data only. Forms warn
against submitting medical information; no diagnosis/medication/records fields
exist; admin access is password + signed session cookie; the lead store is
plaintext JSON on the Client's own VPS — appropriate for non-PHI contact data,
and the README documents that a HIPAA-capable datastore + BAA must be used
before *any* PHI is handled (Client responsibility per §7).

---

## 9. Security

- **Admin auth**: password compared in constant time; `createCookieSessionStorage`
  with `httpOnly`, `sameSite=lax`, `secure` in production, and a
  `SESSION_SECRET` from the environment. No credentials in the client bundle.
- **Route protection**: the `/admin` layout `loader` redirects to `/admin/login`
  when there is no session; every admin loader re-checks.
- **Input validation**: all form input parsed and length-limited server-side.
- **No PHI**, no secrets, and no filesystem code in client bundles
  (`*.server.ts` + loader/action boundaries).
- Secrets supplied via `.env` (gitignored): `ADMIN_PASSWORD`, `SESSION_SECRET`.

---

## 10. Timeline mapping (§3.2)

| Week | Agreed milestone | Concrete output |
|---|---|---|
| **W1** Oct 1–7 | Sitemap, design direction, copy/content gathering, server setup | `docs/BUILD-PLAN.md`, route map, design system (navy/teal brand), content hub, VPS deploy of the shell |
| **W2** Oct 8–14 | Page development, live chat, forms, admin dashboard | All 16 pages + program pages, chat widget, lead API, admin dashboard |
| **W3** Oct 15–21 | Compliance review, testing, revisions, launch, handover | LegitScript checklist pass, QA on mobile/desktop, sitemap/robots/JSON-LD, launch + handover walkthrough |

---

## 11. Definition of done (acceptance criteria)

1. All 16 public pages (§1.4) render, are linked in navigation, and have unique
   titles/descriptions.
2. Program pages exist for **each level of care the Client is licensed for**.
3. Live chat, contact/inquiry form, click-to-call, and the insurance
   verification form all function and **persist leads**.
4. `/admin` login works; the dashboard lists every lead with search/filter and
   status updates; `/admin` is `noindex` and redirects when unauthenticated.
5. Privacy Policy/NPP and Terms of Use are published.
6. `/sitemap.xml`, `/robots.txt`, JSON-LD, and canonical tags are present.
7. No placeholder clinical data is presented as verified fact.
8. `npm run typecheck` and `npm run build` pass; production server serves every
   route with correct status codes.
9. Mobile-responsive at 375 / 768 / 1440 px with accessible focus states.

---

## 12. Client inputs required before launch

Per §6 of the agreement, the following must come from Swiss Behavioral Health:

- Verified **staff names, roles, credentials, and licence numbers** for `/team`.
- Actual **licence numbers / accrediting bodies** for `/licensing`.
- Confirmation of **which levels of care are licensed** (to finalise the
  program pages) and whether a 4th program page is required.
- Accepted **insurance carriers / payment policy** details for `/insurance`.
- Confirmed **hours of operation** and any holiday/admissions-hours notes.
- Designated **admin user(s)** and a launch **admin password**.
- A decision on the **optional CRM/email lead integration** (§3.1, quoted
  separately) and, if wanted, the real **live-chat provider** account.

---

## 13. Assumptions & risks

- **Placeholder discipline.** Because verified staff/licence data is required by
  LegitScript, any unconfirmed entry renders as "pending confirmation" rather
  than invented content. Publishing fake credentials would be a compliance and
  reputational failure.
- **File-backed store.** Fine for a single-instance VPS launch; if the Client
  scales to multiple instances, migrate `leads.server.ts` to Postgres (the
  interface is designed to make that a contained change).
- **SEO outcomes** are explicitly not guaranteed (§4.2); work is delivered and
  reported, results depend on many external factors.
- **LegitScript certification** is a third-party decision (§3.3) dependent on
  Client licensing and business practices.
- **Hosting** is the Client's VPS (§3.4); the Agency needs server access to
  deploy.

---

## 14. Build status

See `docs/BUILD-LOG.md` for the running log of what has been implemented against
this plan.




