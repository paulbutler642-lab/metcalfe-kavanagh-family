-- Idempotent schema changes for the Photos & Documents family archive.
alter table public.media add column if not exists category text;
alter table public.media add column if not exists is_unidentified boolean not null default false;
alter table public.media add column if not exists original_filename text;

update public.media
set category=case when media_type='photo' then 'Other photo' else 'Other document' end
where category is null;

insert into public.media_people(media_id,person_id)
select id,person_id from public.media where person_id is not null
on conflict do nothing;

drop policy if exists "public contribute photos" on public.media;
drop policy if exists "public contribute archive items" on public.media;
create policy "public contribute archive items" on public.media
for insert to anon, authenticated
with check (media_type in ('photo','document') and bucket_name='family-contributions'
  and is_profile_photo=false and storage_path like 'public-contributions/%'
  and (person_id is not null or is_unidentified=true));

drop policy if exists "public tag contributed photos" on public.media_people;
drop policy if exists "public tag contributed archive items" on public.media_people;
create policy "public tag contributed archive items" on public.media_people
for insert to anon, authenticated
with check (exists (select 1 from public.media m where m.id=media_people.media_id
  and m.media_type in ('photo','document') and m.bucket_name='family-contributions'
  and m.storage_path like 'public-contributions/%')
  and exists (select 1 from public.people p where p.id=media_people.person_id));

update storage.buckets
set allowed_mime_types=array['image/jpeg','image/png','image/webp','image/heic','image/heif','application/pdf']::text[]
where id='family-contributions';

drop policy if exists "public upload contributed images" on storage.objects;
drop policy if exists "public upload archive contributions" on storage.objects;
create policy "public upload archive contributions" on storage.objects
for insert to anon, authenticated
with check (bucket_id='family-contributions'
  and (storage.foldername(name))[1]='public-contributions'
  and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','heic','heif','pdf'));
