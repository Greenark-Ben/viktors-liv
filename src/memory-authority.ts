export type MemoryEmotion='Glädje'|'Lugn'|'Nyfiken'|'Osäker'|'Ledsen'|'Frustrerad';
export type MemoryPhoto={id:string;name:string;dataUrl:string};
export type MemoryRecord={id:string;title:string;date:string;place:string;story:string;whyItMatters:string;emotion:MemoryEmotion;peopleIds:string[];tags:string[];photos:MemoryPhoto[];changedUs:boolean;createdAt:string;updatedAt:string};

const KEY='liv.memories.v1';

function safeParse<T>(raw:string|null,fallback:T):T{try{return raw?JSON.parse(raw) as T:fallback}catch{return fallback}}
export function readMemories():MemoryRecord[]{const value=safeParse<unknown>(localStorage.getItem(KEY),[]);return Array.isArray(value)?value as MemoryRecord[]:[]}
export function writeMemories(records:MemoryRecord[]){localStorage.setItem(KEY,JSON.stringify(records));window.dispatchEvent(new Event('liv:memories-changed'))}
export function createMemory(input:Omit<MemoryRecord,'id'|'createdAt'|'updatedAt'>):MemoryRecord{const now=new Date().toISOString();return{...input,id:crypto.randomUUID(),createdAt:now,updatedAt:now}}
export function upsertMemory(record:MemoryRecord){const current=readMemories();const next=current.some(item=>item.id===record.id)?current.map(item=>item.id===record.id?{...record,updatedAt:new Date().toISOString()}:item):[record,...current];writeMemories(next)}
export function removeMemory(id:string){writeMemories(readMemories().filter(item=>item.id!==id))}
export function memorySummary(record:MemoryRecord){return{whatHappened:record.story||record.title,whyItMatters:record.whyItMatters,whoWasThere:record.peopleIds}}
