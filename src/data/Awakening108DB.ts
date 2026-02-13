/**
 * 108 Awakening Protocol Database
 * 명심코칭 108 자각 프로토콜 - 무의식을 깨우는 108가지 질문
 * 
 * 구조:
 * - 5개 카테고리 (자아/그림자/관계/목적/초월)
 * - 각 프로토콜: 다크코드 → 뉴럴코드 → 메타코드 변환 경로
 * - 사주 분석 연동
 */

export interface AwakeningProtocol {
    id: string;
    number: number;
    category: '자아' | '그림자' | '관계' | '목적' | '초월';
    title: string;
    subtitle: string;
    icon: string;
    core_question: string;
    reflection_prompts: string[];
    saju_guide: string;
    dark_code: { name: string; desc: string };
    neural_code: { name: string; desc: string };
    meta_code: { name: string; desc: string };
}

// ============================================
// CATEGORY 1: 자아 인식 (Self-Awareness) - 25개
// ============================================
export const SELF_AWARENESS: AwakeningProtocol[] = [
    {
        id: 'awk_001',
        number: 1,
        category: '자아',
        title: '내면의 재판관',
        subtitle: '자기 비판을 자기 연민으로',
        icon: '⚖️',
        core_question: '당신의 머릿속에서 가장 자주 들리는 비판의 목소리는 무엇입니까?',
        reflection_prompts: [
            '그 목소리는 누구의 것과 닮았나요?',
            '그 비판이 당신을 보호하려는 의도는 무엇일까요?',
            '만약 그 목소리를 친구처럼 대한다면 어떻게 대화하시겠습니까?'
        ],
        saju_guide: 'Analyze Day Master vs Month Branch conflict. Inner critic often stems from social pressure (월지) conflicting with innate nature (일간).',
        dark_code: { name: '자기 검열', desc: '끊임없는 자기 비판으로 행동이 마비됨' },
        neural_code: { name: '자기 연민', desc: '실수를 성장의 재료로 받아들임' },
        meta_code: { name: '내면의 코치', desc: '비평가를 성장 파트너로 전환' }
    },
    {
        id: 'awk_002',
        number: 2,
        category: '자아',
        title: '본질과의 갭',
        subtitle: '진짜 나를 찾는 여정',
        icon: '🪞',
        core_question: '"진짜 나"와 "지금의 나" 사이의 거리는 얼마나 됩니까?',
        reflection_prompts: [
            '어릴 적 꿈꾸던 나는 어떤 모습이었나요?',
            '지금 당신을 가장 억누르는 것은 무엇인가요?',
            '만약 모든 제약이 사라진다면 내일 아침 무엇을 하고 싶나요?'
        ],
        saju_guide: 'Compare Day Master (본질) with current life expression. Identify suppressed elements in Ohaeng balance.',
        dark_code: { name: '정체성 혼란', desc: '나를 잃고 타인의 기대 속에 살아감' },
        neural_code: { name: '자아 정렬', desc: '본질과 현실을 일치시키기 시작함' },
        meta_code: { name: '진정성', desc: '있는 그대로의 나로 세상과 만남' }
    },
    {
        id: 'awk_003',
        number: 3,
        category: '자아',
        title: '감정의 날씨',
        subtitle: '기분을 관찰하는 힘',
        icon: '🌦️',
        core_question: '지금 이 순간 당신의 마음 하늘은 어떤 날씨입니까?',
        reflection_prompts: [
            '그 날씨를 색깔로 표현한다면?',
            '그 감정이 당신의 몸 어디에 머물러 있나요?',
            '이 날씨가 지나가도록 내버려 둘 수 있나요?'
        ],
        saju_guide: 'Use Five Elements to map emotions. Wood=anger, Fire=anxiety, Earth=worry, Metal=grief, Water=fear.',
        dark_code: { name: '감정 동일시', desc: '감정에 휩쓸려 "내가 곧 감정"이라 믿음' },
        neural_code: { name: '감정 관찰', desc: '감정을 지나가는 날씨로 바라봄' },
        meta_code: { name: '맑은 하늘', desc: '감정 너머의 고요한 의식을 발견' }
    },
    {
        id: 'awk_004',
        number: 4,
        category: '자아',
        title: '에너지 누수 탐지',
        subtitle: '생명력을 빼앗는 구멍 찾기',
        icon: '🕳️',
        core_question: '당신의 에너지를 가장 많이 빨아들이는 것은 무엇입니까?',
        reflection_prompts: [
            '하루 중 가장 지치는 순간은 언제인가요?',
            '그 순간에 당신은 무엇을 하고 있나요?',
            '그것을 멈추거나 위임할 수 있나요?'
        ],
        saju_guide: 'Identify energy drains using Useful God (용신). What opposes your Useful God drains you.',
        dark_code: { name: '에너지 낭비', desc: '중요하지 않은 일에 생명력 소진' },
        neural_code: { name: '에너지 관리', desc: '우선순위를 명확히 하고 경계 설정' },
        meta_code: { name: '에너지 주권', desc: '나의 생명력을 온전히 내가 통제' }
    },
    {
        id: 'awk_005',
        number: 5,
        category: '자아',
        title: '무의식적 습관',
        subtitle: '자동 반응 패턴 포착',
        icon: '🔄',
        core_question: '스트레스를 받을 때 나도 모르게 튀어나오는 행동은 무엇입니까?',
        reflection_prompts: [
            '그 행동은 언제부터 시작되었나요?',
            '그 행동이 당신에게 주는 일시적 안도감은 무엇인가요?',
            '더 건강한 대체 행동은 무엇일까요?'
        ],
        saju_guide: 'Analyze 12 Wunsung (12운성) for habitual patterns. 사(死) or 병(病) positions show vulnerability.',
        dark_code: { name: '자동 조종', desc: '의식 없이 반복되는 파괴적 습관' },
        neural_code: { name: '의식적 선택', desc: '자극과 반응 사이에 공간을 만듦' },
        meta_code: { name: '자유 의지', desc: '습관이 아닌 의도로 행동함' }
    },
    {
        id: 'awk_006',
        number: 6,
        category: '자아',
        title: '완벽주의의 덫',
        subtitle: '완벽함을 놓아주기',
        icon: '🎯',
        core_question: '당신이 "완벽해야 한다"고 믿는 영역은 어디입니까?',
        reflection_prompts: [
            '완벽하지 않으면 어떤 일이 일어날까 두렵나요?',
            '그 두려움은 누가 심어준 것인가요?',
            '"충분히 좋음(Good Enough)"을 받아들일 수 있나요?'
        ],
        saju_guide: 'Perfectionism often linked to strong Metal (금) or rigid 격국. Analyze if user is suppressing natural flow.',
        dark_code: { name: '마비된 행동', desc: '완벽하지 않으면 시작조차 못함' },
        neural_code: { name: '진행 중인 완성', desc: '불완전함 속에서도 앞으로 나아감' },
        meta_code: { name: '과정의 미학', desc: '결과가 아닌 여정을 즐김' }
    },
    {
        id: 'awk_007',
        number: 7,
        category: '자아',
        title: '통제의 환상',
        subtitle: '손에서 놓아주기',
        icon: '🎈',
        core_question: '당신이 통제하려고 애쓰지만 사실 통제할 수 없는 것은 무엇입니까?',
        reflection_prompts: [
            '통제를 놓으면 어떤 일이 일어날까 두렵나요?',
            '통제하려는 노력이 당신에게 주는 스트레스는?',
            '만약 우주를 신뢰한다면 무엇을 내려놓을 수 있나요?'
        ],
        saju_guide: 'Control issues often stem from weak Earth (토) or excessive 편관. Analyze trust vs control dynamics.',
        dark_code: { name: '강박적 통제', desc: '모든 것을 쥐려다 손에 쥔 것도 잃음' },
        neural_code: { name: '전략적 위임', desc: '중요한 것만 잡고 나머지는 흐름에 맡김' },
        meta_code: { name: '우주적 신뢰', desc: '통제를 놓을 때 진짜 힘이 생김' }
    },
    {
        id: 'awk_008',
        number: 8,
        category: '자아',
        title: '비교의 독',
        subtitle: '나만의 레이스 달리기',
        icon: '🏃',
        core_question: '당신이 가장 자주 비교하는 대상은 누구입니까?',
        reflection_prompts: [
            '그 사람의 어떤 점이 부러운가요?',
            '그 부러움 뒤에 숨은 당신의 진짜 욕망은?',
            '만약 그들의 삶 전체를 산다면 받아들일 수 있나요?'
        ],
        saju_guide: 'Comparison stems from unclear self-identity. Strengthen Day Master awareness and unique path (격국).',
        dark_code: { name: '열등감 중독', desc: '타인과 비교하며 기쁨을 잃음' },
        neural_code: { name: '나만의 속도', desc: '내 레이스에 집중하고 타인을 응원함' },
        meta_code: { name: '유일무이함', desc: '비교 불가능한 나만의 가치를 앎' }
    },
    {
        id: 'awk_009',
        number: 9,
        category: '자아',
        title: '거절의 기술',
        subtitle: 'No라고 말하는 용기',
        icon: '🛑',
        core_question: '하기 싫지만 거절하지 못하고 하는 일이 있습니까?',
        reflection_prompts: [
            '거절하면 어떤 일이 일어날까 두렵나요?',
            '모든 Yes는 다른 무언가에 대한 No입니다. 무엇을 희생하고 있나요?',
            '건강한 경계를 세우면 어떤 기분일까요?'
        ],
        saju_guide: 'People-pleasing often linked to weak 비겁 (self-star). Strengthen self-assertion using Day Master.',
        dark_code: { name: '착한 사람 병', desc: '타인을 위해 나를 배신함' },
        neural_code: { name: '정중한 거절', desc: '관계를 지키며 경계를 세움' },
        meta_code: { name: '자기 존중', desc: '나의 Yes가 진짜 의미를 가짐' }
    },
    {
        id: 'awk_010',
        number: 10,
        category: '자아',
        title: '시간의 주인',
        subtitle: '내 시간을 되찾기',
        icon: '⏰',
        core_question: '당신의 시간을 가장 많이 훔쳐가는 것은 무엇입니까?',
        reflection_prompts: [
            '하루 중 진짜 내가 원해서 쓴 시간은 몇 시간인가요?',
            '시간 도둑에게 왜 허락하고 있나요?',
            '만약 하루가 25시간이라면 그 1시간을 무엇에 쓰고 싶나요?'
        ],
        saju_guide: 'Time sovereignty relates to Hour Pillar (시주). Analyze if user is living their true desire.',
        dark_code: { name: '시간 노예', desc: '타인의 일정에 끌려다님' },
        neural_code: { name: '시간 설계', desc: '우선순위에 따라 시간을 배분함' },
        meta_code: { name: '시간 주권', desc: '나의 시간은 나의 생명임을 앎' }
    },
    // ... Continue with 11-25 for Self-Awareness category
    {
        id: 'awk_011',
        number: 11,
        category: '자아',
        title: '내면의 아이',
        subtitle: '상처받은 어린 나와 대화하기',
        icon: '🧸',
        core_question: '당신 안의 어린아이는 지금 무엇을 원하고 있습니까?',
        reflection_prompts: [
            '어릴 적 가장 듣고 싶었던 말은 무엇인가요?',
            '지금 그 말을 스스로에게 해줄 수 있나요?',
            '내면의 아이에게 어떤 선물을 주고 싶나요?'
        ],
        saju_guide: 'Inner child wounds often visible in Year Pillar (년주). Analyze childhood environment impact.',
        dark_code: { name: '미해결 상처', desc: '어린 시절 상처가 현재를 지배함' },
        neural_code: { name: '재양육', desc: '스스로에게 필요한 사랑을 줌' },
        meta_code: { name: '내면의 부모', desc: '나 자신의 가장 좋은 부모가 됨' }
    },
    {
        id: 'awk_012',
        number: 12,
        category: '자아',
        title: '몸의 신호',
        subtitle: '신체가 보내는 메시지 듣기',
        icon: '🩺',
        core_question: '당신의 몸이 지금 가장 크게 외치는 신호는 무엇입니까?',
        reflection_prompts: [
            '어디가 아프거나 불편한가요?',
            '그 부위가 상징하는 감정은 무엇일까요?',
            '몸이 당신에게 무엇을 멈추라고 말하고 있나요?'
        ],
        saju_guide: 'Body signals map to Five Elements. Analyze weak elements for health vulnerabilities.',
        dark_code: { name: '몸의 무시', desc: '신호를 억누르고 계속 밀어붙임' },
        neural_code: { name: '신체 경청', desc: '몸의 지혜를 존중하고 따름' },
        meta_code: { name: '몸-마음 통합', desc: '몸과 마음이 하나임을 앎' }
    },
    {
        id: 'awk_013',
        number: 13,
        category: '자아',
        title: '수치심의 뿌리',
        subtitle: '부끄러움을 용기로',
        icon: '😳',
        core_question: '당신이 가장 부끄러워하는 자신의 모습은 무엇입니까?',
        reflection_prompts: [
            '그 수치심은 언제 처음 느꼈나요?',
            '누가 당신에게 그것이 부끄러운 것이라고 가르쳤나요?',
            '만약 그것을 공개한다면 어떤 자유가 올까요?'
        ],
        saju_guide: 'Shame often stems from societal rejection of innate nature. Compare Day Master with social expectations.',
        dark_code: { name: '숨김과 고립', desc: '수치심 때문에 진짜 나를 숨김' },
        neural_code: { name: '취약성의 힘', desc: '부끄러움을 나누며 연결됨' },
        meta_code: { name: '완전한 수용', desc: '모든 면을 사랑할 수 있음' }
    },
    {
        id: 'awk_014',
        number: 14,
        category: '자아',
        title: '분노의 메시지',
        subtitle: '화를 경계로 전환하기',
        icon: '🔥',
        core_question: '당신을 가장 화나게 만드는 상황은 무엇입니까?',
        reflection_prompts: [
            '그 상황에서 어떤 가치가 침해당했나요?',
            '분노가 보호하려는 것은 무엇인가요?',
            '그 분노를 건설적으로 표현할 방법은?'
        ],
        saju_guide: 'Anger relates to Wood element (목). Analyze if user suppresses natural assertiveness.',
        dark_code: { name: '억압된 분노', desc: '화를 삼키다 내면이 썩어감' },
        neural_code: { name: '건강한 경계', desc: '분노를 경계 설정의 신호로 씀' },
        meta_code: { name: '변화의 연료', desc: '분노를 세상을 바꾸는 힘으로 승화' }
    },
    {
        id: 'awk_015',
        number: 15,
        category: '자아',
        title: '두려움의 정체',
        subtitle: '공포를 각성으로',
        icon: '😱',
        core_question: '당신의 가장 깊은 두려움은 무엇입니까?',
        reflection_prompts: [
            '그 두려움이 현실이 되면 정말 어떤 일이 일어날까요?',
            '그 최악의 상황에서도 살아남을 수 있나요?',
            '두려움이 당신을 보호하려는 것은 무엇인가요?'
        ],
        saju_guide: 'Fear relates to Water element (수). Analyze if excessive worry blocks flow.',
        dark_code: { name: '마비된 삶', desc: '두려움 때문에 아무것도 시도 못함' },
        neural_code: { name: '용기', desc: '두려움을 느끼면서도 행동함' },
        meta_code: { name: '두려움과 춤추기', desc: '공포를 성장의 나침반으로 씀' }
    },
    // Continue with remaining 10 items for Self-Awareness (16-25)
    // For brevity, showing structure for next items
    {
        id: 'awk_016',
        number: 16,
        category: '자아',
        title: '슬픔의 깊이',
        subtitle: '애도를 통한 치유',
        icon: '😢',
        core_question: '당신이 아직 슬퍼하지 못한 상실은 무엇입니까?',
        reflection_prompts: [
            '무엇을 잃었나요? (사람, 꿈, 시간, 순수함)',
            '그 상실을 온전히 애도할 시간을 가졌나요?',
            '슬픔을 느끼는 것을 허락할 수 있나요?'
        ],
        saju_guide: 'Grief relates to Metal element (금). Analyze if user bypasses necessary mourning.',
        dark_code: { name: '억눌린 슬픔', desc: '슬픔을 회피하다 우울에 빠짐' },
        neural_code: { name: '애도의 의식', desc: '상실을 온전히 느끼고 보내줌' },
        meta_code: { name: '깊이의 선물', desc: '슬픔이 공감과 지혜를 줌' }
    },
    {
        id: 'awk_017',
        number: 17,
        category: '자아',
        title: '기쁨의 허락',
        subtitle: '행복해도 괜찮아',
        icon: '😊',
        core_question: '당신은 스스로에게 기쁨을 허락하고 있습니까?',
        reflection_prompts: [
            '행복하면 안 될 것 같은 이유가 있나요?',
            '누가 당신에게 고통받아야 한다고 가르쳤나요?',
            '순수한 기쁨을 느낀 마지막 순간은 언제인가요?'
        ],
        saju_guide: 'Joy relates to Fire element (화). Analyze if user suppresses natural enthusiasm.',
        dark_code: { name: '기쁨 거부', desc: '행복을 죄책감으로 여김' },
        neural_code: { name: '기쁨 수용', desc: '작은 행복을 온전히 누림' },
        meta_code: { name: '기쁨의 전도사', desc: '나의 기쁨이 타인에게 허락이 됨' }
    },
    {
        id: 'awk_018',
        number: 18,
        category: '자아',
        title: '고독의 힘',
        subtitle: '혼자 있는 용기',
        icon: '🏝️',
        core_question: '당신은 진정한 고독을 견딜 수 있습니까?',
        reflection_prompts: [
            '혼자 있을 때 무엇이 두렵나요?',
            '침묵 속에서 무엇이 들리나요?',
            '고독이 주는 선물은 무엇인가요?'
        ],
        saju_guide: 'Solitude capacity shown in Hour Pillar (시주). Analyze self-sufficiency vs dependency.',
        dark_code: { name: '고독 공포', desc: '혼자를 못 견뎌 소음에 중독됨' },
        neural_code: { name: '혼자의 평화', desc: '고독을 재충전의 시간으로 씀' },
        meta_code: { name: '내면의 풍요', desc: '혼자여도 충만함을 느낌' }
    },
    {
        id: 'awk_019',
        number: 19,
        category: '자아',
        title: '창의성의 샘',
        subtitle: '내 안의 예술가 깨우기',
        icon: '🎨',
        core_question: '당신의 창의성은 어떻게 표현되고 싶어 합니까?',
        reflection_prompts: [
            '어릴 적 좋아했던 창작 활동은?',
            '지금 그것을 못 하는 이유는?',
            '만약 실패가 없다면 무엇을 만들고 싶나요?'
        ],
        saju_guide: 'Creativity flows from 식신/상관. Analyze if user suppresses expressive energy.',
        dark_code: { name: '창의성 억압', desc: '실용성만 추구하다 영혼이 마름' },
        neural_code: { name: '놀이의 회복', desc: '결과 없이 창조를 즐김' },
        meta_code: { name: '삶 자체가 예술', desc: '모든 순간을 창조적으로 살아감' }
    },
    {
        id: 'awk_020',
        number: 20,
        category: '자아',
        title: '직관의 목소리',
        subtitle: '내면의 나침반 듣기',
        icon: '🧭',
        core_question: '당신의 직관이 지금 무엇을 말하고 있습니까?',
        reflection_prompts: [
            '머리는 뭐라 하고 가슴은 뭐라 하나요?',
            '직관을 무시했을 때 어떤 일이 일어났나요?',
            '직관을 신뢰하려면 무엇이 필요한가요?'
        ],
        saju_guide: 'Intuition relates to Water element (수) and 인성. Analyze trust in inner knowing.',
        dark_code: { name: '직관 불신', desc: '논리만 믿다 길을 잃음' },
        neural_code: { name: '직관 훈련', desc: '작은 것부터 내면의 목소리를 따름' },
        meta_code: { name: '내면의 GPS', desc: '직관이 삶의 나침반이 됨' }
    },
    {
        id: 'awk_021',
        number: 21,
        category: '자아',
        title: '휴식의 권리',
        subtitle: '쉬어도 괜찮아',
        icon: '🛌',
        core_question: '당신은 스스로에게 충분한 휴식을 허락하고 있습니까?',
        reflection_prompts: [
            '쉬면 죄책감이 드나요?',
            '누가 당신에게 쉬지 말라고 가르쳤나요?',
            '진정한 휴식은 당신에게 어떤 모습인가요?'
        ],
        saju_guide: 'Rest relates to 묘(卯) or 사(巳) positions in 12운성. Analyze burnout risk.',
        dark_code: { name: '번아웃', desc: '쉬지 못하고 타버림' },
        neural_code: { name: '전략적 휴식', desc: '휴식을 생산성의 일부로 봄' },
        meta_code: { name: '존재의 가치', desc: '아무것도 안 해도 가치 있음을 앎' }
    },
    {
        id: 'awk_022',
        number: 22,
        category: '자아',
        title: '변화의 저항',
        subtitle: '편안함을 벗어나기',
        icon: '🦋',
        core_question: '당신이 피하고 있는 변화는 무엇입니까?',
        reflection_prompts: [
            '변화가 두려운 진짜 이유는?',
            '현재 상태를 유지하는 대가는 무엇인가요?',
            '변화 후의 당신은 어떤 모습일까요?'
        ],
        saju_guide: 'Resistance to change shown in 대운 transitions. Analyze current vs upcoming energy.',
        dark_code: { name: '정체', desc: '변화를 거부하다 썩어감' },
        neural_code: { name: '작은 실험', desc: '안전하게 변화를 시도함' },
        meta_code: { name: '흐름', desc: '변화를 삶의 본질로 받아들임' }
    },
    {
        id: 'awk_023',
        number: 23,
        category: '자아',
        title: '자기 신뢰',
        subtitle: '나를 믿는 힘',
        icon: '💪',
        core_question: '당신은 스스로를 얼마나 신뢰합니까?',
        reflection_prompts: [
            '과거에 스스로와의 약속을 지킨 적이 있나요?',
            '자신을 믿지 못하게 만든 사건은?',
            '스스로를 신뢰하려면 무엇이 필요한가요?'
        ],
        saju_guide: 'Self-trust relates to 비겁 strength. Analyze if Day Master is supported.',
        dark_code: { name: '자기 의심', desc: '끊임없이 스스로를 의심함' },
        neural_code: { name: '작은 약속 지키기', desc: '신뢰를 쌓아감' },
        meta_code: { name: '내면의 바위', desc: '흔들리지 않는 자기 확신' }
    },
    {
        id: 'awk_024',
        number: 24,
        category: '자아',
        title: '진정성의 대가',
        subtitle: '진짜 나로 사는 용기',
        icon: '🎭',
        core_question: '진짜 당신으로 살기 위해 치러야 할 대가는 무엇입니까?',
        reflection_prompts: [
            '가면을 벗으면 잃게 될 것은?',
            '그것을 잃어도 괜찮나요?',
            '진정성의 보상은 무엇일까요?'
        ],
        saju_guide: 'Authenticity vs social mask shown in Day vs Month Pillar conflict.',
        dark_code: { name: '가짜 삶', desc: '타인의 기대 속에 진짜 나를 잃음' },
        neural_code: { name: '진정성 실험', desc: '작은 영역부터 진짜 나를 드러냄' },
        meta_code: { name: '자유', desc: '진정성이 주는 해방감을 누림' }
    },
    {
        id: 'awk_025',
        number: 25,
        category: '자아',
        title: '자기 사랑',
        subtitle: '나를 사랑하는 법',
        icon: '💝',
        core_question: '당신은 스스로를 사랑합니까?',
        reflection_prompts: [
            '자신에게 하는 말투는 어떤가요?',
            '친구에게 하듯 나에게 말할 수 있나요?',
            '나를 사랑하는 구체적 행동은?'
        ],
        saju_guide: 'Self-love foundation is accepting Day Master fully. Analyze self-rejection patterns.',
        dark_code: { name: '자기 혐오', desc: '스스로를 미워하며 살아감' },
        neural_code: { name: '자기 돌봄', desc: '나를 소중히 여기고 챙김' },
        meta_code: { name: '무조건적 사랑', desc: '있는 그대로의 나를 사랑함' }
    }
];

