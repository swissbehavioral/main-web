import { readFormData } from "../lib/security.server";
import { data } from "react-router";
import { createVisitor, getVisitor, getConversation, listMessages, startConversation, sendMessage, updateConversation } from "../lib/chat.server";
import { sameOrigin, privateHeaders, rateLimit } from "../lib/security.server";
import { isEmail } from "../lib/validation";
import type { Route } from "./+types/api.chat";
export async function loader({request}:Route.LoaderArgs) {
  try {
    const visitor=await getVisitor(request);if(!visitor)return data({initialized:false,conversation:null,messages:[]},{headers:privateHeaders});
    const c=await getConversation(visitor.id);
    return data({initialized:true,conversation:c?{id:c.$id,name:c.name,status:c.status==='deleted'?'closed':c.status}:null,messages:c?(await listMessages(c.$id)).map(m=>({id:m.$id,body:m.body,senderName:m.senderName,senderRole:m.senderRole,createdAt:m.$createdAt})):[]},{headers:privateHeaders});
  } catch {return data({error:'Chat is temporarily unavailable. Please call admissions.'},{status:503,headers:privateHeaders});}
}
export async function action({request}:Route.ActionArgs) {
  sameOrigin(request);
  try {
    const form=await readFormData(request),intent=String(form.get('intent'));
    let visitor=await getVisitor(request);
    if(intent==='initialize') {
      if(visitor)return data({ok:true},{headers:privateHeaders});
      // Global instance guard for unauthenticated account creation; production edge limits should supplement it.
      rateLimit('chat-initialize',100,60000);
      const result=await createVisitor();return data({ok:true},{headers:{...privateHeaders,'Set-Cookie':result.cookie}});
    }
    if(!visitor)return data({error:'Your chat session expired. Close and reopen chat to reconnect.'},{status:401,headers:privateHeaders});
    rateLimit(`chat:${visitor.id}`,30,60000);
    if(intent==='start') {
      const name=String(form.get('name')||'').trim(),email=String(form.get('email')||'').trim();
      if(name.length<2||name.length>128||!isEmail(email)||email.length>254||form.get('consent')!=='on')return data({error:'Enter your name, a valid email, and confirm your consent.'},{status:400,headers:privateHeaders});
      await startConversation(visitor.id,name,email);return data({ok:true},{headers:privateHeaders});
    }
    const c=await getConversation(visitor.id);if(!c||c.visitorId!==visitor.id)return data({error:'Conversation not found.'},{status:404,headers:privateHeaders});
    if(intent==='reopen'){await updateConversation(c,{status:'open'});return data({ok:true},{headers:privateHeaders});}
    if(intent!=='send')return data({error:'Unknown action.'},{status:400,headers:privateHeaders});
    await sendMessage(c,{id:visitor.id,name:c.name,role:'visitor'},String(form.get('body')||''),String(form.get('messageId')||''));
    return data({ok:true},{headers:privateHeaders});
  } catch(e) {if(e instanceof Response)return data({error:await e.text()},{status:e.status,headers:privateHeaders});console.error('[chat] Request failed', (e as {code?:number}).code);return data({error:'Unable to complete this request. Your message has not been cleared; try again.'},{status:503,headers:privateHeaders});}
}
