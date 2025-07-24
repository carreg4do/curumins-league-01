import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hwgoiwobkmcwdvyeefoj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z29pd29ia21jd2R2eWVlZm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjM2ODgsImV4cCI6MjA2ODU5OTY4OH0.HHSr8AXTHcUvwARM_69kgyMr9hnWyKkUTXM6WJITQB0'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Configurações do Supabase não encontradas. Verifique as variáveis de ambiente.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true, // Habilita persistência para manter login após reload
    detectSessionInUrl: true,
    // Configuração para evitar erro de logout global
    flowType: 'pkce',
    storage: window.localStorage, // Usa localStorage para persistir entre sessões
    storageKey: 'supabase.auth.token'
  },
  global: {
    headers: {
      'X-Client-Info': 'curumins-league@1.0.0'
    }
  }
})

// Função para obter a URL base correta baseada no ambiente
export function getSiteUrl(): string {
  const isProduction = import.meta.env.VITE_APP_ENV === 'production'
  return isProduction 
    ? import.meta.env.VITE_SITE_URL_PROD || 'https://www.curuminsleague.com'
    : import.meta.env.VITE_SITE_URL_DEV || 'http://localhost:5173'
}

// Tipos para as tabelas do banco
export interface User {
  id: string
  nickname: string
  steam_id?: string
  avatar?: string
  position?: string
  ranking?: number
  email?: string
  wins?: number
  losses?: number
  kills?: number
  deaths?: number
  assists?: number
  headshots?: number
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  logo?: string
  captain_id?: string
  region?: string
  wins: number
  losses: number
  created_at: string
  updated_at: string
  members?: TeamMember[]
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'captain' | 'member'
  joined_at: string
  user?: User
}

export interface Match {
  id: string
  team1_id: string
  team2_id: string
  team1_score: number
  team2_score: number
  status: 'pending' | 'ongoing' | 'finished' | 'cancelled'
  map: string
  tournament_id?: string
  created_at: string
  started_at?: string
  finished_at?: string
  team1?: Team
  team2?: Team
}

export interface MatchStats {
  id: string
  match_id: string
  user_id: string
  team_id: string
  kills: number
  deaths: number
  assists: number
  headshots: number
  damage: number
  mvp: boolean
  created_at: string
}

export interface Tournament {
  id: string
  name: string
  description?: string
  prize_pool?: number
  max_teams: number
  status: 'upcoming' | 'ongoing' | 'finished'
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface TournamentRegistration {
  id: string
  tournament_id: string
  team_id: string
  registered_at: string
  team?: Team
}