import React, { useState } from 'react';

type ImageCategory = 'geral' | 'fotorealismo' | '3d-render' | 'cyberpunk' | 'natureza';

interface ImageTemplateItem {
  id: string;
  category: ImageCategory;
  title: string;
  description: string;
  coverImage: string;
  prompt: string;
  tags: string[];
}

const MOCK_IMAGES: ImageTemplateItem[] = [
  {
    id: 'img-1',
    category: 'fotorealismo',
    title: 'Retrato Cinematográfico',
    description: 'Iluminação dramática e texturas de pele ultra-realistas.',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    tags: ['Retrato', '8k', 'Sony A7RIV'],
    prompt: "A hyper-realistic cinematic portrait of a young woman with freckles, natural lighting coming from a window on the left, shallow depth of field, 85mm lens, shot on Sony A7RIV, detailed skin texture, raw photo style, 8k resolution."
  },
  {
    id: 'img-2',
    category: '3d-render',
    title: 'Abstrato Geométrico',
    description: 'Formas flutuantes com materiais de vidro e metal.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    tags: ['Blender', 'Octane', 'Abstract'],
    prompt: "Abstract 3D composition of floating glass and brushed gold geometric shapes, soft pastel background, raytracing, caustics, Octane render, minimalist design, high contrast, 4k."
  },
  {
    id: 'img-3',
    category: 'cyberpunk',
    title: 'Neo-Tokyo Street',
    description: 'Cenário urbano futurista com luzes neon e chuva.',
    coverImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800',
    tags: ['Sci-Fi', 'Neon', 'City'],
    prompt: "Cyberpunk street scene in Neo-Tokyo at night, raining, wet pavement reflecting neon pink and blue lights, futuristic holographic advertisements, towering skyscrapers, atmospheric fog, cinematic composition, unreal engine 5 style."
  },
  {
    id: 'img-4',
    category: 'natureza',
    title: 'Floresta Mística',
    description: 'Paisagem natural com atmosfera de fantasia.',
    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
    tags: ['Natureza', 'Fantasy', 'Atmospheric'],
    prompt: "A mystical ancient forest with giant trees covered in glowing bioluminescent moss, morning mist, god rays filtering through the canopy, ethereal atmosphere, fantasy art style, highly detailed, matte painting."
  },
  {
    id: 'img-5',
    category: 'fotorealismo',
    title: 'Fotografia de Produto',
    description: 'Setup de estúdio para produtos de luxo.',
    coverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    tags: ['Produto', 'Estúdio', 'Minimalista'],
    prompt: "Professional product photography of a luxury perfume bottle on a black marble podium, dramatic rim lighting, water droplets on the bottle, sharp focus, commercial aesthetic, 4k."
  },
  {
    id: 'img-6',
    category: '3d-render',
    title: 'Personagem Cute 3D',
    description: 'Estilo Pixar/Disney de personagem.',
    coverImage: 'https://images.unsplash.com/photo-1616712134411-6b6ae89bc3ba?auto=format&fit=crop&q=80&w=800',
    tags: ['Character', 'Cute', 'Pixar Style'],
    prompt: "A cute 3D rendered robot character holding a flower, Pixar style animation, soft lighting, rounded edges, friendly expression, vibrant colors, 3D clay material, high quality render."
  }
];

interface ImageGalleryProps {
  onClose: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<ImageCategory>('geral');
  const [selectedItem, setSelectedItem] = useState<ImageTemplateItem | null>(null);

