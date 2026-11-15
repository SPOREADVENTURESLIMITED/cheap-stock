import {getCloudflareContext} from '@opennextjs/cloudflare';
export interface CheapStockEnv {
 DB: D1Database;
 PRODUCT_IMAGES?: R2Bucket;
 CACHE?: KVNamespace;
 SESSION_SECRET?: string;
 ADMIN_BOOTSTRAP_TOKEN?: string;
 ADMIN_EMAIL?: string;
 PAYMENT_PROVIDER?: string;
}
export async function getEnv(){
 const context=await getCloudflareContext({async:true});
 return context.env as unknown as CheapStockEnv;
}
export async function getDb(){const env=await getEnv();if(!env.DB)throw new Error('Cloudflare D1 binding DB is missing.');return env.DB;}
