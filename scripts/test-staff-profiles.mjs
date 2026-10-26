import {createServer} from 'vite';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const directory=await mkdtemp(join(tmpdir(),'sbh-profile-qa-'));
Object.assign(process.env,{APPWRITE_ENDPOINT:'',APPWRITE_PROJECT_ID:'',APPWRITE_API_KEY:'',CONTENT_DIR:directory});
const server=await createServer({configFile:false,server:{middlewareMode:true,watch:null,ws:false},appType:'custom'});
try {
 const route=await server.ssrLoadModule('/app/routes/team-profile.tsx');
 const {team}=await server.ssrLoadModule('/app/data/team.ts');
 const {localeData}=await server.ssrLoadModule('/app/lib/locale.server.ts');
 for(const expected of team.members){
  const result=await route.loader({params:{member:expected.id}});
  assert.equal(result.member.bio,expected.bio);
  assert.equal(result.member.photo,expected.photo);
  for(const locale of ['en','es']){
   const language=await localeData(new Request('https://www.swissbehavioralhealth.com/?lang='+locale));
   const tags=route.meta({loaderData:result,matches:[{id:'root',data:language}]});
   assert(tags.find(t=>t.title)?.title.includes(expected.name));
   assert.equal(tags.find(t=>t.rel==='canonical')?.href,`https://www.swissbehavioralhealth.com/team/${expected.id}${locale==='es'?'?lang=es':''}`);
   assert.equal(tags.find(t=>t.property==='og:type')?.content,'profile');
  }
 }
 await assert.rejects(()=>route.loader({params:{member:'missing-profile'}}),error=>error.init?.status===404);
 const sitemap=await server.ssrLoadModule('/app/routes/sitemap.ts');
 const xml=await (await sitemap.loader({request:new Request('https://www.swissbehavioralhealth.com/sitemap.xml')})).text();
 for(const member of team.members)assert(xml.includes('/team/'+member.id));
 console.log('PASS: three profile routes preserve supplied biographies and portraits; English/Spanish metadata and canonicals; unknown profile returns 404; profile URLs included in sitemap. Isolated local storage only.');
}finally{await server.close();await rm(directory,{recursive:true,force:true});}
