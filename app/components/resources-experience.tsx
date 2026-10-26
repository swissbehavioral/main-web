import { LocaleLink as Link } from "./locale";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";

import { CtaBanner } from "./cta-banner";
import { IconArrowRight } from "./icons";
import { PageHero } from "./page-hero";
import { ButtonLink } from "./ui/button";
import { Container } from "./ui/container";
import { PageCopyProvider, usePageText } from "./page-copy";
import type { ContentDocument } from "../lib/content.types";
import type { ResourcePost } from "../data/resources";
type Props = {
    doc: ContentDocument;
    posts: ResourcePost[];
};
export function ResourcesExperience(props: Props) {
    return (<PageCopyProvider doc={props.doc}>
      <ResourcesBody {...props}/>
    </PageCopyProvider>);
}
function ResourcesBody({ doc, posts }: Props) {
    const translate = useTranslate();
    const copy = usePageText();
    return (<main id="main-content">
      <PageHero eyebrow={doc.eyebrow} title={translate(doc.title)} intro={doc.summary}/>

      <section className="bg-cream py-16 text-navy-950 sm:py-20">
        <Container>
          <ul className="resource-journal-list grid gap-6 md:grid-cols-2">
            <T>{posts.map((post) => (<li key={post.slug}>
                <article className="resource-journal-card group flex h-full flex-col rounded-3xl border border-navy-900/10 bg-white/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-800/30 hover:shadow-lg hover:shadow-navy-950/10 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-[0.875rem] font-semibold uppercase tracking-[0.14em] text-teal-800">
                      <T>{post.tag}</T>
                    </span>
                    <span className="text-xs text-navy-900/50">
                      <T>{post.readingMinutes}</T><T>{" min read"}</T></span>
                  </div>

                  <h2 className="mt-5 font-display text-xl font-semibold leading-snug text-navy-950 sm:text-2xl">
                    <Link to={`/resources/${post.slug}`} className="hover:underline">
                      <T>{post.title}</T>
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-900/70">
                    <T>{post.description}</T>
                  </p>

                  <Link to={`/resources/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 underline-offset-4 group-hover:underline"><T>{"Read article"}</T><IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/>
                  </Link>
                </article>
              </li>))}</T>
          </ul>

          <>
            <div className="mt-14 rounded-3xl border border-navy-900/10 bg-sand p-7 sm:p-9">
              <h2 className="font-display text-xl font-semibold text-navy-950 sm:text-2xl">
                <T>{copy("Looking for something else?")}</T>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy-900/75">
                <T>{copy("If you have a question that isn't covered here, our admissions team can help — no obligation, and the conversation is confidential.")}</T>
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/contact" variant="primary" size="md"><T>{"Send a general inquiry"}</T></ButtonLink>
                <ButtonLink to="/faq" variant="outline-dark" size="md"><T>{"Read the FAQ"}</T></ButtonLink>
              </div>
            </div>
          </>
        </Container>
      </section>

    </main>);
}
