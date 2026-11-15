import {clearSession} from '@/lib/cloudflare/auth';
export async function POST(){await clearSession();return Response.json({ok:true})}
