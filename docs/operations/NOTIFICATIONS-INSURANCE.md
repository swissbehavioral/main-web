# Dashboard alerts and insurance inquiries

## Staff workflow

- `/admin/insurance` is a dedicated, server-enforced insurance queue. Existing role, assignment, status, date-filter and CSV permissions still apply. Opening an insurance lead returns to this queue with the in-app Back button.
- Sidebar badges represent unread incoming inquiries and visitor chats. Visible records are acknowledged on this browser profile, per signed-in staff member. Read state synchronizes between dashboard tabs. Reading a request does not change its workflow status.
- The workspace reconciles authenticated snapshots every 15 seconds, including in a background tab, and refreshes on focus and reconnection. Browsers may throttle background timers. The existing selected-chat realtime integration remains in place.
- Staff can opt into desktop notifications with **Enable desktop alerts**, then allow the browser prompt. No prompt runs automatically. Permission denial or lack of browser support leaves section and tab-title badges available.
- Keep a signed-in dashboard tab open. This is not closed-browser push delivery. Notifications contain generic event types only, without names, messages, diagnoses or insurance details. Multiple dashboard tabs coordinate delivery to avoid duplicate alerts; an active staff tab suppresses unnecessary desktop popups.

## Insurance capture and storage

The dedicated form requests callback information, insurer, patient name and birth date, relationship to the patient, and optional policyholder, member/group, plan and insurer-phone details. It includes authorization and contact-consent checkboxes. No clinical records, Social Security numbers, payment cards or uploads are requested.

Patterns reviewed: [Hazelden Betty Ford](https://hazeldenbettyford.my.site.com/myHazelden/myinsurance), [Southern California Recovery Centers](https://socalrecovery.com/verify-insurance/), and [Texas Recovery Centers](https://texasrecoverycenters.com/insurance-verification-form/). This implementation does not copy their coverage claims or represent the form as an automatic benefits determination.

Run `npm run setup:insurance` on a fresh Appwrite project. It creates the private `insurance_requests` collection with a required encrypted `payload` field and verifies transaction support through an empty rolled-back transaction. It does not create patients, staff or sample leads. The existing leads collection reached its attribute limit, so it is intentionally unchanged.

Structured patient/policy details use AES-256-GCM with a random nonce. A domain-separated HKDF key is derived from the server's existing `SESSION_SECRET`. Back up that secret securely: changing it requires re-encrypting these payloads before replacing the key. Session-cookie key rotation and insurance-payload key rotation must be planned together. No secret values belong in Git.

An insurance payload and its associated lead share an ID and commit in one Appwrite transaction. Only server-side database credentials access the private collection. Managers, administrators and the assigned representative can read decrypted details through the guarded lead-detail route; read-only viewers do not receive them. General directory loaders, notifications and CSVs exclude the payload. Soft deletion retains the insurance record with the associated lead so it can be restored; retention and permanent removal should follow the organization's approved policy.

The privacy policy's two previous stock insurance paragraphs are upgraded on read only when their exact prior text is unchanged. Other client edits and publication states are preserved. New interface copy has Spanish translations.

## Validation

- `npm run typecheck`, `npm test`, and `npm run build`.
- Unit coverage includes insurance field validation, real/nonfuture dates, authenticated encryption/tamper detection, notification role filtering, acknowledgment, desktop-permission decisions and atomic transaction commit/rollback.
- An isolated Vite workspace on `127.0.0.1:5188` used synthetic file-backed records with all Appwrite connection settings empty and Appwrite auth disabled. `scripts/check-workspace-alerts-local.mjs` verifies sign-in, capture, encrypted storage, authorized detail rendering, insurance-only queue, generic notifications, private cache headers, CSV exclusion and rejection of incomplete submissions. For browser QA, use `localhost:5188` rather than the normal website host so test cookies do not replace the main workspace session. The script expects the local QA credentials `qa@example.invalid` / `local-qa-only`, storage `/tmp/sbh-workspace-qa`, and fails sign-in before creating fixtures if that setup is absent. Do not run it against the normal backend.
- A temporary local Cloudflare Worker verified the same AES-GCM/HKDF encryption and decryption functions with synthetic data.
- Browser checks covered incoming badges/toasts without refreshing, read-state synchronization across dashboard tabs, dedicated queue navigation, and birth-date calendar year/month/day selection. No real lead, patient, staff account or chat message was created during QA. Actual operating-system notification delivery depends on the staff browser granting permission.
