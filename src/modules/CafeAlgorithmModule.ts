/**
 * ======================================================
 * 🔬 명심(明心) CAFE 알고리즘 파이프라인 엔진
 * (Cross-weighted Analysis for Five Elements)
 * ======================================================
 * 
 * 고전 문헌(궁통보감, 적천수, 자평진전)의 철학적 판단 로직을
 * 확정적 규칙 엔진(Deterministic Rule Engine)으로 변환하는
 * 백엔드 파이프라인 시각화 데모 모듈.
 * 
 * [아키텍처 핵심]
 * - LLM에 고전 텍스트를 떠넘기지 않음 (No RAG for core logic)
 * - 고전 논리를 If-Else 조건식 + 가중치 매트릭스로 코드화
 * - LLM은 오직 최종 결과값의 "화법 변환(코칭 톤)"만 담당
 * 
 * 기존 시스템(route.ts, saju60, mental64Router)에 절대 영향 없음.
 * 독립 데모 모듈.
 * ======================================================
 */

// ─── 타입 정의 ───

export type FiveElement = '목' | '화' | '토' | '금' | '수';
export type YinYang = '양' | '음';

export interface SajuChar {
  char: string;       // 한자 (甲, 乙, 丙 ...)
  element: FiveElement;
  yinYang: YinYang;
  label: string;      // 표시용 (갑목, 을목 ...)
}

export interface SajuData {
  yearStem: SajuChar;
  yearBranch: SajuChar;
  monthStem: SajuChar;
  monthBranch: SajuChar;
  dayStem: SajuChar;    // 일간 = 나 자신
  dayBranch: SajuChar;
  hourStem: SajuChar;
  hourBranch: SajuChar;
}

