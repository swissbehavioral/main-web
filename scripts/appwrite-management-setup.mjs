import { Client, Databases, Users, Query } from 'node-appwrite';
const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_API_KEY);
const db = new Databases(client), users = new Users(client);
const databaseId = process.env.APPWRITE_DATABASE_ID || 'sbh';
async function collection(id, attributes, indexes = [], security = false) {
  try { await db.getCollection({databaseId,collectionId:id}); } catch(e) { if(e.code !== 404) throw e; await db.createCollection({databaseId,collectionId:id,name:id,permissions:[],documentSecurity:security}); }
  const existing = await db.listAttributes({databaseId,collectionId:id,queries:[Query.limit(100)]});
  for (const [key,size] of attributes) {
    if (existing.attributes.some(a=>a.key === key)) continue;
    await db.createStringAttribute({databaseId,collectionId:id,key,size,required:false,xdefault:''});
    console.log(`Created ${id}.${key}`);
  }
  for(let i=0;i<60;i++) {
    const all=await db.listAttributes({databaseId,collectionId:id,queries:[Query.limit(100)]});
    if(all.attributes.some(a=>a.status === 'failed')) throw new Error(`Attribute failed in ${id}`);
    if(all.attributes.every(a=>a.status === 'available')) break;
    if(i===59) throw new Error(`Attributes not ready in ${id}`);
    await new Promise(r=>setTimeout(r,1000));
  }
  const found=await db.listIndexes({databaseId,collectionId:id});
  for(const key of indexes) if(!found.indexes.some(i=>i.key === `idx_${key}`)) await db.createIndex({databaseId,collectionId:id,key:`idx_${key}`,type:'key',attributes:[key]});
  for(let i=0;i<60;i++) { const all=await db.listIndexes({databaseId,collectionId:id}); if(all.indexes.every(a=>a.status==='available')) break; if(all.indexes.some(a=>a.status==='failed')||i===59) throw new Error(`Index failed ${id}`); await new Promise(r=>setTimeout(r,1000)); }
  console.log(`Ready: ${id}`);
}
await collection(process.env.APPWRITE_LEADS_COLLECTION_ID || 'leads', [['assignedTo',36],['verificationStatus',32],['deletedAt',40],['deletedBy',36]]);
await collection('conversations', [['visitorId',36],['name',128],['email',254],['leadId',36],['status',16],['assignedTo',36]], ['visitorId'], true);
await collection('messages', [['conversationId',36],['senderId',36],['senderName',128],['senderRole',16],['body',4000]], ['conversationId'], true);
await collection('chat_events', [['revision',40]], [], true);
// Explicit bootstrap identity, never promote all project users or anonymous visitors.
const ownerEmail=process.env.APPWRITE_OWNER_EMAIL || 'marketing@swissbehavioralhealth.com';
const owners=await users.list({queries:[Query.equal('email',[ownerEmail])]});
if(owners.total !== 1) throw new Error('Set APPWRITE_OWNER_EMAIL to the existing administrator email.');
const owner=owners.users[0];
if(!owner.labels.includes('sbhadmin')) await users.updateLabels({userId:owner.$id,labels:[...owner.labels.filter(l=>!l.startsWith('sbh')),'sbhadmin']});
console.log('Existing owner has administrator access. Management schema ready.');
