import { readFormData } from "../lib/security.server";
import { sameOrigin, rateLimit } from "../lib/security.server";
import { data } from "react-router";

import { createLead } from "../lib/leads.server";
import { isLeadKind } from "../lib/leads.types";
import { readBool, readString, validateLead } from "../lib/validation";
import { site } from "../data/site";
import type { Route } from "./+types/api.lead";

/**
 * Lead capture endpoint (§3.1). Resource route — no UI. All website forms POST here.
 *
 * Guarantees:
 * - Server-side validation (never trust the client).
 * - Honeypot anti-spam.
 * - Treat all incoming submissions as sensitive personal data.
 */
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return data({ ok: false, errors: {} }, { status: 405 });
  }

  sameOrigin(request);
  const form = await readFormData(request);

  // Silent success for bots that fill the hidden field.
  if (readString(form, "_hp")) {
    return data({ ok: true });
  }

  const kindRaw = readString(form, "kind", 20);
  if (!isLeadKind(kindRaw) || kindRaw === "chat") return data({ok:false,errors:{form:"Choose a valid inquiry type."}},{status:400});
  const kind = kindRaw;

  const name = readString(form, "name", 120);
  const email = readString(form, "email", 200);
  const phone = readString(form, "phone", 40);
  const message = readString(form, "message", 2000);
  const consent = readBool(form, "consent");

  const insurer = readString(form, "insurer", 120);
  const preferredContact = readString(form, "preferredContact", 12);
  const errors = validateLead({ name, email, phone, kind, consent, message, insurer, preferredContact });
  if (Object.keys(errors).length > 0) {
    return data({ ok: false, errors }, { status: 400 });
  }

  rateLimit(`lead:${email.toLowerCase() || phone}`, 5, 600000);
  const preferredRaw = preferredContact;

  try {
    const lead = await createLead({
      kind,
      name,
      email,
      phone,
      preferredContact: preferredRaw === "phone" || (kind === "insurance" && !email) ? "phone" : "email",
      bestTime: readString(form, "bestTime", 40),
      reason: readString(form, "reason", 60),
      message,
      insurer,
      consent,
      // `source` is supplied by the form (the action URL is always /api/lead).
      source: readString(form, "source", 200) || "/",
      referrer: request.headers.get("referer")?.slice(0,512) ?? undefined,
      userAgent: request.headers.get("user-agent")?.slice(0, 200) ?? undefined,
    });

    return data({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    // Never fail silently — a lead that appears to send but doesn't is worse
    // than an error message. Tell the visitor to call instead.
    console.error("[api/lead] failed to store lead", {code:(error as {code?:number}).code});
    return data(
      {
        ok: false,
        errors: {
          form: `We couldn't send your message right now. Please call ${site.phone.display} so we don't miss you.`,
        },
      },
      { status: 502 },
    );
  }
}

/** GET is not supported. */
export async function loader() {
  return data({ ok: false, message: "Use POST to submit a lead." }, { status: 405 });
}