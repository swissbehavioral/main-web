import {T,useTranslate} from '../locale';
import {usePageData,usePageText} from '../page-copy';
import {InsuranceSection} from '../insurance-section';
import {PageHero} from '../page-hero';
import {ButtonLink} from '../ui/button';
import {Container} from '../ui/container';
import {SectionHeading} from '../ui/section';
import {insurance as baseInsurance,site as baseSite} from '../../data/site';
export default function Insurance() {
 const t=useTranslate(),copy=usePageText(),insurance=usePageData(baseInsurance),site=usePageData(baseSite);
 const steps=usePageData(['We review the details you submit.','We check coverage with your insurer where applicable.','We explain costs, co-pays and payment options before treatment begins.','We identify the appropriate level of care and the next step.']);
 return <main id="main-content" className="insurance-information-page">
  <PageHero eyebrow={insurance.eyebrow} title={t(insurance.heading)} intro={insurance.body}/>
  <InsuranceSection withHeading={false}/>
  <section id="verify" className="insurance-review" aria-labelledby="insurance-review-heading"><Container>
   <div className="insurance-review-layout"><div>
    <p className="brand-eyebrow"><T>Verify Insurance</T></p>
    <h2 id="insurance-review-heading"><T>{copy('Request a verification')}</T></h2>
    <p><T>{copy('Share a few details and our admissions team will review your coverage options with you. This form is for insurance and payment questions only.')}</T></p>
    <ButtonLink to="/verify-insurance" size="lg"><T>Verify Insurance</T><span aria-hidden="true">↗</span></ButtonLink>
    <p className="insurance-review-privacy"><T>Please do not send member IDs or medical records here. Our team will explain how to provide any additional information needed for review.</T></p>
   </div><ol aria-label={t('What happens next')}>{steps.map((step,index)=><li key={index}><span aria-hidden="true">{String(index+1).padStart(2,'0')}</span><p><T>{step}</T></p></li>)}</ol></div>
  </Container></section>
  <section className="insurance-payment-details"><Container>
   <SectionHeading eyebrow="Before Treatment Begins" title={t('Get answers from the people who verify coverage daily.')} description="Admissions keeps the most current information about insurance and payment options. Reach out before treatment begins — verification and payment questions are handled personally, never by a form letter."/>
   <div className="insurance-question-topics"><div><h3><T>Coverage & benefits</T></h3><p><T>What does my plan cover for the recommended level of care?</T></p></div><div><h3><T>Out-of-pocket costs</T></h3><p><T>What deductible, co-pay or co-insurance may apply?</T></p></div><div><h3><T>Payment options</T></h3><p><T>What payment options can I discuss with Admissions?</T></p></div></div>
   <div className="insurance-details-actions"><ButtonLink href={site.phone.href} size="md"><T>{copy('Call ')}</T>{site.phone.display}</ButtonLink><ButtonLink to="/admissions" variant="outline-dark" size="md"><T>{copy('How admissions works')}</T><span aria-hidden="true">↗</span></ButtonLink></div>
  </Container></section>
 </main>;
}
