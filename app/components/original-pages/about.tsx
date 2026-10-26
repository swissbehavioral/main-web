import { LeadershipSection } from "../leadership-section";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";
import { AboutSection } from "../about-section";
import { ApproachSection } from "../approach-section";
import { PageHero } from "../page-hero";
import { pageMeta, site as base_site } from "../../data/site";
export default function About() {
    const translate = useTranslate();
    const copy = usePageText();
    const site = usePageData(base_site);
    return (<main id="main-content">
      <PageHero eyebrow="About Swiss Behavioral Health" title={translate("Small by Design. Personal by Nature.")} intro={`${site.descriptor}. An intentionally small behavioral health program offering highly individualized treatment, exceptional access to our clinical team, and 14-bed supportive lodging beside Philippe Park in Safety Harbor, Florida.`}/>
      <AboutSection />
      <ApproachSection />
      <LeadershipSection />
    </main>);
}
