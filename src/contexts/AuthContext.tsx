import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase, getSiteUrl } from '../lib/supabase'
import type { User } from '../types'

interface AuthContextType {
  user: any
  userProfile: User | null
  loading: boolean
  signUp: (email: string, password: string, nickname: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signInWithMagicLink: (email: string) => Promise<{ data: any; error: any }>
  signUpWithMagicLink: (email: string, nickname: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Buscando perfil para usuário:', userId)
      
      const { data: profile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) {
        console.log('✅ Perfil encontrado:', profile.nickname)
        setUserProfile(profile)
        return profile
      }

      if (fetchError && fetchError.code === 'PGRST116') {
        console.log('📝 Perfil não encontrado, criando novo...')
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log('❌ Usuário não encontrado para criar perfil')
          setUserProfile(null)
          return null
        }

        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            nickname: user.user_metadata?.nickname || 'Jogador',
            email: user.email,
            wins: 0,
            losses: 0,
            kd_ratio: 0.0,
            ranking: 1000,
            kills: 0,
            deaths: 0,
            assists: 0,
            headshots: 0
          })
          .select()
          .single()

        if (createError) {
          console.error('❌ Erro ao criar perfil:', createError)
          setUserProfile(null)
          return null
        }

        console.log('✅ Novo perfil criado:', newProfile.nickname)
        setUserProfile(newProfile)
        return newProfile
      }

      console.error('❌ Erro ao buscar perfil:', fetchError)
      setUserProfile(null)
      return null
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar perfil:', error)
      setUserProfile(null)
      return null
    }
  }

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 Iniciando verificação de autenticação...')
        
        // Timeout de segurança para evitar loading infinito
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Timeout atingido - finalizando loading')
            setLoading(false)
          }
        }, 3000) // Reduzido para 3 segundos
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('📋 Sessão obtida:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          error: error?.message 
        })
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error)
          if (mounted) {
            setUser(null)
            setUserProfile(null)
            clearTimeout(timeoutId)
            setLoading(false)
          }
          return
        }
        
        if (!session) {
          console.log('🚫 Nenhuma sessão encontrada')
          if (mounted) {
            setUser(null)
            setUserProfile(null)
            clearTimeout(timeoutId)
            setLoading(false)
          }
          return
        }
        
        // Verificar se a sessão é válida e não expirou
        const now = Math.floor(Date.now() / 1000)
        if (session.expires_at && session.expires_at < now) {
          console.log('⏰ Sessão expirada')
          if (mounted) {
            setUser(null)
            setUserProfile(null)
            clearTimeout(timeoutId)
            setLoading(false)
          }
          return
        }
        
        const currentUser = session?.user ?? null
        console.log('👤 Usuário encontrado:', { id: currentUser?.id, email: currentUser?.email })
        setUser(currentUser)
        
        if (currentUser) {
          console.log('🔍 Buscando perfil do usuário...')
          await fetchUserProfile(currentUser.id)
          console.log('✅ Perfil carregado')
        } else {
          setUserProfile(null)
        }
        
        clearTimeout(timeoutId)
        if (mounted) {
          console.log('✅ Autenticação inicializada com sucesso')
          setLoading(false)
        }
        
      } catch (error) {
        console.error('❌ Erro na inicialização da autenticação:', error)
        if (mounted) {
          setUser(null)
          setUserProfile(null)
          clearTimeout(timeoutId)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('🔄 Mudança de estado de autenticação:', { event, hasSession: !!session })
        
        try {
          const currentUser = session?.user ?? null
          setUser(currentUser)
          
          if (currentUser && event !== 'TOKEN_REFRESHED') {
            console.log('👤 Carregando perfil após mudança de estado...')
            await fetchUserProfile(currentUser.id)
          } else if (!currentUser) {
            console.log('🚫 Usuário deslogado - limpando perfil')
            setUserProfile(null)
          }
          
          // Garantir que o loading seja sempre finalizado
          if (mounted) {
            console.log('✅ Loading finalizado após mudança de estado')
            setLoading(false)
          }
        } catch (error) {
          console.error('❌ Erro na mudança de estado:', error)
          if (mounted) {
            setUser(null)
            setUserProfile(null)
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, nickname: string) => {
    try {
      const siteUrl = getSiteUrl()
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?redirect_to=/dashboard`,
          data: {
            nickname
          }
        }
      })

      if (error) throw error

      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            nickname,
            email,
            wins: 0,
            losses: 0,
            kd_ratio: 0.0,
            ranking: 1000,
            kills: 0,
            deaths: 0,
            assists: 0,
            headshots: 0
          })

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError)
        }
      }

      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signInWithMagicLink = async (email: string) => {
    try {
      const siteUrl = getSiteUrl()
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?redirect_to=/dashboard`
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signUpWithMagicLink = async (email: string, nickname: string) => {
    try {
      const siteUrl = getSiteUrl()
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?redirect_to=/dashboard`,
          data: {
            nickname
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Limpar estados locais
      setUser(null)
      setUserProfile(null)
      
      // Limpar sessionStorage completamente
      sessionStorage.clear()
      
      // Limpar qualquer token restante no localStorage também
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('auth')
      )
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      return { error: null }
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error)
      
      // Mesmo com erro, limpar estados e storage
      setUser(null)
      setUserProfile(null)
      sessionStorage.clear()
      
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('auth')
      )
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      return { error }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithMagicLink,
    signUpWithMagicLink,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}