import {TranslateIcon,CaretDownIcon} from "@phosphor-icons/react/ssr";
import {createContext,useContext,useRef,useEffect,type ReactNode,type ComponentProps} from 'react';
import {useLocation,Link as RouterLink,NavLink as RouterNavLink} from 'react-router';
import {translateText,localizedHref,languageSwitchHref,type Dictionary,type Locale} from '../lib/locale';
const LocaleContext=createContext<{locale:Locale;dictionary:Dictionary}>({locale:'en',dictionary:{}});
export function LocaleProvider({locale,dictionary,children}:{locale:Locale;dictionary:Dictionary;children:ReactNode}) {return <LocaleContext.Provider value={{locale,dictionary}}>{children}</LocaleContext.Provider>;}
export const useLocale = () => useContext(LocaleContext);
export function useTranslate() {const {dictionary}=useLocale();return <V,>(text:V):V=>typeof text==='string'?translateText(text,dictionary) as V:text;}
/** Translates authored interface copy; keeps elements, numbers and user values intact. */
export function T({children}:{children:ReactNode}) {const t=useTranslate();return <>{typeof children==='string'?t(children):children}</>;}
export function LanguageSwitch() {
 const {locale}=useLocale(),location=useLocation(),details=useRef<HTMLDetailsElement>(null),summary=useRef<HTMLElement>(null);
 useEffect(()=>{
  const outside=(event:PointerEvent)=>{if(details.current && !details.current.contains(event.target as Node))details.current.open=false;};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape' && details.current?.open){details.current.open=false;summary.current?.focus();}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return ()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
 },[]);
 return <nav className="language-switch" aria-label="Language / Idioma"><details ref={details} className="language-picker">
  <summary ref={summary} aria-label={locale==='en'?'Choose language: English':'Elegir idioma: Español'}><TranslateIcon size={20} weight="duotone" aria-hidden="true"/><span className="language-picker-name">{locale==='en'?'English':'Español'}</span><span className="language-picker-code">{locale==='en'?'EN':'ES'}</span><CaretDownIcon size={12} aria-hidden="true"/></summary>
  <div className="language-picker-options">{([{code:'en',label:'English'},{code:'es',label:'Español'}] as const).map(option=><a key={option.code} href={languageSwitchHref(location,option.code)} lang={option.code} hrefLang={option.code} aria-current={locale===option.code?'true':undefined}><span>{option.label}</span><span aria-hidden="true">{locale===option.code?'✓':''}</span></a>)}</div>
 </details></nav>;
}

export function LocaleLink(props:ComponentProps<typeof RouterLink>) {const {locale}=useLocale();return <RouterLink {...props} to={typeof props.to==='string'?localizedHref(props.to,locale):props.to}/>;}
export function LocaleNavLink(props:ComponentProps<typeof RouterNavLink>) {const {locale}=useLocale();return <RouterNavLink {...props} to={typeof props.to==='string'?localizedHref(props.to,locale):props.to}/>;}
