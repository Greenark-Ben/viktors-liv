import type{ResourceConnections,ResourceRecord,ResourceReview,ResourceType}from'./contracts';

const now=()=>new Date().toISOString();
const id=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const unique=(values:string[])=>[...new Set(values.map(value=>value.trim()).filter(Boolean))];

export interface CreateResourceInput{title:string;type:ResourceType;summary:string;whyThisMatters:string;createdBy:string}

export function createResource(input:CreateResourceInput):ResourceRecord{
 const at=now();return{id:id('resource'),version:1,title:input.title.trim(),type:input.type,summary:input.summary.trim(),whyThisMatters:input.whyThisMatters.trim(),topics:[],keywords:[],audience:[],source:{},locator:{},availability:'available',connections:{personIds:[],documentIds:[],lifeEventIds:[],knowledgeTopicIds:[],decisionIds:[]},history:[{id:id('history'),at,by:input.createdBy,event:'created'}],createdAt:at,updatedAt:at};
}

export function updateResource(record:ResourceRecord,patch:Partial<Omit<ResourceRecord,'id'|'version'|'history'|'createdAt'|'updatedAt'>>,actor:string,note?:string):ResourceRecord{
 const at=now();return{...record,...patch,topics:patch.topics?unique(patch.topics):record.topics,keywords:patch.keywords?unique(patch.keywords):record.keywords,audience:patch.audience?unique(patch.audience):record.audience,history:[...record.history,{id:id('history'),at,by:actor,event:'updated',note}],updatedAt:at};
}

export function connectResource(record:ResourceRecord,connections:ResourceConnections,actor:string):ResourceRecord{
 const at=now();const normalized={personIds:unique(connections.personIds),documentIds:unique(connections.documentIds),lifeEventIds:unique(connections.lifeEventIds),knowledgeTopicIds:unique(connections.knowledgeTopicIds),decisionIds:unique(connections.decisionIds)};return{...record,connections:normalized,history:[...record.history,{id:id('history'),at,by:actor,event:'connected'}],updatedAt:at};
}

export function reviewResource(record:ResourceRecord,review:Omit<ResourceReview,'reviewedAt'>):ResourceRecord{
 const at=now();return{...record,review:{...review,reviewedAt:at},history:[...record.history,{id:id('history'),at,by:review.reviewedBy,event:'reviewed',note:review.note}],updatedAt:at};
}

export function deprecateResource(record:ResourceRecord,actor:string,note:string):ResourceRecord{
 const at=now();return{...record,availability:'unavailable',review:{trust:'deprecated',reviewedBy:actor,reviewedAt:at,note},history:[...record.history,{id:id('history'),at,by:actor,event:'deprecated',note}],updatedAt:at};
}
