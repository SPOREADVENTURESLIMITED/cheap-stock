const categories = [
  ['💧','Water'],['🧃','Juices & Mixers'],['🥤','Soft Drinks'],['⚡','Energy Drinks'],['☕','Tea & Coffee'],['🍾','Beer, Wine & Spirits'],
];

export default function Home() {
  return <main>
    <div className="topbar">QUALITY DRINKS • WHOLESALE PRICES • ALWAYS STOCKED</div>
    <header className="nav">
      <a className="logo" href="/">CHEAP<span>STOCK.</span></a>
      <nav className="navlinks"><a href="#categories">Shop categories</a><a href="#wholesale">Wholesale</a><a href="#about">About us</a></nav>
      <div className="navright"><a className="pill" href="/admin">Admin</a><a className="btn primary" href="#categories">Shop now</a></div>
    </header>
    <section className="hero"><div className="hero-inner">
      <div><div className="eyebrow">Your drinks. Your price. Your stockist.</div><h1>Good drinks.<br/><em>Better prices.</em></h1><p>Stock up for home, your shop, restaurant or event. Discover a wide range of drinks with competitive retail and wholesale pricing.</p><div className="actions"><a className="btn primary" href="#categories">Explore drinks →</a><a className="btn secondary" href="#wholesale">Wholesale enquiries</a></div></div>
      <div className="hero-art" aria-label="Drinks illustration"><div className="art-circle">🥤</div><div className="art-tag">VALUE THAT NEVER RUNS DRY</div></div>
    </div></section>
    <section className="section" id="categories"><div className="section-head"><div><div className="eyebrow">Browse our range</div><h2>Shop by category</h2><div className="muted">Find the right refreshment for every occasion.</div></div></div><div className="categories">{categories.map(([emoji,name])=><a className="category" href="#wholesale" key={name}><div className="emoji">{emoji}</div><strong>{name}</strong></a>)}</div></section>
    <section className="section" id="wholesale"><div className="notice"><strong>Wholesale & business orders</strong><br/>Buying for a shop, bar, restaurant, office or event? Contact our team for bulk-order enquiries and tailored pricing. Product availability and prices will be confirmed before an order is accepted.</div></section>
    <section className="section" id="about"><div className="eyebrow">CHEAP STOCK</div><h2>Always stocked. Always good value.</h2><p className="muted">A drinks marketplace concept built to serve customers and businesses across Uganda. Our online catalogue and ordering features are being developed.</p></section>
    <footer className="footer"><div className="footer-inner"><div><a className="logo" href="/">CHEAP<span>STOCK.</span></a><p>Quality Drinks. Wholesale Prices. Always Stocked.</p></div><div><strong>Customer support</strong><p>Contact details and ordering channels will be published here.</p></div><div><strong>Responsible sales</strong><p>Alcohol products are subject to age, licensing and applicable legal requirements.</p></div></div></footer>
  </main>;
}
