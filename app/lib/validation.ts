/** Small server-side form parsing + validation helpers (no dependencies). */

export function readString(
  form: FormData,
  key: string,
  maxLength = 800,
): string {
  const value = form.get(key);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function readBool(form: FormData, key: string): boolean {
  const value = form.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/** Deliberately permissive — international numbers vary widely. */
export function isPhone(value: string): boolean {
  return /^[+()\d][\d\s().-]{6,19}$/.test(value);
}

export interface FieldErrors {
  [field: string]: string;
}

/**
 * Validates a lead submission. Returns an error map; an empty object means the
 * payload is acceptable.
 */
export function validateLead(input: {
  name: string;
  email: string;
  phone: string;
  kind: string;
  consent: boolean;
  message: string;
  insurer?: string;
  preferredContact?: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  if (input.name.length < 2) {
    errors.name = "Please enter your name.";
  }
  if (!input.email && !input.phone) {
    errors.email = "Please provide an email address or a phone number.";
  } else if (input.email && !isEmail(input.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (input.phone && !isPhone(input.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (input.kind === "insurance" && !input.phone) errors.phone = "Please provide a phone number for the verification team.";
  if (input.kind === "insurance" && !input.insurer?.trim()) errors.insurer = "Please enter your insurance provider.";
  if (input.kind === "inquiry" && !input.email) errors.email = "Please provide your email address.";
  if (input.preferredContact === "phone" && !input.phone) errors.phone = "Please provide a phone number for your preferred contact method.";
  if (!input.consent) {
    errors.consent = "Please confirm you understand this form is not for emergencies.";
  }
  return errors;
}