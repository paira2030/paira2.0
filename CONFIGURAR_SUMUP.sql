-- Execute no SQL Editor do Supabase. Nunca permita leitura pública de dados dos clientes.
create table if not exists public.encomendas_sumup (
 id uuid primary key,
 cliente jsonb not null,
 itens jsonb not null,
 subtotal numeric(12,2) not null,
 portes numeric(12,2) not null,
 total numeric(12,2) not null,
 moeda text not null default 'EUR',
 sumup_checkout_id text unique,
 estado_pagamento text not null default 'PENDING',
 criado_em timestamptz not null default now()
);
alter table public.encomendas_sumup enable row level security;
-- Sem policies para anon/authenticated: somente backend com chave secreta.
notify pgrst, 'reload schema';
