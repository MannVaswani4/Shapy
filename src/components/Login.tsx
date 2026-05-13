import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundEngine } from '../utils/audio';
import { LogOut, Info, HelpCircle } from 'lucide-react';

import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Login() {
  const loginTeacher = useGameStore((state) => state.loginTeacher);
  const loginWithGoogle = useGameStore((state) => state.loginWithGoogle);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Cinematic transition states
  const [isFlickering, setIsFlickering] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Sequence: Flicker for 1.5s, then show content
    const timer = setTimeout(() => {
      setIsFlickering(false);
      setShowContent(true);
      soundEngine.playSuccess(); 
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const isEmailValid = email.length > 0 && email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email.trim() || !password) {
      setError('Required');
      return;
    }

    const success = loginTeacher(email.trim(), password);
    
    if (success) {
      soundEngine.playSuccess();
      setError('');
    } else {
      soundEngine.playTap();
      setError('Invalid');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      soundEngine.playTap();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user.email) {
        loginWithGoogle(user.displayName || 'Google Teacher', user.email, user.photoURL || undefined);
        soundEngine.playSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed');
    }
  };

  const glowTransition = {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  };

  const Hexagon = ({ active, error }: { active: boolean, error: boolean }) => (
    <div className="w-10 h-10 flex items-center justify-center transition-all duration-300 transform rotate-[60deg] drop-shadow-lg">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path 
          d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
          className={`transition-all duration-300 ${
            active 
              ? error 
                ? 'fill-[#DB2B2B] stroke-white' 
                : 'fill-[#2EB622] stroke-white'
              : 'fill-white/10 stroke-white/40'
          }`}
          strokeWidth="2"
        />
      </svg>
    </div>
  );

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

      {/* Base Background (Classroom Reveal) */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 0.9 : 0 }}
        transition={{ duration: 1.5 }}
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
            key="flicker-layer"
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

      {/* Glowing Transparent Layer (Visible only after reveal) */}
      {showContent && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            ...glowTransition,
            delay: 1 
          }}
          style={{
            backgroundImage: `url('/assets/backgrounds/LoginScreenBackgroundTransparent.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      

      {/* Login Container - Revealed with Background */}
      <motion.div 
        className="relative z-10 flex flex-col items-center gap-4 translate-y-12"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 0.98 : 0.92 }}
        transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
      >
        <div className="relative w-[380px] bg-transparent backdrop-blur-sm border-2 border-white/80 rounded-[40px] p-8 pt-10 shadow-2xl flex flex-col items-center">
          {/* Inverted Semicircle Login Tab */}
          <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-28 h-12 bg-[#3b59ce] rounded-b-[32px] flex items-center justify-center pb-1 border-x-2 border-b-2 border-white/60 shadow-lg">
            <span className="text-white font-bold text-base">Login</span>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3 mt-6">
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="E-mail id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => soundEngine.playTap()}
                className="flex-1 h-12 px-4 text-base bg-white/40 rounded-xl border border-white/20 text-white placeholder:text-white/60 font-medium outline-none shadow-inner"
              />
              <Hexagon active={email.length > 0} error={email.length > 0 && !isEmailValid} />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => soundEngine.playTap()}
                  className="w-full h-12 px-4 pr-10 text-base bg-white/40 rounded-xl border border-white/20 text-white placeholder:text-white/60 font-medium outline-none shadow-inner"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              <Hexagon active={password.length > 0} error={password.length > 0 && !isPasswordValid} />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#3b59ce] hover:bg-[#4a6ae0] text-white font-bold text-xl rounded-xl shadow-lg transition-all active:scale-95 border-b-4 border-black/20 mt-1"
            >
              Login
            </button>
          </form>
        </div>

        {/* Outside Elements */}
        <div className="flex flex-col items-center gap-2 w-full mt-1">
          <span className="text-white font-medium text-base drop-shadow-md">Or</span>

          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-[380px] h-12 bg-transparent hover:bg-white/5 text-white font-medium rounded-full border-2 border-white/80 flex items-center justify-center gap-3 transition-all shadow-xl backdrop-blur-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-lg">Sign In with Google</span>
          </button>
        </div>
      </motion.div>

    </div>
  );
}
