// In-memory Appwrite doubles only. No real accounts or conversations are modified.
import {createServer} from 'vite';
import assert from 'node:assert/strict';
import {Account,Users} from 'node-appwrite';
process.env.APPWRITE_ENDPOINT='http://127.0.0.1:1/v1';process.env.APPWRITE_PROJECT_ID='isolated-admin-qa';process.env.APPWRITE_API_KEY='isolated-admin-qa';process.env.APPWRITE_AUTH_ENABLED='true';
process.env.SESSION_SECRET='isolated-admin-workspace-secret-for-tests-only';
const server=await createServer({configFile:false,server:{middlewareMode:true,watch:null,ws:false},appType:'custom'});
const originalGet=Account.prototype.get;
try {
 const backend=await server.ssrLoadModule('/app/lib/appwrite.server.ts');
 const auth=await server.ssrLoadModule('/app/lib/auth.server.ts');
 const chat=await server.ssrLoadModule('/app/lib/chat.server.ts');
 const chatRoute=await server.ssrLoadModule('/app/routes/admin.chat.tsx');
 const staffRoute=await server.ssrLoadModule('/app/routes/admin.staff.tsx');
 const visitorRoute=await server.ssrLoadModule('/app/routes/api.chat.ts');
 let currentUser={$id:'qa-admin',email:'admin@example.test',name:'QA admin',labels:['sbhadmin'],status:true};
 Account.prototype.get=async()=>currentUser;
 const members=new Map();const users=Users.prototype;
 users.list=async()=>({users:[...members.values()]});users.create=async input=>{const u={$id:'qa-created',name:input.name,email:input.email,labels:[],status:true,emailVerification:false};members.set(u.$id,u);return u;};
 users.updateLabels=async ({userId,labels})=>{members.get(userId).labels=labels;};
 const conversations=new Map([['qa-visitor',{$id:'qa-visitor',visitorId:'qa-visitor',name:'QA visitor',email:'visitor@example.test',status:'open',assignedTo:'',leadId:'',$createdAt:new Date().toISOString(),$updatedAt:new Date().toISOString()}]]);
 const db=backend.getDatabases();let messageDeletes=0;
 db.listDocuments=async ({collectionId})=>({documents:collectionId==='conversations'?[...conversations.values()]:[]});
 db.getDocument=async ({documentId})=>{const c=conversations.get(documentId);if(!c)throw Object.assign(new Error('missing'),{code:404});return {...c};};
 db.updateDocument=async ({collectionId,documentId,data})=>{if(collectionId==='chat_events')return {};const c={...conversations.get(documentId),...data};conversations.set(documentId,c);return c;};
 db.deleteDocument=async()=>{messageDeletes++;};
 const session=await auth.adminSessionStorage.getSession();session.set('admin',true);session.set('since',Date.now());session.set('secret','fake-session');
 const cookie=(await auth.adminSessionStorage.commitSession(session)).split(';')[0];
 function req(path,body,cookieHeader=cookie){return new Request('https://qa.example'+path,{method:body?'POST':'GET',headers:{Cookie:cookieHeader,...(body?{Origin:'https://qa.example'}:{})},...(body?{body:new URLSearchParams(body)}:{})});}
 let result=await staffRoute.action({request:req('/admin/staff',{intent:'create',name:'QA staff',email:'staff@example.test',password:'test-only-password-123',role:'agent'})});
 assert.equal(result.data.success.startsWith('Staff account created'),true);assert.deepEqual(members.get('qa-created').labels,['sbhagent']);
 currentUser={...currentUser,labels:['sbhmanager']};await assert.rejects(()=>staffRoute.action({request:req('/admin/staff',{intent:'create'})}),e=>e.status===403);
 console.log('PASS administrators can create labeled staff accounts; managers cannot manage staff');
 currentUser={...currentUser,labels:['sbhadmin']};
 await chatRoute.action({request:req('/admin/chat',{id:'qa-visitor',intent:'trash'})});assert.equal(conversations.get('qa-visitor').status,'deleted');
 let inbox=await chatRoute.loader({request:req('/admin/chat?status=all')});assert.equal(inbox.data.conversations.length,0);
 let trash=await chatRoute.loader({request:req('/admin/chat?status=deleted')});assert.equal(trash.data.conversations.length,1);
 await chatRoute.action({request:req('/admin/chat',{id:'qa-visitor',intent:'restore'})});assert.equal(conversations.get('qa-visitor').status,'closed');assert.equal(messageDeletes,0);
 currentUser={...currentUser,$id:'qa-agent',labels:['sbhagent']};assert.equal((await chatRoute.action({request:req('/admin/chat',{id:'qa-visitor',intent:'trash'})})).init.status,403);
 console.log('PASS chat Trash hides records from normal inbox, restores records, retains messages and enforces roles');
 currentUser={...currentUser,$id:'qa-visitor',labels:[]};conversations.get('qa-visitor').status='deleted';
 const visitorSession=await chat.visitorStorage.getSession();visitorSession.set('secret','fake-visitor-session');const visitorCookie=(await chat.visitorStorage.commitSession(visitorSession)).split(';')[0];
 const state=await visitorRoute.loader({request:req('/api/chat',null,visitorCookie)});assert.equal(state.data.conversation.status,'closed');
 await visitorRoute.action({request:req('/api/chat',{intent:'reopen'},visitorCookie)});assert.equal(conversations.get('qa-visitor').status,'open');
 console.log('PASS visitor can reopen a trashed conversation without losing its history');
} finally {Account.prototype.get=originalGet;await server.close();}
