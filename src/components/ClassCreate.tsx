'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { Plus, Minus, User } from 'lucide-react';

export default function ClassCreate() {
  const setPhase = useGameStore((state) => state.setPhase);
  const createClass = useGameStore((state) => state.createClass);

  const [grade, setGrade] = useState(1);
  const [section, setSection] = useState('E');

  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handleCreate = () => {
    soundEngine.playVictory();
    createClass(grade, section);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #4a3ec4 0%, #3730a3 40%, #2d2690 100%)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── TOP NAV BAR ── */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-4">
        {/* Left horizontal rule */}
        <div className="flex-1 h-px bg-white/30" />

        {/* Nav buttons */}
        <div className="flex items-center gap-3 ml-6">
          <button
            style={{
              border: '1.5px solid rgba(255,255,255,0.7)',
              borderRadius: '999px',
              color: 'white',
              background: 'transparent',
              padding: '6px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            About Shapy
          </button>
          <button
            style={{
              border: '1.5px solid rgba(255,255,255,0.7)',
              borderRadius: '999px',
              color: 'white',
              background: 'transparent',
              padding: '6px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            How to Play
          </button>
          {/* User icon circle */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <User size={20} color="white" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* ── PAGE TITLE ── */}
      <div className="absolute z-10 flex items-center gap-4" style={{ top: 80, left: 48 }}>
        {/* Yellow triangle play icon */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: '18px solid transparent',
            borderBottom: '18px solid transparent',
            borderLeft: '30px solid #FACC15',
            marginRight: 4,
          }}
        />
        <h1
          style={{
            color: 'white',
            fontFamily: "'Fredoka One', 'Nunito', sans-serif",
            fontSize: '2.2rem',
            fontWeight: 900,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Let's Add A New Class
        </h1>
      </div>

      {/* ── LEFT BRACKET LINES (Grade / Section labels) ── */}
      {/* Grade bracket */}
      <div
        className="absolute z-10"
        style={{ top: 148, left: 56 }}
      >
        {/* Vertical line */}
        <div style={{ width: 2, height: 90, background: 'white', borderRadius: 1 }} />
        {/* Top horizontal tick */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 14,
            height: 2,
            background: 'white',
            borderRadius: 1,
          }}
        />
        {/* Bottom horizontal tick */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 14,
            height: 2,
            background: 'white',
            borderRadius: 1,
          }}
        />
      </div>
      <span
        className="absolute z-10"
        style={{
          top: 178,
          left: 82,
          color: 'white',
          fontWeight: 900,
          fontSize: '1.5rem',
          letterSpacing: '0.04em',
        }}
      >
        Grade
      </span>

      {/* Section bracket */}
      <div
        className="absolute z-10"
        style={{ top: 370, left: 56 }}
      >
        <div style={{ width: 2, height: 90, background: 'white', borderRadius: 1 }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 14,
            height: 2,
            background: 'white',
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 14,
            height: 2,
            background: 'white',
            borderRadius: 1,
          }}
        />
      </div>
      <span
        className="absolute z-10"
        style={{
          top: 400,
          left: 82,
          color: 'white',
          fontWeight: 900,
          fontSize: '1.5rem',
          letterSpacing: '0.04em',
        }}
      >
        Section
      </span>

      {/* ── GRADE SELECTOR ── */}
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{ top: 170, left: 0, right: 0 }}
      >
        {/* Horizontal wing lines on either side */}
        <div
          style={{
            width: 180,
            height: 2,
            background: 'rgba(255,255,255,0.35)',
            borderRadius: 1,
            marginRight: -2,
          }}
        />

        {/* Minus button */}
        <button
          onClick={() => setGrade((prev) => Math.max(1, prev - 1))}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(255,255,255,0.9)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          <Minus size={24} strokeWidth={3} />
        </button>

        {/* Airplane + number */}
        <div
          style={{
            position: 'relative',
            width: 200,
            height: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {/* Airplane SVG (front-facing circle with wings) */}
          <svg
            viewBox="0 0 200 160"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            {/* Left wing */}
            <path
              d="M 60 80 L 10 95 L 10 88 L 60 75 Z"
              fill="rgba(255,255,255,0.15)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            />
            {/* Right wing */}
            <path
              d="M 140 80 L 190 95 L 190 88 L 140 75 Z"
              fill="rgba(255,255,255,0.15)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            />
            {/* Body circle */}
            <circle cx="100" cy="78" r="52" fill="rgba(60,46,168,0.7)" stroke="white" strokeWidth="3" />
            {/* Cockpit window suggestion */}
            <circle cx="100" cy="68" r="22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            {/* Landing gear */}
            <line x1="88" y1="130" x2="88" y2="150" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            <line x1="100" y1="130" x2="100" y2="143" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            <line x1="112" y1="130" x2="112" y2="150" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          </svg>
          {/* Grade number */}
          <span
            style={{
              position: 'relative',
              zIndex: 2,
              color: 'white',
              fontSize: '3rem',
              fontWeight: 900,
              marginTop: 8,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            {grade}
          </span>
        </div>

        {/* Plus button */}
        <button
          onClick={() => setGrade((prev) => Math.min(4, prev + 1))}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(255,255,255,0.9)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          <Plus size={24} strokeWidth={3} />
        </button>

        <div
          style={{
            width: 180,
            height: 2,
            background: 'rgba(255,255,255,0.35)',
            borderRadius: 1,
            marginLeft: -2,
          }}
        />
      </div>

      {/* ── MOUNTAIN / ROOFTOP SVG ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1280 720"
        preserveAspectRatio="none"
      >
        {/* Bottom base line */}
        <line x1="90" y1="670" x2="1190" y2="670" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        {/* Left slant */}
        <line x1="90" y1="670" x2="520" y2="400" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        {/* Right slant */}
        <line x1="760" y1="400" x2="1190" y2="670" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        {/* Peak horizontal connector */}
        <line x1="520" y1="400" x2="760" y2="400" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        {/* Extended right line going off screen */}
        <line x1="760" y1="400" x2="1280" y2="400" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        {/* Outer rounded base */}
        <path
          d="M 90 650 L 90 640 Q 90 630 100 630 L 1180 630 Q 1190 630 1190 640 L 1190 650"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />
      </svg>

      {/* ── SECTION SELECTOR ── */}
      <div
        className="absolute z-10"
        style={{ bottom: 110, left: 0, right: 0, paddingLeft: 120, paddingRight: 380 }}
      >
        <div className="flex items-end justify-between">
          {sections.map((s, i) => {
            const isSelected = section === s;
            return (
              <div key={s} className="flex flex-col items-center" style={{ gap: 0 }}>
                <motion.div
                  onClick={() => setSection(s)}
                  animate={{
                    scale: isSelected ? 1.05 : 1,
                    backgroundColor: isSelected
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(255,255,255,0.06)',
                    borderColor: isSelected ? 'white' : 'rgba(255,255,255,0.45)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    width: 90,
                    height: 110,
                    border: '2.5px solid',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '2rem',
                    }}
                  >
                    {s}
                  </span>
                </motion.div>
                {/* Post / pedestal under each card */}
                <div
                  style={{
                    width: isSelected ? 16 : 10,
                    height: isSelected ? 50 : 36,
                    background: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.22)',
                    boxShadow: isSelected ? '0 0 16px rgba(255,255,255,0.5)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM RIGHT: CLASS PREVIEW + ADD BUTTON ── */}
      <div
        className="absolute z-20 flex flex-col items-end"
        style={{ bottom: 60, right: 48, gap: 14 }}
      >
        {/* Red triangle pointer (top-right decoration) */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -16,
            width: 0,
            height: 0,
            borderLeft: '22px solid transparent',
            borderRight: '22px solid transparent',
            borderTop: '46px solid #dc2626',
            filter: 'drop-shadow(0 4px 10px rgba(220,38,38,0.5))',
            transform: 'rotate(10deg)',
          }}
        />
        {/* White inner triangle on top of red */}
        <div
          style={{
            position: 'absolute',
            top: -107,
            right: -6,
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '26px solid white',
            opacity: 0.25,
            transform: 'rotate(10deg)',
          }}
        />

        {/* ADD NEW CLASS button */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(250,204,21,0.55)' }}
          whileTap={{ scale: 0.96 }}
          onClick={handleCreate}
          style={{
            background: '#FACC15',
            color: '#2d2690',
            fontWeight: 900,
            fontSize: '0.95rem',
            padding: '10px 24px',
            borderRadius: 999,
            border: '3px solid white',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            letterSpacing: '0.06em',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '2px solid #2d2690',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={11} strokeWidth={4} />
          </span>
          ADD NEW CLASS
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '2px solid #2d2690',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={11} strokeWidth={4} />
          </span>
        </motion.button>

        {/* CLASS + Grade/Section tiles */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          {/* C L A S S tiles */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
            {['C', 'L', 'A', 'S', 'S'].map((char, i) => (
              <div
                key={i}
                style={{
                  width: 44,
                  height: 56,
                  background: 'rgba(45,38,144,0.85)',
                  border: '2px solid rgba(255,255,255,0.55)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  letterSpacing: '0.02em',
                }}
              >
                {char}
              </div>
            ))}
          </div>

          {/* Grade tile */}
          <div style={{ display: 'flex', gap: 3, position: 'relative' }}>
            {[grade, section].map((val, i) => (
              <div
                key={i}
                style={{
                  width: 66,
                  height: 76,
                  background: 'rgba(45,38,144,0.9)',
                  border: '2.5px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '2.2rem',
                  position: 'relative',
                }}
              >
                {val}
                {/* top bracket ticks */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: 8,
                    width: 2,
                    height: 10,
                    background: 'white',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 8,
                    width: 2,
                    height: 10,
                    background: 'white',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CORNER RED HEXAGONS ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: 80,
          width: 44,
          height: 50,
          background: '#dc2626',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          border: '2px solid rgba(255,255,255,0.4)',
          zIndex: 10,
          boxShadow: '0 4px 14px rgba(220,38,38,0.4)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          right: 80,
          width: 44,
          height: 50,
          background: '#dc2626',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          border: '2px solid rgba(255,255,255,0.4)',
          zIndex: 10,
          boxShadow: '0 4px 14px rgba(220,38,38,0.4)',
        }}
      />
    </div>
  );
}