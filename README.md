# CHEAP STOCK
**Quality Drinks. Wholesale Prices. Always Stocked.**

Ugandan drinks retail and wholesale platform. Currency: UGX.

## Cloudflare-only platform
- **Cloudflare Workers** — Next.js application runtime and API routes via OpenNext.
- **Cloudflare D1** — products, customers, orders, payments, stock, audit and admin sessions.
- **Cloudflare R2** — product images and generated business documents.
- **Cloudflare KV** — cache and short-lived operational data.
- **Cloudflare security** — HTTPS, Worker secrets, secure HTTP-only admin session cookies and optional Turnstile integration.

Supabase has been removed from application dependencies and runtime access.

## Provisioning and deployment
Wrangler declares D1, KV and R2 resources. Cloudflare supports automatic provisioning of these resources from Wrangler configuration during deployment. GitHub Actions deploys the Worker and applies D1 migrations.

Required GitHub Actions secrets:
- `CLOUDFLARE_API_TOKEN` — Workers Scripts Edit, D1 Edit, Workers KV Storage Edit and R2 Storage Edit.
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID.
- `CHEAP_STOCK_ADMIN_BOOTSTRAP_TOKEN` — long random one-time token for creating the first admin.
- `CHEAP_STOCK_ADMIN_RECOVERY_KEY` — long random owner recovery key for resetting the admin password.
- `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET` — merchant API credentials from Pesapal.
- `PESAPAL_ENV` — set to `sandbox` for testing or `live` for production.

The workflow transfers bootstrap and recovery values to Worker secrets. Never commit secrets or paste them into chat. After first admin setup, remove or rotate the bootstrap token in Cloudflare.

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
