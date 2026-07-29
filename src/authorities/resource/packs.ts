import type{ResourcePackRecord,ResourceRecord}from'./contracts';

const now=()=>new Date().toISOString();
const id=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const unique=(values:string[])=>[...new Set(values.map(value=>value.trim()).filter(Boolean))];

export interface CreateResourcePackInput{name:string;description:string;publisher:string;audience?:string[];topics?:string[]}

export function createResourcePack(input:CreateResourcePackInput):ResourcePackRecord{
 const at=now();return{id:id('resource-pack'),version:1,name:input.name.trim(),description:input.description.trim(),publisher:input.publisher.trim(),audience:unique(input.audience||[]),topics:unique(input.topics||[]),status:'draft',items:[],createdAt:at,updatedAt:at};
}

export function addResourceToPack(pack:ResourcePackRecord,resourceId:string,note?:string):ResourcePackRecord{
 if(pack.items.some(item=>item.resourceId===resourceId))return pack;
 return{...pack,items:[...pack.items,{resourceId,note,position:pack.items.length}],updatedAt:now()};
}

export function removeResourceFromPack(pack:ResourcePackRecord,resourceId:string):ResourcePackRecord{
 const items=pack.items.filter(item=>item.resourceId!==resourceId).map((item,position)=>({...item,position}));return{...pack,items,updatedAt:now()};
}

export function publishResourcePack(pack:ResourcePackRecord):ResourcePackRecord{
 if(pack.items.length===0)throw new Error('A resource pack must contain at least one resource before publication.');
 return{...pack,status:'published',updatedAt:now()};
}

export interface InstalledResourcePack{pack:ResourcePackRecord;resources:ResourceRecord[];missingResourceIds:string[]}
export function installResourcePack(pack:ResourcePackRecord,resources:ResourceRecord[]):InstalledResourcePack{
 if(pack.status!=='published')throw new Error('Only published resource packs can be installed.');
 const byId=new Map(resources.map(resource=>[resource.id,resource]));const ordered=pack.items.sort((a,b)=>a.position-b.position);return{pack,resources:ordered.map(item=>byId.get(item.resourceId)).filter((item):item is ResourceRecord=>Boolean(item)),missingResourceIds:ordered.filter(item=>!byId.has(item.resourceId)).map(item=>item.resourceId)};
}
