export type TransactionDirection='debit'|'credit';
export type TransactionStatus='imported'|'reviewed'|'voided';
export type TransactionSourceFormat='csv'|'camt053';
export interface FinancialTransactionHistoryEntry{id:string;at:string;by:string;event:'imported'|'reviewed'|'linked'|'unlinked'|'voided';note?:string}
export interface FinancialTransactionRecord{id:string;version:1;status:TransactionStatus;accountId:string;bookedOn:string;valueOn?:string;amount:{currency:'SEK';minorUnits:number};direction:TransactionDirection;counterparty?:string;description:string;bankReference?:string;source:{format:TransactionSourceFormat;fileName:string;importId:string;rowKey:string};fingerprint:string;financialActivityIds:string[];receiptIds:string[];history:FinancialTransactionHistoryEntry[];createdAt:string;updatedAt:string}
export interface FinancialTransactionImportBatch{id:string;version:1;format:TransactionSourceFormat;fileName:string;accountId:string;importedAt:string;importedBy:string;transactionIds:string[];duplicateCount:number;rejectedCount:number}
