import assert from 'node:assert/strict';
const origin=process.env.SEO_AUDIT_ORIGIN||'http://127.0.0.1:5180';
const sitemap=await (await fetch(origin+'/sitemap.xml')).text();
const paths=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1].replaceAll('&amp;','&')).pathname);
assert(paths.includes('/verify-insurance'));assert(!paths.some(p=>p.startsWith('/admin')));
let checked=0;
for(const path of [...new Set(paths)])for(const lang of ['en','es']) {
 const response=await fetch(origin+path+'?lang='+lang,{headers:{'user-agent':'Googlebot'}});
 assert.equal(response.status,200,path);
 const html=await response.text(),head=html.split('</head>')[0];
 assert.match(head,/<title>[^<]+<\/title>/,path+' title');
 for(const name of ['description','twitter:card','twitter:image'])assert(head.includes('name="'+name+'"'),path+' '+name);
 for(const property of ['og:title','og:description','og:url','og:image'])assert(head.includes('property="'+property+'"'),path+' '+property);
 assert.equal((head.match(/rel="canonical"/g)||[]).length,1,path+' canonical count');
 assert(head.includes('hrefLang="es"')||head.includes('hreflang="es"'),path+' alternate');
 assert.match(html,/<h1[\s>]/,path+' SSR h1');
 const graphs=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 assert(graphs.some(g=>g['@graph']?.some(n=>n['@type']==='BreadcrumbList')),path+' breadcrumb schema');
 assert(graphs.some(g=>g['@graph']?.some(n=>n['@type']==='Organization')),path+' organization schema');
 assert(!head.includes('noindex'),path+' public indexing');
 checked++;
}
const admin=await fetch(origin+'/admin/login');const adminHtml=await admin.text();
assert(admin.headers.get('x-robots-tag')?.includes('noindex')||adminHtml.includes('noindex'),'Admin indexing exclusion');
const missing=await fetch(origin+'/this-route-does-not-exist');assert.equal(missing.status,404);
console.log(`PASS: ${checked} public English/Spanish raw HTML responses contain SSR headings, unique canonical, metadata and valid schema. Admin excluded; unknown page 404.`);
