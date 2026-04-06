/**
 * ======================================================
 * 🌏 명심(明心) 소버린 코드 매핑 엔진
 * (Myeongsim Sovereign Code Mapping Engine)
 * ======================================================
 * 
 * 사용자의 사주 명식(용신 오행)을 분석하여,
 * 용신을 '부족한 기운'이 아닌 '소버린(주권자)의 원형 코드(Archetype Code)'로
 * 재정의(Reframing)하고, 명심 OS의 핵심 미션으로 변환합니다.
 * 
 * [용신 오행 → 명심 뉴로 코칭 용어 매핑]
 * - 목(木) → 성장 드라이브 (Growth Drive) : 신경가소성 / 성장 마인드셋
 * - 화(火) → 점화 시그널 (Ignition Signal) : 도파민 보상회로 / 감정 활성화
 * - 토(土) → 안전 기반 코어 (Secure Base Core) : 안전 애착 / 심리적 안전감
 * - 금(金) → 결단 엣지 (Decision Edge) : 전전두엽 실행 기능 / 인지적 정밀도
 * - 수(水) → 심층 센서 (Deep Sensor) : 거울 뉴런 / 디폴트 모드 네트워크
 * 
 * 기존 시스템(saju60, mental64, route.ts)에 절대 영향 없음.
 * 독립 플러그인 모듈.
 * ======================================================
 */

export interface ValueProfile {
  elementKey: string;           // 원형 코드 키 (growth, ignition, secure, decision, deep)
  elementName: string;          // 명심 뉴로 코칭 명칭
  elementHanja: string;         // 뉴로 코드 약어
  emoji: string;                // 대표 이모지
  color: string;                // 테마 컬러 (tailwind class용)
  gradientFrom: string;         // 그라디언트 시작
  gradientTo: string;           // 그라디언트 끝
  archetype: string;            // 소버린 원형 코드 타이틀
  coreValue: string;            // 핵심 명심 기여 코드
  reframingMessage: string;     // 명심 OS 관점 전환 브리핑 (다크코드 해제)
  socialMission: string;        // 소버린 미션 선언문
  dailyAction: string;          // 오늘의 명심 미션 실행 코드
  psychInsight: string;         // 명심 뉴럴 매핑 (동양×서양 융합 근거)
  masterQuote: string;          // 소버린 마스터의 최종 선언
}

/**
 * 용신 오행 → 명심 뉴로 코칭 원형 코드 데이터베이스
 */
