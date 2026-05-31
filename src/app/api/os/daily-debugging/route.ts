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
    const { userId, dayMaster, yearPillar, monthPillar, dayPillar, hourPillar, gender, targetDate } = body;

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
    if (userId && userId !== 'anonymous') {
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

    const prompt = `당신은 명심코칭(Myeongsim Coaching)의 따뜻하고 감동적인 마음 치유 코치입니다.
아래 사용자의 타고난 기질과 오늘의 에너지를 바탕으로, 상처받은 마음을 다정하게 어루만지고 용기를 건네는 '오늘의 마음 치유 리포트'를 작성하세요.

=== 사용자 프로필 ===
- 사주 정보: ${pillarsDisplay} (${pillarsHanja}) / ${gender || '성별 미상'}
- 타고난 기질: 년주(${yearIT}) / 월주(${monthIT}) / 일주(${dayIT}) / 시주(${hourIT})
- 일간(나의 영혼): ${cleanDayMaster}
- 오늘 일진: ${biorhythm.ganji} (${dateString})
- 오늘 운세 요약: ${dailyKeyword} (관계성: ${relation})

=== 핵심 작성 규칙 ===
- **출력 형식**: 반드시 순수 JSON 형식으로만 출력할 것. 마크다운(\`\`\`json 등) 금지.
- **Tone & Manner**: 따뜻하고 감동적이며 용기를 주는 시선. 너무 길지 않고 간결하면서도 직관적으로.

{
  "targetOS": "이 사용자의 사주 4주를 자연과 마음의 은유로 요약한 한 줄 (예: 경신년(흔들림 없는 단단한 바위) 계축월(생명을 깨우는 맑은 단비) 갑진일(깊게 뿌리내린 든든한 나무) 을미시(어디서든 피어나는 부드러운 화초) / 남성)",
  "dailyKeyword": "오늘의 데일리 키워드",
  "biorhythmAnalysis": "명심 바이오리듬 분석 (3~4문장, 오늘의 일진이 사주 원국에 어떤 에너지 파동을 일으키는지 IT 비유로 설명)",
  "innerSourceCode": "내면의 소스코드 (4대 심리 버그 CBT·DBT·ACT·MBCT를 통합하여, 이 사용자의 기질이 오늘 촉발하기 쉬운 핵심 결핍/강박 패턴을 IT 비유로 설명. 각 치료법 태그를 **(CBT: ~)**, **(ACT: ~)**, **(DBT: ~)**, **(MBCT: ~)** 형태로 반드시 삽입)",
  "projectedReality": "투사된 현실 (내면의 소스코드가 외부에 투사되어 만들어내는 정반대의 짝/현실을 설명. 인지적 융합(ACT), 행위 양식(MBCT) 등의 태그 삽입)",
  "coachingInsight": "명심 코칭 풀이 (위 버그들을 통합적으로 해석하며, 전면적 수용(DBT), 존재 양식(Being Mode), 지혜로운 마음(DBT) 등의 솔루션 방향을 제시하는 5~7문장의 깊은 통찰)",
  "socraticQuestion": "소크라테스 문답 (CBT 기반 객관화 및 효용성 검증 질문 2~3개를 하나의 문단으로 작성)",
  "recursiveQuestion": "재귀적 질문 (MBCT 기반 에러 로그의 기원을 추적하는 질문 1~2개를 하나의 문단으로 작성)",
  "step1_metaCognition": "STEP 1 메타 인지 (인지적 탈융합 & 탈중심화: 에고의 자동적 사고를 관찰자 시점으로 바라보는 구체적 가이드. 명명(Labeling) 기법 포함)",
  "step2_pureAwareness": "STEP 2 알아차림의 알아차림 (순수 자각: 지혜로운 마음 & 맥락으로서의 자기. 생각과 감정 뒤편의 텅 빈 알아차림의 바다로 시선을 돌리는 안내)",
  "zeroPointSolution": {
    "intro": "Zero Point 솔루션 도입부 (핵심 공포 에너지를 마주하라는 ACT/DBT 기반 안내 1~2문장)",
    "step1_acceptance": "[수용] DBT 전면적 수용 명령어",
    "step2_anchoring": "[현재 앵커링] MBCT 지금 여기 접속 명령어",
    "step3_cleanCode": "[클린 코드 입력] CBT 건강한 대안적 사고 재입력 명령어",
    "step4_commitment": "[전념 행동] ACT 가치 기반 전진 명령어",
    "closing": "이 공포감이 연소된 후 도달하는 Zero Point 상태에 대한 마무리 문장"
  }
}

중요 규칙:
1. 모든 텍스트에 IT/시스템 엔지니어링 비유를 자연스럽게 녹여야 합니다 (서버, 트래픽, 캐시, 컴파일, 해킹, 방화벽, 알고리즘 등).
2. 4대 치료법(CBT·DBT·ACT·MBCT)의 핵심 개념을 정확히 사용하되, 전문 용어를 괄호 안에 병기하세요.
3. 이 사용자의 사주 기질과 오늘 일진의 충돌/조화를 기반으로 매우 구체적이고 개인화된 내용이어야 합니다.
4. 글의 톤은 날카롭고 통찰력 있으면서도, 궁극적으로 따뜻하고 치유적이어야 합니다.
5. 매일 다른 독창적인 결핍 테마와 시나리오를 생성하세요.`;

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
        .insert([{
          user_id: userId,
          date_string: dateString,
          content: parsedData
        }])
        .select()
        .single();

      if (insertError) {
        console.error('DB Insert Error (non-fatal):', insertError);
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
