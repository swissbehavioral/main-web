import { randomBytes } from 'node:crypto';
export const createNonce = () => randomBytes(24).toString('base64');
export function securityHeaders(url: string, nonce: string, production = process.env.NODE_ENV === 'production', endpoint = process.env.APPWRITE_ENDPOINT || '') {
 const origin = new URL(url);
 let backend='';try {const u=new URL(endpoint);if(u.protocol==='https:' || (!production && u.protocol==='http:')) backend=` ${u.origin} ${u.origin.replace(/^http/,'ws')}`;}catch{}
 const script=production?`'self' 'nonce-${nonce}'`:"'self' 'unsafe-inline' 'unsafe-eval'";
 const headers:Record<string,string>={
  'Content-Security-Policy':`default-src 'self'; script-src ${script}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:${backend.split(' ').filter(s=>s.startsWith('https:')).map(s=>' '+s).join('')}; font-src 'self'; connect-src 'self'${backend}${production?'':' ws://localhost:* ws://127.0.0.1:*'}; frame-src https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'${production && origin.protocol==='https:'?'; upgrade-insecure-requests':''}`,
  'X-Content-Type-Options':'nosniff', 'X-Frame-Options':'DENY', 'Referrer-Policy':'no-referrer',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy':'same-origin',
 };
 if(production && origin.protocol==='https:') headers['Strict-Transport-Security']='max-age=31536000';
 if(/^\/(admin|api)(\/|$)/.test(origin.pathname)) {headers['Cache-Control']='no-store, private';headers['X-Robots-Tag']='noindex, nofollow, noarchive';}
 return headers;
}
export function productionConfigurationErrors(env:Record<string,string|undefined>) {
 const errors:string[]=[];
 if(!env.SESSION_SECRET || env.SESSION_SECRET.length<32 || /^(change-me|sbh-admin)/i.test(env.SESSION_SECRET))errors.push('A strong SESSION_SECRET of at least 32 characters is required.');
 if(!env.APPWRITE_PROJECT_ID || !env.APPWRITE_API_KEY || !env.APPWRITE_ENDPOINT?.startsWith('https://'))errors.push('An HTTPS Appwrite backend is required.');
 if(env.APPWRITE_AUTH_ENABLED!=='true')errors.push('Individual Appwrite staff authentication is required.');
 return errors;
}
/** Bounded streaming read: limits chunked requests as well as Content-Length. */
export async function readFormData(request:Request) {
 const limit=new URL(request.url).pathname.startsWith('/admin/content')?1_048_576:32_768;
 if(Number(request.headers.get('Content-Length'))>limit)throw new Response('This submission is too large.',{status:413});
 const reader=request.body?.getReader();
 if(!reader)return new FormData();
 const chunks:Uint8Array[]=[];let size=0;
 for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new Response('This submission is too large.',{status:413});}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 return new Response(bytes,{headers:{'Content-Type':request.headers.get('Content-Type')||'application/x-www-form-urlencoded'}}).formData();
}
