import { createRequestHandler } from 'react-router';
import { createNonce, securityHeaders, productionConfigurationErrors } from '../app/lib/http-security.server.ts';

let handler;
const attempts = new Map();
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const nonce = createNonce();
    const headers = securityHeaders(request.url, nonce, true);
    // Validate before importing server modules that require a production session key.
    const configurationErrors = productionConfigurationErrors(process.env);
    if (configurationErrors.length) {
      console.error('[worker] Configuration incomplete:', configurationErrors.join(' '));
      return new Response('The service is being configured. Please try again shortly.', {status:503,headers:{...headers,'Cache-Control':'no-store','Content-Type':'text/plain; charset=utf-8'}});
    }
    if (Number(request.headers.get('content-length')) > 1_048_576) {
      return new Response('This submission is too large.',{status:413,headers});
    }
    if (request.method === 'POST' && ['/admin/login','/api/lead','/api/chat'].includes(url.pathname)) {
      const now=Date.now(),key=url.pathname+':'+(request.headers.get('CF-Connecting-IP')||'local');
      let item=attempts.get(key);
      if(!item || item.until < now)item={count:0,until:now+60000};
      attempts.set(key,item);
      if(attempts.size>10000)for(const [id,value] of attempts)if(value.until<now)attempts.delete(id);
      const limit=url.pathname==='/admin/login'?10:url.pathname==='/api/lead'?20:90;
      if(++item.count>limit)return new Response('Too many requests. Please wait and try again.',{status:429,headers:{...headers,'Retry-After':'60'}});
    }
    try {
      // Lazy import gives missing settings a controlled 503 rather than a startup 1101.
      handler ||= createRequestHandler(await import('../build/server/index.js'), 'production');
      const response=await handler(request,{cspNonce:nonce,securityApplied:true});
      const secured=new Response(response.body,response);
      for(const [key,value] of Object.entries(headers))secured.headers.set(key,value);
      return secured;
    } catch(error) {
      // Log a stack for Workers Observability, never environment values or request bodies.
      console.error('[worker] Request failed',error instanceof Error ? error.stack : 'Unknown error');
      return new Response('The service is temporarily unavailable. Please try again.',{status:500,headers:{...headers,'Cache-Control':'no-store'}});
    }
  }
};
