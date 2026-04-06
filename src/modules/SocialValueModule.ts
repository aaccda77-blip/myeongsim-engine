/**
 * ======================================================
 * 🌏 명심 사회적 가치 발견 엔진 (Myeongsim Social Value Discovery Engine)
 * ======================================================
 * 
 * 사용자의 사주 명식(용신 오행)을 분석하여,
 * 부족한 기운을 '결핍'이 아닌 '세상에 줄 수 있는 선물'로 재정의(Reframing)합니다.
 * 
 * 기존 시스템(saju60, mental64, route.ts)에 절대 영향 없음.
 * 독립 플러그인 모듈.
 * ======================================================
 */

export interface ValueProfile {
  elementKey: string;       // 용신 오행 키 (wood, fire, earth, metal, water)
  elementName: string;      // 한글 오행명
  elementHanja: string;     // 한자
  emoji: string;            // 대표 이모지
  color: string;            // 테마 컬러 (tailwind class용)
  gradientFrom: string;     // 그라디언트 시작
  gradientTo: string;       // 그라디언트 끝
  archetype: string;        // 원형(Archetype) 타이틀
  coreValue: string;        // 핵심 사회적 가치
  reframingMessage: string; // 관점 전환 메시지 (수용)
  socialMission: string;    // 사회적 미션 선언문
  dailyAction: string;      // 오늘의 실천 과제
  psychInsight: string;     // 심리학적 통찰
  masterQuote: string;      // 명심 마스터의 한 마디
}

/**
 * 오행별 사회적 가치 데이터베이스
 * - 각 오행이 '부족한 것'이 아닌 '세상에 제공하는 고유한 선물'로 매핑됩니다.
 */
