import {getCloudflareContext} from '@opennextjs/cloudflare';
import type {D1Database,R2Bucket,KVNamespace} from '@cloudflare/workers-types';
export interface CheapStockEnv {
 DB:D1Database; PRODUCT_IMAGES?:R2Bucket; CACHE?:KVNamespace;
 ADMIN_BOOTSTRAP_TOKEN?:string; ADMIN_RECOVERY_KEY?:string;
}
export async function getEnv(){const context=await getCloudflareContext({async:true});return context.env as unknown as CheapStockEnv}
export async function getDb(){const env=await getEnv();if(!env.DB)throw new Error('Cloudflare D1 binding DB is missing.');return env.DB}
