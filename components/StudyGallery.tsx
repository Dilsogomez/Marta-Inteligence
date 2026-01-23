import React, { useState } from 'react';

type StudyCategory = 'geral' | 'portugues' | 'ingles' | 'matematica' | 'financas' | 'historia' | 'filosofia' | 'geografia' | 'artes' | 'biologia' | 'quimica' | 'informatica';

interface StudyTemplateItem {
  id: string;
  category: StudyCategory;
  title: string;
  description: string;
  coverImage?: string; 
  content?: string; // HTML/Text preview
  prompt: string;
  tags: string[];
}

const MOCK_DATA: StudyTemplateItem[] = [
  // --- MATEMÁTICA ---
  {
    id: 'mat-1',
    category: 'matematica',
    title: 'Resolvendo Derivadas',
    description: 'Passo a passo para cálculo diferencial.',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    tags: ['Cálculo', 'Exatas'],
    prompt: "Atue como um professor de Matemática universitário. Explique o conceito de Derivada de uma função de forma intuitiva e, em seguida, resolva passo a passo a derivada da função: f(x) = [INSERIR FUNÇÃO, EX: 3x^2 + 5x]. Mostre as regras utilizadas (Regra da Potência, Cadeia, etc.) e o resultado final simplificado.",
    content: `<p>Guia estruturado para entender a taxa de variação instantânea e aplicação prática de regras de derivação.</p>`
  },
  {
    id: 'mat-2',
    category: 'matematica',
    title: 'Geometria Analítica',
    description: 'Equações da reta e circunferência.',
    coverImage: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&q=80&w=800',
    tags: ['Geometria', 'Ensino Médio'],
    prompt: "Explique os conceitos fundamentais da Geometria Analítica: ponto, distância entre pontos e equação da reta (geral e reduzida). Forneça 2 exercícios resolvidos passo a passo sobre como encontrar a equação da reta que passa por dois pontos dados.",
    content: `<p>Domine o plano cartesiano e as equações que descrevem formas geométricas.</p>`
  },
  {
    id: 'mat-3',
    category: 'matematica',
    title: 'Estatística Básica',
    description: 'Média, Mediana e Desvio Padrão.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['Estatística', 'Análise de Dados'],
    prompt: "Aja como um professor de estatística. Explique a diferença entre as medidas de tendência central (Média, Mediana, Moda) e as medidas de dispersão (Variância e Desvio Padrão). Dê um exemplo prático com um conjunto de dados pequeno para ilustrar o cálculo de cada uma.",
    content: `<p>Fundamentos para interpretar dados e variabilidade em conjuntos numéricos.</p>`
  },

  // --- HISTÓRIA ---
  {
    id: 'hist-1',
    category: 'historia',
    title: 'Revolução Francesa',
    description: 'Causas, fases e consequências históricas.',
    coverImage: 'https://images.unsplash.com/photo-1569074183152-0f5b4705cb0d?auto=format&fit=crop&q=80&w=800',
    tags: ['História Geral', 'Enem'],
    prompt: "Aja como um historiador especializado. Crie um resumo detalhado sobre a Revolução Francesa (1789). Divida em: Contexto Pré-Revolucionário (Antigo Regime), A Queda da Bastilha, Fase do Terror (Jacobinos), Diretório e a Ascensão de Napoleão. Conclua explicando o impacto histórico na política ocidental moderna.",
    content: `<p>Análise cronológica dos eventos que mudaram o paradigma político mundial, do absolutismo à república.</p>`
  },
  {
    id: 'hist-2',
    category: 'historia',
    title: 'Era Vargas',
    description: 'O Estado Novo e o trabalhismo.',
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800', 
    tags: ['História do Brasil', 'Política'],
    prompt: "Descreva a Era Vargas (1930-1945), focando nas principais medidas econômicas, na criação das leis trabalhistas (CLT) e na censura durante o Estado Novo. Analise a figura de Getúlio Vargas como 'Pai dos Pobres'.",
    content: `<p>Um mergulho no período mais transformador da política brasileira no século XX.</p>`
  },
  {
    id: 'hist-3',
    category: 'historia',
    title: 'Guerra Fria',
    description: 'Geopolítica bipolar e conflitos indiretos.',
    coverImage: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&q=80&w=800', 
    tags: ['Geopolítica', 'Mundo Contemporâneo'],
    prompt: "Explique o conceito de Guerra Fria, a divisão do mundo em blocos (Capitalista vs Socialista), a Corrida Armamentista e Espacial. Cite os principais conflitos indiretos (Guerra da Coreia, Vietnã) e o fim da URSS.",
    content: `<p>Entenda a tensão global que definiu a segunda metade do século XX.</p>`
  },

  // --- INGLÊS ---
  {
    id: 'eng-1',
    category: 'ingles',
    title: 'Preparação IELTS/TOEFL',
    description: 'Prática de writing e speaking avançado.',
    coverImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    tags: ['Idiomas', 'Proficiência'],
    prompt: "Atue como um examinador do IELTS/TOEFL. Forneça um tópico de 'Essay' (Redação) de nível avançado sobre [TEMA: EX: Tecnologia na Educação]. Em seguida, escreva um exemplo de resposta Band 9 (nota máxima), destacando o vocabulário acadêmico utilizado (linking words, collocations) e a estrutura argumentativa.",
    content: `<p>Estratégias de alta pontuação para exames internacionais, focando em coesão, coerência e léxico avançado.</p>`
  },
  {
    id: 'eng-2',
    category: 'ingles',
    title: 'Business English',
    description: 'Emails corporativos e vocabulário.',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
    tags: ['Carreira', 'Comunicação'],
    prompt: "Crie um guia de 'Business English' focado em emails formais. Liste 10 frases essenciais para: iniciar um email, solicitar informações, marcar reuniões e encerrar profissionalmente. Dê exemplos de 'Do's and Don'ts' na etiqueta corporativa internacional.",
    content: `<p>Melhore sua comunicação profissional em ambiente global.</p>`
  },
  {
    id: 'eng-3',
    category: 'ingles',
    title: 'Tempos Verbais Perfeitos',
    description: 'Present Perfect vs Past Simple.',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    tags: ['Gramática', 'Intermediário'],
    prompt: "Explique de forma didática a diferença entre o 'Present Perfect' e o 'Simple Past', que costuma confundir falantes de português. Forneça 5 exemplos de frases em cada tempo verbal, explicando o contexto de uso (tempo definido vs tempo indefinido/impacto no presente).",
    content: `<p>Desmistificando a gramática mais difícil para brasileiros.</p>`
  },

  // --- PORTUGUÊS ---
  {
    id: 'pt-1',
    category: 'portugues',
    title: 'Uso da Crase',
    description: 'Regras práticas e casos proibidos.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    tags: ['Gramática', 'Concursos'],
    prompt: "Explique as regras definitivas para o uso da Crase. Liste: 1) Quando usar sempre, 2) Quando é proibido usar, 3) Casos facultativos. Dê exemplos claros e macetes para memorização (como a troca por 'ao').",
    content: `<p>Nunca mais erre o acento grave na escrita formal.</p>`
  },
  {
    id: 'pt-2',
    category: 'portugues',
    title: 'Realismo: Machado de Assis',
    description: 'Análise literária e ironia machadiana.',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800',
    tags: ['Literatura', 'Clássicos'],
    prompt: "Faça uma análise literária sobre o Realismo no Brasil, focando em Machado de Assis. Explique as características principais: ironia, crítica social, análise psicológica e ruptura com o Romantismo. Cite obras como 'Memórias Póstumas de Brás Cubas' e 'Dom Casmurro'.",
    content: `<p>Aprofundamento na obra do maior escritor brasileiro.</p>`
  },
  {
    id: 'pt-3',
    category: 'portugues',
    title: 'Redação Nota 1000',
    description: 'Estrutura dissertativa-argumentativa.',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    tags: ['Redação', 'Enem'],
    prompt: "Estruture um esqueleto ideal para uma redação dissertativo-argumentativa (modelo ENEM). Detalhe o que deve conter na: Introdução (Tese), Desenvolvimento 1 e 2 (Argumentação e Repertório Sociocultural) e Conclusão (Proposta de Intervenção detalhada).",
    content: `<p>O blueprint para textos dissertativos de alta performance.</p>`
  },

  // --- FINANÇAS ---
  {
    id: 'fin-1',
    category: 'financas',
    title: 'Juros Compostos',
    description: 'Matemática financeira aplicada.',
    coverImage: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=800',
    tags: ['Educação Financeira', 'Investimentos'],
    prompt: "Explique o conceito de Juros Compostos ('Juros sobre Juros') e como ele impacta investimentos a longo prazo. Apresente a fórmula matemática. Crie uma simulação prática: Se eu investir R$ [VALOR] por mês a uma taxa de [TAXA]% ao ano, quanto terei em 10, 20 e 30 anos?",
    content: `<p>O poder do tempo e da taxa nos investimentos.</p>`
  },
  {
    id: 'fin-2',
    category: 'financas',
    title: 'Análise de Ações (Valuation)',
    description: 'Indicadores P/L, ROE e Dividend Yield.',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    tags: ['Bolsa de Valores', 'Economia'],
    prompt: "Atue como um analista de investimentos. Explique os principais indicadores para análise fundamentalista de ações: P/L (Preço sobre Lucro), P/VP (Preço sobre Valor Patrimonial), ROE (Retorno sobre Patrimônio) e Dividend Yield. Explique o que cada um indica sobre a saúde da empresa.",
    content: `<p>Introdução à análise fundamentalista para investidores iniciantes.</p>`
  },
  {
    id: 'fin-3',
    category: 'financas',
    title: 'Orçamento Pessoal',
    description: 'Método 50/30/20 e controle de gastos.',
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800',
    tags: ['Finanças Pessoais', 'Planejamento'],
    prompt: "Crie um plano de organização financeira pessoal baseado na regra 50/30/20 (50% Necessidades, 30% Desejos, 20% Investimentos/Dívidas). Explique como categorizar os gastos e dê dicas para reduzir despesas fixas e variáveis.",
    content: `<p>Organize sua vida financeira com metodologias comprovadas.</p>`
  },

  // --- FILOSOFIA ---
  {
    id: 'fil-1',
    category: 'filosofia',
    title: 'O Mito da Caverna',
    description: 'Platão e a teoria do conhecimento.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    tags: ['Clássicos', 'Metafísica'],
    prompt: "Explique a alegoria do 'Mito da Caverna' de Platão. Detalhe o significado de cada elemento: as sombras, a luz, o prisioneiro liberto e o retorno à caverna. Relacione este conceito com a era da desinformação e redes sociais.",
    content: `<p>Interpretação clássica e contemporânea da epistemologia platônica.</p>`
  },
  {
    id: 'fil-2',
    category: 'filosofia',
    title: 'Ética: Aristóteles vs Kant',
    description: 'Virtude versus Dever.',
    coverImage: 'https://images.unsplash.com/photo-1566412975949-012b48227b7c?auto=format&fit=crop&q=80&w=800',
    tags: ['Ética', 'Moral'],
    prompt: "Compare a Ética das Virtudes de Aristóteles (focada no caráter e na eudaimonia) com a Ética Deontológica de Immanuel Kant (Imperativo Categórico). Use o exemplo do 'dilema do bonde' ou similar para ilustrar como cada filósofo agiria.",
    content: `<p>Um duelo de pensamentos sobre como devemos agir.</p>`
  },
  {
    id: 'fil-3',
    category: 'filosofia',
    title: 'Nietzsche e o Niilismo',
    description: 'A morte de Deus e o Super-homem.',
    coverImage: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    tags: ['Existencialismo', 'Modernidade'],
    prompt: "Explique os conceitos centrais da filosofia de Friedrich Nietzsche: a 'Morte de Deus', o Niilismo (passivo vs ativo), a Vontade de Potência e o Übermensch (Super-homem/Além-do-homem).",
    content: `<p>Compreendendo a crítica aos valores ocidentais tradicionais.</p>`
  },

  // --- GEOGRAFIA ---
  {
    id: 'geo-1',
    category: 'geografia',
    title: 'Geopolítica: Oriente Médio',
    description: 'Conflitos, petróleo e religião.',
    coverImage: 'https://images.unsplash.com/photo-1549396535-c11d5c55b9df?auto=format&fit=crop&q=80&w=800',
    tags: ['Atualidades', 'Política Internacional'],
    prompt: "Faça um panorama da geopolítica atual do Oriente Médio. Aborde: A questão da Palestina e Israel, a rivalidade entre Irã (Xiita) e Arábia Saudita (Sunita), e a importância do petróleo na região.",
    content: `<p>Entenda as raízes dos conflitos na região mais tensa do globo.</p>`
  },
  {
    id: 'geo-2',
    category: 'geografia',
    title: 'Mudanças Climáticas',
    description: 'Aquecimento global e acordos internacionais.',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    tags: ['Meio Ambiente', 'Sustentabilidade'],
    prompt: "Explique as causas e consequências do Aquecimento Global (Efeito Estufa). Resuma os principais acordos internacionais sobre o clima (Protocolo de Kyoto, Acordo de Paris) e os desafios para sua implementação.",
    content: `<p>A ciência e a política por trás da crise climática.</p>`
  },
  {
    id: 'geo-3',
    category: 'geografia',
    title: 'Urbanização Brasileira',
    description: 'Crescimento das cidades e problemas sociais.',
    coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800',
    tags: ['Brasil', 'Sociologia'],
    prompt: "Descreva o processo de urbanização do Brasil no século XX. Explique conceitos como conurbação, região metropolitana e macrocefalia urbana. Discuta os problemas resultantes: favelização, mobilidade e segregação socioespacial.",
    content: `<p>Como o Brasil deixou de ser rural para se tornar urbano.</p>`
  },

  // --- ARTES ---
  {
    id: 'art-1',
    category: 'artes',
    title: 'Renascimento Italiano',
    description: 'Da Vinci, Michelangelo e o Humanismo.',
    coverImage: 'https://images.unsplash.com/photo-1576016770956-debb63d92058?auto=format&fit=crop&q=80&w=800',
    tags: ['História da Arte', 'Europa'],
    prompt: "Descreva o movimento Renascentista nas artes visuais. Explique características como: perspectiva, realismo anatômico, uso da luz e sombra (chiaroscuro) e a temática humanista. Cite obras principais de Leonardo da Vinci e Michelangelo.",
    content: `<p>O retorno aos ideais clássicos e a revolução visual na Europa.</p>`
  },
  {
    id: 'art-2',
    category: 'artes',
    title: 'Semana de Arte Moderna (1922)',
    description: 'O Modernismo no Brasil.',
    coverImage: 'https://images.unsplash.com/photo-1569407228235-9a744831a150?auto=format&fit=crop&q=80&w=800',
    tags: ['Brasil', 'Vanguardas'],
    prompt: "Explique a importância da Semana de Arte Moderna de 1922 para a cultura brasileira. Aborde o rompimento com o academicismo, a busca por uma identidade nacional (Antropofagia) e cite artistas como Tarsila do Amaral, Anita Malfatti e Villa-Lobos.",
    content: `<p>O grito de independência cultural brasileiro.</p>`
  },
  {
    id: 'art-3',
    category: 'artes',
    title: 'Teoria das Cores',
    description: 'Círculo cromático e psicologia das cores.',
    coverImage: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&q=80&w=800',
    tags: ['Design', 'Pintura'],
    prompt: "Explique a Teoria das Cores básica: Cores primárias, secundárias e terciárias. Cores quentes vs frias. Cores complementares e análogas. Dê exemplos de como essas combinações afetam a emoção e a composição visual.",
    content: `<p>Fundamentos para artistas e designers.</p>`
  },

  // --- BIOLOGIA ---
  {
    id: 'bio-1',
    category: 'biologia',
    title: 'Bioenergética Celular',
    description: 'Ciclo de Krebs e produção de ATP.',
    coverImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
    tags: ['Bioquímica', 'Celular'],
    prompt: "Explique o processo de Respiração Celular, focando na Glicólise, Ciclo de Krebs e Cadeia Respiratória. Liste o saldo energético (ATP) de cada etapa.",
    content: `<p>Como as células transformam nutrientes em energia.</p>`
  },
  {
    id: 'bio-2',
    category: 'biologia',
    title: 'Genética: Leis de Mendel',
    description: 'Hereditariedade e probabilidades.',
    coverImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
    tags: ['Genética', 'Evolução'],
    prompt: "Explique a Primeira e a Segunda Lei de Mendel. Defina termos como: genótipo, fenótipo, homozigoto, heterozigoto, dominante e recessivo. Crie um exemplo prático de cruzamento usando o Quadro de Punnett.",
    content: `<p>Os fundamentos da transmissão de características biológicas.</p>`
  },
  {
    id: 'bio-3',
    category: 'biologia',
    title: 'Relações Ecológicas',
    description: 'Harmônicas e desarmônicas.',
    coverImage: 'https://images.unsplash.com/photo-1500829243541-76b67cd543de?auto=format&fit=crop&q=80&w=800',
    tags: ['Ecologia', 'Meio Ambiente'],
    prompt: "Descreva as principais relações ecológicas entre os seres vivos. Diferencie relações intraespecíficas de interespecíficas. Explique e dê exemplos de: Mutualismo, Comensalismo, Predatismo, Parasitismo e Competição.",
    content: `<p>Como os organismos interagem na natureza.</p>`
  },

  // --- QUÍMICA ---
  {
    id: 'qui-1',
    category: 'quimica',
    title: 'Estequiometria',
    description: 'Cálculos de massa e mol em reações.',
    coverImage: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=800',
    tags: ['Geral', 'Cálculos'],
    prompt: "Ensine o passo a passo para resolver problemas de Estequiometria: 1) Balancear a equação, 2) Converter unidades (massa, mol, volume), 3) Regra de três. Dê um exemplo de cálculo de rendimento de reação.",
    content: `<p>A matemática das reações químicas explicada.</p>`
  },
  {
    id: 'qui-2',
    category: 'quimica',
    title: 'Química Orgânica',
    description: 'Funções oxigenadas e nomenclatura.',
    coverImage: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&q=80&w=800',
    tags: ['Orgânica', 'Enem'],
    prompt: "Faça um resumo das principais Funções Orgânicas Oxigenadas: Álcool, Aldeído, Cetona, Ácido Carboxílico, Éster e Éter. Para cada uma, mostre o grupo funcional característico e a regra básica de nomenclatura IUPAC.",
    content: `<p>Identificando e nomeando compostos de carbono.</p>`
  },
  {
    id: 'qui-3',
    category: 'quimica',
    title: 'Eletroquímica: Pilhas',
    description: 'Oxirredução e ddp.',
    coverImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
    tags: ['Físico-Química', 'Energia'],
    prompt: "Explique o funcionamento da Pilha de Daniell. Defina: Anodo (oxidação), Catodo (redução), fluxo de elétrons e ponte salina. Mostre como calcular a diferença de potencial (ddp) da pilha.",
    content: `<p>Como reações químicas geram corrente elétrica.</p>`
  },

  // --- INFORMÁTICA ---
  {
    id: 'inf-1',
    category: 'informatica',
    title: 'Lógica de Programação',
    description: 'Algoritmos e estruturas de dados básicas.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    tags: ['TI', 'Coding'],
    prompt: "Atue como um Engenheiro de Software Sênior ensinando um iniciante. Explique os conceitos fundamentais de: Variáveis, Condicionais (If/Else), Loops (For/While) e Funções. Dê exemplos de código em Python ou JavaScript para cada conceito, explicando o que cada linha faz.",
    content: `<p>Fundamentos essenciais para iniciar na carreira de desenvolvimento de software.</p>`
  },
  {
    id: 'inf-2',
    category: 'informatica',
    title: 'Segurança da Informação',
    description: 'Criptografia e proteção de dados.',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    tags: ['Cybersecurity', 'Dados'],
    prompt: "Explique os pilares da Segurança da Informação (Confidencialidade, Integridade, Disponibilidade). Descreva ameaças comuns como Phishing, Ransomware e Engenharia Social, e boas práticas para proteção pessoal e corporativa.",
    content: `<p>Como se proteger no mundo digital.</p>`
  },
  {
    id: 'inf-3',
    category: 'informatica',
    title: 'Banco de Dados SQL',
    description: 'Consultas básicas e modelagem.',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
    tags: ['Backend', 'Dados'],
    prompt: "Introduza os conceitos de Banco de Dados Relacional (SQL). Explique o que são Tabelas, Chaves Primárias e Estrangeiras. Forneça exemplos dos comandos básicos: SELECT, INSERT, UPDATE e DELETE.",
    content: `<p>Gerenciando e consultando informações estruturadas.</p>`
  }
];

