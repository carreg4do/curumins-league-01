import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { 
  Gamepad2, 
  Users, 
  Clock, 
  Target, 
  Zap,
  CheckCircle,
  XCircle,
  Loader,
  Play as PlayIcon,
  Settings
} from 'lucide-react'

type MatchmakingStatus = 'idle' | 'searching' | 'found' | 'accepted' | 'declined'

interface QueueSettings {
  preferredMaps: string[]
  maxPing: number
  region: string
}

export function Play() {
  const { user, userProfile, loading } = useAuth()
  const navigate = useNavigate()
  const [matchmakingStatus, setMatchmakingStatus] = useState<MatchmakingStatus>('idle')
  const [searchTime, setSearchTime] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [foundMatch, setFoundMatch] = useState<any>(null)
  const [acceptTimer, setAcceptTimer] = useState(10)
  const [showSettings, setShowSettings] = useState(false)
  const [queueSettings, setQueueSettings] = useState<QueueSettings>({
    preferredMaps: ['de_dust2', 'de_mirage', 'de_inferno'],
    maxPing: 50,
    region: 'Norte'
  })

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (matchmakingStatus === 'searching') {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1)
        
        // Simular encontrar partida após um tempo aleatório (10-30 segundos)
        if (searchTime > 10 && Math.random() < 0.1) {
          findMatch()
        }
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [matchmakingStatus, searchTime])

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (matchmakingStatus === 'found') {
      interval = setInterval(() => {
        setAcceptTimer(prev => {
          if (prev <= 1) {
            // Tempo esgotado, cancelar partida
            setMatchmakingStatus('declined')
            setTimeout(() => {
              resetMatchmaking()
            }, 3000)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [matchmakingStatus])

  useEffect(() => {
    // Calcular tempo estimado baseado no ranking e região
    const baseTime = 30 // segundos base
    const rankingMultiplier = userProfile?.ranking ? Math.min(userProfile.ranking / 100, 2) : 1
    const regionMultiplier = queueSettings.region === 'Norte' ? 1.2 : 1 // Norte tem menos jogadores
    
    setEstimatedTime(Math.round(baseTime * rankingMultiplier * regionMultiplier))
  }, [userProfile, queueSettings.region])

  const startMatchmaking = () => {
    setMatchmakingStatus('searching')
    setSearchTime(0)
  }

  const stopMatchmaking = () => {
    setMatchmakingStatus('idle')
    setSearchTime(0)
  }

  const findMatch = () => {
    const maps = ['de_dust2', 'de_mirage', 'de_inferno', 'de_cache', 'de_overpass', 'de_train']
    const opponents = [
      'Rondônia Esports',
      'Caboclos Elite', 
      'Manaus Fire',
      'Acre Warriors',
      'Tocantins Thunder',
      'Roraima Legends',
      'Amapá Storm',
      'Pará Eagles'
    ]
    
    const selectedMap = queueSettings.preferredMaps.length > 0 
      ? queueSettings.preferredMaps[Math.floor(Math.random() * queueSettings.preferredMaps.length)]
      : maps[Math.floor(Math.random() * maps.length)]
    
    const opponent = opponents[Math.floor(Math.random() * opponents.length)]
    
    setFoundMatch({
      map: selectedMap,
      opponent,
      ping: Math.floor(Math.random() * queueSettings.maxPing) + 10,
      server: 'São Paulo #' + Math.floor(Math.random() * 10 + 1)
    })
    
    setMatchmakingStatus('found')
    setAcceptTimer(10)
  }

  const acceptMatch = () => {
    setMatchmakingStatus('accepted')
    
    // Simular carregamento da partida
    setTimeout(() => {
      alert('Partida iniciada! Em um jogo real, você seria redirecionado para o servidor.')
      resetMatchmaking()
    }, 2000)
  }

  const declineMatch = () => {
    setMatchmakingStatus('declined')
    setTimeout(() => {
      resetMatchmaking()
    }, 3000)
  }

  const resetMatchmaking = () => {
    setMatchmakingStatus('idle')
    setSearchTime(0)
    setFoundMatch(null)
    setAcceptTimer(10)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const availableMaps = [
    { id: 'de_dust2', name: 'Dust II', popular: true },
    { id: 'de_mirage', name: 'Mirage', popular: true },
    { id: 'de_inferno', name: 'Inferno', popular: true },
    { id: 'de_cache', name: 'Cache', popular: false },
    { id: 'de_overpass', name: 'Overpass', popular: false },
    { id: 'de_train', name: 'Train', popular: false },
    { id: 'de_nuke', name: 'Nuke', popular: false }
  ]

  const toggleMapPreference = (mapId: string) => {
    setQueueSettings(prev => ({
      ...prev,
      preferredMaps: prev.preferredMaps.includes(mapId)
        ? prev.preferredMaps.filter(id => id !== mapId)
        : [...prev.preferredMaps, mapId]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center">
            <Gamepad2 className="mr-3" size={32} />
            Buscar Partida
          </h1>
          <p className="text-text-secondary">
            Entre na fila e encontre oponentes do seu nível
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Matchmaking Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Matchmaking Status */}
            <Card className="text-center">
              {matchmakingStatus === 'idle' && (
                <div className="py-8">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PlayIcon className="text-primary" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-4">Pronto para jogar?</h2>
                  <p className="text-text-secondary mb-6">
                    Tempo estimado de fila: ~{formatTime(estimatedTime)}
                  </p>
                  <Button
                    size="lg"
                    onClick={startMatchmaking}
                    className="px-8 py-4 text-lg"
                  >
                    Buscar Partida
                  </Button>
                </div>
              )}

              {matchmakingStatus === 'searching' && (
                <div className="py-8">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Loader className="text-primary animate-spin" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-2">Procurando partida...</h2>
                  <p className="text-text-secondary mb-4">
                    Tempo de busca: {formatTime(searchTime)}
                  </p>
                  <div className="w-full bg-surface rounded-full h-2 mb-6">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((searchTime / estimatedTime) * 100, 100)}%` }}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={stopMatchmaking}
                  >
                    Cancelar Busca
                  </Button>
                </div>
              )}

              {matchmakingStatus === 'found' && foundMatch && (
                <div className="py-8">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-500" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-green-500 mb-4">Partida Encontrada!</h2>
                  
                  <div className="bg-surface rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div>
                        <p className="text-text-secondary text-sm">Mapa</p>
                        <p className="font-semibold text-text-primary">{foundMatch.map}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-sm">Oponente</p>
                        <p className="font-semibold text-text-primary">{foundMatch.opponent}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-sm">Ping</p>
                        <p className="font-semibold text-text-primary">{foundMatch.ping}ms</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-sm">Servidor</p>
                        <p className="font-semibold text-text-primary">{foundMatch.server}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-lg font-bold text-accent mb-2">
                      Aceitar em: {acceptTimer}s
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(acceptTimer / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 justify-center">
                    <Button
                      onClick={acceptMatch}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle size={20} />
                      <span>Aceitar</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={declineMatch}
                      className="flex items-center space-x-2"
                    >
                      <XCircle size={20} />
                      <span>Recusar</span>
                    </Button>
                  </div>
                </div>
              )}

              {matchmakingStatus === 'accepted' && (
                <div className="py-8">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader className="text-green-500 animate-spin" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-green-500 mb-4">Carregando Partida...</h2>
                  <p className="text-text-secondary">
                    Conectando ao servidor...
                  </p>
                </div>
              )}

              {matchmakingStatus === 'declined' && (
                <div className="py-8">
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="text-red-500" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-red-500 mb-4">Partida Cancelada</h2>
                  <p className="text-text-secondary">
                    Retornando ao menu principal...
                  </p>
                </div>
              )}
            </Card>

            {/* Queue Info */}
            {matchmakingStatus === 'searching' && (
              <Card>
                <h3 className="text-lg font-bold text-primary mb-4">Informações da Fila</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="text-text-secondary" size={16} />
                    <span className="text-text-secondary text-sm">Jogadores na fila:</span>
                    <span className="font-semibold text-text-primary">{Math.floor(Math.random() * 50) + 20}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-text-secondary" size={16} />
                    <span className="text-text-secondary text-sm">Tempo médio:</span>
                    <span className="font-semibold text-text-primary">{formatTime(estimatedTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="text-text-secondary" size={16} />
                    <span className="text-text-secondary text-sm">Seu ranking:</span>
                    <span className="font-semibold text-text-primary">#{userProfile?.ranking || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="text-text-secondary" size={16} />
                    <span className="text-text-secondary text-sm">Região:</span>
                    <span className="font-semibold text-text-primary">{queueSettings.region}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Player Stats */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Suas Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Ranking</span>
                  <span className="font-semibold text-text-primary">#{userProfile?.ranking || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Vitórias</span>
                  <span className="font-semibold text-green-500">{userProfile?.wins || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Derrotas</span>
                  <span className="font-semibold text-red-500">{userProfile?.losses || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">K/D Ratio</span>
                  <span className="font-semibold text-accent">{userProfile?.kd_ratio?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </Card>

            {/* Queue Settings */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary">Configurações</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings size={16} />
                </Button>
              </div>
              
              {showSettings && (
                <div className="space-y-4">
                  {/* Preferred Maps */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Mapas Preferidos
                    </label>
                    <div className="space-y-2">
                      {availableMaps.map(map => (
                        <label key={map.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={queueSettings.preferredMaps.includes(map.id)}
                            onChange={() => toggleMapPreference(map.id)}
                            className="rounded border-border-light text-primary focus:ring-primary"
                          />
                          <span className="text-text-primary text-sm">{map.name}</span>
                          {map.popular && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              Popular
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Max Ping */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Ping Máximo: {queueSettings.maxPing}ms
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={queueSettings.maxPing}
                      onChange={(e) => setQueueSettings(prev => ({ ...prev, maxPing: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Região
                    </label>
                    <select
                      value={queueSettings.region}
                      onChange={(e) => setQueueSettings(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-3 py-2 bg-surface border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Norte">Norte</option>
                      <option value="Nordeste">Nordeste</option>
                      <option value="Centro-Oeste">Centro-Oeste</option>
                      <option value="Sudeste">Sudeste</option>
                      <option value="Sul">Sul</option>
                    </select>
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/partidas')}
                >
                  Ver Histórico
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/ranking')}
                >
                  Ver Ranking
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/times')}
                >
                  Explorar Times
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}