export type LivWorkspace='today'|'person'|'journey'|'knowledge'|'people'|'documents'|'economy'|'resources'|'studio'|'unknown';
export type EconomyMode='overview'|'activities'|'receipts'|'bank'|'matching'|'unknown';
export type ContextEvidenceKind='workspace'|'mode'|'heading'|'selection'|'topic'|'route';

export interface ContextEvidence{kind:ContextEvidenceKind;value:string;source:string}
export interface LivContextSnapshot{
 version:1;
 workspace:LivWorkspace;
 mode?:EconomyMode;
 objectType?:string;
 objectId?:string;
 objectLabel?:string;
 topics:string[];
 evidence:ContextEvidence[];
 fingerprint:string;
 resolvedAt:string;
}

const WORKSPACE_LABELS:Record<string,LivWorkspace>={
 'idag':'today','viktor':'person','resan':'journey','kunskap':'knowledge','människor':'people','dokument':'documents','ekonomi':'economy','resurser':'resources'
};
const ECONOMY_LABELS:Record<string,EconomyMode>={
 'översikt':'overview','utlägg':'activities','kvitton':'receipts','bank':'bank','matchning':'matching'
};
const TOPIC_RULES:[RegExp,string][]=[
 [/daglig verksamhet/i,'Daglig verksamhet'],[/lss/i,'LSS'],[/downs syndrom|trisomi 21/i,'Downs syndrom'],[/autism/i,'Autism'],[/akk|alternativ och kompletterande kommunikation/i,'AKK'],[/god man|godmanskap/i,'God man'],[/förvaltare|förvaltarskap/i,'Förvaltarskap'],[/kvitto|inköp|utlägg/i,'Ekonomi'],[/bank|transaktion/i,'Bank'],[/hjälpmedel/i,'Hjälpmedel'],[/anhörig/i,'Anhörigstöd'],[/demens|åldrande/i,'Åldrande och demens']
];
const normalise=(value:string)=>value.trim().toLocaleLowerCase('sv-SE').replace(/\s+/g,' ');
const unique=(values:string[])=>[...new Set(values.filter(Boolean))];
const hash=(value:string)=>{let result=2166136261;for(let index=0;index<value.length;index++){result^=value.charCodeAt(index);result=Math.imul(result,16777619)}return(result>>>0).toString(16).padStart(8,'0')};
const visible=(element:Element)=>{const node=element as HTMLElement;return node.offsetParent!==null&&!node.hidden&&getComputedStyle(node).display!=='none'};
const text=(element:Element|null)=>element?.textContent?.trim()||'';

function resolveWorkspace(root:ParentNode,evidence:ContextEvidence[]):LivWorkspace{
 const active=[...root.querySelectorAll('button,a')].find(element=>visible(element)&&(element.getAttribute('aria-current')==='page'||element.classList.contains('active')||element.classList.contains('selected'))&&WORKSPACE_LABELS[normalise(text(element))]);
 if(active){const label=normalise(text(active));evidence.push({kind:'workspace',value:label,source:'active-navigation'});return WORKSPACE_LABELS[label]}
 const heading=normalise(text(root.querySelector('main h1')));
 if(WORKSPACE_LABELS[heading]){evidence.push({kind:'heading',value:heading,source:'main-h1'});return WORKSPACE_LABELS[heading]}
 if(root.querySelector('.resource-studio')){evidence.push({kind:'workspace',value:'resources',source:'resource-studio'});return'resources'}
 if(root.querySelector('.studio-sidebar')){evidence.push({kind:'workspace',value:'studio',source:'studio-sidebar'});return'studio'}
 return'unknown';
}
function resolveEconomyMode(root:ParentNode,evidence:ContextEvidence[]):EconomyMode|undefined{
 const active=[...root.querySelectorAll('[role="tab"],.economy-workspace-tabs button,button')].find(element=>visible(element)&&(element.getAttribute('aria-selected')==='true'||element.classList.contains('active'))&&ECONOMY_LABELS[normalise(text(element))]);
 if(!active)return undefined;const label=normalise(text(active));evidence.push({kind:'mode',value:label,source:'economy-navigation'});return ECONOMY_LABELS[label];
}
function resolveObject(root:ParentNode,evidence:ContextEvidence[]):Pick<LivContextSnapshot,'objectType'|'objectId'|'objectLabel'>{
 const selected=[...root.querySelectorAll('[data-context-object],[aria-selected="true"],.selected')].find(visible) as HTMLElement|undefined;
 if(!selected)return{};
 const objectType=selected.dataset.contextObject||selected.dataset.type||selected.getAttribute('role')||'selection';
 const objectId=selected.dataset.contextId||selected.id||undefined;
 const objectLabel=selected.dataset.contextLabel||text(selected.querySelector('h2,h3,strong'))||text(selected).slice(0,120)||undefined;
 if(objectLabel)evidence.push({kind:'selection',value:objectLabel,source:objectType});
 return{objectType,objectId,objectLabel};
}
function resolveTopics(root:ParentNode,evidence:ContextEvidence[]):string[]{
 const visibleText=[...root.querySelectorAll('main h1,main h2,main h3,main [data-topic],main .chip,main footer span')].filter(visible).map(element=>`${(element as HTMLElement).dataset.topic||''} ${text(element)}`).join(' · ');
 const topics=TOPIC_RULES.filter(([pattern])=>pattern.test(visibleText)).map(([,topic])=>topic);
 for(const topic of unique(topics))evidence.push({kind:'topic',value:topic,source:'visible-content-rule'});
 return unique(topics).sort((a,b)=>a.localeCompare(b,'sv'));
}
export function resolveLivContext(root:ParentNode=document):LivContextSnapshot{
 const evidence:ContextEvidence[]=[];const workspace=resolveWorkspace(root,evidence);const mode=workspace==='economy'?resolveEconomyMode(root,evidence):undefined;const object=resolveObject(root,evidence);const topics=resolveTopics(root,evidence);
 const canonical=JSON.stringify({workspace,mode:mode||'',objectType:object.objectType||'',objectId:object.objectId||'',objectLabel:object.objectLabel||'',topics});
 return{version:1,workspace,mode,...object,topics,evidence,fingerprint:`ctx-${hash(canonical)}`,resolvedAt:new Date().toISOString()};
}
