'use client';

/**
 * [독립 모듈] 데일리 바이오-사주 동기화 패널
 * - 기존 챗봇 시스템에 0% 영향
 * - 사용자 데이터(일간, 생년월일, 오행)에 따라 완전 맞춤화
 * - 3가지 기능 통합: 일진 하모니 + 바이오리듬 게이지 + 3S 데일리 패치
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { getTodayDailyPillar } from '@/utils/SajuCalculator';
import {
  analyzeDailyHarmony,
  calculateBiorhythm,
  getBioSajuAdvice,
  type DailyHarmonyResult,
} from '@/modules/DailyJincheonEngine';
import { Zap, Activity, Calendar, ChevronDown, Clock, CheckCircle2, Star, MessageCircle, TrendingUp, Shield, Loader2, Lightbulb } from 'lucide-react';
import DeepScanSection from './DeepScanSection';
import AkashicRecordSection from './AkashicRecordSection';
import LiveSyncSection from './LiveSyncSection';
import MindResetSection from './MindResetSection';
import { DAILY_NEURO_ACTIONS, DAILY_AFFIRMATIONS } from '@/data/DailyActionDB';
import { DAILY_ENERGY_DB } from '@/data/DailyEnergyDB';


// ─────────────────────────────────────────────
// 헬퍼: 일간 한자 추출
// ─────────────────────────────────────────────
const KOR_TO_HANJA: Record<string, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸',
};
const DOMINANT_KOR: Record<string, string> = {
  '甲': '목', '乙': '목', '丙': '화', '丁': '화', '戊': '토',
  '己': '토', '庚': '금', '辛': '금', '壬': '수', '癸': '수',
};

function extractDayMasterHanja(reportData: any): string | null {
  if (!reportData) return null;

  // ReportData 실제 타입 기준 경로 (report.ts 확인 완료)
  // 1순위: reportData.saju.dayMaster (예: "갑 (목)", "庚", "경금" 등 다양한 형식)
  // 2순위: reportData.saju.fourPillars.day.gan (한글 천간)
  // 3순위: 기타 레거시 경로
  const candidates = [
    reportData?.saju?.dayMaster,
    reportData?.saju?.fourPillars?.day?.gan,
    reportData?.dayMaster,
    reportData?.saju?.fourPillars?.day?.ganKor,
  ].filter(Boolean);

  for (const raw of candidates) {
    const str = raw?.toString() || '';
    // 한자 우선 매칭
    const hanjaMatch = str.match(/[甲乙丙丁戊己庚辛壬癸]/);
    if (hanjaMatch) return hanjaMatch[0];
    // 한글 매칭
    const korMatch = str.match(/[갑을병정무기경신임계]/);
    if (korMatch) return KOR_TO_HANJA[korMatch[0]] || null;
  }

  // 최후 수단: birthDate로 직접 사주 계산
  const birthDate = reportData?.birthDate || reportData?.birth_date;
  if (birthDate) {
    try {
      // SajuCalculator import (dynamic require 방식)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { calculateSaju } = require('@/utils/SajuCalculator');
      const birthTime = reportData?.birthTime || reportData?.birth_time || '12:00';
      const result = calculateSaju(birthDate, birthTime, 'solar', 'male');
      if (result?.dayMaster) {
        const str = result.dayMaster.toString();
        const hanja = str.match(/[甲乙丙丁戊己庚辛壬癸]/);
        if (hanja) return hanja[0];
        const kor = str.match(/[갑을병정무기경신임계]/);
        if (kor) return KOR_TO_HANJA[kor[0]] || null;
      }
    } catch {
      // 계산 실패 시 무시
    }
  }

  return null;
}

function extractBirthDate(reportData: any): string | null {
  // ReportData 실제 타입: birthDate는 최상위 레벨
  return reportData?.birthDate || reportData?.birth_date || null;
}

function extractDominantElement(reportData: any): string {
  // ReportData 실제 타입: ohaeng 또는 elements 사용
  const elements = reportData?.saju?.ohaeng || reportData?.saju?.elements || {};
  if (Object.keys(elements).length === 0) return '목';
  const sorted = Object.entries(elements).sort(([, a], [, b]) => (b as number) - (a as number));
  const topElem = sorted[0]?.[0] || 'wood';
  const elemMap: Record<string, string> = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
  return elemMap[topElem] || '목';
}

// ─────────────────────────────────────────────
// Feature 2: 바이오리듬 게이지 UI
// ─────────────────────────────────────────────
function BiorhythmBar({ type, label, value, color }: { type: 'physical'|'emotional'|'intellectual'; label: string; value: number; color: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const percentage = Math.round((value + 100) / 2); // -100~100 → 0~100

  // 각 그래프 값에 따른 상세 코칭 가이드
  const getGaugeDetail = (t: string, v: number) => {
    if (t === 'physical') {
      if (v > 60) return '💪 신체 에너지가 최고조에 달했습니다. 고강도 운동이나 미뤄둔 육체적 일정을 소화하기 완벽한 날입니다. 넘치는 활력을 적극적으로 활용하세요.';
      if (v > 20) return '📈 체력이 점진적으로 상승하는 구간입니다. 가벼운 운동과 활동으로 에너지를 끌어올리면 하루 종일 상쾌함을 유지할 수 있습니다.';
      if (v > -20) return '⚖️ 신체적 리듬이 안정된 중립 상태입니다. 무리 없이 일상 루틴을 소화하며, 규칙적인 식사와 수면이 중요합니다.';
      if (v > -60) return '📉 체력이 서서히 고갈되고 있습니다. 야근이나 무리한 혼자만의 일정은 피하고, 저녁에는 의식적으로 휴식에 온전히 집중하세요.';
      return '🔋 체력이 완전히 방전된 저점 에너지입니다. 오늘은 모든 외부 에너지를 차단하고 수면과 영양 보충에 집중해야 합니다. 무리하면 내일 앓아눕게 됩니다.';
    }
    if (t === 'emotional') {
      if (v > 60) return '💖 감정적 안정감과 공감 능력이 최상입니다! 주변 사람들에게 먼저 다가가거나 가장 어려운 대화를 부드럽게 풀어나가기 좋은 완벽한 타이밍입니다.';
      if (v > 20) return '✨ 긍정적인 기운이 차오르고 있습니다. 작은 일에도 쉽게 감사함을 느끼며, 새로운 사람과의 만남이나 네트워킹에 적합한 컨디션입니다.';
      if (v > -20) return '⚖️ 감정선이 크게 요동치지 않는 평온한 파도입니다. 주관적 감정에 치우치지 않고 객관적으로 상황을 바라보기 가장 좋습니다.';
      if (v > -60) return '🌧 감정적으로 약간 예민해질 수 있는 구간입니다. 타인의 사소한 일상적 말이나 피드백에 과민 반응할 수 있으니 한 템포 쉬어가는 여유가 필요합니다.';
      return '🚨 감정적 면역력이 바닥난 상태입니다. 오늘의 우울하고 불안한 감정은 객관적 현실이 아니라 뇌의 오류입니다! 결코 오늘 중요한 인간관계 결정을 내리지 마세요.';
    }
    if (t === 'intellectual') {
      if (v > 60) return '🧠 지성을 담당하는 대뇌피질이 200% 가동되는 하루입니다! 기획, 설계, 분석, 중요한 협상 전략 등 가장 많은 뇌가 필요한 작업에 올인하세요.';
      if (v > 20) return '💡 지적 호기심과 흡수력이 상승곡선을 타고 있습니다. 미뤄두었던 책을 읽거나 온라인 교육을 시청하면 그 지식이 그대로 나의 뼈가 됩니다.';
      if (v > -20) return '⚖️ 지식 처리 능력이 평균적으로 유지됩니다. 새로운 창의적 발상보다는 익숙하고 반복적인 의사결정을 오차 없이 처리해내는 데 집중하세요.';
      if (v > -60) return '🌫 두뇌에 브레인 포그(Brain Fog)가 낀 듯 집중력이 쉽게 분산됩니다. 복잡한 수치 계산이나 심도 깊은 설계 대신 리서치나 단순 정리에 초점을 맞추세요.';
      return '🛑 논리적 판단력이 일시적으로 마비된 저점입니다. 착각이나 논리적 오류를 범할 확률이 120%입니다. 중요한 판단은 반드시 내일로 넘기고 뇌를 텅 비우세요.';
    }
    return '';
  };

  const detailMessage = getGaugeDetail(type, value);

  return (
    <div className="space-y-1 group relative">
      {/* 바 클릭 영역 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-transparent hover:bg-white/5 rounded-xl p-2 transition-all duration-300"
      >
        <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5 focus:outline-none">
          <span className="flex items-center gap-1.5 font-medium tracking-wide group-hover:text-white transition-colors">
            {label}
            <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-[9px] text-slate-500 group-hover:text-slate-300 inline-block">▼</motion.span>
          </span>
          <span style={{ color }} className="font-bold text-sm tracking-tighter drop-shadow-sm">{value > 0 ? '+' : ''}{value}</span>
        </div>
        <div className="h-2.5 bg-slate-900/80 rounded-full overflow-hidden shadow-inner ring-1 ring-white/10 cursor-pointer">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full relative"
            style={{ background: `linear-gradient(to right, ${color}33, ${color})` }}
          >
            {/* 게이지 내부 하이라이트 효과 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
          </motion.div>
        </div>
      </button>

      {/* 펼쳐지는 상세 설명 영역 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden origin-top"
          >
            <div className="mt-1 mb-2 mx-1 p-3.5 bg-slate-900/90 rounded-xl border border-white/10 relative shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              {/* 백그라운드 코어 글로우 효과 */}
              <div 
                className="absolute inset-0 opacity-10 blur-xl rounded-xl z-0"
                style={{ backgroundColor: color }}
              />
              <p className="text-xs text-slate-200 leading-relaxed relative z-10 break-keep font-medium">
                {detailMessage}
              </p>
              
              {/* 스페셜 코칭 태그 */}
              <div className="mt-2 text-[9px] text-slate-500 font-bold border-t border-white/5 pt-2 flex items-center gap-1.5 relative z-10">
                <Zap className="w-3 h-3 text-amber-400" />
                Myeongsim OS / 진단 패치 완료
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Feature 1: 일진 에너지 하모니 UI
// ─────────────────────────────────────────────
function EnergyHarmonySection({ harmony }: { harmony: DailyHarmonyResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  
  const data = DAILY_ENERGY_DB[harmony.tenGod] || DAILY_ENERGY_DB['비견']; // Fallback
  
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-white/10 bg-slate-900/50">
        <h3 className="text-[13px] font-bold text-white mb-2 leading-tight">{data.headline}</h3>
        <p className="text-[11.5px] text-slate-300 leading-relaxed mb-3 break-keep">{data.detail}</p>
        <div className="p-3 bg-white/5 rounded-lg mb-3">
          <p className="text-[11px] text-slate-400 leading-relaxed break-keep">{data.examples}</p>
        </div>
        <div className="p-3 rounded-lg border flex items-start gap-2" style={{ backgroundColor: `${harmony.energyColor}15`, borderColor: `${harmony.energyColor}30` }}>
          <p className="text-[11.5px] font-medium leading-relaxed break-keep" style={{ color: harmony.energyColor }}>
            {data.actionTip}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimeSlotGuide({ harmony }: { harmony: DailyHarmonyResult }) {
  const currentHour = new Date().getHours();
  // 5시~익일5시 논리 연산
  const logicalHour = currentHour < 5 ? currentHour + 24 : currentHour;

  const TIME_SLOTS = [
    { id: 0, label: '오전', timeSub: '05:00~12:00', icon: '🌅' },
    { id: 1, label: '오후', timeSub: '12:00~18:00', icon: '☀️' },
    { id: 2, label: '저녁', timeSub: '18:00~22:00', icon: '🌤️' },
    { id: 3, label: '심야', timeSub: '22:00~05:00', icon: '🌙' },
  ];

  const currentSlotId = TIME_SLOTS.findIndex(t => {
    const s = t.id === 3 ? 22 : t.id === 2 ? 18 : t.id === 1 ? 12 : 5;
    const e = t.id === 3 ? 29 : t.id === 2 ? 22 : t.id === 1 ? 18 : 12;
    return logicalHour >= s && logicalHour < e;
  });

  const [selectedSlot, setSelectedSlot] = useState<number>(currentSlotId !== -1 ? currentSlotId : 0);

  const actionData = DAILY_NEURO_ACTIONS[selectedSlot]?.[harmony.relation] || DAILY_NEURO_ACTIONS[selectedSlot]?.['PRESSURE'];

  return (
    <div className="mt-4 space-y-2 relative">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">행동 매뉴얼</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {TIME_SLOTS.map((slot) => {
          const isActive = selectedSlot === slot.id;
          return (
            <button key={slot.id} onClick={() => setSelectedSlot(slot.id)} className={`py-2 rounded-xl border text-[10px] font-bold ${isActive ? 'bg-slate-800' : 'opacity-60'}`} style={{ borderColor: isActive ? harmony.energyColor : 'transparent' }}>
              {slot.icon} {slot.label}
            </button>
          );
        })}
      </div>
      <div className="p-4 rounded-xl border mt-2 flex flex-col gap-2" style={{ borderColor: `${harmony.energyColor}40`, backgroundColor: `${harmony.energyColor}05` }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Zap className="w-3 h-3" style={{ color: harmony.energyColor }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: harmony.energyColor }}>
            {actionData.focus}
          </span>
        </div>
        <p className="text-[12px] text-slate-200 leading-relaxed font-medium break-keep">
          {actionData.text}
        </p>
      </div>
    </div>
  );
}

