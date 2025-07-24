import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { supabase } from '../lib/supabase'
import type { Team } from '../types'
import { 
  Users, 
  Search, 
  Trophy, 
  Target, 
  MapPin,
  Crown,
  Plus
} from 'lucide-react'

export function Teams() {
  const { user, loading } = useAuthContext()
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    filterTeams()
  }, [teams, searchTerm, selectedRegion])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('wins', { ascending: false })

      if (error) {
        console.error('Erro ao buscar times:', error)
        // Se não houver times, criar alguns fictícios
        await createMockTeams()
        return
      }

      if (data && data.length > 0) {
        setTeams(data)
      } else {
        // Criar times fictícios se não houver nenhum
        await createMockTeams()
      }
    } catch (error) {
      console.error('Erro ao carregar times:', error)
      await createMockTeams()
    } finally {
      setLoadingTeams(false)
    }
  }

  const createMockTeams = async () => {
    const mockTeams = [
      {
        name: 'Rondônia Esports',
        region: 'Rondônia',
        wins: 15,
        losses: 3,
        members: [],
        captain_id: ''
      },
      {
        name: 'Caboclos Elite',
        region: 'Amazonas',
        wins: 12,
        losses: 6,
        members: [],
        captain_id: ''
      },
      {
        name: 'Manaus Fire',
        region: 'Amazonas',
        wins: 10,
        losses: 8,
        members: [],
        captain_id: ''
      },
      {
        name: 'Acre Warriors',
        region: 'Acre',
        wins: 8,
        losses: 10,
        members: [],
        captain_id: ''
      },
      {
        name: 'Pará Legends',
        region: 'Pará',
        wins: 14,
        losses: 4,
        members: [],
        captain_id: ''
      },
      {
        name: 'Roraima Storm',
        region: 'Roraima',
        wins: 6,
        losses: 12,
        members: [],
        captain_id: ''
      },
      {
        name: 'Amapá Titans',
        region: 'Amapá',
        wins: 9,
        losses: 9,
        members: [],
        captain_id: ''
      },
      {
        name: 'Tocantins Force',
        region: 'Tocantins',
        wins: 11,
        losses: 7,
        members: [],
        captain_id: ''
      }
    ]

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert(mockTeams)
        .select()

      if (!error && data) {
        setTeams(data)
      }
    } catch (error) {
      console.error('Erro ao criar times fictícios:', error)
      // Se falhar, usar dados locais
      setTeams(mockTeams.map((team, index) => ({
        ...team,
        id: `mock-${index}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
    }
  }

  const filterTeams = () => {
    let filtered = teams

    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.region || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(team => team.region === selectedRegion)
    }

    setFilteredTeams(filtered)
  }

  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses
    if (total === 0) return 0
    return Math.round((wins / total) * 100)
  }

  const regions = ['all', ...Array.from(new Set(teams.map(team => team.region || '').filter(Boolean)))]

  if (loading || loadingTeams) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando times...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <Users className="mr-3" size={32} />
            Times da Liga
          </h1>
          <p className="text-text-secondary">
            Conheça os times que competem na Curumins League
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar times..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                </div>
              </div>
              
              <div className="sm:w-48">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">Todas as regiões</option>
                  {regions.filter(region => region !== 'all').map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              
              <Button
                variant="secondary"
                onClick={() => {
                  // TODO: Implementar criação de time
                  alert('Funcionalidade de criar time será implementada em breve!')
                }}
                className="flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Criar Time</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => (
              <Card key={team.id || index} hover className="relative">
                {/* Ranking Badge */}
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <Crown className="text-black" size={16} />
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold text-xl">
                      {team.name.charAt(0)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-text-primary mb-1">
                    {team.name}
                  </h3>
                  
                  <div className="flex items-center justify-center text-text-secondary text-sm mb-3">
                    <MapPin size={14} className="mr-1" />
                    {team.region}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg mx-auto mb-1">
                      <Trophy className="text-green-500" size={16} />
                    </div>
                    <p className="text-sm text-text-secondary">Vitórias</p>
                    <p className="font-bold text-green-500">{team.wins}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-lg mx-auto mb-1">
                      <Target className="text-red-500" size={16} />
                    </div>
                    <p className="text-sm text-text-secondary">Derrotas</p>
                    <p className="font-bold text-red-500">{team.losses}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-lg mx-auto mb-1">
                      <span className="text-primary font-bold text-xs">%</span>
                    </div>
                    <p className="text-sm text-text-secondary">Taxa</p>
                    <p className="font-bold text-primary">{getWinRate(team.wins, team.losses)}%</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      // TODO: Implementar visualização de detalhes do time
                      alert(`Detalhes do ${team.name} serão implementados em breve!`)
                    }}
                  >
                    Ver Detalhes
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      // TODO: Implementar solicitação para entrar no time
                      alert(`Solicitação para entrar no ${team.name} será implementada em breve!`)
                    }}
                  >
                    Solicitar Entrada
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-text-secondary" size={48} />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Nenhum time encontrado
              </h3>
              <p className="text-text-secondary mb-6">
                {searchTerm || selectedRegion !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Ainda não há times cadastrados na liga'
                }
              </p>
              
              {(searchTerm || selectedRegion !== 'all') && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedRegion('all')
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}