'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/store/useReportStore';
import { Sparkles, ArrowRight, X, Loader2, Heart, Home } from 'lucide-react';

interface ModuleType {
  key: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
  gradient: string;
  color: string;
  path: string;
}

const modules: ModuleType[] = [
  {
    key: 'mental',
    title: '지친 마음 위로하기 (마음 다독임)',
    subtitle: '64코어 기반 내면 심리 치유',
    desc: '64가지 내면의 지도에서 지금 나를 흔들리게 하는 불안을 해소하고 평온을 찾습니다.',
    icon: '🌸',
    gradient: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
    color: '#f472b6',
    path: '/master-core/mental'
  },
  {
    key: 'value',
    title: '세상과 따뜻하게 연결되기 (사회적 가치)',
    subtitle: '상생과 공헌의 방향성 발견',
    desc: '내 재능이 세상과 만나 어떻게 아름다운 열매를 맺을 수 있는지 그 길을 발견합니다.',
    icon: '🌏',
    gradient: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    color: '#60a5fa',
    path: '/master-core/value'
  },
  {
    key: 'step-back',
    title: '거울 뒤로 한 걸음 (안팎 조망)',
    subtitle: '주객의 경계를 허무는 의식 자각',
    desc: '육체적 통증과 생각의 연결고리를 끊고, 나와 온 세상을 동시에 바라보는 깊은 평온을 누립니다.',
    icon: '👁️',
    gradient: 'from-violet-500/20 to-fuchsia-500/10 border-violet-500/30 text-violet-400',
    color: '#a855f7',
    path: '/master-core/step-back'
  },
  {
    key: 'matrix',
    title: '나의 마음 공간 넓히기 (마음 성장)',
    subtitle: '고정관념을 뛰어넘는 의식 확장',
    desc: '고정관념의 틀에서 벗어나 4차원의 넓은 시선으로 인생의 문제를 훌쩍 뛰어넘습니다.',
    icon: '🌌',
    gradient: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    color: '#c084fc',
    path: '/master-core/matrix'
  },
  {
    key: 'cafe',
    title: '인생의 톱니바퀴 조율하기 (조화와 조율)',
    subtitle: '감정과 생체 에너지의 흐름 튜닝',
    desc: '내 안의 여러 감정과 에너지가 서로 부딪히지 않고 부드럽게 흐르도록 균형을 잡아줍니다.',
    icon: '⚙️',
    gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    color: '#fbbf24',
    path: '/master-core/cafe'
  }
];

