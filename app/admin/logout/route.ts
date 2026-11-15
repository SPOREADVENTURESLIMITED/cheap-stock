import {NextResponse,type NextRequest} from 'next/server';
import {clearSession} from '@/lib/cloudflare/auth';
export async function POST(request:NextRequest){await clearSession();return NextResponse.redirect(new URL('/admin/login',request.url),303)}
