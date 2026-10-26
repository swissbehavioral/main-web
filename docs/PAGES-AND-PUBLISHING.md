# Pages and publishing

Updated 2026-10-24. The user's existing copy and navbar are preserved. Visual changes must be confined to section layouts, illustration, surfaces and typography. Do not rewrite existing text or alter the navbar without explicit instruction.

## Contract pages

| Exhibit A | Page | URL |
|---|---|---|
| 1 | Home | `/` |
| 2 | About Us | `/about` |
| 3 | Our Team | `/team` |
| 4 | Licensing & Accreditation | `/licensing` |
| 5 | Treatment overview | `/treatment` |
| 6 | PHP | `/treatment/php` |
| 7 | IOP | `/treatment/iop` |
| 8 | Outpatient | `/treatment/op` |
| 9 | Reserved fourth program template | `/treatment/additional-program` |
| 10 | Admissions | `/admissions` |
| 11 | Insurance & Payment | `/insurance` |
| 12 | Contact & Location | `/contact` |
| 13 | FAQ | `/faq` |
| 14 | Resources / Blog | `/resources` |
| 15 | Privacy Policy & Notice of Privacy Practices | `/privacy` |
| 16 | Terms of Use | `/terms` |

The fourth program is explicitly unconfirmed. It is not an advertisement for detox, residential treatment, or any invented service.

## Editing

Open `/admin/content` as an administrator or manager. Choose an existing page or **Create blog post**. The block editor supports paragraphs, headings, lists, quotations, and notices, with reordering and previews.

**Save draft** keeps changes private. **Preview saved draft** requires authorized staff access and sends no-store headers. **Publish changes** requires explicit confirmation. Articles marked for review cannot be published. Published articles appear in Resources and the sitemap. Unpublish and archive remove public visibility; restore retains the content.

Existing page layouts and wording render by default through `app/components/original-pages/`. Initial editor content comes from existing source data in `app/data/content-seeds.ts`. Only an explicit publish sets `customized: true` and applies edited content. Saving a draft alone preserves the original public page. Contract page URLs cannot be archived or removed through this editor.

## Storage and verification

The private Appwrite `content` collection stores separate draft and published JSON snapshots. Setup: `npm run setup:content`. Local development without Appwrite uses `storage/content.json`; it is intended for one process. Never silently fall back to files when configured Appwrite is unavailable.

The production build, typecheck and ten unit checks pass. All sixteen pages and the draft/publish/unpublish/archive workflow passed against an isolated local store. Public reads from the Appwrite-connected preview succeeded. Live Appwrite publishing writes have not been tested: automatic review rejected creating remote test staff accounts and temporary published content. Do not bypass that rejection.

## Content requiring client confirmation

Retain the user's existing wording. Track factual review separately: actual licenses and certification status, verified clinical staff, all service locations, insurance participation and costs, approved privacy/NPP documents, and the fourth program. Website structure alone cannot establish LegitScript certification. Official reference: https://www.legitscript.com/certification/addiction-treatment-certification/ .

Privacy update (October 25, 2026): `/privacy` now documents the actual website storage and processing. The separate healthcare notice is a draft requiring SBH's legal entity, privacy contact, effective date and confidentiality review. Cookie preferences can be reopened from the footer; optional Maps is off without consent. Google Fonts delivery remains separately disclosed. Change the consent version and request fresh choices if optional purposes change. Contract-page rendering recovers from CMS outages using an in-memory published snapshot or bundled page; admin operations and submitted records still require the configured backend. Run `node scripts/test-content-outage.mjs` to verify this distinction without contacting Appwrite.

### Editing text without replacing the design
Existing website pages now always retain their designed components. Publishing a word change no longer selects a generic block template. Edit the title, introduction, section labels and existing body text, then save and open **Preview saved draft** to see the real page before publishing. Section order, block types/count, list line counts, forms, destination URLs and styles are protected. The blog editor and unconfirmed additional-program boilerplate remain flexible.

Developers: `customized` indicates published text changes only; it must never select a different layout. Keep baseline page slot identities/order stable or provide an explicit migration. `npm test` includes layout and text-rendering regression coverage for all 15 designed pages. The isolated `scripts/test-content-local.mjs` checks the real draft/publish workflow without remote writes. Longer copy can naturally change line wrapping, but publishing must preserve the page template and components.

The shared UI layer now includes shadcn/ui Calendar/Button/Popover components and an Aceternity Background Gradient adapted to SBH colors. Public sections alternate stronger brand and neutral backgrounds; solid brand CTAs use white text. Admin date fields remain normal named ISO form values, with inclusive America/New_York filtering. `node scripts/test-admin-date-filters.mjs` verifies filtering and CSV behavior against the isolated file-store server on 5182. Invalid/reversed ranges are reported rather than widening exports.