function AffirmationCard({ harmony, dayMasterHanja }: { harmony: DailyHarmonyResult; dayMasterHanja: string | null }) {
  const defaultAffirmationText = DAILY_AFFIRMATIONS[harmony.relation] || DAILY_AFFIRMATIONS['SYNC'];
  const [affirmationText, setAffirmationText] = useState(defaultAffirmationText);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchAffirmation = async () => {
      if (!dayMasterHanja || !harmony) return;
      const todayDateStr = new Date().toISOString().split('T')[0];
      const cacheKey = `myeongsim_affirmation_${dayMasterHanja}_${harmony.todayGan}${harmony.todayZhi}_${todayDateStr}`;
      
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setAffirmationText(cached);
        return;
      }

      setIsGenerating(true);
      try {
        const res = await fetch('/api/coaching/daily-affirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dayMaster: dayMasterHanja,
            todayGanji: `${harmony.todayGan}${harmony.todayZhi}`,
            relation: harmony.relation,
            defaultAffirmation: defaultAffirmationText
          })
        });
        const data = await res.json();
        if (data.affirmation) {
          setAffirmationText(data.affirmation);
          localStorage.setItem(cacheKey, data.affirmation);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsGenerating(false);
      }
    };

    fetchAffirmation();
  }, [dayMasterHanja, harmony.todayGan, harmony.todayZhi, harmony.relation, defaultAffirmationText]);

  return (
    <div className="mt-4 bg-white/5 p-5 rounded-xl border border-white/5 relative overflow-hidden group">
      {/* 장식용 블러 효과 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: harmony.energyColor }} />
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">오늘의 핵심 선언문</span>
        </div>
        {isGenerating && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700">
            <Loader2 className="w-2.5 h-2.5 text-amber-400 animate-spin" />
            <span className="text-[8px] text-slate-300">AI 맞춤 작성 중...</span>
          </div>
        )}
      </div>
      <p className="text-[13.5px] font-bold text-white italic leading-[1.7] break-keep relative z-10 transition-opacity duration-500" style={{ opacity: isGenerating ? 0.5 : 1 }}>
        &ldquo;{affirmationText}&rdquo;
      </p>
    </div>
  );
}

function DailyPatchSection({ steps, isLoading, onComplete }: { steps: any[], isLoading: boolean, onComplete: (ans: any[]) => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        <p className="text-xs text-slate-500 font-mono tracking-widest animate-pulse">GENERATING DYNAMIC PATCH...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-2 pb-6">
      {!steps || steps.length === 0 ? (
        <div className="text-center py-8 text-[11px] text-slate-500">데이터를 가져오는 중이거나 없습니다.</div>
      ) : (
        steps.map((step, idx) => {
          const isExpanded = expandedIdx === idx;
          const isCompleted = selectedOptions[idx] !== undefined;

          return (
            <motion.div
              key={idx}
              className={`rounded-xl border cursor-pointer overflow-hidden mb-2 ${isExpanded ? 'bg-slate-900 border-white/20' : 'bg-slate-900/40 border-white/5'}`}
              style={{ borderColor: isExpanded ? `${step.color}50` : undefined }}
              onClick={() => setExpandedIdx(idx)}
            >
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: `${step.color}20`, color: step.color }}>{isCompleted ? '✓' : step.icon}</div>
                  <div>
                    <p className="text-[9px] font-mono tracking-widest uppercase" style={{ color: step.color }}>Depth {step.depth}</p>
                    <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-4 pb-4 overflow-hidden border-t border-white/5 pt-4 space-y-4">
                    <p className="text-[12px] text-slate-200 leading-relaxed font-bold">Q. {step.question}</p>
                    {step.tip && (
                      <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex gap-2 shadow-sm">
                         <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                         <p className="text-[10.5px] text-amber-200/70">{step.tip}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {step.choices?.map((opt: string, optIdx: number) => (
                        <button 
                          key={optIdx} 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newOpts = { ...selectedOptions, [idx]: optIdx };
                            setSelectedOptions(newOpts);
                            if (Object.keys(newOpts).length === steps.length) {
                               onComplete(steps.map((s, i) => ({ q: s.title, a: s.choices[newOpts[i]] })));
                            }
                            if (idx < steps.length - 1) setTimeout(() => setExpandedIdx(idx + 1), 300);
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-[11px] leading-[1.5] transition-all duration-200 break-keep font-medium flex gap-3 items-center group
                            ${selectedOptions[idx] === optIdx 
                              ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                              : 'bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20 text-slate-300'
                            }
                          `}
                          style={{ borderColor: selectedOptions[idx] === optIdx ? step.color : undefined }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full flex shrink-0 items-center justify-center border transition-colors"
                            style={{ 
                              backgroundColor: selectedOptions[idx] === optIdx ? step.color : 'transparent',
                              borderColor: selectedOptions[idx] === optIdx ? step.color : 'rgba(255,255,255,0.2)' 
                            }}
                          >
                            {selectedOptions[idx] === optIdx && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                          </div>
                          <span className={selectedOptions[idx] === optIdx ? 'text-white' : 'group-hover:text-slate-100'}>{opt}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 패널 컴포넌트 — 프리미엄 리디자인
// ─────────────────────────────────────────────
type TabType = 'harmony' | 'bio' | 'akashic' | 'patch' | 'deepscan' | 'livesync' | 'mindreset';


export default function DailyBioSyncPanel() {
  const { reportData, setDailyChecklistAnswers } = useReportStore();
  const [activeTab, setActiveTab] = useState<TabType>('harmony');
  const [isExpanded, setIsExpanded] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [streak, setStreak] = useState(1);

  // ── 동적 3S 질문 상태 (동기화 모듈로 즉각 로딩)
  // isLoadingSteps는 더 이상 필요 없지만 기존 컴포넌트 하위 호환성을 위해 false로 고정합니다.
  const isLoadingSteps = false;

  // ── 사용자 데이터
  const dayMasterHanja  = useMemo(() => extractDayMasterHanja(reportData), [reportData]);
  const birthDate       = useMemo(() => extractBirthDate(reportData), [reportData]);
  const dominantElement = useMemo(() => extractDominantElement(reportData), [reportData]);
  const todayPillar     = useMemo(() => getTodayDailyPillar(), []);

  const harmony = useMemo(() => {
    if (!dayMasterHanja) return null;
    return analyzeDailyHarmony(
      dayMasterHanja,
      todayPillar.gan, todayPillar.zhi,
      todayPillar.ganElement, todayPillar.zhiElement,
    );
  }, [dayMasterHanja, todayPillar]);

  // ── 5대 일진 에너지 기반 초고도화 질문 모듈 사전 (Dictionary)
  const dynamicSteps = useMemo(() => {
    const currentIlgan = dayMasterHanja || '辛';
    const relation = harmony?.relation || 'SYNC';

    const MODULES: Record<string, any[]> = {
      SYNC: [
        {
          depth: 1, title: 'Somatic Grounding', color: '#3b82f6', icon: '🔍',
          question: `[신체 자각] 지금 내 목이나 어깨가 뻣뻣하게 굳어 있거나, 내 주장을 관철시키고 싶은 충동이 강하게 들지 않는가?`,
          tip: `${currentIlgan} 특유의 고집과 방어 기제가 신체적 긴장으로 나타나는 상태를 감지하세요.`,
          choices: ['네, 무의식적으로 몸에 힘이 들어가고 방어적으로 변했습니다.', '아니요, 현재 평온하게 이완되어 내 의견을 고집하지 않고 있습니다.']
        },
        {
          depth: 2, title: 'Cognitive Defusion', color: '#6366f1', icon: '🧠',
          question: `[강박 인지] "내가 맞고 저 사람이 틀렸다"는 흑백논리적 사고방식이 머릿속을 지배하고 있지 않은가?`,
          tip: `나와 타인을 분리하는 인지 왜곡을 객관적으로 감지하세요.`,
          choices: ['네, 내 방식대로 상황을 통제하고 싶은 마음이 강합니다.', '아닙니다, 다른 사람의 관점도 타당할 수 있다고 생각합니다.']
        },
        {
          depth: 3, title: 'Socratic Inquiry', color: '#8b5cf6', icon: '🔗',
          question: `[인지 분리] 타인과의 이 마찰감은 객관적 문제 때문인가, 아니면 내 에고(Ego)가 상처받지 않으려는 방어기제인가?`,
          tip: `타인은 나의 무의식을 비추는 거울입니다. 분노와 나를 분리하세요.`,
          choices: ['이 불편함은 내 자존심을 지키려는 에고의 작용임을 자각합니다.', '아직 감정과 나를 완벽하게 분리해내기 어렵습니다.']
        },
        {
          depth: 4, title: 'Radical Acceptance', color: '#ec4899', icon: '⚖️',
          question: `[모순 직면] 나와 완전히 다른 타인의 행동과 생각을, 내 기준에 맞추려 하지 않고 있는 그대로 수용할 수 있는가?`,
          tip: `통제를 쥐려는 손아귀의 힘을 푸는 순간, 거대한 강물이 보이기 시작합니다.`,
          choices: ['통제권을 고집하지 않고 자연스러운 흐름에 맡기겠습니다.', '당장은 불안해서 통제권을 완전히 내려놓기 힘듭니다.']
        },
        {
          depth: 5, title: 'Meta-Awareness', color: '#f59e0b', icon: '👁️',
          question: `[순수 의식] 방금 전까지 고집부리던 나를 고요하게 바라보는 "이 존재"는 누구인가?`,
          tip: `분노하고 좌절하는 에고를 조용히 바라보는 투명한 관찰자, 그것이 진짜 당신입니다.`,
          choices: ['고요하게 모든 것을 지켜보는 침묵의 관찰자를 느꼈습니다.', '생각이 복잡합니다. 천천히 깊은 호흡만 3번 하겠습니다.']
        }
      ],
      RESOURCE: [
        {
          depth: 1, title: 'Somatic Grounding', color: '#3b82f6', icon: '🔍',
          question: `[신체 자각] 머리가 무겁거나, 가슴이 답답하며 오만 가지 생각이 꼬리를 물고 이어지지 않는가?`,
          tip: `${currentIlgan} 특유의 뇌 과부하 상태입니다. 신체보다 뇌의 에너지 소모가 큽니다.`,
          choices: ['네, 머릿속이 복잡하고 생각의 스위치가 꺼지지 않습니다.', '아니요, 현재 머리가 맑고 불필요한 생각이 없습니다.']
        },
        {
          depth: 2, title: 'Cognitive Defusion', color: '#6366f1', icon: '🧠',
          question: `[강박 인지] 아직 일어나지 않은 미래에 대해 부정적인 시뮬레이션을 반복해서 돌리고 있지 않은가?`,
          tip: `그 불안은 뇌가 만들어낸 스팸 메시지입니다. 내용물과 거리를 두세요.`,
          choices: ['네, 최악의 시나리오를 상상하며 걱정하고 있습니다.', '아닙니다, 지금 이 순간의 현실에만 집중하고 있습니다.']
        },
        {
          depth: 3, title: 'Socratic Inquiry', color: '#8b5cf6', icon: '🔗',
          question: `[인지 분리] 내 머리를 맴도는 이 생각들은 '객관적 사실(Fact)'인가, 아니면 '뇌가 만들어낸 허상'인가?`,
          tip: `수많은 생각 중 99%는 쓰레기입니다. 의미 부여를 멈추세요.`,
          choices: ['대부분 객관적 사실이 아닌 나의 상상과 불안임을 자각합니다.', '아직은 이 생각들이 실제 일어날 현실처럼 두렵습니다.']
        },
        {
          depth: 4, title: 'Radical Acceptance', color: '#ec4899', icon: '⚖️',
          question: `[모순 직면] 밀려오는 이 혼란스러운 불안감과 생각들을 억지로 없애려 하지 않고, 그저 구름처럼 흘러가게 둘 수 있는가?`,
          tip: `불안을 통제하려는 시도 자체가 더 큰 불안의 연료가 됩니다.`,
          choices: ['생각을 통제하지 않고 그저 배경음악처럼 흘러가게 두겠습니다.', '생각을 멈추고 싶은데 자꾸만 끌려들어갑니다.']
        },
        {
          depth: 5, title: 'Meta-Awareness', color: '#f59e0b', icon: '👁️',
          question: `[순수 의식] 끊임없이 떠드는 나의 생각(Mind)과 그것을 알아차리는 나(Observer)를 분리할 수 있는가?`,
          tip: `당신은 생각 발전소가 아니라, 그것이 상영되는 텅 빈 스크린입니다.`,
          choices: ['생각과 나를 완전히 분리하여 스크린 상태에 머물렀습니다.', '생각의 흐름이 너무 빨라 관찰자 모드를 유지하기 어렵습니다.']
        }
      ],
      FLOW: [
        {
          depth: 1, title: 'Somatic Grounding', color: '#3b82f6', icon: '🔍',
          question: `[신체 자각] 심장 박동이 빨라지며, 당장 무언가를 말하거나 즉흥적으로 행동하고 싶은 강한 충동이 느껴지는가?`,
          tip: `${currentIlgan} 특유의 발산(도파민) 에너지가 몸을 들뜨게 만들고 있습니다.`,
          choices: ['네, 에너지가 넘쳐서 당장 무엇이든 표출하고 싶습니다.', '아니요, 차분하게 이완된 상태로 행동을 제어하고 있습니다.']
        },
        {
          depth: 2, title: 'Cognitive Defusion', color: '#6366f1', icon: '🧠',
          question: `[강박 인지] "당장 이걸 해버려야 해", "지금 이 말을 꼭 해야 직성이 풀려"라는 조급함이 올라오지 않는가?`,
          tip: `충동적인 '행동 강박'을 인지하세요. 멈추지 않으면 실수로 이어집니다.`,
          choices: ['네, 과정을 생략하고 즉각적인 결과를 보고 싶은 마음이 큽니다.', '아닙니다, 충동에 휩쓸리지 않고 속도를 조절하고 있습니다.']
        },
        {
          depth: 3, title: 'Socratic Inquiry', color: '#8b5cf6', icon: '🔗',
          question: `[인지 분리] 나의 이 행동이나 말은 장기적 가치를 향한 것인가, 아니면 일시적 감정의 배설인가?`,
          tip: `에너지를 낭비하지 마세요. 목적 없는 발산은 공허함만 남깁니다.`,
          choices: ['일시적인 감정적 반응임을 자각하고 한 발 물러서겠습니다.', '장기적 목표에 부합하는 건설적인 아웃풋입니다.']
        },
        {
          depth: 4, title: 'Radical Acceptance', color: '#ec4899', icon: '⚖️',
          question: `[모순 직면] 완벽하게 다듬어지지 않은 상태로 세상에 던져지는 나의 미숙함을, 수치심 없이 있는 그대로 수용할 수 있는가?`,
          tip: `창조적 에너지는 필연적으로 실수와 파격을 동반합니다. 두려워 마세요.`,
          choices: ['결과물의 불완전함을 수용하고 피드백을 기꺼이 감수하겠습니다.', '실수할까 봐 두려워 아직 마음껏 에너지를 발산하지 못하겠습니다.']
        },
        {
          depth: 5, title: 'Meta-Awareness', color: '#f59e0b', icon: '👁️',
          question: `[순수 의식] 폭포수처럼 쏟아지는 감정과 창조성 속에서도, 휩쓸리지 않고 굳건히 닻을 내린 "의식의 중심"을 감지할 수 있는가?`,
          tip: `충동에 올라타 서핑을 즐기되, 파도에 잡아먹히지 마십시오.`,
          choices: ['강렬한 파도 위에서도 고요하게 균형을 잡는 나를 발견했습니다.', '에너지가 너무 강해 아직은 통제하기가 버겁습니다.']
        }
      ],
      PRESSURE: [
        {
          depth: 1, title: 'Somatic Grounding', color: '#3b82f6', icon: '🔍',
          question: `[신체 자각] 위장이 조이거나 명치가 뻐근하며, 호흡이 얕아지는 무거운 억압감(스트레스)을 느끼고 있는가?`,
          tip: `${currentIlgan} 특유의 책임감과 외부 압박이 교감신경을 자극하고 있습니다.`,
          choices: ['네, 어깨가 짓눌리는 듯한 긴장감과 심리적 압박이 느껴집니다.', '아니요, 현재 어떠한 압박 없이 깊고 편안한 호흡을 하고 있습니다.']
        },
        {
          depth: 2, title: 'Cognitive Defusion', color: '#6366f1', icon: '🧠',
          question: `[강박 인지] "내가 다 책임져야 해", "조금이라도 실수하면 끝장이야"라는 극단적인 완벽주의 렌즈를 끼고 있지 않은가?`,
          tip: `당신의 뇌가 책임감을 과장하여 경고등을 울리고 있습니다.`,
          choices: ['네, 실패에 대한 두려움 때문에 극도로 예민해져 있습니다.', '아닙니다, 주어진 짐을 객관적인 크기만큼만 인지하고 있습니다.']
        },
        {
          depth: 3, title: 'Socratic Inquiry', color: '#8b5cf6', icon: '🔗',
          question: `[인지 분리] 나를 짓누르는 이 압박감은 나를 망가뜨리려는 적(Enemy)인가, 아니면 나의 역량을 키우려는 우주의 훈련(Training)인가?`,
          tip: `스트레스(코르티솔)를 성장의 연료로 프레임 리프레이밍(Reframing) 하세요.`,
          choices: ['이 고통은 내 한계를 확장하는 근력 운동의 과정임을 자각합니다.', '아직은 이 상황이 너무 버겁고 도망치고 싶습니다.']
        },
        {
          depth: 4, title: 'Radical Acceptance', color: '#ec4899', icon: '⚖️',
          question: `[모순 직면] 내가 통제할 수 없는 불합리한 외부 환경과 책임을 회피하지 않고, 그저 비바람을 맞듯 온몸으로 뚫고 지나갈 수 있는가?`,
          tip: `진정한 강함은 부러지지 않는 것이 아니라 꺾이고도 다시 일어서는 것입니다.`,
          choices: ['피하지 않겠습니다. 이 무거운 책임을 기꺼이 어깨에 짊어지겠습니다.', '솔직히 지금은 이 무거운 짐을 내려놓고 회피하고 싶습니다.']
        },
        {
          depth: 5, title: 'Meta-Awareness', color: '#f59e0b', icon: '👁️',
          question: `[순수 의식] 태풍의 눈 한가운데처럼, 외부의 엄청난 압박 속에서도 절대 침범받지 않는 당신 내면의 가장 고요한 영토를 확보했는가?`,
          tip: `진정한 주권자(Sovereign)는 환경이 지배할지라도 내면의 고요함을 뺏기지 않습니다.`,
          choices: ['폭풍 속에서도 절대 흔들리지 않는 내 안의 고요한 핵을 찾았습니다.', '압박감이 커서 심호흡을 통해 내면의 코어를 다져야겠습니다.']
        }
      ],
      ACHIEVEMENT: [
        {
          depth: 1, title: 'Somatic Grounding', color: '#3b82f6', icon: '🔍',
          question: `[신체 자각] 눈이 뻑뻑하거나 턱관절에 힘이 들어가며, 시선이 여러 곳으로 바쁘게 흩어지는 극도의 산만함을 경험하고 있는가?`,
          tip: `${currentIlgan} 특유의 도파민 사냥 본능(결과 지향성)이 과활성화된 상태입니다.`,
          choices: ['네, 마음이 급해서 여러 가지를 한꺼번에 처리하려고 쫓기고 있습니다.', '아니요, 현재 한 가지에만 고요하게 시선을 고정하고 있습니다.']
        },
        {
          depth: 2, title: 'Cognitive Defusion', color: '#6366f1', icon: '🧠',
          question: `[강박 인지] "이것도 완벽해야 하고, 저것도 빨리 끝내야 해"라며 통제할 수 없는 수많은 목표를 동시에 쥐려는 강박에 빠져있지 않은가?`,
          tip: `멀티태스킹은 환상입니다. 뇌는 쪼개질수록 성능이 하락합니다.`,
          choices: ['네, 수많은 투두 리스트(To-Do)에 압도되어 초점이 분산되었습니다.', '아닙니다, 불필요한 가지를 치고 명확한 방향을 유지하고 있습니다.']
        },
        {
          depth: 3, title: 'Socratic Inquiry', color: '#8b5cf6', icon: '🔗',
          question: `[인지 분리] 오늘 시도하려는 수많은 일들 중, 진정으로 내 삶을 바꾸고 보상을 가져다주는 단 하나(The One Thing)의 핵심 과녁은 무엇인가?`,
          tip: `나머지 9개는 포기하십시오. 오직 1개의 핀을 쓰러뜨리면 나머지도 도미노처럼 쓰러집니다.`,
          choices: ['가장 중요한 단 하나의 핵심 목표를 명확히 분리해냈습니다.', '아직 모든 것이 다 중요해 보여 가지치기를 하지 못했습니다.']
        },
        {
          depth: 4, title: 'Radical Acceptance', color: '#ec4899', icon: '⚖️',
          question: `[모순 직면] 모든 것을 다 가지려는 욕심을 꺾고, 불필요한 기회들을 내 손으로 쓰레기통에 처박는 상실감을 묵묵히 견뎌낼 수 있는가?`,
          tip: `포기(Give up)하는 용기가 있어야 진정한 쟁취(Achieve)가 가능합니다.`,
          choices: ['더 큰 쟁취를 위해 가치 없는 것들을 과감하게 버리겠습니다.', '버렸다가 나중에 후회할까 봐 아직 손아귀를 펴지 못하겠습니다.']
        },
        {
          depth: 5, title: 'Meta-Awareness', color: '#f59e0b', icon: '👁️',
          question: `[순수 의식] 세상의 수많은 소음이 음소거되고, 오직 당신의 단 하나의 타겟(목표물)만 레이저처럼 선명하게 빛나는 완전한 몰입 상태에 진입했는가?`,
          tip: `에고(Ego)를 지우십시오. 오직 '행위(Do)'와 '목표물'만 존재하는 순수 관찰 상태입니다.`,
          choices: ['모든 소음이 사라지고, 목표를 향한 차가운 몰입에 진입했습니다.', '아직 미련이 남아 시야가 흐립니다. 호흡으로 초점을 모으겠습니다.']
        }
      ]
    };

    return MODULES[relation] || MODULES['SYNC'];
  }, [dayMasterHanja, harmony]);

  const biorhythm = useMemo(() => {
    if (!birthDate) return null;
    return calculateBiorhythm(birthDate);
  }, [birthDate]);

  const bioSajuAdvice = useMemo(() => {
    if (!biorhythm || !harmony) return null;
    return getBioSajuAdvice(dominantElement, biorhythm, harmony);
  }, [dominantElement, biorhythm, harmony]);

  if (!dayMasterHanja && !birthDate) return null;

  const today      = new Date();
  const dateLabel  = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  const totalScore = harmony && biorhythm
    ? Math.round(harmony.painLevel * 0.5 + biorhythm.overallScore * 0.5)
    : harmony ? harmony.painLevel : biorhythm ? biorhythm.overallScore : 50;
  const energyColor = harmony?.energyColor ?? '#7c3aed';

  const verdict = harmony ? harmony.painReason : '오늘의 코칭을 확인하세요';
  const mission = harmony ? harmony.shiftMission : null;

  const TABS: { id: TabType; label: string; emoji: string }[] = [
    { id: 'harmony',  label: '일진 에너지',    emoji: '⚡' },
    { id: 'bio',      label: '바이오 게이지',  emoji: '📊' },
    { id: 'akashic',  label: '아카식 레코드',  emoji: '🌌' },
    { id: 'patch',    label: '3S 패치',        emoji: '💉' },
    { id: 'deepscan', label: '딥 스캔 (경고)', emoji: '🚨' },
    { id: 'mindreset',label: '마음 리셋',      emoji: '✨' },
    { id: 'livesync', label: 'Live Sync [PRO]',emoji: '📡' },
  ];


  return (
    <div className="w-full mb-6">

      {/* ══ 프리미엄 히어로 카드 ══ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl mb-2 cursor-pointer select-none"
        onClick={() => setIsExpanded(p => !p)}
        style={{
          background: `linear-gradient(145deg, ${energyColor}22 0%, #0b1018 55%, ${energyColor}10 100%)`,
          border: `1px solid ${energyColor}35`,
          boxShadow: `0 8px 40px ${energyColor}18`,
        }}
      >
        {/* 스푸마토 글로우 — 우상단 */}
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{ width: 240, height: 240, top: -80, right: -50, backgroundColor: energyColor + '20' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* 스푸마토 글로우 — 좌하단 */}
        <motion.div
          className="absolute rounded-full blur-2xl pointer-events-none"
          style={{ width: 160, height: 160, bottom: -40, left: 20, backgroundColor: energyColor + '12' }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="relative z-10 p-5">
          {/* 상단 메타 바 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-slate-400 font-mono">{dateLabel}</span>
              {harmony && (
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                  style={{ color: energyColor, borderColor: energyColor + '40', backgroundColor: energyColor + '12' }}
                >
                  {harmony.todayGan}{harmony.todayZhi} · {harmony.userDayMaster}일간
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* 스트릭 뱃지 */}
              <motion.div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10"
                animate={{ scale: streak >= 7 ? [1, 1.06, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs">{streak >= 7 ? '🔥' : streak >= 3 ? '⭐' : '🌱'}</span>
                <span className="text-[10px] font-bold text-amber-400">{streak}일 연속</span>
              </motion.div>
              {/* 카운트다운 */}
              <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span className="tabular-nums">{countdown}</span>
              </div>
              {/* 토글 */}
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </motion.div>
            </div>
          </div>

          {/* 에너지 링 + 판정문 */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="38" fill="none" stroke="#ffffff07" strokeWidth="7" />
                <motion.circle
                  cx="45" cy="45" r="38"
                  fill="none"
                  stroke={energyColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  transform="rotate(-90 45 45)"
                  initial={{ strokeDashoffset: `${2 * Math.PI * 38}` }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 38 * (1 - totalScore / 100)}` }}
                  transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
                  style={{ filter: `drop-shadow(0 0 8px ${energyColor}cc)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-2xl font-black text-white leading-none"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
                >
                  {totalScore}
                </motion.span>
                <span className="text-[8px] text-slate-500 font-mono mt-0.5">에너지</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                {harmony && <span className="text-xl">{harmony.energyEmoji}</span>}
                <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: energyColor }}>
                  {harmony ? `${harmony.relation} · 일진코드` : 'ANALYZING'}
                </span>
              </div>
              <p className="text-[17px] font-black text-white break-keep leading-snug tracking-tight">
                {verdict}
              </p>
              {harmony?.microCoaching && (
                <p className="mt-1.5 text-[9.5px] text-slate-400 font-medium tracking-wide break-keep leading-relaxed opacity-90">
                  {harmony.microCoaching}
                </p>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-500">
                <motion.span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: energyColor }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                오늘 코칭 {countdown} 후 갱신
              </div>
            </div>
          </div>

          {/* 오늘의 단 하나의 핵심 미션 */}
          {mission && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 p-4 rounded-2xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${energyColor}28, ${energyColor}08)`,
                border: `1px solid ${energyColor}45`,
              }}
            >
              <div className="absolute -right-2 -top-2 text-[64px] opacity-[0.06] select-none pointer-events-none leading-none">
                {harmony?.energyEmoji}
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <div
                  className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
                  style={{ backgroundColor: energyColor + '30', color: energyColor }}
                >①</div>
                <div>
                  <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: energyColor }}>
                    TODAY&apos;S SINGLE MISSION
                  </p>
                  <p className="text-[12px] font-bold text-white break-keep leading-relaxed">{mission}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ══ 탭 콘텐츠 영역 ══ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-visible"
          >
            <div className="bg-[#0b1018]/90 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-md">

              {/* 프리미엄 탭 (수평 스크롤 지원 및 페이드 힌트) */}
              <div className="relative mb-5">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 scroll-smooth">
                  {TABS.map(tab => {
                    const active = activeTab === tab.id;
                    const isDeepScan = tab.id === 'deepscan';
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 whitespace-nowrap ${isDeepScan && !active ? 'animate-pulse' : ''}`}
                        style={{
                          color: active ? '#fff' : (isDeepScan ? '#f87171' : '#94a3b8'),
                          background: active
                            ? (isDeepScan
                                ? 'linear-gradient(135deg, #7f1d1d60, #450a0a30)'
                                : `linear-gradient(135deg, ${energyColor}45, ${energyColor}20)`)
                            : 'rgba(255, 255, 255, 0.03)',
                          border: active
                            ? (isDeepScan ? '1px solid #dc262660' : `1px solid ${energyColor}60`)
                            : (isDeepScan ? '1px solid #7f1d1d50' : '1px solid #ffffff08'),
                          boxShadow: active
                            ? (isDeepScan ? '0 0 18px rgba(239,68,68,0.30)' : `0 0 18px ${energyColor}28`)
                            : undefined,
                        }}
                      >
                        <span>{tab.emoji}</span>
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Right Scroll Fade Mask Hint */}
                <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-[#0b1018] to-transparent pointer-events-none rounded-r-xl" />
              </div>

              {/* 탭 콘텐츠 */}
              <AnimatePresence mode="wait">
                {activeTab === 'harmony' && harmony && (
                  <motion.div key="harmony"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <EnergyHarmonySection harmony={harmony} />
                    <TimeSlotGuide harmony={harmony} />
                    <AffirmationCard harmony={harmony} dayMasterHanja={dayMasterHanja} />
                  </motion.div>
                )}

                {activeTab === 'bio' && (
                  <motion.div key="bio"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }} className="space-y-4"
                  >
                    {biorhythm ? (
                      <>
                        <div
                          className="relative flex items-center justify-between rounded-2xl p-4 overflow-hidden border"
                          style={{
                            borderColor: biorhythm.overallScore > 60 ? '#10b98140' : biorhythm.overallScore > 40 ? '#f59e0b40' : '#ef444440',
                            background: biorhythm.overallScore > 60 ? 'linear-gradient(135deg,#10b98112,transparent)' : biorhythm.overallScore > 40 ? 'linear-gradient(135deg,#f59e0b12,transparent)' : 'linear-gradient(135deg,#ef444412,transparent)',
                          }}
                        >
                          <div>
                            <p className="text-[10px] text-slate-400 font-mono tracking-widest mb-1">오늘 통합 컨디션 지수</p>
                            <p className="text-3xl font-black text-white">{biorhythm.overallScore}<span className="text-sm text-slate-400 ml-1 font-normal">/ 100</span></p>
                            <p className="text-[10px] text-slate-500 mt-1">신체 {biorhythm.physicalLabel} · 감정 {biorhythm.emotionalLabel} · 지성 {biorhythm.intellectualLabel}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl mb-1">{biorhythm.overallScore > 60 ? '💪' : biorhythm.overallScore > 40 ? '🌤️' : '😴'}</div>
                            <div className={`text-sm font-black ${biorhythm.overallScore > 60 ? 'text-emerald-400' : biorhythm.overallScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {biorhythm.overallScore > 60 ? '최상 컨디션' : biorhythm.overallScore > 40 ? '보통 상태' : '충전 필요'}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <BiorhythmBar type="physical"     label={`신체 (${biorhythm.physicalLabel})`}     value={biorhythm.physical}     color="#ef4444" />
                          <BiorhythmBar type="emotional"    label={`감정 (${biorhythm.emotionalLabel})`}    value={biorhythm.emotional}    color="#8b5cf6" />
                          <BiorhythmBar type="intellectual" label={`지성 (${biorhythm.intellectualLabel})`} value={biorhythm.intellectual} color="#3b82f6" />
                        </div>
                        {(() => {
                          const p = biorhythm.physical, e = biorhythm.emotional, i = biorhythm.intellectual;
                          let type='', icon='', desc='';
                          if      (p>40&&i>40)             { type='고강도 실행의 날'; icon='🚀'; desc='신체·지성이 모두 상승 중. 어렵고 복잡한 프로젝트를 전력으로 돌파하기 최적의 날입니다.'; }
                          else if (e>40&&i>40)             { type='창의·소통의 날';   icon='🎨'; desc='감정·지성이 상승 중. 새로운 창작·기획·중요한 대화에 에너지를 넘기세요.'; }
                          else if (p>40&&e>40)             { type='연결·활동의 날';   icon='🤝'; desc='신체·감정이 상승 중. 팀 협업·네트워킹·외부 활동에 에너지를 투자하세요.'; }
                          else if (p<-40&&e<-40&&i<-40)   { type='완전 회복의 날';   icon='🔋'; desc='세 지수 모두 저점. 충분한 수면과 휴식이 가장 생산적인 행동입니다.'; }
                          else                             { type='균형 유지의 날';   icon='⚖️'; desc='안정된 상태. 익숙한 루틴을 정밀하게 수행하는 날로 활용하세요.'; }
                          return (
                            <div className="bg-slate-800/40 rounded-xl p-3.5 border border-white/[0.06]">
                              <div className="flex items-center gap-2 mb-1.5"><TrendingUp className="w-3.5 h-3.5 text-cyan-400" /><span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">오늘 최적 업무 유형</span></div>
                              <p className="text-sm font-bold text-white mb-1">{icon} {type}</p>
                              <p className="text-[11px] text-slate-300 leading-relaxed break-keep">{desc}</p>
                            </div>
                          );
                        })()}
                        {bioSajuAdvice && (
                          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-purple-500/30 shadow-lg shadow-purple-500/5 mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-purple-400 fill-purple-400/20" />
                              <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 tracking-widest uppercase">
                                기질 데이터와 신체의 융합 분석
                              </span>
                            </div>
                            <p className="text-[11.5px] text-slate-200 leading-relaxed break-keep font-medium">
                              {bioSajuAdvice}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8"><p className="text-xs text-slate-500">생년월일 정보가 필요합니다.<br />만세력에서 입력해 주세요.</p></div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'akashic' && (
                  <motion.div key="akashic"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AkashicRecordSection dayMasterHanja={dayMasterHanja} sajuData={reportData} harmony={harmony} biorhythm={biorhythm} />
                  </motion.div>
                )}

                {activeTab === 'patch' && harmony && (
                  <motion.div key="patch"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-[10px] text-slate-500 mb-3 font-mono tracking-widest">TODAY&apos;S PSYCHOLOGICAL VACCINE 💉</p>
                    <DailyPatchSection 
                      steps={dynamicSteps} 
                      isLoading={isLoadingSteps} 
                      onComplete={(ans) => setDailyChecklistAnswers(ans)} 
                    />
                  </motion.div>
                )}

                {activeTab === 'deepscan' && harmony && (
                  <motion.div key="deepscan"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <DeepScanSection sajuData={reportData} harmony={harmony} biorhythm={biorhythm} />
                  </motion.div>
                )}

                {activeTab === 'mindreset' && (
                  <motion.div key="mindreset"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MindResetSection />
                  </motion.div>
                )}

                {activeTab === 'livesync' && harmony && (
                  <motion.div key="livesync"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LiveSyncSection sajuData={reportData?.saju || {}} harmony={harmony} biorhythm={biorhythm} />
                  </motion.div>
                )}

                {(activeTab === 'harmony' || activeTab === 'patch' || activeTab === 'deepscan') && !harmony && (

                  <motion.div key="no-data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                    <p className="text-xs text-slate-500">사주 정보가 필요합니다.<br />만세력에서 생년월일을 입력해 주세요.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI 코치 연결 CTA */}
              {harmony && (
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { window.location.href = '/master-core'; }}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm tracking-wide relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${energyColor}38, ${energyColor}18)`,
                      border: `1px solid ${energyColor}55`,
                      color: '#fff',
                      boxShadow: `0 4px 24px ${energyColor}22`,
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{harmony.userDayMaster} 일간 맞춤 AI 코치와 지금 대화하기</span>
                    <span className="text-lg">{harmony.energyEmoji}</span>
                  </motion.button>
                  <p className="text-center text-[9px] text-slate-600 font-mono mt-2">
                    {harmony.userDayMaster} × {harmony.todayGan}{harmony.todayZhi} 코칭코드가 AI에 자동 주입됩니다
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

}
