'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/cloudflare/auth';
import {getDb} from '@/lib/cloudflare/db';
export async function updateTicket(formData:FormData){const user=await requireAdmin();const db=await getDb();const id=String(formData.get('ticket_id')||'');const status=String(formData.get('status')||'');if(!['open','in_progress','resolved','closed'].includes(status))redirect('/admin/support?error=invalid');await db.prepare('UPDATE support_tickets SET status=? WHERE id=?').bind(status,id).run();await db.prepare('INSERT INTO audit_logs(id,actor_id,action,entity_type,entity_id,details) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user.id,'support.ticket_updated','support_ticket',id,JSON.stringify({status})).run();revalidatePath('/admin/support');redirect('/admin/support?updated=1')}
