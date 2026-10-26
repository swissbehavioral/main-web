// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { usePageData, usePageText } from "./page-copy";
import type { ProgramDetail } from "../data/programs";
import { site as base_site, therapies as base_therapies } from "../data/site";
import { IconArrowRight, IconCheck, IconClock, IconHeart } from "./icons";
import { CtaBanner } from "./cta-banner";
import { PageHero } from "./page-hero";
import { ButtonLink } from "./ui/button";
import { Container } from "./ui/container";
/**
 * Data-driven program page (§Exhibit A #6–9). One template renders every level
 * of care from `data/programs.ts`.
 */
export function ProgramDetailPage({ program: baseProgram, }: {
    program: ProgramDetail;
}) {
    const translate = useTranslate();
    const copy = usePageText();
    const program = usePageData(baseProgram);
    const site = usePageData(base_site);
    const therapies = usePageData(base_therapies);
    return (<main id="main-content">
      <PageHero eyebrow={`Treatment & Programs · ${program.code}`} title={translate(program.name)} intro={program.tagline}/>

      {/* Overview + at-a-glance */}
      <section className="bg-cream py-16 text-navy-950 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              <T>{copy(`What ${program.code} is`)}</T>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-navy-900/75 sm:text-lg">
              <T>{program.definition}</T>
            </p>

            <h3 className="mt-10 font-display text-xl font-semibold sm:text-2xl">
              <T>{copy("Who it may suit")}</T>
            </h3>
            <ul className="mt-4 space-y-3">
              <T>{program.whoFor.map((item) => (<li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-800 text-cream">
                    <IconCheck className="h-3.5 w-3.5"/>
                  </span>
                  <span className="text-sm leading-relaxed text-navy-900/80 sm:text-base">
                    <T>{item}</T>
                  </span>
                </li>))}</T>
            </ul>
          </div>

          <aside className="rounded-xl border border-navy-900/10 bg-sand p-7 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
              <IconClock className="h-4 w-4"/>
              <T>{copy("At a glance")}</T>
            </p>
            <dl className="mt-5 space-y-4">
              <T>{program.typicalSchedule.map((row) => (<div key={row.label} className="border-b border-navy-900/10 pb-4 last:border-0 last:pb-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy-900/55">
                    <T>{row.label}</T>
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-navy-950">
                    <T>{row.value}</T>
                  </dd>
                </div>))}</T>
            </dl>
            <p className="mt-5 text-xs italic leading-relaxed text-navy-900/55">
              <T>{program.scheduleNote}</T>
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink to="/admissions" variant="primary" size="md">
                <T>{copy("Speak With Admissions")}</T>
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/>
              </ButtonLink>
              <ButtonLink href={site.phone.href} variant="outline-dark" size="md">
                <T>{copy("Call ")}</T>
                <T>{site.phone.display}</T>
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>

      {/* What treatment includes + family */}
      <section className="bg-navy-950 py-16 text-cream sm:py-20 texture-alpine">
        <Container>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            <T>{copy("What treatment may include")}</T>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-base">
            <T>{copy("Delivered by qualified clinicians when clinically appropriate.")}</T>
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            <T>{program.includes.map((item) => (<li key={item} className="flex items-start gap-3 rounded-lg border border-cream/10 bg-navy-900/50 p-5">
                <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-300"/>
                <span className="text-sm leading-relaxed text-cream/85">
                  <T>{item}</T>
                </span>
              </li>))}</T>
          </ul>

          <div className="mt-10 rounded-xl border border-cream/10 bg-navy-900/40 p-7 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              <IconHeart className="h-4 w-4"/>
              <T>{copy("Family involvement")}</T>
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-cream/75 sm:text-base">
              <T>{program.family}</T>
            </p>
          </div>

          <p className="mt-10 text-xs leading-relaxed text-cream/45">
            <T>{copy("Therapies may include:")}</T>{" "}
            <T>{therapies.modalities.map((modality) => modality.title).join(" · ")}</T>
            <T>{copy(".")}</T>
          </p>
        </Container>
      </section>

      {/* Program FAQ */}
      <section className="bg-cream py-16 text-navy-950 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            <T>{program.code}</T> <T>{copy("questions")}</T>
          </h2>
          <div className="mt-6 divide-y divide-navy-900/10 overflow-hidden rounded-lg border border-navy-900/10 bg-white/60">
            <T>{program.faqs.map((faq) => (<details key={faq.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-50/60 sm:px-6 sm:text-base">
                  <T>{faq.q}</T>
                  <IconArrowRight className="h-4 w-4 shrink-0 text-teal-600 transition-transform duration-200 group-open:rotate-90"/>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-navy-900/75 sm:px-6">
                  <T>{faq.a}</T>
                </div>
              </details>))}</T>
          </div>
        </Container>
      </section>

    </main>);
}
