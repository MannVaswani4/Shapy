'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { useGameStore } from '../store/gameStore';

interface HeaderProps {
  onAboutOpen: () => void;
  onHowToPlayOpen: () => void;
}

export default function Header({ onAboutOpen, onHowToPlayOpen }: HeaderProps) {
  const logoutTeacher = useGameStore((state) => state.logoutTeacher);
  const teacher = useGameStore((state) => state.teacher);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!teacher) return null;

  return (
    <motion.div 
      className="absolute top-6 right-8 flex items-center gap-4 z-[60]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <button 
        onClick={() => { soundEngine.playTap(); onAboutOpen(); }}
        className="px-5 py-2.5 min-h-[40px] bg-white/10 hover:bg-white/20 text-white font-medium rounded-full backdrop-blur-md border border-white/60 flex items-center gap-2 text-sm transition-all"
      >
        <span>About Shapy</span>
      </button>
      <button 
        onClick={() => { soundEngine.playTap(); onHowToPlayOpen(); }}
        className="px-5 py-2.5 min-h-[40px] bg-white/10 hover:bg-white/20 text-white font-medium rounded-full backdrop-blur-md border border-white/60 flex items-center gap-2 text-sm transition-all"
      >
        <span>How to Play</span>
      </button>
      
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-full border-2 border-white bg-[#3b59ce] flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-all shadow-lg overflow-hidden" 
          onClick={() => { soundEngine.playTap(); setShowDropdown(!showDropdown); }}
        >
          {teacher.photoURL ? (
            <img src={teacher.photoURL} alt={teacher.name} className="w-full h-full object-cover" />
          ) : (
            <User size={24} strokeWidth={2.5} />
          )}
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Logged in as</p>
                <p className="text-sm font-black text-[#3b59ce] truncate">{teacher.name}</p>
              </div>
              <button 
                onClick={() => { soundEngine.playTap(); logoutTeacher(); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
