-- ════════════════════════════════════════════════════════════════════════════
-- Sholab Dex Tech — Supabase schema
-- ════════════════════════════════════════════════════════════════════════════
-- Replaces the previous PostgreSQL + Drizzle setup. The tables are the same
-- shape as before, so the site content model is unchanged — only the storage
-- engine and the access path (PostgREST over HTTPS instead of a Node driver)
-- are different.
--
-- Run this once in the Supabase SQL editor, or with:
--   supabase db push
-- ════════════════════════════════════════════════════════════════════════════

-- ── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ── Shared trigger: keep updated_at honest ──────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- site_settings — ONE row (id = 'main') holding every scalar piece of copy
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.site_settings (
  id                  text primary key default 'main',

  -- Company / contact
  company_name        text not null default 'Sholab Dex Tech',
  ceo_name            text not null default 'Natlus Niel',
  ceo_title           text not null default 'CEO & Founder',
  ceo_bio             text not null default '',
  ceo_photo           text,
  email               text not null default 'solabiwonderful09@gmail.com',
  phone               text not null default '+2348169781185',
  whatsapp_number     text not null default '2348169781185',
  business_hours      text not null default 'Monday – Saturday, 8:00 AM – 8:00 PM (WAT)',
  socials             jsonb not null default '[]'::jsonb,

  -- Hero
  hero_headline       text not null default 'Sholab Dex Tech',
  hero_tagline        text not null default 'We Build Websites, Automate Businesses, and Grow Brands.',
  hero_intro          text not null default '',
  hero_cta_primary    text not null default 'Get a Free Quote',
  hero_cta_secondary  text not null default 'Chat on WhatsApp',
  hero_image          text,

  -- About
  about_heading       text not null default 'About Sholab Dex Tech',
  about_body          text not null default '',
  mission             text not null default '',
  vision              text not null default '',
  why_choose_us       jsonb not null default '[]'::jsonb,

  -- Process
  process_steps       jsonb not null default '[]'::jsonb,

  -- Pricing
  pricing_note        text not null default '',

  -- Footer
  footer_description  text not null default '',
  footer_copyright    text not null default '© 2026 Sholab Dex Tech. All rights reserved.',
  footer_credit       text not null default 'Designed by Sholab Dex Tech',

  -- SEO
  seo_title           text not null default 'Sholab Dex Tech | Websites, AI Automation & Business Promotions',
  seo_description     text not null default '',
  seo_keywords        text not null default '',
  seo_og_image        text,

  -- Branding
  logo                text,
  favicon             text,

  updated_at          timestamptz not null default now()
);

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ════════════════════════════════════════════════════════════════════════════
-- services
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('websites', 'automation', 'promotions')),
  name        text not null,
  description text not null default '',
  icon        text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists services_category_idx on public.services (category, sort_order);

-- ════════════════════════════════════════════════════════════════════════════
-- pricing_packages
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.pricing_packages (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('websites', 'automation', 'promotions')),
  name        text not null,
  price_ngn   text not null default '',
  price_usd   text not null default '',
  features    jsonb not null default '[]'::jsonb,
  is_popular  boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists pricing_category_idx on public.pricing_packages (category, sort_order);

-- Only ONE package per category may carry the "Most Popular" badge. A partial
-- unique index makes that a database guarantee rather than a convention the
-- admin panel has to remember — the old Drizzle code cleared the others by hand
-- and could still be raced into two badges.
create unique index if not exists pricing_one_popular_per_category
  on public.pricing_packages (category)
  where is_popular;

-- ════════════════════════════════════════════════════════════════════════════
-- projects (portfolio)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null check (category in ('websites', 'automation', 'promotions')),
  description text not null default '',
  image       text,
  link        text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects (category, sort_order);

-- ════════════════════════════════════════════════════════════════════════════
-- testimonials
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  client_name   text not null,
  business_name text not null default '',
  rating        integer not null default 5 check (rating between 1 and 5),
  review_text   text not null default '',
  photo         text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- stats (animated counters)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.stats (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  value      text not null default '0',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- faqs
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- contact_messages
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null default '',
  phone      text not null default '',
  service    text not null default '',
  message    text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists contact_created_idx on public.contact_messages (created_at desc);
