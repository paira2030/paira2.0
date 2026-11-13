# Maelle — Atualização de páginas e encomendas

1. No Supabase do projeto Maelle, execute `MAELLE_NOVAS_FUNCOES.sql` no SQL Editor.
2. Publique os arquivos deste ZIP no mesmo repositório GitHub/Vercel, preservando as variáveis de ambiente existentes.
3. Abra `/admin.html`, entre com a sua conta administrativa Supabase e use as abas **Encomendas** e **Páginas**.
4. As páginas estão em `/sobre.html` e `/sustentabilidade.html`; os links foram adicionados ao rodapé da loja.
5. Teste o checkout SumUp novamente antes de liberar a loja. O código de pagamento não foi modificado.

**Segurança:** As APIs administrativas validam a sessão Supabase e a tabela `admins`. As páginas públicas usam textos padrão enquanto o conteúdo ainda não tiver sido guardado. A confirmação de pagamento continua a ser feita exclusivamente pela integração SumUp existente.

**Atenção:** A versão do rodapé preserva os logótipos de pagamento já presentes. Mostre apenas os métodos realmente habilitados na sua conta. Os textos institucionais são modelos editáveis, não alegações verificadas sobre fornecedores ou sustentabilidade.
