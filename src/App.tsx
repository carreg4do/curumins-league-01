import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Dashboard } from './pages/Dashboard'
import { Teams } from './pages/Teams'
import { MyTeam } from './pages/MyTeam'
import { Play } from './pages/Play'
import { Matches } from './pages/Matches'
import { Profile } from './pages/Profile'
import { Ranking } from './pages/Ranking'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AuthCallback } from './pages/AuthCallback'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import './index.css'

// Rotas organizadas por tipo de acesso
// publicRoutes: ['/login', '/register', '/auth/callback']
// protectedRoutes: ['/dashboard', '/profile', '/times', '/meu-time', '/jogar', '/partidas']

// Componente para proteger rotas que precisam de autenticação
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()
  
  // Se ainda está carregando, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary mt-4">Verificando autenticação...</p>
        </div>
      </div>
    )
  }
  
  // Se não há usuário após o carregamento, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Se há usuário, renderiza o componente
  return <>{children}</>
}

// Componente para rotas públicas que redirecionam usuários logados
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()
  
  // Se ainda está carregando, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary mt-4">Verificando autenticação...</p>
        </div>
      </div>
    )
  }
  
  // Se há usuário, redireciona para dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  // Se não há usuário, renderiza o componente
  return <>{children}</>
}

function AppContent() {
  const { user, loading } = useAuthContext()

  return (
    <div className="min-h-screen bg-background">
      {user && <Navbar />}
      <Routes>
        {/* Página inicial - sempre acessível */}
        <Route path="/" element={
          loading ? (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-text-secondary mt-4">Verificando autenticação...</p>
              </div>
            </div>
          ) : <Home />
        } />
        
        {/* Rotas públicas */}
        <Route path="/sobre" element={<About />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/ranking" element={<Ranking />} />
        
        {/* Rota de callback de autenticação */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/times" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
        <Route path="/meu-time" element={<ProtectedRoute><MyTeam /></ProtectedRoute>} />
        <Route path="/jogar" element={<ProtectedRoute><Play /></ProtectedRoute>} />
        <Route path="/partidas" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
