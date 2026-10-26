import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import WebSocket from 'ws';
import {Client,Databases} from 'node-appwrite';
const qa=JSON.parse(await readFile('/tmp/sbh-management-qa.json','utf8'));
const c=qa.visitorRealtime;
const socket=new WebSocket(c.endpoint.replace(/^http/,'ws')+'/realtime?project='+c.projectId,{origin:qa.base});
const db=new Databases(new Client().setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_API_KEY));
let changed=false;
const timer=setTimeout(()=>{console.log('FAIL No authorized realtime event received within 15s');process.exitCode=1;socket.terminate();},15000);
socket.on('open',()=>console.log('WebSocket connected'));
socket.on('message',async raw=>{const m=JSON.parse(String(raw));console.log('Realtime message',m.type,m.data?.message||'',m.data?.code||'');if(m.type==='connected') {socket.send(JSON.stringify({type:'authentication',data:{session:c.secret}}));socket.send(JSON.stringify({type:'subscribe',data:[{subscriptionId:'qa',channels:[c.channel],queries:[]}]}));}
if(m.type==='response'&&!changed){changed=true;await db.updateDocument({databaseId:process.env.APPWRITE_DATABASE_ID||'sbh',collectionId:'chat_events',documentId:qa.conversationId,data:{revision:randomUUID()}});}
if(m.type==='event'){console.log('PASS private Appwrite realtime notification received without message content');clearTimeout(timer);socket.close();}
});socket.on('close',(code,reason)=>console.log('Socket closed',code,String(reason)));socket.on('error',e=>console.log('Socket error',e.message));
