export type FinancialActivityKind='purchase'|'expense'|'reimbursement'|'correction';
export type FinancialActivityStatus='registered'|'reviewed'|'reported'|'voided';
export type FinancialPayerKind='viktor'|'family'|'guardian'|'other';
export type ReimbursementStatus='not_applicable'|'pending'|'reimbursed';
export type PaymentMethod='card'|'cash'|'bank_transfer'|'invoice'|'swish'|'other';

export interface FinancialAmount{currency:'SEK';minorUnits:number}
export interface FinancialActivityLine{id:string;description:string;category:string;quantity:number;amount:FinancialAmount;note?:string}
export interface FinancialEvidenceReference{id:string;kind:'receipt'|'invoice'|'bank_record'|'other';documentId?:string;fileRef?:string;label:string}
export interface FinancialActivityHistoryEntry{id:string;at:string;by:string;event:'created'|'updated'|'reviewed'|'reported'|'reimbursed'|'corrected'|'voided';note?:string}
export interface FinancialActivityConnections{personIds:string[];documentIds:string[];decisionIds:string[]}

export interface FinancialActivityRecord{
 id:string;
 version:1;
 kind:FinancialActivityKind;
 status:FinancialActivityStatus;
 occurredOn:string;
 merchant:string;
 description:string;
 payer:{kind:FinancialPayerKind;name?:string};
 paymentMethod:PaymentMethod;
 total:FinancialAmount;
 lines:FinancialActivityLine[];
 evidence:FinancialEvidenceReference[];
 reimbursement:{status:ReimbursementStatus;amount?:FinancialAmount;reimbursedOn?:string;note?:string};
 connections:FinancialActivityConnections;
 reportingPeriodId?:string;
 correctionOfId?:string;
 history:FinancialActivityHistoryEntry[];
 createdAt:string;
 updatedAt:string;
}

export interface FinancialReportingPeriod{
 id:string;
 version:1;
 title:string;
 startsOn:string;
 endsOn:string;
 status:'open'|'closed';
 activityIds:string[];
 createdAt:string;
 closedAt?:string;
}
