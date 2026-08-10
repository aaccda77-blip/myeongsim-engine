import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DailyLuckEngine } from '@/lib/saju/DailyLuckEngine';

export const dynamic = 'force-dynamic';

// 천간/지지 한글→한자 매핑 (프롬프트에서 사주 원국 한자 표기용)
const GAN_HANJA: Record<string, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
};
const ZHI_HANJA: Record<string, string> = {
  '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
  '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥'
};

// 천간→오행 매핑
const GAN_ELEMENT: Record<string, string> = {
  '갑': '목(木)', '을': '목(木)', '병': '화(火)', '정': '화(火)', '무': '토(土)',
  '기': '토(土)', '경': '금(金)', '신': '금(金)', '임': '수(水)', '계': '수(水)'
};

// 천간→음양 매핑
const GAN_YINYANG: Record<string, string> = {
  '갑': '양', '을': '음', '병': '양', '정': '음', '무': '양',
  '기': '음', '경': '양', '신': '음', '임': '양', '계': '음'
};

// 따뜻한 자연 은유 매핑 (일간 기질별) — 한글 + 한자 키 모두 지원
const DAY_MASTER_EMPATHY_METAPHOR: Record<string, string> = {
    '갑': '깊게 뿌리내린 든든한 나무 (한결같은 지지)', '을': '어디서든 피어나는 부드러운 화초 (유연한 생명력)',
    '병': '세상을 비추는 밝은 태양 (모두에게 온기를 주는 빛)', '정': '어둠을 밝히는 따뜻한 촛불 (세심하고 은은한 따뜻함)',
    '무': '묵묵히 품어주는 넓은 대지 (모든 것을 수용하는 포용력)', '기': '생명을 품은 비옥한 흙 (다정하고 아늑한 품)',
    '경': '흔들림 없는 단단한 바위 (변치 않는 우직한 믿음)', '신': '섬세하고 반짝이는 보석 (고귀하고 빛나는 가치)',
    '임': '지혜롭게 흐르는 넓은 바다 (깊고 넓은 지혜의 물결)', '계': '생명을 깨우는 맑은 단비 (세심하게 어루만지는 촉촉함)',
    '甲': '깊게 뿌리내린 든든한 나무 (한결같은 지지)', '乙': '어디서든 피어나는 부드러운 화초 (유연한 생명력)',
    '丙': '세상을 비추는 밝은 태양 (모두에게 온기를 주는 빛)', '丁': '어둠을 밝히는 따뜻한 촛불 (세심하고 은은한 따뜻함)',
    '戊': '묵묵히 품어주는 넓은 대지 (모든 것을 수용하는 포용력)', '己': '생명을 품은 비옥한 흙 (다정하고 아늑한 품)',
    '庚': '흔들림 없는 단단한 바위 (변치 않는 우직한 믿음)', '辛': '섬세하고 반짝이는 보석 (고귀하고 빛나는 가치)',
    '壬': '지혜롭게 흐르는 넓은 바다 (깊고 넓은 지혜의 물결)', '癸': '생명을 깨우는 맑은 단비 (세심하게 어루만지는 촉촉함)'
};

// 십성 관계별 데일리 키워드 생성
function getDailyKeyword(relation: string, dayGanji: string): string {
  const keywords: Record<string, string> = {
    'Self': `⚠️ [Over-Sync Alert] 외부 트래픽 과동기화`,
    'Resource': `💚 [Deep Charge] 내부 자원 충전 모드`,
    'Output': `🎨 [Creative Overflow] 출력 에너지 폭발`,
    'Wealth': `💰 [Control Drive] 외부 자원 통제 욕구 증가`,
    'Power': `🔴 [Pressure Spike] 외부 압력 과부하 경고`
  };
  return keywords[relation] || `📊 [Scan] 시스템 점검 중`;
}

