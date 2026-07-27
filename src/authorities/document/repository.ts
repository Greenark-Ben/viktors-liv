import type{DocumentAuthorityRecord}from'./contracts';

export const DOCUMENT_AUTHORITY_STORAGE_KEY='liv.document-authority.v1';

export interface DocumentAuthorityRepository{list():DocumentAuthorityRecord[];get(id:string):DocumentAuthorityRecord|undefined;save(record:DocumentAuthorityRecord):void;remove(id:string):void}

export function createLocalDocumentAuthorityRepository(storage:Storage=localStorage):DocumentAuthorityRepository{
 const list=()=>{try{const value=JSON.parse(storage.getItem(DOCUMENT_AUTHORITY_STORAGE_KEY)||'[]');return Array.isArray(value)?value as DocumentAuthorityRecord[]:[]}catch{return[]}};
 return{
  list,
  get:id=>list().find(record=>record.id===id),
  save:record=>{const current=list();const index=current.findIndex(item=>item.id===record.id);const next=index<0?[record,...current]:current.map(item=>item.id===record.id?record:item);storage.setItem(DOCUMENT_AUTHORITY_STORAGE_KEY,JSON.stringify(next))},
  remove:id=>storage.setItem(DOCUMENT_AUTHORITY_STORAGE_KEY,JSON.stringify(list().filter(record=>record.id!==id)))
 };
}
