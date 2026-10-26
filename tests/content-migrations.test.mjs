import test from 'node:test';
import assert from 'node:assert/strict';
import {appendRestoredSections} from '../app/lib/content-migrations.ts';
const block=(i)=>({type:'paragraph',text:`Client copy ${i}`,slot:`page-team:${i}`});
const old={id:'page-team',title:'Client edited title',body:Array.from({length:14},(_,i)=>block(i))};
const seed={...old,title:'Original title',body:[...old.body,block(14),block(15)]};
test('Restored section migration preserves existing client edits and does not mutate stored content',()=>{
 const doc=structuredClone(old);doc.body[0].text='Client edited paragraph';
 const before=structuredClone(doc),result=appendRestoredSections(doc,seed);
 assert.equal(result.title,doc.title);assert.equal(result.body.length,16);
 assert.deepEqual(result.body.slice(0,14),doc.body);
 assert.deepEqual(doc,before);
 assert.notEqual(result.body[14],seed.body[14]);
 assert.equal(appendRestoredSections(result,seed),result);
});
test('Restored migration rejects unrelated, truncated or reordered schemas',()=>{
 const unrelated={...old,id:'other'};assert.equal(appendRestoredSections(unrelated,seed),unrelated);
 const truncated={...old,body:old.body.slice(0,10)};assert.equal(appendRestoredSections(truncated,seed),truncated);
 const reordered=structuredClone(old);reordered.body[0].slot='page-team:9';assert.equal(appendRestoredSections(reordered,seed),reordered);
});
