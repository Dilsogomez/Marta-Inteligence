import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Add types for Window interface to include aistudio
declare global {
  interface Window {
    // aistudio is already defined globally with type AIStudio
    webkitAudioContext: typeof AudioContext;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);