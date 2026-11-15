'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/cloudflare/auth';
import {getDb} from '@/lib/cloudflare/db';
export async function updateOrderStatus(formData:FormData){const user=await requireAdmin();const db=await getDb();const id=String(formData.get('order_id')||'');const status=String(formData.get('status')||'');if(!['pending','confirmed','processing','ready','dispatched','completed','cancelled'].includes(status))redirect('/admin/orders?error=invalid');await db.prepare('UPDATE orders SET status=?,updated_at=datetime(\'now\') WHERE id=?').bind(status,id).run();await db.prepare('INSERT INTO audit_logs(id,actor_id,action,entity_type,entity_id,details) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user.id,'order.status_changed','order',id,JSON.stringify({status})).run();revalidatePath('/admin/orders');redirect('/admin/orders?updated=1')}
