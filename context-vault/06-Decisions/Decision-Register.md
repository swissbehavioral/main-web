---
title: "Decision register"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Decision register

Distinguish source behavior from user-approved infrastructure decisions.

| ID | Choice | Status | Reason / follow-up |
|---|---|---|---|
| D-001 | React Router SSR with typed content modules | Implemented | Existing application design |
| D-002 | Server-only lead provider facade | Implemented | Shared API for Appwrite and file storage |
| D-003 | No silent fallback during configured Appwrite outage | Implemented | Avoid splitting records across providers |
| D-004 | Website cookie after credential verification | Implemented | Existing stateless request checks; revocation needs review |
| D-005 | Appwrite deployed separately from website | Architecture supported | SDK connects to remote API; website image contains no Appwrite server |
| D-006 | Use VPS-hosted Appwrite | Proposed | Matches discussed direction; actual host/version and selection not confirmed |
| D-007 | External CRM/email/staffed chat | Deferred / unselected | Requires scope/provider decision |

Do not upgrade a proposal to accepted merely because it appears in a runbook. Use [[../09-Templates/Decision-Template|Decision template]] for substantial changes, then update this register.

## D-008 — brand and staff workspace redesign (implemented 2026-10-19)

User requested a more professional logo-based design for both surfaces. Adopted paper/mist surfaces, deep ink and mineral teal, restrained serif public headings and sans-serif staff views. Staff navigation is separated from the public shell. Details: [[../02-Architecture/Visual-Design-System|Visual design system]].
