import React, { useState } from 'react';
import { NeuralBackground } from './NeuralBackground';
import { MartaLogo } from './MartaLogo';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
            onClick={onClose}
        ></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-6xl h-auto max-h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-neutral-800">
            
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors backdrop-blur-sm"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Left Column: Login Form */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center p-8 md:p-12 relative z-20 bg-white dark:bg-neutral-900 overflow-y-auto no-scrollbar">
                <div className="w-full max-w-sm mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
                             <MartaLogo className="w-full h-full" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Bem-vindo de volta</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Identifique-se para acessar o sistema.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Email Corporativo</label>
                            <input type="email" placeholder="nome@empresa.com" className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors placeholder-gray-400" required />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Chave de Acesso</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors placeholder-gray-400" required />
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-brand-purple/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Autenticando...
                                    </>
                                ) : (
                                    'Iniciar Sessão Segura'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 space-y-5">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-neutral-700"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-neutral-900 rounded-full text-gray-400 dark:text-gray-500 text-xs uppercase">Single Sign-On</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 rounded-xl transition-colors text-gray-700 dark:text-gray-300">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                                <span className="text-sm font-medium">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 rounded-xl transition-colors text-gray-700 dark:text-gray-300">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.81-.04 2.14-.71 3.59-.71 1.9.15 3.3.89 4.21 2.21-3.66 2.02-3.06 7.56 1.12 9.19-.88 2.25-2.09 4.38-4 4.5zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                                <span className="text-sm font-medium">Apple</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Marketing Content (Scrollable within modal) */}
            <div className="hidden lg:flex w-[60%] relative flex-col bg-gray-50 dark:bg-black overflow-y-auto no-scrollbar">
                {/* Background inside the right panel */}
                <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
                    <NeuralBackground />
                </div>
                
                <div className="relative z-10 p-12">
                     {/* Hero Section */}
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-black/80 border border-gray-200 dark:border-neutral-800 w-fit shadow-sm backdrop-blur-md mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 tracking-wider">MARTA_OS v3.0 ONLINE</span>
                        </div>
                        
                        <h1 className="text-4xl font-display font-bold leading-tight text-gray-900 dark:text-white mb-6">
                            A evolução da <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">Produtividade</span>
                        </h1>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            A Marta não é apenas um chatbot. É um ecossistema de inteligência neural projetado para executivos, criativos e engenheiros que exigem excelência.
                        </p>
                    </div>

                    {/* Creative Studio */}
                    <div className="mb-12">
                        <h3 className="text-sm font-mono text-brand-purple uppercase tracking-widest font-bold mb-4">Creative Suite</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-white/60 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 backdrop-blur-sm">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Google Veo</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Geração de vídeo 1080p cinematográfica.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/60 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 backdrop-blur-sm">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Imagen 3</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Fotorealismo extremo para campanhas.</p>
                            </div>
                        </div>
                    </div>

                    {/* Live Intelligence */}
                    <div className="mb-12">
                        <h3 className="text-sm font-mono text-emerald-500 uppercase tracking-widest font-bold mb-4">Marta Live</h3>
                         <div className="p-6 rounded-2xl bg-neutral-900 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-bold text-xl mb-2">Converse em Tempo Real</h4>
                                <p className="text-gray-300 text-sm">Latência zero e áudio HD. Brainstormings complexos como se falasse com um humano.</p>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/20 blur-3xl rounded-full"></div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};