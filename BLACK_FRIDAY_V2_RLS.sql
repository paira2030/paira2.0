-- Execute no SQL Editor do projeto Supabase da Maelle.
-- Reutiliza a tabela existente, sem apagar preços nem encomendas.
CREATE TABLE IF NOT EXISTS public.maelle_promocoes (
  chave text PRIMARY KEY,
  ativa boolean NOT NULL DEFAULT false,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.maelle_promocoes (chave,ativa)
VALUES ('black_friday',false)
ON CONFLICT (chave) DO NOTHING;
ALTER TABLE public.maelle_promocoes ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.maelle_promocoes TO anon, authenticated;
GRANT UPDATE ON public.maelle_promocoes TO authenticated;
DROP POLICY IF EXISTS maelle_bf_v2_read ON public.maelle_promocoes;
CREATE POLICY maelle_bf_v2_read ON public.maelle_promocoes FOR SELECT TO anon,authenticated
USING (chave='black_friday');
DROP POLICY IF EXISTS maelle_bf_v2_admin_update ON public.maelle_promocoes;
CREATE POLICY maelle_bf_v2_admin_update ON public.maelle_promocoes FOR UPDATE TO authenticated
USING (chave='black_friday' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id=auth.uid()))
WITH CHECK (chave='black_friday' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id=auth.uid()));
