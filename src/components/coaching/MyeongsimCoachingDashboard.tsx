'use client';

import React, { useMemo } from 'react';
import { useReportStore } from '@/store/useReportStore';
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine';
import { X, Sparkles, TrendingUp, ShieldAlert, Award } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// 천간/지지 오행 및 음양 정보 정의
// ─────────────────────────────────────────────────────────────
const STEM_INFO: Record<string, { ohaeng: string; polarity: '+' | '-' }> = {
  '甲': { ohaeng: 'wood', polarity: '+' }, '乙': { ohaeng: 'wood', polarity: '-' },
  '丙': { ohaeng: 'fire', polarity: '+' }, '丁': { ohaeng: 'fire', polarity: '-' },
  '戊': { ohaeng: 'earth', polarity: '+' }, '己': { ohaeng: 'earth', polarity: '-' },
  '庚': { ohaeng: 'metal', polarity: '+' }, '辛': { ohaeng: 'metal', polarity: '-' },
  '壬': { ohaeng: 'water', polarity: '+' }, '癸': { ohaeng: 'water', polarity: '-' },
  '갑': { ohaeng: 'wood', polarity: '+' }, '을': { ohaeng: 'wood', polarity: '-' },
  '병': { ohaeng: 'fire', polarity: '+' }, '정': { ohaeng: 'fire', polarity: '-' },
  '무': { ohaeng: 'earth', polarity: '+' }, '기': { ohaeng: 'earth', polarity: '-' },
  '경': { ohaeng: 'metal', polarity: '+' }, '신': { ohaeng: 'metal', polarity: '-' },
  '임': { ohaeng: 'water', polarity: '+' }, '계': { ohaeng: 'water', polarity: '-' }
};

const BRANCH_INFO: Record<string, { ohaeng: string; polarity: '+' | '-' }> = {
  '子': { ohaeng: 'water', polarity: '-' }, '丑': { ohaeng: 'earth', polarity: '-' },
  '寅': { ohaeng: 'wood', polarity: '+' }, '卯': { ohaeng: 'wood', polarity: '-' },
  '辰': { ohaeng: 'earth', polarity: '+' }, '巳': { ohaeng: 'fire', polarity: '+' },
  '午': { ohaeng: 'fire', polarity: '-' }, '未': { ohaeng: 'earth', polarity: '-' },
  '申': { ohaeng: 'metal', polarity: '+' }, '酉': { ohaeng: 'metal', polarity: '-' },
  '戌': { ohaeng: 'earth', polarity: '+' }, '亥': { ohaeng: 'water', polarity: '+' },
  '자': { ohaeng: 'water', polarity: '-' }, '축': { ohaeng: 'earth', polarity: '-' },
  '인': { ohaeng: 'wood', polarity: '+' }, '묘': { ohaeng: 'wood', polarity: '-' },
  '진': { ohaeng: 'earth', polarity: '+' }, '사': { ohaeng: 'fire', polarity: '+' },
  '오': { ohaeng: 'fire', polarity: '-' }, '미': { ohaeng: 'earth', polarity: '-' },
  '신': { ohaeng: 'metal', polarity: '+' }, '유': { ohaeng: 'metal', polarity: '-' },
  '술': { ohaeng: 'earth', polarity: '+' }, '해': { ohaeng: 'water', polarity: '+' }
};

// 십신 계산 도구
const OHAENG_RELATION = ['wood', 'fire', 'earth', 'metal', 'water'];

function getTenGod(dayStem: string, targetStemOrBranch: string, isBranch = false): string {
  const dayInfo = STEM_INFO[dayStem];
  const targetInfo = isBranch ? BRANCH_INFO[targetStemOrBranch] : STEM_INFO[targetStemOrBranch];
  
  if (!dayInfo || !targetInfo) return '-';

  const dayIdx = OHAENG_RELATION.indexOf(dayInfo.ohaeng);
  const targetIdx = OHAENG_RELATION.indexOf(targetInfo.ohaeng);
  if (dayIdx === -1 || targetIdx === -1) return '-';

  const diff = (targetIdx - dayIdx + 5) % 5;
  const samePolarity = dayInfo.polarity === targetInfo.polarity;

  if (diff === 0) {
    return samePolarity ? '비견' : '겁재';
  } else if (diff === 1) {
    return samePolarity ? '식신' : '상관';
  } else if (diff === 2) {
    return samePolarity ? '편재' : '정재';
  } else if (diff === 3) {
    return samePolarity ? '편관' : '정관';
  } else {
    return samePolarity ? '편인' : '정인';
  }
}

