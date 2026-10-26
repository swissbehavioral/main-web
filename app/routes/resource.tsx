import { LocaleLink as Link } from "../components/locale";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../components/locale";
import { useLocale } from "../components/locale";
import {localizedMeta} from "../lib/locale";
import { safeArticleUrl } from "../lib/article-links";
import { contentMeta } from "../lib/content-meta";
import { ArticleText } from "../components/article-text";
import { data } from "react-router";
import { IconArrowRight } from "../components/icons";
import { ButtonLink } from "../components/ui/button";
import { Container } from "../components/ui/container";
import type { Block, ResourcePost } from "../data/resources";
import { getPublishedContent, listPublishedPosts } from "../lib/content.server";
import { toResourcePost } from "../lib/resource-adapter";
import { safeJsonLd } from "../lib/content.types";
import { site } from "../data/site";
import type { Route } from "./+types/resource";
/** Article page (§Exhibit A #14). */
export async function loader({ params }: Route.LoaderArgs) {
    const doc = await getPublishedContent(`/resources/${params.slug}`);
    if (!doc || doc.kind !== "post")
        throw data("Article not found", { status: 404 });
    const post = toResourcePost(doc);
    const related = (await listPublishedPosts())
        .filter((p) => p.id !== doc.id)
        .slice(0, 2)
        .map(toResourcePost);
    return {
        post,
        related,
        doc,
        jsonLd: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            articleSection: post.tag,
            author: { "@type": "Person", name: doc.author },
            url: `https://www.swissbehavioralhealth.com${doc.path}`,
            mainEntityOfPage: `https://www.swissbehavioralhealth.com${doc.path}`,
            publisher: { "@type": "Organization", name: site.name },
        }),
    };
}
export function meta({ loaderData, matches }: Route.MetaArgs) {
    const post = loaderData?.post;
    if (!post)
        return [{ title: `Resources | ${site.name}` }];
    return localizedMeta([...contentMeta(loaderData.doc),
        { name: "author", content: loaderData.doc.author },
        ...(loaderData.doc.publishedAt ? [{ property: "article:published_time", content: loaderData.doc.publishedAt }] : [])], matches);
}
function BlockView({ block }: {
    block: Block;
}) {
    switch (block.type) {
        case "h":
            return (<h2 className="mt-10 font-display text-xl font-semibold text-navy-950 sm:text-2xl">
          <ArticleText text={block.text}/>
        </h2>);
        case "p":
            return (<p className="mt-4 text-base leading-relaxed text-navy-900/80">
          <ArticleText text={block.text}/>
        </p>);
        case "list":
            return (<ul className="mt-4 space-y-2">
          <T>{block.items.map((item) => (<li key={item} className="flex gap-3 text-base leading-relaxed text-navy-900/80">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500"/>
              <ArticleText text={item}/>
            </li>))}</T>
        </ul>);
        case "quote":
            return (<blockquote className="mt-8 rounded-2xl border-l-4 border-teal-500 bg-sand p-6 font-display text-lg italic leading-relaxed text-navy-900"><T>{"\u201C"}</T><ArticleText text={block.text}/><T>{"\u201D"}</T></blockquote>);
        case "note":
            return (<p className="mt-8 rounded-2xl border border-navy-900/10 bg-teal-50 p-5 text-sm leading-relaxed text-navy-900/75">
          <ArticleText text={block.text}/>
        </p>);
        default:
            return null;
    }
}
export default function ResourceArticle({ loaderData }: Route.ComponentProps) {
    const translate = useTranslate();
    const {locale}=useLocale();
    const post: ResourcePost = loaderData.post;
    const related = loaderData.related;
    return (<main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: loaderData.jsonLd }}/>

      <article className="bg-cream py-16 text-navy-950 sm:py-20">
        <Container className="max-w-3xl">
          <nav aria-label={translate("Breadcrumb")} className="text-xs font-medium text-navy-900/55">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="transition-colors hover:text-navy-950"><T>{"Home"}</T></Link>
              </li>
              <li aria-hidden className="text-navy-900/30"><T>{"/"}</T></li>
              <li>
                <Link to="/resources" className="transition-colors hover:text-navy-950"><T>{"Resources"}</T></Link>
              </li>
              <li aria-hidden className="text-navy-900/30"><T>{"/"}</T></li>
              <li className="text-navy-900" aria-current="page">
                <T>{post.tag}</T>
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex items-center gap-3">
            <span className="rounded-full bg-teal-100 px-3 py-1 text-[0.875rem] font-semibold uppercase tracking-[0.14em] text-teal-800">
              <T>{post.tag}</T>
            </span>
            <span className="text-xs text-navy-900/50">
              <T>{post.readingMinutes}</T><T>{" min read \u00B7"}</T>{" "}
              <time dateTime={post.publishedAt}>
                <T>{new Date(post.publishedAt).toLocaleDateString(locale === "es" ? "es-US" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })}</T>
              </time>
            </span>
          </div>

          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl lg:text-5xl">
            <T>{post.title}</T>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-navy-900/70">
            <T>{post.description}</T>
          </p>

          <T>{(loaderData.doc.author || loaderData.doc.reviewer) && <p className="article-byline"><T>{loaderData.doc.author && <><T>{"By "}</T><T>{loaderData.doc.author}</T></>}</T><T>{loaderData.doc.reviewer && <><T>{" \u00B7 Reviewed by "}</T><T>{loaderData.doc.reviewer}</T></>}</T></p>}</T>
          <div className="mt-10">
            <T>{post.body.map((block, index) => (<BlockView key={index} block={block}/>))}</T>
          </div>

          <T>{loaderData.doc.sources.trim() && <section className="article-sources"><h2><T>{"Sources & further reading"}</T></h2><ul><T>{loaderData.doc.sources.split("\n").filter(Boolean).map((source, index) => <li key={index}><T>{safeArticleUrl(source.trim()) ? <a className="article-inline-link" href={safeArticleUrl(source.trim())!} rel="noopener noreferrer"><T>{source}</T></a> : <ArticleText text={source}/>}</T></li>)}</T></ul></section>}</T>
          <p className="mt-12 rounded-2xl border border-navy-900/10 bg-sand p-5 text-sm leading-relaxed text-navy-900/70"><T>{"This article is general education, not medical advice, and does not create a provider relationship. If you are in crisis, contact 911 or your local emergency service."}</T></p>

          <div className="mt-10">
            <ButtonLink to="/resources" variant="outline-dark" size="md"><T>{"All resources"}</T><IconArrowRight className="h-4 w-4"/>
            </ButtonLink>
          </div>
        </Container>
      </article>

      <T>{related.length > 0 ? (<section className="bg-sand py-16 text-navy-950">
          <Container className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold"><T>{"Keep reading"}</T></h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              <T>{related.map((item) => (<li key={item.slug}>
                  <Link to={`/resources/${item.slug}`} className="group block h-full rounded-3xl border border-navy-900/10 bg-cream p-6 transition-colors hover:border-navy-800/30">
                    <span className="text-[0.875rem] font-semibold uppercase tracking-[0.14em] text-teal-700">
                      <T>{item.tag}</T>
                    </span>
                    <h3 className="mt-3 font-display text-lg font-semibold text-navy-950">
                      <T>{item.title}</T>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-900/70">
                      <T>{item.description}</T>
                    </p>
                  </Link>
                </li>))}</T>
            </ul>
          </Container>
        </section>) : null}</T>

    </main>);
}
