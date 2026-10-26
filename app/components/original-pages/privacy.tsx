// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";
import { CookieSettingsButton } from "../cookie-consent";
import { LegalDocument } from "../legal-doc";
import { PageHero } from "../page-hero";
import { Container } from "../ui/container";
import { nppDoc as base_nppDoc, privacyDoc as base_privacyDoc, } from "../../data/legal";
import { pageMeta } from "../../data/site";
/**
 * Privacy Policy + Notice of Privacy Practices (§Exhibit A #15).
 *
 * NOTE: content lives in `app/data/legal.ts` and must be reviewed by the Client
 * (and their counsel/compliance advisor) before launch — see the README launch
 * checklist.
 */
export default function PrivacyPage() {
    const translate = useTranslate();
    const copy = usePageText();
    const nppDoc = usePageData(base_nppDoc);
    const privacyDoc = usePageData(base_privacyDoc);
    return (<main id="main-content">
      <PageHero eyebrow={privacyDoc.eyebrow} title={translate(privacyDoc.title)} intro={privacyDoc.intro}/>

      <section className="bg-cream">
        <Container className="pt-8 text-sm text-navy-950">
          <CookieSettingsButton />
          <p className="mt-4"><T>{"The sbh_language cookie remembers your English or Spanish preference for one year. It contains no inquiry or chat information."}</T></p>
          <p className="mt-4">
            <a className="underline" href="#notice-of-privacy-practices">
              <T>{copy("Healthcare privacy notice")}</T>
            </a>
          </p>
        </Container>
        <LegalDocument doc={privacyDoc}/>
      </section>

      <section id="notice-of-privacy-practices" className="border-t border-navy-900/10 bg-sand">
        <Container className="pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">
            <T>{nppDoc.eyebrow}</T>
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">
            <T>{nppDoc.title}</T>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-900/75">
            <T>{nppDoc.intro}</T>
          </p>
        </Container>
        <Container className="pt-6 text-sm text-navy-950">
          <p>
            <T>{copy("Privacy resources: ")}</T>
            <a className="underline" href="https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/model-notices-privacy-practices/index.html" target="_blank" rel="noreferrer">
              <T>{copy("HHS 2026 model privacy notices")}</T>
            </a>
            <T>{copy(". ")}</T>
            <a className="underline" href="https://www.hhs.gov/hipaa/filing-a-complaint/index.html" target="_blank" rel="noreferrer">
              <T>{copy("File a privacy complaint with HHS")}</T>
            </a>
            <T>{copy(". ")}</T>
            <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              <T>{copy("Google privacy policy")}</T>
            </a>
            <T>{copy(". ")}</T>
          </p>
        </Container>
        <LegalDocument doc={nppDoc} showIndex={false} headingLevel="h3"/>
      </section>
    </main>);
}
