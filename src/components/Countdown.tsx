'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { renderShapeSvg, COLOR_MAP } from '../utils/shapes';

const STEPS = ['READY', '3', '2', '1', 'START'];

export default function Countdown() {
  const selectedPlayerIds = useGameStore((state) => state.selectedPlayerIds);
  const activePlayerIndex = useGameStore((state) => state.activePlayerIndex);
  const teacher = useGameStore((state) => state.teacher);
  const selectedClass = useGameStore((state) => state.selectedClass);
  const setPhase = useGameStore((state) => state.setPhase);

  const [stepIndex, setStepIndex] = useState(0);

  const currentClass = teacher?.classes?.find(
    (c) => c.grade === selectedClass?.grade && c.section === selectedClass?.section
  );

  const activePlayerId = selectedPlayerIds[activePlayerIndex];
  const activeStudent = currentClass?.students?.find((s) => s.id === activePlayerId);

  // Keep a ref to the interval so we can clear it from anywhere
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick the counter — state updater only returns the next index, no side-effects
  useEffect(() => {
    soundEngine.playCountdown();

    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        // Clamp at last step; the separate effect below will handle phase change
        return next < STEPS.length ? next : prev;
      });
    }, 1200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // runs once on mount

  // React to step changes — safe place for sounds and phase transitions
  useEffect(() => {
    if (stepIndex === 0) return; // initial mount, already played above

    const currentStep = STEPS[stepIndex];

    if (stepIndex === STEPS.length - 1) {
      // Last step reached — stop the interval and move to next phase after a beat
      if (intervalRef.current) clearInterval(intervalRef.current);
      soundEngine.playVictory();
      const t = setTimeout(() => setPhase('collect'), 1200);
      return () => clearTimeout(t);
    }

    if (currentStep === 'START') {
      soundEngine.playVictory();
    } else {
      soundEngine.playCountdown();
    }
  }, [stepIndex, setPhase]);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #4a3ec4 0%, #3730a3 40%, #2d2690 100%)',
      }}
    >
      <div className="absolute inset-0 bg-slate-950/60 z-0" />

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-12 z-20 flex flex-col items-center"
      >
        <span className="text-amber-400 font-black text-2xl tracking-widest uppercase">
          Player {activePlayerIndex + 1} Turn Preparation
        </span>

        {activeStudent && (
          <div className="mt-3 flex items-center gap-4 bg-slate-900/90 border-2 border-white/40 px-8 py-3 rounded-full shadow-2xl backdrop-blur-md">
            <div
              dangerouslySetInnerHTML={{
                __html: renderShapeSvg(
                  activeStudent.shape,
                  COLOR_MAP[activeStudent.color].hex,
                  40
                ),
              }}
              className={COLOR_MAP[activeStudent.color].glow}
            />
            <span className="text-white font-black text-3xl uppercase tracking-wide">
              {activeStudent.name}
            </span>
          </div>
        )}
      </motion.div>

      <div className="relative z-10 flex items-center justify-center h-64 w-full">
        <AnimatePresence>
          <motion.div
            key={STEPS[stepIndex]}
            initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
            exit={{ scale: 2.5, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 15, stiffness: 120, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <h1 
              className="font-chicalo text-8xl md:text-[12rem] tracking-tighter text-amber-400 drop-shadow-[0_20px_50px_rgba(251,191,36,0.6)]"
              style={{
                WebkitTextStroke: '6px #ffffff',
                textShadow: '0 10px 0 #ea580c, 0 25px 35px rgba(0,0,0,0.8)',
              }}
            >
              {STEPS[stepIndex]}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => {
          soundEngine.playVictory();
          setPhase('collect');
        }}
        className="absolute bottom-6 right-8 px-6 py-3 min-h-[48px] bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 z-20 text-sm"
      >
        Skip Countdown ⏩
      </button>
    </div>
  );
}
