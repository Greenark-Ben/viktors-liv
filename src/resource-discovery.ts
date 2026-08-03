import type{ResourceRecord,ResourceType}from'./authorities/resource';

export type ResourceDiscoveryKind='source'|'retailer'|'library'|'reference';
export interface ResourceDiscoveryAction{id:string;label:string;href:string;kind:ResourceDiscoveryKind;external:true}
export interface ResourceDiscoveryProvider{id:string;types:ResourceType[];resolve(resource:ResourceRecord):ResourceDiscoveryAction|null}

const clean=(value?:string)=>value?.trim()||'';
const isbn=(resource:ResourceRecord)=>clean(resource.locator.isbn).replace(/[-\s]/g,'');
const normaliseUrl=(value?:string):string|null=>{const candidate=clean(value);if(!candidate)return null;if(/^https?:\/\//i.test(candidate)||/^(blob:|data:)/i.test(candidate))return candidate;if(/^www\./i.test(candidate)||/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(candidate))return`https://${candidate}`;return null};
const query=(base:string,value:string)=>`${base}${encodeURIComponent(value)}`;

export const resourceDiscoveryProviders:ResourceDiscoveryProvider[]=[
 {id:'canonical-url',types:['book','website','pdf','legislation','government_guidance','organisation','video','podcast','research','checklist','template','family_guide','external_link'],resolve:resource=>{const href=normaliseUrl(resource.locator.url)||normaliseUrl(resource.locator.fileRef);return href?{id:'canonical-url',label:resource.type==='pdf'?'Öppna PDF':resource.type==='government_guidance'?'Öppna officiell källa':resource.type==='website'||resource.type==='external_link'?'Besök webbplats':'Öppna resurs',href,kind:'source',external:true}:null}},
 {id:'adlibris',types:['book'],resolve:resource=>{const value=isbn(resource);return value?{id:'adlibris',label:'Sök hos Adlibris',href:query('https://www.adlibris.com/se/sok?q=',value),kind:'retailer',external:true}:null}},
 {id:'bokus',types:['book'],resolve:resource=>{const value=isbn(resource);return value?{id:'bokus',label:'Sök hos Bokus',href:query('https://www.bokus.com/cgi-bin/product_search.cgi?search_word=',value),kind:'retailer',external:true}:null}},
 {id:'libris',types:['book'],resolve:resource=>{const value=isbn(resource);return value?{id:'libris',label:'Sök på Libris',href:query('https://libris.kb.se/hitlist?q=linkisxn:',value),kind:'library',external:true}:null}},
 {id:'google-books',types:['book'],resolve:resource=>{const value=isbn(resource);return value?{id:'google-books',label:'Visa i Google Books',href:query('https://books.google.com/books?vid=ISBN',value),kind:'reference',external:true}:null}},
];

export function discoverResourceActions(resource:ResourceRecord):ResourceDiscoveryAction[]{
 const seen=new Set<string>();return resourceDiscoveryProviders.filter(provider=>provider.types.includes(resource.type)).map(provider=>provider.resolve(resource)).filter((action):action is ResourceDiscoveryAction=>Boolean(action)).filter(action=>{if(seen.has(action.href))return false;seen.add(action.href);return true});
}
