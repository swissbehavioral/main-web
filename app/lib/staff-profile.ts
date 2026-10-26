import {team} from '../data/team';
import {pageSeeds} from '../data/content-seeds';
import {buildPageCopy,mapPageData} from './page-copy';
import type {ContentDocument} from './content.types';
/** The directory and profile share the same published CMS text. */
export function getStaffProfile(doc:ContentDocument,id:string) {
 const member=team.members.find(member=>member.id===id && member.verified);
 const seed=pageSeeds.find(seed=>seed.id==='page-team');
 return member && seed ? mapPageData(member,buildPageCopy(seed,doc)) : undefined;
}
