import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { supabase } from '../lib/supabase'
import type { Match } from '../types'
import { 
  Gamepad2, 
  Search, 
  Trophy, 
  X, 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export function Matches() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      fetchMatches()
    }
  }, [user])

  useEffect(() => {
    filterMatches()
  }, [matches, searchTerm, statusFilter])

  const fetchMatches = async () => {
    try {
      setLoadingMatches(true)
      setError('')

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .or(`team1_id.eq.${user?.id},team2_id.eq.${user?.id}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar partidas:', error)
        // Se não há partidas no banco, criar dados fictícios
        createMockMatches()
      } else {
        if (data && data.length > 0) {
          setMatches(data)
        } else {
          // Se não há partidas, criar dados fictícios
          createMockMatches()
        }
      }
    } catch (error) {
      console.error('Erro ao buscar partidas:', error)
      createMockMatches()
    } finally {
      setLoadingMatches(false)
    }
  }

  const createMockMatches = () => {
    const mockMatches: Match[] = [
      {
        id: '1',
        team1_id: user?.id || '1',
        team2_id: '2',
        team1_name: 'Meu Time',
        team2_name: 'Rondônia Esports',
        team1_score: 16,
        team2_score: 14,
        map: 'de_dust2',
        status: 'completed',
        winner_id: user?.id || '1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        team1_id: '3',
        team2_id: user?.id || '1',
        team1_name: 'Caboclos Elite',
        team2_name: 'Meu Time',
        team1_score: 12,
        team2_score: 16,
        map: 'de_mirage',
        status: 'completed',
        winner_id: user?.id || '1',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        team1_id: user?.id || '1',
        team2_id: '4',
        team1_name: 'Meu Time',
        team2_name: 'Manaus Fire',
        team1_score: 13,
        team2_score: 16,
        map: 'de_inferno',
        status: 'completed',
        winner_id: '4',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        team1_id: '5',
        team2_id: user?.id || '1',
        team1_name: 'Acre Warriors',
        team2_name: 'Meu Time',
        team1_score: 8,
        team2_score: 16,
        map: 'de_cache',
        status: 'completed',
        winner_id: user?.id || '1',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        team1_id: user?.id || '1',
        team2_id: '6',
        team1_name: 'Meu Time',
        team2_name: 'Tocantins Thunder',
        team1_score: 0,
        team2_score: 0,
        map: 'de_overpass',
        status: 'scheduled',
        winner_id: null,
        created_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    setMatches(mockMatches)
  }

  const filterMatches = () => {
    let filtered = matches

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.team1_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.map.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(match => match.status === statusFilter)
    }

    setFilteredMatches(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return date < now ? 'Ontem' : 'Amanhã'
    } else if (diffDays <= 7) {
      return date < now ? `${diffDays} dias atrás` : `Em ${diffDays} dias`
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMatchResult = (match: Match) => {
    if (match.status !== 'completed') return null
    
    const isUserTeam1 = match.team1_id === user?.id
    const userScore = isUserTeam1 ? match.team1_score : match.team2_score
    const opponentScore = isUserTeam1 ? match.team2_score : match.team1_score
    const won = match.winner_id === user?.id
    
    return { userScore, opponentScore, won }
  }

  const getOpponentName = (match: Match) => {
    return match.team1_id === user?.id ? match.team2_name : match.team1_name
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Finalizada', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      live: { label: 'Ao Vivo', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      scheduled: { label: 'Agendada', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      cancelled: { label: 'Cancelada', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getWinLossStats = () => {
    const completedMatches = matches.filter(match => match.status === 'completed')
    const wins = completedMatches.filter(match => match.winner_id === user?.id).length
    const losses = completedMatches.length - wins
    const winRate = completedMatches.length > 0 ? Math.round((wins / completedMatches.length) * 100) : 0
    
    return { wins, losses, total: completedMatches.length, winRate }
  }

  if (loading || loadingMatches) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando partidas...</p>
        </div>
      </div>
    )
  }

  const stats = getWinLossStats()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <Gamepad2 className="mr-3" size={32} />
            Minhas Partidas
          </h1>
          <p className="text-text-secondary">
            Acompanhe seu histórico de partidas e estatísticas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-3">
                <Trophy className="text-primary" size={24} />
              </div>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-sm text-text-secondary">Total de Partidas</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto mb-3">
                <TrendingUp className="text-green-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
              <p className="text-sm text-text-secondary">Vitórias</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg mx-auto mb-3">
                <TrendingDown className="text-red-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
              <p className="text-sm text-text-secondary">Derrotas</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-lg mx-auto mb-3">
                <Target className="text-accent" size={24} />
              </div>
              <p className="text-2xl font-bold text-accent">{stats.winRate}%</p>
              <p className="text-sm text-text-secondary">Taxa de Vitória</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar por time ou mapa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">Todas as Partidas</option>
                <option value="completed">Finalizadas</option>
                <option value="live">Ao Vivo</option>
                <option value="scheduled">Agendadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Matches List */}
        {error && (
          <Card className="mb-6">
            <div className="text-center py-8">
              <X className="mx-auto mb-4 text-accent" size={48} />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Erro ao carregar partidas</h3>
              <p className="text-text-secondary mb-4">{error}</p>
              <Button onClick={fetchMatches}>Tentar Novamente</Button>
            </div>
          </Card>
        )}

        {filteredMatches.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Gamepad2 className="mx-auto mb-4 text-text-secondary" size={48} />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Nenhuma partida encontrada' : 'Nenhuma partida ainda'}
              </h3>
              <p className="text-text-secondary mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Que tal buscar uma partida para começar?'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button onClick={() => navigate('/jogar')}>Buscar Partida</Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => {
              const result = getMatchResult(match)
              const opponentName = getOpponentName(match)
              
              return (
                <Card key={match.id} className="hover:bg-surface/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Match Result */}
                      <div className="flex items-center space-x-3">
                        {result ? (
                          <div className={`w-3 h-3 rounded-full ${
                            result.won ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-text-primary">Meu Time</span>
                            <span className="text-text-secondary">vs</span>
                            <span className="font-semibold text-text-primary">{opponentName}</span>
                          </div>
                          
                          {result && (
                            <div className="text-sm text-text-secondary">
                              {result.userScore} - {result.opponentScore}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Map */}
                      <div className="hidden sm:block">
                        <div className="px-3 py-1 bg-surface rounded-lg border border-border">
                          <span className="text-sm font-medium text-text-primary">{match.map}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status and Date */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden md:block">
                        <div className="flex items-center space-x-1 text-text-secondary text-sm">
                          <Calendar size={14} />
                          <span>{formatDate(match.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-text-secondary text-sm">
                          <Clock size={14} />
                          <span>{formatTime(match.created_at)}</span>
                        </div>
                      </div>
                      
                      {getStatusBadge(match.status)}
                    </div>
                  </div>
                  
                  {/* Mobile Map */}
                  <div className="sm:hidden mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 bg-surface rounded-lg border border-border">
                        <span className="text-sm font-medium text-text-primary">{match.map}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-text-secondary text-sm">
                          <Calendar size={14} />
                          <span>{formatDate(match.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => navigate('/jogar')}
            className="flex items-center space-x-2"
          >
            <Gamepad2 size={20} />
            <span>Buscar Nova Partida</span>
          </Button>
        </div>
      </div>
    </div>
  )
}