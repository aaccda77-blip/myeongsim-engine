/**
 * 📜 [명심코칭 독자 특허 브랜딩 100% 상표권 안전 디셔너리]
 * - 기존 MBTI/애니어그램 외부 상표권 약어(ENFP, 7w8 등)를 100% 대체하는
 *   독창적인 B2B/B2C 하이브리드 '16대 마인드 아키텍처' 및 '9대 심층 동기 코어 엔진' 타이틀 변환기
 */

// 1. 16대 마인드 아키텍처 (MBTI 대체 100% 독자 타이틀)
export const MIND_ARCHITECTURE_MAP: Record<string, { title: string; desc: string }> = {
    'ENFP': { title: '풍부한 영감을 퍼뜨리는 직관적 비전가', desc: '창의적 가능성과 타인과의 교감을 지향하는 마인드' },
    'ENTP': { title: '혁신적 판도를 바꾸는 경계 파괴 전략가', desc: '고정관념을 뛰어넘어 새로운 가능성을 탐구하는 마인드' },
    'INFJ': { title: '깊은 직관과 통찰을 지닌 영혼 아키텍트', desc: '세상의 본질과 내면의 조화를 아우르는 마인드' },
    'INFP': { title: '이상과 가치를 수놓는 서사 시인', desc: '진실된 삶의 의미와 자기 고유성을 소중히 하는 마인드' },
    'INTJ': { title: '대형 마스터플랜을 그리는 지성 설계자', desc: '장기적 비전과 본질적 체계를 구축하는 마인드' },
    'INTP': { title: '본질의 메커니즘을 탐구하는 정밀 분석가', desc: '원리와 법칙을 논리적으로 파헤치는 마인드' },
    'ENFJ': { title: '사람의 마음을 격려하는 따뜻한 이끌림 코치', desc: '타인의 잠재력을 깨우고 선한 영향을 나누는 마인드' },
    'ENTJ': { title: '목표를 향해 나아가는 대형 비전 지휘관', desc: '명확한 방향성으로 큰 목표를 실현해내는 마인드' },
    'ESTP': { title: '현장의 기회를 포착하는 과감한 실행가', desc: '지금 이 순간의 기회를 빠르게 포착하는 마인드' },
    'ESFP': { title: '순간의 생동감을 피워내는 에너자이저', desc: '밝은 에너지로 세상과 친밀하게 연결되는 마인드' },
    'ISTP': { title: '문제 해결을 정밀하게 완수하는 마스터 해커', desc: '상황을 객관적으로 파악하고 효율적으로 해결하는 마인드' },
    'ISFP': { title: '조용한 감성을 섬세하게 표현하는 예술가', desc: '온화하고 조용히 자신만의 울림을 전하는 마인드' },
    'ESTJ': { title: '체계적이고 단단한 구조를 세우는 시스템 관리자', desc: '책임감과 질서로 현실의 가치를 단단히 지키는 마인드' },
    'ESFJ': { title: '조화로운 공동체를 다정하게 감싸는 조율자', desc: '주변을 세심하게 챙기며 평온을 나누는 마인드' },
    'ISTJ': { title: '원칙과 데이터로 신뢰를 쌓는 든든한 수호자', desc: '묵묵하고 철저하게 신뢰의 기틀을 다지는 마인드' },
    'ISFJ': { title: '세심한 온기로 타인을 깊이 보살피는 가디언', desc: '헌신적이고 따뜻한 마음으로 안식을 선물하는 마인드' },
};

// 2. 9대 심층 동기 코어 엔진 (애니어그램 대체 100% 독자 타이틀)
export const MOTIVATION_ENGINE_MAP: Record<string, { title: string; desc: string }> = {
    '1': { title: '완벽과 정의를 바라는 바른길 아키텍트 Engine', desc: '바른 기준과 높은 무결성을 추구하는 동기' },
    '2': { title: '따뜻한 조력과 연대의 다정한 온기 Driver', desc: '타인에게 다정한 온기와 안식을 선물하려는 동기' },
    '3': { title: '탁월한 성취와 가치를 입증하는 스케일업 Engine', desc: '자신의 목표를 명확히 이루고 인정받으려는 동기' },
    '4': { title: '독창적 정체성과 심층 서사를 그리는 모티프 Driver', desc: '자신만의 깊은 예술적 서사와 유일성을 찾는 동기' },
    '5': { title: '지혜와 인사이트를 탐구하는 깊은 지식 Engine', desc: '세상의 이치를 조용히 관찰하고 지혜를 통찰하려는 동기' },
    '6': { title: '신뢰와 안전을 든든히 지키는 충실한 수호 Driver', desc: '공동체의 신뢰와 안전망을 굳건히 다지려는 동기' },
    '7': { title: '자유와 열정의 돌파 코어 Engine', desc: '다채로운 경험과 다이내믹한 즐거움을 확장하려는 동기' },
    '8': { title: '강인한 의지와 주권적 에너지를 터뜨리는 파워 Engine', desc: '스스로의 삶을 주도적으로 통제하고 약자를 보호하려는 동기' },
    '9': { title: '평온과 중용의 조화를 유지하는 제로포인트 Driver', desc: '갈등을 풀고 내면의 평온과 우아한 균형을 유지하려는 동기' },
};

/**
 * 사용자 입력 문자열(예: 'ENFP', 'enfp', '직관적 비전가', '7w8', '7번', '4번 유형' 등)을
 * 100% 상표권 안전한 명심코칭 독자 공식 텍스트로 자동 전환해 주는 헬퍼 함수
 */
export function getMindArchitectureTitle(rawMbti: string): string {
    if (!rawMbti) return '직관적 비전가';
    const clean = rawMbti.trim().toUpperCase();
    for (const key of Object.keys(MIND_ARCHITECTURE_MAP)) {
        if (clean.includes(key)) {
            return MIND_ARCHITECTURE_MAP[key].title;
        }
    }
    return rawMbti; // 이미 한글 타이틀이거나 기타 명칭인 경우 그대로 반환
}

export function getMotivationEngineTitle(rawEnneagram: string): string {
    if (!rawEnneagram) return '자유와 열정의 코어 엔진';
    const clean = rawEnneagram.trim();

    // 7w8, 7번, 7등 숫자 추출
    const numMatch = clean.match(/[1-9]/);
    if (numMatch) {
        const numKey = numMatch[0];
        if (MOTIVATION_ENGINE_MAP[numKey]) {
            return MOTIVATION_ENGINE_MAP[numKey].title;
        }
    }

    return rawEnneagram;
}
