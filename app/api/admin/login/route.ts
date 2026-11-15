import {getDb,getEnv} from '@/lib/cloudflare/db';
import {createSession,verifyPassword} from '@/lib/cloudflare/auth';
export const dynamic='force-dynamic';
async function rateLimit(request:Request){const env=await getEnv();if(!env.CACHE)return false;const ip=request.headers.get('cf-connecting-ip')||'unknown';const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');const key='admin-login:'+hash;const count=Number(await env.CACHE.get(key)||'0');if(count>=8)return true;await env.CACHE.put(key,String(count+1),{expirationTtl:600});return false}
export async function POST(request:Request){
 const origin=request.headers.get('origin');const host=request.headers.get('host');if(origin&&new URL(origin).host!==host)return Response.json({error:'Origin rejected'},{status:403});
 try{if(await rateLimit(request))return Response.json({error:'Too many sign-in attempts. Wait 10 minutes and try again.'},{status:429});const body=await request.json() as {email?:string,password?:string};if(!body.email||!body.password)return Response.json({error:'Email and password are required.'},{status:400});
 const db=await getDb();const user=await db.prepare('SELECT id,email,password_hash,password_salt,active FROM admin_users WHERE email=? COLLATE NOCASE').bind(body.email).first<{id:string,email:string,password_hash:string,password_salt:string,active:number}>();
 if(!user||!user.active||!(await verifyPassword(body.password,user.password_hash,user.password_salt)))return Response.json({error:'Invalid email or password.'},{status:401});
 const env=await getEnv();if(env.CACHE){const ip=request.headers.get('cf-connecting-ip')||'unknown';const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');await env.CACHE.delete('admin-login:'+hash)}
 await createSession(user.id);return Response.json({ok:true});
 }catch{return Response.json({error:'Cloudflare D1 is not configured or unavailable.'},{status:503})}
}
