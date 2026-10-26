import {team} from "../data/team";
import {data} from 'react-router';
import {getPublishedContent} from '../lib/content.server';
import {getStaffProfile} from '../lib/staff-profile';
import {localizedMeta,translateText,type Dictionary} from '../lib/locale';
import {StaffProfile} from '../components/staff-profile';
import type {Route} from './+types/team-profile';
export async function loader({params}:Route.LoaderArgs) {
 if(!team.members.some(member=>member.id===params.member && member.verified))throw data('Profile not found',{status:404});
 const doc=await getPublishedContent('/team');
 const member=doc && getStaffProfile(doc,params.member);
 if(!member)throw data('Profile not found',{status:404});
 return {member};
}
export function meta({loaderData,matches}:Route.MetaArgs) {
 if(!loaderData)return [{title:'Swiss Behavioral Health'}];
 const member=loaderData.member;
 const dictionary=(matches.find(match=>match?.id==='root')?.data as {dictionary?:Dictionary}|undefined)?.dictionary||{};
 const title=`${member.name}, ${member.credentials} | ${translateText(member.role,dictionary)} | Swiss Behavioral Health`;
 const description=translateText(member.bio,dictionary).replace(/\s+/g,' ').slice(0,180);
 const url=`https://www.swissbehavioralhealth.com/team/${member.id}`;
 return localizedMeta([{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'profile'},{property:'og:url',content:url},{property:'og:image',content:`https://www.swissbehavioralhealth.com${member.photo}`},{name:'twitter:card',content:'summary_large_image'},{name:'twitter:title',content:title},{name:'twitter:description',content:description},{name:'twitter:image',content:`https://www.swissbehavioralhealth.com${member.photo}`},{tagName:'link',rel:'canonical',href:url}],matches);
}
export default function Profile({loaderData}:Route.ComponentProps) {return <StaffProfile member={loaderData.member}/>;}
