import'./economy-workspace-navigation.css';
type Tab='overview'|'expenses'|'receipts'|'bank'|'matching';
const tabs:[Tab,string][]=[['overview','Översikt'],['expenses','Utlägg'],['receipts','Kvitton'],['bank','Bank'],['matching','Matchning']];
const selectors:Record<Exclude<Tab,'expenses'|'receipts'>,string[]>={
 overview:['#financial-live-dashboard-host','#financial-spend-overview-host'],
 bank:['#financial-transaction-host'],
 matching:['#financial-reconciliation-host']
};
let active:Tab=(sessionStorage.getItem('liv.economy.active-tab.v1')as Tab)||'overview';
const isTab=(value:string|null):value is Tab=>tabs.some(([tab])=>tab===value);
function activate(tab:Tab){
 active=tab;
 sessionStorage.setItem('liv.economy.active-tab.v1',tab);
 const economy=document.querySelector<HTMLElement>('.economy-v2');
 if(!economy)return;
 economy.dataset.economyTab=tab;
 economy.querySelectorAll<HTMLElement>('[data-economy-section]').forEach(node=>{
  const section=node.dataset.economySection;
  node.hidden=section==='activity-host'?!['expenses','receipts'].includes(tab):section!==tab;
 });
 economy.querySelectorAll<HTMLButtonElement>('.economy-workspace-tabs button').forEach(button=>{
  const selected=button.dataset.tab===tab;
  button.setAttribute('aria-selected',String(selected));
  button.tabIndex=selected?0:-1;
 });
}
function sync(){
 const economy=document.querySelector<HTMLElement>('.economy-v2');
 if(!economy){document.querySelector('.economy-workspace-tabs')?.remove();return}
 for(const[tab,list]of Object.entries(selectors)as[Exclude<Tab,'expenses'|'receipts'>,string[]][]){
  for(const selector of list)economy.querySelectorAll<HTMLElement>(selector).forEach(node=>node.dataset.economySection=tab);
 }
 economy.querySelectorAll<HTMLElement>('#financial-activity-host').forEach(node=>node.dataset.economySection='activity-host');
 economy.querySelectorAll<HTMLElement>('#receipt-bulk-import-host').forEach(node=>node.dataset.economySection='receipts');
 let nav=economy.querySelector<HTMLElement>('.economy-workspace-tabs');
 if(!nav){
  nav=document.createElement('nav');
  nav.className='economy-workspace-tabs';
  nav.setAttribute('aria-label','Ekonomins arbetsområden');
  nav.setAttribute('role','tablist');
  nav.addEventListener('click',event=>{
   const button=(event.target as HTMLElement).closest<HTMLButtonElement>('button[data-tab]');
   const tab=button?.dataset.tab||null;
   if(button&&isTab(tab)){event.preventDefault();activate(tab)}
  });
  nav.addEventListener('keydown',event=>{
   const button=(event.target as HTMLElement).closest<HTMLButtonElement>('button[data-tab]');
   const tab=button?.dataset.tab||null;
   if(!button||!isTab(tab)||(event.key!=='ArrowRight'&&event.key!=='ArrowLeft'))return;
   event.preventDefault();
   const index=tabs.findIndex(item=>item[0]===tab);
   const next=tabs[(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length][0];
   activate(next);
   nav?.querySelector<HTMLButtonElement>(`button[data-tab="${next}"]`)?.focus();
  });
  for(const[tab,label]of tabs){
   const button=document.createElement('button');
   button.type='button';
   button.dataset.tab=tab;
   button.textContent=label;
   button.setAttribute('role','tab');
   nav.appendChild(button);
  }
  const first=economy.querySelector('#financial-live-dashboard-host,#financial-spend-overview-host,#financial-activity-host');
  first?economy.insertBefore(nav,first):economy.prepend(nav);
 }
 activate(active);
}
export function startEconomyWorkspaceNavigation():void{
 sync();
 const root=document.getElementById('root');
 if(root)new MutationObserver(sync).observe(root,{childList:true,subtree:true});
}
