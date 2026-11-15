'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
export async function createProduct(formData:FormData){
 const sb=await createClient();const {data:{user}}=await sb.auth.getUser();if(!user||user.app_metadata.role!=='admin')redirect('/admin/login');
 const name=String(formData.get('name')||'').trim();const sku=String(formData.get('sku')||'').trim()||null;const category=String(formData.get('category_id')||'')||null;const cost=Number(formData.get('cost_price')||0);const retail=Number(formData.get('retail_price')||0);const wholesale=Number(formData.get('wholesale_price')||0);const reorder=Number(formData.get('reorder_level')||0);const alcoholic=formData.get('is_alcoholic')==='on';const minimumAge=alcoholic?Number(formData.get('minimum_age')||18):null;
 if(!name||![cost,retail,wholesale,reorder].every(n=>Number.isFinite(n)&&n>=0)|| (alcoholic&&(!Number.isInteger(minimumAge)||minimumAge<18||minimumAge>25))) redirect('/admin/products?error=invalid');
 const {error}=await sb.from('products').insert({name,sku,category_id:category,cost_price:cost,retail_price:retail,wholesale_price:wholesale,reorder_level:reorder,is_alcoholic:alcoholic,minimum_age:minimumAge});
 if(error)redirect('/admin/products?error=save');
 await sb.from('audit_logs').insert({actor_id:user.id,action:'product.created',entity_type:'product',details:{name,sku}});
 revalidatePath('/admin/products');revalidatePath('/');redirect('/admin/products?created=1');
}
