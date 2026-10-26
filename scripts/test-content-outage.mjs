import { createServer } from 'vite';
import assert from 'node:assert/strict';
process.env.APPWRITE_ENDPOINT = 'http://127.0.0.1:1/v1';
process.env.APPWRITE_PROJECT_ID = 'local-outage-test';
process.env.APPWRITE_API_KEY = 'local-outage-test';
const server = await createServer({configFile:false, server:{middlewareMode:true,watch:null,ws:false},appType:'custom'});
try {
 const backend = await server.ssrLoadModule('/app/lib/appwrite.server.ts');
 const content = await server.ssrLoadModule('/app/lib/content.server.ts');
 const db = backend.getDatabases();
 const original = db.getDocument;
 db.getDocument = async () => {throw new TypeError('fetch failed');};
 const recovered = await content.getPublishedContent('/insurance');
 assert.equal(recovered.path,'/insurance');
 await assert.rejects(() => content.getContentRecord('page-insurance'),/fetch failed/);
 db.getDocument = async () => {const error=new Error('missing');error.code=404;throw error;};
 assert.equal((await content.getPublishedContent('/insurance')).path,'/insurance');
 db.getDocument = original;
 console.log('PASS: public insurance recovers; administrative reads still fail closed.');
} finally {await server.close();}
