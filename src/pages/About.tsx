import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Navbar } from '../components/Navbar'
import {
  MapPin,
  Wifi,
  Users,
  Trophy,
  Target,
  Heart,
  ArrowLeft,
  Gamepad2,
  Globe,
  Zap
} from 'lucide-react'

export function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/10 pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Nossa <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">História</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-4xl mx-auto">
              Conheça a jornada que levou à criação da liga de CS2 mais competitiva da região Norte do Brasil.
            </p>
            
            <Link to="/">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 flex items-center gap-2 mx-auto">
                <ArrowLeft size={20} />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                O Nascimento de uma <span className="text-primary">Revolução</span>
              </h2>
              <p className="text-lg text-text-secondary mb-6">
                A Curumins League nasceu de uma necessidade real: a falta de plataformas competitivas 
                verdadeiramente dedicadas aos jogadores da região Norte do Brasil. Enquanto outras 
                plataformas ofereciam experiências genéricas, nós vimos a oportunidade de criar algo especial.
              </p>
              <p className="text-lg text-text-secondary mb-6">
                Nossa missão era simples, mas ambiciosa: fugir das plataformas convencionais e criar 
                um ambiente onde os jogadores do Norte pudessem competir em igualdade de condições, 
                sem as barreiras técnicas que sempre os prejudicaram.
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8">
                <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Heart className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Nossa Motivação</h4>
                      <p className="text-text-secondary text-sm">Paixão pelo competitivo</p>
                    </div>
                  </div>
                  <p className="text-text-secondary">
                    "Criar uma plataforma que realmente entenda e atenda às necessidades 
                    específicas dos jogadores da região Norte."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Ping Problem Section */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              O Problema do <span className="text-primary">Ping Alto</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-4xl mx-auto">
              A principal dor que motivou nossa criação: jogadores do Norte enfrentando ping alto 
              diariamente no CS2 devido à distância dos servidores convencionais.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="text-red-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ping Elevado</h3>
              <p className="text-text-secondary">
                Jogadores do Norte frequentemente enfrentam ping de 80-150ms em servidores convencionais.
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-yellow-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Desvantagem Competitiva</h3>
              <p className="text-text-secondary">
                Alto ping resulta em desvantagem significativa em duelos e jogadas que exigem precisão.
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Comunidade Fragmentada</h3>
              <p className="text-text-secondary">
                Falta de uma plataforma unificada para jogadores da região Norte competirem entre si.
              </p>
            </Card>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Nossa Solução: <span className="text-primary">Servidores Regionais</span>
              </h3>
              <p className="text-lg text-text-secondary mb-6">
                Implementamos uma infraestrutura de servidores estrategicamente posicionados 
                na região Norte, garantindo ping baixo e experiência competitiva justa para todos.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Zap className="text-primary" size={20} />
                  <span className="text-white font-semibold">Ping &lt; 30ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary" size={20} />
                  <span className="text-white font-semibold">Servidores Locais</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="text-primary" size={20} />
                  <span className="text-white font-semibold">Cobertura Regional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8">
                <div className="bg-surface/80 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-center">
                    <Trophy className="text-primary mx-auto mb-4" size={48} />
                    <h4 className="text-xl font-bold text-white mb-4">Descobrir o Melhor do Norte</h4>
                    <p className="text-text-secondary">
                      Nossa plataforma permite que jogadores de toda a região Norte 
                      compitam em igualdade de condições para descobrir quem realmente 
                      é o melhor da região.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Nossa <span className="text-primary">Missão</span>
              </h2>
              <p className="text-lg text-text-secondary mb-6">
                Criar um ecossistema competitivo onde jogadores do Norte possam experimentar 
                ping baixo, competir com qualidade e descobrir quem são os verdadeiros 
                campeões da região.
              </p>
              <p className="text-lg text-text-secondary mb-6">
                Fugimos das plataformas convencionais para oferecer algo único: uma liga 
                feita por nortistas, para nortistas, onde cada partida é uma oportunidade 
                de provar seu valor sem as limitações técnicas do passado.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Gamepad2 className="text-primary" size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Competição Justa</h4>
                    <p className="text-text-secondary text-sm">
                      Todos jogam com as mesmas condições técnicas ideais.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="text-primary" size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Comunidade Unida</h4>
                    <p className="text-text-secondary text-sm">
                      Conectamos jogadores de toda a região Norte em uma só plataforma.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Trophy className="text-primary" size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Excelência Regional</h4>
                    <p className="text-text-secondary text-sm">
                      Descobrimos e celebramos os melhores talentos do Norte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Faça Parte da <span className="text-primary">Nossa História</span>
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Junte-se à revolução competitiva do Norte. Prove seu valor, encontre sua tribo 
            e ajude a escrever o próximo capítulo da Curumins League.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold flex items-center gap-2">
                <Users size={24} />
                Juntar-se à Liga
              </Button>
            </Link>
            
            <Link to="/ranking">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold flex items-center gap-2">
                <Trophy size={24} />
                Ver Rankings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}