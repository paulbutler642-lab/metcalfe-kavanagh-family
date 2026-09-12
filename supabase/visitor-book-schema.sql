create table if not exists public.guestbook_entries (
  id uuid primary key,
  visitor_name text not null check (char_length(visitor_name) between 2 and 80),
  family_connection text check (family_connection is null or char_length(family_connection) <= 160),
  family_branch text not null default 'Both / not sure'
    check (family_branch in ('Metcalfe','Kavanagh','Both / not sure')),
  visitor_location text check (visitor_location is null or char_length(visitor_location) <= 120),
  message text not null check (char_length(message) between 2 and 1000),
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.guestbook_contacts (
  entry_id uuid primary key references public.guestbook_entries(id) on delete cascade,
  email text not null check (char_length(email) between 3 and 254),
  contact_permission boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.guestbook_entries enable row level security;
alter table public.guestbook_contacts enable row level security;

grant select, insert, update, delete on public.guestbook_entries to anon, authenticated;
grant select, insert, update, delete on public.guestbook_contacts to anon, authenticated;

drop policy if exists "public read approved guestbook" on public.guestbook_entries;
create policy "public read approved guestbook" on public.guestbook_entries
for select to anon, authenticated using (status='approved' or is_site_admin());

drop policy if exists "public submit guestbook" on public.guestbook_entries;
create policy "public submit guestbook" on public.guestbook_entries
for insert to anon, authenticated with check (status='pending' and reviewed_at is null);

drop policy if exists "admins moderate guestbook" on public.guestbook_entries;
create policy "admins moderate guestbook" on public.guestbook_entries
for update to authenticated using (is_site_admin())
with check (is_site_admin());

drop policy if exists "admins delete guestbook" on public.guestbook_entries;
create policy "admins delete guestbook" on public.guestbook_entries
for delete to authenticated using (is_site_admin());

drop policy if exists "public add guestbook contact" on public.guestbook_contacts;
create policy "public add guestbook contact" on public.guestbook_contacts
for insert to anon, authenticated with check (contact_permission=true);

drop policy if exists "admins read guestbook contacts" on public.guestbook_contacts;
create policy "admins read guestbook contacts" on public.guestbook_contacts
for select to authenticated using (is_site_admin());

drop policy if exists "admins delete guestbook contacts" on public.guestbook_contacts;
create policy "admins delete guestbook contacts" on public.guestbook_contacts
for delete to authenticated using (is_site_admin());

create index if not exists guestbook_entries_status_created_idx
  on public.guestbook_entries(status,created_at desc);

notify pgrst, 'reload schema';
