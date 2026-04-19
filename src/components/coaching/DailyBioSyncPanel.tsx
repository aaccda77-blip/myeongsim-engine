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
import { Zap, Activity, Calendar, ChevronDown, Clock, CheckCircle2, Star, MessageCircle, TrendingUp, Shield } from 'lucide-react';

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
  
  const RELATION_LABELS: Record<string, string> = {
    SYNC: '동질의 거울', RESOURCE: '생조의 비', FLOW: '발산의 물결', PRESSURE: '압박의 불꽃', ACHIEVEMENT: '쟁취의 과녁',
  };

  // ── 관계별 상세 코칭 데이터 (예시 + 행동 팁 포함)
  const RELATION_DETAIL: Record<string, {
    headline: string;
    detail: string;
    examples: string;
    actionTip: string;
    keywords: string[];
    keywordExplanations: Record<string, string>;
  }> = {
    SYNC: {
      headline: '🌀 [동질의 날] — 거울 속의 나와 마주하는 날',
      detail: `오늘은 당신의 일간(${harmony.userDayMaster})과 완전히 동일한 주파수의 에너지(${harmony.todayGanElement})가 들어오는 상태입니다. 디폴트 모드 네트워크(DMN)가 과활성화되어 자의식이 강해지고 주관이 평소보다 확고해집니다. 강력한 추진력이 되기도 하나, 인지 편향에 의한 마찰이 생길 수 있습니다.`,
      examples: `💡 예를 들어, 팀원의 의견이 틀리지 않아도 자신의 방식을 고집하게 되거나, 익숙한 루틴에서 벗어나는 것이 평소보다 불편하게 느껴집니다. 반대로 이미 잘하고 있는 내적/독립적 분야에서는 최고점의 안정적 퍼포먼스가 나오는 축복받은 날이기도 합니다.`,
      actionTip: `🪞 오늘의 실전 팁: 오늘 논쟁이 발생하면 의견을 관철하기 전 딱 1시간만 결정을 뒤로 유보하세요. 자아를 잠시 내려놓고 "타인을 나의 상태를 비추는 거울로 쓴다"고 생각하면 인간관계 마찰을 창조적 에너지로 100% 전환할 수 있습니다.`,
      keywords: ['자기 객관화', '거울 효과', '주관 유지', '협력'],
      keywordExplanations: {
        '자기 객관화': '메타인지(Metacognition)를 담당하는 뇌 부위를 가동하여, 제3자의 시선으로 나의 고집을 분리해 관찰하세요.',
        '거울 효과': '타인이 나에게 보이는 반응은 내 무의식을 비추는 거울(Mirroring)입니다. 상대를 비난하기 전 내 상태를 먼저 점검해야 마찰이 풀립니다.',
        '주관 유지': '타인의 기준에 휘둘릴 필요 없습니다. 자아 탄력성이 매우 높으므로 내가 세운 원칙을 묵묵히 유지하는 편이 가장 안전합니다.',
        '협력': '단독 행동 시 부딪히기 쉬운 날입니다. 나의 에고(Ego)를 살짝 내려놓고 "우리"라는 집단 보상으로 뇌의 목표를 재설정하세요.',
      }
    },
    RESOURCE: {
      headline: '✨ [수용의 날] — 우주가 당신에게 옥시토신을 쏟아붓는 날',
      detail: `오늘은 주변 환경이 당신의 일간(${harmony.userDayMaster})에게 아낌없이 양분을 공급하는 생조(生助) 상태입니다. 부교감 신경계가 우위를 점해 뇌가 깊은 수용(Rest and Digest) 모드에 진입합니다. 스펀지가 물을 빨아들이듯 지식 폭발과 통찰 흡수 능력이 극대화됩니다.`,
      examples: `💡 예를 들어, 오늘 읽은 책 한 챕터나 강의 영상 하나가 평소보다 훨씬 선명하게 장기 기억(Hippocampus)에 꽂힙니다. 이전에 흘려들었던 멘토의 조언이 갑자기 '아, 맞아!' 하는 깨달음의 시냅스로 강력하게 연결되는 날입니다.`,
      actionTip: `📚 오늘의 실전 팁: 무리하게 아웃풋을 기획하거나 행동 에너지를 소모하지 마세요. 그 대신, 평소 미루어두었던 가장 어려운 전문 서적을 30분 읽거나 멘토에게 조언을 구하세요. 오늘 당신이 입력한 1의 지식은 내일 10의 무기가 됩니다.`,
      keywords: ['학습 집중', '통찰 연결', '수용력', '안전 기지'],
      keywordExplanations: {
        '학습 집중': '해마(Hippocampus)의 정보 흡수력이 최고조에 이른 상태입니다. 오늘은 단순 노동보다 심도 깊은 독서나 지식 습득에 시간을 투자하세요.',
        '통찰 연결': '파편화되었던 지식들이 뇌 속에서 하나의 거대한 시냅스로 연결됩니다. 깨달음을 얻었을 때 휘발되지 않도록 즉시 기록하세요.',
        '수용력': '타인의 충고나 새로운 시스템을 튕겨내지 말고 부드럽게 흡수하세요. 무의식이 이질적인 정보를 가장 거부감 없이 받아들이는 날입니다.',
        '안전 기지': '옥시토신 분비가 필요합니다. 스트레스 환경을 떠나 내가 가장 깊이 신뢰하고 안심할 수 있는 환경(Secure Base)에 머무는 것이 좋습니다.',
      }
    },
    FLOW: {
      headline: '🌊 [발산의 날] — 도파민의 거침없는 흐름을 허락하세요',
      detail: `오늘은 당신 내부의 에너지(${harmony.userDayMaster})가 세상 밖으로 거침없이 뻗어가는 생출(生出) 상태입니다. 전두엽의 아이디어 발산 회로가 열리며(Flow State), 표현력과 창조적 충동이 최고조에 달합니다. 통제하려 하지 말고 자연스레 흐름을 타는 유연성이 핵심입니다.`,
      examples: `💡 예를 들어, 긴장되어 쓰지 못했던 이메일을 순식간에 작성하게 되고, 복잡했던 기획안이 막힘없이 쏟아집니다. 아이디어가 넘치고 무언가를 세상에 던지고 싶은 충동이 강합니다. 단, 에너지가 밖으로 빠르게 빠져나가므로 인지적 방전 속도도 빠릅니다.`,
      actionTip: `⚡ 오늘의 실전 팁: 오전 11시 이전에 가장 과감한 제안이나 기획안을 밖으로 던지세요! 에너지가 충만한 오전에 아웃풋을 모두 쏟아낸 후, 오후 3시 이후에는 반드시 모든 연결을 끊고 뇌를 강건하게 식히는 완전한 휴식 시간을 30분 이상 가져야 번아웃을 막습니다.`,
      keywords: ['창조성 폭발', '아이디어 실행', '유연성', '인지적 방전 주의'],
      keywordExplanations: {
        '창조성 폭발': '전두엽의 발산 회로가 폭주하고 있습니다. 논리적 검열을 끄고 머릿속 아이디어를 즉각 문서화나 예술적 형태로 쏟아내세요.',
        '아이디어 실행': '도파민 에너지의 흐름이 실현을 향해 열려 있습니다. 생각에 머물지 말고 가장 작고 가벼운 단위의 행동으로 즉시 옮기세요.',
        '유연성': '계획이나 규칙에 얽매일수록 능률이 떨어집니다. 환경의 흐름(Flow)에 몸을 맡기고 즉흥적인 아이디어가 자연스럽게 나오도록 허락하세요.',
        '인지적 방전 주의': '에너지 아웃풋이 극심해 뇌가 매우 빠르게 피로(Burnout)해집니다. 일정 소화 후 반드시 강제 디톡스와 시각적 차단을 병행해야 합니다.',
      }
    },
    PRESSURE: {
      headline: '🔥 [압박의 날] — 가장 뜨거운 스트레서가 당신의 뇌를 리모델링합니다',
      detail: `오늘은 외부의 강력한 지배 에너지(${harmony.todayGanElement})가 당신(${harmony.userDayMaster})을 강하게 압박하는 상태입니다. 편도체가 자극을 받아 투쟁-도피(Fight-or-Flight) 반응이 유발되기 쉬우나, 이는 당신의 한계를 깨부수고 실행 기능(Executive Function)을 극대화시키는 우주의 훈련 세션입니다. 순도 높은 강철은 불구덩이에서 완성됩니다.`,
      examples: `💡 예를 들어, 상사의 까다로운 지시, 갑작스러운 클레임, 무거운 책임감이 평소보다 어깨를 짓누를 수 있습니다. 이를 '재수 없는 사건'으로 인지하면 에너지가 고갈되지만, '나의 관리 능력과 그릇을 확장할 훈련장'으로 프레임을 전환하면 성장 인자가 폭발합니다.`,
      actionTip: `⚔️ 오늘의 실전 팁: 평소 가장 두렵고 불편하게 미뤄왔던 업무나 대화 하나에만 딱 90분을 온전히 쏟아 정면 돌파하세요. 이 압박 에너지를 역이용해 피하지 않고 과제를 완수해내면, 뇌의 회복탄력성이 급등하며 이번 주 내내 압도적인 자신감이 지속됩니다.`,
      keywords: ['정면 돌파', '실행 제어', '스트레스 역이용', '극기'],
      keywordExplanations: {
        '정면 돌파': '문제를 피하려 할수록 뇌의 불안 스위치가 커집니다. 가장 불편한 대화, 가장 어려운 업무를 첫 번째로 직면하여 압박 고리를 끊어내세요.',
        '실행 제어': '감정적인 뇌(편도체)의 폭주를 시스템으로 억제하십시오. 전전두엽의 강한 통제력으로 루틴과 규칙에 나를 가두고 기계처럼 해내세요.',
        '스트레스 역이용': '오늘 쏟아지는 자극은 당신의 능력을 검증하는 모의고사입니다. 스트레스 홀몬인 코르티솔을 집중력의 무기로 치환하여 과업을 장악하세요.',
        '극기': '스스로와의 싸움입니다. 포기하고 싶은 순간 딱 5분만 더 지속하면 뇌의 회복탄력성(Resilience)이 영구적으로 한 단계 확장됩니다.',
      }
    },
    ACHIEVEMENT: {
      headline: '🎯 [쟁취의 날] — 도파민 사냥 본능으로 타겟을 저격하세요',
      detail: `오늘은 당신(${harmony.userDayMaster})이 대상을 온전히 통제하고 획득할 수 있는 성취 시점입니다. 목표를 포착하면 뇌의 보상 회로(Reward Circuit)가 예민하게 반응합니다. 단 1개의 과녁(Target) 조준에 성공하면 거대한 열매를 얻지만, 2~3개로 초점을 분산시키면 시냅스가 낭비되어 아무것도 얻지 못합니다.`,
      examples: `💡 예를 들어, 수많은 To-Do 리스트를 동시에 다 해내고 싶은 욕망이 솟구칩니다. 그러나 오늘 가장 큰 성과는 '단순 반복 업무 10개'가 아닌 '수익과 직접 연결되는 치명적 결정 1개'에서 나옵니다. 통제력을 전방위로 분산하지 않는 결단력이 필요합니다.`,
      actionTip: `🎯 오늘의 실전 팁: 오늘 시작하려 했던 10개의 일 중, 오직 목표 달성에 직접적인 타격을 주는 단 하나의 과제만 남기고 9개를 무자비하게 쳐내세요(Selective Attention). 그리고 남은 단 하나의 타겟에 오늘 사용 가능한 모든 시간과 신경통로를 모조리 조준사격하세요.`,
      keywords: ['선택과 집중', '과감한 타겟팅', '보상 획득', '불필요함 제거'],
      keywordExplanations: {
        '선택과 집중': '수많은 선택지가 뇌를 마비시킵니다. "선택적 주의력"을 가동하여 가장 핵심적인 1가지 문제에 모든 시냅스를 몰빵하세요.',
        '과감한 타겟팅': '무엇을 사냥할지 목표(Target)를 아주 구체적으로 설정하세요. 과녁이 명확해지는 순간 도파민성 추동력이 정확하게 꽂힙니다.',
        '보상 획득': '오늘은 내가 애쓴 만큼의 결과를 확실히 가져오는 날입니다. 거래나 협상의 순간, 타협하지 말고 나의 이익(보상)을 적극 주장하세요.',
        '불필요함 제거': '목표 달성에 무가치한 요소들을 가지치기하는 결단이 필요합니다. 에너지를 분산시키는 자잘한 미션들을 당장 리스트에서 지우세요.',
      }
    },
  };

  const rd = RELATION_DETAIL[harmony.relation] || RELATION_DETAIL['PRESSURE'];

  return (
    <div className="space-y-4">
      {/* 헤더 구역 */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/10" style={{ backgroundColor: `${harmony.energyColor}22` }}>
            {harmony.energyEmoji}
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest">오늘 일진 · {harmony.todayGan}{harmony.todayZhi}</p>
            <p className="text-sm font-bold text-white mt-0.5">
              일간(<span style={{ color: harmony.energyColor }}>{harmony.userDayMaster}</span>) × 오늘({harmony.todayGanElement}) ={' '}
              <span className="px-1.5 py-0.5 rounded text-xs ml-1 bg-white/5 border border-white/10 flex-inline items-center" style={{ color: harmony.energyColor }}>
                {RELATION_LABELS[harmony.relation] || harmony.relation}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 에너지 마찰도 게이지 */}
      <div className="bg-slate-900/40 rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:bg-slate-900/60 hover:border-white/10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3.5 focus:outline-none"
        >
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-slate-400 font-medium tracking-wide">
              오늘의 <span className="text-white font-bold drop-shadow">에너지 마찰도</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="inline-block ml-1.5 text-[9px] text-slate-500">▼</motion.span>
            </span>
            <span className="text-lg font-black tracking-tighter" style={{ color: harmony.energyColor, textShadow: `0 0 10px ${harmony.energyColor}88` }}>{harmony.painLevel}%</span>
          </div>
          <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5 relative cursor-pointer">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${harmony.painLevel}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full relative"
              style={{ background: `linear-gradient(to right, ${harmony.energyColor}44, ${harmony.energyColor})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-white/20 skew-x-12" />
              </div>
            </motion.div>
          </div>
        </button>

        {/* 고도화된 상세 코칭 팝업 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="px-3.5 pb-3.5 space-y-2.5">

                {/* ① 헤드라인 + 본문 해설 */}
                <div className="p-4 bg-slate-800/80 rounded-xl relative overflow-hidden shadow-inner border border-white/5">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: harmony.energyColor }} />
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5 relative z-10" style={{ color: harmony.energyColor }}>
                    <Zap className="w-3.5 h-3.5" />
                    명심 코치의 한 줄 해설
                  </h4>
                  <p className="text-[11px] font-bold mb-2 relative z-10 break-keep" style={{ color: harmony.energyColor }}>
                    {rd.headline}
                  </p>
                  <p className="text-[12px] text-slate-200 leading-[1.7] font-medium break-keep relative z-10">
                    {rd.detail}
                  </p>
                </div>

                {/* ② 실생활 예시 */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: harmony.energyColor }} />
                  <p className="text-[11px] text-slate-300 leading-[1.7] break-keep pl-3">
                    {rd.examples}
                  </p>
                </div>

                {/* ③ 오늘의 실전 팁 */}
                <div className="p-3.5 rounded-xl border relative overflow-hidden" style={{ borderColor: `${harmony.energyColor}40`, backgroundColor: `${harmony.energyColor}08` }}>
                  <p className="text-[11px] leading-[1.7] font-bold break-keep" style={{ color: harmony.energyColor }}>
                    {rd.actionTip}
                  </p>
                  <div className="mt-2 text-[9px] text-slate-500 font-bold border-t border-white/5 pt-2 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Myeongsim OS / 일진 맞춤 패치 완료
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 하단 돌파 키워드 — 뉴로 해설 팝업 인터랙션 축가 */}
      <div className="space-y-1.5 px-1 relative">
        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
          돌파 키워드 🔑 <span className="opacity-60 text-[8px]">(키워드 클릭)</span>
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {rd.keywords.map((kw) => (
            <button
              onClick={() => setActiveKeyword(activeKeyword === kw ? null : kw)}
              key={kw}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest shadow-sm transition-transform hover:scale-105 active:scale-95"
              style={{
                color: harmony.energyColor,
                backgroundColor: activeKeyword === kw ? `${harmony.energyColor}30` : `${harmony.energyColor}15`,
                border: activeKeyword === kw ? `1px solid ${harmony.energyColor}80` : `1px solid ${harmony.energyColor}40`
              }}
            >
              #{kw}
            </button>
          ))}
        </div>
        
        {/* 키워드 클릭 시 나오는 뉴로-심리 코칭 해설 */}
        <AnimatePresence>
          {activeKeyword && (
            <motion.div
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              className="overflow-hidden mt-1"
            >
              <div 
                className="mt-1.5 p-3.5 bg-[#0e1623] rounded-xl border text-[11px] leading-[1.6] break-keep text-slate-300"
                style={{ 
                  borderColor: `${harmony.energyColor}30`, 
                  boxShadow: `0 4px 15px rgba(0,0,0,0.3)`
                }}
              >
                <div className="font-bold mb-1.5 flex items-center gap-1.5 text-white/90">
                  <span className="text-xs">🧠</span> [뉴로-심리 관점] 셀프 자각
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  {/* 선택된 키워드에 정확히 매칭되는 뉴로 해설 렌더링 */}
                  {rd.keywordExplanations && activeKeyword && rd.keywordExplanations[activeKeyword] && (
                    <React.Fragment>
                      {rd.keywordExplanations[activeKeyword]}
                    </React.Fragment>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Feature 4: 시간대별 행동 매뉴얼 (NEW)
// ─────────────────────────────────────────────
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

  const NEURO_ACTIONS: Record<number, Record<string, string>> = {
    0: { // 오전
      SYNC:        '거울 뉴런(Mirror Neuron)이 활발합니다. 어제의 나를 복기하고 나의 핵심 가치와 일치하는 가장 중요한 개인 프로젝트 하나를 이 시간에 시작하세요.',
      RESOURCE:    '해마(Hippocampus)의 정보 흡수력이 최고조입니다. 정보 검색, 심도 있는 독서, 혹은 어려운 기획안 분석에 오전 에너지를 온전히 투자하세요.',
      FLOW:        '디폴트 모드 네트워크(DMN)와 전두엽이 폭발적으로 연결됩니다. 브레인스토밍, 기획 회의, 아이디어 도출을 위해 틀을 깨는 행동을 바로 실행하세요.',
      PRESSURE:    '코르티솔(Cortisol)이 자연스럽게 가장 높은 시기. 가장 불편하고 압박감이 큰 업무를 이 오전 시간에 맨 먼저 해치워야 전전두엽이 가벼워집니다.',
      ACHIEVEMENT: '외적 보상 회로가 강하게 열리는 시간입니다. 수익이나 구체적인 성과, 중요한 계약 체결 결정을 분산시키지 말고 오전 내에 집중 타격하세요.',
    },
    1: { // 오후
      SYNC:        '나의 방식을 타인과 연결하는 시간입니다. 내가 옳다고 생각하는 것만 밀어붙이지 말고 타인과 "유연하게 조율"하는 데 리더십 에너지를 쓰세요.',
      RESOURCE:    '오전에 흡수한 정보를 가공하고 체화하는 시간. 새로운 일을 더 벌리지 말고 이미 가진 지식을 정리하여 문서화하거나 타인에게 공유해보세요.',
      FLOW:        '오전의 아이디어를 물리적 결과물로 뽑아내는 딥워크(Deep Work)의 시간. 외부 카톡과 이메일을 1시간만 차단하고 아웃풋 에너지를 단번에 발산하세요.',
      PRESSURE:    '편도체를 자극하는 뜻밖의 스트레스 상황이 발생할 수 있습니다. 즉각 감정적으로 반응하지 말고, 심호흡 후 논리적인 뇌로 무장해 이행하세요.',
      ACHIEVEMENT: '선택적 주의력(Selective Attention)을 최고로 발휘해야 합니다. 자잘한 업무 5개를 과감히 버리고, 오늘 꼭 끝내야 할 핵심 타겟 1개만 물고 늘어지세요.',
    },
    2: { // 저녁
      SYNC:        '자의식이 평온해지는 시간입니다. 오늘 내가 겪은 마찰이 있었다면 "관계성"에서 얻은 교훈을 단 두 줄의 일기로 적어 메타인지를 1% 높이세요.',
      RESOURCE:    '옥시토신 분비가 필요한 시간입니다. 존경하는 멘토나 평온을 주는 책, 가족 등 나에게 정서적 안전 기지(Secure Base)를 제공하는 것에 집중하세요.',
      FLOW:        '발산된 에너지를 수거하고 교감신경을 낮춰야 할 때입니다. 가벼운 운동이나 산책으로 뇌에 갇힌 잔여 텐션을 신체 밖으로 흘려보내 번아웃을 예방하세요.',
      PRESSURE:    '오늘 당신을 짓누른 압박감을 이겨낸 당신 스스로를 칭찬하세요. "오늘 단련된 나"에게 주는 가장 확실하고 달콤한 메타 보상을 허락하세요.',
      ACHIEVEMENT: '오늘 명중시킨 타겟 성과에 대해 시각적으로 명확히 기록하세요. 쟁취의 쾌감을 뇌가 인식하는 순간, 당신의 내일 동력은 200% 우상향합니다.',
    },
    3: { // 심야
      SYNC:        '나에게 집중하던 에너지를 거대한 내부 무의식에 맡기는 시간입니다. 뇌의 쿨다운을 위해 완전히 긴장을 풀고 스마트폰 시각 자극에서 멀어지세요.',
      RESOURCE:    '오늘 흡수한 영양분이 수면 중 당신의 뇌세포 장기 기억으로 완전히 전환됩니다. 걱정을 내려놓고 가장 편안한 상태로 잠자리에 드는 영성에 집중하세요.',
      FLOW:        '도파민 활성화를 셧다운할 타이밍입니다. 쇼츠나 자극적인 릴스 시청을 즉각 중단하고, 호흡 명상으로 뇌파를 알파(Alpha) 파동으로 떨어뜨리세요.',
      PRESSURE:    '수면 중에 코르티솔 분비량이 정상 수치로 회복되어야 내일의 훈련을 이겨냅니다. 모든 불안 스위치를 강제로 끄고 나의 생체 리듬을 우주에 맡기세요.',
      ACHIEVEMENT: '내일 새로 조준할 가장 크고 가치 있는 타겟 하나만 머릿속에 가볍게 스케치한 뒤, 집착을 비우고 즉시 시각의 문을 차단하세요.',
    },
  };

  const actionText = NEURO_ACTIONS[selectedSlot][harmony.relation] || NEURO_ACTIONS[selectedSlot]['PRESSURE'];
  const currentLabel = TIME_SLOTS[selectedSlot].label;
  const currentIcon = TIME_SLOTS[selectedSlot].icon;
  const currentSub = TIME_SLOTS[selectedSlot].timeSub;

  return (
    <div className="mt-4 space-y-2 relative">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] pl-1 text-slate-400 font-mono tracking-widest uppercase flex-1 border-b border-white/5 pb-1">지금 이 순간 행동 매뉴얼</span>
      </div>

      {/* 대화형 인터랙션: 시간대 탭 전환 */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {TIME_SLOTS.map((slot) => {
          const isActive = selectedSlot === slot.id;
          const isNow = currentSlotId === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot.id)}
              className={`relative text-center py-2 px-1 rounded-xl transition-all duration-200 overflow-hidden ${
                isActive
                  ? 'border shadow-[0_2px_10px_rgba(0,0,0,0.3)]'
                  : 'bg-transparent border border-white/5 hover:bg-white/5 opacity-70 hover:opacity-100'
              }`}
              style={{
                borderColor: isActive ? `${harmony.energyColor}70` : undefined,
                backgroundColor: isActive ? `${harmony.energyColor}25` : undefined,
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {isNow && !isActive && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              )}
              {isNow && isActive && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: harmony.energyColor }} />
              )}
              <div className="text-sm mb-0.5" style={{ opacity: isActive ? 1 : 0.8 }}>{slot.icon}</div>
              <div 
                className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}
              >
                {slot.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* 선택된 시간대 상세 뉴로 코칭 내용 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSlot}
          initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} transition={{ duration: 0.2 }}
          className="p-4 rounded-xl border relative overflow-hidden shadow-inner flex gap-3 items-start"
          style={{ borderColor: `${harmony.energyColor}40`, backgroundColor: `${harmony.energyColor}10` }}
        >
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: harmony.energyColor }} />
          
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border" style={{ backgroundColor: '#0a101a', borderColor: `${harmony.energyColor}30` }}>
            <span className="text-xl">{currentIcon}</span>
          </div>

          <div className="pt-0.5">
            <h5 className="text-[11.5px] font-bold mb-1 tracking-wide flex items-center gap-1.5" style={{ color: harmony.energyColor }}>
              {currentLabel} 집중 행동 포커스
              <span className="text-[8px] opacity-60 font-mono tracking-tighter bg-white/5 px-1.5 py-0.5 rounded-full">
                {currentSub}
              </span>
            </h5>
            <p className="text-[11.5px] text-slate-200 leading-[1.65] font-medium break-keep opacity-90 mt-1.5">
              {actionText}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Feature 5: 오늘의 핵심 선언문 (NEW)
// ─────────────────────────────────────────────
function AffirmationCard({ harmony }: { harmony: DailyHarmonyResult }) {
  const AFFIRMATIONS: Record<string, string[]> = {
    HARMONY:  [
      '나는 오늘 우주의 흐름과 완전히 하나입니다. 내가 내미는 손에는 반드시 기회가 응답합니다.',
      '오늘 나의 직감은 틀리지 않습니다. 나는 두려움 없이 첫 걸음을 내딛습니다.',
    ],
    CLASH:    [
      '나는 오늘의 저항을 담담히 흘려보냅니다. 나의 본질은 어떤 외부 충격에도 흔들리지 않습니다.',
      '이 압박은 나를 공격하는 것이 아니라 나를 단련하는 것입니다. 나는 오늘도 건재합니다.',
    ],
    NEUTRAL:  [
      '나는 나 자신을 가장 깊이 이해하는 존재입니다. 나의 길은 나만이 알고 있습니다.',
      '나는 오늘 내 본연의 리듬으로 흔들림 없이 나아갑니다.',
    ],
    RESOURCE: [
      '나는 오늘 배우는 모든 것이 미래의 나를 강하게 만든다는 것을 압니다.',
      '나는 기꺼이 받아들이고, 넉넉히 채워 더 크게 베풀 준비를 합니다.',
    ],
    PRESSURE: [
      '나는 압박 속에서 더욱 예리해집니다. 오늘의 저항이 곧 내일의 도약대입니다.',
      '나는 이 순간의 불편함을 선택합니다. 성장의 불꽃이 나를 명검으로 다듬고 있습니다.',
    ],
  };

  const list = AFFIRMATIONS[harmony.relation] || AFFIRMATIONS['PRESSURE'];
  const today = new Date();
  const picked = list[today.getDate() % list.length];

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">오늘의 핵심 선언문</span>
      </div>
      <div
        className="relative p-4 rounded-xl overflow-hidden border"
        style={{ borderColor: `${harmony.energyColor}30`, background: `linear-gradient(135deg, ${harmony.energyColor}12, transparent)` }}
      >
        <div className="absolute -right-4 -top-4 text-[80px] opacity-5 select-none pointer-events-none">"{harmony.energyEmoji}</div>
        <p className="text-[13px] font-bold text-white leading-[1.7] break-keep italic relative z-10">
          &ldquo;{picked}&rdquo;
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          <div className="w-4 h-[1px]" style={{ backgroundColor: harmony.energyColor }} />
          <span className="text-[9px] font-mono tracking-widest" style={{ color: harmony.energyColor }}>
            {harmony.userDayMaster}일간 · {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 선언
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Feature 3: 3S 데일리 패치 UI
// ─────────────────────────────────────────────
function DailyPatchSection({ harmony }: { harmony: DailyHarmonyResult }) {
  // 시스템 고도화: 일간별(Day Master) 1:1 맞춤형 뇌과학/심리학 코칭 DB
  const ILGAN_3S_COACHING_DB: Record<string, Record<string, { q: string; a: string }[]>> = {
    '甲': {
      SCAN: [
        { q: '[독단 경보] 지금 내 목이나 어깨가 뻣뻣하게 굳어 있지 않은가?', a: '甲木의 뇌는 통제력을 잃고 내 방식이 거부당할 때 투쟁(Fight) 모드로 진입하며 뒷목 근육을 강하게 수축시킵니다. 지금 즉시 어깨를 귀까지 올렸다가 "툭" 떨어뜨려 보세요. 신체의 긴장이 풀려야 시야가 좁아지는 터널 비전(Tunnel Vision)에서 벗어날 수 있습니다.' },
        { q: '[강박 인지] "반드시 이렇게 해야 해"라는 생각이 머리를 맴도는가?', a: '목표에 대한 강박은 뇌의 변연계를 과열시킵니다. "이 방식이 아니면 다 망할 것 같다"는 생각은 뇌가 만들어낸 인지적 왜곡(흑백논리)입니다. 내 생각표를 잠시 모니터 밖에서 바라보듯 관찰하세요.' }
      ],
      SYNC: [
        { q: '[자아 분리] 나의 주장과 내 존재의 가치를 섞고 있지 않은가?', a: '내 제안이 거절당한 것이지 나라는 사람이 부정당한 것이 아닙니다. 甲木은 자신의 성취와 자아를 융합(Cognitive Fusion)하는 경향이 강합니다. "저 사람들은 내 의견의 일부 속성을 다루고 있을 뿐이다"라고 선언하여 메타인지(Metacognition)를 확보하세요.' },
        { q: '[타점 전환] 내가 리더가 아니라 제3자의 조언자라면?', a: '거울 뉴런을 활용해 한 발자국 물러나세요. 존경하는 멘토 혹은 투자가의 입장에서 현재 나의 고집을 본다면 어떤 피드백을 줄까요? 억울함이 사라지고 논리적 허점이 가장 먼저 보일 것입니다.' }
      ],
      SHIFT: [
        { q: '[마이크로 액션] 3초만 멈추고 타인에게 질문 하나 던지기', a: '가장 강력한 돌파는 멈춤에서 시작됩니다. 결정하기 전 "당신의 생각은 어떤가요?"라고 하나만 물어보세요. 이 짧은 우회가 결국 10배 빠른 도착을 보장하는 최고의 레버리지입니다.' },
        { q: '[유연성 테스트] 오늘 하루, 일부러 사소한 것 하나 져주기', a: '점심 메뉴 선택이나 사소한 회의에서 기꺼이 남의 의견을 따라가 보세요. 내가 양보해도 세상이 무너지지 않는다는 것을 뇌에 체득시키는 강력한 인지행동 치유(CBT) 훈련입니다.' }
      ]
    },
    '乙': {
      SCAN: [
        { q: '[자아 희석 경보] 지금 내 호흡이 얕고 눈치를 보고 있지 않은가?', a: '乙木은 타인의 감정을 0.1초 만에 감지하는 초고감도 센서를 가졌습니다. 하지만 이로 인해 내 생존 리듬(호흡)이 깨지기 쉽습니다. 지금 눈을 감고, 아랫배가 부풀어오를 정도로 깊은 복식호흡을 3회 하세요. 외부로 향한 안테나를 내부로 거두는 스위치입니다.' },
        { q: '[거절 두려움] 상대방의 기대를 실망시킬까 봐 안절부절못하는가?', a: '상대의 불쾌한 표정을 내 책임으로 귀인하는 인지적 오류(개인화)를 점검하세요. 타인의 감정은 그 사람의 뇌가 처리할 몫입니다. 내 통제 밖의 영역을 떠안으려는 헛된 시도를 중단하세요.' }
      ],
      SYNC: [
        { q: '[경계선 회복] 지금 이 결정이 "나"를 위한 것인가, "저 사람"을 위한 것인가?', a: '타인의 필요와 나의 필요를 명확히 분리하세요. "나는 좋은 사람이어야 한다"는 룰(Rule)에 얽매여 있습니까? 그 룰을 잠시 옆에 두고, 텅 빈 무대 위에 나 혼자 서 있다면 어떤 선택을 할지 상상하세요.' },
        { q: '[가치 재정렬] 거절했을 때 잃는 것과, 승낙했을 때 잃는 나 자신 중 무엇이 무거운가?', a: '착한 아이 컴플렉스는 나의 핵심 에너지를 지속적으로 갉아먹는 치명적인 웜바이러스입니다. 단기적 갈등을 피하려다 장기적 번아웃에 빠지는 패턴을 객관적으로 응시하세요.' }
      ],
      SHIFT: [
        { q: '[마이크로 거절] 오늘 하루, 가장 작은 요청 하나에 부드럽게 "No" 하기', a: '"아, 그건 제가 지금 일정상 어려울 것 같아요"라고 말하는 연습을 하세요. 거절 후에도 관계가 파괴되지 않는다는 안전 신호를 뇌의 편도체에 학습시켜야 합니다.' },
        { q: '[자아 선언] 10분간 외부 알림 완전히 끄고 내 공간 확보하기', a: '스마트폰을 비행기 모드로 돌리고 단 10분만 철저히 고립되세요. 모든 연결을 끊어야 비로소 나만의 진짜 목소리가 의식의 표면으로 떠오릅니다.' }
      ]
    },
    '丙': {
      SCAN: [
        { q: '[과부하 경보] 말이나 행동이 평소보다 빨라지고 심박수가 높은가?', a: '丙火의 태양광 에너지가 임계치를 넘어 방사되고 있습니다. 도파민이 과다 분비되며 통제 불능의 질주를 하는 상태입니다. 지금 즉시 하던 말을 멈추고, 길잡이별(북극성)을 찾듯 눈높이를 높여 멀리 있는 풍경을 30초간 응시하세요.' },
        { q: '[인정 갈구] 상대방의 반응, 조회수, 평가를 수시로 확인하고 싶은가?', a: '외부의 인정(피드백)에 뇌의 보상회로가 통째로 하이재킹당했습니다. 빛을 냈으니 반사광을 확인하고 싶은 강박적 도파민 루프를 알아차리세요.' }
      ],
      SYNC: [
        { q: '[자원 분리] 이것이 당장 내 에너지를 100% 태워야 할 만큼 핵심적인가?', a: '모든 곳에 빛을 비출 필요는 없습니다. 지금 에너지를 쏟는 대상이 내 생존과 직결된 코어 프로젝트입니까, 아니면 단순한 감정의 낭비입니까? 태양의 빛과 돋보기의 초점을 구분하세요.' },
        { q: '[존재 가치] 사람들이 나를 칭찬하지 않아도 나는 나락으로 떨어지지 않는가?', a: '빛나지 않아도 존재하는 태양처럼, 외부의 박수 소리와 나의 내재적 가치를 완전히 분리(Defusion)하십시오. 당신의 가치는 타인의 시선이라는 변수에 좌우되지 않는 상수(Constant)입니다.' }
      ],
      SHIFT: [
        { q: '[마이크로 휴전] 지금 당장 스마트폰 덮고 1분간 눈 감기', a: '과열된 시각 정보를 차단하여 전두엽의 부하를 내리는 즉각적 냉각 패치입니다. 아무것도 하지 않고 타오르는 불꽃을 1분간 숨기기만 해도 에너지가 응축됩니다.' },
        { q: '[단호한 절제] 오늘 보내려던 메시지의 길이를 절반으로 줄여서 보내기', a: '과도한 표현(에너지 방사)을 절제하는 훈련입니다. 10 문장으로 할 말을 5 문장으로 줄이는 압축 행위가 丙火의 진짜 권위와 무게감을 만듭니다.' }
      ]
    },
    '丁': {
      SCAN: [
        { q: '[내면 억압 경보] 가슴 명치 답답함이나 원인 모를 한숨이 나오지 않는가?', a: '丁火는 스스로를 불태워 어둠을 밝힙니다. 외부로 표출하지 못하고 안으로 삭인 불만이 내부 압력을 끝없이 높이고(화병) 있습니다. 한숨은 뇌가 산소를 강압적으로 요구하는 경고등입니다.' },
        { q: '[현실 도피] 완벽한 계획만 세우고 실행을 계속 미루며 상상으로 도피하는가?', a: '이상과 현실의 차이가 클 때, 丁火의 뇌는 고통을 피하기 위해 시뮬레이션실(망상)에 숨어버립니다. 지금 현실 컴파일 오류가 두려워 시작 버튼을 누르지 못하고 있음을 알아차리세요.' }
      ],
      SYNC: [
        { q: '[이상 분리] 머릿속의 완벽타겟 100점과 현실의 0점을 동일시하고 있지 않은가?', a: '"100점이 아니면 다 쓰레기다"라는 흑백논리를 해체하세요. 세상의 모든 위대한 코드도 1.0 베타 버전의 남루함에서 시작되었습니다. 완벽한 0점보다 너덜거리는 40점이 우월합니다.' },
        { q: '[감정 객관화] 지금 나를 태우고 있는 감정을 단어로 이름 붙여본다면?', a: '분노, 억울함, 불안함. 이 감정들을 객관화하여 이름표(Labeling)를 붙이세요. 감정이 언어화되는 순간, 변연계의 과부하가 전두엽으로 이관되며 서서히 진화(소화)됩니다.' }
      ],
      SHIFT: [
        { q: '[마이크로 출력] 지금 느끼는 답답함을 노트나 메모장에 한 줄로 적기', a: '안에서 타들어가는 불씨를 외부 매체로 배출하는 첫 번째 방열(Heat-sink) 작업입니다. 누구에게도 보여주지 않아도, 내 안에서 밖으로 빼내는 행위 자체가 구명조끼입니다.' },
        { q: '[타협적 실행] 오늘 완벽하지 않아도 5분만 대충 해놓고 멈춰보기', a: '완벽주의 스크립트를 파괴하는 훈련입니다. 쓰레기 같은 초안이라도 괜찮으니 5분만 타이머를 맞추고 일단 키보드를 두드리거나 행동하세요. 멈춰있는 엔진이 회전하기 시작합니다.' }
      ]
    },
    '戊': {
      SCAN: [
        { q: '[포용 과부하 경보] 지금 내가 너무 많은 짐을 다 감싸안아 숨이 막히지 않는가?', a: '모든 것을 수용하는 무거운 대지(戊土)의 부작용입니다. 타인의 고민, 수많은 일정, 방대한 자료들을 지워내지 못하고 백팩에 계속 쑤셔 넣고 있어서 뇌의 Working Memory가 터지기 직전입니다.' },
        { q: '[고립 인지] "결국 내가 다 해야 해"라는 무력감 섞인 한탄이 나오는가?', a: '스스로 감당하기 벅참에도 주변에 SOS를 치지 않는 폐쇄적 패턴입니다. 내가 산처럼 버텨주지 않으면 주변이 무너질 것이라는 과대망상적 책임감을 감지하세요.' }
      ],
      SYNC: [
        { q: '[경계 인식] 이것이 내 책임 영역인가, 아니면 내가 오지랖으로 떠안은 남의 몫인가?', a: '내가 통제할 수 없는 남의 감정과 문제까지 내 영토로 끌어들이지 마세요. 내 앞마당과 남의 마당 사이에 명확한 울타리를 치는 심리적 선긋기(Boundary Setting)가 시급합니다.' },
        { q: '[변화 수용] 지금 내려놓기 두려운 이 익숙한 고통의 이면에 어떤 혜택이 있는가?', a: '익숙한 불행이 낯선 행복보다 안전하게 느껴지는 것이 뇌의 역설입니다. 고통스러우면서도 쥐고 있는 과거의 패턴(레거시 데이터)과 이제 이별을 선언하십시오.' }
      ],
      SHIFT: [
        { q: '[마이크로 삭제] 오늘 할 일 목록(To-Do) 중 가장 불필요한 1개 즉시 삭선 긋기', a: '비우지 못하면 새것이 담기지 않습니다. 무의미한 회의안건, 스팸 메일 스트레스 등 하나를 확실히 버리세요. 삭제 키를 누르는 순간 뇌의 RAM이 극적으로 확보됩니다.' },
        { q: '[책임 분산] 오늘 누군가에게 아주 작고 사소한 부탁 하나 구하기', a: '세상은 내가 조금 무너져도 멀쩡히 돌아갑니다. "오늘 이것 좀 도와줄래요?"라고 묻는 행위는 무너진 나의 생태계에 외부의 바람과 강물을 끌어들이는 치유의 시작입니다.' }
      ]
    },
    '己': {
      SCAN: [
        { q: '[내면 침잠 경보] 머릿속에 생각과 걱정만 가득하고 오늘 실행한 것은 0.1도 없는가?', a: '온갖 번뇌와 상상을 품고만 있는 己土의 비옥한 늪에 빠져 있습니다. 행동 없이 생각만 꼬리를 무는 반추(Rumination) 루프에 갇혀, 도파민은 낭비되고 실행력은 마비된 상태입니다.' },
        { q: '[우유부단 인지] 타인의 시선이나 실패가 두려워 A안과 B안을 무한 저울질 중인가?', a: '완벽한 선택을 하려다 기회 자체를 증발시키는 치명적인 에러입니다. "잘못 선택하면 영원히 끝이다"라는 인지 왜곡이 당신의 발목을 묶고 있습니다.' }
      ],
      SYNC: [
        { q: '[평가 분리] 내가 지금 망설이는 이유는 나의 기준 때문인가, 남의 시선 때문인가?', a: '사회적 체면과 타인의 평가라는 가상의 유령으로부터 내 결정을 구출하세요. 남들은 당신의 선택에 놀라울 정도로 관심이 없습니다. 가상의 관중을 해산시키세요.' },
        { q: '[수용적 태도] 내가 낸 최악의 오답이 가만히 멈춰 있는 것보다 100배 가치 있지 않은가?', a: '시도하고 틀리면 "경험 데이터베이스(DB)"라도 남지만, 시도하지 않으면 남는 것은 후회뿐입니다. 오답을 내는 것을 성장 알고리즘의 필수 디버깅 과정으로 수용하세요.' }
      ],
      SHIFT: [
        { q: '[동전 던지기 실행] 결정하기 힘든 사소한 고민, 지금 당장 동전(홀짝)으로 정해서 5분 내 실행하기', a: '선택의 질보다 선택의 속도가 뇌를 우울감에서 건져냅니다. 중국집 메뉴부터 이메일 전송 여부까지, 이성이 마비됐을 땐 직관과 우연에 맡겨 스위치를 강제 On 하세요.' },
        { q: '[마이크로 출력] 가장 안전한 공간(비공개 메모)에 내 엉망진창 아이디어 1줄 적기', a: '안에서만 도는 물방레를 외부로 꺼내세요. 머리가 아닌 현실 세계의 픽셀로 활자가 찍히는 순간 망상은 현실화의 첫걸음을 뗀 도면이 됩니다.' }
      ]
    },
    '庚': {
      SCAN: [
        { q: '[긴장 과부하 경보] 나도 모르게 주먹을 쥐고 있거나 호흡을 멈추고 얕게 쉬고 있지 않은가?', a: '항상 무장되어 있고 전쟁터 한가운데 있는 척하는 교감신경계의 오작동입니다. 庚金은 세상과 맞서 싸울 준비를 하며 전신을 딱딱하게 경직(Tension)시킵니다. 지금 턱관절과 미간의 힘을 빼세요.' },
        { q: '[단절 인지] 주변 사람들이 내 눈치를 보거나, 내가 먼저 벽을 치고 고립되고 있는가?', a: '칼날을 곧추세운 방어기제가 오히려 스스로를 베고 있습니다. "나 혼자 다 이겨내야 한다"는 영웅주의적 강박이 타인과의 따뜻한 연결을 잔인하게 난도질하고 있음을 알아차리세요.' }
      ],
      SYNC: [
        { q: '[강박 분리] "강해야 한다", "울면 지는 거다"라는 명제는 누가 만든 족쇄인가?', a: '진짜 강함은 부러지지 않는 유연성에 있습니다. 단단한 쇳덩이는 충격에 기어코 박살나지만, 고무공은 튕겨 오릅니다. 경직된 에고(Ego)와 유연한 자아를 분리하십시오.' },
        { q: '[가치 재편] 지금 내가 싸우고 있는 이 대상이 진짜 적(Enemy)인가, 아니면 나의 통제 욕구인가?', a: '무찌를 필요 없는 일상적 트러블을 향해 도끼를 휘두르고 있지 않습니까? 적이 사라진 시대에 쉐도우 복싱을 멈춰야 뇌의 평화가 찾아옵니다.' }
      ],
      SHIFT: [
        { q: '[마이크로 무장해제] 오늘 내가 먼저, 가장 가벼운 농담이나 친근한 안부 하나 건네기', a: '굳게 닫인 쇳문에 스며드는 윤활유 같은 행동입니다. 경계심을 먼저 푼다고 뒷통수를 맞지 않는다는 안전 시그널을 편도체에 직접 다이렉트로 꽂아 넣으세요.' },
        { q: '[취약성 노출] 신뢰할 수 있는 1명에게 "나 이거 좀 힘들다"고 솔직히 말하기', a: '최고 난도의 심리적 방수 해제 미션입니다. 취약함을 드러내는(Vulnerability) 자만이 이 세상에서 가장 강하고 자유로운 주권자입니다.' }
      ]
    },
    '辛': {
      SCAN: [
        { q: '[성장 강박 경보] "이런 사소한 실수조차 하면 나는 끝이다"라는 식의 재앙화 사고가 가동 중인가?', a: '辛金 특유의 극심한 자기 검열입니다. 모니터 픽셀 하나 어긋난 걸 보고 윈도우가 박살났다고 착각하는 인지적 오류(Magnification)입니다. 지금의 스트레스는 외부의 칼날이 아니라 내가 든 송곳입니다.' },
        { q: '[마비 인지] 더 완벽한 템플릿과 방법을 찾느라 정작 1픽셀도 앞으로 나가지 못했는가?', a: '완벽이라는 우상에 마비(Analysis Paralysis)된 상태입니다. 보석을 깎다 못해 가루로 만들어 버리기 직전의 위험 수위입니다. 검색과 비교를 멈추세요.' }
      ],
      SYNC: [
        { q: '[자아 리프레이밍] 내가 만든 결과물 80점짜리가, 100점짜리 나라는 존재의 가치를 훼손하는가?', a: '결과물과 자아(Ego)의 분리(Defusion)가 辛金 코칭의 핵심입니다. 당신은 다이아몬드 원석이고, 결과물은 당신이 뿜어내는 수천 개의 홀로그램 중 하나일 뿐입니다. 홀로그램 하나가 흔들려도 다이아몬드는 깨지지 않습니다.' },
        { q: '[기준 완화] 1년 뒤의 나에게 지금 고민하는 이 디테일이 1% 라도 중요할 것인가?', a: '타임라인 줌아웃(Zoom-out)을 통해 거시적 관점을 회복하세요. 지금 현미경으로 들여다보고 있는 이 버그는 넓은 하늘에서 보면 아예 존재하지 않는 먼지입니다.' }
      ],
      SHIFT: [
        { q: '[의도적 실수(Exposure)] 오늘 당장 오타가 하나 있는 메시지나 80% 완성된 초안 날려 보내기', a: '두려움에 직면하는 불안 극복의 교과서적 해법(Exposure Therapy)입니다. 오타가 나가도, 80점짜리로 배포해도 세상 사람이 나를 비난하거나 파멸이 오지 않음을 뇌세포에 각인시키세요.' },
        { q: '[관대함 패치] 오늘 거울을 보며 나에게 "이 정도면 충분히 잘했어"라고 육성으로 말하기', a: '남에게는 관대하면서 나에게만 가혹한 이중 잣대를 부수는 행위입니다. 칼날 거둔 목소리로 본인의 노고를 먼저 승인(Approval)해 주세요.' }
      ]
    },
    '壬': {
      SCAN: [
        { q: '[웅덩이 침잠 경보] 유튜브나 자료의 바다에 빠져서 정작 내가 생산한 것은 제로인가?', a: '壬水 코어의 정보 과식증(Over-consumption) 상태입니다. 지혜라는 미명 하에 방대한 데이터를 수집만 하다가, 내 삶의 강물이 고요하게 썩어가고 있는(Procrastination) 정체 구간입니다.' },
        { q: '[방향 상실 인지] 이것도 좋아 보이고 저것도 좋아 보여서 결국 이불 속에 누워 있는가?', a: '가능성이 너무 많아 결정을 내리지 못하는 역설(Paradox of Choice). 웅장한 바다 한가운데서 나침반을 잃고 표류하는 무기력함을 정확히 인식하십시오.' }
      ],
      SYNC: [
        { q: '[전략 리프로그래밍] 머릿속의 위대한 마스터플랜이 지금 당장의 조잡한 실행 1번보다 가치 있는가?', a: '아무리 거대한 쓰나미의 잠재력을 가졌어도 댐에 갇혀 있으면 고인 물입니다. 생각의 질량이 아무리 무거워도 물리적 출력(행동)이 0이라면 에너지는 0입니다.' },
        { q: '[현실 안착] 내가 기다리는 "완벽한 타이밍"이라는 것은 애초에 존재하지 않는 허상 아닌가?', a: '파도가 완전히 잔잔해지기를 기다렸다가 서핑을 하려는 환상을 깨세요. 불완전한 현실 세계(Interface)와 부딪히기 시작해야 진정한 피드백이 생성됩니다.' }
      ],
      SHIFT: [
        { q: '[물꼬 트기 마이크로 룰] 지금 생각 포커스를 완전히 끄고 책상 1분 정리, 혹은 메일 1개 쓰기 실행', a: '거대한 강물도 작은 균열에서 터져 나옵니다. 몸을 움직여 가장 기계적이고 사소한 루틴을 관성적으로 처리하세요. 도파민의 기어밴드가 중립에서 1단으로 넘어갑니다.' },
        { q: '[방향 선언] 오늘 하루의 작은 목적지(One-Thing) 딱 1곳만 정해서 수첩에 기록하기', a: '망망대해에 닻을 내리는 행위입니다. 수많은 가능성을 날려버리고 오직 오늘 12시까지는 "이것만 한다"는 제약을 뇌에 강제로 거십시오.' }
      ]
    },
    '癸': {
      SCAN: [
        { q: '[감정 전염 경보] 옆 사람의 콧숨 소리, 메신저의 딱딱한 말투 하나에 가슴이 철렁 내려앉았는가?', a: '타인의 신경계와 내 신경계가 뒤섞여 혼선(Crosstalk)된 상태입니다. 癸水는 주변 공기의 온도를 이슬처럼 머금기에 피해망상에 가까운 초과민(Hyper-vigilance) 상태로 돌입하기 쉽습니다.' },
        { q: '[자기 희생 인지] 불쾌함을 숨기고 계속 "네 맞아요"라며 억지 미소를 유지하고 있는가?', a: '분위기를 깨뜨릴까 두려워 내 감정의 한계선을 무너뜨리는 자기 파괴적 적응 패턴. 내 감정이 서서히 말라 증발되고 있음을 알아차리세요.' }
      ],
      SYNC: [
        { q: '[단열/차단] 이건 저 사람의 짜증인가, 아니면 내 안의 죄책감(또는 불안)인가?', a: '구름과 호수를 분리하세요. 상사가 짜증난 것은 상사의 변연계 이슈이지 내 탓이 아닙니다. 내가 통제할 수 없는 기상 이변을 향해 우산도 안 쓰고 맞서는 무분별한 공감을 당장 차단하세요.' },
        { q: '[암묵적 기대 해체] 내가 말하지 않고 참았으면서, 상대가 내 희생을 알아봐주길 기대하고 있나?', a: '"말 안 해도 내 마음을 알아주겠지"는 가장 어리석고 파괴적인 인지적 오류입니다. 텔레파시를 포기하고 명확한 텍스트 기반 소통법으로 뇌를 전환하세요.' }
      ],
      SHIFT: [
        { q: '[마이크로 방수막] 5분간 누구도 나를 찾을 수 없는 공간(화장실 등)에서 외부 자극 0 모드 가동', a: '눈, 귀, 입을 전부 닫으세요. 쏟아지는 타인의 감각 정보를 강제로 셧다운(Input 차단)하여 고갈된 나의 감정 RAM을 방어하는 절대적 생존 룰입니다.' },
        { q: '[나-전달법(I-message)] 오늘 나를 불편하게 한 순간에 대해 "나는 이렇게 느꼈다"고 일기 혹은 당사자에게 말하기', a: '"너가 이렇게 해서 짜증나"가 아니라 "내 속도가 이래서 지금 조급해진다"고 빙빙 돌리지 말고 감정을 사실대로 직시하세요. 비폭력 대화의 가장 강력한 시작점입니다.' }
      ]
    }
  };

  // 현재 사용자의 일간(Day Master)을 가져옵니다 (폴백: 辛)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0); // 첫 번째는 기본 열림
  const [activeChecklistKey, setActiveChecklistKey] = useState<string | null>(null);
  
  // reportData에서 추출한 일간 정보를 기반으로 3S 코칭 세트를 동적으로 가져옵니다.
  const dayMasterMatch = harmony.userDayMaster.match(/[甲乙丙丁戊己庚辛壬癸]/);
  const currentIlgan = dayMasterMatch ? dayMasterMatch[0] : '辛';
  const CHECKLIST = ILGAN_3S_COACHING_DB[currentIlgan] || ILGAN_3S_COACHING_DB['辛'];

  const steps = [
    { icon: '🔍', label: 'Scan', desc: '현재 상태 인식', message: harmony.scanMessage, color: '#3b82f6', ckKey: 'SCAN' },
    { icon: '🔗', label: 'Sync', desc: '자아 객관화 분리', message: harmony.syncMessage, color: '#8b5cf6', ckKey: 'SYNC' },
    { icon: '⚡', label: 'Shift', desc: '전환의 마이크로 미션', message: harmony.shiftMission, color: '#f59e0b', ckKey: 'SHIFT' },
  ];

  return (
    <div className="space-y-2 mt-2">
      {steps.map((step, idx) => {
        const isExpanded = expandedIdx === idx;
        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="bg-slate-900/60 rounded-xl border border-white/5 cursor-pointer overflow-hidden transition-colors hover:border-white/10"
            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
          >
            {/* 요약 헤더 영역 */}
            <div 
              className="flex items-center justify-between p-3.5 transition-colors"
              style={{ backgroundColor: isExpanded ? `${step.color}15` : 'transparent' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-lg border border-white/5 shadow-inner">
                  {step.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{step.label}</span>
                  <span className="text-xs font-bold font-sans" style={{ color: step.color }}>
                    {step.desc}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800/50 border border-white/5">
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-[10px] text-slate-400">
                  <ChevronDown className="w-3 h-3" />
                </motion.div>
              </div>
            </div>

            {/* 확장된 상세 메시지 구역 */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-4 pb-4 pt-2 space-y-3">
                    
                    {/* 명심 코치의 가이드 (친절한 설명) */}
                    <div className="p-3.5 rounded-xl border border-white/5 bg-slate-800/60 relative overflow-hidden backdrop-blur-sm shadow-sm transition-colors">
                      <div className="absolute -top-3 -right-2 p-2 opacity-10 text-5xl pointer-events-none">
                        {step.icon}
                      </div>
                      <h4 className="text-[10px] font-bold text-slate-400 mb-2 font-mono tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> COACHING GUIDE
                      </h4>
                      <p className="text-[11.5px] text-slate-300 leading-[1.6] break-keep font-medium relative z-10">
                        {step.label === 'Scan' 
                          ? '이 단계는 내 안에서 무의식적으로 요동치는 감정이나 생각의 흐름을 억지로 통제하려 하지 않는 연습입니다. 마치 제3자의 CCTV 화면을 보듯 "아, 내가 지금 이런 감각에 휩싸여 있구나" 하고 있는 그대로 관찰하고 읽어내기만 하세요.'
                          : step.label === 'Sync'
                          ? '마음을 분리하는 메타인지 단계입니다. 나를 짓누르는 문제 상황과 나 자신을 완전히 떼어내세요. "내가 곧 이 문제다"가 아니라 "내 앞의 책상 위에 놓인 무해한 데이터일 뿐이다"라고 바라볼 때, 짓눌리던 심리적 압박에서 순식간에 해방될 수 있습니다.'
                          : '가장 강력한 마이크로-시프트(전환) 단계입니다. 거창한 노력이 절대로 필요하지 않습니다. 당장 1초 만에 실행할 수 있는 아주 작고 극단적으로 쉬운 행동 하나를 통해 뇌의 굳어버린 회로를 물리적으로 끊어내고 오늘 하루의 분위기를 완전히 반전시킵니다.'}
                      </p>
                    </div>

                    {/* 오늘의 맞춤형 처방 */}
                    <div className="p-4 rounded-xl relative overflow-hidden shadow-inner border border-cyan-500/10" style={{ backgroundColor: `${step.color}15` }}>
                      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: step.color }}></div>
                      <h4 className="text-[10px] font-bold mb-2 flex items-center gap-1.5 uppercase tracking-widest" style={{ color: step.color }}>
                        <Zap className="w-3.5 h-3.5" /> 오늘의 {step.label} 처방 백신
                      </h4>
                      <p className="text-[13px] text-white leading-[1.6] font-bold pl-1.5 break-keep tracking-tight">
                        &ldquo;{step.message}&rdquo;
                      </p>
                    </div>

                    {/* 자문 체크리스트 (NEW - Interactive Accordion) */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" /> 자문 체크리스트 <span className="opacity-70 text-[9px] text-cyan-400/80">(질문을 클릭하여 힌트 보기)</span>
                      </p>
                      <div className="flex flex-col gap-1.5 pt-1">
                        {CHECKLIST[step.ckKey].map((item, qi) => {
                          const itemKey = `${step.ckKey}-${qi}`;
                          const isItemActive = activeChecklistKey === itemKey;
                          
                          return (
                            <div key={qi} className="overflow-hidden bg-slate-900/60 rounded-lg border border-white/5 transition-all">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); // 부모(Scan/Sync/Shift 탭) 닫힘 방지
                                  setActiveChecklistKey(isItemActive ? null : itemKey);
                                }}
                                className="w-full flex items-start gap-2 p-2.5 hover:bg-white/5 text-left transition-colors focus:outline-none"
                              >
                                <span className="text-[10px] font-mono shrink-0 mt-0.5" style={{ color: step.color }}>Q{qi + 1}</span>
                                <p className="text-[11px] text-slate-300 leading-[1.4] flex-1 break-keep pr-2 font-medium">{item.q}</p>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5 transition-transform duration-300 ${isItemActive ? 'rotate-180 text-white' : ''}`} />
                              </button>
                              
                              <AnimatePresence>
                                {isItemActive && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden flex flex-col"
                                    onClick={(e) => e.stopPropagation()} // 해설 텍스트 영역 클릭시 닫힘 방지
                                  >
                                    <div 
                                      className="p-3 border-t text-[11px] leading-[1.65] break-keep font-medium shadow-inner"
                                      style={{ 
                                        borderColor: `${step.color}20`, 
                                        backgroundColor: `${step.color}08`, 
                                        color: '#cbd5e1' 
                                      }}
                                    >
                                      <div className="flex gap-1.5 items-start">
                                        <div className="text-xs shrink-0 mt-0.5">🧠</div>
                                        <div className="flex-1 opacity-90">{item.a}</div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 패널 컴포넌트 — 프리미엄 리디자인
// ─────────────────────────────────────────────
type TabType = 'harmony' | 'bio' | 'patch';

export default function DailyBioSyncPanel() {
  const { reportData } = useReportStore();
  const [activeTab, setActiveTab] = useState<TabType>('harmony');
  const [isExpanded, setIsExpanded] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [streak, setStreak] = useState(1);

  // ── 자정 카운트다운
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const d = midnight.getTime() - now.getTime();
      const h = Math.floor(d / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const s = Math.floor((d % 60000) / 1000);
      setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── 스트릭 계산 (localStorage)
  useEffect(() => {
    try {
      const todayStr = new Date().toDateString();
      const raw = localStorage.getItem('ms_streak');
      const data = raw ? JSON.parse(raw) : { last: null, count: 0 };
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      if (data.last === todayStr) {
        setStreak(data.count);
      } else if (data.last === yest.toDateString()) {
        const n = data.count + 1;
        localStorage.setItem('ms_streak', JSON.stringify({ last: todayStr, count: n }));
        setStreak(n);
      } else {
        localStorage.setItem('ms_streak', JSON.stringify({ last: todayStr, count: 1 }));
        setStreak(1);
      }
    } catch { setStreak(1); }
  }, []);

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

  const biorhythm = useMemo(() => {
    if (!birthDate) return null;
    return calculateBiorhythm(birthDate);
  }, [birthDate]);

  const bioSajuAdvice = useMemo(() => {
    if (!biorhythm) return null;
    return getBioSajuAdvice(dominantElement, biorhythm);
  }, [dominantElement, biorhythm]);

  if (!dayMasterHanja && !birthDate) return null;

  const today      = new Date();
  const dateLabel  = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  const totalScore = harmony && biorhythm
    ? Math.round(harmony.painLevel * 0.5 + biorhythm.overallScore * 0.5)
    : harmony ? harmony.painLevel : biorhythm ? biorhythm.overallScore : 50;
  const energyColor = harmony?.energyColor ?? '#7c3aed';

  const VERDICT: Record<string, string> = {
    SYNC:        '오늘은 나를 가장 깊이 마주하고 확신을 가지는 날',
    RESOURCE:    '우주가 당신에게 영양분을 쏟아붓는 수용의 날',
    FLOW:        '내 안의 에너지가 세상 밖으로 거침없이 뻗어가는 날',
    PRESSURE:    '강력한 규칙과 책임감이 당신을 명검으로 다듬는 날',
    ACHIEVEMENT: '과녁을 명확히 하고 결과를 온전히 쟁취해내는 날',
  };
  const verdict = harmony ? VERDICT[harmony.relation as string] || '오늘의 코칭을 확인하세요' : '오늘의 코칭을 확인하세요';

  const MISSION: Record<string, string> = {
    SYNC:        '오늘 나를 자극하는 타인을 거울 삼아 배울 점 하나를 기록하세요.',
    RESOURCE:    '오늘 무리한 업무보다 책 1장, 영상 1편이라도 내면 채우기에 집중하세요.',
    FLOW:        '오전 11시 이전, 머릿속에만 있던 생각이나 제안을 과감히 밖으로 던지세요.',
    PRESSURE:    '가장 피하고 싶었던 핵심 업무 하나에만 90분을 집중 투자해 정면 돌파하세요.',
    ACHIEVEMENT: '오늘 할 여러 일 중 목표 달성에 직결되는 단 하나만 남기고 모두 쳐내세요.',
  };
  const mission = harmony ? MISSION[harmony.relation as string] : null;

  const TABS: { id: TabType; label: string; emoji: string }[] = [
    { id: 'harmony', label: '일진 에너지', emoji: '⚡' },
    { id: 'bio',     label: '바이오 게이지', emoji: '📊' },
    { id: 'patch',   label: '3S 패치',     emoji: '💉' },
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
            className="overflow-hidden"
          >
            <div className="bg-[#0b1018]/90 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-md">

              {/* 프리미엄 탭 */}
              <div className="flex gap-1.5 mb-5">
                {TABS.map(tab => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300"
                      style={{
                        color: active ? '#fff' : '#475569',
                        background: active
                          ? `linear-gradient(135deg, ${energyColor}45, ${energyColor}20)`
                          : 'transparent',
                        border: active ? `1px solid ${energyColor}60` : '1px solid #ffffff08',
                        boxShadow: active ? `0 0 18px ${energyColor}28` : undefined,
                      }}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
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
                    <AffirmationCard harmony={harmony} />
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
                          <div className="bg-slate-800/40 rounded-xl p-3.5 border border-purple-500/20">
                            <div className="flex items-center gap-2 mb-1.5"><Shield className="w-3.5 h-3.5 text-purple-400" /><span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">바이오-사주 통합 조언</span></div>
                            <p className="text-[11px] text-slate-300 leading-relaxed break-keep">{bioSajuAdvice}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8"><p className="text-xs text-slate-500">생년월일 정보가 필요합니다.<br />만세력에서 입력해 주세요.</p></div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'patch' && harmony && (
                  <motion.div key="patch"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-[10px] text-slate-500 mb-3 font-mono tracking-widest">TODAY&apos;S PSYCHOLOGICAL VACCINE 💉</p>
                    <DailyPatchSection harmony={harmony} />
                  </motion.div>
                )}

                {(activeTab === 'harmony' || activeTab === 'patch') && !harmony && (
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
