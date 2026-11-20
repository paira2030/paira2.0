-- Execute no SQL Editor do Supabase, uma única vez. Não elimina encomendas.
ALTER TABLE public.encomendas_sumup
ADD COLUMN IF NOT EXISTS arquivado_em timestamptz;
CREATE INDEX IF NOT EXISTS encomendas_sumup_arquivado_em_idx
ON public.encomendas_sumup (arquivado_em);
NOTIFY pgrst, 'reload schema';
