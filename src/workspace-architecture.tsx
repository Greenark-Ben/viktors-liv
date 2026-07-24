import React,{useEffect,useMemo,useState} from 'react';
import ReactDOM from 'react-dom/client';
import {createPortal} from 'react-dom';
import './workspace-architecture.css';
import './workspace-shell-polish.css';

type Workspace='today'|'person'|'life'|'learning'|'journey'|'knowledge'|'people'|'documents'|'economy';

type NavigationItem={id:Workspace;icon:string;label:string;legacyLabel?:string};

const navigation:NavigationItem[]=[
  {id:'today',icon:'⌂',label:'Idag',legacyLabel:'Idag'},
  {id:'person',icon:'♡',label:'Viktor',legacyLabel:'Viktor'},
  {id:'life',icon:'▥',label:'Livet'},
  {id:'learning',icon:'✦',label:'Det vi har lärt oss'},
  {id:'journey',icon:'◷',label:'Resan',legacyLabel:'Resan'},
  {id:'knowledge',icon:'▤',label:'Kunskap',legacyLabel:'Kunskap'},
  {id:'people',icon:'♙',label:'Människor',legacyLabel:'Människor'},
  {id:'documents',icon:'▱',label:'Dokument',legacyLabel:'Dokument'},
  {id:'economy',icon:'⊙',label:'Ekonomi',legacyLabel:'Ekonomi'}
];

function findShell(){
  const shell=document.querySelector<HTMLElement>('.shell');
  const aside=shell?.querySelector<HTMLElement>('aside')||null;
  const main=shell?.querySelector<HTMLElement>('main')||null;
  return {shell,aside,main};
}

function WorkspaceArchitecture(){
  const [active,setActive]=useState<Workspace>('today');
  const [shell,setShell]=useState<HTMLElement|null>(null);
  const [aside,setAside]=useState<HTMLElement|null>(null);

  useEffect(()=>{
    let frame=0;
    const connect=()=>{
      const current=findShell();
      if(current.shell&&current.aside){
        current.shell.classList.add('renaissance-shell','liv-shell-v2');
        setShell(current.shell);
        setAside(current.aside);
        return;
      }
      frame=requestAnimationFrame(connect);
    };
    connect();
    return()=>cancelAnimationFrame(frame);
  },[]);

  useEffect(()=>{
    const {main}=findShell();
    if(!main)return;
    const custom=active==='life'||active==='learning';
    main.hidden=custom;
    document.body.dataset.workspace=active;
  },[active]);

  const legacyButtons=()=>Array.from(document.querySelectorAll<HTMLButtonElement>('.shell aside > nav:not(.renaissance-nav) button'));

  const select=(item:NavigationItem)=>{
    setActive(item.id);
    if(!item.legacyLabel)return;
    const button=legacyButtons().find(candidate=>candidate.textContent?.includes(item.legacyLabel!));
    button?.click();
  };

  const sidebarPortal=useMemo(()=>aside?createPortal(
    <div className="liv-sidebar-inner">
      <header className="liv-sidebar-brand">
        <strong>liv</strong>
        <p>Familjen äger informationen.</p>
      </header>
      <nav className="renaissance-nav" aria-label="Huvudnavigation">
        {navigation.map(item=><button key={item.id} type="button" className={active===item.id?'active':''} aria-current={active===item.id?'page':undefined} onClick={()=>select(item)}><span aria-hidden="true">{item.icon}</span><b>{item.label}</b></button>)}
      </nav>
      <footer className="liv-sidebar-user">
        <span className="liv-user-avatar">B</span>
        <span className="liv-user-copy"><strong>Ben</strong><small>Administratör</small></span>
        <span className="liv-user-chevron">⌄</span>
      </footer>
    </div>,aside):null,[active,aside]);

  const workspacePortal=useMemo(()=>shell?createPortal(
    <div className={`renaissance-workspaces ${active==='life'||active==='learning'?'is-open':''}`}>
      <section className="renaissance-workspace life-workspace" hidden={active!=='life'} aria-label="Livet">
        <header className="renaissance-header"><div><p>WORKSPACE · 02</p><h1>Livet</h1><span>Vad har hänt i Viktors vardag?</span></div><strong>Familjens berättelser</strong></header>
        <div className="renaissance-statement"><p>VIKTORS DAGAR · BEVARADE TILLSAMMANS</p><h2>Ett liv består av vanliga dagar.</h2><span>Här får berättelserna, minnena och de små ögonblicken en lugn plats att leva vidare.</span></div>
        <div id="life-workspace-content"/>
      </section>
      <section className="renaissance-workspace learning-workspace" hidden={active!=='learning'} aria-label="Det vi har lärt oss">
        <header className="renaissance-header"><div><p>WORKSPACE · 03</p><h1>Det vi har lärt oss</h1><span>Vilka mönster kan familjen se över tid?</span></div><strong>Observation, inte diagnos</strong></header>
        <div className="renaissance-statement learning"><p>FÖRSTÅELSE · UNDERLAG · ÖDMJUKHET</p><h2>Små mönster. Alltid med underlag.</h2><span>Liv uppmärksammar återkommande samband. Familjen avgör vad som faktiskt stämmer för Viktor.</span></div>
        <div id="learning-workspace-content"/>
      </section>
    </div>,shell):null,[active,shell]);

  return <>{sidebarPortal}{workspacePortal}</>;
}

const host=document.getElementById('workspace-architecture-root');
if(host)ReactDOM.createRoot(host).render(<React.StrictMode><WorkspaceArchitecture/></React.StrictMode>);