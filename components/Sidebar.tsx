import React, { useState } from 'react';
import { Agent, ChatSession } from '../types';
import { MartaLogo } from './MartaLogo';

interface SidebarProps {
  agents: Agent[];
  currentAgentId: string | null;
  onSelectAgent: (id: string | null) => void;
  onCreateAgent: () => void;
  onLogout: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  chatSessions: ChatSession[];
  onSelectSession: (id: string) => void;
}

type SidebarView = 'main' | 'agents' | 'history';

export const Sidebar: React.FC<SidebarProps> = ({
  agents,
  currentAgentId,
  onSelectAgent,
  onCreateAgent,
  onLogout,
  isOpen,
  toggleSidebar,
  chatSessions,
  onSelectSession
}) => {
  const [currentView, setCurrentView] = useState<SidebarView>('main');

  // Helper to handle navigation
  const navigateTo = (view: SidebarView) => setCurrentView(view);

  // Helper to determine active agent name for display
  const activeAgentName = currentAgentId 
    ? agents.find(a => a.id === currentAgentId)?.name 
    : 'Marta (Padrão)';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-72 bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between shrink-0">
            <div 
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                title="Recarregar aplicação"
            >
                <div className="w-8 h-8 drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]">
                    <MartaLogo className="w-full h-full" />
                </div>
            </div>
            <button onClick={toggleSidebar} className="md:hidden text-gray-500 dark:text-gray-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 relative">
            
            {/* VIEW: MAIN MENU */}
            {currentView === 'main' && (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                    
                    <button 
                        onClick={() => navigateTo('agents')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-gray-100 dark:border-neutral-800 shadow-sm transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900 dark:text-white">Meus Agentes</div>
                                <div className="text-xs text-gray-500">{agents.length + 1} disponíveis</div>
                            </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <button 
                        onClick={() => navigateTo('history')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-gray-100 dark:border-neutral-800 shadow-sm transition-all group"
                    >
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900 dark:text-white">Histórico</div>
                                <div className="text-xs text-gray-500">{chatSessions.length} conversas</div>
                            </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}

            {/* VIEW: AGENTS LIST */}
            {currentView === 'agents' && (
                <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={() => navigateTo('main')}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span>Voltar</span>
                    </button>
                    
                    <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                        {/* Default Marta */}
                        <button
                            onClick={() => {
                                onSelectAgent(null);
                                navigateTo('main');
                                if (window.innerWidth < 768) toggleSidebar();
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                currentAgentId === null 
                                ? 'bg-brand-purple text-white shadow-lg shadow-purple-500/30' 
                                : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-transparent hover:border-gray-200 dark:hover:border-neutral-700'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentAgentId === null ? 'bg-white/20' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <span className="font-medium">Marta (Padrão)</span>
                        </button>

                        {/* Custom Agents */}
                        {agents.map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => {
                                    onSelectAgent(agent.id);
                                    navigateTo('main');
                                    if (window.innerWidth < 768) toggleSidebar();
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                    currentAgentId === agent.id 
                                    ? 'bg-brand-purple text-white shadow-lg shadow-purple-500/30' 
                                    : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-transparent hover:border-gray-200 dark:hover:border-neutral-700'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentAgentId === agent.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                                    <span className="font-bold text-xs uppercase">{agent.name.substring(0, 2)}</span>
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="font-medium truncate">{agent.name}</div>
                                    <div className={`text-xs truncate ${currentAgentId === agent.id ? 'text-white/70' : 'text-gray-400'}`}>{agent.role}</div>
                                </div>
                            </button>
                        ))}

                        <button 
                            onClick={onCreateAgent}
                            className="w-full flex items-center justify-center gap-2 p-3 mt-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-neutral-700 text-gray-400 hover:text-brand-purple hover:border-brand-purple transition-all group"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <span className="font-medium">Criar Novo Agente</span>
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW: HISTORY LIST */}
            {currentView === 'history' && (
                <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={() => navigateTo('main')}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span>Voltar</span>
                    </button>

                    <h3 className="text-lg font-bold mb-4 px-1">Histórico de Conversas</h3>

                    <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                        {chatSessions.length === 0 ? (
                             <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span className="text-sm text-gray-500">Nenhum histórico recente.</span>
                             </div>
                        ) : (
                            chatSessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => {
                                        onSelectSession(session.id);
                                        navigateTo('main');
                                        if (window.innerWidth < 768) toggleSidebar();
                                    }}
                                    className="w-full text-left p-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 transition-all group"
                                >
                                    <div className="font-medium text-sm text-gray-900 dark:text-gray-200 truncate group-hover:text-brand-blue transition-colors">
                                        {session.messages[0]?.content || 'Nova Conversa'}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(session.messages[0]?.timestamp || Date.now()).toLocaleDateString()}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-black/50 space-y-3 shrink-0">
            <button 
                onClick={onLogout}
                className="w-full py-2 px-4 bg-white dark:bg-black hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 border border-red-100 dark:border-red-900/30 hover:border-red-200 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                <span>Sair</span>
            </button>
        </div>
      </aside>
    </>
  );
};