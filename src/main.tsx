import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

type Workspace = 'today'|'person'|'journey'|'knowledge'|'people'|'documents'|'economy';
type Profile = {about:string;joys:string[];communication:string;stress:string;support:string;safety:string;worry:string;avoid:string;remember:string;family:string};
type DayItem = {id:string;time:string;title:string;detail:string;kind:'event'|'task'|'message'|'care';done:boolean};
type JourneyItem = {id:string;year:string;title:string;story:string;kind:'milestone'|'decision'|'memory'|'change'};
type PersonItem = {id:string;name:string;role:string;group:'Familj'|'Kommun'|'Professionell'|'Stöd';helps:string;needs:string};

const profileDefaults: Profile = {
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
const dayDefaults:DayItem[]=[
  {id:'day-1',time:'09:30',title:'Daglig verksamhet',detail:'Vanlig morgon. Berätta i god tid vem som hämtar.',kind:'event',done:false},
  {id:'day-2',time:'14:00',title:'Arbetsterapeut',detail:'Ta med anteckningar om den nya vardagsrutinen.',kind:'care',done:false},
  {id:'day-3',time:'',title:'Medicin given',detail:'Morgondosen är bekräftad.',kind:'task',done:true},
  {id:'day-4',time:'FRE',title:'Svar till kommunen',detail:'Ansökan behöver kompletteras före fredag.',kind:'message',done:false}
];
const journeyDefaults:JourneyItem[]=[
  {id:'journey-1',year:'2007',title:'Viktor föds',story:'En ny människa och början på familjens gemensamma resa.',kind:'milestone'},
  {id:'journey-2',year:'2010',title:'Familjen får större förståelse',story:'Utredningar och samtal gav nya ord för sådant familjen redan såg.',kind:'change'},
  {id:'journey-3',year:'2015',title:'Första skolan',story:'Nya rutiner, människor och erfarenheter blev en viktig del av Viktors vardag.',kind:'milestone'},
  {id:'journey-4',year:'2022',title:'Gymnasiet',story:'Viktor utvecklade större självständighet och nya intressen.',kind:'milestone'},
  {id:'journey-5',year:'2026',title:'Nästa steg mot daglig verksamhet',story:'Familjen samlar beslut, besök och önskemål inför övergången.',kind:'decision'}
];
const peopleDefaults:PersonItem[]=[
  {id:'person-1',name:'Ben',role:'Pappa',group:'Familj',helps:'Känner Viktors historia, vardag och långsiktiga behov.',needs:'Behöver en tydlig helhetsbild och lugna nästa steg.'},
  {id:'person-2',name:'Josephine',role:'Familj',group:'Familj',helps:'Skapar trygghet, kreativitet och kontinuitet i vardagen.',needs:'Behöver veta vad som är aktuellt och vem som ansvarar för vad.'},
  {id:'person-3',name:'Anna',role:'LSS-handläggare',group:'Kommun',helps:'Samordnar kommunala insatser och beslut.',needs:'Behöver relevanta underlag och en tydlig bild av Viktors verkliga situation.'},
  {id:'person-4',name:'Maria',role:'Arbetsterapeut',group:'Professionell',helps:'Stödjer rutiner, hjälpmedel och självständighet.',needs:'Behöver förstå vad som fungerar hemma och i nya miljöer.'}
];

const nav:Array<[Workspace,string,string]>=[['today','⌂','Idag'],['person','♥','Viktor'],['journey','◷','Resan'],['knowledge','▤','Kunskap'],['people','◉','Människor'],['documents','▱','Dokument'],['economy','○','Ekonomi']];
const placeholders:Record<'knowledge'|'documents'|'economy',[string,string,string,string]>={
  knowledge:['03','Kunskap','Vad betyder detta för Viktor?','Råd och information översätts från professionellt språk till familjens verklighet.'],
  documents:['05','Dokument','Dokument ska leda till förståelse.','Beslut och underlag kopplas till konsekvenser, ansvar och nästa handling.'],
  economy:['06','Ekonomi','Vad förändras — och när?','Inkomster, kostnader, stöd och beslut visas som en begriplig helhet.']
};

function useStoredState<T>(key:string,initial:T){
  const [value,setValue]=useState<T>(()=>{try{const stored=localStorage.getItem(key);return stored?JSON.parse(stored):initial}catch{return initial}});
  useEffect(()=>{localStorage.setItem(key,JSON.stringify(value))},[key,value]);
  return [value,setValue] as const;
}
function uid(prefix:string){return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`}
function Header({number,title,status}:{number:string;title:string;status?:string}){return <header className="header"><div><p className="eyebrow">WORKSPACE · {number}</p><h1>{title}</h1></div>{status&&<p className="status">{status}</p>}</header>}
function Section({number,title,description,children}:{number:string;title:string;description:string;children:React.ReactNode}){return <section className="section"><div className="section-title"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div><div>{children}</div></section>}
function Card({title,value,onChange}:{title:string;value:string;onChange:(value:string)=>void}){return <article className="card"><h3>{title}</h3><textarea value={value} onChange={e=>onChange(e.target.value)}/></article>}
function EmptyState({text}:{text:string}){return <div className="soft-empty">{text}</div>}

function Today(){
  const [items,setItems]=useStoredState<DayItem[]>('viktors-liv.today.v1',dayDefaults);
  const [mood,setMood]=useStoredState('viktors-liv.mood.v1','🙂');
  const open=items.filter(item=>!item.done);
  const add=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const title=String(data.get('title')||'').trim();if(!title)return;setItems(current=>[...current,{id:uid('day'),time:String(data.get('time')||'').trim(),title,detail:String(data.get('detail')||'').trim(),kind:'task',done:false}]);form.reset()};
  return <main><Header number="00" title="Idag" status={`${open.length} saker kvar`}/>
    <section className="today-hero"><div><p className="eyebrow light">TORSDAG · FAMILJENS ÖVERBLICK</p><h2>God morgon, Ben.</h2><p>Här är det som betyder något idag — för Viktor och för familjen.</p></div><div className="today-count"><strong>{open.length}</strong><span>öppna saker</span></div></section>
    <Section number="01" title="Det viktigaste idag" description="Tid, ansvar och nästa steg i en lugn ordning."><div className="agenda">{items.map(item=><article className={`agenda-row ${item.done?'done':''}`} key={item.id}><button className="check" aria-label="Markera klart" onClick={()=>setItems(current=>current.map(currentItem=>currentItem.id===item.id?{...currentItem,done:!currentItem.done}:currentItem))}>{item.done?'✓':'○'}</button><time>{item.time||'IDAG'}</time><div><h3>{item.title}</h3><p>{item.detail}</p></div><span className={`kind ${item.kind}`}>{item.kind==='care'?'VÅRD':item.kind==='message'?'VIKTIGT':item.kind==='event'?'HÄNDELSE':'UPPGIFT'}</span></article>)}</div>
      <form className="create-row" onSubmit={add}><input name="time" placeholder="Tid"/><input name="title" placeholder="Vad behöver göras?" required/><input name="detail" placeholder="Kort förklaring"/><button>+ Lägg till</button></form></Section>
    <Section number="02" title="Hur mår Viktor idag?" description="En liten signal som hjälper familjen att möta dagen rätt."><div className="moods">{['🙂','😐','☹️'].map(option=><button key={option} className={mood===option?'selected':''} onClick={()=>setMood(option)}>{option}</button>)}</div></Section>
    <Section number="03" title="Det familjen behöver veta" description="Översikten visar bara det som kräver uppmärksamhet."><div className="insight-grid"><article className="insight"><span>NÄSTA DEADLINE</span><strong>Komplettering till kommunen</strong><p>Senast fredag. Underlaget finns snart i Dokument.</p></article><article className="insight"><span>VIKTORS DAG</span><strong>{mood==='🙂'?'Ser stabil och trygg ut':mood==='😐'?'Ta dagen i lugnt tempo':'Prioritera trygghet och återhämtning'}</strong><p>Utgå från Viktors dagsform innan planerna justeras.</p></article></div></Section>
  </main>
}

function Person(){
  const [profile,setProfile]=useStoredState<Profile>('viktors-liv.person.v2',profileDefaults);
  const [saved,setSaved]=useState('Alla ändringar sparas automatiskt');
  useEffect(()=>{const timer=setTimeout(()=>setSaved(`Sparat ${new Date().toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'})}`),350);return()=>clearTimeout(timer)},[profile]);
  const update=(key:keyof Profile,value:string|string[])=>setProfile(current=>({...current,[key]:value}));
  return <main><Header number="01" title="Lär känna Viktor" status={saved}/><section className="hero"><div><p className="eyebrow light">MÄNNISKAN FÖRE DIAGNOSEN</p><h2>Det här är Viktor.</h2><p>Den här sidan hjälper andra att förstå Viktor som person — inte bara hans behov.</p></div><div className="identity"><strong>Viktor</strong><span>19 år</span><span>Bor hemma</span></div></section>
    <Section number="01" title="Om Viktor" description="Berättelsen kommer före uppgifterna."><textarea className="large" value={profile.about} onChange={e=>update('about',e.target.value)}/></Section>
    <Section number="02" title="Det här gör Viktor glad" description="Små saker som hjälper andra att skapa en bra dag."><div className="chips">{profile.joys.map(joy=><button key={joy} onClick={()=>update('joys',profile.joys.filter(item=>item!==joy))}>♥ {joy}</button>)}</div><form className="add" onSubmit={e=>{e.preventDefault();const form=e.currentTarget;const value=new FormData(form).get('joy')?.toString().trim();if(value&&!profile.joys.includes(value))update('joys',[...profile.joys,value]);form.reset()}}><input name="joy" placeholder="Lägg till något Viktor tycker om"/><button>+ Lägg till</button></form></Section>
    <Section number="03" title="Kommunikation" description="Så hjälper vi Viktor att förstå och bli förstådd."><div className="grid three"><Card title="Så kommunicerar Viktor" value={profile.communication} onChange={v=>update('communication',v)}/><Card title="När Viktor blir stressad" value={profile.stress} onChange={v=>update('stress',v)}/><Card title="Det här hjälper" value={profile.support} onChange={v=>update('support',v)}/></div></Section>
    <Section number="04" title="Viktigt att veta" description="Trygghet skapas av sådant som andra annars lätt missar."><div className="grid"><Card title="Trygghet" value={profile.safety} onChange={v=>update('safety',v)}/><Card title="Oro" value={profile.worry} onChange={v=>update('worry',v)}/><Card title="Undvik" value={profile.avoid} onChange={v=>update('avoid',v)}/><Card title="Kom ihåg" value={profile.remember} onChange={v=>update('remember',v)}/></div></Section>
    <Section number="05" title="Familjens ord" description="Det som aldrig får plats i ett formulär."><div className="family"><h3>Det här önskar vi att fler förstod om Viktor</h3><textarea value={profile.family} onChange={e=>update('family',e.target.value)}/></div></Section>
  </main>
}

function Journey(){
  const [items,setItems]=useStoredState<JourneyItem[]>('viktors-liv.journey.v1',journeyDefaults);
  const sorted=useMemo(()=>[...items].sort((a,b)=>a.year.localeCompare(b.year)),[items]);
  const add=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const title=String(data.get('title')||'').trim();if(!title)return;setItems(current=>[...current,{id:uid('journey'),year:String(data.get('year')||new Date().getFullYear()),title,story:String(data.get('story')||'').trim(),kind:String(data.get('kind')||'milestone') as JourneyItem['kind']}]);form.reset()};
  return <main><Header number="02" title="Resan" status={`${items.length} livshändelser`}/><section className="statement journey-statement"><p className="eyebrow light">VIKTORS LIV · DÅ, NU OCH SEDAN</p><h2>Ett liv är mer än en tidslinje.</h2><p>Händelser, beslut, människor och minnen får mening när de förstås tillsammans.</p></section>
    <Section number="01" title="Viktors resa" description="Det viktiga bevaras som en berättelse, inte som en lista av ärenden."><div className="life-line">{sorted.map(item=><article className="life-event" key={item.id}><div className="life-year">{item.year}</div><div className="life-marker"/><div className="life-copy"><span>{item.kind==='decision'?'BESLUT':item.kind==='memory'?'MINNE':item.kind==='change'?'FÖRÄNDRING':'MILSTOLPE'}</span><h3>{item.title}</h3><p>{item.story}</p><button className="text-action" onClick={()=>setItems(current=>current.filter(currentItem=>currentItem.id!==item.id))}>Ta bort</button></div></article>)}</div></Section>
    <Section number="02" title="Lägg till en livshändelse" description="Spara det som familjen vill förstå, minnas eller förbereda."><form className="editor-panel" onSubmit={add}><div className="form-grid"><label>År<input name="year" placeholder="2026" required/></label><label>Typ<select name="kind"><option value="milestone">Milstolpe</option><option value="decision">Beslut</option><option value="change">Förändring</option><option value="memory">Minne</option></select></label></div><label>Rubrik<input name="title" placeholder="Vad hände?" required/></label><label>Berättelsen<textarea name="story" placeholder="Varför är detta viktigt för Viktor och familjen?"/></label><button className="primary">+ Spara i Resan</button></form></Section>
  </main>
}

function People(){
  const [people,setPeople]=useStoredState<PersonItem[]>('viktors-liv.people.v1',peopleDefaults);
  const groups:PersonItem['group'][]=['Familj','Kommun','Professionell','Stöd'];
  const add=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const name=String(data.get('name')||'').trim();if(!name)return;setPeople(current=>[...current,{id:uid('person'),name,role:String(data.get('role')||'').trim(),group:String(data.get('group')||'Stöd') as PersonItem['group'],helps:String(data.get('helps')||'').trim(),needs:String(data.get('needs')||'').trim()}]);form.reset()};
  return <main><Header number="04" title="Människor" status={`${people.length} personer runt Viktor`}/><section className="statement people-statement"><p className="eyebrow light">RELATIONER · ANSVAR · FÖRSTÅELSE</p><h2>Människor, inte kontaktposter.</h2><p>Här blir det tydligt vem som känner Viktor, hur personen hjälper och vad relationen behöver för att fungera.</p></section>
    <Section number="01" title="Människorna runt Viktor" description="Varje person förstås genom sin relation till Viktor."><div className="people-groups">{groups.map(group=><div className="people-group" key={group}><div className="group-heading"><span>{group.toUpperCase()}</span><strong>{people.filter(person=>person.group===group).length}</strong></div>{people.filter(person=>person.group===group).map(person=><article className="person-card" key={person.id}><div className="avatar">{person.name.slice(0,1)}</div><div><h3>{person.name}</h3><p className="role">{person.role}</p><dl><dt>Så hjälper personen Viktor</dt><dd>{person.helps||'Ingen beskrivning ännu.'}</dd><dt>Det personen behöver veta</dt><dd>{person.needs||'Ingen information ännu.'}</dd></dl><button className="text-action" onClick={()=>setPeople(current=>current.filter(currentPerson=>currentPerson.id!==person.id))}>Ta bort</button></div></article>)}</div>)}</div></Section>
    <Section number="02" title="Lägg till en människa" description="Börja med relationen — telefonnummer och administration kommer senare."><form className="editor-panel" onSubmit={add}><div className="form-grid"><label>Namn<input name="name" required/></label><label>Roll<input name="role" placeholder="Exempel: kontaktperson"/></label><label>Grupp<select name="group">{groups.map(group=><option key={group}>{group}</option>)}</select></label></div><label>Hur hjälper personen Viktor?<textarea name="helps"/></label><label>Vad behöver personen veta?<textarea name="needs"/></label><button className="primary">+ Lägg till person</button></form></Section>
  </main>
}

function Placeholder({workspace}:{workspace:'knowledge'|'documents'|'economy'}){const [number,title,statement,description]=placeholders[workspace];return <main><Header number={number} title={title}/><section className="statement"><p className="eyebrow light">RELEASE 0.2 · FOUNDATION</p><h2>{statement}</h2><p>{description}</p></section><section className="empty"><span>01</span><div><h2>Nästa arbetsyta i releasen.</h2><p>Idag, Resan och Människor byggs först. Den här arbetsytan fylls därefter med samma nivå av verkliga handlingar och samband.</p></div></section></main>}
function App(){const [active,setActive]=useState<Workspace>('today');return <div className="shell"><aside><div className="brand">♥ VL</div><nav>{nav.map(([id,icon,label])=><button key={id} className={active===id?'active':''} onClick={()=>setActive(id)}><span>{icon}</span> {label}</button>)}</nav><p className="owner">Familjen äger informationen.</p></aside>{active==='today'?<Today/>:active==='person'?<Person/>:active==='journey'?<Journey/>:active==='people'?<People/>:<Placeholder workspace={active}/>}</div>}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
