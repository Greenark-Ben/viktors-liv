export type ReceiptSourceKind='image'|'pdf'|'file_reference'|'url';
export type ReceiptReviewStatus='unreviewed'|'reviewed';
export type ReceiptOcrStatus='not_requested'|'pending'|'completed'|'failed';
export type ReceiptStatus='captured'|'linked'|'voided';

export interface ReceiptSource{kind:ReceiptSourceKind;reference:string;originalName?:string;mimeType?:string;sizeBytes?:number}
export interface ReceiptChecksum{algorithm:'fnv1a32';value:string}
export interface ReceiptHistoryEntry{id:string;at:string;by:string;event:'created'|'metadata_updated'|'linked'|'reviewed'|'ocr_updated'|'voided';note?:string}
export interface ReceiptRecord{
 id:string;
 version:1;
 status:ReceiptStatus;
 source:ReceiptSource;
 checksum:ReceiptChecksum;
 capturedAt:string;
 merchant?:string;
 purchaseDate?:string;
 totalMinorUnits?:number;
 currency:'SEK';
 pages:number;
 ocr:{status:ReceiptOcrStatus;text?:string;error?:string};
 review:{status:ReceiptReviewStatus;reviewedBy?:string;reviewedAt?:string;note?:string};
 financialActivityIds:string[];
 documentIds:string[];
 history:ReceiptHistoryEntry[];
 createdAt:string;
 updatedAt:string;
}
