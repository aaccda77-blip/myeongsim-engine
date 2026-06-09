import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { calculateSaju } from '@/utils/SajuCalculator';

// 천간 음양오행 테이블
const STEM_INFO: Record<string, { element: string; polarity: '+' | '-' }> = {
  '甲': { element: '목', polarity: '+' }, '乙': { element: '목', polarity: '-' },
  '丙': { element: '화', polarity: '+' }, '丁': { element: '화', polarity: '-' },
  '戊': { element: '토', polarity: '+' }, '己': { element: '토', polarity: '-' },
  '庚': { element: '금', polarity: '+' }, '辛': { element: '금', polarity: '-' },
  '壬': { element: '수', polarity: '+' }, '癸': { element: '수', polarity: '-' }
};

// 지지 음양오행 테이블
const ZHI_INFO: Record<string, { element: string; polarity: '+' | '-' }> = {
  '子': { element: '수', polarity: '-' }, '丑': { element: '토', polarity: '-' },
  '寅': { element: '목', polarity: '+' }, '卯': { element: '목', polarity: '-' },
  '辰': { element: '토', polarity: '+' }, '巳': { element: '화', polarity: '+' },
  '午': { element: '화', polarity: '-' }, '未': { element: '토', polarity: '-' },
  '申': { element: '금', polarity: '+' }, '酉': { element: '금', polarity: '-' },
  '戌': { element: '토', polarity: '+' }, '亥': { element: '수', polarity: '+' }
};

