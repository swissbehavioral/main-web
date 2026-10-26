import {useTranslate} from './locale';
import {officePhotos} from '../data/facility-photos';
const photos=[officePhotos[0],officePhotos[1],officePhotos[2]];
export function HeroSlideshow(){
 const t=useTranslate();
 return <div className="hero-photo-triptych" role="group" aria-label={t('Office photographs')}>
  <figure className="hero-triptych-exterior"><img src={photos[0].src} alt={t(photos[0].caption)} width={photos[0].width} height={photos[0].height} loading="eager" fetchPriority="high" decoding="async"/></figure>
  <div className="hero-triptych-interiors">{photos.slice(1).map(photo=><figure key={photo.src}><img src={photo.src} alt={t(photo.caption)} width={photo.width} height={photo.height} loading="lazy" decoding="async"/></figure>)}</div>
 </div>;
}
