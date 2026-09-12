create table if not exists public.profile_change_log (
  id uuid primary key default gen_random_uuid(),
  person_id text not null,
  person_name text not null,
  action text not null check (action in ('created','updated','deleted')),
  actor_email text not null,
  changed_fields text[] not null default '{}'::text[],
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profile_change_log_created_idx
on public.profile_change_log(created_at desc);

create index if not exists profile_change_log_person_idx
on public.profile_change_log(person_id,created_at desc);

alter table public.profile_change_log enable row level security;
revoke all on public.profile_change_log from anon;
grant select,insert on public.profile_change_log to authenticated;

drop policy if exists "admins read profile change log" on public.profile_change_log;
create policy "admins read profile change log"
on public.profile_change_log for select
to authenticated
using (public.is_site_admin());

drop policy if exists "admins add profile change log" on public.profile_change_log;
create policy "admins add profile change log"
on public.profile_change_log for insert
to authenticated
with check (public.is_site_admin());

create or replace function public.log_people_change()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  old_json jsonb;
  new_json jsonb;
  fields text[];
  editor_email text;
begin
  editor_email := coalesce(nullif(auth.jwt() ->> 'email',''),'System / database');

  if tg_op = 'INSERT' then
    new_json := to_jsonb(new) - array['created_at','updated_at'];
    fields := array(select key from jsonb_each(new_json) where value <> 'null'::jsonb order by key);
    insert into public.profile_change_log(person_id,person_name,action,actor_email,changed_fields,after_data)
    values (new.id,new.name,'created',editor_email,fields,new_json);
    return new;
  elsif tg_op = 'DELETE' then
    old_json := to_jsonb(old) - array['created_at','updated_at'];
    fields := array(select key from jsonb_each(old_json) where value <> 'null'::jsonb order by key);
    insert into public.profile_change_log(person_id,person_name,action,actor_email,changed_fields,before_data)
    values (old.id,old.name,'deleted',editor_email,fields,old_json);
    return old;
  end if;

  old_json := to_jsonb(old) - array['created_at','updated_at'];
  new_json := to_jsonb(new) - array['created_at','updated_at'];
  fields := array(
    select key
    from jsonb_each(new_json)
    where value is distinct from old_json -> key
    order by key
  );
  if cardinality(fields) = 0 then return new; end if;

  insert into public.profile_change_log(person_id,person_name,action,actor_email,changed_fields,before_data,after_data)
  values (new.id,new.name,'updated',editor_email,fields,old_json,new_json);
  return new;
end;
$$;

drop trigger if exists people_change_history on public.people;
create trigger people_change_history
after insert or update or delete on public.people
for each row execute function public.log_people_change();
