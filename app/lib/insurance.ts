import { isPhone } from "./validation.ts";
export const insuranceFields = {
  patientName: "Patient full name",
  patientDob: "Patient date of birth",
  relationship: "Relationship to patient",
  policyholderName: "Policyholder full name",
  policyholderDob: "Policyholder date of birth",
  memberId: "Member / subscriber ID",
  groupNumber: "Group number",
  planType: "Plan type",
  insurancePhone: "Insurer phone number",
} as const;
export type InsuranceDetails = Record<keyof typeof insuranceFields, string> & {
  coverageAuthorization?: boolean;
  authorizationAt?: string;
  authorizationVersion?: string;
};
export function readInsurance(form: FormData, now = new Date()) {
  const values = {} as InsuranceDetails,
    errors: Record<string, string> = {};
  for (const key of Object.keys(
    insuranceFields,
  ) as (keyof typeof insuranceFields)[]) {
    const raw = form.get(key);
    values[key] = typeof raw === "string" ? raw.trim() : "";
    if (values[key].length > 120) errors[key] = "Use 120 characters or fewer.";
  }
  if (values.patientName.length < 2)
    errors.patientName = "Enter the patient’s full name.";
  if (
    !["self", "parent", "spouse", "family", "representative", "other"].includes(
      values.relationship,
    )
  )
    errors.relationship = "Choose your relationship to the patient.";
  for (const key of ["patientDob", "policyholderDob"] as const) {
    const value = values[key];
    if (!value && key === "policyholderDob") continue;
    const date = new Date(value + "T00:00:00Z");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value ||
      date > now ||
      date.getUTCFullYear() < 1900
    )
      errors[key] = "Enter a valid date of birth in the past.";
  }
  if (values.insurancePhone && !isPhone(values.insurancePhone))
    errors.insurancePhone = "Please enter a valid phone number.";
  if (
    values.planType &&
    !["HMO", "PPO", "EPO", "POS", "Other", "Unknown"].includes(values.planType)
  )
    errors.planType = "Choose a valid plan type.";
  if (!["on", "true", "1"].includes(String(form.get("insuranceConsent"))))
    errors.insuranceConsent =
      "Confirm permission to request an insurance coverage review.";
  return { values, errors };
}
