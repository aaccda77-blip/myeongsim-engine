'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Bug, Scan, Eye, Brain, Activity, Shield, Sparkles, RefreshCw } from 'lucide-react';

const fallbackData = {
  innerCode: "[5대 심리 버그 통합] 타인을 구원할 수 있는 가시적인 '능력(물질, 힘)'이 있어야만 내 존재 가치가 증명된다는 <strong class='text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'>핵심 신념(CBT)</strong>. 내 능력이 부족하다는 뼈아픈 무력감과 서글픔을 회피하려는 <strong class='text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'>경험 회피(ACT)</strong>와, 내가 통제할 수 없는 타인의 삶과 나의 현재 한계를 억지로 뛰어넘으려다 발생하는 <strong class='text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'>정서적 과부하(DBT)</strong>. 결국 완벽히 돕지 못했다는 부채감 하나에도 온몸의 신경계가 극도로 긴장하며 <strong class='text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'>(MBSR: 스트레스 만성화)</strong>, 스스로를 탓하는 <strong class='text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'>자동 조종 모드(MBCT)</strong>에 빠지기 쉽습니다.",
  projectedReality: '뇌가 띄운 "나는 능력이 없어 아무것도 할 수 없다"라는 오류 팝업창을 진실이라 믿어버리는 <strong class="text-violet-300 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">인지적 융합(ACT)</strong> 상태. 내 능력이 부족하다는 서글픔은 오히려 나의 한계를 확인시켜주는 상황만을 외부로 투사하여 끌어당깁니다. 자책하느라 에너지를 모두 소모하는 <strong class="text-violet-300 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">행위 양식(MBCT)</strong>의 과부하에 빠져, 신체적 에너지가 고갈되고<strong class="text-violet-300 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">(MBSR: 교감신경계 과각성)</strong> 선한 영향력마저 잃어버릴 수 있습니다.',
  coachingSolution: "당신의 베이스 OS는 숭고한 이타심을 지니고 있습니다. 그러나 '능력의 한계'는 지금 당장 100% 통제할 수 없는 변수입니다. 시스템은 이 한계를 '나의 본질적인 무능함'으로 오역하여 깊은 서글픔을 렌더링하고<strong class='text-amber-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]'>(CBT: 파국화)</strong>, 자기 비하에 달라붙습니다<strong class='text-amber-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]'>(ACT: 인지적 융합)</strong>. 능력 밖의 일까지 억지로 해결하려 하니 감정 시스템이 붕괴되고<strong class='text-amber-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]'>(DBT: 감정적 마음의 폭주)</strong> 호흡이 얕아집니다<strong class='text-amber-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]'>(MBSR)</strong>.<br/><br/>팩트를 있는 그대로 <strong class='text-amber-300'>전면적 수용(DBT)</strong>하고, 나 자신에게 <strong class='text-amber-300'>자기연민(MSC)</strong>의 다정한 위로를 건네며 '존재 양식(Being Mode)'으로 전환할 때 <strong class='text-amber-300'>지혜로운 마음(DBT)</strong>을 회복할 수 있습니다.",
  socraticQuestion: "완벽하게 문제를 해결해 주는 '능력'만이 타인에게 위로가 된다는 100% 확실한 객관적 증거(CBT)가 있나요? 당신이 매일 자책하며 쳐놓은 그 방어벽이 진정 원하는 '따뜻하게 연결된 삶(ACT)'을 실천하는 데 효과적으로 작동(DBT)하고 있나요?",
  recursiveQuestion: "과거 언제부터 당신의 시스템은 '내게 능력이 있어야만 쓸모 있는 존재가 된다'는 코드를 다운로드했으며, 그 무력감을 피하기 위해 자기 연민과 자책의 재생 목록(MBCT)을 틀어놓기 시작했나요?",
  metaCognition: "<strong class='text-cyan-400 drop-shadow-md'>[인지적 탈융합 & 탈중심화 & 바디 스캔(MBSR)]</strong> 감정을 통제하려 하지 마세요. 호흡으로 닻을 내리고, '아, 내 뇌가 자기 비하 팝업창을 띄웠구나'라고 명명(Labeling)하세요. 이 서글픔은 일시적인 트래픽일 뿐, 팩트(Fact)가 아님을 인지합니다.<br/><br/><span class='text-cyan-500 italic'>➔ 에고의 생각과 감정을 관찰자 시점으로 가만히 바라봅니다.</span>",
  pureAwareness: "<strong class='text-indigo-400 drop-shadow-md'>[지혜로운 마음 & 맥락으로서의 자기]</strong> 뇌가 만들어내는 텍스트와 신체 반응 뒤편에, '지금 이 순간'을 고요하게 담아내는 광활한 '알아차림의 바다'로 시선을 돌리세요. 당신은 서글픔에 허우적대는 파도가 아니라 텅 빈 바다 그 자체입니다.<br/><br/><span class='text-indigo-500 italic'>➔ 관찰하고 있는 '텅 빈 배경 자체(자각 그 자체)'에 머무릅니다.</span>",
  zeroPointList: [
    { title: "[수용과 자기연민]", text: "\"나는 돕고 싶지만, 현재 나의 능력에는 명확한 한계가 있다\"는 팩트를 전면 수용(DBT)하고, 상처받은 내면을 따뜻하게 안아줍니다(MSC)." },
    { title: "[현재 앵커링 & 바디 스캔]", text: "가상의 미래를 통제하려는 스위치를 끄고, 지금 이 순간 호흡의 고요한 흐름에 온전히 주의를 기울여(MBSR/MBCT: 지금 여기) 접속합니다." },
    { title: "[클린 코드 입력]", text: "\"타인을 안타까워하는 내 마음 그 자체로 치유의 에너지를 뿜어내고 있으며, 나는 무가치한 것이 아니라 그저 한계를 지닌 것뿐이다\"라는 팩트(CBT)를 입력합니다." },
    { title: "[전념 행동]", text: "자기 비하의 환상과 싸우던 에너지를 거두어, 묵묵히 위로를 전하는 진정한 가치(ACT)를 향해 전진하세요." }
  ],
  zeroPointEnding: "이 서글픔과 긴장이 완전히 연소되면, '능력'이라는 매트릭스에 얽매이지 않고 당신의 존재 자체만으로도 따뜻한 빛이 되는 영점(Zero Point)의 평화를 누리게 될 것입니다."
};

