'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, ShapeType, ColorType } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { renderShapeSvg, COLOR_MAP } from '../utils/shapes';
import { Trophy, ChevronRight } from 'lucide-react';

interface PlacedTargetState {
  id: string;
  isFilled: boolean;
  filledByShape?: ShapeType;
  filledByColor?: ColorType;
}

interface InventoryItem {
  uid: string;
  shape: ShapeType;
  color: ColorType;
  originalPlayerId: string;
  isDragging?: boolean;
  x?: number;
  y?: number;
}

export default function Reconstruct() {
  const referenceTargets = useGameStore((state) => state.referenceTargets);
  const collectedShapes = useGameStore((state) => state.collectedShapes);
  const updateScoreStore = useGameStore((state) => state.updateScore);
  const finishGameSessionStore = useGameStore((state) => state.finishGameSession);
  const totalScore = useGameStore((state) => state.score);

  const [placedTargets, setPlacedTargets] = useState<PlacedTargetState[]>(() =>
    referenceTargets.map((t) => ({ id: t.id, isFilled: false }))
  );

  const [inventory, setInventory] = useState<InventoryItem[]>(() => 
    collectedShapes.map((cs, idx) => ({
      uid: cs.id || `inv-${Date.now()}-${idx}`,
      shape: cs.shape,
      color: cs.color,
      originalPlayerId: cs.assignedToPlayerId,
    }))
  );

  const groupedInventory = inventory.reduce((acc, item) => {
    if (item.isDragging) return acc;
    const key = `${item.shape}-${item.color}`;
    if (!acc[key]) {
      acc[key] = { shape: item.shape, color: item.color, count: 0, firstUid: item.uid };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, { shape: ShapeType; color: ColorType; count: number; firstUid: string }>);

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>({
    text: 'Drag collected shapes onto their correct frames!',
    type: 'success',
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const playAreaRef = useRef<HTMLDivElement>(null);

  const handleStartItemDrag = (uid: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    soundEngine.playDrag();
    
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setInventory((prev) =>
      prev.map((it) => it.uid === uid ? { 
        ...it, 
        isDragging: true, 
        x: ((x - rect.left) / rect.width) * 100, 
        y: ((y - rect.top) / rect.height) * 100 
      } : it)
    );
  };

  const handleMoveItemDrag = (e: React.MouseEvent | React.TouchEvent) => {
    const draggingObj = inventory.find((it) => it.isDragging);
    if (!draggingObj || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setInventory((prev) => prev.map((it) => it.isDragging ? { 
      ...it, 
      x: ((x - rect.left) / rect.width) * 100, 
      y: ((y - rect.top) / rect.height) * 100 
    } : it));
  };

  const handleEndItemDrag = () => {
    const draggingObj = inventory.find((it) => it.isDragging);
    if (!draggingObj || !playAreaRef.current) return;

    const rect = playAreaRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current!.getBoundingClientRect();
    
    const absX = (draggingObj.x! / 100) * canvasRect.width + canvasRect.left;
    const absY = (draggingObj.y! / 100) * canvasRect.height + canvasRect.top;
    
    const playAreaX = ((absX - rect.left) / rect.width) * 100;
    const playAreaY = ((absY - rect.top) / rect.height) * 100;

    let snappedTargetId: string | null = null;
    const thresholdPct = 10;

    for (const target of referenceTargets) {
      const isOccupied = placedTargets.find((pt) => pt.id === target.id)?.isFilled;
      if (isOccupied) continue;

      const dx = target.x - playAreaX;
      const dy = target.y - playAreaY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= thresholdPct) {
        const isExactMatch = target.shape === draggingObj.shape && target.color === draggingObj.color;
        if (isExactMatch) {
          snappedTargetId = target.id;
          break;
        } else {
          soundEngine.playCountdown();
          setMessage({ text: `Needs a ${target.color} ${target.shape}!`, type: 'error' });
          setInventory((prev) => prev.map((it) => it.uid === draggingObj.uid ? { ...it, isDragging: false } : it));
          return;
        }
      }
    }

    if (snappedTargetId) {
      soundEngine.playSuccess();
      updateScoreStore(25, draggingObj.originalPlayerId); 
      setPlacedTargets((prev) =>
        prev.map((pt) => pt.id === snappedTargetId ? { ...pt, isFilled: true, filledByShape: draggingObj.shape, filledByColor: draggingObj.color } : pt)
      );
      setInventory((prev) => prev.filter((it) => it.uid !== draggingObj.uid));
    } else {
      setInventory((prev) => prev.map((it) => it.uid === draggingObj.uid ? { ...it, isDragging: false } : it));
    }
  };

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMoveItemDrag}
      onMouseUp={handleEndItemDrag}
      onTouchMove={handleMoveItemDrag}
      onTouchEnd={handleEndItemDrag}
      className="fixed inset-0 w-full h-full flex items-stretch select-none overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4a3ec4 0%, #3730a3 40%, #2d2690 100%)' }}
    >
      <div className="w-[180px] h-full bg-black/40 backdrop-blur-3xl border-r-2 border-white/10 p-6 flex flex-col justify-center items-center z-20 shadow-2xl">
         <div className="mb-8 text-center">
            <span className="text-amber-400 font-black uppercase text-[8px] tracking-[0.4em] block mb-2 opacity-60">Inventory</span>
            <div className="h-0.5 w-8 bg-white/20 mx-auto rounded-full" />
         </div>

         <div className="w-full space-y-4 flex flex-col items-center">
            {Object.values(groupedInventory).map((item) => {
              const meta = COLOR_MAP[item.color];
              return (
                <motion.div
                  key={item.firstUid}
                  whileHover={{ scale: 1.1, x: 5 }}
                  onMouseDown={(e) => handleStartItemDrag(item.firstUid, e)}
                  onTouchStart={(e) => handleStartItemDrag(item.firstUid, e)}
                  className="relative group cursor-grab active:cursor-grabbing w-24 aspect-square flex items-center justify-center transition-all"
                >
                  <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-xs w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                    {item.count}
                  </div>
                  <div 
                    dangerouslySetInnerHTML={{ __html: renderShapeSvg(item.shape, meta.hex, 64) }} 
                    className={`${meta.glow}`}
                  />
                </motion.div>
              );
            })}
         </div>

         <div className="mt-10 text-center">
            <Trophy className="text-amber-400 mb-1 mx-auto" size={24} />
            <span className="text-white font-black text-2xl tracking-tighter">{totalScore}</span>
         </div>
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-center p-8">
        <div className="mt-12 mb-8 text-center">
          <h1 className="text-white font-chicalo text-4xl uppercase tracking-[0.2em] drop-shadow-2xl">
            Place the shapes
          </h1>
          <div className="h-1.5 w-40 bg-amber-400 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
        </div>

        <div 
          ref={playAreaRef}
          className="relative w-full max-w-2xl aspect-[16/10] rounded-[48px] overflow-hidden border-8 border-white shadow-[0_40px_80px_rgba(0,0,0,0.7)] bg-slate-900"
        >
          <img src="/assets/backgrounds/MemoriseImg1.png" alt="Target" className="absolute inset-0 w-full h-full object-fill opacity-70" />

          {referenceTargets.map((target) => {
            const placedInfo = placedTargets.find((pt) => pt.id === target.id);
            const isFilled = placedInfo?.isFilled;
            return (
              <div
                key={target.id}
                className={`absolute flex items-center justify-center rounded-2xl border-4 transition-all duration-500 ${isFilled ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105' : 'border-dashed border-white/40 bg-black/20'}`}
                style={{ left: `${target.x}%`, top: `${target.y}%`, width: '80px', height: '80px', transform: 'translate(-50%, -50%)' }}
              >
                {isFilled && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <div dangerouslySetInnerHTML={{ __html: renderShapeSvg(placedInfo!.filledByShape!, COLOR_MAP[placedInfo!.filledByColor!].hex, 56) }} />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 flex items-center gap-6">
           <AnimatePresence mode="wait">
            {message && (
              <motion.div key={message.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={`px-6 py-2 rounded-full border-2 font-black uppercase text-xs tracking-widest backdrop-blur-md ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'}`}>
                {message.text}
              </motion.div>
            )}
           </AnimatePresence>

           <button
             onClick={() => finishGameSessionStore()}
             className="group flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase text-sm rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
           >
             Finish Game
             <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      <AnimatePresence>
        {inventory.map((item) => {
          if (!item.isDragging) return null;
          const meta = COLOR_MAP[item.color];
          return (
            <div 
              key={item.uid} 
              className="fixed pointer-events-none z-[10000] transform -translate-x-1/2 -translate-y-1/2 scale-110" 
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: renderShapeSvg(item.shape, meta.hex, 80) }} 
                className={`filter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] ${meta.glow}`} 
              />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
