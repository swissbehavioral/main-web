import { T, useTranslate, LocaleLink as Link } from "./locale";
import { usePageData } from "./page-copy";
import { UserCircleIcon, UsersThreeIcon, HandHeartIcon, BrainIcon, WavesIcon, FlowerLotusIcon, ShieldCheckIcon, CompassIcon } from "@phosphor-icons/react/ssr";
import { therapies as base_therapies } from "../data/site";
import { therapyExplanations } from "../data/therapy-explanations";
import { Container } from "./ui/container";
import { SectionHeading } from "./ui/section";
const modalityIcons=[UserCircleIcon,UsersThreeIcon,HandHeartIcon,BrainIcon,WavesIcon,FlowerLotusIcon,ShieldCheckIcon,CompassIcon];
export function TherapiesSection() {
 const translate=useTranslate(),therapies=usePageData(base_therapies);
 return <section id="therapies" className="therapy-explorer" aria-labelledby="therapies-heading">
  <Container>
   <div id="therapies-heading" className="therapy-explorer-heading"><SectionHeading eyebrow={therapies.eyebrow} title={translate(therapies.heading)} description={therapies.intro}/><p className="therapy-care-note"><T>{therapies.note}</T></p></div>
   <ul className="therapy-explorer-grid">{therapies.modalities.map((modality,index)=>{
    const Icon=modalityIcons[index % modalityIcons.length];
    return <li key={index}><details className="therapy-disclosure">
     <summary><span className="therapy-symbol" aria-hidden="true"><Icon size={32} weight="duotone"/></span><h3><T>{modality.title}</T></h3><span className="therapy-disclosure-toggle" aria-hidden="true"/><span className="therapy-order" aria-hidden="true">{String(index+1).padStart(2,'0')}</span></summary>
     <div className="therapy-explanation"><p><T>{therapyExplanations[index].body}</T></p><Link to="/admissions"><T>{"Speak with admissions"}</T><span aria-hidden="true">↗</span></Link></div>
    </details></li>;
   })}</ul>
  </Container>
 </section>;
}
