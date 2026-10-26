import test from 'node:test';
import assert from 'node:assert/strict';
import { can, canWork, roleFromLabels } from '../app/lib/permissions.ts';
import { filterLeads, csvCell } from '../app/lib/lead-filters.ts';
import { validateLead } from '../app/lib/validation.ts';
const lead={id:'one',kind:'insurance',status:'new',name:'Example',createdAt:'2026-03-08T04:59:59Z',assignedTo:'agent',verificationStatus:'pending'};
test('Roles default deny; representatives only work their assignments',()=>{
 assert.equal(roleFromLabels([]),undefined);assert.equal(can('viewer','edit'),false);assert.equal(can('agent','delete'),false);assert.equal(can('manager','staff'),false);assert.equal(can('manager','export'),true);assert.equal(canWork('agent','a','b'),false);assert.equal(canWork('agent','a','a'),true);assert.equal(canWork('viewer','a','a'),false);
});
test('Calendar includes full Eastern day across daylight saving boundary',()=>{
 const leads=[lead,{...lead,id:'two',createdAt:'2026-03-08T05:00:00Z'},{...lead,id:'three',createdAt:'2026-03-09T03:59:59Z'},{...lead,id:'four',createdAt:'2026-03-09T04:00:00Z'}];
 assert.deepEqual(filterLeads(leads,new URLSearchParams('from=2026-03-08&to=2026-03-08')).map(l=>l.id),['two','three']);
});
test('Deleted leads excluded by default; combined filters apply',()=>{
 const leads=[lead,{...lead,id:'deleted',status:'deleted'},{...lead,id:'other',assignedTo:'other'}];
 assert.equal(filterLeads(leads,new URLSearchParams()).length,2);assert.equal(filterLeads(leads,new URLSearchParams('status=deleted'))[0].id,'deleted');assert.equal(filterLeads(leads,new URLSearchParams('assignedTo=agent&kind=insurance&verification=pending&q=exam')).length,1);
});
test('CSV escapes quotes, newlines, and spreadsheet formulas',()=>{
 assert.equal(csvCell('=1+1'),'"\'=1+1"');assert.equal(csvCell(' \t@SUM(A1)'),'"\' \t@SUM(A1)"');assert.equal(csvCell('a,"b"\nc'),'"a,""b""\nc"');
});
test('Insurance validation mirrors required UI fields and rejects invalid contact details',()=>{
 const valid={kind:'insurance',name:'QA User',email:'',phone:'2025550100',insurer:'Test insurer',message:'',consent:true};assert.deepEqual(validateLead(valid),{});assert(validateLead({...valid,phone:''}).phone);assert(validateLead({...valid,insurer:''}).insurer);assert(validateLead({...valid,consent:false}).consent);assert(validateLead({...valid,email:'bad'}).email);assert(validateLead({...valid,phone:'bad'}).phone);
});
