import { LocaleLink as Link, LocaleNavLink as NavLink } from "./locale";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate, useLocale, LanguageSwitch } from "./locale";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { navigationPanels, type NavigationPanelId } from "../data/navigation";
import { navItems, site } from "../data/site";
import { IconArrowRight, IconArrowUpRight, IconMenu, IconPhone, IconX, } from "./icons";
import { Logo } from "./logo";
function Chevron() {
    return (<svg aria-hidden="true" viewBox="0 0 12 12" width="10" height="10">
      <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
}
export function SiteHeader() {
    const {locale} = useLocale();
    const translate = useTranslate();
    const [openPanel, setOpenPanel] = useState<NavigationPanelId | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const triggers = useRef<Partial<Record<NavigationPanelId, HTMLButtonElement | null>>>({});
    const mobileTrigger = useRef<HTMLButtonElement>(null);
    const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelHoverClose = () => {
        if (hoverCloseTimer.current)
            clearTimeout(hoverCloseTimer.current);
        hoverCloseTimer.current = null;
    };
    useEffect(() => () => {
        if (hoverCloseTimer.current)
            clearTimeout(hoverCloseTimer.current);
    }, []);
    const location = useLocation();
    const expanded = openPanel !== null || mobileOpen;
    useEffect(() => {
        setOpenPanel(null);
        setMobileOpen(false);
    }, [location.key]);
    useEffect(() => {
        if (!expanded)
            return;
        function dismiss(event: PointerEvent) {
            if (!headerRef.current?.contains(event.target as Node)) {
                setOpenPanel(null);
                setMobileOpen(false);
            }
        }
        function escape(event: KeyboardEvent) {
            if (event.key !== "Escape")
                return;
            setOpenPanel(null);
            setMobileOpen(false);
            if (openPanel)
                triggers.current[openPanel]?.focus();
            else
                mobileTrigger.current?.focus();
        }
        document.addEventListener("pointerdown", dismiss);
        document.addEventListener("keydown", escape);
        return () => {
            document.removeEventListener("pointerdown", dismiss);
            document.removeEventListener("keydown", escape);
        };
    }, [expanded, openPanel]);
    // A resize closes hidden menus so their backdrop never obscures another layout.
    useEffect(() => {
        const breakpoint = window.matchMedia("(min-width: 1100px)");
        const reset = () => {
            setOpenPanel(null);
            setMobileOpen(false);
        };
        breakpoint.addEventListener("change", reset);
        return () => breakpoint.removeEventListener("change", reset);
    }, []);
    const panel = openPanel ? navigationPanels[openPanel] : null;
    return (<>
      <T>{expanded && <div className="navigation-backdrop" aria-hidden="true"/>}</T>
      <header ref={headerRef} className="floating-header" onPointerEnter={cancelHoverClose} onPointerLeave={(event) => {
            if (event.pointerType !== "mouse")
                return;
            cancelHoverClose();
            hoverCloseTimer.current = setTimeout(() => {
                const focused = document.activeElement;
                if (focused instanceof Element && focused.closest(".mega-panel"))
                    return;
                setOpenPanel(null);
            }, 220);
        }} onBlur={(event) => {
            if (event.relatedTarget &&
                !event.currentTarget.contains(event.relatedTarget as Node)) {
                setOpenPanel(null);
                setMobileOpen(false);
            }
        }}>
        <div className="floating-navbar">
          <nav aria-label={translate("Primary")} className="floating-nav-links">
            <T>{(Object.keys(navigationPanels) as NavigationPanelId[]).map((id) => (<button type="button" key={id} ref={(node) => {
                triggers.current[id] = node;
            }} id={`nav-trigger-${id}`} aria-expanded={openPanel === id} aria-controls={`navigation-panel-${id}`} className={openPanel === id
                ? "nav-disclosure is-open"
                : "nav-disclosure"} onPointerEnter={(event) => {
                if (event.pointerType !== "mouse")
                    return;
                cancelHoverClose();
                setOpenPanel(id);
            }} onClick={(event) => {
                cancelHoverClose();
                // A mouse click follows pointer-enter, which already opened
                // this panel. Keep it open rather than immediately toggling shut.
                if (event.detail > 0 && window.matchMedia("(hover: hover)").matches) {
                    setOpenPanel(id);
                }
                else {
                    setOpenPanel((current) => (current === id ? null : id));
                }
            }} onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpenPanel(id);
                    requestAnimationFrame(() => headerRef.current
                        ?.querySelector<HTMLElement>(`#navigation-panel-${id} a`)
                        ?.focus());
                }
            }}>
                  <T>{navigationPanels[id].label}</T>
                  <Chevron />
                </button>))}</T>
            <NavLink to="/faq" className="nav-direct-link" aria-label={translate("FAQs")}><T>{locale === "es" ? "Preguntas" : "FAQs"}</T></NavLink>
            <NavLink to="/contact" className="nav-direct-link"><T>{"Contact"}</T></NavLink>
          </nav>
          <Link to="/" aria-label={translate(`${site.name} — home`)} className="floating-brand">
            <Logo variant="header"/>
          </Link>
          <div className="floating-nav-actions">
            <LanguageSwitch />
            <Link to="/verify-insurance" className="nav-primary-action"><T>{"Verify insurance "}</T><IconArrowUpRight className="h-4 w-4"/>
            </Link>
          </div>
          <div className="nav-language-mobile"><LanguageSwitch /><Link to="/verify-insurance" className="nav-mobile-verify"><T>{"Verify insurance"}</T></Link></div>
          <a href={site.phone.href} aria-label={translate(`Call ${site.phone.display}`)} className="nav-mobile-phone">
            <IconPhone className="h-4 w-4"/>
          </a>
          <button type="button" ref={mobileTrigger} className="nav-mobile-toggle" aria-label={translate(mobileOpen ? "Close menu" : "Open menu")} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((current) => !current)}>
            <T>{mobileOpen ? (<IconX className="h-5 w-5"/>) : (<IconMenu className="h-5 w-5"/>)}</T>
          </button>
        </div>
        <T>{panel && openPanel && (<nav key={openPanel} id={`navigation-panel-${openPanel}`} aria-labelledby={`nav-trigger-${openPanel}`} className="mega-panel simple-navigation-panel">
            <div className="mega-heading">
              <h2><T>{panel.label}</T></h2>
              <button type="button" className="mega-close" aria-label={translate("Close navigation")} onClick={() => {
                setOpenPanel(null);
                triggers.current[openPanel]?.focus();
            }}>
                <IconX className="h-5 w-5"/>
              </button>
            </div>
            <ul className="simple-navigation-links">
              <T>{panel.cards.map((card) => (<li key={card.to}>
                  <NavLink to={card.to}><T>{card.title}</T></NavLink>
                </li>))}</T>
            </ul>
          </nav>)}</T>
        <T>{mobileOpen && (<nav id="mobile-navigation" aria-label={translate("Mobile")} className="mobile-mega-panel">
            <p className="mobile-nav-eyebrow"><T>{"Explore Swiss Behavioral Health"}</T></p>
            <div className="mobile-nav-list">
              <T>{navItems.map((item) => item.children ? (<details key={item.to}>
                    <summary>
                      <T>{item.label}</T>
                      <Chevron />
                    </summary>
                    <div>
                      <T>{item.children.map((child) => (<NavLink key={child.to} to={child.to}>
                          <T>{child.label}</T>
                          <IconArrowRight className="h-3.5 w-3.5"/>
                        </NavLink>))}</T>
                    </div>
                  </details>) : (<NavLink key={item.to} to={item.to}>
                    <T>{item.label}</T>
                    <IconArrowRight className="h-4 w-4"/>
                  </NavLink>))}</T>
            </div>
            <Link className="mobile-insurance-action" to="/verify-insurance"><T>{"Verify insurance"}</T><IconArrowUpRight className="h-4 w-4"/>
            </Link>
            <div className="mobile-nav-footer">
              <a href={site.phone.href}>
                <IconPhone className="h-4 w-4"/>
                <T>{site.phone.display}</T>
              </a>
            </div>
          </nav>)}</T>
      </header>
    </>);
}
