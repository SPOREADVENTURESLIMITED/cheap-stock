'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/cloudflare/auth';
import {getDb} from '@/lib/cloudflare/db';
export async function createProduct(formData:FormData){
 const user=await requireAdmin();const db=await getDb();
 const name=String(formData.get('name')||'').trim();const sku=String(formData.get('sku')||'').trim()||null;const category=String(formData.get('category_id')||'')||null;const cost=Number(formData.get('cost_price')||0);const retail=Number(formData.get('retail_price')||0);const wholesale=Number(formData.get('wholesale_price')||0);const reorder=Number(formData.get('reorder_level')||0);const alcoholic=formData.get('is_alcoholic')==='on';const minimumAge=alcoholic?Number(formData.get('minimum_age')||18):null;
 if(!name||![cost,retail,wholesale,reorder].every(n=>Number.isSafeInteger(n)&&n>=0)||(alcoholic&&(minimumAge===null||!Number.isInteger(minimumAge)||minimumAge<18||minimumAge>25)))redirect('/admin/products?error=invalid');
 const id=crypto.randomUUID();try{await db.prepare('INSERT INTO products(id,name,sku,category_id,cost_price,retail_price,wholesale_price,reorder_level,is_alcoholic,minimum_age) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(id,name,sku,category,cost,retail,wholesale,reorder,alcoholic?1:0,minimumAge).run();await db.prepare('INSERT INTO audit_logs(id,actor_id,action,entity_type,entity_id,details) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user.id,'product.created','product',id,JSON.stringify({name,sku})).run()}catch{redirect('/admin/products?error=save')}
 revalidatePath('/admin/products');revalidatePath('/');redirect('/admin/products?created=1');
}
