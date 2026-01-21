import React, { useState } from 'react';
import { MartaLogo } from './MartaLogo';

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: string;
}

interface CheckoutModalProps {
  plan: Plan;
  onClose: () => void;
  onSuccess: (creditsAdded: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, onClose, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    // Simple masking logic
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
    } else if (name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/^(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
    } else if (name === 'cvc') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setStep('success');
      
      // Calculate numeric credits based on plan string (e.g., "1.000" -> 1000)
      const credits = parseInt(plan.credits.replace('.', '')) || 0;
      
      setTimeout(() => {
        onSuccess(credits);
      }, 2000); // Close after success animation
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-neutral-800">
        
        {/* Left Side: Order Summary */}
        <div className="w-full md:w-1/3 bg-gray-50 dark:bg-black p-8 border-r border-gray-100 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 mb-6">
                <MartaLogo className="w-full h-full" />
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Resumo do Pedido</h3>
            <div className="mt-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">Plano {plan.name}</h2>
              <p className="text-sm text-gray-500">{plan.credits} Créditos mensais</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Total hoje</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">R$ {plan.price},00</span>
            </div>
          </div>
          <div className="mt-8 text-xs text-gray-400">
            Pagamento processado de forma segura. Seus dados são criptografados de ponta a ponta.
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="w-full md:w-2/3 p-8 relative">
           <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>

           {step === 'form' && (
             <form onSubmit={handleSubmit} className="space-y-6">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Dados do Pagamento</h2>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nome no Cartão</label>
                   <input 
                      type="text" 
                      name="name"
                      placeholder="COMO NO CARTÃO" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                      required
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Número do Cartão</label>
                   <div className="relative">
                     <input 
                        type="text" 
                        name="cardNumber"
                        placeholder="0000 0000 0000 0000" 
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                        className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 pl-12 text-gray-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all font-mono"
                        required
                     />
                     <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Validade</label>
                      <input 
                          type="text" 
                          name="expiry"
                          placeholder="MM/AA" 
                          value={formData.expiry}
                          onChange={handleInputChange}
                          maxLength={5}
                          className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-center"
                          required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">CVC</label>
                      <input 
                          type="text" 
                          name="cvc"
                          placeholder="123" 
                          value={formData.cvc}
                          onChange={handleInputChange}
                          maxLength={3}
                          className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all text-center"
                          required
                      />
                    </div>
                 </div>
               </div>

               <button type="submit" className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-purple/25 transition-all transform hover:scale-[1.01] active:scale-[0.99]">
                 Pagar R$ {plan.price},00
               </button>
             </form>
           )}

           {step === 'processing' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-neutral-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-brand-purple border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processando Pagamento</h3>
                <p className="text-gray-500 dark:text-gray-400">Verificando informações com a operadora...</p>
             </div>
           )}

           {step === 'success' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-500 mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pagamento Confirmado!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Seu plano <strong>{plan.name}</strong> foi ativado com sucesso.
                </p>
                <div className="px-4 py-2 bg-brand-purple/10 text-brand-purple rounded-full font-bold text-sm">
                   +{plan.credits} Créditos Adicionados
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};