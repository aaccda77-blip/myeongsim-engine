'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, X, Zap, ArrowRight, ShieldAlert } from 'lucide-react';

interface Thought {
  id: string;
  text: string;
  timestamp: Date;
}

export default function DeSyncEgo() {
  const [inputText, setInputText] = useState('');
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  const handleAddThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setThoughts([...thoughts, { id: Date.now().toString(), text: inputText, timestamp: new Date() }]);
    setInputText('');
  };

  const removeThought = (id: string) => {
    setThoughts(thoughts.filter(t => t.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-black/90 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-2xl flex flex-col h-full">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 mb-2 tracking-tight">
            에고 동기화 해제
          </h2>
          <p className="text-indigo-200/60 text-sm font-mono tracking-widest uppercase break-keep">
            시스템 알림: 생각은 뇌가 실행한 가상 프로그램일 뿐, 진짜 '당신'이 아닙니다.
          </p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleAddThought} className="mb-8 relative w-full group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          <div className="relative bg-black/40 border border-indigo-500/30 rounded-2xl p-2 flex items-center backdrop-blur-md">
            <Ghost className="w-5 h-5 text-indigo-400 mx-3" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="머릿속을 떠도는 생각 팝업을 입력하세요..."
              className="flex-1 bg-transparent border-none outline-none text-indigo-100 placeholder:text-indigo-300/40 text-sm py-2"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 rounded-xl text-indigo-200 text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span>입력</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Hologram Log */}
        <div className="flex-1 w-full relative flex items-center justify-center">
          {thoughts.length === 0 ? (
            <div className="text-center text-indigo-200/30 font-mono text-sm border border-indigo-500/10 p-6 rounded-2xl bg-indigo-950/10">
              <ShieldAlert className="w-8 h-8 mx-auto mb-3 opacity-50" />
              활성화된 가상 프로그램(생각)이 없습니다.<br/>
              현재 시스템은 평온한 상태(Zero Point)를 유지 중입니다.
            </div>
          ) : (
            <div className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px]">
              <AnimatePresence>
                {thoughts.map((thought, index) => (
                  <motion.div
                    key={thought.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1 - index * 0.05, 
                      y: index * -15, 
                      z: index * -50,
                      rotateX: 0
                    }}
                    exit={{ opacity: 0, scale: 0.5, x: window.innerWidth }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, { offset, velocity }) => {
                      if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
                        removeThought(thought.id);
                      }
                    }}
                    className={`absolute w-[90%] max-w-sm p-5 rounded-2xl border backdrop-blur-xl cursor-grab active:cursor-grabbing shadow-2xl ${
                      index === 0 ? 'bg-indigo-950/40 border-indigo-400/50 z-30' : 
                      index === 1 ? 'bg-indigo-950/20 border-indigo-400/20 z-20' : 
                      'bg-indigo-950/10 border-indigo-400/10 z-10'
                    }`}
                    style={{
                      boxShadow: index === 0 ? '0 20px 40px -10px rgba(99, 102, 241, 0.2)' : 'none'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-indigo-300/80 text-xs font-mono uppercase">
                        <Zap className="w-3 h-3" />
                        <span>Virtual Hologram Detected</span>
                      </div>
                      <button onClick={() => removeThought(thought.id)} className="text-indigo-400/50 hover:text-indigo-300 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-lg text-indigo-50 font-medium leading-relaxed mt-4 break-keep">
                      "{thought.text}"
                    </p>
                    <div className="mt-6 flex justify-between items-end">
                      <span className="text-[10px] text-indigo-400/40 font-mono">
                        {thought.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md border border-indigo-500/30 animate-pulse">
                        스와이프하여 동기화 해제 ➡️
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
