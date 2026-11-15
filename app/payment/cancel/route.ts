import {NextResponse} from 'next/server';
export async function GET(request:Request){return NextResponse.redirect(new URL('/payment/result?status=cancelled',request.url),303)}
