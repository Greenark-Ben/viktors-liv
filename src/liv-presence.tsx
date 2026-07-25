import React,{useEffect,useMemo,useState} from 'react';
import './liv-presence.css';

type Destination='today'|'person'|'life'|'learning'|'action'|'journey'|'knowledge'|'people'|'documents'|'economy';
type NextStep={id:string;title:string;description:string;owner:string;due:string;status:string;sourceType:string;sourceLabel:string};
type Meeting={id:string;title:string;date:string;with:string;purpose:string;status:string};
type Decision={id:string;question:string;decision:string;reason:string;date:string;reviewDate:string;status:string;participants:string};
type DailyStory={id:string;date:string;joys:string[];difficulties:string[];story:string;remember:string};
type DocumentItem={id:string;title:string;issuer:string;date:string;status:string;meaning:string;next:string};
type Notice={id:string;kind:'Fakta'|'Observation'|'Familjens tolkning';title:string;copy:string;why:string;source:string;destination:Destination;date?:string;priority:number};
type Memory={id:string;date:string;decision:string;question:string;reason:string;participants:string};

const read=<T,>(key:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}};
const today=()=>new Date().toISOString().slice(0,10);
const daysFromNow=(value:string)=>{if(!value)return Number.POSITIVE_INFINITY;const start=new Date(`${today()}T12:00:00`).getTime(),end=new Date(`${value}T12:00:00`).getTime();return Math.ceil((end-start)/86400000)};
const humanDate=(value?:string)=>value?new Intl.DateTimeFormat('sv-SE',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`)):'Datum saknas';
const greeting=()=>{const hour=new Date().getHours();return hour<10?'God morgon':hour<17?'God eftermiddag':'God kväll'};

function buildNotices():Notice[]{
 const steps=read<NextStep[]>('liv.next-steps.v1',[]),meetings=read<Meeting[]>('liv.meetings.v1',[]),decisions=read<Decision[]>('liv.decisions.v1',[]),stories=read<DailyStory[]>('liv.daily-stories.v1',[]),documents=read<DocumentItem[]>('viktors-liv.documents.v1',[]);
 const notices:Notice[]=[];
 steps.filter(x=>x.status!=='Klar').forEach(x=>{const remaining=daysFromNow(x.due);notices.push({id:`step:${x.id}`,kind:'Fakta',title:x.title,copy:x.owner?`${x.owner} ansvarar. ${remaining<0?'Datumet har passerat.':remaining===0?'Behöver göras idag.':remaining<=7?`${remaining} dagar kvar.`:'Ett öppet nästa steg.'}`:'Ett öppet nästa steg saknar ansvarig.',why:`Sparas som nästa steg från ${x.sourceType||'Familjen'} · ${x.sourceLabel||'utan namngiven källa'}.`,source:'Nästa steg',destination:'action',date:x.due,priority:remaining<0?100:remaining<=3?90:remaining<=7?75:55})});
 meetings.filter(x=>x.status==='Planerat').forEach(x=>{const remaining=daysFromNow(x.date);notices.push({id:`meeting:${x.id}`,kind:'Fakta',title:x.title,copy:`Möte med ${x.with||'deltagare ej angivna'}. ${x.purpose||'Syfte är ännu inte beskrivet.'}`,why:'Mötet är markerat som planerat i Handling.',source:'Möten',destination:'action',date:x.date,priority:remaining<0?95:remaining<=3?85:remaining<=7?70:45})});
 decisions.filter(x=>x.status==='Aktivt'&&x.reviewDate).forEach(x=>{const remaining=daysFromNow(x.reviewDate);if(remaining<=14)notices.push({id:`decision:${x.id}`,kind:'Fakta',title:'Ett beslut behöver följas upp.',copy:x.decision,why:`Beslutets omprövningsdatum är ${humanDate(x.reviewDate)}.`,source:'Beslut',destination:'action',date:x.reviewDate,priority:remaining<0?92:remaining<=3?82:65})});
 documents.filter(x=>x.status!=='Klart'&&x.next).forEach(x=>notices.push({id:`document:${x.id}`,kind:'Fakta',title:x.title,copy:x.next,why:`Dokument från ${x.issuer||'okänd avsändare'} har en sparad nästa handling.`,source:'Dokument',destination:'documents',date:x.date,priority:50}));
 if(stories.length>=3){
  const recent=[...stories].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7),joyCounts=new Map<string,number>(),difficultyCounts=new Map<string,number>();
  recent.forEach(day=>{day.joys.forEach(tag=>joyCounts.set(tag,(joyCounts.get(tag)||0)+1));day.difficulties.forEach(tag=>difficultyCounts.set(tag,(difficultyCounts.get(tag)||0)+1))});
  const topJoy=[...joyCounts.entries()].sort((a,b)=>b[1]-a[1])[0],topDifficulty=[...difficultyCounts.entries()].sort((a,b)=>b[1]-a[1])[0];
  if(topJoy&&topJoy[1]>=3)notices.push({id:`pattern:joy:${topJoy[0]}`,kind:'Observation',title:`${topJoy[0]} återkommer under bra dagar.`,copy:`Det finns med i ${topJoy[1]} av de ${recent.length} senast sparade dagarna.`,why:'Liv räknar endast återkommande taggar i familjens egna daganteckningar. Detta är inte en slutsats eller rekommendation.',source:'Det vi har lärt oss',destination:'learning',priority:48});
  if(topDifficulty&&topDifficulty[1]>=3)notices.push({id:`pattern:difficulty:${topDifficulty[0]}`,kind:'Observation',title:`${topDifficulty[0]} har återkommit flera gånger.`,copy:`Det finns med i ${topDifficulty[1]} av de ${recent.length} senast sparade dagarna.`,why:'Liv visar sambandet så att familjen kan avgöra om det faktiskt betyder något.',source:'Det vi har lärt oss',destination:'learning',priority:47});
 }
 return notices.sort((a,b)=>b.priority-a.priority);
}

export function LivPresence({navigate}:{navigate:(destination:Destination)=>void}){
 const[version,setVersion]=useState(0),[acknowledged,setAcknowledged]=useState<string[]>(()=>read('liv.presence-ack.v1',[]));
 useEffect(()=>{localStorage.setItem('liv.presence-ack.v1',JSON.stringify(acknowledged))},[acknowledged]);
 useEffect(()=>{const refresh=()=>setVersion(x=>x+1);window.addEventListener('storage',refresh);window.addEventListener('liv:daily-stories-changed',refresh as EventListener);return()=>{window.removeEventListener('storage',refresh);window.removeEventListener('liv:daily-stories-changed',refresh as EventListener)}},[]);
 const notices=useMemo(()=>buildNotices(),[version]);
 const visible=notices.filter(x=>!acknowledged.includes(x.id)).slice(0,3);
 const memories=useMemo(()=>read<Decision[]>('liv.decisions.v1',[]).filter(x=>x.status!=='Ersatt').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4).map<Memory>(x=>({id:x.id,date:x.date,decision:x.decision,question:x.question,reason:x.reason,participants:x.participants})),[version]);
 const acknowledge=(id:string)=>setAcknowledged(current=>current.includes(id)?current:[...current,id]);
 return <main className="liv-presence-page">
  <header className="liv-presence-header"><div><p>WORKSPACE · LIV</p><h1>{greeting()}.</h1><span>En lugn överblick över det familjen redan har sparat.</span></div><strong>Familjen avgör</strong></header>
  <section className="liv-presence-statement"><p>LIV UPPMÄRKSAMMAR · FAMILJEN AVGÖR</p><h2>{visible.length?`Det finns ${visible.length===1?'en sak':`${visible.length} saker`} att titta på.`:'Inget kräver er uppmärksamhet just nu.'}</h2><span>Liv fattar inga beslut och ger inga rekommendationer. Varje sak kan öppnas tillbaka till sitt underlag.</span></section>
  <section className="liv-presence-section"><header><span>01</span><div><p>DAGENS LUGNA ÖVERBLICK</p><h2>Det här ser Liv.</h2><small>Högst tre saker visas åt gången. Redan förstådda saker hålls undan.</small></div></header>
   <div className="liv-notices">{visible.map(item=><article key={item.id}><div className={`liv-kind ${item.kind==='Observation'?'observation':''}`}>{item.kind}</div><h3>{item.title}</h3><p>{item.copy}</p>{item.date&&<time>{humanDate(item.date)}</time>}<details><summary>Varför visas detta?</summary><p>{item.why}</p><small>Källa · {item.source}</small></details><footer><button onClick={()=>navigate(item.destination)}>Öppna underlag →</button><button className="quiet" onClick={()=>acknowledge(item.id)}>Jag har förstått</button></footer></article>)}{visible.length===0&&<div className="liv-calm"><span>✓</span><div><h3>Familjen har kontroll.</h3><p>Liv väntar hellre än att fylla ytan med sådant som inte kräver er uppmärksamhet.</p></div></div>}</div>
  </section>
  <section className="liv-presence-section memory"><header><span>02</span><div><p>FAMILY MEMORY</p><h2>Varför gjorde vi så här?</h2><small>Beslut bevaras tillsammans med frågan, motiveringen och människorna som deltog.</small></div></header>
   <div className="liv-memory-list">{memories.map(memory=><article key={memory.id}><time>{humanDate(memory.date)}</time><small>{memory.question||'Familjens beslut'}</small><blockquote>{memory.decision}</blockquote><div><b>VARFÖR</b><p>{memory.reason||'Ingen motivering sparades när beslutet togs.'}</p></div><footer>{memory.participants||'Deltagare saknas'}<button onClick={()=>navigate('action')}>Öppna beslut →</button></footer></article>)}{memories.length===0&&<div className="liv-calm"><span>◇</span><div><h3>Inga beslut är sparade ännu.</h3><p>När familjen fattar ett beslut bevaras både vad och varför här.</p></div></div>}</div>
  </section>
  <footer className="liv-presence-boundary"><strong>Liv föreslår aldrig ett beslut.</strong><span>All sammanställning sker lokalt i webbläsaren från familjens sparade uppgifter. Ingen extern AI-tjänst används i denna version.</span></footer>
 </main>
}
