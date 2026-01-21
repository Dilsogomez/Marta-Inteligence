import React from 'react';
import { NeuralBackground } from './NeuralBackground';
import { MartaLogo } from './MartaLogo';

interface FeaturesPageProps {
  onNavigate: (view: 'chat' | 'features' | 'library' | 'solutions' | 'pricing') => void;
  onLogin: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  availableCredits: number;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate, onLogin, isDarkMode, toggleTheme, availableCredits }) => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans relative overflow-x-hidden bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="fixed inset-0 z-0 opacity-50">
        <NeuralBackground />
      </div>

      {/* Header Bar - Replicated from App.tsx */}
      <div className="py-4 px-6 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md z-40 transition-colors duration-300 relative sticky top-0 border-b border-gray-200/50 dark:border-neutral-800/50">
          <div className="flex items-center gap-3">
              {/* Logo */}
              <div 
                  onClick={() => onNavigate('chat')}
                  className="flex items-center gap-2 cursor-pointer transition-all hover:scale-105 group"
                  title="Início"
              >
                  <div className="w-8 h-8">
                      <MartaLogo className="w-full h-full" />
                  </div>
              </div>

              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-6 ml-6 border-l border-gray-200 dark:border-neutral-800 pl-6 h-6">
                  <button onClick={() => onNavigate('features')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Funcionalidades</button>
                  <button onClick={() => onNavigate('library')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Biblioteca</button>
                  <button onClick={() => onNavigate('solutions')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Soluções</button>
                  <button onClick={() => onNavigate('pricing')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Preços</button>
                  <button onClick={onLogin} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Sobre</button>
              </nav>
          </div>
          
          <div className="flex items-center gap-3">
               {/* Dark Mode Toggle */}
              <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 transition-colors"
              >
                  {isDarkMode ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  )}
              </button>

              <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/5 dark:bg-brand-purple/10">
                       <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-pink animate-pulse"></div>
                       <span className="text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">
                           {availableCredits} Créditos
                       </span>
                  </div>
                  <button 
                      onClick={onLogin}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink text-white text-xs font-bold tracking-wide hover:shadow-lg hover:shadow-brand-purple/20 hover:scale-105 transition-all flex items-center gap-2 group"
                  >
                      <span>Entrar</span>
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
              </div>
          </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-mono uppercase tracking-widest">
            Capabilities v3.0
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
          O Sistema Operacional <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">
            Da Sua Inteligência
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Uma suíte completa de ferramentas neurais integradas em uma única interface conversacional. Da geração de código à produção de vídeo cinematográfico.
        </p>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Text */}
            <div className="group p-8 rounded-3xl bg-white/60 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 backdrop-blur-xl hover:border-brand-blue/50 transition-all hover:shadow-2xl hover:shadow-brand-blue/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Gemini 3.0 Pro</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Raciocínio lógico avançado para tarefas complexas. Capaz de analisar contratos jurídicos, depurar código em diversas linguagens e criar estratégias de marketing detalhadas.
                </p>
                <div className="flex gap-2 text-xs font-mono text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">1M Contexto</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">Raciocínio</span>
                </div>
            </div>

            {/* Feature 2: Video */}
            <div className="group p-8 rounded-3xl bg-white/60 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 backdrop-blur-xl hover:border-brand-purple/50 transition-all hover:shadow-2xl hover:shadow-brand-purple/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Google Veo</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Produção de vídeo generativo em 1080p. Crie cenas cinematográficas, animações para redes sociais ou protótipos visuais apenas descrevendo a cena.
                </p>
                <div className="flex gap-2 text-xs font-mono text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">1080p</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">60 FPS</span>
                </div>
            </div>

            {/* Feature 3: Image */}
            <div className="group p-8 rounded-3xl bg-white/60 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 backdrop-blur-xl hover:border-brand-pink/50 transition-all hover:shadow-2xl hover:shadow-brand-pink/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Imagen 3</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Geração de imagens com fotorrealismo extremo. Ideal para mockups, material publicitário e arte conceitual. Suporta renderização de texto perfeita dentro da imagem.
                </p>
                <div className="flex gap-2 text-xs font-mono text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">Fotorrealismo</span>
                </div>
            </div>

             {/* Feature 4: Live Audio */}
             <div className="group p-8 rounded-3xl bg-white/60 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 backdrop-blur-xl hover:border-green-500/50 transition-all hover:shadow-2xl hover:shadow-green-500/10">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Marta Live</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Conversação em tempo real com latência ultra-baixa. Interrompa a qualquer momento, mude de assunto e tenha brainstormings naturais como se falasse com um humano.
                </p>
                <div className="flex gap-2 text-xs font-mono text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">Multimodal</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">Real-time</span>
                </div>
            </div>

             {/* Feature 5: Agents */}
             <div className="group p-8 rounded-3xl bg-white/60 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 backdrop-blur-xl hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/10 md:col-span-2 lg:col-span-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Arquitetura de Agentes</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    Crie instâncias especializadas da Marta. Defina personas como "Advogado Sênior", "Engenheiro de Dados" ou "Copywriter Criativo". Cada agente mantém seu próprio contexto, instruções de sistema e memória, permitindo que você alterne entre especialistas instantaneamente.
                </p>
                <div className="flex gap-2 text-xs font-mono text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">Personalizável</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded">Memória Dedicada</span>
                </div>
            </div>

        </div>

        <div className="mt-20 text-center">
             <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Pronto para começar?</h2>
             <button 
                onClick={() => onLogin()} 
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-purple/25 transition-all transform hover:scale-[1.02]"
            >
                Criar Conta Gratuita
            </button>
        </div>
      </div>
    </div>
  );
};