// 60갑자 지지 동물 및 천간 색상 매핑
const ANIMAL_MAP: Record<string, string> = {
  '子': '쥐', '丑': '소', '寅': '호랑이', '卯': '토끼', '辰': '용', '巳': '뱀',
  '午': '말', '未': '양', '申': '원숭이', '酉': '닭', '戌': '개', '亥': '돼지',
  '자': '쥐', '축': '소', '인': '호랑이', '묘': '토끼', '진': '용', '사': '뱀',
  '오': '말', '미': '양', '신': '원숭이', '유': '닭', '술': '개', '해': '돼지'
};

const COLOR_MAP: Record<string, { adjective: string; emoji: string }> = {
  '甲': { adjective: '푸른', emoji: '🌲' }, '乙': { adjective: '초록빛', emoji: '🌱' },
  '丙': { adjective: '붉은', emoji: '🔥' }, '丁': { adjective: '은은한 불빛의', emoji: '🕯️' },
  '戊': { adjective: '황금빛 태산의', emoji: '⛰️' }, '己': { adjective: '부드러운 흙빛의', emoji: '🌾' },
  '庚': { adjective: '단단한 은빛', emoji: '🛡️' }, '辛': { adjective: '빛나는 보석의', emoji: '💎' },
  '壬': { adjective: '검은 파도의', emoji: '🌊' }, '癸': { adjective: '맑은 오아시스의', emoji: '💧' },
  '갑': { adjective: '푸른', emoji: '🌲' }, '을': { adjective: '초록빛', emoji: '🌱' },
  '병': { adjective: '붉은', emoji: '🔥' }, '정': { adjective: '은은한 불빛의', emoji: '🕯️' },
  '무': { adjective: '황금빛 태산의', emoji: '⛰️' }, '기': { adjective: '부드러운 흙빛의', emoji: '🌾' },
  '경': { adjective: '단단한 은빛', emoji: '🛡️' }, '신': { adjective: '빛나는 보석의', emoji: '💎' },
  '임': { adjective: '검은 파도의', emoji: '🌊' }, '계': { adjective: '맑은 오아시스의', emoji: '💧' }
};

interface MyeongsimCoachingDashboardProps {
  isOpen?: boolean;
  onClose?: () => void;
  userProfile?: any;
}

