// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";
import { AdmissionsSteps } from "../admissions-steps";
import { IconArrowRight } from "../icons";
import { InsuranceSection } from "../insurance-section";
import { LeadForm } from "../lead-form";
import { PageHero } from "../page-hero";
import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";
import { SectionHeading } from "../ui/section";
import { insurance as base_insurance, pageMeta, site as base_site, } from "../../data/site";
/**
 * Insurance & Payment (§Exhibit A #11) — accepted-insurance guidance, costs, and
 * the insurance verification request form (§3.1).
 */
export default function Insurance() {
    const translate = useTranslate();
    const copy = usePageText();
    const insurance = usePageData(base_insurance);
    const site = usePageData(base_site);
    const nextSteps = usePageData([
        "We review the details you submit.",
        "We check coverage with your insurer where applicable.",
        "We explain costs, co-pays and payment options before treatment begins.",
        "We identify the appropriate level of care and the next step.",
    ]);
    return (<main id="main-content">
      <PageHero eyebrow={insurance.eyebrow} title={translate(insurance.heading)} intro={insurance.body}/>
      <InsuranceSection withHeading={false}/>

      {/* Verification request form */}
      <section id="verify" className="bg-cream py-20 text-navy-950 sm:py-24" aria-labelledby="verify-heading">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading eyebrow="Verify Insurance" title={translate("Request a verification")} description="Share a few details and our admissions team will review your coverage options with you. This form is for insurance and payment questions only."/>

            <ol className="mt-8 space-y-4">
              <T>{nextSteps.map((step, index) => (<li key={step} className="flex items-start gap-4">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy-800 font-display text-sm font-semibold text-cream">
                    <T>{index + 1}</T>
                  </span>
                  <span className="pt-1 text-sm leading-relaxed text-navy-900/80">
                    <T>{step}</T>
                  </span>
                </li>))}</T>
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={site.phone.href} variant="primary" size="md">
                <T>{copy("Call ")}</T>
                <T>{site.phone.display}</T>
              </ButtonLink>
              <ButtonLink to="/admissions" variant="outline-dark" size="md">
                <T>{copy("How admissions works")}</T>
                <IconArrowRight className="h-4 w-4"/>
              </ButtonLink>
            </div>
          </div>

          <LeadForm variant="insurance" source="/insurance#verify"/>
        </Container>
      </section>

      <section className="bg-cream pb-20 text-navy-950 sm:pb-28" aria-labelledby="insurance-note-heading">
        <Container>
          <SectionHeading eyebrow="Before Treatment Begins" title={translate("Get answers from the people who verify coverage daily.")} description="Admissions keeps the most current information about insurance and payment options. Reach out before treatment begins — verification and payment questions are handled personally, never by a form letter."/>
          <AdmissionsSteps withHeading={false}/>
        </Container>
      </section>

    </main>);
}
