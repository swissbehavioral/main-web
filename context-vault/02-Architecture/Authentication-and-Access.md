---
title: "Authentication and access"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Authentication and access

Source: `app/lib/auth.server.ts` and admin route modules.

Default mode checks `ADMIN_PASSWORD`, optionally requiring `ADMIN_EMAIL`. Optional Appwrite mode activates only when `APPWRITE_AUTH_ENABLED` equals `true` and all three Appwrite connection variables exist.

Appwrite mode creates an email/password session using a client without the server API key, then attempts to delete it through the Users service. Cleanup failure is ignored. Successful login issues the website's own signed cookie, rather than keeping an Appwrite session for subsequent requests.

The cookie is `httpOnly`, `sameSite=lax`, secure in production and valid for eight hours. Subsequent checks trust its admin marker. Remote role changes or disabling an Appwrite user do not trigger a fresh user lookup on each request; account revocation behavior needs to be designed accordingly.

## Current gaps

- Any valid Appwrite project user is accepted as an admin; there is no explicit role/team/allowlist check.
- Missing production secrets warn but leave development defaults active.
- Requested Appwrite auth with missing connection credentials selects shared-password mode.
- No application login rate limiter was found.

Before expanding authentication, define which identities may administer leads, how access is removed and how existing cookies are invalidated. See [[../05-Quality-and-Risks/Findings|Findings]] and [[../06-Decisions/Decision-Register|Decision register]].
