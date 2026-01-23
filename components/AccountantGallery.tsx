import React, { useState } from 'react';

type AccountantCategory = 'geral' | 'tributario' | 'trabalhista' | 'financeiro' | 'mei';

interface AccountantTemplateItem {
  id: string;
  category: AccountantCategory;
  title: string;
  description: string;
  coverImage?: string; 
  content?: string; // HTML/Text preview
  prompt: string;
  tags: string[];
}

const MOCK_DATA: AccountantTemplateItem[] = [
  {
    id: 'cont-1',
    category: 'tributario',
    title: 'Simples vs Lucro Presumido',
    description: 'Análise comparativa para decisão de regime tributário.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    tags: ['Regime Tributário', 'Impostos'],
    prompt: "Atue como um contador sênior tributarista. Faça uma análise comparativa detalhada entre o Simples Nacional e o Lucro Presumido para uma empresa de [INSERIR TIPO DE EMPRESA] com faturamento mensal médio de R$ [VALOR]. Liste as alíquotas, vantagens, desvantagens e obrigações acessórias de cada regime, finalizando com uma recomendação baseada na redução da carga tributária.",
    content: `<p>Comparativo técnico detalhado focando na alíquota efetiva e obrigações acessórias (SPED, DCTF, etc) para otimização fiscal.</p>`
  },
  {
    id: 'cont-2',
    category: 'trabalhista',
    title: 'Cálculo de Rescisão CLT',
    description: 'Guia passo a passo para rescisão sem justa causa.',
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
    tags: ['DP', 'CLT', 'RH'],
    prompt: "Aja como um especialista em Departamento Pessoal. Calcule e explique detalhadamente as verbas rescisórias para uma demissão sem justa causa. Dados: Salário R$ [VALOR], Admissão [DATA], Demissão [DATA], [TEM/NÃO TEM] férias vencidas. Inclua cálculo de aviso prévio (indenizado ou trabalhado), férias proporcionais + 1/3, 13º proporcional e multa de 40% do FGTS.",
    content: `<p>Estrutura completa das verbas devidas conforme a CLT, incluindo aviso prévio proporcional e reflexos em férias e 13º salário.</p>`
  },
  {
    id: 'cont-3',
    category: 'financeiro',
    title: 'Análise Vertical e Horizontal',
    description: 'Interpretação de Balanço e DRE.',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    tags: ['Contabilidade Gerencial', 'Balanço'],
    prompt: "Atue como um analista financeiro e contador. Explique como realizar uma Análise Vertical e Horizontal em um Balanço Patrimonial e DRE. Forneça um exemplo prático interpretando indicadores de liquidez e rentabilidade, e como usar esses dados para diagnosticar a saúde financeira de uma empresa que apresenta queda no lucro líquido apesar do aumento nas vendas.",
    content: `<p>Metodologia para diagnosticar a saúde financeira da empresa através da variação de contas ao longo do tempo e representatividade de custos.</p>`
  },
  {
    id: 'cont-4',
    category: 'mei',
    title: 'Guia Anual MEI (DASN)',
    description: 'Passo a passo para regularização e declaração.',
    coverImage: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800',
    tags: ['MEI', 'Regularização'],
    prompt: "Como contador consultor para Microempreendedores Individuais (MEI), forneça um checklist completo e instruções passo a passo para realizar a Declaração Anual de Faturamento (DASN-SIMEI). Explique o que acontece se estourar o limite de faturamento em até 20% e acima de 20%, e como proceder para desenquadrar e migrar para ME.",
    content: `<p>Instruções críticas para o MEI, incluindo regras de desenquadramento e penalidades por atraso na declaração.</p>`
  },
  {
    id: 'cont-5',
    category: 'geral',
    title: 'Contrato de Prestação de Serviços',
    description: 'Cláusulas essenciais contábeis e fiscais.',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    tags: ['Contratos', 'Jurídico'],
    prompt: "Elabore uma minuta de Contrato de Prestação de Serviços Contábeis. Inclua cláusulas sobre: Objeto do serviço, Obrigações do Contratante (envio de documentos), Obrigações do Contratado (prazos fiscais), Honorários (incluindo 13º honorário), Responsabilidade Civil do Contador (Lei 10.406/2002) e LGPD. Use linguagem formal e jurídica adequada.",
    content: `<p>Minuta robusta focada na proteção do escritório contábil e clareza nas responsabilidades do cliente.</p>`
  }
];

interface AccountantGalleryProps {
  onClose: () => void;
}

export const AccountantGallery: React.FC<AccountantGalleryProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<AccountantCategory>('geral');
  const [selectedItem, setSelectedItem] = useState<AccountantTemplateItem | null>(null);

  const filteredItems = activeCategory === 'geral' 
    ? MOCK_DATA 
    : MOCK_DATA.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'geral', label: 'Todos' },
    { id: 'tributario', label: 'Tributário' },
    { id: 'trabalhista', label: 'Trabalhista (DP)' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'mei', label: 'MEI' }
  ];

  const getCategoryColor = (cat: AccountantCategory) => {
      switch(cat) {
          case 'tributario': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
          case 'trabalhista': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
          case 'financeiro': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
          case 'mei': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      }
  };

  return (
    <div id="accountant-gallery" className="w-full relative animate-in slide-in-from-bottom-10 duration-700 min-h-[600px] flex flex-col scroll-mt-48 overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-2xl">
      
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
                        onClick={() => setActiveCategory(cat.id as AccountantCategory)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border snap-center
                            ${activeCategory === cat.id 
                            ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-500/20' 
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
                    className="group cursor-pointer bg-white/80 dark:bg-neutral-900/80 rounded-xl md:rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 flex flex-row md:flex-col relative h-28 md:h-auto backdrop-blur-sm"
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
                                <div className="absolute inset-0 bg-teal-900/10 group-hover:bg-teal-900/0 transition-colors"></div>
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
                        
                        <h3 className="font-bold text-sm md:text-lg text-gray-900 dark:text-white mb-1 md:mb-2 group-hover:text-teal-600 transition-colors truncate md:whitespace-normal line-clamp-2 md:line-clamp-none">
                            {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>
                        
                        <div className="hidden md:flex mt-auto pt-4 items-center gap-2 text-xs font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
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
                            <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply"></div>
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
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resumo da Tarefa</h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {selectedItem.description}
                              </p>
                              {selectedItem.content && (
                                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 text-xs text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: selectedItem.content}}></div>
                              )}
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Prompt Especialista</h4>
                              <div className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 font-mono leading-relaxed relative group">
                                  {selectedItem.prompt}
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(selectedItem.prompt)}
                                    className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-neutral-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-teal-600"
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
                          <button className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                              Usar este Modelo Contábil
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