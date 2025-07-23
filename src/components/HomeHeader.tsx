import { Link } from 'react-router-dom'
import { Button } from './Button'
import { LogIn, UserPlus } from 'lucide-react'

export function HomeHeader() {
  const handleSmoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/curumins-logo.svg" 
              alt="Curumins League Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-white">CURUMINS LEAGUE</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/ranking" className="text-text-secondary hover:text-primary transition-colors">
              Rankings
            </Link>
            <button 
              onClick={() => handleSmoothScroll('como-funciona')}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Como Funciona
            </button>
            <Link to="/sobre" className="text-text-secondary hover:text-primary transition-colors">
              Sobre
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 flex items-center gap-2">
                <LogIn size={16} />
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                <UserPlus size={16} />
                Registrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}