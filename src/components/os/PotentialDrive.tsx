'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Clock, Code, Send } from 'lucide-react';

export default function PotentialDrive() {
  const [sourceCode, setSourceCode] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceCode.trim()) return;
    setIsLocked(true);
    // In a real app, save to backend with a timestamp and restore lock state on mount
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-xl flex flex-col items-center">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-orange-300 mb-2 tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
            POTENTIAL DRIVE
          </h2>
          <p className="text-amber-200/60 text-sm font-mono tracking-widest uppercase">
            Source Code Reflection
          </p>
        </header>

        <div className="w-full relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isLocked ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                className="w-full bg-amber-950/20 border border-amber-500/20 p-8 rounded-3xl backdrop-blur-md shadow-2xl"
              >
                <div className="mb-6 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                    <Code className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-amber-100 font-bold mb-1">풍요의 소스코드 등록</h3>
                    <p className="text-amber-200/60 text-xs break-keep leading-relaxed">
                      "돈을 벌어야 해"라는 에고의 애씀이 아닌, "원하는 풍요의 영화 장면"을 가볍게 툭 등록하세요. 
                      등록 후 24시간 동안은 강제로 열람이 잠금(Lock)되어 집착을 방지합니다.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <textarea
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    placeholder="예: 300억 자산가로 평온하게 바다를 바라보는 나"
                    rows={4}
                    className="w-full bg-black/40 border border-amber-500/30 rounded-xl p-4 text-amber-100 placeholder:text-amber-700/50 outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                  <button 
                    type="submit"
                    disabled={!sourceCode.trim()}
                    className="w-full py-4 bg-amber-600/80 hover:bg-amber-500 text-white rounded-xl font-bold tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    시스템에 툭, 던져놓기
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="locked"
                initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                className="w-full bg-slate-900/50 border border-slate-700/50 p-10 rounded-3xl backdrop-blur-xl shadow-2xl text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 shadow-inner border border-slate-700">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">소스코드 잠금 완료</h3>
                  <p className="text-slate-400 text-sm mb-6 break-keep max-w-[80%] mx-auto">
                    시스템이 새로운 현실을 정렬하고 있습니다. 결과를 확인하려는 에고의 집착 감지 센서가 활성화되었습니다. 
                    <br/><br/>
                    이제 다 잊고, 현실이라는 영화를 덤덤하게 즐기세요.
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 rounded-full border border-slate-800">
                    <Clock className="w-4 h-4 text-amber-500/70" />
                    <span className="text-amber-500/70 font-mono text-sm">23:59:59</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
