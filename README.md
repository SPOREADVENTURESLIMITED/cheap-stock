# CHEAP STOCK
Quality Drinks. Wholesale Prices. Always Stocked.

Ugandan drinks retail and wholesale platform foundation. Currency: UGX.

## Stack
Next.js 15, React 19, TypeScript, Supabase Auth and PostgreSQL with Row Level Security.

## Setup
1. Use Node.js 20.9 or newer and run npm install.
2. Copy .env.example to .env.local.
3. Create a Supabase project and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
4. Apply supabase/migrations/0001_initial.sql in the Supabase SQL editor.
5. Create the first owner user in Supabase Authentication. Insert that user UUID into public.profiles with role admin, then set that user's auth.users.raw_app_meta_data role to admin using trusted SQL.
6. Run npm run dev.

Never expose a service-role key in browser code or commit secrets. The database migration enables RLS; review policies before production. Alcohol sales require applicable Ugandan licensing, age verification and responsible-sales procedures.

## Status
Storefront, admin authentication foundation, protected module navigation and initial schema are committed. CRUD workflows, checkout, payment gateway, automated tax rules, PDF/QR documents, delivery integrations, backup procedures and production deployment still need implementation and testing. No payment provider is active.
