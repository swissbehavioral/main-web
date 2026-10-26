import {useRef,useState} from 'react';
import {useTranslate} from './locale';
interface Photo {src:string;caption:string;width:number;height:number}
export function FacilityGallery({photos,id,label,portrait=false}:{photos:readonly Photo[];id:string;label:string;portrait?:boolean}) {
 const [active,setActive]=useState(0),dialog=useRef<HTMLDialogElement>(null),t=useTranslate(),photo=photos[active];
 const move=(direction:number)=>setActive(value=>(value+direction+photos.length)%photos.length);
 return <div className={`photo-collection${portrait?' photo-collection-lodging':''}`}>
  <div className="photo-collection-grid" role="group" aria-label={t(label)}>{photos.map((item,index)=><button key={item.src} type="button" aria-label={t(item.caption)} aria-haspopup="dialog" aria-controls={`${id}-viewer`} onClick={()=>{setActive(index);dialog.current?.showModal();}}>
   <img src={item.src} alt={t(item.caption)} width={item.width} height={item.height} loading="lazy" decoding="async"/><span className="photo-collection-expand" aria-hidden="true">↗</span>
  </button>)}</div>
  <dialog ref={dialog} id={`${id}-viewer`} className="photo-viewer" aria-label={t(label)} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}} onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}}}>
   <div className="photo-viewer-toolbar"><span aria-live="polite">{String(active+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span><button type="button" autoFocus aria-label={t('Close')} onClick={()=>dialog.current?.close()}>×</button></div>
   <img src={photo.src} alt={t(photo.caption)} width={photo.width} height={photo.height}/>
   <div className="photo-viewer-navigation"><button type="button" aria-label={t('Previous photo')} onClick={()=>move(-1)}>←</button><button type="button" aria-label={t('Next photo')} onClick={()=>move(1)}>→</button></div>
  </dialog>
 </div>;
}
