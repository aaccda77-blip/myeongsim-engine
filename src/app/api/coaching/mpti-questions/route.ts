import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Solar, Lunar } from 'lunar-javascript';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

// 기본 정적 질문 Fallback 상수 (API 에러나 비로그인 시 사용)
const STATIC_QUESTIONS = [
  {
    q: '새로운 일이나 흥미로운 취미를 시작할 때, 당신의 마음속에서 가장 먼저 일어나는 생각은 무엇인가요?',
    options: [
      { text: '이 일을 통해 내가 얼마나 더 배우고 성장하며 나아갈 수 있을까? (배움과 호기심)', key: 'wood' },
      { text: '어떻게 하면 사람들과 이 즐거움을 함께 나누고 소통할 수 있을까? (소통과 나눔)', key: 'fire' },
      { text: '모두가 편안하고 다치지 않게 조화롭고 안전하게 가려면 어떻게 해야 할까? (안정과 배려)', key: 'earth' },
      { text: '구체적인 순서와 완벽한 규칙을 정하고 꼼꼼히 정리하며 시작해야지. (계획과 원칙)', key: 'metal' },
      { text: '이 일의 본질은 무엇이고, 내 인생에서 어떤 의미가 있는지 깊이 생각해보자. (사색과 의미)', key: 'water' }
    ]
  },
  {
    q: '몸과 마음이 몹시 지치고 스트레스가 가득 찼을 때, 당신이 에너지를 다시 채우는 가장 편안한 방법은 무엇인가요?',
    options: [
      { text: '새로운 것을 배우거나 앞으로의 설레는 계획을 세워본다.', key: 'wood' },
      { text: '사람들을 만나 감정을 나누거나 활기찬 활동을 통해 털어낸다.', key: 'fire' },
      { text: '나만의 아늑한 공간에서 편안하게 쉬며 에너지를 조용히 채운다.', key: 'earth' },
      { text: '주변의 복잡한 물건이나 생각을 깔끔하게 정리정돈한다.', key: 'metal' },
      { text: '혼자만의 고요한 시간을 가지며 마음에 평화를 얻는다.', key: 'water' }
    ]
  },
  {
    q: '다른 사람과 대화를 나눌 때, 내 마음의 빗장이 스르륵 열리고 깊이 연결되는 소통의 순간은 언제인가요?',
    options: [
      { text: '서로의 꿈과 서로를 성장시키는 밝은 이야기를 나눌 때', key: 'wood' },
      { text: '환한 웃음과 뜨거운 감정적 공감이 끊임없이 오갈 때', key: 'fire' },
      { text: '내밀한 고민을 말없이 따뜻하게 들어주고 위로해 줄 때', key: 'earth' },
      { text: '불필요한 사담 없이 명확하고 신뢰할 수 있는 정보를 나눌 때', key: 'metal' },
      { text: '삶의 깊은 철학이나 마음의 지혜에 대해 조용히 대화할 때', key: 'water' }
    ]
  },
  {
    q: '나에게 완벽하게 자유로운 주말이 주어진다면, 어떤 하루를 가장 보내고 싶으신가요?',
    options: [
      { text: '인생의 배움과 성장을 돕는 책을 읽거나 클래스에 참여하기', key: 'wood' },
      { text: '마음이 통하는 사람들과 맛집이나 파티에 가서 즐겁게 소통하기', key: 'fire' },
      { text: '가족이나 가까운 사람들과 함께 맛있는 음식을 먹으며 푹 쉬기', key: 'earth' },
      { text: '한 주의 일정, 소비, 계획 등을 깔끔하고 차분하게 정리하기', key: 'metal' },
      { text: '방해받지 않고 조용히 명상, 차 마시기, 음악 감상 등으로 나에게 집중하기', key: 'water' }
    ]
  },
  {
    q: '뜻하지 않은 크고 작은 실패나 실수를 겪었을 때, 마음을 다잡고 일어나는 나만의 힘은 어디서 나오나요?',
    options: [
      { text: '이것 또한 좋은 경험이다! 곧바로 새로운 계획을 세워 도전한다.', key: 'wood' },
      { text: '주변 사람들에게 힘든 마음을 털어놓고 정서적인 응원을 받는다.', key: 'fire' },
      { text: '흘러가는 대로 마음을 푹 내려놓고 다시 충전될 시간을 묵묵히 기다린다.', key: 'earth' },
      { text: '실패의 원인을 냉정하게 분석하여 똑같은 실수를 반복하지 않도록 대책을 세운다.', key: 'metal' },
      { text: '이 시련이 내 인생에 어떤 소중한 가르침을 주는지 깊이 성찰한다.', key: 'water' }
    ]
  }
];

