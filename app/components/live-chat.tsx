// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import { useChatUpdates } from "../lib/use-chat-updates";
import { IconMessageCircle, IconX } from "./icons";
export const OPEN_CHAT_EVENT = "sbh:open-chat";
export function openLiveChat() { if (typeof window !== 'undefined')
    window.dispatchEvent(new Event(OPEN_CHAT_EVENT)); }
interface Message {
    id: string;
    body: string;
    senderName: string;
    senderRole: string;
    createdAt: string;
}
interface State {
    initialized: boolean;
    conversation: null | {
        id: string;
        name: string;
        status: string;
    };
    messages: Message[];
}
export function LiveChat() {
    const translate = useTranslate();
    const [open, setOpen] = useState(false), [state, setState] = useState<State>({ initialized: false, conversation: null, messages: [] }), [busy, setBusy] = useState(false), [error, setError] = useState(''), [body, setBody] = useState('');
    const end = useRef<HTMLDivElement>(null), launcher = useRef<HTMLButtonElement>(null), panel = useRef<HTMLElement>(null), pendingId = useRef(''), refreshing = useRef(false);
    async function refresh() { if (refreshing.current)
        return; refreshing.current = true; try {
        const r = await fetch('/api/chat', { cache: 'no-store' });
        const result = await r.json();
        if (!r.ok)
            throw new Error(result.error);
        setState(result);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to refresh chat.');
    }
    finally {
        refreshing.current = false;
    } }
    useChatUpdates(open && state.initialized, 'visitor', () => { void refresh(); });
    useEffect(() => { const show = () => setOpen(true); window.addEventListener(OPEN_CHAT_EVENT, show); return () => window.removeEventListener(OPEN_CHAT_EVENT, show); }, []);
    useEffect(() => { if (!open)
        return; let active = true; setError(''); void (async () => { try {
        const form = new FormData();
        form.set('intent', 'initialize');
        const r = await fetch('/api/chat', { method: 'POST', body: form });
        if (!r.ok) {
            const result = await r.json();
            throw new Error(result.error);
        }
        if (active)
            await refresh();
    }
    catch (e) {
        if (active)
            setError(e instanceof Error ? e.message : 'Chat unavailable.');
    } })(); panel.current?.focus(); const key = (e: KeyboardEvent) => { if (e.key === 'Escape') {
        setOpen(false);
        launcher.current?.focus();
    } }; window.addEventListener('keydown', key); return () => { active = false; window.removeEventListener('keydown', key); }; }, [open]);
    useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [state.messages.length, open]);
    async function submit(form: FormData) { if (busy)
        return; setBusy(true); setError(''); const isMessage = form.get('intent') === 'send'; if (isMessage) {
        if (!pendingId.current)
            pendingId.current = crypto.randomUUID();
        form.set('messageId', pendingId.current);
    } try {
        const r = await fetch('/api/chat', { method: 'POST', body: form });
        const result = await r.json();
        if (!r.ok)
            throw new Error(result.error);
        if (isMessage) {
            setBody('');
            pendingId.current = '';
        }
        await refresh();
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to send. Please retry.');
    }
    finally {
        setBusy(false);
    } }
    return <><button ref={launcher} type="button" className="support-launcher" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="support-chat" aria-label={translate(open ? 'Close live chat' : 'Open live chat')}><IconMessageCircle className="h-5 w-5"/><T>{" Chat with admissions"}</T></button><T>{open && <section ref={panel} tabIndex={-1} id="support-chat" className="support-widget" aria-label={translate("Admissions chat")}><header><div><strong><T>{"Swiss Behavioral Health"}</T></strong><span><T>{"Admissions support"}</T></span></div><button aria-label={translate("Close chat")} onClick={() => { setOpen(false); launcher.current?.focus(); }}><IconX className="h-5 w-5"/></button></header><p className="support-note"><T>{"For general questions. Please don\u2019t share medical records or insurance IDs. Responses depend on staff availability. For an emergency, call 911."}</T></p>
  <T>{error && <p role="alert" className="management-error"><T>{error}</T></p>}</T>
  <T>{!state.initialized ? <div className="support-start"><p><T>{error ? 'Please try reopening chat, or call us.' : 'Connecting…'}</T></p></div> : !state.conversation ? <form className="support-start management-form" onSubmit={e => { e.preventDefault(); void submit(new FormData(e.currentTarget)); }}><h3><T>{"How can we help?"}</T></h3><p><T>{"Start a conversation. We can follow up by email if you leave."}</T></p><input type="hidden" name="intent" value="start"/><label><T>{"Your name"}</T><input name="name" required minLength={2} maxLength={128} autoComplete="name"/></label><label><T>{"Email"}</T><input name="email" type="email" required maxLength={254} autoComplete="email"/></label><label className="check-label"><input type="checkbox" name="consent" required/><T>{"I agree to be contacted about my inquiry and have read the "}</T><a href="/privacy"><T>{"privacy notice"}</T></a><T>{"."}</T></label><button className="admin-button" disabled={busy}><T>{busy ? 'Starting…' : 'Start conversation'}</T></button></form> : <><div className="support-messages" role="log" aria-live="polite" aria-relevant="additions"><p className="support-greeting"><T>{"Welcome, "}</T>{state.conversation.name}<T>{". Send your question below. A representative can reply here."}</T></p><T>{state.messages.map(m => <article className={`chat-bubble ${m.senderRole === 'visitor' ? 'from-visitor' : 'from-staff'}`} key={m.id}><strong><T>{m.senderRole === 'visitor' ? 'You' : m.senderName}</T></strong><p>{m.body}</p><time><T>{new Date(m.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</T></time></article>)}</T><div ref={end}/></div><T>{state.conversation.status === 'closed' ? <div className="support-compose"><p><T>{"This conversation has been closed."}</T></p><button className="admin-button secondary" disabled={busy} onClick={() => { const f = new FormData(); f.set('intent', 'reopen'); void submit(f); }}><T>{"Reopen conversation"}</T></button></div> : <form className="support-compose" onSubmit={e => { e.preventDefault(); void submit(new FormData(e.currentTarget)); }}><input type="hidden" name="intent" value="send"/><label className="sr-only" htmlFor="support-message"><T>{"Message"}</T></label><textarea id="support-message" name="body" required maxLength={4000} rows={2} placeholder={translate("Write your message\u2026")} value={body} onChange={e => { setBody(e.target.value); pendingId.current = ''; }} disabled={busy}/><button className="admin-button" disabled={busy || !body.trim()}><T>{busy ? 'Sending…' : 'Send'}</T></button></form>}</T></>}</T>
  <footer><a href={site.phone.href}><T>{"Call "}</T><T>{site.phone.display}</T></a><span><T>{"Messages are stored for our team to reply. "}</T><a href="/privacy"><T>{"Privacy policy"}</T></a></span></footer></section>}</T></>;
}
