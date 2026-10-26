// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { usePageDocument } from "./page-copy";
import { RetreatLandscape } from "./retreat-landscape";
import type { ContentDocument } from "../lib/content.types";
import { hero, site } from "../data/site";
import { IconArrowRight, IconPhone } from "./icons";
import { ButtonLink } from "./ui/button";
import { Container } from "./ui/container";
export function Hero({ content }: {
    content?: ContentDocument;
} = {}) {
    const translate = useTranslate();
    const page = usePageDocument();
    content = page ?? content;
    const title = content?.title ?? "Small by design. Personal by nature.";
    const split = title.match(/^(.+?[.!?])\s+([\s\S]+)$/);
    return (<section className="brand-hero" aria-labelledby="hero-heading">
      <Container className="hero-layout">
        <div className="hero-copy">
          <p className="brand-eyebrow">
            <span />
            <T>{content?.eyebrow ?? "Behavioral health · Tampa Bay, Florida"}</T>
          </p>
          <h1 id="hero-heading">
            <T>{split ? (<>
                <T>{split[1]}</T>
                <br />
                <span><T>{split[2]}</T></span>
              </>) : (<span><T>{title}</T></span>)}</T>
          </h1>
          <p className="hero-description">
            <T>{content
            ? content.summary
            : "Individualized treatment. Meaningful connection. A smaller setting with the space to focus on you."}</T>
          </p>
          <p className="hero-detail"><T>{"Behavioral health and substance use recovery, with 14-bed supportive lodging beside Philippe Park in Safety Harbor."}</T></p>
          <div className="hero-actions">
            <ButtonLink to={hero.primaryCta.to} size="lg"><T>{"Speak with admissions "}</T><IconArrowRight className="h-4 w-4"/>
            </ButtonLink>
            <ButtonLink to="/verify-insurance" variant="outline-dark" size="lg"><T>{"Verify insurance"}</T></ButtonLink>
          </div>
          <p className="hero-location"><T>{"Oldsmar & Safety Harbor "}</T><span aria-hidden><T>{" / "}</T></span><T>{" A personal approach to recovery"}</T></p>
        </div>
        <aside className="hero-brand-panel" aria-label={translate("A personal approach to care")}>
          <div className="brand-panel-top">
            <span><T>{"SWISS BEHAVIORAL HEALTH"}</T></span>
            <span><T>{"01 / A personal path"}</T></span>
          </div>
          <div className="brand-art" aria-hidden="true">
            <RetreatLandscape />
          </div>
          <div className="brand-panel-caption">
            <span><T>{"Care with intention."}</T></span>
            <p><T>{"Room to be heard."}</T><br /><T>{"Space to move forward."}</T></p>
          </div>
          <a className="hero-call" href={site.phone.href}>
            <span className="hero-call-icon">
              <IconPhone className="h-5 w-5"/>
            </span>
            <span>
              <small><T>{"Start with a confidential conversation"}</T></small>
              <strong><T>{site.phone.display}</T></strong>
            </span>
            <IconArrowRight className="ml-auto h-5 w-5"/>
          </a>
        </aside>
      </Container>

    </section>);
}
