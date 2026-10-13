create extension if not exists "uuid-ossp";

create table if not exists public.recipes (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  name text not null,
  payload jsonb not null,
  is_favorite boolean default false,
  notes text default '',
  created_at timestamptz default now()
);
create table if not exists public.meal_plans (id uuid primary key default uuid_generate_v4(), user_id text not null, week_start date not null, meals jsonb not null, created_at timestamptz default now());
create table if not exists public.shopping_lists (id uuid primary key default uuid_generate_v4(), user_id text not null, items jsonb not null, created_at timestamptz default now());
create index if not exists recipes_user_id_idx on public.recipes(user_id);
-- Enable RLS and add Clerk user_id policies in your deployment migration.
