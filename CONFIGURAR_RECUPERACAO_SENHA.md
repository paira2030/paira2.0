# Maelle — redefinição de senha por email

1. Preencha `assets/js/supabase-config.js` com Project URL e Publishable Key (nunca secret/service_role).
2. No Supabase > Authentication > URL Configuration, configure **Site URL** para o domínio publicado e adicione `https://SEU-DOMINIO/admin.html` às **Redirect URLs**. Para testes locais, adicione também o endereço local exato.
3. Em Authentication > Email Templates, confira o modelo **Reset Password**. O link deve usar `{{ .ConfirmationURL }}`.
4. Configure SMTP próprio e teste a entrega em produção.
5. No login, informe o email e clique **Esqueci a minha senha**. No painel, abra **Segurança** e clique **Enviar link para alterar senha**. Abra o link do email e escolha a nova senha.

**Atenção:** o email enviado nesta versão é a confirmação de identidade **antes** da troca de senha. A notificação automática adicional **após** a alteração não está implementada; para isso é preciso configurar notificações de segurança do provedor ou um backend com email transacional. Nunca envie passwords por email.

**Segurança:** o projeto original ainda contém modo PIN local quando o Supabase não está configurado. Antes de publicar, desative esse fallback e reveja credenciais de gateways armazenadas no navegador.
