import test from 'node:test';
import assert from 'node:assert/strict';
import {translateText, localizedHref, localizedMeta, languageSwitchHref} from '../app/lib/locale.ts';
test('Language switches preserve the page, filters and section while replacing the previous choice', () => {
 const location={pathname:'/insurance',search:'?source=nav&lang=en',hash:'#verify'};
 assert.equal(languageSwitchHref(location,'es'),'/insurance?source=nav&lang=es#verify');
 assert.equal(languageSwitchHref({...location,search:'?lang=es'},'en'),'/insurance?lang=en#verify');
});
test('Spanish navigation preserves queries and anchors without modifying external or administrative destinations', () => {
 assert.equal(localizedHref('/insurance?source=nav#verify','es'),'/insurance?source=nav&lang=es#verify');
 assert.equal(localizedHref('/?lang=en','es'),'/?lang=en');
 for(const path of ['/admin','/admin/content','/api/chat','https://example.com','//example.com','#approach','tel:+16562323504'])assert.equal(localizedHref(path,'es'),path);
 assert.equal(localizedHref('/about','en'),'/about');
});
test('Translation preserves authored English fallback and spacing', () => {
 const dictionary={hello:'Hola',wellness:'Bienestar'};
 assert.equal(translateText('  HELLO\n',dictionary),'  Hola\n');
 assert.equal(translateText('Unchanged client copy',dictionary),'Unchanged client copy');
 assert.equal(translateText('Hello · Wellness',dictionary),'Hola · Bienestar');
 assert.equal(translateText('Hello | Swiss Behavioral Health',dictionary),'Hola | Swiss Behavioral Health');
});
test('Localized metadata describes and links the corresponding language page', () => {
 const tags=localizedMeta([{title:'Hello'},{name:'description',content:'Hello'},{tagName:'link',rel:'canonical',href:'https://www.swissbehavioralhealth.com/about'}],[{id:'root',data:{locale:'es',dictionary:{hello:'Hola'}}}]);
 assert.equal(tags[0].title,'Hola');assert.equal(tags[1].content,'Hola');
 assert.equal(tags.find(t=>t.rel==='canonical').href,'https://www.swissbehavioralhealth.com/about?lang=es');
 assert.equal(tags.find(t=>t.hrefLang==='en').href,'https://www.swissbehavioralhealth.com/about?lang=en');
 assert.equal(tags.find(t=>t.property==='og:locale').content,'es_US');
});
