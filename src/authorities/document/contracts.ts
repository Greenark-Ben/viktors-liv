export type DocumentAuthorityState='draft'|'evidence_attached'|'understanding_authored'|'reviewed'|'accepted'|'archived';
export type EvidenceKind='pdf'|'photo'|'email'|'letter'|'meeting_notes'|'audio'|'video'|'other';
export type DocumentCategory='municipality'|'healthcare'|'school'|'support'|'finance'|'legal'|'other';
export type DocumentStatus='new'|'active'|'superseded'|'closed';
export type ImpactKind='positive'|'negative'|'neutral'|'needs_decision';
export type ActionKind='review'|'reply'|'book'|'appeal'|'choose'|'contact'|'none'|'other';
export type ReviewDecision='reviewed'|'accepted';

export interface DocumentIdentity{title:string;issuer:string;category:DocumentCategory;status:DocumentStatus;issuedDate?:string;effectiveDate?:string}
export interface DocumentEvidence{id:string;kind:EvidenceKind;name:string;mimeType?:string;dataUrl?:string;note?:string;addedAt:string;addedBy:string}
export interface DocumentUnderstanding{plainLanguage:string;whyItMatters:string;whatChanged:string;authoredBy:string;authoredAt:string;revision:number}
export interface DocumentImpact{kind:ImpactKind;summary:string;affectedPersonIds:string[]}
export interface DocumentAction{id:string;kind:ActionKind;title:string;ownerPersonId?:string;dueDate?:string;completedAt?:string}
export interface DocumentConnections{personIds:string[];memoryIds:string[];knowledgeIds:string[];lifeEventIds:string[]}
export interface DocumentHistoryEntry{id:string;at:string;by:string;event:'created'|'evidence_added'|'understanding_authored'|'reviewed'|'accepted'|'archived';note?:string}
export interface DocumentReview{decision:ReviewDecision;by:string;at:string;note?:string}

export interface DocumentAuthorityRecord{
 id:string;version:1;state:DocumentAuthorityState;identity:DocumentIdentity;evidence:DocumentEvidence[];understanding?:DocumentUnderstanding;impact?:DocumentImpact;actions:DocumentAction[];connections:DocumentConnections;reviews:DocumentReview[];history:DocumentHistoryEntry[];createdAt:string;updatedAt:string
}
