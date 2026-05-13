import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { LogOut, Users, PlusCircle, Sparkles, Check, X } from 'lucide-react';

export default function Welcome() {
  const teacher = useGameStore((state) => state.teacher);
  const setPhase = useGameStore((state) => state.setPhase);
  const logoutTeacher = useGameStore((state) => state.logoutTeacher);
  const updateTeacherName = useGameStore((state) => state.updateTeacherName);

  // Cinematic transition states
  const [isFlickering, setIsFlickering] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(teacher?.name || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlickering(false);
      setShowContent(true);
      soundEngine.playSuccess();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectClass = () => {
    soundEngine.playSuccess();
    setPhase('class-select');
  };

  const handleStartEditing = () => {
    soundEngine.playTap();
    setNewName(teacher?.name || '');
    setIsEditing(true);
  };

  const handleSaveName = () => {
    if (newName.trim()) {
      updateTeacherName(newName.trim());
      soundEngine.playSuccess();
      setIsEditing(false);
    }
  };

  const handleCancelEditing = () => {
    soundEngine.playTap();
    setIsEditing(false);
  };

  return (
    <div className="relative w-full min-h-screen flex-1 select-none overflow-hidden flex flex-col items-center justify-center bg-black">
      {/* Dark Base Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/assets/backgrounds/DarkLoginScreen.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Main Background (Classroom Reveal) */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: `url('/assets/backgrounds/LoginScreenBackground.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Flickering Lights Layer */}
      <AnimatePresence>
        {isFlickering && (
          <motion.div
            key="flicker-layer-welcome"
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/assets/backgrounds/LoginScreenLights.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            animate={{
              opacity: [0, 0.8, 0.2, 1, 0.4, 1, 0, 1],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.1, 0.2, 0.4, 0.6, 0.7, 0.8, 1],
              ease: "linear"
            }}
          />
        )}
      </AnimatePresence>

      {/* Glowing Transparent Layer */}
      {showContent && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{
            backgroundImage: `url('/assets/backgrounds/LoginScreenBackgroundTransparent.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}


      {/* Hanging Banner */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -50 }}
        transition={{ delay: 1.5, duration: 1, type: 'spring', damping: 12 }}
      >
        <div className="relative w-[750px] flex flex-col items-center">
          {/* Hanging Strings - Attached to edges of the 750px banner */}
          <div className="absolute -top-[100vh] bottom-1/2 left-0 w-[3px] bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          <div className="absolute -top-[100vh] bottom-1/2 right-0 w-[3px] bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.4)]" />

          {/* Namaste Tab */}
          <div className="bg-[#3C2EA8] text-white px-20 py-2.5 rounded-t-[50px] rounded-b-[4px] border-x-4 border-t-4 border-white/60 min-w-[450px] flex justify-center items-center shadow-lg">
            <h2 className="text-lg font-black tracking-widest uppercase font-chicalo">Namaste</h2>
          </div>

          {/* Teacher Name Banner */}
          <div className="bg-[#3C2EA8] w-full py-5 rounded-t-[4px] rounded-b-[50px] border-4 border-white/80 shadow-2xl flex items-center justify-center gap-10">
            <div className="w-0 h-0 border-y-[18px] border-y-transparent border-l-[28px] border-l-[#fbd50e] filter drop-shadow-md" />
            
            {isEditing ? (
              <div className="flex items-center gap-4">
                <input 
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="bg-white/20 border-b-2 border-white text-white text-2xl font-black tracking-widest uppercase outline-none px-4 w-[400px]"
                />
                <button onClick={handleSaveName} className="text-green-400 hover:text-green-300 transition-colors"><Check size={32} /></button>
                <button onClick={handleCancelEditing} className="text-red-400 hover:text-red-300 transition-colors"><X size={32} /></button>
              </div>
            ) : (
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-widest uppercase drop-shadow-lg font-chicalo">
                {teacher?.name || 'PRANAYA MISS'}
              </h1>
            )}

            <div className="w-0 h-0 border-y-[18px] border-y-transparent border-r-[28px] border-r-[#fbd50e] filter drop-shadow-md" />
          </div>

          {/* String attachment points */}
          <div className="absolute top-[50%] -left-1.5 w-6 h-6 bg-white rounded-full border-4 border-[#3C2EA8] shadow-md z-10" />
          <div className="absolute top-[50%] -right-1.5 w-6 h-6 bg-white rounded-full border-4 border-[#3C2EA8] shadow-md z-10" />
        </div>
      </motion.div>

      {/* Bottom Corner Buttons */}
      <motion.div 
        className="absolute bottom-10 inset-x-12 flex justify-between items-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <button
          onClick={handleStartEditing}
          className="px-10 py-4 bg-black/60 hover:bg-black/80 text-white font-bold text-xl rounded-[28px] border-2 border-white/60 backdrop-blur-md transition-all active:scale-90 shadow-xl"
        >
          Change Name
        </button>

        <button
          onClick={handleSelectClass}
          className="px-10 py-4 bg-black/60 hover:bg-black/80 text-white font-bold text-xl rounded-[28px] border-2 border-white/60 backdrop-blur-md transition-all active:scale-90 shadow-xl"
        >
          Select Class
        </button>
      </motion.div>
    </div>
  );
}
