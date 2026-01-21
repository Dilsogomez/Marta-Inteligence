import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { API_KEY, MARTA_SYSTEM_INSTRUCTION, MODEL_NAMES } from '../constants';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../services/audioUtils';

interface LiveInterfaceProps {
  onClose: () => void;
}

export const LiveInterface: React.FC<LiveInterfaceProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
  const [volume, setVolume] = useState(0);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null); // To hold the session object/promise

  useEffect(() => {
    let mounted = true;
    let stream: MediaStream | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;
    let inputSource: MediaStreamAudioSourceNode | null = null;

    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        // Setup Output Audio
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = audioContextRef.current!.createGain();
        outputNode.connect(audioContextRef.current!.destination);

        // Setup Input Audio
        inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const sessionPromise = ai.live.connect({
          model: MODEL_NAMES.LIVE,
          config: {
            systemInstruction: MARTA_SYSTEM_INSTRUCTION,
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
          },
          callbacks: {
            onopen: () => {
              if (mounted) setStatus('connected');
              
              inputSource = inputContextRef.current!.createMediaStreamSource(stream!);
              scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Simple volume visualization
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
                const avg = sum / inputData.length;
                if (mounted) setVolume(Math.min(avg * 5, 1)); // Amplify for visual

                const pcmBlob = createPcmBlob(inputData);
                
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              inputSource.connect(scriptProcessor);
              scriptProcessor.connect(inputContextRef.current!.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
              const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio && audioContextRef.current) {
                // Audio received from Model
                const ctx = audioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  base64ToUint8Array(base64Audio),
                  ctx,
                  24000
                );

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

               const interrupted = msg.serverContent?.interrupted;
               if (interrupted) {
                   for (const source of sourcesRef.current.values()) {
                       source.stop();
                       sourcesRef.current.delete(source);
                   }
                   nextStartTimeRef.current = 0;
               }
            },
            onclose: () => {
              if (mounted) setStatus('disconnected');
            },
            onerror: (err) => {
              console.error("Live Error", err);
              if (mounted) setStatus('error');
            }
          }
        });
        
        sessionRef.current = sessionPromise;

      } catch (err) {
        console.error("Failed to start live session", err);
        if (mounted) setStatus('error');
      }
    };

    startSession();

    return () => {
      mounted = false;
      // Cleanup
      if (sessionRef.current) {
        sessionRef.current.then((s: any) => s.close());
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (scriptProcessor && inputSource) {
        inputSource.disconnect();
        scriptProcessor.disconnect();
      }
      if (inputContextRef.current) inputContextRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col items-center justify-center text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all backdrop-blur-md">
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex flex-col items-center space-y-12 animate-in fade-in duration-700">
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink tracking-tight">
                MARTA LIVE
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light text-sm tracking-widest uppercase">
                {status === 'connecting' ? 'INICIALIZANDO NEURAL LINK...' : 
                 status === 'connected' ? 'SISTEMA ONLINE' : 
                 'CONEXÃO INTERROMPIDA'}
            </p>
        </div>

        {/* Visualizer Orb */}
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer Glow Rings - Darker for light mode */}
            <div className={`absolute inset-0 rounded-full border border-brand-blue/30 scale-110 ${status === 'connected' ? 'animate-[spin_10s_linear_infinite]' : ''}`}></div>
            <div className={`absolute inset-0 rounded-full border border-brand-purple/20 scale-125 ${status === 'connected' ? 'animate-[spin_15s_linear_infinite_reverse]' : ''}`}></div>
            
            {/* Core Orb */}
            <div 
                className={`w-32 h-32 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple blur-md transition-transform duration-100 ease-out flex items-center justify-center`}
                style={{
                    transform: `scale(${1 + volume})`,
                    boxShadow: `0 0 ${20 + volume * 50}px ${volume * 10}px rgba(147, 51, 234, 0.5)`
                }}
            >
                <div className="w-28 h-28 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-purple/50 to-brand-blue/50 animate-pulse"></div>
                </div>
            </div>
        </div>

        <div className="text-center max-w-md px-6">
            <p className="text-lg font-light text-gray-600 dark:text-gray-300">
                {status === 'connected' 
                 ? "Estou ouvindo. Pode falar." 
                 : "Estabelecendo conexão segura..."}
            </p>
        </div>
      </div>
    </div>
  );
};