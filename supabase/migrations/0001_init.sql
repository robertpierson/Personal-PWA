-- Meridian client dashboard schema (Phases 2–4)
-- One org per account; each org has an owner plus optional limited "worker"
-- members. Row-level security scopes every table to the caller's org.
--
-- Apply via the Supabase SQL editor or the Supabase CLI.

-- ─────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────
create type member_role       as enum ('owner', 'worker');
create type deliverable_status as enum ('not_started', 'in_progress', 'in_review', 'delivered');
create type calendar_status    as enum ('idea', 'drafting', 'scheduled', 'approved', 'published');
create type calendar_channel   as enum ('instagram', 'facebook', 'newsletter', 'other');
create type calendar_format    as enum ('post', 'reel', 'story', 'carousel', 'email');
create type design_status      as enum ('in_progress', 'delivered');
create type invoice_status     as enum ('draft', 'open', 'paid', 'void');

-- ─────────────────────────────────────────────────────────────────────────
-- Core tenancy
-- ─────────────────────────────────────────────────────────────────────────
create table orgs (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique not null,
  type       text not null default 'Community organization',
  created_at timestamptz not null default now()
);

create table org_members (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references orgs(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       member_role not null default 'worker',
  created_at timestamptz not null default now(),
  unique (user_id)                       -- one org per account
);

create index on org_members (org_id);

-- Helper: the caller's org id (security definer to avoid recursive RLS).
create or replace function current_org_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select org_id from org_members where user_id = auth.uid() limit 1;
$$;

create or replace function is_org_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from org_members
    where user_id = auth.uid() and role = 'owner'
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- Work tables
-- ─────────────────────────────────────────────────────────────────────────
create table deliverables (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  title       text not null,
  type        text not null default 'Design',
  status      deliverable_status not null default 'not_started',
  due_date    date not null,
  description text,
  created_at  timestamptz not null default now()
);
create index on deliverables (org_id);

create table calendar_items (
  id       uuid primary key default gen_random_uuid(),
  org_id   uuid not null references orgs(id) on delete cascade,
  date     date not null,
  title    text not null,
  channel  calendar_channel not null default 'instagram',
  format   calendar_format not null default 'post',
  status   calendar_status not null default 'idea',
  caption  text
);
create index on calendar_items (org_id);

create table designs (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references orgs(id) on delete cascade,
  title      text not null,
  type       text not null default 'Design',
  status     design_status not null default 'in_progress',
  file_url   text,
  accent     text not null default 'forest',
  created_at timestamptz not null default now()
);
create index on designs (org_id);

create table invoices (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references orgs(id) on delete cascade,
  number       text not null,
  description  text,
  amount_cents integer not null,
  currency     text not null default 'usd',
  status       invoice_status not null default 'draft',
  issued_date  date not null default current_date,
  due_date     date not null,
  hosted_url   text,
  stripe_session_id text,
  created_at   timestamptz not null default now()
);
create index on invoices (org_id);

-- ─────────────────────────────────────────────────────────────────────────
-- Instagram (Phase 3)
-- ─────────────────────────────────────────────────────────────────────────
create table instagram_connections (
  org_id          uuid primary key references orgs(id) on delete cascade,
  ig_user_id      text not null,
  username        text not null,
  followers_count integer not null default 0,
  access_token    text,          -- encrypt at rest in production
  connected_at    timestamptz not null default now()
);

create table instagram_metrics (
  org_id          uuid not null references orgs(id) on delete cascade,
  date            date not null,
  reach           integer not null default 0,
  engagement_rate numeric(5,2) not null default 0,
  followers       integer not null default 0,
  profile_views   integer not null default 0,
  primary key (org_id, date)
);

-- ─────────────────────────────────────────────────────────────────────────
-- Row-level security: everything is scoped to the caller's org.
-- Owners can see all tables; workers can only read calendar + metrics.
-- ─────────────────────────────────────────────────────────────────────────
alter table orgs                   enable row level security;
alter table org_members            enable row level security;
alter table deliverables           enable row level security;
alter table calendar_items         enable row level security;
alter table designs                enable row level security;
alter table invoices               enable row level security;
alter table instagram_connections  enable row level security;
alter table instagram_metrics      enable row level security;

create policy "org: members read" on orgs
  for select using (id = current_org_id());

create policy "members: read own" on org_members
  for select using (org_id = current_org_id());

-- Owner-only tables (workers get no rows).
create policy "deliverables: owner" on deliverables
  for select using (org_id = current_org_id() and is_org_owner());
create policy "designs: owner" on designs
  for select using (org_id = current_org_id() and is_org_owner());
create policy "invoices: owner" on invoices
  for select using (org_id = current_org_id() and is_org_owner());
create policy "ig connection: owner" on instagram_connections
  for select using (org_id = current_org_id() and is_org_owner());

-- Shared tables (any member of the org).
create policy "calendar: members read" on calendar_items
  for select using (org_id = current_org_id());
create policy "metrics: members read" on instagram_metrics
  for select using (org_id = current_org_id());

-- Note: writes (inserts/updates) are performed by the operator via the service
-- role, which bypasses RLS. Add explicit write policies here if you later let
-- clients edit their own data from the dashboard.
