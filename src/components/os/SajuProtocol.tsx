'use client';
import React from 'react';
import { Orbit } from 'lucide-react';
import HiddenSourceCodeChat from '@/components/coaching/HiddenSourceCodeChat';

interface Props {
  onComplete?: (prompt: string) => void;
  onClose?: () => void;
}

export default function SajuProtocol({ onComplete, onClose }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 overflow-y-auto relative gpu-accelerated scrollbar-hide pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black pointer-events-none" />
      <div className="fixed top-[-10%] right-[-10%] w-[70%] h-[70%] bg-zinc-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-xl flex flex-col items-center mt-2 h-full min-h-[500px]">
        <header className="mb-4 text-center">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-white to-slate-300 mb-1 tracking-tight flex items-center justify-center gap-3">
            <Orbit className="w-6 h-6 text-zinc-400" />
            DESTINY FORMAT
          </h2>
          <p className="text-zinc-200/60 text-[10px] font-mono tracking-widest uppercase">
            내면의 숨겨진 소스코드 해독 프로토콜
          </p>
        </header>

        <div className="w-full flex-1 min-h-[450px]">
          <HiddenSourceCodeChat 
            onComplete={onComplete || (() => {})} 
            onClose={onClose || (() => {})} 
          />
        </div>
      </div>
    </div>
  );
}
