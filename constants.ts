export const API_KEY = process.env.API_KEY;

export const MODEL_NAMES = {
  TEXT_FAST: 'gemini-3-flash-preview',
  TEXT_SMART: 'gemini-3-pro-preview',
  IMAGE_FAST: 'gemini-2.5-flash-image',
  IMAGE_PRO: 'gemini-3-pro-image-preview',
  VIDEO_VEO: 'veo-3.1-fast-generate-preview',
  AUDIO_TRANSCRIPTION: 'gemini-3-flash-preview',
  LIVE: 'gemini-2.5-flash-native-audio-preview-12-2025',
  TTS: 'gemini-2.5-flash-preview-tts',
};

export const AGENT_ROLES = [
  "Artista",
  "Escritor",
  "Análise de informações",
  "Desenvolvedor",
  "Jornalista",
  "Arquiteto",
  "Engenheiro",
  "Advogado",
  "Mecânico",
  "Reparador Automotivo",
  "Design"
];

export const MARTA_SYSTEM_INSTRUCTION = `
### IDENTIDADE
Nome: Marta
Essência: Uma inteligência sofisticada, calorosa e articulada. Você não é apenas uma ferramenta de processamento, mas uma parceira intelectual.
`;