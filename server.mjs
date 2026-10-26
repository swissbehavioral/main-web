import express from 'express';
import {createRequestHandler} from '@react-router/express';
import {createNonce,securityHeaders,productionConfigurationErrors} from './app/lib/http-security.server.ts';
const production=process.env.NODE_ENV!=='development';
if(production){process.env.NODE_ENV='production';const errors=productionConfigurationErrors(process.env);if(errors.length)throw new Error(errors.join(' '));}
const app=express();app.disable('x-powered-by');
// React Router appends response headers; avoid repeating identical policy values.
app.use((_req,res,next)=>{const append=res.append.bind(res);res.append=(name,value)=>{if(res.getHeader(name)===value)return res;return append(name,value);};next();});
if(process.env.TRUST_PROXY)app.set('trust proxy',process.env.TRUST_PROXY);
const canonical=new URL(process.env.PUBLIC_ORIGIN||'https://www.swissbehavioralhealth.com');
if(production&&canonical.protocol!=='https:'&&!['127.0.0.1','localhost'].includes(canonical.hostname))throw new Error('PUBLIC_ORIGIN must use HTTPS.');
const attempts=new Map();
app.use((req,res,next)=>{
 const nonce=createNonce();res.locals.cspNonce=nonce;
 const url=new URL(req.originalUrl,`${req.protocol}://${req.get('host')}`);
 for(const [key,value]of Object.entries(securityHeaders(url.href,nonce,production)))res.setHeader(key,value);
 if(production && !['127.0.0.1','localhost'].includes(canonical.hostname) && (req.protocol!=='https:'||req.hostname!==canonical.hostname))return res.redirect(308,canonical.origin + url.pathname + url.search);
 if(Number(req.headers['content-length'])>1_048_576)return res.status(413).send('This submission is too large.');
 if(req.method==='POST'&&(req.path==='/admin/login'||req.path==='/api/lead'||req.path==='/api/chat')){
  const now=Date.now(), key=`${req.path}:${req.ip}`;let item=attempts.get(key);if(!item||item.until<now)item={count:0,until:now+60000};attempts.set(key,item);
  if(attempts.size>10000)for(const [k,v]of attempts)if(v.until<now)attempts.delete(k);
  const limit=req.path==='/admin/login'?10:req.path==='/api/lead'?20:90;
  if(++item.count>limit){res.setHeader('Retry-After','60');return res.status(429).send('Too many requests. Please wait and try again.');}
 }
 next();
});
app.use('/assets',express.static('build/client/assets',{immutable:true,maxAge:'1y',dotfiles:'deny'}));
app.use(express.static('build/client',{maxAge:'1h',dotfiles:'deny',index:false}));
const build=await import('./build/server/index.js');
app.all('*',createRequestHandler({build,mode:production?'production':'development',getLoadContext:(_req,res)=>({cspNonce:res.locals.cspNonce,securityApplied:true})}));
app.use((error,_req,res,_next)=>{console.error('[server] Request failed',{code:error?.code||'request_error'});if(!res.headersSent)res.status(500).send('The service is temporarily unavailable. Please try again.');});
const server=app.listen(Number(process.env.PORT||3000),process.env.HOST||'127.0.0.1',()=>console.log(`SBH server ready on port ${process.env.PORT||3000}`));
server.requestTimeout=30000;server.headersTimeout=15000;
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
