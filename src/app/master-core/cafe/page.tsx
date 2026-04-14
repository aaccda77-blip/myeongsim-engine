'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import {
  SAMPLE_SAJU,
  runFullPipeline,
  sajuToJson,
  runGungtongEngine,
  runJeokcheonsuEngine,
  runJapyeongEngine,
  runCafeAlgorithm,
  generateFinalOutput,
  type SajuData,
  type SajuChar,
  type EngineResult,
  type ElementScores,
  type CafeOutput,
  type FiveElement,
} from '@/modules/CafeAlgorithmModule';

// ─── 천간/지지 → SajuChar 변환 테이블 ───
const GAN_MAP: Record<string, SajuChar> = {
  '甲': { char: '甲', element: '목', yinYang: '양', label: '갑목(甲木)' },
  '乙': { char: '乙', element: '목', yinYang: '음', label: '을목(乙木)' },
  '丙': { char: '丙', element: '화', yinYang: '양', label: '병화(丙火)' },
  '丁': { char: '丁', element: '화', yinYang: '음', label: '정화(丁火)' },
  '戊': { char: '戊', element: '토', yinYang: '양', label: '무토(戊土)' },
  '己': { char: '己', element: '토', yinYang: '음', label: '기토(己土)' },
  '庚': { char: '庚', element: '금', yinYang: '양', label: '경금(庚金)' },
  '辛': { char: '辛', element: '금', yinYang: '음', label: '신금(辛金)' },
  '壬': { char: '壬', element: '수', yinYang: '양', label: '임수(壬水)' },
  '癸': { char: '癸', element: '수', yinYang: '음', label: '계수(癸水)' },
};

const JI_MAP: Record<string, SajuChar> = {
  '子': { char: '子', element: '수', yinYang: '양', label: '자수(子水)' },
  '丑': { char: '丑', element: '토', yinYang: '음', label: '축토(丑土)' },
  '寅': { char: '寅', element: '목', yinYang: '양', label: '인목(寅木)' },
  '卯': { char: '卯', element: '목', yinYang: '음', label: '묘목(卯木)' },
  '辰': { char: '辰', element: '토', yinYang: '양', label: '진토(辰土)' },
  '巳': { char: '巳', element: '화', yinYang: '음', label: '사화(巳火)' },
  '午': { char: '午', element: '화', yinYang: '양', label: '오화(午火)' },
  '未': { char: '未', element: '토', yinYang: '음', label: '미토(未土)' },
  '申': { char: '申', element: '금', yinYang: '양', label: '신금(申金)' },
  '酉': { char: '酉', element: '금', yinYang: '음', label: '유금(酉金)' },
  '戌': { char: '戌', element: '토', yinYang: '양', label: '술토(戌土)' },
  '亥': { char: '亥', element: '수', yinYang: '음', label: '해수(亥水)' },
};

type Step = 0 | 1 | 2 | 3 | 4;

const STEP_INFO = [
  { label: '시작', icon: '🚀', title: '파이프라인 시작' },
  { label: 'JSON', icon: '📋', title: '1단계: 사주 데이터 객체화' },
  { label: '엔진', icon: '⚙️', title: '2단계: 고전 규칙 엔진 실행' },
  { label: 'CAFE', icon: '🔬', title: '3단계: CAFE 교차 가중 분석' },
  { label: '출력', icon: '🎯', title: '4단계: 명심 코드 출력' },
];

const ELEMENT_COLORS: Record<string, string> = {
  '목': 'text-emerald-400',
  '화': 'text-orange-400',
  '토': 'text-amber-400',
  '금': 'text-slate-300',
  '수': 'text-cyan-400',
};

const ELEMENT_BG: Record<string, string> = {
  '목': 'bg-emerald-500/20 border-emerald-500/30',
  '화': 'bg-orange-500/20 border-orange-500/30',
  '토': 'bg-amber-500/20 border-amber-500/30',
  '금': 'bg-slate-400/20 border-slate-400/30',
  '수': 'bg-cyan-500/20 border-cyan-500/30',
};

