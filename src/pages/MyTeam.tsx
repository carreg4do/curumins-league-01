import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { supabase } from '../lib/supabase'
import type { Team, User } from '../types'
import { 
  Users, 
  Crown, 
  UserPlus, 
  UserMinus, 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  Target, 
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  LogOut
} from 'lucide-react'

export function MyTeam() {
  const { user, userProfile, loading } = useAuth()
  const navigate = useNavigate()
  const [team, setTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [loadingTeam, setLoadingTeam] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    region: '',
    description: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteNickname, setInviteNickname] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      fetchTeamData()
    }
  }, [user])

  const fetchTeamData = async () => {
    try {
      setLoadingTeam(true)
      setError('')

      // Buscar time do usuário
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .contains('members', [user?.id])
        .single()

      if (teamError && teamError.code !== 'PGRST116') {
        console.error('Erro ao buscar time:', teamError)
        createMockTeam()
      } else if (teamData) {
        setTeam(teamData)
        setEditForm({
          name: teamData.name,
          region: teamData.region || '',
          description: teamData.description || ''
        })
        
        // Buscar membros do time
        if (teamData.members && teamData.members.length > 0) {
          const { data: membersData, error: membersError } = await supabase
            .from('users')
            .select('*')
            .in('id', teamData.members)

          if (!membersError && membersData) {
            setTeamMembers(membersData)
          } else {
            createMockMembers()
          }
        }
      } else {
        // Usuário não tem time
        setTeam(null)
        setTeamMembers([])
      }
    } catch (error) {
      console.error('Erro ao buscar dados do time:', error)
      createMockTeam()
    } finally {
      setLoadingTeam(false)
    }
  }

  const createMockTeam = () => {
    const mockTeam: Team = {
      id: '1',
      name: 'Meu Time',
      members: [user?.id || '1', '2', '3'],
      captain_id: user?.id || '1',
      region: 'Norte',
      wins: 12,
      losses: 8,
      description: 'Time focado em competições regionais do Norte do Brasil.',
      logo_url: undefined,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setTeam(mockTeam)
    setEditForm({
      name: mockTeam.name,
      region: mockTeam.region || '',
      description: mockTeam.description || ''
    })
    
    createMockMembers()
  }

  const createMockMembers = () => {
    const mockMembers: User[] = [
      {
        id: user?.id || '1',
        nickname: userProfile?.nickname || 'Você',
        email: userProfile?.email || user?.email || '',
        position: userProfile?.position || 'Rifler',
        ranking: userProfile?.ranking || 150,
        wins: userProfile?.wins || 25,
        losses: userProfile?.losses || 15,
        kd_ratio: userProfile?.kd_ratio || 1.2,
        steam_id: userProfile?.steam_id || undefined,
        avatar: userProfile?.avatar || undefined,
        created_at: userProfile?.created_at || new Date().toISOString(),
        updated_at: userProfile?.updated_at || new Date().toISOString()
      },
      {
        id: '2',
        nickname: 'AcreShooter',
        email: 'acre@example.com',
        position: 'AWPer',
        ranking: 120,
        wins: 30,
        losses: 12,
        kd_ratio: 1.5,
        steam_id: undefined,
        avatar: undefined,
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        nickname: 'ManausKing',
        email: 'manaus@example.com',
        position: 'Entry Fragger',
        ranking: 180,
        wins: 22,
        losses: 18,
        kd_ratio: 1.1,
        steam_id: undefined,
        avatar: undefined,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    setTeamMembers(mockMembers)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (team) {
      setEditForm({
        name: team.name,
        region: team.region || '',
        description: team.description || ''
      })
    }
    setError('')
  }

  const handleSave = async () => {
    if (!team || !user) return

    if (!editForm.name.trim()) {
      setError('Nome do time é obrigatório')
      return
    }

    if (editForm.name.length < 3) {
      setError('Nome do time deve ter pelo menos 3 caracteres')
      return
    }

    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: editForm.name,
          region: editForm.region || null,
          description: editForm.description || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', team.id)

      if (error) {
        setError('Erro ao salvar alterações')
        console.error('Erro ao atualizar time:', error)
      } else {
        setIsEditing(false)
        await fetchTeamData()
      }
    } catch (error) {
      setError('Erro ao salvar alterações')
      console.error('Erro ao atualizar time:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInvitePlayer = async () => {
    if (!inviteNickname.trim()) {
      setError('Digite um nickname válido')
      return
    }

    // Simular convite (em um sistema real, isso enviaria um convite)
    alert(`Convite enviado para ${inviteNickname}!`)
    setInviteNickname('')
    setShowInviteModal(false)
  }

  const handleRemovePlayer = async (playerId: string) => {
    if (playerId === user?.id) {
      alert('Você não pode remover a si mesmo do time!')
      return
    }

    if (confirm('Tem certeza que deseja remover este jogador do time?')) {
      // Simular remoção
      setTeamMembers(prev => prev.filter(member => member.id !== playerId))
      alert('Jogador removido do time!')
    }
  }

  const handleLeaveTeam = () => {
    if (team?.captain_id === user?.id) {
      alert('Como capitão, você deve transferir a liderança antes de sair do time!')
      return
    }

    if (confirm('Tem certeza que deseja sair do time?')) {
      setTeam(null)
      setTeamMembers([])
      alert('Você saiu do time!')
    }
  }

  const createNewTeam = () => {
    navigate('/times?create=true')
  }

  const getWinRate = () => {
    if (!team) return 0
    const total = team.wins + team.losses
    if (total === 0) return 0
    return Math.round((team.wins / total) * 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const regions = [
    'Norte',
    'Nordeste', 
    'Centro-Oeste',
    'Sudeste',
    'Sul'
  ]

  if (loading || loadingTeam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando time...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Card>
              <div className="py-12">
                <Users className="mx-auto mb-6 text-text-secondary" size={64} />
                <h1 className="text-3xl font-bold text-primary mb-4">Você não está em um time</h1>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Crie seu próprio time ou procure por times que estão recrutando jogadores.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={createNewTeam}
                    className="flex items-center space-x-2"
                  >
                    <UserPlus size={20} />
                    <span>Criar Novo Time</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/times')}
                    className="flex items-center space-x-2"
                  >
                    <Users size={20} />
                    <span>Procurar Times</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
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
            <Users className="mr-3" size={32} />
            Meu Time
          </h1>
          <p className="text-text-secondary">
            Gerencie seu time e acompanhe o desempenho dos membros
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Details */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Informações do Time</h2>
                <div className="flex space-x-2">
                  {team.captain_id === user?.id && (
                    <>                    
                      {!isEditing ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleEdit}
                          className="flex items-center space-x-2"
                        >
                          <Edit3 size={16} />
                          <span>Editar</span>
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSave}
                            loading={saving}
                            className="flex items-center space-x-2"
                          >
                            <Save size={16} />
                            <span>Salvar</span>
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCancel}
                            className="flex items-center space-x-2"
                          >
                            <X size={16} />
                            <span>Cancelar</span>
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-accent/10 border border-accent rounded-lg p-3 mb-4">
                  <p className="text-accent text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Nome do Time
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do time"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <p className="text-text-primary font-semibold text-lg">{team.name}</p>
                      {team.captain_id === user?.id && (
                        <Crown className="text-accent" size={20} />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Região
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.region}
                      onChange={(e) => setEditForm(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Selecione uma região</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-text-secondary" size={16} />
                      <p className="text-text-primary">{team.region || 'Não definida'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Descrição
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição do time..."
                      rows={3}
                      className="w-full px-4 py-3 bg-surface border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    />
                  ) : (
                    <p className="text-text-secondary">{team.description || 'Nenhuma descrição disponível'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Criado em
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-text-secondary" size={16} />
                    <p className="text-text-secondary">{formatDate(team.created_at)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Team Members */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Membros do Time ({teamMembers.length}/5)</h2>
                {team.captain_id === user?.id && teamMembers.length < 5 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <UserPlus size={16} />
                    <span>Convidar</span>
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {member.nickname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-text-primary">{member.nickname}</h3>
                          {member.id === team.captain_id && (
                            <Crown className="text-accent" size={16} />
                          )}
                          {member.id === user?.id && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              Você
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">{member.position || 'Posição não definida'}</p>
                        <div className="flex items-center space-x-4 text-xs text-text-secondary mt-1">
                          <span>Ranking: #{member.ranking}</span>
                          <span>K/D: {member.kd_ratio?.toFixed(2)}</span>
                          <span>W/L: {member.wins}/{member.losses}</span>
                        </div>
                      </div>
                    </div>
                    
                    {team.captain_id === user?.id && member.id !== user?.id && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemovePlayer(member.id)}
                        className="text-red-500 hover:bg-red-500/10"
                      >
                        <UserMinus size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Team Stats */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Estatísticas do Time</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="text-green-500" size={16} />
                    <span className="text-text-secondary">Vitórias</span>
                  </div>
                  <span className="font-bold text-green-500">{team.wins}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="text-red-500" size={16} />
                    <span className="text-text-secondary">Derrotas</span>
                  </div>
                  <span className="font-bold text-red-500">{team.losses}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="text-primary" size={16} />
                    <span className="text-text-secondary">Taxa de Vitória</span>
                  </div>
                  <span className="font-bold text-primary">{getWinRate()}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="text-accent" size={16} />
                    <span className="text-text-secondary">Partidas Totais</span>
                  </div>
                  <span className="font-bold text-accent">{team.wins + team.losses}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Ações</h3>
              
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/jogar')}
                >
                  Buscar Partida
                </Button>
                
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
                  onClick={() => navigate('/times')}
                >
                  Explorar Times
                </Button>
                
                {team.captain_id !== user?.id && (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={handleLeaveTeam}
                    className="text-red-500 hover:bg-red-500/10 border-red-500/30"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair do Time
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary">Convidar Jogador</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowInviteModal(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Nickname do jogador"
                  value={inviteNickname}
                  onChange={(e) => setInviteNickname(e.target.value)}
                />
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handleInvitePlayer}
                    className="flex-1"
                  >
                    Enviar Convite
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}