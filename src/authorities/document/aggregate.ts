import type{DocumentAuthorityRecord,DocumentEvidence,DocumentIdentity,DocumentImpact,DocumentUnderstanding,DocumentAction,DocumentConnections,ReviewDecision}from'./contracts';

const now=()=>new Date().toISOString();
const id=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const unique=(values:string[])=>[...new Set(values.filter(Boolean))];

export function createDocumentAuthority(identity:DocumentIdentity,actor:string):DocumentAuthorityRecord{
 const at=now();return{id:id('document'),version:1,state:'draft',identity,evidence:[],actions:[],connections:{personIds:[],memoryIds:[],knowledgeIds:[],lifeEventIds:[]},reviews:[],history:[{id:id('history'),at,by:actor,event:'created'}],createdAt:at,updatedAt:at};
}

export function attachEvidence(record:DocumentAuthorityRecord,evidence:Omit<DocumentEvidence,'id'|'addedAt'>):DocumentAuthorityRecord{
 const at=now();return{...record,state:record.state==='draft'?'evidence_attached':record.state,evidence:[...record.evidence,{...evidence,id:id('evidence'),addedAt:at}],history:[...record.history,{id:id('history'),at,by:evidence.addedBy,event:'evidence_added',note:evidence.name}],updatedAt:at};
}

export function authorUnderstanding(record:DocumentAuthorityRecord,input:Omit<DocumentUnderstanding,'authoredAt'|'revision'>):DocumentAuthorityRecord{
 const at=now();const revision=(record.understanding?.revision??0)+1;return{...record,state:'understanding_authored',understanding:{...input,authoredAt:at,revision},reviews:[],history:[...record.history,{id:id('history'),at,by:input.authoredBy,event:'understanding_authored',note:`Revision ${revision}`}],updatedAt:at};
}

export function setImpact(record:DocumentAuthorityRecord,impact:DocumentImpact):DocumentAuthorityRecord{return{...record,impact:{...impact,affectedPersonIds:unique(impact.affectedPersonIds)},updatedAt:now()}}
export function addAction(record:DocumentAuthorityRecord,action:Omit<DocumentAction,'id'>):DocumentAuthorityRecord{return{...record,actions:[...record.actions,{...action,id:id('action')}],updatedAt:now()}}
export function setConnections(record:DocumentAuthorityRecord,connections:DocumentConnections):DocumentAuthorityRecord{return{...record,connections:{personIds:unique(connections.personIds),memoryIds:unique(connections.memoryIds),knowledgeIds:unique(connections.knowledgeIds),lifeEventIds:unique(connections.lifeEventIds)},updatedAt:now()}}

export function reviewDocument(record:DocumentAuthorityRecord,decision:ReviewDecision,actor:string,note?:string):DocumentAuthorityRecord{
 if(!record.understanding)throw new Error('Understanding must be authored before review.');
 const at=now();return{...record,state:decision,reviews:[...record.reviews,{decision,by:actor,at,note}],history:[...record.history,{id:id('history'),at,by:actor,event:decision,note}],updatedAt:at};
}

export function archiveDocument(record:DocumentAuthorityRecord,actor:string,note?:string):DocumentAuthorityRecord{
 const at=now();return{...record,state:'archived',history:[...record.history,{id:id('history'),at,by:actor,event:'archived',note}],updatedAt:at};
}
