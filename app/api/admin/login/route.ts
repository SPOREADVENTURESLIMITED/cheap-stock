import {getDb} from '@/lib/cloudflare/db';
import {createSession,verifyPassword} from '@/lib/cloudflare/auth';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const origin=request.headers.get('origin');const host=request.headers.get('host');if(origin&&new URL(origin).host!==host)return Response.json({error:'Origin rejected'},{status:403});
 try{const body=await request.json() as {email?:string,password?:string};if(!body.email||!body.password)return Response.json({error:'Email and password are required.'},{status:400});
 const db=await getDb();const user=await db.prepare('SELECT id,email,password_hash,password_salt,active FROM admin_users WHERE email=? COLLATE NOCASE').bind(body.email).first<{id:string,email:string,password_hash:string,password_salt:string,active:number}>();
 if(!user||!user.active||!(await verifyPassword(body.password,user.password_hash,user.password_salt)))return Response.json({error:'Invalid email or password.'},{status:401});
 await createSession(user.id);return Response.json({ok:true});
 }catch{return Response.json({error:'Cloudflare D1 is not configured or unavailable.'},{status:503})}
}
