import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, CheckCircle2, TrendingUp, Heart } from 'lucide-react';
import { playTechBeep } from '@/utils/sfx';

interface DecodingReportProps {
  data: {
    status_line: string;
    saju_sync: {
      activated_elements: string[];
      environmental_analysis: string;
    };
    psychological_patch: {
      acceptance_guide: string;
      action_step: string;
    };
    crystal_growth_increment: number;
  };
  onAccept: () => void;
}

export default function DecodingReport({ data, onAccept }: DecodingReportProps) {
  // Helper to color element badges
  const getElementColor = (el: string) => {
    if (el.includes('목') || el.includes('木')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (el.includes('화') || el.includes('火')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    if (el.includes('토') || el.includes('土')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (el.includes('금') || el.includes('金')) return 'bg-slate-400/10 text-slate-200 border-slate-400/20';
    if (el.includes('수') || el.includes('水')) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl bg-gradient-to-b from-[#111625] to-[#0a0c16] border border-red-500/25 rounded-3xl p-6 md:p-8 shadow-neon-red relative overflow-hidden"
    >
      {/* Background Decorative Aura */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none animate-aura-breath"></div>
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-aura-breath" style={{ animationDelay: '4s' }}></div>

      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b border-white/5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 mb-3 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
          <Sparkles size={12} className="text-red-400 animate-pulse" />
          <span className="text-red-400 text-[10px] font-bold tracking-wider uppercase font-mono text-neon-red">DARK CODE DECODED</span>
        </div>
        <h3 className="text-xl font-black text-white tracking-tight break-keep text-neon-red">부정 감정의 원석 연성 리포트</h3>
        <p className="text-[11px] text-gray-500 mt-1 font-mono">음양의 순환: 어둠은 빛을 품은 내면의 씨앗입니다</p>
      </div>

      {/* 1. Status Line */}
      <div className="mb-6 p-4 rounded-2xl bg-red-950/20 border border-red-500/10 text-center">
        <div className="text-[9px] font-mono text-red-400 uppercase tracking-widest mb-1">Status Diagnosis</div>
        <p className="text-sm font-bold text-red-200 leading-relaxed break-keep">
          "{data.status_line}"
        </p>
      </div>

      {/* 2. Saju Sync Section */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <TrendingUp size={16} />
          <span className="text-xs font-mono tracking-wider font-bold">01 / 사주 에너지 동기화 (Saju Sync)</span>
        </div>
        <div className="bg-[#0a0d16]/75 border border-white/5 rounded-2xl p-5 space-y-4">
          <div>
            <div className="text-[10px] text-gray-500 mb-2 font-bold uppercase font-mono">자극받은 의식 원소 (Activated Elements)</div>
            <div className="flex flex-wrap gap-2">
              {data.saju_sync.activated_elements.map((el, i) => (
                <span
                  key={i}
                  className={`text-xs px-3 py-1 rounded-lg border font-bold ${getElementColor(el)}`}
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 mb-1.5 font-bold uppercase font-mono">사주적 기운 흐름 분석 (Environmental Analysis)</div>
            <p className="text-xs text-gray-300 leading-relaxed break-keep">
              {data.saju_sync.environmental_analysis}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Psychological Patch Section */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Shield size={16} />
          <span className="text-xs font-mono tracking-wider font-bold">02 / 심리 가이드 패치 (Psychological Patch)</span>
        </div>
        <div className="bg-[#0a0d16]/75 border border-white/5 rounded-2xl p-5 space-y-4">
          <div>
            <div className="text-[10px] text-emerald-400/80 mb-1.5 font-bold uppercase font-mono flex items-center gap-1">
              <Heart size={10} />
              감정 마주하기 수용 가이드 (Acceptance Guide)
            </div>
            <p className="text-xs text-gray-300 leading-relaxed break-keep">
              {data.psychological_patch.acceptance_guide}
            </p>
          </div>
          <div>
            <div className="text-[10px] text-emerald-400/80 mb-1.5 font-bold uppercase font-mono">실천 약속 (Action Step)</div>
            <p className="text-xs text-gray-300 leading-relaxed break-keep">
              {data.psychological_patch.action_step}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Stone Growth & Acceptance action */}
      <div className="mt-8 pt-4 border-t border-white/5 text-center">
        <div className="flex justify-center items-center gap-4 mb-5">
          <motion.div 
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playTechBeep(880, 0.06, 'sine')}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-indigo-500/20 border border-indigo-500/40 flex items-center justify-center relative overflow-hidden shadow-neon-red/25 cursor-pointer"
          >
            <span className="text-xl animate-bounce" style={{ animationDuration: '3s' }}>💎</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none animate-scanline"></div>
          </motion.div>
          <div className="text-left">
            <div className="text-[9px] text-gray-500 uppercase font-mono font-bold">Inner Crystal Growth</div>
            <div className="text-sm font-black text-indigo-300">
              내면의 원석 성장률 <span className="text-red-400 font-mono text-neon-red">+{data.crystal_growth_increment}%</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={onAccept}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-indigo-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white text-xs font-black tracking-widest uppercase shadow-lg shadow-indigo-950/40 transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
        >
          <CheckCircle2 size={16} />
          <span>디코딩 완료하고 감정 수용하기</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
