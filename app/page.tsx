import SupportWidget from '@/components/support-widget';
import InstallApp from '@/components/install-app';

const products = [
  {name:'Bottled Water',category:'Water',description:'Still and sparkling water options',image:'/catalog/water.svg',type:'Non-alcoholic'},
  {name:'Fruit Juice',category:'Juices',description:'Fruit juices and juice blends',image:'/catalog/juice.svg',type:'Non-alcoholic'},
  {name:'Soft Drinks',category:'Sodas',description:'Carbonated soft drinks and mixers',image:'/catalog/soda.svg',type:'Non-alcoholic'},
  {name:'Energy Drinks',category:'Energy',description:'Energy and sports drink options',image:'/catalog/energy.svg',type:'Non-alcoholic'},
  {name:'Beer',category:'Beer',description:'Beer selection for eligible customers',image:'/catalog/beer.svg',type:'Age-restricted'},
  {name:'Wine & Spirits',category:'Wine',description:'Wine and spirits selection for eligible customers',image:'/catalog/wine.svg',type:'Age-restricted'},
];

export default function Home() {
  return <main>
    <div className="topbar">QUALITY DRINKS • WHOLESALE PRICES • ALWAYS STOCKED</div>
    <header className="nav">
      <a className="logo" href="/">CHEAP<span>STOCK.</span></a>
      <nav className="navlinks"><a href="#products">Shop drinks</a><a href="#wholesale">Wholesale</a><a href="#help">Help centre</a></nav>
      <div className="navright"><a className="pill" href="/admin">Admin</a><a className="btn primary" href="#products">Shop now</a></div>
    </header>
    <section className="hero"><div className="hero-inner">
      <div><div className="eyebrow">Your drinks. Your price. Your stockist.</div><h1>Good drinks.<br/><em>Better prices.</em></h1><p>Stock up for home, your shop, restaurant or event. Discover a growing range of drinks with competitive retail and wholesale pricing across Uganda.</p><div className="actions"><a className="btn primary" href="#products">Explore drinks →</a><a className="btn secondary" href="#wholesale">Wholesale enquiries</a></div><p className="hero-note">Retail and bulk enquiries welcome • Prices and availability confirmed before acceptance.</p></div>
      <div className="hero-art" aria-label="Illustration of a selection of drinks"><div className="art-circle">🥤</div><div className="art-tag">VALUE THAT NEVER RUNS DRY</div></div>
    </div></section>
    <section className="section" id="products"><div className="section-head"><div><div className="eyebrow">Browse our range</div><h2>Drinks catalogue</h2><div className="muted">Explore categories. Ask us to confirm stock, pack sizes and current prices.</div></div><span className="catalog-note">UGX • Uganda</span></div><div className="product-grid">{products.map(p=><article className="product-card" key={p.name}><div className="product-image"><img src={p.image} alt={p.name+' product category'}/><span className={p.type==='Age-restricted'?'age-tag':'type-tag'}>{p.type}</span></div><div className="product-info"><div className="product-category">{p.category}</div><h3>{p.name}</h3><p>{p.description}</p><a className="product-action" href="#customer-care">Enquire about this range <span>→</span></a></div></article>)}</div><p className="catalog-disclaimer">Catalogue illustrations are category examples, not confirmed stock or brand listings. Final product, pack size, price and availability are confirmed by our team.</p></section>
    <section className="section" id="wholesale"><div className="wholesale-panel"><div><div className="eyebrow">For businesses & events</div><h2>Need drinks in bulk?</h2><p>Tell us what you need for your shop, bar, restaurant, office or event. Our team can confirm wholesale quantities, delivery options and pricing.</p></div><a className="btn primary" href="#customer-care">Request wholesale pricing</a></div></section>
    <section className="section help-section" id="help"><div className="eyebrow">Here to help</div><h2>Customer care & quick answers</h2><p className="muted">Use the help button to browse common questions and start a support enquiry.</p><div className="faq-grid"><div><strong>How do I place an order?</strong><p>Browse the catalogue and send an enquiry. Orders are confirmed by our team before payment is requested.</p></div><div><strong>Do you offer wholesale prices?</strong><p>Yes. Wholesale pricing depends on product, quantity and availability.</p></div><div><strong>Can I request delivery?</strong><p>Ask our team to confirm delivery coverage, timing and fees for your location.</p></div><div><strong>How are payments confirmed?</strong><p>Only use payment instructions issued through an official CHEAP STOCK order confirmation. Keep your transaction reference.</p></div></div></section>
    <section className="section" id="customer-care"><div className="notice"><strong>Need assistance?</strong><br/>Open the customer care chat to get help with product enquiries, orders, wholesale requests, delivery and payment questions.</div></section>
    <footer className="footer"><div className="footer-inner"><div><a className="logo" href="/">CHEAP<span>STOCK.</span></a><p>Quality Drinks. Wholesale Prices. Always Stocked.</p><p>Uganda • Currency: UGX</p></div><div><strong>Customer support</strong><p>Use the customer care chat for assistance and enquiries.</p><p><a href="#help">Frequently asked questions</a></p></div><div><strong>Responsible sales</strong><p>Alcohol products are subject to age checks, licensing and applicable legal requirements. We do not accept underage orders.</p></div><div><strong>Stay connected</strong><p>Official social and WhatsApp contact links will be added once confirmed.</p></div></div></footer>
    <a className="floating-shop" href="#products" aria-label="Shop drinks"><span>🛒</span> Shop drinks</a>
    <SupportWidget />
    <InstallApp />
  </main>;
}
