import {getCloudflareContext} from '@opennextjs/cloudflare';
export interface D1Statement {bind(...values:unknown[]):D1Statement;first<T=Record<string,unknown>>():Promise<T|null>;all<T=Record<string,unknown>>():Promise<{results:T[];success:boolean}>;run():Promise<{success:boolean;meta?:unknown}>}
export interface D1Database {prepare(query:string):D1Statement;batch<T=unknown>(statements:D1Statement[]):Promise<T[]>}
export interface KVNamespace {
 get(key:string,type:'arrayBuffer'):Promise<ArrayBuffer|null>;
 get(key:string,type?:'text'):Promise<string|null>;
 getWithMetadata(key:string,type:'arrayBuffer'):Promise<{value:ArrayBuffer|null;metadata:{contentType?:string}|null}>;
 put(key:string,value:string|ArrayBuffer|ReadableStream,options?:{expiration?:number;expirationTtl?:number;metadata?:Record<string,unknown>}):Promise<void>;
 delete(key:string):Promise<void>
}
export interface CheapStockEnv {DB:D1Database;CACHE?:KVNamespace;ADMIN_BOOTSTRAP_TOKEN?:string;ADMIN_RECOVERY_KEY?:string;PESAPAL_CONSUMER_KEY?:string;PESAPAL_CONSUMER_SECRET?:string;PESAPAL_ENV?:string}
export async function getEnv(){const context=await getCloudflareContext({async:true});return context.env as unknown as CheapStockEnv}
export async function getDb(){const env=await getEnv();if(!env.DB)throw new Error('Cloudflare D1 binding DB is missing.');return env.DB}
