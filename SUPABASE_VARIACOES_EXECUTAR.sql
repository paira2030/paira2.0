-- Executar UMA VEZ no SQL Editor do Supabase antes de publicar a atualização.
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS cores text[] DEFAULT ARRAY['Creme','Preto']::text[];
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS tamanhos text[] DEFAULT ARRAY['XS','S','M','L']::text[];
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS cores_hex jsonb DEFAULT '[]'::jsonb;
