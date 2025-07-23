# Configuração do Banco de Dados Supabase

## Instruções para criar as tabelas

1. **Acesse o painel do Supabase**
   - Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Faça login na sua conta
   - Selecione o projeto "Curumins League"

2. **Execute o script SQL**
   - No painel lateral, clique em "SQL Editor"
   - Clique em "New Query"
   - Copie todo o conteúdo do arquivo `supabase-schema.sql`
   - Cole no editor SQL
   - Clique em "Run" para executar o script

3. **Verificar se as tabelas foram criadas**
   - No painel lateral, clique em "Table Editor"
   - Você deve ver as seguintes tabelas:
     - `users` - Perfis dos jogadores
     - `teams` - Times da liga
     - `team_members` - Membros dos times
     - `matches` - Partidas
     - `match_stats` - Estatísticas das partidas
     - `tournaments` - Torneios
     - `tournament_registrations` - Inscrições em torneios

## Estrutura das Tabelas

### users
Armazena os perfis dos jogadores com estatísticas básicas.

### teams
Informações dos times incluindo capitão e estatísticas.

### team_members
Relação entre usuários e times, incluindo roles (capitão/membro).

### matches
Partidas entre times com scores e status.

### match_stats
Estatísticas detalhadas de cada jogador em cada partida.

### tournaments
Torneios da liga com premiações e datas.

### tournament_registrations
Inscrições de times em torneios.

## Políticas de Segurança (RLS)

O script inclui políticas de Row Level Security que:
- Permitem que todos vejam perfis, times, partidas e torneios
- Permitem que usuários editem apenas seus próprios perfis
- Permitem que capitães gerenciem seus times
- Criam automaticamente perfis quando novos usuários se registram

## Dados de Exemplo

O script inclui alguns torneios de exemplo para testar a aplicação.

## Troubleshooting

Se houver erros ao executar o script:
1. Verifique se você tem permissões de administrador no projeto
2. Execute o script em partes menores se necessário
3. Verifique os logs de erro no painel do Supabase