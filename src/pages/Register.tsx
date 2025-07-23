import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Mail, User, Lock, ArrowLeft } from 'lucide-react'

export function Register() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp, user } = useAuth()
  const navigate = useNavigate()

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!nickname.trim()) {
      setError('Nome de usuário é obrigatório')
      setLoading(false)
      return
    }

    if (nickname.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres')
      setLoading(false)
      return
    }

    if (!email.trim()) {
      setError('Email é obrigatório')
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('Senha é obrigatória')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Senhas não coincidem')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, nickname)
    
    if (error) {
      setError('Erro ao criar conta. Tente novamente.')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-gray-400">Crie sua conta para acessar a plataforma</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Nome de usuário"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
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