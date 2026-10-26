import { T, LocaleLink as Link } from "../components/locale";
import { LeadForm } from "../components/lead-form";
import { Container } from "../components/ui/container";
import { localizedMeta } from "../lib/locale";
import type { Route } from "./+types/verify-insurance";
export function meta({matches}:Route.MetaArgs) {
 const title="Verify Insurance | Swiss Behavioral Health";
 return localizedMeta([{title},{name:"description",content:"Let’s look at your options."},{tagName:"link",rel:"canonical",href:"https://www.swissbehavioralhealth.com/verify-insurance"}],matches);
}
export default function VerifyInsurance() {
 return <main id="main-content" className="verification-page"><Container>
  <Link to="/insurance" className="verification-back">← <T>{"Insurance & Payment"}</T></Link>
  <div className="verification-layout"><header><p className="brand-eyebrow"><T>{"START A COVERAGE REVIEW"}</T></p><h1><T>{"Verify Insurance"}</T></h1><p><T>{"Let’s look at your options."}</T></p></header>
   <section className="verification-form" aria-label="Insurance verification"><LeadForm variant="insurance" source="/verify-insurance"/></section>
  </div>
 </Container></main>;
}
