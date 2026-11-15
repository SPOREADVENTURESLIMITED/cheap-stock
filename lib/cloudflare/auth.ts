import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {getDb,getEnv} from './db';
const COOKIE='cheap_stock_session';
const encoder=new TextEncoder();
function hex(bytes:Uint8Array){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
function unhex(value:string){return new Uint8Array(value.match(/.{1,2}/g)?.map(x=>parseInt(x,16))||[])}
async function digest(value:string){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))))}
const PBKDF2_ITERATIONS=100000;
export async function hashPassword(password:string,salt?:string){
 const saltBytes=salt?unhex(salt):crypto.getRandomValues(new Uint8Array(16));
 const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:saltBytes,iterations:PBKDF2_ITERATIONS,hash:'SHA-256'},material,256);
 return {hash:hex(new Uint8Array(bits)),salt:hex(saltBytes)};
}
export async function verifyPassword(password:string,hash:string,salt:string){const result=await hashPassword(password,salt);return result.hash===hash}
export async function createSession(userId:string){
 const db=await getDb();const token=hex(crypto.getRandomValues(new Uint8Array(32)));const tokenHash=await digest(token);const expires=Math.floor(Date.now()/1000)+60*60*12;
 await db.prepare('INSERT INTO admin_sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)').bind(crypto.randomUUID(),userId,tokenHash,expires).run();
 const jar=await cookies();jar.set(COOKIE,token,{httpOnly:true,secure:true,sameSite:'lax',path:'/',expires:new Date(expires*1000)});
}
export async function getAdmin(){
 const jar=await cookies();const token=jar.get(COOKIE)?.value;if(!token)return null;
 const db=await getDb();const tokenHash=await digest(token);
 const row=await db.prepare('SELECT u.id,u.email,u.role FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1').bind(tokenHash,Math.floor(Date.now()/1000)).first<{id:string,email:string,role:string}>();
 return row||null;
}
export async function requireAdmin(){const user=await getAdmin();if(!user)redirect('/admin/login');return user}
export async function clearSession(){
 const jar=await cookies();const token=jar.get(COOKIE)?.value;
 if(token){const db=await getDb();await db.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await digest(token)).run()}
 jar.delete(COOKIE);
}
export async function bootstrapAdmin(token:string,email:string,password:string){
 const env=await getEnv();if(!env.ADMIN_BOOTSTRAP_TOKEN||token!==env.ADMIN_BOOTSTRAP_TOKEN)throw new Error('Bootstrap token is invalid.');
 if(!email||password.length<14)throw new Error('Provide a valid admin email and a password of at least 14 characters.');
 const db=await getDb();const count=await db.prepare('SELECT COUNT(*) AS count FROM admin_users').first<{count:number}>();
 if((count?.count||0)>0)throw new Error('An administrator already exists. Use password recovery instead.');
 const credentials=await hashPassword(password);
 await db.prepare('INSERT INTO admin_users(id,email,password_hash,password_salt,role) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),email,credentials.hash,credentials.salt,'admin').run();
}
