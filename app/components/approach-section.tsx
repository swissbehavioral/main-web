// Client-authored content remains complete and readable without an overlay.
import { T, useTranslate } from "./locale";
import { FirstAidKitIcon, FlowerLotusIcon, UsersThreeIcon } from "@phosphor-icons/react/ssr";
import { usePageData } from "./page-copy";
import { approach as base_approach } from "../data/site";
import { Container } from "./ui/container";
import { SectionHeading } from "./ui/section";
const pillarIcons = [FirstAidKitIcon, FlowerLotusIcon, UsersThreeIcon];
export function ApproachSection() {
 const translate = useTranslate();
 const approach = usePageData(base_approach);
 return <section id="approach" className="section-surface surface-teal approach-section recovery-atlas" aria-labelledby="approach-heading">
  <Container>
   <div className="recovery-heading" id="approach-heading"><SectionHeading tone="dark" eyebrow={approach.eyebrow} title={translate(approach.heading)} description={approach.intro}/></div>
   <div className="recovery-journal">{approach.pillars.map((pillar,index)=>{
    const Icon=pillarIcons[index % pillarIcons.length];
    return <article className="recovery-journal-row" key={pillar.number}>
     <div className="recovery-journal-label"><span className="recovery-journal-icon" aria-hidden="true"><Icon size={38} weight="duotone"/></span><div><span className="recovery-journal-number" aria-hidden="true">{pillar.number}</span><h3><T>{pillar.title}</T></h3></div></div>
     <p><T>{pillar.body}</T></p>
    </article>;
   })}</div>
  </Container>
 </section>;
}
