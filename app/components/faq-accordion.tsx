// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./locale";
import type { Faq, FaqGroup } from "../data/faqs";
import { IconArrowRight } from "./icons";
/**
 * Accessible FAQ accordion built on native <details>/<summary> — no JS needed,
 * works before hydration, and is crawlable for the FAQPage structured data.
 */
export function FaqAccordion({ groups }: {
    groups: FaqGroup[];
}) {
    return (<div className="space-y-12">
      <T>{groups.map((group) => (<section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`}>
          <h2 id={`${group.id}-heading`} className="font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
            <T>{group.title}</T>
          </h2>
          <div className="mt-5 divide-y divide-navy-900/10 overflow-hidden rounded-lg border border-navy-900/10 bg-white/60">
            <T>{group.items.map((item) => (<FaqItem key={item.q} faq={item}/>))}</T>
          </div>
        </section>))}</T>
    </div>);
}
function FaqItem({ faq }: {
    faq: Faq;
}) {
    return (<details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-50/60 sm:px-6 sm:py-5 sm:text-base">
        <T>{faq.q}</T>
        <IconArrowRight className="h-4 w-4 shrink-0 text-teal-600 transition-transform duration-200 group-open:rotate-90"/>
      </summary>
      <div className="px-5 pb-5 text-sm leading-relaxed text-navy-900/75 sm:px-6 sm:pb-6">
        <T>{faq.a}</T>
      </div>
    </details>);
}
