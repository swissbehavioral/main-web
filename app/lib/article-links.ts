export function safeArticleUrl(value: string) {
  if (/^\/(?!\/)[^\s\\]*$/.test(value)) return value;
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function articleLinkParts(text: string) {
  const result: {text:string;href?:string}[]=[];const pattern=/\[([^\]\n]+)\]\(([^\s)]+)\)/g;let start=0;
  for(const match of text.matchAll(pattern)){const href=safeArticleUrl(match[2]);if(!href)continue;if(match.index!>start)result.push({text:text.slice(start,match.index)});result.push({text:match[1],href});start=match.index!+match[0].length;}
  if(start<text.length)result.push({text:text.slice(start)});return result;
}
