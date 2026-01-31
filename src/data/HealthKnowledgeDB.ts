/**
 * HealthKnowledgeDB.ts
 * 건강운동관리사 전문 지식 데이터베이스
 * 
 * 출처: 건강운동관리사 구술시험 핵심 내용
 * 목적: 전문 지식을 일상 언어로 변환한 Q&A 템플릿
 */

export interface HealthQATemplate {
    id: string;
    category: 'hypertension' | 'diabetes' | 'disc' | 'obesity' | 'arthritis' | 'osteoporosis';
    question: string; // 회원이 실제로 물어볼 법한 질문
    answer: {
        greeting: string; // 공감 인사
        core_message: string; // 핵심 답변
        advice_cards: {
            icon: string; // Material Icon 이름
            title: string;
            content: string;
        }[];
        closing: string; // 격려 메시지
    };
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * 건강운동관리사 전문 지식 DB
 * 실제 구술시험 내용을 회원 친화적으로 변환
 */
export const HEALTH_KNOWLEDGE_DB: HealthQATemplate[] = [
    // ============================================
    // 1. 고혈압 (Hypertension)
    // ============================================
    {
        id: 'hypertension_001',
        category: 'hypertension',
        question: '혈압이 좀 높은데(130~140), 근력 운동하면 혈관 터진다는 게 진짜인가요?',
        answer: {
            greeting: '안녕하세요! 명심 코칭입니다. 건강을 위해 운동을 고민하시는 모습이 정말 멋지세요.',
            core_message: '결론부터 말씀드리면, 올바른 방법의 근력 운동은 오히려 **혈압 관리에 큰 도움**이 된답니다. 하지만 무엇보다 안전이 중요하겠지요? 마음 편히 운동하실 수 있도록 세 가지 핵심 지침을 전해드릴게요.',
            advice_cards: [
                {
                    icon: 'air',
                    title: '숨을 참지 말아주세요',
                    content: '무거운 것을 들 때 숨을 멈추면 혈압이 급격히 오를 수 있어요. 힘을 쓸 때 \'후-\' 하고 부드럽게 내뱉는 습관을 가져보세요.'
                },
                {
                    icon: 'fitness_center',
                    title: '가벼운 무게부터 천천히',
                    content: '처음부터 무리할 필요 없어요. 가벼운 무게로 15~20회 정도 반복할 수 있는 강도로 시작해 체력을 차근차근 길러보세요.'
                },
                {
                    icon: 'monitor_heart',
                    title: '운동 전 컨디션 체크',
                    content: '운동을 시작하기 전 오늘 내 몸의 상태는 어떤지 혈압을 먼저 재보세요. 혈압이 평소보다 너무 높다면 오늘은 푹 쉬어주는 것도 용기입니다.'
                }
            ],
            closing: '💡 **명심 팁**: 플랭크처럼 버티는 운동보다는, 스쿼트처럼 움직이는 운동이 혈압 관리에 더 안전해요!'
        },
        tags: ['고혈압', '근력운동', '안전수칙', '호흡법'],
        difficulty: 'beginner'
    },
    {
        id: 'hypertension_002',
        category: 'hypertension',
        question: '혈압약 먹는데 운동하면 혈압이 너무 떨어지지 않을까요?',
        answer: {
            greeting: '약을 복용 중이시군요. 건강 관리에 신경 쓰시는 모습이 훌륭합니다!',
            core_message: '걱정하지 마세요. 오히려 **운동과 약물의 조합**이 혈압 관리에 가장 효과적이에요. 다만 타이밍이 중요합니다.',
            advice_cards: [
                {
                    icon: 'schedule',
                    title: '약 복용 후 1~2시간 피하기',
                    content: '혈압약이 가장 강하게 작용하는 시간대에는 운동을 피해주세요. 약 먹고 3시간 이후가 안전해요.'
                },
                {
                    icon: 'trending_down',
                    title: '저혈압 신호 알아두기',
                    content: '어지럽거나 식은땀이 나면 즉시 운동을 멈추고 앉아서 쉬어주세요. 이건 몸이 보내는 경고 신호예요.'
                },
                {
                    icon: 'water_drop',
                    title: '수분 충분히 섭취',
                    content: '운동 전후로 물을 충분히 마셔주세요. 탈수는 혈압을 불안정하게 만들 수 있어요.'
                }
            ],
            closing: '💡 **명심 팁**: 운동 전후 혈압을 기록해두면 의사 선생님께 큰 도움이 됩니다!'
        },
        tags: ['고혈압', '약물', '타이밍', '저혈압'],
        difficulty: 'intermediate'
    },

    // ============================================
    // 2. 당뇨 (Diabetes)
    // ============================================
    {
        id: 'diabetes_001',
        category: 'diabetes',
        question: '당뇨인데 저녁 운동 해도 괜찮을까요? 자다가 저혈당 올까 봐 무서워요.',
        answer: {
            greeting: '열심히 운동하시려는 모습이 멋집니다! 하지만 당뇨가 있으시다면 \'시간\'이 정말 중요해요.',
            core_message: '늦은 밤 운동은 자는 동안 **저혈당 쇼크**를 부를 수 있습니다. 하지만 올바른 타이밍과 준비만 있다면 안전하게 운동할 수 있어요!',
            advice_cards: [
                {
                    icon: 'restaurant',
                    title: '저녁 식사 후 1시간 뒤',
                    content: '식후 혈당이 올라가는 시점에 운동하면 혈당 조절에 가장 효과적이에요. 공복 운동은 위험합니다!'
                },
                {
                    icon: 'bedtime',
                    title: '잠자기 3시간 전까지만',
                    content: '너무 늦은 시간 운동은 피해주세요. 자는 동안 저혈당이 올 수 있어요. 늦어도 밤 9시 전에 끝내세요.'
                },
                {
                    icon: 'cookie',
                    title: '비상 간식 준비',
                    content: '운동 중 어지럽거나 식은땀이 나면 즉시 사탕이나 주스를 드세요. 항상 주머니에 준비해두세요.'
                }
            ],
            closing: '💡 **명심 팁**: 자기 전 우유 한 잔은 야간 저혈당 예방에 도움이 됩니다!'
        },
        tags: ['당뇨', '저녁운동', '저혈당', '타이밍'],
        difficulty: 'beginner'
    },
    {
        id: 'diabetes_002',
        category: 'diabetes',
        question: '당뇨 환자는 맨발로 운동하면 안 된다는데 진짜인가요?',
        answer: {
            greeting: '정말 중요한 질문이에요! 당뇨 환자의 발 관리는 생각보다 훨씬 중요합니다.',
            core_message: '네, 맞습니다. 당뇨가 있으면 **발의 감각이 둔해져서** 작은 상처도 큰 문제가 될 수 있어요. 당뇨발은 절대 가볍게 봐선 안 됩니다!',
            advice_cards: [
                {
                    icon: 'footprint',
                    title: '쿠션 좋은 운동화 필수',
                    content: '요가나 필라테스도 양말은 꼭 신으세요. 발바닥에 작은 상처만 생겨도 감염 위험이 높아요.'
                },
                {
                    icon: 'search',
                    title: '매일 발 확인하기',
                    content: '운동 후 발가락 사이, 발바닥을 꼼꼼히 확인하세요. 물집, 굳은살, 상처가 있는지 체크해주세요.'
                },
                {
                    icon: 'healing',
                    title: '작은 상처도 즉시 치료',
                    content: '발에 상처가 생기면 절대 방치하지 마세요. 바로 소독하고, 낫지 않으면 병원에 가세요.'
                }
            ],
            closing: '💡 **명심 팁**: 당뇨 환자는 발 전문 의사(족부의)를 정기적으로 방문하는 것이 좋아요!'
        },
        tags: ['당뇨', '당뇨발', '발관리', '안전수칙'],
        difficulty: 'intermediate'
    },

    // ============================================
    // 3. 디스크 (Disc)
    // ============================================
    {
        id: 'disc_001',
        category: 'disc',
        question: '허리 디스크가 있는데 윗몸일으키기 해도 될까요?',
        answer: {
            greeting: '허리 건강을 걱정하시는군요. 정말 현명한 질문입니다!',
            core_message: '**절대 안 됩니다!** 윗몸일으키기는 디스크 환자에게 가장 위험한 운동 중 하나예요. 하지만 복근은 키울 수 있어요!',
            advice_cards: [
                {
                    icon: 'dangerous',
                    title: '윗몸일으키기는 금지',
                    content: '허리를 구부리는 동작은 디스크를 더 밀어내서 악화시킬 수 있어요. 절대 하지 마세요!'
                },
                {
                    icon: 'self_improvement',
                    title: '플랭크로 대체하세요',
                    content: '엎드려서 버티는 플랭크는 허리에 부담 없이 복근을 키울 수 있어요. 10초씩 3세트부터 시작해보세요.'
                },
                {
                    icon: 'airline_seat_recline_normal',
                    title: '데드버그 운동 추천',
                    content: '누워서 팔다리를 천천히 움직이는 운동이에요. 허리는 바닥에 붙인 채로 하면 안전해요.'
                }
            ],
            closing: '💡 **명심 팁**: 디스크 환자는 "구부리기"보다 "버티기" 운동이 안전합니다!'
        },
        tags: ['디스크', '복근운동', '금기사항', '대체운동'],
        difficulty: 'beginner'
    },

    // ============================================
    // 4. 비만 (Obesity)
    // ============================================
    {
        id: 'obesity_001',
        category: 'obesity',
        question: '체중이 많이 나가는데 달리기 해도 무릎 괜찮을까요?',
        answer: {
            greeting: '운동을 시작하시려는 용기가 정말 대단합니다!',
            core_message: '체중이 많이 나갈수록 **무릎에 가해지는 충격은 3~5배**예요. 달리기보다 더 안전하고 효과적인 방법이 있어요!',
            advice_cards: [
                {
                    icon: 'pool',
                    title: '수영이 최고의 선택',
                    content: '물속에서는 체중 부담이 90% 줄어들어요. 무릎 걱정 없이 칼로리를 태울 수 있어요.'
                },
                {
                    icon: 'directions_bike',
                    title: '실내 자전거 추천',
                    content: '앉아서 하는 운동이라 무릎 부담이 적어요. 속도보다는 오래 타는 게 중요해요.'
                },
                {
                    icon: 'directions_walk',
                    title: '빠르게 걷기부터 시작',
                    content: '달리기는 체중이 10kg 이상 빠진 후에 시작하세요. 지금은 빠르게 걷는 것만으로도 충분해요!'
                }
            ],
            closing: '💡 **명심 팁**: 체중 1kg 감량 = 무릎 부담 4kg 감소! 천천히 가도 괜찮아요.'
        },
        tags: ['비만', '무릎보호', '유산소운동', '체중감량'],
        difficulty: 'beginner'
    },

    // ============================================
    // 5. 골다공증 (Osteoporosis)
    // ============================================
    {
        id: 'osteoporosis_001',
        category: 'osteoporosis',
        question: '골다공증이 있는데 운동하다가 뼈가 부러지지 않을까요?',
        answer: {
            greeting: '뼈 건강을 걱정하시는군요. 정말 중요한 문제예요!',
            core_message: '오히려 **운동을 안 하면 뼈가 더 약해집니다!** 올바른 운동은 뼈를 강하게 만들어요. 안전하게 하는 방법을 알려드릴게요.',
            advice_cards: [
                {
                    icon: 'directions_walk',
                    title: '체중 부하 운동이 핵심',
                    content: '걷기, 계단 오르기처럼 자신의 체중을 지탱하는 운동이 뼈를 강하게 만들어요. 수영은 효과가 적어요.'
                },
                {
                    icon: 'warning',
                    title: '허리 굽히기는 위험',
                    content: '앞으로 숙이는 동작은 척추 골절 위험이 있어요. 윗몸일으키기, 골프 스윙은 피하세요.'
                },
                {
                    icon: 'fitness_center',
                    title: '가벼운 근력 운동 추천',
                    content: '0.5~1kg 아령으로 팔 운동을 하면 팔뼈가 강해져요. 무거운 건 절대 금물!'
                }
            ],
            closing: '💡 **명심 팁**: 칼슘 섭취 + 햇빛 + 운동 = 뼈 건강의 3박자!'
        },
        tags: ['골다공증', '뼈건강', '체중부하운동', '안전수칙'],
        difficulty: 'intermediate'
    },

    // ============================================
    // 6. 관절염 (Arthritis)
    // ============================================
    {
        id: 'arthritis_001',
        category: 'arthritis',
        question: '무릎 관절염이 있는데 운동하면 더 나빠지지 않을까요?',
        answer: {
            greeting: '무릎이 아프면 움직이기 두렵죠. 그 마음 충분히 이해합니다.',
            core_message: '놀랍게도 **적절한 운동은 관절염 통증을 줄여줍니다!** 움직이지 않으면 관절이 더 굳어져요. 안전하게 시작하는 법을 알려드릴게요.',
            advice_cards: [
                {
                    icon: 'pool',
                    title: '물속 운동이 최고',
                    content: '수중 걷기는 무릎 부담 없이 근육을 키울 수 있어요. 따뜻한 물이면 더 좋아요!'
                },
                {
                    icon: 'self_improvement',
                    title: '관절 가동 범위 운동',
                    content: '무릎을 천천히 구부렸다 펴는 동작을 반복하세요. 통증 없는 범위 내에서만 움직이세요.'
                },
                {
                    icon: 'ac_unit',
                    title: '운동 후 냉찜질',
                    content: '운동 후 무릎이 붓거나 열이 나면 15분간 얼음찜질을 해주세요. 염증을 줄여줘요.'
                }
            ],
            closing: '💡 **명심 팁**: 통증이 심한 날은 쉬어도 괜찮아요. 무리하지 마세요!'
        },
        tags: ['관절염', '무릎통증', '수중운동', '재활'],
        difficulty: 'beginner'
    }
];

/**
 * 카테고리별 질문 개수
 */
export const CATEGORY_COUNT = {
    hypertension: HEALTH_KNOWLEDGE_DB.filter(q => q.category === 'hypertension').length,
    diabetes: HEALTH_KNOWLEDGE_DB.filter(q => q.category === 'diabetes').length,
    disc: HEALTH_KNOWLEDGE_DB.filter(q => q.category === 'disc').length,
    obesity: HEALTH_KNOWLEDGE_DB.filter(q => q.category === 'obesity').length,
    osteoporosis: HEALTH_KNOWLEDGE_DB.filter(q => q.category === 'osteoporosis').length,
    arthritis: HEALTH_KNOWLEDGE_DB.filter(q => q.category === 'arthritis').length,
};

/**
 * 카테고리 한글 이름
 */
export const CATEGORY_LABELS: Record<string, string> = {
    hypertension: '고혈압',
    diabetes: '당뇨',
    disc: '디스크',
    obesity: '비만',
    osteoporosis: '골다공증',
    arthritis: '관절염'
};

/**
 * 랜덤 질문 가져오기
 */
export function getRandomHealthQA(): HealthQATemplate {
    const randomIndex = Math.floor(Math.random() * HEALTH_KNOWLEDGE_DB.length);
    return HEALTH_KNOWLEDGE_DB[randomIndex];
}

/**
 * 카테고리별 질문 가져오기
 */
export function getHealthQAByCategory(category: string): HealthQATemplate[] {
    return HEALTH_KNOWLEDGE_DB.filter(q => q.category === category);
}

/**
 * ID로 질문 가져오기
 */
export function getHealthQAById(id: string): HealthQATemplate | undefined {
    return HEALTH_KNOWLEDGE_DB.find(q => q.id === id);
}
