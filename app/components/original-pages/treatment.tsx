import { FacilityExperience } from "../facility-experience";
import { LocaleLink as Link } from "../locale";
// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "../locale";
import { usePageData, usePageText } from "../page-copy";

import { Container } from "../ui/container";
import { ApproachSection } from "../approach-section";
import { FamiliesSection } from "../families-section";
import { PageHero } from "../page-hero";
import { ProgramsSection } from "../programs-section";
import { TherapiesSection } from "../therapies-section";
import { pageMeta, programs as base_programs } from "../../data/site";
export default function Treatment() {
    const translate = useTranslate();
    const copy = usePageText();
    const programs = usePageData(base_programs);
    return (<main id="main-content">
      <PageHero eyebrow={programs.eyebrow} title={translate(programs.heading)} intro={programs.intro}/>
      <ProgramsSection withHeading={false}/>
      <ApproachSection />
      <TherapiesSection />
      <FacilityExperience />
      <FamiliesSection />
    </main>);
}
