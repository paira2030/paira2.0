-- Executar no SQL Editor do projeto Supabase correto da Maelle.
alter table public.encomendas_sumup add column if not exists estado_entrega text not null default 'processando';
alter table public.encomendas_sumup drop constraint if exists encomendas_estado_entrega_check;
alter table public.encomendas_sumup add constraint encomendas_estado_entrega_check check (estado_entrega in ('processando','preparando','despachado','saiu_entrega','entregue'));
create table if not exists public.paginas_institucionais (slug text primary key check(slug in ('sobre','sustentabilidade')),content jsonb not null,atualizado_em timestamptz not null default now());
alter table public.paginas_institucionais enable row level security;
-- Sem políticas públicas de escrita: alterações apenas pelo backend com chave secreta e autenticação administrativa.
