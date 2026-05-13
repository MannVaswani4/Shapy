'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, Student, ShapeType, ColorType } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { renderShapeSvg, SHAPE_LIST, COLOR_LIST, COLOR_MAP } from '../utils/shapes';
import { Plus, Trash2, Check, Play, UserPlus, X } from 'lucide-react';

export default function StudentSetup() {
  const teacher = useGameStore((state) => state.teacher);
  const selectedClass = useGameStore((state) => state.selectedClass);
  const setPhase = useGameStore((state) => state.setPhase);
  const addStudent = useGameStore((state) => state.addStudent);
  const updateStudent = useGameStore((state) => state.updateStudent);
  const removeStudent = useGameStore((state) => state.removeStudent);

  const currentClass = teacher?.classes?.find(
    (c) => c.grade == selectedClass?.grade && c.section == selectedClass?.section
  );

  const students = currentClass?.students || [];

  const [activeModal, setActiveModal] = useState<{
    mode: 'add' | 'edit';
    id?: string;
    name: string;
    shape: ShapeType;
    color: ColorType;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  const handleProceedToGameSetup = () => {
    if (students.length < 3) {
      soundEngine.playCountdown();
      setErrorMsg('Please register at least 3 students to start!');
      return;
    }
    soundEngine.playVictory();
    setPhase('player-select');
  };

  const openAddModal = () => {
    soundEngine.playTap();
    if (students.length >= 8) return;
    
    // Find next available shape/color combination
    let defShape: ShapeType = 'circle';
    let defColor: ColorType = 'blue';

    for (const s of SHAPE_LIST) {
      for (const c of COLOR_LIST) {
        const used = students.some((st) => st.shape === s && st.color === c);
        if (!used) {
          defShape = s;
          defColor = c;
          break;
        }
      }
    }

    setActiveModal({
      mode: 'add',
      name: '',
      shape: defShape,
      color: defColor,
    });
  };

  const openEditModal = (st: Student) => {
    soundEngine.playTap();
    setActiveModal({
      mode: 'edit',
      id: st.id,
      name: st.name,
      shape: st.shape,
      color: st.color,
    });
  };

  const saveStudent = () => {
    if (!activeModal) return;
    if (!activeModal.name.trim()) {
      soundEngine.playCountdown();
      return;
    }

    if (activeModal.mode === 'add') {
      addStudent({
        name: activeModal.name.trim(),
        shape: activeModal.shape,
        color: activeModal.color,
      });
    } else if (activeModal.id) {
      updateStudent(activeModal.id, {
        name: activeModal.name.trim(),
        shape: activeModal.shape,
        color: activeModal.color,
      });
    }
    soundEngine.playSuccess();
    setActiveModal(null);
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #4a3ec4 0%, #3730a3 40%, #2d2690 100%)',
      }}
    >
      {/* Header Section */}
      <div className="relative z-10 w-full px-12 pt-32 pb-8 flex flex-col items-center">
        <h1 className="text-white font-chicalo text-5xl tracking-widest uppercase text-center">
          Select Student From Class {selectedClass?.grade}{selectedClass?.section}
        </h1>
      </div>

      {/* Main Grid Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-12">
        <div className="grid grid-cols-4 gap-6">
          {/* Render 8 slots */}
          {Array.from({ length: 8 }).map((_, i) => {
            const student = students[i];
            if (student) {
              const colorMeta = COLOR_MAP[student.color];
              return (
                <motion.div
                  key={student.id}
                  whileHover={{ y: -5 }}
                  className="relative h-44 bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-3xl p-4 flex flex-col items-center justify-between group shadow-2xl"
                >
                  <div className="w-full flex justify-between items-start">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 font-black text-xs">
                      {i + 1}
                    </div>
                    <button 
                      onClick={() => removeStudent(student.id)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div 
                    className={`cursor-pointer transform transition-all group-hover:scale-110 ${colorMeta.glow}`}
                    dangerouslySetInnerHTML={{ __html: renderShapeSvg(student.shape, colorMeta.hex, 56) }}
                    onClick={() => openEditModal(student)}
                  />

                  <div 
                    className="w-full bg-white/10 py-1.5 px-3 rounded-xl text-center border border-white/10 cursor-pointer mt-2"
                    onClick={() => openEditModal(student)}
                  >
                    <span className="text-white font-black text-base truncate block">
                      {student.name}
                    </span>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={`empty-${i}`}
                onClick={openAddModal}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="h-44 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer group transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-white/20 group-hover:text-white/40 group-hover:border-white/30 transition-all">
                  <Plus size={24} />
                </div>
                <span className="text-white/20 font-black uppercase tracking-widest text-[10px]">Add Player</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="absolute bottom-16 translate-y-5 left-0 w-full z-10 flex flex-col items-center">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(253, 224, 71, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProceedToGameSetup}
          className="h-14 px-10 bg-yellow-400 border-2 border-white text-[#2d2690] font-black text-lg rounded-full flex items-center gap-3 shadow-2xl"
        >
          <span>PROCEED TO GAME</span>
          <Play size={20} fill="currentColor" />
        </motion.button>
      </div>

      {/* Modal for Adding/Editing Student */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/90 max-w-2xl w-full rounded-[40px] p-10 shadow-2xl relative flex flex-col gap-8"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-4xl font-black text-[#3b59ce] font-chicalo tracking-wider uppercase">
                {activeModal.mode === 'add' ? 'New Player Setup' : 'Edit Player'}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Name</label>
                  <input 
                    autoFocus
                    value={activeModal.name}
                    onChange={e => setActiveModal({ ...activeModal, name: e.target.value })}
                    className="w-full h-16 bg-slate-100 border-2 border-transparent focus:border-[#3b59ce] rounded-2xl px-6 text-2xl font-black text-slate-800 outline-none transition-all"
                    placeholder="Enter name..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Choose Shape</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SHAPE_LIST.map(s => (
                        <button
                          key={s}
                          onClick={() => setActiveModal({ ...activeModal, shape: s })}
                          className={`p-3 rounded-xl transition-all flex items-center justify-center ${activeModal.shape === s ? 'bg-[#3b59ce] shadow-lg' : 'bg-slate-100 hover:bg-slate-200'}`}
                          dangerouslySetInnerHTML={{ __html: renderShapeSvg(s, activeModal.shape === s ? '#fff' : '#64748b', 32) }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Choose Color</label>
                    <div className="grid grid-cols-3 gap-2">
                      {COLOR_LIST.map(c => (
                        <button
                          key={c}
                          onClick={() => setActiveModal({ ...activeModal, color: c })}
                          className={`p-3 rounded-xl transition-all flex items-center justify-center ${activeModal.color === c ? 'bg-[#3b59ce] shadow-lg' : 'bg-slate-100 hover:bg-slate-200'}`}
                        >
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white/50"
                            style={{ backgroundColor: COLOR_MAP[c].hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={saveStudent}
                disabled={!activeModal.name.trim()}
                className="w-full h-16 bg-[#3b59ce] text-white font-black text-xl rounded-2xl shadow-xl hover:bg-[#4a6ae0] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <Check size={24} strokeWidth={3} />
                CONFIRM PLAYER
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .clip-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
}
