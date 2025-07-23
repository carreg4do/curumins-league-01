# Configuração do Supabase para Magic Link

Este documento contém as instruções para configurar corretamente o Supabase para autenticação com magic link.

## 1. Configuração no Dashboard do Supabase

### Authentication > URL Configuration

Acesse o dashboard do Supabase e configure as seguintes URLs:

#### Site URL
- **Produção**: `https://www.curuminsleague.com`
- **Desenvolvimento**: `http://localhost:5173`

#### Redirect URLs
Adicione as seguintes URLs na lista de redirect URLs permitidas:

- `https://www.curuminsleague.com/auth/callback`
- `http://localhost:5173/auth/callback`
- `https://www.curuminsleague.com/dashboard`
- `http://localhost:5173/dashboard`

### Authentication > Email Templates

Personalize o template de email de confirmação se necessário. O template padrão já funciona com magic links.

## 2. Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém:

```env
# Environment
VITE_APP_ENV=development

# Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# Site URLs
VITE_SITE_URL_DEV=http://localhost:5173
VITE_SITE_URL_PROD=https://www.curuminsleague.com
```

## 3. Fluxo de Autenticação

### Login/Registro
1. Usuário insere email na página de login ou registro
2. Sistema envia magic link via `supabase.auth.signInWithOtp()`
3. Email é enviado com link para `/auth/callback?redirect_to=/dashboard`

### Callback
1. Usuário clica no link do email
2. É redirecionado para `/auth/callback`
3. Sistema verifica a sessão e busca/cria perfil do usuário
4. Usuário é redirecionado para `/dashboard` (ou URL especificada em `redirect_to`)

### Proteção de Rotas
- Todas as rotas protegidas usam o componente `<ProtectedRoute>`
- Usuários não autenticados são redirecionados para `/login`
- Usuários autenticados têm acesso completo às rotas protegidas

## 4. Testando a Configuração

### Desenvolvimento
1. Execute `npm run dev`
2. Acesse `http://localhost:5173/login`
3. Insira um email válido
4. Verifique se o email de magic link é recebido
5. Clique no link e verifique se é redirecionado para o dashboard

### Produção
1. Faça deploy da aplicação
2. Configure `VITE_APP_ENV=production`
3. Teste o fluxo completo em `https://www.curuminsleague.com`

## 5. Troubleshooting

### Email não é enviado
- Verifique se as URLs estão configuradas corretamente no Supabase
- Confirme se o email está na lista de usuários permitidos (se em modo restrito)

### Redirecionamento não funciona
- Verifique se as redirect URLs estão na lista permitida
- Confirme se as variáveis de ambiente estão corretas

### Sessão não persiste
- Verifique se `persistSession: true` está configurado
- Confirme se o localStorage está funcionando corretamente