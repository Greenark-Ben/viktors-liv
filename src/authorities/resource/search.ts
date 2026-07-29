import type{ResourceRecord,ResourceTrust,ResourceType}from'./contracts';

export interface ResourceSearchQuery{text?:string;topics?:string[];types?:ResourceType[];trust?:ResourceTrust[];personId?:string;documentId?:string;knowledgeTopicId?:string;limit?:number}
export interface ResourceSearchResult{resource:ResourceRecord;score:number;reasons:string[]}

const words=(value:string)=>value.toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const overlap=(left:string[],right:string[])=>left.filter(value=>right.includes(value));

export function searchResources(resources:ResourceRecord[],query:ResourceSearchQuery):ResourceSearchResult[]{
 const queryWords=words(query.text||'');const topics=(query.topics||[]).map(topic=>topic.toLocaleLowerCase());
 return resources.flatMap(resource=>{
  if(query.types?.length&&!query.types.includes(resource.type))return[];
  if(query.trust?.length&&(!resource.review||!query.trust.includes(resource.review.trust)))return[];
  if(query.personId&&!resource.connections.personIds.includes(query.personId))return[];
  if(query.documentId&&!resource.connections.documentIds.includes(query.documentId))return[];
  if(query.knowledgeTopicId&&!resource.connections.knowledgeTopicIds.includes(query.knowledgeTopicId))return[];
  const titleWords=words(resource.title);const bodyWords=words(`${resource.summary} ${resource.whyThisMatters} ${resource.keywords.join(' ')}`);const resourceTopics=resource.topics.map(topic=>topic.toLocaleLowerCase());
  const titleMatches=overlap(queryWords,titleWords);const bodyMatches=overlap(queryWords,bodyWords);const topicMatches=overlap(topics,resourceTopics);let score=titleMatches.length*5+topicMatches.length*4+bodyMatches.length*2;
  const reasons:string[]=[];if(titleMatches.length)reasons.push(`Title matches: ${titleMatches.join(', ')}`);if(topicMatches.length)reasons.push(`Topic matches: ${topicMatches.join(', ')}`);if(bodyMatches.length)reasons.push(`Content matches: ${bodyMatches.join(', ')}`);if(resource.review?.trust==='official')score+=3;if(resource.review?.trust==='family_trusted')score+=2;
  if((queryWords.length||topics.length)&&score===0)return[];return[{resource,score,reasons}];
 }).sort((a,b)=>b.score-a.score||a.resource.title.localeCompare(b.resource.title)).slice(0,query.limit||20);
}
