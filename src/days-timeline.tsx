import React,{useMemo,useState} from 'react';
import './days-timeline.css';

type Kind='Dag'|'Bild'|'Möte'|'Beslut'|'Dokument'|'Livshändelse';
type TimelineItem={id:string;date:string;kind:Kind;title:string;summary:string;source:string;image?:string;detail?:string};
type Photo={id:string;dataUrl:string;caption:string;date:string;profile:boolean};
const read=<T,>(key:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}};
const normalise=(value?:string)=>{if(!value)return'';if(/^\d{4}$/.test(value))return`${value}-01-01`;return value.slice(0,10)};
const label=(date:string)=>new Intl.DateTimeFormat('sv-SE',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${date}T12:00:00`));
const monthLabel=(date:string)=>new Intl.DateTimeFormat('sv-SE',{month:'long',year:'numeric'}).format(new Date(`${date}T12:00:00`));
function buildTimeline():TimelineItem[]{
 const days=read<any[]>('liv.daily-stories.v1',[]).map(x=>({id:`day-${x.id}`,date:normalise(x.date||x.createdAt),kind:'Dag' as const,title:x.remember||'En dag i Viktors liv',summary:x.story||[...(x.joys||[]),...(x.difficulties||[])].join(' · '),source:'Livet',detail:`Känsla ${x.mood||'—'} · Energi ${x.energy||'—'} · ${x.author||'Familjen'}`}));
 const photos=read<Photo[]>('viktors-liv.viktor-photos.v1',[]).map(x=>({id:`photo-${x.id}`,date:normalise(x.date),kind:'Bild' as const,title:x.caption||'Bild av Viktor',summary:x.profile?'Vald profilbild':'Sparad i Viktors bildgalleri',source:'Viktor',image:x.dataUrl}));
 const meetings=read<any[]>('liv.meetings.v1',[]).map(x=>({id:`meeting-${x.id}`,date:normalise(x.date||x.meetingDate||x.createdAt),kind:'Möte' as const,title:x.title||x.purpose||'Möte',summary:x.notes||x.purpose||'Familjens mötesunderlag',source:'Handling',detail:[x.participants,x.questions].filter(Boolean).join(' · ')}));
 const decisions=read<any[]>('liv.decisions.v1',[]).map(x=>({id:`decision-${x.id}`,date:normalise(x.date||x.decisionDate||x.createdAt),kind:'Beslut' as const,title:x.question||'Beslut',summary:x.decision||x.reasoning||'Familjens beslut',source:'Handling',detail:x.reasoning}));
 const documents=read<any[]>('viktors-liv.documents.v1',[]).map(x=>({id:`document-${x.id}`,date:normalise(x.date),kind:'Dokument' as const,title:x.title||'Dokument',summary:x.meaning||x.impact||'Dokument sparat av familjen',source:'Dokument',detail:[x.issuer,x.next].filter(Boolean).join(' · ')}));
 const journey=read<any[]>('viktors-liv.journey.v1',[]).map(x=>({id:`journey-${x.id}`,date:normalise(x.date||x.year),kind:'Livshändelse' as const,title:x.title||'Livshändelse',summary:x.story||'',source:'Resan'}));
 return [...days,...photos,...meetings,...decisions,...documents,...journey].filter(x=>x.date).sort((a,b)=>b.date.localeCompare(a.date));
}
export function DaysTimeline(){
 const [query,setQuery]=useState(''),[kind,setKind]=useState<'Alla'|Kind>('Alla'),[period,setPeriod]=useState(''),[selected,setSelected]=useState<TimelineItem|null>(null);
 const all=useMemo(buildTimeline,[]),profile=read<any>('viktors-liv.person.v2',{}),photos=read<Photo[]>('viktors-liv.viktor-photos.v1',[]),profilePhoto=photos.find(x=>x.profile)||photos[0];
 const filtered=useMemo(()=>all.filter(x=>{const text=[x.title,x.summary,x.source,x.detail,x.kind].join(' ').toLowerCase();return(!query||text.includes(query.toLowerCase()))&&(kind==='Alla'||x.kind===kind)&&(!period||x.date.startsWith(period))}),[all,query,kind,period]);
 const grouped=useMemo(()=>filtered.reduce<Record<string,TimelineItem[]>>((acc,item)=>{const key=monthLabel(item.date);(acc[key]||=[]).push(item);return acc},{}),[filtered]);
 const active=selected&&filtered.some(x=>x.id===selected.id)?selected:filtered[0]||null;
 const counts=all.reduce<Record<string,number>>((acc,x)=>{acc[x.kind]=(acc[x.kind]||0)+1;return acc},{});
 return <main className="timeline-intelligence">
  <section className="timeline-hero"><div><p>LIVET · TIDSLINJEINTELLIGENS</p><h2>Ett liv. Inte separata register.</h2><span>Alla sparade dagar, bilder, möten, beslut, dokument och livshändelser läses från sina ursprungliga källor och ordnas i tid.</span></div><div className="tell-viktor">{profilePhoto?<img src={profilePhoto.dataUrl} alt={profilePhoto.caption||'Viktor'}/>:<b>V</b>}<div><small>BERÄTTA OM VIKTOR</small><h3>Det här är Viktor.</h3><p>{profile.about||'Familjens berättelse om Viktor växer här över tid.'}</p></div></div></section>
  <section className="replay-bar"><div><small>LIFE REPLAY</small><strong>Visa mig en tid i Viktors liv</strong></div><input type="month" value={period} onChange={e=>setPeriod(e.target.value)}/>{period&&<button onClick={()=>setPeriod('')}>Visa hela livet</button>}</section>
  <section className="timeline-controls"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Sök efter människor, beslut, minnen eller händelser…"/><select value={kind} onChange={e=>setKind(e.target.value as 'Alla'|Kind)}><option>Alla</option>{(['Dag','Bild','Möte','Beslut','Dokument','Livshändelse'] as Kind[]).map(x=><option key={x}>{x}</option>)}</select></section>
  <section className="timeline-counts">{(['Dag','Bild','Möte','Beslut','Dokument','Livshändelse'] as Kind[]).map(x=><article key={x}><strong>{counts[x]||0}</strong><span>{x}</span></article>)}</section>
  <section className="timeline-layout"><div className="timeline-stream">{Object.keys(grouped).length?Object.entries(grouped).map(([month,items])=><section key={month}><header><span>{month}</span><i>{items.length} händelser</i></header>{items.map(item=><button key={item.id} className={active?.id===item.id?'active':''} onClick={()=>setSelected(item)}>{item.image?<img src={item.image} alt=""/>:<b>{item.kind.slice(0,1)}</b>}<div><small>{label(item.date)} · {item.kind}</small><h3>{item.title}</h3><p>{item.summary}</p></div><em>{item.source}</em></button>)}</section>):<div className="timeline-empty"><h3>Ingen tid matchar ännu.</h3><p>Ändra period eller filter för att se andra delar av Viktors liv.</p></div>}</div><aside className="timeline-detail">{active?<><small>{active.kind} · {label(active.date)}</small>{active.image&&<img src={active.image} alt={active.title}/>}<h2>{active.title}</h2><p>{active.summary}</p>{active.detail&&<blockquote>{active.detail}</blockquote>}<footer><span>Källa</span><strong>{active.source}</strong><p>Detta är en tidsprojektion. Underlaget förblir ägt av sin ursprungliga workspace.</p></footer></>:<div><h2>Välj en händelse</h2><p>Här visas sammanhanget utan att ändra originalinformationen.</p></div>}</aside></section>
 </main>;
}
