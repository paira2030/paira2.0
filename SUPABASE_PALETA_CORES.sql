create table if not exists public.maelle_color_palette (
 name text primary key check (length(trim(name)) between 1 and 100),
 hex text not null check (hex ~ '^#[0-9a-fA-F]{6}$')
);
create unique index if not exists maelle_palette_name_ci on public.maelle_color_palette(lower(name));
alter table public.maelle_color_palette enable row level security;
grant select, insert, delete on public.maelle_color_palette to authenticated;
drop policy if exists maelle_palette_admin on public.maelle_color_palette;
create policy maelle_palette_admin on public.maelle_color_palette for all to authenticated
using (exists(select 1 from public.admins where user_id=auth.uid()))
with check (exists(select 1 from public.admins where user_id=auth.uid()));
-- Recupera cores personalizadas de produtos existentes, sem modificar os produtos.
insert into public.maelle_color_palette(name,hex)
select distinct on (lower(c->>'name')) c->>'name', c->>'hex'
from public.produtos p cross join lateral jsonb_array_elements(case when jsonb_typeof(p.cores_hex)='array' then p.cores_hex else '[]'::jsonb end) c
where length(trim(c->>'name')) between 1 and 100 and c->>'hex' ~ '^#[0-9a-fA-F]{6}$'
and lower(c->>'name') not in ('preto','branco','creme','bege','azul','vermelho','verde','rosa','castanho')
order by lower(c->>'name'), c->>'hex'
on conflict do nothing;
