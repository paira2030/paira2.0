# Ligar Maelle.oficial ao Supabase

1. Execute `SUPABASE_EXECUTAR_SQL.sql` no SQL Editor do Supabase. A tabela `produtos` criada anteriormente precisa destas colunas adicionais.
2. Abra `assets/js/supabase-config.js` e preencha `MAELLE_SUPABASE_URL` (URL do projeto, https://...supabase.co) e `MAELLE_SUPABASE_PUBLISHABLE_KEY` (sb_publishable_...). **Nunca** coloque sb_secret_, service_role, palavras-passe ou chaves Viva.com neste ficheiro.
3. Publique o site por HTTPS na Vercel. No painel administrativo, entre com o email e a palavra-passe do utilizador Supabase Auth que já está na tabela `admins`.
4. Crie ou edite um produto, selecione imagens e clique Guardar. As imagens são enviadas para `produtos-maelle` e os dados para `public.produtos`. Visite a loja noutro dispositivo para confirmar.
5. Os produtos antigos do `data/products.json` não são importados automaticamente. Quando o Supabase estiver configurado, o catálogo online é a fonte de verdade; cadastre ou importe os antigos antes de publicar para evitar uma loja vazia.

## Segurança e limites
- O login antigo por PIN continua apenas no modo local sem configuração Supabase. Com Supabase configurado, a entrada é feita por Supabase Auth e a autorização é conferida na tabela admins protegida por RLS.
- O código antigo do site contém demonstrações de checkout/myPOS e campos de cartão. **Não use este site para receber pagamentos reais** antes de substituir o checkout por integração certificada com backend seguro. O botão de compra NÃO está ligado à Viva.com.
- Não cole segredos de gateways em campos do navegador; configurações antigas em localStorage não são seguras.
- Se o projeto já tiver dados na tabela produtos, faça cópia de segurança antes de alterar.
- O JavaScript Supabase é carregado por CDN: é necessária ligação à internet para operar online.
