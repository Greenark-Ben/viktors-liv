import './workspace-shell-polish.css';

const workspaceClassByTitle: Record<string,string> = {
  'Idag':'workspace-today',
  'Lär känna Viktor':'workspace-person',
  'Resan':'workspace-journey',
  'Kunskap':'workspace-knowledge',
  'Människor':'workspace-people',
  'Dokument':'workspace-documents',
  'Ekonomi':'workspace-economy'
};

const workspaceClasses = Object.values(workspaceClassByTitle);
let scheduled = false;

function decorateShell(){
  scheduled = false;
  const shell=document.querySelector<HTMLElement>('.shell');
  const main=shell?.querySelector<HTMLElement>('main');
  if(!shell||!main)return;

  if(!shell.classList.contains('liv-shell-v2')) shell.classList.add('liv-shell-v2');
  if(!main.classList.contains('liv-workspace')) main.classList.add('liv-workspace');

  const title=main.querySelector('.header h1')?.textContent?.trim()||'';
  const desiredWorkspaceClass=workspaceClassByTitle[title];
  workspaceClasses.forEach(name=>{
    const shouldHave=name===desiredWorkspaceClass;
    if(main.classList.contains(name)!==shouldHave) main.classList.toggle(name,shouldHave);
  });

  const nav=shell.querySelector('aside nav');
  if(nav?.getAttribute('aria-label')!=='Huvudnavigation') nav?.setAttribute('aria-label','Huvudnavigation');
  shell.querySelectorAll<HTMLButtonElement>('aside nav button').forEach((button,index)=>{
    const navIndex=String(index);
    if(button.style.getPropertyValue('--nav-index')!==navIndex) button.style.setProperty('--nav-index',navIndex);
    const current=button.classList.contains('active')?'page':'false';
    if(button.getAttribute('aria-current')!==current) button.setAttribute('aria-current',current);
  });

  const architecture=document.querySelector<HTMLElement>('.renaissance-workspaces');
  if(architecture&&!architecture.classList.contains('liv-workspace-stage')) architecture.classList.add('liv-workspace-stage');
}

function scheduleDecorate(){
  if(scheduled)return;
  scheduled=true;
  window.requestAnimationFrame(decorateShell);
}

const observer=new MutationObserver(scheduleDecorate);
observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
scheduleDecorate();
