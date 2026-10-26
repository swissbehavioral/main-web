/** Public navigation content. Destinations refer to existing site routes. */
export type NavigationArt =
  "approach" | "treatment" | "admissions" | "resources";
export interface NavigationCard {
  title: string;
  description: string;
  to: string;
  art: NavigationArt;
  label: string;
}

export const navigationPanels = {
  explore: {
    label: "Explore",
    heading: "A more personal path forward",
    caption: "Get to know Swiss Behavioral Health",
    cards: [
      {
        title: "Our approach",
        description:
          "An intentionally small setting. Care shaped around the individual.",
        to: "/about",
        art: "approach",
        label: "Small by design",
      },
      {
        title: "Treatment programs",
        description: "Explore PHP, IOP and outpatient levels of care.",
        to: "/treatment",
        art: "treatment",
        label: "A continuum of care",
      },
      {
        title: "Getting started",
        description:
          "What to expect from your first conversation with admissions.",
        to: "/admissions",
        art: "admissions",
        label: "One step at a time",
      },
      {
        title: "Resources & answers",
        description: "Helpful reading and clear answers to common questions.",
        to: "/resources",
        art: "resources",
        label: "A little more clarity",
      },
    ],
  },
  treatment: {
    label: "Treatment",
    heading: "Find your level of care",
    caption: "Treatment & programs",
    cards: [
      {
        title: "Programs overview",
        description: "Understand the continuum and how care can adapt.",
        to: "/treatment",
        art: "treatment",
        label: "PHP · IOP · OP",
      },
      {
        title: "Partial hospitalization",
        description:
          "Intensive, structured support outside an inpatient setting.",
        to: "/treatment/php",
        art: "treatment",
        label: "PHP",
      },
      {
        title: "Intensive outpatient",
        description:
          "Structured therapy with greater independence and flexibility.",
        to: "/treatment/iop",
        art: "treatment",
        label: "IOP",
      },
      {
        title: "Outpatient care",
        description:
          "Ongoing therapy and support at a lower level of intensity.",
        to: "/treatment/op",
        art: "treatment",
        label: "OP",
      },
    ],
  },
  about: {
    label: "About us",
    heading: "Thoughtful care starts with people",
    caption: "About Swiss Behavioral Health",
    cards: [
      {
        title: "Our story & approach",
        description: "Why personal attention is at the heart of our program.",
        to: "/about",
        art: "approach",
        label: "Care with intention",
      },
      {
        title: "Our team",
        description: "Learn about our team and staff verification status.",
        to: "/team",
        art: "approach",
        label: "The people behind the care",
      },
      {
        title: "Licensing & accreditation",
        description: "Our current licensing and accreditation information.",
        to: "/licensing",
        art: "resources",
        label: "Clarity & transparency",
      },
      {
        title: "Contact & location",
        description: "Find us in Oldsmar and connect with our admissions team.",
        to: "/contact",
        art: "admissions",
        label: "Tampa Bay, Florida",
      },
    ],
  },
} satisfies Record<
  string,
  { label: string; heading: string; caption: string; cards: NavigationCard[] }
>;
export type NavigationPanelId = keyof typeof navigationPanels;
