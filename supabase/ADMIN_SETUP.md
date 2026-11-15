# First administrator setup

Do this only after applying the initial migration.

1. In Supabase Dashboard, open Authentication and create the owner's account with the correct email.
2. Copy that account's UUID from the Auth users table.
3. Open SQL Editor and run the following after replacing the UUID and owner name:

    insert into public.profiles (id, full_name, role)
    values ('YOUR-AUTH-USER-UUID', 'Business Owner', 'admin')
    on conflict (id) do update set role = 'admin', is_active = true;

    update auth.users
    set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
    where id = 'YOUR-AUTH-USER-UUID';

4. Add the two public Supabase values from Project Settings > API to the deployment environment as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
5. Sign in at /admin/login. Sign out and sign back in if the account was already logged in before its role was granted.

Security: only an owner with trusted SQL access should grant roles. Never put a Supabase service-role key in browser code, public environment variables, GitHub files, or a chat message. If an owner account is compromised, revoke its sessions in Supabase and remove its admin role immediately.
