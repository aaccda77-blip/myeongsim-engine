/**
 * SajuPerspectiveRotator.ts - 사주 관점 로테이터 모듈
 * 
 * 기능:
 * - 주제별 최적 사주 기둥 선택 (년주/월주/일주/시주)
 * - 반복 방지 (최근 사용 기둥 추적)
 * - 다양한 표현 템플릿 제공
 */

// ============== 타입 정의 ==============
export type SajuPillar = 'YEAR' | 'MONTH' | 'DAY' | 'HOUR';

export interface PillarPerspective {
    pillar: SajuPillar;
    koreanName: string;
    meaning: string;
    aspect: string;
    introTemplates: string[];
}

export interface TopicMapping {
    keywords: string[];
    primaryPillar: SajuPillar;
    secondaryPillar: SajuPillar;
}

// ============== 기둥별 관점 정의 ==============
const PILLAR_PERSPECTIVES: Record<SajuPillar, PillarPerspective> = {
    YEAR: {
        pillar: 'YEAR',
        koreanName: '년주(年柱)',
        meaning: '조상, 뿌리, 사회적 이미지',
        aspect: '당신의 무의식적 DNA',
        introTemplates: [
            "세상에 보여지는 당신의 첫인상, 년주를 보면",
            "당신의 뿌리에서 흘러나오는 에너지를 보니",
            "조상에게서 물려받은 당신의 기운은",
            "어린 시절부터 형성된 당신의 기본 틀을 보면",
            "사회가 당신을 바라보는 시선, 년주가 말해주네요"
        ]
    },
    MONTH: {
        pillar: 'MONTH',
        koreanName: '월주(月柱)',
        meaning: '직업, 사회적 역할, 20-40대',
        aspect: '세상이 당신을 어떻게 쓰는가',
        introTemplates: [
            "당신의 커리어와 직결된 월주를 보면",
            "세상이 당신에게 기대하는 역할, 월주가 알려주네요",
            "직장에서의 당신을 나타내는 월주는",
            "사회에서 발휘되는 당신의 능력, 월주를 보니",
            "20대부터 40대까지의 운을 좌우하는 월주는"
        ]
    },
    DAY: {
        pillar: 'DAY',
        koreanName: '일주(日柱)',
        meaning: '본질적 자아, 배우자, 40-60대',
        aspect: '진짜 당신의 내면',
        introTemplates: [
            "당신의 핵심 본질, 일주를 들여다보면",
            "진짜 당신의 모습을 담은 일주가 말하길",
            "내면 깊숙이 숨겨진 당신의 본성",
            "가장 가까운 사람에게만 보여주는 진짜 당신",
            "당신이 무엇으로 만들어졌는지, 일주가 알려주네요"
        ]
    },
    HOUR: {
        pillar: 'HOUR',
        koreanName: '시주(時柱)',
        meaning: '자녀, 말년, 숨겨진 욕망',
        aspect: '당신이 진짜 원하는 것',
        introTemplates: [
            "숨겨진 당신의 진짜 욕망, 시주를 보면",
            "아무도 모르는 당신만의 비밀, 시주가 담고 있어요",
            "미래에 당신이 도달할 곳, 시주가 알려주네요",
            "인생 후반부의 열쇠, 시주를 보니",
            "당신의 자녀운과 말년의 빛, 시주에 있네요"
        ]
    }
};

// ============== 주제-기둥 매핑 ==============
const TOPIC_MAPPINGS: TopicMapping[] = [
    // 연애/관계
    { keywords: ['연애', '사랑', '결혼', '배우자', '이별', '썸', '짝'], primaryPillar: 'DAY', secondaryPillar: 'HOUR' },

    // 직장/커리어
    { keywords: ['직장', '취업', '이직', '승진', '상사', '동료', '사업', '창업'], primaryPillar: 'MONTH', secondaryPillar: 'DAY' },

    // 재물
    { keywords: ['돈', '재물', '재테크', '투자', '부자', '재산', '월급'], primaryPillar: 'MONTH', secondaryPillar: 'YEAR' },

    // 자녀/가족
    { keywords: ['자녀', '아이', '임신', '출산', '부모', '가족'], primaryPillar: 'HOUR', secondaryPillar: 'YEAR' },

    // 건강
    { keywords: ['건강', '아프', '피곤', '에너지', '스트레스', '불면'], primaryPillar: 'DAY', secondaryPillar: 'MONTH' },

    // 미래/운세
    { keywords: ['미래', '운세', '앞으로', '다음', '내년', '올해'], primaryPillar: 'HOUR', secondaryPillar: 'MONTH' },

    // 성격/정체성
    { keywords: ['성격', '나', '정체', '진짜', '본질', '왜 이럴까'], primaryPillar: 'DAY', secondaryPillar: 'YEAR' },

    // 대인관계
    { keywords: ['친구', '인간관계', '갈등', '사람', '소통'], primaryPillar: 'MONTH', secondaryPillar: 'DAY' }
];

