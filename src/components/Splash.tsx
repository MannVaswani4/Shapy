'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundEngine } from '../utils/audio';

export default function Splash() {
  const setPhase = useGameStore((state) => state.setPhase);
  const teacher = useGameStore((state) => state.teacher);

  const handleTap = () => {
    soundEngine.playTap();
    if (teacher) {
      setPhase('welcome');
    } else {
      setPhase('login');
    }
  };

  return (
    <div 
      onClick={handleTap}
      className="relative w-full min-h-screen flex-1 select-none overflow-hidden cursor-pointer flex flex-col items-center justify-center bg-slate-950"
      style={{
        backgroundImage: `url('/assets/backgrounds/SplashScreen.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Glowing Transparent Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/assets/backgrounds/SplashScreenTransparent.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-20 mt-32"
      >
        <span className="text-white text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-80">
          TAP ANYWHERE TO CONTINUE
        </span>
      </motion.div>
    </div>
  );
}
