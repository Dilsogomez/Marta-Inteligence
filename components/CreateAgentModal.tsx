import React, { useState } from 'react';
import { AGENT_ROLES } from '../constants';
import { Agent } from '../types';

interface CreateAgentModalProps {
  onClose: () => void;
  onSave: (agent: Agent) => void;
}

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(AGENT_ROLES[0]);
  const [instructions, setInstructions] = useState('');

  const handleSave = () => {
    if (!name.trim() || !instructions.trim()) return;

    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      role,
      instructions,
      createdAt: Date.now(),
    };

    onSave(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-transparent dark:border-neutral-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Novo Agente Especialista</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Agente</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Jarvis Jurídico, AutoBot..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white focus:border-brand-purple focus:ring-0 transition-colors outline-none"
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidade / Cargo</label>
                <div className="relative">
                    <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white focus:border-brand-purple focus:ring-0 transition-colors outline-none appearance-none"
                    >
                        {AGENT_ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instruções & Atividades</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Descreva exatamente o que este agente deve fazer, como deve se comportar e quais tarefas repetitivas ele vai assumir.</p>
                <textarea 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Ex: Você é um especialista em direito civil brasileiro. Sua tarefa é analisar contratos e apontar cláusulas abusivas..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white focus:border-brand-purple focus:ring-0 transition-colors outline-none h-32 resize-none"
                />
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
                Cancelar
            </button>
            <button 
                onClick={handleSave}
                disabled={!name.trim() || !instructions.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-purple text-white hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md shadow-purple-200 dark:shadow-none"
            >
                Criar Agente
            </button>
        </div>
      </div>
    </div>
  );
};