export const VALUE_DATABASE: ValueProfile[] = [
  {
    elementKey: 'wood',
    elementName: '목(木)',
    elementHanja: '木',
    emoji: '🌳',
    color: 'emerald',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-600',
    archetype: '생명의 설계자 (Architect of Life)',
    coreValue: '성장과 혁신의 촉매제',
    reframingMessage: '당신의 사주에서 목(木)의 기운이 용신으로 작동한다는 것은, 당신이 이 세상에서 "새로운 것을 시작하는 힘"을 가장 아름답게 발휘할 수 있는 존재라는 뜻입니다. 당신의 어려운 환경은 고통이 아니라, 봄이 오기 직전의 가장 차가운 겨울입니다. 씨앗이 땅을 뚫고 올라오려면 반드시 압력이 필요합니다.',
    socialMission: '나는 멈춰있는 세상에 가장 먼저 균열을 내고, 새로운 가능성의 씨앗을 심는 선구자다. 나의 존재 자체가 주변 사람들에게 "나도 시작해도 되겠구나"라는 용기를 선물한다.',
    dailyAction: '오늘 주변에서 "시작을 두려워하는 사람" 한 명을 찾아, "첫 걸음만 내디뎌 봐, 내가 옆에서 지켜볼게"라고 말해주세요. 당신의 목(木) 에너지가 그 사람의 겨울을 녹입니다.',
    psychInsight: '성장 심리학(Growth Psychology)에서는 인간의 가장 강력한 동기를 "자기실현 욕구(Self-Actualization)"라고 합니다. 목 기운이 용신인 당신은, 스스로 성장할 때 가장 행복하며 동시에 타인의 성장을 이끄는 천부적 "코치(Coach)" 기질을 타고났습니다.',
    masterQuote: '거목(巨木)은 햇빛을 독차지하지 않습니다. 스스로 하늘을 향해 자라면서, 그 그늘 아래에서 수만 개의 작은 생명이 숨 쉴 공간을 만들어 주는 것입니다. 당신의 성장이 곧 세상의 성장입니다.'
  },
  {
    elementKey: 'fire',
    elementName: '화(火)',
    elementHanja: '火',
    emoji: '🔥',
    color: 'orange',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-red-500',
    archetype: '희망의 점화자 (Igniter of Hope)',
    coreValue: '영감과 열정의 등대',
    reframingMessage: '당신의 사주에서 화(火)의 기운이 용신으로 작동한다는 것은, 당신이 이 세상에서 "꺼져가는 불꽃을 되살리는 힘"을 가장 다이나믹하게 발산할 수 있는 존재라는 뜻입니다. 당신이 겪는 차갑고 어두운 환경은, 당신의 빛이 더욱 선명하게 빛나기 위한 캔버스입니다.',
    socialMission: '나는 희망을 잃은 사람들의 가슴에 다시 불을 지피는 점화자다. 나의 열정과 표현력은 침묵하는 세상을 깨우고, 사람들이 다시 꿈꿀 수 있게 만드는 에너지원이다.',
    dailyAction: '오늘 SNS나 대화에서 누군가의 노력이나 작품에 진심 어린 감탄과 응원의 메시지를 남겨주세요. "당신의 이 부분이 정말 대단해요!"라는 한 줄이 그 사람의 인생을 바꿀 수 있습니다.',
    psychInsight: '긍정 심리학(Positive Psychology)의 "브로든-앤-빌드(Broaden-and-Build)" 이론에 따르면, 긍정적 감정은 사고의 폭을 넓히고 새로운 자원을 구축합니다. 화 기운이 용신인 당신은 주변에 이 긍정의 연쇄반응을 일으키는 핵반응로와 같습니다.',
    masterQuote: '태양은 누구에게 빛을 주겠다고 계산하지 않습니다. 그저 타오를 뿐이고, 그 은혜는 만물에게 공평하게 닿습니다. 당신이 진심으로 빛나면, 세상은 자동으로 밝아집니다.'
  },
  {
    elementKey: 'earth',
    elementName: '토(土)',
    elementHanja: '土',
    emoji: '🏔️',
    color: 'amber',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-yellow-700',
    archetype: '존재의 안식처 (Sanctuary of Being)',
    coreValue: '신뢰와 포용의 대지',
    reframingMessage: '당신의 사주에서 토(土)의 기운이 용신으로 작동한다는 것은, 당신이 이 세상에서 "흔들리는 사람들의 중심축"이 되어줄 수 있는 존재라는 뜻입니다. 당신이 경험하는 무거움과 답답함은, 대지가 수천 톤의 무게를 견디면서도 그 위에 생명을 키워내는 것과 같습니다. 그 무게가 곧 당신의 격(格)입니다.',
    socialMission: '나는 불안한 세상에서 "여기에 기대도 괜찮아"라는 말 한 마디를 줄 수 있는 살아있는 안식처다. 나의 묵직한 존재감은 주변 사람들에게 심리적 안전 기지(Secure Base)가 된다.',
    dailyAction: '오늘 주변의 불안해하는 동료나 친구에게 "괜찮아, 내가 여기 있잖아. 천천히 해도 돼"라고 든든하게 말해주세요. 당신의 토(土) 에너지가 그 사람의 땅을 단단하게 다져줍니다.',
    psychInsight: '애착 이론(Attachment Theory)에서 "안전 기지(Secure Base)"는 아이가 세상을 탐험할 수 있게 해주는 부모의 존재를 뜻합니다. 토 기운이 용신인 당신은, 성인 관계에서도 이 "안전 기지" 역할을 천부적으로 수행할 수 있는 사람입니다.',
    masterQuote: '태산(泰山)은 스스로를 높다고 자랑하지 않습니다. 그저 묵묵히 그 자리에 서 있을 뿐인데, 세상의 모든 구름이 그 봉우리를 향해 모여듭니다. 당신의 존재 자체가 세상의 중심입니다.'
  },
  {
    elementKey: 'metal',
    elementName: '금(金)',
    elementHanja: '金',
    emoji: '⚔️',
    color: 'slate',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-zinc-600',
    archetype: '정의의 수호자 (Guardian of Justice)',
    coreValue: '원칙과 결단의 명검',
    reframingMessage: '당신의 사주에서 금(金)의 기운이 용신으로 작동한다는 것은, 당신이 이 세상에서 "옳고 그름을 판별하고 불필요한 것을 도려내는 힘"을 가장 정밀하게 사용할 수 있는 존재라는 뜻입니다. 당신이 느끼는 날카로운 외로움과 냉정함은, 명검이 벼려지는 과정에서 겪는 불꽃의 시련입니다.',
    socialMission: '나는 타협과 거짓으로 흐려진 세상에 가장 견고한 본질만을 남기는 수호자다. 나의 결단력과 공정함은 부조리한 구조를 바로잡고, 흔들리는 사람들에게 명확한 기준선을 제시한다.',
    dailyAction: '오늘 내가 불편해하면서도 침묵하고 있었던 "부당한 상황" 하나를 떠올리고, 품위 있지만 단호하게 "이 부분은 바로잡아야 한다고 생각합니다"라고 입을 열어 보세요.',
    psychInsight: '도덕 발달 이론(Kohlberg)의 최상위 단계는 "보편적 윤리 원칙"에 따른 행동입니다. 금 기운이 용신인 당신은, 사회적 압력에 굴하지 않고 자신의 원칙을 관철시키는 정의로운 리더십의 원형(Archetype)을 내면에 품고 있습니다.',
    masterQuote: '명검은 난잡하게 휘두르는 자를 위해 만들어지지 않았습니다. 가장 중요한 순간, 단 한 번의 일격으로 세상의 매듭을 베어낼 수 있는 자만이 그 칼을 쥘 자격이 있습니다. 당신이 그 자입니다.'
  },
  {
    elementKey: 'water',
    elementName: '수(水)',
    elementHanja: '水',
    emoji: '🌊',
    color: 'cyan',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-blue-700',
    archetype: '지혜의 대양 (Ocean of Wisdom)',
    coreValue: '치유와 통찰의 생명수',
    reframingMessage: '당신의 사주에서 수(水)의 기운이 용신으로 작동한다는 것은, 당신이 이 세상에서 "마른 세상을 적시고 생명을 되살리는 힘"을 가장 깊고 풍요롭게 발휘할 수 있는 존재라는 뜻입니다. 당신의 사주가 조열(燥熱)한 것은 고통이 아니라, 당신이 "맑은 물"이라는 가치를 더 빛나게 쓰기 위한 무대 설정입니다.',
    socialMission: '나는 메마르고 갈증에 허덕이는 세상에 가장 맑고 깊은 지혜를 흘려보내는 생명수다. 나의 직관과 공감 능력은 상처 입은 영혼을 치유하고, 복잡한 문제의 본질을 꿰뚫는다.',
    dailyAction: '오늘 마음이 지쳐 보이는 사람 한 명에게 조용히 다가가, 아무 말 없이 그냥 옆에 앉아 함께 있어주세요. 물(水)은 말없이 흐르지만, 닿는 곳마다 생명을 피워냅니다.',
    psychInsight: '칼 융(C.G. Jung)은 물을 "무의식의 상징"이자 "치유의 원형"으로 보았습니다. 수 기운이 용신인 당신은, 타인의 무의식적 고통에 본능적으로 공감하고, 그 어둠을 감싸안아 빛으로 변환시키는 치유자(Healer)의 DNA를 가지고 있습니다.',
    masterQuote: '물은 가장 낮은 곳으로 흐릅니다. 그러나 그 겸손함이 모든 강과 호수를 넘어, 결국 가장 거대한 바다에 이릅니다. 당신의 겸허한 지혜가 결국 이 세상의 가장 깊은 곳을 채울 것입니다.'
  }
];

