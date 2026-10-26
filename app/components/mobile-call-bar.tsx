// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./locale";
import { useLocation } from "react-router";
import { site } from "../data/site";
import { IconMessageCircle, IconPhone, IconShieldCheck } from "./icons";
import { openLiveChat } from "./live-chat";
/**
 * Sticky click-to-call bar (§3.1). Mobile only — the header already carries
 * phone + verify actions on larger screens. Hidden in the admin area.
 */
export function MobileCallBar() {
    const location = useLocation();
    if (location.pathname.startsWith("/admin"))
        return null;
    return (<div className="fixed inset-x-0 bottom-0 z-30 border-t border-cream/10 bg-navy-950/95 backdrop-blur-md lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-3 divide-x divide-cream/10">
        <a href={site.phone.href} className="flex flex-col items-center gap-1 px-2 py-3 text-cream">
          <IconPhone className="h-5 w-5 text-teal-300"/>
          <span className="text-[0.875rem] font-semibold uppercase tracking-wide"><T>{"Call"}</T></span>
        </a>
        <button type="button" onClick={openLiveChat} className="flex flex-col items-center gap-1 px-2 py-3 text-cream">
          <IconMessageCircle className="h-5 w-5 text-teal-300"/>
          <span className="text-[0.875rem] font-semibold uppercase tracking-wide"><T>{"Chat"}</T></span>
        </button>
        <a href="/verify-insurance" className="flex flex-col items-center gap-1 px-2 py-3 text-cream">
          <IconShieldCheck className="h-5 w-5 text-teal-300"/>
          <span className="text-[0.875rem] font-semibold uppercase tracking-wide"><T>{"Verify"}</T></span>
        </a>
      </div>
    </div>);
}