// 오행 상관관계 계산
function getRelation(myElement: string, todayElement: string): string {
  const ELEMENT_RELATIONS: Record<string, Record<string, string>> = {
    'wood': { 'wood': 'Self', 'fire': 'Output', 'earth': 'Wealth', 'metal': 'Power', 'water': 'Resource' },
    'fire': { 'wood': 'Resource', 'fire': 'Self', 'earth': 'Output', 'metal': 'Wealth', 'water': 'Power' },
    'earth': { 'wood': 'Power', 'fire': 'Resource', 'earth': 'Self', 'metal': 'Output', 'water': 'Wealth' },
    'metal': { 'wood': 'Wealth', 'fire': 'Power', 'earth': 'Resource', 'metal': 'Self', 'water': 'Output' },
    'water': { 'wood': 'Output', 'fire': 'Wealth', 'earth': 'Power', 'metal': 'Resource', 'water': 'Self' }
  };
  return ELEMENT_RELATIONS[myElement]?.[todayElement] || 'Self';
}

const GAN_ELEMENTS_EN: Record<string, string> = {
  '갑': 'wood', '을': 'wood', '병': 'fire', '정': 'fire', '무': 'earth',
  '기': 'earth', '경': 'metal', '신': 'metal', '임': 'water', '계': 'water',
  '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth',
  '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water'
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, dayMaster, yearPillar, monthPillar, dayPillar, hourPillar, gender, targetDate, forceRefresh } = body;

    if (!dayMaster) {
      return NextResponse.json({ error: 'dayMaster is required' }, { status: 400 });
    }

    const cleanDayMaster = dayMaster.split(' ')[0];

    const cleanPillar = (p?: string) => p ? p.replace(/\?/g, '') : undefined;
    const cleanYear = cleanPillar(yearPillar);
    const cleanMonth = cleanPillar(monthPillar);
    const cleanDay = cleanPillar(dayPillar);
    const cleanHour = cleanPillar(hourPillar);

    const today = new Date();
    const kstDate = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const dateString = targetDate || kstDate.toISOString().split('T')[0];

    // 1. 캐시 확인
    if (userId && userId !== 'anonymous' && !forceRefresh) {
      const { data: existingData } = await supabaseAdmin
        .from('user_debugging_reports')
        .select('*')
        .eq('user_id', userId)
        .eq('date_string', dateString)
        .maybeSingle();

      if (existingData) {
        return NextResponse.json({ success: true, fromCache: true, data: existingData });
      }
    }

    // 2. 당일 일진 및 바이오리듬 연산 (사주 명리학 + 바이오리듬)
    const biorhythm = DailyLuckEngine.calculate(cleanDayMaster);

    // 사주 원국 정보 조립
    const pillarsDisplay = `년주 ${cleanYear || '?'}, 월주 ${cleanMonth || '?'}, 일주 ${cleanDay || '?'}, 시주 ${cleanHour || '?'}`;
    const yearIT = cleanYear ? (GAN_ELEMENTS_EN[cleanYear.charAt(0)] || 'Self') : 'Self';
    const monthIT = cleanMonth ? (GAN_ELEMENTS_EN[cleanMonth.charAt(0)] || 'Self') : 'Self';
    const dayIT = cleanDayMaster ? (GAN_ELEMENTS_EN[cleanDayMaster] || 'Self') : 'Self';
    const hourIT = cleanHour ? (GAN_ELEMENTS_EN[cleanHour.charAt(0)] || 'Self') : 'Self';

    // 오늘의 관계성(십성 기반) 및 데일리 키워드 도출
    const todayElement = GAN_ELEMENTS_EN[biorhythm.ganji.charAt(0)] || 'wood';
    const myElement = GAN_ELEMENTS_EN[cleanDayMaster] || 'wood';
    const relation = getRelation(myElement, todayElement);
    const dailyKeyword = getDailyKeyword(relation, biorhythm.ganji);

    // 천기 정보 표시용 한자 매핑
    const getHanjaPillar = (p?: string) => {
      if (!p || p.length < 2) return '?';
      const g = GAN_HANJA[p.charAt(0)] || p.charAt(0);
      const z = ZHI_HANJA[p.charAt(1)] || p.charAt(1);
      return g + z;
    };
    const pillarsHanja = `${getHanjaPillar(cleanYear)}(년) ${getHanjaPillar(cleanMonth)}(월) ${getHanjaPillar(cleanDay)}(일) ${getHanjaPillar(cleanHour)}(시)`;

    // 3. Gemini AI 프롬프트 조립 및 호출
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `당신은 명심코칭(Myeongsim Coaching)의 따뜻하고 감동적인 마음 웰니스 코치입니다.
아래 사용자의 타고난 기질과 오늘의 에너지를 바탕으로, 상처받은 마음을 다정하게 어루만지고 용기를 건네는 '오늘의 마음 웰니스 리포트'를 작성하세요.

=== 사용자 프로필 ===
- 사주 정보: ${pillarsDisplay} (${pillarsHanja}) / ${gender || '성별 미상'}
- 타고난 기질: 년주(${yearIT}) / 월주(${monthIT}) / 일주(${dayIT}) / 시주(${hourIT})
- 일간(나의 영혼): ${cleanDayMaster}
- 오늘 일진: ${biorhythm.ganji} (${dateString})
- 오늘 운세 요약: ${dailyKeyword} (관계성: ${relation})

=== 핵심 작성 규칙 ===
- **출력 형식**: 반드시 순수 JSON 형식으로만 출력할 것. 마크다운(\`\`\`json 등) 금지.
- **Tone & Manner**: 차갑거나 딱딱하지 않고, 초보자도 이해하기 쉬운 극도로 다정하고 따뜻한 자연의 은유와 시적인 어조. 사용자가 글을 읽는 것만으로도 가슴이 뭉클해지고 큰 위로와 용기를 얻을 수 있게 하세요.

{
      "targetOS": "이 사용자의 사주 4주를 자연과 마음의 은유로 요약한 한 줄 (예: 경신년(흔들림 없는 단단한 바위) 계축월(생명을 깨우는 맑은 단비) 갑진일(깊게 뿌리내린 든든한 나무) 을미시(어디서든 피어나는 부드러운 화초) / 남성)",
      "dailyKeyword": "오늘 겪기 쉬운 감정적 어려움을 깊이 공감해주는 따뜻하고 시적인 제목",
      "biorhythmAnalysis": "명심 바이오리듬 분석 (3~4문장, 오늘의 일진이 사용자의 타고난 사주 기질에 어떤 감정 파동을 일으키는지 IT 용어를 쓰지 않고, 자연/일상의 다정한 비유로 쉽게 설명)",
      "innerSourceCode": "마음속 숨겨진 상처 (4대 심리 코칭법 CBT·DBT·ACT·MBCT의 통찰을 통합하여, 사용자의 기질이 오늘 현실에서 부딪히기 쉬운 내면 깊은 곳의 상처나 오해를 다정한 이야기처럼 설명하세요. 4대 기법을 자연스레 녹이되 딱딱한 학술어 대신 **(CBT: 다정한 생각 점검)**, **(ACT: 마음의 나침반)**, **(DBT: 아픔 안아주기)**, **(MBCT: 고요한 바라봄)** 형태로 부드럽고 예쁘게 태그를 병기하여 설명하세요)",
      "projectedReality": "내가 바라보는 세상 (상처받은 내면 아이의 시선이 현실에서 어떤 두려움이나 외로움으로 비추어지는지 공감 가득하게 설명하세요. 인지적 융합(ACT)이나 생각 양식(MBCT)의 통찰을 다정하게 병기)",
      "coachingInsight": "명심 코칭 풀이 (위 상처들을 통합적으로 보듬어 안으며, 나의 있는 그대로를 사랑하는 방법(DBT 전면적 수용), 생각에 머물지 않고 나의 참된 온전함(Being Mode)을 찾는 법을 제시하는 5~7문장의 깊고 감동적인 치유의 통찰)",
      "socraticQuestion": "나를 찾아가는 질문 (CBT 기반으로, 지금 가진 마음의 짐이나 오해가 정말 사실인지 스스로에게 부드럽게 물어볼 수 있도록 돕는 다정한 질문 2~3개)",
      "recursiveQuestion": "마음의 뿌리를 만나는 재귀적 질문 (MBCT 기반으로, 이 상처의 씨앗이 내 마음 어디에서 싹텄는지 뿌리를 더듬어 올라가며 어루만지는 1~2개의 지혜로운 질문)",
      "step1_metaCognition": "STEP 1 한 걸음 물러나 바라보기 (인지적 탈융합 & 탈중심화: 내 안의 폭풍 같은 생각과 감정이 '나'가 아님을 인지하고, 마치 하늘을 지나가는 먹구름을 구경하듯 마음을 분리하여 따뜻하게 이름 붙여(Labeling) 주는 구체적 안내)",
      "step2_pureAwareness": "STEP 2 고요한 알아차림의 바다에 머물기 (순수 자각: 생각과 감정 뒤편에 늘 한결같이 존재하며 결코 상처받지 않는 깊고 맑은 '본래의 나'의 공간(지혜로운 마음)으로 마음의 닻을 내리는 다정한 안내)",
      "zeroPointSolution": {
        "intro": "Zero Point 솔루션 (두려움과 저항을 내려놓고 고통을 사랑으로 마주하도록 용기를 북돋는 따뜻한 도입부 1~2문장)",
        "step1_acceptance": "[수용] 나의 모든 완벽하지 못한 모습을 두 팔 벌려 꼭 안아주는 다정한 수용의 메시지 (DBT 전면적 수용 기법)",
        "step2_anchoring": "[지금 이 순간] 발바닥의 닿는 감각이나 오늘의 숨결을 느끼며 현재에 온전히 깨어나는 법 (MBCT 현재 앵커링 기법)",
        "step3_cleanCode": "[마음 다시 쓰기] 지친 나에게 새롭게 심어주는, 따뜻하고 단단한 영혼의 약속 (CBT 대안적 신념 재입력 기법)",
        "step4_commitment": "[한 걸음 내딛기] 과거의 상처에 갇히지 않고, 지금 여기에서 내가 소중히 여기는 사랑을 향해 가볍게 첫걸음을 떼도록 이끄는 응원의 메시지 (ACT 전념 행동 기법)",
        "closing": "이 모든 폭풍이 지나간 후 찾아오는, 고요하고 눈부신 영점(Zero Point)의 평화와 사랑에 대한 축복의 마무리 문장"
      }
    }

    중요 규칙:
    1. 차갑고 딱딱한 IT 용어나 기계적인 표현을 절대로 사용하지 마세요. 대신 따뜻한 대화, 자연의 풍경, 어린아이에 대한 위로와 같은 서정적이고 감동적인 비유로 바꾸어 작성하세요.
    2. 4대 마음 코칭법의 개념을 초보자도 바로 이해하고 감동받을 수 있도록 지극히 포근한 힐러의 음성으로 풀어내세요.
    3. 사용자의 타고난 기질과 오늘 일진의 흐름이 만들어낸 감정의 날씨를 섬세하게 다루어, '오직 나만을 위해 창조된 리포트'라는 특별한 경험을 선물하세요.
    4. 문장이 끝날 때마다 따뜻하게 다독이는 느낌을 주고, 읽는 것만으로도 무거운 마음의 짐이 내려놓아질 만큼 문장 하나하나에 진심어린 치유의 힘을 담아주세요.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON format from Gemini');
    }

    const parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    // 5. DB 저장
    let savedReport: any = {
      id: 'temp-' + Date.now(),
      user_id: userId,
      date_string: dateString,
      content: parsedData
    };

    if (userId && userId !== 'anonymous') {
      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from('user_debugging_reports')
        .upsert(
          {
            user_id: userId,
            date_string: dateString,
            content: parsedData
          },
          { onConflict: 'user_id,date_string' }
        )
        .select()
        .single();

      if (insertError) {
        console.error('DB Upsert Error (non-fatal):', insertError);
      } else if (insertedData) {
        savedReport = insertedData;
      }
    }

    return NextResponse.json({ success: true, fromCache: false, data: savedReport });
  } catch (error: any) {
    console.error('Daily Debugging Report Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
