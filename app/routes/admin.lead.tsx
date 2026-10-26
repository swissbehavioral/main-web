import { readFormData } from "../lib/security.server";
import { Form, Link, data, redirect, useNavigation } from "react-router";
import { requireAdmin, requirePermission } from "../lib/auth.server";
import { getLead, updateLead } from "../lib/leads.server";
import { listStaff, validateAssignee } from "../lib/staff.server";
import { can, canWork } from "../lib/permissions";
import { LEAD_STATUSES, isLeadStatus, leadKindLabels, leadStatusLabels, VERIFICATION_STATUSES, verificationLabels, type VerificationStatus } from "../lib/leads.types";
import { sameOrigin, privateHeaders } from "../lib/security.server";
import type { Route } from "./+types/admin.lead";
export function meta() { return [{ title: "Lead details | SBH Admin" }]; }
export async function loader({request,params}:Route.LoaderArgs) {
  const identity=await requireAdmin(request), lead=await getLead(params.id);
  if(!lead || (identity.role==='agent' && lead.assignedTo !== identity.id)) throw new Response('Lead not found',{status:404});
  return data({lead,identity,staff:await listStaff()}, {headers:privateHeaders});
}
export async function action({request,params}:Route.ActionArgs) {
  sameOrigin(request);
  const identity=await requireAdmin(request), form=await readFormData(request), intent=String(form.get('intent') || 'save');
  const lead=await getLead(params.id); if(!lead) throw new Response('Lead not found',{status:404});
  if(intent==='delete' || intent==='restore') {
    await requirePermission(request,'delete');
    if(intent==='delete' && form.get('confirm') !== 'on') return data({error:'Confirm moving this lead to Deleted.'},{status:400});
    await updateLead(lead.id,{status:intent==='delete'?'deleted':'new',deletedAt:intent==='delete'?new Date().toISOString():'',deletedBy:intent==='delete'?identity.id:''});
    return redirect(intent==='delete'?'/admin?status=deleted':`/admin/leads/${lead.id}`);
  }
  if(intent!=='save') throw new Response('Invalid action',{status:400});
  if(!canWork(identity.role,identity.id,lead.assignedTo) || lead.status==='deleted') throw new Response('You cannot edit this lead.',{status:403});
  const status=String(form.get('status')), notes=String(form.get('notes') || ''), assignedTo=String(form.get('assignedTo') ?? lead.assignedTo ?? '');
  const verificationStatus=String(form.get('verificationStatus') || lead.verificationStatus || 'pending');
  if(!isLeadStatus(status) || status==='deleted' || notes.length>5000 || !VERIFICATION_STATUSES.includes(verificationStatus as VerificationStatus)) return data({error:'Check the status and notes (maximum 5,000 characters).'},{status:400});
  if(assignedTo !== (lead.assignedTo || '')) { await requirePermission(request,'assign'); await validateAssignee(assignedTo); }
  await updateLead(lead.id,{status,notes,assignedTo,...(lead.kind==='insurance'?{verificationStatus:verificationStatus as VerificationStatus}:{})});
  return data({saved:true});
}
export default function LeadDetail({loaderData:d,actionData}:Route.ComponentProps) {
  const l=d.lead, busy=useNavigation().state!=='idle', editable=canWork(d.identity.role,d.identity.id,l.assignedTo)&&l.status!=='deleted';
  return <div className="management"><div className="management-heading"><div><h2>{l.name}</h2><p>{leadKindLabels[l.kind]} · {leadStatusLabels[l.status]}</p></div></div>
    {actionData && 'error' in actionData && <p role="alert" className="management-error">{actionData.error}</p>}{actionData && 'saved' in actionData && <p role="status" className="management-success">Changes saved.</p>}
    <div className="management-columns"><section className="management-card"><h3>Contact & submission</h3><dl className="management-details">{Object.entries({'Received':new Date(l.createdAt).toLocaleString('en-US',{timeZone:'America/New_York'}),'Email':l.email,'Phone':l.phone,'Preferred contact':l.preferredContact,'Best time':l.bestTime,'Reason':l.reason,'Insurance provider':l.insurer,'Member ID':l.memberId,'Consent':l.consent?'Yes':'No','Source':l.source,'Assigned to':d.staff.find(s=>s.id===l.assignedTo)?.email || 'Unassigned'}).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>)}</dl>{l.message&&<><h3>Visitor message</h3><p className="pre-wrap">{l.message}</p></>}<small>Reference: {l.id}</small></section>
    <section className="management-card"><h3>Lead workflow</h3><Form method="post" key={l.updatedAt} className="management-form"><fieldset disabled={!editable || busy}><label>Status<select name="status" defaultValue={l.status}>{LEAD_STATUSES.filter(s=>s!=='deleted').map(s=><option key={s} value={s}>{leadStatusLabels[s]}</option>)}</select></label>
    {can(d.identity.role,'assign')&&<label>Assigned representative<select name="assignedTo" defaultValue={l.assignedTo || ''}><option value="">Unassigned</option>{d.staff.filter(s=>s.role!=='viewer' && (s.active || s.id===l.assignedTo)).map(s=><option key={s.id} value={s.id}>{s.name || s.email}{!s.active?' (inactive)':''}</option>)}</select></label>}
    {l.kind==='insurance'&&<label>Insurance verification<select name="verificationStatus" defaultValue={l.verificationStatus || 'pending'}>{VERIFICATION_STATUSES.map(s=><option key={s} value={s}>{verificationLabels[s]}</option>)}</select><p className="management-help">Record the outcome after checking with the insurer. This site does not automatically confirm benefits or guarantee payment.</p></label>}
    <label>Internal notes<textarea name="notes" rows={7} maxLength={5000} defaultValue={l.notes || ''}/></label><p className="management-help">Staff only. Keep clinical records in the approved clinical system.</p>{editable&&<button className="admin-button" name="intent" value="save">{busy?'Saving…':'Save changes'}</button>}</fieldset></Form>
    {!editable&&<p className="management-help">This record is read-only for your role or its current status.</p>}
    {can(d.identity.role,'delete')&&<Form method="post" className="management-danger">{l.status==='deleted'?<><p>Deleted {l.deletedAt ? new Date(l.deletedAt).toLocaleString() : ''}. Restore returns this lead to New.</p><button className="admin-button secondary" name="intent" value="restore" disabled={busy}>Restore lead</button></>:<><label className="check-label"><input type="checkbox" name="confirm" required/>Move this lead to the Deleted view</label><button className="admin-button danger" name="intent" value="delete" disabled={busy}>Delete lead</button></>}</Form>}
    </section></div></div>;
}
