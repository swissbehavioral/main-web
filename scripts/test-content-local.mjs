import assert from "node:assert/strict";
import { readFile, rm } from "node:fs/promises";
const base = "http://127.0.0.1:5182";
const pass = (message) => console.log("PASS", message);
async function request(path, { cookie = "", body } = {}) {
  return fetch(base + path, {
    method: body ? "POST" : "GET",
    redirect: "manual",
    headers: {
      ...(cookie ? { Cookie: cookie } : {}),
      ...(body ? { Origin: base } : {}),
    },
    ...(body ? { body: new URLSearchParams(body) } : {}),
  });
}
const health = await (await request("/healthz")).json();
assert.equal(health.provider, "file");
assert.equal(health.appwrite.configured, false);
await rm("/tmp/sbh-cms-isolated/content.json", { force: true });
const paths = [
  "/",
  "/about",
  "/team",
  "/licensing",
  "/treatment",
  "/treatment/php",
  "/treatment/iop",
  "/treatment/op",
  "/admissions",
  "/insurance",
  "/contact",
  "/faq",
  "/resources",
  "/privacy",
  "/terms",
];
for (const path of paths) {
  assert.equal((await request(path)).status, 200, path);
}
pass("All fifteen supplied public pages respond");
assert.equal((await request("/not-a-real-page")).status, 404);
assert.equal((await request("/treatment/not-a-program")).status, 404);
pass("Unknown page and program URLs return 404");
assert.equal((await request("/admin/content")).status, 302);
assert.equal((await request("/admin/content/page-team/preview")).status, 302);
pass("Admin and draft previews require authentication");
const login = await request("/admin/login", {
  body: {
    email: "qa-local@example.com",
    password: "sbh-local-cms-qa-only",
    redirectTo: "/admin/content",
  },
});
assert.equal(login.status, 302);
const cookie = login.headers.get("set-cookie").split(";")[0];
const dashboard = await (await request("/admin/content", { cookie })).text();
assert(!dashboard.includes("Before applying to LegitScript"));
pass("Admin directory lists every contract page");
const slug = `qa-editorial-${Date.now()}`,
  draft = {
    intent: "save",
    revision: "new",
    slug,
    title: "QA draft title",
    eyebrow: "QA journal",
    summary: "Synthetic QA test only.",
    metaDescription: "QA search description",
    seoTitle: "QA custom SEO title",
    body: JSON.stringify([{ type: "paragraph", text: "QA draft body [Read more](https://example.com/clinical)" }]),
    author: "QA editorial team",
    sources: "https://example.com/reference",
    category: "QA",
    reviewRequired: "on",
    reviewNotes: "QA review pending",
  };
let response = await request("/admin/content/new", { cookie, body: draft });
assert.equal(response.status, 302);
const id = response.headers.get("location").split("/").at(-1).split("?")[0];
async function row() {
  return JSON.parse(
    await readFile("/tmp/sbh-cms-isolated/content.json", "utf8"),
  ).find((r) => r.id === id);
}
assert.equal((await request(`/resources/${slug}`)).status, 404);
assert(
  !(await (await request("/resources")).text()).includes("QA draft title"),
);
pass("Draft is private and absent from public listings");
const preview = await request(`/admin/content/${id}/preview`, { cookie });
assert.equal(preview.status, 200);
assert.equal(preview.headers.get("cache-control"), "no-store, private");
pass("Saved draft preview is private and non-cacheable");
let record = await row(),
  payload = {
    ...draft,
    revision: record.updatedAt,
    intent: "publish",
    confirmPublish: "on",
  };
