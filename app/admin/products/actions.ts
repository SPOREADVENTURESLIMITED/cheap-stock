'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/cloudflare/auth';
import {getDb,getEnv} from '@/lib/cloudflare/db';
export async function createProduct(formData:FormData){
 const user=await requireAdmin();const db=await getDb();const env=await getEnv();
 const name=String(formData.get('name')||'').trim();const sku=String(formData.get('sku')||'').trim()||null;const category=String(formData.get('category_id')||'')||null;const cost=Number(formData.get('cost_price')||0);const retail=Number(formData.get('retail_price')||0);const wholesale=Number(formData.get('wholesale_price')||0);const reorder=Number(formData.get('reorder_level')||0);const alcoholic=formData.get('is_alcoholic')==='on';const minimumAge=alcoholic?Number(formData.get('minimum_age')||18):null;
 if(!name||![cost,retail,wholesale].every(n=>Number.isSafeInteger(n)&&n>=0)||!Number.isFinite(reorder)||reorder<0||(alcoholic&&(minimumAge===null||!Number.isInteger(minimumAge)||minimumAge<18||minimumAge>25)))redirect('/admin/products?error=invalid');
 let imageKey:string|null=null;const image=formData.get('image');
 if(image instanceof File&&image.size>0){if(image.size>5*1024*1024||!['image/jpeg','image/png','image/webp','image/svg+xml'].includes(image.type)||!env.PRODUCT_IMAGES)redirect('/admin/products?error=image');const ext=image.type==='image/jpeg'?'jpg':image.type.split('/')[1];imageKey=crypto.randomUUID()+'.'+ext;await env.PRODUCT_IMAGES.put(imageKey,await image.arrayBuffer(),{httpMetadata:{contentType:image.type}})}
 const id=crypto.randomUUID();try{await db.prepare('INSERT INTO products(id,name,sku,category_id,cost_price,retail_price,wholesale_price,reorder_level,is_alcoholic,minimum_age,image_key) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(id,name,sku,category,cost,retail,wholesale,reorder,alcoholic?1:0,minimumAge,imageKey).run();await db.prepare('INSERT INTO audit_logs(id,actor_id,action,entity_type,entity_id,details) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user.id,'product.created','product',id,JSON.stringify({name,sku,imageKey})).run()}catch{if(imageKey&&env.PRODUCT_IMAGES)await env.PRODUCT_IMAGES.delete(imageKey);redirect('/admin/products?error=save')}
 revalidatePath('/admin/products');revalidatePath('/');redirect('/admin/products?created=1');
}
