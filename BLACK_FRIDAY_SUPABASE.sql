-- Execute uma única vez no SQL Editor do Supabase.
CREATE TABLE IF NOT EXISTS public.maelle_promocoes (
  chave text PRIMARY KEY,
  ativa boolean NOT NULL DEFAULT false,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.maelle_promocoes(chave, ativa) VALUES ('black_friday', false)
ON CONFLICT (chave) DO NOTHING;
ALTER TABLE public.maelle_promocoes ENABLE ROW LEVEL SECURITY;
-- Nenhuma política pública: apenas a API autenticada usa a chave secreta do servidor.
