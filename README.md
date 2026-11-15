# CHEAP STOCK
**Quality Drinks. Wholesale Prices. Always Stocked.**

Ugandan drinks retail and wholesale platform. Currency: UGX.

## Cloudflare-only platform
- **Cloudflare Workers** — Next.js application runtime and API routes via OpenNext.
- **Cloudflare D1** — products, customers, orders, payments, stock, audit and admin sessions.
- **Cloudflare KV** — rate limiting, cache and binary product-image storage (up to 5 MB per uploaded image).
- **Cloudflare security** — HTTPS, Worker secrets, secure HTTP-only admin session cookies and optional Turnstile integration.

Supabase has been removed from application dependencies and runtime access.

## Provisioning and deployment
Wrangler declares D1, KV and R2 resources. Cloudflare supports automatic provisioning of these resources from Wrangler configuration during deployment. GitHub Actions deploys the Worker and applies D1 migrations.

Required GitHub Actions secrets are only `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The token needs Workers Scripts Edit, D1 Edit and Workers KV Storage Edit permissions. The deployment workflow reuses the existing D1 and KV resources, deploys the Worker and applies D1 migrations.

Set application secrets directly in Cloudflare Dashboard → Workers & Pages → `cheap-stock` → Settings → Variables and Secrets → Add secret:
- `ADMIN_BOOTSTRAP_TOKEN` — long random one-time token for first administrator setup.
- `ADMIN_RECOVERY_KEY` — long random owner recovery key.
- `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET` — merchant API credentials from Pesapal.
- `PESAPAL_ENV` — `sandbox` for testing or `live` for production.

Never commit secrets or paste them into chat. After first admin setup, remove or rotate `ADMIN_BOOTSTRAP_TOKEN` in Cloudflare.

## First administrator
1. Deploy the Worker and wait for D1 migration to finish.
2. Open `/admin/setup`.
3. Enter the bootstrap token, owner email and a unique password of at least 14 characters.
4. Sign in at `/admin/login`.
5. Remove/rotate the bootstrap token. Keep the recovery key in a secure password manager.
6. For password recovery, use `/admin/reset-password` with the owner recovery key.

## D1 migrations
- Local: `npm run db:migrate:local`
- Production: `npm run db:migrate:remote`

## Local development
Run `npm install`, then `npm run dev`. Wrangler bindings are declared in `wrangler.jsonc`. Use a local `.dev.vars` file for secrets; never commit it.

## Payment status
Checkout includes a Pesapal API 3.0 adapter: it requests a hosted checkout URL, registers a Cloudflare IPN endpoint, verifies transaction status server-to-server, checks amount/currency/merchant reference and records the confirmation in D1. Pesapal documents hosted checkout, IPN and status lookup as separate required steps. This integration remains inactive until valid merchant credentials are supplied as Worker secrets and tested in Pesapal sandbox. Never mark an order paid based only on a browser redirect or customer screenshot.

## Compliance
Alcohol products require age verification, applicable Ugandan licensing and responsible-sales controls. Product stock, prices and delivery availability must be confirmed before accepting payment.
