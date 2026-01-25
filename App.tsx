import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, generateImage, generateVideo, generateSpeech, transcribeAudio } from './services/geminiService';
import { Message, AppMode, Agent, ChatSession } from './types';
import { LiveInterface } from './components/LiveInterface';
import { AuthPage } from './components/AuthPage';
import { PricingPage } from './components/PricingPage';
import { Sidebar } from './components/Sidebar';
import { CreateAgentModal } from './components/CreateAgentModal';
import { TypingEffect } from './components/TypingEffect';
import { MartaLogo } from './components/MartaLogo';
import { OutOfCreditsModal } from './components/OutOfCreditsModal'; 
import { TemplatesGallery } from './components/TemplatesGallery';
import { ImageGallery } from './components/ImageGallery'; 
import { AccountantGallery } from './components/AccountantGallery'; 
import { LegalGallery } from './components/LegalGallery'; 
import { StudyGallery } from './components/StudyGallery'; // Imported Study Gallery
import { API_KEY, MARTA_SYSTEM_INSTRUCTION } from './constants';

const INITIAL_FREE_CREDITS = 3; 

const QUICK_ACTIONS = [
  { 
    label: 'Escritor', 
    prompt: 'Crie um esboço detalhado para um ebook sobre ', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20 hover:border-orange-500/50'
  },
  { 
    label: 'Modo Contador', 
    prompt: 'Atue como um contador sênior e me ajude com ', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20 hover:border-teal-500/50'
  },
  { 
    label: 'Modo Jurídico', 
    prompt: 'Atue como um advogado sênior e me auxilie com ', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    border: 'border-indigo-200 hover:border-indigo-500/50'
  },
  { 
    label: 'Criar imagem', 
    prompt: 'Gere uma imagem de ', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20 hover:border-yellow-500/50'
  },
  { 
    label: 'Estudos', 
    prompt: 'Crie um plano de estudos completo sobre ', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg>,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20 hover:border-rose-500/50'
  },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  
  // Model Selection State
  const [modelMode, setModelMode] = useState<'fast' | 'thinking'>('fast');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  // Auth & Limit States
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [dailyCredits, setDailyCredits] = useState(0); 
  const [purchasedCredits, setPurchasedCredits] = useState(0); 
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOutOfCreditsModal, setShowOutOfCreditsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  
  // Templates Gallery State
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false); 
  const [showAccountantGallery, setShowAccountantGallery] = useState(false);
  const [showLegalGallery, setShowLegalGallery] = useState(false);
  const [showStudyGallery, setShowStudyGallery] = useState(false); // New state for Study Gallery
  
  const totalAvailableCredits = isLoggedIn 
      ? (dailyCredits + purchasedCredits) - creditsUsed
      : INITIAL_FREE_CREDITS - creditsUsed;

  const [view, setView] = useState<'chat' | 'pricing'>('chat');

  // Agent System
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
      {
          id: 'session-1',
          messages: [{ id: 'm1', role: 'user', content: 'Planejamento estratégico Q4', type: 'text', timestamp: Date.now() - 100000 }]
      },
      {
          id: 'session-2',
          messages: [{ id: 'm2', role: 'user', content: 'Ideias de copy para Instagram', type: 'text', timestamp: Date.now() - 200000 }]
      },
      {
          id: 'session-3',
          messages: [{ id: 'm3', role: 'user', content: 'Análise de contrato de leasing', type: 'text', timestamp: Date.now() - 300000 }]
      }
  ]);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [audioState, setAudioState] = useState<{id: string, state: 'loading' | 'playing'} | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModelSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const checkLimitAndProceed = (cost: number = 1): boolean => {
    if (totalAvailableCredits >= cost) {
        setCreditsUsed(prev => prev + cost);
        return true;
    }
    setMessages([]); 
    setShowOutOfCreditsModal(true); 
    return false;
  };

  const handlePurchase = (amount: number) => {
      setPurchasedCredits(prev => prev + amount);
      setIsLoggedIn(true);
      if (dailyCredits === 0) setDailyCredits(5);
      if (view === 'pricing') setView('chat');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCreditsUsed(0); 
    setDailyCredits(5);
    setShowAuthModal(false);
    setView('chat');
  };
  
  const handleConversionComplete = (creditsAdded: number) => {
      setIsLoggedIn(true);
      setDailyCredits(5);
      setCreditsUsed(0);
      if (creditsAdded > 0) setPurchasedCredits(prev => prev + creditsAdded);
      setShowOutOfCreditsModal(false);
      setView('chat');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDailyCredits(0);
    setCreditsUsed(0); 
    setCurrentAgentId(null);
    setIsSidebarOpen(false);
    setShowProfileMenu(false);
  };

  const handleCreateAgent = (agent: Agent) => {
    setAgents(prev => [...prev, agent]);
    setShowCreateAgentModal(false);
  };

  const handleSelectSession = (sessionId: string) => {
      const session = chatSessions.find(s => s.id === sessionId);
      if (session) {
          setMessages(session.messages);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
      }
  };

  // Updated Handler for Quick Actions - Opens Gallery based on context
  const handleQuickAction = (promptPrefix: string) => {
    // Determine which gallery to open
    if (promptPrefix.toLowerCase().includes('imagem') || promptPrefix.toLowerCase().includes('gere uma imagem')) {
        setShowImageGallery(true);
        setShowTemplates(false);
        setShowAccountantGallery(false);
        setShowLegalGallery(false);
        setShowStudyGallery(false);
        setTimeout(() => {
            const element = document.getElementById('image-gallery');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    } else if (promptPrefix.toLowerCase().includes('contador') || promptPrefix.toLowerCase().includes('contábil')) {
        setShowAccountantGallery(true);
        setShowImageGallery(false);
        setShowTemplates(false);
        setShowLegalGallery(false);
        setShowStudyGallery(false);
        setTimeout(() => {
            const element = document.getElementById('accountant-gallery');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    } else if (promptPrefix.toLowerCase().includes('advogado') || promptPrefix.toLowerCase().includes('jurídico')) {
        setShowLegalGallery(true);
        setShowAccountantGallery(false);
        setShowImageGallery(false);
        setShowTemplates(false);
        setShowStudyGallery(false);
        setTimeout(() => {
            const element = document.getElementById('legal-gallery');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    } else if (promptPrefix.toLowerCase().includes('estudos') || promptPrefix.toLowerCase().includes('plano de estudos')) {
        setShowStudyGallery(true);
        setShowLegalGallery(false);
        setShowAccountantGallery(false);
        setShowImageGallery(false);
        setShowTemplates(false);
        setTimeout(() => {
            const element = document.getElementById('study-gallery');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    } else {
        setShowTemplates(true);
        setShowImageGallery(false);
        setShowAccountantGallery(false);
        setShowLegalGallery(false);
        setShowStudyGallery(false);
        setTimeout(() => {
            const element = document.getElementById('templates-gallery');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
  };

  const getCurrentSystemInstruction = () => {
      if (!currentAgentId) return MARTA_SYSTEM_INSTRUCTION;
      const agent = agents.find(a => a.id === currentAgentId);
      if (!agent) return MARTA_SYSTEM_INSTRUCTION;
      return `
### MODO AGENTE ESPECIALISTA ATIVADO
### IDENTIDADE
Nome: ${agent.name}
Função Primária: ${agent.role} (Baseado no núcleo Marta)
### CONTEXTO E INSTRUÇÕES DO USUÁRIO
${agent.instructions}
---
${MARTA_SYSTEM_INSTRUCTION}
      `;
  };

  const stopAudio = () => {
    if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
    }
    setAudioState(null);
  };

  const handleSpeak = async (text: string, msgId: string) => {
    if (audioState?.id === msgId && audioState.state === 'playing') {
        stopAudio();
        return;
    }
    stopAudio(); 
    setAudioState({ id: msgId, state: 'loading' });

    try {
        const audioBuffer = await generateSpeech(text);
        if (!audioBuffer) throw new Error("Audio generation failed");
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const buffer = await ctx.decodeAudioData(audioBuffer);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setAudioState(null);
        source.start();
        currentSourceRef.current = source;
        setAudioState({ id: msgId, state: 'playing' });
    } catch (e) {
        console.error("TTS Error", e);
        setAudioState(null);
        alert("Não foi possível gerar o áudio no momento.");
    }
  };

  const handlePrint = (content: string) => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
          printWindow.document.write(`<html><head><title>Marta - Impressão</title></head><body>${content}<script>window.print(); window.onafterprint = function(){ window.close() };</script></body></html>`);
          printWindow.document.close();
      }
  };

  const handleShare = async (content: string) => {
      if (navigator.share) {
          try {
              await navigator.share({ title: 'Resposta da Marta', text: content });
          } catch (err) { console.log('Error sharing:', err); }
      } else {
          navigator.clipboard.writeText(content);
          alert('Texto copiado para a área de transferência!');
      }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!checkLimitAndProceed()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      type: 'text',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      let responseText = '';
      let mediaUrl = undefined;
      let msgType: 'text' | 'image' | 'video' = 'text';

      const systemInstruction = getCurrentSystemInstruction();
      const rawResponse = await sendMessageToGemini(history, userMsg.content, systemInstruction, modelMode);
      responseText = rawResponse;

      if (rawResponse.startsWith("Gerando imagem:")) {
        const prompt = rawResponse.replace("Gerando imagem:", "").trim();
        msgType = 'image';
        responseText = `✨ Gerando imagem: "${prompt}"`;
        const url = await generateImage(prompt);
        if (url) mediaUrl = url;
        else { responseText = "Falha ao gerar a imagem. Tente novamente."; msgType = 'text'; }
      } else if (rawResponse.startsWith("Iniciando protocolo de vídeo:")) {
        const prompt = rawResponse.replace("Iniciando protocolo de vídeo:", "").trim();
        msgType = 'video';
        
        if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
             responseText = "Para gerar vídeos com Veo, você precisa configurar uma chave de API paga.";
             await window.aistudio.openSelectKey();
        } else {
             responseText = `🎥 Gerando vídeo: "${prompt}"`;
             const url = await generateVideo(prompt);
             if (url) mediaUrl = url;
             else { responseText = "Falha ao gerar o vídeo. Tente novamente."; msgType = 'text'; }
        }
      } 

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        type: msgType,
        mediaUrl: mediaUrl,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Ocorreu um erro no processamento. Meus sistemas detectaram uma falha.",
        type: 'text',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = async () => {
    if (!checkLimitAndProceed()) return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = (reader.result as string).split(',')[1];
                setInputValue("Ouvindo...");
                const text = await transcribeAudio(base64);
                setInputValue(text);
            };
            reader.readAsDataURL(blob);
            stream.getTracks().forEach(t => t.stop());
        };
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 3000);
    } catch (e) { console.error("Mic access denied", e); }
  };

  const handleLiveMode = () => {
      if(checkLimitAndProceed()) { setMode(AppMode.LIVE); }
  }

  const hasMessages = messages.length > 0;
  const handleNavigate = (target: 'chat' | 'pricing') => { setView(target); };
  const openAuthModal = (mode: 'login' | 'register' = 'login') => { setAuthInitialMode(mode); setShowAuthModal(true); };

  const sharedProps = {
    onNavigate: handleNavigate,
    onLogin: () => openAuthModal('login'),
    isDarkMode,
    toggleTheme,
    availableCredits: totalAvailableCredits,
    onPurchase: handlePurchase 
  };

  if (view === 'pricing') { return <PricingPage {...sharedProps} />; }

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans flex overflow-hidden selection:bg-brand-purple selection:text-white transition-colors duration-300">
      
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

      {/* Auth Modal Overlay */}
      {showAuthModal && (
          <AuthPage 
            onLoginSuccess={handleLoginSuccess} 
            onClose={() => setShowAuthModal(false)} 
            initialIsRegister={authInitialMode === 'register'}
          />
      )}

      {/* NEW: Out Of Credits Conversion Flow */}
      {showOutOfCreditsModal && (
          <OutOfCreditsModal 
            onClose={() => setShowOutOfCreditsModal(false)} 
            onComplete={handleConversionComplete}
          />
      )}

      {/* Create Agent Modal */}
      {showCreateAgentModal && (
          <CreateAgentModal 
            onClose={() => setShowCreateAgentModal(false)}
            onSave={handleCreateAgent}
          />
      )}

      {mode === AppMode.LIVE && (
        <LiveInterface onClose={() => setMode(AppMode.CHAT)} />
      )}

      {/* Sidebar - Only visible when logged in */}
      {isLoggedIn && (
          <Sidebar 
            agents={agents}
            currentAgentId={currentAgentId}
            onSelectAgent={setCurrentAgentId}
            onCreateAgent={() => setShowCreateAgentModal(true)}
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            chatSessions={chatSessions}
            onSelectSession={handleSelectSession}
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
      )}

      {/* Main Content - Now the main scroll container */}
      <main className="flex-1 flex flex-col relative z-10 w-full h-[100dvh] overflow-y-auto no-scrollbar scroll-smooth">

        {/* Minimalist Floating Header */}
        <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto">
                {isLoggedIn && (
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                )}
                
                <div onClick={() => window.location.reload()} className="flex items-center gap-2 cursor-pointer transition-all hover:scale-105 group">
                    <div className="w-8 h-8"> <MartaLogo className="w-full h-full" /> </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3 pointer-events-auto">
                {!isLoggedIn && (
                    <div className="flex items-center gap-3">
                         <button onClick={() => setView('pricing')} className="flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/5 dark:bg-brand-purple/10 hover:bg-brand-purple/20 cursor-pointer transition-colors backdrop-blur-md">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-pink animate-pulse"></div>
                              <span className="text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">
                                  {totalAvailableCredits} <span className="hidden sm:inline">Créditos</span>
                              </span>
                         </button>
                    </div>
                )}
                
                {isLoggedIn && (
                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 flex items-center justify-center text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors outline-none focus:ring-2 focus:ring-brand-purple/50 backdrop-blur-md">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </button>
                        
                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-100 dark:border-neutral-800 py-2 z-[100] origin-top-right ring-1 ring-black/5 dark:ring-white/5 focus:outline-none">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Minha Conta</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">usuario@marta.ai</p>
                                    <div className="mt-2 text-xs font-mono text-brand-purple font-bold">{totalAvailableCredits} Créditos Disponíveis</div>
                                </div>
                                <div className="py-1">
                                    <button onClick={() => setShowProfileMenu(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> Perfil
                                    </button>
                                    
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-3">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Sair
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Messages Container - Auto expands in flex flow */}
        {hasMessages && (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-24 pb-32">
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[95%] sm:max-w-[80%] rounded-2xl p-4 sm:p-6 ${
                                msg.role === 'user' 
                                ? 'bg-brand-blue text-white rounded-tr-sm' 
                                : 'bg-transparent text-gray-800 dark:text-gray-200 pl-0'
                            }`}>
                                {msg.role === 'model' && (
                                    <div className="flex items-center gap-2 mb-2 text-brand-purple text-xs font-bold tracking-wider uppercase">
                                        {currentAgentId ? agents.find(a => a.id === currentAgentId)?.name : 'MARTA'}
                                    </div>
                                )}
                                {msg.content && (
                                   msg.role === 'model' 
                                   ? <TypingEffect text={msg.content} />
                                   : <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                )}
                                {msg.type === 'image' && msg.mediaUrl && (
                                    <img src={msg.mediaUrl} alt="Generated" className="rounded-lg shadow-xl border border-gray-200 dark:border-neutral-700 w-full max-w-md mt-4" />
                                )}
                                {msg.type === 'video' && msg.mediaUrl && (
                                    <video src={msg.mediaUrl} controls className="rounded-lg shadow-xl border border-gray-200 dark:border-neutral-700 w-full max-w-md mt-4" />
                                )}
                                {msg.role === 'model' && msg.type === 'text' && (
                                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800/50 opacity-90">
                                        <button onClick={() => handleSpeak(msg.content, msg.id)} className={`p-2 rounded-full transition-colors flex items-center justify-center ${audioState?.id === msg.id && audioState.state === 'playing' ? 'text-brand-purple bg-brand-purple/10' : 'text-gray-400 hover:text-brand-purple hover:bg-gray-100 dark:hover:bg-neutral-800'}`} disabled={audioState?.id === msg.id && audioState.state === 'loading'}>
                                            {audioState?.id === msg.id && audioState.state === 'loading' ? (<svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : audioState?.id === msg.id && audioState.state === 'playing' ? (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>) : (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>)}
                                        </button>
                                        <button onClick={() => handlePrint(msg.content)} className="p-2 rounded-full text-gray-400 hover:text-brand-purple hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                        </button>
                                        <button onClick={() => handleShare(msg.content)} className="p-2 rounded-full text-gray-400 hover:text-brand-purple hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start ml-2">
                            <span className="text-brand-purple text-sm animate-pulse">Processando...</span>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        )}

        {/* Input Area / Home Screen - Now relative/block to allow scrolling away */}
        <div className={!hasMessages 
            ? `relative w-full flex flex-col items-center p-6 animate-in fade-in duration-500 min-h-[calc(100vh-80px)] ${showTemplates || showImageGallery || showAccountantGallery || showLegalGallery || showStudyGallery ? 'justify-start pt-28' : 'justify-center'}`
            : "fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white dark:from-black dark:via-black to-transparent pt-10 z-20 w-full"
        }>
             {!hasMessages && (
                <div className={`w-full max-w-5xl space-y-4 mb-8 text-center animate-in slide-in-from-bottom-4 duration-700 ${showTemplates || showImageGallery || showAccountantGallery || showLegalGallery || showStudyGallery ? 'mt-0' : 'mt-10'}`}>
                    {currentAgentId && (
                        <div className="w-24 h-24 mx-auto mb-6">
                            <div className="w-full h-full rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-4xl font-bold text-gray-400">
                                {agents.find(a => a.id === currentAgentId)?.name.substring(0,1)}
                            </div>
                        </div>
                    )}
                    {currentAgentId ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                                {`Olá, sou ${agents.find(a => a.id === currentAgentId)?.name}`}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-lg mx-auto">{agents.find(a => a.id === currentAgentId)?.role}</p>
                        </>
                    ) : (
                        <div className="space-y-2 flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium">
                                <span>Fale com a</span>
                                <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">Marta</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-medium text-gray-500 dark:text-gray-400 tracking-tighter pb-2">O que vamos criar hoje?</h1>
                        </div>
                    )}
                </div>
            )}
             
            <div className="max-w-3xl mx-auto w-full relative group shrink-0">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 ${!hasMessages ? 'opacity-100' : ''}`}></div>
                <div className="relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-[2rem] p-4 shadow-xl">
                    <textarea 
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        placeholder={`Enviar mensagem para ${currentAgentId ? agents.find(a => a.id === currentAgentId)?.name : 'Marta'}...`}
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none px-2 text-lg h-14 no-scrollbar"
                    />
                    
                    <div className="flex justify-between items-center mt-2 px-1">
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                            <button onClick={handleMicClick} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </button>
                            <button onClick={handleLiveMode} className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-purple-500/20" title="Conversar com Marta">
                                <MartaLogo className="w-full h-full" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                             <div className="relative" ref={modelSelectorRef}>
                                <button onClick={() => setShowModelSelector(!showModelSelector)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${modelMode === 'fast' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'}`} title={modelMode === 'fast' ? 'Marta Rápida' : 'Marta Pensativa'}>
                                    {modelMode === 'fast' ? (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>) : (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>)}
                                </button>
                                {showModelSelector && (
                                    <div className="absolute bottom-full right-0 mb-3 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800 p-2 z-50 animate-in slide-in-from-bottom-2 duration-200">
                                        <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Modelos de IA</div>
                                        <button onClick={() => { setModelMode('fast'); setShowModelSelector(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${modelMode === 'fast' ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-neutral-800'}`}>
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                                            <div><div className="text-sm font-bold text-gray-900 dark:text-white">Marta Rápida</div><div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Respostas instantâneas para tarefas diárias.</div></div>
                                        </button>
                                        <button onClick={() => { setModelMode('thinking'); setShowModelSelector(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left mt-1 ${modelMode === 'thinking' ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-neutral-800'}`}>
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></div>
                                            <div><div className="text-sm font-bold text-gray-900 dark:text-white">Marta Pensativa</div><div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Raciocínio profundo e criatividade expandida.</div></div>
                                        </button>
                                    </div>
                                )}
                             </div>
                            <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black flex items-center justify-center transition-colors disabled:opacity-50">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Always visible if no messages */}
            {!hasMessages && (
                <div className="mt-8 flex overflow-x-auto gap-3 w-full max-w-5xl px-4 no-scrollbar snap-x shrink-0 pb-8 sticky top-0 z-40 py-4 pointer-events-none">
                    {QUICK_ACTIONS.map((action, idx) => (
                        <button key={idx} onClick={() => handleQuickAction(action.prompt)} className={`pointer-events-auto flex-shrink-0 snap-center flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 group bg-white/5 dark:bg-neutral-900/80 backdrop-blur-sm ${action.border} border-gray-200 dark:border-neutral-800 hover:scale-105 hover:shadow-lg whitespace-nowrap`}>
                            <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>{action.icon}</div>
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{action.label}</span>
                        </button>
                    ))}
                </div>
            )}
            
            {/* NEW: Templates Gallery Section - Full Width */}
            {!hasMessages && showTemplates && (
                <div className="mt-0 w-full px-0 pb-12 animate-in fade-in duration-500 flex-1">
                     <TemplatesGallery onClose={() => setShowTemplates(false)} />
                </div>
            )}

            {/* NEW: Image Gallery Section - Full Width */}
            {!hasMessages && showImageGallery && (
                <div className="mt-0 w-full px-0 pb-12 animate-in fade-in duration-500 flex-1">
                     <ImageGallery onClose={() => setShowImageGallery(false)} />
                </div>
            )}

            {/* NEW: Accountant Gallery Section - Full Width */}
            {!hasMessages && showAccountantGallery && (
                <div className="mt-0 w-full px-0 pb-12 animate-in fade-in duration-500 flex-1">
                     <AccountantGallery onClose={() => setShowAccountantGallery(false)} />
                </div>
            )}

            {/* NEW: Legal Gallery Section - Full Width */}
            {!hasMessages && showLegalGallery && (
                <div className="mt-0 w-full px-0 pb-12 animate-in fade-in duration-500 flex-1">
                     <LegalGallery onClose={() => setShowLegalGallery(false)} />
                </div>
            )}

            {/* NEW: Study Gallery Section - Full Width */}
            {!hasMessages && showStudyGallery && (
                <div className="mt-0 w-full px-0 pb-12 animate-in fade-in duration-500 flex-1">
                     <StudyGallery onClose={() => setShowStudyGallery(false)} />
                </div>
            )}
        </div>

      </main>
    </div>
  );
}
