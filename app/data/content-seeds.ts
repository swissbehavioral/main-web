/** Editable starter content transcribed from the existing site's copy. */
import { programLevels } from "./programs";
import { resourcePosts } from "./resources";
import { privacyDoc, nppDoc, termsDoc, type LegalDoc } from "./legal";
import { faqs } from "./faqs";
import {
  admissions,
  about,
  approach,
  programs,
  therapies,
  families,
  insurance,
  contact,
  site,
  pageMeta,
  statistics,
} from "./site";
import { team } from "./team";
import {leadership,leadershipMembers,facility} from "./recovered-content";
import { licensing } from "./licensing";
import type { ContentBlock, ContentDocument } from "../lib/content.types";
const h = (text: string): ContentBlock => ({ type: "heading", text });
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const note = (text: string): ContentBlock => ({ type: "callout", text });
const list = (items: readonly string[]): ContentBlock => ({
  type: "list",
  text: items.join("\n"),
});
const pillars = () => [
  h(approach.heading),
  p(approach.intro),
  ...approach.pillars.flatMap((x) => [h(x.title), p(x.body)]),
];
const leadershipBlocks = () => [h(leadership.title),p(leadership.intro),...leadershipMembers.flatMap(member=>[h(member.name),p(member.role),p(member.credentials)])];
const facilityBlocks = () => [h(facility.settingTitle),p(facility.settingText),list([facility.settingList1,facility.settingList2,facility.settingList3]),h(facility.lodgingTitle),p(facility.lodgingText),p(facility.lodgingNote)];
const aboutBlocks = () => [
  h(about.heading),
  p(about.intro),
  { type: "quote" as const, text: about.quote },
  p(about.body),
  list(about.benefits),
];
const programBlocks = () => [
  h(programs.heading),
  p(programs.intro),
  ...programs.levels.flatMap((x) => [h(x.name), p(x.description)]),
];
const legalBody = (doc: LegalDoc) =>
  doc.sections.flatMap((s) => [
    h(s.heading),
    ...s.blocks.map((b) => (b.list ? list(b.list) : p(b.p || ""))),
  ]);
