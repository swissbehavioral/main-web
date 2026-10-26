export type Locale = 'en' | 'es';
export type Dictionary = Record<string,string>;
export const normalizeTranslationKey = (text:string) => text.replace(/\s+/g,' ').trim().toLowerCase();
export function translateText(text:string,dictionary:Dictionary={}) {
 const translation=dictionary[normalizeTranslationKey(text)];
 if(!translation && text.includes(' · ')) {const parts=text.split(' · ');const values=parts.map(part=>dictionary[normalizeTranslationKey(part)]||part);if(values.some((value,i)=>value!==parts[i]))return values.join(' · ');}
 if(!translation && text.includes(' | Swiss Behavioral Health')) {const [title]=text.split(' | Swiss Behavioral Health');const translatedTitle=dictionary[normalizeTranslationKey(title)];if(translatedTitle)return translatedTitle+' | Swiss Behavioral Health';}
 if(translation) return (text.match(/^\s+/)?.[0]||'')+translation+(text.match(/\s+$/)?.[0]||'');
 return text;
}
export function localizedHref(href:string,locale:Locale) {
 if(locale!=='es'||!href.startsWith('/')||href.startsWith('//')||/^\/(admin|api)(\/|$)/.test(href))return href;
 const url=new URL(href,'https://www.swissbehavioralhealth.com');if(!url.searchParams.has('lang'))url.searchParams.set('lang','es');return url.pathname+url.search+url.hash;
}
export function localizedMeta(tags:any[],matches:readonly any[] = []) {
 const language=matches.find(m=>m.id==='root')?.data as {locale?:Locale;dictionary?:Dictionary}|undefined;
 const dictionary=language?.dictionary || {};
 const result=tags.map(tag=>{
  if(tag.title)return {...tag,title:translateText(tag.title,dictionary)};
  if(tag.content&&['description','og:title','og:description','twitter:title','twitter:description'].includes(tag.name||tag.property))return {...tag,content:translateText(tag.content,dictionary)};
  if(language?.locale==='es'&&tag.rel==='canonical')return {...tag,href:tag.href+'?lang=es'};
  if(language?.locale==='es'&&tag.property==='og:url')return {...tag,content:tag.content+'?lang=es'};
  return tag;
 });
 const canonical=tags.find(tag=>tag.rel==='canonical')?.href;
 if(canonical)result.push({tagName:'link',rel:'alternate',hrefLang:'en',href:canonical+'?lang=en'},{tagName:'link',rel:'alternate',hrefLang:'es',href:canonical+'?lang=es'},{tagName:'link',rel:'alternate',hrefLang:'x-default',href:canonical});
 if(canonical) {
  const title=result.find(tag=>tag.title)?.title;
  const description=result.find(tag=>tag.name==='description')?.content;
  const defaults=[
   {property:'og:type',content:'website'},
   {property:'og:title',content:title},
   {property:'og:description',content:description},
   {property:'og:url',content:result.find(tag=>tag.rel==='canonical')?.href},
   {property:'og:image',content:'https://www.swissbehavioralhealth.com/images/office/office-building-exterior.webp'},
   {property:'og:image:alt',content:translateText('Swiss Behavioral Health office exterior in Oldsmar',dictionary)},
   {name:'twitter:card',content:'summary_large_image'},
   {name:'twitter:title',content:title},
   {name:'twitter:description',content:description},
   {name:'twitter:image',content:'https://www.swissbehavioralhealth.com/images/office/office-building-exterior.webp'},
   {name:'robots',content:'index, follow, max-image-preview:large'}
  ];
  for(const tag of defaults)if(tag.content && !result.some(existing=>(tag.name && existing.name===tag.name)||(tag.property && existing.property===tag.property)))result.push(tag);
 }
 result.push({property:'og:locale',content:language?.locale==='es'?'es_US':'en_US'});
 return result;
}

/** Full-document navigation updates SSR copy and the saved preference together. */
export function languageSwitchHref(location:{pathname:string;search:string;hash:string},target:Locale) {
 const url=new URL(location.pathname+location.search,"https://www.swissbehavioralhealth.com");
 url.searchParams.set("lang",target);
 return url.pathname+url.search+location.hash;
}
