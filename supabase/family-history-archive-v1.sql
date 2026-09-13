-- FAMILY-HISTORY-ARCHIVE-v1
-- Backward-compatible support for evidence, aliases, provenance and family memories.
-- This migration deliberately does not overwrite existing people, biographies or relationships.

alter table public.people add column if not exists aliases text[] not null default '{}';
alter table public.people add column if not exists historical_surname_variants text[] not null default '{}';

alter table public.research_sources add column if not exists evidence_type text;
alter table public.research_sources add column if not exists evidence_status text not null default 'published';
do $$ begin
  if not exists (select 1 from pg_constraint where conname='research_sources_evidence_type_check') then
    alter table public.research_sources add constraint research_sources_evidence_type_check
      check (evidence_type is null or evidence_type in (
        'verified_primary','contemporary_newspaper','family_archive','family_oral_history',
        'corroborated_family_history','secondary_historical','research_lead'
      )) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname='research_sources_evidence_status_check') then
    alter table public.research_sources add constraint research_sources_evidence_status_check
      check (evidence_status in ('published','awaiting_examination','private_research')) not valid;
  end if;
end $$;

alter table public.media add column if not exists publication_source text;
alter table public.media add column if not exists provenance text;
alter table public.media add column if not exists evidence_type text;
alter table public.media add column if not exists transcription text;
alter table public.media add column if not exists historical_context text;
alter table public.media add column if not exists contributor_name text;
alter table public.media add column if not exists archival_original_path text;

create table if not exists public.family_memories (
  id uuid primary key default gen_random_uuid(),
  person_id text not null references public.people(id) on delete cascade,
  story text not null check (char_length(story) between 2 and 10000),
  original_storyteller text,
  storyteller_relationship text,
  contributor text,
  approximate_recorded_date text,
  supporting_evidence text,
  privacy text not null default 'public' check (privacy in ('public','family','private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists family_memories_person_idx on public.family_memories(person_id);
create index if not exists people_aliases_gin_idx on public.people using gin(aliases);
create index if not exists people_surname_variants_gin_idx on public.people using gin(historical_surname_variants);

alter table public.family_memories enable row level security;
drop policy if exists "public read public family memories" on public.family_memories;
create policy "public read public family memories" on public.family_memories
  for select to anon, authenticated using (privacy='public' or public.is_site_admin());
drop policy if exists "admins add family memories" on public.family_memories;
create policy "admins add family memories" on public.family_memories
  for insert to authenticated with check (public.is_site_admin());
drop policy if exists "admins update family memories" on public.family_memories;
create policy "admins update family memories" on public.family_memories
  for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
drop policy if exists "admins delete family memories" on public.family_memories;
create policy "admins delete family memories" on public.family_memories
  for delete to authenticated using (public.is_site_admin());

grant select on public.family_memories to anon, authenticated;
grant insert, update, delete on public.family_memories to authenticated;

-- Apply only to the matching established profiles; no new people or relationships are created.
update public.people set
  aliases=(select array(select distinct value from unnest(aliases || array['Anthony Metcalfe']) value)),
  historical_surname_variants=(select array(select distinct value from unnest(historical_surname_variants || array['Medcalf','Metcalf','Metcalfe']) value))
where lower(name)='william metcalfe';

update public.people set
  aliases=(select array(select distinct value from unnest(aliases || array['Enoch Metcalf','Enoch Metcalfe']) value)),
  historical_surname_variants=(select array(select distinct value from unnest(historical_surname_variants || array['Medcalf','Metcalf','Metcalfe']) value))
where lower(name)='enoch medcalf';

update public.people set
  aliases=(select array(select distinct value from unnest(aliases || array['Anthony Metcalf','Anthony Metcalfe']) value)),
  historical_surname_variants=(select array(select distinct value from unnest(historical_surname_variants || array['Medcalf','Metcalf','Metcalfe']) value))
where lower(name)='anthony medcalf';
