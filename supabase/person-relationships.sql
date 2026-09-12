create table if not exists public.person_relationships (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references public.people(id) on delete cascade,
  related_person_id text not null references public.people(id) on delete cascade,
  relationship_type text not null,
  reciprocal_type text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint person_relationships_not_self check (person_id <> related_person_id),
  constraint person_relationships_unique_pair unique (person_id, related_person_id)
);

create index if not exists person_relationships_related_idx
on public.person_relationships(related_person_id);
create index if not exists person_relationships_created_by_idx
on public.person_relationships(created_by);

alter table public.person_relationships enable row level security;
revoke all on public.person_relationships from anon, authenticated;
grant select on public.person_relationships to anon;
grant select, insert, update, delete on public.person_relationships to authenticated;

drop policy if exists "public read person relationships" on public.person_relationships;
create policy "public read person relationships"
on public.person_relationships for select
to anon, authenticated
using (true);

drop policy if exists "admins write person relationships" on public.person_relationships;
drop policy if exists "admins add person relationships" on public.person_relationships;
create policy "admins add person relationships"
on public.person_relationships for insert
to authenticated
with check (public.is_site_admin());

drop policy if exists "admins update person relationships" on public.person_relationships;
create policy "admins update person relationships"
on public.person_relationships for update
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "admins delete person relationships" on public.person_relationships;
create policy "admins delete person relationships"
on public.person_relationships for delete
to authenticated
using (public.is_site_admin());
