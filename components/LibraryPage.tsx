import React, { useState } from 'react';
import { NeuralBackground } from './NeuralBackground';
import { MartaLogo } from './MartaLogo';

interface LibraryPageProps {
  onNavigate: (view: 'chat' | 'features' | 'library' | 'solutions' | 'pricing') => void;
  onLogin: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  availableCredits: number;
}

interface LibraryItem {
  id: string;
  type: 'image' | 'video' | 'text';
  title: string;
  date: string;
  content: string; // URL for media, snippet for text
  tags: string[];
}

// Mock Data
const MOCK_ITEMS: LibraryItem[] = [
  {
    id: '1',
    type: 'image',
    title: 'Arquitetura Brutalista',
    date: 'Hoje, 10:23',
    content: 'https://images.unsplash.com/photo-1518005052357-e984334cb994?auto=format&fit=crop&q=80&w=800',
    tags: ['Design', 'Conceito']
  },
  {
    id: '2',
    type: 'text',
    title: 'Minuta de Contrato SaaS',
    date: 'Ontem, 15:40',
    content: 'CLÁUSULA PRIMEIRA - DO OBJETO: O presente contrato tem como objeto a licença de uso de software...',
    tags: ['Jurídico', 'Draft']
  },
  {
    id: '3',
    type: 'video',
    title: 'Conceito Campanha Nike',
    date: '23 Out, 2024',
    content: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-at-night-34563-large.mp4', // Placeholder video
    tags: ['Marketing', 'Veo']
  },
  {
    id: '4',
    type: 'image',
    title: 'Dashboard Financeiro UI',
    date: '22 Out, 2024',
    content: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['UI/UX', 'Finance']
  },
  {
    id: '5',
    type: 'text',
    title: 'Copy Email Marketing',
    date: '20 Out, 2024',
    content: 'Assunto: Sua produtividade nunca mais será a mesma. Olá [Nome], imagine ter um segundo cérebro...',
    tags: ['Marketing', 'Vendas']
  },
  {
    id: '6',
    type: 'image',
    title: 'Render Interior Minimalista',
    date: '18 Out, 2024',
    content: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    tags: ['Arquitetura', '3D']
  }
];

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate, onLogin, isDarkMode, toggleTheme, availableCredits }) => {
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'text'>('all');

  const filteredItems = filter === 'all' 
    ? MOCK_ITEMS 
    : MOCK_ITEMS.filter(item => item.type === filter);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans relative bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
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

      {/* Sub-Header for Library */}
      <div className="pt-8 pb-6 px-6 md:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Biblioteca
                    <span className="text-xs font-mono font-normal text-gray-400 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-neutral-700">
                        {MOCK_ITEMS.length} itens
                    </span>
                </h1>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {(['all', 'image', 'video', 'text'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                            ${filter === type 
                                ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                                : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800'}
                        `}
                    >
                        {type === 'all' && 'Todos'}
                        {type === 'image' && 'Imagens'}
                        {type === 'video' && 'Vídeos'}
                        {type === 'text' && 'Textos'}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto min-h-[80vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
                <div 
                    key={item.id}
                    className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                    {/* Media Preview */}
                    <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800 relative overflow-hidden">
                        {item.type === 'image' && (
                            <img src={item.content} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        )}
                        {item.type === 'video' && (
                            <div className="w-full h-full relative group-hover:opacity-90 transition-opacity">
                                <video src={item.content} className="w-full h-full object-cover" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </div>
                        )}
                        {item.type === 'text' && (
                            <div className="w-full h-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 flex flex-col">
                                <div className="text-gray-400 mb-2">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-4 font-mono leading-relaxed">
                                    {item.content}
                                </p>
                            </div>
                        )}

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            <button className="p-2 bg-white dark:bg-black rounded-full hover:scale-110 transition-transform text-gray-900 dark:text-white shadow-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <button className="p-2 bg-white dark:bg-black rounded-full hover:scale-110 transition-transform text-gray-900 dark:text-white shadow-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate" title={item.title}>{item.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-neutral-800">
                             <span className="text-xs text-gray-400">{item.date}</span>
                             <div className="text-xs font-medium text-brand-purple">
                                {item.type === 'image' && 'IMG'}
                                {item.type === 'video' && 'VEO'}
                                {item.type === 'text' && 'DOC'}
                             </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};