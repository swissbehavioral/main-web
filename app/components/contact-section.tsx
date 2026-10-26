import { LocationMap } from "./location-map";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { usePageData, usePageText } from "./page-copy";
import { contact as base_contact, site as base_site } from "../data/site";
import { IconArrowUpRight, IconClock, IconMail, IconMapPin, IconPhone, } from "./icons";
import { LeadForm } from "./lead-form";
import { Container } from "./ui/container";
import { SectionHeading } from "./ui/section";
export function ContactSection({ withHeading = true, source = "/", }: {
    withHeading?: boolean;
    source?: string;
}) {
    const translate = useTranslate();
    const copy = usePageText();
    const contact = usePageData(base_contact);
    const site = usePageData(base_site);
    const detailRows = [
        {
            key: "address",
            icon: IconMapPin,
            label: contact.details.address.label,
            value: contact.details.address.value,
            href: site.mapsUrl,
            external: true,
            actionLabel: contact.details.address.mapLabel,
        },
        {
            key: "phone",
            icon: IconPhone,
            label: contact.details.phone.label,
            value: contact.details.phone.value,
            href: site.phone.href,
            external: false,
        },
        {
            key: "email",
            icon: IconMail,
            label: contact.details.email.label,
            value: contact.details.email.value,
            href: site.email.href,
            external: false,
        },
    ] as const;
    return (<section id="contact" className="section-surface surface-mist relative bg-cream py-20 text-navy-950 sm:py-28" aria-labelledby="contact-heading">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          {/* Left — contact details */}
          <div>
            <T>{withHeading ? (<SectionHeading eyebrow={contact.eyebrow} title={translate(contact.heading)} description={contact.body}/>) : null}</T>

            <ul className="mt-10 space-y-4">
              <T>{detailRows.map((row) => {
            const Icon = row.icon;
            return (<li key={row.key}>
                    <a href={row.href} {...(row.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})} className="group flex items-center gap-4 rounded-lg border border-navy-900/10 bg-white/60 p-4 transition-colors hover:border-navy-800/30 hover:bg-white">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-800 transition-colors group-hover:bg-navy-800 group-hover:text-cream">
                        <Icon className="h-5 w-5"/>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-navy-900/55">
                          <T>{row.label}</T>
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-medium text-navy-950 sm:text-base">
                          <T>{row.value}</T>
                        </span>
                        <T>{"actionLabel" in row && row.actionLabel ? (<span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-teal-600">
                            <T>{row.actionLabel}</T>
                            <IconArrowUpRight className="h-3 w-3"/>
                          </span>) : null}</T>
                      </span>
                    </a>
                  </li>);
        })}</T>
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-lg border border-navy-900/10 bg-sand p-4 text-sm text-navy-900/75">
              <IconClock className="mt-0.5 h-5 w-5 shrink-0 text-teal-600"/>
              <p>
                <T>{copy("Admissions conversations are confidential. Please avoid sending medical records, diagnoses, insurance IDs, or other sensitive health information through this website.")}</T>
                <T>{site.emergencyNote}</T>
              </p>
            </div>
          </div>

          {/* Right — inquiry form */}
          <div>
            <LeadForm variant="inquiry" source={source}/>
          </div>
        </div>
        <div className="home-location-map"><LocationMap /></div>
      </Container>
    </section>);
}