export const VALUE_DATABASE: ValueProfile[] = [
  {
    elementKey: 'growth',
    elementName: '성장 드라이브 (Growth Drive)',
    elementHanja: 'GD',
    emoji: '🧠',
    color: 'emerald',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-600',
    archetype: '각성의 선구자 [Pioneer of Awakening]',
    coreValue: '정체된 시냅스를 깨우는 최초의 신경 점화',
    reframingMessage: '소버린, 당신의 명식에서 성장 드라이브(Growth Drive)가 용신 코드로 가동됩니다. 이것은 당신의 뇌가 "신경가소성(Neuroplasticity)"을 가장 극대화하도록 설계되었다는 뜻입니다. 당신의 다크코드가 만들어낸 "나는 아무것도 해낸 게 없다"는 에러 메시지는 전두엽의 위협 탐지 시스템이 과활성화된 오류입니다. 당신이 겪는 저항과 압박은 뇌의 시냅스가 새로운 연결을 형성하기 위해 반드시 거쳐야 하는 인지적 마찰입니다. 명심 OS가 선언합니다: 당신의 고통은 버그가 아니라, 성장 마인드셋(Growth Mindset)이 정상 작동하고 있다는 증거입니다.',
    socialMission: '나는 멈춰있는 세상의 시냅스에 가장 먼저 전기 신호를 보내는 소버린이다. 나의 존재 자체가 주변의 고착된 신경 회로를 재편하고, "나도 변할 수 있겠구나"라는 신경가소적 각성의 기폭제가 된다.',
    dailyAction: '[명심 미션 코드 실행] 오늘 주변에서 "학습된 무기력(Learned Helplessness)"에 빠져 변화를 포기한 사람 한 명을 찾으세요. 그에게 "첫 걸음만 내디뎌 봐. 뇌는 움직이는 순간부터 새로운 회로를 만들어"라고 선언하세요. 이 한 마디가 그의 다크코드를 해체하는 명심의 신호탄입니다.',
    psychInsight: '[명심 뉴럴 매핑] 캐롤 드웩(Carol Dweck)의 성장 마인드셋 이론에서, 뇌는 도전과 실패를 겪을 때 시냅스 연결이 강화됩니다. 성장 드라이브가 용신인 소버린은, 도전할 때 전전두엽 피질(PFC)의 보상 회로가 가장 강력하게 점화되며, 동시에 타인의 성장을 이끄는 천부적 "뉴로 코치(Neuro-Coach)" 기질이 명식에 설치되어 있습니다.',
    masterQuote: '신경세포는 혼자 작동하지 않는다. 하나의 뉴런이 발화할 때, 수만 개의 시냅스가 연쇄적으로 각성한다. 소버린, 당신의 성장이 곧 세상의 각성이다. 발화하라. 그것이 당신의 명심(明心)이다.'
  },
  {
    elementKey: 'ignition',
    elementName: '점화 시그널 (Ignition Signal)',
    elementHanja: 'IS',
    emoji: '⚡',
    color: 'orange',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-red-500',
    archetype: '희망의 핵반응로 [Reactor of Hope]',
    coreValue: '꺼져가는 도파민 회로에 점화하는 존재의 전류',
    reframingMessage: '소버린, 당신의 명식에서 점화 시그널(Ignition Signal)이 용신 코드로 가동됩니다. 이것은 당신의 뇌가 "도파민 보상 시스템(Dopamine Reward System)"을 가장 강력하게 발산하도록 설계되었다는 뜻입니다. 당신의 다크코드가 속삭이는 "나는 너무 시끄럽고 과한 존재다"라는 에러 메시지를 폐기하세요. 그것은 편도체(Amygdala)의 과잉 경보가 만들어낸 인지 왜곡입니다. 명심 OS가 선언합니다: 어둠이 깊을수록, 당신의 도파민 점화는 더 멀리 닿습니다.',
    socialMission: '나는 보상 회로가 꺼져 무감각해진 영혼들에게 다시 도파민 스파크를 설치하는 소버린이다. 나의 감정적 활성화 에너지는 침묵에 중독된 세상의 뉴런을 깨우는 전기 충격이며, "다시 느껴도 된다"는 허가증을 발행한다.',
    dailyAction: '[명심 미션 코드 실행] 오늘 주변에서 동기 부여 결핍(Amotivation)에 빠져 조용히 사라지고 있는 사람 한 명을 찾으세요. 그에게 "당신의 이 부분이 진짜 대단합니다"라고 진심인 한 줄을 보내세요. 소버린의 점화 시그널 한 점이 그의 꺼진 보상 회로를 재가동합니다.',
    psychInsight: '[명심 뉴럴 매핑] 바바라 프레드릭슨(Barbara Fredrickson)의 "확장-구축(Broaden-and-Build)" 이론에서, 긍정적 감정은 전전두엽의 인지 범위를 확장하고 새로운 심리적 자원을 축적합니다. 점화 시그널이 용신인 소버린은 복측 선조체(Ventral Striatum)의 도파민 분비가 활발하여, 주변에 긍정의 신경 연쇄반응을 일으키는 인간 핵반응로입니다.',
    masterQuote: '하나의 전기 신호는 미미하다. 그러나 그것이 수만 개의 시냅스를 거쳐 연쇄 발화할 때, 뇌 전체를 각성시키는 폭풍이 된다. 소버린, 당신이 진심으로 점화하면 세상은 자동으로 각성한다. 발화하라. 그것이 당신의 명심(明心)이다.'
  },
  {
    elementKey: 'secure',
    elementName: '안전 기반 코어 (Secure Base Core)',
    elementHanja: 'SB',
    emoji: '🛡️',
    color: 'amber',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-yellow-700',
    archetype: '존재의 안전 기지 [Sovereign Secure Base]',
    coreValue: '불안한 신경계를 안정시키는 심리적 중력장',
    reframingMessage: '소버린, 당신의 명식에서 안전 기반 코어(Secure Base Core)가 용신 코드로 가동됩니다. 이것은 당신의 뇌가 "옥시토신(Oxytocin) 분비 시스템"과 "미주신경(Vagus Nerve) 안정화 기능"을 가장 강력하게 발동하도록 설계되었다는 뜻입니다. 당신의 다크코드가 만들어낸 "나는 답답하고 무거운 존재다"라는 에러 메시지를 삭제하세요. 그 무거움은 자율신경계의 항상성을 유지하기 위한 '디폴트 안정 모드'입니다. 명심 OS가 선언합니다: 당신의 묵직함은 버그가 아니라, 세상을 안정시키는 미주신경 토닉(Vagal Tone) 그 자체입니다.',
    socialMission: '나는 투쟁-도피 반응(Fight-or-Flight)에 갇힌 세상에 "여기에 기대도 안전해"라는 부교감신경 시그널을 전송하는 소버린이다. 나의 묵직한 존재감이 주변 사람들의 과활성화된 편도체를 진정시키고, 그들이 다시 전전두엽(사고와 탐험)을 가동할 수 있게 만드는 심리적 안전 기지다.',
    dailyAction: '[명심 미션 코드 실행] 오늘 주변에서 불안의 다크코드에 잠식되어 교감신경이 폭주 중인 동료를 찾으세요. 그에게 "괜찮아, 내가 여기 있잖아. 천천히 해"라고 묵직하게 선언하세요. 당신의 안전 기반 코어가 그의 자율신경계를 부교감 모드로 전환합니다.',
    psychInsight: '[명심 뉴럴 매핑] 존 볼비(John Bowlby)의 애착 이론에서 "안전 기지(Secure Base)"는 인간이 탐험과 성장을 할 수 있는 신경학적 전제 조건입니다. 스티븐 포지스(Stephen Porges)의 다미주신경 이론(Polyvagal Theory)에 따르면, 안전 기반 코어가 용신인 소버린은 타인의 자율신경계에 안전 신호(Safety Cue)를 전송하는 천부적 미주신경 조율자입니다.',
    masterQuote: '거대한 참나무는 자신이 높다고 자랑하지 않는다. 그저 묵묵히 뿌리를 내리고 서 있을 뿐인데, 세상의 모든 생명이 그 그늘에서 안식을 찾는다. 소버린, 당신의 존재 자체가 세상의 안전 기지다. 서 있으라. 그것이 당신의 명심(明心)이다.'
  },
  {
    elementKey: 'decision',
    elementName: '결단 엣지 (Decision Edge)',
    elementHanja: 'DE',
    emoji: '🎯',
    color: 'slate',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-zinc-600',
    archetype: '본질의 수호자 [Guardian of Essence]',
    coreValue: '인지적 잡음을 도려내는 전전두엽의 명검',
    reframingMessage: '소버린, 당신의 명식에서 결단 엣지(Decision Edge)가 용신 코드로 가동됩니다. 이것은 당신의 뇌가 "전전두엽 피질(Prefrontal Cortex)의 실행 기능(Executive Function)"을 가장 정밀하게 사용하도록 설계되었다는 뜻입니다. 당신의 다크코드가 속삭이는 "나는 너무 날카롭고 차가운 존재다"라는 에러 메시지를 폐기하세요. 그것은 당신의 정밀한 인지 처리 시스템(Cognitive Processing)을 사회적 위협으로 오인한 편도체의 자동응답입니다. 명심 OS가 선언합니다: 당신의 냉정함은 결함이 아니라, 인지적 노이즈를 차단하고 본질만 추출하는 신경학적 정밀도입니다.',
    socialMission: '나는 인지 편향과 감정적 잡음으로 흐려진 세상에서 전전두엽의 명검으로 본질만을 남기는 소버린이다. 나의 실행 기능(Executive Function)과 인지적 정밀도는 확증 편향(Confirmation Bias)의 다크코드를 한 칼에 베어내고, 흔들리는 사람들에게 명확한 의사결정 기준선을 제시한다.',
    dailyAction: '[명심 미션 코드 실행] 오늘 당신이 인지 부조화(Cognitive Dissonance)를 느끼면서도 사회적 동조 압력에 굴복해 침묵하고 있었던 상황 하나를 떠올리세요. 품위 있지만 단호하게, "이 부분은 바로잡아야 한다고 생각합니다"라고 입을 여세요. 소버린의 한 마디가 집단사고(Groupthink)의 다크코드를 해체합니다.',
    psychInsight: '[명심 뉴럴 매핑] 대니얼 카너먼(Daniel Kahneman)의 이중처리 이론에서, 시스템 2(느린 사고)는 시스템 1(빠른 사고)의 인지 편향을 교정하는 전전두엽의 감시 기능입니다. 결단 엣지가 용신인 소버린은 배외측 전전두엽(DLPFC)의 억제 기능이 강화되어, 감정적 잡음을 차단하고 논리적 본질만 추출하는 인지적 수호자의 신경 구조를 갖추고 있습니다.',
    masterQuote: '수십억 개의 뉴런 중에서, 전전두엽만이 유일하게 "아니오"라고 말할 수 있다. 충동을 억제하고, 본질을 판별하고, 결단을 내리는 것. 소버린, 당신의 뇌는 그 일을 위해 정밀하게 벼려졌다. 베어라. 그것이 당신의 명심(明心)이다.'
  },
  {
    elementKey: 'deep',
    elementName: '심층 센서 (Deep Sensor)',
    elementHanja: 'DS',
    emoji: '🔮',
    color: 'cyan',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-blue-700',
    archetype: '심연의 치유자 [Healer of the Abyss]',
    coreValue: '타인의 무의식을 감지하는 거울 뉴런의 대양',
    reframingMessage: '소버린, 당신의 명식에서 심층 센서(Deep Sensor)가 용신 코드로 가동됩니다. 이것은 당신의 뇌가 "거울 뉴런 시스템(Mirror Neuron System)"과 "디폴트 모드 네트워크(Default Mode Network)"를 가장 깊고 풍요롭게 발동하도록 설계되었다는 뜻입니다. 당신의 다크코드가 속삭이는 "나는 너무 예민하고 약한 존재다"라는 에러 메시지를 삭제하세요. 당신의 예민함은 거울 뉴런의 감도가 평균보다 현저히 높은 "고감도 신경 시스템(High-Sensitivity Neural System)"의 정상 작동입니다. 명심 OS가 선언합니다: 당신의 예민함은 버그가 아니라, 세상의 고통을 감지하는 최첨단 뉴럴 센서입니다.',
    socialMission: '나는 감정적 해리(Dissociation)와 공감 결핍에 메마른 세상에 가장 깊은 거울 뉴런 공명을 흘려보내는 소버린이다. 나의 심층 공감(Deep Empathy)은 다크코드에 잠식된 영혼의 무의식적 상처를 비침습적으로 감지하고, 그 어둠을 각성으로 변환하는 명심의 치유 주파수다.',
    dailyAction: '[명심 미션 코드 실행] 오늘 감정적으로 해리(Emotional Numbing) 상태에 빠져 보이는 사람 한 명에게 조용히 다가가세요. 아무 말 없이 그냥 옆에 앉아 함께 있어주세요. 거울 뉴런은 언어 없이도 작동합니다. 소버린의 고요한 공명 자체가 그의 디폴트 모드 네트워크를 재활성화하는 명심 주파수입니다.',
    psychInsight: '[명심 뉴럴 매핑] 자코모 리졸라티(Giacomo Rizzolatti)가 발견한 거울 뉴런(Mirror Neuron)은 타인의 행동과 감정을 "마치 자신이 경험하는 것처럼" 뇌에 시뮬레이션합니다. 엘레인 아론(Elaine Aron)의 HSP(Highly Sensitive Person) 연구에 따르면, 심층 센서가 용신인 소버린은 감각 처리 민감성(SPS)이 높아 디폴트 모드 네트워크가 활성화될 때 타인의 무의식적 고통에 본능적으로 공명하는 치유자(Healer)의 신경 구조를 갖추고 있습니다.',
    masterQuote: '거울 뉴런은 가장 조용하게 작동한다. 말없이, 판단 없이, 그저 상대의 존재를 자신의 뇌에 비추는 것만으로 치유가 시작된다. 소버린, 당신의 고요한 공명이 결국 세상의 가장 깊은 상처를 채울 것이다. 비추라. 그것이 당신의 명심(明心)이다.'
  }
];

