update public.people
set birth_place = replace(birth_place, 'Altadore', 'Altidore'),
    death_place = replace(death_place, 'Altadore', 'Altidore'),
    biography = replace(biography, 'Altadore', 'Altidore'),
    notes = replace(notes, 'Altadore', 'Altidore')
where concat_ws(' ', birth_place, death_place, biography, notes) ilike '%altadore%';

update public.stories
set title = replace(title, 'Altadore', 'Altidore'),
    body = replace(body, 'Altadore', 'Altidore')
where concat_ws(' ', title, body) ilike '%altadore%';

update public.research_sources
set title = replace(title, 'Altadore', 'Altidore'),
    place_text = replace(place_text, 'Altadore', 'Altidore'),
    citation = replace(citation, 'Altadore', 'Altidore'),
    summary = replace(summary, 'Altadore', 'Altidore'),
    transcription = replace(transcription, 'Altadore', 'Altidore'),
    research_notes = replace(research_notes, 'Altadore', 'Altidore')
where concat_ws(' ', title, place_text, citation, summary, transcription, research_notes) ilike '%altadore%';

create index if not exists couples_person2_id_idx on public.couples(person2_id);
create index if not exists media_people_person_id_idx on public.media_people(person_id);
create index if not exists parent_child_child_id_idx on public.parent_child(child_id);
create index if not exists stories_person_id_idx on public.stories(person_id);

alter function public.touch_updated_at() set search_path = pg_catalog;

alter policy "admins write couples" on public.couples to authenticated;
alter policy "admins write media" on public.media to authenticated;
alter policy "admins write media people" on public.media_people to authenticated;
alter policy "admins write parent child" on public.parent_child to authenticated;
alter policy "admins write people" on public.people to authenticated;
alter policy "admins read admin list" on public.site_admins to authenticated;
alter policy "admins write stories" on public.stories to authenticated;

drop policy if exists "public read approved guestbook" on public.guestbook_entries;
create policy "public read approved guestbook" on public.guestbook_entries
for select to anon, authenticated using (status = 'approved');

revoke execute on function public.is_site_admin() from anon;
revoke execute on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

insert into public.research_source_people
  (source_id, person_id, role_in_record, recorded_name, residence, details)
values
  ('65f8a484-826e-45be-a777-fe77992e7fe8', 'anthony-medcalf', 'resident named in raid account', 'E Medcalf', '5 Kilmacud Road', 'Family evidence identifies E Medcalf as Enoch Medcalf.'),
  ('65f8a484-826e-45be-a777-fe77992e7fe8', 'william-metcalfe', 'resident named in raid account', 'Wm. Medcalf', '5 Kilmacud Road', 'Family evidence identifies Wm. Medcalf as William Metcalfe, Enoch’s son.'),
  ('65f8a484-826e-45be-a777-fe77992e7fe8', 'john-medcalf-enoch-son', 'resident named in raid account', 'J Medcalf', '5 Kilmacud Road', 'Family evidence identifies J Medcalf as John Metcalfe, Enoch’s son.')
on conflict (source_id, person_id) do nothing;

notify pgrst, 'reload schema';
