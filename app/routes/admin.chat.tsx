import { readFormData } from "../lib/security.server";
import { useEffect, useRef } from "react";
import { Form, Link, data, redirect, useFetcher, useRevalidator, useNavigation } from "react-router";
import { requireAdmin, requirePermission } from "../lib/auth.server";
import { listConversations, getConversation, listMessages, canReadConversation, canReplyConversation, sendMessage, updateConversation } from "../lib/chat.server";
import { listStaff, validateAssignee } from "../lib/staff.server";
import { can, canWork } from "../lib/permissions";
import { updateLead } from "../lib/leads.server";
import { sameOrigin, privateHeaders, rateLimit } from "../lib/security.server";
import { isAppwriteConfigured } from "../lib/appwrite.server";
import { useChatUpdates } from "../lib/use-chat-updates";
import type { Route } from "./+types/admin.chat";
export async function loader({request}:Route.LoaderArgs) {
  const identity=await requireAdmin(request), params=new URL(request.url).searchParams;
  const enabled=isAppwriteConfigured();
  const [all,staff]=await Promise.all([enabled?listConversations(identity):[],listStaff()]);
  const status=['open','closed','all','deleted'].includes(params.get('status')||'')?params.get('status')!:'open',q=(params.get('q')||'').toLowerCase();
  const queue=params.get('queue')||'all';
  const conversations=all.filter(c=>(status==='all'?c.status!=='deleted':c.status===status)&&(queue==='mine'?c.assignedTo===identity.id:queue==='unassigned'?!c.assignedTo:true)&&(!q||`${c.name} ${c.email}`.toLowerCase().includes(q)));
  const selected=all.find(c=>c.$id===params.get('id')) || null;
  const messages=selected?await listMessages(selected.$id):[];
  return data({identity,enabled,staff,conversations,selected,messages,status,q,queue,counts:{open:all.filter(c=>c.status==='open').length,closed:all.filter(c=>c.status==='closed').length,deleted:all.filter(c=>c.status==='deleted').length}},{headers:privateHeaders});
}
export async function action({request}:Route.ActionArgs) {
  sameOrigin(request);const identity=await requirePermission(request,'reply');rateLimit(`staff-chat:${identity.id}`,60);
  const form=await readFormData(request),id=String(form.get('id')),intent=String(form.get('intent'));
  const c=await getConversation(id);if(!c||!canReadConversation(identity,c))throw new Response('Conversation not found',{status:404});
  try {
    if(intent==='trash'||intent==='restore'){await requirePermission(request,'delete');await updateConversation(c,{status:intent==='trash'?'deleted':'closed'});return redirect(intent==='trash'?'/admin/chat?status=open':`/admin/chat?status=closed&id=${encodeURIComponent(id)}`);}
    if(c.status==='deleted')return data({error:'Restore this conversation before making changes.'},{status:409});
    if(intent==='assign'||intent==='claim') {
      let assignedTo=String(form.get('assignedTo')||'');
      if(intent==='claim') { if(c.assignedTo && c.assignedTo!==identity.id)return data({error:'This chat has already been assigned. Refresh the inbox.'},{status:409});assignedTo=identity.id; }
      else await requirePermission(request,'assign');
      await validateAssignee(assignedTo);await updateConversation(c,{assignedTo});
      if(c.leadId)await updateLead(c.leadId,{assignedTo});return data({ok:true});
    }
    if(!canReplyConversation(identity,c))throw new Response('Assign this conversation to yourself before replying.',{status:403});
    if(intent==='close'||intent==='reopen'){await updateConversation(c,{status:intent==='close'?'closed':'open'});return data({ok:true});}
    if(intent!=='send')return data({error:'Unknown action.'},{status:400});
    await sendMessage(c,{id:identity.id,name:identity.name||'Admissions team',role:'staff'},String(form.get('body')||''),String(form.get('messageId')||''));return data({ok:true});
  }catch(e){if(e instanceof Response)return data({error:await e.text()},{status:e.status});return data({error:'Could not complete this action. Please retry; your draft has been kept.'},{status:503});}
}
export default function Inbox({loaderData:d,actionData}:Route.ComponentProps){
  const revalidator=useRevalidator(),reply=useFetcher<typeof action>(),form=useRef<HTMLFormElement>(null),end=useRef<HTMLDivElement>(null),messageId=useRef(''),navigation=useNavigation();
  useChatUpdates(d.enabled,'staff',()=>{if(revalidator.state==='idle'&&reply.state==='idle'&&navigation.state==='idle')void revalidator.revalidate();});
  useEffect(()=>{end.current?.scrollIntoView({block:'nearest'});},[d.messages.length,d.selected?.$id]);
  useEffect(()=>{if(reply.state==='idle'&&reply.data&&'ok'in reply.data){form.current?.reset();messageId.current='';}},[reply.state,reply.data]);
  const selected=d.selected,editable=selected&&selected.status!=='deleted'&&canWork(d.identity.role,d.identity.id,selected.assignedTo);
  return <div className="management"><div className="management-heading"><div><h2>Chat inbox</h2><p>Your visitor conversations, assignments and replies in one place.</p></div></div>{!d.enabled&&<p className="management-error">Live chat is temporarily unavailable. Please try again shortly.</p>}
    {actionData&&'error'in actionData&&<p role="alert" className="management-error">{actionData.error}</p>}
    <nav className="workspace-tabs" aria-label="Conversation views">{(['open','closed','deleted'] as const).map(status=><Link key={status} aria-current={d.status===status?'page':undefined} to={`/admin/chat?status=${status}`}>{status==='deleted'?'Trash':status==='open'?'Open':'Closed'} <span>{d.counts[status]}</span></Link>)}</nav>
    <Form method="get" className="chat-filter management-form"><input type="hidden" name="status" value={d.status}/><label>Find a visitor<input name="q" defaultValue={d.q} placeholder="Name or email"/></label><label>Queue<select name="queue" defaultValue={d.queue}><option value="all">Everyone</option><option value="mine">Assigned to me</option><option value="unassigned">Unassigned</option></select></label><button className="admin-button secondary">Search</button></Form>
    <div className="chat-workspace"><aside className="conversation-list" aria-label="Conversations">{d.conversations.map(c=><Link key={c.$id} to={`/admin/chat?id=${c.$id}&status=${d.status}&q=${encodeURIComponent(d.q)}&queue=${d.queue}`} className={c.$id===selected?.$id?'selected':''}><span className="conversation-avatar" aria-hidden="true">{c.name.slice(0,1).toUpperCase()}</span><strong>{c.name}</strong><span>{c.email}</span><small>{c.status==='deleted'?'In Trash':c.status==='closed'?'Closed':c.assignedTo?(d.staff.find(s=>s.id===c.assignedTo)?.name||'Assigned'):'Unassigned'} · {new Date(c.$updatedAt).toLocaleDateString()}</small></Link>)}{!d.conversations.length&&<p className="management-empty">No conversations in this view.</p>}</aside>
    <section className="conversation-detail">{selected?<><header><div><h3>{selected.name}</h3><p>{selected.email} · {selected.status==='deleted'?'In Trash':selected.status}</p>{selected.leadId&&<Link to={`/admin/leads/${selected.leadId}`}>Open related lead →</Link>}</div>
      {selected.status!=='deleted'&&can(d.identity.role,'reply')&&<Form method="post"><input type="hidden" name="id" value={selected.$id}/>{!selected.assignedTo&&<button className="admin-button secondary" name="intent" value="claim">Assign to me</button>}{editable&&<button className="admin-button secondary" name="intent" value={selected.status==='open'?'close':'reopen'}>{selected.status==='open'?'Close conversation':'Reopen conversation'}</button>}</Form>}</header>
      {selected.status!=='deleted'&&can(d.identity.role,'assign')&&<Form method="post" className="chat-assignment"><input type="hidden" name="id" value={selected.$id}/><label>Representative<select name="assignedTo" key={`${selected.$id}:${selected.assignedTo}`} defaultValue={selected.assignedTo}><option value="">Unassigned</option>{d.staff.filter(s=>s.active&&s.role!=='viewer').map(s=><option key={s.id} value={s.id}>{s.name||s.email}</option>)}</select></label><button className="admin-button secondary" name="intent" value="assign">Assign</button></Form>}
      {can(d.identity.role,'delete')&&<details className="chat-organize"><summary>Conversation options</summary><p>{selected.status==='deleted'?'Restore this conversation to the closed inbox.':'Move this conversation to Trash to clear it from the inbox. Messages are retained and can be restored.'}</p><Form method="post"><input type="hidden" name="id" value={selected.$id}/><button className="admin-button secondary" name="intent" value={selected.status==='deleted'?'restore':'trash'}>{selected.status==='deleted'?'Restore conversation':'Move to Trash'}</button></Form></details>}
      <div className="inbox-messages" role="log" aria-live="polite" aria-relevant="additions">{!d.messages.length&&<p className="management-empty">The visitor has opened a conversation. You can send a welcome message.</p>}{d.messages.map(m=><article key={m.$id} className={`chat-bubble ${m.senderRole==='visitor'?'from-visitor':'from-staff'}`}><strong>{m.senderName}</strong><p>{m.body}</p><time>{new Date(m.$createdAt).toLocaleString()}</time></article>)}<div ref={end}/></div>
      {reply.data&&'error'in reply.data&&<p role="alert" className="management-error">{reply.data.error}</p>}
      {editable&&selected.status==='open'?<reply.Form ref={form} key={selected.$id} method="post" className="inbox-compose" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(!messageId.current)messageId.current=crypto.randomUUID();f.set('messageId',messageId.current);void reply.submit(f,{method:'post'});}}><input type="hidden" name="id" value={selected.$id}/><input type="hidden" name="intent" value="send"/><label htmlFor="reply-body">Reply to {selected.name}</label><textarea id="reply-body" name="body" required maxLength={4000} rows={3} onChange={()=>{messageId.current='';}} disabled={reply.state!=='idle'} placeholder="Write a reply…"/><button className="admin-button" disabled={reply.state!=='idle'}>{reply.state==='idle'?'Send reply':'Sending…'}</button></reply.Form>:<p className="management-empty">{selected.status==='deleted'?'This conversation is in Trash. Restore it to continue.':selected.status==='closed'?'Reopen this conversation to send a reply.':d.identity.role==='viewer'?'You have read-only access.':'Assign this conversation to yourself to reply.'}</p>}</>:<p className="management-empty">Select a conversation to view its messages.</p>}</section></div></div>;
}
