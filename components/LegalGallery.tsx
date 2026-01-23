import React, { useState } from 'react';

type LegalCategory = 'geral' | 'contratos' | 'processual' | 'trabalhista' | 'compliance';

interface LegalTemplateItem {
  id: string;
  category: LegalCategory;
  title: string;
  description: string;
  coverImage?: string; 
  content?: string; // HTML/Text preview
  prompt: string;
  tags: string[];
}

const MOCK_DATA: LegalTemplateItem[] = [
  {
    id: 'leg-1',
    category: 'contratos',
    title: 'Contrato de Vesting',
    description: 'Para startups e retenção de talentos-chave.',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    tags: ['Societário', 'Startups'],
    prompt: "Atue como um advogado especialista em Direito Societário e Startups. Redija as cláusulas principais de um Contrato de Vesting para um funcionário-chave (key talent). Inclua: Cláusula de Cliff de [TEMPO], período total de aquisição de [TEMPO], regras de 'Good Leaver' vs 'Bad Leaver' e cláusula de aceleração em caso de Liquidez (Exit). Mantenha a linguagem formal e proteja os interesses da empresa.",
    content: `<p>Estrutura jurídica focada na retenção de talentos e proteção do Cap Table da empresa.</p>`
  },
  {
    id: 'leg-2',
    category: 'processual',
    title: 'Petição Inicial (Danos Morais)',
    description: 'Modelo base para ações cíveis reparatórias.',
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    tags: ['Processo Civil', 'CPC'],
    prompt: "Atue como advogado civilista. Elabore o esboço de uma Petição Inicial de Ação de Indenização por Danos Morais e Materiais com base no Código de Defesa do Consumidor. Fatos: [DESCREVER FATOS BREVEMENTE]. Estruture com: Endereçamento, Qualificação, Dos Fatos, Do Direito (citando artigos do CDC e CF/88), Dos Pedidos e Valor da Causa.",
    content: `<p>Esqueleto processual robusto conforme o Novo CPC, focado na fundamentação jurídica do dano.</p>`
  },
  {
    id: 'leg-3',
    category: 'compliance',
    title: 'Política de Privacidade (LGPD)',
    description: 'Adequação de site/app à Lei Geral de Proteção de Dados.',
    coverImage: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=800',
    tags: ['LGPD', 'Digital'],
    prompt: "Como especialista em Direito Digital e DPO (Data Protection Officer), crie uma Política de Privacidade para um [SITE/APP] que coleta [TIPOS DE DADOS]. O texto deve estar em conformidade rigorosa com a LGPD (Lei 13.709/2018), abordando: Coleta de dados, Finalidade, Compartilhamento com terceiros, Cookies, Direitos do titular e Contato do Encarregado.",
    content: `<p>Texto mandatório para conformidade digital, cobrindo todos os requisitos da autoridade nacional (ANPD).</p>`
  },
  {
    id: 'leg-4',
    category: 'trabalhista',
    title: 'Contestação Trabalhista',
    description: 'Defesa técnica para reclamações laborais.',
    coverImage: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=800',
    tags: ['CLT', 'Defesa'],
    prompt: "Atue como advogado trabalhista patronal. Estruture os tópicos de uma Contestação em Reclamação Trabalhista onde o reclamante pede [PEDIDO 1] e [PEDIDO 2]. Desenvolva as preliminares de mérito (inépcia, prescrição bienal/quinquenal) e a defesa de mérito negando o vínculo ou as horas extras, citando a Reforma Trabalhista (Lei 13.467/2017).",
    content: `<p>Estratégia de defesa focada em preliminares e ônus da prova segundo a CLT atualizada.</p>`
  },
  {
    id: 'leg-5',
    category: 'geral',
    title: 'Notificação Extrajudicial',
    description: 'Cobrança ou obrigação de fazer antes do litígio.',
    coverImage: 'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?auto=format&fit=crop&q=80&w=800',
    tags: ['Extrajudicial', 'Cobrança'],
    prompt: "Redija uma Notificação Extrajudicial formal para [FINALIDADE: COBRANÇA DE DÍVIDA / CESSAR CONDUTA]. O tom deve ser firme e jurídico, estipulando um prazo de [DIAS] para cumprimento, sob pena de medidas judiciais cabíveis e perdas e danos. Inclua fundamentação no Código Civil.",
    content: `<p>Instrumento para resolução de conflitos amigável, mas com validade jurídica para constituição em mora.</p>`
  }
];

interface LegalGalleryProps {
  onClose: () => void;
}

