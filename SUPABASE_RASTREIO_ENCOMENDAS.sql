-- Executar uma vez no SQL Editor do Supabase, antes do novo deploy.
-- Não elimina encomendas existentes.
ALTER TABLE public.encomendas_sumup ADD COLUMN IF NOT EXISTS codigo_rastreio text;
UPDATE public.encomendas_sumup SET codigo_rastreio = 'MAE-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 18)) WHERE codigo_rastreio IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS encomendas_sumup_codigo_rastreio_unique ON public.encomendas_sumup(codigo_rastreio);
-- Necessário para o acompanhamento de entrega no ADM, se ainda não foi criado:
ALTER TABLE public.encomendas_sumup ADD COLUMN IF NOT EXISTS estado_entrega text NOT NULL DEFAULT 'processando';
