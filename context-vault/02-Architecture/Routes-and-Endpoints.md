---
title: "Routes and endpoints"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Routes and endpoints

Source: `app/routes.ts`. Dynamic routes expand from content, so distinguish route patterns from actual published pages.

| Route | Module under `app/routes/` |
|---|---|
| `/` | `home.tsx` |
| `/about`, `/team`, `/licensing` | `about.tsx`, `team.tsx`, `licensing.tsx` |
| `/treatment` | `treatment.tsx` |
| `/treatment/:program` | `program.tsx` (PHP/IOP/OP content) |
| `/admissions`, `/insurance`, `/contact` | Corresponding named modules |
| `/faq` | `faq.tsx` |
| `/resources`, `/resources/:slug` | `resources.tsx`, `resource.tsx` |
| `/privacy`, `/terms` | `privacy.tsx`, `terms.tsx` |
| `/admin/login` | `admin.login.tsx` |
| `/admin/logout` | `admin.logout.tsx` |
| `/admin` | `admin.tsx` layout + `admin.dashboard.tsx` index |
| `/admin/leads/:id` | `admin.lead.tsx` |
| `/api/lead` | `api.lead.tsx` |
| `/healthz` | `health.tsx` |
| `/sitemap.xml` | `sitemap.ts` |

`POST /api/lead`: 201 stored; 400 validation errors; 502 storage failure. A populated honeypot returns success without storing. GET returns 405.

`GET /healthz`: JSON provider/configured/reachable values. It currently returns HTTP 200 and `status: ok` even on backend failure. Monitor the fields, not just HTTP status.

Admin loaders/actions must enforce authorization server-side. A route being nested under the admin layout is not a substitute for checking every data/mutation entry point when adding new routes.
