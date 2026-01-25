
import React, { useState } from 'react';
import { Agent, ChatSession } from '../types';

interface SidebarProps {
  agents: Agent[];
  currentAgentId: string | null;
  onSelectAgent: (id: string | null) => void;
  onCreateAgent: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  chatSessions: ChatSession[];
  onSelectSession: (id: string) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

type SidebarView = 'main' | 'agents' | 'history';

export const Sidebar: React.FC<SidebarProps> = ({
  agents,
  currentAgentId,
  onSelectAgent,
  onCreateAgent,
  isOpen,
  toggleSidebar,
  chatSessions,
  onSelectSession,
  isCollapsed,
  toggleCollapse
}) => {
  const [currentView, setCurrentView] = useState<SidebarView>('main');

  const navigateTo = (view: SidebarView) => setCurrentView(view);

  // Helper for consistent minimal list items
  const MinimalItem = ({ 
    icon, 
    label, 
    subLabel, 
    onClick, 
    active = false, 
    actionIcon = null 
  }: any) => (
    <button 
        onClick={onClick}
        className={`
            w-full group flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200
            ${active 
                ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'}
            ${isCollapsed ? 'justify-center' : ''}
        `}
        title={label}
    >
        <div className={`shrink-0 transition-colors ${active ? 'text-brand-purple' : 'group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
            {icon}
        </div>
        
        {!isCollapsed && (
            <div className="flex-1 text-left overflow-hidden">
                <div className={`text-sm truncate ${active ? 'font-semibold' : 'font-medium'}`}>
                    {label}
                </div>
                {subLabel && (
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                        {subLabel}
                    </div>
                )}
            </div>
        )}
        
        {!isCollapsed && actionIcon && (
            <div className="text-gray-300 group-hover:text-gray-500 dark:text-neutral-700 dark:group-hover:text-neutral-500 transition-colors">
                {actionIcon}
            </div>
        )}
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 
          bg-white dark:bg-black 
          border-r border-gray-100 dark:border-white/5 
          transform transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-[80px]' : 'md:w-[280px] w-[280px]'}
        `}
      >
        {/* Header / Brand Area (Minimal) */}
        <div className={`h-16 flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'px-6 justify-between'}`}>
             {!isCollapsed && (
                 <span className="text-xs font-mono font-bold tracking-[0.2em] text-gray-400 uppercase">Menu</span>
             )}
             
             {/* Mobile Close */}
             <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar space-y-6">
            
            {/* VIEW: MAIN MENU */}
            {currentView === 'main' && (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300 space-y-1">
                    
                    <MinimalItem 
                        onClick={() => navigateTo('agents')}
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        label="Agentes"
                        subLabel={`${agents.length + 1} ativos`}
                        actionIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>}
                    />

                    <MinimalItem 
                        onClick={() => navigateTo('history')}
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        label="Histórico"
                        subLabel={`${chatSessions.length} conversas`}
                        actionIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>}
                    />

                    {/* Divider if needed later */}
                </div>
            )}

            {/* VIEW: AGENTS LIST */}
            {currentView === 'agents' && (
                <div className="animate-in fade-in slide-in-from-right-2 duration-300 flex flex-col h-full">
                    <button 
                        onClick={() => navigateTo('main')}
                        className={`flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 pl-2 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        {!isCollapsed && <span>VOLTAR</span>}
                    </button>
                    
                    <div className="space-y-1">
                        <MinimalItem
                            onClick={() => {
                                onSelectAgent(null);
                                navigateTo('main');
                                if (window.innerWidth < 768) toggleSidebar();
                            }}
                            active={currentAgentId === null}
                            icon={
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold ${currentAgentId === null ? 'border-brand-purple text-brand-purple' : 'border-gray-300 text-gray-400'}`}>
                                    M
                                </div>
                            }
                            label="Marta (Padrão)"
                            subLabel="Assistente Geral"
                        />

                        {agents.map((agent) => (
                            <MinimalItem
                                key={agent.id}
                                onClick={() => {
                                    onSelectAgent(agent.id);
                                    navigateTo('main');
                                    if (window.innerWidth < 768) toggleSidebar();
                                }}
                                active={currentAgentId === agent.id}
                                icon={
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold uppercase ${currentAgentId === agent.id ? 'border-brand-purple text-brand-purple' : 'border-gray-300 text-gray-400'}`}>
                                        {agent.name.substring(0, 1)}
                                    </div>
                                }
                                label={agent.name}
                                subLabel={agent.role}
                            />
                        ))}

                        <div className="pt-2">
                            <button 
                                onClick={onCreateAgent}
                                className={`w-full flex items-center gap-2 p-2 rounded-lg border border-dashed border-gray-200 dark:border-neutral-800 text-gray-400 hover:text-brand-purple hover:border-brand-purple/30 transition-all text-xs font-medium ${isCollapsed ? 'justify-center aspect-square' : 'justify-center'}`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                {!isCollapsed && "Novo Agente"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: HISTORY LIST */}
            {currentView === 'history' && (
                <div className="animate-in fade-in slide-in-from-right-2 duration-300 flex flex-col h-full">
                    <button 
                        onClick={() => navigateTo('main')}
                        className={`flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 pl-2 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        {!isCollapsed && <span>VOLTAR</span>}
                    </button>

                    <div className="space-y-1">
                        {chatSessions.length === 0 ? (
                             <div className="text-center py-10">
                                <span className="text-xs text-gray-400">Sem histórico.</span>
                             </div>
                        ) : (
                            chatSessions.map((session) => (
                                <MinimalItem
                                    key={session.id}
                                    onClick={() => {
                                        onSelectSession(session.id);
                                        navigateTo('main');
                                        if (window.innerWidth < 768) toggleSidebar();
                                    }}
                                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                                    label={session.messages[0]?.content || 'Nova Conversa'}
                                    subLabel={new Date(session.messages[0]?.timestamp || Date.now()).toLocaleDateString()}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}

        </div>

        {/* Footer Actions - Pure Minimalist */}
        <div className="p-3 space-y-1 shrink-0 bg-white dark:bg-black border-t border-gray-50 dark:border-white/5">
            
            {/* Toggle Collapse */}
            <button 
                onClick={toggleCollapse}
                className={`w-full flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Expandir" : "Minimizar"}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isCollapsed ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    )}
                </svg>
                {!isCollapsed && <span className="text-sm font-medium">Recolher</span>}
            </button>
        </div>
      </aside>
    </>
  );
}
