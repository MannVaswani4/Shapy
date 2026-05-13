'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalsProps {
  showAbout: boolean;
  setShowAbout: (show: boolean) => void;
  showHowToPlay: boolean;
  setShowHowToPlay: (show: boolean) => void;
}

export default function Modals({ showAbout, setShowAbout, showHowToPlay, setShowHowToPlay }: ModalsProps) {
  return (
    <>
      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setShowAbout(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white/90 max-w-2xl w-full rounded-[40px] p-10 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-4xl font-black text-[#3b59ce] mb-6 font-chicalo tracking-wider">About Shapy</h2>
              <p className="text-xl text-slate-700 leading-relaxed font-medium">
                Shapy is an interactive educational platform designed to make geometry and spatial reasoning fun for primary students. 
                Built for smartboards, it encourages collaborative learning through games that challenge memory and reconstruction skills.
              </p>
              <button 
                onClick={() => setShowAbout(false)} 
                className="mt-8 bg-[#3b59ce] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#4a6ae0] transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to Play Modal */}
      <AnimatePresence>
        {showHowToPlay && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setShowHowToPlay(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white/90 max-w-2xl w-full rounded-[40px] p-10 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-4xl font-black text-[#3b59ce] mb-6 font-chicalo tracking-wider">How to Play</h2>
              <div className="space-y-4 text-lg text-slate-700 font-medium">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3b59ce] text-white flex items-center justify-center shrink-0 font-bold">1</div>
                  <p>Teachers select a class and start a session.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3b59ce] text-white flex items-center justify-center shrink-0 font-bold">2</div>
                  <p>Players memorize the shape pattern shown on the screen.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3b59ce] text-white flex items-center justify-center shrink-0 font-bold">3</div>
                  <p>Take turns collecting the right shapes to reconstruct the pattern!</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHowToPlay(false)} 
                className="mt-8 bg-[#3b59ce] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#4a6ae0] transition-all"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
