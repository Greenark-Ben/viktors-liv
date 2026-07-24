import React,{useEffect,useMemo,useState} from 'react';
import ReactDOM from 'react-dom/client';
import './observation-panel.css';
import {buildObservations,DailyStory,Observation} from './observation-engine';

const storageKey='liv.daily-stories.v1';
const readStories=():DailyStory[]=>{try{return JSON.parse(localStorage.getItem(storageKey)||'[]')}catch{return []}};
const formatDate=(value:string)=>new Intl.DateTimeFormat('sv-SE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`));

function Confidence({observation}:{observation:Observation}){
  const width=`${Math.round(observation.confidence*100)}%`;
  return <div className="observation-confidence"><div><span>SÄKERHET</span><strong>{observation.confidenceLabel}</strong></div><div className="confidence-track"><i style={{width}}/></div><small>{Math.round(observation.confidence*100)}% · baserat på {observation.evidenceCount} dagar</small></div>;
}

function ObservationPanel(){
  const [stories,setStories]=useState<DailyStory[]>(readStories);
  const [selected,setSelected]=useState<Observation|null>(null);
  const observations=useMemo(()=>buildObservations(stories),[stories]);
  const evidence=useMemo(()=>selected?selected.evidenceIds.map(id=>stories.find(story=>story.id===id)).filter(Boolean) as DailyStory[]:[],[selected,stories]);

  useEffect(()=>{
    const refresh=()=>setStories(readStories());
    window.addEventListener('storage',refresh);
    window.addEventListener('liv:daily-stories-changed',refresh as EventListener);
    const timer=window.setInterval(refresh,1200);
    return()=>{window.removeEventListener('storage',refresh);window.removeEventListener('liv:daily-stories-changed',refresh as EventListener);window.clearInterval(timer)};
  },[]);

  return <section className="observation-section" aria-labelledby="observation-title">
    <header className="observation-heading"><span>05</span><div><p>DET VI HAR LAGT MÄRKE TILL</p><h2 id="observation-title">Små mönster över tid.</h2><small>Observationer visar samband i familjens anteckningar. De är inte diagnoser eller beslut.</small></div></header>
    {stories.length<3?<div className="observation-empty"><strong>Vi behöver lite mer tid tillsammans.</strong><p>När minst tre dagar har sparats kan Liv börja visa försiktiga, spårbara observationer.</p><span>{stories.length} av 3 dagar sparade</span></div>:
    observations.length===0?<div className="observation-empty"><strong>Inget tydligt mönster ännu.</strong><p>Det är också värdefull information. Liv väntar hellre än att dra en för snabb slutsats.</p></div>:
    <div className="observation-grid">{observations.map(observation=><article className="observation-card" key={observation.id}><div className="observation-icon">{observation.icon}</div><h3>{observation.title}</h3><p>{observation.explanation}</p><Confidence observation={observation}/><button onClick={()=>setSelected(observation)}>Visa underlag →</button></article>)}</div>}
    <footer className="observation-boundary"><strong>Familjen avgör vad som stämmer.</strong><span>Observation Engine v1 räknar endast återkommande samband i sparade dagar. Ingen extern AI-tjänst eller känslig information lämnar webbläsaren i denna version.</span></footer>
    {selected&&<div className="evidence-backdrop" onClick={()=>setSelected(null)}><aside className="evidence-panel" onClick={event=>event.stopPropagation()}><button className="evidence-close" onClick={()=>setSelected(null)}>×</button><p className="evidence-kicker">UNDERLAG · {selected.evidenceCount} DAGAR</p><h2>{selected.title}</h2><p className="evidence-explanation">{selected.explanation}</p><Confidence observation={selected}/><div className="evidence-list">{evidence.map(day=><article key={day.id}><header><strong>{day.mood}</strong><div><h3>{formatDate(day.date)}</h3><small>Skriven av {day.author}</small></div></header>{day.story&&<p>{day.story}</p>}{day.remember&&<blockquote>“{day.remember}”</blockquote>}<div className="evidence-tags">{day.joys.map(tag=><span key={`j-${tag}`}>♥ {tag}</span>)}{day.difficulties.map(tag=><span className="difficult" key={`d-${tag}`}>◷ {tag}</span>)}</div></article>)}</div></aside></div>}
  </section>;
}

const host=document.getElementById('observation-root');
if(host){
  ReactDOM.createRoot(host).render(<React.StrictMode><ObservationPanel/></React.StrictMode>);
  const place=()=>{
    const timeline=document.getElementById('days-timeline-root');
    if(timeline&&!timeline.hidden&&timeline.parentElement){if(host.parentElement!==timeline.parentElement)timeline.parentElement.appendChild(host);host.hidden=false}else host.hidden=true;
  };
  new MutationObserver(place).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  place();
}
