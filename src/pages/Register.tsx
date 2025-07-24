import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
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
  
  const { signUp, user } = useAuthContext()
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





  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao início</span>
          </Link>
        </div>

        <Card>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              CRIAR CONTA
            </h1>
            <p className="text-text-secondary">
              Crie sua conta para acessar a plataforma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Nome de usuário"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="pl-12"
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
              </div>
              
              <div className="relative">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
              </div>
              
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-12"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
              </div>
              
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-12"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-text-secondary text-sm">
              Você receberá um email com um link seguro para ativar sua conta.
            </p>
            
            <div className="flex items-center justify-center space-x-1 text-sm">
              <span className="text-text-secondary">Já tem uma conta?</span>
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Entrar
              </Link>
            </div>
          </div>
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