export default function MindResetSection() {
  const [phase, setPhase] = useState<'INPUT' | 'SCANNING' | 'SCROLL' | 'ZERO_POINT'>('INPUT');
  const [inputValue, setInputValue] = useState('');
  const [aiData, setAiData] = useState<any>(null);

  // 매트릭스 노이즈용 코드
  const [matrixLines, setMatrixLines] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'SCANNING') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()';
      interval = setInterval(() => {
        setMatrixLines(prev => {
          const newLine = Array.from({ length: 40 }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
          return [...prev.slice(-15), newLine];
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      setPhase('SCANNING');
      setAiData(null);
      
      const startTime = Date.now();
      
      try {
        const res = await fetch('/api/coaching/mind-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bugInput: inputValue })
        });
        const json = await res.json();
        
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 3500 - elapsed); // 최소 3.5초간 매트릭스 화면
        
        setTimeout(() => {
          if (json.success && json.data) {
            setAiData(json.data);
          } else {
            console.error('API Error:', json.error);
            setAiData({ ...fallbackData });
          }
          setPhase('SCROLL');
        }, remainingTime);

      } catch (err) {
        console.error('Network Error:', err);
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 3500 - elapsed);
        setTimeout(() => {
          setAiData({ ...fallbackData });
          setPhase('SCROLL');
        }, remainingTime);
      }
    }
  };

  const handleResetAi = () => {
    setPhase('INPUT');
    setInputValue('');
    setAiData(null);
  };

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-slate-950 min-h-[500px] border border-slate-800 shadow-2xl mt-4">
      
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
                placeholder="예: 사람들을 돕고 싶은데 제 능력이 너무 부족해서 무기력해요."
                className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-xl px-5 py-4 text-cyan-50 text-sm focus:outline-none focus:border-cyan-500/80 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.1)] focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="w-full mt-4 bg-cyan-950/40 border border-cyan-800 text-cyan-400 font-mono text-xs py-3 rounded-xl hover:bg-cyan-900/60 transition-colors disabled:opacity-30"
              >
                [ ENTER : AI 디버깅 스캔 시작 ]
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full">
              <Scan className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-spin-slow" />
              <h3 className="text-emerald-400 font-mono text-sm tracking-[0.2em] font-bold animate-pulse">
                5D AI 다크 코드 진단 및 재생성 중...
              </h3>
              <p className="text-emerald-900 text-[10px] mt-2 font-mono">
                CBT · DBT · ACT · MBCT · MBSR · MSC 통합 생성 중
              </p>
            </div>
            <div className="font-mono text-[10px] text-emerald-500/30 leading-none opacity-50 whitespace-pre-wrap flex flex-col gap-1">
              {matrixLines.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </motion.div>
        )}

        {/* Phase 3 & 4: SCROLLYTELLING + ZERO POINT */}
        {(phase === 'SCROLL' || phase === 'ZERO_POINT') && aiData && (
          <motion.div 
            key="phase-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="relative w-full h-[600px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-slate-950"
            onScroll={(e) => {
              const target = e.currentTarget;
              const scrollPercent = target.scrollTop / Math.max(1, (target.scrollHeight - target.clientHeight));
              const r = Math.floor(scrollPercent * 240);
              const g = Math.floor(scrollPercent * 230);
              const b = Math.floor(scrollPercent * 200 + (1-scrollPercent)*30);
              target.style.backgroundColor = `rgb(${r/6}, ${g/6}, ${b/4})`;
              if (scrollPercent > 0.95 && phase !== 'ZERO_POINT') {
                setPhase('ZERO_POINT');
              }
            }}
          >
            {/* 우측 상단 수동 리셋 버튼 */}
            <div className="absolute top-4 right-4 z-[100] sticky">
              <button 
                onClick={handleResetAi}
                className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-full font-mono text-xs transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md"
              >
                <RefreshCw className="w-3 h-3" />
                <span>AI 리셋</span>
              </button>
            </div>

            {/* 상단 장식 */}
            <div className="sticky top-0 w-full p-4 bg-gradient-to-b from-slate-950 to-transparent z-20 pointer-events-none -mt-10">
              <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase text-center opacity-70">
                의식 차원 상승 프로토콜 활성화
              </p>
            </div>

            <div className="px-6 py-12 space-y-16 pb-32">
              
              <ScrollReveal>
                <div className="text-center mb-8">
                  <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-cyan-400 font-mono mb-2">
                    맞춤형 5D 매트릭스 디버깅
                  </h2>
                  <p className="text-[10px] text-slate-500 font-mono">(CBT · DBT · ACT · MBCT · MBSR · MSC 통합)</p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-rose-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <Bug className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-rose-500 font-mono">내면의 소스코드</span>
                  </div>
                  <p className="text-xs text-rose-100/80 leading-[1.9] mt-2 [&>strong]:text-rose-300 [&>strong]:drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" dangerouslySetInnerHTML={{ __html: aiData.innerCode }} />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="flex justify-center text-rose-500/50">
                  <RefreshCw className="w-6 h-6 animate-spin-slow" />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-violet-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-violet-400 font-mono">투사된 현실</span>
                  </div>
                  <p className="text-xs text-violet-100/80 leading-[1.9] mt-2 [&>strong]:text-violet-300 [&>strong]:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" dangerouslySetInnerHTML={{ __html: aiData.projectedReality }} />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-amber-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 font-mono">명심 코칭 풀이</span>
                  </div>
                  <p className="text-xs text-amber-100/80 leading-[1.9] mt-2 [&>strong]:text-amber-300 [&>strong]:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" dangerouslySetInnerHTML={{ __html: aiData.coachingSolution }} />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-indigo-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <span className="text-lg">🤔</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono">소크라테스 문답 (객관화 검증)</span>
                  </div>
                  <p className="text-xs text-indigo-100/80 leading-[1.9] mt-2 italic [&>strong]:text-indigo-300" dangerouslySetInnerHTML={{ __html: aiData.socraticQuestion }} />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-slate-900/60 border border-blue-900/30 p-5 rounded-2xl relative">
                  <div className="absolute -top-3 left-4 bg-slate-950 px-2 flex items-center gap-2">
                    <span className="text-lg">🔁</span>
                    <span className="text-xs font-bold text-blue-400 font-mono">재귀적 질문 (기원의 탐색)</span>
                  </div>
                  <p className="text-xs text-blue-100/80 leading-[1.9] mt-2 italic [&>strong]:text-blue-300" dangerouslySetInnerHTML={{ __html: aiData.recursiveQuestion }} />
                </div>
              </ScrollReveal>

              <div className="py-8">
                <ScrollReveal>
                  <h3 className="text-center text-sm font-bold text-cyan-400 font-mono mb-6 tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    의식 리셋 2단계 디버깅
                  </h3>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="bg-slate-900/60 border border-cyan-900/40 p-5 rounded-2xl relative mb-6">
                    <div className="flex items-center gap-2 mb-3 border-b border-cyan-900/30 pb-3">
                      <span className="text-[10px] bg-cyan-900/50 text-cyan-400 px-2 py-0.5 rounded-full font-mono">STEP 1</span>
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-300 font-mono">메타 인지 (객관적 관찰)</span>
                    </div>
                    <p className="text-xs text-cyan-100/80 leading-[1.9] [&>strong]:text-cyan-400 [&>strong]:drop-shadow-md" dangerouslySetInnerHTML={{ __html: aiData.metaCognition }} />
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
                    <p className="text-xs text-indigo-100/80 leading-[1.9] [&>strong]:text-indigo-400 [&>strong]:drop-shadow-md" dangerouslySetInnerHTML={{ __html: aiData.pureAwareness }} />
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
                    {aiData.zeroPointList.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-3 bg-black/40 p-3 rounded-lg border border-amber-900/30">
                        <span className="text-amber-500 font-mono font-bold text-xs">{idx + 1}.</span>
                        <p className="text-xs text-amber-50/80 leading-[1.7]">
                          <strong className="text-amber-300">{item.title}</strong> <span dangerouslySetInnerHTML={{ __html: item.text }} />
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-amber-200/90 leading-[1.9] text-center mt-8 italic relative z-10" dangerouslySetInnerHTML={{ __html: aiData.zeroPointEnding }} />

                  <div className="mt-8 flex flex-wrap justify-center gap-2 text-[9px] font-mono text-amber-500/50">
                    <span className="border border-amber-900/50 px-2 py-0.5 rounded">디버깅 완료 (닫기)</span>
                    <span className="border border-amber-900/50 px-2 py-0.5 rounded">에고 동기화 해제</span>
                    <span className="border border-amber-900/50 px-2 py-0.5 rounded">시스템 디버깅</span>
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
                    같은 기질 데이터라도 당신이 환경(내면의 감정과 한계)을 대하는 의식 주파수 관점에 따라 결과는 얼마든지 다르게 나타날 수 있습니다. 이것을 스스로 조절할 수 있는 힘을 명심 코칭에서는 <strong className="text-emerald-300 drop-shadow-sm">'자유의지(Free Will)'</strong>라 합니다.
                    <br/><br/>
                    명심 코칭은 사용자 각각의 자유의지를 활성화하여 매 순간 최상의 컨디션을 유지하며, 나아가 사회적 기여까지 이룰 수 있도록 코칭해 드리는 <strong className="text-emerald-300">세계 최초 특허받은 과학적인 웰니스 코칭</strong>입니다.
                  </p>
                </div>
              </ScrollReveal>

              {/* 자유의지 실행 버튼들 */}
              <ScrollReveal>
                <div className="flex flex-col gap-3 pt-6">
                  <button 
                    onClick={handleResetAi}
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all font-mono text-sm"
                  >
                    [자유의지 실행: 깨달음 적용하고 다시 시작]
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
