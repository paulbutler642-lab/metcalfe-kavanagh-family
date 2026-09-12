create or replace function public.merge_people(p_keep_id text, p_remove_id text)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  keep_row public.people%rowtype;
  remove_row public.people%rowtype;
begin
  if not public.is_site_admin() then
    raise exception 'Administrator access required';
  end if;
  if p_keep_id is null or p_remove_id is null or p_keep_id = p_remove_id then
    raise exception 'Choose two different people';
  end if;

  select * into keep_row from public.people where id = p_keep_id for update;
  select * into remove_row from public.people where id = p_remove_id for update;
  if keep_row.id is null or remove_row.id is null then
    raise exception 'One of the selected people no longer exists';
  end if;

  update public.people
  set given_names = coalesce(nullif(keep_row.given_names,''), remove_row.given_names),
      surname = coalesce(nullif(keep_row.surname,''), remove_row.surname),
      relation_label = coalesce(nullif(keep_row.relation_label,''), remove_row.relation_label),
      family_line = coalesce(nullif(keep_row.family_line,''), remove_row.family_line),
      initials = coalesce(nullif(keep_row.initials,''), remove_row.initials),
      featured = keep_row.featured or remove_row.featured,
      birth_date_text = coalesce(nullif(keep_row.birth_date_text,''), remove_row.birth_date_text),
      birth_place = coalesce(nullif(keep_row.birth_place,''), remove_row.birth_place),
      death_date_text = coalesce(nullif(keep_row.death_date_text,''), remove_row.death_date_text),
      death_place = coalesce(nullif(keep_row.death_place,''), remove_row.death_place),
      biography = case
        when nullif(keep_row.biography,'') is null then remove_row.biography
        when nullif(remove_row.biography,'') is null or keep_row.biography = remove_row.biography then keep_row.biography
        else keep_row.biography || E'\n\n' || remove_row.biography end,
      notes = case
        when nullif(keep_row.notes,'') is null then remove_row.notes
        when nullif(remove_row.notes,'') is null or keep_row.notes = remove_row.notes then keep_row.notes
        else keep_row.notes || E'\n\n' || remove_row.notes end,
      gedcom_xref = coalesce(nullif(keep_row.gedcom_xref,''), remove_row.gedcom_xref),
      updated_at = now()
  where id = p_keep_id;

  insert into public.parent_child(parent_id,child_id,parent_role)
  select distinct
    case when parent_id = p_remove_id then p_keep_id else parent_id end,
    case when child_id = p_remove_id then p_keep_id else child_id end,
    parent_role
  from public.parent_child
  where parent_id = p_remove_id or child_id = p_remove_id
  on conflict (parent_id,child_id) do nothing;
  delete from public.parent_child where parent_id = p_remove_id or child_id = p_remove_id;
  delete from public.parent_child where parent_id = child_id;

  update public.couples
  set person1_id = case when person1_id = p_remove_id then p_keep_id else person1_id end,
      person2_id = case when person2_id = p_remove_id then p_keep_id else person2_id end
  where person1_id = p_remove_id or person2_id = p_remove_id;
  delete from public.couples where person1_id = person2_id;
  delete from public.couples
  where id in (
    select id from (
      select id,row_number() over(
        partition by least(person1_id,person2_id),greatest(person1_id,person2_id)
        order by id::text
      ) as duplicate_number
      from public.couples
      where person1_id = p_keep_id or person2_id = p_keep_id
    ) duplicate_couples
    where duplicate_number > 1
  );

  insert into public.media_people(media_id,person_id)
  select media_id,p_keep_id from public.media_people where person_id = p_remove_id
  on conflict (media_id,person_id) do nothing;
  delete from public.media_people where person_id = p_remove_id;
  update public.media set person_id = p_keep_id where person_id = p_remove_id;
  update public.stories set person_id = p_keep_id where person_id = p_remove_id;

  insert into public.research_source_people(
    source_id,person_id,role_in_record,recorded_name,recorded_age,
    occupation,relationship_to_head,residence,details
  )
  select source_id,p_keep_id,role_in_record,recorded_name,recorded_age,
         occupation,relationship_to_head,residence,details
  from public.research_source_people
  where person_id = p_remove_id
  on conflict (source_id,person_id) do update set
    role_in_record = coalesce(public.research_source_people.role_in_record,excluded.role_in_record),
    recorded_name = coalesce(public.research_source_people.recorded_name,excluded.recorded_name),
    recorded_age = coalesce(public.research_source_people.recorded_age,excluded.recorded_age),
    occupation = coalesce(public.research_source_people.occupation,excluded.occupation),
    relationship_to_head = coalesce(public.research_source_people.relationship_to_head,excluded.relationship_to_head),
    residence = coalesce(public.research_source_people.residence,excluded.residence),
    details = coalesce(public.research_source_people.details,excluded.details);
  delete from public.research_source_people where person_id = p_remove_id;

  delete from public.people where id = p_remove_id;
  return jsonb_build_object('kept_id',p_keep_id,'removed_id',p_remove_id,'kept_name',keep_row.name,'removed_name',remove_row.name);
end;
$$;

create or replace function public.delete_person_entry(p_person_id text)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  person_row public.people%rowtype;
begin
  if not public.is_site_admin() then
    raise exception 'Administrator access required';
  end if;
  select * into person_row from public.people where id = p_person_id for update;
  if person_row.id is null then
    raise exception 'This person no longer exists';
  end if;

  delete from public.parent_child where parent_id = p_person_id or child_id = p_person_id;
  delete from public.couples where person1_id = p_person_id or person2_id = p_person_id;
  delete from public.research_source_people where person_id = p_person_id;
  delete from public.media_people where person_id = p_person_id;
  update public.media set person_id = null where person_id = p_person_id;
  update public.stories set person_id = null where person_id = p_person_id;
  delete from public.people where id = p_person_id;

  return jsonb_build_object('deleted_id',p_person_id,'deleted_name',person_row.name);
end;
$$;

revoke all on function public.merge_people(text,text) from public, anon;
revoke all on function public.delete_person_entry(text) from public, anon;
grant execute on function public.delete_person_entry(text) to authenticated;
