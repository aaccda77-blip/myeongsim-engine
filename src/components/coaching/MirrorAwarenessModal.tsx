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
  HelpCircle,
  Award,
  BookOpen,
  Check,
  ChevronLeft
} from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { BODY_DECONSTRUCTION_108, DeconstructionQuestion } from '@/data/bodyDeconstruction108';

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
  
  // 모드 관리: 'selection' (코스 선택), '5steps' (기존 5단계), '108steps' (신규 108단계), 'result' (결과 리포트)
  const [activeMode, setActiveMode] = useState<'selection' | '5steps' | '108steps' | 'result'>('selection');
  
  // 공통 로딩 및 리포트 결과 상태
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AwarenessReport | null>(null);

  // --- 코스 A: 5단계 기존 상태 ---
  const [step5Course, setStep5Course] = useState(1); // 1~5단계
  const [bodyText, setBodyText] = useState('');
  const [thoughtText, setThoughtText] = useState('');
  const [emotionText, setEmotionText] = useState('');
  const [sensationText, setSensationText] = useState('');
  const [isDispersing, setIsDispersing] = useState(false);
  const [dispersingWords, setDispersingWords] = useState<DispersingWord[]>([]);

  // --- 코스 B: 108단계 상태 ---
  const [step108, setStep108] = useState(1); // 1~108단계
  const [meditationInput, setMeditationInput] = useState(''); // 한 줄 묵상 인풋
  const [userMeds, setUserMeds] = useState<{ [key: number]: string }>({}); // 각 단계별 적은 묵상 메모리
  const [lastSavedStep, setLastSavedStep] = useState(1); // 중간 저장 스텝

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setActiveMode('selection');
      setStep5Course(1);
      setStep108(1);
      setBodyText('');
      setThoughtText('');
      setEmotionText('');
      setSensationText('');
      setMeditationInput('');
      setUserMeds({});
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

  // --- 코스 A: 5단계 텍스트 흩뿌리기 ---
  const handleDisperse = (text: string) => {
    if (!text.trim()) {
      setStep5Course((prev) => prev + 1);
      return;
    }

    const words = text.split(/\s+/);
    const mapped: DispersingWord[] = words.map((word, idx) => ({
      id: idx,
      word,
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500 - 150,
      rotate: (Math.random() - 0.5) * 360,
      scale: 0.3 + Math.random() * 0.8
    }));

    setDispersingWords(mapped);
    setIsDispersing(true);

    setTimeout(() => {
      setIsDispersing(false);
      setDispersingWords([]);
      setStep5Course((prev) => prev + 1);
    }, 1600);
  };

  // --- 코스 A & B: AI 리포트 생성 요청 ---
  const handleFetchReport = async (mode: '5steps' | '108steps', customStep?: number) => {
    setIsLoading(true);
    
    // 108단계 묵상 추출
    const answersText = mode === '108steps' 
      ? Object.entries(userMeds).map(([stepIdx, val]) => `[${stepIdx}단계]: ${val}`).join('\n')
      : '';

    try {
      const res = await fetch('/api/coaching/mirror-awareness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          sajuPillars: getSajuPillars(),
          mode,
          lastStep: mode === '108steps' ? (customStep || step108) : 5,
          bodyInput: mode === '5steps' ? bodyText : '',
          thoughtInput: mode === '5steps' ? thoughtText : '',
          emotionInput: mode === '5steps' ? emotionText : '',
          sensationInput: mode === '5steps' ? sensationText : '',
          '108Answers': answersText
        })
      });
      const result = await res.json();
      if (result.success && result.data) {
        setReport(result.data);
        setActiveMode('result');
      } else {
        throw new Error('API Response Error');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setReport({
        title: mode === '108steps' ? '순수 의식 각성 마스터 리포트' : '순수 주체 자각 리포트',
        emptinessContemplation: mode === '108steps'
          ? `당신은 몸이 내가 아니고 객체 대상임을 분별해내는 108가지의 문답 중 ${customStep || step108}개의 고요한 계단을 오르셨습니다. 손톱의 깎임부터 우주의 무중력까지, 내 몸이 스쳐가는 옷임을 논리적으로 확인하고 기꺼이 받아들인 당신의 맑은 묵상이 거룩합니다.`
          : '당신이 고백하신 몸의 무거움, 생각의 소란함, 감정의 출렁임, 그리고 감각의 소음들은 모두 당신 안의 넓고 고요한 호수에 일어났다 사라진 물결이었습니다. 그것들을 억지로 누르지 않고 있는 그대로 가만히 바라보고 내려놓은 당신의 용기에 따뜻한 박수를 보냅니다.',
        trueSelfNature: mode === '108steps'
          ? '신체의 노화도, 피의 흐름도, 뇌 신경의 일시적 마비도 결코 닿지 못하는 당신 안의 조용하고 투명한 관찰자. 그 관찰자는 시간과 형태를 초월한 은빛 허공처럼 맑고 깨끗하여 생명이 춤추는 배경을 이룹니다. 이것이 당신의 진짜 참나입니다.'
          : '모든 구름이 흩어진 밤하늘처럼, 당신의 본질은 늘 그곳에서 고요히 세상을 비추는 밝은 달빛과 같습니다. 나이가 들어도, 감정에 상처를 입어도, 심지어 깊은 잠에 빠져 있어도 변함없이 맑게 깨어 있는 당신이라는 찬란한 순수 의식은 결코 더럽혀지거나 닳지 않습니다.',
        dailyAwarenessAnchor: [
          '몸에서 느껴지는 통증이나 가려움을 느낄 때, 즉각 입 밖으로 "가려움이 일어났다. 나는 그것을 지켜보는 하늘이다"라고 객체 선언을 해보세요.',
          '매일 신발을 신을 때, 땅을 딛고 있는 물리적 발가락의 피로를 인지하고 그것을 넘어선 자각의 자유로움을 3초간 숨쉬어 봅니다.'
        ],
        soulQuote: '바람이 불어도 하늘은 상처 나지 않고, 파도가 쳐도 바다의 깊은 바닥은 늘 침묵합니다. 당신이 바로 그 하늘이자 바다입니다.'
      });
      setActiveMode('result');
    } finally {
      setIsLoading(false);
    }
  };

  // --- 코스 B: 108단계 제어 함수 ---
  const handle108Next = () => {
    // 묵상이 적혀 있으면 저장
    if (meditationInput.trim()) {
      setUserMeds(prev => ({
        ...prev,
        [step108]: meditationInput.trim()
      }));
    }

    if (step108 < 108) {
      setStep108(prev => prev + 1);
      setMeditationInput(userMeds[step108 + 1] || ''); // 이미 적은 게 있다면 로드
    } else {
      // 108단계 도달 완료 시 자동 리포트 발급
      handleFetchReport('108steps', 108);
    }
  };

  const handle108Prev = () => {
    if (step108 > 1) {
      setStep108(prev => prev - 1);
      setMeditationInput(userMeds[step108 - 1] || '');
    }
  };

  const current108Question: DeconstructionQuestion = BODY_DECONSTRUCTION_108[step108 - 1];

  // 108단계 진행도에 따른 뒷배경 아우라 불투명도 조율 (자각도가 깊어질수록 아우라가 가라앉고 맑은 실버 단색조로 변함)
  const auraOpacity = Math.max(0, (108 - step108) / 108);

  // 5단계 성찰 코스 데이터
  const step5CourseInfo = [
    {
      title: '1단계: 몸(Body)의 해체',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      question: '지금 느껴지는 당신의 몸, 나이 들면 변하고 깊이 잠들면 사라질 이 육체가 과연 영원한 "나"일까요? 아니면 잠시 빌려 입은 옷일까요?',
      tip: '피곤함, 긴장감 등 현재 몸에서 느끼는 모든 감각과 집착을 적어보세요. 그리고 이 몸을 바라보는 진정한 "나"를 상기해 보세요.',
      placeholder: '예: 요즘 허리가 뻐근하고 무겁습니다. 늘 젊고 건강할 것만 같았던 이 몸도 시시각각 변화하고 있음을 느낍니다.',
      value: bodyText,
      setValue: setBodyText
    },
    {
      title: '2단계: 생각(Thoughts)의 해체',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      question: '머릿속을 쉴 새 없이 스쳐 지나가는 무수한 생각들... 이 생각들은 과연 진짜 "나"일까요? 아니면 잠시 일어났다 사라지는 구름일까요?',
      tip: '지금 떠오르는 고민, 내일 걱정, 혹은 소음 같은 잡념들을 있는 그대로 타이핑해 보세요. 적어놓고 거울 밖 객체로 바라봅니다.',
      placeholder: '예: 내일 할 일이 제대로 끝날까 걱정됩니다. 머릿속이 계획과 후회로 가득 차 있어서 어지럽습니다.',
      value: thoughtText,
      setValue: setThoughtText
    },
    {
      title: '3단계: 감정(Emotions)의 해체',
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      question: '기쁨도, 슬픔도, 불안함도 계절처럼 왔다 가는 날씨일 뿐입니다. 지금 당신의 마음 날씨는 어떤가요? 이 감정이 당신 자신인가요?',
      tip: '현재 마음속에 차오른 감정의 이름을 붙여 적어보세요. 그리고 물결처럼 잔잔하게 흘려보낼 준비를 합니다.',
      placeholder: '예: 최근의 일로 가슴 한구석이 조금 답답하고 불안합니다. 잘해내고 싶은 마음에 긴장감이 느껴집니다.',
      value: emotionText,
      setValue: setEmotionText
    },
    {
      title: '4단계: 느낌과 감각(Sensations)의 해체',
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      question: '주변의 소음, 피부에 닿는 촉감, 방 안의 공기... 이 모든 감각 대상을 "알아차리는" 조용한 관찰 공간이 당신 내면에 존재합니다.',
      tip: '지금 귀에 들리는 아주 작은 소리나 호흡의 느낌을 적어보세요. 그 모든 느낌은 스쳐 가는 자극일 뿐입니다.',
      placeholder: '예: 모니터의 조용한 팬 소리가 들리고, 방 안의 약간 차가운 공기가 손끝에 닿는 느낌이 듭니다.',
      value: sensationText,
      setValue: setSensationText
    }
  ];

  const currentStep5Data = step5CourseInfo[step5Course - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* 동적 백그라운드 아우라 광원 (108단계 상태에 따라 가라앉음) */}
      <div 
        className="absolute top-1/4 left-1/4 w-[280px] h-[280px] rounded-full blur-[90px] pointer-events-none transition-all duration-700" 
        style={{
          background: `rgba(16, 185, 129, ${activeMode === '108steps' ? auraOpacity * 0.12 : 0.1})`
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] rounded-full blur-[110px] pointer-events-none transition-all duration-700" 
        style={{
          background: `rgba(139, 92, 246, ${activeMode === '108steps' ? auraOpacity * 0.12 : 0.1})`
        }}
      />

      {/* 메인 윈도우 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-[480px] bg-slate-900/90 border border-slate-700/40 rounded-[2.5rem] p-5 shadow-2xl backdrop-blur-2xl overflow-hidden text-slate-100 flex flex-col min-h-[570px] justify-between"
      >
        {/* 상단 공통 헤더 */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪞</span>
            <div>
              <h2 className="text-base font-bold bg-gradient-to-r from-slate-200 via-emerald-200 to-purple-200 bg-clip-text text-transparent">
                알아차림의 거울
              </h2>
              <p className="text-[10px] text-slate-400">참나 자각 & 객체 해체</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30 hover:border-slate-600 rounded-full transition-all duration-200 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* 바디 영역 */}
        <div className="flex-1 flex flex-col justify-center">

          {/* 1. 모드 선택 화면 ('selection') */}
          {activeMode === 'selection' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 py-3"
            >
              <div className="text-center mb-4">
                <p className="text-sm font-semibold text-emerald-300 mb-1">
                  자각의 거울방에 오신 것을 환영합니다.
                </p>
                <p className="text-xs text-slate-400">
                  몸과 마음의 짐을 내려놓고 변치 않는 나를 발견해 보세요.
                </p>
              </div>

              {/* 코스 선택 카드 1 */}
              <button
                onClick={() => setActiveMode('5steps')}
                className="w-full text-left p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/30 hover:border-emerald-500/40 rounded-2xl transition-all duration-250 cursor-pointer flex gap-3.5 items-center group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                  <Layers className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-slate-200">코스 A: 5단계 자각의 여정</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">통합 성찰</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    몸, 생각, 감정, 감각의 무거운 짐을 깊게 고백하고 내려놓아 최종적으로 AI 자각 인증서를 수여받는 코스
                  </p>
                </div>
              </button>

              {/* 코스 선택 카드 2 */}
              <button
                onClick={() => {
                  setActiveMode('108steps');
                  setStep108(1);
                }}
                className="w-full text-left p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/30 hover:border-purple-500/40 rounded-2xl transition-all duration-250 cursor-pointer flex gap-3.5 items-center group"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
                  <Award className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-slate-200">코스 B: 108 재귀적 몸 해체</span>
                    <span className="text-[9px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-full font-bold">초고도 집중</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    머리카락부터 우주 공간의 상대성까지, 108가지 실생활 예시에 나를 대입하며 몸이 허상임을 온전히 자각하는 특별 훈련
                  </p>
                </div>
              </button>
            </motion.div>
          )}

          {/* 2. 5단계 성찰 코스 진행화면 */}
          {activeMode === '5steps' && (
            <div className="flex flex-col justify-between">
              
              {/* 5단계 비워내기 애니메이션 상태 */}
              <AnimatePresence>
                {isDispersing && (
                  <div className="relative flex-1 flex items-center justify-center min-h-[220px] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center flex-wrap max-w-[340px] text-center gap-1.5 px-4">
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
                          transition={{ duration: 1.4, ease: 'easeOut' }}
                          className="inline-block text-xs font-medium text-emerald-300/85 bg-slate-800/30 px-1.5 py-0.5 rounded border border-emerald-500/10"
                        >
                          {item.word}
                        </motion.span>
                      ))}
                    </div>
                    <div className="absolute bottom-2 flex items-center gap-1 text-[10px] text-emerald-400/80 font-medium">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>내려놓고 비워내는 중...</span>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* 5단계 성찰 폼 */}
              {!isDispersing && !isLoading && step5Course <= 4 && currentStep5Data && (
                <motion.div 
                  key={step5Course}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                >
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        {currentStep5Data.icon}
                        {currentStep5Data.title}
                      </span>
                      <span>{step5Course} / 5</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-purple-500 transition-all duration-300"
                        style={{ width: `${(step5Course / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-4 bg-slate-800/30 p-3.5 rounded-2xl border border-slate-700/30">
                    <h3 className="text-xs md:text-sm font-bold leading-relaxed mb-1.5 text-slate-200">
                      {currentStep5Data.question}
                    </h3>
                    <p className="text-[10px] text-slate-400 leading-normal flex items-start gap-1">
                      <HelpCircle className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{currentStep5Data.tip}</span>
                    </p>
                  </div>

                  <div className="relative mb-5">
                    <textarea
                      value={currentStep5Data.value}
                      onChange={(e) => currentStep5Data.setValue(e.target.value)}
                      placeholder={currentStep5Data.placeholder}
                      className="w-full h-[110px] bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl p-3 text-xs leading-relaxed text-slate-100 outline-none resize-none transition-all duration-200"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (step5Course === 1) setActiveMode('selection');
                        else setStep5Course(step5Course - 1);
                      }}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/30 rounded-2xl text-xs font-semibold cursor-pointer"
                    >
                      {step5Course === 1 ? '코스 선택으로' : '이전 단계'}
                    </button>
                    <button
                      onClick={() => handleDisperse(currentStep5Data.value)}
                      className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-2xl text-xs font-bold text-slate-950 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>비워내기 (해체)</span>
                      <ChevronRight className="w-4 h-4 text-slate-950" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* 5단계: 최종 자각 도달 */}
              {!isDispersing && !isLoading && step5Course === 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="mb-4 bg-slate-800/30 p-4.5 rounded-2xl border border-slate-700/30">
                    <div className="flex items-center gap-2 text-purple-300 text-xs font-bold mb-1.5">
                      <span>✨ 참나의 깨어남</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-semibold mb-2">
                      모든 대상(몸, 생각, 감정, 감각)을 내려놓아도,<br />
                      그 모든 비움을 지켜보며 늘 한결같이 존재하는 순수한 주체의식이 빛납니다.
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      잠에 들거나 나이를 먹어 몸이 무너져 내려도, 그것을 아는 알아차림은 변하지 않는 온전한 우주 그 자체입니다. 자각의 평화 속에서 AI 리포트를 발급받으세요.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep5Course(4)}
                      className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/30 rounded-2xl text-xs font-semibold cursor-pointer"
                    >
                      이전 단계
                    </button>
                    <button
                      onClick={() => handleFetchReport('5steps')}
                      className="flex-[2] py-3.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-2xl text-xs font-bold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>참나 자각 리포트 받기</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* 3. 108 재귀적 몸 해체 코스 진행화면 */}
          {activeMode === '108steps' && current108Question && !isLoading && (
            <div className="flex flex-col justify-between">
              
              {/* 진행 바 */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1 text-purple-300 uppercase tracking-widest font-bold text-[9px]">
                    <Sparkle className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                    {current108Question.category}
                  </span>
                  <span>{step108} / 108</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${(step108 / 108) * 100}%` }}
                  />
                </div>
              </div>

              {/* 108 질문 카드 (Swipe-Up 모션 모방) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step108}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-slate-950/65 border border-slate-800 rounded-[1.8rem] p-4.5 mb-3 flex-1 flex flex-col justify-between min-h-[190px]"
                >
                  <div>
                    <h3 className="text-xs md:text-sm font-extrabold leading-relaxed text-amber-200/90 mb-2.5">
                      Q.{step108} {current108Question.question}
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                      💡 {current108Question.example}
                    </p>
                  </div>
                  
                  {/* 중간 응원 피드백 */}
                  {step108 % 12 === 0 && (
                    <div className="mt-2 text-[9px] text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 self-start flex items-center gap-1">
                      <Award className="w-3 h-3 text-purple-400" />
                      <span>{step108}단계 도달! 당신의 자각 아우라가 점점 고요해집니다.</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* 한 줄 묵상 쓰기 (선택 입력) */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={meditationInput}
                  onChange={(e) => setMeditationInput(e.target.value)}
                  placeholder="정말 그렇네요... 나의 짧은 자각 묵상을 한 줄 적어보세요 (선택)"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all duration-200"
                />
              </div>

              {/* 하단 제어 제어바 */}
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-2">
                  <button
                    onClick={handle108Prev}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/30 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                    <span>이전 단계</span>
                  </button>
                  <button
                    onClick={handle108Next}
                    className="flex-[2] py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/10"
                  >
                    <span>{step108 === 108 ? '각성 완료!' : '정말 그러네 (다음)'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 중간 조기 리포트 발행 & 중단 제어 */}
                <div className="flex justify-between items-center px-1 text-[10px]">
                  <button
                    onClick={() => setActiveMode('selection')}
                    className="text-slate-500 hover:text-slate-300 font-semibold cursor-pointer"
                  >
                    코스 선택으로
                  </button>
                  {step108 >= 12 && (
                    <button
                      onClick={() => handleFetchReport('108steps', step108)}
                      className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      <span>{step108}단계 기준 조기 자각리포트 발급</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* 4. 공통 로딩 스피너 */}
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <div className="relative mb-5">
                <div className="w-14 h-14 border-2 border-purple-500/20 border-t-purple-400 rounded-full animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-lg animate-pulse">🪞</span>
              </div>
              <p className="text-sm font-semibold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent mb-1.5 animate-pulse">
                자각의 빛을 밝히는 중
              </p>
              <p className="text-xs text-slate-400 px-6 leading-relaxed">
                당신의 깊은 침묵 속으로 침잠합니다.<br />
                객체를 모두 비워내고 참나의 형상을 그리는 중입니다...
              </p>
            </div>
          )}

          {/* 5. 최종 리포트 결과 화면 ('result') */}
          {activeMode === 'result' && report && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-grow flex flex-col"
            >
              {/* 카드 본체 */}
              <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/20 rounded-[2.2rem] p-5 shadow-2xl overflow-hidden mb-4 flex-1 flex flex-col justify-between">
                
                {/* 골드 코너 장식 */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-500/40" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-500/40" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-500/40" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-500/40" />

                <div className="text-center mb-3.5">
                  <div className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 border border-amber-500/35 rounded-full px-2.5 py-0.5 bg-amber-500/5 uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Pure Self-Awareness</span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-100">
                    👑 {userName}님의 {report.title}
                  </h3>
                </div>

                {/* 본문 설명 스크롤 영역 */}
                <div className="space-y-3.5 text-left overflow-y-auto max-h-[290px] pr-1 scrollbar-thin">
                  
                  {/* 비움 성찰 */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 mb-1">
                      🌱 비워낸 자리에 남은 침묵
                    </span>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {report.emptinessContemplation}
                    </p>
                  </div>

                  {/* 참나의 본질 */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <span className="text-[9px] font-bold text-purple-400 flex items-center gap-1 mb-1">
                      🪞 내면의 변치 않는 참나 (주체)
                    </span>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {report.trueSelfNature}
                    </p>
                  </div>

                  {/* 일상 자각 앵커 */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <span className="text-[9px] font-bold text-cyan-400 flex items-center gap-1 mb-1.5">
                      💡 일상 속 자각 앵커링 실천
                    </span>
                    <ul className="space-y-1.5">
                      {report.dailyAwarenessAnchor.map((anchor, idx) => (
                        <li key={idx} className="text-[10px] text-slate-300 leading-relaxed flex items-start gap-1">
                          <span className="text-cyan-400/80 font-bold shrink-0 mt-0.5">{idx + 1}.</span>
                          <span>{anchor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* 묵상 명언 */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/60 text-center">
                  <p className="text-xs italic text-amber-200/90 font-medium px-2 leading-relaxed">
                    "{report.soulQuote}"
                  </p>
                </div>

              </div>

              {/* 하단 버튼 제어 */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActiveMode('selection');
                    setReport(null);
                  }}
                  className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/30 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span>새 성찰 코스 시작</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-gradient-to-r from-slate-200 to-slate-100 hover:from-white hover:to-white text-slate-950 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>가슴에 자각 새기기</span>
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
