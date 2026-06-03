/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', showTagline = false, size = 'md' }: LogoProps) {
  // Determine standard classes for the symbol size
  let svgSizeClass = 'w-8 h-8';
  let titleClass = 'text-lg';
  let subtitleClass = 'text-[9px]';

  if (size === 'sm') {
    svgSizeClass = 'w-6 h-6';
    titleClass = 'text-base';
    subtitleClass = 'text-[8px]';
  } else if (size === 'lg') {
    svgSizeClass = 'w-16 h-16';
    titleClass = 'text-3xl';
    subtitleClass = 'text-xs';
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* High Fidelity Brand Leaf SVG Logo representation */}
      <div className={`shrink-0 transition-transform hover:scale-105 duration-300 relative`}>
        <svg 
          className={svgSizeClass} 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="leafGradMain" x1="14" y1="92" x2="101" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#15803d" /> {/* dark green */}
              <stop offset="50%" stopColor="#16a34a" /> {/* medium green */}
              <stop offset="100%" stopColor="#4ade80" /> {/* light green */}
            </linearGradient>
            <linearGradient id="leafGradSprout" x1="60" y1="40" x2="105" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
          </defs>

          {/* BACKGROUND AMBIENT DROP SHADOW */}
          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#052e16" floodOpacity="0.12" />
          </filter>

          <g filter="url(#logoShadow)">
            {/* STYLIZED "2" SHAPED EMBRYO SWOOP AND MAIN LEAF */}
            {/* This represents the sweeping bold curve and main protective organic split-leaf */}
            <path 
              d="M 12,85 
                 C 20,55, 45,35, 82,34 
                 C 86,34, 88,36, 88,40 
                 C 87,55, 78,63, 62,69 
                 C 58,70, 52,71, 52,76 
                 C 52,82, 70,83, 85,82
                 C 91,82, 94,85, 93,92
                 C 91,95, 68,96, 52,96
                 C 25,96, 10,91, 12,85 Z" 
              fill="url(#leafGradMain)" 
            />

            {/* SPROUT BRACKET & GROWING SHEATH (represents standard and smart direct systems) */}
            <path 
              d="M 52,76
                 C 55,58, 68,48, 81,42
                 C 85,40, 86,34, 82,32
                 C 78,30, 72,32, 68,36
                 C 55,48, 48,59, 52,76 Z"
              fill="#15803d"
              opacity="0.85"
            />

            {/* Lush Sprouting Leaf 1 (Top Left) */}
            <path 
              d="M 64,28 
                 C 52,24, 48,15, 54,8 
                 C 64,8, 70,16, 68,24 
                 C 67,27, 65,28, 64,28 Z" 
              fill="url(#leafGradSprout)" 
            />

            {/* Lush Sprouting Leaf 2 (Central Center Sprout) */}
            <path 
              d="M 80,24 
                 C 80,10, 84,4, 91,6 
                 C 93,14, 90,20, 82,24
                 C 81,24, 80,24, 80,24 Z" 
              fill="url(#leafGradSprout)" 
            />

            {/* Lush Sprouting Leaf 3 (Right Wing Sprout) */}
            <path 
              d="M 94,36 
                 C 94,22, 105,18, 110,23 
                 C 107,32, 101,36, 95,37 
                 C 94,37, 94,36, 94,36 Z" 
              fill="url(#leafGradSprout)" 
            />
          </g>
        </svg>
      </div>

      <div className="text-left font-sans">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-slate-800 ${titleClass}`}>
            Agro<span className="text-emerald-700">2</span>mic
          </span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        </div>
        
        {showTagline ? (
          <p className={`text-slate-500 font-medium font-sans uppercase tracking-[0.16em] mt-1.5 leading-none ${subtitleClass}`}>
            Cultivating Growth & Innovation
          </p>
        ) : (
          <p className={`text-slate-450 font-mono tracking-widest uppercase mt-1 leading-none ${subtitleClass}`}>
            Direct Agritech Marketplace
          </p>
        )}
      </div>
    </div>
  );
}
