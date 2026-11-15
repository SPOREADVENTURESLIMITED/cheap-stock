'use client';
import {useState} from 'react';
const answers=[
 {q:'How do I place an order?',a:'Send us the product, pack size and quantity you need. Our team must confirm availability and the final UGX total before payment.'},
 {q:'Do you offer wholesale prices?',a:'Yes. Wholesale prices depend on the item and quantity. Tell us your business type and estimated quantities for a quote.'},
 {q:'Which payment methods are accepted?',a:'Payment options will be stated on your confirmed order. Never pay to a personal number or account not shown on an official CHEAP STOCK confirmation.'},
 {q:'How do I check my payment?',a:'Keep your mobile money or bank transaction reference. Payment reconciliation is not yet connected to a live provider; our team must verify transactions before marking an order paid.'},
 {q:'Do you deliver?',a:'Delivery areas, fees and estimated times are confirmed when your order is reviewed.'},
 {q:'Can I buy alcohol?',a:'Age-restricted products are only available to customers who meet applicable legal age and licensing requirements. Age verification is required.'},
];
export default function SupportWidget(){
 const [open,setOpen]=useState(false);const [selected,setSelected]=useState<number|null>(null);const [message,setMessage]=useState('');const [copied,setCopied]=useState(false);
 async function copyEnquiry(){if(!message.trim())return;try{await navigator.clipboard.writeText('CHEAP STOCK customer enquiry:\n'+message);setCopied(true)}catch{setCopied(false)}}
 return <div className="support-widget"><button className="floating-support" onClick={()=>setOpen(v=>!v)} aria-expanded={open}><span>💬</span> Chat with us</button>{open&&<section className="support-panel" aria-label="Customer care chat"><header><div><strong>CHEAP STOCK CARE</strong><small>Quick help & enquiries</small></div><button onClick={()=>setOpen(false)} aria-label="Close chat">×</button></header><div className="support-body"><p className="bot-message">Hello! Welcome to CHEAP STOCK. Choose a question below or prepare an enquiry for our team.</p>{answers.map((item,i)=><div className="faq-answer" key={item.q}><button onClick={()=>setSelected(selected===i?null:i)}>{item.q}<span>{selected===i?'−':'+'}</span></button>{selected===i&&<p>{item.a}</p>}</div>)}<label className="support-label" htmlFor="support-message">Your enquiry</label><textarea id="support-message" value={message} onChange={e=>{setMessage(e.target.value);setCopied(false)}} placeholder="Tell us what drinks or help you need..." rows={3}/><button className="support-send" onClick={copyEnquiry} disabled={!message.trim()}>Copy enquiry to share</button>{copied&&<p className="support-footnote">Enquiry copied. Paste it into your preferred contact channel. Official WhatsApp, email and social links are awaiting confirmation.</p>}<small className="support-footnote">This is an automated FAQ assistant, not a live human agent.</small></div></section>}</div>;
}
