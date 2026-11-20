-- Executar no Supabase SQL Editor uma vez. Preserva os pedidos e estados existentes.
-- Gera código apenas para encomendas que ainda não o têm, incluindo a última compra.
ALTER TABLE public.encomendas_sumup ADD COLUMN IF NOT EXISTS codigo_rastreio text;
UPDATE public.encomendas_sumup
SET codigo_rastreio = 'MAE-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 18))
WHERE codigo_rastreio IS NULL OR btrim(codigo_rastreio) = '';
CREATE UNIQUE INDEX IF NOT EXISTS encomendas_sumup_codigo_rastreio_unique
ON public.encomendas_sumup (codigo_rastreio);
-- Mostra as 5 encomendas mais recentes sem revelar dados de clientes:
SELECT id, criado_em, estado_pagamento, codigo_rastreio
FROM public.encomendas_sumup ORDER BY criado_em DESC LIMIT 5;
