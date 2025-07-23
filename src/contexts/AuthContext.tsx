import { createContext, useContext, ReactNode } from 'react'

// Criamos um contexto vazio por enquanto, pois a lógica de autenticação
// está sendo gerenciada pelo hook useAuth
const AuthContext = createContext({})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}