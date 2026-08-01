import type{ReceiptRecord}from'./contracts';

export interface ReceiptInvariantResult{valid:boolean;reasons:string[]}
const unique=(values:string[])=>new Set(values).size===values.length;
export function validateReceipt(record:ReceiptRecord):ReceiptInvariantResult{
 const reasons:string[]=[];
 if(!record.id.trim())reasons.push('Receipt requires an id.');
 if(!record.source.reference.trim())reasons.push('Receipt requires an original source reference.');
 if(!record.checksum.value.trim())reasons.push('Receipt requires a checksum.');
 if(!Number.isInteger(record.pages)||record.pages<1)reasons.push('Receipt pages must be a positive integer.');
 if(record.totalMinorUnits!==undefined&&(!Number.isInteger(record.totalMinorUnits)||record.totalMinorUnits<0))reasons.push('Receipt total must be a non-negative integer amount in öre.');
 if(!unique(record.financialActivityIds))reasons.push('Financial activity links must be unique.');
 if(!unique(record.documentIds))reasons.push('Document links must be unique.');
 if(record.review.status==='reviewed'&&(!record.review.reviewedBy?.trim()||!record.review.reviewedAt))reasons.push('Reviewed receipts require reviewer and timestamp.');
 if(record.ocr.status==='completed'&&!record.ocr.text?.trim())reasons.push('Completed OCR requires captured text.');
 if(record.status==='linked'&&record.financialActivityIds.length===0)reasons.push('Linked receipts require at least one financial activity.');
 return{valid:reasons.length===0,reasons};
}
export function assertReceipt(record:ReceiptRecord):void{const result=validateReceipt(record);if(!result.valid)throw new Error(result.reasons.join(' '))}
