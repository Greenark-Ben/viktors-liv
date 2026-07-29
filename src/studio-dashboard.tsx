import React,{useMemo,useState} from 'react';
import {PeopleStudio} from './people-studio';
import {MemoryStudio} from './memory-studio';
import {KnowledgeStudio} from './knowledge-studio';
import './studio-shell.css';

type Destination='people'|'relations'|'documents'|'knowledge'|'journey'|'person'|'economy';
type Props={navigate:(destination:Destination)=>void};

function count(key:string){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value.length:0}catch{return 0}}
function profileReady(){try{const value=JSON.parse(localStorage.getItem('viktors-liv.person.v2')||'{}');return Boolean(value?.name||value?.biography||value?.about)}catch{return false}}

export function StudioDashboard({navigate}:Props){
 const[workspace,setWorkspace]=useState<'dashboard'|'people'|'memories'|'knowledge'>('dashboard');
 const cards=useMemo(()=>[
  {id:'people' as const,n:'01',title:'Människor',count:count('viktors-liv.people.v1'),unit:'personer',copy:'Relationer, ansvar och vad varje person behöver förstå.',state:'People Studio'},
  {id:'memories' as const,n:'02',title:'Minnen',count:count('liv.memories.v1'),unit:'bevarade ögonblick',copy:'Berättelser, fotografier, människor och varför ett ögonblick betyder något.',state:'Memory Authority'},
  {id:'relations' as const,n:'03',title:'Relationer',count:count('liv.relationships.v1'),unit:'kopplingar',copy:'Gör sammanhanget mellan människor, beslut och händelser tydligt.',state:'Arbetsyta redo'},
  {id:'documents' as const,n:'04',title:'Dokument',count:count('viktors-liv.documents.v1'),unit:'underlag',copy:'Förvandla dokument till innebörd, påverkan och nästa handling.',state:'Arbetsyta redo'},
  {id:'knowledge' as const,n:'05',title:'Kunskap',count:count('liv.knowledge-authority.v1'),unit:'kunskapsämnen',copy:'Förvalta det familjen uttryckligen vill förstå, med tydlig beskrivning och historik.',state:'Knowledge Studio'},
  {id:'journey' as const,n:'06',title:'Tidslinje',count:count('viktors-liv.journey.v1'),unit:'livshändelser',copy:'Underhåll de händelser som formar Viktors berättelse.',state:'Arbetsyta redo'},
  {id:'person' as const,n:'07',title:'Viktors profil',count:profileReady()?1:0,unit:profileReady()?'profil':'profil saknas',copy:'Vem Viktor är, vad som skapar glädje och vad som ger trygghet.',state:profileReady()?'Grund finns':'Behöver innehåll'},
  {id:'economy' as const,n:'08',title:'Ekonomi',count:0,unit:'privat domän',copy:'Familjens ekonomiska överblick hålls separerad från delade erfarenheter.',state:'Skyddad'}
 ],[]);
 if(workspace==='people')return <div><button className="studio-back" onClick={()=>setWorkspace('dashboard')}>← Till Studioöversikten</button><PeopleStudio/></div>;
 if(workspace==='memories')return <div><button className="studio-back" onClick={()=>setWorkspace('dashboard')}>← Till Studioöversikten</button><MemoryStudio/></div>;
 if(workspace==='knowledge')return <div><button className="studio-back" onClick={()=>setWorkspace('dashboard')}>← Till Studioöversikten</button><KnowledgeStudio/></div>;
 const ready=cards.filter(card=>card.count>0||card.id==='economy').length;
 const open=(destination:typeof cards[number]['id'])=>destination==='people'?setWorkspace('people'):destination==='memories'?setWorkspace('memories'):destination==='knowledge'?setWorkspace('knowledge'):navigate(destination);
 return <main className="studio-page">
  <header className="studio-hero"><div><p>LIV RENAISSANCE · STUDIO</p><h1>God morgon, Ben.</h1><span>Här bygger och underhåller familjen den förståelse som LIV använder.</span></div><div className="studio-progress"><strong>{ready}/{cards.length}</strong><span>områden påbörjade</span></div></header>
  <section className="studio-statement"><p>FAMILJENS ARBETSPLATS</p><h2>Bygg förståelsen här.<br/>Lev med den i LIV.</h2><span>Studio förändrar aldrig vem Viktor är. Det hjälper familjen att bevara, förbättra och förklara det ni redan vet.</span></section>
  <section className="studio-status"><article><b>{count('liv.memories.v1')}</b><span>Minnen med betydelse</span></article><article><b>{count('viktors-liv.people.v1')}</b><span>Människor runt Viktor</span></article><article><b>{count('viktors-liv.documents.v1')}</b><span>Dokument med sammanhang</span></article><article><b>{count('liv.knowledge-authority.v1')}</b><span>Aktiva kunskapsämnen</span></article></section>
  <section className="studio-workspaces"><header><div><p>01</p><h2>Arbetsytor</h2></div><span>En källa. Tydliga ansvar.</span></header><div className="studio-grid">{cards.map(card=><button key={card.id} onClick={()=>open(card.id)}><small>{card.n}</small><div><h3>{card.title}</h3><p>{card.copy}</p></div><div className="studio-card-meta"><strong>{card.count}</strong><span>{card.unit}</span><em>{card.state}</em></div><b>→</b></button>)}</div></section>
 </main>
}
