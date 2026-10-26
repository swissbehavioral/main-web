import {T,LocaleLink as Link,useTranslate} from './locale';
import {usePageData,usePageText} from './page-copy';
import {insurance as baseInsurance,site as baseSite} from '../data/site';
import {Container} from './ui/container';
import {SectionHeading} from './ui/section';
export function InsuranceSection({withHeading=true}:{withHeading?:boolean}) {
 const t=useTranslate(),copy=usePageText(),insurance=usePageData(baseInsurance),site=usePageData(baseSite);
 return <section id="insurance" className="insurance-pathways" aria-label={t(insurance.eyebrow)}><Container>
  <div className="insurance-pathways-layout">
   <div className="insurance-pathways-copy">
    {withHeading?<SectionHeading eyebrow={insurance.eyebrow} title={t(insurance.heading)} description={insurance.body}/>:<h2><T>Choose how to connect</T></h2>}
    <p className="insurance-coverage-note"><T>{copy('Coverage questions change frequently. For the most current information, always speak directly with the Admissions team.')}</T></p>
   </div>
   <div className="insurance-contact-list">
    <Link to="/verify-insurance" className="insurance-contact-primary"><span><strong><T>{copy('Verify Insurance')}</T></strong><small><T>Start a coverage review</T></small></span><span aria-hidden="true">↗</span></Link>
    <a href={site.phone.href}><span><strong><T>{copy('Call Admissions')}</T></strong><small>{site.phone.display}</small></span><span aria-hidden="true">↗</span></a>
    <a href={site.email.href}><span><strong><T>{copy('Email Admissions')}</T></strong><small>{site.email.display}</small></span><span aria-hidden="true">↗</span></a>
   </div>
  </div>
 </Container></section>;
}
