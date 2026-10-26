// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";
import { LegalDocument } from "../legal-doc";
import { PageHero } from "../page-hero";
import { termsDoc as base_termsDoc } from "../../data/legal";
import { pageMeta } from "../../data/site";
/** Terms of Use (§Exhibit A #16). */
export default function TermsPage() {
    const translate = useTranslate();
    const copy = usePageText();
    const termsDoc = usePageData(base_termsDoc);
    return (<main id="main-content">
      <PageHero eyebrow={termsDoc.eyebrow} title={translate(termsDoc.title)} intro={termsDoc.intro}/>
      <section className="bg-cream">
        <LegalDocument doc={termsDoc}/>
      </section>
    </main>);
}
