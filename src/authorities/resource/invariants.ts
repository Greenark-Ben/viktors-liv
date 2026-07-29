import type{ResourcePackRecord,ResourceRecord}from'./contracts';

export interface InvariantResult{valid:boolean;reasons:string[]}
const duplicates=(values:string[])=>new Set(values).size!==values.length;

export function validateResource(record:ResourceRecord):InvariantResult{
 const reasons:string[]=[];
 if(!record.title.trim())reasons.push('A resource requires a title.');
 if(!record.summary.trim())reasons.push('A resource requires a plain-language summary.');
 if(!record.whyThisMatters.trim())reasons.push('A resource must explain why it matters.');
 if(record.locator.url){try{new URL(record.locator.url)}catch{reasons.push('Resource URL must be valid.')}}
 if(record.type==='book'&&!record.locator.isbn&&!record.locator.fileRef&&!record.locator.url)reasons.push('A book requires an ISBN, file reference or URL.');
 if(duplicates(record.topics)||duplicates(record.keywords)||duplicates(record.audience))reasons.push('Topics, keywords and audience values must be unique.');
 if(record.review?.trust==='deprecated'&&record.availability!=='unavailable')reasons.push('Deprecated resources must be unavailable.');
 return{valid:reasons.length===0,reasons};
}

export function validateResourcePack(pack:ResourcePackRecord):InvariantResult{
 const reasons:string[]=[];
 if(!pack.name.trim())reasons.push('A resource pack requires a name.');
 if(!pack.description.trim())reasons.push('A resource pack requires a description.');
 if(!pack.publisher.trim())reasons.push('A resource pack requires a publisher.');
 const ids=pack.items.map(item=>item.resourceId);if(duplicates(ids))reasons.push('A resource can appear only once in a pack.');
 const positions=pack.items.map(item=>item.position);if(duplicates(positions))reasons.push('Pack positions must be unique.');
 if(pack.status==='published'&&pack.items.length===0)reasons.push('A published pack must contain resources.');
 return{valid:reasons.length===0,reasons};
}

export function assertResource(record:ResourceRecord):void{const result=validateResource(record);if(!result.valid)throw new Error(result.reasons.join(' '))}
export function assertResourcePack(pack:ResourcePackRecord):void{const result=validateResourcePack(pack);if(!result.valid)throw new Error(result.reasons.join(' '))}
