# Swiss Behavioral Health

A **React Router v7** (framework mode) website for Swiss Behavioral Health — a
behavioral health & addiction recovery program in Oldsmar, FL — built to the
FAVIF Digital service agreement (16 public pages + a lead-capturing admin
dashboard).

![Stack](https://img.shields.io/badge/React%20Router-7.18-082E6B)
![Stack](https://img.shields.io/badge/React-19-5DA4A2)
![Stack](https://img.shields.io/badge/Tailwind-4-318F82)
![Backend](https://img.shields.io/badge/Appwrite-optional-5DA4A2)

> **Project context vault:** start with [`context-vault/00-Start-Here.md`](context-vault/00-Start-Here.md) for architecture, integrations, operations, current findings and future handoffs. Open `context-vault/` as an Obsidian vault.
>
> Planning and delivery records live in **`docs/BUILD-PLAN.md`** (scope,
> architecture, page specs, acceptance criteria) and **`docs/BUILD-LOG.md`**
> (what is built and verified).
>
> **New here? Start with [`docs/RUN-GUIDE.md`](docs/RUN-GUIDE.md)** — install,
> dev/production commands, the admin dashboard walkthrough, where to change
> content, HTTP endpoints, troubleshooting and the pre-launch checklist. The
> Appwrite backend runbook is **`docs/APPWRITE.md`**.

## What's inside

**Pages (Exhibit A — 16 public + admin)**
- Home, About Us, Our Team, Licensing & Accreditation
- Treatment overview + program pages (`/treatment/php`, `/treatment/iop`,
  `/treatment/op`)
- Admissions, Insurance & Payment, Contact & Location
- FAQ, Resources/Blog (`/resources`, `/resources/:slug`)
- Privacy Policy & Notice of Privacy Practices, Terms of Use
- Admin dashboard at `/admin` (password-protected leads, inquiries, admissions)

**Features**
- Live chat widget that captures leads, with click-to-call and email fallbacks
- Contact / inquiry form and an insurance verification request form —
  server-validated, honeypot-protected, persisted
- Sticky mobile click-to-call bar
- Admin: lead list with search + filters, status workflow
  (new → contacted → qualified → admitted → closed), internal notes
- SEO: per-page metadata, `/sitemap.xml`, `robots.txt`, JSON-LD
  (`MedicalBusiness`, `FAQPage`, `Article`), `/healthz` uptime probe

**Platform**
- Backend: **Appwrite** (Databases for leads, Auth for admins) with a local
  file-store fallback — see `docs/APPWRITE.md`
- Design system: brand navy (#082E6B) + teal (#5DA4A2 / #5CA5A5 / #318F82),
  Fraunces + Inter, Tailwind v4 `@theme` tokens in `app/app.css`; official SBH
  logo lockups from `/public/logos` (header/footer) and `favicon.svg`

## Getting started

```bash
npm install            # install dependencies
cp .env.example .env   # configure secrets (see below)
npm run dev            # → http://localhost:5173
```

The site runs without any backend configured: leads are written to a local
`storage/leads.json` (gitignored) and the admin panel uses a shared password.

### Environment

| Variable | Required | Purpose |
|---|---|---|
| `SESSION_SECRET` | production | Signs the admin session cookie (`openssl rand -hex 32`) |
| `ADMIN_PASSWORD` | production* | Shared admin password (*unless using Appwrite Auth) |
| `ADMIN_EMAIL` | optional | Restricts the shared-password login to one email |
| `APPWRITE_ENDPOINT` / `APPWRITE_PROJECT_ID` / `APPWRITE_API_KEY` | optional | Switch lead storage to Appwrite |
| `APPWRITE_AUTH_ENABLED` | optional | Use Appwrite users for admin login |
| `SITE_URL` | optional | Absolute origin used in `sitemap.xml` |

### Appwrite backend (recommended for production)

```bash
# 1. fill in APPWRITE_ENDPOINT / PROJECT_ID / API_KEY in .env
npm run setup:appwrite     # idempotent: database, collection, attributes, indexes, admin user
# 2. restart. /healthz and the admin header will show "Appwrite"
```

Full runbook, troubleshooting, compliance notes and a file-store migration
snippet: **`docs/APPWRITE.md`**.

## Production

```bash
npm run typecheck      # react-router typegen + tsc
npm run build          # client + server bundles → ./build
PORT=3000 npm run start:env   # serve ./build/server/index.js with .env loaded
```

> `react-router-serve` does **not** read `.env` on its own, and it picks a random
> port if `PORT` is unset. Use `npm run start:env` locally, or supply variables
> from your process manager and use `npm start`. Details, reverse-proxy and
> systemd examples: **[`docs/RUN-GUIDE.md`](docs/RUN-GUIDE.md) §5**.

## Project layout

```
app/
├── root.tsx                # Shell: notice bar, header, footer, chat, call bar
├── routes.ts               # Full route table (16 pages + admin + resources)
├── routes/                 # Route modules
├── components/             # Feature + section components (ui/ = primitives)
├── data/                   # Typed content: site, programs, team, licensing,
│                           # faqs, resources, legal
├── lib/                    # cn, appwrite.server, leads.*, auth.server, validation
└── app.css                 # Tailwind v4 theme tokens
docs/                       # RUN-GUIDE.md, BUILD-PLAN.md, BUILD-LOG.md, APPWRITE.md
scripts/appwrite-setup.mjs  # Backend schema bootstrap
storage/                    # Local lead store fallback (gitignored)
```

## Before launch — review checklist

1. **Clinical content**: populate `app/data/team.ts` with verified staff
   (names, roles, credentials, licence numbers). Until then `/team` shows a
   "roster pending verification" state and publishes nothing unverified.
2. **Licensing**: confirm `app/data/licensing.ts` matches the Client's actual
   licence/accreditation status and add licence numbers once issued.
3. **Programs**: confirm which levels of care are licensed; add a 4th program
   entry to `app/data/programs.ts` only if applicable.
4. **Legal review**: Privacy Policy, Notice of Privacy Practices and Terms of
   Use (`app/data/legal.ts`) are structured drafts and need Client + counsel
   sign-off.
5. **Secrets**: set `SESSION_SECRET` (+ `ADMIN_PASSWORD` or Appwrite Auth).
6. **Compliance**: verify the LegitScript disclosure checklist in
   `docs/BUILD-PLAN.md` §8 against the live site.

## Content provenance

Copy, contact details, program levels and modality names originate from the
public swissbehavioralhealth.com homepage (scraped 2026-10-16). The visual
identity, information architecture (real pages instead of one long scroll) and
interaction design are an original build. Team/licence specifics are intentionally
left for the Client to supply rather than invented — see the checklist above.
