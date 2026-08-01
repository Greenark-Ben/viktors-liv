import React from'react';
import{createRoot,type Root}from'react-dom/client';
import{FinancialActivityStudio}from'./financial-activity-studio';

let root:Root|null=null;
function synchroniseFinancialActivityStudio():void{
 const economy=document.querySelector<HTMLElement>('.economy-v2');
 if(!economy){root?.unmount();root=null;document.getElementById('financial-activity-host')?.remove();return}
 let host=economy.querySelector<HTMLElement>('#financial-activity-host');
 if(!host){host=document.createElement('div');host.id='financial-activity-host';const decision=economy.querySelector('.decision-dashboard');if(decision)economy.insertBefore(host,decision);else economy.appendChild(host)}
 if(!root)root=createRoot(host);
 root.render(<FinancialActivityStudio/>);
}
export function startFinancialActivityEnhancer():void{
 synchroniseFinancialActivityStudio();
 const app=document.getElementById('root');if(!app)return;
 const observer=new MutationObserver(synchroniseFinancialActivityStudio);observer.observe(app,{childList:true,subtree:true});
}
