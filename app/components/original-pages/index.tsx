import About from "./about";
import Team from "./team";
import Licensing from "./licensing";
import Treatment from "./treatment";
import Admissions from "./admissions";
import Insurance from "./insurance";
import Contact from "./contact";
import Faq from "./faq";
import Privacy from "./privacy";
import Terms from "./terms";
import { getProgram } from "../../data/programs";
import { ProgramDetailPage } from "../program-detail-page";
const pages = {
  "page-about": About,
  "page-team": Team,
  "page-licensing": Licensing,
  "page-treatment": Treatment,
  "page-admissions": Admissions,
  "page-insurance": Insurance,
  "page-contact": Contact,
  "page-faq": Faq,
  "page-privacy": Privacy,
  "page-terms": Terms,
};
export function hasOriginalPage(id: string) {
  return id in pages || ["page-php", "page-iop", "page-op"].includes(id);
}
export function OriginalPage({ id }: { id: string }) {
  const Page = pages[id as keyof typeof pages];
  if (Page) return <Page />;
  const program = getProgram(id.replace("page-", ""));
  return program ? <ProgramDetailPage program={program} /> : null;
}
