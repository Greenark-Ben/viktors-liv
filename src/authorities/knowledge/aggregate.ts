import type{KnowledgeTopicRecord}from'./contracts';

const now=()=>new Date().toISOString();
const id=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const unique=(values:string[])=>[...new Set(values.map(value=>value.trim()).filter(Boolean))];

export interface CreateKnowledgeTopicInput{title:string;description:string;category?:string;aliases?:string[];createdBy:string}

export function createKnowledgeTopic(input:CreateKnowledgeTopicInput):KnowledgeTopicRecord{
 const at=now();return{id:id('knowledge'),version:1,title:input.title.trim(),description:input.description.trim(),category:input.category?.trim()||undefined,aliases:unique(input.aliases||[]),status:'active',history:[{id:id('history'),at,by:input.createdBy,event:'created'}],createdAt:at,updatedAt:at};
}

export function updateKnowledgeTopic(record:KnowledgeTopicRecord,patch:Pick<Partial<KnowledgeTopicRecord>,'title'|'description'|'category'|'aliases'>,actor:string,note?:string):KnowledgeTopicRecord{
 const at=now();return{...record,...patch,title:patch.title===undefined?record.title:patch.title.trim(),description:patch.description===undefined?record.description:patch.description.trim(),category:patch.category===undefined?record.category:patch.category.trim()||undefined,aliases:patch.aliases?unique(patch.aliases):record.aliases,history:[...record.history,{id:id('history'),at,by:actor,event:'updated',note}],updatedAt:at};
}

export function archiveKnowledgeTopic(record:KnowledgeTopicRecord,actor:string,note?:string):KnowledgeTopicRecord{const at=now();return{...record,status:'archived',history:[...record.history,{id:id('history'),at,by:actor,event:'archived',note}],updatedAt:at}}
export function restoreKnowledgeTopic(record:KnowledgeTopicRecord,actor:string,note?:string):KnowledgeTopicRecord{const at=now();return{...record,status:'active',history:[...record.history,{id:id('history'),at,by:actor,event:'restored',note}],updatedAt:at}}
