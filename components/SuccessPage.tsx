
import React, { useEffect } from 'react';

interface SuccessPageProps {
  onSuccess: () => void; // Callback to be defined in App.tsx
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onSuccess }) => {
  useEffect(() => {
    // Here you would typically trigger the logic 
    // to add credits to the user's account.
    onSuccess(); 
  }, [onSuccess]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-neutral-900 text-center p-4">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-500">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pagamento Aprovado!</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Seu plano foi ativado. Você será redirecionado em breve.</p>
    </div>
  );
};
