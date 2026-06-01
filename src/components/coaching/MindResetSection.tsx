'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Bug, Scan, Eye, Sparkles, Brain, Activity, Shield, RotateCcw } from 'lucide-react';

interface DebuggingData {
  sourceCode: string;
  projectedReality: string;
  myeongsimCoaching: string;
  socratesQuestion: string;
  recursiveQuestion: string;
  step1: string;
  step2: string;
  zeroPointSolutions: { title: string; text: string }[];
}

export default function MindResetSection() {
  const [phase, setPhase] = useState<'INPUT' | 'SCANNING' | 'SCROLL' | 'ZERO_POINT'>('INPUT');
  const [inputValue, setInputValue] = useState('');
  
  // 데이터 상태
  const [debuggingData, setDebuggingData] = useState<DebuggingData | null>(null);

  // 매트릭스 노이즈용 코드
  const [matrixLines, setMatrixLines] = useState<string[]>([]);

  useEffect(() => {
    if (phase === 'SCANNING') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()';
      const interval = setInterval(() => {
        setMatrixLines(prev => {
          const newLine = Array.from({ length: 40 }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
          return [...prev.slice(-15), newLine];
        });
      }, 50);
      
      // API 호출
      const fetchData = async () => {
        try {
          const res = await fetch('/api/coaching/mind-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problem: inputValue })
          });
          const result = await res.json();
          if (result.success && result.data) {
            setDebuggingData(result.data);
            setTimeout(() => {
              clearInterval(interval);
              setPhase('SCROLL');
            }, 1000); // 데이터 받고 약간의 딜레이 후 넘어감
          } else {
            console.error(result.error);
            clearInterval(interval);
            setPhase('INPUT'); // 에러 시 되돌아감
          }
        } catch (error) {
          console.error(error);
          clearInterval(interval);
          setPhase('INPUT');
        }
      };
      
      // 최소 2초는 스캐닝 애니메이션을 보여주기 위해 Promise.all 활용
      Promise.all([
        fetchData(),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      return () => clearInterval(interval);
    }
  }, [phase, inputValue]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      setPhase('SCANNING');
    }
  };

  const handleFreeWill = () => {
    setPhase('INPUT');
    setInputValue('');
    setDebuggingData(null);
  };

  // 텍스트에서 CBT, DBT 등의 심리 용어를 빛나게 렌더링하는 헬퍼
  const highlightKeywords = (text: string, glowColor: string) => {
    if (!text) return '';
    let parsed = text
      .replace(/\n/g, '<br/>')
      // [ ] 기호 안의 텍스트를 먼저 처리하여 HTML 태그 붕괴 방지
      .replace(/(\[.*?\])/g, `<strong class="text-${glowColor} font-bold">$1</strong>`)
      // CBT, DBT 등을 처리 (drop-shadow-md 등 안전한 클래스명 사용)
      .replace(/(CBT|DBT|ACT|MBCT|MBSR)/g, `<strong class="text-${glowColor} drop-shadow-md font-bold">$1</strong>`);
    return <span dangerouslySetInnerHTML={{ __html: parsed }} />;
  };

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-slate-950 min-h-[500px] border border-slate-800 shadow-2xl mt-4">
      
      {/* 상단 수동 리셋 버튼 */}
      {phase !== 'INPUT' && (
        <div className="absolute top-4 right-4 z-[4000]">
          <button 
            onClick={handleFreeWill}
            className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-400 px-3 py-1.5 rounded-full text-[10px] font-mono transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            AI 리셋
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Phase 1: INPUT */}
        {phase === 'INPUT' && (
          <motion.div 
            key="phase-1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black"
          >
            <Terminal className="w-8 h-8 text-cyan-500 mb-6 animate-pulse" />
            <p className="text-cyan-400 font-mono text-sm mb-8 typing-effect">
              &gt; 당신을 무력하게 만드는 생각이나 감정을 입력해 주세요_
            </p>
            <form onSubmit={handleInputSubmit} className="w-full max-w-md">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="예: 남을 돕고 싶은데 능력이 안 돼서 서글퍼요."
                className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-xl px-5 py-4 text-cyan-50 text-sm focus:outline-none focus:border-cyan-500/80 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.1)] focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="w-full mt-4 bg-cyan-950/40 border border-cyan-800 text-cyan-400 font-mono text-xs py-3 rounded-xl hover:bg-cyan-900/60 transition-colors disabled:opacity-30"
              >
                [ ENTER : 시스템 스캔 시작 ]
              </button>
            </form>
          </motion.div>
        )}

        {/* Phase 2: SCANNING */}
        {phase === 'SCANNING' && (
          <motion.div 
            key="phase-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 bg-black p-4 overflow-hidden flex flex-col justify-end"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
              <Scan className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-spin-slow" />
              <h3 className="text-rose-500 font-mono text-sm tracking-[0.2em] font-bold animate-pulse">
                다크 코드 진단 중...
              </h3>
              <p className="text-rose-900 text-[10px] mt-2 font-mono">
                CBT · DBT · ACT · MBCT · MBSR
              </p>
            </div>
            <div className="font-mono text-[10px] text-rose-500/30 leading-none opacity-50 whitespace-pre-wrap flex flex-col gap-1">
              {matrixLines.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </motion.div>
        )}

        {/* Phase 3 & 4: SCROLLYTELLING + ZERO POINT */}
        {(phase === 'SCROLL' || phase === 'ZERO_POINT') && debuggingData && (
          <motion.div 
            key="phase-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="relative w-full h-[600px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-slate-950"
            onScroll={(e) => {
              const target = e.currentTarget;
              const scrollPercent = target.scrollTop / (target.scrollHeight - target.clientHeight);
              const r = Math.floor(scrollPercent * 240);
              const g = Math.floor(scrollPercent * 230);
              const b = Math.floor(scrollPercent * 200 + (1-scrollPercent)*30);
              target.style.backgroundColor = `rgb(${r/6}, ${g/6}, ${b/4})`;
              if (scrollPercent > 0.95 && phase !== 'ZERO_POINT') {
                setPhase('ZERO_POINT');
              }
            }}
          >
            <div className="sticky top-0 w-full p-4 bg-gradient-to-b from-slate-950 to-transparent z-20 pointer-events-none">
              <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase text-center opacity-70">
                의식 차원 상승 프로토콜 활성화
              </p>
            </div>

            <div className="px-6 py-12 space-y-16 pb-32">
              
              <ScrollReveal>
                <div className="text-center mb-8">
                  <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-cyan-400 font-mono mb-2">
                    매트릭스 디버깅
                  </h2>
                  <p className="text-[10px] text-slate-500 font-mono">(CBT · DBT · ACT · MBCT · MBSR 통합 마스터 로직)</p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-rose-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <Bug className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-rose-500 font-mono">내면의 소스코드</span>
                  </div>
                  <p className="text-xs text-rose-100/80 leading-[1.9] mt-2">
                    {highlightKeywords(debuggingData.sourceCode || (debuggingData as any).source_code || (debuggingData as any).innerCode || (debuggingData as any).inner_code || '', 'amber-400')}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="flex justify-center text-rose-500/50">
                  <RefreshIcon className="w-6 h-6 animate-spin-slow" />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-violet-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-violet-400 font-mono">투사된 현실</span>
                  </div>
                  <p className="text-xs text-violet-100/80 leading-[1.9] mt-2">
                    {highlightKeywords(debuggingData.projectedReality || (debuggingData as any).projected_reality || '', 'amber-400')}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-amber-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 font-mono">명심 코칭 풀이</span>
                  </div>
                  <p className="text-xs text-amber-100/80 leading-[1.9] mt-2">
                    {highlightKeywords(
                      debuggingData.myeongsimCoaching || 
                      (debuggingData as any).myeongsim_coaching || 
                      (debuggingData as any).myeongSimCoaching || 
                      (debuggingData as any).coachingSolution || 
                      (debuggingData as any).coachingInsight || 
                      (debuggingData as any).coaching || 
                      '', 
                      'cyan-400'
                    )}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-indigo-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <span className="text-lg">🤔</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono">소크라테스 문답 (객관화 및 효용성 검증)</span>
                  </div>
                  <p className="text-xs text-indigo-100/80 leading-[1.9] mt-2 italic">
                    {highlightKeywords(
                      debuggingData.socratesQuestion || 
                      (debuggingData as any).socrates_question || 
                      (debuggingData as any).socraticQuestion || 
                      (debuggingData as any).socratic_question || 
                      '', 
                      'amber-400'
                    )}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-blue-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <span className="text-lg">🔁</span>
                    <span className="text-xs font-bold text-blue-400 font-mono">재귀적 질문 (에러 로그의 기원)</span>
                  </div>
                  <p className="text-xs text-blue-100/80 leading-[1.9] mt-2 italic">
                    {highlightKeywords(debuggingData.recursiveQuestion || (debuggingData as any).recursive_question || '', 'cyan-400')}
                  </p>
                </div>
              </ScrollReveal>

              <div className="py-8">
                <ScrollReveal>
                  <h3 className="text-center text-sm font-bold text-cyan-400 font-mono mb-6 tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    의식 리셋 2단계 디버깅 프로세스
                  </h3>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="bg-slate-900/60 border border-cyan-900/40 p-5 rounded-2xl relative mb-6">
                    <div className="flex items-center gap-2 mb-3 border-b border-cyan-900/30 pb-3">
                      <span className="text-[10px] bg-cyan-900/50 text-cyan-400 px-2 py-0.5 rounded-full font-mono">STEP 1</span>
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-300 font-mono">메타 인지 (객관적 관찰)</span>
                    </div>
                    <p className="text-xs text-cyan-100/80 leading-[1.9]">
                      {highlightKeywords(debuggingData.step1 || (debuggingData as any).step_1 || (debuggingData as any).step1_metaCognition || (debuggingData as any).metaCognition || '', 'cyan-400')}
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="flex justify-center text-cyan-500/50 py-4 font-mono text-[10px] tracking-widest">
                    ▼ Deepen Awareness (차원 상승) ▼
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="bg-slate-900/60 border border-indigo-900/40 p-5 rounded-2xl relative">
                    <div className="flex items-center gap-2 mb-3 border-b border-indigo-900/30 pb-3">
                      <span className="text-[10px] bg-indigo-900/50 text-indigo-400 px-2 py-0.5 rounded-full font-mono">STEP 2</span>
                      <span className="text-lg">🌌</span>
                      <span className="text-xs font-bold text-indigo-300 font-mono">알아차림의 알아차림 (순수 자각)</span>
                    </div>
                    <p className="text-xs text-indigo-100/80 leading-[1.9]">
                      {highlightKeywords(debuggingData.step2 || (debuggingData as any).step_2 || (debuggingData as any).step2_pureAwareness || (debuggingData as any).pureAwareness || '', 'indigo-400')}
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              {/* Zero Point 솔루션 */}
              <ScrollReveal>
                <div className="bg-gradient-to-b from-slate-900/90 to-black/90 border border-amber-500/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />
                  <div className="flex items-center justify-center gap-2 mb-6 relative z-10">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold text-amber-400 font-mono tracking-widest">Zero Point 솔루션</span>
                  </div>

                  <div className="space-y-4 relative z-10">
                    {debuggingData.zeroPointSolutions.map((item, idx) => (
                      <div key={idx} className="flex gap-3 bg-black/40 p-3 rounded-lg border border-amber-900/30">
                        <span className="text-amber-500 font-mono font-bold text-xs">{idx + 1}.</span>
                        <p className="text-xs text-amber-50/80 leading-[1.7]">
                          {highlightKeywords(item.title + ' ' + item.text, 'amber-300')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-amber-200/90 leading-[1.9] text-center mt-8 italic relative z-10">
                    이 서글픔과 긴장이 완전히 연소되어 사라지면, 매트릭스의 조건표에 얽매이지 않고 당신의 존재 자체만으로도 타인에게 따뜻한 빛이 되는 영점(Zero Point)의 평화를 누리게 될 것입니다.
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-2 text-[9px] font-mono text-amber-500/50">
                    <span className="border border-amber-900/50 px-2 py-0.5 rounded">디버깅 완료 (닫기)</span>
                    <span className="border border-amber-900/50 px-2 py-0.5 rounded">에고 동기화 해제</span>
                    <span className="border border-amber-900/50 px-2 py-0.5 rounded">시스템 디버깅</span>
                    <span className="border border-amber-900/50 px-2 py-0.5 rounded">포텐셜 드라이브</span>
                    <span className="border border-amber-900/50 px-2 py-0.5 rounded">업그레이드 로그</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* 시스템 알림 */}
              <ScrollReveal>
                <div className="bg-slate-900/80 border-l-4 border-emerald-500 p-5 rounded-r-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-400 font-mono">명심 코칭 AI 시스템 알림</span>
                  </div>
                  <p className="text-xs text-emerald-100/80 leading-[1.8]">
                    같은 기질 데이터라도 당신이 환경(내면의 서글픔과 한계)을 대하는 의식 주파수 관점에 따라 결과는 얼마든지 다르게 나타날 수 있습니다. 이것을 스스로 조절할 수 있는 힘을 명심 코칭에서는 <strong className="text-emerald-300 drop-shadow-sm">'자유의지(Free Will)'</strong>라 합니다.
                    <br/><br/>
                    명심 코칭은 사용자 각각의 자유의지를 활성화하여 매 순간 최상의 컨디션을 유지하며, 나아가 사회적 기여까지 이룰 수 있도록 코칭해 드리는 <strong className="text-emerald-300">명심 AI 코치만의 세계 최초 특허받은 과학적인 웰니스 코칭</strong>입니다.
                  </p>
                </div>
              </ScrollReveal>

              {/* 자유의지 실행 버튼들 */}
              <ScrollReveal>
                <div className="flex flex-col gap-3 pt-6">
                  <button 
                    onClick={handleFreeWill}
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all font-mono text-sm"
                  >
                    [자유의지 실행: 새로운 관점으로 세상 바라보기]
                  </button>
                  <button 
                    onClick={handleFreeWill}
                    className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-all font-mono text-sm"
                  >
                    [자유의지 실행: 닫기 및 내면 관찰 계속하기]
                  </button>
                </div>
              </ScrollReveal>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 스크롤 시 부드럽게 나타나는 컴포넌트
function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
