import type{ReceiptRecord}from'./contracts';
import{assertReceipt}from'./invariants';

export const RECEIPT_STORAGE_KEY='liv.receipt-authority.v1';
export const RECEIPT_CHANGE_EVENT='liv:receipts-changed';
export interface ReceiptRepository{list():ReceiptRecord[];get(id:string):ReceiptRecord|undefined;save(record:ReceiptRecord):void}
function read(storage:Storage):ReceiptRecord[]{try{const value=JSON.parse(storage.getItem(RECEIPT_STORAGE_KEY)||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
export function createLocalReceiptRepository(storage:Storage=localStorage):ReceiptRepository{return{list:()=>read(storage),get:id=>read(storage).find(record=>record.id===id),save:record=>{assertReceipt(record);const current=read(storage);storage.setItem(RECEIPT_STORAGE_KEY,JSON.stringify(current.some(item=>item.id===record.id)?current.map(item=>item.id===record.id?record:item):[record,...current]));if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent(RECEIPT_CHANGE_EVENT,{detail:{receiptId:record.id}}))}}}
