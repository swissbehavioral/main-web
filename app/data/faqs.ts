/**
 * FAQ (§Exhibit A #13). Grouped, plain-English answers drawn from the site's
 * own admissions, treatment and insurance content. General information only —
 * never medical advice.
 */

export interface Faq {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: Faq[];
}

export const faqs: FaqGroup[] = [
  {
    id: "admissions",
    title: "Admissions",
    items: [
      {
        q: "How do I get started?",
        a: "Call our admissions line or send a general inquiry. The first step is a confidential conversation about your current needs and whether Swiss Behavioral Health may be an appropriate fit.",
      },
      {
        q: "What happens after I reach out?",
        a: "We discuss your needs, review insurance or payment options where applicable, identify the appropriate level of care, and then coordinate the start of services when SBH is appropriate.",
      },
      {
        q: "Is my first conversation confidential?",
        a: "Yes. Admissions conversations are confidential, and we ask that you avoid sending medical records, diagnoses or insurance IDs through this website.",
      },
      {
        q: "Can I be admitted if I am in crisis right now?",
        a: "No. This website is not for emergencies. If you or someone else is in immediate danger, contact 911 or your local emergency service, or go to the nearest emergency department.",
      },
    ],
  },
  {
    id: "treatment",
    title: "Treatment & Programs",
    items: [
      {
        q: "What levels of care do you offer?",
        a: "Swiss Behavioral Health supports treatment across Partial Hospitalization (PHP), Intensive Outpatient (IOP) and Outpatient (OP) levels of care, as clinically appropriate.",
      },
      {
        q: "How many therapy sessions will I have?",
        a: "Each client engages in two individual therapy sessions every week with a primary clinician, alongside daily group therapy where the level of care includes it.",
      },
      {
        q: "How large is the program?",
        a: "Intentionally small. Our supportive lodging is capped at 14 beds by design, which preserves therapeutic depth and access to clinical leadership.",
      },
      {
        q: "Do you involve families?",
        a: "Where clinically appropriate, yes. Family participation may include therapy, education, communication and guidance intended to support healthy boundaries.",
      },
      {
        q: "What therapies might be used?",
        a: "Treatment may draw from individual, group and family therapy, CBT, DBT, trauma-informed care, relapse prevention and psychoeducation, and wellness practices — when clinically appropriate and delivered by qualified clinicians.",
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance & Payment",
    items: [
      {
        q: "Do you accept insurance?",
        a: "Coverage varies. Speak directly with Admissions for the most current information about accepted insurance and payment options.",
      },
      {
        q: "How do I verify my benefits?",
        a: "Use the insurance verification request form on our Insurance & Payment page, or call Admissions. We will review options with you before treatment begins.",
      },
      {
        q: "What information should I not send online?",
        a: "Please do not include medical records, diagnoses, insurance ID numbers or other sensitive health information in any website form.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Confidentiality",
    items: [
      {
        q: "What information does this website collect?",
        a: "Only the information you choose to submit through an inquiry, insurance or chat form, plus basic technical data used to operate the site securely.",
      },
      {
        q: "Does the website collect medical information?",
        a: "No. Our website forms are designed for general inquiries only and explicitly ask you not to submit health information. See our Privacy Policy and Notice of Privacy Practices for details.",
      },
      {
        q: "How is treatment information handled?",
        a: "Clinical records are handled separately from this website under applicable privacy law. The website itself is not a clinical record system.",
      },
    ],
  },
];

/** Flat list — used for FAQPage structured data. */
export const allFaqs: Faq[] = faqs.flatMap((group) => group.items);