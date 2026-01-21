import React from 'react';

interface MartaLogoProps {
  className?: string;
}

export const MartaLogo: React.FC<MartaLogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="marta-sphere-gradient" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#2563EB">
             <animate 
                attributeName="stop-color" 
                values="#2563EB; #9333EA; #DB2777; #2563EB" 
                dur="8s" 
                repeatCount="indefinite" 
             />
          </stop>
          <stop offset="100%" stopColor="#9333EA">
             <animate 
                attributeName="stop-color" 
                values="#9333EA; #DB2777; #2563EB; #9333EA" 
                dur="8s" 
                repeatCount="indefinite" 
             />
          </stop>
        </linearGradient>
      </defs>
      
      {/* Main Sphere - Centered via group to allow proper scaling from center */}
      <g transform="translate(50 50)">
        <circle cx="0" cy="0" r="48" fill="url(#marta-sphere-gradient)">
             <animateTransform 
                attributeName="transform" 
                type="scale" 
                values="1; 0.96; 1" 
                dur="4s" 
                repeatCount="indefinite" 
             />
        </circle>
      </g>
    </svg>
  );
};