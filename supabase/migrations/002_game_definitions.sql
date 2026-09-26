create table public.game_definitions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  category text not null,
  game_type text not null,
  reference text not null,
  translation text not null default 'ESV',
  verse_text text not null,
  game_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index game_definitions_owner_idx on public.game_definitions (owner_id, created_at desc);

alter table public.game_definitions enable row level security;

create policy "users can read their games" on public.game_definitions
  for select to authenticated using (auth.uid() = owner_id);
create policy "users can create their games" on public.game_definitions
  for insert to authenticated with check (auth.uid() = owner_id);
create policy "users can update their games" on public.game_definitions
  for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "users can delete their games" on public.game_definitions
  for delete to authenticated using (auth.uid() = owner_id);