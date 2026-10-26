// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { useEffect, useState } from "react";
import { notice, site } from "../data/site";
import { IconX } from "./icons";
import { Container } from "./ui/container";
const DISMISS_KEY = "sbh-notice-dismissed";
/**
 * Announcement bar ("Coming Soon — Pending DCF Licensure"). Rendered during
 * SSR; hidden without a flash once a returning visitor's session flag is read.
 */
export function NoticeBar() {
    const translate = useTranslate();
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        setVisible(sessionStorage.getItem(DISMISS_KEY) !== "1");
    }, []);
    if (!visible)
        return null;
    return (<div className="site-notice bg-navy-950 text-cream">
      <Container className="flex min-h-10 items-center justify-center gap-3 py-1.5 text-center">
        <span aria-hidden className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full  rounded-full bg-teal-400 opacity-70"/>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400"/>
        </span>
        <p className="text-xs font-medium tracking-wide sm:text-[0.875rem]">
          <span className="mr-2 font-semibold uppercase tracking-[0.18em] text-teal-300">
            <T>{notice.label}</T>
          </span>
          <T>{notice.text}</T>
          <span className="mx-2 text-cream/30"><T>{"\u00B7"}</T></span>
          <a href={`tel:${site.phone.href.replace("tel:", "")}`} className="font-semibold text-cream/90 underline-offset-4 hover:text-teal-300 hover:underline">
            <T>{site.phone.display}</T>
          </a>
        </p>
        <button type="button" aria-label={translate("Dismiss notice")} onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
        }} className="ml-2 rounded-full p-1 text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream">
          <IconX className="h-3.5 w-3.5"/>
        </button>
      </Container>
    </div>);
}
