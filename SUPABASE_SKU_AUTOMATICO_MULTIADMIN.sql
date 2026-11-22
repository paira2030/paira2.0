-- Executar uma única vez no SQL Editor do Supabase da Maelle.
-- Não altera os códigos dos produtos já existentes.
-- O código automático é atribuído no servidor, usando uma sequência segura
-- mesmo quando dois administradores cadastram ao mesmo tempo.
CREATE SEQUENCE IF NOT EXISTS public.maelle_produtos_sku_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.maelle_gerar_sku_produto()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  candidato text;
BEGIN
  IF NEW.codigo IS NULL OR btrim(NEW.codigo) = '' THEN
    LOOP
      candidato := 'MAE-' || lpad(nextval('public.maelle_produtos_sku_seq')::text, 8, '0');
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

-- Confirmação: SELECT codigo FROM public.produtos ORDER BY criado_em DESC LIMIT 10;
