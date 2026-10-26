// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";
import { LocationMap } from "../location-map";
import { ContactSection } from "../contact-section";
import { IconArrowUpRight, IconMapPin, IconMessageCircle } from "../icons";
import { openLiveChat } from "../live-chat";
import { PageHero } from "../page-hero";
import { ButtonLink } from "../ui/button";
import { Container } from "../ui/container";
import { contact as base_contact, pageMeta, site as base_site, } from "../../data/site";
/**
 * Contact & Location (§Exhibit A #12) — address, click-to-call, map, inquiry
 * form and the live-chat entry point.
 */
export default function Contact() {
    const translate = useTranslate();
    const copy = usePageText();
    const contact = usePageData(base_contact);
    const site = usePageData(base_site);
    return (<main id="main-content">
      <PageHero eyebrow={contact.eyebrow} title={translate(contact.heading)} intro={contact.body}/>

      <ContactSection withHeading={false} source="/contact"/>

      {/* Location + map */}
      <section className="bg-sand py-16 text-navy-950 sm:py-20" aria-labelledby="location-heading">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 id="location-heading" className="font-display text-2xl font-semibold sm:text-3xl">
              <T>{copy("Find us")}</T>
            </h2>
            <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-navy-900/75 sm:text-base">
              <IconMapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-600"/>
              <T>{site.address.full}</T>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy-900/60">
              <T>{site.hours}</T>
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={site.mapsUrl} variant="primary" size="md" target="_blank" rel="noreferrer">
                <T>{copy("Open in Google Maps")}</T>
                <IconArrowUpRight className="h-4 w-4"/>
              </ButtonLink>
              <button type="button" onClick={openLiveChat} className="group inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/25 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-800/60 hover:bg-navy-50">
                <IconMessageCircle className="h-4 w-4"/>
                <T>{copy("Start live chat")}</T>
              </button>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-navy-900/55">
              <T>{site.emergencyNote}</T>
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-navy-900/10 bg-cream">
            <LocationMap />
          </div>
        </Container>
      </section>
    </main>);
}
