-- Media-Storage-v1: non-destructive metadata for optimised web photographs.
alter table public.media add column if not exists thumbnail_path text;
alter table public.media add column if not exists original_size_bytes bigint;
alter table public.media add column if not exists optimized_size_bytes bigint;
alter table public.media add column if not exists optimized_width integer;
alter table public.media add column if not exists optimized_height integer;
alter table public.media add column if not exists processing_version text;

comment on column public.media.thumbnail_path is 'Optional small WebP variant; storage_path remains the canonical full web asset.';
comment on column public.media.processing_version is 'Client image-processing policy used for new uploads.';

alter table public.media drop constraint if exists media_storage_sizes_nonnegative;
alter table public.media add constraint media_storage_sizes_nonnegative check (
  coalesce(original_size_bytes,0)>=0 and coalesce(optimized_size_bytes,0)>=0
  and coalesce(optimized_width,0)>=0 and coalesce(optimized_height,0)>=0
);
