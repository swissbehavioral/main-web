// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";
import { AdmissionsSteps } from "../admissions-steps";
import { ApproachSection } from "../approach-section";
import { PageHero } from "../page-hero";
import { pageMeta, admissions as base_admissions } from "../../data/site";
export default function Admissions() {
    const translate = useTranslate();
    const copy = usePageText();
    const admissions = usePageData(base_admissions);
    return (<main id="main-content">
      <PageHero eyebrow={admissions.eyebrow} title={translate(admissions.heading)} intro={admissions.intro}/>
      <AdmissionsSteps withHeading={false}/>
      <ApproachSection />
    </main>);
}
