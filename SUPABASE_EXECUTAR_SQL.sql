-- Execute no SQL Editor do projeto Maelle.oficial UMA VEZ.
-- Mantém a tabela public.produtos e as políticas RLS que já criou.
alter table public.produtos add column if not exists codigo text;
alter table public.produtos add column if not exists categoria text not null default 'vestidos';
alter table public.produtos add column if not exists preco_anterior numeric(12,2);
alter table public.produtos add column if not exists etiqueta text;
create unique index if not exists produtos_codigo_unique on public.produtos (codigo);
-- A política de leitura existente permite ver produtos ativos e administradores autenticados.
-- O bucket produtos-maelle deve manter as políticas INSERT/UPDATE/DELETE para admins.
