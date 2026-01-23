import React, { useState } from 'react';
import { MartaLogo } from './MartaLogo';
import { CheckoutModal } from './CheckoutModal';

interface OutOfCreditsModalProps {
  onClose: () => void;
  onComplete: (creditsAdded: number) => void;
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: '5/dia',
    price: '0',
    description: 'Básico para continuar explorando.',
    features: ['5 Créditos por dia', 'Não acumulativos', 'Acesso Limitado'],
    cta: 'Selecionar Grátis',
    highlight: false
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: '1.000',
    price: '99',
    description: 'Para quem busca produtividade real.',
    features: ['1.000 Créditos', 'Gemini Pro', 'Veo Vídeo'],
    cta: 'Assinar Pro',
    highlight: true
  },
  {
    id: 'scale',
    name: 'Scale',
    credits: '5.000',
    price: '299',
    description: 'Potência máxima para profissionais.',
    features: ['5.000 Créditos', 'Tudo Ilimitado'],
    cta: 'Assinar Scale',
    highlight: false
  }
];

export const OutOfCreditsModal: React.FC<OutOfCreditsModalProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<'offer' | 'survey' | 'checkout'>('offer');
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  
  // Survey Form State
  const [surveyData, setSurveyData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Gestão'
  });

  const handlePlanSelect = (plan: typeof PLANS[0]) => {
      setSelectedPlan(plan);
      setStep('survey');
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Here you would normally send the registration data to backend
      setStep('checkout');
  };

  const handleCheckoutSuccess = (credits: number) => {
      onComplete(credits);
  };

  const handleSkipToFree = () => {
      // User chose a paid plan but decided to bail to free at checkout
      // We register them as a free user (adding 0 purchased credits triggers free tier logic in App.tsx)
      onComplete(0); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Dark Backdrop with Blur */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

        <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 border border-gray-200 dark:border-neutral-800 h-[90vh] md:h-auto">
            
            {/* Left Side: Psychological Copy (Visible on Desktop) - Stronger Lilac Gradient */}
            <div className="hidden md:flex w-1/3 bg-gradient-to-br from-[#E9D5FF] via-[#F3E8FF] to-[#FAF5FF] dark:from-purple-900/40 dark:via-black dark:to-black p-10 flex-col justify-between border-r border-gray-200 dark:border-neutral-800 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                 
                 <div>
                    <div className="w-12 h-12 mb-8">
                        <MartaLogo className="w-full h-full" />
                    </div>
                    
                    {step === 'offer' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                                Sua sessão experimental terminou.
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                A Marta já processou mais de 10 milhões de tarefas complexas. Você apenas arranhou a superfície do que é possível.
                            </p>
                            <div className="pt-4">
                                <p className="text-sm font-bold text-brand-purple uppercase tracking-widest">Oportunidade</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Usuários Pro economizam em média 15 horas semanais em tarefas repetitivas.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'survey' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                             <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                                Vamos personalizar a Marta para você.
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Para entregar resultados de alta precisão, precisamos entender quem você é. Isso ajusta os pesos neurais dos modelos para sua área.
                            </p>
                        </div>
                    )}

                    {step === 'checkout' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                             <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                                Última etapa.
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Ative sua assinatura para desbloquear acesso imediato. Garantia de satisfação ou cancelamento a qualquer momento.
                            </p>
                            {selectedPlan?.price !== '0' && (
                                <div className="mt-8 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400 text-sm">Plano Selecionado</span>
                                        <span className="text-white font-bold">{selectedPlan?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span>R$ {selectedPlan?.price}/mês</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                 </div>

                 <div className="text-xs text-gray-400 mt-8">
                     © 2024 Marta Intelligence Systems.
                 </div>
            </div>

            {/* Right Side: Interactive Area - Soft Lilac Gradient Background */}
            <div className="w-full md:w-2/3 bg-gradient-to-br from-white via-[#F8F5FF] to-[#F3E8FF] dark:bg-neutral-900 dark:from-neutral-900 dark:to-black p-8 md:p-12 overflow-y-auto relative">
                
                {/* Close Button (Aborts flow completely) */}
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* --- STEP 1: OFFER --- */}
                {step === 'offer' && (
                    <div className="flex flex-col h-full justify-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="md:hidden mb-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sessão Expirada</h2>
                            <p className="text-gray-500 text-sm">Escolha um plano para continuar.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {PLANS.map((plan) => (
                                <div 
                                    key={plan.id}
                                    onClick={() => handlePlanSelect(plan)}
                                    className={`
                                        cursor-pointer relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]
                                        ${plan.highlight 
                                            ? 'bg-neutral-900 text-white border-brand-purple shadow-xl shadow-brand-purple/20' 
                                            : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 hover:border-gray-300'}
                                    `}
                                >
                                    {plan.highlight && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-purple text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                            Recomendado
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <h3 className={`font-bold text-lg ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-2xl font-bold">{plan.price === '0' ? 'Grátis' : `R$ ${plan.price}`}</span>
                                            {plan.price !== '0' && <span className="text-xs opacity-70">/mês</span>}
                                        </div>
                                    </div>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs opacity-80">
                                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`w-full py-2 rounded-lg text-sm font-bold ${plan.highlight ? 'bg-white text-black' : 'bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white'}`}>
                                        {plan.cta}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- STEP 2: SURVEY --- */}
                {step === 'survey' && (
                    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="mb-6">
                            <span className="text-xs font-mono text-brand-purple font-bold">PASSO 1 DE 2</span>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Crie seu perfil profissional</h2>
                        </div>
                        
                        <form onSubmit={handleSurveySubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={surveyData.name}
                                        onChange={e => setSurveyData({...surveyData, name: e.target.value})}
                                        className="w-full bg-white/50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Área</label>
                                    <select 
                                        value={surveyData.role}
                                        onChange={e => setSurveyData({...surveyData, role: e.target.value})}
                                        className="w-full bg-white/50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 dark:text-white"
                                    >
                                        <option>Gestão</option>
                                        <option>Desenvolvimento</option>
                                        <option>Marketing</option>
                                        <option>Design</option>
                                        <option>Jurídico</option>
                                        <option>Outro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email Corporativo</label>
                                <input 
                                    required
                                    type="email" 
                                    value={surveyData.email}
                                    onChange={e => setSurveyData({...surveyData, email: e.target.value})}
                                    className="w-full bg-white/50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Criar Senha</label>
                                <input 
                                    required
                                    type="password" 
                                    value={surveyData.password}
                                    onChange={e => setSurveyData({...surveyData, password: e.target.value})}
                                    className="w-full bg-white/50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 dark:text-white"
                                />
                            </div>

                            <button type="submit" className="w-full py-4 mt-4 bg-brand-purple hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/20">
                                Continuar para Ativação
                            </button>
                        </form>
                    </div>
                )}

                {/* --- STEP 3: CHECKOUT --- */}
                {step === 'checkout' && selectedPlan && (
                    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                        <div className="mb-4">
                            <span className="text-xs font-mono text-green-500 font-bold">PASSO 2 DE 2</span>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {selectedPlan.price === '0' ? 'Confirmar Plano Gratuito' : 'Pagamento Seguro'}
                            </h2>
                        </div>

                        {selectedPlan.price === '0' ? (
                            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tudo Pronto!</h3>
                                    <p className="text-gray-500 mt-2">Sua conta Starter foi configurada com sucesso.</p>
                                </div>
                                <button 
                                    onClick={() => handleCheckoutSuccess(0)}
                                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl"
                                >
                                    Acessar Marta
                                </button>
                            </div>
                        ) : (
                            // Reuse logic from CheckoutModal but inline here for simplicity or render it directly
                            // For this specific flow, we are rendering the CheckoutModal component but inside this container
                            <div className="flex-1 flex flex-col">
                                <div className="relative flex-1">
                                    {/* We embed the form logic here or simpler version */}
                                    <CheckoutModal 
                                        plan={selectedPlan} 
                                        onClose={() => {}} // Disabled internal close
                                        onSuccess={handleCheckoutSuccess}
                                    />
                                    {/* Override modal positioning styles to fit in this div */}
                                    <style>{`
                                        .fixed.inset-0.z-\\[100\\] { position: static !important; padding: 0 !important; }
                                        .absolute.inset-0.bg-black\\/60 { display: none !important; }
                                        .relative.w-full.max-w-4xl { box-shadow: none !important; border: none !important; background: transparent !important; max-width: 100% !important; }
                                        .w-full.md\\:w-1\\/3 { display: none !important; } /* Hide left summary of checkout modal since we have our own */
                                        .w-full.md\\:w-2\\/3 { width: 100% !important; padding: 0 !important; }
                                        button.absolute.top-4.right-4 { display: none !important; }
                                    `}</style>
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-800 text-center">
                                    <button 
                                        onClick={handleSkipToFree}
                                        className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 font-medium transition-colors"
                                    >
                                        Prefiro continuar com o plano Gratuito por enquanto
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};