export const LegalGallery: React.FC<LegalGalleryProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<LegalCategory>('geral');
  const [selectedItem, setSelectedItem] = useState<LegalTemplateItem | null>(null);

  const filteredItems = activeCategory === 'geral' 
    ? MOCK_DATA 
    : MOCK_DATA.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'geral', label: 'Todos' },
    { id: 'contratos', label: 'Contratos' },
    { id: 'processual', label: 'Processual' },
    { id: 'trabalhista', label: 'Trabalhista' },
    { id: 'compliance', label: 'Compliance & LGPD' }
  ];

  const getCategoryColor = (cat: LegalCategory) => {
      switch(cat) {
          case 'contratos': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
          case 'processual': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
          case 'trabalhista': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
          case 'compliance': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      }
  };

  return (
    <div id="legal-gallery" className="w-full relative animate-in slide-in-from-bottom-10 duration-700 min-h-[600px] flex flex-col scroll-mt-48 overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-2xl">
      
      {/* Top Gradient Separator */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent z-10" />

      {/* Background Effect - Marta Logo Colors (Blue, Purple, Pink) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 blur-[100px] animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          <div className="absolute top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 blur-[100px] animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite_2s]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] rounded-full bg-brand-pink/10 dark:bg-brand-pink/20 blur-[100px] animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite_4s]" />
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            
            {/* Top Filters */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as LegalCategory)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border snap-center
                            ${activeCategory === cat.id 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20' 
                            : 'bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800'}
                        `}
                    >
                        {cat.label}
                    </button>
                ))}
                <button onClick={onClose} className="ml-auto md:ml-2 p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors shrink-0">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>

        {/* 
            MOBILE: Compact Vertical List (Flex Row per item)
            DESKTOP: Grid Card Layout (Flex Col per item)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item) => (
                <div 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group cursor-pointer bg-white/80 dark:bg-neutral-900/80 rounded-xl md:rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-row md:flex-col relative h-28 md:h-auto backdrop-blur-sm"
                >
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                        <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${getCategoryColor(item.category)}`}>
                            {item.category.toUpperCase()}
                        </span>
                    </div>

                    {/* Cover Preview */}
                    <div className="w-24 md:w-full h-full md:aspect-video relative overflow-hidden shrink-0">
                        {item.coverImage ? (
                             <>
                                <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-indigo-900/0 transition-colors"></div>
                             </>
                        ) : (
                            <div className="w-full h-full bg-gray-50 dark:bg-neutral-800 p-2 md:p-6 relative overflow-hidden group-hover:bg-white dark:group-hover:bg-neutral-900 transition-colors flex items-center justify-center">
                                <div className="opacity-50 text-[6px] md:text-[10px] text-gray-400 overflow-hidden select-none font-mono leading-relaxed line-clamp-6 md:line-clamp-none">
                                    {item.description}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-5 flex-1 flex flex-col min-w-0 justify-center md:justify-start">
                        <div className="hidden md:flex gap-2 mb-3">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-500">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <h3 className="font-bold text-sm md:text-lg text-gray-900 dark:text-white mb-1 md:mb-2 group-hover:text-indigo-600 transition-colors truncate md:whitespace-normal line-clamp-2 md:line-clamp-none">
                            {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>
                        
                        <div className="hidden md:flex mt-auto pt-4 items-center gap-2 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            Selecionar
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* DETAIL MODAL OVERLAY */}
      {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}></div>
              
              <div className="relative w-[95vw] h-[90vh] max-w-6xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-neutral-800">
                  
                  {/* Close Button */}
                  <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-md transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  {/* Left: Image/Context Display */}
                  <div className="w-full md:w-2/5 h-1/3 md:h-full bg-gray-100 dark:bg-neutral-800 relative">
                      {selectedItem.coverImage && (
                          <>
                            <img src={selectedItem.coverImage} className="w-full h-full object-cover" alt={selectedItem.title} />
                            <div className="absolute inset-0 bg-indigo-900/20 mix-blend-multiply"></div>
                          </>
                      )}
                      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                          <div className="flex items-center gap-2 mb-2">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(selectedItem.category)}`}>
                                   {selectedItem.category}
                               </span>
                          </div>
                          <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                      </div>
                  </div>

                  {/* Right: Prompt & Details */}
                  <div className="w-full md:w-3/5 h-2/3 md:h-full bg-white dark:bg-neutral-900 flex flex-col border-l border-gray-200 dark:border-neutral-800">
                      <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                              {selectedItem.tags.map(tag => (
                                  <span key={tag} className="text-xs bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-neutral-700">
                                      #{tag}
                                  </span>
                              ))}
                          </div>

                          <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resumo</h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {selectedItem.description}
                              </p>
                              {selectedItem.content && (
                                  <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-indigo-400 text-xs text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: selectedItem.content}}></div>
                              )}
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Prompt Especialista</h4>
                              <div className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 font-mono leading-relaxed relative group">
                                  {selectedItem.prompt}
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(selectedItem.prompt)}
                                    className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-neutral-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600"
                                    title="Copiar Texto"
                                  >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                  </button>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2">
                                  *Substitua os campos entre [COLCHETES] com seus dados reais após copiar.
                              </p>
                          </div>
                      </div>

                      <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-black/20">
                          <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.577-4.18" /></svg>
                              Usar este Modelo Jurídico
                          </button>
                          <p className="text-center text-xs text-gray-400 mt-3">
                              Copia o prompt estruturado para o chat.
                          </p>
                      </div>
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};