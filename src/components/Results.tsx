'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { renderShapeSvg, COLOR_MAP } from '../utils/shapes';
import { Trophy, RotateCcw, LayoutDashboard, Sparkles, Medal } from 'lucide-react';

export default function Results() {
  const playerScores = useGameStore((state) => state.playerScores);
  const selectedPlayerIds = useGameStore((state) => state.selectedPlayerIds);
  const teacher = useGameStore((state) => state.teacher);
  const setPhase = useGameStore((state) => state.setPhase);
  const resetGameSessionStore = useGameStore((state) => state.resetGameSession);

  useEffect(() => {
    soundEngine.playVictory();
  }, []);

  const students = selectedPlayerIds.map(id => {
    let student = null;
    if (teacher && teacher.classes) {
      for (const cls of teacher.classes) {
        student = cls.students.find(s => s.id === id);
        if (student) break;
      }
    }
    return {
      ...student,
      score: playerScores[id] || 0
    };
  }).filter(s => s.id);

  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  const podiumOrder = [];
  if (sortedStudents[1]) podiumOrder.push({ ...sortedStudents[1], rank: 2 });
  if (sortedStudents[0]) podiumOrder.push({ ...sortedStudents[0], rank: 1 });
  if (sortedStudents[2]) podiumOrder.push({ ...sortedStudents[2], rank: 3 });

  const handlePlayAgain = () => {
    soundEngine.playVictory();
    resetGameSessionStore();
    setPhase('player-select');
  };

  const handleBackToDashboard = () => {
    soundEngine.playTap();
    resetGameSessionStore();
    setPhase('welcome');
  };

  const getRankData = (rank: number) => {
    switch (rank) {
      case 1: return { label: '1st', color: 'text-amber-400', height: 'h-40', bg: 'from-amber-400/20 to-transparent' };
      case 2: return { label: '2nd', color: 'text-slate-300', height: 'h-32', bg: 'from-slate-400/10 to-transparent' };
      case 3: return { label: '3rd', color: 'text-orange-400', height: 'h-24', bg: 'from-orange-400/10 to-transparent' };
      default: return { label: '', color: '', height: 'h-20', bg: '' };
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none"
    >
      {/* Login Screen Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/assets/backgrounds/LoginScreenBackground.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 bg-slate-950/40" />

      

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl bg-slate-900/10 backdrop-blur-3xl border-2 border-white/20 rounded-[48px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.3)] flex flex-col items-center"
      >
        <div className="absolute -top-7 bg-amber-400 text-slate-950 px-8 py-2 rounded-full font-chicalo text-2xl shadow-xl border-4 border-white flex items-center gap-2">
          <Trophy size={24} />
          <span>VICTORY STAND</span>
        </div>

        {/* Podium Layout */}
        <div className="w-full flex items-end justify-center gap-4 mt-28 mb-8 h-[240px]">
           {podiumOrder.map((s, idx) => {
             const rankData = getRankData(s.rank);
             const meta = COLOR_MAP[s.color as any] || COLOR_MAP.red;
             
             return (
               <motion.div
                 key={s.id}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 + idx * 0.15, type: 'spring' }}
                 className="flex flex-col items-center group flex-1 max-w-[140px]"
               >
                 <div className="relative mb-4">
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                      dangerouslySetInnerHTML={{ __html: renderShapeSvg(s.shape as any, meta.hex, 64) }} 
                      className={`${meta.glow}`}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-slate-900/80 border-2 border-white/20 rounded-full p-1.5">
                       <Medal className={rankData.color} size={14} />
                    </div>
                 </div>

                 <div className="text-white font-chicalo text-base uppercase tracking-widest mb-0.5 drop-shadow-md">{s.name}</div>
                 <div className="text-amber-400 font-black text-2xl mb-3 drop-shadow-md">{s.score}</div>

                 <div className={`w-full ${rankData.height} rounded-t-2xl bg-gradient-to-b ${rankData.bg} border-t-2 border-white/20 flex items-center justify-center`}>
                    <span className={`font-chicalo text-3xl opacity-30 ${rankData.color}`}>{rankData.label}</span>
                 </div>
               </motion.div>
             );
           })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-2">
           <button
             onClick={handlePlayAgain}
             className="flex-1 h-14 bg-white/90 text-slate-950 font-black uppercase text-base rounded-[20px] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-slate-300"
           >
             <RotateCcw size={20} />
             Replay
           </button>
           <button
             onClick={handleBackToDashboard}
             className="flex-1 h-14 bg-slate-800/80 text-white font-black uppercase text-base rounded-[20px] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-slate-950"
           >
             <LayoutDashboard size={20} />
             Home
           </button>
        </div>
      </motion.div>
    </div>
  );
}
