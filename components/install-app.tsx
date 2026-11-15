'use client';
import {useEffect,useState} from 'react';
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
export default function InstallApp(){
 const [event,setEvent]=useState<InstallEvent|null>(null);const [showHelp,setShowHelp]=useState(false);
 useEffect(()=>{if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});const handler=(e:Event)=>{e.preventDefault();setEvent(e as InstallEvent)};window.addEventListener('beforeinstallprompt',handler);return()=>window.removeEventListener('beforeinstallprompt',handler)},[]);
 async function install(){if(event){await event.prompt();await event.userChoice;setEvent(null)}else setShowHelp(v=>!v)}
 return <div className="install-app"><button onClick={install} aria-label="Install CHEAP STOCK app">⬇ Install app</button>{showHelp&&<div className="install-help">On Android, open your browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>. On iPhone, tap Share, then <strong>Add to Home Screen</strong>.</div>}</div>;
}
