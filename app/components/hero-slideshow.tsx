import {useTranslate} from './locale';
import {officePhotos} from '../data/facility-photos';
// Keep the exterior prominent; supporting photographs can be swapped here.
const photos=[officePhotos[0],officePhotos[1],officePhotos[2]];
export function HeroSlideshow(){
 const t=useTranslate();
 return <div className="hero-photo-composition" role="group" aria-label={t('Office photographs')}>
  {photos.map((photo,index)=><figure key={photo.src} className={`hero-composition-photo hero-composition-photo-${index}`}><img src={photo.src} alt={t(photo.caption)} width={photo.width} height={photo.height} loading={index===0?'eager':'lazy'} fetchPriority={index===0?'high':'auto'} decoding="async"/></figure>)}
 </div>;
}
