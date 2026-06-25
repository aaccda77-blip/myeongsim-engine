import { NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/SajuEngine';

interface SajuCharInfo {
  element: '목' | '화' | '토' | '금' | '수';
  isYang: boolean;
}

const SAJU_CHARS: Record<string, SajuCharInfo> = {
  // 천간
  '甲': { element: '목', isYang: true },
  '乙': { element: '목', isYang: false },
  '丙': { element: '화', isYang: true },
  '丁': { element: '화', isYang: false },
  '戊': { element: '토', isYang: true },
  '己': { element: '토', isYang: false },
  '庚': { element: '금', isYang: true },
  '辛': { element: '금', isYang: false },
  '壬': { element: '수', isYang: true },
  '癸': { element: '수', isYang: false },
  // 지지
  '寅': { element: '목', isYang: true },
  '卯': { element: '목', isYang: false },
  '巳': { element: '화', isYang: true },
  '午': { element: '화', isYang: false },
  '辰': { element: '토', isYang: true },
  '戌': { element: '토', isYang: true },
  '丑': { element: '토', isYang: false },
  '未': { element: '토', isYang: false },
  '申': { element: '금', isYang: true },
  '酉': { element: '금', isYang: false },
  '亥': { element: '수', isYang: true },
  '子': { element: '수', isYang: false }
};

const SAENG_MAP: Record<string, string> = {
  '목': '화',
  '화': '토',
  '토': '금',
  '금': '수',
  '수': '목'
};

const GEUK_MAP: Record<string, string> = {
  '목': '토',
  '토': '수',
  '수': '화',
  '화': '금',
  '금': '목'
};

function getTenGod(dmChar: string, targetChar: string): '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인' | null {
  const dm = SAJU_CHARS[dmChar];
  const target = SAJU_CHARS[targetChar];
  if (!dm || !target) return null;

  const sameYang = dm.isYang === target.isYang;

  if (dm.element === target.element) {
    return sameYang ? '비견' : '겁재';
  }
  if (SAENG_MAP[dm.element] === target.element) {
    return sameYang ? '식신' : '상관';
  }
  if (GEUK_MAP[dm.element] === target.element) {
    return sameYang ? '편재' : '정재';
  }
  if (GEUK_MAP[target.element] === dm.element) {
    return sameYang ? '편관' : '정관';
  }
  if (SAENG_MAP[target.element] === dm.element) {
    return sameYang ? '편인' : '정인';
  }
  return null;
}

// 지장간(Hidden Stems) 맵 및 분포 비율 (명리 표준 일수 배분 반영)
const JI_HIDDEN_STEMS: Record<string, { stem: string; ratio: number }[]> = {
  '子': [{ stem: '壬', ratio: 10/30 }, { stem: '癸', ratio: 20/30 }],
  '丑': [{ stem: '癸', ratio: 9/30 }, { stem: '辛', ratio: 3/30 }, { stem: '己', ratio: 18/30 }],
  '寅': [{ stem: '戊', ratio: 7/30 }, { stem: '丙', ratio: 7/30 }, { stem: '甲', ratio: 16/30 }],
  '卯': [{ stem: '甲', ratio: 10/30 }, { stem: '乙', ratio: 20/30 }],
  '辰': [{ stem: '乙', ratio: 9/30 }, { stem: '癸', ratio: 3/30 }, { stem: '戊', ratio: 18/30 }],
  '巳': [{ stem: '戊', ratio: 7/30 }, { stem: '庚', ratio: 7/30 }, { stem: '丙', ratio: 16/30 }],
  '午': [{ stem: '丙', ratio: 10/30 }, { stem: '己', ratio: 9/30 }, { stem: '丁', ratio: 11/30 }],
  '未': [{ stem: '丁', ratio: 9/30 }, { stem: '乙', ratio: 3/30 }, { stem: '己', ratio: 18/30 }],
  '申': [{ stem: '戊', ratio: 7/30 }, { stem: '壬', ratio: 7/30 }, { stem: '庚', ratio: 16/30 }],
  '酉': [{ stem: '庚', ratio: 10/30 }, { stem: '辛', ratio: 20/30 }],
  '戌': [{ stem: '辛', ratio: 9/30 }, { stem: '丁', ratio: 3/30 }, { stem: '戊', ratio: 18/30 }],
  '亥': [{ stem: '戊', ratio: 7/30 }, { stem: '甲', ratio: 7/30 }, { stem: '壬', ratio: 16/30 }]
};

const GAN_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const JI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function getGongWang(dayGan: string, dayJi: string): string[] {
  const gIdx = GAN_ORDER.indexOf(dayGan);
  const jIdx = JI_ORDER.indexOf(dayJi);
  if (gIdx === -1 || jIdx === -1) return [];

  const diff = (jIdx - gIdx + 12) % 12;
  if (diff === 0) return ['戌', '亥'];
  if (diff === 10) return ['申', '酉'];
  if (diff === 8) return ['午', '未'];
  if (diff === 6) return ['辰', '巳'];
  if (diff === 4) return ['寅', '卯'];
  if (diff === 2) return ['子', '丑'];
  return [];
}

// 간단한 문자열 해시 함수 (사용자별 고유 편차 부여용)
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export async function POST(request: Request) {
  try {
    const { userId, birthDate, birthTime, calendarType, gender, userName } = await request.json();

    if (!birthDate) {
      return NextResponse.json({ error: '생년월일 정보가 필요합니다.' }, { status: 400 });
    }

    const effectiveTime = birthTime || '12:00';
    const effectiveCalendar = calendarType || 'solar';
    const effectiveGender = gender || 'male';

    // 1. 사주 만세력 계산
    const sajuResult = await calculateSaju(
      birthDate,
      effectiveTime,
      effectiveCalendar,
      effectiveGender
    );

    if (!sajuResult.success || !sajuResult.fourPillars) {
      return NextResponse.json({ error: '사주 분석에 실패했습니다.' }, { status: 500 });
    }

    const pillars = sajuResult.fourPillars;
    
    // 일주 기준 공망 지지 도출
    const dayGan = pillars.day.gan;
    const dayJi = pillars.day.ji;
    const gongWangList = (dayGan && dayJi) ? getGongWang(dayGan, dayJi) : [];

    const elements = [
      pillars.year.ganElement, pillars.year.jiElement,
      pillars.month.ganElement, pillars.month.jiElement,
      pillars.day.ganElement, pillars.day.jiElement,
      pillars.time.ganElement, pillars.time.jiElement,
    ];

    const elementCounts: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    elements.forEach(el => {
      if (elementCounts[el] !== undefined) {
        elementCounts[el]++;
      }
    });

    // 십신 기운 정밀 가중치 연산 (월지 3.0배, 일지 2.0배 및 지장간 비율 적용 + 공망 기운 감쇄)
    const getTenGodWeightedScore = (type: '비겁' | '식상' | '재성' | '관성' | '인성'): number => {
      let score = 0;
      const dmChar = pillars.day.gan;
      if (!dmChar || dmChar === '?') return 1.0;

      // 천간 분석 및 누적
      const checkGan = (ganChar: string, weight: number) => {
        if (!ganChar || ganChar === '?') return;
        const tenGod = getTenGod(dmChar, ganChar);
        if (!tenGod) return;

        if (type === '비겁' && (tenGod === '비견' || tenGod === '겁재')) score += weight;
        else if (type === '식상' && (tenGod === '식신' || tenGod === '상관')) score += weight;
        else if (type === '재성' && (tenGod === '편재' || tenGod === '정재')) score += weight;
        else if (type === '관성' && (tenGod === '편관' || tenGod === '정관')) score += weight;
        else if (type === '인성' && (tenGod === '편인' || tenGod === '정인')) score += weight;
      };

      // 지지 분석 및 지장간 분할 누적 (공망 지지 감쇄)
      const checkJi = (jiChar: string, weight: number, isSelfPillarDay: boolean = false) => {
        if (!jiChar || jiChar === '?') return;
        const hidden = JI_HIDDEN_STEMS[jiChar];
        if (!hidden) return;

        let finalWeight = weight;
        // 년지, 월지, 시지가 일주 기준 공망이면 해당 지지 기운 점수를 40% 감쇄(0.6배 가중치 곱)
        if (!isSelfPillarDay && gongWangList.includes(jiChar)) {
          finalWeight = weight * 0.6;
        }

        hidden.forEach(item => {
          const tenGod = getTenGod(dmChar, item.stem);
          if (!tenGod) return;

          const portion = item.ratio * finalWeight;
          if (type === '비겁' && (tenGod === '비견' || tenGod === '겁재')) score += portion;
          else if (type === '식상' && (tenGod === '식신' || tenGod === '상관')) score += portion;
          else if (type === '재성' && (tenGod === '편재' || tenGod === '정재')) score += portion;
          else if (type === '관성' && (tenGod === '편관' || tenGod === '정관')) score += portion;
          else if (type === '인성' && (tenGod === '편인' || tenGod === '정인')) score += portion;
        });
      };

      // 각 주(Pillar)별 표준 가중치 분배
      checkGan(pillars.year.gan, 1.0);
      checkJi(pillars.year.ji, 1.0, false);

      checkGan(pillars.month.gan, 1.0);
      checkJi(pillars.month.ji, 3.0, false); // 월지 가중치 3배 (가장 강력한 격국/기질 결정 요인)

      checkGan(pillars.day.gan, 1.0);  // 일간 (나 자신)
      checkJi(pillars.day.ji, 2.0, true);  // 일지 가중치 2배 (내면적 성향, 공망 배제)

      checkGan(pillars.time.gan, 1.0);
      checkJi(pillars.time.ji, 1.0, false);

      return score;
    };

    const bigeop = Math.max(0.5, getTenGodWeightedScore('비겁'));
    const sigsang = Math.max(0.5, getTenGodWeightedScore('식상'));
    const jaeseong = Math.max(0.5, getTenGodWeightedScore('재성'));
    const gwanseong = Math.max(0.5, getTenGodWeightedScore('관성'));
    const inseong = Math.max(0.5, getTenGodWeightedScore('인성'));

    // 사용자 이름 기반 고유 해시 시드 생성 (동일 사주인 경우에도 이름에 따른 미세 지표 편차 보정용)
    const seed = hashCode(userName || '명심가') % 15;

    // 0~100 범위로 변환하는 스케일러 (가중치 총합 11점 기준 정밀 스케일링)
    const scale = (val: number, maxVal: number = 11.0) => {
      const p = Math.min(100, Math.max(15, Math.round((val / maxVal) * 100)));
      return p;
    };

    // ==========================================
    // Page 1: 명심 에너지 포스필드 (10대 명심 영역)
    // ==========================================
    // 가중치 합에 맞춰 분모 조절
    const forceField = {
      me: scale(bigeop, 5.0),
      willpower: scale(bigeop + 1.0, 6.0),
      lifeforce: scale(sigsang, 5.0),
      drive: scale(gwanseong, 5.0),
      intuition: scale(inseong, 5.0),
      orientation: scale(jaeseong, 5.0),
      inspiration: scale(inseong + 1.0, 6.0),
      mental: scale(inseong + sigsang, 7.0),
      concepts: scale(sigsang + jaeseong, 7.0),
      feelings: scale(inseong + jaeseong, 7.0),
      expression: scale(sigsang + bigeop, 7.0)
    };

    // ==========================================
    // Page 2: 타고난 명심 알고리즘 (5대 천부 성정)
    // ==========================================
    const specificTalents = {
      action: scale(sigsang + (seed % 2) * 0.5, 6.0),
      courage: scale(gwanseong + (seed % 3) * 0.5, 6.0),
      leadership: scale(gwanseong + bigeop, 8.0),
      structuring: scale(jaeseong + (seed % 2) * 0.5, 6.0),
      autonomy: scale(bigeop + (seed % 3) * 0.5, 6.0)
    };

    // ==========================================
    // Page 3: 기운적 포지셔닝 & 파워베이스 (사회적 기여도)
    // ==========================================
    // 3.1 사회적 천명, 조화적 협업, 독창적 자아 지향성 (절대 강도 스케일링)
    const fulfill = {
      societal: scale(gwanseong * 2.0 + (seed % 3), 11.0),
      communal: scale(jaeseong * 1.5 + bigeop * 1.5 + (seed % 2) * 0.5, 11.0),
      individual: scale(sigsang * 2.0 + inseong * 1.0 + (seed % 3) * 0.5, 11.0)
    };

    // 3.2 명심 최적 아키타입 (Preferred Role)
    let teamRole = '조화로운 조율자 (Consensual Harmonizer)';
    if (gwanseong > bigeop && gwanseong > sigsang) teamRole = '주권적 인도자 (Sovereign Guide)';
    else if (sigsang > gwanseong && sigsang > jaeseong) teamRole = '창조적 활성화가 (Creative Activator)';
    else if (jaeseong > gwanseong) teamRole = '현실적 설계가 (Strategic Architect)';
    else if (bigeop > jaeseong) teamRole = '독립적 실행자 (Autonomous Executor)';

    // 3.3 Powerbase 6대 영향력 (절대 강도 척도로 개별 산출)
    const powerbase = [
      scale(inseong * 2.5 + gwanseong * 1.0, 11.0), // 안정적 경영 관리력 (Stewardship)
      scale(jaeseong * 2.5 + bigeop * 1.0, 11.0),    // 시장 개척 추진력 (Pioneering Force)
      scale(jaeseong * 1.5 + gwanseong * 1.5, 11.0),// 목적 중심 설계력 (Value Planning)
      scale(sigsang * 2.0 + bigeop * 1.5, 11.0),    // 공감적 관계 촉진력 (Empathizer)
      scale(inseong * 2.5 + jaeseong * 1.0, 11.0),   // 지속 가능 유지력 (Sustainability)
      scale(sigsang * 2.5 + inseong * 1.0, 11.0)     // 변화 혁신 창조력 (Metanoic Innovation)
    ];

    // ==========================================
    // Page 4: 기운 정렬 프로필 (18대 재능/협업/풍요)
    // ==========================================
    const talentProfile = [
      scale(sigsang + gwanseong, 8.0),
      scale(jaeseong + bigeop, 8.0),
      scale(bigeop + sigsang, 8.0),
      scale(jaeseong + gwanseong, 8.0),
      scale(sigsang + inseong, 8.0),
      scale(inseong + jaeseong, 8.0)
    ];

    const coopProfile = [
      scale(sigsang + 2.0, 8.0),
      scale(gwanseong + 2.0, 8.0),
      scale(jaeseong + 2.0, 8.0),
      scale(bigeop + 2.0, 8.0),
      scale(inseong + 2.0, 8.0),
      scale(bigeop + sigsang, 8.0)
    ];

    const prosperityProfile = [
      scale(inseong + 2.0, 8.0),
      scale(jaeseong + 1.0, 7.0),
      scale(sigsang + 2.0, 8.0),
      scale(jaeseong + sigsang, 8.0),
      scale(gwanseong + 2.0, 8.0),
      scale(jaeseong + gwanseong, 8.0)
    ];

    // ==========================================
    // Page 5: 명심 의사결정 필터 (판단 구조)
    // ==========================================
    // 5.1 인지 작동 필터 (How Mind Works) - 절대 강도화
    const mindWorks = {
      logical: scale(jaeseong * 2.5 + gwanseong * 1.0, 11.0),
      abstract: scale(inseong * 2.0 + sigsang * 1.5, 11.0),
      individual: scale(bigeop * 2.5 + sigsang * 1.0, 11.0)
    };

    // 5.2 의사결정 판단 토대 (Decision Basis) - 절대 강도화
    const decisionBasis = {
      practical: scale(sigsang * 2.0 + jaeseong * 1.5, 11.0),
      empathic: scale(inseong * 1.5 + bigeop * 1.5, 11.0),
      mental: scale(gwanseong * 3.0, 11.0)
    };

    // 5.3 의사결정 스타일 슬라이더 (-100 ~ 100)
    // 식상이 강하면 즉흥성(음수), 인성이 강하면 숙고성(양수)
    const decisionSlider = Math.min(100, Math.max(-100, Math.round((inseong - sigsang) * 30 + (seed % 10) - 5)));

    // ==========================================
    // Page 6: 소버린 리더십 스펙트럼 (6대 리더십 모델)
    // ==========================================
    const leadershipPerception = [
      scale(sigsang + bigeop, 8.0),
      scale(gwanseong + jaeseong, 8.0),
      scale(inseong + bigeop, 8.0),
      scale(sigsang + gwanseong, 8.0),
      scale(bigeop + 2.0, 8.0),
      scale(gwanseong + 2.0, 8.0)
    ];

    const leadershipSelf = leadershipPerception.map((v, i) => {
      const offset = (seed + i) % 7 - 3;
      return Math.min(100, Math.max(15, v + offset * 4));
    });

    // ==========================================
    // Page 7: 스트레스 시프트 & 행동 본능 (6개 슬라이더: -100 ~ 100)
    // ==========================================
    const behaviors = {
      negotiation: Math.min(100, Math.max(-100, Math.round((bigeop - jaeseong) * 25 + (seed % 10) - 5))),
      competition: Math.min(100, Math.max(-100, Math.round((gwanseong - sigsang) * 25 + (seed % 12) - 6))),
      concepts: Math.min(100, Math.max(-100, Math.round((sigsang - inseong) * 25 + (seed % 8) - 4))),
      contact: Math.min(100, Math.max(-100, Math.round((bigeop - inseong) * 25 + (seed % 10) - 5))),
      conflicts: Math.min(100, Math.max(-100, Math.round((gwanseong - jaeseong) * 25 + (seed % 14) - 7))),
      stress: Math.min(100, Math.max(-100, Math.round((gwanseong - bigeop) * 25 + (seed % 10) - 5)))
    };

    // ==========================================
    // Page 8: 동기 및 인지 메타코드
    // ==========================================
    let motivation = '내적 주체적 실현 및 평정 (Sovereign Ego & Peace)';
    if (inseong > sigsang) motivation = '통찰성찰과 영적 동화 (Reflective Wisdom & Insight)';
    else if (jaeseong > gwanseong) motivation = '현실구조 성취와 자원 조율 (Strategic Achievement)';
    else if (gwanseong > bigeop) motivation = '대의공헌과 리더십 전파 (Sovereign Legacy & Contribution)';
    
    let perspective = '현실 설계 및 리스크 가치 구조화';
    if (gwanseong > jaeseong) perspective = '생존 시스템 분석 및 대의 가치 필터';
    else if (sigsang > bigeop) perspective = '다차원 잠재 창조성 발견 및 기획 렌즈';

    let activityMode = '주도적 몰입 에너지 활성화 및 자율 회복';
    if (bigeop > jaeseong) activityMode = '독자적 정신 통합 및 자아 고유 주파수 복원';

    let infoProcessing = '상생적 교류 공명 및 관계 맥락 필터';
    if (inseong > bigeop) infoProcessing = '내면 사색 수용 및 고요한 통찰 필터';

    return NextResponse.json({
      success: true,
      saju: {
        fourPillars: sajuResult.fourPillars,
        dayMaster: sajuResult.dayMaster,
        elementCounts,
        gongWang: gongWangList
      },
      geniusFullData: {
        gongWang: gongWangList,
        forceField,
        specificTalents,
        fulfill,
        teamRole,
        powerbase,
        talentProfile,
        coopProfile,
        prosperityProfile,
        mindWorks,
        decisionBasis,
        decisionSlider,
        leadershipPerception,
        leadershipSelf,
        behaviors,
        metaCode: {
          motivation,
          motivationScore: scale(bigeop + gwanseong, 8.0),
          perspective,
          perspectiveScore: scale(inseong + sigsang, 8.0),
          activityMode,
          activityModeScore: scale(bigeop + 1.5, 6.5),
          infoProcessing,
          infoProcessingScore: scale(inseong + 1.5, 6.5)
        }
      }
    });

  } catch (error: any) {
    console.error('Genius Full API Error:', error);
    return NextResponse.json(
      { error: error.message || '지표 연산 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

