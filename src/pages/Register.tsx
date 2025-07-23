import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export function Register() {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { signUp, user } = useAuth()
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

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)

    const { error } = await signUp(formData.email, formData.password, formData.nickname)
    
    if (error) {
      if (error.message.includes('already registered')) {
        setErrors({ email: 'Este email já está cadastrado' })
      } else {
        setErrors({ general: 'Erro ao criar conta. Tente novamente.' })
      }
    } else {
      // Sucesso - redirecionar para dashboard
      navigate('/dashboard')
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <img 
              src="/curumins-logo.svg" 
              alt="Curumins League Logo" 
              className="w-12 h-12"
            />
            <span className="text-2xl font-bold text-primary tracking-wider">
              CURUMINS LEAGUE
            </span>
          </div>
          <p className="text-text-secondary">
            Crie sua conta e entre na competição
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-primary">
                CRIAR CONTA
              </h2>
            </div>

            {errors.general && (
              <div className="bg-accent/10 border border-accent rounded-lg p-3">
                <p className="text-accent text-sm text-center">{errors.general}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Seu nickname"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  error={errors.nickname}
                  className="pl-12"
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
              </div>

              <div className="relative">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  className="pl-12"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  className="pl-12 pr-12"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  className="pl-12 pr-12"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              CRIAR CONTA
            </Button>

            <div className="text-center">
              <p className="text-text-secondary">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <div className="text-center mt-8">
          <p className="text-text-secondary text-sm">
            © 2025 Curumins League. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}