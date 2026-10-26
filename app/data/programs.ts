/**
 * Levels of care — overview data (§Exhibit A #5) and per-program page content
 * (#6–9). Program pages must reflect the levels the Client is actually
 * licensed for (Exhibit A). Current licensed set: PHP, IOP, OP.
 *
 * Clinical definitions below are standard, publicly documented descriptions of
 * each level of care. They are educational and deliberately avoid inventing
 * Client-specific schedules or promises; exact schedules are confirmed with the
 * clinical team during admissions.
 */

export interface ProgramDetail {
  code: "PHP" | "IOP" | "OP";
  slug: string;
  name: string;
  tagline: string;
  description: string;
  definition: string;
  typicalSchedule: { label: string; value: string }[];
  scheduleNote: string;
  whoFor: string[];
  includes: string[];
  family: string;
  faqs: { q: string; a: string }[];
  /** Whether the Client has confirmed licensure for this level of care. */
  licensed: boolean;
}

export const programs = {
  eyebrow: "Treatment & Programs",
  heading: "A Continuum of Care Built Around the Individual",
  intro:
    "The appropriate level of care can change throughout recovery. SBH is structured to support treatment across PHP, IOP, and outpatient levels of care.",
  note: "Program pages reflect the levels of care Swiss Behavioral Health is licensed to provide. Additional levels will be published only once licensure is confirmed.",
} as const;

