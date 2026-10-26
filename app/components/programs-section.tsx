import {T,useTranslate,LocaleLink as Link} from "./locale";
import {usePageData,usePageText} from "./page-copy";
import {programs as supplied,programLevels as suppliedLevels} from "../data/programs";
import {Container} from "./ui/container";
import {SectionHeading} from "./ui/section";
export function ProgramsSection({withHeading=true}:{withHeading?:boolean}) {
 const programs=usePageData(supplied),levels=usePageData(suppliedLevels),t=useTranslate(),copy=usePageText();
 return <section id="programs" className="programs-directory" aria-labelledby={withHeading?'programs-heading':undefined}>
  <Container>
   {withHeading?<div className="programs-directory-heading" id="programs-heading"><SectionHeading eyebrow={programs.eyebrow} title={t(programs.heading)} description={programs.intro}/><Link className="programs-overview-link" to="/treatment"><T>{copy('Explore treatment')}</T><span aria-hidden="true">↗</span></Link></div>:null}
   <div className="programs-directory-grid">{levels.map(level=><article key={level.code} id={level.code.toLowerCase()} className="programs-directory-item">
    <div className="programs-directory-code"><span>{level.code}</span><span><T>{copy('Level of care')}</T></span></div>
    <div className="programs-directory-copy"><h3><T>{level.name}</T></h3><p><T>{level.description}</T></p></div>
    <Link to={`/treatment/${level.slug}`}><span><T>{copy(`About ${level.code}`)}</T></span><span className="programs-link-arrow" aria-hidden="true">↗</span></Link>
   </article>)}</div>
  </Container>
 </section>;
}
