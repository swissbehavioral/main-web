# Run Guide — Swiss Behavioral Health

How to install, run, deploy and operate this project — including the admin
dashboard, the Appwrite backend, and where to change content.

**Related docs:** `docs/BUILD-PLAN.md` (scope/spec), `docs/BUILD-LOG.md` (what's
built + verified), `docs/APPWRITE.md` (backend runbook), `README.md` (overview).

---

## Contents

1. [Prerequisites](#1-prerequisites)
2. [Install](#2-install)
3. [Environment configuration](#3-environment-configuration)
4. [Run in development](#4-run-in-development)
5. [Build & run in production](#5-build--run-in-production)
6. [Using the admin dashboard](#6-using-the-admin-dashboard)
7. [npm scripts reference](#7-npm-scripts-reference)
8. [Route map](#8-route-map)
9. [Where to change content](#9-where-to-change-content)
10. [HTTP endpoints](#10-http-endpoints)
11. [Appwrite backend](#11-appwrite-backend)
12. [Troubleshooting](#12-troubleshooting)
13. [Pre-launch checklist](#13-pre-launch-checklist)

---

## 1. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | **20.6+** (24 LTS recommended) | `--env-file` needs 20.6+; the Dockerfile pins `node:24-alpine` |
| npm | 10+ | ships with Node |
| Appwrite | optional | only if you want the managed backend — see §11 |

Verify:

```bash
node --version     # v20.6.0 or higher
npm --version
```

Optional: an Appwrite instance (Cloud at `https://cloud.appwrite.io/v1`, or
self-hosted on the VPS).

---

## 2. Install

```bash
git clone <repo-url> swissbehavioralhealth
cd swissbehavioralhealth
npm install
```

First run works immediately with **no backend configured**: leads are saved to
`storage/leads.json` (created on demand, gitignored) and the admin panel uses a
shared password.

---

## 3. Environment configuration

```bash
cp .env.example .env
```

`.env` is gitignored. Never commit it.

| Variable | Required | Purpose |
|---|---|---|
| `SESSION_SECRET` | **production** | Signs the admin session cookie. Generate with `openssl rand -hex 32` |
| `ADMIN_PASSWORD` | **production*** | Shared admin password (*unless using Appwrite Auth) |
| `ADMIN_EMAIL` | optional | If set, the shared-password login also requires this email |
| `APPWRITE_AUTH_ENABLED` | optional | `true` → admins sign in as Appwrite users instead |
| `APPWRITE_ENDPOINT` | optional | e.g. `https://cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | optional | Appwrite project ID |
| `APPWRITE_API_KEY` | optional | **Server-side** key — never exposed to the browser |
| `APPWRITE_DATABASE_ID` | optional | Default `sbh` |
| `APPWRITE_LEADS_COLLECTION_ID` | optional | Default `leads` |
| `APPWRITE_ADMIN_EMAIL` / `APPWRITE_ADMIN_PASSWORD` / `APPWRITE_ADMIN_NAME` | optional | Used **once** by `npm run setup:appwrite` to create the first admin user |
| `LEADS_DIR` | optional | Absolute path for the local file store |
| `SITE_URL` | optional | Absolute origin used in `sitemap.xml` (defaults to the request origin) |

### ⚠️ Dev and production load `.env` differently

This trips people up, so it is worth stating plainly:

| Command | Loads `.env` automatically? |
|---|---|
| `npm run dev` | ✅ **Yes** |
| `npm run build` | ✅ Yes (Vite) |
| `npm start` (`react-router-serve`) | ❌ **No** |
| `npm run start:env` | ✅ Yes (`node --env-file=.env`) |

So in production you must either set real environment variables on the host
(systemd, Docker, PM2) **or** use `npm run start:env`. If you use plain
`npm start` without host-level variables, you will see these warnings and the
admin panel will fall back to the insecure dev defaults:

```
[auth] SESSION_SECRET is not set — admin sessions are signed with an insecure default.
[auth] Neither APPWRITE_AUTH_ENABLED nor ADMIN_PASSWORD is set. Set one before launch.
```

**Never accept those warnings in production.**

---

## 4. Run in development

```bash
npm run dev
```

| | |
|---|---|
| URL | **http://localhost:5173** |
| Hot reload | ✅ client + server (edits to routes/loaders reload automatically) |
| Backend needed | ❌ none — file store + shared password are active by default |

Expose the dev server to your LAN/phone (useful for mobile testing):

```bash
npm run dev -- --host
```

Other useful dev commands:

```bash
npm run typecheck   # react-router typegen + strict tsc
```

> `npm run typecheck` regenerates `.react-router/types/`. If you add a route and
> TypeScript complains that `./+types/<route>` is missing, run it once.

---

## 5. Build & run in production

```bash
npm run build        # → ./build/client (static) + ./build/server (SSR)
npm run start:env    # loads .env, serves the build
```

### Always set `PORT`

`react-router-serve` falls back to a **random ephemeral port** when `PORT` is
unset (e.g. `http://localhost:61112`), which will break a reverse proxy. Always
pass a port:

```bash
PORT=3000 npm run start:env
```

> **Tip:** if `PORT=3000` fails with `EADDRINUSE`, something else on the machine
> already owns that port — pick another (e.g. `PORT=3311`) or stop the other
> service. Verify with `lsof -iTCP:3000 -sTCP:LISTEN`.

Or provide env vars from the process manager and use the plain script:

```bash
PORT=3000 SESSION_SECRET=... ADMIN_PASSWORD=... APPWRITE_ENDPOINT=... \
  npm start
```

### Verify the deployment

```bash
curl -s localhost:3000/healthz          # {"status":"ok","provider":"…"}
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/          # 200
curl -s localhost:3000/sitemap.xml | head -5                      # XML
```

`/healthz` reports which lead provider is live — this is the fastest way to
confirm Appwrite is actually connected (`provider: "appwrite"`) rather than
silently falling back to the file store (`provider: "file"`).

### Nginx reverse proxy (typical VPS setup)

```nginx
server {
  listen 443 ssl;
  server_name swissbehavioralhealth.com www.swissbehavioralhealth.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Admin cookies are `secure` when `NODE_ENV=production`, so serve the site over
HTTPS — otherwise the admin login will not persist.

### systemd unit (example)

```ini
[Unit]
Description=Swiss Behavioral Health website
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/swissbehavioralhealth
Environment=PORT=3000
EnvironmentFile=/var/www/swissbehavioralhealth/.env
ExecStart=/usr/bin/npm start
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

Here `EnvironmentFile` supplies the variables, so plain `npm start` is correct.

### Docker

A multi-stage `Dockerfile` is included (Node 24 + production-only deps):

```bash
docker build -t sbh-site .
docker run -p 3000:3000 --env-file .env -v sbh-storage:/app/storage sbh-site
```

Mount a volume for `/app/storage` if you are using the file-store fallback,
otherwise leads are lost when the container is replaced.

---

## 6. Using the admin dashboard

The admin area is the non-public part of the agreement: *"a secure,
password-protected admin panel where the Client can log in and view all leads,
inquiries and admissions received through the website."*

### 6.1 Getting in

| | |
|---|---|
| URL | `/admin` |
| If not signed in | Redirected to `/admin/login?redirectTo=/admin` |
| Session length | 8 hours (signed, httpOnly cookie) |
| Sign out | "Sign out" button in the admin header → `POST /admin/logout` |

### 6.2 Two ways to authenticate

**Option A — shared password (default, no backend needed)**

Set in `.env`:

```bash
ADMIN_PASSWORD=your-strong-password
ADMIN_EMAIL=            # optional: also require this email
```

Sign in with the password (leave email blank unless `ADMIN_EMAIL` is set).
Wrong credentials return `401` with *"Invalid password."* / *"Invalid email or password."*

**Option B — Appwrite Auth (real users)**

```bash
APPWRITE_AUTH_ENABLED=true
APPWRITE_ENDPOINT=... / APPWRITE_PROJECT_ID=... / APPWRITE_API_KEY=...
```

The server verifies the email + password against Appwrite, discards the Appwrite
session, and issues the site's own signed cookie. Create users with
`npm run setup:appwrite` (using `APPWRITE_ADMIN_EMAIL`/`PASSWORD`) or in the
Appwrite console. Unset `APPWRITE_AUTH_ENABLED` to go back to Option A.

> Credentials are only ever checked on the server. The API key and password are
> never sent to the browser.

### 6.3 The dashboard (`/admin`)

**Summary cards**

| Card | Meaning |
|---|---|
| Total leads | All leads ever received |
| Last 7 days | Leads created in the past week |
| New / unworked | Leads still in status `new` |
| Shown | How many rows the current filter returns |

**Filters** — a `GET` form, so the filtered view is a shareable/bookmarkable URL
(e.g. `/admin?kind=insurance&status=new&q=aetna`):

- **Search** — matches name, email, phone, message, insurer
- **Type** — All / General inquiry / Insurance verification / Live chat
- **Status** — All / New / Contacted / Qualified / Admitted / Closed

**Table columns** — Received, Type, Name, Contact (email + phone), Source
(which page the lead came from), Status, and a **View** link.

If a filter matches nothing, a "Clear filters" action resets the URL.

### 6.4 Lead detail (`/admin/leads/:id`)

Shows every captured field (type, received, name, email, phone, preferred
contact method, best time, reason, insurer, member ID, source page, referrer,
consent) plus the visitor's message and the internal reference ID.

**Workflow panel (right-hand side):**

1. **Status** — dropdown: `new → contacted → qualified → admitted → closed`
2. **Internal notes** — free text, saved with the status
3. **Save** — writes the update and returns you to the same page
4. **Call / Email** quick actions when the lead has a phone/email

Notes are internal only and never shown to visitors. **Do not record clinical or
health information in notes** — the store is not a clinical record system.

### 6.5 Provider & health indicator

The admin header always shows which store is live:

| Badge | Meaning |
|---|---|
| **Appwrite** (teal dot) | Leads are being written to Appwrite Databases |
| **Local file store** (amber dot) | No Appwrite credentials — writing to `storage/leads.json` |
| Amber warning banner | Appwrite is configured but **unreachable** (hover the badge for the reason) |

This exists so a misconfigured deploy is obvious instead of silently losing
leads. It mirrors what `/healthz` reports.

### 6.6 Security posture

- Every admin route requires a valid session; the layout loader redirects
  otherwise, and each child loader re-checks.
- All admin pages send `noindex, nofollow`.
- The visitor-facing live-chat widget and mobile call bar are hidden inside
  `/admin`.
- Passwords are compared in constant time; the cookie is `httpOnly`,
  `sameSite=lax`, and `secure` in production.
- **Always** set a real `SESSION_SECRET` and rotate `ADMIN_PASSWORD` at launch.

### 6.7 Admin code map

| Concern | File |
|---|---|
| Layout, guard, provider badge | `app/routes/admin.tsx` |
| Login + action | `app/routes/admin.login.tsx` |
| Logout | `app/routes/admin.logout.tsx` |
| Dashboard (list, filters, stats) | `app/routes/admin.dashboard.tsx` |
| Lead detail + update action | `app/routes/admin.lead.tsx` |
| Auth (both providers) | `app/lib/auth.server.ts` |
| Lead store facade | `app/lib/leads.server.ts` |

---

## 7. npm scripts reference

| Script | Command | What it does |
|---|---|---|
| `npm run dev` | `react-router dev` | Dev server with HMR on **:5173**. Loads `.env`. |
| `npm run build` | `react-router build` | Client + SSR bundles → `./build` |
| `npm start` | `react-router-serve ./build/server/index.js` | Production server. **Does not** load `.env`. Set `PORT`. |
| `npm run start:env` | `node --env-file=.env …/serve/bin.js …` | Production server **with** `.env` loaded. |
| `npm run typecheck` | `react-router typegen && tsc` | Generates route types, then strict type-checks |
| `npm run setup:appwrite` | `node --env-file=.env scripts/appwrite-setup.mjs` | Creates the Appwrite database, collection, attributes, indexes and optional admin user (idempotent) |

There is no test runner configured. Verification is done with `typecheck`,
`build`, and the manual checks in §13.

---

## 8. Route map

### Public pages (Exhibit A)

| # | Route | File |
|---|---|---|
| 1 | `/` | `app/routes/home.tsx` |
| 2 | `/about` | `app/routes/about.tsx` |
| 3 | `/team` | `app/routes/team.tsx` |
| 4 | `/licensing` | `app/routes/licensing.tsx` |
| 5 | `/treatment` | `app/routes/treatment.tsx` |
| 6–8 | `/treatment/:program` (`php`, `iop`, `op`) | `app/routes/program.tsx` |
| 10 | `/admissions` | `app/routes/admissions.tsx` |
| 11 | `/insurance` (verification form at `#verify`) | `app/routes/insurance.tsx` |
| 12 | `/contact` | `app/routes/contact.tsx` |
| 13 | `/faq` | `app/routes/faq.tsx` |
| 14 | `/resources`, `/resources/:slug` | `app/routes/resources.tsx`, `resource.tsx` |
| 15 | `/privacy` (Policy + Notice of Privacy Practices) | `app/routes/privacy.tsx` |
| 16 | `/terms` | `app/routes/terms.tsx` |

An unknown program slug (e.g. `/treatment/xyz`) returns **404** by design.

### Admin & non-public

| Route | Guard | File |
|---|---|---|
| `/admin` | session required | `routes/admin.tsx` + `admin.dashboard.tsx` |
| `/admin/leads/:id` | session required | `routes/admin.lead.tsx` |
| `/admin/login` | public | `routes/admin.login.tsx` |
| `/admin/logout` | action only | `routes/admin.logout.tsx` |

### Resource routes (no UI)

| Route | Purpose |
|---|---|
| `POST /api/lead` | Lead capture for every form + live chat |
| `GET /sitemap.xml` | Generated XML sitemap |
| `GET /healthz` | Uptime + provider probe |

Adding a page: create `app/routes/<name>.tsx` exporting `meta` and a default
component, then register it in `app/routes.ts`. Run `npm run typecheck` so the
`+types/<name>` import resolves.

---

## 9. Where to change content

All copy lives in typed data modules — you rarely need to touch JSX.

| I want to change… | Edit |
|---|---|
| Brand name, phone, email, address, map, notice bar, navigation, footer sitemap, page titles/descriptions | `app/data/site.ts` |
| The three levels of care (definitions, typical schedules, who it suits, FAQs) | `app/data/programs.ts` |
| Clinical/medical staff roster (name, role, credentials, licence no.) | `app/data/team.ts` |
| Licence + accreditation status | `app/data/licensing.ts` |
| FAQ groups | `app/data/faqs.ts` |
| Blog / resource articles | `app/data/resources.ts` |
| Privacy Policy, Notice of Privacy Practices, Terms of Use | `app/data/legal.ts` |
| Brand colours, fonts, textures | `app/app.css` (`@theme` tokens) |
| Lead form fields / insurance form fields | `app/components/lead-form.tsx` |
| Header, footer, notice bar, chat widget, mobile call bar | `app/components/*.tsx` |

Notes:

- **Add a program page**: append an entry to `programLevels` in
  `app/data/programs.ts` — the `/treatment/:program` route, the home/treatment
  cards, the footer sitemap and `sitemap.xml` all pick it up automatically.
- **Add a blog post**: append to `resourcePosts` in `app/data/resources.ts`.
- **Team roster**: entries are only published when `verified: true`. Until then
  `/team` shows a "roster pending verification" notice — this is deliberate so no
  unverified credential is ever displayed as fact.

---

## 10. HTTP endpoints

### `POST /api/lead`

The single endpoint behind the contact form, the insurance verification form and
the live-chat widget.

| Field | Required | Notes |
|---|---|---|
| `kind` | – | `inquiry` \| `insurance` \| `chat` (defaults to `inquiry`) |
| `name` | ✅ | 2–120 chars |
| `email` | ✅* | *at least one of email/phone required; format validated |
| `phone` | ✅* | |
| `preferredContact` | – | `phone` \| `email` |
| `bestTime` | – | inquiry only |
| `reason` | – | inquiry only |
| `message` | – | up to 2000 chars |
| `insurer` / `memberId` | – | insurance only |
| `consent` | ✅ | must be `on`/`true`/`1` |
| `source` | – | pathname the submission came from |
| `_hp` | – | honeypot; if filled the request is silently accepted and discarded |

Responses:

| Status | Body | Meaning |
|---|---|---|
| `201` | `{"ok":true,"id":"…"}` | Stored |
| `400` | `{"ok":false,"errors":{"email":"…"}}` | Validation failed (rendered inline) |
| `405` | – | Method not POST |
| `502` | `{"ok":false,"errors":{"form":"…call (656) 232-3504…"}}` | Storage backend unreachable |

```bash
curl -X POST http://localhost:5173/api/lead \
  --data-urlencode 'kind=inquiry' \
  --data-urlencode 'name=Jane Tester' \
  --data-urlencode 'email=jane@example.com' \
  --data-urlencode 'reason=Admissions' \
  --data-urlencode 'consent=on' \
  --data-urlencode 'source=/contact'
# {"ok":true,"id":"248eacdce08c2b9c"}
```

### `GET /healthz`

```json
{
  "status": "ok",
  "provider": "appwrite",
  "appwrite": { "configured": true, "reachable": true },
  "time": "2026-10-16T06:41:14.474Z"
}
```

Use this for uptime monitoring. `provider: "file"` means leads are going to the
local JSON file — acceptable for staging, not for production.

### `GET /sitemap.xml`

Generated from the route table + program levels + resource posts (19 URLs
currently). Excludes `/admin`, `/api/*` and `/healthz`.

---

## 11. Appwrite backend

Quick start (full details in `docs/APPWRITE.md`):

```bash
# 1. put credentials in .env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<project id>
APPWRITE_API_KEY=<server key with databases.read/write, users.read/write>

# 2. create the schema (idempotent — safe to re-run)
npm run setup:appwrite

# 3. restart and verify
npm run start:env
curl -s localhost:3000/healthz      # expect "provider":"appwrite"
```

How the switch works:

- The provider is chosen **once at boot**: Appwrite if the three credentials are
  present, otherwise the local file store.
- **There is no silent failover.** If Appwrite is configured but unreachable, form
  submissions return `502` with a "please call us" message, and the admin header
  shows an amber warning. This is intentional — quietly writing to a local file
  would split your lead data across two stores.
- Adding more credentials later takes effect on restart; no code changes.

To migrate existing file-store leads into Appwrite, see the snippet in
`docs/APPWRITE.md` §9.

---

## 12. Troubleshooting

| Symptom | Cause → Fix |
|---|---|
| `EADDRINUSE` / server won't start | A previous instance is still listening. Find it with `lsof -iTCP:3000 -sTCP:LISTEN`, then `pkill -f 'react-router/serve'` (note: the production process path is `react-router/serve`, the CLI alias is `react-router-serve` — kill both). |
| Production serves on a random port like `:61112` | `PORT` was not set. Use `PORT=3000 npm run start:env`. |
| Admin login "succeeds" but you're bounced back to login (production) | The session cookie is `secure` in production. Serve over **HTTPS**, or terminate TLS at the reverse proxy and forward `X-Forwarded-Proto`. |
| Login always fails even with the right password | Production isn't reading `.env`. Use `npm run start:env`, or supply variables via the process manager. Check the startup log for the `[auth] … is not set` warnings. |
| `Invalid email or password.` with shared password but no email set | `ADMIN_EMAIL` is set in `.env` and must match — or clear it to allow password-only login. |
| Form submits but returns `502` | The configured lead backend is unreachable. Check `/healthz` and the `APPWRITE_*` credentials/network. |
| Leads aren't in Appwrite | `APPWRITE_*` is empty, so the file store is active. Confirm `provider` in `/healthz` and check the startup log line. |
| `Cannot find module './+types/<route>'` | Route types are stale. Run `npm run typecheck`. |
| Stale content in dev | Restart `npm run dev`; Vite occasionally needs a restart after adding routes. |
| Build fails in `esbuild` / native install | Fresh install: `rm -rf node_modules package-lock.json && npm install`. |
| `esbuild` binary missing after install | Some npm configs skip postinstall scripts. Approve it (`npm approve-scripts esbuild`) or reinstall without the restriction. |
| Docker container loses leads on restart | Mount a volume at `/app/storage`, or switch to Appwrite. |
| An unknown URL returns 404 | Correct — unknown paths render the 404 page (e.g. `/treatment/xyz`). |

Useful diagnostics:

```bash
lsof -iTCP:3000 -sTCP:LISTEN        # what's on the port
pgrep -fl 'react-router'            # any running dev/prod processes
curl -s localhost:3000/healthz      # provider + config state
```

---

## 13. Pre-launch checklist

### Environment

- [ ] `SESSION_SECRET` generated (`openssl rand -hex 32`) and set on the host
- [ ] `ADMIN_PASSWORD` set (strong) **or** Appwrite Auth enabled with real users
- [ ] `SITE_URL` set to the production origin (for `sitemap.xml`)
- [ ] Appwrite credentials set, `npm run setup:appwrite` run, `/healthz` shows `provider: "appwrite"`

### Content

- [ ] `app/data/team.ts` populated with **verified** staff (name, role, credentials, licence no.) and `verified: true`
- [ ] `app/data/licensing.ts` matches the real licence/accreditation status
- [ ] `app/data/programs.ts` reflects the levels of care actually licensed
- [ ] Insurance/payment wording checked on `/insurance`
- [ ] Hours of operation confirmed (`site.hours`)
- [ ] Privacy Policy / Notice of Privacy Practices / Terms reviewed by the Client (and counsel)

### Technical

- [ ] `npm run typecheck` → exit 0
- [ ] `npm run build` → exit 0
- [ ] All routes return the expected status codes (below)
- [ ] Admin login works over HTTPS; wrong password returns 401
- [ ] A test lead submitted from `/contact` appears in `/admin`
- [ ] `/sitemap.xml` and `/robots.txt` reachable; `/admin` is `noindex`
- [ ] Emergency disclaimers visible (footer + Terms + FAQ)

### Manual verification script

```bash
BASE=http://localhost:3000
for p in / /about /team /licensing /treatment /treatment/php /treatment/iop \
         /treatment/op /admissions /insurance /contact /faq /resources \
         /privacy /terms /sitemap.xml /healthz; do
  printf '%-22s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$BASE$p")"
done
# expect 200 for all of the above

curl -s -o /dev/null -w 'admin unauth: %{http_code}\n' "$BASE/admin"   # 302
curl -s -o /dev/null -w 'unknown: %{http_code}\n' "$BASE/nope"        # 404
curl -s "$BASE/healthz"                                               # provider
```

### Post-launch

- [ ] 1-month warranty window tracked (defect fixes, per agreement §3.6)
- [ ] SEO engagement started (6 months, keyword research + reporting, §4)
- [ ] Decide on the optional CRM/email lead integration (§3.1 — quoted separately)
- [ ] LegitScript website-standards review pass (§3.3)

---

*Last verified against the repo: `typecheck` and `build` both exit 0; all 16
public routes 200; `/sitemap.xml` 19 URLs; admin auth, lead capture and status
updates confirmed. See `docs/BUILD-LOG.md` for the full verification record.*