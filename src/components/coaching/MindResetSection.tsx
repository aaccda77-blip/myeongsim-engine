'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Bug, Scan, Eye, Sparkles, Brain, Activity, Shield, RotateCcw, X } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

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

interface TroubleCard {
  title: string;
  desc: string;
  text: string;
}

// 🌿 사주 8자(5대 역량 스탯 + 일간) 종합 분석 1:1 고민 템플릿 생성 헬퍼
const getTroubleCards = (reportData: any): TroubleCard[] => {
  if (!reportData) {
    return [
      {
        title: "🌌 불확실한 미래",
        desc: "미래에 대한 불안 때문에 가슴이 답답하고 잠을 설쳐요.",
        text: "미래에 대한 불확실성 때문에 가슴이 답답하고 불안해서 자꾸만 조급해지고 잠을 설쳐요."
      },
      {
        title: "🤝 관계 속의 외로움",
        desc: "사람들 사이에서 겉돌거나 고립되는 느낌이 들고 눈치가 보여요.",
        text: "주변 사람들과의 관계 속에서 끊임없이 오해를 사거나 겉돌고 눈치를 보느라 마음이 피곤해요."
      },
      {
        title: "👣 나아갈 길의 모호함",
        desc: "내가 가고 있는 길이 맞는지 회의감이 들고 무기력해요.",
        text: "내가 열심히 가고 있는 이 길이 정말 맞는지 확신이 서지 않아 매 순간이 무기력하고 회의감이 들어요."
      }
    ];
  }

  const { stats, saju } = reportData;
  const dayMaster = saju?.dayMaster || '';

  // 5대 스탯 중 최댓값 찾기
  const statsList = [
    { key: 'empathy', value: stats?.empathy || 0, label: '공감 과부하' },
    { key: 'leadership', value: stats?.leadership || 0, label: '리더십 강박' },
    { key: 'creativity', value: stats?.creativity || 0, label: '생각 과잉' },
    { key: 'wealth', value: stats?.wealth || 0, label: '결과 초조' },
    { key: 'execution', value: stats?.execution || 0, label: '완벽주의/자책' }
  ];
  statsList.sort((a, b) => b.value - a.value);
  const topStat = statsList[0];

  const cards: TroubleCard[] = [];

  // 1. 최상위 스탯 기반 고민 추천 (2개 추출)
  if (topStat.key === 'empathy') {
    cards.push({
      title: "❤️ 공감 과부하",
      desc: "타인의 부정적인 감정에 너무 쉽게 휩쓸려 내 에너지가 방전돼요.",
      text: "주변 사람들의 슬픔이나 짜증 같은 부정적인 감정을 귀신같이 흡수하느라 내 마음이 텅 비고 지쳐버렸어요."
    });
    cards.push({
      title: "🎭 타인의 시선",
      desc: "모두를 실망시키지 않으려 눈치 보며 가면을 쓰느라 피곤해요.",
      text: "타인의 기대와 눈치를 보며 항상 다정하고 온화한 가면을 쓰느라 정작 내 진짜 감정은 억누르고 외로워요."
    });
  } else if (topStat.key === 'leadership') {
    cards.push({
      title: "👑 완벽한 책임감",
      desc: "모든 상황을 혼자 짊어지고 이끌어야 한다는 강박에 짓눌려요.",
      text: "내가 모든 것을 다 완벽하게 책임지고 리드해야 한다는 강박 때문에 남에게 의지하지도 못하고 외롭게 번아웃이 왔어요."
    });
    cards.push({
      title: "🛡️ 통제력 상실 두려움",
      desc: "상황이 내 통제를 벗어날 때 심장이 뛰고 극도로 불안해져요.",
      text: "상황이나 결과가 내 예상과 통제를 벗어나는 순간, 엄청난 패배감이 들고 실패한 것 같아 심장 밑바닥이 불안해져요."
    });
  } else if (topStat.key === 'creativity') {
    cards.push({
      title: "💭 생각의 늪 (과잉)",
      desc: "생각이 꼬리에 꼬리를 물고 이어져 머릿속이 터질 것 같아요.",
      text: "조용히 잠들고 싶은데도 머릿속에서 수많은 생각과 최악의 시나리오가 끊임없이 재생되어 뇌가 쉬지 못하고 지쳐있어요."
    });
    cards.push({
      title: "⏳ 시작의 두려움",
      desc: "생각만 하다가 행동으로 옮기지 못하고 시간만 흐르는 게 겁나요.",
      text: "머릿속으로 수백 번 시뮬레이션을 돌리며 완벽을 기하지만 정작 실행으로 첫 발을 떼는 것이 두렵고 시작조차 무기력해요."
    });
  } else if (topStat.key === 'wealth') {
    cards.push({
      title: "📈 결과와 결실 강박",
      desc: "눈에 보이는 뚜렷한 성과가 즉시 나오지 않으면 극도로 초조해요.",
      text: "열심히 공들였는데도 당장 손에 잡히는 수치적인 성과나 보상이 따라오지 않아 내 가치까지 전부 쓸모없게 느껴지고 조급해요."
    });
    cards.push({
      title: "🏃 뒤처지는 두려움",
      desc: "동료들보다 낙오되거나 뒤처지는 것 같아 매 순간 쫓기는 기분이에요.",
      text: "나만 제자리에 고여있고 다른 사람들은 저 멀리 앞서가는 것 같아, 숨 가쁘게 달리면서도 한편으론 늘 뒤처질까 봐 불안해요."
    });
  } else { // execution
    cards.push({
      title: "🔍 극단적 완벽주의",
      desc: "사소한 실수나 부족함도 용납할 수 없어 나를 끊임없이 채찍질해요.",
      text: "아주 조그마한 실수나 흠집 하나에도 억장이 무너져 내리고, 내 자신에게 가혹할 정도로 비판적인 잣대를 들이대며 질책해요."
    });
    cards.push({
      title: "⛓️ 굳어버린 긴장감",
      desc: "실수하면 모든 게 망가질 것 같은 공포에 온몸이 뻣뻣하게 굳어요.",
      text: "한 번의 실수가 도미노처럼 내 모든 평판과 미래를 무너뜨릴 것 같다는 공포심에 가슴이 굳고 편안하게 쉴 수가 없어요."
    });
  }

  // 2. 사주 일간(Day Master) 기반 기질형 고민 추천 (1개 추가)
  const ganMap: Record<string, { title: string; desc: string; text: string }> = {
    '甲': {
      title: "🌳 甲木(갑목)의 강박",
      desc: "가장 든든한 나무가 되어야 한다는 생각에 약점을 감추고 버텨요.",
      text: "하늘을 향해 곧게 뻗은 아름다운 나무처럼 늘 단단하고 흔들림 없어야 한다는 부담에 내 유약한 상처를 털어놓지 못하고 굳어가고 있어요."
    },
    '乙': {
      title: "🌱 乙木(을목)의 소진",
      desc: "바람에 흔들리며 남들의 장단에 맞춰주느라 에너지가 방전됐어요.",
      text: "갈등을 만들지 않고 유연하게 주변 조화를 지키느라 정작 내가 진정으로 원하고 외치는 내면의 소리는 외면당한 채 속앓이를 하고 있어요."
    },
    '丙': {
      title: "☀️ 丙火(병화)의 가면",
      desc: "항상 태양처럼 밝고 찬란한 모습만 보여줘야 해서 눈물이 나요.",
      text: "남들에게는 항상 늘 긍정적이고 화사한 에너지만 나눠주어야 한다는 압박감에, 내 깊은 어둠과 우울을 감춘 채 외롭게 썩어가고 있어요."
    },
    '丁': {
      title: "🕯️ 丁火(정화)의 서운함",
      desc: "따뜻하게 챙겨주면서도 혼자 서운함을 삼키고 곱씹게 돼요.",
      text: "촛불처럼 나를 녹여 남들을 보살펴 주면서도 정작 나는 누구에게도 따뜻하게 품어지지 못하는 것 같아 가슴 깊은 곳에서 서운함과 서글픔이 밀려와요."
    },
    '戊': {
      title: "⛰️ 戊土(무토)의 고독",
      desc: "거대한 산처럼 흔들림 없어야 해서 어떤 아픔도 털어놓지 못해요.",
      text: "다들 나를 믿음직한 산으로 보기에 어떤 짐을 지고 있어도 든든하게 웃어야만 해서, 외롭게 내 눈물을 땅 깊은 곳에 묻어두고 속을 썩이고 있어요."
    },
    '己': {
      title: "🌾 己土(기토)의 피로",
      desc: "타인의 징징거림을 다 수용해주다 정작 내 밭이 황폐해졌어요.",
      text: "남들의 투정과 상처받은 마음을 다정하게 감싸안고 치유해 주었지만, 이제는 과부하가 걸려 내 마음 밭이 완전히 황폐화되고 메말라 버렸어요."
    },
    '庚': {
      title: "⚔️ 庚金(경금)의 단단함",
      desc: "강인한 철벽을 두르고 홀로 외로운 싸움을 하며 단단히 굳었어요.",
      text: "상처받거나 흔들리지 않기 위해 내 주위에 날카롭고 굳건한 바위 성벽을 쌓아 올렸는데, 결국 아무도 다가오지 않는 감옥이 되어 외로워요."
    },
    '辛': {
      title: "💎 辛金(신금)의 예민함",
      desc: "실수 한 번에 낙오될 것 같은 두려움에 날카로운 날이 서 있어요.",
      text: "다이아몬드처럼 가장 완벽하게 반짝여야 한다는 공포에 사소한 흠집 하나에도 온몸이 난도질당하는 기분이며 날카롭게 날이 서 피곤해요."
    },
    '壬': {
      title: "🌊 壬水(임수)의 침잠",
      desc: "바다 같은 감정의 깊은 바닥에 잠겨 우울의 파도에 허우적대요.",
      text: "끝을 알 수 없는 무거운 상념의 바다 깊은 곳으로 한없이 가라앉는 기분이며, 미래에 대한 아득한 두려움이 거센 파도처럼 밀려옵니다."
    },
    '癸': {
      title: "☔ 癸水(계수)의 눈치",
      desc: "단비처럼 스며들려다 나조차 희미해져 관계 속에 전전긍긍해요.",
      text: "타인의 기분과 마음 날씨에 내 존재를 안개처럼 맞춰주다 보니 나 자신이 다 증발해버린 것 같고 쓸모없는 메아리가 된 것 같아 서글퍼요."
    }
  };

  const masterGan = dayMaster ? dayMaster.trim() : '';
  if (ganMap[masterGan]) {
    cards.push(ganMap[masterGan]);
  } else {
    cards.push({
      title: "🌌 불확실한 미래",
      desc: "미래에 대한 불안 때문에 가슴이 답답하고 잠을 설쳐요.",
      text: "미래에 대한 불확실성 때문에 가슴이 답답하고 불안해서 자꾸만 조급해지고 잠을 설쳐요."
    });
  }

  // 3. 3개 보장
  const defaultList = [
    {
      title: "🤝 관계 속의 외로움",
      desc: "사람들 사이에서 겉돌거나 고립되는 느낌이 들고 눈치가 보여요.",
      text: "주변 사람들과의 관계 속에서 끊임없이 오해를 사거나 겉돌고 눈치를 보느라 마음이 피곤해요."
    },
    {
      title: "👣 나아갈 길의 모호함",
      desc: "내가 가고 있는 길이 맞는지 회의감이 들고 무기력해요.",
      text: "내가 열심히 가고 있는 이 길이 정말 맞는지 확신이 서지 않아 매 순간이 무기력하고 회의감이 들어요."
    }
  ];

  let defaultIdx = 0;
  while (cards.length < 3 && defaultIdx < defaultList.length) {
    cards.push(defaultList[defaultIdx]);
    defaultIdx++;
  }

  return cards.slice(0, 3);
};

