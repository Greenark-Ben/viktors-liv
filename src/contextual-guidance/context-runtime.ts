import{resolveLivContext,type LivContextSnapshot}from'./context-resolution';

export const LIV_CONTEXT_CHANGED_EVENT='liv:context-changed';
let current:LivContextSnapshot|undefined;
let frame=0;

export const getCurrentLivContext=()=>current;
const publish=()=>{
 frame=0;const next=resolveLivContext(document);
 if(current?.fingerprint===next.fingerprint)return;
 current=next;
 document.documentElement.dataset.livWorkspace=next.workspace;
 if(next.mode)document.documentElement.dataset.livContextMode=next.mode;else delete document.documentElement.dataset.livContextMode;
 window.dispatchEvent(new CustomEvent<LivContextSnapshot>(LIV_CONTEXT_CHANGED_EVENT,{detail:next}));
};
const schedule=()=>{if(frame)return;frame=requestAnimationFrame(publish)};

export function startContextResolution():()=>void{
 publish();
 const root=document.getElementById('root');
 if(!root)return()=>undefined;
 const observer=new MutationObserver(records=>{
  if(records.every(record=>record.type==='attributes'&&(record.target as HTMLElement).dataset.contextProjection==='true'))return;
  schedule();
 });
 observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-selected','aria-current','hidden','data-context-object','data-context-id','data-context-label','data-topic']});
 const onNavigation=()=>schedule();
 window.addEventListener('popstate',onNavigation);
 window.addEventListener('hashchange',onNavigation);
 document.addEventListener('click',onNavigation,true);
 return()=>{observer.disconnect();window.removeEventListener('popstate',onNavigation);window.removeEventListener('hashchange',onNavigation);document.removeEventListener('click',onNavigation,true);if(frame)cancelAnimationFrame(frame)};
}

declare global{interface Window{LIV_CONTEXT?:{get:()=>LivContextSnapshot|undefined;resolve:()=>LivContextSnapshot}}}
window.LIV_CONTEXT={get:getCurrentLivContext,resolve:()=>resolveLivContext(document)};