// 십신(十神) 판정 함수
function getTenGod(dayMaster: { element: string; polarity: '+' | '-' }, target: { element: string; polarity: '+' | '-' }): string {
  const dmEl = dayMaster.element;
  const dmPol = dayMaster.polarity;
  const tgEl = target.element;
  const tgPol = target.polarity;
  const samePolarity = dmPol === tgPol;

  if (dmEl === tgEl) {
    return samePolarity ? '비견' : '겁재';
  }

  // 식상 (내가 생함)
  if (
    (dmEl === '목' && tgEl === '화') ||
    (dmEl === '화' && tgEl === '토') ||
    (dmEl === '토' && tgEl === '금') ||
    (dmEl === '금' && tgEl === '수') ||
    (dmEl === '수' && tgEl === '목')
  ) {
    return samePolarity ? '식신' : '상관';
  }

  // 재성 (내가 극함)
  if (
    (dmEl === '목' && tgEl === '토') ||
    (dmEl === '화' && tgEl === '금') ||
    (dmEl === '토' && tgEl === '수') ||
    (dmEl === '금' && tgEl === '목') ||
    (dmEl === '수' && tgEl === '화')
  ) {
    return samePolarity ? '편재' : '정재';
  }

  // 관성 (나를 극함)
  if (
    (dmEl === '목' && tgEl === '금') ||
    (dmEl === '화' && tgEl === '수') ||
    (dmEl === '토' && tgEl === '목') ||
    (dmEl === '금' && tgEl === '화') ||
    (dmEl === '수' && tgEl === '토')
  ) {
    return samePolarity ? '편관' : '정관';
  }

  // 인성 (나를 생함)
  if (
    (dmEl === '목' && tgEl === '수') ||
    (dmEl === '화' && tgEl === '목') ||
    (dmEl === '토' && tgEl === '화') ||
    (dmEl === '금' && tgEl === '토') ||
    (dmEl === '수' && tgEl === '금')
  ) {
    return samePolarity ? '편인' : '정인';
  }

  return '비견';
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const body = await req.json();
    const { dob, gender, mbti, big_five } = body;

    if (!dob || !mbti || !big_five) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    // 1. 사주 데이터 계산
    const sajuData = calculateSaju(dob, '12:00', 'solar', gender || 'male');

    // 일간 정보 파악
    const dayGanHanja = sajuData.day.gan.hanja;
    const dayMasterInfo = STEM_INFO[dayGanHanja];

    if (!dayMasterInfo) {
      return NextResponse.json({ error: '일주 정보를 분석할 수 없습니다.' }, { status: 500 });
    }

    // 8자의 간지 정보 수집
    const characters = [
      { type: 'stem', hanja: sajuData.year.gan.hanja },
      { type: 'branch', hanja: sajuData.year.ji.hanja },
      { type: 'stem', hanja: sajuData.month.gan.hanja },
      { type: 'branch', hanja: sajuData.month.ji.hanja },
      { type: 'stem', hanja: sajuData.day.gan.hanja },
      { type: 'branch', hanja: sajuData.day.ji.hanja },
      { type: 'stem', hanja: sajuData.time.gan.hanja },
      { type: 'branch', hanja: sajuData.time.ji.hanja }
    ];

    // 오행 및 십신 집계
    const elementsCount: Record<string, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
    const tenGodsCount: Record<string, number> = {
      '비견': 0, '겁재': 0, '식신': 0, '상관': 0,
      '편재': 0, '정재': 0, '편관': 0, '정관': 0, '편인': 0, '정인': 0
    };

    characters.forEach((char, index) => {
      const info = char.type === 'stem' ? STEM_INFO[char.hanja] : ZHI_INFO[char.hanja];
      if (info) {
        // 오행 집계
        elementsCount[info.element] += 1;

        // 십신 집계 (일간 자신인 일지 천간(인덱스 4)은 제외하고 집계하거나, 혹은 비견으로 포함)
        if (index !== 4) {
          const tenGod = getTenGod(dayMasterInfo, info);
          tenGodsCount[tenGod] += 1;
        } else {
          tenGodsCount['비견'] += 1;
        }
      }
    });

    // 백분율 계산 (총 8개 글자)
    const elementsRatio: Record<string, number> = {};
    Object.keys(elementsCount).forEach(k => {
      elementsRatio[k] = Math.round((elementsCount[k] / 8) * 100);
    });

    const tenGodsRatio: Record<string, number> = {};
    Object.keys(tenGodsCount).forEach(k => {
      tenGodsRatio[k] = Math.round((tenGodsCount[k] / 8) * 100);
    });

    const sajuProfile = {
      day_master: dayGanHanja,
      elements: elementsRatio,
      ten_gods: tenGodsRatio,
      gongmang: sajuData.gongmang
    };

    // 2. 성격 & 사주 크로스 매칭 스트레스 취약성 점수 도출
    const neuroticism = big_five.neuroticism || 50;
    const extraversion = big_five.extraversion || 50;
    const openness = big_five.openness || 50;
    const agreeableness = big_five.agreeableness || 50;
    const conscientiousness = big_five.conscientiousness || 50;

    // A. 편도체 과각성 (관성 과다 또는 신금/계수 일간 가중치)
    let amygdalaOverload = neuroticism;
    const gwanRatio = (tenGodsRatio['편관'] || 0) + (tenGodsRatio['정관'] || 0);
    if (gwanRatio >= 25) amygdalaOverload += 15;
    if (dayGanHanja === '辛' || dayGanHanja === '癸') amygdalaOverload += 10;
    if (mbti.startsWith('I') && mbti.endsWith('F')) amygdalaOverload += 5;
    amygdalaOverload = Math.min(100, Math.max(10, amygdalaOverload));

    // B. DMN 생각 폭주 / 자학 루프 (식상 과다 또는 신금 일간 가중치)
    let dmnHyperactivity = Math.round((neuroticism + conscientiousness) / 2);
    const sikSangRatio = (tenGodsRatio['식신'] || 0) + (tenGodsRatio['상관'] || 0);
    if (sikSangRatio >= 25) dmnHyperactivity += 15;
    if (dayGanHanja === '辛') dmnHyperactivity += 12; // 자학적 디버깅 인터럽트
    if (mbti.includes('NF')) dmnHyperactivity += 5;
    dmnHyperactivity = Math.min(100, Math.max(10, dmnHyperactivity));

    // C. 경험 회피 / 현실 도피 (인성 과다 가중치)
    let experientialAvoidance = 100 - openness;
    const inRatio = (tenGodsRatio['편인'] || 0) + (tenGodsRatio['정인'] || 0);
    if (inRatio >= 25) experientialAvoidance += 15;
    if (mbti.includes('S') && mbti.includes('J')) experientialAvoidance += 10;
    experientialAvoidance = Math.min(100, Math.max(10, experientialAvoidance));

    // D. 감정 통제력 부족 / 정서 불안 (조열/한랭 기질 및 겁재 가중치)
    let emotionalDysregulation = Math.round(neuroticism * 0.7 + (100 - agreeableness) * 0.3);
    const fireRatio = elementsRatio['화'] || 0;
    const waterRatio = elementsRatio['수'] || 0;
    if (fireRatio >= 30 || waterRatio >= 35) emotionalDysregulation += 15; // 조열하거나 너무 차가움
    if (tenGodsRatio['겁재'] >= 20) emotionalDysregulation += 10; // 경쟁심과 감정 요동
    if (mbti.endsWith('P')) emotionalDysregulation += 5;
    emotionalDysregulation = Math.min(100, Math.max(10, emotionalDysregulation));

    // E. 고독 및 고립 취약도 (비겁 고립 또는 수/토 과다 가중치)
    let socialIsolation = 100 - extraversion;
    const earthRatio = elementsRatio['토'] || 0;
    if (waterRatio >= 30 || earthRatio >= 35) socialIsolation += 15;
    const biBeopRatio = (tenGodsRatio['비견'] || 0) + (tenGodsRatio['겁재'] || 0);
    if (biBeopRatio <= 12) socialIsolation += 12; // 내 편이 없다는 고립감
    if (mbti.startsWith('I') && mbti.includes('T')) socialIsolation += 5;
    socialIsolation = Math.min(100, Math.max(10, socialIsolation));

    // 종합 취약성 점수 (가중 평균)
    const vulnerability_score = Math.round(
      amygdalaOverload * 0.25 +
      dmnHyperactivity * 0.25 +
      experientialAvoidance * 0.15 +
      emotionalDysregulation * 0.2 +
      socialIsolation * 0.15
    );

    // 3. 기질 기반 생체 평형 베이스라인(Biometric Baseline) 계산
    let baseline_bpm = 72;
    let baseline_temp = 36.5;
    let baseline_hrv = 48;
    let baseline_sleep = 7.0;

    // 조열한 경우 (심박 및 체온 상승, HRV 민감도 하락)
    if (fireRatio >= 30) {
      baseline_bpm = 77 + Math.floor(Math.random() * 3);
      baseline_temp = 36.7 + parseFloat((Math.random() * 0.2).toFixed(1));
      baseline_hrv = 38 + Math.floor(Math.random() * 5);
    } 
    // 한랭한 경우 (심박 하락, 체온 하락, HRV 수치 차분하나 둔화)
    else if (waterRatio >= 30) {
      baseline_bpm = 66 + Math.floor(Math.random() * 3);
      baseline_temp = 36.1 + parseFloat((Math.random() * 0.2).toFixed(1));
      baseline_hrv = 52 + Math.floor(Math.random() * 5);
      baseline_sleep = 7.5;
    }

    const biometric_baseline = {
      hrv: baseline_hrv,
      bpm: baseline_bpm,
      temp: baseline_temp,
      sleep: baseline_sleep
    };

    const vulnerability_details = {
      amygdalaOverload,
      dmnHyperactivity,
      experientialAvoidance,
      emotionalDysregulation,
      socialIsolation
    };

    // 4. Supabase DB에 적재 (Upsert)
    const { data, error } = await supabase
      .from('psych_scan_profiles')
      .upsert({
        user_id: user.id,
        mbti,
        big_five,
        saju_profile: sajuProfile,
        biometric_baseline,
        vulnerability_score,
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select();

    if (error) {
      console.error('[Psych Scan DB Save Error]:', error);
      // DB 에러가 나더라도 계산 결과는 리턴할 수 있도록 예외처리
    }

    return NextResponse.json({
      success: true,
      data: {
        mbti,
        big_five,
        saju_profile: sajuProfile,
        biometric_baseline,
        vulnerability_score,
        vulnerability_details,
        db_synced: !error
      }
    });

  } catch (error: any) {
    console.error('[Psych Scan API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('psych_scan_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: Row not found (정상 케이스)
      console.error('[Psych Scan Fetch Error]:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      exists: !!data,
      data: data || null
    });

  } catch (error: any) {
    console.error('[Psych Scan GET Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
