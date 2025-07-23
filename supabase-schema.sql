-- Criação das tabelas para a Curumins League

-- Tabela de usuários (profiles)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    steam_id VARCHAR(50),
    avatar TEXT,
    position VARCHAR(20),
    ranking INTEGER DEFAULT 1000,
    email VARCHAR(255),
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    kd_ratio DECIMAL(4,2) DEFAULT 0.00,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    headshots INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de times
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    logo TEXT,
    captain_id UUID REFERENCES public.users(id),
    region VARCHAR(50) DEFAULT 'Norte',
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de membros dos times
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- 'captain', 'member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Tabela de partidas
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team1_id UUID REFERENCES public.teams(id),
    team2_id UUID REFERENCES public.teams(id),
    team1_name VARCHAR(100),
    team2_name VARCHAR(100),
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'ongoing', 'finished', 'cancelled'
    map VARCHAR(50),
    winner_id UUID,
    tournament_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (team1_id != team2_id)
);

-- Tabela de estatísticas dos jogadores nas partidas
CREATE TABLE IF NOT EXISTS public.match_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    team_id UUID REFERENCES public.teams(id),
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    headshots INTEGER DEFAULT 0,
    damage INTEGER DEFAULT 0,
    mvp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de torneios
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    prize_pool DECIMAL(10,2),
    max_teams INTEGER DEFAULT 16,
    status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'finished'
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de inscrições em torneios
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, team_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_nickname ON public.users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_ranking ON public.users(ranking DESC);
CREATE INDEX IF NOT EXISTS idx_teams_wins ON public.teams(wins DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON public.matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para times
CREATE POLICY "Anyone can view teams" ON public.teams
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams" ON public.teams
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Team captains can update their teams" ON public.teams
    FOR UPDATE USING (auth.uid() = captain_id);

-- Políticas para membros de times
CREATE POLICY "Anyone can view team members" ON public.team_members
    FOR SELECT USING (true);

CREATE POLICY "Team captains can manage members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.teams 
            WHERE teams.id = team_members.team_id 
            AND teams.captain_id = auth.uid()
        )
    );

-- Políticas para partidas
CREATE POLICY "Anyone can view matches" ON public.matches
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create matches" ON public.matches
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas para estatísticas de partidas
CREATE POLICY "Anyone can view match stats" ON public.match_stats
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert match stats" ON public.match_stats
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas para torneios
CREATE POLICY "Anyone can view tournaments" ON public.tournaments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tournaments" ON public.tournaments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas para inscrições em torneios
CREATE POLICY "Anyone can view tournament registrations" ON public.tournament_registrations
    FOR SELECT USING (true);

CREATE POLICY "Team captains can register their teams" ON public.tournament_registrations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.teams 
            WHERE teams.id = tournament_registrations.team_id 
            AND teams.captain_id = auth.uid()
        )
    );

-- Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, nickname, email, wins, losses, kd_ratio, ranking, kills, deaths, assists, headshots)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nickname', 'Jogador'),
        NEW.email,
        0,
        0,
        0.00,
        1000,
        0,
        0,
        0,
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir dados de exemplo
INSERT INTO public.tournaments (name, description, prize_pool, start_date, end_date, status) VALUES
('Copa Curumins 2024', 'Torneio principal da temporada com os melhores times da região Norte', 5000.00, '2024-02-01 18:00:00+00', '2024-02-15 22:00:00+00', 'upcoming'),
('Liga Semanal #1', 'Torneio semanal para times iniciantes', 500.00, '2024-01-20 19:00:00+00', '2024-01-21 23:00:00+00', 'finished'),
('Campeonato Regional', 'Disputa entre os melhores times de cada estado do Norte', 2500.00, '2024-03-01 18:00:00+00', '2024-03-10 22:00:00+00', 'upcoming');