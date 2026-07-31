import React,{useEffect,useRef,useState}from'react';
import type{ResourceRecord}from'./authorities/resource';
import{discoverResourceActions}from'./resource-discovery';
import'./resource-discovery-actions.css';

export function ResourceDiscoveryActions({resource}:{resource:ResourceRecord}){
 const actions=discoverResourceActions(resource);const[open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!open)return;const close=(event:MouseEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('mousedown',close);document.addEventListener('keydown',key);return()=>{document.removeEventListener('mousedown',close);document.removeEventListener('keydown',key)}},[open]);
 if(!actions.length)return <span className="resource-open-disabled" title="Lägg till en URL, filreferens eller ISBN för att hitta resursen.">Ingen länk</span>;
 if(actions.length===1)return <a className="resource-discovery-direct" href={actions[0].href} target="_blank" rel="noreferrer">{actions[0].label} ↗</a>;
 return <div className="resource-discovery" ref={root}><button type="button" className="resource-discovery-trigger" aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>Hitta boken <span aria-hidden="true">⌄</span></button>{open&&<div className="resource-discovery-menu" role="menu" aria-label={`Hitta ${resource.title}`}>{actions.map(action=><a key={action.id} role="menuitem" href={action.href} target="_blank" rel="noreferrer" onClick={()=>setOpen(false)}><span>{action.kind==='retailer'?'◉':action.kind==='library'?'⌂':action.kind==='reference'?'▤':'↗'}</span><b>{action.label}</b><small>{action.kind==='retailer'?'Bokhandel':action.kind==='library'?'Bibliotekskatalog':action.kind==='reference'?'Bokinformation':'Originalkälla'}</small></a>)}</div>}</div>;
}
