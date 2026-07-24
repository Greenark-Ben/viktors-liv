import React,{FormEvent,useEffect,useMemo,useState} from 'react';
import ReactDOM from 'react-dom/client';
import {createPortal} from 'react-dom';
import {DaysTimeline} from './days-timeline';
import {ObservationPanel} from './observation-panel';
import './workspace-architecture.css';
import './workspace-shell-polish.css';
import './economy-v2.css';

type Workspace='today'|'person'|'life'|'learning'|'journey'|'knowledge'|'people'|'documents'|'economy';
type NavigationItem={id:Workspace;icon:string;label:string;legacyLabel?:string};
type MoneyItem={id:string;title:string;amount:number;kind:'Inkomst'|'Utgift'|'Stöd';date:string;note:string};
type Budget={activity:number;childBenefit:number;food:number;housing:number;utilities:number;clothes:number;hygiene:number;transport:number;leisure:number;care:number};

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
const defaultBudget:Budget={activity:10699,childBenefit:1250,food:2730,housing:2500,utilities:850,clothes:650,hygiene:450,transport:700,leisure:800,care:300};

function readMoney():MoneyItem[]{try{return JSON.parse(localStorage.getItem('viktors-liv.economy.v1')||'null')||defaultMoney}catch{return defaultMoney}}
function readBudget():Budget{try{return {...defaultBudget,...JSON.parse(localStorage.getItem('viktors-liv.economy-plan.v1')||'{}')}}catch{return defaultBudget}}
function sek(value:number){return new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(value)}
function findShell(){const shell=document.querySelector<HTMLElement>('.shell');return{shell,aside:shell?.querySelector<HTMLElement>('aside')||null,main:shell?.querySelector<HTMLElement>('main')||null}}

