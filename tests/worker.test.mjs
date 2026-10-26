import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/app.mjs';
import {fetch as nativeFetch,Agent} from '../workers/native-fetch.mjs';
test('Worker handles missing production settings without importing the SSR build or exposing settings',async()=>{
 const old=process.env.SESSION_SECRET;delete process.env.SESSION_SECRET;
 try {const response=await worker.fetch(new Request('https://worker.test/'));assert.equal(response.status,503);assert(!(await response.text()).includes('SESSION_SECRET'));assert.equal(response.headers.get('cache-control'),'no-store');}finally{if(old!==undefined)process.env.SESSION_SECRET=old;}
});
test('Worker Appwrite transport uses native fetch and refuses custom TLS agents',async()=>{
 const previous=globalThis.fetch;let seen;
 globalThis.fetch=async(url,options)=>{seen={url,options};return Response.json({documents:[]});};
 try {const response=await nativeFetch('https://appwrite.test/v1/databases',{method:'GET',headers:{'X-Appwrite-Project':'test'}});assert.equal(response.status,200);assert.equal(seen.url,'https://appwrite.test/v1/databases');assert.equal(seen.options.headers['X-Appwrite-Project'],'test');assert.throws(()=>nativeFetch('https://appwrite.test',{dispatcher:{}}));assert.throws(()=>new Agent());}finally{globalThis.fetch=previous;}
});
