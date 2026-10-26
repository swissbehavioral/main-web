import { LocaleLink as Link } from "./locale";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { usePageHeading } from "./page-copy";

import { Container } from "./ui/container";
export function PageHero({ eyebrow, title, intro, }: {
    eyebrow: string;
    title: string;
    intro?: string;
}) {
    const translate = useTranslate();
    const edits = usePageHeading();
    eyebrow = edits.eyebrow ?? eyebrow;
    title = edits.title ?? title;
    intro = edits.intro ?? intro;
    return (<section className="editorial-hero">
      <Container>
        <nav aria-label={translate("Breadcrumb")}>
          <Link to="/"><T>{"Home"}</T></Link>
          <span><T>{"/"}</T></span>
          <span aria-current="page"><T>{eyebrow}</T></span>
        </nav>
        <div className="editorial-hero-grid">
          <div>
            <p className="brand-eyebrow"><T>{eyebrow}</T></p>
            <h1><T>{title}</T></h1>
          </div>
          <T>{intro && (<div className="editorial-hero-intro">
              <span className="intro-rule"/>
              <p><T>{intro}</T></p>
            </div>)}</T>
        </div>
      </Container>
      <span className="editorial-hero-ring" aria-hidden="true"/>
    </section>);
}
