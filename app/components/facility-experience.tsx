import {facility as supplied} from '../data/recovered-content';
import {T,useTranslate} from './locale';
import {usePageData} from './page-copy';
import {Container} from './ui/container';
import {SectionHeading} from './ui/section';
import {ButtonLink} from './ui/button';
/** Local media: no third-party embeds, automatic playback, or video preload. */
export function FacilityExperience() {
 const facility=usePageData(supplied),t=useTranslate();
 return <section className="facility-experience" aria-labelledby="facility-heading">
  <Container>
   <div className="facility-intro"><div id="facility-heading"><SectionHeading eyebrow={facility.settingEyebrow} title={facility.settingTitle} description={facility.settingText}/></div>
    <ul>{[facility.settingList1,facility.settingList2,facility.settingList3].map(item=><li key={item}><T>{item}</T></li>)}</ul>
   </div>
   <div className="facility-photo-grid">
    <figure><img src="/images/facility/campus.webp" alt={t('Swiss Behavioral Health campus and grounds')} width="1200" height="900" loading="lazy" decoding="async"/></figure>
    <figure><img src="/images/facility/building.webp" alt={t('Swiss Behavioral Health facility building and entrance in Oldsmar, Florida')} width="1200" height="900" loading="lazy" decoding="async"/></figure>
   </div>
   <div className="lodging-experience">
    <div className="lodging-video"><video controls playsInline preload="none" poster="/images/facility/philippe-park.webp" aria-label={t('Philippe Park and supportive lodging environment near Swiss Behavioral Health')}><source src="/videos/philippe-park.mp4" type="video/mp4"/><T>Your browser does not support this video.</T> <a href="/videos/philippe-park.mp4"><T>Open lodging video</T></a></video><p><T>Philippe Park · Safety Harbor</T></p></div>
    <div><SectionHeading eyebrow={facility.lodgingEyebrow} title={facility.lodgingTitle} description={facility.lodgingText}/><p className="lodging-note"><T>{facility.lodgingNote}</T></p><ButtonLink to="/admissions" variant="outline-dark"><T>{facility.askLodging}</T></ButtonLink></div>
   </div>
  </Container>
 </section>;
}
