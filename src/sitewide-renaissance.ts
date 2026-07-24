import './sitewide-renaissance.css';

type Workspace='today'|'person'|'life'|'learning'|'journey'|'knowledge'|'people'|'documents'|'economy';
type LegacyWorkspace='today'|'person'|'journey'|'knowledge'|'people'|'documents';

const labels:Record<Workspace,string>={
  today:'Idag',person:'Viktor',life:'Livet',learning:'Det vi har lärt oss',journey:'Resan',knowledge:'Kunskap',people:'Människor',documents:'Dokument',economy:'Ekonomi'
};
const custom=new Set<Workspace>(['life','learning','economy']);

let scheduled=false;
let lastWorkspace='';
let recovering=false;
let requestedWorkspace:Workspace=(document.body.dataset.workspace as Workspace)||'today';

function legacyButtons(){return Array.from(document.querySelectorAll<HTMLButtonElement>('.shell > aside > nav:not(.renaissance-nav) button'))}
function renaissanceButtons(){return Array.from(document.querySelectorAll<HTMLButtonElement>('.renaissance-nav button'))}
function buttonFor(workspace:Workspace,buttons:HTMLButtonElement[]){return buttons.find(button=>button.textContent?.trim().includes(labels[workspace]))}

function recoverCustomWorkspace(workspace:Workspace){
  if(recovering)return;
  const buttons=renaissanceButtons();
  const target=buttonFor(workspace,buttons);
  if(!target)return;
  const surface=document.querySelector('.renaissance-workspaces.is-open');
  if(surface&&document.body.dataset.workspace===workspace)return;
  if(!target.classList.contains('active')){target.click();return}
  const fallback=buttons.find(button=>button!==target&&['Livet','Det vi har lärt oss','Ekonomi'].some(label=>button.textContent?.includes(label)));
  if(!fallback)return;
  recovering=true;
  fallback.click();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    target.click();
    requestedWorkspace=workspace;
    document.body.dataset.workspace=workspace;
    recovering=false;
    scheduleSync();
  }));
}

function syncWorkspace(){
  scheduled=false;
  if(recovering)return;
  const workspace=requestedWorkspace||((document.body.dataset.workspace as Workspace)||'today');
  document.documentElement.dataset.livWorkspace=workspace;
  if(custom.has(workspace)){
    recoverCustomWorkspace(workspace);
    lastWorkspace=workspace;
    return;
  }
  if(workspace===lastWorkspace)return;
  const target=buttonFor(workspace,legacyButtons());
  if(!target){scheduleSync();return}
  if(!target.classList.contains('active'))target.click();
  lastWorkspace=workspace;
}

function scheduleSync(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(syncWorkspace);
}

window.addEventListener('liv:navigate',event=>{
  const detail=(event as CustomEvent<{workspace?:Workspace}>).detail;
  if(!detail?.workspace||!(detail.workspace in labels))return;
  requestedWorkspace=detail.workspace;
  document.body.dataset.workspace=detail.workspace;
  const target=buttonFor(detail.workspace,renaissanceButtons());
  if(target&&!target.classList.contains('active'))target.click();
  scheduleSync();
});

const observer=new MutationObserver(()=>{
  if(!recovering){
    requestedWorkspace=(document.body.dataset.workspace as Workspace)||requestedWorkspace;
    scheduleSync();
  }
});
observer.observe(document.body,{attributes:true,attributeFilter:['data-workspace'],childList:true,subtree:true});
window.addEventListener('pageshow',()=>{requestedWorkspace=(document.body.dataset.workspace as Workspace)||requestedWorkspace;scheduleSync()});
window.addEventListener('popstate',scheduleSync);
scheduleSync();