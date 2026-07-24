import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './days-timeline.css';

type Mood='🙂'|'😐'|'☹️';
type Energy='Låg'|'Normal'|'Hög';
type DailyStory={id:string;date:string;createdAt:string;author:string;mood:Mood;story:string;joys:string[];difficulties:string[];energy:Energy;remember:string};

const storageKey='liv.daily-stories.v1';
function readStories():DailyStory[]{try{return JSON.parse(localStorage.getItem(storageKey)||'[]')}catch{return []}}
function formatDate(value:string){return new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`))}

function DaysTimeline(){
 const [open,setOpen]=useState(false),[stories,setStories]=useState<DailyStory[]>(readStories),[query,setQuery]=useState(''),[mood,setMood]=useState<'Alla'|Mood>('Alla'),[energy,setEnergy]=useState<'Alla'|Energy>('Alla'),[selected,setSelected]=useState<DailyStory|null>(null);
 useEffect(()=>{const sync=()=>setStories(readStories());window.addEventListener('storage',sync);const timer=window.setInterval(sync,1000);return()=>{window.removeEventListener('storage',sync);window.clearInterval(timer)}},[]);
 const filtered=useMemo(()=>[...stories].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).filter(item=>{
   const haystack=[item.story,item.remember,item.author,...item.joys,...item.difficulties].join(' ').toLowerCase();
   return (!query||haystack.includes(query.toLowerCase()))&&(mood==='Alla'||item.mood===mood)&&(energy==='Alla'||item.energy===energy);
 }),[stories,query,mood,energy]);
 const remove=(id:string)=>{const next=stories.filter(item=>item.id!==id);localStorage.setItem(storageKey,JSON.stringify(next));setStories(next);setSelected(null)};
 return <>
   <button className="days-launcher" onClick={()=>setOpen(true)}><span>◷</span><strong>Viktors dagar</strong><small>{stories.length} bevarade dagar</small></button>
   {open&&<div className="days-overlay" role="dialog" aria-modal="true" aria-label="Viktors dagar">
     <div className="days-shell">
       <header><div><p>VIKTORS DAGAR · LIVSLINJEN</p><h1>Dagarna, samlade tillsammans.</h1><span>Bläddra tillbaka, hitta ett ögonblick och förstå sammanhanget kring dagen.</span></div><button onClick={()=>{setOpen(false);setSelected(null)}}>Stäng ×</button></header>
       <div className="days-tools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök i berättelser, minnen och taggar…"/><select value={mood} onChange={e=>setMood(e.target.value as 'Alla'|Mood)}><option>Alla</option><option>🙂</option><option>😐</option><option>☹️</option></select><select value={energy} onChange={e=>setEnergy(e.target.value as 'Alla'|Energy)}><option>Alla</option><option>Låg</option><option>Normal</option><option>Hög</option></select><strong>{filtered.length} dagar</strong></div>
       <main className="days-main">
         <section className="days-list">{filtered.length===0?<div className="days-empty">Inga dagar matchar sökningen ännu.</div>:filtered.map(item=><button key={item.id} className={`day-card ${selected?.id===item.id?'selected':''}`} onClick={()=>setSelected(item)}><span className="day-mood">{item.mood}</span><div><p>{formatDate(item.date)}</p><h2>{item.remember||item.story||'En dag i Viktors liv.'}</h2><small>{item.author} · Energi {item.energy}</small><div className="day-tags">{item.joys.slice(0,3).map(tag=><span key={tag}>♥ {tag}</span>)}{item.difficulties.slice(0,2).map(tag=><span className="hard" key={tag}>○ {tag}</span>)}</div></div></button>)}</section>
         <aside className="day-detail">{selected?<><div className="detail-date"><strong>{selected.mood}</strong><div><p>{formatDate(selected.date)}</p><small>Skriven av {selected.author}</small></div></div><section><span>BERÄTTELSEN</span><p>{selected.story||'Ingen längre berättelse sparades.'}</p></section><section><span>DET SOM GJORDE DAGEN BRA</span><div className="detail-tags">{selected.joys.length?selected.joys.map(tag=><em key={tag}>♥ {tag}</em>):<p>Inga glädjetaggar valdes.</p>}</div></section><section><span>DET SOM VAR SVÅRT</span><div className="detail-tags">{selected.difficulties.length?selected.difficulties.map(tag=><em className="hard" key={tag}>{tag}</em>):<p>Inga svårigheter noterades.</p>}</div></section><section><span>KOM IHÅG</span><p>{selected.remember||'Inget särskilt minne noterades.'}</p></section><section className="detail-meta"><span>ENERGI</span><strong>{selected.energy}</strong></section><button className="delete-day" onClick={()=>remove(selected.id)}>Ta bort den här dagen</button></>:<div className="detail-placeholder"><span>♥</span><h2>Välj en dag.</h2><p>Här visas hela berättelsen och de signaler som familjen sparade.</p></div>}</aside>
       </main>
     </div>
   </div>}
 </>;
}

const host=document.getElementById('days-timeline-root');
if(host)ReactDOM.createRoot(host).render(<React.StrictMode><DaysTimeline/></React.StrictMode>);
