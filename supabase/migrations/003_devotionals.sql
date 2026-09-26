create table public.devotionals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  category text not null check (char_length(category) between 1 and 60),
  reference text not null,
  translation text not null default 'ESV',
  hook text not null,
  insight text not null,
  created_at timestamptz not null default now()
);

create index devotionals_created_idx on public.devotionals (created_at desc);
alter table public.devotionals enable row level security;
create policy "authenticated users can read devotionals" on public.devotionals for select to authenticated using (true);
create policy "users can create devotionals" on public.devotionals for insert to authenticated with check (auth.uid() = owner_id);