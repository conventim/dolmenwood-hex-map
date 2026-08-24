-- Shared referee notes for the public map.
create table if not exists public.hex_notes (
  hex_id text primary key,
  title text not null default '' check (char_length(title) <= 200),
  content text not null check (char_length(content) <= 10000),
  category text not null default 'news' check (category in ('explored', 'news', 'useful_places')),
  updated_at timestamptz not null default now()
);

alter table public.hex_notes
  add column if not exists category text not null default 'news';

alter table public.hex_notes
  add column if not exists title text not null default '';

alter table public.hex_notes
  drop constraint if exists hex_notes_title_check;

alter table public.hex_notes
  add constraint hex_notes_title_check
  check (char_length(title) <= 200);

alter table public.hex_notes
  drop constraint if exists hex_notes_category_check;

alter table public.hex_notes
  add constraint hex_notes_category_check
  check (category in ('explored', 'news', 'useful_places'));

alter table public.hex_notes enable row level security;

drop policy if exists "Anyone can read shared hex notes" on public.hex_notes;
create policy "Anyone can read shared hex notes"
  on public.hex_notes for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can create shared hex notes" on public.hex_notes;
create policy "Anyone can create shared hex notes"
  on public.hex_notes for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can update shared hex notes" on public.hex_notes;
create policy "Anyone can update shared hex notes"
  on public.hex_notes for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Anyone can delete shared hex notes" on public.hex_notes;
create policy "Anyone can delete shared hex notes"
  on public.hex_notes for delete
  to anon, authenticated
  using (true);

-- Required for Supabase Realtime postgres_changes subscriptions.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'hex_notes'
  ) then
    alter publication supabase_realtime add table public.hex_notes;
  end if;
end
$$;