interface StudyGalleryProps {
  onClose: () => void;
}

export const StudyGallery: React.FC<StudyGalleryProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<StudyCategory>('geral');
  const [selectedItem, setSelectedItem] = useState<StudyTemplateItem | null>(null);

  const filteredItems = activeCategory === 'geral' 
    ? MOCK_DATA 
    : MOCK_DATA.filter(item => item.category === activeCategory);

  const categories: { id: StudyCategory, label: string }[] = [
    { id: 'geral', label: 'Todos' },
    { id: 'portugues', label: 'Português' },
    { id: 'ingles', label: 'Inglês' },
    { id: 'matematica', label: 'Matemática' },
    { id: 'financas', label: 'Finanças' },
    { id: 'historia', label: 'História' },
    { id: 'filosofia', label: 'Filosofia' },
    { id: 'geografia', label: 'Geografia' },
    { id: 'artes', label: 'Artes' },
    { id: 'biologia', label: 'Biologia' },
    { id: 'quimica', label: 'Química' },
    { id: 'informatica', label: 'Informática' }
  ];

  const getCategoryColor = (cat: StudyCategory) => {
      switch(cat) {
          case 'matematica': case 'financas': case 'informatica': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
          case 'portugues': case 'ingles': case 'artes': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
          case 'biologia': case 'quimica': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
          case 'historia': case 'filosofia': case 'geografia': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      }
  };

  return (
    <div id="study-gallery" className="w-full relative animate-in slide-in-from-bottom-10 duration-700 min-h-[600px] flex flex-col scroll-mt-48 overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-2xl">
      
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
                        onClick={() => setActiveCategory(cat.id as StudyCategory)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border snap-center
                            ${activeCategory === cat.id 
                            ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' 
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
                    className="group cursor-pointer bg-white/80 dark:bg-neutral-900/80 rounded-xl md:rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden hover:shadow-2xl hover:border-rose-500/50 transition-all duration-300 flex flex-row md:flex-col relative h-28 md:h-auto backdrop-blur-sm"
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
                                <div className="absolute inset-0 bg-rose-900/10 group-hover:bg-rose-900/0 transition-colors"></div>
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
                        
                        <h3 className="font-bold text-sm md:text-lg text-gray-900 dark:text-white mb-1 md:mb-2 group-hover:text-rose-500 transition-colors truncate md:whitespace-normal line-clamp-2 md:line-clamp-none">
                            {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>
                        
                        <div className="hidden md:flex mt-auto pt-4 items-center gap-2 text-xs font-medium text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
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
                            <div className="absolute inset-0 bg-rose-900/20 mix-blend-multiply"></div>
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
                                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 text-xs text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: selectedItem.content}}></div>
                              )}
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Prompt Educacional</h4>
                              <div className="bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 font-mono leading-relaxed relative group">
                                  {selectedItem.prompt}
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(selectedItem.prompt)}
                                    className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-neutral-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500"
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
                          <button className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                              Usar este Plano de Estudos
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