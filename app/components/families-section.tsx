// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./locale";
import { usePageData, usePageText } from "./page-copy";
import { families as base_families } from "../data/site";
import { IconArrowRight, IconHeart } from "./icons";
import { ButtonLink } from "./ui/button";
import { Container } from "./ui/container";
export function FamiliesSection() {
    const copy = usePageText();
    const families = usePageData(base_families);
    return (<section id="families" className="section-surface surface-deep relative overflow-hidden bg-sand py-20 text-navy-950 sm:py-28" aria-labelledby="families-heading">
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
              <span aria-hidden className="h-px w-8 bg-teal-400/70"/>
              <T>{families.eyebrow}</T>
            </p>
            <h2 id="families-heading" className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl">
              <T>{families.heading}</T>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-900/75 sm:text-lg">
              <T>{families.body}</T>
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 border-l-2 border-teal-500 pl-8 py-4 sm:pl-12">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-teal-400/15 text-teal-700">
              <IconHeart className="h-7 w-7" strokeWidth={1.6}/>
            </span>
            <p className="font-display text-xl font-medium leading-relaxed text-navy-950 sm:text-2xl">
              <T>{copy("“Healing is rarely a solitary journey — families are essential partners in the recovery process.”")}</T>
            </p>
            <ButtonLink to={families.cta.to} variant="accent" size="md">
              <T>{families.cta.label}</T>
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/>
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>);
}
