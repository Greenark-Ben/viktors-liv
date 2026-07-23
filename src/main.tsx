import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

type Workspace = 'today'|'person'|'journey'|'knowledge'|'people'|'documents'|'economy';
type Profile = {about:string;joys:string[];communication:string;stress:string;support:string;safety:string;worry:string;avoid:string;remember:string;family:string};

const defaults: Profile = {
  about:'Viktor är en varm, nyfiken och omtänksam person. Han tycker om att hjälpa andra och blir stolt när han får ansvar.',
  joys:['Musik','Promenader','Tåg','Glass','Att hjälpa till'],
  communication:'Ge Viktor gott om tid att svara. Ställ en fråga i taget och använd tydliga, konkreta ord.',
  stress:'När det blir för många frågor eller snabba förändringar kan Viktor bli tyst och dra sig undan.',
  support:'Sänk tempot, berätta vad som händer härnäst och ge honom en lugn plats att landa på.',
  safety:'Tydliga rutiner, välkända personer och att få veta vad som ska hända i god tid.',
  worry:'Höga ljud, oväntade förändringar och att behöva skynda sig.',
  avoid:'Prata inte över huvudet på Viktor eller ställ flera frågor samtidigt.',
  remember:'Möt Viktor som den vuxna person han är.',
  family:'Ge Viktor lite extra tid innan du ställer nästa fråga. Om du behandlar honom som en vuxen människa kommer han att blomma ut.'
};
const nav:Array<[Workspace,string,string]>=[['today','⌂','Idag'],['person','♥','Viktor'],['journey','◷','Resan'],['knowledge','▤','Kunskap'],['people','◉','Människor'],['documents','▱','Dokument'],['economy','○','Ekonomi']];
const placeholders:Record<Exclude<Workspace,'person'>,[string,string,string,string]>={
  today:['00','Idag','Vad behöver vi veta idag?','Dagens viktigaste händelser, beslut och nästa steg samlas här — utan att familjen behöver leta.'],
  journey:['02','Resan','Ett liv är mer än en tidslinje.','Händelser, människor, dokument och minnen ska förstås tillsammans.'],
  knowledge:['03','Kunskap','Vad betyder detta för Viktor?','Råd och information översätts från professionellt språk till familjens verklighet.'],
  people:['04','Människor','Människor, inte kontaktposter.','Här blir det tydligt vem som känner Viktor, vem som hjälper och vad varje relation behöver veta.'],
  documents:['05','Dokument','Dokument ska leda till förståelse.','Beslut och underlag kopplas till konsekvenser, ansvar och nästa handling.'],
  economy:['06','Ekonomi','Vad förändras — och när?','Inkomster, kostnader, stöd och beslut visas som en begriplig helhet.']
};

function Header({number,title,status}:{number:string;title:string;status?:string}){return <header className="header"><div><p className="eyebrow">WORKSPACE · {number}</p><h1>{title}</h1></div>{status&&<p className="status">{status}</p>}</header>}
function Section({number,title,description,children}:{number:string;title:string;description:string;children:React.ReactNode}){return <section className="section"><div className="section-title"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div><div>{children}</div></section>}
function Card({title,value,onChange}:{title:string;value:string;onChange:(value:string)=>void}){return <article className="card"><h3>{title}</h3><textarea value={value} onChange={e=>onChange(e.target.value)}/></article>}

function Person(){
  const [profile,setProfile]=useState<Profile>(()=>{try{return {...defaults,...JSON.parse(localStorage.getItem('viktors-liv.person.v2')||'{}')}}catch{return defaults}});
  const [saved,setSaved]=useState('Alla ändringar sparas automatiskt');
  useEffect(()=>{const timer=setTimeout(()=>{localStorage.setItem('viktors-liv.person.v2',JSON.stringify(profile));setSaved(`Sparat ${new Date().toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'})}`)},350);return()=>clearTimeout(timer)},[profile]);
  const update=(key:keyof Profile,value:string|string[])=>setProfile(current=>({...current,[key]:value}));
  return <main><Header number="01" title="Lär känna Viktor" status={saved}/><section className="hero"><div><p className="eyebrow light">MÄNNISKAN FÖRE DIAGNOSEN</p><h2>Det här är Viktor.</h2><p>Den här sidan hjälper andra att förstå Viktor som person — inte bara hans behov.</p></div><div className="identity"><strong>Viktor</strong><span>19 år</span><span>Bor hemma</span></div></section>
    <Section number="01" title="Om Viktor" description="Berättelsen kommer före uppgifterna."><textarea className="large" value={profile.about} onChange={e=>update('about',e.target.value)}/></Section>
    <Section number="02" title="Det här gör Viktor glad" description="Små saker som hjälper andra att skapa en bra dag."><div className="chips">{profile.joys.map(joy=><button key={joy} onClick={()=>update('joys',profile.joys.filter(item=>item!==joy))}>♥ {joy}</button>)}</div><form className="add" onSubmit={e=>{e.preventDefault();const form=e.currentTarget;const value=new FormData(form).get('joy')?.toString().trim();if(value&&!profile.joys.includes(value))update('joys',[...profile.joys,value]);form.reset()}}><input name="joy" placeholder="Lägg till något Viktor tycker om"/><button>+ Lägg till</button></form></Section>
    <Section number="03" title="Kommunikation" description="Så hjälper vi Viktor att förstå och bli förstådd."><div className="grid three"><Card title="Så kommunicerar Viktor" value={profile.communication} onChange={v=>update('communication',v)}/><Card title="När Viktor blir stressad" value={profile.stress} onChange={v=>update('stress',v)}/><Card title="Det här hjälper" value={profile.support} onChange={v=>update('support',v)}/></div></Section>
    <Section number="04" title="Viktigt att veta" description="Trygghet skapas av sådant som andra annars lätt missar."><div className="grid"><Card title="Trygghet" value={profile.safety} onChange={v=>update('safety',v)}/><Card title="Oro" value={profile.worry} onChange={v=>update('worry',v)}/><Card title="Undvik" value={profile.avoid} onChange={v=>update('avoid',v)}/><Card title="Kom ihåg" value={profile.remember} onChange={v=>update('remember',v)}/></div></Section>
    <Section number="05" title="Familjens ord" description="Det som aldrig får plats i ett formulär."><div className="family"><h3>Det här önskar vi att fler förstod om Viktor</h3><textarea value={profile.family} onChange={e=>update('family',e.target.value)}/></div></Section>
  </main>
}
function Placeholder({workspace}:{workspace:Exclude<Workspace,'person'>}){const [number,title,statement,description]=placeholders[workspace];return <main><Header number={number} title={title}/><section className="statement"><p className="eyebrow light">RELEASE 0.2 · FOUNDATION</p><h2>{statement}</h2><p>{description}</p></section><section className="empty"><span>01</span><div><h2>Arbetsytan är etablerad.</h2><p>Den tekniska grunden är på plats. Nästa produktinkrement fyller den med riktiga handlingar, data och samband.</p></div></section></main>}
function App(){const [active,setActive]=useState<Workspace>('person');return <div className="shell"><aside><div className="brand">♥ VL</div><nav>{nav.map(([id,icon,label])=><button key={id} className={active===id?'active':''} onClick={()=>setActive(id)}><span>{icon}</span> {label}</button>)}</nav><p className="owner">Familjen äger informationen.</p></aside>{active==='person'?<Person/>:<Placeholder workspace={active}/>}</div>}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
