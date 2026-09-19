alter table public.guestbook_entries
  alter column status set default 'approved';

update public.guestbook_entries
set status = 'approved', reviewed_at = null
where status = 'pending';

alter table public.guestbook_entries
  drop constraint if exists guestbook_entries_status_check;
alter table public.guestbook_entries
  add constraint guestbook_entries_status_check
  check (status in ('approved', 'rejected'));

drop policy if exists "public submit guestbook" on public.guestbook_entries;
create policy "public submit guestbook" on public.guestbook_entries
for insert to anon, authenticated
with check (status = 'approved' and reviewed_at is null);

notify pgrst, 'reload schema';