function page(
  id: string,
  path: string,
  title: string,
  eyebrow: string,
  summary: string,
  body: ContentBlock[],
  reviewNotes = "",
): ContentDocument {
  const meta = pageMeta[id as keyof typeof pageMeta];
  return {
    id: `page-${id}`,
    kind: "page",
    path,
    title,
    eyebrow,
    summary,
    metaDescription: meta?.description || summary.slice(0, 280),
    seoTitle: meta?.title,
    body: body.map((block, index) => ({
      ...block,
      slot: `page-${id}:${index}`,
    })),
    reviewRequired: false,
    reviewNotes: "",
    author: "",
    reviewer: "",
    sources: "",
    category: "",
    publishedAt: "",
  };
}
export const pageSeeds: ContentDocument[] = [
  page(
    "home",
    "/",
    "Small by design. Personal by nature.",
    "Behavioral health · Tampa Bay, Florida",
    "Individualized treatment. Meaningful connection. A smaller setting with the space to focus on you.",
    [
      ...statistics.items.map((x) => p(`${x.value}\n${x.label}`)),
      ...aboutBlocks(),
      ...pillars(),
      ...programBlocks(),
      h(therapies.heading),
      p(therapies.intro),
      h(families.heading),
      p(families.body),
      h(insurance.heading),
      p(insurance.body),
      h(admissions.heading),
      p(admissions.intro),
      ...admissions.steps.flatMap((x) => [h(x.title), p(x.body)]),
      ...leadershipBlocks(), ...facilityBlocks(),
    ],
  ),
  page(
    "about",
    "/about",
    "Small by Design. Personal by Nature.",
    "About Swiss Behavioral Health",
    `${site.descriptor}. An intentionally small behavioral health program offering highly individualized treatment, exceptional access to our clinical team, and 14-bed supportive lodging beside Philippe Park in Safety Harbor, Florida.`,
    [...aboutBlocks(), ...pillars(), ...leadershipBlocks()],
  ),
  page(
    "team",
    "/team",
    team.heading,
    team.eyebrow,
    team.intro,
    [
      h("Clinical & medical staff"),
      h("Meet your care team"),
      p(team.pendingNotice),
      h("How our care team is structured"),
      ...team.disciplines.flatMap((x) => [h(x.title), p(x.body)]),
      ...team.members.flatMap(member=>[h(member.name),p(member.role),p(member.credentials),p(member.bio)]),
    ],
    "Add verified staff names, credentials, license numbers, biographies, and approved photos.",
  ),
  page(
    "licensing",
    "/licensing",
    licensing.heading,
    licensing.eyebrow,
    licensing.intro,
    [
      h("Current status"),
      ...licensing.items.flatMap((x) => [
        h(x.authority),
        p(x.statusLabel),
        p(x.scope),
        ...(x.reference ? [p(x.reference)] : []),
        p(x.note),
      ]),
      p(licensing.disclaimer),
      h(licensing.facility.heading),
      p(licensing.facility.body),
      p(licensing.facility.address),
    ],
    "Confirm the actual licenses, certification status, and supporting details before approving updates.",
  ),
  page(
    "treatment",
    "/treatment",
    programs.heading,
    programs.eyebrow,
    programs.intro,
    [
      ...programBlocks(),
      ...pillars(),
      h(therapies.heading),
      p(therapies.intro),
      h(families.heading),
      p(families.body),
      ...facilityBlocks(),
    ],
  ),
  ...programLevels.map((x) =>
    page(
      x.slug,
      `/treatment/${x.slug}`,
      x.name,
      `${x.code} · Level of Care`,
      x.description,
      [
        p(x.tagline),
        p(x.definition),
        ...x.typicalSchedule.map((s) => p(`${s.label}: ${s.value}`)),
        p(x.scheduleNote),
        list(x.whoFor),
        list(x.includes),
        p(x.family),
        ...x.faqs.flatMap((f) => [h(f.q), p(f.a)]),
      ],
      "Confirm program details with SBH before approving any changes.",
    ),
  ),
  page(
    "additional-program",
    "/treatment/additional-program",
    "Additional program: details to be confirmed.",
    "Program page template",
    "A reserved fourth program page from the contract. No additional treatment service is being advertised.",
    [
      h("Program name and level of care"),
      note(
        "[Enter only a service SBH actually provides and is appropriately licensed to deliver.]",
      ),
      h("Service description"),
      note(
        "[Add the approved program description, eligible population, treatments, location, schedule, admissions process, and payment information.]",
      ),
    ],
    "This is a new boilerplate page. Confirm the fourth program before promoting it.",
  ),
  page(
    "admissions",
    "/admissions",
    admissions.heading,
    admissions.eyebrow,
    admissions.intro,
    [...admissions.steps.flatMap((x) => [h(x.title), p(x.body)]), ...pillars()],
  ),
  page(
    "insurance",
    "/insurance",
    insurance.heading,
    insurance.eyebrow,
    insurance.body,
    [
      p(
        "Coverage questions change frequently. For the most current information, always speak directly with the Admissions team.",
      ),
      h("Request a verification"),
      p(
        "Share a few details and our admissions team will review your coverage options with you. This form is for insurance and payment questions only.",
      ),
      list([
        "We review the details you submit.",
        "We check coverage with your insurer where applicable.",
        "We explain costs, co-pays and payment options before treatment begins.",
        "We identify the appropriate level of care and the next step.",
      ]),
    ],
    "Add verified insurance and payment details where needed without replacing approved copy.",
  ),
  page("contact", "/contact", contact.heading, contact.eyebrow, contact.body, [
    p(site.address.full),
    p(site.phone.display),
    p(site.email.display),
    h("Find us"),
    p(site.hours),
    p(site.emergencyNote),
  ]),
  page(
    "faq",
    "/faq",
    "Questions People Ask Before Reaching Out",
    "FAQ",
    "General information about admissions, treatment, insurance and confidentiality at Swiss Behavioral Health.",
    faqs.flatMap((g) => [
      h(g.title),
      ...g.items.flatMap((f) => [h(f.q), p(f.a)]),
    ]),
  ),
  page(
    "resources",
    "/resources",
    "Guidance for the Decisions Ahead",
    "Resources & Blog",
    "General, educational reading about recovery, levels of care, supporting a loved one, and understanding insurance. Not medical advice.",
    [
      h("Looking for something else?"),
      p(
        "If you have a question that isn't covered here, our admissions team can help — no obligation, and the conversation is confidential.",
      ),
    ],
  ),
  page(
    "privacy",
    "/privacy",
    privacyDoc.title,
    privacyDoc.eyebrow,
    privacyDoc.intro,
    [
      ...legalBody(privacyDoc),
      h(nppDoc.title),
      p(nppDoc.intro),
      ...legalBody(nppDoc),
    ],
    "Obtain client approval of the existing Privacy Policy and Notice of Privacy Practices before launch.",
  ),
  page(
    "terms",
    "/terms",
    termsDoc.title,
    termsDoc.eyebrow,
    termsDoc.intro,
    legalBody(termsDoc),
    "Obtain client approval of the existing terms before launch.",
  ),
];
export const postSeeds: ContentDocument[] = resourcePosts.map((r, i) => ({
  id: `post-seed-${i + 1}`,
  kind: "post",
  path: `/resources/${r.slug}`,
  title: r.title,
  eyebrow: "Resources & Blog",
  summary: r.description,
  metaDescription: r.description,
  body: r.body.map((b) => ({
    type:
      b.type === "h"
        ? "heading"
        : b.type === "p"
          ? "paragraph"
          : b.type === "note"
            ? "callout"
            : b.type,
    text: b.type === "list" ? b.items.join("\n") : b.text,
  })),
  reviewRequired: false,
  reviewNotes: "Existing educational article.",
  author: "Swiss Behavioral Health",
  reviewer: "",
  sources: "",
  category: r.tag,
  publishedAt: r.publishedAt,
}));
export const contentSeeds = [...pageSeeds, ...postSeeds];