export default function CafePipelineDemo() {
  const { reportData } = useReportStore();
  const [step, setStep] = useState<Step>(0);
  const [sajuJson, setSajuJson] = useState<string>('');
  const [engines, setEngines] = useState<EngineResult[]>([]);
  const [cafeScores, setCafeScores] = useState<ElementScores | null>(null);
  const [finalOutput, setFinalOutput] = useState<CafeOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ─── 스토어 사주 데이터 → SajuData 변환 ───
  const userSaju = useMemo((): SajuData => {
    const fp = reportData?.saju?.fourPillars;
    if (!fp) return SAMPLE_SAJU;

    const getGan = (char: string): SajuChar => GAN_MAP[char] ?? SAMPLE_SAJU.dayStem;
    const getJi  = (char: string): SajuChar => JI_MAP[char]  ?? SAMPLE_SAJU.dayBranch;

    const yearGanChar  = (fp.year as any)?.gan?.char  ?? (fp.year as any)?.gan  ?? '';
    const yearJiChar   = (fp.year as any)?.ji?.char   ?? (fp.year as any)?.ji   ?? '';
    const monthGanChar = (fp.month as any)?.gan?.char ?? (fp.month as any)?.gan ?? '';
    const monthJiChar  = (fp.month as any)?.ji?.char  ?? (fp.month as any)?.ji  ?? '';
    const dayGanChar   = (fp.day as any)?.gan?.char   ?? (fp.day as any)?.gan   ?? '';
    const dayJiChar    = (fp.day as any)?.ji?.char    ?? (fp.day as any)?.ji    ?? '';
    const timeGanChar  = (fp.time as any)?.gan?.char  ?? (fp.time as any)?.gan  ?? '';
    const timeJiChar   = (fp.time as any)?.ji?.char   ?? (fp.time as any)?.ji   ?? '';

    // 변환 실패 시 SAMPLE_SAJU 폴백
    if (!GAN_MAP[dayGanChar]) return SAMPLE_SAJU;

    return {
      yearStem:    getGan(yearGanChar),
      yearBranch:  getJi(yearJiChar),
      monthStem:   getGan(monthGanChar),
      monthBranch: getJi(monthJiChar),
      dayStem:     getGan(dayGanChar),
      dayBranch:   getJi(dayJiChar),
      hourStem:    timeGanChar && GAN_MAP[timeGanChar] ? getGan(timeGanChar) : SAMPLE_SAJU.hourStem,
      hourBranch:  timeJiChar  && JI_MAP[timeJiChar]  ? getJi(timeJiChar)  : SAMPLE_SAJU.hourBranch,
    };
  }, [reportData]);

  const isUsingUserData = userSaju !== SAMPLE_SAJU;

  const advanceStep = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      const nextStep = Math.min(step + 1, 4) as Step;
      
      if (nextStep === 1) {
        setSajuJson(sajuToJson(userSaju));
      }
      if (nextStep === 2) {
        const e1 = runGungtongEngine(userSaju);
        const e2 = runJeokcheonsuEngine(userSaju);
        const e3 = runJapyeongEngine(userSaju);
        setEngines([e1, e2, e3]);
      }
      if (nextStep === 3) {
        const e1 = runGungtongEngine(userSaju);
        const e2 = runJeokcheonsuEngine(userSaju);
        const e3 = runJapyeongEngine(userSaju);
        const scores = runCafeAlgorithm([e1, e2, e3]);
        setCafeScores(scores);
      }
      if (nextStep === 4) {
        const result = runFullPipeline(userSaju);
        setFinalOutput(result.finalOutput);
      }

      setStep(nextStep);
      setIsProcessing(false);
    }, 600);
  }, [step, userSaju]);

  const resetPipeline = () => {
    setStep(0);
    setSajuJson('');
    setEngines([]);
    setCafeScores(null);
    setFinalOutput(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070A12] text-gray-200 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:30px_30px] z-0"></div>
      <div className="fixed top-[-20%] left-[-15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-violet-700/8 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-cyan-700/8 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-violet-900/40 bg-black/40 backdrop-blur-md">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔬</span>
            <div>
              <h1 className="text-sm font-bold text-violet-200">CAFE 알고리즘 파이프라인</h1>
              <p className="text-[10px] text-violet-500/70 font-mono">CROSS-WEIGHTED ANALYSIS FOR FIVE ELEMENTS</p>
            </div>
          </div>
          {isUsingUserData ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/40 text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-950/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {userSaju.dayStem.label} 연동됨
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-full border border-violet-600/30 text-[10px] font-mono tracking-widest text-violet-500 bg-violet-950/20">
              DEMO MODE
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 relative z-10 overflow-y-auto scrollbar-hide">
        <div className="max-w-2xl mx-auto px-5 py-6">

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 px-2">
            {STEP_INFO.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all duration-500 ${
                    i <= step 
                      ? 'bg-violet-600/30 border-violet-400/60 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                      : 'bg-gray-900/50 border-gray-700/40'
                  }`}>
                    {i <= step ? s.icon : <span className="text-gray-600 text-xs">{i}</span>}
                  </div>
                  <span className={`text-[9px] font-mono ${i <= step ? 'text-violet-400' : 'text-gray-600'}`}>{s.label}</span>
                </div>
                {i < 4 && (
                  <div className={`flex-1 h-px mx-1 transition-all duration-700 ${
                    i < step ? 'bg-gradient-to-r from-violet-500 to-violet-400' : 'bg-gray-800'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {/* Step 0: Intro */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🔬</div>
                  <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-white to-cyan-200 mb-3">
                    CAFE 알고리즘 파이프라인
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed break-keep max-w-sm mx-auto">
                    고전 문헌의 철학적 판단 로직이 어떻게<br />
                    <strong className="text-violet-300">확정적 규칙 엔진(Rule Engine)</strong>으로 변환되는지<br />
                    4단계 파이프라인을 실시간으로 시연합니다.
                  </p>
                </div>

                {/* Architecture Overview */}
                <div className="p-4 rounded-2xl border border-violet-500/20 bg-black/30">
                  <div className="text-[10px] font-mono text-violet-500/70 mb-3 tracking-wider">ARCHITECTURE OVERVIEW</div>
                  <div className="space-y-2">
                    {[
                      { step: '1', label: '사주 8글자 → JSON 데이터 객체화', color: 'text-emerald-400' },
                      { step: '2', label: '궁통보감 / 적천수 / 자평진전 규칙 엔진 독립 실행', color: 'text-orange-400' },
                      { step: '3', label: 'CAFE 교차 가중 분석 (Cross-weighted Scoring)', color: 'text-violet-400' },
                      { step: '4', label: 'Dark-Neural-Meta 코드 출력 → LLM 화법 변환', color: 'text-cyan-400' },
                    ].map(item => (
                      <div key={item.step} className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center text-[9px] font-mono ${item.color}`}>{item.step}</span>
                        <span className="text-xs text-gray-300">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Saju Display */}
                <div className="p-4 rounded-2xl border border-gray-800/50 bg-black/20">
                  <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">📋 시연용 샘플 명식</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { pos: '시주', stem: SAMPLE_SAJU.hourStem, branch: SAMPLE_SAJU.hourBranch },
                      { pos: '일주', stem: SAMPLE_SAJU.dayStem, branch: SAMPLE_SAJU.dayBranch },
                      { pos: '월주', stem: SAMPLE_SAJU.monthStem, branch: SAMPLE_SAJU.monthBranch },
                      { pos: '년주', stem: SAMPLE_SAJU.yearStem, branch: SAMPLE_SAJU.yearBranch },
                    ].map(p => (
                      <div key={p.pos} className="space-y-1">
                        <div className="text-[9px] text-gray-500 font-mono">{p.pos}</div>
                        <div className={`text-lg font-black ${ELEMENT_COLORS[p.stem.element]}`}>{p.stem.char}</div>
                        <div className={`text-lg font-black ${ELEMENT_COLORS[p.branch.element]}`}>{p.branch.char}</div>
                        <div className="text-[8px] text-gray-600">{p.stem.element}/{p.branch.element}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-center text-[10px] text-gray-500">
                    일간: <span className="text-slate-300 font-bold">辛金(신금)</span> · 월지: <span className="text-orange-400 font-bold">午火(오화)</span> · 여름 태어남
                  </div>
                </div>

                {/* Key Differentiator */}
                <div className="p-4 rounded-2xl border border-amber-500/15 bg-amber-950/10">
                  <div className="text-[10px] font-mono text-amber-500/70 mb-2 tracking-wider">💡 핵심 차별화</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed break-keep">
                    일반 AI 사주 앱: 고전 문헌을 RAG에 넣고 LLM이 &quot;알아서&quot; 풀이<br />
                    <span className="text-amber-300 font-bold">명심 CAFE:</span> 개발자가 고전 논리를 확정적 조건식으로 코드화 → LLM은 오직 화법 변환만 담당
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 1: JSON */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="text-[10px] font-mono text-emerald-500/70 mb-1 tracking-widest">STEP 1 OF 4</div>
                  <h3 className="text-lg font-bold text-emerald-300">사주 데이터 객체화 (JSON)</h3>
                  <p className="text-xs text-gray-400 mt-1">한자 텍스트를 프로그램이 연산할 수 있는 구조로 변환</p>
                </div>
                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-black/40 overflow-x-auto">
                  <div className="text-[10px] font-mono text-emerald-500/70 mb-2">// 변환된 JSON 스키마</div>
                  <pre className="text-[10px] font-mono text-emerald-200/80 whitespace-pre leading-relaxed">
                    {sajuJson}
                  </pre>
                </div>
                <div className="p-3 rounded-xl border border-gray-800/50 bg-black/20">
                  <p className="text-[11px] text-gray-400 break-keep">
                    ✅ 사주 8글자의 <span className="text-emerald-300">오행 분포, 계절, 온도 상태</span>를 정량 데이터로 추출 완료. 이 JSON이 후속 엔진들의 입력값이 됩니다.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Engines */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="text-[10px] font-mono text-orange-500/70 mb-1 tracking-widest">STEP 2 OF 4</div>
                  <h3 className="text-lg font-bold text-orange-300">고전 규칙 엔진 독립 실행</h3>
                  <p className="text-xs text-gray-400 mt-1">3개 고전의 로직이 각각 독립적으로 가중치를 계산</p>
                </div>
                <div className="space-y-4">
                  {engines.map((eng, i) => (
                    <motion.div
                      key={eng.engineNameEn}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="p-4 rounded-2xl border border-gray-800/50 bg-black/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{eng.icon}</span>
                        <div>
                          <div className="text-sm font-bold text-white">{eng.engineName}</div>
                          <div className="text-[9px] font-mono text-gray-500">{eng.engineNameEn} · Weight: {(eng.weight * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-500 mb-3">{eng.description}</div>
                      
                      {/* Score bars */}
                      <div className="space-y-1.5 mb-3">
                        {(Object.entries(eng.scores) as [FiveElement, number][]).map(([el, score]) => (
                          <div key={el} className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono w-4 ${ELEMENT_COLORS[el]}`}>{el}</span>
                            <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                                transition={{ delay: i * 0.2 + 0.3, duration: 0.5 }}
                                className={`h-full rounded-full ${score > 0 ? 'bg-violet-500' : 'bg-red-500'}`}
                              />
                            </div>
                            <span className={`text-[10px] font-mono w-8 text-right ${score >= 0 ? 'text-violet-400' : 'text-red-400'}`}>
                              {score > 0 ? '+' : ''}{score}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Reasoning */}
                      <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800/30">
                        <div className="text-[9px] font-mono text-gray-600 mb-1">REASONING LOG</div>
                        <pre className="text-[10px] text-gray-400 whitespace-pre-wrap leading-relaxed font-mono">
                          {eng.reasoning}
                        </pre>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: CAFE Cross-weight */}
            {step === 3 && cafeScores && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="text-[10px] font-mono text-violet-500/70 mb-1 tracking-widest">STEP 3 OF 4</div>
                  <h3 className="text-lg font-bold text-violet-300">CAFE 교차 가중 분석</h3>
                  <p className="text-xs text-gray-400 mt-1">3개 엔진 결과를 가중치로 합산하여 최종 점수 산출</p>
                </div>

                {/* Formula Display */}
                <div className="p-4 rounded-2xl border border-violet-500/20 bg-black/40">
                  <div className="text-[10px] font-mono text-violet-500/70 mb-3">CAFE FORMULA</div>
                  <div className="text-center text-[11px] text-gray-300 font-mono leading-relaxed">
                    Final[오행] = <span className="text-orange-400">(궁통보감 × 0.4)</span> + <span className="text-cyan-400">(적천수 × 0.4)</span> + <span className="text-amber-400">(자평진전 × 0.2)</span>
                  </div>
                </div>

                {/* Final Scores */}
                <div className="p-4 rounded-2xl border border-violet-500/20 bg-black/30">
                  <div className="text-[10px] font-mono text-violet-500/70 mb-4">CAFE FINAL SCORES</div>
                  <div className="space-y-3">
                    {(Object.entries(cafeScores) as [FiveElement, number][])
                      .sort((a, b) => b[1] - a[1])
                      .map(([el, score], i) => {
                        const maxScore = Math.max(...Object.values(cafeScores));
                        const pct = maxScore > 0 ? (Math.max(0, score) / maxScore) * 100 : 0;
                        const isWinner = i === 0;
                        return (
                          <motion.div
                            key={el}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className={`flex items-center gap-3 p-2 rounded-xl ${isWinner ? ELEMENT_BG[el] + ' border' : ''}`}
                          >
                            <span className={`text-base font-bold ${ELEMENT_COLORS[el]}`}>{el}</span>
                            <div className="flex-1 h-3 bg-gray-900 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: i * 0.15 + 0.2, duration: 0.8 }}
                                className={`h-full rounded-full ${isWinner ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-gray-600'}`}
                              />
                            </div>
                            <span className={`text-sm font-mono font-bold w-12 text-right ${isWinner ? ELEMENT_COLORS[el] : 'text-gray-500'}`}>
                              {score}
                            </span>
                            {isWinner && <span className="text-[9px] bg-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full font-mono">WINNER</span>}
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Final Output */}
            {step === 4 && finalOutput && (
              <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
                <div className="text-center mb-4">
                  <div className="text-[10px] font-mono text-cyan-500/70 mb-1 tracking-widest">STEP 4 OF 4 · FINAL OUTPUT</div>
                  <h3 className="text-lg font-bold text-cyan-300">명심 코드 출력</h3>
                  <p className="text-xs text-gray-400 mt-1">백엔드가 LLM에게 전달하는 최종 메타 데이터</p>
                </div>

                {/* Core Drive Result */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="p-6 rounded-3xl border border-cyan-500/30 bg-cyan-950/10 shadow-[0_0_40px_rgba(6,182,212,0.1)] text-center"
                >
                  <div className="text-4xl mb-3">{finalOutput.coreDriveEmoji}</div>
                  <div className="text-[10px] font-mono text-gray-500 mb-1 tracking-widest">PRIMARY CORE DRIVE</div>
                  <div className="text-xl font-black text-cyan-300 mb-1">{finalOutput.coreDriveName}</div>
                  <div className="text-xs text-gray-400">
                    Confidence: <span className="text-cyan-400 font-mono font-bold">{(finalOutput.confidenceScore * 100).toFixed(0)}%</span>
                    {' · '}Winner: <span className="text-violet-400 font-mono">{finalOutput.winningLogic}</span>
                  </div>
                </motion.div>

                {/* JSON Output */}
                <div className="p-4 rounded-2xl border border-gray-800/50 bg-black/40 overflow-x-auto">
                  <div className="text-[10px] font-mono text-cyan-500/70 mb-2">// LLM에게 전달되는 최종 JSON (화법 변환 입력값)</div>
                  <pre className="text-[10px] font-mono text-cyan-200/70 whitespace-pre leading-relaxed">{JSON.stringify({
                    analysis_result: {
                      primary_core_drive: finalOutput.primaryCoreDrive,
                      core_drive_name: finalOutput.coreDriveName,
                      confidence_score: finalOutput.confidenceScore,
                      winning_logic: finalOutput.winningLogic,
                      myeongsim_codes: {
                        dark_code: finalOutput.darkCode,
                        neural_code: finalOutput.neuralCode,
                        meta_code: finalOutput.metaCode,
                      }
                    }
                  }, null, 2)}</pre>
                </div>

                {/* Code Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'DARK CODE', code: finalOutput.darkCode, color: 'text-red-400 border-red-500/20 bg-red-950/10', desc: '무의식 패턴' },
                    { label: 'NEURAL CODE', code: finalOutput.neuralCode, color: 'text-violet-400 border-violet-500/20 bg-violet-950/10', desc: '인지행동 자원' },
                    { label: 'META CODE', code: finalOutput.metaCode, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/10', desc: '메타인지 활성화' },
                  ].map(c => (
                    <div key={c.label} className={`p-3 rounded-xl border ${c.color} text-center`}>
                      <div className="text-[8px] font-mono text-gray-500 mb-1">{c.label}</div>
                      <div className={`text-[10px] font-mono font-bold ${c.color.split(' ')[0]}`}>{c.code}</div>
                      <div className="text-[8px] text-gray-600 mt-1">{c.desc}</div>
                    </div>
                  ))}
                </div>

                {/* LLM Role Clarification */}
                <div className="p-4 rounded-2xl border border-amber-500/15 bg-amber-950/10">
                  <div className="text-[10px] font-mono text-amber-500/70 mb-2 tracking-wider">💡 LLM의 역할</div>
                  <p className="text-[11px] text-gray-400 leading-relaxed break-keep">
                    LLM(Gemini)은 위 JSON 코드만 받습니다. 고전 문헌을 직접 읽지 않습니다.<br />
                    <span className="text-amber-300 font-bold">LLM의 유일한 임무:</span> <code className="text-[10px] bg-gray-900 px-1 py-0.5 rounded text-cyan-300">{finalOutput.neuralCode}</code>를 명심코칭의 따뜻한 화법으로 변환하여 내담자에게 전달.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Control Button */}
          <div className="mt-8 flex justify-center gap-3">
            {step < 4 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={advanceStep}
                disabled={isProcessing}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    처리 중...
                  </span>
                ) : (
                  step === 0 ? '🚀 파이프라인 시작' : `➡️ ${STEP_INFO[step + 1]?.title || '다음 단계'}`
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={resetPipeline}
                className="px-8 py-3 rounded-xl border border-gray-700 text-gray-300 font-bold text-sm hover:bg-gray-900/50 transition-all"
              >
                🔄 처음부터 다시
              </motion.button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 border-t border-gray-800/50 bg-[#070A12]/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto text-center text-[10px] text-gray-600 font-mono tracking-widest">
          MYEONGSIM_CAFE_PIPELINE // TECH DEMO v1.0
        </div>
      </footer>
    </div>
  );
}
