'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  ChevronRight, 
  Eye, 
  RefreshCw, 
  Layers, 
  Activity,
  Heart,
  Brain,
  Compass,
  ArrowRight,
  Sparkle,
  HelpCircle
} from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

interface MirrorAwarenessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
}

interface DispersingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

interface AwarenessReport {
  title: string;
  emptinessContemplation: string;
  trueSelfNature: string;
  dailyAwarenessAnchor: string[];
  soulQuote: string;
}

export default function MirrorAwarenessModal({ isOpen, onClose, userProfile }: MirrorAwarenessModalProps) {
  const { reportData } = useReportStore();
  const [step, setStep] = useState(1); // 1~4: 객체 해체, 5: 참나 자각, 6: AI 리포트
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AwarenessReport | null>(null);

  // 각 단계별 입력값
  const [bodyText, setBodyText] = useState('');
  const [thoughtText, setThoughtText] = useState('');
  const [emotionText, setEmotionText] = useState('');
  const [sensationText, setSensationText] = useState('');

  // 텍스트 흩뿌리기 애니메이션 상태
  const [isDispersing, setIsDispersing] = useState(false);
  const [dispersingWords, setDispersingWords] = useState<DispersingWord[]>([]);

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBodyText('');
      setThoughtText('');
      setEmotionText('');
      setSensationText('');
      setReport(null);
      setIsLoading(false);
      setIsDispersing(false);
      setDispersingWords([]);
    }
  }, [isOpen]);

  const userName = userProfile?.userName || reportData?.userName || '명심가';

  // 사주 정보 포맷팅
  const getSajuPillars = () => {
    const saju = reportData?.saju as any;
    if (!saju) return null;
    
    const fp = saju.fourPillars;
    if (fp) {
      return {
        year: fp.year ? `${fp.year.gan || ''}${fp.year.ji || ''}` : '',
        month: fp.month ? `${fp.month.gan || ''}${fp.month.ji || ''}` : '',
        day: fp.day ? `${fp.day.gan || ''}${fp.day.ji || ''}` : '',
        hour: fp.time ? `${fp.time.gan || ''}${fp.time.ji || ''}` : (fp.hour ? `${fp.hour.gan || ''}${fp.hour.ji || ''}` : ''),
      };
    }
    return null;
  };

  // 텍스트를 단어별로 흩뿌리며 비워내는 애니메이션 로직
  const handleDisperse = (text: string) => {
    if (!text.trim()) {
      // 텍스트가 없을 경우 애니메이션 없이 바로 다음 단계로
      setStep((prev) => prev + 1);
      return;
    }

    const words = text.split(/\s+/);
    const mapped: DispersingWord[] = words.map((word, idx) => ({
      id: idx,
      word,
      // 랜덤 방향 및 거리 설정
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500 - 150, // 살짝 위쪽으로 튀게
      rotate: (Math.random() - 0.5) * 360,
      scale: 0.3 + Math.random() * 0.8
    }));

    setDispersingWords(mapped);
    setIsDispersing(true);

    // 1.8초 동안 애니메이션 보여준 후 다음 단계로
    setTimeout(() => {
      setIsDispersing(false);
      setDispersingWords([]);
      setStep((prev) => prev + 1);
    }, 1800);
  };

  // AI 리포트 생성 요청
  const handleFetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coaching/mirror-awareness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          sajuPillars: getSajuPillars(),
          bodyInput: bodyText,
          thoughtInput: thoughtText,
          emotionInput: emotionText,
          sensationInput: sensationText
        })
      });
      const result = await res.json();
      if (result.success && result.data) {
        setReport(result.data);
        setStep(6);
      } else {
        throw new Error('API Response Error');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setReport({
        title: '순수 주체 자각 리포트',
        emptinessContemplation: '당신이 비워낸 몸의 피로, 어지러운 생각, 격동하는 감정과 미세한 오감의 자극은 모두 당신이라는 고요하고 투명한 바다 위에 이는 물방울들이었습니다. 이를 기꺼이 마주하고 지워나간 당신의 솔직한 자각이 내면에 깊고 맑은 평화를 채워 줍니다.',
        trueSelfNature: '세상이 아무리 거칠게 변해도, 어두운 방에서 밤이 깊어가도 당신이라는 주체의 빛은 늘 이대로 선명히 빛납니다. 당신의 주체 의식은 맑게 흐르는 강물처럼 유연하면서도, 단단한 흙처럼 흔들림 없이 고요하고 완전합니다.',
        dailyAwarenessAnchor: [
          '불안이나 조급함이 밀려올 때 5초간 침묵하며 "내 생각과 감정은 내가 관찰하고 있는 대상일 뿐이다"라고 세 번 속삭여 보세요.',
          '아침에 세수할 때 물소리에 온전히 깨어 있으면서, 그 물소리를 듣고 있는 "변하지 않는 내 안의 관찰자"의 존재를 가만히 자각해 봅니다.'
        ],
        soulQuote: '구름이 아무리 짙어도 하늘을 찢을 수 없듯, 그 어떤 객체와 대상도 고요한 당신의 참나를 흔들 수 없습니다.'
      });
      setStep(6);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // 단계별 텍스트 및 정보
  const stepInfo = [
    {
      title: '1단계: 몸(Body)의 해체',
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      question: '지금 느껴지는 당신의 몸, 나이 들면 변하고 깊이 잠들면 사라질 이 육체가 과연 영원한 "나"일까요? 아니면 잠시 빌려 입은 옷일까요?',
      tip: '피곤함, 긴장감 등 현재 몸에서 느끼는 모든 감각과 집착을 적어보세요. 그리고 이 몸을 바라보는 진정한 "나"를 상기해 보세요.',
      placeholder: '예: 요즘 허리가 뻐근하고 무겁습니다. 늘 젊고 건강할 것만 같았던 이 몸도 시시각각 변화하고 있음을 느낍니다.',
      value: bodyText,
      setValue: setBodyText
    },
    {
      title: '2단계: 생각(Thoughts)의 해체',
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      question: '머릿속을 쉴 새 없이 스쳐 지나가는 무수한 생각들... 이 생각들은 과연 진짜 "나"일까요? 아니면 잠시 일어났다 사라지는 구름일까요?',
      tip: '지금 떠오르는 고민, 내일 걱정, 혹은 소음 같은 잡념들을 있는 그대로 타이핑해 보세요. 적어놓고 거울 밖 객체로 바라봅니다.',
      placeholder: '예: 내일 할 일이 제대로 끝날까 걱정됩니다. 머릿속이 계획과 후회로 가득 차 있어서 어지럽습니다.',
      value: thoughtText,
      setValue: setThoughtText
    },
    {
      title: '3단계: 감정(Emotions)의 해체',
      icon: <Heart className="w-6 h-6 text-rose-400" />,
      question: '기쁨도, 슬픔도, 불안함도 계절처럼 왔다 가는 날씨일 뿐입니다. 지금 당신의 마음 날씨는 어떤가요? 이 감정이 당신 자신인가요?',
      tip: '현재 마음속에 차오른 감정의 이름을 붙여 적어보세요. 그리고 물결처럼 잔잔하게 흘려보낼 준비를 합니다.',
      placeholder: '예: 최근의 일로 가슴 한구석이 조금 답답하고 불안합니다. 잘해내고 싶은 마음에 긴장감이 느껴집니다.',
      value: emotionText,
      setValue: setEmotionText
    },
    {
      title: '4단계: 느낌과 감각(Sensations)의 해체',
      icon: <Compass className="w-6 h-6 text-cyan-400" />,
      question: '주변의 소음, 피부에 닿는 촉감, 방 안의 공기... 이 모든 감각 대상을 "알아차리는" 조용한 관찰 공간이 당신 내면에 존재합니다.',
      tip: '지금 귀에 들리는 아주 작은 소리나 호흡의 느낌을 적어보세요. 그 모든 느낌은 스쳐 가는 자극일 뿐입니다.',
      placeholder: '예: 모니터의 조용한 팬 소리가 들리고, 방 안의 약간 차가운 공기가 손끝에 닿는 느낌이 듭니다.',
      value: sensationText,
      setValue: setSensationText
    }
  ];

  const currentStepData = stepInfo[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* 몽환적인 아우라 조명 효과 */}
      <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 메인 모달 윈도우 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-[500px] bg-slate-900/90 border border-slate-700/40 rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-2xl overflow-hidden text-slate-100 flex flex-col min-h-[550px] justify-between"
      >
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪞</span>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-200 via-emerald-200 to-purple-200 bg-clip-text text-transparent">
                알아차림의 거울
              </h2>
              <p className="text-[11px] text-slate-400">참나 자각 & 객체 해체 코칭</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30 hover:border-slate-600 rounded-full transition-all duration-250 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* 메인 내용 영역 */}
        <div className="flex-1 flex flex-col justify-center">
          
          {/* 1) 텍스트 흩뿌리기 애니메이션 상태 */}
          <AnimatePresence>
            {isDispersing && (
              <div className="relative flex-1 flex items-center justify-center min-h-[250px] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center flex-wrap max-w-[350px] text-center gap-2 px-6">
                  {dispersingWords.map((item) => (
                    <motion.span
                      key={item.id}
                      initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                      animate={{ 
                        opacity: 0, 
                        scale: item.scale, 
                        x: item.x, 
                        y: item.y, 
                        rotate: item.rotate 
                      }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="inline-block text-sm md:text-base font-medium text-emerald-300/85 bg-slate-800/30 px-2 py-1 rounded border border-emerald-500/10 backdrop-blur-xs"
                    >
                      {item.word}
                    </motion.span>
                  ))}
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 0], y: [20, 0, -20] }}
                  transition={{ duration: 1.5, times: [0, 0.4, 1] }}
                  className="absolute bottom-4 flex items-center gap-1.5 text-xs text-emerald-400/80 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>내려놓고 비워내는 중...</span>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 2) 로딩 화면 */}
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">🪞</span>
              </div>
              <p className="text-sm font-semibold bg-gradient-to-r from-emerald-300 to-purple-300 bg-clip-text text-transparent mb-2">
                참나의 자각 리포트 발급 중
              </p>
              <p className="text-xs text-slate-400 animate-pulse px-6">
                당신의 깊은 침묵 속으로 들어갑니다.<br />
                모든 대상을 비워내고 참나의 빛을 밝히는 중입니다...
              </p>
            </div>
          )}

          {/* 3) 단계별 설문 진행화면 (1~4단계) */}
          {!isDispersing && !isLoading && step <= 4 && currentStepData && (
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-grow flex flex-col justify-between"
            >
              {/* 상단 프로그레스 바 */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5 text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    {currentStepData.icon}
                    {currentStepData.title}
                  </span>
                  <span>{step} / 5</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-purple-500 transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* 질문과 안내문 */}
              <div className="mb-5 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/30 backdrop-blur-xs">
                <h3 className="text-sm md:text-base font-bold leading-relaxed mb-2 text-slate-200">
                  {currentStepData.question}
                </h3>
                <p className="text-[11px] text-slate-400 leading-normal flex items-start gap-1">
                  <HelpCircle className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{currentStepData.tip}</span>
                </p>
              </div>

              {/* 입력란 */}
              <div className="relative mb-6">
                <textarea
                  value={currentStepData.value}
                  onChange={(e) => currentStepData.setValue(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="w-full h-[120px] bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl p-4 text-xs leading-relaxed text-slate-100 placeholder-slate-600 outline-none resize-none transition-all duration-200"
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-medium">
                  {currentStepData.value.length}자
                </span>
              </div>

              {/* 하단 버튼 */}
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/30 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                  >
                    이전 단계
                  </button>
                )}
                <button
                  onClick={() => handleDisperse(currentStepData.value)}
                  className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-2xl text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
                >
                  <span>비워내기 (해체)</span>
                  <ChevronRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 4) 5단계: 참나 자각 확인 단계 */}
          {!isDispersing && !isLoading && step === 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-grow flex flex-col justify-between"
            >
              {/* 상단 프로그레스 바 */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5 text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkle className="w-6 h-6 text-purple-400 animate-pulse" />
                    5단계: 순수 주체(참나)의 자각
                  </span>
                  <span>5 / 5</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-purple-500 w-full" />
                </div>
              </div>

              {/* 5단계 메시지 설명 */}
              <div className="my-3 space-y-3.5 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
                  <span>✨ 자각의 순간</span>
                </div>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                  몸도 자면 사라지고 나이 들면 변하지만,<br />
                  그 변화를 아는 <span className="text-emerald-300 font-bold">"나(의식 주체)"</span>는 늘 고요하게 이대로 존재합니다.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  꿈을 꿀 때조차 의식이 없다고 여기지만, 깨어난 뒤 "내가 푹 잤구나" 혹은 "꿈을 꾸었구나" 하고 알아차리는 거울 같은 앎은 변한 적이 없습니다. 
                  당신이 비워낸 모든 객체(몸, 생각, 감정, 느낌)를 가만히 비추고 있는 변치 않는 자각 공간을 느껴보세요.
                </p>
              </div>

              {/* 하단 버튼 */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/30 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                >
                  이전 단계
                </button>
                <button
                  onClick={handleFetchReport}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-2xl text-xs font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-white" />
                  <span>참나 자각 리포트 받기</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* 5) 6단계: AI 리포트 결과 렌더링 (오라클 카드 형식) */}
          {!isDispersing && !isLoading && step === 6 && report && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow flex flex-col"
            >
              {/* 자각 리포트 오라클 카드 비주얼 */}
              <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/20 rounded-[2rem] p-5 md:p-6 shadow-2xl overflow-hidden mb-6 flex-1 flex flex-col justify-between">
                
                {/* 오라클 광원 */}
                <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-purple-500/5 rounded-full blur-[40px] pointer-events-none" />
                
                {/* 카드 테두리 코너 골드 포인트 */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500/40" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500/40" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500/40" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500/40" />

                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 border border-amber-500/30 rounded-full px-2.5 py-0.5 bg-amber-500/5 uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Pure Consciousness</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center justify-center gap-1">
                    👑 {userName}님의 {report.title}
                  </h3>
                </div>

                {/* 리포트 파트 상세 */}
                <div className="space-y-4 text-left overflow-y-auto max-h-[280px] pr-1.5 scrollbar-thin">
                  
                  {/* 비움 성찰 */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mb-1">
                      🌱 비워낸 자리에 남은 평화
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {report.emptinessContemplation}
                    </p>
                  </div>

                  {/* 순수 본질 */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1 mb-1">
                      🪞 변하지 않는 본질 (참나)
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {report.trueSelfNature}
                    </p>
                  </div>

                  {/* 일상 자각 앵커 */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1 mb-1.5">
                      💡 일상 속 자각 앵커링
                    </span>
                    <ul className="space-y-1.5">
                      {report.dailyAwarenessAnchor.map((anchor, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 leading-relaxed flex items-start gap-1">
                          <span className="text-cyan-400/80 font-bold shrink-0 mt-0.5">{idx + 1}.</span>
                          <span>{anchor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 명심 한 구절 */}
                <div className="mt-4 pt-3.5 border-t border-slate-800/60 text-center">
                  <p className="text-xs italic text-amber-200/90 font-medium px-4 leading-relaxed">
                    "{report.soulQuote}"
                  </p>
                </div>

              </div>

              {/* 하단 제어 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/30 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span>다시 성찰하기</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-gradient-to-r from-slate-200 to-slate-100 hover:from-white hover:to-white text-slate-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer"
                >
                  <span>자각 마음에 새기기</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
