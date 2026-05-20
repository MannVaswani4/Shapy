'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, ShapeType, ColorType } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { renderShapeSvg, SHAPE_LIST, COLOR_LIST, COLOR_MAP } from '../utils/shapes';
import { Clock, Trophy } from 'lucide-react';

interface SpawnedShape {
  id: string;
  shape: ShapeType;
  color: ColorType;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  isDragging?: boolean;
}

export default function CollectGame() {
  const selectedPlayerIds = useGameStore((state) => state.selectedPlayerIds);
  const activePlayerIndex = useGameStore((state) => state.activePlayerIndex);
  const difficulty = useGameStore((state) => state.difficulty);
  const teacher = useGameStore((state) => state.teacher);
  const collectShapeStore = useGameStore((state) => state.collectShape);
  const nextPlayerTurnStore = useGameStore((state) => state.nextPlayerTurn);
  const playerScores = useGameStore((state) => state.playerScores);

  const activePlayerId = selectedPlayerIds[activePlayerIndex];
  let activeStudent = null;
  if (teacher && teacher.classes) {
    for (const cls of teacher.classes) {
      const s = cls.students.find(std => std.id === activePlayerId);
      if (s) { activeStudent = s; break; }
    }
  }

  const [timeLeft, setTimeLeft] = useState(difficulty === 'Easy' ? 25 : 18);
  const [spawnedShapes, setSpawnedShapes] = useState<SpawnedShape[]>([]);
  const [feedbackBurst, setFeedbackBurst] = useState<{ id: string; text: string; color: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!activeStudent) return;
    const seed = () => {
      const initials: SpawnedShape[] = [];
      for (let i = 0; i < 4; i++) {
        const isTarget = Math.random() > 0.5;
        const speedBase = difficulty === 'Easy' ? 0.35 : 1.0;
        initials.push({
          id: `seed-${i}-${Date.now()}`,
          shape: isTarget ? activeStudent!.shape : SHAPE_LIST[Math.floor(Math.random() * SHAPE_LIST.length)],
          color: isTarget ? activeStudent!.color : COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)],
          x: 20 + Math.random() * 60,
          y: 15 + Math.random() * 25,
          speedX: (Math.random() > 0.5 ? 1 : -1) * (speedBase + Math.random() * 0.2),
          speedY: (Math.random() - 0.5) * 0.1,
          size: 85,
        });
      }
      setSpawnedShapes(initials);
    };
    seed();
    const interval = setInterval(() => {
      setSpawnedShapes(prev => {
        if (prev.length >= 10) return prev;
        const isTarget = Math.random() > 0.4;
        const startLeft = Math.random() > 0.5;
        const speedBase = difficulty === 'Easy' ? 0.4 : 1.2;
        const speed = speedBase + Math.random() * 0.3;
        return [...prev, {
          id: `spawn-${Date.now()}-${Math.random()}`,
          shape: isTarget ? activeStudent!.shape : SHAPE_LIST[Math.floor(Math.random() * SHAPE_LIST.length)],
          color: isTarget ? activeStudent!.color : COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)],
          x: startLeft ? -15 : 115,
          y: 10 + Math.random() * 35,
          speedX: startLeft ? speed : -speed,
          speedY: (Math.random() - 0.5) * 0.1,
          size: 85,
        }];
      });
    }, difficulty === 'Easy' ? 1600 : 900);
    return () => clearInterval(interval);
  }, [activeStudent, difficulty]);

  const animate = (time: number) => {
    if (lastTimeRef.current !== null) {
      const dt = Math.min((time - lastTimeRef.current) / 16, 2);
      setSpawnedShapes(prev => prev.map(s => {
        if (s.isDragging) return s;
        return { ...s, x: s.x + s.speedX * dt, y: s.y + s.speedY * dt };
      }).filter(s => s.x > -40 && s.x < 140));
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) { soundEngine.playVictory(); nextPlayerTurnStore(); }
  }, [timeLeft, nextPlayerTurnStore]);

  const handleDragStart = (id: string) => {
    soundEngine.playDrag();
    setSpawnedShapes(prev => prev.map(s => s.id === id ? { ...s, isDragging: true } : s));
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    const dragging = spawnedShapes.find(s => s.isDragging);
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setSpawnedShapes(prev => prev.map(s => s.isDragging ? { ...s, x: ((x - rect.left) / rect.width) * 100, y: ((y - rect.top) / rect.height) * 100 } : s));
  };

  const handleDragEnd = () => {
    const dragging = spawnedShapes.find(s => s.isDragging);
    if (!dragging) return;
    const isInBasket = dragging.y > 70 && dragging.x > 35 && dragging.x < 85; // Adjusted for shifted basket
    
    if (isInBasket) {
      const isCorrect = dragging.shape === activeStudent?.shape && dragging.color === activeStudent?.color;
      if (isCorrect) {
        soundEngine.playCollect();
        collectShapeStore({ shape: dragging.shape, color: dragging.color });
        setFeedbackBurst({ id: String(Date.now()), text: 'PERFECT! ✨', color: 'text-amber-400' });
        setTimeout(() => setFeedbackBurst(null), 1200);
        setSpawnedShapes(prev => prev.filter(s => s.id !== dragging.id));
      } else {
        soundEngine.playCountdown();
        setFeedbackBurst({ id: String(Date.now()), text: 'Arghh! ❌', color: 'text-rose-500' });
        setTimeout(() => setFeedbackBurst(null), 1200);
        setSpawnedShapes(prev => prev.filter(s => s.id !== dragging.id));
      }
    } else {
      setSpawnedShapes(prev => prev.map(s => s.id === dragging.id ? { ...s, isDragging: false } : s));
    }
  };

  const currentScore = activeStudent ? (playerScores[activeStudent.id] || 0) : 0;

  return (
    <div ref={containerRef} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd} className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center select-none z-[1000]" style={{ background: 'linear-gradient(135deg, #4a3ec4 0%, #3730a3 40%, #2d2690 100%)' }}>
      <div className="relative z-[3000] w-full px-12 py-8 flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
           {activeStudent && (
             <div 
               dangerouslySetInnerHTML={{ __html: renderShapeSvg(activeStudent.shape, COLOR_MAP[activeStudent.color].hex, 64) }} 
               className="drop-shadow-lg"
             />
           )}
           <div className="flex flex-col">
             <span className="text-white font-chicalo text-4xl uppercase tracking-widest drop-shadow-lg">{activeStudent?.name}</span>
           </div>
        </div>
        <div className="flex gap-6 pointer-events-auto">
          <div className="h-20 px-8 bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-[24px] flex items-center gap-4 shadow-xl">
             <Trophy size={28} className="text-yellow-400" /><span className="text-white font-black text-4xl">{currentScore}</span>
          </div>
          <div className="h-20 px-8 bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-[24px] flex items-center gap-4 shadow-xl">
             <Clock size={28} className="text-blue-400" /><span className="text-white font-black text-4xl">{timeLeft}s</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {spawnedShapes.map((s) => {
          const meta = COLOR_MAP[s.color];
          return (
            <div key={s.id} onMouseDown={() => handleDragStart(s.id)} onTouchStart={() => handleDragStart(s.id)} className="absolute pointer-events-auto cursor-grab active:cursor-grabbing" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `translate(-50%, -50%) ${s.isDragging ? 'scale(1.3)' : 'scale(1)'}`, zIndex: s.isDragging ? 2000 : 100 }}>
              <div dangerouslySetInnerHTML={{ __html: renderShapeSvg(s.shape, meta.hex, s.size) }} className="drop-shadow-lg" />
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-40 z-20 w-[340px] pointer-events-none flex justify-center">
         <img src="/assets/backgrounds/Basket.png" alt="Basket" className="w-full h-auto drop-shadow-2xl" />
         <AnimatePresence>
            {feedbackBurst && (
              <motion.div 
                key={feedbackBurst.id} 
                initial={{ opacity: 0, y: 20, scale: 0.8 }} 
                animate={{ opacity: 1, y: -100, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.5 }} 
                className={`absolute bottom-full mb-8 left-1/2 -translate-x-[80%] font-chicalo text-2xl uppercase tracking-widest pointer-events-none drop-shadow-md whitespace-nowrap ${feedbackBurst.color}`}
              >
                {feedbackBurst.text}
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
