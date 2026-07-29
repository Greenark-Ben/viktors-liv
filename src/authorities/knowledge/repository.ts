import{assertKnowledgeTopic}from'./invariants';
import type{KnowledgeTopicRecord}from'./contracts';

export const KNOWLEDGE_STORAGE_KEY='liv.knowledge-authority.v1';
export interface KnowledgeTopicRepository{list():KnowledgeTopicRecord[];get(id:string):KnowledgeTopicRecord|undefined;save(record:KnowledgeTopicRecord):void;remove(id:string):void}

export function createLocalKnowledgeTopicRepository(storage:Storage=localStorage):KnowledgeTopicRepository{
 const list=()=>{try{const value=JSON.parse(storage.getItem(KNOWLEDGE_STORAGE_KEY)||'[]');return Array.isArray(value)?value as KnowledgeTopicRecord[]:[]}catch{return[]}};
 return{list,get:id=>list().find(record=>record.id===id),save:record=>{assertKnowledgeTopic(record);const current=list();storage.setItem(KNOWLEDGE_STORAGE_KEY,JSON.stringify(current.some(item=>item.id===record.id)?current.map(item=>item.id===record.id?record:item):[record,...current]));window.dispatchEvent(new CustomEvent('liv:knowledge-changed',{detail:{knowledgeTopicId:record.id}}))},remove:id=>{storage.setItem(KNOWLEDGE_STORAGE_KEY,JSON.stringify(list().filter(record=>record.id!==id)));window.dispatchEvent(new CustomEvent('liv:knowledge-changed',{detail:{knowledgeTopicId:id}}))}};
}
