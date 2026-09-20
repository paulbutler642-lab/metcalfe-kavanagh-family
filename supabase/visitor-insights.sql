create table if not exists public.site_activity (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  session_id uuid not null,
  event_type text not null check (event_type in ('session_start','page_view','engagement','source_open')),
  view_name text,
  person_id text references public.people(id) on delete set null,
  path text not null,
  active_seconds integer not null default 0 check (active_seconds between 0 and 300),
  created_at timestamptz not null default now()
);
create index if not exists site_activity_created_at_idx on public.site_activity(created_at desc);
create index if not exists site_activity_session_idx on public.site_activity(session_id, created_at);
create index if not exists site_activity_person_idx on public.site_activity(person_id, event_type);
alter table public.site_activity enable row level security;
revoke all on public.site_activity from anon, authenticated;
grant insert on public.site_activity to anon, authenticated;
grant select on public.site_activity to authenticated;
drop policy if exists "visitors record anonymous activity" on public.site_activity;
create policy "visitors record anonymous activity" on public.site_activity for insert to anon, authenticated
with check (event_type in ('session_start','page_view','engagement','source_open') and active_seconds between 0 and 300 and length(path) between 1 and 500 and (view_name is null or length(view_name) <= 80));
drop policy if exists "admins read site activity" on public.site_activity;
create policy "admins read site activity" on public.site_activity for select to authenticated using ((select public.is_site_admin()));
comment on table public.site_activity is 'Anonymous, privacy-limited engagement events for the private administrator dashboard. No names, email addresses, full IP addresses or precise coordinates are stored.';
