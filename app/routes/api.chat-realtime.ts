import { readFormData } from "../lib/security.server";
import { data } from "react-router";
import { getAdminIdentity, getAdminSession } from "../lib/auth.server";
import { appwriteConfig } from "../lib/appwrite.server";
import { getVisitor } from "../lib/chat.server";
import { sameOrigin, privateHeaders } from "../lib/security.server";
import type { Route } from "./+types/api.chat-realtime";
export async function action({request}:Route.ActionArgs) {
  sameOrigin(request);
  const form=await readFormData(request),staff=form.get('mode')==='staff';
  let secret:string|undefined,channel:string;
  if(staff){const identity=await getAdminIdentity(request);if(!identity||identity.provider!=='appwrite')return data({error:'Sign in to connect.'},{status:401,headers:privateHeaders});secret=(await getAdminSession(request)).get('secret');channel=`databases.${appwriteConfig.databaseId}.collections.chat_events.documents`;}
  else {const visitor=await getVisitor(request);if(!visitor)return data({error:'Start a chat session first.'},{status:401,headers:privateHeaders});secret=visitor.secret;channel=`databases.${appwriteConfig.databaseId}.collections.chat_events.documents.${visitor.id}`;}
  return data({endpoint:appwriteConfig.endpoint,projectId:appwriteConfig.projectId,secret,channel},{headers:privateHeaders});
}
export function loader(){return new Response('Use POST',{status:405});}
