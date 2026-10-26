// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";
import { IconMapPin, IconShieldCheck } from "../icons";
import { PageHero } from "../page-hero";
import { Container } from "../ui/container";
import { licensing as base_licensing } from "../../data/licensing";
import { pageMeta } from "../../data/site";
const statusStyles: Record<string, string> = {
    pending: "bg-navy-100 text-navy-800",
    "in-progress": "bg-teal-100 text-teal-800",
    active: "bg-navy-100 text-navy-800",
};
export default function LicensingPage() {
    const translate = useTranslate();
    const copy = usePageText();
    const licensing = usePageData(base_licensing);
    return (<main id="main-content">
      <PageHero eyebrow={licensing.eyebrow} title={translate(licensing.heading)} intro={licensing.intro}/>

      <section className="bg-cream py-16 text-navy-950 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              <T>{copy("Current status")}</T>
            </h2>
            <ul className="mt-8 space-y-5">
              <T>{licensing.items.map((item) => (<li key={item.authority} className="rounded-3xl border border-navy-900/10 bg-white/60 p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-navy-950">
                      <T>{item.authority}</T>
                    </h3>
                    <span className={`rounded-full px-3 py-1 text-[0.875rem] font-semibold uppercase tracking-[0.14em] ${statusStyles[item.status] ?? "bg-navy-100 text-navy-800"}`}>
                      <T>{item.statusLabel}</T>
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-navy-900/70">
                    <T>{item.scope}</T>
                  </p>
                  <T>{item.reference ? (<p className="mt-1 text-xs text-navy-900/55">
                      <T>{item.reference}</T>
                    </p>) : null}</T>
                  <p className="mt-4 text-sm leading-relaxed text-navy-900/75">
                    <T>{item.note}</T>
                  </p>
                </li>))}</T>
            </ul>

            <p className="mt-8 rounded-2xl border border-navy-900/10 bg-sand p-5 text-sm leading-relaxed text-navy-900/75">
              <T>{licensing.disclaimer}</T>
            </p>
          </div>

          <aside className="rounded-3xl border border-navy-900/10 bg-navy-950 p-7 text-cream texture-alpine sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              <IconShieldCheck className="h-4 w-4"/>
              <T>{licensing.facility.heading}</T>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream/80">
              <T>{licensing.facility.body}</T>
            </p>
            <p className="mt-6 flex items-start gap-2 text-sm text-cream/75">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400"/>
              <T>{licensing.facility.address}</T>
            </p>
          </aside>
        </Container>
      </section>

    </main>);
}
