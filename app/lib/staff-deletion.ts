export function staffDeletionError(input:{actorId:string;targetId:string;role:string;email:string;confirmation:string;confirmed:boolean;assigned:boolean}) {
 if(input.actorId===input.targetId||input.role==='admin')return 'Administrator accounts and your own account are protected from deletion.';
 if(!input.confirmed||input.confirmation.trim().toLowerCase()!==input.email.trim().toLowerCase())return 'Confirm deletion and type the staff member’s email address exactly.';
 if(input.assigned)return 'Reassign this staff member’s leads and chats before deleting their account. You can disable access while you complete the handover.';
 return null;
}
