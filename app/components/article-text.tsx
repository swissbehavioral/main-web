// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./locale";
import { articleLinkParts } from '../lib/article-links';
export function ArticleText({ text }: {
    text: string;
}) { return <><T>{articleLinkParts(text).map((part, i) => part.href ? <a className="article-inline-link" key={i} href={part.href} rel={part.href.startsWith('http') ? 'noopener noreferrer' : undefined}><T>{part.text}</T></a> : <span key={i}><T>{part.text}</T></span>)}</T></>; }
