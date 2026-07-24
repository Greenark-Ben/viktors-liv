import React,{FormEvent,useEffect,useMemo,useState} from 'react';
import ReactDOM from 'react-dom/client';
import {createPortal} from 'react-dom';
import './workspace-architecture.css';
import './workspace-shell-polish.css';
import './economy-v2.css';

type Workspace='today'|'person'|'life'|'learning'|'journey'|'knowledge'|'people'|'documents'|'economy';
type NavigationItem={id:Workspace;icon:string;label:string;legacyLabel?:string};
type MoneyItem={id:string;title:string;amount:number;kind:'Inkomst'|'Utgift'|'Stöd';date:string;note:string};

const navigation:NavigationItem[]=[
  {id:'today',icon:'⌂',label:'Idag',legacyLabel:'Idag'},
  {id:'person',icon:'♡',label:'Viktor',legacyLabel:'Viktor'},
  {id:'life',icon:'▥',label:'Livet'},
  {id:'learning',icon:'✦',label:'Det vi har lärt oss'},
  {id:'journey',icon:'◷',label:'Resan',legacyLabel:'Resan'},
  {id:'knowledge',icon:'▤',label:'Kunskap',legacyLabel:'Kunskap'},
  {id:'people',icon:'♙',label:'Människor',legacyLabel:'Människor'},
  {id:'documents',icon:'▱',label:'Dokument',legacyLabel:'Dokument'},
  {id:'economy',icon:'⊙',label:'Ekonomi'}
];

const defaultMoney:MoneyItem[]=[
  {id:'m1',title:'Aktivitetsersättning',amount:13500,kind:'Inkomst',date:'25:e varje månad',note:'Beräknad månadsinkomst.'},
  {id:'m2',title:'Boende och vardag',amount:4200,kind:'Utgift',date:'Månadsvis',note:'Viktors del av återkommande kostnader.'},
  {id:'m3',title:'Resestöd',amount:1200,kind:'Stöd',date:'Månadsvis',note:'För resor till och från verksamhet.'}
];

function readMoney():MoneyItem[]{try{return JSON.parse(localStorage.getItem('viktors-liv.economy.v1')||'null')||defaultMoney}catch{return defaultMoney}}
function sek(value:number){return new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(value)}
function findShell(){const shell=document.querySelector<HTMLElement>('.shell');return{shell,aside:shell?.querySelector<HTMLElement>('aside')||null,main:shell?.querySelector<HTMLElement>('main')||null}}

function EconomyWorkspace(){
  const [items,setItems]=useState<MoneyItem[]>(readMoney);
  const [formOpen,setFormOpen]=useState(false);
  useEffect(()=>localStorage.setItem('viktors-liv.economy.v1',JSON.stringify(items)),[items]);
  const income=items.filter(item=>item.kind!=='Utgift').reduce((sum,item)=>sum+item.amount,0);
  const expense=items.filter(item=>item.kind==='Utgift').reduce((sum,item)=>sum+item.amount,0);
  const balance=income-expense;
  const retained=income>0?Math.max(0,Math.min(100,Math.round(balance/income*100))):0;
  const add=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const title=String(data.get('title')||'').trim();if(!title)return;setItems(current=>[...current,{id:`money-${Date.now()}`,title,amount:Number(data.get('amount')||0),kind:String(data.get('kind')||'Utgift') as MoneyItem['kind'],date:String(data.get('date')||''),note:String(data.get('note')||'')}]);form.reset();setFormOpen(false)};
  return <main className="economy-v2">
    <header className="economy-v2-header"><div><p>WORKSPACE · 06</p><h1>Ekonomi</h1><span>En tydlig överblick och struktur för familjens ekonomi.</span></div><button className="family-overview">♧ Familjeöversikt</button></header>
    <section className="economy-balance-card"><p className="economy-kicker">VIKTORS EKONOMISKA ÖVERBLICK</p><h2>{sek(balance)}</h2><p>Beräknat kvar efter återkommande utgifter.</p><span className="economy-wallet">▭</span></section>
    <section className="economy-v2-section"><div className="economy-v2-title"><span>01</span><div><h2>Månadens helhet</h2><p>Pengar visas tillsammans med varför de finns och när de förändras.</p></div></div>
      <div className="economy-stat-grid"><article className="economy-stat"><span className="economy-stat-icon">▣</span><div><small>Inkomster</small><strong>{sek(income)}</strong><small>Denna månad</small></div></article><article className="economy-stat expense"><span className="economy-stat-icon">−</span><div><small>Utgifter</small><strong>-{sek(expense)}</strong><small>Denna månad</small></div></article><article className="economy-stat balance"><span className="economy-stat-icon">▭</span><div><small>Kvar att använda</small><strong>{sek(balance)}</strong><small>Efter återkommande</small></div></article></div>
      <div className="economy-progress-wrap"><div className="economy-progress"><i style={{width:`${retained}%`}}/></div><div className="economy-progress-meta"><span>{retained}% av inkomsten kvar</span><span>Mål: 10 000 kr</span></div></div>
    </section>
    <section className="economy-v2-section"><div className="economy-v2-title"><span>02</span><div><h2>Lägg till ekonomisk post</h2><p>Registrera inkomst, utgift eller stöd och varför posten spelar roll.</p></div></div><button className="economy-action-card" onClick={()=>setFormOpen(value=>!value)}><span>＋</span><span><strong>Ny ekonomisk post</strong><small>Inkomst, utgift eller stöd</small></span><span>›</span></button>{formOpen&&<form className="economy-form" onSubmit={add}><div className="economy-form-grid"><label>Rubrik<input name="title" required/></label><label>Belopp<input name="amount" type="number" min="0" required/></label><label>Typ<select name="kind"><option>Inkomst</option><option>Utgift</option><option>Stöd</option></select></label><label>När?<input name="date"/></label></div><label>Förklaring<textarea name="note"/></label><button type="submit">Spara posten</button></form>}</section>
    <section className="economy-v2-section"><div className="economy-v2-title"><span>03</span><div><h2>Återkommande poster</h2><p>Se och hantera inkomster och utgifter som sker regelbundet.</p></div></div><div className="economy-items">{items.map(item=><article className="economy-item" key={item.id}><div><h3>{item.title}</h3><p>{item.note} · {item.date}</p></div><strong className={item.kind==='Utgift'?'negative':''}>{item.kind==='Utgift'?'-':'+'}{sek(item.amount)}</strong><button onClick={()=>setItems(current=>current.filter(candidate=>candidate.id!==item.id))}>Ta bort</button></article>)}</div></section>
  </main>
}

