/**
 * Resources / Blog (§Exhibit A #14).
 *
 * Deliberately educational and non-promissory: no outcome claims, no medical
 * advice, no invented clinical specifics. Every post is general information for
 * people deciding whether to reach out for help.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "note"; text: string };

export type ResourceTag = "Getting Help" | "Recovery" | "Family" | "Insurance";

export interface ResourcePost {
  slug: string;
  title: string;
  description: string;
  tag: ResourceTag;
  publishedAt: string;
  readingMinutes: number;
  body: Block[];
}

export const resourcePosts: ResourcePost[] = [
  {
    slug: "what-to-expect-when-you-call-admissions",
    title: "What to Expect When You Call an Admissions Line",
    description:
      "A plain-English walkthrough of the first conversation, so reaching out feels less uncertain.",
    tag: "Getting Help",
    publishedAt: "2026-10-07",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "The hardest part of getting help is often the first phone call. Knowing what happens on that call can make it feel far more manageable.",
      },
      { type: "h", text: "It is a conversation, not an assessment" },
      {
        type: "p",
        text: "An admissions conversation is simply a chance to talk through what is going on and what kind of support might fit. You are not committing to anything by calling, and you are not expected to have everything figured out before you dial.",
      },
      { type: "h", text: "Questions you may be asked" },
      {
        type: "list",
        items: [
          "What is prompting you to reach out now?",
          "Are you safe right now, or is this an emergency?",
          "Have you received treatment before, and if so, what helped?",
          "Do you have insurance, and would you like help understanding coverage?",
          "What would make treatment workable for your life — work, family, location?",
        ],
      },
      { type: "h", text: "What you should not send or share online" },
      {
        type: "note",
        text: "Please keep medical records, diagnoses and insurance ID numbers out of website forms and chats. Those belong in a confidential clinical conversation, not a web inquiry.",
      },
      { type: "h", text: "If it is an emergency" },
      {
        type: "p",
        text: "If you or someone else is in immediate danger, contact 911 or your local emergency service, or go to the nearest emergency department. A website or admissions line is not an emergency service.",
      },
    ],
  },
  {
    slug: "understanding-levels-of-care-php-iop-op",
    title: "Understanding Levels of Care: PHP, IOP and OP",
    description:
      "Why treatment intensity changes over time — and what these three common acronyms actually mean.",
    tag: "Recovery",
    publishedAt: "2026-10-10",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "In behavioral health, the phrase \u201clevel of care\u201d describes how much structure and clinical support a person needs at a given point in time. It is not a measure of how serious someone's situation is — it is a measure of what will actually help right now.",
      },
      { type: "h", text: "Partial Hospitalization Program (PHP)" },
      {
        type: "p",
        text: "The most intensive form of outpatient care. It provides a full day of structured clinical programming — typically five days a week — while allowing the person to return to supportive lodging or home in the evening.",
      },
      { type: "h", text: "Intensive Outpatient Program (IOP)" },
      {
        type: "p",
        text: "A part-time but still structured schedule, often around three days a week. It offers meaningful clinical intensity while leaving room for work, study and family responsibilities.",
      },
      { type: "h", text: "Outpatient Program (OP)" },
      {
        type: "p",
        text: "Ongoing therapy at a lower intensity, often one or two sessions a week. Frequently used as continued care after a more intensive program.",
      },
      { type: "h", text: "Why levels of care change" },
      {
        type: "p",
        text: "The appropriate level of care can change throughout recovery. Someone may begin at a higher intensity and step down as they stabilise, or step up if more support is needed. A good program is built to adapt.",
      },
      {
        type: "quote",
        text: "The right level of care is the one that matches what a person needs today — and is ready to change when that changes.",
      },
    ],
  },
  {
    slug: "supporting-a-loved-one-in-recovery",
    title: "Supporting a Loved One in Recovery",
    description:
      "What family members can do that actually helps — and what tends to make things harder.",
    tag: "Family",
    publishedAt: "2026-10-13",
    readingMinutes: 5,
    body: [
      {
        type: "p",
        text: "Families are not bystanders in recovery. Where it is clinically appropriate, loved ones can become essential partners — but the role is not always obvious, and good intentions can sometimes get in the way.",
      },
      { type: "h", text: "Things that tend to help" },
      {
        type: "list",
        items: [
          "Learning about addiction and mental health as conditions, not character flaws",
          "Keeping communication calm, specific and honest",
          "Supporting healthy boundaries rather than policing behaviour",
          "Taking part in family therapy or psychoeducation when it is offered",
          "Looking after your own support network and wellbeing",
        ],
      },
      { type: "h", text: "Things that tend to make it harder" },
      {
        type: "list",
        items: [
          "Rescuing someone from every consequence of their behaviour",
          "Making promises or threats that cannot be kept",
          "Treating recovery as a single conversation instead of a long process",
          "Carrying the whole burden alone",
        ],
      },
      { type: "h", text: "Boundaries are not rejection" },
      {
        type: "p",
        text: "A boundary is not a punishment. It is a clear statement of what you can and cannot do, which often makes a relationship more honest and more sustainable for everyone involved.",
      },
      {
        type: "quote",
        text: "Healing is rarely a solitary journey.",
      },
      {
        type: "note",
        text: "This article is general information, not medical advice, and does not replace care from a qualified professional.",
      },
    ],
  },
  {
    slug: "insurance-101-verifying-coverage-for-treatment",
    title: "Insurance 101: Verifying Coverage for Treatment",
    description:
      "How to check what your plan actually covers before treatment begins, and which questions to ask.",
    tag: "Insurance",
    publishedAt: "2026-10-16",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "Cost is one of the biggest sources of anxiety when someone is considering treatment. A little preparation can turn that uncertainty into a clear plan.",
      },
      { type: "h", text: "Questions worth asking your insurer" },
      {
        type: "list",
        items: [
          "Is this facility and these services covered under my plan?",
          "Do I need prior authorisation or a referral before starting?",
          "What is my deductible, and how much of it is remaining?",
          "What is my co-pay or co-insurance for outpatient behavioural health?",
          "Are there limits on the number of sessions or days covered?",
        ],
      },
      { type: "h", text: "Why we verify on your behalf" },
      {
        type: "p",
        text: "Coverage details change, and plans differ enormously. That is why Swiss Behavioral Health routes insurance and payment questions through Admissions, so you get the most current information rather than guessing from a website.",
      },
      { type: "h", text: "What not to send through a website" },
      {
        type: "note",
        text: "Please do not submit member IDs, policy documents or any medical information through website forms. Use the verification request form to start the conversation, and our team will follow up securely.",
      },
    ],
  },
];

export function getPost(slug: string): ResourcePost | undefined {
  return resourcePosts.find((post) => post.slug === slug);
}

export function listPosts(): ResourcePost[] {
  return [...resourcePosts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export const resourceTags: ResourceTag[] = [
  "Getting Help",
  "Recovery",
  "Family",
  "Insurance",
];
