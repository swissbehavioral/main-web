// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";
import { FaqAccordion } from "../faq-accordion";
import { PageHero } from "../page-hero";
import { Container } from "../ui/container";
import { allFaqs as base_allFaqs, faqs as base_faqs } from "../../data/faqs";
import { pageMeta } from "../../data/site";
/** FAQPage structured data (§Exhibit A #13 / SEO). */
export function loader() {
    return {
        faqJsonLd: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: base_allFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
        }),
    };
}
export default function FaqPage() {
    const translate = useTranslate();
    const copy = usePageText();
    const allFaqs = usePageData(base_allFaqs);
    const faqs = usePageData(base_faqs);
    const loaderData = {
        faqJsonLd: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
        }).replace(/</g, "\\u003c"),
    };
    return (<main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: loaderData.faqJsonLd }}/>

      <PageHero eyebrow="FAQ" title={translate("Questions People Ask Before Reaching Out")} intro="General information about admissions, treatment, insurance and confidentiality at Swiss Behavioral Health."/>

      <section className="bg-cream py-16 text-navy-950 sm:py-20">
        <Container className="max-w-4xl">
          <FaqAccordion groups={faqs}/>
          <p className="mt-12 rounded-2xl border border-navy-900/10 bg-sand p-5 text-sm leading-relaxed text-navy-900/75">
            <T>{copy("This page provides general information only and is not medical advice. If you or someone else is in immediate danger, contact 911 or your local emergency service.")}</T>
          </p>
        </Container>
      </section>

    </main>);
}
