import { useRef, useState } from "react";
import { T, useTranslate, LocaleLink as Link } from "./locale";
import { usePageData } from "./page-copy";
import { UserCircleIcon, UsersThreeIcon, HandHeartIcon, BrainIcon, WavesIcon, FlowerLotusIcon, ShieldCheckIcon, CompassIcon, CaretDownIcon } from "@phosphor-icons/react/ssr";
import { therapies as base_therapies } from "../data/site";
import { therapyExplanations } from "../data/therapy-explanations";
import { Container } from "./ui/container";
import { SectionHeading } from "./ui/section";
const modalityIcons=[UserCircleIcon,UsersThreeIcon,HandHeartIcon,BrainIcon,WavesIcon,FlowerLotusIcon,ShieldCheckIcon,CompassIcon];
export function TherapiesSection() {
 const translate=useTranslate(),therapies=usePageData(base_therapies);
 const [active,setActive]=useState(0);
 const selectors=useRef<(HTMLButtonElement|null)[]>([]);
 return <section id="therapies" className="therapy-studio" aria-labelledby="therapies-heading">
  <Container>
   <div id="therapies-heading" className="therapy-studio-heading"><SectionHeading eyebrow={therapies.eyebrow} title={translate(therapies.heading)} description={therapies.intro}/></div>
   <div className="therapy-studio-workspace">
    <label className="therapy-mobile-chooser"><span><T>{therapies.eyebrow}</T></span><select value={active} onChange={event=>setActive(Number(event.target.value))} aria-controls={`therapy-panel-${active}`}>{therapies.modalities.map((modality,index)=><option key={index} value={index}>{translate(modality.title)}</option>)}</select><CaretDownIcon size={18} weight="bold" aria-hidden="true"/></label>
    <div className="therapy-studio-selector" role="tablist" aria-label={translate(therapies.eyebrow)}>{therapies.modalities.map((modality,index)=><button type="button" role="tab" id={`therapy-tab-${index}`} aria-controls={`therapy-panel-${index}`} aria-selected={active===index} tabIndex={active===index?0:-1} ref={element=>{selectors.current[index]=element;}} key={index} onClick={()=>setActive(index)} onKeyDown={event=>{
     let next=index;
     if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%therapies.modalities.length;
     else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+therapies.modalities.length-1)%therapies.modalities.length;
     else if(event.key==='Home')next=0;
     else if(event.key==='End')next=therapies.modalities.length-1;
     else return;
     event.preventDefault();setActive(next);selectors.current[next]?.focus();
    }}><span className="therapy-studio-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><span><T>{modality.title}</T></span><span className="therapy-studio-arrow" aria-hidden="true">↗</span></button>)}</div>
    <div className="therapy-studio-reading">{therapies.modalities.map((modality,index)=>{
     const Icon=modalityIcons[index % modalityIcons.length];
     return <div className="therapy-studio-panel" role="tabpanel" tabIndex={0} id={`therapy-panel-${index}`} aria-labelledby={`therapy-tab-${index}`} hidden={active!==index} key={index}>
      <div className="therapy-studio-art" aria-hidden="true"><span className="therapy-studio-orbit"/><Icon size={100} weight="duotone"/><span className="therapy-studio-count">{String(index+1).padStart(2,'0')} / 08</span></div>
      <h3><T>{modality.title}</T></h3><p><T>{therapyExplanations[index].body}</T></p>
      <Link to="/speak-with-admissions"><T>{"Speak with admissions"}</T><span aria-hidden="true">↗</span></Link>
     </div>;
    })}</div>
   </div>
   <p className="therapy-studio-note"><T>{therapies.note}</T></p>
  </Container>
 </section>;
}
