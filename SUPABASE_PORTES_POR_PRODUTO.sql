-- Executar uma única vez no SQL Editor do Supabase Maelle, ANTES do deploy.
-- Produtos existentes permanecem com a regra anterior até serem editados no ADM.
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS modo_envio text NOT NULL DEFAULT 'legacy';
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS valor_portes numeric(10,2) NOT NULL DEFAULT 4.50;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='produtos_modo_envio_valido') THEN ALTER TABLE public.produtos ADD CONSTRAINT produtos_modo_envio_valido CHECK (modo_envio IN ('legacy','paid','free')); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='produtos_valor_portes_valido') THEN ALTER TABLE public.produtos ADD CONSTRAINT produtos_valor_portes_valido CHECK (valor_portes >= 0 AND valor_portes <= 9999.99); END IF; END $$;
