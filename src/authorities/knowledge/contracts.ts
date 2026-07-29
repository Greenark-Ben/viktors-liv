export type KnowledgeTopicStatus='active'|'archived';
export interface KnowledgeTopicHistoryEntry{id:string;at:string;by:string;event:'created'|'updated'|'archived'|'restored';note?:string}
export interface KnowledgeTopicRecord{
 id:string;version:1;title:string;description:string;category?:string;aliases:string[];status:KnowledgeTopicStatus;history:KnowledgeTopicHistoryEntry[];createdAt:string;updatedAt:string
}
