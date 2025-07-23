import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Mail, ArrowLeft, Check } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signInWithMagicLink, user } = useAuth()
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
    setSuccess(false)

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

    const { error } = await signInWithMagicLink(email)
    
    if (error) {
      setError('Erro ao enviar link de acesso. Tente novamente.')
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  if (success) {
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
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  LINK ENVIADO!
                </h2>
                <p className="text-text-secondary mb-4">
                  Enviamos um link de acesso para <strong className="text-primary">{email}</strong>.
                  Clique no link do email para acessar sua conta.
                </p>
                <p className="text-sm text-text-secondary">
                  Não recebeu o email? Verifique sua caixa de spam ou tente novamente.
                </p>
              </div>
              <Button
                onClick={() => {
                  setSuccess(false)
                  setEmail('')
                }}
                variant="secondary"
                fullWidth
              >
                Enviar novamente
              </Button>
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
            Acesse sua conta com magic link
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
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              {loading ? 'ENVIANDO LINK...' : 'ENVIAR LINK DE ACESSO'}
            </Button>

            <div className="text-center">
              <p className="text-text-secondary text-sm mb-4">
                Você receberá um email com um link seguro para acessar sua conta.
              </p>
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