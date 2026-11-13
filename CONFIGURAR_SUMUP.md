# Maelle — SumUp Hosted Checkout (preparação)

**Ainda não ativar pagamentos reais:** configurar e testar primeiro.

1. No Supabase SQL Editor, execute `CONFIGURAR_SUMUP.sql`.
2. Em Vercel > Project Settings > Environment Variables (Production), adicione `SUMUP_API_KEY` (chave privada de API SumUp), `SUMUP_MERCHANT_CODE` (código comercial), `SUPABASE_URL` (URL do projeto) e `SUPABASE_SECRET_KEY` (chave secreta de backend do Supabase). Não cole credenciais no GitHub, HTML ou no chat.
3. Configure `MAELLE_FREE_SHIPPING_EUR` se o limite real não for 49.90. O valor de portes abaixo do limite está definido como 4,50 €. Verifique os valores antes de publicar.
4. Faça Redeploy na Vercel e teste em ambiente de testes SumUp. A SumUp deve disponibilizar Hosted Checkout para a conta.
5. A página de retorno `pagamento.html` consulta o estado diretamente à SumUp por uma função de servidor. O retorno sozinho nunca confirma pagamento.
6. Antes de aceitar encomendas reais, implementar e testar gestão de pedidos, conciliação automática via webhook/polling servidor, controlo de stock por variante, regras de expedição, notificações e proteção antiabuso/rate limit. A tabela de encomendas guarda dados pessoais: restrinja o acesso e configure retenção conforme requisitos legais.

**Limitação importante:** esta versão é uma integração inicial funcional do redirecionamento, não uma operação de e-commerce validada em produção. Não se fez qualquer cobrança real nem teste de API com credenciais.

Documentação: https://developer.sumup.com/online-payments/checkouts/hosted-checkout/
