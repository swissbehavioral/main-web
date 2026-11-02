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

const insurancePolicyUpdates:Record<string,string>={"Insurance requests: contact details, insurer name and your permission to contact you. The current form does not request an insurance member ID.": "Insurance requests: contact details, patient name and date of birth, relationship to the patient, insurer, optional policyholder details, member or subscriber ID, group number, plan type and insurer phone number, together with your authorization for a coverage review. Structured patient and policy details are encrypted in storage and accessible to authorized staff; they are excluded from routine CSV exports and notifications.", "Use forms and chat for general inquiries. Please do not send medical records, diagnoses, medication lists, Social Security numbers, payment card information or insurance member IDs. Ask admissions for an appropriate way to share documents. If you include health details anyway, they are received and stored with your inquiry; this warning does not remove protections that may apply to that information.": "Use the dedicated insurance verification form for the patient and policy details requested there. Do not put insurance identifiers in general inquiry forms or chat. Do not send medical records, diagnoses, medication lists, Social Security numbers or payment card information through any website form. Ask admissions for an appropriate way to share documents. Any health information received with your inquiry is stored with the request and remains subject to applicable protections."};
insurancePolicyUpdates["sbh_admin_session \u2014 first-party, HttpOnly staff authentication cookie lasting up to 8 hours. It is used for staff sign-in, not ordinary browsing."]="sbh_admin_session \u2014 first-party, HttpOnly staff authentication cookie lasting up to 8 hours. It is used for staff sign-in, not ordinary browsing.\nsbh-alerts:* \u2014 staff notification preferences, unread record references and acknowledgment timestamps stored in this browser profile. They do not contain message bodies, dates of birth or insurance identifiers. Desktop alerts are optional and require browser permission.";
export function updateInsurancePolicy(doc:ContentDocument):ContentDocument {
 if(doc.id!=="page-privacy")return doc;
 return {...doc,body:doc.body.map(block=>({...block,text:block.text.split("\n").map(line=>insurancePolicyUpdates[line]||line).join("\n")}))};
}
