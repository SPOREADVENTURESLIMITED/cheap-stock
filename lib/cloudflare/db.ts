import {getCloudflareContext} from '@opennextjs/cloudflare';
export interface D1Statement {
 bind(...values:unknown[]):D1Statement;
 first<T=Record<string,unknown>>():Promise<T|null>;
 all<T=Record<string,unknown>>():Promise<{results:T[];success:boolean}>;
 run():Promise<{success:boolean;meta?:unknown}>;
}
export interface D1Database {prepare(query:string):D1Statement;batch<T=unknown>(statements:D1Statement[]):Promise<T[]>}
export interface R2Bucket {put(key:string,value:ReadableStream|ArrayBuffer|ArrayBufferView|string,options?:unknown):Promise<unknown>;get(key:string):Promise<unknown>;delete(key:string):Promise<void>}
export interface KVNamespace {get(key:string,type?:'text'):Promise<string|null>;put(key:string,value:string,options?:unknown):Promise<void>;delete(key:string):Promise<void>}
export interface CheapStockEnv {
 DB:D1Database; PRODUCT_IMAGES?:R2Bucket; CACHE?:KVNamespace;
 ADMIN_BOOTSTRAP_TOKEN?:string; ADMIN_RECOVERY_KEY?:string;
}
export async function getEnv(){const context=await getCloudflareContext({async:true});return context.env as unknown as CheapStockEnv}
export async function getDb(){const env=await getEnv();if(!env.DB)throw new Error('Cloudflare D1 binding DB is missing.');return env.DB}
