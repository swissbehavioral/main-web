import { LocaleLink as Link } from "./locale";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { CookieSettingsButton } from "./cookie-consent";

import { footer, footerNav, site } from "../data/site";
import { IconArrowUp, IconArrowUpRight, IconMail, IconMapPin, IconPhone } from "./icons";
import { Logo } from "./logo";
import { Container } from "./ui/container";
export function SiteFooter() {
    const translate = useTranslate();
    return (<>
      <section className="admissions-invitation" aria-labelledby="admissions-invitation-heading">
        <Container><div className="admissions-invitation-layout">
          <div className="admissions-invitation-copy"><p className="brand-eyebrow"><T>{footer.tag}</T></p><h2 id="admissions-invitation-heading"><T>{footer.headline}</T></h2><p><T>{footer.body}</T></p></div>
          <div className="admissions-invitation-actions">
            <a href={footer.primaryCta.href} className="admissions-call-button"><span><span className="admissions-action-label"><T>{footer.primaryCta.label}</T></span><strong>{site.phone.display}</strong></span><span className="admissions-action-icon"><IconPhone className="h-5 w-5"/></span></a>
            <Link to="/verify-insurance" className="admissions-insurance-button"><T>{footer.secondaryCta.label}</T><IconArrowUpRight className="h-5 w-5"/></Link>
          </div>
        </div></Container>
      </section>
      <footer className="site-footer bg-navy-950 text-cream">
      {/* Link columns */}
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_1fr_1.1fr]">
        {/* Brand + contact (address is shown site-wide for compliance) */}
        <div>
          <Logo variant="footer"/>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/65">
            <T>{site.descriptor}</T><T>{". An intentionally small behavioral health program offering highly individualized treatment, exceptional access to our clinical team, and 14-bed supportive lodging."}</T></p>

          <ul className="mt-6 space-y-4 text-sm text-cream/70">
            <li className="flex items-start gap-3">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400"/>
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">
                <T>{site.address.full}</T>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IconPhone className="h-4 w-4 shrink-0 text-teal-400"/>
              <a href={site.phone.href} className="transition-colors hover:text-cream">
                <T>{site.phone.display}</T>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IconMail className="h-4 w-4 shrink-0 text-teal-400"/>
              <a href={site.email.href} className="transition-colors hover:text-cream">
                <T>{site.email.display}</T>
              </a>
            </li>
          </ul>
        </div>

        <T>{footerNav.map((group) => (<nav key={group.title} aria-label={translate(group.title)}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
              <T>{group.title}</T>
            </h3>
            <ul className="mt-5 space-y-3">
              <T>{group.links.map((link) => (<li key={link.to}>
                  <Link to={link.to} className="text-sm text-cream/70 transition-colors hover:text-cream">
                    <T>{link.label}</T>
                  </Link>
                </li>))}</T>
            </ul>
          </nav>))}</T>
      </Container>

      {/* Legal bar */}
      <div className="border-t border-cream/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p><T>{footer.copyright}</T></p>
          <CookieSettingsButton />
          <p className="max-w-md"><T>{site.emergencyNote}</T></p>
          <a href="#top" className="inline-flex items-center gap-1.5 font-medium text-cream/70 transition-colors hover:text-teal-300"><T>{"Back to top"}</T><IconArrowUp className="h-3.5 w-3.5"/>
          </a>
        </Container>
      </div>
    </footer></>);
}
