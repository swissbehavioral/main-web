import {createCookie} from 'react-router';
import type {Locale,Dictionary} from './locale';
export const languageCookie=createCookie('sbh_language',{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:31536000});
export async function requestLocale(request:Request):Promise<Locale> {
 const url=new URL(request.url);if(url.pathname.startsWith('/admin'))return 'en';
 const query=url.searchParams.get('lang');if(query==='es'||query==='en')return query;
 return (await languageCookie.parse(request.headers.get('Cookie')))==='es'?'es':'en';
}
export async function localeData(request:Request) {
 const locale=await requestLocale(request);
 const dictionary:Dictionary=locale==='es'?(await import('../locales/es.json')).default:{};
 return {locale,dictionary};
}
