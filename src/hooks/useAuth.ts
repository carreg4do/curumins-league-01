import { useState, useEffect, useCallback } from 'react'
import { supabase, getSiteUrl } from '../lib/supabase'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Se o perfil não existe, criar um novo
        if (error.code === 'PGRST116') {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
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
              console.error('Erro ao criar perfil:', createError)
              // Se falhar ao criar, usar perfil padrão para não travar a aplicação
              setUserProfile({
                id: user.id,
                nickname: user.user_metadata?.nickname || 'Jogador',
                email: user.email || '',
                wins: 0,
                losses: 0,
                kd_ratio: 0.0,
                ranking: 1000,
                kills: 0,
                deaths: 0,
                assists: 0,
                headshots: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              return
            }

            setUserProfile(newProfile)
          }
        } else {
          console.error('Erro ao buscar perfil do usuário:', error)
          // Criar perfil padrão em caso de erro
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            setUserProfile({
              id: user.id,
              nickname: user.user_metadata?.nickname || 'Jogador',
              email: user.email || '',
              wins: 0,
              losses: 0,
              kd_ratio: 0.0,
              ranking: 1000,
              kills: 0,
              deaths: 0,
              assists: 0,
              headshots: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          }
        }
        return
      }

      if (data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      // Em caso de erro, não deixar a aplicação travada
      setUserProfile(null)
    }
  }, [])

  useEffect(() => {
    // Verificar se há um usuário logado
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchUserProfile])

  const signUp = async (email: string, password: string, nickname: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname
          }
        }
      })

      if (error) throw error

      // Criar perfil do usuário na tabela users
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
      // Usar scope local para evitar erro ERR_ABORTED
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
      
      // Limpar estado local
      setUser(null)
      setUserProfile(null)
      
      return { error: null }
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error)
      // Mesmo com erro, limpar estado local para garantir logout
      setUser(null)
      setUserProfile(null)
      return { error }
    }
  }

  return {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithMagicLink,
    signUpWithMagicLink,
    signOut,
    fetchUserProfile
  }
}