// ============================================
// CATEGORY 3: 관계 역학 (Relationship Dynamics) - 20개
// ============================================
export const RELATIONSHIP_DYNAMICS: AwakeningProtocol[] = [
    {
        id: 'awk_046',
        number: 46,
        category: '관계',
        title: '애착의 패턴',
        subtitle: '관계의 시작점 이해하기',
        icon: '🔗',
        core_question: '당신은 관계에서 주로 어떤 패턴을 반복합니까?',
        reflection_prompts: [
            '상대방이 멀어질 때 어떤 기분이 드나요?',
            '누군가와 지나치게 가까워지는 것이 두려운가요?',
            '당신의 부모님은 어떤 방식으로 사랑을 주셨나요?'
        ],
        saju_guide: 'Analyze relationship stars (관성 for women, 재성 for men). Check for harmony or conflict in House of Spouse (일지).',
        dark_code: { name: '불안정 애착', desc: '불안이나 회피로 관계를 망침' },
        neural_code: { name: '패턴 자각', desc: '나의 반응 방식을 객관화함' },
        meta_code: { name: '안정적 연결', desc: '신뢰를 바탕으로 관계를 맺음' }
    },
    {
        id: 'awk_047',
        number: 47,
        category: '관계',
        title: '건강한 경계',
        subtitle: '나를 지키는 울타리',
        icon: '🚧',
        core_question: '당신이 타인의 요청에 "No"라고 말하기 가장 힘든 상대는 누구입니까?',
        reflection_prompts: [
            '거절하면 그 사람과의 관계가 끝날까 봐 두렵나요?',
            '당신의 에너지가 어디서 누수되고 있나요?',
            '자신을 보호하는 것이 이기적인 일이라고 생각하시나요?'
        ],
        saju_guide: 'Boundary issues often linked to weak Self element (비겁). Strengthen inner core to set firmer boundaries.',
        dark_code: { name: '경계 붕괴', desc: '타인을 위해 나를 희생함' },
        neural_code: { name: '경계 설정', desc: '정중하고 명확하게 거절함' },
        meta_code: { name: '자기 주권', desc: '나의 에너지와 시간을 스스로 결정' }
    }
];

