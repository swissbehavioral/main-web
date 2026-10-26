import { LocaleLink as Link } from "./locale";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { PageCopyProvider } from "./page-copy";
import { OriginalPage, hasOriginalPage } from "./original-pages";
import { LocationMap } from "./location-map";

import { site } from "../data/site";
const programDirectory = [
    {
        id: "page-php",
        path: "/treatment/php",
        title: "Partial hospitalization",
        summary: "Understand a more intensive outpatient level of care.",
    },
    {
        id: "page-iop",
        path: "/treatment/iop",
        title: "Intensive outpatient",
        summary: "Explore structured support alongside daily responsibilities.",
    },
    {
        id: "page-op",
        path: "/treatment/op",
        title: "Outpatient care",
        summary: "Learn about continued therapy at a lower intensity.",
    },
];
import type { ContentDocument } from "../lib/content.types";
import { ContentBlocks } from "./content-blocks";
import { LeadForm } from "./lead-form";
import { PageHero } from "./page-hero";
import { Container } from "./ui/container";
export function ReviewNotice({ doc }: {
    doc: ContentDocument;
}) {
    return doc.reviewRequired ? (<div className="content-review-notice">
      <strong><T>{"Information awaiting confirmation"}</T></strong>
      <span><T>{doc.reviewNotes}</T></span>
    </div>) : null;
}
export function ContractPage({ doc, preview = false, }: {
    doc: ContentDocument;
    preview?: boolean;
}) {
    const translate = useTranslate();
    if (hasOriginalPage(doc.id))
        return (<PageCopyProvider doc={doc}>
        <OriginalPage id={doc.id}/>
      </PageCopyProvider>);
    const form = doc.path === "/insurance"
        ? "insurance"
        : doc.path === "/contact"
            ? "inquiry"
            : null;
    return (<main id="main-content" className={`editorial-page page-${doc.id.replace("page-", "")}`}>
      <T>{preview && (<div className="draft-preview-banner"><T>{"Private draft preview \u00B7 This version is not published"}</T></div>)}</T>
      <PageHero eyebrow={doc.eyebrow} title={translate(doc.title)} intro={doc.summary}/>
      <Container>
        <ReviewNotice doc={doc}/>
      </Container>
      <T>{doc.path === "/treatment" && (<section className="care-directory">
          <Container>
            <div className="directory-heading">
              <p className="brand-eyebrow"><T>{"EXPLORE THE CONTINUUM"}</T></p>
              <span><T>{"Clinical assessment guides the level of care."}</T></span>
            </div>
            <div className="care-directory-grid">
              <T>{programDirectory.map((p, i) => (<Link className={`care-directory-card ${p.id === "page-additional-program" ? "pending-program" : ""}`} to={p.path} key={p.id}>
                  <span>
                    <T>{String(i + 1).padStart(2, "0")}</T><T>{" /"}</T>{" "}
                    <T>{p.id === "page-additional-program"
                    ? "RESERVED PAGE"
                    : "OUTPATIENT CARE"}</T>
                  </span>
                  <h2><T>{p.title}</T></h2>
                  <p><T>{p.summary}</T></p>
                  <strong>
                    <T>{p.id === "page-additional-program"
                    ? "View unconfirmed template"
                    : "Understand this level of care"}</T>{" "}
                    <span aria-hidden><T>{"\u2197"}</T></span>
                  </strong>
                </Link>))}</T>
            </div>
          </Container>
        </section>)}</T>
      <section className="editorial-body">
        <Container className={form ? "editorial-with-form" : "editorial-grid"}>
          <div>
            <ContentBlocks blocks={doc.body}/>
          </div>
          <T>{form ? (<aside id={form === "insurance" ? "verify" : "inquiry"} className="editorial-form">
              <p className="brand-eyebrow">
                <T>{form === "insurance"
                ? "START A COVERAGE REVIEW"
                : "SEND A GENERAL INQUIRY"}</T>
              </p>
              <h2>
                <T>{form === "insurance"
                ? "Let’s look at your options."
                : "Tell us how to reach you."}</T>
              </h2>
              <T>{preview ? (<p className="editorial-notice"><T>{"The live "}</T><T>{form === "insurance" ? "insurance" : "inquiry"}</T><T>{" form appears here after publication."}</T></p>) : (<LeadForm variant={form} source={doc.path + (form === "insurance" ? "#verify" : "")}/>)}</T>
            </aside>) : (<aside className="editorial-sidebar">
              <span className="brand-eyebrow"><T>{"A PERSONAL NEXT STEP"}</T></span>
              <h3><T>{"A real conversation helps."}</T></h3>
              <p><T>{"Questions about current services, locations, or what comes next? Speak with admissions."}</T></p>
              <a href={site.phone.href}><T>{site.phone.display}</T><T>{" \u2197"}</T></a>
              <Link to="/contact"><T>{"Contact the team"}</T></Link>
              <div className="sidebar-index">
                <strong><T>{"Useful next steps"}</T></strong>
                <Link to="/admissions"><T>{"Admissions process \u2192"}</T></Link>
                <Link to="/insurance"><T>{"Insurance & payment \u2192"}</T></Link>
                <Link to="/licensing"><T>{"Licensing information \u2192"}</T></Link>
                <Link to="/team"><T>{"Our team \u2192"}</T></Link>
              </div>
            </aside>)}</T>
        </Container>
      </section>
      <T>{doc.path === "/contact" && (<Container>
          <div className="location-surface">
            <div>
              <p className="brand-eyebrow"><T>{"OLDMSAR \u00B7 CONTACT LOCATION"}</T></p>
              <h2><T>{"Find your way to us."}</T></h2>
              <p>
                <T>{site.address.line1}</T>
                <br />
                <T>{site.address.city}</T><T>{", "}</T><T>{site.address.state}</T> <T>{site.address.zip}</T>
              </p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.address.line1}, ${site.address.city}, ${site.address.state} ${site.address.zip}`)}`} target="_blank" rel="noopener noreferrer"><T>{"Open location in Google Maps \u2197"}</T></a>
              <p className="editorial-small"><T>{"Confirm the appropriate service location with admissions before visiting."}</T></p>
            </div>
            <LocationMap />
          </div>
        </Container>)}</T>
      <section className="editorial-endnote">
        <Container>
          <span><T>{"SWISS BEHAVIORAL HEALTH"}</T></span>
          <p><T>{"Thoughtful questions."}</T><br />
            <em><T>{"Personal answers."}</T></em>
          </p>
          <Link to="/contact"><T>{"Start a conversation "}</T><span><T>{"\u2197"}</T></span>
          </Link>
        </Container>
      </section>
    </main>);
}
