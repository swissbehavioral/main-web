import {LodgingVideo} from "../components/lodging-video";
import {data} from 'react-router';
import {officePhotos,lodgingPhotos} from '../data/facility-photos';
import {FacilityGallery} from '../components/facility-gallery';
import {Container} from '../components/ui/container';
import {T,LocaleLink as Link} from '../components/locale';
import {localizedMeta} from '../lib/locale';
import type {Route} from './+types/gallery';
export function loader({params}:Route.LoaderArgs){
 if(!['office','lodging'].includes(params.location))throw data('Gallery not found',{status:404});
 const office=params.location==='office';
 return {gallery:{id:params.location,title:office?'Office photographs':'Lodging photographs',photos:office?officePhotos:lodgingPhotos,description:office?'Main office · Oldsmar':'The supportive lodging facility is a two-minute drive from the main Swiss Behavioral Health office.'}};
}
export function meta({loaderData,matches}:Route.MetaArgs){
 if(!loaderData)return [{title:'Gallery | Swiss Behavioral Health'},{name:'robots',content:'noindex'}];
 return localizedMeta([{title:loaderData.gallery.title+' | Swiss Behavioral Health'},{name:'description',content:loaderData.gallery.description},{tagName:'link',rel:'canonical',href:'https://www.swissbehavioralhealth.com/gallery/'+loaderData.gallery.id}],matches);
}
export default function Gallery({loaderData}:Route.ComponentProps){const g=loaderData.gallery;return <main id="main-content" className="facility-gallery-page"><Container><Link to="/" className="verification-back">← <T>{'Home'}</T></Link><h1><T>{g.title}</T></h1><p><T>{g.description}</T></p><FacilityGallery id={g.id+'-full-gallery'} photos={g.photos} label={g.title} portrait={g.id==='lodging'}/>{g.id==='lodging'?<LodgingVideo/>:null}<Link className="facility-preview-link" to="/speak-with-admissions"><T>{'Speak with admissions'}</T> ↗</Link></Container></main>;}
