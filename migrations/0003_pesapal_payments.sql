ALTER TABLE payments ADD COLUMN provider_tracking_id TEXT;
ALTER TABLE payments ADD COLUMN checkout_url TEXT;
ALTER TABLE payments ADD COLUMN confirmation_code TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_provider_tracking ON payments(provider_tracking_id) WHERE provider_tracking_id IS NOT NULL;
