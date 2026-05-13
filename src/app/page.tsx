'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Splash from '../components/Splash';
import Login from '../components/Login';
import Welcome from '../components/Welcome';
import ClassSelect from '../components/ClassSelect';
import ClassCreate from '../components/ClassCreate';
import StudentSetup from '../components/StudentSetup';
import PlayerSelect from '../components/PlayerSelect';
import Memorize from '../components/Memorize';
import Countdown from '../components/Countdown';
import CollectGame from '../components/CollectGame';
import Reconstruct from '../components/Reconstruct';
import Results from '../components/Results';
import Header from '../components/Header';
import Modals from '../components/Modals';

export default function Home() {
  const phase = useGameStore((state) => state.phase);
  const setPhase = useGameStore((state) => state.setPhase);
  const initializeStore = useGameStore((state) => state.initializeStore);
  const [mounted, setMounted] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Sync state to URL hash for browser "Back" support
  useEffect(() => {
    initializeStore();
    setMounted(true);

    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as any;
      if (hash && hash !== phase) {
        setPhase(hash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initializeStore, setPhase, phase]);

  useEffect(() => {
    if (mounted) {
      window.history.pushState(null, '', `#${phase}`);
    }
  }, [phase, mounted]);

  if (!mounted) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center text-amber-400 font-bold text-xl">
        Loading Shapy Interactive Touch Environment...
      </div>
    );
  }

  const handleBack = () => {
    const historyMap: Record<string, string> = {
      'login': 'splash',
      'welcome': 'login',
      'class-select': 'welcome',
      'class-create': 'class-select',
      'student-setup': 'class-select',
      'player-select': 'student-setup',
      'memorize': 'player-select',
      'results': 'welcome'
    };
    
    const prevPhase = historyMap[phase];
    if (prevPhase) {
      setPhase(prevPhase as any);
    }
  };

  const showBackButton = ['login', 'welcome', 'class-select', 'student-setup', 'player-select'].includes(phase);

  const renderCurrentPhase = () => {
    switch (phase) {
      case 'splash':
        return <Splash />;
      case 'login':
        return <Login />;
      case 'welcome':
        return <Welcome />;
      case 'class-select':
        return <ClassSelect />;
      case 'class-create':
        return <ClassCreate />;
      case 'student-setup':
        return <StudentSetup />;
      case 'player-select':
        return <PlayerSelect />;
      case 'memorize':
        return <Memorize />;
      case 'countdown':
        return <Countdown />;
      case 'collect':
        return <CollectGame />;
      case 'reconstruct':
        return <Reconstruct />;
      case 'results':
        return <Results />;
      default:
        return <Splash />;
    }
  };

  return (
    <main className="w-screen min-h-screen flex flex-col items-stretch overflow-x-hidden overflow-y-auto select-none bg-black relative">
      {showBackButton && (
        <button 
          onClick={handleBack}
          className="fixed top-4 left-4 z-[100] w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      )}

      {/* Global Navigation - Only for main screens */}
      {!['splash', 'countdown', 'collect'].includes(phase) && (
        <Header 
          onAboutOpen={() => setShowAbout(true)} 
          onHowToPlayOpen={() => setShowHowToPlay(true)} 
        />
      )}

      <Modals 
        showAbout={showAbout} 
        setShowAbout={setShowAbout} 
        showHowToPlay={showHowToPlay} 
        setShowHowToPlay={setShowHowToPlay} 
      />

      {renderCurrentPhase()}
    </main>
  );
}
