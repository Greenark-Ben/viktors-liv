import type{ResourceConnections}from'./authorities/resource';

export type ConnectionKind=keyof ResourceConnections;
export interface ConnectionOption{id:string;label:string;meta?:string}
export interface ConnectionRegistry{personIds:ConnectionOption[];documentIds:ConnectionOption[];lifeEventIds:ConnectionOption[];knowledgeTopicIds:ConnectionOption[];decisionIds:ConnectionOption[]}

const read=(key:string):unknown[]=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return[]}};
const text=(value:unknown)=>typeof value==='string'?value.trim():'';
const option=(record:any,labelKeys:string[],metaKeys:string[]):ConnectionOption|null=>{const id=text(record?.id);const label=labelKeys.map(key=>text(record?.[key])).find(Boolean);if(!id||!label)return null;const meta=metaKeys.map(key=>text(record?.[key])).filter(Boolean).join(' · ');return{id,label,meta:meta||undefined}};
const options=(records:unknown[],labelKeys:string[],metaKeys:string[])=>records.map(record=>option(record,labelKeys,metaKeys)).filter((value):value is ConnectionOption=>Boolean(value));
const merge=(groups:ConnectionOption[][])=>{const seen=new Set<string>();return groups.flat().filter(item=>{if(seen.has(item.id))return false;seen.add(item.id);return true})};

export function readResourceConnectionRegistry():ConnectionRegistry{return{
 personIds:options(read('viktors-liv.people.v1'),['name'],['role','organisation','group']),
 documentIds:options(read('viktors-liv.documents.v1'),['title','name'],['issuer','date','type']),
 lifeEventIds:options(read('viktors-liv.journey.v1'),['title','name'],['date','year']),
 knowledgeTopicIds:merge([
  options(read('liv.knowledge-topics.v1'),['title','name','label'],['category','description']),
  options(read('liv.knowledge.v1'),['title','name','label'],['category','description']),
  options(read('viktors-liv.knowledge.v1'),['title','name','label'],['category','description'])
 ]),
 decisionIds:options(read('liv.decisions.v1'),['question','title','decision'],['decision','date','decisionDate'])
}}

export const connectionGroups:{kind:ConnectionKind;label:string;empty:string}[]=[
 {kind:'personIds',label:'Personer',empty:'Inga personer finns att koppla ännu.'},
 {kind:'documentIds',label:'Dokument',empty:'Inga dokument finns att koppla ännu.'},
 {kind:'lifeEventIds',label:'Livshändelser',empty:'Inga livshändelser finns att koppla ännu.'},
 {kind:'knowledgeTopicIds',label:'Kunskapsämnen',empty:'Inga kunskapsämnen finns att koppla ännu.'},
 {kind:'decisionIds',label:'Beslut',empty:'Inga beslut finns att koppla ännu.'}
];
