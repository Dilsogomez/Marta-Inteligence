
/* Fix: Refactored service to strictly use process.env.API_KEY and create new SDK instances before each call to ensure up-to-date configuration. */
import { GoogleGenAI, Modality } from "@google/genai";
import { MARTA_SYSTEM_INSTRUCTION, MODEL_NAMES } from "../constants";

// Helper to check for user-selected key
const getClient = () => {
  /* Fix: Exclusively source API key from process.env.API_KEY as per SDK guidelines */
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Text Generation
export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  systemInstruction: string = MARTA_SYSTEM_INSTRUCTION,
  modelMode: 'fast' | 'thinking' = 'fast'
): Promise<string> => {
  /* Fix: Create a fresh client instance before making a content generation call */
  const ai = getClient();
  
  // Select model based on mode
  const modelName = modelMode === 'thinking' ? MODEL_NAMES.TEXT_SMART : MODEL_NAMES.TEXT_FAST;
  
  const config: any = {
    systemInstruction: systemInstruction,
  };

  // Enable thinking budget for the thinking mode
  if (modelMode === 'thinking') {
      config.thinkingConfig = { thinkingBudget: 1024 };
  }

  const chat = ai.chats.create({
    model: modelName, 
    config: config,
    history: history.map(h => ({ role: h.role, parts: h.parts })),
  });

  const result = await chat.sendMessage({ message });
  return result.text || "";
};

// Image Generation
export const generateImage = async (prompt: string): Promise<string | null> => {
  /* Fix: Create a fresh client instance right before the call */
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAMES.IMAGE_FAST,
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed", error);
    throw error;
  }
  return null;
};

// Video Generation (Veo)
export const generateVideo = async (prompt: string): Promise<string | null> => {
  /* Fix: Creating a new GoogleGenAI instance right before making a Veo API call ensures it always uses the most up-to-date API key. */
  const ai = getClient();
  
  try {
    let operation = await ai.models.generateVideos({
      model: MODEL_NAMES.VIDEO_VEO,
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      /* Fix: Increased polling interval to 10 seconds for video operations to reduce unnecessary API requests. */
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      /* Fix: Ensure API_KEY is appended to the video URI when fetching binary data. */
      const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
      const blob = await videoRes.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error("Video generation failed", error);
    throw error;
  }
  return null;
};

// Audio Transcription (STT)
export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  /* Fix: Fresh instance creation before transcription call. */
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL_NAMES.AUDIO_TRANSCRIPTION,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'audio/pcm', // PCM is the standard raw format for SDK audio processing
            data: audioBase64,
          },
        },
        { text: "Transcreva este áudio exatamente como falado." },
      ],
    },
  });
  return response.text || "";
};

// Text to Speech
export const generateSpeech = async (text: string): Promise<ArrayBuffer | null> => {
    /* Fix: Fresh instance creation before TTS call. */
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAMES.TTS,
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
             const binaryString = atob(base64Audio);
             const len = binaryString.length;
             const bytes = new Uint8Array(len);
             for (let i = 0; i < len; i++) {
               bytes[i] = binaryString.charCodeAt(i);
             }
             return bytes.buffer;
        }
    } catch (e) {
        console.error("TTS Failed", e);
    }
    return null;
}
