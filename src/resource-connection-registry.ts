import{createLocalKnowledgeTopicRepository}from'./authorities/knowledge';
import type{ResourceConnections}from'./authorities/resource';

export type ConnectionKind=keyof ResourceConnections;
export interface ConnectionOption{id:string;label:string;meta?:string}
export interface ConnectionRegistry{personIds:ConnectionOption[];documentIds:ConnectionOption[];lifeEventIds:ConnectionOption[];knowledgeTopicIds:ConnectionOption[];decisionIds:ConnectionOption[]}

const read=(key:string):unknown[]=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return[]}};
const text=(value:unknown)=>typeof value==='string'?value.trim():'';
const option=(record:any,labelKeys:string[],metaKeys:string[]):ConnectionOption|null=>{const id=text(record?.id);const label=labelKeys.map(key=>text(record?.[key])).find(Boolean);if(!id||!label)return null;const meta=metaKeys.map(key=>text(record?.[key])).filter(Boolean).join(' · ');return{id,label,meta:meta||undefined}};
const options=(records:unknown[],labelKeys:string[],metaKeys:string[])=>records.map(record=>option(record,labelKeys,metaKeys)).filter((value):value is ConnectionOption=>Boolean(value));

export function readResourceConnectionRegistry():ConnectionRegistry{return{
 personIds:options(read('viktors-liv.people.v1'),['name'],['role','organisation','group']),
 documentIds:options(read('viktors-liv.documents.v1'),['title','name'],['issuer','date','type']),
 lifeEventIds:options(read('viktors-liv.journey.v1'),['title','name'],['date','year']),
 knowledgeTopicIds:createLocalKnowledgeTopicRepository().list().filter(topic=>topic.status==='active').map(topic=>({id:topic.id,label:topic.title,meta:[topic.category,topic.description].filter(Boolean).join(' · ')||undefined})),
 decisionIds:options(read('liv.decisions.v1'),['question','title','decision'],['decision','date','decisionDate'])
}}

export const connectionGroups:{kind:ConnectionKind;label:string;empty:string}[]=[
 {kind:'personIds',label:'Personer',empty:'Inga personer finns att koppla ännu.'},
 {kind:'documentIds',label:'Dokument',empty:'Inga dokument finns att koppla ännu.'},
 {kind:'lifeEventIds',label:'Livshändelser',empty:'Inga livshändelser finns att koppla ännu.'},
 {kind:'knowledgeTopicIds',label:'Kunskapsämnen',empty:'Inga aktiva kunskapsämnen finns i Knowledge Authority ännu.'},
 {kind:'decisionIds',label:'Beslut',empty:'Inga beslut finns att koppla ännu.'}
];
