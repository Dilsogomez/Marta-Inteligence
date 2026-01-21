import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset state on mount or text change
    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;
    const length = text.length;

    // Determine speed based on text length to avoid waiting too long for huge texts
    const speed = length > 300 ? 5 : 15;
    const step = length > 500 ? 3 : 1;

    const interval = setInterval(() => {
      if (currentIndex >= length) {
        clearInterval(interval);
        setIsComplete(true);
        // Ensure full text is displayed at the end
        setDisplayedText(text);
        return;
      }

      currentIndex += step;
      setDisplayedText(text.substring(0, currentIndex));
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="relative">
      <p className="leading-relaxed whitespace-pre-wrap">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-1.5 h-4 ml-0.5 bg-brand-purple animate-pulse align-middle shadow-[0_0_8px_rgba(147,51,234,0.5)]" />
        )}
      </p>
    </div>
  );
};