export default function MindResetSection() {
  const { reportData } = useReportStore();
  const [phase, setPhase] = useState<'INPUT' | 'SCANNING' | 'SCROLL' | 'ZERO_POINT'>('INPUT');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // 💡 드래그 문장 AI 해설 상태 및 이벤트
  const [selectedText, setSelectedText] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [showExplainModal, setShowExplainModal] = useState(false);

  // 전역 마우스 클릭 시 툴팁을 닫는 정비
  useEffect(() => {
    const clearSelection = () => {
      setShowTooltip(false);
    };
    document.addEventListener('mousedown', clearSelection);
    return () => document.removeEventListener('mousedown', clearSelection);
  }, []);

  const handleTextSelection = (e: React.MouseEvent | React.TouchEvent) => {
    const selection = window.getSelection();
    if (!selection) return;
    const text = selection.toString().trim();

    if (text.length > 3 && text.length < 150) { // 너무 짧거나 길지 않은 텍스트만 감지
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const parentElement = e.currentTarget.getBoundingClientRect();
      
      setTooltipPos({
        x: rect.left - parentElement.left + (rect.width / 2),
        y: rect.top - parentElement.top - 45 // 45px 위에 띄움
      });
      setSelectedText(text);
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

  const requestSentenceExplanation = async () => {
    if (!selectedText) return;
    setShowTooltip(false);
    setIsLoadingExplanation(true);
    setShowExplainModal(true);
    setActiveExplanation(null);

    try {
      const res = await fetch('/api/coaching/explain-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: selectedText })
      });
      const result = await res.json();
      if (result.success && result.explanation) {
        setActiveExplanation(result.explanation);
      } else {
        setActiveExplanation("마음의 주파수가 잠시 엇갈렸나 봐요. 문장을 조금만 다르게 드래그하여 다시 물어봐 주시면 정성껏 해설해 드릴게요. ✨");
      }
    } catch (error) {
      console.error(error);
      setActiveExplanation("지혜의 통로가 잠시 먹통이 되었어요. 다시 한번 편안하게 시도해 주세요. 🌌");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

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
            className="absolute inset-0 flex flex-col items-center justify-start sm:justify-center p-6 bg-black overflow-y-auto scrollbar-hide"
          >
            <div className="w-full max-w-md py-4 flex flex-col items-center">
              <Terminal className="w-8 h-8 text-cyan-500 mb-4 animate-pulse shrink-0" />
              <p className="text-cyan-400 font-mono text-xs sm:text-sm mb-6 typing-effect shrink-0 text-center">
                &gt; 당신을 무력하게 만드는 생각이나 감정을 입력해 주세요_
              </p>
              <form onSubmit={handleInputSubmit} className="w-full flex flex-col gap-3 shrink-0">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="예: 남을 돕고 싶은데 능력이 안 돼서 서글퍼요."
                  className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-xl px-5 py-4 text-cyan-50 text-sm focus:outline-none focus:border-cyan-500/80 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.1)] focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  autoFocus
                />
                
                {/* 🌿 사주 8자 종합 분석 고민 카드 덱 (초보자용 가이드 - 100% 상시 오픈으로 최강의 신뢰성 보장) */}
                <div className="mt-2 space-y-2 w-full">
                  <p className="text-[11px] text-cyan-500/80 flex items-center gap-1.5 font-bold ml-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    {reportData ? "당신의 년월일시 사주 종합 분석에 어울리는 추천 고민" : "초보자를 위한 추천 고민 선택지"}
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                    {getTroubleCards(reportData).map((card, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.01, borderColor: 'rgba(6,182,212,0.4)' }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setInputValue(card.text)}
                        className={`cursor-pointer text-left p-3.5 rounded-xl border border-cyan-950/40 bg-slate-950/80 backdrop-blur-md transition-all ${
                          inputValue === card.text
                            ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-cyan-950/20'
                            : 'hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-cyan-300">{card.title}</span>
                          {inputValue === card.text && (
                            <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">선택됨</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400/90 leading-relaxed break-keep">{card.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full mt-2 bg-cyan-950/40 border border-cyan-800 text-cyan-400 font-mono text-xs py-4 rounded-xl hover:bg-cyan-900/60 transition-all disabled:opacity-30 flex items-center justify-center gap-1.5"
                >
                  <Scan className="w-4 h-4" />
                  [ ENTER : 마음 디버깅 스캔 시작 ]
                </button>
              </form>
            </div>
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
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
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

      {/* 💡 드래그 영역 위에 뜰 영롱한 툴팁 */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onMouseDown={(e) => e.stopPropagation()} // 툴팁 클릭 시 mousedown 버블링으로 닫히는 현상 완벽 방어!
            style={{ top: tooltipPos.y, left: tooltipPos.x, transform: 'translateX(-50%)' }}
            className="absolute z-[5000] cursor-pointer"
          >
            <button
              onClick={requestSentenceExplanation}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 border border-cyan-400/50 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              이 문장 쉽게 해설받기 💡
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌌 AI 드래그 문장 해설 오버레이 글래스모피즘 모달 */}
      <AnimatePresence>
        {showExplainModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowExplainModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-slate-900/95 border border-cyan-500/20 rounded-[2rem] p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-cyan-900/20 blur-[80px] rounded-full animate-pulse" />
              </div>

              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3 relative z-10">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-wider uppercase">Myeongsim AI Text Interpreter</span>
                </div>
                <button
                  onClick={() => setShowExplainModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 bg-white/5 backdrop-blur-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mb-5 relative z-10">
                <p className="text-[10px] text-slate-500 font-bold mb-1.5">내가 선택한 문장</p>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 text-xs text-slate-300 italic leading-relaxed break-keep">
                  "{selectedText}"
                </div>
              </div>

              <div className="relative z-10 min-h-[140px] flex flex-col justify-center">
                {isLoadingExplanation ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-cyan-400 text-xs font-mono animate-pulse">인공지능이 문장에 숨겨진 우주적 사랑을 해석하고 있어요...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-cyan-400 font-bold mb-2">🌿 다정한 명심 해설 풀이</p>
                    <p className="text-[13px] text-slate-200 leading-relaxed font-medium break-keep whitespace-pre-wrap">
                      {activeExplanation}
                    </p>
                  </div>
                )}
              </div>

              {!isLoadingExplanation && (
                <button
                  onClick={() => setShowExplainModal(false)}
                  className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs py-4 rounded-xl shadow-lg transition-all relative z-10"
                >
                  네, 따뜻한 위로와 지혜를 안고 갑니다 ✨
                </button>
              )}
            </motion.div>
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
