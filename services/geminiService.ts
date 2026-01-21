import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { API_KEY, MARTA_SYSTEM_INSTRUCTION, MODEL_NAMES } from "../constants";

// Helper to check for user-selected key
const getClient = async (requiresUserKey = false) => {
  let key = process.env.API_KEY || API_KEY;
  if (requiresUserKey && window.aistudio) {
      if(await window.aistudio.hasSelectedApiKey()) {
         // The environment variable is automatically updated by the window.aistudio flow in the background
         // but we can also rely on the process.env.API_KEY being injected if we are in that environment.
         key = process.env.API_KEY || key; 
      }
  }
  return new GoogleGenAI({ apiKey: key });
};

// Text Generation
export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  systemInstruction: string = MARTA_SYSTEM_INSTRUCTION,
  modelMode: 'fast' | 'thinking' = 'fast'
): Promise<string> => {
  const ai = await getClient();
  
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
  // Use user key for Pro image model, or default key for Flash image
  const ai = await getClient();
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAMES.IMAGE_FAST, // Using Flash Image for speed/default
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
  // Veo requires a user-selected key often in these demos
  const ai = await getClient(true);
  
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
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      // Fetch the actual video bytes using the key
      const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY || API_KEY}`);
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
  const ai = await getClient();
  const response = await ai.models.generateContent({
    model: MODEL_NAMES.AUDIO_TRANSCRIPTION,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'audio/wav', // or the recorded mime type
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
    const ai = await getClient();
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