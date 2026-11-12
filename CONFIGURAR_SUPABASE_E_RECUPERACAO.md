# Configuração obrigatória — Maelle.oficial

O botão de recuperação só envia email depois de configurar a ligação ao Supabase.

1. No painel do Supabase, abra Project Settings > Data API e copie o Project URL.
2. Abra Project Settings > API Keys e copie a **Publishable key** (`sb_publishable_...`). NÃO use a Secret Key.
3. Edite `assets/js/supabase-config.js` e preencha as duas strings entre aspas.
4. Publique novamente o conteúdo da pasta `maelle` na Vercel (certifique-se de que `admin.html` fica na raiz publicada).
5. No Supabase > Authentication > URL Configuration, configure Site URL como `https://maelleoficial.vercel.app/` e adicione `https://maelleoficial.vercel.app/admin.html` em Redirect URLs (se já existir, não duplique).
6. Em `https://maelleoficial.vercel.app/admin.html`, clique Esqueci a minha senha, informe o email do utilizador cadastrado no Supabase e clique Enviar link.
7. Verifique a caixa de entrada e spam. Se houver erros de entrega, verifique os logs de Auth e a configuração SMTP do Supabase.

**Segurança:** nunca coloque `sb_secret_`, `service_role` ou passwords neste ficheiro. A chave publicável depende das políticas RLS que já configurou. O PIN local antigo foi desativado para evitar acesso sem autenticação Supabase.

**Nota:** esta versão prepara a recuperação de senha por email. A notificação de segurança adicional *após* a mudança de senha exige configuração específica de email/serviço no backend e não foi implementada aqui.
