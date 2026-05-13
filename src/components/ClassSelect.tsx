'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, Class } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { Plus, User, Play, Info, HelpCircle, ChevronsRight } from 'lucide-react';
import { TextFlippingBoard } from '../ui/text-flipping-board';

export default function ClassSelect() {
  const teacher = useGameStore((state) => state.teacher);
  const setPhase = useGameStore((state) => state.setPhase);
  const selectClassStore = useGameStore((state) => state.selectClass);
  const createClassStore = useGameStore((state) => state.createClass);

  const mockClasses: Class[] = [
    { grade: '1', section: 'C', createdAt: new Date('2024-05-10T10:00:00Z').toISOString() },
    { grade: '2', section: 'F', createdAt: new Date('2024-05-09T14:30:00Z').toISOString() },
    { grade: '4', section: 'A', createdAt: new Date('2024-05-08T09:15:00Z').toISOString() },
    { grade: '2', section: 'C', createdAt: new Date('2024-05-07T11:45:00Z').toISOString() },
    { grade: '1', section: 'G', createdAt: new Date('2024-05-06T16:20:00Z').toISOString() },
    { grade: '3', section: 'E', createdAt: new Date('2024-05-05T13:10:00Z').toISOString() },
  ];

  // Prioritizing mock data for now as per user request to avoid backend confusion
  const displayClasses = mockClasses;

  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [selectedExisting, setSelectedExisting] = useState<Class | null>(
    displayClasses[0] || null
  );

  const handleEnterClass = () => {
    if (!selectedExisting) return;
    soundEngine.playVictory();
    selectClassStore(selectedExisting.grade, selectedExisting.section);
  };

  const handleCreateNew = () => {
    soundEngine.playTap();
    setPhase('class-create');
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center font-nunito"
      style={{
        backgroundImage: `url('/assets/backgrounds/SelectClassBg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >

      <div className="relative w-full max-w-6xl flex items-center justify-center pl-24 pr-48 py-12 gap-8">
        {/* Main Glass Container - Shifted Left and Down */}
        <div className="relative flex-1 h-[65vh] bg-white/5 backdrop-blur-[5px] border-2 border-white/80 rounded-[50px] shadow-2xl flex flex-col items-center -translate-x-12 translate-y-0">
          
          {/* Header Tab */}
          <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-80 h-20 bg-[#3C2EA8] rounded-b-[45px] flex items-center justify-center border-x-2 border-b-2 border-white/60 shadow-xl z-20">
            <span className="text-white font-black text-2xl tracking-wide uppercase">Select Class</span>
          </div>

          <div className="w-full flex-1 flex pt-24 pb-20 backdrop-blur-[5px] px-12 gap-0 overflow-hidden">
            
            {/* Left Column: Previous Classes (Expanded) */}
            <div className="flex-[0.8] flex bg-white/5 backdrop-blur-[3px] rounded-l-[30px] border-y-2 border-l-2 border-white overflow-hidden">
              <div className="w-16 bg-white/10 flex items-center justify-center border-r-2 border-white">
                <span className="rotate-[-90deg] whitespace-nowrap text-white font-black text-xl tracking-widest ">
                  Previous Classes
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-0 custom-scrollbar">
                {displayClasses.map((cls, idx) => (
                  <div 
                    key={idx}
                    onClick={() => { soundEngine.playTap(); setSelectedExisting(cls); }}
                    className={`flex items-center gap-8 py-5 border-b border-white/20 cursor-pointer transition-all ${selectedExisting === cls ? 'bg-white/20 -mx-6 px-12' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2 scale-110 origin-left">
                      <TextFlippingBoard text={`${cls.grade}`} size="sm" highlighted={selectedExisting === cls} />
                      <TextFlippingBoard text={`${cls.section}`} size="sm" highlighted={selectedExisting === cls} />
                    </div>
                    <div className="text-white/60 text-[10px] font-bold whitespace-nowrap uppercase tracking-wider">
                      {new Date(cls.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column: Preview */}
            <div className="flex-[0.9] flex flex-col bg-white/5 rounded-r-[30px] border-2 border-white relative overflow-hidden">
               {/* Blurry Header */}
               <div className="h-16 flex items-center justify-center border-b-2 border-white bg-white/10 backdrop-blur-md">
                 <span className="text-white font-black text-xl tracking-wide">Class Selected</span>
               </div>
               
               <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                 {/* Yellow Pointer Image */}
                 <div className="absolute top-2 left-[76%] -translate-x-1/2 z-30 w-12 pointer-events-none">
                    <img src="/assets/backgrounds/SelectClassPointer.png" alt="Pointer" className="w-full drop-shadow-2xl brightness-110" />
                 </div>

                 
                 <div className="flex items-center gap-12 mt-12 z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] translate-x-4">
                     <div className="scale-90 mr-6 relative ">
                       {/* Hanging Wires - Starting from the top of the section (bottom of title box) */}
                       <div className="absolute -top-[1000%] left-0 w-[2px] h-[1000%] bg-white shadow-sm" />
                       <div className="absolute -top-[1000%] right-0 w-[2px] h-[1000%] bg-white shadow-sm" />
                       
                       <TextFlippingBoard text="CLASS" size="sm" highlighted={false} />
                     </div>
                    <div className="scale-150 flex gap-0 -translate-x-8 -translate-y-4">
                      <TextFlippingBoard 
                        text={`${selectedExisting?.grade || '1'}`} 
                        key={`grade-${selectedExisting?.grade}`} 
                        size="sm" 
                        highlighted={false}
                      />
                      <TextFlippingBoard 
                        text={`${selectedExisting?.section || 'C'}`} 
                        key={`section-${selectedExisting?.section}`} 
                        size="sm" 
                        highlighted={false}
                      />
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Enter Class Button (Smaller with 5px radius) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
             <button 
               onClick={handleEnterClass}
               disabled={!selectedExisting}
               className="px-8 py-2 bg-[#3C2EA8] hover:bg-[#4a3bc7] disabled:opacity-50 text-white font-black text-xl rounded-[5px] border-2 border-white/60 shadow-2xl transition-all active:scale-95 flex items-center gap-4"
             >
               Enter Class
             </button>
          </div>
        </div>
      </div>

      {/* Add New Class Section - Stuck to Right Edge */}
      <div className="absolute right-0 top-1/2  -translate-y-1/2 w-[240px] h-[screen] flex items-center justify-end z-50 pointer-events-none">
         {/* Light Blue Low-Opacity Layer */}
         <div className="w-full h-[460px] bg-blue-500/10 backdrop-blur-none border-y-2 border-l-2 border-white/40 rounded-l-[45px] flex items-center justify-center shadow-2xl pointer-events-auto">
            <motion.div 
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(60, 46, 168, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="w-[140px] h-[360px] bg-[#3C2EA8] rounded-l-[36px] rounded-r-none border-y-2 border-x-2 border-white shadow-xl drop-shadow-2xl cursor-pointer flex flex-col gap-2 items-center justify-between py-2 transition-all" 
              onClick={handleCreateNew}
            >
               {/* Top Chevrons - Horizontal Text */}
               <div className="w-full flex justify-center overflow-hidden ">
                  <span className="text-white font-white text-xl ">
                    &gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;
                  </span>
               </div>
               
               
               
               {/* Vertical Text */}
               <div className="flex-1 flex flex-col gap-2 items-center justify-center">
                {/* Top Plus Icon - Perfect Circle */}
               <div className="w-4 h-4 aspect-square rounded-full border border-white flex items-center justify-center text-white bg-white/10 shrink-0">
                 <Plus size={16} strokeWidth={4} />
               </div>

                 <span 
                  className="text-white font-black text-lg tracking-[0.2em]  whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                 >
                   Add A New Class
                 </span>
                 {/* Bottom Plus Icon - Perfect Circle */}
               <div className="w-4 h-4 aspect-square rounded-full border border-white flex items-center justify-center text-white bg-white/10 shrink-0">
                 <Plus size={16} strokeWidth={4} />
               </div>

               </div>
               
            
               {/* Bottom Chevrons - Horizontal Text */}
               <div className="w-full  flex justify-center overflow-hidden px-2">
                  <span className="text-white font-white text-xl ">
                    &gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;
                  </span>
               </div>
            </motion.div>
            {/* Billboard Stand (White Post) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2  translate-x-3 w-15 h-[50px] bg-white shadow-lg z-10" />
            
         </div>
      </div>
    </div>
  );
}
