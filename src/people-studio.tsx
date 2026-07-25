import React,{FormEvent,useEffect,useMemo,useState} from 'react';
import './people-studio.css';

type Group='Familj'|'Kommun'|'Professionell'|'Stöd';
type ContactState='Aktiv'|'Vilande'|'Avslutad';
type Person={id:string;name:string;role:string;group:Group;helps:string;needs:string;organisation?:string;phone?:string;email?:string;relationship?:string;responsibilities?:string[];notes?:string;state?:ContactState;updatedAt?:string};

const key='viktors-liv.people.v1';
const defaults:Person[]=[
 {id:'p1',name:'Ben',role:'Pappa',group:'Familj',helps:'Känner Viktors historia, vardag och långsiktiga behov.',needs:'Behöver en tydlig helhetsbild och lugna nästa steg.',relationship:'Pappa',state:'Aktiv'},
 {id:'p2',name:'Josephine',role:'Familj',group:'Familj',helps:'Skapar trygghet, kreativitet och kontinuitet i vardagen.',needs:'Behöver veta vad som är aktuellt och vem som ansvarar för vad.',relationship:'Familj',state:'Aktiv'},
 {id:'p3',name:'Anna',role:'LSS-handläggare',group:'Kommun',helps:'Samordnar kommunala insatser och beslut.',needs:'Behöver relevanta underlag och en tydlig bild av Viktors verkliga situation.',organisation:'Kommunen',state:'Aktiv'},
 {id:'p4',name:'Maria',role:'Arbetsterapeut',group:'Professionell',helps:'Stödjer rutiner, hjälpmedel och självständighet.',needs:'Behöver förstå vad som fungerar hemma och i nya miljöer.',organisation:'Region Skåne',state:'Aktiv'}
];
function read():Person[]{try{const value=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(value)?value:defaults}catch{return defaults}}
function initials(name:string){return name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]?.toUpperCase()).join('')||'?'}
function normalise(person:Person):Person{return{...person,state:person.state||'Aktiv',responsibilities:person.responsibilities||[],updatedAt:person.updatedAt||new Date().toISOString()}}

