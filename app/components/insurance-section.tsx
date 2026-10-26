// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { usePageData, usePageText } from "./page-copy";
import { insurance as base_insurance, site as base_site } from "../data/site";
import { IconArrowUpRight, IconMail, IconPhone, IconShieldCheck, } from "./icons";
import { ButtonLink } from "./ui/button";
import { Container } from "./ui/container";
import { SectionHeading } from "./ui/section";
/**
 * Insurance & Payment teaser. Mirrors the scraped message: verification and
 * coverage questions go straight to Admissions.
 */
export function InsuranceSection({ withHeading = true, }: {
    withHeading?: boolean;
}) {
    const translate = useTranslate();
    const copy = usePageText();
    const insurance = usePageData(base_insurance);
    const site = usePageData(base_site);
    return (<section id="insurance" className="section-surface surface-mist relative bg-sand py-20 text-navy-950 sm:py-28" aria-labelledby="insurance-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <T>{withHeading ? (<SectionHeading eyebrow={insurance.eyebrow} title={translate(insurance.heading)} description={insurance.body}/>) : null}</T>

            <div className="soft-insurance-note mt-8 flex items-start gap-3 rounded-lg bg-cream p-4 text-sm text-navy-900/75">
              <IconShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600"/>
              <p>
                <T>{copy("Coverage questions change frequently. For the most current information, always speak directly with the Admissions team.")}</T>
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <ButtonLink href={site.phone.href} variant="primary" size="lg" className="w-full justify-between">
              <span className="inline-flex items-center gap-3">
                <IconPhone className="h-4 w-4"/>
                <T>{copy("Call Admissions")}</T>
              </span>
              <span className="text-navy-900/40 sm:hidden"><T>{copy("·")}</T></span>
              <span className="hidden font-sans text-base font-medium text-navy-50 sm:inline">
                <T>{site.phone.display}</T>
              </span>
            </ButtonLink>

            <ButtonLink to="/verify-insurance" variant="outline-dark" size="lg" className="justify-between">
              <T>{copy("Verify Insurance")}</T>
              <IconArrowUpRight className="h-4 w-4"/>
            </ButtonLink>

            <ButtonLink href={site.email.href} variant="outline-dark" size="lg" className="justify-between">
              <T>{copy("Email Admissions")}</T>
              <IconMail className="h-4 w-4"/>
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>);
}