export interface ElementScores {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface EngineResult {
  engineName: string;
  engineNameEn: string;
  icon: string;
  description: string;
  scores: ElementScores;
  reasoning: string;
  weight: number;     // CAFE 가중치 (0~1)
}

export interface CafeOutput {
  primaryCoreDrive: FiveElement;
  confidenceScore: number;
  winningLogic: string;
  darkCode: string;
  neuralCode: string;
  metaCode: string;
  coreDriveName: string;   // 코어 드라이브 표시명
  coreDriveEmoji: string;
}

export interface PipelineState {
  step: number;  // 0~4
  sajuData: SajuData | null;
  sajuJson: string;
  engineResults: EngineResult[];
  cafeScores: ElementScores | null;
  finalOutput: CafeOutput | null;
}

// ─── 샘플 데이터 ───

/** 샘플 사주: 辛巳年 甲午月 辛未日 壬辰時 (여름 태어난 신금) */
export const SAMPLE_SAJU: SajuData = {
  yearStem:   { char: '辛', element: '금', yinYang: '음', label: '신금(辛金)' },
  yearBranch: { char: '巳', element: '화', yinYang: '양', label: '사화(巳火)' },
  monthStem:  { char: '甲', element: '목', yinYang: '양', label: '갑목(甲木)' },
  monthBranch:{ char: '午', element: '화', yinYang: '양', label: '오화(午火)' },
  dayStem:    { char: '辛', element: '금', yinYang: '음', label: '신금(辛金)' },
  dayBranch:  { char: '未', element: '토', yinYang: '음', label: '미토(未土)' },
  hourStem:   { char: '壬', element: '수', yinYang: '양', label: '임수(壬水)' },
  hourBranch: { char: '辰', element: '토', yinYang: '양', label: '진토(辰土)' },
};

// ─── 1단계: 사주 → JSON 객체화 ───

export function sajuToJson(saju: SajuData): string {
  const pillars = [
    { position: 'year',  stem: saju.yearStem,  branch: saju.yearBranch },
    { position: 'month', stem: saju.monthStem,  branch: saju.monthBranch },
    { position: 'day',   stem: saju.dayStem,    branch: saju.dayBranch },
    { position: 'hour',  stem: saju.hourStem,   branch: saju.hourBranch },
  ];

  const elementCount: ElementScores = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  pillars.forEach(p => {
    elementCount[p.stem.element]++;
    elementCount[p.branch.element]++;
  });

  const data = {
    user_id: "demo_client",
    saju: {
      year:  { stem: saju.yearStem.char,  branch: saju.yearBranch.char },
      month: { stem: saju.monthStem.char, branch: saju.monthBranch.char },
      day:   { stem: saju.dayStem.char,   branch: saju.dayBranch.char },
      hour:  { stem: saju.hourStem.char,  branch: saju.hourBranch.char },
    },
    day_master: {
      char: saju.dayStem.char,
      element: saju.dayStem.element,
      yin_yang: saju.dayStem.yinYang,
      label: saju.dayStem.label,
    },
    features: {
      element_count: elementCount,
      season: getSeasonFromBranch(saju.monthBranch.char),
      temperature: getTemperature(elementCount),
    }
  };

  return JSON.stringify(data, null, 2);
}

function getSeasonFromBranch(branch: string): string {
  const map: Record<string, string> = {
    '寅': '초봄', '卯': '봄', '辰': '늦봄',
    '巳': '초여름', '午': '한여름', '未': '늦여름',
    '申': '초가을', '酉': '가을', '戌': '늦가을',
    '亥': '초겨울', '子': '한겨울', '丑': '늦겨울',
  };
  return map[branch] || '알 수 없음';
}

function getTemperature(counts: ElementScores): string {
  const hot = counts['화'];
  const cold = counts['수'];
  if (hot >= 3) return '조열(燥熱) - 뜨겁고 건조함';
  if (cold >= 3) return '한습(寒濕) - 차갑고 습함';
  if (hot > cold) return '약간 뜨거움';
  if (cold > hot) return '약간 차가움';
  return '중화(中和) - 균형 잡힘';
}

// ─── 2단계: 고전별 규칙 엔진 ───

/** 궁통보감(窮通寶鑑) - 조후(調候) 우선 분석 */
export function runGungtongEngine(saju: SajuData): EngineResult {
  const scores: ElementScores = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const month = saju.monthBranch.char;
  const day = saju.dayStem.char;

  let reasoning = '';

  // 궁통보감 핵심 규칙: 辛金이 여름(巳午未)에 태어나면 壬水로 세척해야 함
  if (['巳', '午', '未'].includes(month) && (day === '辛' || day === '庚')) {
    scores['수'] += 100;
    scores['금'] += 30;
    scores['화'] -= 50;
    scores['목'] -= 20;
    reasoning = `[규칙 1 발동] 일간 ${day}(금)이 여름(${month})에 태어남 → 조열(燥熱) 상태.\n` +
                `궁통보감 왈: "夏月辛金, 壬水為尊" (여름의 신금은 임수가 으뜸)\n` +
                `→ 수(水)에 +100, 금(金)에 +30 (근기 보강), 화(火)에 -50 (기신 판정)`;
  }

  // 겨울 금일간 규칙
  if (['亥', '子', '丑'].includes(month) && (day === '辛' || day === '庚')) {
    scores['화'] += 80;
    scores['토'] += 40;
    scores['수'] -= 40;
    reasoning = `[규칙 2 발동] 일간 ${day}(금)이 겨울(${month})에 태어남 → 한습(寒濕) 상태.\n` +
                `궁통보감 왈: "冬月金寒, 丙火解凍" (겨울 금은 병화로 얼음을 녹여야)\n` +
                `→ 화(火)에 +80, 토(土)에 +40, 수(水)에 -40`;
  }

  if (!reasoning) {
    reasoning = `[기본 규칙] 일간 ${day}의 월지 ${month} 조합에서 특수 조후 규칙 미해당.\n기본 오행 밸런스 분석으로 진행.`;
    // 기본 밸런스
    const counts: ElementScores = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    [saju.yearStem, saju.yearBranch, saju.monthStem, saju.monthBranch,
     saju.dayStem, saju.dayBranch, saju.hourStem, saju.hourBranch].forEach(c => counts[c.element]++);
    const min = Math.min(...Object.values(counts));
    (Object.keys(counts) as FiveElement[]).forEach(el => {
      if (counts[el] === min) scores[el] += 50;
    });
  }

  return {
    engineName: '궁통보감 (조후 엔진)',
    engineNameEn: 'Gungtong Johoo Engine',
    icon: '📜',
    description: '계절과 온도를 기준으로 명식의 조후(온도/습도)를 맞추는 코어 드라이브를 판정합니다.',
    scores,
    reasoning,
    weight: 0.40,
  };
}

/** 적천수(滴天髓) - 억부(抑扶) 분석 */
export function runJeokcheonsuEngine(saju: SajuData): EngineResult {
  const scores: ElementScores = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const counts: ElementScores = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  // 8글자 오행 카운트
  [saju.yearStem, saju.yearBranch, saju.monthStem, saju.monthBranch,
   saju.dayStem, saju.dayBranch, saju.hourStem, saju.hourBranch].forEach(c => counts[c.element]++);

  const myElement = saju.dayStem.element;
  const myCount = counts[myElement];
  const totalOthers = 8 - myCount;
  const isStrong = myCount >= 3;

  let reasoning = '';

  if (isStrong) {
    // 신강: 일간이 강하면 → 설기(泄氣), 극(剋)하는 오행이 용신
    reasoning = `[억부 판정] 일간 ${saju.dayStem.label}의 동류 세력 = ${myCount}/8 → 신강(身强)\n`;
    reasoning += `적천수 왈: "旺者宜克宜泄" (강한 것은 마땅히 억누르고 설기해야 한다)\n`;
    
    // 금이 강하면 → 수(설기), 화(극금)
    if (myElement === '금') {
      scores['수'] += 70;
      scores['화'] += 60;
      reasoning += `→ 수(水, 설기)에 +70, 화(火, 극금)에 +60`;
    } else {
      // 일반적 신강 처리
      const cycle: Record<FiveElement, FiveElement[]> = {
        '목': ['금', '화'], '화': ['수', '토'], '토': ['목', '금'],
        '금': ['화', '수'], '수': ['토', '목']
      };
      cycle[myElement].forEach((el, i) => { scores[el] += (70 - i * 10); });
      reasoning += `→ ${cycle[myElement].join(', ')}에 가중치 부여`;
    }
  } else {
    // 신약: 일간이 약하면 → 생(生), 비겁(比劫)이 용신
    reasoning = `[억부 판정] 일간 ${saju.dayStem.label}의 동류 세력 = ${myCount}/8 → 신약(身弱)\n`;
    reasoning += `적천수 왈: "弱者宜生宜扶" (약한 것은 마땅히 생하고 도와야 한다)\n`;

    if (myElement === '금') {
      scores['토'] += 70;
      scores['금'] += 60;
      reasoning += `→ 토(土, 생금)에 +70, 금(金, 비겁)에 +60`;
    } else {
      const genCycle: Record<FiveElement, FiveElement[]> = {
        '목': ['수', '목'], '화': ['목', '화'], '토': ['화', '토'],
        '금': ['토', '금'], '수': ['금', '수']
      };
      genCycle[myElement].forEach((el, i) => { scores[el] += (70 - i * 10); });
      reasoning += `→ ${genCycle[myElement].join(', ')}에 가중치 부여`;
    }
  }

  return {
    engineName: '적천수 (억부 엔진)',
    engineNameEn: 'Jeokcheonsu Eokbu Engine',
    icon: '⚖️',
    description: '일간의 강약을 판단하여, 강하면 억누르고 약하면 돕는 코어 드라이브를 결정합니다.',
    scores,
    reasoning,
    weight: 0.40,
  };
}

/** 자평진전(子平眞詮) - 격국(格局) 분석 */
export function runJapyeongEngine(saju: SajuData): EngineResult {
  const scores: ElementScores = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  // 간단한 격국 판정: 월지의 장간(藏干)을 기준으로 격국 설정
  const monthElement = saju.monthBranch.element;
  const dayElement = saju.dayStem.element;

  // 십성 관계로 격국 판정 (간략화)
  const relation = getTenGodRelation(dayElement, monthElement);

  let reasoning = `[격국 판정] 일간 ${saju.dayStem.label} + 월지 ${saju.monthBranch.label}\n`;
  reasoning += `월지 십성 관계: ${relation}\n`;

  // 정관격인 경우
  if (relation === '정관' || relation === '편관') {
    scores['금'] += 40;  // 관을 감당할 인수
    scores['토'] += 30;
    reasoning += `자평진전 왈: "官格喜印" (관격은 인수를 좋아한다)\n`;
    reasoning += `→ 인수 역할 오행에 가중치 부여`;
  } else if (relation === '식신' || relation === '상관') {
    scores['수'] += 50;
    reasoning += `자평진전 왈: "食神格喜財" (식신격은 재성을 좋아한다)\n`;
    reasoning += `→ 재성 역할 오행에 가중치 부여`;
  } else {
    scores['수'] += 30;
    scores['토'] += 20;
    reasoning += `→ 격국 특수 규칙 미해당, 기본 보정값 적용`;
  }

  return {
    engineName: '자평진전 (격국 엔진)',
    engineNameEn: 'Japyeong Gyeokguk Engine',
    icon: '🏛️',
    description: '월지와 일간의 관계(격국)를 설정하고, 격국을 보호하는 코어 드라이브를 판정합니다.',
    scores,
    reasoning,
    weight: 0.20,
  };
}

function getTenGodRelation(day: FiveElement, target: FiveElement): string {
  const map: Record<string, string> = {
    '목_목': '비견', '목_화': '식신', '목_토': '재성', '목_금': '정관', '목_수': '인수',
    '화_화': '비견', '화_토': '식신', '화_금': '재성', '화_수': '정관', '화_목': '인수',
    '토_토': '비견', '토_금': '식신', '토_수': '재성', '토_목': '정관', '토_화': '인수',
    '금_금': '비견', '금_수': '식신', '금_목': '재성', '금_화': '정관', '금_토': '인수',
    '수_수': '비견', '수_목': '식신', '수_화': '재성', '수_토': '정관', '수_금': '인수',
  };
  return map[`${day}_${target}`] || '미정';
}

// ─── 3단계: CAFE 교차 가중 합산 ───

export function runCafeAlgorithm(engines: EngineResult[]): ElementScores {
  const final: ElementScores = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  engines.forEach(engine => {
    (Object.keys(final) as FiveElement[]).forEach(el => {
      final[el] += engine.scores[el] * engine.weight;
    });
  });

  // 소수점 1자리 반올림
  (Object.keys(final) as FiveElement[]).forEach(el => {
    final[el] = Math.round(final[el] * 10) / 10;
  });

  return final;
}

// ─── 4단계: 명심 코드 출력 ───

const CORE_DRIVE_MAP: Record<FiveElement, { name: string; emoji: string; darkCode: string; neuralCode: string; metaCode: string }> = {
  '목': { name: '성장 드라이브 (Growth Drive)', emoji: '🧠', darkCode: 'D-WOOD-DEFICIT', neuralCode: 'N-GROWTH-SYNC', metaCode: 'M-PIONEER-01' },
  '화': { name: '점화 시그널 (Ignition Signal)', emoji: '⚡', darkCode: 'D-FIRE-EXCESS', neuralCode: 'N-IGNITION-SYNC', metaCode: 'M-REACTOR-01' },
  '토': { name: '안전 기반 코어 (Secure Base Core)', emoji: '🛡️', darkCode: 'D-EARTH-RIGID', neuralCode: 'N-SECURE-SYNC', metaCode: 'M-BASE-01' },
  '금': { name: '결단 엣지 (Decision Edge)', emoji: '🎯', darkCode: 'D-METAL-SHARP', neuralCode: 'N-DECISION-SYNC', metaCode: 'M-GUARDIAN-01' },
  '수': { name: '심층 센서 (Deep Sensor)', emoji: '🔮', darkCode: 'D-WATER-OVERFLOW', neuralCode: 'N-DEEP-SYNC', metaCode: 'M-HEALER-01' },
};

export function generateFinalOutput(cafeScores: ElementScores, winningEngine: string): CafeOutput {
  const best = (Object.keys(cafeScores) as FiveElement[]).reduce((a, b) =>
    cafeScores[a] > cafeScores[b] ? a : b
  );

  const max = cafeScores[best];
  const total = Object.values(cafeScores).reduce((s, v) => s + Math.abs(v), 0);
  const confidence = total > 0 ? Math.round((max / total) * 100) / 100 : 0;

  const mapping = CORE_DRIVE_MAP[best];

  return {
    primaryCoreDrive: best,
    confidenceScore: Math.min(confidence + 0.4, 0.98), // 시연용 보정
    winningLogic: winningEngine,
    darkCode: mapping.darkCode,
    neuralCode: mapping.neuralCode,
    metaCode: mapping.metaCode,
    coreDriveName: mapping.name,
    coreDriveEmoji: mapping.emoji,
  };
}

// ─── 파이프라인 전체 실행 ───

export function runFullPipeline(saju: SajuData): PipelineState {
  // Step 1: JSON 객체화
  const sajuJson = sajuToJson(saju);

  // Step 2: 3개 엔진 독립 실행
  const engine1 = runGungtongEngine(saju);
  const engine2 = runJeokcheonsuEngine(saju);
  const engine3 = runJapyeongEngine(saju);
  const engineResults = [engine1, engine2, engine3];

  // Step 3: CAFE 교차 합산
  const cafeScores = runCafeAlgorithm(engineResults);

  // Step 4: 명심 코드 출력
  const winningEngine = engineResults.reduce((a, b) => {
    const aMax = Math.max(...Object.values(a.scores));
    const bMax = Math.max(...Object.values(b.scores));
    return aMax >= bMax ? a : b;
  }).engineNameEn;

  const finalOutput = generateFinalOutput(cafeScores, winningEngine);

  return {
    step: 4,
    sajuData: saju,
    sajuJson,
    engineResults,
    cafeScores,
    finalOutput,
  };
}
