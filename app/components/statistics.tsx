import {T,useTranslate} from "./locale";
import {usePageData} from "./page-copy";
import {statistics as supplied} from "../data/site";
import {Container} from "./ui/container";
/** An editorial hierarchy, using the original four clinical highlights. */
export function Statistics() {
 const statistics=usePageData(supplied),t=useTranslate();
 return <section className="care-signature" aria-label={t(statistics.eyebrow)}>
  <Container><div className="care-signature-panel">
   <h2 className="care-signature-eyebrow"><T>{statistics.eyebrow}</T></h2>
   <dl className="care-signature-grid">{statistics.items.map((item,index)=><div key={index} className="care-signature-feature">
    <dt><T>{item.label}</T></dt><dd><T>{item.value}</T></dd>
   </div>)}</dl>
  </div></Container>
 </section>;
}
