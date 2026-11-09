-- ════════════════════════════════════════════════════════════════════════════
-- Sholab Dex Tech — Row Level Security + Storage policies
-- ════════════════════════════════════════════════════════════════════════════
-- READ THIS BEFORE CHANGING ANY POLICY.
--
-- This site keeps the original product decision: the /sholab control panel has
-- NO login, so the owner can edit the site from any device without managing a
-- password. That decision has a direct consequence here, and it is worth being
-- explicit about it rather than discovering it later:
--
--   The publishable (anon) key ships in the browser bundle. Anyone who opens
--   the site can read it. So "the admin panel can write" and "the anon role can
--   write" are the same statement — there is no way to have one without the
--   other while the panel stays open.
--
-- The policies below therefore grant the anon role read AND write on the
-- content tables. That is the intended behaviour, not an oversight. What it
-- means in practice:
--
--   • Content is editable by anyone who knows the /sholab URL. Keep it private.
--   • Contact messages are readable by anyone with the anon key. If you start
--     receiving enquiries you consider confidential, turn on the locked-down
--     mode described at the bottom of this file.
--
-- The alternative — Supabase Auth with a single owner account — is a small
-- change and is documented in README › Security. It is the right choice the
-- moment this site holds anything you would not publish.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Content tables: public read, public write (open admin panel) ────────────
-- One loop over the table list keeps the policy set consistent: every content
-- table gets exactly the same four policies, so a table can never be half
-- protected by accident.
do $$
declare
  t text;
  content_tables text[] := array[
    'site_settings',
    'services',
    'pricing_packages',
    'projects',
    'testimonials',
    'stats',
    'faqs'
  ];
begin
  foreach t in array content_tables loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_public_read', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_public_insert', t);
    execute format(
      'create policy %I on public.%I for insert to anon, authenticated with check (true)',
      t || '_public_insert', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_public_update', t);
    execute format(
      'create policy %I on public.%I for update to anon, authenticated using (true) with check (true)',
      t || '_public_update', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_public_delete', t);
    execute format(
      'create policy %I on public.%I for delete to anon, authenticated using (true)',
      t || '_public_delete', t
    );
  end loop;
end $$;

-- ── contact_messages ────────────────────────────────────────────────────────
-- Same open model: the public form inserts, and the /sholab Messages tab reads
-- and deletes. There is deliberately no UPDATE policy — a submitted enquiry is
-- a record, not a draft, so nothing should be able to rewrite one in place.
alter table public.contact_messages enable row level security;

drop policy if exists contact_messages_public_read on public.contact_messages;
create policy contact_messages_public_read
  on public.contact_messages for select to anon, authenticated using (true);

drop policy if exists contact_messages_public_insert on public.contact_messages;
create policy contact_messages_public_insert
  on public.contact_messages for insert to anon, authenticated with check (true);

drop policy if exists contact_messages_public_delete on public.contact_messages;
create policy contact_messages_public_delete
  on public.contact_messages for delete to anon, authenticated using (true);

-- ════════════════════════════════════════════════════════════════════════════
-- Storage — the `site-media` bucket
-- ════════════════════════════════════════════════════════════════════════════
-- The bucket is PUBLIC: every image the admin panel uploads is served straight
-- from the CDN with no signed URL, which is what makes the site fast and keeps
-- the stored value a plain, permanent URL. Only images belong in it — never
-- anything private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,  -- 5 MB
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read: the bucket is public, so this is what lets <img src> work.
drop policy if exists site_media_public_read on storage.objects;
create policy site_media_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media');

-- Upload / replace / remove from the admin panel.
drop policy if exists site_media_public_insert on storage.objects;
create policy site_media_public_insert
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'site-media');

drop policy if exists site_media_public_update on storage.objects;
create policy site_media_public_update
  on storage.objects for update to anon, authenticated
  using (bucket_id = 'site-media') with check (bucket_id = 'site-media');

drop policy if exists site_media_public_delete on storage.objects;
create policy site_media_public_delete
  on storage.objects for delete to anon, authenticated
  using (bucket_id = 'site-media');

-- ════════════════════════════════════════════════════════════════════════════
-- LOCKED-DOWN MODE (optional — do this when the site holds anything private)
-- ════════════════════════════════════════════════════════════════════════════
-- 1. Supabase dashboard → Authentication → Users → Add user. Create ONE user
--    with the owner's email and a strong password.
-- 2. Replace the write policies above so they require that session:
--
--      drop policy services_public_insert on public.services;
--      create policy services_owner_write on public.services
--        for insert to authenticated with check (true);
--      -- …and the same for update/delete on every content table.
--
-- 3. In the app, set VITE_ADMIN_REQUIRE_AUTH=true and sign in at /sholab.
--    The admin panel then sends the user's JWT with every write, and the anon
--    role can only read.
--
-- The site's public pages keep working unchanged: they only ever read.
-- ════════════════════════════════════════════════════════════════════════════
