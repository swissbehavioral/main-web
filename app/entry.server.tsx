import { createNonce, securityHeaders } from "./lib/http-security.server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

export const streamTimeout = 5_000;
/** Web Streams SSR works in both Node 24 and Cloudflare Workers. */
export default async function handleRequest(
 request: Request,
 responseStatusCode: number,
 responseHeaders: Headers,
 routerContext: EntryContext,
 loadContext: AppLoadContext,
) {
 const nonce=typeof loadContext.cspNonce==='string'?loadContext.cspNonce:createNonce();
 if(!loadContext.securityApplied)for(const [key,value] of Object.entries(securityHeaders(request.url,nonce)))responseHeaders.set(key,value);
 responseHeaders.set('Content-Type','text/html; charset=utf-8');
 if(request.method.toUpperCase()==='HEAD')return new Response(null,{status:responseStatusCode,headers:responseHeaders});
 const body=await renderToReadableStream(<ServerRouter context={routerContext} url={request.url} nonce={nonce}/>,{
  nonce,
  signal:AbortSignal.timeout(streamTimeout+1000),
  onError(){responseStatusCode=500;console.error('[render] Response rendering failed');},
 });
 if(isbot(request.headers.get('user-agent')||'')||routerContext.isSpaMode)await body.allReady;
 return new Response(body,{status:responseStatusCode,headers:responseHeaders});
}
