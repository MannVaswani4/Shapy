'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, Difficulty, Student } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { renderShapeSvg, COLOR_MAP } from '../utils/shapes';
import { Play, ChevronDown, Check } from 'lucide-react';

export default function PlayerSelect() {
  const teacher = useGameStore((state) => state.teacher);
  const selectedClass = useGameStore((state) => state.selectedClass);
  const setPhase = useGameStore((state) => state.setPhase);
  const setupGame = useGameStore((state) => state.setupGame);

  const currentClass = teacher?.classes?.find(
    (c) => c.grade === selectedClass?.grade && c.section === selectedClass?.section
  );

  const students = currentClass?.students || [];

  const [slot1, setSlot1] = useState<string>('');
  const [slot2, setSlot2] = useState<string>('');
  const [slot3, setSlot3] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [errorMsg, setErrorMsg] = useState('');

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleStartGame = () => {
    // Check if at least 2 unique players are selected
    const selectedIds = [slot1, slot2, slot3].filter(id => id !== '');
    const uniqueIds = Array.from(new Set(selectedIds));

    if (uniqueIds.length < 2) {
      setErrorMsg('Please select at least 2 unique players!');
      soundEngine.playCountdown();
      return;
    }

    if (selectedIds.length !== uniqueIds.length) {
      setErrorMsg('Each player must be unique!');
      soundEngine.playCountdown();
      return;
    }

    soundEngine.playVictory();
    setupGame(uniqueIds, difficulty);
  };

  const renderDropdown = (slotIndex: number, currentId: string, setSlot: (id: string) => void) => {
    const selectedStudent = students.find(s => s.id === currentId);
    const isOpen = openDropdown === slotIndex;

    return (
      <div className="relative w-80">
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.playTap();
            setOpenDropdown(isOpen ? null : slotIndex);
          }}
          className={`w-full h-16 bg-white/10 backdrop-blur-md border-2 rounded-2xl px-6 flex items-center justify-between transition-all ${isOpen ? 'border-yellow-400' : 'border-white/20'}`}
        >
          <div className="flex items-center gap-3">
            {selectedStudent ? (
              <>
                <div 
                  className={COLOR_MAP[selectedStudent.color].glow}
                  dangerouslySetInnerHTML={{ __html: renderShapeSvg(selectedStudent.shape, COLOR_MAP[selectedStudent.color].hex, 32) }}
                />
                <span className="text-white font-black text-xl">{selectedStudent.name}</span>
              </>
            ) : (
              <span className="text-white/40 font-bold">Select Player {slotIndex}</span>
            )}
          </div>
          <ChevronDown className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-64 overflow-y-auto border-2 border-white"
            >
              <div 
                className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex items-center justify-between"
                onClick={() => {
                  setSlot('');
                  setOpenDropdown(null);
                  soundEngine.playTap();
                }}
              >
                <span className="text-slate-400 font-bold italic">None / Empty</span>
                {currentId === '' && <Check size={16} className="text-blue-500" />}
              </div>
              {students
                .filter(st => {
                  // Only show students not already selected in OTHER slots
                  const otherSelectedIds = [slot1, slot2, slot3].filter((id, idx) => (idx + 1) !== slotIndex && id !== '');
                  return !otherSelectedIds.includes(st.id);
                })
                .map(st => (
                <div
                  key={st.id}
                  onClick={() => {
                    setSlot(st.id);
                    setOpenDropdown(null);
                    soundEngine.playTap();
                  }}
                  className={`p-4 hover:bg-blue-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors ${currentId === st.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div dangerouslySetInnerHTML={{ __html: renderShapeSvg(st.shape, COLOR_MAP[st.color].hex, 24) }} />
                    <span className="text-[#2d2690] font-black text-lg">{st.name}</span>
                  </div>
                  {currentId === st.id && <Check size={20} className="text-[#3b59ce]" strokeWidth={3} />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col items-center"
      style={{
        background: 'linear-gradient(135deg, #4a3ec4 0%, #3730a3 40%, #2d2690 100%)',
      }}
      onClick={() => setOpenDropdown(null)}
    >
      {/* Header */}
      <div className="pt-32 pb-4 text-center">
        <h1 className="text-white font-chicalo text-6xl tracking-widest uppercase mb-4">Select Players to play</h1>
        <p className="text-white/60 font-bold text-xl uppercase tracking-widest">
          you can choose 3 players to play
        </p>
      </div>

      {/* Player Dropdowns Container */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full">
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-white/40 font-black uppercase tracking-widest text-sm">Player 1</span>
            {renderDropdown(1, slot1, setSlot1)}
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="text-white/40 font-black uppercase tracking-widest text-sm">Player 2</span>
            {renderDropdown(2, slot2, setSlot2)}
          </div>
          <div className="flex flex-col items-center gap-4">
            <span className="text-white/40 font-black uppercase tracking-widest text-sm">Player 3</span>
            {renderDropdown(3, slot3, setSlot3)}
          </div>
        </div>

        {/* Level Settings */}
        <div className="flex flex-col items-center gap-6 mt-8">
           <div className="flex gap-6">
              <button
                onClick={() => {
                  setDifficulty('Easy');
                  soundEngine.playTap();
                }}
                className={`h-16 px-12 rounded-full font-black text-xl transition-all border-4 ${difficulty === 'Easy' ? 'bg-white text-[#2d2690] border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
              >
                EASY MODE
              </button>
              <button
                onClick={() => {
                  setDifficulty('Hard');
                  soundEngine.playTap();
                }}
                className={`h-16 px-12 rounded-full font-black text-xl transition-all border-4 ${difficulty === 'Hard' ? 'bg-white text-[#2d2690] border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
              >
                HARD MODE
              </button>
           </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pb-16 flex flex-col items-center gap-6">
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-xl border-2 border-white animate-bounce"
          >
            ⚠️ {errorMsg}
          </motion.div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(253, 224, 71, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartGame}
          className="h-16 px-16 bg-yellow-400 border-2 border-white text-[#2d2690] font-black text-xl rounded-full flex items-center gap-3 shadow-2xl"
        >
          <span>START GAME</span>
          <Play size={24} fill="currentColor" />
        </motion.button>
      </div>
    </div>
  );
}
