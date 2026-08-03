import'./receipt-list-navigation.css';

const PAGE=10;
let limit=PAGE;
let query='';
let filter='all';
let scheduled=false;

function setText(node:HTMLElement|null,value:string):void{
 if(node&&node.textContent!==value)node.textContent=value;
}

function apply(studio:HTMLElement):void{
 const list=studio.querySelector<HTMLElement>('.receipt-list');
 if(!list)return;
 const rows=[...list.querySelectorAll<HTMLElement>(':scope > article')];
 const matching=rows.filter(row=>{
  const text=(row.textContent||'').toLocaleLowerCase('sv-SE');
  const linked=text.includes('utlägg kopplat');
  return(!query||text.includes(query))&&(filter==='all'||(filter==='linked'&&linked)||(filter==='unlinked'&&!linked));
 });
 rows.forEach(row=>{
  const shouldHide=!matching.includes(row)||matching.indexOf(row)>=limit;
  if(row.hidden!==shouldHide)row.hidden=shouldHide;
 });
 const countText=`Visar ${Math.min(limit,matching.length)} av ${matching.length} kvitton`;
 setText(studio.querySelector<HTMLElement>('.receipt-list-count'),countText);
 const more=studio.querySelector<HTMLButtonElement>('.receipt-load-more');
 if(more){
  const shouldHide=matching.length<=limit;
  if(more.hidden!==shouldHide)more.hidden=shouldHide;
  setText(more,`Ladda fler (${Math.max(0,matching.length-limit)} kvar)`);
 }
}

function sync():void{
 const studio=document.querySelector<HTMLElement>('.receipt-studio');
 if(!studio)return;
 let controls=studio.querySelector<HTMLElement>('.receipt-list-controls');
 if(!controls){
  controls=document.createElement('div');
  controls.className='receipt-list-controls';
  controls.innerHTML='<label><span>Sök kvitto</span><input type="search" placeholder="Butik, filnamn, kategori…"></label><label><span>Status</span><select><option value="all">Alla kvitton</option><option value="unlinked">Behöver kategoriseras</option><option value="linked">Utlägg kopplat</option></select></label><div class="receipt-list-count" aria-live="polite"></div><button type="button" class="receipt-load-more">Ladda fler</button>';
  const list=studio.querySelector('.receipt-list');
  list?.before(controls);
  controls.querySelector<HTMLInputElement>('input')?.addEventListener('input',event=>{
   query=(event.currentTarget as HTMLInputElement).value.trim().toLocaleLowerCase('sv-SE');
   limit=PAGE;
   apply(studio);
  });
  controls.querySelector<HTMLSelectElement>('select')?.addEventListener('change',event=>{
   filter=(event.currentTarget as HTMLSelectElement).value;
   limit=PAGE;
   apply(studio);
  });
  controls.querySelector<HTMLButtonElement>('.receipt-load-more')?.addEventListener('click',()=>{
   limit+=PAGE;
   apply(studio);
  });
 }
 apply(studio);
}

function scheduleSync():void{
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{
  scheduled=false;
  sync();
 });
}

export function startReceiptListNavigation():void{
 sync();
 const root=document.getElementById('root');
 if(!root)return;
 new MutationObserver(mutations=>{
  const relevant=mutations.some(mutation=>[...mutation.addedNodes,...mutation.removedNodes].some(node=>{
   if(!(node instanceof HTMLElement))return false;
   if(node.closest('.receipt-list-controls'))return false;
   return node.matches('.receipt-studio,.receipt-list,.receipt-list>article')||Boolean(node.querySelector('.receipt-studio,.receipt-list,.receipt-list>article'));
  }));
  if(relevant)scheduleSync();
 }).observe(root,{childList:true,subtree:true});
}
