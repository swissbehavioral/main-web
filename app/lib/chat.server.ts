import { randomUUID } from "node:crypto";
import { Account, Permission, Role, type Models } from "node-appwrite";
import { createCookieSessionStorage } from "react-router";
import { appwriteConfig, getDatabases, getUsers, createUserClient, ID, Query, isAppwriteConfigured } from "./appwrite.server";
import { sessionSecret } from "./security.server";
import { createLead } from "./leads.server";
import { STAFF_ROLES, canWork } from "./permissions";
import type { AdminIdentity } from "./auth.server";
export interface Conversation extends Models.Document { visitorId: string; name: string; email: string; leadId: string; status: string; assignedTo: string; }
export interface ChatMessage extends Models.Document { conversationId: string; senderId: string; senderName: string; senderRole: string; body: string; }
export const visitorStorage = createCookieSessionStorage({cookie:{name:'sbh_chat_session',httpOnly:true,path:'/',sameSite:'lax',secure:process.env.NODE_ENV==='production',secrets:[sessionSecret],maxAge:604800}});
export async function getVisitor(request:Request) {
  const cookie=await visitorStorage.getSession(request.headers.get('Cookie'));
  const secret=cookie.get('secret'); if(!secret) return null;
  try { const user=await new Account(createUserClient().setSession(secret)).get();return {id:user.$id,secret}; }
  catch(e) { if([401,403,404].includes((e as {code:number}).code)) return null;throw e; }
}
export async function createVisitor() {
  if(!isAppwriteConfigured()) throw new Response('Chat is unavailable. Please call admissions.',{status:503});
  const user=await getUsers().create({userId:ID.unique()});
  try {
    const session=await getUsers().createSession({userId:user.$id});
    const cookie=await visitorStorage.getSession();cookie.set('secret',session.secret);
    return {cookie:await visitorStorage.commitSession(cookie),id:user.$id};
  } catch(e) { await getUsers().delete({userId:user.$id});throw e; }
}
const dbid=appwriteConfig.databaseId;
export async function getConversation(id:string):Promise<Conversation|undefined> {
  try { return await getDatabases().getDocument<Conversation>({databaseId:dbid,collectionId:'conversations',documentId:id}); }
  catch(e) {if((e as {code:number}).code===404)return;throw e;}
}
async function listAll<T extends Models.Document>(collectionId:string, queries:string[]=[]) {
  const all:T[]=[];let cursor:string|undefined;
  for(;;){const page=await getDatabases().listDocuments<T>({databaseId:dbid,collectionId,queries:[...queries,Query.orderAsc('$createdAt'),Query.limit(100),...(cursor?[Query.cursorAfter(cursor)]:[])]});all.push(...page.documents);if(page.documents.length<100)break;cursor=page.documents.at(-1)!.$id;}
  return all;
}
export async function listConversations(user:AdminIdentity) {
  const all=await listAll<Conversation>('conversations');
  return all.filter(c=>canReadConversation(user,c)).sort((a,b)=>b.$updatedAt.localeCompare(a.$updatedAt));
}
export const canReadConversation=(user:AdminIdentity,c:Conversation)=>user.role!=='agent'||!c.assignedTo||c.assignedTo===user.id;
export const canReplyConversation=(user:AdminIdentity,c:Conversation)=>canWork(user.role,user.id,c.assignedTo);
export const listMessages=(id:string)=>listAll<ChatMessage>('messages',[Query.equal('conversationId',[id])]);
// Realtime publishes only a random change marker. Message bodies and visitor details
// are read through server routes that recheck roles and ownership on every request.
export async function signalConversation(c:Conversation) {
  const permissions=[Permission.read(Role.user(c.visitorId)),...STAFF_ROLES.map(r=>Permission.read(Role.label(`sbh${r}`)))];
  try { await getDatabases().updateDocument({databaseId:dbid,collectionId:'chat_events',documentId:c.$id,data:{revision:randomUUID()},permissions}); }
  catch(e) { if((e as {code:number}).code!==404) throw e; await getDatabases().createDocument({databaseId:dbid,collectionId:'chat_events',documentId:c.$id,data:{revision:randomUUID()},permissions}); }
}
export async function startConversation(visitorId:string,name:string,email:string) {
  const existing=await getConversation(visitorId);if(existing)return existing;
  // The visitor ID is also the unique conversation ID, so retrying cannot create duplicate threads.
  let c:Conversation;
  try { c=await getDatabases().createDocument<Conversation>({databaseId:dbid,collectionId:'conversations',documentId:visitorId,data:{visitorId,name,email,status:'open',assignedTo:'',leadId:''},permissions:[]}); }
  catch(e) {if((e as {code:number}).code===409)return (await getConversation(visitorId))!;throw e;}
  const lead=await createLead({kind:'chat',name,email,consent:true,source:'/chat',message:'Live chat conversation. See the chat inbox for messages.'});
  c=await getDatabases().updateDocument<Conversation>({databaseId:dbid,collectionId:'conversations',documentId:c.$id,data:{leadId:lead.id}});
  await signalConversation(c);return c;
}
export async function updateConversation(c:Conversation,patch:{status?:string;assignedTo?:string}) {
  const updated=await getDatabases().updateDocument<Conversation>({databaseId:dbid,collectionId:'conversations',documentId:c.$id,data:patch});
  await signalConversation(updated);return updated;
}
export async function sendMessage(c:Conversation,sender:{id:string;name:string;role:string},body:string,messageId:string) {
  if(!body.trim()||body.length>4000||!/^[-a-zA-Z0-9_]{1,36}$/.test(messageId)) throw new Response('Enter a message of 1–4,000 characters.',{status:400});
  if(c.status!=='open') throw new Response('This conversation is closed. Reopen it before sending.',{status:409});
  try { await getDatabases().createDocument({databaseId:dbid,collectionId:'messages',documentId:messageId,data:{conversationId:c.$id,senderId:sender.id,senderName:sender.name.slice(0,128),senderRole:sender.role,body:body.trim()},permissions:[]}); }
  catch(e) {if((e as {code:number}).code!==409)throw e;const previous=await getDatabases().getDocument<ChatMessage>({databaseId:dbid,collectionId:'messages',documentId:messageId});if(previous.conversationId!==c.$id||previous.senderId!==sender.id||previous.body!==body.trim())throw new Response('Message identifier conflict',{status:409});}
  // Saving a message is authoritative. A missed signal is recovered by reconciliation polling.
  try { await updateConversation(c,{status:'open'}); } catch { console.error('[chat] Message stored; realtime signal delayed.'); }
}
