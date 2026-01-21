import React from 'react';
import { NeuralBackground } from './NeuralBackground';
import { MartaLogo } from './MartaLogo';

interface FeaturesPageProps {
  onBack: () => void;
  onLogin: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onBack, onLogin }) => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans relative overflow-x-hidden bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="fixed inset-0 z-0 opacity-50">
        <NeuralBackground />
      </div>

      {/* Header */}
      <div className="relative z-20 py-6 px-6 md:px-12 flex justify-between items-center backdrop-blur-sm sticky top-0 border-b border-gray-200/50 dark:border-neutral-800/50">
        <div 
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 cursor-pointer group"
            title="Recarregar aplicação"
        >
             <div className="w-8 h-8 drop-shadow-[0_0_12px_rgba(37,99,235,0.6)] group-hover:scale-110 transition-transform">
                <MartaLogo className="w-full h-full" />
            </div>
        </div>
        <div className="flex gap-4">
             <button onClick={onBack} className="hidden md:block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Voltar
            </button>
            <button onClick={onLogin} className="px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:shadow-lg transition-all transform hover:scale-105">
                Acessar Plataforma
            </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
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
                onClick={onLogin}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-purple/25 transition-all transform hover:scale-[1.02]"
            >
                Criar Conta Gratuita
            </button>
        </div>
      </div>
    </div>
  );
};