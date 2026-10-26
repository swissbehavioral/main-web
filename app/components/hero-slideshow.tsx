import {useTranslate} from './locale';
import {officePhotos} from '../data/facility-photos';
// One uncropped landscape keeps the exterior clear at every screen size.
export function HeroSlideshow(){
 const t=useTranslate(),photo=officePhotos[0];
 return <figure className="hero-landscape" aria-label={t('Office photographs')}>
  <img src={photo.src} alt={t(photo.caption)} width={photo.width} height={photo.height} loading="eager" fetchPriority="high" decoding="async"/>
  <span className="hero-landscape-accent" aria-hidden="true"/>
 </figure>;
}
