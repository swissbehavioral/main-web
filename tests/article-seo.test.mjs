import test from 'node:test';
import assert from 'node:assert/strict';
import {safeArticleUrl,articleLinkParts} from '../app/lib/article-links.ts';
import {contentMeta} from '../app/lib/content-meta.ts';
test('Article links allow web URLs and reject executable or credential-bearing URLs',()=>{
 assert.equal(safeArticleUrl('javascript:alert(1)'),null);assert.equal(safeArticleUrl('//evil.example'),null);assert.equal(safeArticleUrl('https://user:secret@example.com'),null);
 assert.equal(safeArticleUrl('/insurance'),'/insurance');assert.equal(safeArticleUrl('https://example.com/help'),'https://example.com/help');
 assert.deepEqual(articleLinkParts('Read [more](https://example.com) now'),[{text:'Read '},{text:'more',href:'https://example.com/'},{text:' now'}]);
 assert.deepEqual(articleLinkParts('[bad](javascript:alert)'),[{text:'[bad](javascript:alert)'}]);
});
test('Published SEO uses explicit title and description, with canonical and social metadata',()=>{
 const tags=contentMeta({title:'Visible article',seoTitle:'Search title',kind:'post',path:'/resources/an-article',summary:'Excerpt',metaDescription:'Search description',reviewRequired:false});
 assert(tags.some(t=>t.title==='Search title'));assert(tags.some(t=>t.name==='description'&&t.content==='Search description'));assert(tags.some(t=>t.rel==='canonical'&&t.href==='https://www.swissbehavioralhealth.com/resources/an-article'));assert(tags.some(t=>t.name==='twitter:title'&&t.content==='Search title'));assert(tags.some(t=>t.property==='og:type'&&t.content==='article'));
});