export const programLevels: ProgramDetail[] = [
  {
    code: "PHP",
    slug: "php",
    name: "Partial Hospitalization Program",
    tagline: "Intensive, structured support without inpatient admission.",
    description:
      "Structured, intensive behavioral health treatment for individuals who require significant clinical support outside a hospital setting.",
    definition:
      "A partial hospitalization program (PHP) is the most intensive form of outpatient care. It provides a full day of structured clinical programming while allowing the individual to return to supportive lodging or home in the evening. PHP is often used as a step-down from inpatient care, or as an alternative when a hospital stay is not clinically necessary.",
    typicalSchedule: [
      { label: "Frequency", value: "Typically 5 days per week" },
      { label: "Programming", value: "Approximately 5–6 hours per day" },
      { label: "Setting", value: "Group-based with individual sessions" },
    ],
    scheduleNote:
      "Typical structure for this level of care. Your specific schedule is confirmed by our clinical team during admissions.",
    whoFor: [
      "Individuals needing significant clinical support outside a hospital setting",
      "Those stepping down from a higher level of care",
      "People needing daily structure while remaining in supportive lodging",
    ],
    includes: [
      "Two individual therapy sessions per week with a primary clinician",
      "Daily group therapy",
      "Family therapy and psychoeducation where clinically appropriate",
      "Medication management and clinical monitoring as indicated",
      "Wellness programming, including movement, mindfulness and recreation",
    ],
    family:
      "Where clinically appropriate, family members are engaged through structured family therapy sessions, psychoeducation and guided communication strategies.",
    faqs: [
      {
        q: "Is PHP the same as inpatient or residential treatment?",
        a: "No. PHP provides intensive clinical programming without requiring an overnight hospital stay. You return to supportive lodging or home in the evening.",
      },
      {
        q: "How long does PHP last?",
        a: "Length of stay varies by individual and clinical need. Your recommended duration is discussed at admission and reviewed as progress is made.",
      },
      {
        q: "Does PHP include lodging?",
        a: "Swiss Behavioral Health offers 14-bed supportive lodging with en-suite bathrooms beside Philippe Park in Safety Harbor, Florida, subject to availability and clinical appropriateness.",
      },
    ],
    licensed: true,
  },
  {
    code: "IOP",
    slug: "iop",
    name: "Intensive Outpatient Program",
    tagline: "Structured therapy with room for real life.",
    description:
      "Structured therapy and recovery planning with greater independence and flexibility as clinically appropriate.",
    definition:
      "An intensive outpatient program (IOP) delivers structured group therapy, individual therapy and recovery planning on a part-time schedule. It offers meaningful clinical intensity while allowing participants to maintain work, study, family responsibilities and community life.",
    typicalSchedule: [
      { label: "Frequency", value: "Typically 3 days per week" },
      { label: "Programming", value: "Approximately 3 hours per session" },
      { label: "Setting", value: "Group-based with individual sessions" },
    ],
    scheduleNote:
      "Typical structure for this level of care. Your specific schedule is confirmed by our clinical team during admissions.",
    whoFor: [
      "Individuals who need structured support while maintaining daily responsibilities",
      "Those stepping down from PHP",
      "People who are medically stable and do not require daily oversight",
    ],
    includes: [
      "Two individual therapy sessions per week with a primary clinician",
      "Group therapy focused on coping skills and recovery planning",
      "Relapse prevention and psychoeducation",
      "Family support where clinically appropriate",
      "Wellness practices integrated into the treatment plan",
    ],
    family:
      "Family participation may include therapy, education, communication and guidance intended to help loved ones understand recovery and support healthy boundaries.",
    faqs: [
      {
        q: "Can I work or study while in IOP?",
        a: "Yes. IOP is designed as a part-time schedule so participants can maintain responsibilities alongside treatment, where clinically appropriate.",
      },
      {
        q: "What is the difference between PHP and IOP?",
        a: "Both are structured outpatient levels of care. PHP provides more hours per week and more daily structure; IOP provides fewer hours with greater independence.",
      },
      {
        q: "Can I move between levels of care?",
        a: "Yes. The appropriate level of care can change throughout recovery, and treatment is adjusted as clinically indicated.",
      },
    ],
    licensed: true,
  },
  {
    code: "OP",
    slug: "op",
    name: "Outpatient Program",
    tagline: "Ongoing therapy and support as recovery continues.",
    description:
      "Ongoing therapy and clinical support for people who require a lower level of treatment intensity.",
    definition:
      "An outpatient program (OP) provides ongoing therapy and clinical support at a lower intensity. It is often used for continued care after a more intensive program, or for individuals whose needs can be met with a lighter treatment schedule.",
    typicalSchedule: [
      { label: "Frequency", value: "Typically 1–2 sessions per week" },
      { label: "Programming", value: "Approximately 1 hour per session" },
      {
        label: "Setting",
        value: "Individual therapy, with groups as appropriate",
      },
    ],
    scheduleNote:
      "Typical structure for this level of care. Your specific schedule is confirmed by our clinical team during admissions.",
    whoFor: [
      "Individuals transitioning down from IOP or PHP",
      "People needing continued clinical support with minimal time commitment",
      "Those who want regular access to a clinician",
    ],
    includes: [
      "Individual therapy with a primary clinician",
      "Ongoing recovery planning and review",
      "Relapse prevention and psychoeducation",
      "Family support where clinically appropriate",
      "Coordination and referral with community providers as needed",
    ],
    family:
      "Family involvement is tailored to each individual and may include education and guidance where clinically appropriate.",
    faqs: [
      {
        q: "Is outpatient right for me?",
        a: "Outpatient suits individuals who require a lower level of treatment intensity. The admissions team can help identify the appropriate level of care.",
      },
      {
        q: "Can I start at outpatient level?",
        a: "Yes. Not everyone needs a higher level of care. The recommended level is determined during the initial clinical conversation.",
      },
      {
        q: "Do you offer outpatient after a higher level of care?",
        a: "Yes. Outpatient is commonly used as continued care once a more intensive program has been completed.",
      },
    ],
    licensed: true,
  },
];

export function getProgram(slug: string): ProgramDetail | undefined {
  return programLevels.find((program) => program.slug === slug);
}

export function isProgramSlug(slug: string): boolean {
  return programLevels.some((program) => program.slug === slug);
}