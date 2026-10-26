/** Client-supplied leadership restored from the older swissbehavioural project. */
import { leadershipMembers } from "./recovered-content";

export interface TeamMember {
  id: string;
  photo: string;
  name: string;
  role: string;
  credentials: string;
  licenseNumber?: string;
  bio: string;
  /** Client-supplied roster approved for display; not an independent credential check. */
  verified: boolean;
}

export const team = {
  eyebrow: "Our Team",
  heading: "Clinically Led. Personally Delivered.",
  intro:
    "Swiss Behavioral Health is guided by seasoned medical and addiction specialists working within a multidisciplinary team. Our low client-to-clinician ratio allows for real therapeutic depth.",
  members: leadershipMembers as TeamMember[],
  /** Structural description of the care team — not individual claims. */
  disciplines: [
    {
      title: "Medical & psychiatric leadership",
      body: "Physician oversight of clinical care, medication management and medical stability throughout treatment.",
    },
    {
      title: "Primary clinicians",
      body: "Each client works with a primary clinician in two individual therapy sessions every week.",
    },
    {
      title: "Group & family therapists",
      body: "Daily group therapy plus family therapy and psychoeducation where clinically appropriate.",
    },
    {
      title: "Nursing & support staff",
      body: "Day-to-day clinical support within our 14-bed supportive lodging setting.",
    },
    {
      title: "Wellness practitioners",
      body: "Movement, mindfulness, restorative recreation and complementary wellness practices.",
    },
  ],
  pendingNotice:
    "Speak with Admissions about the clinicians involved in your care, their professional roles, and their credentials. We can explain how the care team is matched to individual treatment needs.",
} as const;