/**
 * Swiss Behavioral Health — content hub.
 *
 * All copy in this file is sourced from the public swissbehavioralhealth.com
 * homepage (scraped 2026-10-16). Styling/structure are an original redesign;
 * the words remain true to the source material.
 */

export const site = {
  name: "Swiss Behavioral Health",
  shortName: "SBH",
  descriptor: "Behavioral Health & Addiction Recovery in Oldsmar, FL",
  region: "Tampa Bay",
  tagline: "Small by Design. Personal by Nature.",
  phone: {
    display: "(656) 232-3504",
    href: "tel:+16562323504",
  },
  email: {
    display: "info@swissbehavioralhealth.com",
    href: "mailto:info@swissbehavioralhealth.com",
  },
  address: {
    line1: "209 State St E",
    city: "Oldsmar",
    state: "FL",
    zip: "34677",
    full: "209 State St E, Oldsmar, FL 34677",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=209+State+St+E%2C+Oldsmar%2C+FL+34677",
  mapEmbedUrl:
    "https://www.google.com/maps?q=209%20State%20St%20E%2C%20Oldsmar%2C%20FL%2034677&output=embed",
  hours: "A team member responds during business hours; you can call or message anytime.",
  emergencyNote:
    "For emergencies, use emergency services rather than this website.",
} as const;

export const notice = {
  label: "Notice",
  text: "Coming Soon — Pending DCF Licensure",
} as const;

export interface NavChild {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  to: string;
  children?: NavChild[];
}

/**
 * Primary header navigation. Items with `children` render as dropdown menus
 * (all 16 Exhibit A pages are reachable within two clicks).
 */
export const navItems: NavItem[] = [
  {
    label: "About",
    to: "/about",
    children: [
      { label: "About Us", to: "/about" },
      { label: "Our Team", to: "/team" },
      { label: "Licensing & Accreditation", to: "/licensing" },
    ],
  },
  {
    label: "Treatment",
    to: "/treatment",
    children: [
      { label: "Programs Overview", to: "/treatment" },
      { label: "Partial Hospitalization (PHP)", to: "/treatment/php" },
      { label: "Intensive Outpatient (IOP)", to: "/treatment/iop" },
      { label: "Outpatient (OP)", to: "/treatment/op" },
    ],
  },
  { label: "Admissions", to: "/admissions" },
  { label: "Insurance", to: "/insurance" },
  { label: "Resources", to: "/resources" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

/** Footer sitemap — every public page, for navigation and internal linking. */
export const footerNav: { title: string; links: NavChild[] }[] = [
  {
    title: "Facility",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Team", to: "/team" },
      { label: "Licensing & Accreditation", to: "/licensing" },
      { label: "Contact & Location", to: "/contact" },
    ],
  },
  {
    title: "Treatment",
    links: [
      { label: "Programs Overview", to: "/treatment" },
      { label: "Partial Hospitalization (PHP)", to: "/treatment/php" },
      { label: "Intensive Outpatient (IOP)", to: "/treatment/iop" },
      { label: "Outpatient (OP)", to: "/treatment/op" },
      { label: "Admissions Process", to: "/admissions" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Insurance & Payment", to: "/insurance" },
      { label: "FAQ", to: "/faq" },
      { label: "Resources & Blog", to: "/resources" },
      { label: "Privacy & Notice of Privacy Practices", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
    ],
  },
];

export const hero = {
  eyebrow: "Swiss Behavioral Health · Tampa Bay",
  headlineTop: "Small by Design.",
  headlineAccent: "Personal by Nature.",
  body:
    "An intentionally small behavioral health program offering highly individualized treatment, exceptional access to our clinical team, and 14-bed supportive lodging beside Philippe Park in Safety Harbor, Florida. A more personal approach to substance use recovery and co-occurring mental health needs.",
  primaryCta: { label: "Speak With Admissions", to: "/speak-with-admissions" },
  secondaryCta: { label: "Verify Insurance", to: "/verify-insurance" },
  facts: [
    { label: "Guest beds, by design", value: "14" },
    { label: "Continuum of care", value: "PHP · IOP · OP" },
    { label: "Beside Philippe Park", value: "Safety Harbor, FL" },
  ],
} as const;

export const statistics = {
  eyebrow: "Clinically Led. Personally Delivered.",
  items: [
    {
      value: "Twice-Weekly",
      label: "Individual therapy alongside daily group therapy",
    },
    {
      value: "Low",
      label: "Patient-to-therapist ratio",
    },
    {
      value: "PHP · IOP · OP",
      label: "A continuum of individualized care",
    },
    {
      value: "En-Suite",
      label: "A private bathroom in every lodging unit",
    },
  ],
} as const;

export const about = {
  eyebrow: "About Swiss Behavioral Health",
  heading: "14. By Design.",
  intro:
    "At Swiss Behavioral Health, our small scale is intentional. This model fosters deeper therapeutic relationships, ensures seamless continuity of care, and allows treatment to dynamically adapt to each individual's unique needs.",
  quote:
    "Our personal client centered approach is intentional that is why our lodging facility is limited to 14 person capacity.",
  body: "We have chosen depth over scale, prioritizing exceptional, personalized treatment. Limiting our lodging capacity helps preserve an intimate scale and supports greater access to therapists and clinical leadership without creating a high-volume institutional experience.",
  benefits: [
    "More individual clinical attention",
    "Greater continuity of care",
    "Closer access to clinical leadership",
    "Treatment built around the individual",
  ],
} as const;

export const approach = {
  eyebrow: "Our Approach to Recovery",
  heading: "Clinical Excellence · Wellness · Family",
  intro:
    "The Swiss Behavioral Health experience centers on three fundamental elements: expert clinical care, comprehensive whole-person healing, and supportive family integration tailored to each individual's needs.",
  pillars: [
    {
      number: "01",
      title: "Clinical Excellence",
      body: "Our commitment to clinical excellence ensures that every individual receives sophisticated, evidence-based care tailored precisely to their clinical needs. Guided by seasoned medical and addiction specialists, our multidisciplinary team delivers a low client-to-clinician ratio that allows for true therapeutic depth. Each client engages in two individual therapy sessions every week with a primary clinician and, alongside group therapy, fostering a strong therapeutic alliance — facilitating deep emotional work and allowing treatment strategies to dynamically evolve as progress is made.",
    },
    {
      number: "02",
      title: "Wellness",
      body: "Recovery extends far beyond the traditional therapy room. We recognize that true, lasting healing requires a holistic framework that integrates physical vitality, mental clarity, and emotional resilience. As clinically appropriate, each client's treatment plan incorporates purposeful movement, structured mindfulness routines, restorative recreation, and complementary wellness practices within our wellness rooms — from somatic bodywork and sound and breath work, to outdoor experiential therapies, trauma informed yoga, and nutritional support.",
    },
    {
      number: "03",
      title: "Family Integration & Support",
      body: "Healing is rarely a solitary journey. Where clinically appropriate, we actively involve family members as essential partners in the recovery process. Through structured family therapy sessions, dedicated psychoeducation, and guided communication strategies, we help loved ones unpack the dynamics of addiction and mental health, heal past boundary ruptures, and develop a shared understanding of sustained recovery — paving the way for a healthier, more supportive home environment.",
    },
  ],
} as const;

export const programs = {
  eyebrow: "Treatment & Programs",
  heading: "A Continuum of Care Built Around the Individual",
  intro:
    "The appropriate level of care can change throughout recovery. SBH is structured to support treatment across PHP, IOP, and outpatient levels of care.",
  levels: [
    {
      code: "PHP",
      name: "Partial Hospitalization Program",
      description:
        "Structured, intensive behavioral health treatment for individuals who require significant clinical support outside a hospital setting.",
    },
    {
      code: "IOP",
      name: "Intensive Outpatient Program",
      description:
        "Structured therapy and recovery planning with greater independence and flexibility as clinically appropriate.",
    },
    {
      code: "OP",
      name: "Outpatient Program",
      description:
        "Ongoing therapy and clinical support for people who require a lower level of treatment intensity.",
    },
  ],
} as const;

export const therapies = {
  eyebrow: "Treatment & Therapies",
  heading: "Evidence-Based. Individualized. Human.",
  intro:
    "Treatment may draw from the following approaches when clinically appropriate and when delivered by qualified SBH clinicians.",
  note: "Your care team recommends therapies based on your assessment, goals and individual treatment needs.",
  modalities: [
    { title: "Individual Therapy" },
    { title: "Group Therapy" },
    { title: "Family Therapy & Support" },
    { title: "Cognitive Behavioral Therapy (CBT)" },
    { title: "Dialectical Behavior Therapy (DBT)" },
    { title: "Wellness" },
    { title: "Trauma-Informed Care" },
    { title: "Relapse Prevention & Psychoeducation" },
  ],
} as const;

export const families = {
  eyebrow: "For Families",
  heading: "Recovery Rarely Happens in Isolation.",
  body: "Where clinically appropriate, family participation may include therapy, education, communication, and guidance intended to help loved ones understand recovery and support healthy boundaries.",
  cta: { label: "Speak With Admissions", to: "/speak-with-admissions" },
} as const;

export const insurance = {
  eyebrow: "Insurance & Payment",
  heading: "Understand Your Options Before Treatment Begins",
  body: "Need help with insurance or payment questions? Speak directly with Admissions for the most current information.",
} as const;

export const admissions = {
  eyebrow: "Admissions",
  heading: "Taking the First Step",
  intro:
    "Beginning treatment should feel clear, confidential, and personal from the first conversation.",
  steps: [
    {
      number: "01",
      title: "Contact SBH",
      body: "Request a confidential conversation with the Admissions team.",
    },
    {
      number: "02",
      title: "Initial Conversation",
      body: "Discuss current needs and whether SBH may be an appropriate fit.",
    },
    {
      number: "03",
      title: "Insurance or Payment",
      body: "Review verification or payment options when applicable.",
    },
    {
      number: "04",
      title: "Determine Next Steps",
      body: "Identify the appropriate level of care and recommended next step.",
    },
    {
      number: "05",
      title: "Coordinate Start",
      body: "Coordinate the beginning of services when SBH is appropriate.",
    },
  ],
  callout: {
    title: "Ready to talk?",
    body: "Call or send a general inquiry.",
    primaryCta: { label: "Call Admissions", href: "tel:+16562323504" },
    secondaryCta: { label: "Send a General Inquiry", to: "/contact" },
  },
} as const;

export const contact = {
  eyebrow: "Contact",
  heading: "Speak With Swiss Behavioral Health",
  body: "For general questions, admissions information, or help understanding next steps, contact SBH directly.",
  details: {
    address: {
      label: "Visit",
      value: "209 State St E, Oldsmar, FL 34677",
      mapLabel: "Open in Google Maps",
    },
    phone: {
      label: "Call",
      value: "(656) 232-3504",
    },
    email: {
      label: "Email",
      value: "info@swissbehavioralhealth.com",
    },
  },
  form: {
    note: "Please do not include medical records, diagnoses, insurance IDs, or other sensitive health information in this form.",
    consent:
      "I consent to Swiss Behavioral Health contacting me about this inquiry using the details I provide. I understand this form is not for emergencies and should not include medical records or sensitive identifiers.",
    submitLabel: "Send Inquiry",
  },
} as const;

export const footer = {
  headline: "A more personal path forward starts with a conversation.",
  body: "Speak confidentially with our admissions team about treatment, supportive lodging, insurance, and the next appropriate step.",
  primaryCta: { label: "Call Admissions", href: "tel:+16562323504" },
  secondaryCta: { label: "Verify Insurance", to: "/verify-insurance" },
  tag: "Clinically Led. Personally Delivered.",
  copyright: `© ${new Date().getFullYear()} Swiss Behavioral Health. All rights reserved.`,
} as const;

export const pageMeta = {
  home: {
    title: "Swiss Behavioral Health · Small by Design. Personal by Nature.",
    description:
      "An intentionally small behavioral health program in Oldsmar, FL offering highly individualized treatment, exceptional access to our clinical team, and 14-bed supportive lodging beside Philippe Park in Safety Harbor, Florida.",
  },
  about: {
    title:
      "About Us · Small by Design. Personal by Nature. | Swiss Behavioral Health",
    description:
      "Learn why Swiss Behavioral Health is intentionally small — 14 beds by design, fostering deeper therapeutic relationships, seamless continuity of care, and treatment built around each individual.",
  },
  treatment: {
    title:
      "Treatment & Programs · PHP, IOP & OP | Swiss Behavioral Health",
    description:
      "Swiss Behavioral Health offers a continuum of care across Partial Hospitalization (PHP), Intensive Outpatient (IOP), and Outpatient (OP) levels, with evidence-based, individualized therapies.",
  },
  insurance: {
    title: "Insurance & Payment | Swiss Behavioral Health",
    description:
      "Understand your insurance and payment options before treatment begins. Speak directly with Swiss Behavioral Health Admissions for the most current information.",
  },
  admissions: {
    title: "Admissions · Taking the First Step | Swiss Behavioral Health",
    description:
      "Beginning treatment should feel clear, confidential, and personal from the first conversation. Learn how to start the admissions process with Swiss Behavioral Health.",
  },
  contact: {
    title: "Contact · Speak With Swiss Behavioral Health",
    description:
      "Contact Swiss Behavioral Health for general questions, admissions information, or help understanding next steps in Oldsmar, Florida.",
  },
  team: {
    title: "Our Team · Clinical & Medical Staff | Swiss Behavioral Health",
    description:
      "Meet the multidisciplinary clinical team at Swiss Behavioral Health — medical leadership, primary clinicians, group and family therapists, nursing and wellness practitioners.",
  },
  licensing: {
    title: "Licensing & Accreditation | Swiss Behavioral Health",
    description:
      "Current licensing and accreditation status for Swiss Behavioral Health, including Florida DCF licensure and LegitScript certification progress.",
  },
  faq: {
    title: "Frequently Asked Questions | Swiss Behavioral Health",
    description:
      "Answers to common questions about admissions, levels of care, insurance and confidentiality at Swiss Behavioral Health in Oldsmar, Florida.",
  },
  resources: {
    title: "Resources & Blog | Swiss Behavioral Health",
    description:
      "General education on recovery, levels of care, supporting a loved one, and understanding insurance for behavioral health treatment.",
  },
  privacy: {
    title: "Privacy Policy & Notice of Privacy Practices | Swiss Behavioral Health",
    description:
      "How Swiss Behavioral Health collects, uses and protects information, plus our Notice of Privacy Practices for health information.",
  },
  terms: {
    title: "Terms of Use | Swiss Behavioral Health",
    description:
      "The terms that govern use of the Swiss Behavioral Health website, including disclaimers regarding medical advice and emergencies.",
  },
} as const;