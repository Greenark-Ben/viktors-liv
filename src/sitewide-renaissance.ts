import './sitewide-renaissance.css';

type LegacyWorkspace='today'|'person'|'journey'|'knowledge'|'people'|'documents';

const labels:Record<LegacyWorkspace,string>={
  today:'Idag',person:'Viktor',journey:'Resan',knowledge:'Kunskap',people:'Människor',documents:'Dokument'
};

let scheduled=false;
let lastWorkspace='';

function syncLegacyWorkspace(){
  scheduled=false;
  const workspace=document.body.dataset.workspace||'today';
  document.documentElement.dataset.livWorkspace=workspace;
  if(!(workspace in labels)||workspace===lastWorkspace)return;
  const label=labels[workspace as LegacyWorkspace];
  const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('.shell > aside > nav:not(.renaissance-nav) button'));
  const target=buttons.find(button=>button.textContent?.includes(label));
  if(!target){scheduleSync();return}
  if(!target.classList.contains('active'))target.click();
  lastWorkspace=workspace;
}

function scheduleSync(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(syncLegacyWorkspace);
}

const observer=new MutationObserver(scheduleSync);
observer.observe(document.body,{attributes:true,attributeFilter:['data-workspace'],childList:true,subtree:true});
window.addEventListener('pageshow',scheduleSync);
window.addEventListener('popstate',scheduleSync);
scheduleSync();
