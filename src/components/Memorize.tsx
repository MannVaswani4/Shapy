'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { renderShapeSvg, COLOR_MAP } from '../utils/shapes';

export default function Memorize() {
  const referenceTargets = useGameStore((state) => state.referenceTargets);
  const setPhase = useGameStore((state) => state.setPhase);
  const selectedPlayerIds = useGameStore((state) => state.selectedPlayerIds);
  const teacher = useGameStore((state) => state.teacher);
  const selectedClass = useGameStore((state) => state.selectedClass);

  const [timeLeft, setTimeLeft] = useState(8);

  const currentClass = teacher?.classes?.find(
    (c) => c.grade === selectedClass?.grade && c.section === selectedClass?.section
  );

  const activeStudents = currentClass?.students?.filter((s) =>
    selectedPlayerIds.includes(s.id)
  ) || [];

  useEffect(() => {
    soundEngine.playCountdown();
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        soundEngine.playCountdown();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      soundEngine.playVictory();
      setPhase('countdown');
    }
  }, [timeLeft, setPhase]);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col items-center"
      style={{
        background: 'linear-gradient(135deg, #4a3ec4 0%, #3730a3 40%, #2d2690 100%)',
      }}
    >
      {/* Header */}
      <div className="relative z-10 w-full px-12 pt-10 pb-4 flex flex-col items-center shrink-0">
        <h1 className="text-white font-chicalo text-5xl tracking-widest uppercase text-center">
          Memorise the image
        </h1>
      </div>

      {/* Image container — identical markup to Reconstruct's play area */}
      <div className="flex-1 flex items-center justify-center w-full px-4 relative z-10">
        <div
          className="relative w-full max-w-2xl aspect-[16/10] rounded-[48px] overflow-hidden border-8 border-white shadow-[0_40px_80px_rgba(0,0,0,0.7)] bg-slate-900"
        >
          <img 
            src="/assets/backgrounds/MemoriseImg2.jpeg" 
            alt="Memorize" 
            className="absolute inset-0 w-full h-full object-fill opacity-90"
          />

          {/* Overlaying Shapes — same size (56px) and centering as Reconstruct */}
          <div className="absolute inset-0">
            {referenceTargets.map((target) => {
              const meta = COLOR_MAP[target.color];
              return (
                <motion.div
                  key={target.id}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div 
                    dangerouslySetInnerHTML={{ __html: renderShapeSvg(target.shape, meta.hex, 56) }}
                    className={`drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${meta.glow}`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timer (Bottom Right) */}
      <div className="absolute bottom-10 right-10 z-20 shrink-0">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle 
              cx="48" cy="48" r="40" 
              fill="none" stroke="white" strokeWidth="4" strokeOpacity="0.1" 
            />
            <motion.circle 
              cx="48" cy="48" r="40" 
              fill="none" stroke="white" strokeWidth="4" 
              strokeDasharray="251.2"
              animate={{ strokeDashoffset: 251.2 * (1 - timeLeft / 8) }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </svg>
          <span className="text-white font-black text-4xl">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}
