'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlapProps {
  char: string;
  size?: 'sm' | 'md' | 'lg';
  highlighted?: boolean;
}

const Flap = ({ char, size = 'md', highlighted = true }: FlapProps) => {
  const sizes = {
    sm: 'w-8 h-12 text-2xl',
    md: 'w-12 h-18 text-5xl',
    lg: 'w-16 h-24 text-7xl'
  };

  const currentSize = sizes[size];

  return (
    <div className={`relative ${currentSize.split(' ')[0]} ${currentSize.split(' ')[1]} ${highlighted ? 'bg-white' : 'bg-[#3C2EA8]'} rounded-none border border-white flex flex-col overflow-hidden shadow-2xl transition-all duration-300`}>
      {/* Top half */}
      <div className={`h-1/2 flex items-center justify-center overflow-hidden transition-all duration-300 ${highlighted ? 'bg-white' : 'bg-[#3C2EA8]' }`}>
        <span className={`${highlighted ? 'text-black' : 'text-white'} font-nunito ${currentSize.split(' ')[2]} font-black translate-y-1/2 leading-none transition-all duration-300`}>
          {char}
        </span>
      </div>
      
      {/* Bottom half */}
      <div className={`h-1/2 flex items-center justify-center overflow-hidden ${highlighted ? 'bg-white' : 'bg-[#3C2EA8]' } transition-all duration-300`}>
        <span className={`${highlighted ? 'text-black' : 'text-white'} font-nunito ${currentSize.split(' ')[2]} font-black -translate-y-1/2 leading-none transition-all duration-300`}>
          {char}
        </span>
      </div>
 
      {/* Middle Line matching background */}
      <div className={`absolute top-1/2 left-0 w-full h-[2px] ${highlighted ? 'bg-white' : 'bg-[#3C2EA8]'} z-10`} />
      
      {/* Gloss Effect */}
      <div className={`absolute inset-0 ${highlighted ? 'bg-gradient-to-b from-black/5 to-transparent' : 'bg-gradient-to-b from-white/5 to-transparent'} pointer-events-none`} />
    </div>
  );
};

export function TextFlippingBoard({ text, size = 'md', highlighted = true }: { text: string, size?: 'sm' | 'md' | 'lg', highlighted?: boolean }) {
  const chars = text.split('');

  return (
    <div className="flex flex-wrap gap-1">
      {chars.map((char, i) => (
        <motion.div
          key={`${i}-${char}`}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: i * 0.05 
          }}
          style={{ perspective: 1000 }}
        >
          <Flap size={size} char={char === ' ' ? '' : char.toUpperCase()} highlighted={highlighted} />
        </motion.div>
      ))}
    </div>
  );
}
