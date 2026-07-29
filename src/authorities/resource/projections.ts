import type{ResourcePackRecord,ResourceRecord}from'./contracts';

export interface ResourceCardProjection{id:string;title:string;type:string;summary:string;whyThisMatters:string;trust:string;topics:string[];locator:string|null}
export interface UnderstandingResourceProjection{resourceId:string;title:string;reason:string;source:string;locator:string|null;trust:string}
export interface ResourcePackProjection{id:string;name:string;description:string;publisher:string;resourceCount:number;topics:string[];status:string}

const locator=(resource:ResourceRecord)=>resource.locator.url||resource.locator.fileRef||resource.locator.isbn||null;
const source=(resource:ResourceRecord)=>resource.source.organisation||resource.source.author||resource.source.publisher||'Family resource';

export function projectResourceCard(resource:ResourceRecord):ResourceCardProjection{return{id:resource.id,title:resource.title,type:resource.type,summary:resource.summary,whyThisMatters:resource.whyThisMatters,trust:resource.review?.trust||'unreviewed',topics:resource.topics,locator:locator(resource)}}
export function projectUnderstandingResource(resource:ResourceRecord,reason?:string):UnderstandingResourceProjection{return{resourceId:resource.id,title:resource.title,reason:reason||resource.whyThisMatters,source:source(resource),locator:locator(resource),trust:resource.review?.trust||'unreviewed'}}
export function projectResourcePack(pack:ResourcePackRecord):ResourcePackProjection{return{id:pack.id,name:pack.name,description:pack.description,publisher:pack.publisher,resourceCount:pack.items.length,topics:pack.topics,status:pack.status}}
