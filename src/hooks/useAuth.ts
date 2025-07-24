import { useState, useEffect, useCallback } from 'react'
import { supabase, getSiteUrl } from '../lib/supabase'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      // 1. Tenta buscar o perfil do usuário
      const { data: profile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      // 2. Se o perfil existir, atualiza o estado e encerra
      if (profile) {
        setUserProfile(profile)
        return profile
      }

      // 3. Se o perfil não for encontrado (PGRST116), tenta criar um novo
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
          console.error('Erro ao criar perfil de usuário:', createError)
          setUserProfile(null)
          return null
        }

        setUserProfile(newProfile)
        return newProfile
      }

      // 4. Se ocorrer qualquer outro erro na busca, loga e define o perfil como nulo
      if (fetchError) {
        console.error('Erro ao buscar perfil do usuário:', fetchError)
      }

      setUserProfile(null)
      return null
    } catch (error) {
      console.error('Erro inesperado em fetchUserProfile:', error)
      setUserProfile(null)
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true
    
    const getSession = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Erro ao obter sessão:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (!mounted) return
        
        try {
          setLoading(true)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
            setUserProfile(null)
          }
        } catch (error) {
          console.error('Erro no auth state change:', error)
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
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
      const { error } = await supabase.auth.signOut()
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
    signOut
  }
}