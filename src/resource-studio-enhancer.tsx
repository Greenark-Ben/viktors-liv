import React from'react';
import{createRoot,type Root}from'react-dom/client';
import{ResourceStudio}from'./resource-studio';

let root:Root|undefined;
let active=false;

function closeResourceStudio(){
 if(!active)return;active=false;
 const host=document.getElementById('resource-studio-host');if(host)host.hidden=true;
 document.querySelector('.u-content')?.classList.remove('resource-mode');
 document.querySelector('[data-resource-studio-nav]')?.classList.remove('active');
}

function openResourceStudio(){
 const content=document.querySelector<HTMLElement>('.u-content');if(!content)return;
 let host=document.getElementById('resource-studio-host');
 if(!host){host=document.createElement('div');host.id='resource-studio-host';host.className='resource-studio-host';content.appendChild(host);root=createRoot(host);root.render(<ResourceStudio/>)}
 host.hidden=false;content.classList.add('resource-mode');active=true;
 const button=document.querySelector('[data-resource-studio-nav]');button?.classList.add('active');
}

function install(){
 const sidebar=document.querySelector('.u-sidebar');const nav=sidebar?.querySelector('nav');if(!sidebar||!nav)return;
 const studioButton=[...document.querySelectorAll<HTMLButtonElement>('.experience-switch button')].find(button=>button.textContent?.trim()==='STUDIO');
 if(!studioButton||nav.querySelector('[data-resource-studio-nav]'))return;
 const button=document.createElement('button');button.type='button';button.dataset.resourceStudioNav='true';button.innerHTML='<span>⌘</span><b>Resurser</b>';
 button.addEventListener('click',event=>{event.stopPropagation();openResourceStudio()});nav.appendChild(button);
 nav.addEventListener('click',event=>{const target=(event.target as HTMLElement).closest('button');if(target&&!target.hasAttribute('data-resource-studio-nav'))closeResourceStudio()});
 document.querySelectorAll<HTMLButtonElement>('.experience-switch button').forEach(item=>item.addEventListener('click',()=>{if(item.textContent?.trim()!=='STUDIO')closeResourceStudio();setTimeout(install)}));
}

const observer=new MutationObserver(()=>install());observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
