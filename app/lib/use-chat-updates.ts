import { useEffect, useRef } from "react";
/** Realtime invalidates server-authorized reads; periodic reconciliation recovers missed/reconnected events. */
export function useChatUpdates(enabled:boolean,mode:'visitor'|'staff',refresh:()=>void) {
  const refreshRef=useRef(refresh);refreshRef.current=refresh;
  useEffect(()=>{
    if(!enabled)return;
    let disposed=false,unsubscribe:(()=>void)|undefined;
    const controller=new AbortController();
    const tick=()=>{if(document.visibilityState==='visible')refreshRef.current();};
    async function connect(){
      try {
        const form=new FormData();form.set('mode',mode);
        const response=await fetch('/api/chat/realtime',{method:'POST',body:form,signal:controller.signal});if(!response.ok)return;
        const config=await response.json();const {Client}=await import('appwrite');if(disposed)return;
        const client=new Client().setEndpoint(config.endpoint).setProject(config.projectId).setSession(config.secret);
        unsubscribe=client.subscribe(config.channel,()=>refreshRef.current());
      }catch { /* Reconciliation remains available while the realtime service reconnects. */ }
    }
    void connect();
    const interval=setInterval(tick,10000);
    document.addEventListener('visibilitychange',tick);window.addEventListener('online',tick);
    return ()=>{disposed=true;controller.abort();unsubscribe?.();clearInterval(interval);document.removeEventListener('visibilitychange',tick);window.removeEventListener('online',tick);};
  },[enabled,mode]);
}