assert.equal(
  (await request(`/admin/content/${id}`, { cookie, body: payload })).status,
  400,
);
pass("Review flag prevents unreviewed blog publication");
delete payload.reviewRequired;
assert.equal(
  (await request(`/admin/content/${id}`, { cookie, body: payload })).status,
  302,
);
assert(
  (await (await request(`/resources/${slug}`)).text()).includes(
    "QA draft body",
  ),
);
assert((await (await request("/sitemap.xml")).text()).includes(slug));
const seoHtml=await (await request(`/resources/${slug}`)).text();
assert(seoHtml.includes('<title>QA custom SEO title</title>'));
assert(seoHtml.includes('name="description" content="QA search description"'));
assert(seoHtml.includes(`rel="canonical" href="https://www.swissbehavioralhealth.com/resources/${slug}"`));
assert(seoHtml.includes('href="https://example.com/clinical"'));
assert(seoHtml.includes("Sources &amp; further reading"));
assert(seoHtml.includes('href="https://example.com/reference"'));
assert(seoHtml.includes('"author":{"@type":"Person","name":"QA editorial team"}'));
pass("Published SEO title, description, canonical URL, article author and content links render correctly");
pass("Publishing adds article to public page, listings, and sitemap");
record = await row();
payload = {
  ...payload,
  intent: "save",
  revision: record.updatedAt,
  body: JSON.stringify([
    { type: "paragraph", text: "QA updated unpublished body" },
  ]),
};
assert.equal(
  (await request(`/admin/content/${id}`, { cookie, body: payload })).status,
  302,
);
const html = await (await request(`/resources/${slug}`)).text();
assert(html.includes("QA draft body"));
assert(!html.includes("QA updated unpublished body"));
pass("Draft changes preserve the last published version");
assert.equal(
  (await request(`/admin/content/${id}`, { cookie, body: payload })).status,
  409,
);
pass("Stale revisions are rejected");
record = await row();
payload = { ...payload, intent: "publish", revision: record.updatedAt };
assert.equal(
  (await request(`/admin/content/${id}`, { cookie, body: payload })).status,
  302,
);
assert(
  (await (await request(`/resources/${slug}`)).text()).includes(
    "QA updated unpublished body",
  ),
);
pass("Publishing an update changes public content");
record = await row();
payload = {
  ...payload,
  intent: "unpublish",
  confirmVisibility: "on",
  revision: record.updatedAt,
};
assert.equal(
  (await request(`/admin/content/${id}`, { cookie, body: payload })).status,
  302,
);
assert.equal((await request(`/resources/${slug}`)).status, 404);
assert(!(await (await request("/sitemap.xml")).text()).includes(slug));
pass("Unpublishing removes the article and sitemap entry");
record = await row();
payload = { ...payload, intent: "archive", revision: record.updatedAt };
assert.equal(
  (await request(`/admin/content/${id}`, { cookie, body: payload })).status,
  302,
);
assert.equal((await row()).archived, true);
record = await row();
payload = { ...payload, intent: "restore", revision: record.updatedAt };
assert.equal(
  (await request(`/admin/content/${id}`, { cookie, body: payload })).status,
  302,
);
assert.equal((await row()).archived, false);
pass("Archive and restore preserve content");
assert.equal(
  (
    await request("/admin/content/new", {
      cookie,
      body: { ...draft, slug: "what-to-expect-when-you-call-admissions" },
    })
  ).status,
  409,
);
pass("Duplicate URL slugs are rejected");
const teamEditor = await (
  await request("/admin/content/page-team", { cookie })
).text();
const encodedTeamBody = teamEditor.match(/name="body" value="([^"]*)"/)?.[1];
assert(encodedTeamBody, "Designed page editor supplies existing section slots");
const teamBlocks = JSON.parse(
  encodedTeamBody
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&"),
);
teamBlocks.find((block) => block.type === "paragraph").text +=
  " QA team draft only";
const pageId = "page-team",
  pageBody = {
    intent: "save",
    revision: "seed",
    title: "QA team draft title",
    eyebrow: "OUR TEAM",
    summary: "QA draft intro.",
    metaDescription: "QA team description",
    body: JSON.stringify(teamBlocks),
    reviewRequired: "on",
    reviewNotes: "Synthetic test.",
  };