export default function MasterCoreLandingPage() {
  const router = useRouter();
  const { reportData } = useReportStore();
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);

  const userName = reportData?.userName || '명심가';
  const sajuPillars = reportData?.saju?.fourPillars || null;

  const handleModuleClick = async (module: ModuleType) => {
    setActiveModule(module);
    setIsLoadingExplanation(true);
    setExplanation('');

    try {
      const response = await fetch('/api/coaching/master-core-explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleKey: module.key,
          moduleLabel: module.title,
          userName,
          sajuPillars,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExplanation(data.explanation);
      } else {
        throw new Error('API 호출 실패');
      }
    } catch (error) {
      console.error(error);
      setExplanation(
        '🌸 마음의 문을 두드렸으나, 일시적으로 연결이 원활하지 않아요.\n\n' +
        '🌿 마음을 가다듬고 곧 다시 시도해 주시면 포근한 안내를 드릴게요.\n\n' +
        '🔍 언제나 당신을 위한 따뜻한 치유의 에너지가 준비되어 있답니다.'
      );
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // 설명 텍스트를 감성적으로 렌더링하기 위한 파서
  const renderExplanationContent = (text: string) => {
    const lines = text.split('\n\n');
    return lines.map((line, idx) => {
      let icon = '';
      let title = '';
      let content = line;

      if (line.startsWith('1. 🌸') || line.startsWith('1.')) {
        icon = '🌸';
        title = '마음의 노크';
        content = line.replace(/^(1\.\s*🌸?\s*|1\.\s*)/, '');
      } else if (line.startsWith('2. 🌿') || line.startsWith('2.')) {
        icon = '🌿';
        title = '따뜻한 메타포';
        content = line.replace(/^(2\.\s*🌿?\s*|2\.\s*)/, '');
      } else if (line.startsWith('3. 🔍') || line.startsWith('3.')) {
        icon = '🔍';
        title = '우리만의 비밀 이야기';
        content = line.replace(/^(3\.\s*🔍?\s*|3\.\s*)/, '');
      } else if (line.startsWith('4. 💡') || line.startsWith('4.')) {
        icon = '💡';
        title = '오늘의 작은 알아차림';
        content = line.replace(/^(4\.\s*💡?\s*|4\.\s*)/, '');
      } else if (line.startsWith('5. ✨') || line.startsWith('5.')) {
        icon = '✨';
        title = '당신을 향한 한 장의 편지';
        content = line.replace(/^(5\.\s*✨?\s*|5\.\s*)/, '');
      }

      if (icon) {
        return (
          <div key={idx} className="mb-6 last:mb-0 border-l-2 border-white/5 pl-4 py-1">
            <h4 className="text-xs font-semibold text-white/50 flex items-center gap-1.5 mb-1.5 font-mono uppercase tracking-wider">
              <span>{icon}</span>
              <span>{title}</span>
            </h4>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line font-medium break-keep">
              {content}
            </p>
          </div>
        );
      }

      return (
        <p key={idx} className="text-sm text-gray-300 leading-relaxed mb-4 last:mb-0 whitespace-pre-line font-medium break-keep">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#05070A] max-w-2xl mx-auto shadow-2xl overflow-hidden font-sans text-white">
      {/* Background Gradients & Aura */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-indigo-700/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] bg-purple-700/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-[35%] left-[20%] w-[40vw] h-[40vw] max-w-[300px] bg-emerald-600/5 rounded-full blur-[100px]"></div>
        
        {/* Soft Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40"></div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex flex-col min-h-screen px-5 py-10 justify-between">
        {/* Navigation Bar (Home back button) */}
        <div className="w-full flex justify-start mb-2">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider backdrop-blur-md active:scale-95"
          >
            <Home size={12} />
            <span>메인화면으로 이동</span>
          </button>
        </div>

        {/* Upper Header Section */}
        <div className="w-full text-center mt-2">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
          >
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            <span className="text-white/70 text-[10px] font-bold tracking-widest uppercase">Myeongsim Master Core</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-indigo-200 font-extrabold mb-4 tracking-tight drop-shadow-md"
          >
            명심 마스터 코어
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs md:text-sm text-gray-400/80 mb-10 max-w-sm mx-auto leading-relaxed break-keep"
          >
            당신의 타고난 내면의 지도와 마음의 흐름을 다정한 명리 코칭 서비스로 보살펴 줍니다.
          </motion.p>
        </div>

        {/* 5 Cards Layout */}
        <div className="flex-1 flex flex-col justify-center gap-4 w-full max-w-md mx-auto my-6">
          {modules.map((mod, idx) => (
            <motion.button
              key={mod.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleModuleClick(mod)}
              className={`relative overflow-hidden rounded-2xl border text-left p-5 flex items-center gap-4 bg-[#0F1424]/40 hover:bg-[#141A30]/60 backdrop-blur-md transition-all duration-300 border-white/5 hover:border-white/15`}
            >
              {/* Outer Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="text-3xl flex-shrink-0 select-none bg-white/5 p-3 rounded-xl border border-white/5">
                {mod.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-indigo-300 font-mono tracking-wide uppercase opacity-75">{mod.subtitle}</span>
                <h3 className="text-base font-extrabold text-white mt-0.5 tracking-tight">{mod.title}</h3>
                <p className="text-[11px] text-gray-400 leading-normal mt-1 break-keep truncate-2-lines">{mod.desc}</p>
              </div>
              <div className="flex-shrink-0 text-white/40">
                <ArrowRight size={18} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center gap-1 text-[9px] text-gray-500/70 font-mono tracking-widest uppercase">
            <span>MYEONGSIM SYSTEM</span>
            <Heart size={8} className="text-pink-500/70" />
            <span>v2.5 FLASH</span>
          </div>
        </div>
      </main>

      {/* AI Explanation Modal */}
      <AnimatePresence>
        {activeModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-md bg-[#090D1A] border border-white/10 rounded-3xl p-6 overflow-hidden shadow-2xl"
            >
              {/* Modal Background Auras */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/5 rounded-full blur-[40px] pointer-events-none"></div>

              {/* Close Button */}
              <button
                onClick={() => setActiveModule(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-200 border border-white/5"
              >
                <X size={16} />
              </button>

              {/* Header Title inside Modal */}
              <div className="flex items-center gap-3 mb-6 pr-8">
                <span className="text-3xl bg-white/5 p-2 rounded-xl border border-white/5 select-none">{activeModule.icon}</span>
                <div>
                  <h3 className="text-lg font-extrabold text-white leading-tight">{activeModule.title}</h3>
                  <span className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase font-mono">{activeModule.subtitle}</span>
                </div>
              </div>

              {/* AI Content Area */}
              <div className="max-h-[50vh] overflow-y-auto pr-1 select-text scrollbar-thin">
                {isLoadingExplanation ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-ping scale-75"></div>
                      <Loader2 size={32} className="text-indigo-400 animate-spin relative" />
                    </div>
                    <p className="text-xs text-gray-400 animate-pulse font-medium">
                      명심 AI 코치가 {userName}님의 기질과 마음을 따뜻하게 읽는 중입니다...
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-gray-300"
                  >
                    {renderExplanationContent(explanation)}
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 border-t border-white/5 pt-4">
                <button
                  onClick={() => setActiveModule(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 text-xs font-bold transition-all duration-200"
                >
                  닫기
                </button>
                <button
                  disabled={isLoadingExplanation}
                  onClick={() => {
                    setActiveModule(null);
                    router.push(activeModule.path);
                  }}
                  className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-black tracking-wide shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>마음 속으로 들어가기</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
