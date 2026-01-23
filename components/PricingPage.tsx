import React, { useState } from 'react';
import { NeuralBackground } from './NeuralBackground';
import { MartaLogo } from './MartaLogo';
import { CheckoutModal } from './CheckoutModal';

interface PricingPageProps {
  onNavigate: (view: 'chat' | 'pricing') => void;
  onLogin: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  availableCredits: number;
  onPurchase: (amount: number) => void;
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: '5/dia',
    price: '0',
    period: 'sempre',
    description: 'Experimente o poder da IA.',
    features: [
      '5 Créditos por dia',
      'Não acumulativos',
      'Histórico de 7 dias',
      'Imagens Standard'
    ],
    cta: 'Começar',
    highlight: false,
    color: 'border-gray-200 dark:border-neutral-800'
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: '1.000',
    price: '99',
    period: '/mês',
    description: 'Para criadores profissionais.',
    features: [
      '1.000 Créditos/mês',
      'Gemini 3.0 Pro & Ultra',
      'Vídeo (Veo) & Imagem HD',
      'Voz Real-time',
      'Modo Privado'
    ],
    cta: 'Assinar Pro',
    highlight: true,
    color: 'border-brand-purple'
  },
  {
    id: 'scale',
    name: 'Scale',
    credits: '5.000',
    price: '299',
    period: '/mês',
    description: 'Para agências e escala.',
    features: [
      '5.000 Créditos/mês',
      'Acesso Prioritário',
      'Vídeo 4K & API Key',
      'Agentes Ilimitados',
      'Rollover de créditos'
    ],
    cta: 'Assinar Scale',
    highlight: false,
    color: 'border-gray-200 dark:border-neutral-800'
  }
];

const CONSUMPTION_RATES = [
    { action: 'Mensagem', cost: '1 Crédito', icon: '💬' },
    { action: 'Código', cost: '2 Créditos', icon: '💻' },
    { action: 'Imagem', cost: '10 Créditos', icon: '🎨' },
    { action: 'Live (min)', cost: '20 Créditos', icon: '🎙️' },
    { action: 'Vídeo', cost: '50 Créditos', icon: '🎬' },
];

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onLogin, isDarkMode, toggleTheme, availableCredits, onPurchase }) => {
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);

  const handlePlanClick = (plan: typeof PLANS[0]) => {
      if (plan.price === '0') {
          onLogin(); // Or directly navigate to chat if auth not required for free tier logic
      } else {
          setSelectedPlan(plan);
      }
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans relative overflow-x-hidden bg-gray-50 dark:bg-black transition-colors duration-300 flex flex-col">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <NeuralBackground />
      </div>

      {selectedPlan && (
          <CheckoutModal 
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
            onSuccess={(amount) => {
                onPurchase(amount);
                setSelectedPlan(null);
            }}
          />
      )}

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

              {/* Removed Navigation Menu */}
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

      {/* Main Content Container - Flex centered to fill remaining height */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* Compact Hero */}
        <div className="text-center mb-6 md:mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 leading-tight">
            Pague pelo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">cria</span>.
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Modelo de créditos flexível. Sem contratos longos.
            </p>
        </div>

        {/* Compact Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6 items-center">
            {PLANS.map((plan) => (
                <div 
                    key={plan.id}
                    className={`
                        relative group p-5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between
                        ${plan.highlight 
                            ? 'border-2 border-brand-purple shadow-[0_0_30px_-10px_rgba(147,51,234,0.2)] scale-[1.02] z-10 h-[420px]' 
                            : 'border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 h-[380px]'}
                    `}
                >
                    {plan.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-blue to-brand-purple text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap">
                            Popular
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                            {plan.id === 'starter' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Grátis</span>}
                        </div>
                        
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                                {plan.credits}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">
                                {plan.id === 'starter' ? '' : 'Créditos'}
                            </span>
                        </div>
                        
                        <div className="flex items-baseline gap-1 mb-4 pb-4 border-b border-gray-100 dark:border-neutral-800">
                             {plan.price !== '0' && <span className="text-xs font-semibold text-gray-500">R$</span>}
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{plan.price === '0' ? 'Grátis' : plan.price}</span>
                            {plan.price !== '0' && <span className="text-xs text-gray-500">{plan.period}</span>}
                        </div>

                        <ul className="space-y-2">
                            {plan.features.map((feat, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                                    <svg className={`w-3.5 h-3.5 shrink-0 ${plan.highlight ? 'text-brand-purple' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span className="leading-tight">{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button 
                        onClick={() => handlePlanClick(plan)} 
                        className={`
                            w-full py-2.5 rounded-lg font-bold text-sm mt-4 transition-all
                            ${plan.highlight 
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:shadow-lg' 
                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700'}
                        `}
                    >
                        {plan.cta}
                    </button>
                </div>
            ))}
        </div>

        {/* Horizontal Compact Consumption Bar */}
        <div className="w-full bg-white/40 dark:bg-neutral-900/40 rounded-xl border border-gray-200 dark:border-neutral-800 p-3 backdrop-blur-md">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-3 md:gap-6 text-xs">
                <span className="font-bold text-gray-500 uppercase tracking-wide hidden md:block">Consumo:</span>
                {CONSUMPTION_RATES.map((rate, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white dark:bg-black px-2 py-1 rounded-md border border-gray-100 dark:border-neutral-800 shadow-sm">
                        <span>{rate.icon}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{rate.action}</span>
                        <span className="text-brand-purple font-bold ml-1">{rate.cost.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
        </div>
        
      </div>
    </div>
  );
};