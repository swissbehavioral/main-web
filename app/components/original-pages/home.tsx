import { FacilityExperience } from "../facility-experience";
import { LeadershipSection } from "../leadership-section";
import { LocaleLink as Link } from "../locale";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "../locale";
import { usePageData, usePageText } from "../page-copy";

import { AboutSection } from "../about-section";
import { AdmissionsSteps } from "../admissions-steps";
import { ApproachSection } from "../approach-section";
import { ContactSection } from "../contact-section";
import { FamiliesSection } from "../families-section";
import { Hero } from "../hero";
import { IconArrowRight } from "../icons";
import { InsuranceSection } from "../insurance-section";
import { ProgramsSection } from "../programs-section";
import { Statistics } from "../statistics";
import { TherapiesSection } from "../therapies-section";
import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";
import { faqs as base_faqs } from "../../data/faqs";
import { pageMeta } from "../../data/site";
/** Compact FAQ teaser — a handful of top questions, linking to the full FAQ. */
function FaqTeaser() {
    const copy = usePageText();
    const faqs = usePageData(base_faqs);
    const picks = [
        faqs[0].items[0],
        faqs[1].items[1],
        faqs[2].items[0],
        faqs[0].items[3],
    ];
    return (<section className="home-questions bg-cream py-20 text-navy-950 sm:py-28" aria-labelledby="home-faq-heading">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-600 sm:text-sm">
            <span aria-hidden className="h-px w-8 bg-teal-500/70"/>
            <T>{copy("Common Questions")}</T>
          </p>
          <h2 id="home-faq-heading" className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
            <T>{copy("Before you reach out")}</T>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-navy-900/75">
            <T>{copy("Straight answers about admissions, treatment, insurance and confidentiality — so the first call feels less uncertain.")}</T>
          </p>
          <div className="mt-8">
            <ButtonLink to="/faq" variant="outline-dark" size="md">
              <T>{copy("Read all FAQs")}</T>
              <IconArrowRight className="h-4 w-4"/>
            </ButtonLink>
          </div>
        </div>

        <div className="divide-y divide-navy-900/10 overflow-hidden rounded-2xl border border-navy-900/10 bg-white/60">
          <T>{picks.map((item, index) => (<details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-50/60 sm:px-6 sm:text-base">
                <span className="question-index" aria-hidden="true">0{index + 1}</span><span className="question-label"><T>{item.q}</T></span>
                <IconArrowRight className="h-4 w-4 shrink-0 text-teal-600 transition-transform duration-200 group-open:rotate-90"/>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-navy-900/75 sm:px-6">
                <T>{item.a}</T>
              </div>
            </details>))}</T>
          <p className="px-5 py-4 text-xs text-navy-900/55 sm:px-6">
            <T>{copy("More questions answered in the")}</T>{" "}
            <Link to="/faq" className="font-semibold text-navy-800 underline underline-offset-4">
              <T>{copy("full FAQ")}</T>
            </Link>
            <T>{copy(".")}</T>
          </p>
        </div>
      </Container>
    </section>);
}
export default function Home() {
    const copy = usePageText();
    const faqs = usePageData(base_faqs);
    return (<main id="main-content">
      <Hero />
      <Statistics />
      <AboutSection />
      <ApproachSection />
      <LeadershipSection />
      <ProgramsSection />
      <TherapiesSection />
      <FacilityExperience />
      <FamiliesSection />
      <InsuranceSection />
      <AdmissionsSteps />
      <FaqTeaser />
      <ContactSection />
    </main>);
}
