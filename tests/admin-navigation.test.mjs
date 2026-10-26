import test from 'node:test';import assert from 'node:assert/strict';
import {adminBackLink} from '../app/lib/admin-navigation.ts';
test('Admin parents are deterministic for direct links and respect content kind',()=>{
 assert.equal(adminBackLink('/admin'),undefined);
 assert.deepEqual(adminBackLink('/admin/content/page-home'),{to:'/admin/content',label:'Back to website pages'});
 assert.deepEqual(adminBackLink('/admin/content/post-one','','post'),{to:'/admin/content?view=blog',label:'Back to blog articles'});
 assert.equal(adminBackLink('/admin/content/page-home/preview').to,'/admin/content/page-home');
 assert.equal(adminBackLink('/admin/leads/123').to,'/admin');
 for(const path of ['/admin/staff','/admin/content','/admin/chat'])assert.equal(adminBackLink(path).to,'/admin');
});
test('Leaving a chat thread keeps inbox filters and removes only its selection',()=>{
 assert.deepEqual(adminBackLink('/admin/chat','?status=closed&queue=mine&q=example&id=abc'),{to:'/admin/chat?status=closed&queue=mine&q=example',label:'Back to inbox'});
});
