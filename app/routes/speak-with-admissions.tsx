import { T, LocaleLink as Link, useTranslate } from "../components/locale";
import { openLiveChat } from "../components/live-chat";
import { Container } from "../components/ui/container";
import { PhoneCallIcon, ChatsCircleIcon, EnvelopeSimpleIcon, ShieldCheckIcon } from "@phosphor-icons/react/ssr";
import { site } from "../data/site";
import { localizedMeta } from "../lib/locale";
import type { Route } from "./+types/speak-with-admissions";
export function meta({matches}:Route.MetaArgs) {
 return localizedMeta([{title:'Speak With Admissions | Swiss Behavioral Health'},{name:'description',content:'Call, chat, or send a general inquiry to the Swiss Behavioral Health admissions team.'},{tagName:'link',rel:'canonical',href:'https://www.swissbehavioralhealth.com/speak-with-admissions'}],matches);
}
export default function SpeakWithAdmissions() {
 const translate=useTranslate();
 return <main id="main-content" className="admissions-contact-page"><Container>
  <header className="admissions-contact-heading"><p className="brand-eyebrow"><T>{'Admissions'}</T></p><h1><T>{'Speak with admissions'}</T></h1><p><T>{'Choose how you would like to connect with our team.'}</T></p></header>
  <div className="admissions-contact-options">
   <a href={site.phone.href} className="admissions-contact-option admissions-contact-call"><PhoneCallIcon size={34} weight="duotone" aria-hidden="true"/><div><h2><T>{'Call Admissions'}</T></h2><p>{site.phone.display}</p></div><span aria-hidden="true">↗</span></a>
   <button type="button" className="admissions-contact-option" onClick={openLiveChat} aria-controls="support-chat"><ChatsCircleIcon size={34} weight="duotone" aria-hidden="true"/><span className="admissions-option-copy"><span className="admissions-option-title"><T>{'Chat with admissions'}</T></span><span className="admissions-option-description"><T>{'Start live chat'}</T></span></span><span aria-hidden="true">↗</span></button>
   <Link to="/contact" className="admissions-contact-option"><EnvelopeSimpleIcon size={34} weight="duotone" aria-hidden="true"/><div><h2><T>{'Send a General Inquiry'}</T></h2><p><T>{'Tell us how to reach you.'}</T></p></div><span aria-hidden="true">↗</span></Link>
   <Link to="/verify-insurance" className="admissions-contact-option"><ShieldCheckIcon size={34} weight="duotone" aria-hidden="true"/><div><h2><T>{'Verify Insurance'}</T></h2><p><T>{'Let’s look at your options.'}</T></p></div><span aria-hidden="true">↗</span></Link>
  </div>
  <div className="admissions-contact-notes"><p><T>{'Chat replies depend on staff availability.'}</T></p><p><T>{'Admissions conversations are confidential. Please avoid sending medical records, diagnoses, insurance IDs, or other sensitive health information through this website.'}</T></p><p><T>{site.emergencyNote}</T></p><a href={site.email.href} aria-label={translate('Email Admissions')}>{site.email.display}</a><Link to="/admissions"><T>{'How admissions works'}</T><span aria-hidden="true"> →</span></Link></div>
 </Container></main>;
}
