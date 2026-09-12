alter table public.guestbook_entries
  add column if not exists public_contact_details text;

alter table public.guestbook_contacts
  add column if not exists contact_details text,
  add column if not exists visibility text not null default 'private';

alter table public.guestbook_contacts alter column email drop not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname='guestbook_public_contact_length') then
    alter table public.guestbook_entries add constraint guestbook_public_contact_length
      check (public_contact_details is null or char_length(public_contact_details) <= 300);
  end if;
  if not exists (select 1 from pg_constraint where conname='guestbook_private_contact_length') then
    alter table public.guestbook_contacts add constraint guestbook_private_contact_length
      check (contact_details is null or char_length(contact_details) <= 300);
  end if;
  if not exists (select 1 from pg_constraint where conname='guestbook_contact_visibility') then
    alter table public.guestbook_contacts add constraint guestbook_contact_visibility
      check (visibility in ('private','public'));
  end if;
end $$;

notify pgrst, 'reload schema';
