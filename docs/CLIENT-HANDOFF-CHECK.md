# Website handoff check — October 25, 2026

## Completed in this workspace

The client-supplied services and business copy are treated as confirmed. The programs overview and PHP, IOP and OP detail pages remain in the original designed components, with CMS text editing that cannot reorder or replace their structure. The unused additional-program scaffold is excluded from public and administrative directories rather than advertising an invented fourth service.

Removed development checklists, confirmation notices and template labels from the deliverable. Blog draft/save/publish controls remain normal editorial features. The fixed mobile Call/Chat/Verify bar and its layout offsets were removed; the navbar, footer and live-chat contact remain available.

Privacy and healthcare privacy notices now have patient-facing content and the supplied contact details. Cookie choices block optional Maps until allowed. Fonts are hosted locally. No certification badge or unearned accreditation has been added.

Production now requires a strong session secret, HTTPS Appwrite backend and individual Appwrite staff authentication. Shared-password and file-store operation are development-only. Added nonce-based script policy, HTTPS canonical redirects, anti-framing and MIME protections, restricted browser permissions, private administrative caching, request body limits and rate limits. Server credentials are not client environment variables. Docker excludes environment files and runs as a non-root user.

## Verification

Typecheck, production build, 19 unit checks and layout regression checks for all 15 designed pages passed. Isolated local tests passed for article publication/unpublication/archive/restore, stale revisions, homepage edits, insurance form storage, date filters, CSV exports and public content-service outage fallback. Synthetic tests did not change remote Appwrite records. A production preview of the programs page produced no browser warnings or errors.

Read-only Appwrite inspection found no collection-wide public permissions for leads, content, conversations, messages or chat events. The chat collections use document security; realtime event documents carry revision markers rather than message bodies. This is not a full infrastructure audit.

## Deployment

Use `npm run build`, then `npm run start:env` on Node 24, or the supplied Dockerfile with runtime environment variables. Configure PUBLIC_ORIGIN for the final HTTPS domain. Only set TRUST_PROXY when requests reach Node through the identified trusted reverse proxy; for a same-host proxy, use loopback and bind Node to 127.0.0.1. Forward the original Host and X-Forwarded-Proto from that proxy. The production server redirects HTTP/noncanonical hosts and supplies security headers for documents and data endpoints. Confirm TLS and headers on the final domain after deployment; the existing main-domain site has not been replaced by this work.

The session-signing secret was strengthened locally, which can require staff to sign in again and visitors to restart chat. Keep .env private and outside source control. Production storage, backups and logs must remain inaccessible to public web roots.

## Certification evidence outside a website implementation

LegitScript evaluates the business and operations as well as the site. Its 16 standards cover licensing/registration, legal compliance, clinical policies, location ownership or lease, facility/entity disclosures, staff qualifications, legal/disciplinary history, liability coverage, truthful website content, privacy, approved medications, prohibited lead-generator affiliations, advertising, incentives, affiliates and transparency.

The supplied source still says DCF licensure is pending; that factual status was retained. This work cannot issue a license or certify the business. The owner’s application must include the actual operational evidence required by LegitScript. Facility and staff photographs remain the client's supplied assets as requested; any facility photo must depict the actual facility accurately.

Infrastructure evidence not established by application code: hosting/vendor agreements and any required BAAs; encryption at rest and key handling on the VPS; access reviews; backup restoration; breach-response and retention procedures; actual clinical privacy practices and implementation of the published notice. Do not describe the system as HIPAA certified based on this code review.

Sources:
- https://www.legitscript.com/certification/addiction-treatment-certification/
- https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/model-notices-privacy-practices/index.html
