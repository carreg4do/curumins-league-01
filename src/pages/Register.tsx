import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Mail, User, ArrowLeft, Check } from 'lucide-react'

export function Register() {
  const [formData, setFormData] = useState({
    nickname: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  
  const { signUpWithMagicLink, user } = useAuth()
  const navigate = useNavigate()

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname é obrigatório'
    } else if (formData.nickname.length < 3) {
      newErrors.nickname = 'Nickname deve ter pelo menos 3 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    const { error } = await signUpWithMagicLink(formData.email, formData.nickname)
    
    if (error) {
      if (error.message.includes('already registered')) {
        setErrors({ email: 'Este email já está cadastrado' })
      } else {
        setErrors({ general: 'Erro ao enviar link de cadastro. Tente novamente.' })
      }
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
          </div>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Conta criada!</h1>
            <p className="text-gray-400 mb-6">
              Enviamos um link de ativação para <strong className="text-white">{formData.email}</strong>.
              Clique no link do email para ativar sua conta e fazer login.
            </p>
            <p className="text-sm text-gray-500">
              Não recebeu o email? Verifique sua caixa de spam ou tente novamente.
            </p>
            <Button
              onClick={() => {
                setSuccess(false)
                setFormData({ nickname: '', email: '' })
              }}
              variant="outline"
              className="mt-4"
            >
              Enviar novamente
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-gray-400">Junte-se à Curumins League com magic link</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Seu nickname"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
              {errors.nickname && (
                <p className="text-red-400 text-sm mt-1">{errors.nickname}</p>
              )}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {errors.general && (
              <div className="text-red-400 text-sm text-center">
                {errors.general}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Enviando link...' : 'Criar conta com magic link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Você receberá um email com um link seguro para ativar sua conta.
            </p>
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300">
                Entrar
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}