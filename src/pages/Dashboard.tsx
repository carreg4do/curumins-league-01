import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import type { Match, Team } from '../types'
import { 
  Play as PlayIcon, 
  Trophy, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  Star,
  Zap
} from 'lucide-react'

export function Dashboard() {
  const { user, userProfile, loading } = useAuth()
  const navigate = useNavigate()
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [userTeam, setUserTeam] = useState<Team | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user && userProfile) {
      fetchDashboardData()
    }
  }, [user, userProfile])

  const fetchDashboardData = async () => {
    try {
      // Buscar partidas recentes
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (matchesError) {
        console.error('Erro ao buscar partidas:', matchesError)
      }
      
      // Se não há partidas ou houve erro, usar dados fictícios para demonstração
      if (!matches || matches.length === 0) {
        const mockMatches: Match[] = [
          {
            id: '1',
            team1_id: '1',
            team2_id: '2',
            team1_score: 16,
            team2_score: 14,
            status: 'finished',
            map: 'Dust2',
            created_at: new Date().toISOString(),
            team1_name: 'Team Alpha',
            team2_name: 'Team Beta',
            winner_id: '1',
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            team1_id: '3',
            team2_id: '4',
            team1_score: 13,
            team2_score: 16,
            status: 'finished',
            map: 'Mirage',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            team1_name: 'Team Gamma',
            team2_name: 'Team Delta',
            winner_id: '4',
            updated_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]
        setRecentMatches(mockMatches)
      } else {
        setRecentMatches(matches)
      }

      // Buscar time do usuário
      if (userProfile?.team_id) {
        const { data: team, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', userProfile.team_id)
          .single()

        if (teamError) {
          console.error('Erro ao buscar time:', teamError)
        } else if (team) {
          setUserTeam(team)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleFindMatch = () => {
    navigate('/jogar')
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Bem-vindo, {userProfile?.nickname}!
          </h1>
          <p className="text-text-secondary">
            Pronto para dominar o CS2 na região Norte?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-3">
              <Trophy className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Ranking</h3>
            <p className="text-2xl font-bold text-primary">#{userProfile?.ranking || 'N/A'}</p>
          </Card>

          <Card hover className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto mb-3">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Vitórias</h3>
            <p className="text-2xl font-bold text-green-500">{userProfile?.wins || 0}</p>
          </Card>

          <Card hover className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg mx-auto mb-3">
              <Target className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Derrotas</h3>
            <p className="text-2xl font-bold text-red-500">{userProfile?.losses || 0}</p>
          </Card>

          <Card hover className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-lg mx-auto mb-3">
              <Star className="text-accent" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">K/D Ratio</h3>
            <p className="text-2xl font-bold text-accent">{userProfile?.kd_ratio?.toFixed(2) || '0.00'}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center">
                <Zap className="mr-2" size={24} />
                Ações Rápidas
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleFindMatch}
                  size="lg"
                  className="flex items-center justify-center space-x-2 h-16"
                >
                  <PlayIcon size={24} />
                  <span>BUSCAR PARTIDA</span>
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => navigate('/times')}
                  size="lg"
                  className="flex items-center justify-center space-x-2 h-16"
                >
                  <Users size={24} />
                  <span>VER TIMES</span>
                </Button>
              </div>
            </Card>

            {/* Recent Matches */}
            <Card>
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center">
                <Clock className="mr-2" size={24} />
                Partidas Recentes
              </h2>
              
              {recentMatches.length > 0 ? (
                <div className="space-y-3">
                  {recentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="font-semibold text-text-primary">{match.team1_name || 'Time 1'}</p>
                          <p className="text-sm text-text-secondary">vs</p>
                          <p className="font-semibold text-text-primary">{match.team2_name || 'Time 2'}</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">
                          {match.team1_score} - {match.team2_score}
                        </p>
                        <p className="text-sm text-text-secondary">{match.map}</p>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          match.status === 'finished' 
                            ? 'bg-green-500/20 text-green-500'
                            : match.status === 'ongoing'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {match.status === 'finished' ? 'Finalizada' : 
                           match.status === 'ongoing' ? 'Em andamento' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">Nenhuma partida recente encontrada</p>
                  <Button
                    variant="secondary"
                    onClick={handleFindMatch}
                    className="mt-4"
                  >
                    Jogar primeira partida
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Info */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                Meu Time
              </h3>
              
              {userTeam ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold text-xl">
                      {userTeam.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">{userTeam.name}</h4>
                  <p className="text-sm text-text-secondary mb-4">
                    {userTeam.wins}V - {userTeam.losses}D
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/meu-time')}
                    fullWidth
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-text-secondary mb-4">Você não está em um time</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/times')}
                    fullWidth
                  >
                    Encontrar Time
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Links */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Links Rápidos</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/ranking')}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-primary"
                >
                  🏆 Ranking Geral
                </button>
                
                <button
                  onClick={() => navigate('/partidas')}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-primary"
                >
                  🎮 Histórico de Partidas
                </button>
                
                <button
                  onClick={() => navigate('/perfil')}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-primary"
                >
                  👤 Meu Perfil
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}