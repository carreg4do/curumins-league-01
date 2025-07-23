import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { HomeHeader } from '../components/HomeHeader'
import {
  Trophy,
  Users,
  Target,
  Zap,
  Shield,
  UserPlus,
  Award,
  Clock,
  Play
} from 'lucide-react'

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/10 pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CURUMINS
              </span>
              <br />
              <span className="text-white">LEAGUE</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto">
              A liga de CS2 mais competitiva da região Norte do Brasil. 
              Junte-se aos melhores jogadores e prove seu valor nos campos de batalha virtuais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2">
                  <UserPlus size={24} />
                  Criar Conta
                </Button>
              </Link>
              
              <Link to="/ranking">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold flex items-center gap-2">
                  <Trophy size={24} />
                  Ver Rankings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">2.5K+</div>
              <div className="text-text-secondary">Jogadores Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15K+</div>
              <div className="text-text-secondary">Partidas Jogadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">120+</div>
              <div className="text-text-secondary">Torneios Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">450+</div>
              <div className="text-text-secondary">Times Registrados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Por que escolher a <span className="text-primary">Liga do Norte</span>?
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Oferecemos a melhor experiência competitiva de CS2 com tecnologia de ponta e comunidade ativa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Matchmaking Inteligente</h3>
              <p className="text-text-secondary">
                Sistema avançado que encontra adversários do seu nível para partidas equilibradas e competitivas.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Anti-Cheat Rigoroso</h3>
              <p className="text-text-secondary">
                Proteção avançada contra trapaças garantindo fair play em todas as partidas da liga.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Premiações Exclusivas</h3>
              <p className="text-text-secondary">
                Torneios regulares com premiações em dinheiro e itens exclusivos para os melhores jogadores.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Matchmaking System Section */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Sistema de <span className="text-primary">Matchmaking</span>
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                Nosso algoritmo avançado analisa seu desempenho, estilo de jogo e histórico para encontrar 
                as partidas mais equilibradas e desafiadoras.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="text-primary" size={16} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Análise de Skill</h4>
                    <p className="text-text-secondary">
                      Avaliamos precisão, posicionamento, economia e trabalho em equipe.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="text-primary" size={16} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Compatibilidade de Time</h4>
                    <p className="text-text-secondary">
                      Formamos equipes balanceadas considerando roles e estilos complementares.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="text-primary" size={16} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Tempo de Busca Otimizado</h4>
                    <p className="text-text-secondary">
                      Encontre partidas rapidamente sem comprometer a qualidade do match.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8">
                <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-text-secondary">Buscando partida...</span>
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white">Skill Level:</span>
                      <span className="text-primary font-semibold">Global Elite</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Região:</span>
                      <span className="text-primary font-semibold">Norte</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Tempo estimado:</span>
                      <span className="text-primary font-semibold">2:30</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-primary/20 rounded-lg p-4">
                    <div className="text-center text-primary font-semibold mb-2">Partida Encontrada!</div>
                    <div className="text-center text-text-secondary text-sm">Conectando ao servidor...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Como <span className="text-primary">Funciona</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Começar na Curumins League é simples. Siga estes passos e entre para a elite do CS2.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Crie sua Conta</h3>
              <p className="text-text-secondary">
                Registre-se gratuitamente e conecte sua conta Steam para verificação.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Partidas de Calibragem</h3>
              <p className="text-text-secondary">
                Jogue 10 partidas para determinar seu nível inicial na liga.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Monte seu Time</h3>
              <p className="text-text-secondary">
                Encontre jogadores compatíveis ou jogue solo com nosso matchmaking.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Compete e Evolua</h3>
              <p className="text-text-secondary">
                Participe de torneios, suba no ranking e ganhe recompensas exclusivas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para dominar o <span className="text-primary">Norte</span>?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Junte-se a milhares de jogadores e prove que você tem o que é preciso para ser um verdadeiro Curumim.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2">
                <Play size={24} />
                Começar Agora
              </Button>
            </Link>
            
            <Link to="/ranking">
              <Button variant="secondary" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold flex items-center gap-2">
                <Trophy size={24} />
                Ver Melhores Jogadores
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">CURUMINS LEAGUE</h3>
              <p className="text-text-secondary mb-4">
                A liga de CS2 mais competitiva da região Norte do Brasil.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                  Discord
                </a>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                  YouTube
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Liga</h4>
              <ul className="space-y-2">
                <li><Link to="/ranking" className="text-text-secondary hover:text-primary transition-colors">Rankings</Link></li>
                <li><Link to="/times" className="text-text-secondary hover:text-primary transition-colors">Times</Link></li>
                <li><Link to="/partidas" className="text-text-secondary hover:text-primary transition-colors">Partidas</Link></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Torneios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Regras</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Contato</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Reportar Bug</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-surface mt-8 pt-8 text-center">
            <p className="text-text-secondary">
              © 2024 Curumins League. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}