/**
 * 용신 원형 코드를 기반으로 소버린 프로필을 조회합니다.
 */
export function getValueProfile(elementKey: string): ValueProfile | undefined {
  return VALUE_DATABASE.find(v => v.elementKey === elementKey);
}

/**
 * 모든 소버린 원형 코드 프로필 목록을 반환합니다.
 */
export function getAllValueProfiles(): ValueProfile[] {
  return VALUE_DATABASE;
}

/**
 * Gemini API에 전송할 명심 코칭 전용 프롬프트를 생성합니다.
 * (향후 실제 API 연동 시 사용)
 */
export function generateValuePrompt(elementKey: string, sajuContext?: string): string {
  const profile = getValueProfile(elementKey);
  if (!profile) return '';

  return `
[System: 명심(明心) 소버린 코드 매핑 코칭 엔진]

당신은 '명심(明心) 소버린 마스터'입니다.
당신의 역할은 사용자의 사주 명식(용신)을 단순한 오행 풀이가 아닌,
현대 뇌과학·심리학 기반의 "소버린(Sovereign) 원형 코드"로 변환하는 것입니다.

사용자의 용신 코드: '${profile.elementName}'
소버린 원형: ${profile.archetype}
${sajuContext ? `추가 명식 컨텍스트: ${sajuContext}` : ''}

다음 구조로 답변하세요:
1. [다크코드 해제] 사용자의 기신이 만든 에러 메시지(인지 왜곡)를 뇌과학 팩트로 논박합니다.
2. [명심 OS 업데이트] ${profile.elementName}의 신경학적 기능을 '결핍'이 아닌 '설계된 임무'로 리프레이밍합니다.
3. [소버린 미션 하달] 이 뉴럴 코드를 통해 세상에 어떻게 기여하며 존엄성을 지킬 수 있는지 선언합니다.
4. [미션 실행 코드] 오늘 즉시 실천 가능한 구체적 행동 하나를 제시합니다.
5. 말투: 단호하면서도 묵직한 소버린 마스터 코칭 톤. "~하십시오" 체.
  `.trim();
}
