import { useLocation, useMatches } from "react-router";
import { site } from "../data/site";
import { safeJsonLd, type ContentDocument } from "../lib/content.types";
import { useLocale } from "./locale";
import { translateText } from "../lib/locale";
const origin="https://www.swissbehavioralhealth.com";
/** Factual public graph; no ratings, accreditation or clinical outcomes inferred. */
export function PublicSchema() {
 const {pathname}=useLocation(),matches=useMatches(),{locale,dictionary}=useLocale();
 if(/^\/(admin|api)(\/|$)/.test(pathname))return null;
 const leaf=matches.at(-1)?.data as {doc?:ContentDocument;member?:{name:string;role:string;bio:string;photo:string}}|undefined;
 const doc=leaf?.doc,member=leaf?.member;
 if(!doc && !member && pathname!=='/verify-insurance')return null;
 const localized=(path:string)=>origin+path+(locale==='es'?'?lang=es':'');
 const url=localized(pathname),name=translateText(doc?.title||member?.name||'Verify Insurance',dictionary);
 const description=translateText(doc?.metaDescription||doc?.summary||member?.bio||'Let’s look at your options.',dictionary);
 const organization={"@type":"Organization","@id":origin+'/#organization',name:site.name,url:origin,logo:{"@type":"ImageObject",url:origin+'/logos/SBH_Logo_Horizontal_Color.svg'},telephone:site.phone.display,email:site.email.display,address:{"@type":"PostalAddress",streetAddress:site.address.line1,addressLocality:site.address.city,addressRegion:site.address.state,postalCode:site.address.zip,addressCountry:'US'}};
 const parts=pathname.split('/').filter(Boolean);
 const crumbs=[{name:translateText('Home',dictionary),item:localized('/')}];
 if(parts.length>1)crumbs.push({name:translateText(parts[0]==='team'?'Our Team':parts[0]==='resources'?'Resources & Blog':'Treatment & Programs',dictionary),item:localized('/'+parts[0])});
 if(parts.length)crumbs.push({name,item:url});
 const graph:Record<string,unknown>[]=[organization,{"@type":"WebSite","@id":origin+'/#website',url:origin,name:site.name,publisher:{'@id':origin+'/#organization'},inLanguage:['en','es']},{"@type":member?'ProfilePage':pathname==='/contact'?'ContactPage':pathname==='/about'?'AboutPage':'WebPage',"@id":url+'#webpage',url,name,description,inLanguage:locale,isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#organization'},breadcrumb:{'@id':url+'#breadcrumb'},...(member?{mainEntity:{'@id':url+'#person'}}:{})},{"@type":"BreadcrumbList","@id":url+'#breadcrumb',itemListElement:crumbs.map((crumb,i)=>({'@type':'ListItem',position:i+1,...crumb}))}];
 if(member)graph.push({'@type':'Person','@id':url+'#person',name:member.name,jobTitle:translateText(member.role,dictionary),description:translateText(member.bio,dictionary),image:origin+member.photo,worksFor:{'@id':origin+'/#organization'}});
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd({'@context':'https://schema.org','@graph':graph})}}/>;
}
