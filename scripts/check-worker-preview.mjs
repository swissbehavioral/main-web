import assert from 'node:assert/strict';
const origin=process.env.WORKER_TEST_ORIGIN||'http://127.0.0.1:5183';
for(const path of ['/','/verify-insurance','/admin/login']) {
 const r=await fetch(origin+path);assert.equal(r.status,200,path);const html=await r.text();
 assert.match(html,/<h1[\s>]/,path+' SSR heading');assert.match(html,/<title>[^<]+<\/title>/,path+' title');
 if(path.startsWith('/admin'))assert(r.headers.get('x-robots-tag')?.includes('noindex'));
 else {assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert(html.includes('BreadcrumbList'));}
}
assert.equal((await fetch(origin+'/logos/SBH_Logo_Horizontal_Color.svg')).status,200);
console.log('PASS: Worker homepage, verification, private login, and static asset. SSR headings, metadata, schema and private indexing headers verified. No form submitted.');
