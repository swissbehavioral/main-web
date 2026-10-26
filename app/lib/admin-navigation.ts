/** Deterministic parents work for direct links and never rely on browser history. */
export function adminBackLink(path:string,search='',kind?:string):{to:string;label:string}|undefined {
 if(path==='/admin' || path==='/admin/')return undefined;
 if(/^\/admin\/content\/[^/]+\/preview\/?$/.test(path))return {to:path.replace(/\/preview\/?$/,''),label:'Back to editor'};
 if(/^\/admin\/content\/[^/]+\/?$/.test(path))return {to:kind==='post'?'/admin/content?view=blog':'/admin/content',label:kind==='post'?'Back to blog articles':'Back to website pages'};
 if(path.startsWith('/admin/leads/'))return {to:'/admin',label:'Back to leads & inquiries'};
 if(path==='/admin/chat'){
  const params=new URLSearchParams(search);
  if(params.has('id')){params.delete('id');return {to:'/admin/chat'+(params.size?'?'+params.toString():''),label:'Back to inbox'};}
 }
 return {to:'/admin',label:'Back to dashboard'};
}
