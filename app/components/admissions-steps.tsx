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
    const [revealed,setRevealed]=useState<number[]>([]);
    useEffect(() => {
        const element=grid.current;
        if(!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
        const rows=Array.from(element.children);
        const observer=new IntersectionObserver(entries=>{
            entries.forEach(entry=>{if(entry.isIntersecting){const index=rows.indexOf(entry.target);setRevealed(previous=>previous.includes(index)?previous:[...previous,index]);observer.unobserve(entry.target);}});
        },{threshold:.3,rootMargin:'0px 0px -10% 0px'});
        rows.forEach(row=>observer.observe(row));
        let frame=0;
        const update=()=>{frame=0;const target=window.innerHeight*.5;let nearest=0,distance=Infinity;rows.forEach((row,index)=>{const rect=row.getBoundingClientRect();const current=Math.abs(rect.top+rect.height/2-target);if(current<distance){nearest=index;distance=current;}});setActive(nearest);};
        const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
        update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
        return ()=>{observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
    }, []);
    const translate = useTranslate();
    const copy = usePageText();
    const admissions = usePageData(base_admissions);
    const site = usePageData(base_site);
    return (<section id="admissions" className="section-surface surface-sand soft-admissions relative bg-cream py-20 text-navy-950 sm:py-28" aria-label={translate(admissions.heading)}>
      <Container>
        <T>{withHeading ? (<SectionHeading eyebrow={admissions.eyebrow} title={translate(admissions.heading)} description={admissions.intro} centered/>) : null}</T>

        <div className="admissions-scroll-journey"><div className="admissions-journey-marker" aria-hidden="true"><span key={active}>{admissions.steps[active].number}</span><span>/ {String(admissions.steps.length).padStart(2,"0")}</span></div><ol ref={grid} className="admissions-timeline" aria-label={translate(admissions.heading)}>
          {admissions.steps.map((step, index) => <li key={step.number} className="admissions-timeline-step" data-active={active === index} data-revealed={revealed.includes(index)} aria-current={active===index?"step":undefined}>
            <span className="admissions-step-number" aria-hidden="true">{step.number}</span>
            <div><h3><T>{step.title}</T></h3><p><T>{step.body}</T></p></div>
          </li>)}
        </ol></div>

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
