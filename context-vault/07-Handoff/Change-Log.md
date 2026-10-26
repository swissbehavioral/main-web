---
title: "Vault change log"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Vault change log

## 2026-10-18 — initial context audit

Reviewed source integration structure and existing project documentation. Ran typecheck/build successfully. Created the original single-file context note; no Appwrite/VPS deployment or runtime fixes performed.

## 2026-10-18 — structured context vault

Reorganized memory into a standalone `context-vault` with numbered folders, an entry point, linked architecture/integration/operations notes, explicit findings, evidence, decisions, handoff instructions and reusable templates. Added source-review observations on file-store corruption handling and cookie revocation. Original context-note path now points to this vault. Runtime behavior unchanged.

Validation: internal wiki-links, external relative source links, required folders and Obsidian JSON configuration checked programmatically. Code checks from the initial audit remain the latest recorded compilation evidence.

## 2026-10-19 — public and admin visual redesign

Modernized the brand system, hero, public sections and shared controls. Added a dedicated responsive staff workspace and login, with updated table/detail styling. Public shell is omitted on admin routes. Preserved backend logic and existing data flows. Verified desktop/mobile views, local inquiry capture, login/logout, filtering and lead status/notes updates. Removed the synthetic record after checks. Final typecheck/build passed. Added Visual Design System note and preview screenshots. Port 5180 is used for this project's preview.

## 2026-10-20 — Appwrite provisioning

Fixed the required consent boolean default in bootstrap; setup completed against configured remote instance. Leads collection read succeeded (zero records). Admin provisioning skipped because optional credentials were absent. Write/auth acceptance remains pending.

## 2026-10-20 — reference-inspired public navigation

Replaced public header with floating navy pill, centered white logo and teal insurance action. Added Explore/Treatment/About mega dropdowns, brand SVG card illustrations, mobile accordions and accessible dismissal/keyboard behavior. Typecheck/build passed; desktop/tablet/mobile browser checks completed. Details in Visual Design System note.

Navbar refinement: changed bar surface to white, restored the original color logo and navy text/mobile controls at user request. Updated desktop/mobile preview screenshots after visual verification.
