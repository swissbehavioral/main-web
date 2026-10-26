// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import type { LegalDoc } from "../data/legal";
import { Container } from "./ui/container";
/**
 * Renders a legal document (Privacy Policy, Notice of Privacy Practices,
 * Terms) with a sticky section index on large screens.
 */
export function LegalDocument({ doc, showIndex = true, headingLevel = "h2", }: {
    doc: LegalDoc;
    showIndex?: boolean;
    headingLevel?: "h2" | "h3";
}) {
    const translate = useTranslate();
    const Heading = headingLevel;
    return (<Container className={showIndex
            ? "grid gap-12 py-16 lg:grid-cols-[16rem_1fr] lg:gap-16 lg:py-20"
            : "grid gap-12 py-16 lg:py-20"}>
      <T>{showIndex ? (<nav aria-label={translate("On this page")} className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600"><T>{"On this page"}</T></p>
          <ul className="mt-4 space-y-2 border-l border-navy-900/10 pl-4">
            <T>{doc.sections.map((section) => (<li key={section.id}>
                <a href={`#${section.id}`} className="text-sm text-navy-900/65 transition-colors hover:text-navy-950">
                  <T>{section.heading}</T>
                </a>
              </li>))}</T>
          </ul>
        </nav>) : null}</T>

      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-900/50"><T>{"Last updated: "}</T><T>{doc.updated}</T>
        </p>
        <div className="mt-10 space-y-10">
          <T>{doc.sections.map((section) => (<section key={section.id} id={section.id}>
              <Heading className="font-display text-xl font-semibold text-navy-950 sm:text-2xl">
                <T>{section.heading}</T>
              </Heading>
              <div className="mt-3 space-y-3">
                <T>{section.blocks.map((block, index) => (<div key={index}>
                    <T>{block.p ? (<p className="text-sm leading-relaxed text-navy-900/75 sm:text-base">
                        <T>{block.p}</T>
                      </p>) : null}</T>
                    <T>{block.list ? (<ul className="mt-1 space-y-2">
                        <T>{block.list.map((item) => (<li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-900/75 sm:text-base">
                            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500"/>
                            <T>{item}</T>
                          </li>))}</T>
                      </ul>) : null}</T>
                  </div>))}</T>
              </div>
            </section>))}</T>
        </div>
      </div>
    </Container>);
}
