import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DailyLuckEngine } from '@/lib/saju/DailyLuckEngine';

export const dynamic = 'force-dynamic';

const GAN_ELEMENT: Record<string, string> = {
  '갑': '목(木)', '을': '목(木)', '병': '화(火)', '정': '화(火)', '무': '토(土)',
  '기': '토(土)', '경': '금(金)', '신': '금(金)', '임': '수(水)', '계': '수(水)'
};

const GAN_YINYANG: Record<string, string> = {
  '갑': '양', '을': '음', '병': '양', '정': '음', '무': '양',
  '기': '음', '경': '양', '신': '음', '임': '양', '계': '음'
};

// 따뜻한 자연 은유 매핑 (일간 기질별) — 한글 + 한자 키 모두 지원
const DAY_MASTER_EMPATHY_METAPHOR: Record<string, string> = {
    // 한글 키 (프론트엔드에서 넘어오는 형식)
    '갑': '깊게 뿌리내린 든든한 나무 (한결같은 지지)', '을': '어디서든 피어나는 부드러운 화초 (유연한 생명력)',
    '병': '세상을 비추는 밝은 태양 (모두에게 온기를 주는 빛)', '정': '어둠을 밝히는 따뜻한 촛불 (세심하고 은은한 따뜻함)',
    '무': '묵묵히 품어주는 넓은 대지 (모든 것을 수용하는 포용력)', '기': '생명을 품은 비옥한 흙 (다정하고 아늑한 품)',
    '경': '흔들림 없는 단단한 바위 (변치 않는 우직한 믿음)', '신': '섬세하고 반짝이는 보석 (고귀하고 빛나는 가치)',
    '임': '지혜롭게 흐르는 넓은 바다 (깊고 넓은 지혜의 물결)', '계': '생명을 깨우는 맑은 단비 (세심하게 어루만지는 촉촉함)',
    // 한자 키 (호환용)
    '甲': '깊게 뿌리내린 든든한 나무 (한결같은 지지)', '乙': '어디서든 피어나는 부드러운 화초 (유연한 생명력)',
    '丙': '세상을 비추는 밝은 태양 (모두에게 온기를 주는 빛)', '丁': '어둠을 밝히는 따뜻한 촛불 (세심하고 은은한 따뜻함)',
    '戊': '묵묵히 품어주는 넓은 대지 (모든 것을 수용하는 포용력)', '己': '생명을 품은 비옥한 흙 (다정하고 아늑한 품)',
    '庚': '흔들림 없는 단단한 바위 (변치 않는 우직한 믿음)', '辛': '섬세하고 반짝이는 보석 (고귀하고 빛나는 가치)',
    '壬': '지혜롭게 흐르는 넓은 바다 (깊고 넓은 지혜의 물결)', '癸': '생명을 깨우는 맑은 단비 (세심하게 어루만지는 촉촉함)'
};

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
  '기': 'earth', '경': 'metal', '신': 'metal', '임': 'water', '계': 'water'
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

    // 캐시 확인
    if (userId && userId !== 'anonymous' && !forceRefresh) {
      const { data: existingData } = await supabaseAdmin
        .from('user_frequency_shifts')
        .select('*')
        .eq('user_id', userId)
        .eq('date_string', dateString)
        .maybeSingle();

      if (existingData) {
        return NextResponse.json({ success: true, fromCache: true, data: existingData });
      }
    }

    const biorhythm = DailyLuckEngine.calculate(cleanDayMaster);
    
    // 만약 생년월일 입력이 없어서 undefined로 넘어왔다면 안전하게 기본값 처리 방식만 명시적 안내
    const hasFullSaju = cleanYear && cleanMonth && cleanDay && cleanHour;
    const yearGan = cleanYear?.charAt(0) || '甲';
    const monthGan = cleanMonth?.charAt(0) || '甲';
    const hourGan = cleanHour?.charAt(0) || '甲';
    
    const yearIT = DAY_MASTER_EMPATHY_METAPHOR[yearGan] || '사회적 환경(참조)';
    const monthIT = DAY_MASTER_EMPATHY_METAPHOR[monthGan] || '내면의 무의식(참조)';
    const dayIT = DAY_MASTER_EMPATHY_METAPHOR[cleanDayMaster] || '나의 본질(참조)';
    const hourIT = DAY_MASTER_EMPATHY_METAPHOR[hourGan] || '나의 무기(참조)';

    const pillarsDisplay = hasFullSaju 
      ? `${cleanYear}년 ${cleanMonth}월 ${cleanDay}일 ${cleanHour}시`
      : `사주 데이터 미연동 (기본 기질: ${cleanDayMaster} 중심)`;
      
    const todayGan = biorhythm.ganji.charAt(0);
    const relation = getRelation(GAN_ELEMENTS_EN[cleanDayMaster] || 'metal', GAN_ELEMENTS_EN[todayGan] || 'metal');
    const dailyKeyword = getDailyKeyword(relation, biorhythm.ganji);

    const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

    let parsedData: any = null;

    if (isMockMode || !apiKey) {
      parsedData = {
        targetOS: `${pillarsDisplay} (${cleanDayMaster} 일간 중심의 고유 기질) / ${gender || '사용자'}`,
        dailyKeyword: `오늘 겪기 쉬운 감정적 피로와 완벽주의 내려놓기`,
        biorhythmAnalysis: `오늘의 일진(${biorhythm.ganji})은 [${cleanDayMaster}]의 기질과 만나 에너지가 특정 영역으로 집중되기 쉬운 날입니다. 감정이 다소 격해지거나 책임감이 무겁게 느껴질 수 있으나, 이는 당신의 결함이 아니라 일시적인 기운의 파도일 뿐입니다.`,
        level1_darkCode: {
          errorLog: `내가 완벽하게 통제하지 못하면 모든 것이 무너질 것 같아요`,
          projectedReality: `주변 사람들의 작은 실수나 상황의 지연이 극심한 답답함으로 다가와 스스로를 고립시키기 쉽습니다.`,
          currentFrequency: `🌧️ 긴장과 통제감으로 어깨가 무겁게 굳어있는 상태`,
          systemMessage: `괜찮습니다. 당신은 이미 충분히 애써왔고, 있는 그대로 소중합니다.`
        },
        level2_neuralCode: {
          debugging1_metaCognition: `지금 머릿속을 스치는 불안과 조급함은 '진짜 나'가 아니라, 일시적으로 흘러가는 마음의 날씨일 뿐임을 가만히 알아차려 보세요.`,
          debugging2_radicalAcceptance: `모든 것을 내 뜻대로 통제하려는 욕심을 내려놓고, 지금 이 순간 벌어지는 현실을 부드럽게 숨 쉬며 허용해 줍니다.`,
          systemStabilization: `가슴에 가만히 손을 얹고 세 번의 깊은 날숨과 함께 내면의 중심(영점)으로 의식을 정렬합니다.`,
          currentFrequency: `⛅ 먹구름이 걷히고 내면을 평온하게 바라보는 안정 상태`,
          systemMessage: `나는 파도가 아닌 깊은 바다임을 스스로에게 다정하게 알려줍니다.`
        },
        level3_metaCode: {
          dimensionShift: `생각과 감정의 파도를 넘어, 애초에 어떤 상처도 입을 수 없는 텅 비고 맑은 본래의 순수 자각으로 시선을 넓힙니다.`,
          zeroPointSolution: `Zero Point(영점) 솔루션: 결과를 통제하려는 불안 에너지를 완전히 거두고, '지금 여기'에서 내가 할 수 있는 가장 사소하고 친절한 행동 하나를 선택하세요.`,
          currentFrequency: `✨ 어떤 조건 없이도 이미 온전하고 자유로운 평온`,
          systemMessage: `모든 무게를 내려놓고 온전한 자유 속에 머무릅니다.`
        },
        aiCoachNotice: `💡 명심 코칭 코멘트: 비록 오늘 하루가 흔들렸을지라도, 당신 안에는 언제나 눈부신 회복 탄력성이 살아 숨쉬고 있습니다. 스스로에게 자비로운 미소를 건네보세요.`
      };
    } else {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `당신은 명심코칭(Myeongsim Coaching)의 따뜻하고 지혜로운 심리 코치입니다.
아래 사용자의 사주 기질을 오늘 일진 에너지와 바탕으로, 상처받은 마음을 어루만지고 의식 주파수를 끌어올려주는 3단계 '내면 주파수 레벨업' 리포트를 작성하세요.

=== 사용자 프로필 ===
- 사주 정보: ${pillarsDisplay} / ${gender || '성별 미상'}
- 기질적 특징: ${yearIT}(사회적 환경) / ${monthIT}(내면의 무의식) / ${dayIT}(나의 본질) / ${hourIT}(나의 무기)
- 일간(나의 영혼): ${cleanDayMaster} (${GAN_ELEMENTS_EN[cleanDayMaster]}, ${GAN_YINYANG[cleanDayMaster]})
- 오늘 일진: ${biorhythm.ganji} (${dateString})
- 오늘 운세 요약: ${dailyKeyword} (관계성: ${relation})

=== 작성 지침 ===
- **출력 형식**: 반드시 순수 JSON 형식으로만 출력할 것. 마크다운(\`\`\`json 등) 금지.
- **Tone & Manner**: 차가운 분석이 아닌, 따뜻하고 공감하는 명심(明心) 코치의 관점. 간결하고 감동적인 은유 사용.

{
  "targetOS": "이 사용자의 사주 4주를 자연과 마음의 은유로 요약한 한 줄",
  "dailyKeyword": "오늘 겪기 쉬운 감정적 어려움을 공감해주는 따뜻한 제목",
  "biorhythmAnalysis": "오늘 일진이 나의 기질에 어떤 영향을 주어 감정이 흔들리는지, 초보자도 이해하기 쉬운 친절한 언어로 3~4줄 분석",
  "level1_darkCode": {
    "errorLog": "마음속 가장 깊은 곳에서 두려워하는 상처받은 내면아이의 목소리",
    "projectedReality": "그 두려움 때문에 오늘 현실에서 벌어지기 쉬운 오해나 힘든 상황을 공감하며 설명",
    "currentFrequency": "현재 감정 상태 분석",
    "systemMessage": "스스로를 자책하지 않도록 다독여주는 1줄 위로 메시지"
  },
  "level2_neuralCode": {
    "debugging1_metaCognition": "메타인지 가이드",
    "debugging2_radicalAcceptance": "수용 방법",
    "systemStabilization": "시각화 가이드",
    "currentFrequency": "주파수 상승 결과",
    "systemMessage": "1줄 지지 메시지"
  },
  "level3_metaCode": {
    "dimensionShift": "시선 넓히기 가이드",
    "zeroPointSolution": "Zero Point(영점) 솔루션",
    "currentFrequency": "최종 도달 상태",
    "systemMessage": "축복의 1줄 메시지"
  },
  "aiCoachNotice": "💡 명심 코칭 코멘트"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON format from Gemini');
      }

      parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }

    let savedReport: any = {
      id: 'temp-' + Date.now(),
      user_id: userId,
      date_string: dateString,
      content: parsedData
    };

    if (userId && userId !== 'anonymous') {
      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from('user_frequency_shifts')
        .upsert(
          { user_id: userId, date_string: dateString, content: parsedData },
          { onConflict: 'user_id,date_string' }
        )
        .select().single();

      if (insertError) console.error('DB Upsert Error:', insertError);
      else if (insertedData) savedReport = insertedData;
    }

    return NextResponse.json({ success: true, fromCache: false, data: savedReport });
  } catch (error: any) {
    console.error('Frequency Shift Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
