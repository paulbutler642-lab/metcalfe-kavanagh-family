create unique index if not exists people_gedcom_xref_unique
  on public.people(gedcom_xref)
  where gedcom_xref is not null;

create table if not exists public.gedcom_imports (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  root_xref text not null,
  imported_by text,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.gedcom_imports enable row level security;
create policy "admins read gedcom imports" on public.gedcom_imports for select to authenticated using (public.is_site_admin());
create policy "admins add gedcom imports" on public.gedcom_imports for insert to authenticated with check (public.is_site_admin());
grant select, insert on public.gedcom_imports to authenticated;
