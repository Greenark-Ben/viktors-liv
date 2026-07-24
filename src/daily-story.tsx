import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './daily-story.css';

type Mood = '🙂' | '😐' | '☹️';
type Energy = 'Låg' | 'Normal' | 'Hög';
type Session = { identity?: { name?: string; permissions?: string[] } };
type DailyStory = {
  id: string;
  date: string;
  createdAt: string;
  author: string;
  mood: Mood;
  story: string;
  joys: string[];
  difficulties: string[];
  energy: Energy;
  remember: string;
};

const storageKey = 'liv.daily-stories.v1';
const sessionKey = 'liv.identity.session.v1';
const joyOptions = ['Musik','Promenad','Tåg','Familjen','Humor','Ansvar','Hjälpte till'];
const difficultyOptions = ['Höga ljud','Väntan','Förändringar','Många människor','Stress','Trötthet'];

function readStories(): DailyStory[] {
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
}
function readAuthor() {
  try { const session: Session = JSON.parse(localStorage.getItem(sessionKey) || '{}'); return session.identity?.name || 'Familjen'; } catch { return 'Familjen'; }
}
function todayIso() { return new Date().toISOString().slice(0,10); }
function formatDate(value: string) { return new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long'}).format(new Date(`${value}T12:00:00`)); }

function TagPicker({ options, selected, onChange }: { options:string[]; selected:string[]; onChange:(next:string[])=>void }) {
  const toggle = (option:string) => onChange(selected.includes(option) ? selected.filter(item=>item!==option) : [...selected,option]);
  return <div className="story-tags">{options.map(option=><button type="button" key={option} className={selected.includes(option)?'selected':''} onClick={()=>toggle(option)}>{selected.includes(option)?'✓':'+'} {option}</button>)}</div>;
}

function DailyStoryPanel() {
  const [stories,setStories]=useState<DailyStory[]>(readStories);
  const [saved,setSaved]=useState(false);
  const [mood,setMood]=useState<Mood>('🙂');
  const [joys,setJoys]=useState<string[]>([]);
  const [difficulties,setDifficulties]=useState<string[]>([]);
  const [energy,setEnergy]=useState<Energy>('Normal');
  const author=readAuthor();
  const latest=useMemo(()=>[...stories].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,3),[stories]);
  useEffect(()=>localStorage.setItem(storageKey,JSON.stringify(stories)),[stories]);

  const save=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    const story=String(data.get('story')||'').trim();
    const remember=String(data.get('remember')||'').trim();
    if(!story && !remember) return;
    const entry:DailyStory={id:crypto.randomUUID(),date:todayIso(),createdAt:new Date().toISOString(),author,mood,story,joys,difficulties,energy,remember};
    setStories(current=>[entry,...current]);
    form.reset(); setMood('🙂'); setJoys([]); setDifficulties([]); setEnergy('Normal'); setSaved(true);
    window.setTimeout(()=>setSaved(false),2200);
  };

  return <section className="daily-story-section" aria-labelledby="daily-story-title">
    <div className="daily-story-heading"><span>03</span><div><p>VIKTORS DAGAR</p><h2 id="daily-story-title">Hur verkade dagen idag?</h2><small>{formatDate(todayIso())} · skrivs av {author}</small></div></div>
    <div className="daily-story-content">
      <form className="daily-story-form" onSubmit={save}>
        <div className="story-moods" aria-label="Dagens helhetskänsla">{(['🙂','😐','☹️'] as Mood[]).map(option=><button type="button" key={option} className={mood===option?'selected':''} onClick={()=>setMood(option)}>{option}</button>)}</div>
        <label className="story-field"><span>Berätta om dagen</span><small>Vad hände? Hur verkade Viktor må? Vad gjorde honom glad och vad blev svårt?</small><textarea name="story" placeholder="Skriv fritt om dagen..."/></label>
        <div className="story-question"><h3>Det här gjorde Viktor glad idag</h3><TagPicker options={joyOptions} selected={joys} onChange={setJoys}/></div>
        <div className="story-question"><h3>Det här verkade svårt idag</h3><TagPicker options={difficultyOptions} selected={difficulties} onChange={setDifficulties}/></div>
        <div className="story-question"><h3>Energi</h3><div className="energy-options">{(['Låg','Normal','Hög'] as Energy[]).map(option=><button type="button" key={option} className={energy===option?'selected':''} onClick={()=>setEnergy(option)}>{option}</button>)}</div></div>
        <label className="story-field compact"><span>Något jag vill komma ihåg</span><textarea name="remember" placeholder="Ett litet ögonblick, något Viktor sa eller något som gjorde dagen speciell..."/></label>
        <div className="story-save"><button className="primary" type="submit">Spara dagen</button>{saved&&<span>✓ Dagen är sparad</span>}</div>
      </form>
      <aside className="recent-days"><p>TIDIGARE DAGAR</p>{latest.length===0?<div className="story-empty">Den första dagen väntar på att bevaras.</div>:latest.map(entry=><article key={entry.id}><div><strong>{entry.mood}</strong><span>{formatDate(entry.date)}</span></div><p>{entry.remember||entry.story||'En dag i Viktors liv.'}</p><small>Skriven av {entry.author}</small></article>)}</aside>
    </div>
  </section>;
}

const host=document.getElementById('daily-story-root');
if(host){
  ReactDOM.createRoot(host).render(<React.StrictMode><DailyStoryPanel/></React.StrictMode>);
  const place=()=>{
    const main=document.querySelector('.shell main');
    const title=main?.querySelector('.header h1')?.textContent;
    if(main && title==='Idag'){
      if(host.parentElement!==main) main.appendChild(host);
      host.hidden=false;
    } else host.hidden=true;
  };
  new MutationObserver(place).observe(document.body,{childList:true,subtree:true});
  place();
}