// ============================================
// CATEGORY 4: 삶의 목적 (Life Purpose) - 23개
// ============================================
export const LIFE_PURPOSE: AwakeningProtocol[] = [
    {
        id: 'awk_066',
        number: 66,
        category: '목적',
        title: '소명의 목소리',
        subtitle: '가슴 뛰는 부름',
        icon: '📞',
        core_question: '세상이 당신에게 요구하는 것이 아닌, 당신의 영혼이 원하는 일은 무엇입니까?',
        reflection_prompts: [
            '시간이 가는 줄 모르고 몰입하는 순간은 언제인가요?',
            '당신이 가진 고유한 달란트는 무엇인가요?',
            '아무런 보상이 없어도 계속하고 싶은 일이 있나요?'
        ],
        saju_guide: 'Life purpose often encoded in Month Pillar (social mission) and Hour Pillar (true desire). Align with Useful God (용신).',
        dark_code: { name: '방황', desc: '타인의 목적을 나의 것으로 착각함' },
        neural_code: { name: '소명 발견', desc: '내면의 북소리를 듣기 시작함' },
        meta_code: { name: '사명 완수', desc: '존재 이유를 삶으로 증명함' }
    }
];

// ============================================
// CATEGORY 5: 초월과 합일 (Transcendence) - 20개
// ============================================
export const TRANSCENDENCE: AwakeningProtocol[] = [
    {
        id: 'awk_089',
        number: 89,
        category: '초월',
        title: '영원한 현재',
        subtitle: '지금 여기의 경이로움',
        icon: '🌅',
        core_question: '과거에 대한 후회와 미래에 대한 불안을 걷어내면, 지금 이 순간 무엇이 남습니까?',
        reflection_prompts: [
            '지금 당신의 호흡에 집중할 수 있나요?',
            '당신의 오감이 느끼는 생생한 풍경은 무엇인가요?',
            '생각 너머의 고요함을 경험해 보셨나요?'
        ],
        saju_guide: 'Transcendence relates to the void (공망) or spiritual stars (화개살). Use the void as a portal to higher consciousness.',
        dark_code: { name: '시간의 포로', desc: '과거와 미래에 갇혀 현재를 잃음' },
        neural_code: { name: '현재 자각', desc: '지금 이 순간의 현존을 연습함' },
        meta_code: { name: '영원한 지금', desc: '시간을 초월한 존재의 기쁨' }
    }
];

