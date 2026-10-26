import type {TeamMember} from '../data/team';
import {T,LocaleLink as Link,useTranslate} from './locale';
import {Container} from './ui/container';
export function StaffProfile({member}:{member:TeamMember}) {
 const t=useTranslate();
 return <main id="main-content" className="staff-profile-page">
  <Container>
   <nav className="staff-profile-breadcrumb" aria-label={t('Breadcrumb')}><Link to="/"><T>Home</T></Link><span aria-hidden="true">/</span><Link to="/team"><T>Our Team</T></Link><span aria-hidden="true">/</span><span aria-current="page">{member.name}</span></nav>
   <article className="staff-profile-layout">
    <figure className="staff-profile-portrait"><img src={member.photo} alt={member.name} width="960" height="720" fetchPriority="high" decoding="async"/></figure>
    <div className="staff-profile-copy"><p className="staff-profile-role"><T>{member.role}</T></p><h1>{member.name}</h1><p className="staff-profile-credentials">{member.credentials}</p>
     {member.licenseNumber?<p>{member.licenseNumber}</p>:null}
     <div className="staff-profile-biography"><h2><T>Biography</T></h2><p><T>{member.bio}</T></p></div>
     <Link className="staff-profile-back" to="/team"><span aria-hidden="true">← </span><T>Back to our team</T></Link>
    </div>
   </article>
  </Container>
 </main>;
}
