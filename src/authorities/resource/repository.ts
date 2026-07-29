import type{ResourcePackRecord,ResourceRecord}from'./contracts';

export const RESOURCE_STORAGE_KEY='liv.resource-authority.v1';
export const RESOURCE_PACK_STORAGE_KEY='liv.resource-packs.v1';

export interface Repository<T>{list():T[];get(id:string):T|undefined;save(record:T&{id:string}):void;remove(id:string):void}

function createLocalRepository<T extends{id:string}>(key:string,storage:Storage):Repository<T>{
 const list=()=>{try{const value=JSON.parse(storage.getItem(key)||'[]');return Array.isArray(value)?value as T[]:[]}catch{return[]}};
 return{list,get:id=>list().find(record=>record.id===id),save:record=>{const current=list();storage.setItem(key,JSON.stringify(current.some(item=>item.id===record.id)?current.map(item=>item.id===record.id?record:item):[record,...current]))},remove:id=>storage.setItem(key,JSON.stringify(list().filter(record=>record.id!==id)))};
}

export const createLocalResourceRepository=(storage:Storage=localStorage)=>createLocalRepository<ResourceRecord>(RESOURCE_STORAGE_KEY,storage);
export const createLocalResourcePackRepository=(storage:Storage=localStorage)=>createLocalRepository<ResourcePackRecord>(RESOURCE_PACK_STORAGE_KEY,storage);
