// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { useFetcher } from "react-router";
import { contact, site } from "../data/site";
import { cn } from "../lib/cn";
import type { FieldErrors } from "../lib/validation";
import { IconCheckCircle, IconShieldCheck } from "./icons";
export type LeadFormVariant = "inquiry" | "insurance";
interface ActionResult {
    ok: boolean;
    errors?: FieldErrors;
    id?: string;
}
const inputClasses = "w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-sm text-navy-950 placeholder:text-navy-900/40 transition-colors focus:border-navy-800 focus:outline-2 focus:outline-navy-800/15";
const labelClasses = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-900/70";
const errorClasses = "mt-1.5 text-xs font-medium text-navy-700";
const reasons = [
    "Admissions",
    "Treatment & Programs",
    "Insurance / Payment",
    "General Question",
] as const;
const bestTimes = ["Morning", "Afternoon", "Evening", "Any time"] as const;
/**
 * Shared lead-capture form. Posts to `/api/lead` via a fetcher so it works from
 * any page without a full navigation. One component serves both the general
 * inquiry (§Exhibit A #1/#12) and the insurance verification request (#11).
 */
export function LeadForm({ variant = "inquiry", source, className, }: {
    variant?: LeadFormVariant;
    source: string;
    className?: string;
}) {
    const translate = useTranslate();
    const fetcher = useFetcher<ActionResult>();
    const result = fetcher.data;
    const errors: FieldErrors = result?.ok === false ? (result.errors ?? {}) : {};
    const submitting = fetcher.state !== "idle";
    if (result?.ok) {
        return (<div className={cn("flex h-full flex-col items-center justify-center rounded-xl border border-navy-900/10 bg-white/70 p-8 text-center sm:p-10", className)}>
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy-800 text-cream">
          <IconCheckCircle className="h-7 w-7"/>
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-navy-950">
          <T>{variant === "insurance"
                ? "Verification request received."
                : "Inquiry sent."}</T>
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy-900/70"><T>{"Thank you for reaching out. Our admissions team will follow up using the contact details you provided. This confirms receipt of your request; insurance coverage is confirmed separately after review."}</T></p>
        <T>{result.id && (<p className="mt-4 text-xs text-navy-900/60"><T>{"Reference: "}</T><T>{result.id}</T>
          </p>)}</T>
      </div>);
    }
    return (<fetcher.Form method="post" action="/api/lead" className={cn("rounded-xl border border-navy-900/10 bg-white/70 p-6 shadow-sm shadow-navy-950/5 sm:p-8", className)} aria-label={translate(variant === "insurance"
        ? "Insurance verification request"
        : "General inquiry")}>
      <input type="hidden" name="kind" value={variant}/>
      <input type="hidden" name="source" value={source}/>
      {/* Honeypot — bots fill this, humans never see it */}
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"/>

      <T>{errors.form ? (<p role="alert" className="mb-5 rounded-lg border border-navy-300 bg-navy-50 p-4 text-sm font-medium leading-relaxed text-navy-800">
          <T>{errors.form}</T>
        </p>) : null}</T>

      <p className="mb-6 flex items-start gap-2 text-xs leading-relaxed text-navy-900/55">
        <IconShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600"/>
        <T>{contact.form.note}</T>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${variant}-name`} className={labelClasses}><T>{"Name"}</T>{" "}
            <span aria-hidden className="text-teal-600"><T>{"*"}</T></span>
          </label>
          <input id={`${variant}-name`} name="name" maxLength={120} type="text" required autoComplete="name" className={inputClasses} aria-invalid={errors.name ? true : undefined}/>
          <T>{errors.name ? <p className={errorClasses}><T>{errors.name}</T></p> : null}</T>
        </div>

        <div>
          <label htmlFor={`${variant}-phone`} className={labelClasses}><T>{"Phone"}</T>{" "}
            <T>{variant === "insurance" ? (<span aria-hidden className="text-teal-600"><T>{"*"}</T></span>) : null}</T>
          </label>
          <input id={`${variant}-phone`} name="phone" type="tel" required={variant === "insurance"} autoComplete="tel" className={inputClasses} aria-invalid={errors.phone ? true : undefined}/>
          <T>{errors.phone ? <p className={errorClasses}><T>{errors.phone}</T></p> : null}</T>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${variant}-email`} className={labelClasses}><T>{"Email"}</T>{" "}
            <T>{variant === "insurance" ? null : (<span aria-hidden className="text-teal-600"><T>{"*"}</T></span>)}</T>
          </label>
          <input id={`${variant}-email`} name="email" type="email" required={variant !== "insurance"} autoComplete="email" className={inputClasses} aria-invalid={errors.email ? true : undefined}/>
          <T>{errors.email ? <p className={errorClasses}><T>{errors.email}</T></p> : null}</T>
        </div>

        <T>{variant === "insurance" ? (<>
            <div>
              <label htmlFor="insurance-insurer" className={labelClasses}><T>{"Insurance provider *"}</T></label>
              <input id="insurance-insurer" name="insurer" required maxLength={120} aria-invalid={errors.insurer ? true : undefined} type="text" placeholder={translate("e.g. Aetna, Cigna, Blue Cross")} className={inputClasses}/>
              <T>{errors.insurer && (<p className={errorClasses}><T>{errors.insurer}</T></p>)}</T>
            </div>
            <p className="sm:col-span-2 text-xs leading-relaxed text-navy-900/70"><T>{"Please do not send member IDs or medical records here. Our team will explain how to provide any additional information needed for review."}</T></p>
          </>) : (<>
            <fieldset className="sm:col-span-2">
              <legend className={labelClasses}><T>{"Preferred contact method"}</T></legend>
              <div className="flex gap-6">
                <T>{(["Phone", "Email"] as const).map((method) => (<label key={method} className="inline-flex cursor-pointer items-center gap-2 text-sm text-navy-900">
                    <input type="radio" name="preferredContact" value={method.toLowerCase()} defaultChecked={method === "Email"} className="h-4 w-4 accent-navy-800"/>
                    <T>{method}</T>
                  </label>))}</T>
              </div>
            </fieldset>

            <div>
              <label htmlFor="inquiry-reason" className={labelClasses}><T>{"Reason for contacting SBH"}</T>{" "}
                <span aria-hidden className="text-teal-600"><T>{"*"}</T></span>
              </label>
              <select id="inquiry-reason" name="reason" required defaultValue="" className={inputClasses}>
                <option value="" disabled><T>{"Select a reason\u2026"}</T></option>
                <T>{reasons.map((reason) => (<option key={reason} value={reason}>
                    <T>{reason}</T>
                  </option>))}</T>
              </select>
            </div>

            <div>
              <label htmlFor="inquiry-best-time" className={labelClasses}><T>{"Best time to contact"}</T></label>
              <select id="inquiry-best-time" name="bestTime" defaultValue="Morning" className={inputClasses}>
                <T>{bestTimes.map((time) => (<option key={time} value={time}>
                    <T>{time}</T>
                  </option>))}</T>
              </select>
            </div>
          </>)}</T>

        <div className="sm:col-span-2">
          <label htmlFor={`${variant}-message`} className={labelClasses}>
            <T>{variant === "insurance"
            ? "Anything we should know?"
            : "Short message"}</T>
          </label>
          <textarea id={`${variant}-message`} name="message" maxLength={2000} rows={4} className={`${inputClasses} resize-y`}/>
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-navy-800" aria-invalid={errors.consent ? true : undefined}/>
        <span className="text-xs leading-relaxed text-navy-900/70">
          <T>{contact.form.consent}</T>
        </span>
      </label>
      <T>{errors.consent ? <p className={errorClasses}><T>{errors.consent}</T></p> : null}</T>

      <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-7 py-3.5 text-base font-semibold text-white shadow-sm shadow-teal-900/20 transition-colors hover:bg-teal-800 disabled:cursor-wait disabled:opacity-70">
        <T>{submitting
            ? "Sending…"
            : variant === "insurance"
                ? "Request verification"
                : contact.form.submitLabel}</T>
      </button>
    </fetcher.Form>);
}
