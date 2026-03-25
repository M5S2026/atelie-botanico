create table plantas (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null default 'Flores',
  real text,
  sketch text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table plantas enable row level security;

-- Public read access (gallery is public)
create policy "plantas_public_read"
  on plantas for select
  using (true);

-- Only authenticated users can insert/update/delete (admin)
create policy "plantas_auth_insert"
  on plantas for insert
  to authenticated
  with check (true);

create policy "plantas_auth_update"
  on plantas for update
  to authenticated
  using (true);

create policy "plantas_auth_delete"
  on plantas for delete
  to authenticated
  using (true);

-- Seed initial data
insert into plantas (name, category, real, sketch) values
  ('Peônia Imperial', 'Flores', '/gallery/peonia-referencia.webp', '/gallery/sakura-risco.webp'),
  ('Sakura',          'Flores', '/gallery/sakura-foto.webp',       '/gallery/sakura-risco.webp'),
  ('Rosa Azul',       'Flores', '/gallery/rosa-azul-foto.webp',    null),
  ('Arara Tropical',  'Fauna',  '/gallery/araras-foto.webp',       null);