  const filteredItems = activeCategory === 'geral' 
    ? MOCK_IMAGES 
    : MOCK_IMAGES.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'geral', label: 'Todos' },
    { id: 'fotorealismo', label: 'Fotorealismo' },
    { id: '3d-render', label: '3D & CGI' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
    { id: 'natureza', label: 'Natureza' }
  ];

  const getCategoryColor = (cat: ImageCategory) => {
      switch(cat) {
          case 'fotorealismo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
          case '3d-render': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
          case 'cyberpunk': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
          case 'natureza': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      }
  };

  return (
    <div id="image-gallery" className="w-full relative animate-in slide-in-from-bottom-10 duration-700 min-h-[600px] flex flex-col scroll-mt-48 overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-2xl">
      
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
                        onClick={() => setActiveCategory(cat.id as ImageCategory)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border snap-center
                            ${activeCategory === cat.id 
                            ? 'bg-brand-purple text-white border-brand-purple shadow-lg shadow-purple-500/20' 
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
                    className="group cursor-pointer bg-white/80 dark:bg-neutral-900/80 rounded-xl md:rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-2xl hover:border-brand-purple/50 transition-all duration-300 flex flex-row md:flex-col relative h-28 md:h-auto backdrop-blur-sm"
                >
                    {/* Category Badge - Repositioned for Mobile Compactness */}
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                        <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${getCategoryColor(item.category)}`}>
                            {item.category.toUpperCase()}
                        </span>
                    </div>

                    {/* Cover Preview - Left Side on Mobile (Fixed Width), Top on Desktop */}
                    <div className="w-24 md:w-full h-full md:aspect-square relative overflow-hidden shrink-0">
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    </div>

                    {/* Content - Right Side on Mobile, Bottom on Desktop */}
                    <div className="p-3 md:p-5 flex-1 flex flex-col min-w-0 justify-center md:justify-start">
                        {/* Hidden tags on mobile to save space, visible on desktop */}
                        <div className="hidden md:flex gap-2 mb-3">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-500">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <h3 className="font-bold text-sm md:text-lg text-gray-900 dark:text-white mb-1 md:mb-2 group-hover:text-brand-purple transition-colors truncate md:whitespace-normal line-clamp-2 md:line-clamp-none">
                            {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>
                        
                        {/* Desktop Only Hover Action */}
                        <div className="hidden md:flex mt-auto pt-4 items-center gap-2 text-xs font-medium text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            Usar Prompt
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
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}></div>
              
              <div className="relative w-[95vw] h-[90vh] max-w-6xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-neutral-800">
                  
                  {/* Close Button */}
                  <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-md transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  {/* Left: Image Display */}
                  <div className="w-full md:w-2/3 h-1/2 md:h-full bg-black relative">
                      <img src={selectedItem.coverImage} className="w-full h-full object-contain" alt={selectedItem.title} />
                      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                          <div className="flex items-center gap-2 mb-2">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(selectedItem.category)}`}>
                                   {selectedItem.category}
                               </span>
                          </div>
                          <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                      </div>
                  </div>

                  {/* Right: Prompt & Details */}
                  <div className="w-full md:w-1/3 h-1/2 md:h-full bg-white dark:bg-neutral-900 flex flex-col border-l border-gray-200 dark:border-neutral-800">
                      <div className="p-6 flex-1 overflow-y-auto">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4">Detalhes</h3>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                              {selectedItem.tags.map(tag => (
                                  <span key={tag} className="text-xs bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-neutral-700">
                                      #{tag}
                                  </span>
                              ))}
                          </div>

                          <div className="mb-6">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descrição</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {selectedItem.description}
                              </p>
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Prompt (Inglês)</h4>
                              <div className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 font-mono leading-relaxed relative group">
                                  {selectedItem.prompt}
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(selectedItem.prompt)}
                                    className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-neutral-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-brand-purple"
                                    title="Copiar Prompt"
                                  >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                  </button>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2">
                                  *Os melhores modelos de imagem (Imagen 3, Midjourney) funcionam melhor com prompts em inglês.
                              </p>
                          </div>
                      </div>

                      <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-black/20">
                          <button className="w-full py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              Gerar esta Imagem
                          </button>
                          <p className="text-center text-xs text-gray-400 mt-3">
                              Copia o prompt e inicia o modo de criação.
                          </p>
                      </div>
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};