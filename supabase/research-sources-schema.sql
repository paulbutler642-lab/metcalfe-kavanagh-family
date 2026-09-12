-- Structured research records shared across family profiles.
create table if not exists public.research_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 240),
  record_type text not null check (record_type in ('census','birth','baptism','marriage','death','burial','parish','military','newspaper','directory','will','immigration','other')),
  event_date_text text,
  place_text text,
  collection_title text,
  repository text,
  archive_reference text,
  citation text,
  external_url text,
  summary text,
  transcription text,
  research_notes text,
  media_id uuid references public.media(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.research_source_people (
  source_id uuid not null references public.research_sources(id) on delete cascade,
  person_id text not null references public.people(id) on delete cascade,
  role_in_record text,
  recorded_name text,
  recorded_age text,
  occupation text,
  relationship_to_head text,
  residence text,
  details text,
  primary key (source_id, person_id)
);

create index if not exists research_sources_type_idx on public.research_sources(record_type);
create index if not exists research_sources_media_idx on public.research_sources(media_id);
create index if not exists research_source_people_person_idx on public.research_source_people(person_id);

alter table public.research_sources enable row level security;
alter table public.research_source_people enable row level security;

create policy "public read research sources" on public.research_sources for select to anon, authenticated using (true);
create policy "admins add research sources" on public.research_sources for insert to authenticated with check (public.is_site_admin());
create policy "admins update research sources" on public.research_sources for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins delete research sources" on public.research_sources for delete to authenticated using (public.is_site_admin());
create policy "public read research source people" on public.research_source_people for select to anon, authenticated using (true);
create policy "admins add research source people" on public.research_source_people for insert to authenticated with check (public.is_site_admin());
create policy "admins update research source people" on public.research_source_people for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins delete research source people" on public.research_source_people for delete to authenticated using (public.is_site_admin());

grant select on public.research_sources, public.research_source_people to anon, authenticated;
grant insert, update, delete on public.research_sources, public.research_source_people to authenticated;
