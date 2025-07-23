import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, user } = useAuth()
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

    const { error } = await signIn(email, password)
    
    if (error) {
      setError('Email ou senha incorretos')
    } else {
      navigate('/dashboard')
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

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
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
            Entre na sua conta para acessar a plataforma
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-primary">
                FAZER LOGIN
              </h2>
            </div>

            {error && (
              <div className="bg-accent/10 border border-accent rounded-lg p-3">
                <p className="text-accent text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-4">
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              ENTRAR
            </Button>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface-light text-text-secondary">
                    ou
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => {
                  // TODO: Implementar login via Steam
                  alert('Login via Steam será implementado em breve!')
                }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>🎮</span>
                  <span>Entrar com Steam</span>
                </div>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-text-secondary">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Criar conta
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