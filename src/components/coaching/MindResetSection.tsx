'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Bug, Scan, Eye, Star, Zap, Brain, Activity, Shield, Sparkles } from 'lucide-react';

export default function MindResetSection() {
  const [phase, setPhase] = useState<'INPUT' | 'SCANNING' | 'SCROLL' | 'ZERO_POINT'>('INPUT');
  const [inputValue, setInputValue] = useState('');

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
      
      setTimeout(() => {
        clearInterval(interval);
        setPhase('SCROLL');
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      setPhase('SCANNING');
    }
  };

  const handleFreeWill = () => {
    setPhase('INPUT');
    setInputValue('');
  };

  // 공통 텍스트 하이라이터 (볼드체 및 CBT/DBT 등 글로우 처리)
  const HighlightedText = ({ children }: { children: string }) => {
    // 텍스트를 쪼개서 특정 단어에 형광펜 효과를 준다. 여기서는 하드코딩된 내용이므로 필요시 수작업 매핑
    return <span dangerouslySetInnerHTML={{ __html: children }} />;
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
        {(phase === 'SCROLL' || phase === 'ZERO_POINT') && (
          <motion.div 
            key="phase-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="relative w-full h-[600px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-slate-950"
            // 스크롤 위치에 따라 배경색을 변화시키는 간단한 인라인 스타일 
            onScroll={(e) => {
              const target = e.currentTarget;
              const scrollPercent = target.scrollTop / (target.scrollHeight - target.clientHeight);
              // Black -> Deep Blue -> Bright Gold
              const r = Math.floor(scrollPercent * 240); // 0 -> 240
              const g = Math.floor(scrollPercent * 230); // 0 -> 230
              const b = Math.floor(scrollPercent * 200 + (1-scrollPercent)*30); // 30 -> 200
              target.style.backgroundColor = `rgb(${r/6}, ${g/6}, ${b/4})`; // 살짝 다크하게 유지하다가 밑에서 밝아짐
              if (scrollPercent > 0.95 && phase !== 'ZERO_POINT') {
                setPhase('ZERO_POINT');
              }
            }}
          >
            {/* 상단 장식 */}
            <div className="sticky top-0 w-full p-4 bg-gradient-to-b from-slate-950 to-transparent z-20 pointer-events-none">
              <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase text-center opacity-70">
                의식 차원 상승 프로토콜 활성화
              </p>
            </div>

            <div className="px-6 py-12 space-y-16 pb-32">
              
              {/* 원본 텍스트 */}
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
                    <strong className="text-rose-300">[5대 심리 버그 통합]</strong> 타인을 구원할 수 있는 가시적인 '능력(물질, 힘)'이 있어야만 내 존재 가치가 증명된다는 <strong className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">핵심 신념(CBT)</strong>. 내 능력이 부족하다는 뼈아픈 무력감과 서글픔을 회피하려는 <strong className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">경험 회피(ACT)</strong>와, 내가 통제할 수 없는 타인의 삶과 나의 현재 한계를 억지로 뛰어넘으려다 발생하는 <strong className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">정서적 과부하(DBT)</strong>. 결국 완벽히 돕지 못했다는 부채감(Ping) 하나에도 온몸의 신경계가 극도로 긴장하며<strong className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">(MBSR: 스트레스 만성화)</strong>, '나는 무능하고 쓸모없다'는 파국적 시나리오를 무한 재생하는 <strong className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">자동 조종 모드(MBCT)</strong>의 악성 루프.
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
                    뇌가 띄운 "나는 능력이 없어 아무것도 할 수 없다"라는 오류 팝업창을 진실이라 믿어버리는 <strong className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">인지적 융합(ACT)</strong> 상태. 내 능력이 부족하다는 서글픔(결핍의 주파수)은 오히려 끝없이 나의 한계를 확인시켜주는 상황만을 외부로 투사하여 끌어당깁니다. 완벽하게 돕지 못할 바엔 스스로를 자책하느라 에너지를 모두 소모하는 <strong className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">행위 양식(MBCT)</strong>의 과부하에 빠져, 신체적·정신적 에너지가 완전히 고갈되고<strong className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">(MBSR: 교감신경계 과각성)</strong> 정작 지금 당장 내가 건넬 수 있는 '따뜻한 눈빛'이나 '작은 친절'이라는 현실의 선한 영향력마저 완전히 상실해 버린 채 무기력하게 얼어붙은 상태.
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
                    당신의 베이스 OS는 타인을 돕고자 하는 숭고한 이타심(코어)을 지니고 있습니다. 그러나 '물리적/경제적 능력의 한계'는 지금 당장 당신이 100% 통제할 수 없는 환경 변수입니다. 시스템은 이 한계를 '나의 본질적인 무능함'으로 오역하여 깊은 서글픔을 렌더링하고<strong className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">(CBT: 파국화)</strong>, 뇌가 뱉어낸 자기 비하의 텍스트에 찰싹 달라붙습니다<strong className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">(ACT: 인지적 융합)</strong>. 내 능력 밖의 일까지 억지로 해결하려 하니 감정 시스템이 붕괴되고<strong className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">(DBT: 감정적 마음의 폭주)</strong>, 거창한 해결책을 줘야 한다는 강박 때문에 호흡이 얕아지고 몸이 굳어지며<strong className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">(MBSR: 신체적 스트레스 반응)</strong> 지금 이 순간 내 존재 자체로 줄 수 있는 공감과 위로마저 누리지 못합니다<strong className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">(MBCT: 행위 양식의 과부하)</strong>.
                    <br/><br/>
                    능력의 부족함과 서글픔, 그리고 몸의 긴장감은 에러가 아닙니다. 내가 신이 아니기에 한계가 있다는 팩트를 있는 그대로 <strong className="text-cyan-400">전면적 수용(DBT)</strong>하고, 억지로 상황을 고치려는 시도를 멈춘 채 그저 판단 없이 나의 호흡과 신체 감각에 머물러주는<strong className="text-cyan-400">(MBSR: 마음챙김)</strong> '존재 양식(Being Mode)'으로 전환할 때, 당신의 시스템은 <strong className="text-cyan-400">지혜로운 마음(DBT)</strong>을 회복할 수 있습니다.
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
                    완벽하게 문제를 해결해 주는 물질적 '능력'만이 타인에게 위로와 도움이 된다는 100% 확실한 객관적 증거(CBT)가 있나요? 당신이 매일 자신의 무능함을 자책하며 쳐놓은 그 서글픔의 방어벽과 몸의 긴장감이, 진정 당신이 원하는 '타인과 따뜻하게 연결된 삶(ACT)'을 실천하는 데 효과적으로 작동(DBT)하고 있나요?
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
                    과거 언제부터 당신의 시스템은 '내게 힘이나 돈(능력)이 있어야만 사랑하는 사람을 지키고 쓸모 있는 존재가 된다'는 악성 코드를 다운로드했으며, 그 뼈아픈 무력감을 피하기 위해 몸을 잔뜩 웅크린 채 자기 연민과 자책의 재생 목록(MBCT)을 반복해서 틀어놓는 회피 패턴을 시작했나요?
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
                      <strong className="text-cyan-400 drop-shadow-md">[인지적 탈융합 & 탈중심화 & 바디 스캔(MBSR)]</strong> 능력이 안 되어 돕지 못한다는 서글픔과 자책감을 억누르거나 통제하려 하지 마세요. 즉시 호흡으로 닻을 내리고, "아, 내 뇌가 지금 또 '나는 능력이 부족해'라는 자기 비하 팝업창을 띄우고, 내 가슴을 답답하게 조이고 있구나"라고 명명(Labeling)하세요. 이 서글픔은 당신의 따뜻한 공감 능력이 만들어낸 일시적인 감정 트래픽이자 신체의 긴장 반응일 뿐, 당신이 무가치하다는 팩트(Fact)가 아님을 인지합니다.
                      <br/><br/>
                      <span className="text-cyan-500 italic">➔ 에고의 생각과 감정(서글픔, 자책), 그리고 굳어진 신체 감각을 관찰자 시점으로 가만히 바라봅니다.</span>
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
                      <strong className="text-indigo-400 drop-shadow-md">[지혜로운 마음 & 맥락으로서의 자기]</strong> 뇌가 만들어내는 무능력의 텍스트와 몸의 긴장감 뒤편에, 타인의 고통이나 내 능력의 한계에 결코 파괴되지 않고 '지금 이 순간'을 고요하게 담아내는 광활한 '알아차림의 바다(서버)'로 시선을 돌리세요. 당신은 서글픔에 허우적대는 파도가 아니라 텅 빈 바다 그 자체입니다.
                      <br/><br/>
                      <span className="text-indigo-500 italic">➔ 관찰하고 있는 '텅 빈 배경 자체(자각 그 자체)'에 머무릅니다.</span>
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
                  <p className="text-xs text-amber-100/90 leading-[1.9] text-center mb-8 relative z-10">
                    능력이 없어 저 사람을 구하지 못한다는 뼈아픈 무력감과 슬픔을 도망치지 말고 심장으로 기꺼이 경험(ACT)하고 견뎌내세요(DBT). 그리고 그 자리에서 다음의 5단계 통합 명령어를 실행하십시오.
                  </p>

                  <div className="space-y-4 relative z-10">
                    {[
                      {
                        title: "[수용]",
                        text: `"나는 타인을 돕고 싶지만, 현재 나의 물리적/경제적 능력에는 명확한 한계가 있다"는 통제 불능의 팩트를 무저항으로 전면적 수용(DBT)합니다.`
                      },
                      {
                        title: "[현재 앵커링 & 바디 스캔]",
                        text: `내 능력 밖의 가상의 미래를 통제하려는 스위치를 끄고, 지금 이 순간 잔뜩 웅크린 어깨의 힘을 빼며 내 가슴에서 뛰는 따뜻한 심장 박동과 호흡의 고요한 흐름에 온전히 주의를 기울여(MBSR/MBCT: 지금 여기) 접속합니다.`
                      },
                      {
                        title: "[클린 코드 입력]",
                        text: `"타인을 진심으로 안타까워하는 나의 마음 그 자체로 이미 훌륭한 치유의 에너지를 뿜어내고 있으며, 나는 무가치한 것이 아니라 현재의 한계를 지닌 것일 뿐이다"라는 건강한 팩트(CBT)를 시스템에 재입력합니다.`
                      },
                      {
                        title: "[전념 행동]",
                        text: `자기 비하의 환상과 싸우느라 낭비하던 포텐셜 드라이브를 거두어들여, 거창한 물질적 도움이 아니더라도 그를 위해 마음속으로 진심 어린 기도를 올리거나 묵묵히 이야기를 들어주는 진정한 가치(ACT)를 향해 전진하세요.`
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 bg-black/40 p-3 rounded-lg border border-amber-900/30">
                        <span className="text-amber-500 font-mono font-bold text-xs">{idx + 1}.</span>
                        <p className="text-xs text-amber-50/80 leading-[1.7]">
                          <strong className="text-amber-300">{item.title}</strong> {item.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-amber-200/90 leading-[1.9] text-center mt-8 italic relative z-10">
                    이 서글픔과 긴장이 완전히 연소되어 사라지면, '능력'이라는 매트릭스의 조건표에 얽매이지 않고 당신의 존재 자체만으로도 타인에게 따뜻한 빛이 되는 영점(Zero Point)의 평화를 누리게 될 것입니다.
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
                    [자유의지 실행: 따뜻한 마음 보내기]
                  </button>
                  <button 
                    onClick={handleFreeWill}
                    className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-all font-mono text-sm"
                  >
                    [자유의지 실행: 내 마음 먼저 다독이기]
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
