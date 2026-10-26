import { leadership, leadershipMembers } from '../data/recovered-content';
import { T, LocaleLink as Link } from './locale';
import { usePageData } from './page-copy';
import { Container } from './ui/container';
import { SectionHeading } from './ui/section';
export function LeadershipSection() {
 const heading=usePageData(leadership),members=usePageData(leadershipMembers);
 return <section className="restored-leadership" aria-labelledby="leadership-heading">
  <Container>
   <div id="leadership-heading"><SectionHeading eyebrow={heading.eyebrow} title={heading.title} description={heading.intro}/></div>
   <ul className="leadership-grid leadership-editorial-grid">{members.map(member=><li key={member.id}>
    <Link className="leadership-preview" to={`/team/${member.id}`}>
     <div className="leadership-photo"><img src={member.photo} alt={member.name} width="960" height="720" loading="lazy" decoding="async"/></div>
     <div className="leadership-copy"><p className="leadership-role"><T>{member.role}</T></p><h3>{member.name}</h3><p>{member.credentials}</p><span className="leadership-link"><T>Read biography</T><span className="leadership-link-arrow" aria-hidden="true">↗</span></span></div>
    </Link>
   </li>)}</ul>
  </Container>
 </section>;
}
