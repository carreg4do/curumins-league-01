import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from './Button'
import { Menu, X, User, LogOut, Trophy, Users, Gamepad2 } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, userProfile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Erro ao fazer logout:', error)
        // Mesmo com erro, redirecionar para home (logout local foi feito)
      }
      navigate('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Garantir redirecionamento mesmo com erro
      navigate('/')
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Gamepad2 },
    { name: 'Times', path: '/times', icon: Users },
    { name: 'Ranking', path: '/ranking', icon: Trophy },
    { name: 'Partidas', path: '/partidas', icon: Gamepad2 },
  ]

  return (
    <nav className="bg-[#0F0F0F] shadow-low border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {user ? (
            <div className="flex items-center space-x-2 cursor-default">
              <img 
                src="/curumins-logo.svg" 
                alt="Curumins League Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-primary tracking-wider">
                CURUMINS LEAGUE
              </span>
            </div>
          ) : (
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/curumins-logo.svg" 
                alt="Curumins League Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-primary tracking-wider">
                CURUMINS LEAGUE
              </span>
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-primary bg-primary/10 border border-primary/30'
                          : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/perfil"
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span>{userProfile?.nickname || 'Perfil'}</span>
                </Link>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {user && (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-primary bg-primary/10 border border-primary/30'
                          : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                
                <div className="border-t border-border pt-3 mt-3">
                  <Link
                    to="/perfil"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 text-text-secondary hover:text-primary transition-colors"
                  >
                    <User size={20} />
                    <span>{userProfile?.nickname || 'Perfil'}</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-3 py-2 text-text-secondary hover:text-primary transition-colors w-full text-left"
                  >
                    <LogOut size={20} />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            )}
            
            {!user && (
              <div className="space-y-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" size="sm" fullWidth>
                    Entrar
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}