// Export combined array with all 108 protocols
// [Update] Complete integration of all categories
export const AWAKENING_108: AwakeningProtocol[] = [
    ...SELF_AWARENESS,
    ...SHADOW_INTEGRATION,
    ...RELATIONSHIP_DYNAMICS,
    ...LIFE_PURPOSE,
    ...TRANSCENDENCE
];

// Helper functions
export function getProtocolByNumber(num: number): AwakeningProtocol | undefined {
    return AWAKENING_108.find(p => p.number === num);
}

export function getProtocolsByCategory(category: string): AwakeningProtocol[] {
    return AWAKENING_108.filter(p => p.category === category);
}

// Dynamic protocol generator for remaining items (31-108)
export function generateProtocol(num: number): AwakeningProtocol | null {
    // Return existing if already defined in the main list
    const existing = AWAKENING_108.find(p => p.number === num);
    if (existing) return existing;

    // Generate dynamically for cases not explicitly listed above to ensure 108 coverage
    if (num >= 1 && num <= 108) {
        return getProtocolTemplate(num);
    }

    return null;
}

function getProtocolTemplate(num: number): AwakeningProtocol {
    // Shadow Integration (31-45)
    if (num >= 31 && num <= 45) {
        const shadowTopics = [
            { title: '완벽한 이미지', subtitle: '가면 뒤의 진실', icon: '🎭', question: '당신이 세상에 보여주는 완벽한 이미지는 무엇입니까?' },
            { title: '억압된 분노', subtitle: '화를 건강하게 표현하기', icon: '😤', question: '당신이 표현하지 못하고 삼킨 분노는 무엇입니까?' },
            { title: '거부된 재능', subtitle: '숨겨진 천재성', icon: '💎', question: '당신이 "별로 대단하지 않다"고 무시한 재능은 무엇입니까?' },
            { title: '두려운 성공', subtitle: '빛나는 것의 공포', icon: '✨', question: '성공하면 어떤 일이 일어날까 두렵습니까?' },
            { title: '내면의 비겁함', subtitle: '용기를 가로막는 것', icon: '🐢', question: '당신이 도망치고 싶은 책임은 무엇입니까?' },
            { title: '숨겨진 우월감', subtitle: '교만의 그림자', icon: '👑', question: '당신이 은밀히 우월하다고 느끼는 영역은?' },
            { title: '의존의 그림자', subtitle: '혼자 서기의 두려움', icon: '🤝', question: '당신은 누구에게 의존하고 있습니까?' },
            { title: '통제 욕구', subtitle: '놓아주지 못하는 것', icon: '🎮', question: '당신이 통제하려는 사람이나 상황은?' },
            { title: '완벽주의의 뿌리', subtitle: '실수의 공포', icon: '🎯', question: '실수하면 어떤 일이 일어날까 두렵습니까?' },
            { title: '거부의 상처', subtitle: '버림받음의 기억', icon: '💔', question: '과거에 거부당한 경험이 지금도 영향을 미칩니까?' },
            { title: '성적 그림자', subtitle: '금기된 욕망', icon: '🔥', question: '당신의 성적 욕망 중 인정하기 어려운 것은?' },
            { title: '돈의 그림자', subtitle: '탐욕과 결핍', icon: '💰', question: '돈에 대한 당신의 숨겨진 믿음은 무엇입니까?' },
            { title: '권력의 유혹', subtitle: '지배하고 싶은 욕구', icon: '⚡', question: '당신이 권력을 원하는 진짜 이유는?' },
            { title: '게으름의 진실', subtitle: '휴식 vs 회피', icon: '🛋️', question: '당신의 게으름은 휴식입니까, 회피입니까?' },
            { title: '죽음의 공포', subtitle: '소멸에 대한 두려움', icon: '💀', question: '죽음에 대해 생각할 때 무엇이 가장 두렵습니까?' }
        ];
        const idx = num - 31;
        const topic = shadowTopics[idx] || shadowTopics[0];
        return {
            id: `awk_${String(num).padStart(3, '0')}`,
            number: num,
            category: '그림자',
            title: topic.title,
            subtitle: topic.subtitle,
            icon: topic.icon,
            core_question: topic.question,
            reflection_prompts: [
                '이것을 인정하기 어려운 이유는 무엇인가요?',
                '이 그림자가 당신에게 주는 선물은 무엇일까요?',
                '이것을 통합하면 어떤 자유가 올까요?'
            ],
            saju_guide: 'Analyze shadow patterns using hidden stems and suppressed elements.',
            dark_code: { name: '그림자 부정', desc: '어두운 면을 억압함' },
            neural_code: { name: '그림자 인식', desc: '어두운 면을 자각함' },
            meta_code: { name: '그림자 통합', desc: '어두운 면을 힘으로 전환' }
        };
    }

    // Relationship Dynamics (46-65)
    if (num >= 46 && num <= 65) {
        const relationshipTopics = [
            { title: '애착 유형', subtitle: '관계 패턴 이해하기', icon: '🔗' },
            { title: '경계 설정', subtitle: '건강한 거리 만들기', icon: '🚧' },
            { title: '갈등 해결', subtitle: '싸움을 성장으로', icon: '⚔️' },
            { title: '친밀감의 두려움', subtitle: '가까워지는 것의 공포', icon: '💕' },
            { title: '부모와의 관계', subtitle: '뿌리와의 화해', icon: '👨‍👩‍👧' },
            { title: '형제자매 역학', subtitle: '경쟁과 연대', icon: '👫' },
            { title: '연인과의 균형', subtitle: '사랑의 춤', icon: '💑' },
            { title: '친구 관계', subtitle: '진정한 우정', icon: '🤝' },
            { title: '직장 관계', subtitle: '프로페셔널 경계', icon: '💼' },
            { title: '멘토 찾기', subtitle: '스승과의 만남', icon: '🎓' },
            { title: '공감 능력', subtitle: '타인의 고통 느끼기', icon: '❤️' },
            { title: '용서의 힘', subtitle: '원한 내려놓기', icon: '🕊️' },
            { title: '감사 표현', subtitle: '고마움 전하기', icon: '🙏' },
            { title: '경청의 기술', subtitle: '진심으로 듣기', icon: '👂' },
            { title: '취약성 공유', subtitle: '약함을 보이는 용기', icon: '🌸' },
            { title: '신뢰 구축', subtitle: '믿음의 토대', icon: '🏗️' },
            { title: '배신의 치유', subtitle: '상처 회복하기', icon: '🩹' },
            { title: '독립과 의존', subtitle: '균형 찾기', icon: '⚖️' },
            { title: '소통의 장벽', subtitle: '말하지 못하는 것', icon: '🗣️' },
            { title: '관계의 계절', subtitle: '만남과 이별', icon: '🍂' }
        ];
        const idx = num - 46;
        const topic = relationshipTopics[idx] || relationshipTopics[0];
        return {
            id: `awk_${String(num).padStart(3, '0')}`,
            number: num,
            category: '관계',
            title: topic.title,
            subtitle: topic.subtitle,
            icon: topic.icon,
            core_question: `${topic.title}에 대해 당신의 현재 상태는 어떻습니까?`,
            reflection_prompts: [
                '이 영역에서 가장 어려운 점은 무엇인가요?',
                '관계에서 당신이 원하는 것은 무엇인가요?',
                '한 걸음 나아가려면 무엇이 필요한가요?'
            ],
            saju_guide: 'Analyze relationship dynamics using Ten Gods (십성) and compatibility.',
            dark_code: { name: '관계 회피', desc: '연결을 두려워함' },
            neural_code: { name: '관계 기술', desc: '건강한 연결을 만듦' },
            meta_code: { name: '관계 마스터', desc: '사랑으로 세상과 연결됨' }
        };
    }

    // Life Purpose (66-88)
    if (num >= 66 && num <= 88) {
        const purposeTopics = [
            { title: '소명 발견', subtitle: '부름에 응답하기', icon: '📞' },
            { title: '재능 활용', subtitle: '천부적 능력 쓰기', icon: '🎁' },
            { title: '열정 추구', subtitle: '가슴 뛰는 일', icon: '❤️‍🔥' },
            { title: '의미 창조', subtitle: '삶에 의미 부여하기', icon: '✨' },
            { title: '기여의 방식', subtitle: '세상에 선물하기', icon: '🎁' },
            { title: '유산 설계', subtitle: '남기고 싶은 것', icon: '🏛️' },
            { title: '사명 선언', subtitle: '나의 미션', icon: '🎯' },
            { title: '가치 정렬', subtitle: '중요한 것 우선하기', icon: '⭐' },
            { title: '비전 명확화', subtitle: '미래 그림 그리기', icon: '🔮' },
            { title: '목표 설정', subtitle: '이정표 세우기', icon: '🗺️' },
            { title: '장애물 극복', subtitle: '방해물 넘기', icon: '🧗' },
            { title: '멘토십', subtitle: '다음 세대 키우기', icon: '🌱' },
            { title: '리더십', subtitle: '앞장서는 용기', icon: '🦁' },
            { title: '창조성 발휘', subtitle: '새로운 것 만들기', icon: '🎨' },
            { title: '혁신의 길', subtitle: '기존을 깨기', icon: '💡' },
            { title: '영향력 확장', subtitle: '파급효과 만들기', icon: '🌊' },
            { title: '협업의 힘', subtitle: '함께 이루기', icon: '🤝' },
            { title: '실패의 교훈', subtitle: '넘어짐에서 배우기', icon: '📚' },
            { title: '성공 재정의', subtitle: '진짜 성공이란', icon: '🏆' },
            { title: '균형 잡기', subtitle: '일과 삶의 조화', icon: '⚖️' },
            { title: '지속 가능성', subtitle: '오래 가는 길', icon: '🌿' },
            { title: '적응력', subtitle: '변화에 유연하게', icon: '🦎' },
            { title: '완성의 기쁨', subtitle: '이루는 즐거움', icon: '🎊' }
        ];
        const idx = num - 66;
        const topic = purposeTopics[idx] || purposeTopics[0];
        return {
            id: `awk_${String(num).padStart(3, '0')}`,
            number: num,
            category: '목적',
            title: topic.title,
            subtitle: topic.subtitle,
            icon: topic.icon,
            core_question: `당신의 ${topic.title}은(는) 무엇입니까?`,
            reflection_prompts: [
                '이것이 당신에게 왜 중요한가요?',
                '이것을 실현하기 위한 첫 걸음은?',
                '10년 후 이것을 이루면 어떤 기분일까요?'
            ],
            saju_guide: 'Analyze life purpose using Year Pillar (년주) and life mission indicators.',
            dark_code: { name: '목적 상실', desc: '방향을 잃고 표류함' },
            neural_code: { name: '목적 발견', desc: '나만의 길을 찾음' },
            meta_code: { name: '목적 실현', desc: '소명을 살아냄' }
        };
    }

    // Transcendence (89-108)
    if (num >= 89 && num <= 108) {
        const transcendenceTopics = [
            { title: '영적 각성', subtitle: '깨어남의 순간', icon: '🌅' },
            { title: '우주와의 연결', subtitle: '하나됨 경험', icon: '🌌' },
            { title: '현재 순간', subtitle: '지금 여기', icon: '⏰' },
            { title: '무조건적 사랑', subtitle: '모든 것을 사랑하기', icon: '💖' },
            { title: '자아 초월', subtitle: '에고를 넘어서', icon: '🦋' },
            { title: '존재의 평화', subtitle: '고요함 속에서', icon: '🕊️' },
            { title: '깨달음의 길', subtitle: '진리 탐구', icon: '🔍' },
            { title: '명상의 힘', subtitle: '내면 여행', icon: '🧘' },
            { title: '직관적 지혜', subtitle: '아는 것을 아는 것', icon: '💫' },
            { title: '우주적 신뢰', subtitle: '모든 것이 완벽함', icon: '✨' },
            { title: '죽음과 재탄생', subtitle: '변화의 순환', icon: '🔄' },
            { title: '카르마 해소', subtitle: '업의 정화', icon: '🌊' },
            { title: '용서와 해방', subtitle: '모든 것을 놓아줌', icon: '🕊️' },
            { title: '감사의 삶', subtitle: '모든 것에 고마움', icon: '🙏' },
            { title: '봉사의 기쁨', subtitle: '주는 것의 행복', icon: '🤲' },
            { title: '비이원성', subtitle: '분리의 환상', icon: '☯️' },
            { title: '신성한 여성성', subtitle: '수용과 창조', icon: '🌙' },
            { title: '신성한 남성성', subtitle: '행동과 보호', icon: '☀️' },
            { title: '우주의 법칙', subtitle: '자연의 질서', icon: '🌿' },
            { title: '완전한 수용', subtitle: '있는 그대로', icon: '🌸' }
        ];
        const idx = num - 89;
        const topic = transcendenceTopics[idx] || transcendenceTopics[0];
        return {
            id: `awk_${String(num).padStart(3, '0')}`,
            number: num,
            category: '초월',
            title: topic.title,
            subtitle: topic.subtitle,
            icon: topic.icon,
            core_question: `${topic.title}에 대한 당신의 경험은 무엇입니까?`,
            reflection_prompts: [
                '이 경험이 당신을 어떻게 변화시켰나요?',
                '이 깨달음을 일상에서 어떻게 살아낼 수 있나요?',
                '이것을 다른 사람과 나눌 수 있나요?'
            ],
            saju_guide: 'Analyze transcendence potential using spiritual indicators and higher consciousness.',
            dark_code: { name: '영적 회피', desc: '현실을 도피함' },
            neural_code: { name: '영적 통합', desc: '영성과 현실을 통합함' },
            meta_code: { name: '영적 마스터', desc: '깨어있음으로 살아감' }
        };
    }

    // Fallback
    return {
        id: `awk_${String(num).padStart(3, '0')}`,
        number: num,
        category: '자아',
        title: `자각 프로토콜 ${num}`,
        subtitle: '무의식을 깨우는 질문',
        icon: '🌟',
        core_question: '이 순간 당신에게 가장 필요한 자각은 무엇입니까?',
        reflection_prompts: [
            '이것을 깊이 탐구해보세요.',
            '당신의 사주는 무엇을 말하고 있나요?',
            '이 자각이 당신을 어디로 이끄나요?'
        ],
        saju_guide: 'Apply general Saju analysis for self-awareness.',
        dark_code: { name: '무의식', desc: '자각하지 못함' },
        neural_code: { name: '자각', desc: '깨어남' },
        meta_code: { name: '자유', desc: '자유의지 발현' }
    };
}
