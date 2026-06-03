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

const SECTIONS_108 = [
  {
    part: "Part 0. 나를 알아보기 : 성격·기질·장단점 (p. 5 ~ 32)",
    items: [
      { id: "p5_8", title: "p. 5 ~ 8 [핵심 기질 1] 일간 본질 분석", framework: "CBT 인지행동 프로토콜" },
      { id: "p9_12", title: "p. 9 ~ 12 [핵심 기질 2] 현대적 기질 메타포", framework: "CBT 인지행동 프로토콜" },
      { id: "p13_16", title: "p. 13 ~ 16 [결정적 재능] 잠재력 디코딩", framework: "CBT 인지행동 프로토콜" },
      { id: "p17_20", title: "p. 17 ~ 20 [일주 분석] 시공간과 영역의 법칙", framework: "CBT 인지행동 프로토콜" },
      { id: "p21_24", title: "p. 21 ~ 24 [심화 분석 1] 과다 십신의 폭주 제어", framework: "CBT 인지행동 프로토콜" },
      { id: "p25_28", title: "p. 25 ~ 28 [심화 분석 2] 인지적 왜곡과 마인드셋", framework: "CBT 인지행동 프로토콜" },
      { id: "p29_32", title: "p. 29 ~ 32 [심화 분석 3] 결핍 십신의 보완과 소통", framework: "CBT 인지행동 프로토콜" },
    ]
  },
  {
    part: "Part 1. 타이밍의 기술 : 운의 흐름과 메타 전략 (p. 33 ~ 54)",
    items: [
      { id: "p33_36", title: "p. 33 ~ 36 [포커스 월간 운세 1] 기회의 달 폭발 전략", framework: "ACT 수용전념 프로토콜" },
      { id: "p37_40", title: "p. 37 ~ 40 [포커스 월간 운세 2] 리스크 구간 방어 프로토콜", framework: "ACT 수용전념 프로토콜" },
      { id: "p41_46", title: "p. 41 ~ 46 [현재 대운 분석] 인생의 거대한 파도", framework: "ACT 수용전념 프로토콜" },
      { id: "p47_50", title: "p. 47 ~ 50 [미래 대운 분석] 선행적 자산 설계", framework: "ACT 수용전념 프로토콜" },
      { id: "p51_54", title: "p. 51 ~ 54 [타이밍 메타 코드] 운명 동기화", framework: "ACT 수용전념 프로토콜" },
    ]
  },
  {
    part: "Part 2. 나의 본질 완전판 : 갭 분석 + 적성 (p. 55 ~ 76)",
    items: [
      { id: "p55_59", title: "p. 55 ~ 59 [심리 구조] 내면 방어기제 해부", framework: "MBCT 마음챙김 인지치료" },
      { id: "p60_64", title: "p. 60 ~ 64 [기질 융합] 동서양 심리 지표 크로스 매핑", framework: "MBCT 마음챙김 인지치료" },
      { id: "p65_68", title: "p. 65 ~ 68 [명심 적성] 천명 기반 비즈니스 설계", framework: "MBCT 마음챙김 인지치료" },
      { id: "p69_72", title: "p. 69 ~ 72 [리스크 관리] 인간 리스크 방어막", framework: "MBCT 마음챙김 인지치료" },
      { id: "p73_76", title: "p. 73 ~ 76 [갭 분석 솔루션] 자아 디커플링 보정", framework: "MBCT 마음챙김 인지치료" },
    ]
  },
  {
    part: "Part 3. 관계의 기술 : 신살·귀인 + 연애 + 결혼 (p. 77 ~ 94)",
    items: [
      { id: "p77_80", title: "p. 77 ~ 80 [신살 승화] 살을 매력 자산으로", framework: "DBT 변증법적 행동치료" },
      { id: "p81_84", title: "p. 81 ~ 84 [대인 귀인] 운명의 인적 네트워크", framework: "DBT 변증법적 행동치료" },
      { id: "p85_87", title: "p. 85 ~ 87 [연애 DNA] 무의식적 끌림의 미학", framework: "DBT 변증법적 행동치료" },
      { id: "p88_90", title: "p. 88 ~ 90 [관계 리스크] 검열의 함정", framework: "DBT 변증법적 행동치료" },
      { id: "p91_94", title: "p. 91 ~ 94 [결혼 및 파트너십] 영혼의 결합", framework: "DBT 변증법적 행동치료" },
    ]
  },
  {
    part: "Part 4. 실천의 시작 : 종합 리포트 + 액션플랜 (p. 95 ~ 108)",
    items: [
      { id: "p95_98", title: "p. 95 ~ 98 [오행 솔루션] 신경학적 개운 처방", framework: "MBSR 스트레스 완화" },
      { id: "p99_102", title: "p. 99 ~ 102 [액션 플랜] 고효율 리추얼 설계", framework: "MBSR 스트레스 완화" },
      { id: "p103_105", title: "p. 103 ~ 105 [마스터의 편지] 세공의 마침표", framework: "MBSR 스트레스 완화" },
      { id: "p106_108", title: "p. 106 ~ 108 [명심코칭 메타 워크시트] 108일의 기적", framework: "MBSR 스트레스 완화" },
    ]
  }
];

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

  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'report'>('dashboard');
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null);
  const [sectionContent, setSectionContent] = React.useState<string | null>(null);
  const [isSectionLoading, setIsSectionLoading] = React.useState<boolean>(false);
  const [fetchingCache, setFetchingCache] = React.useState<boolean>(false);

  // 특정 섹션 클릭 시 수파베이스/로컬 캐시 확인
  const handleSectionClick = async (sectionId: string) => {
    setSelectedSection(sectionId);
    setSectionContent(null);
    setFetchingCache(true);

    const userId = userProfile?.id || (reportData as any)?.userId || 'guest';

    try {
      // 1. 먼저 DB 조회 (Supabase API)
      const res = await fetch(`/api/coaching/108-reports?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reports && data.reports[sectionId]) {
          setSectionContent(data.reports[sectionId]);
          setFetchingCache(false);
          return;
        }
      }
    } catch (e) {
      console.warn('⚠️ DB 캐시 조회 실패, 로컬 캐시 탐색:', e);
    }

    // 2. 로컬스토리지 캐시 탐색
    if (typeof window !== 'undefined') {
      const userKey = activeSaju ? activeSaju.dayMasterChar + '_' + (activeSaju.dayMaster || '') : 'guest';
      const localCacheKey = `ms_108_ai_content_v12_${userKey}`;
      const localCacheStr = localStorage.getItem(localCacheKey);
      if (localCacheStr) {
        const localCache = JSON.parse(localCacheStr);
        if (localCache[sectionId]) {
          const val = localCache[sectionId];
          const text = typeof val === 'object' ? (val.desc || val.generated_text || JSON.stringify(val)) : val;
          setSectionContent(text);
          setFetchingCache(false);
          return;
        }
      }
    }

    setFetchingCache(false);
  };

  const handleGenerateSection = async (sectionId: string, title: string) => {
    setIsSectionLoading(true);
    const userId = userProfile?.id || (reportData as any)?.userId || 'guest';
    const userKey = activeSaju ? activeSaju.dayMasterChar + '_' + (activeSaju.dayMaster || '') : 'guest';

    try {
      const response = await fetch('/api/coaching/generate-108', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey: sectionId,
          userKey: userKey,
          sajuData: activeSaju,
          sajuProfile: {
            dayMasterChar: activeSaju.dayMasterChar,
            dayMasterAnalogy: metaphor.title,
            sajuGanji: metaphor.sub
          },
          originalPage: {
            title: title,
            desc: "명심코칭 알고리즘을 통한 인생 흐름 해석"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.pageData) {
          const generatedText = data.pageData.desc || data.pageData.generated_text || data.pageData.coachingSolution || JSON.stringify(data.pageData);
          setSectionContent(generatedText);

          // 로컬 동기화
          const localCacheKey = `ms_108_ai_content_v12_${userKey}`;
          const localCacheStr = localStorage.getItem(localCacheKey);
          const localCache = localCacheStr ? JSON.parse(localCacheStr) : {};
          localCache[sectionId] = generatedText;
          localStorage.setItem(localCacheKey, JSON.stringify(localCache));

          // DB 동기화
          await fetch('/api/coaching/108-reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId,
              pageKey: sectionId,
              generatedContent: generatedText
            })
          });
        } else {
          alert('엔진 해석 데이터 로딩 실패. 다시 시도해주세요.');
        }
      } else {
        alert('명심코칭 AI 엔진 연결 중 오류가 발생했습니다.');
      }
    } catch (e) {
      console.error(e);
      alert('AI 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSectionLoading(false);
    }
  };

  // ── [실시간 만세력 연산 & Hydration 락 해소 장치] ──
  const [activeSaju, setActiveSaju] = React.useState<any>({
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
  });

  // [Hyper-Pass] 로컬 스토리지 다이렉트 파싱 폴백
  const getSajuFromLocalStorage = (): any => {
    if (typeof window === 'undefined') return null;
    try {
      const storageStr = localStorage.getItem('myeongsim-report-storage');
      if (storageStr) {
        const parsed = JSON.parse(storageStr);
        return parsed?.state?.reportData || null;
      }
    } catch (e) {
      console.warn('⚠️ [Dashboard] 스토리지 파싱 실패:', e);
    }
    return null;
  };

  React.useEffect(() => {
    if (isOpen) {
      const localData = getSajuFromLocalStorage();
      const finalReportData = reportData || localData;

      const rawDate = finalReportData?.birthDate || userProfile?.birthDate || userProfile?.birth_date || userProfile?.user_metadata?.saju_data?.date || userProfile?.user_metadata?.birth_date;
      const rawTime = finalReportData?.birthTime || userProfile?.birthTime || userProfile?.birth_time || '12:00';
      const calType = finalReportData?.meta?.calendarType || userProfile?.calendar_type || 'solar';
      const gender = finalReportData?.gender || userProfile?.gender || 'male';

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
            console.log('📊 [Dashboard] 실시간 사주 매칭 연동 성공! 생년월일:', rawDate);
          }
        } catch (e) {
          console.warn('⚠️ [Dashboard] 실시간 사주 계산 오류:', e);
        }
      }

      if (!finalSaju) {
        finalSaju = finalReportData?.saju || userProfile?.saju;
      }

      if (finalSaju) {
        setActiveSaju(finalSaju);
      }
    }
  }, [isOpen, reportData, userProfile]);

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
      <div className="max-w-4xl mx-auto mb-6 text-center">
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

      {/* 탭 네비게이션 */}
      <div className="flex justify-center border-b border-[#EBE7DC] mb-8 gap-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-3 px-6 font-bold text-sm tracking-wide transition-all border-b-2 ${
            activeTab === 'dashboard'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-slate-800'
          }`}
        >
          📊 실시간 대시보드
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`py-3 px-6 font-bold text-sm tracking-wide transition-all border-b-2 ${
            activeTab === 'report'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-slate-800'
          }`}
        >
          📖 108자각 상세 백서 (108p)
        </button>
      </div>

      {/* 탭 1: 실시간 대시보드 */}
      {activeTab === 'dashboard' && (
        <>
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
        </>
      )}

      {/* 탭 2: 108페이지 상세 백서 조회 */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="p-5 bg-amber-50/50 border border-amber-200/60 rounded-2xl text-center max-w-xl mx-auto mb-6">
            <p className="text-xs text-amber-800 font-bold">
              🔮 각 서판을 클릭하면 봉인이 풀리며, 제미나이 2.5 플래시 AI 엔진이 작동해 108페이지 분량의 개인 맞춤형 리포트를 페이지별로 즉석 해석합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 좌측: 108페이지 목차 섹션 리스트 */}
            <div className="lg:col-span-1 bg-[#FAF9F5] p-4 rounded-2xl border border-[#EBE7DC] max-h-[60vh] overflow-y-auto space-y-4">
              {SECTIONS_108.map((part, idx) => (
                <div key={idx} className="space-y-1.5 text-left">
                  <h4 className="text-xs font-black text-amber-700 tracking-wider mb-2 border-b border-amber-200/50 pb-1 uppercase">
                    {part.part}
                  </h4>
                  {part.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex flex-col transition-all gap-1 ${
                        selectedSection === item.id
                          ? 'bg-amber-600 text-white border-transparent shadow-sm'
                          : 'bg-white text-slate-700 border-[#EAE6DB] hover:bg-[#FDFDFB]'
                      }`}
                    >
                      <span>{item.title}</span>
                      <span className={`text-[10px] ${selectedSection === item.id ? 'text-amber-100' : 'text-gray-400'}`}>
                        {item.framework}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* 우측: 클릭한 섹션의 실시간 온디맨드 뷰어 */}
            <div className="lg:col-span-2 bg-[#FAF9F5] p-6 rounded-2xl border border-[#EBE7DC] min-h-[400px] flex flex-col justify-center shadow-inner-sm">
              {!selectedSection ? (
                /* 미선택 초기 뷰 */
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">📖</span>
                  <h4 className="text-base font-bold text-slate-800 font-serif">108 자각 백서 열람실</h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mt-2 leading-relaxed">
                    왼쪽 목차에서 해석하고 싶은 페이지 범위를 선택해주십시오. 즉석에서 AI 분석 엔진이 기질을 바인딩합니다.
                  </p>
                </div>
              ) : fetchingCache ? (
                /* 캐시 로딩 뷰 */
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-xs text-gray-500 font-medium">운명의 봉인 캐시를 확인하는 중...</p>
                </div>
              ) : sectionContent ? (
                /* 내용 출력 뷰 */
                <div className="prose prose-stone max-w-none text-slate-700 animate-fade-in flex-grow flex flex-col">
                  <div className="bg-emerald-50/50 border border-emerald-200/60 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 mb-4 max-w-max">
                    ✨ 안전하게 보관된 자각 서판 (수파베이스 클라우드 동기화 완료)
                  </div>
                  <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-left font-serif p-4 bg-white rounded-xl border border-[#EAE6DB] flex-grow overflow-y-auto max-h-[50vh] min-h-[300px]">
                    {sectionContent}
                  </div>
                  <button
                    onClick={() => {
                      const item = SECTIONS_108.flatMap(p => p.items).find(i => i.id === selectedSection);
                      if (item) handleGenerateSection(item.id, item.title);
                    }}
                    className="mt-4 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 self-end transition-all"
                  >
                    🔄 AI 엔진으로 다시 해석하기
                  </button>
                </div>
              ) : isSectionLoading ? (
                /* AI 로딩 뷰 */
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-base font-bold text-amber-800 font-serif animate-pulse">
                    명심코칭 AI 엔진이 기질 알고리즘을 해독하는 중...
                  </p>
                  <p className="text-xs text-gray-400 mt-2">잠시만 기다려주시면 평생 소장 가능한 리포트가 기록됩니다.</p>
                </div>
              ) : (
                /* 생성 유도 뷰 */
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔒</div>
                  <h4 className="text-base font-bold text-slate-800 font-serif">봉인된 자각의 서판일세.</h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mt-2 leading-relaxed px-4">
                    아래 가동 버튼을 누르면 제미나이 2.5 플래시 분석 엔진이 작동하며, 자네의 타고난 사주 원국과 임상 심리 치료 기법을 융합하여 상세 코칭 풀이를 즉석 작성하네.
                  </p>
                  <button
                    onClick={() => {
                      const item = SECTIONS_108.flatMap(p => p.items).find(i => i.id === selectedSection);
                      if (item) handleGenerateSection(item.id, item.title);
                    }}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold text-sm rounded-xl shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    🔮 AI 명심코칭 엔진 가동 (봉인 해제)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 모달로 열릴 경우
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200">
        {content}
      </div>
    </div>
  );
}
