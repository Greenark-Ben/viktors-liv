export type ResourceType='book'|'website'|'pdf'|'legislation'|'government_guidance'|'organisation'|'video'|'podcast'|'research'|'checklist'|'template'|'family_guide'|'personal_note'|'external_link';
export type ResourceTrust='unreviewed'|'family_trusted'|'professional'|'official'|'deprecated';
export type ResourceAvailability='available'|'limited'|'unavailable';
export type ResourcePackStatus='draft'|'published'|'retired';

export interface ResourceLocator{url?:string;isbn?:string;fileRef?:string;chapter?:string;section?:string;page?:string;timestamp?:string}
export interface ResourceSource{author?:string;organisation?:string;publisher?:string;edition?:string;publicationDate?:string;language?:string}
export interface ResourceConnections{personIds:string[];documentIds:string[];lifeEventIds:string[];knowledgeTopicIds:string[];decisionIds:string[]}
export interface ResourceReview{trust:ResourceTrust;reviewedBy:string;reviewedAt:string;note?:string}
export interface ResourceHistoryEntry{id:string;at:string;by:string;event:'created'|'updated'|'reviewed'|'connected'|'deprecated'|'restored';note?:string}

export interface ResourceRecord{
 id:string;version:1;title:string;subtitle?:string;type:ResourceType;summary:string;whyThisMatters:string;topics:string[];keywords:string[];audience:string[];source:ResourceSource;locator:ResourceLocator;availability:ResourceAvailability;connections:ResourceConnections;review?:ResourceReview;history:ResourceHistoryEntry[];createdAt:string;updatedAt:string
}

export interface ResourcePackItem{resourceId:string;note?:string;position:number}
export interface ResourcePackRecord{
 id:string;version:1;name:string;description:string;audience:string[];topics:string[];status:ResourcePackStatus;publisher:string;items:ResourcePackItem[];createdAt:string;updatedAt:string
}
