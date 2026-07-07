-- Adds: org-editable settings, plan/credits, and in-app notifications.
-- Apply after 0001_init.sql.

-- ─────────────────────────────────────────────────────────────────────────
-- Plan (drives the credit allowance in src/content/credits.ts)
-- ─────────────────────────────────────────────────────────────────────────
alter table orgs
  add column plan text not null default 'Basic'
  check (plan in ('Free', 'Basic', 'Average', 'Pro'));

-- Let an org's owner update their own org's name/type/plan from the
-- dashboard Settings page (previously only the operator, via the
-- service role, could write to this table).
create policy "org: owner update" on orgs
  for update using (id = current_org_id() and is_org_owner())
  with check (id = current_org_id() and is_org_owner());

-- ─────────────────────────────────────────────────────────────────────────
-- Notifications
-- ─────────────────────────────────────────────────────────────────────────
create type notification_category as enum (
  'calendar', 'deliverable', 'invoice', 'insights', 'system'
);

create table notifications (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references orgs(id) on delete cascade,
  category   notification_category not null default 'system',
  title      text not null,
  body       text not null,
  href       text not null default '/dashboard',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index on notifications (org_id, created_at desc);

alter table notifications enable row level security;

-- Any member of the org can read and mark-as-read their org's notifications.
create policy "notifications: members read" on notifications
  for select using (org_id = current_org_id());
create policy "notifications: members mark read" on notifications
  for update using (org_id = current_org_id())
  with check (org_id = current_org_id());

-- Note: new notifications are inserted by the operator/service role (e.g.
-- when a deliverable moves to review, an invoice comes due, etc.) — add an
-- insert trigger or server action per event type as those flows are built.
