
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router

export const CancelPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-neutral-900 text-center p-4">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-500">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pagamento Cancelado</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Você não foi cobrado. Sua assinatura não foi ativada.</p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold">
            Voltar para o início
        </Link>
    </div>
  );
};
