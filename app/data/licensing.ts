/**
 * Licensing & Accreditation (§Exhibit A #4).
 *
 * Reflects the *actual, current* status only. Swiss Behavioral Health is
 * pre-launch with licensure pending; nothing here should claim a licence or
 * accreditation that has not been granted.
 */

export type LicenseStatus = "pending" | "in-progress" | "active";

export interface LicenseItem {
  authority: string;
  scope: string;
  status: LicenseStatus;
  statusLabel: string;
  reference?: string;
  note: string;
}

export const licensing = {
  eyebrow: "Licensing & Accreditation",
  heading: "Transparency About Where We Stand",
  intro:
    "Swiss Behavioral Health is committed to publishing accurate licensing and accreditation information. Everything below reflects our current, verified status — including what is still in progress.",
  items: [
    {
      authority: "Florida Department of Children and Families (DCF)",
      scope: "Behavioral health & substance use treatment licensure",
      status: "pending",
      statusLabel: "Pending",
      note: "Licensure application in progress. Treatment services will commence only once licensure is granted.",
    },
    {
      authority: "LegitScript",
      scope: "Website certification for addiction treatment",
      status: "pending",
      statusLabel: "Not certified",
      reference: "LegitScript Addiction Treatment Certification",
      note: "Swiss Behavioral Health is not currently LegitScript certified. Certification is determined by LegitScript following its review of the organization and services.",
    },
  ] satisfies LicenseItem[],
  facility: {
    heading: "Facility",
    body: "Swiss Behavioral Health operates a 14-bed supportive lodging setting beside Philippe Park in Safety Harbor, Florida, with clinical services coordinated from our Oldsmar location.",
    address: "209 State St E, Oldsmar, FL 34677",
  },
  disclaimer:
    "Licence numbers, accreditation certificates and additional credentials will be published here as they are issued and confirmed. Please contact Admissions if you have questions about our current licensing status.",
} as const;