function EconomyWorkspace(){
  const [items,setItems]=useState<MoneyItem[]>(readMoney);
  const [budget,setBudget]=useState<Budget>(readBudget);
  const [formOpen,setFormOpen]=useState(false);
  useEffect(()=>localStorage.setItem('viktors-liv.economy.v1',JSON.stringify(items)),[items]);
  useEffect(()=>localStorage.setItem('viktors-liv.economy-plan.v1',JSON.stringify(budget)),[budget]);
  const income=items.filter(item=>item.kind!=='Utgift').reduce((sum,item)=>sum+item.amount,0);
  const expense=items.filter(item=>item.kind==='Utgift').reduce((sum,item)=>sum+item.amount,0);
  const balance=income-expense;
  const retained=income>0?Math.max(0,Math.min(100,Math.round(balance/income*100))):0;
  const plannedIncome=budget.activity+budget.childBenefit;
  const household=budget.food+budget.housing+budget.utilities;
  const personal=budget.clothes+budget.hygiene+budget.transport+budget.leisure+budget.care;
  const living=household+personal;
  const remaining=plannedIncome-living;
  const used=plannedIncome>0?Math.round(living/plannedIncome*100):0;
  const updateBudget=(key:keyof Budget,value:string)=>setBudget(current=>({...current,[key]:Math.max(0,Number(value)||0)}));
  const add=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const title=String(data.get('title')||'').trim();if(!title)return;setItems(current=>[...current,{id:`money-${Date.now()}`,title,amount:Number(data.get('amount')||0),kind:String(data.get('kind')||'Utgift') as MoneyItem['kind'],date:String(data.get('date')||''),note:String(data.get('note')||'')}]);form.reset();setFormOpen(false)};
  const budgetRow=(label:string,key:keyof Budget,tag:string)=><label className="budget-row"><span>{label}</span><input type="number" min="0" value={budget[key]} onChange={event=>updateBudget(key,event.target.value)}/><small>{tag}</small></label>;
  return <main className="economy-v2">
    <header className="economy-v2-header"><div><p>WORKSPACE · 06</p><h1>Ekonomi</h1><span>En tydlig överblick och struktur för familjens ekonomi.</span></div><button className="family-overview">♧ Familjeöversikt</button></header>
    <section className="economy-balance-card"><p className="economy-kicker">VIKTORS EKONOMISKA ÖVERBLICK</p><h2>{sek(balance)}</h2><p>Beräknat kvar efter återkommande utgifter.</p><span className="economy-wallet">▭</span></section>
    <section className="economy-v2-section"><div className="economy-v2-title"><span>01</span><div><h2>Månadens helhet</h2><p>Pengar visas tillsammans med varför de finns och när de förändras.</p></div></div><div className="economy-stat-grid"><article className="economy-stat"><span className="economy-stat-icon">▣</span><div><small>Inkomster</small><strong>{sek(income)}</strong><small>Denna månad</small></div></article><article className="economy-stat expense"><span className="economy-stat-icon">−</span><div><small>Utgifter</small><strong>-{sek(expense)}</strong><small>Denna månad</small></div></article><article className="economy-stat balance"><span className="economy-stat-icon">▭</span><div><small>Kvar att använda</small><strong>{sek(balance)}</strong><small>Efter återkommande</small></div></article></div><div className="economy-progress-wrap"><div className="economy-progress"><i style={{width:`${retained}%`}}/></div><div className="economy-progress-meta"><span>{retained}% av inkomsten kvar</span><span>Mål: 10 000 kr</span></div></div></section>
    <section className="economy-v2-section"><div className="economy-v2-title"><span>02</span><div><h2>Lägg till ekonomisk post</h2><p>Registrera inkomst, utgift eller stöd och varför posten spelar roll.</p></div></div><button className="economy-action-card" onClick={()=>setFormOpen(value=>!value)}><span>＋</span><span><strong>Ny ekonomisk post</strong><small>Inkomst, utgift eller stöd</small></span><span>›</span></button>{formOpen&&<form className="economy-form" onSubmit={add}><div className="economy-form-grid"><label>Rubrik<input name="title" required/></label><label>Belopp<input name="amount" type="number" min="0" required/></label><label>Typ<select name="kind"><option>Inkomst</option><option>Utgift</option><option>Stöd</option></select></label><label>När?<input name="date"/></label></div><label>Förklaring<textarea name="note"/></label><button type="submit">Spara posten</button></form>}</section>
    <section className="economy-v2-section"><div className="economy-v2-title"><span>03</span><div><h2>Återkommande poster</h2><p>Se och hantera inkomster och utgifter som sker regelbundet.</p></div></div><div className="economy-items">{items.map(item=><article className="economy-item" key={item.id}><div><h3>{item.title}</h3><p>{item.note} · {item.date}</p></div><strong className={item.kind==='Utgift'?'negative':''}>{item.kind==='Utgift'?'-':'+'}{sek(item.amount)}</strong><button onClick={()=>setItems(current=>current.filter(candidate=>candidate.id!==item.id))}>Ta bort</button></article>)}</div></section>

    <section className="decision-dashboard" aria-label="Viktors ekonomiska beslutsunderlag">
      <div className="decision-summary-grid"><article><small>INKOMST</small><strong>{sek(plannedIncome)}</strong><p>Aktivitetsersättning + förlängt barnbidrag</p></article><article><small>BERÄKNAD LEVNADSKOSTNAD</small><strong>{sek(living)}</strong><p>Redigerbar arbetsbudget för Viktors faktiska kostnader</p></article><article><small>BIDRAG TILL HUSHÅLLET</small><strong>{sek(household)}</strong><p>Mat, boende och gemensamma hushållskostnader</p></article><article><small>KVAR FÖR VIKTOR</small><strong>{sek(remaining)}</strong><p>Personligt utrymme och långsiktigt sparande</p></article></div>
      <div className="decision-principle"><small>BESLUTSPRINCIP</small><h2>Viktor ska inte finansiera familjens privata skulder. Men han behöver inte heller vara ekonomiskt kostnadsfri när hans egna inkomster är avsedda att bära hans levnadskostnader.</h2></div>
      <div className="decision-columns"><div>
        <article className="decision-card"><header><div><small>01 · INKOMST</small><h3>Nuvarande ersättningar</h3></div><span>DOKUMENTERAD</span></header>{budgetRow('Aktivitetsersättning vid förlängd skolgång','activity','REDIGERBAR')}{budgetRow('Förlängt barnbidrag','childBenefit','REDIGERBAR')}<footer><strong>Total månadsinkomst</strong><b>{sek(plannedIncome)}</b></footer></article>
        <article className="decision-card"><header><div><small>02 · VIKTORS FAKTISKA KOSTNADER</small><h3>Levnadsbudget</h3><p>Beloppen är startvärden och ska justeras mot verkliga kostnader och underlag.</p></div><span>ARBETSUNDERLAG</span></header>{budgetRow('Mat','food','KOV 2026')}{budgetRow('Boendebidrag / hyresandel','housing','BEDÖMNING')}{budgetRow('El, vatten, internet, tv','utilities','BEDÖMNING')}{budgetRow('Kläder och skor','clothes','BEDÖMNING')}{budgetRow('Hygien och förbrukning','hygiene','BEDÖMNING')}{budgetRow('Transport och resor','transport','BEDÖMNING')}{budgetRow('Fritid och aktiviteter','leisure','BEDÖMNING')}{budgetRow('Mediciner / vård / övrigt','care','BEDÖMNING')}<footer><strong>Total levnadskostnad</strong><b>{sek(living)}</b></footer><div className="budget-actions"><button onClick={()=>localStorage.setItem('viktors-liv.economy-plan.v1',JSON.stringify(budget))}>Spara lokalt</button><button className="secondary" onClick={()=>setBudget(defaultBudget)}>Återställ startvärden</button></div></article>
        <article className="decision-card distribution"><header><div><small>03 · FÖRDELNING</small><h3>Vad går till hushållet?</h3></div><span>SPÅRBAR</span></header><div className="distribution-grid"><div><small>HUSHÅLLSBIDRAG</small><strong>{sek(household)}</strong><p>Mat + boende + gemensamma hushållskostnader</p></div><div><small>PERSONLIGA KOSTNADER</small><strong>{sek(personal)}</strong><p>Kläder, hygien, transport, fritid och vård</p></div></div><small>ANDEL AV VIKTORS INKOMST SOM ANVÄNDS</small><div className="decision-progress"><i style={{width:`${Math.min(100,used)}%`}}/></div><p>{sek(living)} av {sek(plannedIncome)} · {used}%</p></article>
      </div><div>
        <article className="decision-card"><header><div><small>04 · NÄSTA BESLUT</small><h3>Förankra upplägget skriftligt</h3></div><span>NÄSTA</span></header><ol className="decision-list"><li>Be Överförmyndaren bekräfta vilka hushållskostnader Viktor får betala ur egna medel när han bor hemma.</li><li>Dokumentera en enkel boendeöverenskommelse eller hyresdel innan bostadstillägg söks.</li><li>Spara underlag: mat, boende, el, resor, kläder, aktiviteter och eventuella merkostnader.</li><li>Separera Viktors pengar och betalningar tydligt i godmansredovisningen.</li></ol></article>
        <article className="decision-card"><header><div><small>05 · MÖJLIGA ERSÄTTNINGAR</small><h3>Kontroller att genomföra</h3></div><span>EJ AVGJORT</span></header><div className="decision-note info"><strong>Bostadstillägg:</strong> kan vara möjligt även när personen bor hos sina föräldrar. Boendekostnaden och boendeformen behöver kunna dokumenteras.</div><div className="decision-note warn"><strong>Merkostnadsersättning:</strong> gäller extra kostnader som beror på funktionsnedsättningen, inte normala levnadskostnader. Försäkringskassan bedömer merkostnaderna individuellt.</div></article>
        <article className="decision-card"><header><div><small>06 · GODMANSGRÄNS</small><h3>Tillåtet syfte</h3></div><span>PRINCIP</span></header><ul className="allowed-list"><li>Viktors mat, boende, kläder, transport, aktiviteter och vård.</li><li>Rimliga och dokumenterade kostnader som faktiskt avser Viktor.</li><li className="no">Familjens konsumtion, privata lån eller kostnader som inte kan kopplas till Viktor.</li></ul></article>
        <article className="remaining-card"><small>KVAR EFTER KOSTNADER</small><strong>{sek(remaining)}</strong><p>Detta kan stanna hos Viktor som buffert, personligt utrymme och framtida sparande. Ett negativt belopp betyder att kostnadsbudgeten överstiger hans inkomster.</p></article>
      </div></div>
      <article className="decision-card sources"><header><div><small>07 · KÄLLOR OCH STATUS</small><h3>Vad dashboarden bygger på</h3></div><span>2026</span></header><p><strong>Konsumentverket:</strong> 2026 års hushållskostnader är vägledning och exempel, inte statistik över faktiska kostnader. Boende, resor, tandvård och medicin ingår inte fullt ut.</p><p><strong>Konsumentverket:</strong> Mat för en vuxen uppskattas till cirka 2 730 kr per månad under 2026.</p><p><strong>Försäkringskassan:</strong> Bostadstillägg kan vara möjligt även för den som bor hos sina föräldrar; boendekostnaden behöver dokumenteras.</p><p><strong>Försäkringskassan:</strong> Merkostnadsersättning gäller extra kostnader på grund av funktionsnedsättning och bedöms individuellt.</p><small>Detta är ett planerings- och dokumentationsverktyg, inte ett myndighetsbeslut eller juridiskt besked. Ändra inte Viktors löpande betalningar förrän upplägget har stämts av med Överförmyndaren och, för bostadstillägg eller merkostnadsersättning, Försäkringskassan.</small></article>
    </section>
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
  const sidebarPortal=useMemo(()=>aside?createPortal(<div className="liv-sidebar-inner"><header className="liv-sidebar-brand"><strong>liv</strong><p>Familjen äger informationen.</p></header><nav className="renaissance-nav" aria-label="Huvudnavigation">{navigation.map(item=><button key={item.id} type="button" className={active===item.id?'active':''} aria-current={active===item.id?'page':undefined} onClick={()=>select(item)}><span aria-hidden="true">{item.icon}</span><b>{item.label}</b></button>)}</nav><footer className="liv-sidebar-user"><span className="liv-user-avatar">B</span><span className="liv-user-copy"><strong>Ben</strong><small>Administratör</small></span><span className="liv-user-chevron">⌄</span></footer></div>,aside):null,[active,aside]);
  const workspacePortal=useMemo(()=>shell?createPortal(<div className={`renaissance-workspaces ${active==='life'||active==='learning'||active==='economy'?'is-open':''}`}><section className="renaissance-workspace life-workspace" hidden={active!=='life'} aria-label="Livet"><header className="renaissance-header"><div><p>WORKSPACE · 02</p><h1>Livet</h1><span>Vad har hänt i Viktors vardag?</span></div><strong>Familjens berättelser</strong></header><div className="renaissance-statement"><p>VIKTORS DAGAR · BEVARADE TILLSAMMANS</p><h2>Ett liv består av vanliga dagar.</h2><span>Här får berättelserna, minnena och de små ögonblicken en lugn plats att leva vidare.</span></div><DaysTimeline/></section><section className="renaissance-workspace learning-workspace" hidden={active!=='learning'} aria-label="Det vi har lärt oss"><header className="renaissance-header"><div><p>WORKSPACE · 03</p><h1>Det vi har lärt oss</h1><span>Vilka mönster kan familjen se över tid?</span></div><strong>Observation, inte diagnos</strong></header><div className="renaissance-statement learning"><p>FÖRSTÅELSE · UNDERLAG · ÖDMJUKHET</p><h2>Små mönster. Alltid med underlag.</h2><span>Liv uppmärksammar återkommande samband. Familjen avgör vad som faktiskt stämmer för Viktor.</span></div><ObservationPanel/></section><section hidden={active!=='economy'} aria-label="Ekonomi"><EconomyWorkspace/></section></div>,shell):null,[active,shell]);
  return <>{sidebarPortal}{workspacePortal}</>
}

const host=document.getElementById('workspace-architecture-root');
if(host)ReactDOM.createRoot(host).render(<React.StrictMode><WorkspaceArchitecture/></React.StrictMode>);