export function PeopleStudio(){
 const[people,setPeople]=useState<Person[]>(()=>read().map(normalise));
 const[selectedId,setSelectedId]=useState<string>(()=>read()[0]?.id||'');
 const[query,setQuery]=useState('');
 const[group,setGroup]=useState<'Alla'|Group>('Alla');
 const[editing,setEditing]=useState(false);
 useEffect(()=>localStorage.setItem(key,JSON.stringify(people)),[people]);
 const filtered=useMemo(()=>people.filter(person=>{const hay=[person.name,person.role,person.group,person.organisation,person.relationship,person.helps,person.needs].join(' ').toLowerCase();return(group==='Alla'||person.group===group)&&(!query||hay.includes(query.toLowerCase()))}),[people,query,group]);
 const selected=people.find(person=>person.id===selectedId)||filtered[0]||null;
 useEffect(()=>{if(selected&&!selectedId)setSelectedId(selected.id)},[selected,selectedId]);
 const save=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const form=event.currentTarget,data=new FormData(form),name=String(data.get('name')||'').trim();if(!name)return;const responsibilities=String(data.get('responsibilities')||'').split('\n').map(value=>value.trim()).filter(Boolean);const next:Person=normalise({id:selected?.id||crypto.randomUUID(),name,role:String(data.get('role')||''),group:String(data.get('group')||'Stöd') as Group,organisation:String(data.get('organisation')||''),relationship:String(data.get('relationship')||''),phone:String(data.get('phone')||''),email:String(data.get('email')||''),helps:String(data.get('helps')||''),needs:String(data.get('needs')||''),responsibilities,notes:String(data.get('notes')||''),state:String(data.get('state')||'Aktiv') as ContactState,updatedAt:new Date().toISOString()});setPeople(current=>current.some(person=>person.id===next.id)?current.map(person=>person.id===next.id?next:person):[next,...current]);setSelectedId(next.id);setEditing(false)};
 const create=()=>{setSelectedId('');setEditing(true)};
 const remove=()=>{if(!selected)return;const next=people.filter(person=>person.id!==selected.id);setPeople(next);setSelectedId(next[0]?.id||'');setEditing(false)};
 const counts=people.reduce<Record<Group,number>>((acc,person)=>({...acc,[person.group]:acc[person.group]+1}),{Familj:0,Kommun:0,Professionell:0,Stöd:0});
 return <main className="people-studio">
  <header className="ps-header"><div><p>STUDIO · PEOPLE</p><h1>Människor runt Viktor</h1><span>Relationer, ansvar och det varje person behöver förstå.</span></div><button className="ps-primary" onClick={create}>＋ Lägg till person</button></header>
  <section className="ps-stats">{(['Familj','Professionell','Kommun','Stöd'] as Group[]).map(item=><article key={item}><strong>{counts[item]}</strong><span>{item}</span></article>)}</section>
  <section className="ps-toolbar"><div className="ps-search">⌕<input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Sök namn, roll eller organisation"/></div><select value={group} onChange={event=>setGroup(event.target.value as 'Alla'|Group)}><option>Alla</option><option>Familj</option><option>Professionell</option><option>Kommun</option><option>Stöd</option></select></section>
  <section className="ps-workspace">
   <aside className="ps-list"><header><b>{filtered.length} personer</b><small>Familjens sanningskälla</small></header>{filtered.map(person=><button key={person.id} className={selected?.id===person.id?'active':''} onClick={()=>{setSelectedId(person.id);setEditing(false)}}><span>{initials(person.name)}</span><div><strong>{person.name}</strong><small>{person.role||person.group}{person.organisation?` · ${person.organisation}`:''}</small></div><em>{person.state||'Aktiv'}</em></button>)}{filtered.length===0&&<div className="ps-empty">Ingen person matchar sökningen.</div>}</aside>
   <section className="ps-detail">
    {editing?<PersonEditor person={selectedId?selected:null} onSave={save} onCancel={()=>setEditing(false)}/>:selected?<><header className="ps-profile-head"><span>{initials(selected.name)}</span><div><small>{selected.group}</small><h2>{selected.name}</h2><p>{selected.role}{selected.organisation?` · ${selected.organisation}`:''}</p></div><div><button onClick={()=>setEditing(true)}>Redigera</button><button className="danger" onClick={remove}>Ta bort</button></div></header><div className="ps-profile-grid"><article><b>RELATION TILL VIKTOR</b><p>{selected.relationship||selected.role||'Inte beskriven ännu.'}</p></article><article><b>SÅ HJÄLPER PERSONEN</b><p>{selected.helps||'Inte beskrivet ännu.'}</p></article><article><b>DET PERSONEN BEHÖVER FÖRSTÅ</b><p>{selected.needs||'Inte beskrivet ännu.'}</p></article><article><b>ANSVAR</b>{selected.responsibilities?.length?<ul>{selected.responsibilities.map((item,index)=><li key={`${item}-${index}`}>{item}</li>)}</ul>:<p>Inga uttryckliga ansvar sparade.</p>}</article></div><section className="ps-contact"><div><b>KONTAKT</b><p>{selected.email||'Ingen e-post'}<br/>{selected.phone||'Inget telefonnummer'}</p></div><div><b>FAMILJENS ANTECKNING</b><p>{selected.notes||'Ingen privat anteckning.'}</p></div></section><footer className="ps-source">Sparas i <code>{key}</code>. Denna post förblir familjens auktoritativa källa.</footer></>:<div className="ps-placeholder"><span>♙</span><h2>Lägg till den första personen</h2><p>Beskriv relationen, inte bara kontaktuppgifterna.</p><button className="ps-primary" onClick={create}>Lägg till person</button></div>}
   </section>
  </section>
 </main>
}

function PersonEditor({person,onSave,onCancel}:{person:Person|null;onSave:(event:FormEvent<HTMLFormElement>)=>void;onCancel:()=>void}){return <form className="ps-editor" onSubmit={onSave}><header><div><p>PEOPLE STUDIO</p><h2>{person?'Redigera person':'Ny person'}</h2></div><button type="button" onClick={onCancel}>Stäng</button></header><div className="ps-form-grid"><label>Namn<input name="name" defaultValue={person?.name} required/></label><label>Roll<input name="role" defaultValue={person?.role}/></label><label>Grupp<select name="group" defaultValue={person?.group||'Stöd'}><option>Familj</option><option>Professionell</option><option>Kommun</option><option>Stöd</option></select></label><label>Status<select name="state" defaultValue={person?.state||'Aktiv'}><option>Aktiv</option><option>Vilande</option><option>Avslutad</option></select></label><label>Organisation<input name="organisation" defaultValue={person?.organisation}/></label><label>Relation till Viktor<input name="relationship" defaultValue={person?.relationship}/></label><label>E-post<input name="email" type="email" defaultValue={person?.email}/></label><label>Telefon<input name="phone" defaultValue={person?.phone}/></label></div><label>Så hjälper personen Viktor<textarea name="helps" defaultValue={person?.helps}/></label><label>Det personen behöver förstå<textarea name="needs" defaultValue={person?.needs}/></label><label>Ansvar — ett per rad<textarea name="responsibilities" defaultValue={person?.responsibilities?.join('\n')}/></label><label>Familjens privata anteckning<textarea name="notes" defaultValue={person?.notes}/></label><footer><button type="button" onClick={onCancel}>Avbryt</button><button className="ps-primary">Spara person</button></footer></form>}
