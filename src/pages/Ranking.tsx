import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { supabase } from '../lib/supabase'
import type { User } from '../types'
import { 
  Trophy, 
  Search, 
  Medal, 
  Crown,
  Award
} from 'lucide-react'

export function Ranking() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [players, setPlayers] = useState<User[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingPlayers, setLoadingPlayers] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    filterPlayers()
  }, [players, searchTerm])

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('ranking', { ascending: true })

      if (error) {
        console.error('Erro ao buscar jogadores:', error)
        await createMockPlayers()
        return
      }

      if (data && data.length > 0) {
        setPlayers(data)
      } else {
        await createMockPlayers()
      }
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
      await createMockPlayers()
    } finally {
      setLoadingPlayers(false)
    }
  }

  const createMockPlayers = async () => {
    const mockPlayers = [
      {
        nickname: 'AmazonKing',
        wins: 45,
        losses: 12,
        kd_ratio: 1.85,
        ranking: 1,
        position: 'AWPer'
      },
      {
        nickname: 'CabocloFire',
        wins: 42,
        losses: 15,
        kd_ratio: 1.72,
        ranking: 2,
        position: 'Entry Fragger'
      },
      {
        nickname: 'RondôniaAce',
        wins: 38,
        losses: 18,
        kd_ratio: 1.65,
        ranking: 3,
        position: 'IGL'
      },
      {
        nickname: 'ParáLegend',
        wins: 35,
        losses: 20,
        kd_ratio: 1.58,
        ranking: 4,
        position: 'Rifler'
      },
      {
        nickname: 'AcreWarrior',
        wins: 33,
        losses: 22,
        kd_ratio: 1.45,
        ranking: 5,
        position: 'Support'
      },
      {
        nickname: 'ManausStorm',
        wins: 30,
        losses: 25,
        kd_ratio: 1.38,
        ranking: 6,
        position: 'Rifler'
      },
      {
        nickname: 'RoraimaShot',
        wins: 28,
        losses: 27,
        kd_ratio: 1.32,
        ranking: 7,
        position: 'AWPer'
      },
      {
        nickname: 'AmapáTitan',
        wins: 25,
        losses: 30,
        kd_ratio: 1.25,
        ranking: 8,
        position: 'Entry Fragger'
      },
      {
        nickname: 'TocantinsForce',
        wins: 22,
        losses: 33,
        kd_ratio: 1.18,
        ranking: 9,
        position: 'Support'
      },
      {
        nickname: 'NorteElite',
        wins: 20,
        losses: 35,
        kd_ratio: 1.12,
        ranking: 10,
        position: 'Rifler'
      }
    ]

    // Usar dados locais se não conseguir inserir no banco
    setPlayers(mockPlayers.map((player, index) => ({
      ...player,
      id: `mock-${index}`,
      email: `${player.nickname.toLowerCase()}@example.com`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })))
  }

  const filterPlayers = () => {
    let filtered = players

    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.position && player.position.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPlayers(filtered)
  }

  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses
    if (total === 0) return 0
    return Math.round((wins / total) * 100)
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />
      case 2:
        return <Medal className="text-gray-400" size={24} />
      case 3:
        return <Award className="text-amber-600" size={24} />
      default:
        return <span className="text-text-secondary font-bold">#{position}</span>
    }
  }

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-500 to-yellow-600'
      case 2:
        return 'from-gray-400 to-gray-500'
      case 3:
        return 'from-amber-600 to-amber-700'
      default:
        return 'from-primary to-accent'
    }
  }

  if (loading || loadingPlayers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando ranking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <Trophy className="mr-3" size={32} />
            Ranking da Liga
          </h1>
          <p className="text-text-secondary">
            Os melhores jogadores da região Norte do Brasil
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Card>
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Buscar jogador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            </div>
          </Card>
        </div>

        {/* Top 3 Podium */}
        {filteredPlayers.length >= 3 && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">🏆 TOP 3 🏆</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              <Card className="md:order-1 relative">
                <div className="text-center">
                  <div className="relative">
                    <div className={`w-20 h-20 bg-gradient-to-r ${getRankColor(2)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-black font-bold text-2xl">
                        {filteredPlayers[1].nickname.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(2)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {filteredPlayers[1].nickname}
                  </h3>
                  <p className="text-text-secondary mb-4">{filteredPlayers[1].position}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-secondary">K/D</p>
                      <p className="font-bold text-primary">{filteredPlayers[1].kd_ratio?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Taxa</p>
                      <p className="font-bold text-green-500">{getWinRate(filteredPlayers[1].wins, filteredPlayers[1].losses)}%</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 1st Place */}
              <Card className="md:order-2 relative transform md:scale-110">
                <div className="text-center">
                  <div className="relative">
                    <div className={`w-24 h-24 bg-gradient-to-r ${getRankColor(1)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-black font-bold text-3xl">
                        {filteredPlayers[0].nickname.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute -top-3 -right-3">
                      {getRankIcon(1)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    {filteredPlayers[0].nickname}
                  </h3>
                  <p className="text-text-secondary mb-4">{filteredPlayers[0].position}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-secondary">K/D</p>
                      <p className="font-bold text-primary">{filteredPlayers[0].kd_ratio?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Taxa</p>
                      <p className="font-bold text-green-500">{getWinRate(filteredPlayers[0].wins, filteredPlayers[0].losses)}%</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 3rd Place */}
              <Card className="md:order-3 relative">
                <div className="text-center">
                  <div className="relative">
                    <div className={`w-20 h-20 bg-gradient-to-r ${getRankColor(3)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-black font-bold text-2xl">
                        {filteredPlayers[2].nickname.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(3)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {filteredPlayers[2].nickname}
                  </h3>
                  <p className="text-text-secondary mb-4">{filteredPlayers[2].position}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-secondary">K/D</p>
                      <p className="font-bold text-primary">{filteredPlayers[2].kd_ratio?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Taxa</p>
                      <p className="font-bold text-green-500">{getWinRate(filteredPlayers[2].wins, filteredPlayers[2].losses)}%</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Full Ranking Table */}
        <Card>
          <h2 className="text-xl font-bold text-primary mb-6">Ranking Completo</h2>
          
          {filteredPlayers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Posição</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Jogador</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-medium">Posição</th>
                    <th className="text-center py-3 px-4 text-text-secondary font-medium">Vitórias</th>
                    <th className="text-center py-3 px-4 text-text-secondary font-medium">Derrotas</th>
                    <th className="text-center py-3 px-4 text-text-secondary font-medium">Taxa</th>
                    <th className="text-center py-3 px-4 text-text-secondary font-medium">K/D</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {(player.ranking ?? 0) <= 3 ? (
                            getRankIcon(player.ranking ?? 0)
                          ) : (
                            <span className="text-text-secondary font-bold">#{player.ranking ?? 0}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getRankColor(player.ranking ?? 0)} rounded-lg flex items-center justify-center`}>
                            <span className="text-black font-bold">
                              {player.nickname.charAt(0)}
                            </span>
                          </div>
                          <span className="font-semibold text-text-primary">{player.nickname}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-text-secondary">{player.position || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-green-500">{player.wins}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-red-500">{player.losses}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-primary">
                          {getWinRate(player.wins, player.losses)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-accent">
                          {player.kd_ratio?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="mx-auto mb-4 text-text-secondary" size={48} />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Nenhum jogador encontrado
              </h3>
              <p className="text-text-secondary">
                {searchTerm ? 'Tente ajustar o termo de busca' : 'Ainda não há jogadores no ranking'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}