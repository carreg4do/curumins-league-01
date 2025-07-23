import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { supabase } from '../lib/supabase'
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  Target, 
  TrendingUp,
  Star,
  Calendar,
  Mail,
  Shield
} from 'lucide-react'

export function Profile() {
  const { user, userProfile, loading, fetchUserProfile } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    nickname: '',
    position: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false) // Prevenir múltiplas operações



  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        nickname: userProfile.nickname || '',
        position: userProfile.position || ''
      })
      setAvatarUrl(userProfile.avatar || '')
    }
  }, [userProfile])

  // Limpar estado quando há erro para evitar loops
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000) // Limpar erro após 5 segundos
      
      return () => clearTimeout(timer)
    }
  }, [error])
  
  // Função para resetar estado em caso de erro crítico
  const resetState = () => {
    setError('')
    setUploadingAvatar(false)
    setIsProcessing(false)
    setShowAvatarModal(false)
    // Limpar cache do localStorage se necessário
    try {
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
    } catch (e) {
      console.log('Erro ao limpar cache:', e)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      nickname: userProfile?.nickname || '',
      position: userProfile?.position || ''
    })
    setError('')
  }

  const handleSave = async () => {
    if (!user || !userProfile) return

    if (!editForm.nickname.trim()) {
      setError('Nickname é obrigatório')
      return
    }

    if (editForm.nickname.length < 3) {
      setError('Nickname deve ter pelo menos 3 caracteres')
      return
    }

    if (editForm.nickname.length > 20) {
      setError('Nickname deve ter no máximo 20 caracteres')
      return
    }

    setSaving(true)
    setError('')

    try {
      // Verificar se o nickname já existe (apenas se foi alterado)
      if (editForm.nickname.trim() !== userProfile.nickname) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('nickname', editForm.nickname.trim())
          .neq('id', user.id)
          .single()

        if (existingUser) {
          setError('Este nickname já está em uso')
          setSaving(false)
          return
        }
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          nickname: editForm.nickname.trim(),
          position: editForm.position || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar perfil:', error)
        if (error?.code === '23505') {
          setError('Este nickname já está em uso')
        } else {
          setError('Erro ao salvar alterações. Tente novamente.')
        }
        return
      }

      if (data) {
        // Atualizar o estado local imediatamente
        setIsEditing(false)
        // Recarregar o perfil do usuário
        await fetchUserProfile(user.id)
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error || 'Erro desconhecido')
      setError('Erro ao salvar alterações. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  // Função para redimensionar e comprimir imagem
  const compressImage = (file: File, maxWidth: number = 300, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height
            height = maxWidth
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Converter para base64 com compressão
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedBase64)
      }
      
      img.onerror = () => reject(new Error('Erro ao processar imagem'))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleAvatarUpload = async (file: File) => {
    if (!user || isProcessing) return
    
    setIsProcessing(true)

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Reduzir limite para 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    setUploadingAvatar(true)
    setError('')

    // Timeout global de 45 segundos (mais tempo para navegadores como Chrome)
    const timeoutId = setTimeout(() => {
      setError('Operação demorou muito. Verifique sua conexão e tente novamente.')
      setUploadingAvatar(false)
      setIsProcessing(false)
    }, 45000)

    try {
      // Comprimir imagem antes de enviar
      console.log('Comprimindo imagem...')
      const compressedBase64 = await compressImage(file, 300, 0.8)
      
      console.log('Tentando atualizar avatar para usuário:', user.id)
      console.log('Tamanho original:', file.size, 'bytes')
      console.log('Tamanho comprimido:', compressedBase64.length, 'caracteres')
      
      // Verificar se a imagem comprimida não é muito grande (máximo 500KB em base64)
      if (compressedBase64.length > 500000) {
        throw new Error('Imagem muito grande mesmo após compressão')
      }
      
      // Upload com retry em caso de falha de rede
      let data, updateError
      for (let attempt = 1; attempt <= 3; attempt++) {
        const result = await supabase
          .from('users')
          .update({ 
            avatar: compressedBase64,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single()
        
        data = result.data
        updateError = result.error
        
        if (!updateError) break
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
      
      console.log('Resultado da atualização:', { data, error: updateError })

      if (updateError) {
        console.error('Erro do Supabase:', updateError)
        throw new Error(`Erro após 3 tentativas: ${updateError.message}`)
      }

      if (data) {
        // Limpar timeout se chegou até aqui
        clearTimeout(timeoutId)
        
        setAvatarUrl(compressedBase64)
        setShowAvatarModal(false)
        // Aguardar um pouco antes de recarregar o perfil
        setTimeout(async () => {
          await fetchUserProfile(user.id)
        }, 500)
      }
    } catch (error: any) {
      clearTimeout(timeoutId)
      console.error('Erro ao fazer upload do avatar:', error)
      
      // Limpar estado para evitar loops
      setAvatarUrl('')
      
      if (error?.message?.includes('muito grande')) {
        setError('Imagem muito grande. Tente uma imagem menor ou com menor resolução.')
      } else if (error?.message?.includes('processar imagem')) {
        setError('Erro ao processar a imagem. Verifique se o arquivo não está corrompido.')
      } else if (error?.code === '23505') {
        setError('Erro de duplicação no banco de dados. Tente novamente.')
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.')
      } else if (error?.message?.includes('tentativas')) {
        setError('Erro crítico de rede após múltiplas tentativas. Verifique sua conexão.')
      } else {
        setError('Erro ao salvar avatar. Tente uma imagem menor.')
      }
    } finally {
      clearTimeout(timeoutId)
      setUploadingAvatar(false)
      setIsProcessing(false)
    }
  }

  const handleAvatarUrlSubmit = async (url: string) => {
    if (!user || isProcessing) return
    
    setIsProcessing(true)

    if (!url.trim()) {
      setError('Não foi possível localizar link de imagem. Por favor, insira uma URL válida.')
      setIsProcessing(false)
      return
    }

    // Validar se é uma URL válida
    let processedUrl = url.trim()
    try {
      const urlObj = new URL(processedUrl)
      // Verificar se é uma URL de imagem válida
      if (!urlObj.protocol.startsWith('http')) {
        setError('A URL deve começar com http:// ou https://')
        setIsProcessing(false)
        return
      }

      // Converter URLs do Imgur para formato direto
      if (urlObj.hostname && urlObj.hostname.includes('imgur.com')) {
        // Converter https://imgur.com/D78aD3B para https://i.imgur.com/D78aD3B.jpg
        const imgurMatch = processedUrl.match(/imgur\.com\/([a-zA-Z0-9]+)$/)
        if (imgurMatch) {
          processedUrl = `https://i.imgur.com/${imgurMatch[1]}.jpg`
        }
        // Se já estiver no formato i.imgur.com mas sem extensão, adicionar .jpg
        else if (urlObj.hostname === 'i.imgur.com' && urlObj.pathname && !urlObj.pathname.includes('.')) {
          processedUrl = processedUrl + '.jpg'
        }
      }
    } catch {
      setError('Por favor, insira uma URL válida')
      setIsProcessing(false)
      return
    }

    setUploadingAvatar(true)
    setError('')

    // Timeout global de 30 segundos (melhor compatibilidade com Chrome)
    const timeoutId = setTimeout(() => {
      setError('Operação demorou muito. Verifique sua conexão e tente novamente.')
      setUploadingAvatar(false)
      setIsProcessing(false)
    }, 30000)

    try {
      // Testar se a imagem carrega com retry
      console.log('Testando carregamento da imagem:', processedUrl)
      let imageLoaded = false
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          await new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous' // Para evitar problemas de CORS
            img.onload = () => {
              console.log('Imagem carregada com sucesso')
              imageLoaded = true
              resolve(true)
            }
            img.onerror = () => {
              console.log('Erro ao carregar imagem')
              reject(new Error('Não foi possível carregar a imagem'))
            }
            img.src = processedUrl
            // Timeout de 10 segundos para carregamento da imagem (melhor para Chrome)
            setTimeout(() => {
              console.log('Timeout ao carregar imagem')
              reject(new Error('Timeout ao carregar a imagem'))
            }, 10000)
          })
          break
        } catch (error) {
          if (attempt === 2) throw error
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      if (!imageLoaded) {
        throw new Error('Falha ao validar a imagem após múltiplas tentativas')
      }

      console.log('Tentando atualizar avatar URL para usuário:', user.id)
      console.log('URL processada:', processedUrl)
      
      // Atualizar perfil com retry
      let data, updateError
      for (let attempt = 1; attempt <= 3; attempt++) {
        const result = await supabase
          .from('users')
          .update({ 
            avatar: processedUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single()
        
        data = result.data
        updateError = result.error
        
        if (!updateError) break
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
      
      console.log('Resultado da atualização URL:', { data, error: updateError })

      if (updateError) {
        console.error('Erro do Supabase:', updateError)
        throw new Error(`Erro após 3 tentativas: ${updateError.message}`)
      }

      if (data) {
        // Limpar timeout se chegou até aqui
        clearTimeout(timeoutId)
        
        setAvatarUrl(processedUrl)
        setShowAvatarModal(false)
        // Aguardar um pouco antes de recarregar o perfil
        setTimeout(async () => {
          await fetchUserProfile(user.id)
        }, 500)
      }
    } catch (error: any) {
      clearTimeout(timeoutId)
      console.error('Erro ao atualizar avatar:', error)
      
      // Limpar estado para evitar loops
      setAvatarUrl('')
      
      if (error?.message?.includes('carregar a imagem') || error?.message?.includes('Timeout')) {
        setError('Não foi possível carregar a imagem. Verifique se a URL está correta e acessível.')
      } else if (error?.code === '23505') {
        setError('Erro de duplicação no banco de dados. Tente novamente.')
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.')
      } else if (error?.message?.includes('tentativas')) {
        setError('Erro crítico após múltiplas tentativas. Verifique sua conexão.')
      } else {
        setError('Erro ao atualizar avatar. Tente novamente.')
      }
    } finally {
      clearTimeout(timeoutId)
      setUploadingAvatar(false)
      setIsProcessing(false)
    }
  }

  const getWinRate = () => {
    if (!userProfile) return 0
    const total = userProfile.wins + userProfile.losses
    if (total === 0) return 0
    return Math.round((userProfile.wins / total) * 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const positions = [
    'Rifler',
    'AWPer',
    'Entry Fragger',
    'Support',
    'IGL'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!userProfile && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <User className="mx-auto mb-4 text-text-secondary" size={48} />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Perfil não encontrado
            </h3>
            <p className="text-text-secondary mb-6">
              Não foi possível carregar as informações do seu perfil. Tente fazer login novamente.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/dashboard')}>
                Voltar ao Dashboard
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  // Tentar recarregar o perfil
                  if (user) {
                    fetchUserProfile(user.id)
                  }
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <User className="mr-3" size={32} />
            Meu Perfil
          </h1>
          <p className="text-text-secondary">
            Gerencie suas informações e acompanhe suas estatísticas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Informações Básicas</h2>
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
                  <div className="flex space-x-2">
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
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-accent/10 border border-accent rounded-lg p-3 mb-4">
                  <p className="text-accent text-sm mb-2">{error}</p>
                  {(error.includes('loop') || error.includes('trava') || error.includes('crítico')) && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={resetState}
                      className="mt-2"
                    >
                      Resetar Estado
                    </Button>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Nickname
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editForm.nickname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                      placeholder="Seu nickname"
                    />
                  ) : (
                    <p className="text-text-primary font-semibold">{userProfile?.nickname}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Posição
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.position}
                      onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Selecione uma posição</option>
                      {positions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-text-primary">{userProfile?.position || 'Não definida'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-text-secondary" />
                    <p className="text-text-secondary">{userProfile?.email || user?.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Membro desde
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-text-secondary" />
                    <p className="text-text-secondary">{userProfile?.created_at ? formatDate(userProfile.created_at) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Security */}
            <Card>
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center">
                <Shield className="mr-2" size={24} />
                Segurança da Conta
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                  <div>
                    <h3 className="font-semibold text-text-primary">Senha</h3>
                    <p className="text-sm text-text-secondary">Última alteração há mais de 30 dias</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      // TODO: Implementar alteração de senha
                      alert('Funcionalidade de alteração de senha será implementada em breve!')
                    }}
                  >
                    Alterar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                  <div>
                    <h3 className="font-semibold text-text-primary">Steam Account</h3>
                    <p className="text-sm text-text-secondary">
                      {userProfile?.steam_id ? 'Conectado' : 'Não conectado'}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      // TODO: Implementar conexão com Steam
                      alert('Funcionalidade de conexão com Steam será implementada em breve!')
                    }}
                  >
                    {userProfile?.steam_id ? 'Desconectar' : 'Conectar'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Profile Avatar */}
            <Card className="text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para avatar padrão em caso de erro
                        e.currentTarget.style.display = 'none'
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                        if (nextElement) nextElement.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-black font-bold text-3xl">
                      {userProfile?.nickname?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAvatarModal(true)}
                  className="mb-4"
                >
                  <Edit3 size={14} className="mr-1" />
                  Alterar Foto
                </Button>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-1">{userProfile?.nickname}</h3>
              <p className="text-text-secondary mb-4">{userProfile?.position || 'Jogador'}</p>
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Trophy size={16} />
                <span className="font-semibold">Ranking #{userProfile?.ranking || 'N/A'}</span>
              </div>
            </Card>

            {/* Stats */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Estatísticas</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="text-green-500" size={16} />
                    <span className="text-text-secondary">Vitórias</span>
                  </div>
                  <span className="font-bold text-green-500">{userProfile?.wins || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="text-red-500" size={16} />
                    <span className="text-text-secondary">Derrotas</span>
                  </div>
                  <span className="font-bold text-red-500">{userProfile?.losses || 0}</span>
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
                    <span className="text-text-secondary">K/D Ratio</span>
                  </div>
                  <span className="font-bold text-accent">{userProfile?.kd_ratio?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-bold text-primary mb-4">Ações Rápidas</h3>
              
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
                  onClick={() => navigate('/times')}
                >
                  Ver Times
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/ranking')}
                >
                  Ver Ranking
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary">Alterar Foto de Perfil</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowAvatarModal(false)
                  setError('')
                }}
              >
                <X size={16} />
              </Button>
            </div>

            {error && (
              <div className="bg-accent/10 border border-accent rounded-lg p-3 mb-4">
                <p className="text-accent text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
               {/* Upload por URL - Método principal */}
               <div>
                 <label className="block text-sm font-medium text-text-primary mb-2">
                   URL da imagem (Recomendado)
                 </label>
                 <div className="flex space-x-2">
                   <Input
                     type="url"
                     placeholder="https://i.imgur.com/exemplo.jpg"
                     onKeyPress={(e) => {
                       if (e.key === 'Enter') {
                         const target = e.target as HTMLInputElement
                         handleAvatarUrlSubmit(target.value)
                       }
                     }}
                     disabled={uploadingAvatar}
                   />
                   <Button
                     variant="primary"
                     size="sm"
                     onClick={(e) => {
                       if (uploadingAvatar || isProcessing) return
                       const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement
                       if (input) {
                         const url = input.value.trim()
                         if (!url) {
                           setError('Não foi possível localizar link de imagem. Por favor, insira uma URL válida.')
                           return
                         }
                         handleAvatarUrlSubmit(url)
                       }
                     }}
                     disabled={uploadingAvatar || isProcessing}
                   >
                     {uploadingAvatar || isProcessing ? (
                       <div className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                         Salvando...
                       </div>
                     ) : (
                       'Salvar'
                     )}
                   </Button>
                 </div>
                 <div className="text-xs text-text-secondary mt-2 space-y-1">
                   <p>• Cole o link da imagem (será convertido automaticamente)</p>
                   <p>• Serviços recomendados: <strong>Imgur</strong>, Discord, GitHub</p>
                   <p>• Para Imgur: cole qualquer link (ex: imgur.com/D78aD3B ou i.imgur.com/D78aD3B.jpg)</p>
                   <p>• Máximo 10MB, formatos: JPG, PNG, GIF, WebP</p>
                 </div>
               </div>

               <div className="flex items-center space-x-4">
                 <div className="flex-1 h-px bg-border"></div>
                 <span className="text-text-secondary text-sm">ou</span>
                 <div className="flex-1 h-px bg-border"></div>
               </div>

               {/* Upload por arquivo - Método alternativo */}
               <div>
                 <label className="block text-sm font-medium text-text-primary mb-2">
                   Arquivo do computador
                 </label>
                 <div className="space-y-2">
                   <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => {
                       const file = e.target.files?.[0]
                       if (file && !uploadingAvatar && !isProcessing) {
                         handleAvatarUpload(file)
                       }
                     }}
                     className="w-full px-3 py-2 bg-surface border border-border-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                     disabled={uploadingAvatar || isProcessing}
                   />
                   <Button
                     onClick={() => {
                       if (uploadingAvatar || isProcessing) return
                       const input = document.createElement('input')
                       input.type = 'file'
                       input.accept = 'image/*'
                       input.onchange = (e) => {
                         const file = (e.target as HTMLInputElement).files?.[0]
                         if (file) handleAvatarUpload(file)
                       }
                       input.click()
                     }}
                     disabled={uploadingAvatar || isProcessing}
                     className="w-full"
                   >
                     {uploadingAvatar || isProcessing ? (
                       <div className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                         Processando...
                       </div>
                     ) : (
                       'Escolher Arquivo'
                     )}
                   </Button>
                 </div>
                 <p className="text-xs text-text-secondary mt-1">
                   Máximo 5MB. A imagem será comprimida e salva automaticamente.
                 </p>
               </div>

              {uploadingAvatar && (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-text-secondary">Processando imagem...</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}