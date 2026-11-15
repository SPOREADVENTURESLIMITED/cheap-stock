import {getDb} from '@/lib/cloudflare/db';
export const dynamic='force-dynamic';
export async function GET(){try{const db=await getDb();const result=await db.prepare('SELECT 1 AS ok').first<{ok:number}>();return Response.json({ok:result?.ok===1,platform:'Cloudflare Workers',database:'D1',time:new Date().toISOString()})}catch{return Response.json({ok:false,platform:'Cloudflare Workers',database:'unavailable'},{status:503})}}
