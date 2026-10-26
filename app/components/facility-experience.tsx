import { FacilityPreview } from './facility-preview';
import { officePhotos,lodgingPhotos } from '../data/facility-photos';
import {facility as supplied} from '../data/recovered-content';
import {T} from './locale';
import {usePageData} from './page-copy';
import {Container} from './ui/container';
import {SectionHeading} from './ui/section';
import {ButtonLink} from './ui/button';
/** Local media: no third-party embeds, automatic playback, or video preload. */
export function FacilityExperience() {
 const facility=usePageData(supplied);
 return <section className="facility-experience" aria-labelledby="facility-heading">
  <Container>
   <div className="facility-intro"><div id="facility-heading"><SectionHeading eyebrow={facility.settingEyebrow} title={facility.settingTitle} description={facility.settingText}/></div>
    <ul>{[facility.settingList1,facility.settingList2,facility.settingList3].map(item=><li key={item}><T>{item}</T></li>)}</ul>
   </div>
   <div className="facility-office-gallery"><p className="brand-eyebrow"><T>{'Main office · Oldsmar'}</T></p><FacilityPreview photos={officePhotos} to="/gallery/office" label="View office gallery"/></div>
   <div className="lodging-experience">
    <div className="lodging-gallery"><FacilityPreview photos={lodgingPhotos} to="/gallery/lodging" label="View lodging gallery"/></div>

    <div><SectionHeading eyebrow={facility.lodgingEyebrow} title={facility.lodgingTitle} description={facility.lodgingText}/><p className="lodging-distance"><T>{"The supportive lodging facility is a two-minute drive from the main Swiss Behavioral Health office."}</T></p><p className="lodging-note"><T>{facility.lodgingNote}</T></p><ButtonLink to="/speak-with-admissions" variant="outline-dark"><T>{facility.askLodging}</T></ButtonLink></div>
   </div>
  </Container>
 </section>;
}
