-- Execute uma única vez no SQL Editor do Supabase antes de publicar a nova versão.
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS favorito_inverno boolean NOT NULL DEFAULT false;
