-- Execute no SQL Editor do projeto Supabase Maelle antes de publicar esta versão.
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS em_saldos boolean NOT NULL DEFAULT false;
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS em_inverno boolean NOT NULL DEFAULT false;
-- As políticas RLS existentes continuam a controlar quem pode editar os produtos.
