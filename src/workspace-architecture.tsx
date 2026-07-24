import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import './workspace-architecture.css';

type CustomWorkspace='life'|'learning'|null;

function WorkspaceArchitecture(){
  const [active,setActive]=useState<CustomWorkspace>(null);

  useEffect(()=>{
    const shell=document.querySelector('.shell');
    const nav=shell?.querySelector('aside nav');
    const main=shell?.querySelector('main') as HTMLElement|null;
    if(!shell||!nav||!main)return;

    const existingButtons=Array.from(nav.querySelectorAll('button'));
    const personButton=existingButtons.find(button=>button.textContent?.includes('Viktor'));

    const makeButton=(id:'life'|'learning',icon:string,label:string)=>{
      const button=document.createElement('button');
      button.type='button';
      button.dataset.customWorkspace=id;
      button.innerHTML=`<span>${icon}</span> ${label}`;
      button.addEventListener('click',()=>setActive(id));
      return button;
    };

    const lifeButton=makeButton('life','▥','Livet');
    const learningButton=makeButton('learning','✦','Det vi har lärt oss');
    if(personButton){personButton.insertAdjacentElement('afterend',learningButton);personButton.insertAdjacentElement('afterend',lifeButton)}
    else{nav.append(lifeButton,learningButton)}

    const leaveCustom=()=>setActive(null);
    existingButtons.forEach(button=>button.addEventListener('click',leaveCustom));

    return()=>{
      existingButtons.forEach(button=>button.removeEventListener('click',leaveCustom));
      lifeButton.remove();learningButton.remove();
    };
  },[]);

  useEffect(()=>{
    const shell=document.querySelector('.shell');
    const main=shell?.querySelector('main') as HTMLElement|null;
    const nav=shell?.querySelector('aside nav');
    if(!shell||!main||!nav)return;
    const customButtons=Array.from(nav.querySelectorAll<HTMLButtonElement>('[data-custom-workspace]'));
    const normalButtons=Array.from(nav.querySelectorAll<HTMLButtonElement>('button:not([data-custom-workspace])'));
    customButtons.forEach(button=>button.classList.toggle('active',button.dataset.customWorkspace===active));
    if(active){normalButtons.forEach(button=>button.classList.remove('active'));main.hidden=true}else main.hidden=false;
  },[active]);

  return <div className={`renaissance-workspaces ${active?'is-open':''}`}>
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
  </div>;
}

const host=document.getElementById('workspace-architecture-root');
if(host)ReactDOM.createRoot(host).render(<React.StrictMode><WorkspaceArchitecture/></React.StrictMode>);