/**
 * 용신 오행을 기반으로 사회적 가치 프로필을 조회합니다.
 */
export function getValueProfile(elementKey: string): ValueProfile | undefined {
  return VALUE_DATABASE.find(v => v.elementKey === elementKey);
}

/**
 * 모든 가치 프로필 목록을 반환합니다.
 */
export function getAllValueProfiles(): ValueProfile[] {
  return VALUE_DATABASE;
}

/**
 * Gemini API에 전송할 고도화된 프롬프트를 생성합니다.
 * (향후 실제 API 연동 시 사용)
 */
export function generateValuePrompt(elementKey: string, sajuContext?: string): string {
  const profile = getValueProfile(elementKey);
  if (!profile) return '';

  return `
[System: 명심(明心) 사회적 가치 발견 코칭 엔진]

당신은 따뜻한 공감 능력과 날카로운 통찰력을 지닌 '명심코칭' AI입니다.
사용자의 사주에서 용신이 '${profile.elementName}'로 판명되었습니다.
${sajuContext ? `추가 사주 컨텍스트: ${sajuContext}` : ''}

다음의 내용을 포함하여 답변하세요:
1. ${profile.elementName}이(가) 현대 사회에서 가질 수 있는 가치를 심리학적 관점에서 풀어서 설명할 것.
2. 사용자가 현재 겪고 있는 어려운 환경을 '틀린 것'이 아닌 '수용해야 할 삶의 장르'로 인식하게 할 것.
3. 이 가치를 통해 사회에 어떻게 기여하며 스스로의 존엄성을 지킬 수 있는지 격려하는 메시지를 작성할 것.
4. 말투는 단호하면서도 따뜻한 코칭 톤을 유지할 것.

원형(Archetype): ${profile.archetype}
핵심 사회적 가치: ${profile.coreValue}
심리학적 통찰: ${profile.psychInsight}
  `.trim();
}
