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
      const { data: profile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) {
        setUserProfile(profile)
        return profile
      }

      if (fetchError && fetchError.code === 'PGRST116') {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
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
          setUserProfile(null)
          return null
        }

        setUserProfile(newProfile)
        return newProfile
      }

      setUserProfile(null)
      return null
    } catch (error) {
      setUserProfile(null)
      return null
    }
  }

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout
    
    const initializeAuth = async () => {
      try {
        timeoutId = setTimeout(() => {
          if (mounted) {
            setLoading(false)
          }
        }, 10000)
        
        // Limpar qualquer sessão antiga primeiro
        sessionStorage.clear()
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.includes('auth')
        )
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !mounted || !session) {
          if (mounted) {
            setUser(null)
            setUserProfile(null)
            setLoading(false)
          }
          return
        }
        
        // Verificar se a sessão é válida e não expirou
        const now = Math.floor(Date.now() / 1000)
        if (session.expires_at && session.expires_at < now) {
          if (mounted) {
            setUser(null)
            setUserProfile(null)
            setLoading(false)
          }
          return
        }
        
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          await fetchUserProfile(currentUser.id)
        } else {
          setUserProfile(null)
        }
        
        clearTimeout(timeoutId)
        
      } catch (error) {
        if (mounted) {
          setUser(null)
          setUserProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        try {
          const currentUser = session?.user ?? null
          setUser(currentUser)
          
          if (currentUser && event !== 'TOKEN_REFRESHED') {
            await fetchUserProfile(currentUser.id)
          } else if (!currentUser) {
            setUserProfile(null)
          }
        } catch (error) {
          if (mounted) {
            setUser(null)
            setUserProfile(null)
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