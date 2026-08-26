-- ============================================================
-- SHADOW / DESIGN REVIEW — Supabase Postgres Schema
-- Paste & run this whole file in: Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists projects (
  id          text primary key,
  slug        text,
  name        text,
  featured    boolean    not null default false,
  sort_order  int        not null default 0,
  data        jsonb      not null,
  updated_at  timestamptz not null default now()
);

create table if not exists pictograms (
  id          text primary key,
  slug        text,
  title_fa    text,
  sort_order  int        not null default 0,
  data        jsonb      not null,
  updated_at  timestamptz not null default now()
);

create table if not exists catalogs (
  id          text primary key,
  slug        text,
  title_fa    text,
  sort_order  int        not null default 0,
  data        jsonb      not null,
  updated_at  timestamptz not null default now()
);

create table if not exists brands (
  id          text primary key,
  slug        text,
  name        text,
  sort_order  int        not null default 0,
  data        jsonb      not null,
  updated_at  timestamptz not null default now()
);

create table if not exists site_settings (
  id          int primary key default 1,
  data        jsonb      not null,
  updated_at  timestamptz not null default now()
);

create table if not exists admin_users (
  id           serial primary key,
  username     text unique not null,
  password_hash text       not null,
  created_at   timestamptz not null default now()
);

-- Helpful indexes
create index if not exists projects_featured_idx   on projects (featured desc, sort_order asc);
create index if not exists projects_slug_idx       on projects (slug);
create index if not exists pictograms_sort_idx     on pictograms (sort_order asc);
create index if not exists catalogs_sort_idx       on catalogs (sort_order asc);
create index if not exists brands_sort_idx         on brands (sort_order asc);

-- ------------------------------------------------------------
-- Storage: public bucket for newly uploaded assets.
-- (Alternatively create it via Dashboard → Storage → New bucket
--  with name "uploads" and Public = ON.)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
