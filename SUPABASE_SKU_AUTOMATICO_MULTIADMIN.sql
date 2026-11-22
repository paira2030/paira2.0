-- MAELLE: executar no Supabase > SQL Editor, uma vez, antes de publicar o novo site.
-- Preserva os códigos existentes (PAIR-..., MAE-... e personalizados).
-- O próximo número começa após o maior sufixo numérico de PAIR-/MAE- já cadastrado.
BEGIN;
CREATE SEQUENCE IF NOT EXISTS public.maelle_produtos_sku_seq AS bigint START WITH 1 INCREMENT BY 1;
-- Serializa a configuração inicial, para não executar esta migração em paralelo.
SELECT pg_advisory_xact_lock(20261122, 123);
DO $$
DECLARE
  maior bigint;
  atual bigint;
BEGIN
  SELECT COALESCE(MAX(substring(codigo from '^(?:PAIR|MAE)-([0-9]+)$')::bigint), 0)
    INTO maior
    FROM public.produtos
    WHERE codigo ~ '^(PAIR|MAE)-[0-9]{1,15}$';
  -- Não retroceder a sequência se a migração for executada novamente.
  SELECT last_value INTO atual FROM public.maelle_produtos_sku_seq;
  PERFORM setval('public.maelle_produtos_sku_seq', GREATEST(maior, atual, 122), true);
END $$;
CREATE OR REPLACE FUNCTION public.maelle_gerar_sku_produto()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE candidato text;
BEGIN
  IF NEW.codigo IS NULL OR btrim(NEW.codigo) = '' THEN
    LOOP
      candidato := 'MAE-' || nextval('public.maelle_produtos_sku_seq')::text;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.produtos WHERE codigo = candidato);
    END LOOP;
    NEW.codigo := candidato;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS maelle_produtos_sku_automatico ON public.produtos;
CREATE TRIGGER maelle_produtos_sku_automatico
BEFORE INSERT ON public.produtos
FOR EACH ROW EXECUTE FUNCTION public.maelle_gerar_sku_produto();
COMMIT;
-- Conferir: SELECT codigo FROM public.produtos ORDER BY criado_em DESC LIMIT 10;
