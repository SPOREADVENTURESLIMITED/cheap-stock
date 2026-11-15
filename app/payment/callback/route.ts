import {NextResponse} from 'next/server';
import {reconcilePesapalPayment} from '@/lib/cloudflare/pesapal';
export const dynamic='force-dynamic';
export async function GET(request:Request){const url=new URL(request.url);const tracking=url.searchParams.get('OrderTrackingId')||'';const merchant=url.searchParams.get('OrderMerchantReference')||'';let status='pending';try{if(tracking&&merchant){const result=await reconcilePesapalPayment(tracking,merchant);status=result.status}}catch{}return NextResponse.redirect(new URL('/payment/result?order='+encodeURIComponent(merchant)+'&status='+encodeURIComponent(status),url.origin),303)}
