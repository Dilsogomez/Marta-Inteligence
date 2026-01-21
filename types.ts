export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string; // Text content
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string; // For images/videos
  timestamp: number;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  messages: Message[];
}

export enum AppMode {
  CHAT = 'CHAT',
  LIVE = 'LIVE',
}

export interface AudioBufferData {
  buffer: ArrayBuffer;
  sampleRate: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  instructions: string;
  createdAt: number;
}