import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, generateImage, generateVideo, generateSpeech, transcribeAudio } from './services/geminiService';
import { Message, AppMode, Agent, ChatSession } from './types';
import { LiveInterface } from './components/LiveInterface';
import { AuthPage } from './components/AuthPage';
import { FeaturesPage } from './components/FeaturesPage';
import { LibraryPage } from './components/LibraryPage';
import { SolutionsPage } from './components/SolutionsPage';
import { PricingPage } from './components/PricingPage';
import { Sidebar } from './components/Sidebar';
import { CreateAgentModal } from './components/CreateAgentModal';
import { TypingEffect } from './components/TypingEffect';
import { MartaLogo } from './components/MartaLogo';
import { API_KEY, MARTA_SYSTEM_INSTRUCTION } from './constants';

const INITIAL_FREE_CREDITS = 50;

const QUICK_ACTIONS = [
  { 
    label: 'Criar Ebook', 
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
    label: 'Criar imagem', 
    prompt: 'Gere uma imagem de ', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20 hover:border-yellow-500/50'
  },
  { 
    label: 'Criar vídeo', 
    prompt: 'Crie um vídeo de ', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20 hover:border-green-500/50'
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

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  
  // Auth & Limit States (Simulating Credit System)
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // View State (Chat vs Features vs Library vs Solutions vs Pricing)
  // 'auth' removed from views as it's now a modal
  const [view, setView] = useState<'chat' | 'features' | 'library' | 'solutions' | 'pricing'>('chat');

  // Agent System
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  
  // Chat History State (Mock Data for UI demonstration)
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
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Audio Playback State
  const [audioState, setAudioState] = useState<{id: string, state: 'loading' | 'playing'} | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Profile Menu State
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
    // Sync React state with DOM on mount
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
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

  // Helper to check limits
  const checkLimitAndProceed = (cost: number = 1): boolean => {
    if (isLoggedIn) return true;
    
    // Simple demo logic: 10 credits per action for free tier to simulate usage
    const actualCost = 10; 
    
    if (creditsUsed + actualCost > INITIAL_FREE_CREDITS) {
      setShowLoginModal(true);
      return false;
    }
    
    setCreditsUsed(prev => prev + actualCost);
    return true;
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setView('chat');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentAgentId(null);
    setIsSidebarOpen(false);
    setShowProfileMenu(false);
  };

  const handleCreateAgent = (newAgent: Agent) => {
      setAgents(prev => [...prev, newAgent]);
      setCurrentAgentId(newAgent.id);
      // Optional: Add a system message saying the agent is ready
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          content: `Agente **${newAgent.name}** ativado. Especialidade: ${newAgent.role}. \n\nEstou pronta para seguir suas instruções: "${newAgent.instructions}"`,
          type: 'text',
          timestamp: Date.now()
      }]);
  };

  const handleSelectSession = (sessionId: string) => {
      const session = chatSessions.find(s => s.id === sessionId);
      if (session) {
          // In a real app, this would load the full history. 
          // For now we just load the first message to simulate context switching
          setMessages(session.messages);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
      }
  };

  const handleQuickAction = (promptPrefix: string) => {
    setInputValue(promptPrefix);
    if (textareaRef.current) {
      textareaRef.current.focus();
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
Abaixo seguem as diretrizes operacionais padrão do núcleo Marta, que você deve respeitar a menos que contradigam as instruções específicas acima.

${MARTA_SYSTEM_INSTRUCTION}
      `;
  };

  // Action Buttons Handlers
  const stopAudio = () => {
    if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
    }
    setAudioState(null);
  };

  const handleSpeak = async (text: string, msgId: string) => {
    // If clicking same button while playing, stop it
    if (audioState?.id === msgId && audioState.state === 'playing') {
        stopAudio();
        return;
    }
    
    stopAudio(); // Stop any other audio
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
          printWindow.document.write(`
              <html>
                  <head>
                      <title>Marta - Impressão</title>
                      <style>
                          body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #111827; }
                          h1 { color: #9333EA; margin-bottom: 20px; font-size: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
                          .content { white-space: pre-wrap; }
                      </style>
                  </head>
                  <body>
                      <h1>Marta</h1>
                      <div class="content">${content}</div>
                      <script>window.print(); window.onafterprint = function(){ window.close() };</script>
                  </body>
              </html>
          `);
          printWindow.document.close();
      }
  };

  const handleShare = async (content: string) => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'Resposta da Marta',
                  text: content,
              });
          } catch (err) {
              console.log('Error sharing:', err);
          }
      } else {
          navigator.clipboard.writeText(content);
          alert('Texto copiado para a área de transferência!');
      }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    // Check limit before processing
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

      // Heuristic detection for actions based on keywords in prompt
      let responseText = '';
      let mediaUrl = undefined;
      let msgType: 'text' | 'image' | 'video' = 'text';

      const systemInstruction = getCurrentSystemInstruction();
      const rawResponse = await sendMessageToGemini(history, userMsg.content, systemInstruction);
      responseText = rawResponse;

      if (rawResponse.startsWith("Gerando imagem:")) {
        const prompt = rawResponse.replace("Gerando imagem:", "").trim();
        msgType = 'image';
        responseText = `✨ Gerando imagem: "${prompt}"`;
        const url = await generateImage(prompt);
        if (url) mediaUrl = url;
        else {
            responseText = "Falha ao gerar a imagem. Tente novamente.";
            msgType = 'text';
        }
      } else if (rawResponse.startsWith("Iniciando protocolo de vídeo:")) {
        const prompt = rawResponse.replace("Iniciando protocolo de vídeo:", "").trim();
        msgType = 'video';
        if (!window.aistudio?.hasSelectedApiKey && !API_KEY) {
             responseText = "Para gerar vídeos com Veo, você precisa configurar uma chave de API paga.";
             if(window.aistudio) {
                 await window.aistudio.openSelectKey();
             }
        } else {
             responseText = `🎥 Gerando vídeo: "${prompt}"`;
             const url = await generateVideo(prompt);
             if (url) mediaUrl = url;
             else {
                 responseText = "Falha ao gerar o vídeo. Tente novamente.";
                 msgType = 'text';
             }
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
    // Check limit before recording
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
    } catch (e) {
        console.error("Mic access denied", e);
    }
  };

  const handleLiveMode = () => {
      if(checkLimitAndProceed()) {
          setMode(AppMode.LIVE);
      }
  }

  const hasMessages = messages.length > 0;

  // View Routing (Pages that replace the chat)
  if (view === 'features') {
      return <FeaturesPage onBack={() => setView('chat')} onLogin={() => setShowAuthModal(true)} />;
  }

  if (view === 'library') {
      return <LibraryPage onBack={() => setView('chat')} />;
  }

  if (view === 'solutions') {
      return <SolutionsPage onBack={() => setView('chat')} onLogin={() => setShowAuthModal(true)} />;
  }

  if (view === 'pricing') {
      return <PricingPage onBack={() => setView('chat')} onLogin={() => setShowAuthModal(true)} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans flex relative overflow-hidden selection:bg-brand-purple selection:text-white transition-colors duration-300">
      
      {/* Auth Modal Overlay */}
      {showAuthModal && (
          <AuthPage onLoginSuccess={handleLoginSuccess} onClose={() => setShowAuthModal(false)} />
      )}

      {/* Login Limit Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
            <div className="relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue/10 blur-3xl -z-10"></div>

                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto">
                        <MartaLogo className="w-full h-full" />
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Créditos Esgotados</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Você utilizou todos os seus créditos gratuitos iniciais. Faça upgrade para continuar criando sem limites.
                        </p>
                    </div>

                    <button 
                        onClick={() => { setShowLoginModal(false); setView('pricing'); }}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold tracking-wide hover:shadow-lg hover:shadow-brand-purple/25 transition-all transform hover:scale-[1.02]"
                    >
                        Ver Planos e Créditos
                    </button>
                    
                    <button 
                        onClick={() => setShowLoginModal(false)}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Talvez mais tarde
                    </button>
                </div>
            </div>
        </div>
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
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            chatSessions={chatSessions}
            onSelectSession={handleSelectSession}
          />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 w-full h-screen overflow-hidden">

        {/* Header Bar */}
        <div className="py-4 px-6 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md z-40 transition-colors duration-300 relative">
            <div className="flex items-center gap-3">
                {isLoggedIn && (
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                )}
                
                {/* Marta Brand with GLOW EFFECT - ONLY WHEN LOGGED OUT */}
                {!isLoggedIn && (
                    <div 
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 cursor-pointer transition-all hover:scale-105 group"
                        title="Recarregar aplicação"
                    >
                        <div className="w-8 h-8 drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]">
                            <MartaLogo className="w-full h-full" />
                        </div>
                    </div>
                )}

                {!isLoggedIn && (
                    <>
                        {/* Landing Page Menu */}
                        <nav className="hidden md:flex items-center gap-6 ml-6 border-l border-gray-200 dark:border-neutral-800 pl-6 h-6">
                            <button onClick={() => setView('features')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Funcionalidades</button>
                            <button onClick={() => setView('library')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Biblioteca</button>
                            <button onClick={() => setView('solutions')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Soluções</button>
                            <button onClick={() => setView('pricing')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Preços</button>
                            <button onClick={() => setShowAuthModal(true)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-white transition-colors">Sobre</button>
                        </nav>
                    </>
                )}
            </div>
            
            <div className="flex items-center gap-3">
                 {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 transition-colors"
                >
                    {isDarkMode ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                </button>

                {!isLoggedIn && (
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-gray-200 dark:border-neutral-700 hidden sm:flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse"></div>
                             {INITIAL_FREE_CREDITS - creditsUsed} Créditos
                        </div>
                        <button 
                            onClick={() => setShowAuthModal(true)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 text-xs font-medium text-gray-900 dark:text-gray-200 transition-all flex items-center gap-2"
                        >
                            <span>Entrar</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                )}
                
                {isLoggedIn && (
                    <div className="relative" ref={profileMenuRef}>
                        <button 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 flex items-center justify-center text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors outline-none focus:ring-2 focus:ring-brand-purple/50"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </button>
                        
                        {/* Avatar Dropdown */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-100 dark:border-neutral-800 py-2 z-[100] origin-top-right ring-1 ring-black/5 dark:ring-white/5 focus:outline-none">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Minha Conta</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">usuario@marta.ai</p>
                                </div>
                                
                                <div className="py-1">
                                    <button 
                                        onClick={() => setShowProfileMenu(false)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
                                    >
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Perfil
                                    </button>
                                    
                                    <button 
                                        onClick={() => setShowProfileMenu(false)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
                                    >
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Configurações
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 py-6 pb-32 max-w-4xl mx-auto w-full">
            {!hasMessages ? (
                <div className="hidden">
                   {/* Empty state is now handled by the Start Screen in the Input Area */}
                </div>
            ) : (
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[95%] sm:max-w-[80%] rounded-2xl p-4 sm:p-6 ${
                                msg.role === 'user' 
                                ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-tr-sm' 
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

                                {/* Action Buttons for Model Messages */}
                                {msg.role === 'model' && msg.type === 'text' && (
                                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800/50 opacity-90">
                                        
                                        {/* Listen Button */}
                                        <button 
                                            onClick={() => handleSpeak(msg.content, msg.id)}
                                            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                                                audioState?.id === msg.id && audioState.state === 'playing'
                                                ? 'text-brand-purple bg-brand-purple/10' 
                                                : 'text-gray-400 hover:text-brand-purple hover:bg-gray-100 dark:hover:bg-neutral-800'
                                            }`}
                                            title="Ouvir"
                                            disabled={audioState?.id === msg.id && audioState.state === 'loading'}
                                        >
                                            {audioState?.id === msg.id && audioState.state === 'loading' ? (
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            ) : audioState?.id === msg.id && audioState.state === 'playing' ? (
                                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                            )}
                                        </button>

                                        {/* Print Button */}
                                        <button 
                                            onClick={() => handlePrint(msg.content)}
                                            className="p-2 rounded-full text-gray-400 hover:text-brand-purple hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                            title="Imprimir"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                        </button>

                                        {/* Share Button */}
                                        <button 
                                            onClick={() => handleShare(msg.content)}
                                            className="p-2 rounded-full text-gray-400 hover:text-brand-purple hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                            title="Compartilhar"
                                        >
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
            )}
        </div>

        {/* Input Area - Dynamic Positioning */}
        <div className={!hasMessages 
            ? "absolute inset-0 top-[73px] bg-white dark:bg-black z-30 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500" 
            : "absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white dark:from-black dark:via-black to-transparent pt-10 z-20"
        }>
            
            {/* Greeting (Only in Start Mode) */}
            {!hasMessages && (
                <div className="space-y-4 mb-8 text-center animate-in slide-in-from-bottom-4 duration-700">
                    <div className="w-24 h-24 mx-auto mb-6">
                        {currentAgentId ? (
                            <div className="w-full h-full rounded-2xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-4xl font-bold text-gray-400">
                                {agents.find(a => a.id === currentAgentId)?.name.substring(0,1)}
                            </div>
                        ) : (
                            <MartaLogo className="w-full h-full" />
                        )}
                    </div>
                    
                    {currentAgentId ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                                {`Olá, sou ${agents.find(a => a.id === currentAgentId)?.name}`}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-lg mx-auto">
                                {agents.find(a => a.id === currentAgentId)?.role}
                            </p>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium">
                                Fale com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink font-bold">Marta</span>
                            </p>
                            <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink tracking-tighter pb-2">
                                O que vamos criar hoje?
                            </h1>
                        </div>
                    )}
                </div>
            )}

            {/* The Input Box */}
            <div className="max-w-3xl mx-auto w-full relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 ${!hasMessages ? 'opacity-100' : ''}`}></div>
                <div className="relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-[2rem] p-4 shadow-xl">
                    <textarea 
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder={`Enviar mensagem para ${currentAgentId ? agents.find(a => a.id === currentAgentId)?.name : 'Marta'}...`}
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none px-2 text-lg h-14 no-scrollbar"
                    />
                    
                    <div className="flex justify-between items-center mt-2 px-1">
                        <div className="flex items-center gap-2">
                            {/* Plus Button */}
                            <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                            
                            {/* Mic Button */}
                            <button 
                                onClick={handleMicClick}
                                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-500 dark:text-gray-400 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </button>

                            {/* Live Button */}
                            <button 
                                onClick={handleLiveMode}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg shadow-purple-500/20"
                                title="Conversar com Marta"
                            >
                                <MartaLogo className="w-full h-full" />
                            </button>
                        </div>

                        {/* Send Button */}
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions (Only on start) */}
            {!hasMessages && (
                <div className="mt-8 flex flex-wrap justify-center gap-3 w-full max-w-5xl px-4 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    {QUICK_ACTIONS.map((action, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleQuickAction(action.prompt)}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 group
                                bg-white/5 dark:bg-neutral-900/80 backdrop-blur-sm
                                ${action.border} border-gray-200 dark:border-neutral-800
                                hover:scale-105 hover:shadow-lg
                            `}
                        >
                            <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                                {action.icon}
                            </div>
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>

      </main>
    </div>
  );
}

export default App;