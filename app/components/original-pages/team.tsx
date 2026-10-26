import {T,useTranslate,LocaleLink as Link} from "../locale";
import {usePageData,usePageText} from "../page-copy";
import {PageHero} from "../page-hero";
import {Container} from "../ui/container";
import {team as supplied} from "../../data/team";
export default function TeamPage(){
 const team=usePageData(supplied),t=useTranslate(),copy=usePageText();
 return <main id="main-content" className="team-directory-page">
  <PageHero eyebrow={team.eyebrow} title={t(team.heading)} intro={team.intro}/>
  <section className="team-directory" aria-labelledby="team-directory-heading"><Container>
   <div className="team-directory-intro"><div><h2 id="team-directory-heading"><T>{copy('Clinical & medical staff')}</T></h2><h3><T>{copy('Meet your care team')}</T></h3></div><p><T>{team.pendingNotice}</T></p></div>
   <ul className="team-directory-list">{team.members.filter(member=>member.verified).map(member=><li className="team-directory-row" key={member.id} id={member.id}>
    <Link className="team-directory-photo" to={`/team/${member.id}`} aria-label={member.name}><img src={member.photo} alt={member.name} width="960" height="720" loading="lazy" decoding="async"/></Link>
    <div className="team-directory-person"><p className="team-directory-role"><T>{member.role}</T></p><h3><Link to={`/team/${member.id}`}>{member.name}</Link></h3><p className="team-directory-credentials">{member.credentials}</p>
     {member.licenseNumber?<p><T>{copy('Licence/registration no. ')}</T>{member.licenseNumber}</p>:null}
     <Link className="team-directory-profile-link" to={`/team/${member.id}`}><T>Read biography</T><span aria-hidden="true">↗</span></Link>
    </div>
   </li>)}</ul>
   <div className="team-discipline-heading"><h2><T>{copy('How our care team is structured')}</T></h2></div>
   <ul className="team-discipline-list">{team.disciplines.map(discipline=><li key={discipline.title}><h3><T>{discipline.title}</T></h3><p><T>{discipline.body}</T></p></li>)}</ul>
  </Container></section>
 </main>;
}
