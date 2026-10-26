import {createServer} from 'vite';
import assert from 'node:assert/strict';
const server=await createServer({configFile:false,server:{middlewareMode:true,watch:null,ws:false},appType:'custom'});
try {
 const {requestLocale,languageCookie,localeData}=await server.ssrLoadModule('/app/lib/locale.server.ts');
 const cookie=(await languageCookie.serialize('es')).split(';')[0];
 const request=(path,remember=true)=>new Request('https://www.swissbehavioralhealth.com'+path,{headers:remember?{Cookie:cookie}:{}});
 assert.equal(await requestLocale(request('/about')),'es');
 assert.equal(await requestLocale(request('/about?lang=en')),'en');
 assert.equal(await requestLocale(request('/about?lang=es',false)),'es');
 assert.equal(await requestLocale(request('/about?lang=invalid',false)),'en');
 assert.equal(await requestLocale(request('/admin/content?lang=es')),'en');
 const spanish=await localeData(request('/insurance'));
 assert.equal(spanish.dictionary['verify insurance'],'Verificar seguro');
 assert.deepEqual((await localeData(request('/?lang=en'))).dictionary,{});
 console.log('PASS: saved language, explicit override, first visit, invalid input, admin isolation, server dictionary loading.');
}finally{await server.close();}
