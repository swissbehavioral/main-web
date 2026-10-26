# Public website SEO audit — 26 October 2026

The website uses React Router Framework SSR (`ssr: true`). The server streams rendered HTML and waits for all content for recognized crawlers. Public content does not require client-side JavaScript to appear in the document.

## Implemented coverage

- CMS page/post titles and descriptions, canonical URLs, Open Graph and Twitter metadata. Shared defaults fill missing social fields without overwriting specific article/profile values.
- English/Spanish alternate links and localized canonical URLs; both language versions listed in the XML sitemap with reciprocal alternate links.
- Public JSON-LD graph for Organization, WebSite, WebPage (ContactPage/AboutPage/ProfilePage where relevant), BreadcrumbList and factual staff Person profiles. Existing article and visible FAQ schema retained. No ratings, licensing claims or clinical outcomes inferred.
- Dedicated verification page and staff profiles included in sitemap. Archived/unpublished material excluded.
- Admin and API indexing prevented with existing robots headers/directives; admin absent from sitemap. Invalid public URLs return HTTP 404.
- Client wording retained. Social preview default uses the existing campus photograph; staff profiles retain individual portraits.

## Verification

`node scripts/audit-public-seo.mjs` checked 46 English/Spanish public raw HTML responses, validating HTTP 200, SSR H1, title, description/social tags, exactly one canonical, language alternates, parseable organization/breadcrumb schema, public indexing directives, admin exclusion and unknown-route HTTP 404. This audit reads public routes only and submits no forms.

`npm test`, `npm run typecheck` and `npm run build` passed. Production Google indexing/rich-result eligibility cannot be established from localhost; the deployed URL can be inspected through Google Search Console once released. This is not a ranking guarantee.

Reference: [Google Search Central: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
