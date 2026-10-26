// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CONSENT_COOKIE, CONSENT_DAYS, parseCookiePreference } from "../lib/cookie-consent";
const CookieContext = createContext({ externalMedia: false, openSettings: () => { }, allowMedia: () => { } });
export const useCookieConsent = () => useContext(CookieContext);
export function CookieSettingsButton() {
    const { openSettings } = useCookieConsent();
    return <button type="button" onClick={openSettings} className="underline underline-offset-4"><T>{"Cookie preferences"}</T></button>;
}
export function CookieConsentProvider({ children, enabled }: {
    children: ReactNode;
    enabled: boolean;
}) {
    const translate = useTranslate();
    const [externalMedia, setMedia] = useState(false);
    const [draftMedia, setDraftMedia] = useState(false);
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [storageError, setStorageError] = useState(false);
    useEffect(() => {
        let choice = null;
        try {
            choice = parseCookiePreference(document.cookie.split("; ").find(item => item.startsWith(`${CONSENT_COOKIE}=`))?.slice(CONSENT_COOKIE.length + 1));
        }
        catch { }
        setMedia(choice?.externalMedia ?? false);
        setDraftMedia(choice?.externalMedia ?? false);
        setVisible(!choice);
    }, []);
    function save(allow: boolean) {
        setMedia(allow);
        setDraftMedia(allow);
        try {
            document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify({ version: 1, externalMedia: allow, savedAt: Date.now() }))}; Path=/; Max-Age=${CONSENT_DAYS * 86400}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
            if (!document.cookie.split("; ").some(item => item.startsWith(`${CONSENT_COOKIE}=`)))
                throw new Error("Cookies blocked");
            setVisible(false);
            setStorageError(false);
        }
        catch {
            setStorageError(true);
        }
    }
    return <CookieContext.Provider value={{ externalMedia, openSettings: () => { setDraftMedia(externalMedia); setExpanded(true); setVisible(true); }, allowMedia: () => save(true) }}>
    <T>{children}</T>
    <T>{enabled && visible && <aside className="cookie-notice" aria-labelledby="cookie-title" aria-label={translate("Cookie choices")}>
      <span className="cookie-eyebrow"><T>{"Your privacy, your choice"}</T></span>
      <h2 id="cookie-title"><T>{"A little clarity about cookies."}</T></h2>
      <p><T>{"We use essential storage for your preferences and services you request, such as chat. Optional Google Maps embeds stay off until you allow them. No advertising or analytics trackers are currently installed. "}</T><a href="/privacy#cookies"><T>{"Read our privacy & cookie policy"}</T></a><T>{"."}</T></p>
      <T>{expanded && <div className="cookie-details"><p><strong><T>{"Essential \u2014 always active:"}</T></strong><T>{" cookie choices (180 days), chat session when opened (7 days), staff sign-in (8 hours), and the notice dismissal for this browser session."}</T></p><label><input type="checkbox" checked={draftMedia} onChange={event => setDraftMedia(event.target.checked)}/><T>{" Allow external media (Google Maps)"}</T></label><p><T>{"Google receives connection information when a map loads and may use its own cookies. Turning this off removes the embed; it cannot erase cookies Google already stored. Site fonts are hosted on this website."}</T></p></div>}</T>
      <T>{storageError && <p role="status"><T>{"Your browser blocked saving this choice. It applies for this visit; you may be asked again after reloading."}</T></p>}</T>
      <div className="cookie-actions"><button type="button" onClick={() => save(true)}><T>{"Accept optional"}</T></button><button type="button" onClick={() => save(false)}><T>{"Reject optional"}</T></button><T>{expanded ? <button type="button" onClick={() => save(draftMedia)}><T>{"Save preferences"}</T></button> : <button type="button" onClick={() => setExpanded(true)}><T>{"Manage preferences"}</T></button>}</T></div>
      <T>{storageError && <button type="button" onClick={() => setVisible(false)}><T>{"Continue with this choice"}</T></button>}</T>
    </aside>}</T>
  </CookieContext.Provider>;
}
