import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
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
import './index.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <Navbar />}
      <Routes>
        {/* Página inicial pública - redireciona usuários logados para dashboard */}
        <Route path="/" element={!user ? <Home /> : <Navigate to="/dashboard" />} />
        
        {/* Rotas públicas */}
        <Route path="/sobre" element={<About />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/ranking" element={<Ranking />} />
        
        {/* Rota de callback de autenticação */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/times" element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        } />
        <Route path="/meu-time" element={
          <ProtectedRoute>
            <MyTeam />
          </ProtectedRoute>
        } />
        <Route path="/jogar" element={
          <ProtectedRoute>
            <Play />
          </ProtectedRoute>
        } />
        <Route path="/partidas" element={
          <ProtectedRoute>
            <Matches />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
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