assert.equal(
  (await request(`/admin/content/${pageId}`, { cookie, body: pageBody }))
    .status,
  302,
);
const teamPublic = await (await request("/team")).text();
assert(!teamPublic.includes("QA team draft title"));
pass("Editing a seeded page preserves the public page until publication");
const seedRecord = JSON.parse(
  await readFile("/tmp/sbh-cms-isolated/content.json", "utf8"),
).find((r) => r.id === pageId);
assert.equal(
  (
    await request(`/admin/content/${pageId}`, {
      cookie,
      body: {
        ...pageBody,
        intent: "archive",
        confirmVisibility: "on",
        revision: seedRecord.updatedAt,
      },
    })
  ).status,
  400,
);
pass("Contract pages cannot be archived or removed");
const insurance = await request("/api/lead", {
  body: {
    kind: "insurance",
    name: "QA Local Insurance",
    phone: "2025550100",
    insurer: "QA Test Plan",
    consent: "on",
    source: "/insurance#verify",
  },
});
assert.equal(insurance.status, 201);
const leadId = (await insurance.json()).id;
const stored = JSON.parse(
  await readFile("/tmp/sbh-cms-isolated/leads.json", "utf8"),
).find((l) => l.id === leadId);
assert.equal(stored.kind, "insurance");
assert.equal(stored.insurer, "QA Test Plan");
pass("Insurance form endpoint still saves to the configured lead provider");
console.log(
  "All editorial workflow checks passed in isolated local storage. No remote data was changed.",
);

// Publishing website copy must retain the designed sections, including old
// documents without slot metadata (the editor attaches slots on first edit).
const homeEditor = await (
  await request("/admin/content/page-home", { cookie })
).text();
const encodedHomeBody = homeEditor.match(/name="body" value="([^"]*)"/)?.[1];
assert(encodedHomeBody);
const homeBlocks = JSON.parse(
  encodedHomeBody
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&"),
);
homeBlocks[12].text += " QA published body marker";
const homePayload = {
  intent: "save",
  revision: "seed",
  title: "Small by design. Personal by nature. QA title",
  eyebrow: "Behavioral health · Tampa Bay, Florida",
  summary: "QA introduction marker",
  metaDescription: "QA homepage",
  body: JSON.stringify(homeBlocks),
};
assert.equal(
  (await request("/admin/content/page-home", { cookie, body: homePayload }))
    .status,
  302,
);
assert(
  !(await (await request("/")).text()).includes("QA published body marker"),
);
const homePreview = await (
  await request("/admin/content/page-home/preview", { cookie })
).text();
assert(homePreview.includes("QA published body marker"));
assert(/class="[^"]*\bcare-strip\b/.test(homePreview));
let homeRow = JSON.parse(
  await readFile("/tmp/sbh-cms-isolated/content.json", "utf8"),
).find((row) => row.id === "page-home");
assert.equal(
  (
    await request("/admin/content/page-home", {
      cookie,
      body: {
        ...homePayload,
        revision: homeRow.updatedAt,
        intent: "publish",
        confirmPublish: "on",
      },
    })
  ).status,
  302,
);
const publishedHome = await (await request("/")).text();
for (const marker of [
  "QA published body marker",
  "QA introduction marker",
  "Personal by nature. QA title",
  'care-strip',
  'id="programs"',
  'id="approach"',
  'id="home-faq-heading"',
  'id="admissions"',
])
  assert(publishedHome.includes(marker), marker);
homeRow = JSON.parse(
  await readFile("/tmp/sbh-cms-isolated/content.json", "utf8"),
).find((row) => row.id === "page-home");
[homeBlocks[0], homeBlocks[1]] = [homeBlocks[1], homeBlocks[0]];
assert.equal(
  (
    await request("/admin/content/page-home", {
      cookie,
      body: {
        ...homePayload,
        revision: homeRow.updatedAt,
        body: JSON.stringify(homeBlocks),
        intent: "publish",
        confirmPublish: "on",
      },
    })
  ).status,
  400,
);
pass(
  "Home draft preview and publication preserve the design and all edited copy; server rejects same-type section reordering",
);
