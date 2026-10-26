import {T,useTranslate} from "./locale";
import {usePageData,usePageText} from "./page-copy";
import {about as supplied} from "../data/site";
import {ButtonLink} from "./ui/button";
import {Container} from "./ui/container";
export function AboutSection({withHeading=true}:{withHeading?:boolean}) {
 const about=usePageData(supplied),t=useTranslate(),copy=usePageText();
 const heading=t(about.heading),parts=heading.match(/^(\d+[.]?)(\s+[\s\S]+)$/);
 return <section id="about" className="about-by-design" aria-labelledby="about-heading">
  <Container><div className="about-story-grid">
   <div className="about-signature">
    {withHeading?<><p className="brand-eyebrow"><T>{about.eyebrow}</T></p><h2 id="about-heading" className={parts?'about-number-heading':'about-text-heading'}><span className="about-number">{parts?parts[1]:''}</span>{' '}<span className="about-design-title">{parts?parts[2].trim():heading}</span></h2></>:null}
    <figure className="about-client-quote"><blockquote><T>{copy('“')}</T><T>{about.quote}</T><T>{copy('”')}</T></blockquote></figure>
   </div>
   <div className="about-story-copy"><p className="about-intro"><T>{about.intro}</T></p><p className="about-depth"><T>{about.body}</T></p>
    <ul className="about-benefits">{about.benefits.map(benefit=><li key={benefit}><T>{benefit}</T></li>)}</ul>
    {withHeading?<ButtonLink to="/about" variant="outline-dark" size="md"><T>{copy('More about Swiss Behavioral Health')}</T><span aria-hidden="true">↗</span></ButtonLink>:null}
   </div>
  </div></Container>
 </section>;
}
