# Curumins League - Plataforma de CS2 da Região Norte

Uma plataforma completa para organização de partidas e torneios de Counter-Strike 2 na região Norte do Brasil.

## 🚀 Funcionalidades

- **Dashboard Personalizado**: Visualize suas estatísticas, partidas recentes e ranking
- **Sistema de Perfil**: Gerencie suas informações e acompanhe seu progresso
- **Matchmaking**: Sistema de busca de partidas automático
- **Times**: Crie e gerencie equipes
- **Torneios**: Participe de competições organizadas
- **Ranking**: Sistema de classificação baseado em performance

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL com RLS (Row Level Security)

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd curumins-league
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
O arquivo `.env` já está configurado com as credenciais do Supabase. Se necessário, atualize:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 4. Configure o banco de dados
Execute o script SQL `supabase-schema.sql` no seu projeto Supabase para criar todas as tabelas e configurações necessárias.

### 5. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📊 Estrutura do Banco de Dados

### Tabelas Principais:
- **users**: Perfis dos jogadores com estatísticas
- **teams**: Informações dos times
- **team_members**: Relacionamento entre usuários e times
- **matches**: Partidas realizadas
- **match_stats**: Estatísticas detalhadas das partidas
- **tournaments**: Torneios disponíveis
- **tournament_registrations**: Inscrições em torneios

## 🔐 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de acesso baseadas em autenticação
- Triggers automáticos para atualização de timestamps
- Função automática de criação de perfil após registro

## 🎮 Como Usar

1. **Registro**: Crie sua conta com email e senha
2. **Perfil**: Seu perfil será criado automaticamente com estatísticas zeradas
3. **Dashboard**: Acesse o dashboard para ver suas informações
4. **Buscar Partida**: Use o sistema de matchmaking para encontrar partidas
5. **Times**: Crie ou participe de equipes
6. **Torneios**: Inscreva-se em competições

## 🐛 Solução de Problemas

### Perfil não carrega
- Verifique se está logado corretamente
- O sistema criará automaticamente um perfil se não existir
- Tente fazer logout e login novamente

### Dashboard com erro
- Verifique a conexão com o Supabase
- Dados fictícios serão exibidos se não houver partidas reais

### Problemas de autenticação
- Verifique as configurações do Supabase
- Confirme se as variáveis de ambiente estão corretas

## 📝 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run preview`: Visualiza a build de produção
- `npm run lint`: Executa o linter

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.
