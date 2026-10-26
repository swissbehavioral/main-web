import { useEffect, useRef, useState } from "react";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { usePageData, usePageText } from "./page-copy";
import { admissions as base_admissions, site as base_site } from "../data/site";
import { IconArrowRight, IconPhone, IconShieldCheck } from "./icons";
import { ButtonLink } from "./ui/button";
import { Container } from "./ui/container";
import { SectionHeading } from "./ui/section";
/**
 * The five-step admissions journey ("Taking the First Step").
 */
export function AdmissionsSteps({ withHeading = true, }: {
    withHeading?: boolean;
}) {
    const grid = useRef<HTMLOListElement>(null);
    const [active, setActive] = useState(0);
    useEffect(() => {
        const element = grid.current;
        if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let frame = 0;
        const update = () => {
            frame = 0;
            const rect = element.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, (window.innerHeight * .85 - rect.top) / (rect.height + window.innerHeight * .3)));
            setActive(Math.min(4, Math.floor(progress * 5)));
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
    }, []);
    const translate = useTranslate();
    const copy = usePageText();
    const admissions = usePageData(base_admissions);
    const site = usePageData(base_site);
    return (<section id="admissions" className="section-surface surface-sand soft-admissions relative bg-cream py-20 text-navy-950 sm:py-28" aria-labelledby="admissions-heading">
      <Container>
        <T>{withHeading ? (<SectionHeading eyebrow={admissions.eyebrow} title={translate(admissions.heading)} description={admissions.intro} centered/>) : null}</T>

        <ol ref={grid} className="admissions-bento" aria-label={translate(admissions.heading)}>
          {admissions.steps.map((step, index) => <li key={step.number} className={`admission-tile admission-tile-${index + 1}`} data-active={active === index} data-complete={index < active}>
            <span className="admission-tile-number" aria-hidden="true">{step.number}</span>
            <span className="admission-tile-trace" aria-hidden="true"/>
            <div><h3><T>{step.title}</T></h3><p><T>{step.body}</T></p></div>
            <span className="admission-tile-next" aria-hidden="true">{index === 4 ? "✓" : "↗"}</span>
          </li>)}
        </ol>

        {/* Callout */}
        <div className="soft-admissions-callout mt-14 flex flex-col gap-6 rounded-xl border border-navy-900/10 bg-sand p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-400/20 text-teal-700">
              <IconPhone className="h-5 w-5"/>
            </span>
            <div>
              <h3 className="font-display text-xl font-semibold text-navy-950 sm:text-2xl">
                <T>{admissions.callout.title}</T>
              </h3>
              <p className="mt-1 text-sm text-navy-900/70">
                <T>{admissions.callout.body}</T>{" "}
                <span className="text-navy-900/50">
                  <T>{copy("(")}</T>
                  <T>{site.phone.display}</T>
                  <T>{copy(")")}</T>
                </span>
              </p>
              <p className="mt-2 flex items-center gap-2 text-xs text-navy-900/55">
                <IconShieldCheck className="h-4 w-4 text-teal-600"/>
                <T>{site.emergencyNote}</T>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <ButtonLink href={admissions.callout.primaryCta.href} variant="primary" size="lg">
              <IconPhone className="h-4 w-4"/>
              <T>{admissions.callout.primaryCta.label}</T>
            </ButtonLink>
            <ButtonLink to={admissions.callout.secondaryCta.to} variant="outline-dark" size="lg">
              <T>{admissions.callout.secondaryCta.label}</T>
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/>
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>);
}
