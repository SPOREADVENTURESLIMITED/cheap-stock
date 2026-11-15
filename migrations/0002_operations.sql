CREATE TABLE IF NOT EXISTS suppliers (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, contact_name TEXT, phone TEXT, email TEXT, address TEXT,
 tax_reference TEXT, payment_terms TEXT, active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS purchase_orders (
 id TEXT PRIMARY KEY, purchase_number TEXT NOT NULL UNIQUE, supplier_id TEXT NOT NULL REFERENCES suppliers(id),
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','ordered','part_received','received','cancelled')),
 total INTEGER NOT NULL DEFAULT 0, expected_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS purchase_order_items (
 id TEXT PRIMARY KEY, purchase_order_id TEXT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
 product_id TEXT NOT NULL REFERENCES products(id), quantity REAL NOT NULL CHECK(quantity>0),
 unit_cost INTEGER NOT NULL CHECK(unit_cost>=0), received_quantity REAL NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS expenses (
 id TEXT PRIMARY KEY, category TEXT NOT NULL, description TEXT NOT NULL,
 amount INTEGER NOT NULL CHECK(amount>0), expense_date TEXT NOT NULL DEFAULT (date('now')),
 payment_method TEXT, reference TEXT, recorded_by TEXT REFERENCES admin_users(id),
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
