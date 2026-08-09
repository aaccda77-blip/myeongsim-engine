'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, Shield, ArrowRight, Zap, RefreshCw, Award, Heart, CheckCircle2 } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';

interface EmotionAlchemyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithIntent?: (intent: string) => void;
}

// 5대 감정 원소 딕셔너리
const EMOTION_ELEMENTS = [
  {
    id: 'anxiety',
    icon: '🔮',
    title: '불안 & 걱정',
    sub: '미래에 대한 두려움과 무거운 압박감',
    darkTag: '편도체 과각성',
    goldTitle: '정밀한 예지 안목 (Intuitive Radar)',
    goldDesc: '불안은 위협이 아닙니다. 이경윤님의 辛金(은빛 다이아몬드) 예리함이 남들보다 위험을 먼저 읽어내는 직관적 안목입니다.',
    action: '지금 코끝 숨결에 3초 집중하며, 불안의 파도를 안목의 에너지로 재정렬하기',
    affirmation: '내 불안은 나를 지켜주는 정밀 레이더다. 억누르지 않고 지혜로 스캔하겠다.'
  },
  {
    id: 'anger',
    icon: '🔥',
    title: '분노 & 억울함',
    sub: '부당한 상황이나 거절에 대한 뜨거운 불길',
    darkTag: '투쟁 모드 과전압',
    goldTitle: '거침없는 돌파 엔진 (Breakthrough Engine)',
    goldDesc: '분노는 파괴가 아닌 폭발적 에너지입니다. 이 불길을 남을 찌르는 데 쓰지 않고 내 숙원 과제를 뚫어내는 추진력으로 전환합니다.',
    action: '오늘 미뤄둔 가장 어렵고 막막했던 과제 1개를 분노의 화력으로 10분 만에 뚫어내기',
    affirmation: '분노는 나를 멈추게 할 수 없다. 최고의 추진력으로 연금시켜 돌파하겠다.'
  },
  {
    id: 'sadness',
    icon: '🌧️',
    title: '슬픔 & 상실감',
    sub: '가슴 아린 외로움과 지나간 상처',
    darkTag: '마음 대문 닫힘',
    goldTitle: '깊은 자비와 공감의샘 (Compassion Core)',
    goldDesc: '슬픔은 영혼의 각질이 벗겨지는 가슴 시린 치유 과정입니다. 내 아픔을 어루만져 타인을 깊이 이해하는 고결한 공감력을 완성합니다.',
    action: '내 손을 가슴 위에 얹고 "슬퍼해도 괜찮아, 곁에 있어줄게" 다정하게 속삭여주기',
    affirmation: '내 슬픔은 고결한 지혜의 샘물이다. 따뜻하게 포용하여 참나로 돌아가겠다.'
  },
  {
    id: 'inferiority',
    icon: '🔒',
    title: '열등감 & 비교',
    sub: '타인과 비교하며 초라해지는 느낌',
    darkTag: '자아 코어 침범',
    goldTitle: '독보적 원형 주권 (Sovereign Core)',
    goldDesc: '타인의 별과 내 별은 다릅니다. 이경윤님은 다이아몬드 고유의 빛깔을 가졌습니다. 남의 무대에 들러리가 되지 않는 주권을 회복합니다.',
    action: '남의 SNS나 성과를 훔쳐보는 촉각을 거두고, 나의 고유한 강점 3가지를 노트에 적기',
    affirmation: '나는 타인과 비교될 수 없는 고유한 辛金 코어다. 내 빛을 오롯이 비추겠다.'
  },
  {
    id: 'helplessness',
    icon: '🌀',
    title: '무기력 & 허무',
    sub: '아무것도 하기 싫고 멍해지는 피로감',
    darkTag: 'DMN 배터리 고갈',
    goldTitle: '영점(Zero Point) 리셋 (Pure Reset)',
    goldDesc: '무기력은 고장이 아니라 시스템의 휴식 요청입니다. 아무런 요구도 없는 텅 빈 영점 의식 스크린에 안주하여 배터리를 충전합니다.',
    action: '아무것도 잘하려고 하지 말고, 3분간 스마트폰을 끄고 누워서 깊은 휴식 취하기',
    affirmation: '무기력은 참나의 가벼운 휴식이다. 영점 스크린에 푹 쉬어 다시 타오르겠다.'
  }
];

