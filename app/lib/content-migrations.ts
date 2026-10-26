import type {ContentDocument} from './content.types';
/** Add only the newly restored slots to the exact previous page schema.
 * Existing edits, publication status and stored records are never overwritten.
 */
const previousLengths:Record<string,number>={'page-home':43,'page-about':13,'page-team':14,'page-treatment':20};
export function appendRestoredSections(doc:ContentDocument,seed:ContentDocument|undefined):ContentDocument {
 if(!seed || doc.id!==seed.id || doc.body.length!==previousLengths[doc.id] || seed.body.length<=doc.body.length)return doc;
 if(doc.body.some((block,i)=>block.type!==seed.body[i]?.type || (block.slot && block.slot!==`${doc.id}:${i}`)))return doc;
 return {...doc,body:[...doc.body,...structuredClone(seed.body.slice(doc.body.length))]};
}
