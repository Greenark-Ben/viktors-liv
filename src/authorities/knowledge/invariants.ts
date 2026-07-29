import type{KnowledgeTopicRecord}from'./contracts';

export interface KnowledgeInvariantResult{valid:boolean;reasons:string[]}
export function validateKnowledgeTopic(record:KnowledgeTopicRecord):KnowledgeInvariantResult{
 const reasons:string[]=[];
 if(!record.title.trim())reasons.push('A knowledge topic requires a title.');
 if(!record.description.trim())reasons.push('A knowledge topic requires a plain-language description.');
 const normalised=record.aliases.map(value=>value.trim()).filter(Boolean);
 if(new Set(normalised).size!==normalised.length)reasons.push('Knowledge topic aliases must be unique.');
 return{valid:reasons.length===0,reasons};
}
export function assertKnowledgeTopic(record:KnowledgeTopicRecord):void{const result=validateKnowledgeTopic(record);if(!result.valid)throw new Error(result.reasons.join(' '))}
