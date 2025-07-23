import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
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
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/times" element={user ? <Teams /> : <Navigate to="/login" />} />
        <Route path="/meu-time" element={user ? <MyTeam /> : <Navigate to="/login" />} />
        <Route path="/jogar" element={user ? <Play /> : <Navigate to="/login" />} />
        <Route path="/partidas" element={user ? <Matches /> : <Navigate to="/login" />} />
        <Route path="/perfil" element={user ? <Profile /> : <Navigate to="/login" />} />
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