// 서버 인메모리 Rate Limit 캐시
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1분
  const maxLimit = 3;            // 최대 3회

  const record = rateLimitMap.get(key);
  if (!record) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }

  if (now - record.lastReset > limitWindow) {
    record.count = 1;
    record.lastReset = now;
    return true;
  }

  record.count += 1;
  return record.count <= maxLimit;
}

// UUID 형식 검증 함수
function isValidUuid(id: string): boolean {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// 오늘 일진 계산 함수
function getTodayIljin() {
  try {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const year = kst.getUTCFullYear();
    const month = kst.getUTCMonth() + 1;
    const day = kst.getUTCDate();
    
    const todaySolar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
    const todayLunar = todaySolar.getLunar();
    const bazi = todayLunar.getEightChar();
    
    return {
      yearGanZhi: `${bazi.getYearGan()}${bazi.getYearZhi()}`,
      monthGanZhi: `${bazi.getMonthGan()}${bazi.getMonthZhi()}`,
      dayGanZhi: `${bazi.getDayGan()}${bazi.getDayZhi()}`,
    };
  } catch {
    return { yearGanZhi: '丙午', monthGanZhi: '庚辰', dayGanZhi: '乙丑' };
  }
}

// 오늘 KST 날짜 구하기 (YYYY-MM-DD)
function getKstDateString() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function POST(req: NextRequest) {
  // IP 수집 (Rate Limit용)
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown-ip';
  
  try {
    const body = await req.json();
    const { userId } = body;

    // 1. UUID 및 로그인 유무 검증 (비로그인/Guest API 즉시 차단)
    if (!isValidUuid(userId)) {
      console.warn(`[MPTI Questions API] Invalid or missing UUID (Guest). Bypassing Gemini API.`);
      const { yearGanZhi, monthGanZhi, dayGanZhi } = getTodayIljin();
      return NextResponse.json({
        success: true,
        questions: STATIC_QUESTIONS,
        todayIljin: { yearGanZhi, monthGanZhi, dayGanZhi }
      });
    }

    // 2. 서버 측 Rate Limit 검증
    const rateLimitKey = `${userId}_${clientIp}`;
    if (!checkRateLimit(rateLimitKey)) {
      console.warn(`[MPTI Questions API] Rate limit exceeded for key: ${rateLimitKey}`);
      return NextResponse.json(
        { error: '과도한 요청이 감지되었습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 429 }
      );
    }

    const todayStr = getKstDateString();
    const { yearGanZhi, monthGanZhi, dayGanZhi } = getTodayIljin();

    // 3. 서버 측 DB 캐시 레이어 조회 (일일 1회 호출 보장)
    try {
      const { data: cachedRow, error: selectError } = await supabase
        .from('fpti_daily_questions')
        .select('*')
        .eq('user_id', userId)
        .eq('date', todayStr)
        .maybeSingle();

      if (!selectError && cachedRow) {
        console.log(`[MPTI Questions API] Cache hit for user ${userId} on date ${todayStr}.`);
        return NextResponse.json({
          success: true,
          questions: cachedRow.questions,
          todayIljin: cachedRow.today_iljin
        });
      }
    } catch (dbErr) {
      // 테이블이 존재하지 않거나 권한 에러 시 로그만 남기고 Fallback을 타게 함
      console.error('[MPTI Questions API] DB Cache Lookup failed:', dbErr);
    }

    // 4. 기본 운기와 사주 정보 Fallback 세팅
    let userSaju = '알 수 없음';
    let energyLevel = '알 수 없음';
    let sleepQuality = '알 수 없음';
    let currentStressors = '없음';
    let personality16 = '미입력';
    let enneagram = '미입력';

    // 5. Supabase에서 사용자 맞춤 정보 가져오기
    const { data: userData, error: userError } = await supabase
      .from('user_onboarding_data')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userError && userData) {
      energyLevel = userData.energy_level !== null && userData.energy_level !== undefined ? `${userData.energy_level}%` : '알 수 없음';
      sleepQuality = userData.sleep_quality !== null && userData.sleep_quality !== undefined ? `${userData.sleep_quality}/5` : '알 수 없음';
      currentStressors = (userData.current_stressors && Array.isArray(userData.current_stressors))
        ? userData.current_stressors.join(', ')
        : '없음';
      personality16 = userData.personality_16 || '미입력';
      enneagram = userData.enneagram || '미입력';

      if (userData.birth_date && userData.birth_time) {
        try {
          const [y, m, d] = userData.birth_date.split('-').map(Number);
          const [h, min] = userData.birth_time.split(':').map(Number);
          let lunarDate;
          if (userData.calendar_type === 'lunar') {
            lunarDate = Lunar.fromYmdHms(y, m, d, h, min, 0);
          } else {
            const solarDate = Solar.fromYmdHms(y, m, d, h, min, 0);
            lunarDate = solarDate.getLunar();
          }
          const bazi = lunarDate.getEightChar();
          userSaju = `${bazi.getYearGan()}${bazi.getYearZhi()}년 ${bazi.getMonthGan()}${bazi.getMonthZhi()}월 ${bazi.getDayGan()}${bazi.getDayZhi()}일 ${bazi.getTimeGan()}${bazi.getTimeZhi()}시`;
        } catch (e) {
          console.error('[MPTI Questions API] Saju calculation error:', e);
        }
      }
    }

    // 6. Gemini 모델 기동
    const modelName = process.env.GEMINI_MODEL === 'gemini-2.5-flash' ? 'gemini-2.5-flash' : (process.env.GEMINI_MODEL || 'gemini-2.5-flash');
    const model = google.getGenerativeModel({
      model: modelName,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { 
        temperature: 0.9, 
        maxOutputTokens: 3072,
        responseMimeType: 'application/json'
      },
    });

    const prompt = `너는 사주 명리학과 후성유전학(Epigenetics), 그리고 현대 심리학을 결합하여 내담자의 성향을 분석하는 명심코칭의 인공지능 연구가야.
    
사용자 정보에 따른 오늘의 맞춤형 성격유형검사(FPTI) 질문 5문항을 생성해줘.

[오늘의 우주 기운 (일진)]
- 일진: ${dayGanZhi}일 (세운: ${yearGanZhi}년, 월운: ${monthGanZhi}월)

[사용자의 타고난 사주팔자 및 후천 상태 정보]
- 선천 사주명식: ${userSaju}
- 에너지 상태: ${energyLevel}
- 수면의 질: ${sleepQuality}
- 주 스트레스 요인: ${currentStressors}
- MBTI 성격유형: ${personality16}
- 에니어그램: ${enneagram}

[출력 생성 규칙 (중요)]
1. 총 5문항을 생성하라.
2. 매번 일진(${dayGanZhi})과 사용자 사주팔자의 오행 상생/상극 작용, 그리고 현재 스트레스 및 수면(후성유전학적 발현인자) 환경을 고려하여 질문을 새롭게 커스텀 빌드하라. 
   - 예: 오늘의 일진 기운과 사용자의 사주 기운이 충돌하거나 조화를 이룰 때 일상생활에서 겪게 될 구체적이고 현실적인 순간(아침에 일어날 때, 돌발 상황, 타인과의 소통, 휴식, 일 처리 등)을 테마로 설정하라.
3. 질문은 전문적인 한자어나 IT 용어(패킷, 버그 등)를 배제하고, 초보자도 한눈에 가슴이 뭉클하고 깊이 공감할 수 있는 따스하고 친절하며 문학적인 한국어 문장으로 작성하라.
4. 각 질문("q")마다 정확히 5가지 선택지("options")를 제공해야 하며, 각 선택지에는 오행을 구분하는 "key" ('wood', 'fire', 'earth', 'metal', 'water')가 매핑되어야 한다.
   - wood: 배움, 기획, 성장, 목(木) 성향
   - fire: 사교, 감정 표현, 에너지 확산, 화(火) 성향
   - earth: 안정, 포용, 리스크 조율, 중재, 토(土) 성향
   - metal: 계획, 정리정돈, 원칙, 결단, 금(金) 성향
   - water: 사색, 깊은 지혜, 본질 성찰, 수(水) 성향
5. 선택지 텍스트("text") 또한 초보자가 각 오행의 마음가짐을 쉽게 읽고 편안하게 선택할 수 있도록 자연스러운 어조로 작성하라.

[반환 형식]
반드시 아래의 구조를 만족하는 JSON 데이터만 출력하라. 마크다운 백틱(\`\`\`) 등은 넣지 말고 순수 JSON만 반환하라.

{
  "questions": [
    {
      "q": "사용자 맞춤형 질문 내용",
      "options": [
        { "text": "선택지 1", "key": "wood" },
        { "text": "선택지 2", "key": "fire" },
        { "text": "선택지 3", "key": "earth" },
        { "text": "선택지 4", "key": "metal" },
        { "text": "선택지 5", "key": "water" }
      ]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    if (!rawText || rawText.trim().length === 0) {
      throw new Error('Gemini API returned empty response');
    }

    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('JSON structure not found in AI response');
    }

    const parsedJson = JSON.parse(rawText.substring(start, end + 1));

    // 7. 성공적으로 생성된 질문을 DB에 캐싱
    try {
      await supabase.from('fpti_daily_questions').insert({
        user_id: userId,
        date: todayStr,
        questions: parsedJson.questions,
        today_iljin: { yearGanZhi, monthGanZhi, dayGanZhi }
      });
    } catch (dbInsertErr: any) {
      // 중복 키 에러(이미 다른 동시 요청에 의해 삽입된 경우)라면 즉시 select하여 데이터 복구
      if (dbInsertErr?.code === '23505') {
        const { data: fallbackRow } = await supabase
          .from('fpti_daily_questions')
          .select('*')
          .eq('user_id', userId)
          .eq('date', todayStr)
          .maybeSingle();
        if (fallbackRow) {
          return NextResponse.json({
            success: true,
            questions: fallbackRow.questions,
            todayIljin: fallbackRow.today_iljin
          });
        }
      }
      console.error('[MPTI Questions API] DB Cache Insert failed:', dbInsertErr);
    }

    return NextResponse.json({
      success: true,
      questions: parsedJson.questions,
      todayIljin: { yearGanZhi, monthGanZhi, dayGanZhi }
    });

  } catch (error: any) {
    console.error('[MPTI Questions API] Error:', error);
    
    // API 에러 시 완전히 무너지지 않고 사용자 사용성을 지키는 Safe Fallback
    const { yearGanZhi, monthGanZhi, dayGanZhi } = getTodayIljin();
    return NextResponse.json({
      success: true, // 에러 상황에서도 클라이언트 오작동을 막기 위해 true 반환
      questions: STATIC_QUESTIONS,
      todayIljin: { yearGanZhi, monthGanZhi, dayGanZhi },
      isFallback: true
    });
  }
}

