# Alterações Maelle

- Cadastro de produtos: seleção de múltiplas imagens do computador, prévia, imagem principal e remoção. As fotos são redimensionadas e guardadas no localStorage deste navegador (limites de quota). O catálogo é carregado na loja neste mesmo navegador. **Não é sincronizado entre dispositivos e não é publicado no servidor**. Para uma loja em produção, substituir por upload autenticado para armazenamento de imagens e banco de dados.
- ESC fecha o modal de checkout local, sem cancelar pagamentos iniciados externamente.
- Aviso de segurança: o projeto original possui PIN de administrador no JavaScript e lógica de pagamentos simulada. Não usar para vendas reais sem autenticação e backend seguros.
