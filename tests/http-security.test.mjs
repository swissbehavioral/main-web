import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonce,securityHeaders,productionConfigurationErrors,readFormData} from '../app/lib/http-security.server.ts';
test('Production security policy uses unique nonces, HTTPS and private admin caching',()=>{
 const a=createNonce(),b=createNonce();assert.notEqual(a,b);
 const headers=securityHeaders('https://example.com/admin/content',a,true,'https://backend.example/v1');
 assert(headers['Content-Security-Policy'].includes(`'nonce-${a}'`));
 assert(!headers['Content-Security-Policy'].includes('unsafe-eval'));
 assert.equal(headers['X-Frame-Options'],'DENY');assert(headers['Strict-Transport-Security']);
 assert.equal(headers['Cache-Control'],'no-store, private');
 assert(!securityHeaders('http://localhost/',a,true)['Strict-Transport-Security']);
});
test('Production refuses weak secrets, local storage and shared staff login',()=>{
 assert.equal(productionConfigurationErrors({}).length,3);
 assert.deepEqual(productionConfigurationErrors({SESSION_SECRET:'a'.repeat(64),APPWRITE_ENDPOINT:'https://backend.example/v1',APPWRITE_PROJECT_ID:'project',APPWRITE_API_KEY:'key',APPWRITE_AUTH_ENABLED:'true'}),[]);
});
test('Form limits cover normal and chunked oversized requests',async()=>{
 const request=new Request('https://example.com/api/lead',{method:'POST',body:new URLSearchParams({name:'Sample'})});
 assert.equal((await readFormData(request)).get('name'),'Sample');
 const stream=new ReadableStream({start(controller){controller.enqueue(new Uint8Array(32769));controller.close();}});
 await assert.rejects(readFormData(new Request('https://example.com/api/lead',{method:'POST',body:stream,duplex:'half'})),error=>error.status===413);
});
