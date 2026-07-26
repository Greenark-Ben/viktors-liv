import type{DocumentAuthorityRecord}from'./contracts';

export interface DocumentInvariantResult{valid:boolean;reasons:string[]}

export function validateDocumentAuthority(record:DocumentAuthorityRecord):DocumentInvariantResult{
 const reasons:string[]=[];
 if(!record.identity.title.trim())reasons.push('Document identity requires a title.');
 if(record.state!=='draft'&&record.evidence.length===0)reasons.push('A progressed document must retain supporting evidence.');
 if(['understanding_authored','reviewed','accepted'].includes(record.state)&&!record.understanding)reasons.push('This state requires human-authored understanding.');
 if(record.state==='accepted'&&!record.reviews.some(review=>review.decision==='accepted'))reasons.push('Accepted state requires an explicit family acceptance review.');
 if(record.understanding&&record.understanding.revision<1)reasons.push('Understanding revisions start at one.');
 const evidenceIds=record.evidence.map(item=>item.id);if(new Set(evidenceIds).size!==evidenceIds.length)reasons.push('Evidence identifiers must be unique.');
 const actionIds=record.actions.map(item=>item.id);if(new Set(actionIds).size!==actionIds.length)reasons.push('Action identifiers must be unique.');
 return{valid:reasons.length===0,reasons};
}

export function assertDocumentAuthority(record:DocumentAuthorityRecord):void{
 const result=validateDocumentAuthority(record);if(!result.valid)throw new Error(result.reasons.join(' '));
}