// ============== 로테이터 클래스 ==============
export class SajuPerspectiveRotator {
    private static recentPillars: SajuPillar[] = [];
    private static readonly MAX_HISTORY = 3; // 최근 3번 사용 기둥 추적

    /**
     * 주제 키워드 기반으로 최적 기둥 선택
     */
    static selectPillar(userMessage: string): SajuPillar {
        // 1. 키워드 매칭으로 주제 파악
        const lowerMsg = userMessage.toLowerCase();

        for (const mapping of TOPIC_MAPPINGS) {
            if (mapping.keywords.some(kw => lowerMsg.includes(kw))) {
                // 최근 사용한 기둥이면 secondary로
                if (this.recentPillars.includes(mapping.primaryPillar)) {
                    this.recordUsage(mapping.secondaryPillar);
                    return mapping.secondaryPillar;
                }
                this.recordUsage(mapping.primaryPillar);
                return mapping.primaryPillar;
            }
        }

        // 2. 매칭 없으면 최근 안 쓴 기둥 순환
        const allPillars: SajuPillar[] = ['YEAR', 'MONTH', 'DAY', 'HOUR'];
        const available = allPillars.filter(p => !this.recentPillars.includes(p));
        const selected = available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : allPillars[Math.floor(Math.random() * allPillars.length)];

        this.recordUsage(selected);
        return selected;
    }

    /**
     * 선택된 기둥에 대한 도입 문구 반환
     */
    static getIntroPhrase(pillar: SajuPillar): string {
        const perspective = PILLAR_PERSPECTIVES[pillar];
        const templates = perspective.introTemplates;
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * 완전한 관점 문구 생성
     */
    static generatePerspectiveIntro(userMessage: string, sajuData?: any): string {
        const pillar = this.selectPillar(userMessage);
        const perspective = PILLAR_PERSPECTIVES[pillar];
        const intro = this.getIntroPhrase(pillar);

        // 사주 데이터가 있으면 해당 기둥 정보 포함
        let sajuDetail = '';
        if (sajuData) {
            switch (pillar) {
                case 'YEAR':
                    sajuDetail = sajuData.yearPillar || sajuData.year || '';
                    break;
                case 'MONTH':
                    sajuDetail = sajuData.monthPillar || sajuData.month || '';
                    break;
                case 'DAY':
                    sajuDetail = sajuData.dayPillar || sajuData.dayMaster || sajuData.day || '';
                    break;
                case 'HOUR':
                    sajuDetail = sajuData.hourPillar || sajuData.hour || '';
                    break;
            }
        }

        if (sajuDetail) {
            return `${intro}\n\n**${perspective.koreanName}**: ${sajuDetail}의 기운이 담겨 있는데요...`;
        }

        return `${intro}\n(${perspective.aspect})`;
    }

    /**
     * 사용 기록 관리
     */
    private static recordUsage(pillar: SajuPillar): void {
        this.recentPillars.unshift(pillar);
        if (this.recentPillars.length > this.MAX_HISTORY) {
            this.recentPillars.pop();
        }
    }

    /**
     * 히스토리 리셋 (새 세션 시작 시)
     */
    static resetHistory(): void {
        this.recentPillars = [];
    }

    /**
     * PromptEngine에 주입할 지시문 생성
     */
    static generateSystemPromptInjection(userMessage: string): string {
        const pillar = this.selectPillar(userMessage);
        const perspective = PILLAR_PERSPECTIVES[pillar];

        return `
[SAJU PERSPECTIVE ROTATION - ${perspective.koreanName}]
이번 답변에서는 **${perspective.koreanName}** 관점에서 분석하세요.
- 관점: ${perspective.aspect}
- 의미: ${perspective.meaning}
- 시작 문구 예시: "${this.getIntroPhrase(pillar)}"

⚠️ 일간(日干)만 반복 언급하지 마세요!
⚠️ 다양한 기둥(년주/월주/일주/시주)을 번갈아 사용하세요!
`;
    }
}

export default SajuPerspectiveRotator;