export default function MyeongsimCoachingDashboard({
  isOpen = false,
  onClose,
  userProfile
}: MyeongsimCoachingDashboardProps) {
  
  const { reportData } = useReportStore();

  // ── [실시간 만세력 연산] ──
  const activeSaju = useMemo(() => {
    const rawDate = reportData?.birthDate || userProfile?.birthDate || userProfile?.birth_date || userProfile?.user_metadata?.saju_data?.date;
    const rawTime = reportData?.birthTime || userProfile?.birthTime || userProfile?.birth_time || '12:00';
    const calType = reportData?.meta?.calendarType || userProfile?.calendar_type || 'solar';
    const gender = reportData?.gender || userProfile?.gender || 'male';

    let finalSaju = null;

    if (rawDate) {
      try {
        const result = calculateSaju(rawDate, rawTime, calType, gender);
        if (result && result.success) {
          const stats = calculateSajuStats(result.fourPillars, result.dayMasterChar);
          finalSaju = {
            dayMaster: result.dayMaster,
            dayMasterChar: result.dayMasterChar,
            fourPillars: result.fourPillars,
            elements: stats.ohaeng,
            tenGods: stats.tenGods,
            currentDaewoon: result.currentDaewoon || null,
            currentSeun: result.currentSeun || null
          };
        }
      } catch (e) {
        console.warn('⚠️ 대시보드 실시간 사주 계산 실패:', e);
      }
    }

    if (!finalSaju) {
      finalSaju = reportData?.saju || userProfile?.saju;
    }

    // 최종 폴백 (갑자일주 기본값)
    if (!finalSaju) {
      finalSaju = {
        dayMaster: "갑목",
        dayMasterChar: "甲",
        fourPillars: {
          year: { gan: "甲", ji: "子" },
          month: { gan: "甲", ji: "子" },
          day: { gan: "甲", ji: "子", char: "甲" },
          time: { gan: "甲", ji: "子" }
        },
        elements: { wood: 1, fire: 0, earth: 0, metal: 0, water: 0 },
        tenGods: { self: 1, output: 0, wealth: 0, power: 0, resource: 0 }
      };
    }
    return finalSaju;
  }, [reportData, userProfile]);

  // ── 1. 운명 DNA 메타포 계산 ──
  const dayPillar = activeSaju.fourPillars?.day || {};
  const dayGan = dayPillar.gan?.char || dayPillar.gan || activeSaju.dayMasterChar || '甲';
  const dayJi = dayPillar.ji?.char || dayPillar.ji || '子';
  const dayMasterName = activeSaju.dayMaster || '갑목';

  const metaphor = useMemo(() => {
    const colorInfo = COLOR_MAP[dayGan] || { adjective: '신비로운', emoji: '🔮' };
    const animalName = ANIMAL_MAP[dayJi] || '호랑이';
    return {
      title: `${colorInfo.adjective} ${animalName}`,
      emoji: colorInfo.emoji,
      sub: `${dayMasterName} × ${dayGan}${dayJi} 일주`
    };
  }, [dayGan, dayJi, dayMasterName]);

  // ── 2. 십성 레이다 차트 좌표 동적 연산 ──
  const tenGods = activeSaju.tenGods || { self: 0, output: 0, wealth: 0, power: 0, resource: 0 };
  const radarPoints = useMemo(() => {
    // 십성 데이터의 상대적 강도를 비례하여 SVG 오각형 좌표 도출
    const maxVal = Math.max(tenGods.self, tenGods.output, tenGods.wealth, tenGods.power, tenGods.resource, 1);
    
    const getR = (val: number) => 10 + (val / maxVal) * 35; // 최소 반경 10, 최대 45
    
    const rSelf = getR(tenGods.self);
    const rOutput = getR(tenGods.output);
    const rWealth = getR(tenGods.wealth);
    const rPower = getR(tenGods.power);
    const rResource = getR(tenGods.resource);

    // 오각형 꼭짓점 각도 계산
    const angleSelf = -Math.PI / 2; // 12시
    const angleOutput = -Math.PI / 2 + (72 * Math.PI) / 180;
    const angleWealth = -Math.PI / 2 + (144 * Math.PI) / 180;
    const anglePower = -Math.PI / 2 + (216 * Math.PI) / 180;
    const angleResource = -Math.PI / 2 + (288 * Math.PI) / 180;

    const pSelf = { x: 50 + rSelf * Math.cos(angleSelf), y: 50 + rSelf * Math.sin(angleSelf) };
    const pOutput = { x: 50 + rOutput * Math.cos(angleOutput), y: 50 + rOutput * Math.sin(angleOutput) };
    const pWealth = { x: 50 + rWealth * Math.cos(angleWealth), y: 50 + rWealth * Math.sin(angleWealth) };
    const pPower = { x: 50 + rPower * Math.cos(anglePower), y: 50 + rPower * Math.sin(anglePower) };
    const pResource = { x: 50 + rResource * Math.cos(angleResource), y: 50 + rResource * Math.sin(angleResource) };

    return `${pSelf.x.toFixed(1)},${pSelf.y.toFixed(1)} ${pOutput.x.toFixed(1)},${pOutput.y.toFixed(1)} ${pWealth.x.toFixed(1)},${pWealth.y.toFixed(1)} ${pPower.x.toFixed(1)},${pPower.y.toFixed(1)} ${pResource.x.toFixed(1)},${pResource.y.toFixed(1)}`;
  }, [tenGods]);

  // ── 3. 오행 데이터 비율 계산 ──
  const elements = activeSaju.elements || { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const elementsPercent = useMemo(() => {
    const total = (elements.wood + elements.fire + elements.earth + elements.metal + elements.water) || 1;
    return {
      wood: Math.round((elements.wood / total) * 100),
      fire: Math.round((elements.fire / total) * 100),
      earth: Math.round((elements.earth / total) * 100),
      metal: Math.round((elements.metal / total) * 100),
      water: Math.round((elements.water / total) * 100),
    };
  }, [elements]);

  // ── 4. 겉과 속 갭 점수 동적 계산 ──
  const meta = (reportData?.meta || {}) as any;
  const gapScore = useMemo(() => {
    const perfection = Math.min(98, 50 + (meta.energyLevel ? (100 - meta.energyLevel) / 2 : 34));
    const anxiety = Math.min(99, 40 + (meta.sleepQuality ? (5 - meta.sleepQuality) * 12 : 42));
    const decision = meta.stressFactors?.length ? Math.min(90, 40 + meta.stressFactors.length * 10) : 67;
    return Math.round((perfection + anxiety + decision) / 3);
  }, [meta]);

  // ── 5. 월별 재물/성취 흐름 데이터 계산 ──
  const monthlyScores = useMemo(() => {
    const total = (elements.wood + elements.fire + elements.earth + elements.metal + elements.water) || 5;
    const wPct = elements.wood / total;
    const fPct = elements.fire / total;
    const ePct = elements.earth / total;
    const mPct = elements.metal / total;
    const waPct = elements.water / total;

    const baseScores = [
      { month: '1월', score: 40 + waPct * 50 + ePct * 10 },
      { month: '2월', score: 45 + wPct * 40 + waPct * 10 },
      { month: '3월', score: 55 + wPct * 50 },
      { month: '4월', score: 50 + wPct * 30 + ePct * 20 },
      { month: '5월', score: 65 + fPct * 40 + wPct * 10 },
      { month: '6월', score: 70 + fPct * 50 },
      { month: '7월', score: 60 + fPct * 30 + ePct * 20 },
      { month: '8월', score: 50 + mPct * 40 + fPct * 10 },
      { month: '9월', score: 65 + mPct * 50 },
      { month: '10월', score: 55 + mPct * 30 + ePct * 20 },
      { month: '11월', score: 45 + waPct * 40 + mPct * 10 },
      { month: '12월', score: 40 + waPct * 50 }
    ];

    return baseScores.map(item => {
      const rounded = Math.max(35, Math.min(98, Math.round(item.score)));
      let status = 'warning';
      if (rounded >= 70) status = 'success';
      else if (rounded < 50) status = 'danger';
      return { month: item.month, score: rounded, status };
    });
  }, [elements]);

  // ── 6. 년월별 운세 매트릭스 계산 (2026년 5월 ~ 8월 기준) ──
  const sajuMatrixData = useMemo(() => {
    // 2026년 월별 간지
    const monthlyPillars = [
      { date: '2026.05', gan: '癸', ji: '巳', un: '태(胎)', sin: '재살, 겁살', active: true },
      { date: '2026.06', gan: '甲', ji: '午', un: '양(養)', sin: '천살, 재살', active: false },
      { date: '2026.07', gan: '乙', ji: '未', un: '장생(長生)', sin: '지살, 천살', active: false },
      { date: '2026.08', gan: '丙', ji: '申', un: '목욕(沐浴)', sin: '연살, 망신', active: false }
    ];

    // 천간 색상 매핑
    const getGanBg = (gan: string) => {
      const info = STEM_INFO[gan];
      if (!info) return 'bg-slate-500 text-white';
      if (info.ohaeng === 'wood') return 'bg-green-600 text-white';
      if (info.ohaeng === 'fire') return 'bg-red-500 text-white';
      if (info.ohaeng === 'earth') return 'bg-amber-500 text-white';
      if (info.ohaeng === 'metal') return 'bg-slate-400 text-white';
      return 'bg-blue-500 text-white'; // water
    };

    const getJiBg = (ji: string) => {
      const info = BRANCH_INFO[ji];
      if (!info) return 'bg-slate-500 text-white';
      if (info.ohaeng === 'wood') return 'bg-green-600 text-white';
      if (info.ohaeng === 'fire') return 'bg-red-500 text-white';
      if (info.ohaeng === 'earth') return 'bg-amber-500 text-white';
      if (info.ohaeng === 'metal') return 'bg-slate-400 text-white';
      return 'bg-blue-500 text-white'; // water
    };

    return monthlyPillars.map(col => {
      const tSip = getTenGod(dayGan, col.gan, false);
      const zSip = getTenGod(dayGan, col.ji, true);
      return {
        ...col,
        tSip,
        zSip,
        tGanBg: getGanBg(col.gan),
        zziBg: getJiBg(col.ji)
      };
    });
  }, [dayGan]);

  // 대우주 기질 등급 (SSR, SR 등)
  const ssrBadge = useMemo(() => {
    const isSpecial = tenGods.self >= 3 || tenGods.output >= 3 || tenGods.wealth >= 3 || tenGods.power >= 3 || tenGods.resource >= 3;
    return isSpecial ? '👑 희소성: SSR 등급 (상위 0.1%)' : '💎 등급: SR 등급 (상위 1.5%)';
  }, [tenGods]);

  // ── 모달 렌더링 ──
  const content = (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      
      {/* 닫기 버튼 (모달 전용) */}
      {onClose && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-500 flex items-center justify-center transition-all border border-slate-200"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* 헤더 */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold rounded-full mb-3 shadow-sm">
          <Sparkles size={12} className="animate-spin-slow" /> Myeongsim OS V4 Dashboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F1E1D] font-serif tracking-tight">
          명심코칭 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">프리미엄 리포트 new</span>
        </h1>
        <p className="text-sm text-[#7A7571] mt-2 font-medium">
          동양 사주 역학 메커니즘과 서양 인지 심리학 알고리즘의 유기적 동적 바인딩
        </p>
      </div>

      {/* ==========================================
          1. 운명 DNA 프로필 & 십성 레이다 차트 컴포넌트
          ========================================== */}
      <div className="w-full bg-[#FAF9F5] p-6 rounded-3xl border border-[#EBE7DC] shadow-sm mb-8">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-sm animate-pulse">
            {ssrBadge}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C2A29] mt-3 font-serif">운명 프로필 & 십성 분석</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 프로필 카드 */}
          <div className="bg-white p-6 rounded-2xl border border-[#EAE6DB] flex flex-col items-center justify-center text-center shadow-inner-sm">
            <div className="w-24 h-24 bg-[#FFFDF9] border-2 border-amber-500 rounded-full flex items-center justify-center text-5xl shadow-inner mb-4">
              {metaphor.emoji}
            </div>
            <h3 className="text-xl font-bold text-[#3A3837] font-serif">{metaphor.title}</h3>
            <p className="text-sm text-amber-700 font-medium tracking-wide mt-1">{metaphor.sub}</p>
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {['#소통의_달인', '#본질적_자아', '#주권자_에너지', '#심리_디버깅_중'].map((tag, idx) => (
                <span key={idx} className="bg-[#F4F1E9] text-[#5C5856] text-xs px-2.5 py-1 rounded-md border border-[#E5E0D3]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 오각형 레이다 차트 (네이티브 SVG 동적 좌표 연산) */}
          <div className="bg-white p-6 rounded-2xl border border-[#EAE6DB] flex flex-col items-center justify-center shadow-inner-sm">
            <h4 className="text-sm font-bold text-[#5C5856] mb-2">자네의 십성(十星) 강점 분포도</h4>
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* 배경 가이드 라인 오각형 */}
                <polygon points="50,5 93,36 76,88 24,88 7,36" fill="none" stroke="#E6E0D2" strokeWidth="0.5" />
                <polygon points="50,20 82,43 70,80 30,80 18,43" fill="none" stroke="#E6E0D2" strokeWidth="0.5" strokeDasharray="2" />
                <polygon points="50,35 71,50 63,71 37,71 29,50" fill="none" stroke="#E6E0D2" strokeWidth="0.5" />
                
                {/* 축 라인 */}
                <line x1="50" y1="50" x2="50" y2="5" stroke="#E6E0D2" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="93" y2="36" stroke="#E6E0D2" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="76" y2="88" stroke="#E6E0D2" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="24" y2="88" stroke="#E6E0D2" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="7" y2="36" stroke="#E6E0D2" strokeWidth="0.5" />

                {/* 실제 데이터 폴리곤 (동적 바인딩 연산) */}
                <polygon points={radarPoints} fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth="1.5" />
                
                {/* 텍스트 축 라벨 */}
                <text x="50" y="2" textAnchor="middle" className="text-[5px] font-bold fill-[#8A8473]">비겁 (자비)</text>
                <text x="97" y="37" textAnchor="start" className="text-[5px] font-bold fill-green-600">식상 (표현)★</text>
                <text x="80" y="94" textAnchor="middle" className="text-[5px] font-bold fill-[#8A8473]">재성 (분별)</text>
                <text x="20" y="94" textAnchor="middle" className="text-[5px] font-bold fill-red-500">관성 (통제)⚠️</text>
                <text x="3" y="37" textAnchor="end" className="text-[5px] font-bold fill-[#8A8473]">인성 (통찰)</text>
              </svg>
            </div>
            <div className="flex gap-4 mt-3 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>내면 상태</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>주의 요망</span>
            </div>
          </div>
        </div>
        
        {/* 긴급 진단 안내문 배너 */}
        <div className="mt-4 bg-[#FFF9F0] border border-[#F5E3C3] p-4 rounded-xl">
          <p className="text-sm text-[#876229] leading-relaxed font-medium">
            ⚠️ <span className="font-bold">기질 디버깅 조언:</span> 자네의 기질에 비추어볼 때, 외부적 통제(관성)가 들어올 때 스트레스 지수가 치솟을 수 있네. 겉마음의 포용력과 내적 자각의 조율이 꼭 필요하네.
          </p>
        </div>
      </div>

      {/* ==========================================
          2. 오행 기운 분석 & 갭 점수 도넛 컴포넌트
          ========================================== */}
      <div className="w-full bg-white p-6 rounded-3xl border border-[#EBE7DC] shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 왼쪽: 오행 프로그레스 레이아웃 */}
        <div>
          <h3 className="text-lg font-bold text-[#2C2A29] mb-4 font-serif">사주팔자가 가진 다섯 기운 균형</h3>
          <div className="space-y-4">
            {[
              { name: '목 mok', count: `${elements.wood}개`, percent: elementsPercent.wood, color: 'bg-green-500' },
              { name: '화 hwa', count: `${elements.fire}개`, percent: elementsPercent.fire, color: 'bg-red-500' },
              { name: '토 to', count: `${elements.earth}개`, percent: elementsPercent.earth, color: 'bg-amber-600' },
              { name: '금 geum', count: `${elements.metal}개`, percent: elementsPercent.metal, color: 'bg-slate-500' },
              { name: '수 su', count: `${elements.water}개`, percent: elementsPercent.water, color: 'bg-blue-500' },
            ].map((elem, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="w-20 font-bold text-sm text-[#4A4744] tracking-wide uppercase">{elem.name}</div>
                <div className="flex-1 bg-[#F4F1E9] h-3 rounded-full overflow-hidden">
                  <div className={`h-full ${elem.color} transition-all duration-1000`} style={{ width: `${elem.percent}%` }}></div>
                </div>
                <div className="w-14 text-right">
                  <span className="text-xs text-gray-400 mr-1.5">{elem.count}</span>
                  <span className="text-base font-bold text-[#2C2A29]">{elem.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 내면 심리 갭 점수 원형 도넛 */}
        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-[#EBE7DC] pt-6 md:pt-0 md:pl-8">
          <h3 className="text-sm font-bold text-[#5C5856] mb-4">자네의 겉과 속 갭(Gap) 점수</h3>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle className="text-[#F4F1E9]" strokeWidth="3.5" stroke="currentColor" fill="none" cx="18" cy="18" r="15.915" />
              <circle className="text-red-500 transition-all duration-1000" 
                      strokeDasharray={`${gapScore}, 100`} 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="none" 
                      cx="18" cy="18" r="15.915" />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-[#2C2A29]">{gapScore}</span>
              <span className="text-xs block text-gray-400 font-bold tracking-tight">갭 점수</span>
            </div>
          </div>
          <p className="text-xs text-center text-[#6E6A66] leading-relaxed mt-4 max-w-xs font-medium">
            100점 만점 기준 · 높을수록 피로도와 내면의 갈등이 깊음을 뜻하네. <span className="text-red-500 font-bold">MBCT 자각 명상 완화 기법</span>이 추천되네.
          </p>
        </div>
      </div>

      {/* ==========================================
          3. 월별 재물/성취 에너지 흐름도 바 차트
          ========================================== */}
      <div className="w-full bg-[#FFFDF9] p-6 rounded-3xl border border-[#EBE7DC] shadow-sm mb-8">
        <h3 className="text-lg font-bold text-[#2C2A29] mb-6 flex items-center gap-2 font-serif">
          <TrendingUp className="w-5 h-5 text-amber-600" /> 2026년 대운 커스터마이징 재물/성취 에너지 흐름도
        </h3>
        
        {/* 바 차트 레이아웃 */}
        <div className="w-full h-48 flex items-end justify-between gap-1 border-b border-[#EAE6DB] pb-2 pt-4 px-2 overflow-x-auto">
          {monthlyScores.map((item, idx) => {
            let barColor = 'bg-amber-400';
            let textColor = 'text-amber-600';
            if (item.status === 'success') { barColor = 'bg-emerald-500'; textColor = 'text-emerald-600'; }
            if (item.status === 'danger') { barColor = 'bg-rose-500'; textColor = 'text-rose-500'; }

            return (
              <div key={idx} className="flex flex-col items-center flex-1 min-w-[32px] group">
                <span className={`text-xs font-bold ${textColor} mb-1 opacity-90 group-hover:scale-110 transition-transform`}>
                  {item.score}
                </span>
                <div 
                  className={`w-full max-w-[18px] ${barColor} rounded-t-sm transition-all duration-1000 ease-out origin-bottom hover:brightness-95`}
                  style={{ height: `${item.score * 1.3}px` }}
                ></div>
                <span className="text-[11px] font-medium text-gray-500 mt-2 whitespace-nowrap">{item.month}</span>
              </div>
            );
          })}
        </div>

        {/* 상태 안내 라벨 */}
        <div className="flex justify-center gap-4 mt-4 text-xs font-semibold text-[#5C5856]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>올해 타이밍의 달</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>보통의 달</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>조심해야 하는 달</span>
        </div>
      </div>

      {/* ==========================================
          4. 프리미엄 커스텀 월운표 격자 테이블
          ========================================== */}
      <div className="w-full bg-white p-6 rounded-3xl border border-[#EBE7DC] shadow-sm overflow-hidden">
        <h3 className="text-lg font-bold text-[#2C2A29] mb-4 text-center font-serif">🗓️ 명심코칭 개인 맞춤형 운세 매트릭스 (2026.05 ~ 08)</h3>
        <div className="overflow-x-auto rounded-xl border border-[#EAE6DB]">
          <table className="w-full text-center border-collapse text-sm">
            <thead>
              <tr className="bg-[#F8F6F0] text-[#5C5856] font-bold border-b border-[#EAE6DB]">
                <th className="py-3 px-2 border-r border-[#EAE6DB] bg-[#F1EDE2] w-24">년/월</th>
                {sajuMatrixData.map((col, idx) => (
                  <th key={idx} className={`py-3 px-3 border-r border-[#EAE6DB] min-w-[100px] ${col.active ? 'ring-2 ring-rose-500 ring-inset bg-rose-50/30' : ''}`}>
                    {col.date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#2C2A29] font-medium">
              <tr className="border-b border-[#EAE6DB]">
                <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">천간십성</td>
                {sajuMatrixData.map((col, idx) => <td key={idx} className={`border-r border-[#EAE6DB] ${col.active ? 'bg-rose-50/20 font-bold' : ''}`}>{col.tSip}</td>)}
              </tr>
              <tr className="border-b border-[#EAE6DB]">
                <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">천간(天干)</td>
                {sajuMatrixData.map((col, idx) => (
                  <td key={idx} className="border-r border-[#EAE6DB] p-1.5">
                    <div className={`w-9 h-9 mx-auto flex items-center justify-center rounded-md text-base font-black ${col.tGanBg}`}>
                      {col.gan}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#EAE6DB]">
                <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">지지(地支)</td>
                {sajuMatrixData.map((col, idx) => (
                  <td key={idx} className="border-r border-[#EAE6DB] p-1.5">
                    <div className={`w-9 h-9 mx-auto flex items-center justify-center rounded-md text-base font-black ${col.zziBg}`}>
                      {col.ji}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-[#EAE6DB]">
                <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">지지십성</td>
                {sajuMatrixData.map((col, idx) => <td key={idx} className="border-r border-[#EAE6DB]">{col.zSip}</td>)}
              </tr>
              <tr className="border-b border-[#EAE6DB]">
                <td className="py-2.5 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">12운성</td>
                {sajuMatrixData.map((col, idx) => <td key={idx} className="border-r border-[#EAE6DB] text-gray-600">{col.un}</td>)}
              </tr>
              <tr>
                <td className="py-3 bg-[#F8F6F0] font-bold border-r border-[#EAE6DB]">12신살</td>
                {sajuMatrixData.map((col, idx) => (
                  <td key={idx} className="border-r border-[#EAE6DB] text-xs px-2 text-[#7A5B35] font-semibold whitespace-pre-line">
                    {col.sin}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 모달로 열릴 경우
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-[1050] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200">
          {content}
        </div>
      </div>
    );
  }

  // 기본 컴포넌트 렌더링
  return (
    <div className="min-h-screen bg-[#FDFDFB] py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-amber-200">
      {content}
    </div>
  );
}
