import React,{useEffect,useMemo,useState} from 'react';
import './days-timeline.css';
import './life-v2-shell.css';

type Mood='🙂'|'😐'|'☹️';
type Energy='Låg'|'Normal'|'Hög';
type DailyStory={id:string;date:string;createdAt:string;author:string;mood:Mood;story:string;joys:string[];difficulties:string[];energy:Energy;remember:string};

type Moment={icon:string;title:string;description:string;tag:string;kind:'joy'|'hard'|'story'};

const storageKey='liv.daily-stories.v1';
function readStories():DailyStory[]{try{return JSON.parse(localStorage.getItem(storageKey)||'[]')}catch{return []}}
function formatDate(value:string,withWeekday=true){return new Intl.DateTimeFormat('sv-SE',withWeekday?{weekday:'long',day:'numeric',month:'long',year:'numeric'}:{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`))}
function dayLabel(value:string){const today=new Date().toISOString().slice(0,10);return value===today?`Idag – ${formatDate(value,false)}`:formatDate(value,false)}
function moodLabel(mood:Mood){return mood==='🙂'?'Glad':mood==='😐'?'Lugn':'Tung'}
function momentsFor(story:DailyStory):Moment[]{
 const joys=story.joys.map(tag=>({icon:tag.toLowerCase().includes('musik')?'♫':'♡',title:tag,description:`${tag} gjorde dagen bra för Viktor.`,tag,kind:'joy' as const}));
 const hard=story.difficulties.map(tag=>({icon:'○',title:tag,description:`${tag} var svårt eller krävde extra stöd.`,tag,kind:'hard' as const}));
 const narrative=story.story.trim()? [{icon:'✦',title:'Dagens berättelse',description:story.story,tag:'Berättelse',kind:'story' as const}]:[];
 return [...joys,...hard,...narrative];
}

export function DaysTimeline(){
 const [stories,setStories]=useState<DailyStory[]>(readStories),[query,setQuery]=useState(''),[mood,setMood]=useState<'Alla'|Mood>('Alla'),[energy,setEnergy]=useState<'Alla'|Energy>('Alla'),[selected,setSelected]=useState<DailyStory|null>(null);
 useEffect(()=>{const sync=()=>setStories(readStories());window.addEventListener('storage',sync);window.addEventListener('liv:daily-stories-changed',sync as EventListener);return()=>{window.removeEventListener('storage',sync);window.removeEventListener('liv:daily-stories-changed',sync as EventListener)}},[]);
 const filtered=useMemo(()=>[...stories].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).filter(item=>{const haystack=[item.story,item.remember,item.author,...item.joys,...item.difficulties].join(' ').toLowerCase();return(!query||haystack.includes(query.toLowerCase()))&&(mood==='Alla'||item.mood===mood)&&(energy==='Alla'||item.energy===energy)}),[stories,query,mood,energy]);
 useEffect(()=>{if(!selected&&filtered.length)setSelected(filtered[0]);if(selected&&!filtered.some(item=>item.id===selected.id))setSelected(filtered[0]||null)},[filtered,selected]);
 const totalMoments=stories.reduce((sum,item)=>sum+momentsFor(item).length,0);
 const people=new Set(stories.map(item=>item.author).filter(Boolean)).size;
 const createDay=()=>Array.from(document.querySelectorAll<HTMLButtonElement>('.shell aside > nav:not(.renaissance-nav) button')).find(button=>button.textContent?.includes('Idag'))?.click();
 const remove=(id:string)=>{const next=stories.filter(item=>item.id!==id);localStorage.setItem(storageKey,JSON.stringify(next));window.dispatchEvent(new Event('liv:daily-stories-changed'));setStories(next);setSelected(null)};
 const selectedMoments=selected?momentsFor(selected):[];
 return <main className="life-v2">
   <header className="life-v2-header"><div><p>WORKSPACE · 02</p><h1>Livet</h1><span>Dagar, stunder och saker som betyder något i Viktors liv.</span></div><div className="life-header-actions"><button className="life-view-button">▣ Visa som tidslinje</button><button className="life-icon-button" aria-label="Byt vy">▦</button></div></header>
   <section className="life-toolbar"><div className="life-search">⌕<input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Sök i dagar, minnen, aktiviteter…"/></div><select value={energy} onChange={event=>setEnergy(event.target.value as 'Alla'|Energy)}><option value="Alla">Alla energinivåer</option><option>Låg</option><option>Normal</option><option>Hög</option></select><select value={mood} onChange={event=>setMood(event.target.value as 'Alla'|Mood)}><option value="Alla">Alla känslor</option><option value="🙂">Glad</option><option value="😐">Lugn</option><option value="☹️">Tung</option></select><button className="life-create" onClick={createDay}>Skapa ny dag <b>＋</b></button></section>
   <section className="life-stats"><article><i>▣</i><div><strong>{stories.length}</strong><b>Dagar</b><span>Totalt dokumenterade</span></div></article><article><i>♡</i><div><strong>{totalMoments}</strong><b>Stunder</b><span>Betydelsefulla ögonblick</span></div></article><article><i>⌂</i><div><strong>{stories.length?1:0}</strong><b>Platser</b><span>Dokumenterade miljöer</span></div></article><article><i>♙</i><div><strong>{people}</strong><b>Människor</b><span>Personer som berättat</span></div></article></section>
   <section className="life-browser">
    <aside className="life-day-column"><header><h2>Dagar</h2><select><option>Senaste först</option></select></header><div className="life-day-list">{filtered.length===0?<div className="life-empty">Inga dagar matchar filtreringen.</div>:filtered.map(item=>{const moments=momentsFor(item);return <button key={item.id} className={selected?.id===item.id?'selected':''} onClick={()=>setSelected(item)}><span className={`life-mood mood-${item.mood==='🙂'?'good':item.mood==='😐'?'calm':'hard'}`}>{item.mood}</span><div><strong>{dayLabel(item.date)}</strong><small>{item.remember||item.author||'Viktors dag'}</small></div><em>{moments.length} stunder</em></button>})}</div></aside>
    <section className="life-detail">{selected?<><header className="life-detail-header"><span className={`life-mood mood-${selected.mood==='🙂'?'good':selected.mood==='😐'?'calm':'hard'}`}>{selected.mood}</span><div><h2>{dayLabel(selected.date)}</h2><p>{selected.author} · {formatDate(selected.date)}</p></div><button aria-label="Fler val">⋮</button></header><div className="life-detail-body"><h3>Dagens stunder</h3>{selectedMoments.length?<div className="life-moments">{selectedMoments.map((moment,index)=><article key={`${moment.title}-${index}`}><time>{String(9+index*2).padStart(2,'0')}:{index%2?'30':'15'}</time><i className={moment.kind}>{moment.icon}</i><div><strong>{moment.title}</strong><p>{moment.description}</p></div><span className={moment.kind}>{moment.tag}</span></article>)}</div>:<div className="life-empty moments">Inga enskilda stunder dokumenterades den här dagen.</div>}<div className="life-detail-footer"><article><h3>Dagens känsla</h3><div><span className={`life-mood mood-${selected.mood==='🙂'?'good':selected.mood==='😐'?'calm':'hard'}`}>{selected.mood}</span><div><strong>{moodLabel(selected.mood)}</strong><p>Energi: {selected.energy}</p></div></div></article><article><h3>Anteckning</h3><p>{selected.remember||selected.story||'Ingen särskild anteckning sparades.'}</p></article></div><button className="life-delete" onClick={()=>remove(selected.id)}>Ta bort den här dagen</button></div></>:<div className="life-placeholder"><span>♡</span><h2>Den första dagen väntar.</h2><p>När familjen sparar en berättelse på Idag får den en plats här.</p><button onClick={createDay}>Skapa ny dag</button></div>}</section>
   </section>
  </main>;
}