export default function EmotionAlchemyModal({ isOpen, onClose, onOpenChatWithIntent }: EmotionAlchemyModalProps) {
  const { reportData } = useReportStore();
  
  // 이름 추출 (이경윤님)
  const rawUserName = reportData?.userName || (typeof window !== 'undefined' ? localStorage.getItem('saju_user_name') : null);
  const userName = (rawUserName && !rawUserName.toLowerCase().includes('the') && !rawUserName.toLowerCase().includes('te') && !rawUserName.includes('@')) 
    ? rawUserName 
    : '이경윤';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [alchemyPhase, setAlchemyPhase] = useState<'select' | 'brewing' | 'gold'>('select');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const activeElement = EMOTION_ELEMENTS.find((el) => el.id === selectedId);

  // 연금술 실행 핸들러
  const handleStartAlchemy = (id: string) => {
    setSelectedId(id);
    setAlchemyPhase('brewing');
    setSavedSuccess(false);

    // 3초 연금술 애니메이션 연출 후 황금 카드 발급
    setTimeout(() => {
      setAlchemyPhase('gold');
    }, 2800);
  };

  const handleReset = () => {
    setSelectedId(null);
    setAlchemyPhase('select');
    setSavedSuccess(false);
  };

  const handleSaveToLog = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0F172A] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[0_0_80px_rgba(168,85,247,0.25)] border border-purple-500/30 text-slate-100 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-rose-950 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all border border-slate-700/60 z-30"
        >
          <X size={18} />
        </button>

        {/* 1단계: 감정 원소 선택 뷰 */}
        {alchemyPhase === 'select' && (
          <div className="space-y-5 text-left">
            <div className="border-b border-slate-800 pb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-black rounded-full uppercase tracking-wider mb-2">
                🧪 0-2. 감정 연금술 도가니
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-serif">
                {userName}님의 감정을 명심 에너지로 재제련합니다
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                지금 가장 마음을 무겁게 짓누르는 감정 원소를 선택하세요. 고대 연금술과 뇌과학 파동으로 황금 자각으로 변환해 드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {EMOTION_ELEMENTS.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartAlchemy(item.id)}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[9px] font-mono font-bold text-purple-400/80 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-800/40">
                        {item.darkTag}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {item.sub}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-end text-[10px] font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    연금술 가동하기 <ArrowRight size={12} className="ml-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* 2단계: 연금술 3초 애니메이션 뷰 */}
        {alchemyPhase === 'brewing' && activeElement && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* 회전하는 네온 연금술 링 */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500/40 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute inset-2 rounded-full border-2 border-amber-400/30 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-amber-500 to-indigo-600 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(245,158,11,0.5)] animate-pulse">
                {activeElement.icon}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-amber-300 font-serif">
                {userName}님의 {activeElement.title} 원소 재제련 중...
              </h3>
              <p className="text-xs text-slate-400 font-mono animate-pulse">
                [辛金 코어 파동 ✕ 뇌파 재정렬] 감정을 혜안의 황금 에너지로 전환 중입니다
              </p>
            </div>
          </div>
        )}

        {/* 3단계: 황금 명심 연금술 카드 완성 뷰 */}
        {alchemyPhase === 'gold' && activeElement && (
          <div className="space-y-5 text-left animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm">
                ✨ 명심 황금 연금술 카드 완성
              </span>
              <button 
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
              >
                <RefreshCw size={12} /> 다른 감정 변환하기
              </button>
            </div>

            {/* 카드 결과물 */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#1A1625] to-slate-900 border border-amber-500/40 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 line-through mr-2">
                    기존: {activeElement.title}
                  </span>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    ➔ {activeElement.goldTitle}
                  </span>
                </div>
                <span className="text-2xl">{activeElement.icon}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h4 className="text-xs font-bold text-amber-300 mb-1">🔮 {userName}님 사주 기질 연금 해설</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-serif">
                  {activeElement.goldDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Zap size={13} /> 1초 명심 자각 확언
                </h4>
                <p className="text-xs text-amber-100 font-bold leading-relaxed">
                  "{activeElement.affirmation}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] text-purple-200">
                <span className="font-bold text-purple-300">💡 오늘 실천 과제: </span>
                {activeElement.action}
              </div>
            </div>

            {/* 하단 버튼 액션 */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={handleSaveToLog}
                className="w-full sm:w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span className="text-emerald-300">황금 코드로 저장 완료!</span>
                  </>
                ) : (
                  <>
                    <Award size={14} className="text-amber-400" />
                    <span>내 자각 이력에 저장</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenChatWithIntent) {
                    onOpenChatWithIntent(`[감정연금술 완료] ${userName}님이 ${activeElement.title} 감정을 ${activeElement.goldTitle}로 연금했습니다. 깊은 상담을 원합니다.`);
                  }
                }}
                className="w-full sm:w-1/2 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>AI 마스터 코치와 깊은 대화</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
