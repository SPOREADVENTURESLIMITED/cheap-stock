import {bootstrapAdmin} from '@/lib/cloudflare/auth';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const origin=request.headers.get('origin');const host=request.headers.get('host');
 if(origin&&new URL(origin).host!==host)return Response.json({error:'Origin rejected'},{status:403});
 try{const body=await request.json() as {token?:string,email?:string,password?:string};await bootstrapAdmin(body.token||'',body.email||'',body.password||'');return Response.json({ok:true,message:'Initial administrator created. Remove or rotate the bootstrap token now.'},{status:201})}
 catch(e){return Response.json({error:e instanceof Error?e.message:'Setup failed'},{status:400})}
}
