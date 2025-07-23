export interface User {
  id: string
  nickname: string
  steam_id?: string
  avatar?: string
  position?: string
  ranking?: number
  email: string
  wins: number
  losses: number
  kd_ratio: number
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
  logo_url?: string
  captain_id: string
  region?: string
  wins: number
  losses: number
  description?: string
  members: string[]
  created_at: string
  updated_at: string
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
  team1_name: string
  team2_name: string
  team1_score: number
  team2_score: number
  status: 'pending' | 'ongoing' | 'finished' | 'cancelled' | 'completed' | 'scheduled'
  map: string
  winner_id?: string | null
  tournament_id?: string
  created_at: string
  started_at?: string
  finished_at?: string
  updated_at: string
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

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    nickname?: string
    avatar_url?: string
  }
}

export interface MatchmakingQueue {
  id: string
  user_id: string
  status: 'searching' | 'found' | 'cancelled'
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
