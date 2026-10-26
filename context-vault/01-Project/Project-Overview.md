---
title: "Project overview"
updated: 2026-10-18
tags: [sbh, context-vault]
---

# Project overview

Swiss Behavioral Health is a React Router framework-mode website with public treatment/admissions information and a protected lead-management dashboard. This workspace is `/Users/fidaali/swissbehavioralhealth`.

The existing README and build plan describe a FAVIF Digital service agreement, public pages, lead capture, SEO groundwork and an admin dashboard. The fourth treatment program is reserved pending confirmation; do not infer that it exists because a deliverable list numbers it.

The website captures inquiries, insurance requests and chat leads. It is not implemented as a clinical records system. The chat widget captures a message; it is not a staffed live-chat integration.

Primary paths: visitors read public pages and submit forms; admissions staff sign in, review leads, update status and add notes. Content comes from typed modules rather than an external CMS.

Current stack: React 19, React Router 7 with SSR, TypeScript, Tailwind 4 and Vite. Appwrite is an optional remote backend; a local JSON provider supports development.

See [[Current-State]], [[Content-and-Ownership]] and [[../08-Reference/Source-Index|source documents]].
