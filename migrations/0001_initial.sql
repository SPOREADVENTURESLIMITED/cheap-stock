PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS admin_users (
 id TEXT PRIMARY KEY,
 email TEXT NOT NULL UNIQUE COLLATE NOCASE,
 password_hash TEXT NOT NULL,
 password_salt TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('admin','manager','finance','inventory','sales','support')),
 active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS admin_sessions (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
 token_hash TEXT NOT NULL UNIQUE,
 expires_at INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions(expires_at);
CREATE TABLE IF NOT EXISTS categories (
 id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
 active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS products (
 id TEXT PRIMARY KEY, sku TEXT UNIQUE, name TEXT NOT NULL, description TEXT,
 category_id TEXT REFERENCES categories(id), image_key TEXT,
 unit TEXT NOT NULL DEFAULT 'piece', pack_size TEXT,
 cost_price INTEGER NOT NULL DEFAULT 0 CHECK(cost_price>=0),
 retail_price INTEGER NOT NULL DEFAULT 0 CHECK(retail_price>=0),
 wholesale_price INTEGER NOT NULL DEFAULT 0 CHECK(wholesale_price>=0),
 stock_quantity REAL NOT NULL DEFAULT 0 CHECK(stock_quantity>=0),
 reorder_level REAL NOT NULL DEFAULT 0 CHECK(reorder_level>=0),
 is_alcoholic INTEGER NOT NULL DEFAULT 0, minimum_age INTEGER,
 active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now')),
 CHECK(is_alcoholic=0 OR minimum_age>=18)
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id,active);
CREATE TABLE IF NOT EXISTS customers (
 id TEXT PRIMARY KEY, full_name TEXT NOT NULL, phone TEXT NOT NULL,
 email TEXT, customer_type TEXT NOT NULL DEFAULT 'retail' CHECK(customer_type IN ('retail','wholesale')),
 business_name TEXT, delivery_address TEXT, age_verified INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY, order_number TEXT NOT NULL UNIQUE, customer_id TEXT REFERENCES customers(id),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','processing','ready','dispatched','completed','cancelled')),
 subtotal INTEGER NOT NULL, delivery_fee INTEGER NOT NULL DEFAULT 0, total INTEGER NOT NULL,
 currency TEXT NOT NULL DEFAULT 'UGX' CHECK(currency='UGX'),
 payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid','pending','paid','failed','refunded')),
 payment_method TEXT, delivery_address TEXT, notes TEXT,
 age_confirmed INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status,payment_status);
CREATE TABLE IF NOT EXISTS order_items (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_id TEXT NOT NULL REFERENCES products(id), product_name TEXT NOT NULL,
 quantity REAL NOT NULL CHECK(quantity>0), unit_price INTEGER NOT NULL,
 line_total INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
 id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id),
 provider TEXT NOT NULL DEFAULT 'manual', method TEXT NOT NULL,
 provider_reference TEXT UNIQUE, amount INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','successful','failed','refunded')),
 raw_status TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), paid_at TEXT
);
CREATE TABLE IF NOT EXISTS stock_movements (
 id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id),
 movement_type TEXT NOT NULL, quantity REAL NOT NULL, reference TEXT,
 note TEXT, created_by TEXT REFERENCES admin_users(id), created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS support_tickets (
 id TEXT PRIMARY KEY, customer_name TEXT NOT NULL, phone TEXT, email TEXT,
 subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS audit_logs (
 id TEXT PRIMARY KEY, actor_id TEXT REFERENCES admin_users(id), action TEXT NOT NULL,
 entity_type TEXT NOT NULL, entity_id TEXT, details TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO categories(id,name,slug) VALUES
 ('cat-water','Water','water'),('cat-juice','Juices & Mixers','juices-mixers'),
 ('cat-soda','Soft Drinks','soft-drinks'),('cat-energy','Energy Drinks','energy-drinks'),
 ('cat-tea','Tea & Coffee','tea-coffee'),('cat-alcohol','Beer, Wine & Spirits','beer-wine-spirits');
