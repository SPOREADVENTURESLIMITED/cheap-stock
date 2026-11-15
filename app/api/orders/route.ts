import {initiatePesapalPayment} from '@/lib/cloudflare/pesapal';
import {getDb} from '@/lib/cloudflare/db';
export const dynamic='force-dynamic';
type RequestItem={productId:string;quantity:number};
type Product={id:string,name:string,retail_price:number,wholesale_price:number,is_alcoholic:number,active:number,stock_quantity:number};
export async function POST(request:Request){
 const origin=request.headers.get('origin');const host=request.headers.get('host');if(origin&&new URL(origin).host!==host)return Response.json({error:'Origin rejected'},{status:403});
 try{
  const body=await request.json() as {name?:string;phone?:string;email?:string;address?:string;notes?:string;customerType?:string;paymentMethod?:string;ageConfirmed?:boolean;items?:RequestItem[]};
  const name=String(body.name||'').trim(),phone=String(body.phone||'').replace(/[^+0-9]/g,'');
  if(name.length<2||phone.length<9||phone.length>16)return Response.json({error:'Enter your name and a valid Uganda phone number.'},{status:400});
  if(!Array.isArray(body.items)||body.items.length<1||body.items.length>30)return Response.json({error:'Your cart is empty or contains too many different products.'},{status:400});
  const quantities=new Map<string,number>();for(const item of body.items){if(!/^[a-zA-Z0-9-]{1,80}$/.test(item.productId)||!Number.isFinite(item.quantity)||item.quantity<=0||item.quantity>500)return Response.json({error:'One or more cart items are invalid.'},{status:400});quantities.set(item.productId,(quantities.get(item.productId)||0)+item.quantity)}
  const db=await getDb();const ids=[...quantities.keys()];const placeholders=ids.map(()=>'?').join(',');
  const {results}=await db.prepare('SELECT id,name,retail_price,wholesale_price,is_alcoholic,active,stock_quantity FROM products WHERE active=1 AND id IN ('+placeholders+')').bind(...ids).all<Product>();
  if(results.length!==ids.length)return Response.json({error:'A product in your cart is no longer available. Refresh the catalogue.'},{status:409});
  const customerType=body.customerType==='wholesale'?'wholesale':'retail';const ageRestricted=results.some(p=>p.is_alcoholic===1);
  if(ageRestricted&&!body.ageConfirmed)return Response.json({error:'Confirm that you are at least 18 before requesting age-restricted products.'},{status:400});
  const lineItems=results.map(p=>{const qty=quantities.get(p.id)||0;const price=customerType==='wholesale'&&p.wholesale_price>0?p.wholesale_price:p.retail_price;return {product:p,quantity:qty,price,total:Math.round(price*qty)}});
  const subtotal=lineItems.reduce((sum,item)=>sum+item.total,0);if(!Number.isSafeInteger(subtotal)||subtotal<=0)return Response.json({error:'The order total is invalid.'},{status:400});
  const method=['cash','mobile_money','bank','pesapal'].includes(body.paymentMethod||'')?body.paymentMethod!:'mobile_money';
  const orderId=crypto.randomUUID(),customerId=crypto.randomUUID(),paymentId=crypto.randomUUID();
  const orderNumber='CS-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+crypto.randomUUID().slice(0,6).toUpperCase();
  const stmts=[
   db.prepare("INSERT INTO customers(id,full_name,phone,email,customer_type,delivery_address,age_verified) VALUES(?,?,?,?,?,?,0)").bind(customerId,name,phone,body.email||null,customerType,body.address||null),
   db.prepare("INSERT INTO orders(id,order_number,customer_id,status,subtotal,delivery_fee,total,payment_status,payment_method,delivery_address,notes,age_confirmed) VALUES(?,?,?,'pending',?,0,?,'unpaid',?,?,?,?)").bind(orderId,orderNumber,customerId,subtotal,subtotal,method,body.address||null,String(body.notes||'').slice(0,1000),body.ageConfirmed?1:0),
   ...lineItems.map(item=>db.prepare('INSERT INTO order_items(id,order_id,product_id,product_name,quantity,unit_price,line_total) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),orderId,item.product.id,item.product.name,item.quantity,item.price,item.total)),
   db.prepare("INSERT INTO payments(id,order_id,provider,method,amount,status) VALUES(?,?,'manual',?,?,'pending')").bind(paymentId,orderId,method,subtotal),
  ];
  await db.batch(stmts);
  let paymentUrl:string|null=null;let paymentMessage='Order request received. Our team must confirm stock, delivery and payment instructions. No payment has been collected.';
  if(method==='pesapal'&&ageRestricted){paymentMessage='Order request saved. Because your basket contains age-restricted products, staff must verify your identity and legal age before any payment request.'}
  else if(method==='pesapal'){try{paymentUrl=await initiatePesapalPayment({orderId,orderNumber,amount:subtotal,name,phone,email:body.email||null,address:body.address||null,origin:new URL(request.url).origin});paymentMessage='Order created. Continue to Pesapal to choose a payment method. The order is marked paid only after server-side verification.'}catch{paymentMessage='Order saved, but online payment setup is not ready. Contact customer care; do not send money to an unverified number.'}}
  return Response.json({ok:true,orderNumber,total:subtotal,currency:'UGX',paymentStatus:'unpaid',paymentUrl,message:paymentMessage},{status:201});
 }catch{return Response.json({error:'Order could not be submitted. Please try again shortly.'},{status:503})}
}
