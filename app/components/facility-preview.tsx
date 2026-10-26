import {LocaleLink as Link,T,useTranslate} from './locale';
interface Photo {src:string;caption:string;width:number;height:number}
export function FacilityPreview({photos,to,label}:{photos:readonly Photo[];to:string;label:string}){
 const t=useTranslate();
 return <div className="facility-preview"><div className="facility-preview-images">{photos.slice(0,3).map(photo=><Link key={photo.src} to={to} aria-label={t(label)}><img src={photo.src} alt={t(photo.caption)} width={photo.width} height={photo.height} loading="lazy" decoding="async"/></Link>)}</div><Link className="facility-preview-link" to={to}><T>{label}</T><span aria-hidden="true">↗</span></Link></div>;
}
