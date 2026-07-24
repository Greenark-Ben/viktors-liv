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

function decorateShell(){
  const shell=document.querySelector<HTMLElement>('.shell');
  const main=shell?.querySelector<HTMLElement>('main');
  if(!shell||!main)return;

  shell.classList.add('liv-shell-v2');
  main.classList.add('liv-workspace');
  Object.values(workspaceClassByTitle).forEach(name=>main.classList.remove(name));
  const title=main.querySelector('.header h1')?.textContent?.trim()||'';
  const workspaceClass=workspaceClassByTitle[title];
  if(workspaceClass)main.classList.add(workspaceClass);

  const nav=shell.querySelector('aside nav');
  nav?.setAttribute('aria-label','Huvudnavigation');
  shell.querySelectorAll<HTMLButtonElement>('aside nav button').forEach((button,index)=>{
    button.style.setProperty('--nav-index',String(index));
    button.setAttribute('aria-current',button.classList.contains('active')?'page':'false');
  });

  const architecture=document.querySelector<HTMLElement>('.renaissance-workspaces');
  architecture?.classList.add('liv-workspace-stage');
}

const observer=new MutationObserver(decorateShell);
observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
decorateShell();
