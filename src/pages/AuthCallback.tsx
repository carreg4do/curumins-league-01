import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function AuthCallback() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { fetchUserProfile } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Verificar se há parâmetros de autenticação na URL
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro na autenticação:', error)
          setError('Erro ao processar autenticação. Tente fazer login novamente.')
          setLoading(false)
          return
        }

        if (data.session?.user) {
          // Usuário autenticado com sucesso
          await fetchUserProfile(data.session.user.id)
          
          // Obtém o destino de redirecionamento ou usa dashboard como padrão
          const redirectTo = searchParams.get('redirect_to') || '/dashboard'
          navigate(redirectTo, { replace: true })
        } else {
          // Não há sessão ativa, redirecionar para login
          navigate('/login', { replace: true })
        }
      } catch (err) {
        console.error('Erro inesperado:', err)
        setError('Erro inesperado. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [navigate, fetchUserProfile, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Processando autenticação...</h1>
          <p className="text-gray-400">Aguarde enquanto validamos seu acesso.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Erro na autenticação</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    )
  }

  return null
}