function WorkspaceArchitecture(){
  const [active,setActive]=useState<Workspace>('today');
  const [shell,setShell]=useState<HTMLElement|null>(null);
  const [aside,setAside]=useState<HTMLElement|null>(null);

  useEffect(()=>{let frame=0;const connect=()=>{const current=findShell();if(current.shell&&current.aside){current.shell.classList.add('renaissance-shell','liv-shell-v2');setShell(current.shell);setAside(current.aside);return}frame=requestAnimationFrame(connect)};connect();return()=>cancelAnimationFrame(frame)},[]);
  useEffect(()=>{const {main}=findShell();if(!main)return;const custom=active==='life'||active==='learning'||active==='economy';main.hidden=custom;document.body.dataset.workspace=active},[active]);

  const legacyButtons=()=>Array.from(document.querySelectorAll<HTMLButtonElement>('.shell aside > nav:not(.renaissance-nav) button'));
  const select=(item:NavigationItem)=>{setActive(item.id);if(!item.legacyLabel)return;legacyButtons().find(candidate=>candidate.textContent?.includes(item.legacyLabel!))?.click()};

  const sidebarPortal=useMemo(()=>aside?createPortal(
    <div className="liv-sidebar-inner">
      <header className="liv-sidebar-brand"><strong>liv</strong><p>Familjen äger informationen.</p></header>
      <nav className="renaissance-nav" aria-label="Huvudnavigation">{navigation.map(item=><button key={item.id} type="button" className={active===item.id?'active':''} aria-current={active===item.id?'page':undefined} onClick={()=>select(item)}><span aria-hidden="true">{item.icon}</span><b>{item.label}</b></button>)}</nav>
      <footer className="liv-sidebar-user"><span className="liv-user-avatar">B</span><span className="liv-user-copy"><strong>Ben</strong><small>Administratör</small></span><span className="liv-user-chevron">⌄</span></footer>
    </div>,aside):null,[active,aside]);

  const workspacePortal=useMemo(()=>shell?createPortal(<div className={`renaissance-workspaces ${active==='life'||active==='learning'||active==='economy'?'is-open':''}`}>
    <section className="renaissance-workspace life-workspace" hidden={active!=='life'} aria-label="Livet"><header className="renaissance-header"><div><p>WORKSPACE · 02</p><h1>Livet</h1><span>Vad har hänt i Viktors vardag?</span></div><strong>Familjens berättelser</strong></header><div className="renaissance-statement"><p>VIKTORS DAGAR · BEVARADE TILLSAMMANS</p><h2>Ett liv består av vanliga dagar.</h2><span>Här får berättelserna, minnena och de små ögonblicken en lugn plats att leva vidare.</span></div><div id="life-workspace-content"/></section>
    <section className="renaissance-workspace learning-workspace" hidden={active!=='learning'} aria-label="Det vi har lärt oss"><header className="renaissance-header"><div><p>WORKSPACE · 03</p><h1>Det vi har lärt oss</h1><span>Vilka mönster kan familjen se över tid?</span></div><strong>Observation, inte diagnos</strong></header><div className="renaissance-statement learning"><p>FÖRSTÅELSE · UNDERLAG · ÖDMJUKHET</p><h2>Små mönster. Alltid med underlag.</h2><span>Liv uppmärksammar återkommande samband. Familjen avgör vad som faktiskt stämmer för Viktor.</span></div><div id="learning-workspace-content"/></section>
    <section hidden={active!=='economy'} aria-label="Ekonomi"><EconomyWorkspace/></section>
  </div>,shell):null,[active,shell]);

  return <>{sidebarPortal}{workspacePortal}</>
}

const host=document.getElementById('workspace-architecture-root');
if(host)ReactDOM.createRoot(host).render(<React.StrictMode><WorkspaceArchitecture/></React.StrictMode>);
