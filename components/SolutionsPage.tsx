import React from 'react';
import { NeuralBackground } from './NeuralBackground';
import { MartaLogo } from './MartaLogo';

interface SolutionsPageProps {
  onNavigate: (view: 'chat' | 'features' | 'library' | 'solutions' | 'pricing') => void;
  onLogin: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  availableCredits: number;
}

const SECTORS = [
  {
    id: 'corporate',
    title: 'Corporativo & Jurídico',
    description: 'Automatize a burocracia e garanta conformidade com precisão de nível executivo.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    ),
    features: [
      'Análise contratual em segundos',
      'Minutas automáticas e compliance',
      'Resumos executivos de reuniões',
      'Tradução contextual de documentos'
    ],
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'hover:border-blue-500/50'
  },
  {
    id: 'creative',
    title: 'Marketing & Design',
    description: 'Do conceito à campanha final. Uma agência completa em uma única interface.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
    ),
    features: [
      'Geração de vídeo com Google Veo',
      'Assets visuais com Imagen 3',
      'Copywriting persuasivo multicanal',
      'Brainstorming em tempo real (Live)'
    ],
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    border: 'hover:border-pink-500/50'
  },
  {
    id: 'tech',
    title: 'Engenharia & Dados',
    description: 'Acelere o ciclo de desenvolvimento e transforme dados brutos em insights.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    ),
    features: [
      'Refatoração e Debugging de código',
      'Documentação técnica automática',
      'Análise de dados complexos (SQL/Python)',
      'Arquitetura de sistemas assistida'
    ],
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/50'
  }
];

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onNavigate, onLogin, isDarkMode, toggleTheme, availableCredits }) => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans relative overflow-x-hidden bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <NeuralBackground />
      </div>

      {/* Floating Dark Mode Button */}
      <button
          onClick={toggleTheme}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-neutral-900/80 shadow-lg border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform backdrop-blur-sm"
          title="Alternar Tema"
      >
          {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
      </button>

      {/* Header Bar - Replicated from App.tsx */}
      <div className="py-4 px-6 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md z-40 transition-colors duration-300 relative sticky top-0 border-b border-gray-200/50 dark:border-neutral-800/50">
          <div className="flex items-center gap-3">
              {/* Logo */}
              <div 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 cursor-pointer transition-all hover:scale-105 group"
                  title="Recarregar aplicação"
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
               {/* Dark Mode Toggle REMOVED FROM HERE */}

              <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/5 dark:bg-brand-purple/10">
                       <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-pink animate-pulse"></div>
                       <span className="text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">
                           {availableCredits} <span className="hidden sm:inline">Créditos</span>
                       </span>
                  </div>
                  <button 
                      onClick={onLogin}
                      className="w-8 h-8 md:w-auto md:h-auto p-0 md:px-5 md:py-2 rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink text-white text-xs font-bold tracking-wide hover:shadow-lg hover:shadow-brand-purple/20 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                  >
                      <span className="hidden md:inline">Entrar</span>
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
              </div>
          </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16 px-6 text-center max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
          Soluções para <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">
            Cada Vertical
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A Marta adapta sua rede neural para resolver desafios específicos da sua indústria. 
            Escolha seu setor e veja como podemos transformar seu fluxo de trabalho.
        </p>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SECTORS.map((sector) => (
                <div 
                    key={sector.id}
                    className={`
                        group p-8 rounded-3xl bg-white/70 dark:bg-neutral-900/70 border border-gray-200 dark:border-neutral-800 
                        backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
                        ${sector.border}
                    `}
                >
                    <div className={`w-14 h-14 rounded-2xl ${sector.bg} ${sector.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        {sector.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{sector.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 min-h-[3rem]">
                        {sector.description}
                    </p>

                    <ul className="space-y-4">
                        {sector.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <div className={`w-1.5 h-1.5 rounded-full ${sector.color.replace('text-', 'bg-')}`}></div>
                                {feat}
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={onLogin}
                        className="w-full mt-8 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-sm font-bold transition-colors flex items-center justify-center gap-2 group-hover:border-transparent group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black"
                    >
                        Explorar Solução
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </div>
            ))}
        </div>

        {/* Enterprise Banner */}
        <div className="mt-20 p-8 md:p-12 rounded-[2rem] bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                    <span className="text-xs font-mono text-brand-blue uppercase tracking-widest font-bold mb-2 block">Marta Enterprise</span>
                    <h2 className="text-3xl font-display font-bold mb-4">Precisa de uma solução customizada?</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Integração via API, treinamento com dados proprietários e SLAs dedicados para grandes organizações.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button onClick={onLogin} className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                        Falar com Vendas
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors backdrop-blur-md">
                        Ver Documentação
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};