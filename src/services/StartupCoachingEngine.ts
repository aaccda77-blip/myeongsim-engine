/**
 * StartupCoachingEngine.ts - 강점 기반 스타트업 코칭 엔진
 * 
 * 사용자의 강점 리포트 / 사주 데이터를 분석하여
 * 개인화된 스타트업 로드맵을 생성합니다.
 */

import {
    THINKING_FORMULAS,
    FAILPROOF_STRATEGIES,
    GROWTH_TACTICS,
    BUSINESS_TYPES,
    ThinkingFormula,
    FailproofStrategy,
    GrowthTactic,
    BusinessType
} from '@/data/StartupContentDB';

// ============================================================================
// Types
// ============================================================================

export interface UserProfile {
    powerbase?: {
        communication: number;
        innovation: number;
        management: number;
        marketSuccess: number;
        sustainability: number;
        structure: number;
    };
    talentProfile?: {
        transformation: number;
        dissemination: number;
        contact: number;
        realization: number;
        development: number;
        analysis: number;
    };
    saju?: {
        elements?: {
            wood: number;
            fire: number;
            earth: number;
            metal: number;
            water: number;
        };
    };
    teamRole?: string;
}

export interface RoadmapStep {
    step: number;
    title: string;
    description: string;
    actions: string[];
    tools?: string[];
    estimated_time: string;
    status: 'pending' | 'in_progress' | 'completed';
}

export interface PersonalizedRoadmap {
    businessType: BusinessType;
    ceoType: string;
    ceoDescription: string;
    primaryFormulas: ThinkingFormula[];
    recommendedStrategy: FailproofStrategy;
    growthTactics: GrowthTactic[];
    roadmapSteps: RoadmapStep[];
    strengthsHighlight: string[];
    warningsAndTips: string[];
}

// ============================================================================
// Matching Logic
// ============================================================================

export class StartupCoachingEngine {

    /**
     * 사용자 프로필에서 가장 높은 Powerbase 찾기
     */
    static getTopPowerbase(profile: UserProfile): string {
        const powerbase = profile.powerbase;
        if (!powerbase) return 'communication';

        const entries = Object.entries(powerbase);
        const sorted = entries.sort((a, b) => b[1] - a[1]);
        return sorted[0][0];
    }

    /**
     * 비즈니스 유형 매칭
     */
    static matchBusinessType(profile: UserProfile): BusinessType {
        const topPowerbase = this.getTopPowerbase(profile);

        // Powerbase에 따른 비즈니스 유형 매칭
        for (const type of BUSINESS_TYPES) {
            if (type.ideal_powerbase.includes(topPowerbase)) {
                return type;
            }
        }

        // 기본값: 커뮤니티 리더형
        return BUSINESS_TYPES[0];
    }

    /**
     * CEO 유형 설명 생성
     */
    static getCeoTypeDescription(profile: UserProfile, businessType: BusinessType): { type: string; description: string } {
        const topPowerbase = this.getTopPowerbase(profile);

        const ceoTypes: Record<string, { type: string; description: string }> = {
            'communication': {
                type: '소통형 리더',
                description: '사람을 모으고 관계를 맺는 것이 강점입니다. 커뮤니티 비즈니스가 적합합니다.'
            },
            'innovation': {
                type: '혁신형 창업가',
                description: '새로운 아이디어와 변화를 만들어냅니다. 테크/제품 스타트업이 적합합니다.'
            },
            'management': {
                type: '운영형 CEO',
                description: '체계적인 관리와 실행이 강점입니다. 프랜차이즈/컨설팅이 적합합니다.'
            },
            'marketSuccess': {
                type: '실행형 사업가',
                description: '목표를 향해 빠르게 달려갑니다. 영업/마케팅 중심 사업이 적합합니다.'
            },
            'sustainability': {
                type: '안정형 경영자',
                description: '지속 가능한 성장을 설계합니다. 장기 투자형 사업이 적합합니다.'
            },
            'structure': {
                type: '구조화 전문가',
                description: '시스템과 프로세스를 만드는 것이 강점입니다. 플랫폼 사업이 적합합니다.'
            }
        };

        return ceoTypes[topPowerbase] || ceoTypes['communication'];
    }

    /**
     * 추천 공식 선택
     */
    static getRecommendedFormulas(businessType: BusinessType): ThinkingFormula[] {
        return THINKING_FORMULAS.filter(f =>
            businessType.recommended_formulas.includes(f.id)
        );
    }

    /**
     * 추천 전략 선택
     */
    static getRecommendedStrategy(businessType: BusinessType): FailproofStrategy {
        const strategyId = businessType.recommended_strategies[0];
        return FAILPROOF_STRATEGIES.find(s => s.id === strategyId) || FAILPROOF_STRATEGIES[0];
    }

    /**
     * 성장 전술 선택
     */
    static getGrowthTactics(profile: UserProfile): GrowthTactic[] {
        const topPowerbase = this.getTopPowerbase(profile);

        // Powerbase에 따라 관련 전술 우선
        if (topPowerbase === 'communication' || topPowerbase === 'innovation') {
            return GROWTH_TACTICS.filter(t => t.category === 'marketing' || t.category === 'product');
        }
        if (topPowerbase === 'management' || topPowerbase === 'structure') {
            return GROWTH_TACTICS.filter(t => t.category === 'team' || t.category === 'funding');
        }

        return GROWTH_TACTICS.slice(0, 3);
    }

    /**
     * 5단계 로드맵 생성
     */
    static generateRoadmapSteps(businessType: BusinessType, strategy: FailproofStrategy): RoadmapStep[] {
        return [
            {
                step: 1,
                title: 'CEO DNA 분석',
                description: '나의 강점과 비즈니스 적합성을 파악합니다.',
                actions: [
                    '강점/재능 리포트 결과 확인',
                    'Powerbase 분석 → 내 비즈니스 유형 확인',
                    '강점 3개, 약점 1개 기록하기'
                ],
                estimated_time: '30분',
                status: 'pending'
            },
            {
                step: 2,
                title: '아이템 발굴',
                description: '천재적 사고 공식으로 비즈니스 아이템을 찾습니다.',
                actions: [
                    '문제 재정의 알고리즘 적용',
                    '내 경험 중 "불편했던 것" 3개 적기',
                    '각각에 "왜 × 5" 적용하여 진짜 Pain Point 찾기'
                ],
                estimated_time: '1~2시간',
                status: 'pending'
            },
            {
                step: 3,
                title: '무실패 검증',
                description: strategy.name + ' 전략으로 시장을 검증합니다.',
                actions: strategy.action_steps,
                estimated_time: '2~4주',
                status: 'pending'
            },
            {
                step: 4,
                title: '마케팅 & 성장',
                description: '1,000명의 진성 팬을 확보합니다.',
                actions: [
                    '타겟 고객이 모인 커뮤니티 3곳 찾기',
                    '무료로 가치 제공 (3개월)',
                    '팔로워 500명 → 오픈채팅 초대'
                ],
                tools: ['인스타그램', '카카오 오픈채팅', '뉴스레터'],
                estimated_time: '3~6개월',
                status: 'pending'
            },
            {
                step: 5,
                title: '스케일업',
                description: '팀 빌딩과 자금 조달로 확장합니다.',
                actions: [
                    '나의 약점 보완할 파트너 1명 영입',
                    'K-Startup 정부지원금 신청',
                    '월 매출 30만원 달성 후 투자 검토'
                ],
                tools: ['K-Startup', '크몽', '원티드'],
                estimated_time: '6~12개월',
                status: 'pending'
            }
        ];
    }

    /**
     * 강점 하이라이트 생성
     */
    static getStrengthsHighlight(profile: UserProfile): string[] {
        const highlights: string[] = [];
        const topPowerbase = this.getTopPowerbase(profile);

        const strengthMap: Record<string, string> = {
            'communication': '✅ 사람을 모으는 능력이 탁월합니다',
            'innovation': '✅ 새로운 아이디어를 만들어내는 창의력이 있습니다',
            'management': '✅ 체계적으로 운영하는 관리 능력이 있습니다',
            'marketSuccess': '✅ 목표를 달성하는 실행력이 뛰어납니다',
            'sustainability': '✅ 장기적 관점에서 안정적으로 성장할 수 있습니다',
            'structure': '✅ 시스템과 프로세스를 잘 만들 수 있습니다'
        };

        highlights.push(strengthMap[topPowerbase] || strengthMap['communication']);
        highlights.push('✅ 당신만의 고유한 강점을 활용하세요');
        highlights.push('✅ 약점은 파트너로 보완하세요');

        return highlights;
    }

    /**
     * 주의사항 및 팁 생성
     */
    static getWarningsAndTips(profile: UserProfile): string[] {
        const topPowerbase = this.getTopPowerbase(profile);

        const tips: Record<string, string[]> = {
            'communication': [
                '⚠️ 실행보다 관계에 너무 집중하지 마세요',
                '💡 Tip: 매주 "측정 가능한 목표" 1개씩 달성하세요'
            ],
            'innovation': [
                '⚠️ 아이디어만 많고 실행이 부족할 수 있습니다',
                '💡 Tip: MVP를 2주 안에 만들어 테스트하세요'
            ],
            'management': [
                '⚠️ 완벽해야 시작한다는 생각을 버리세요',
                '💡 Tip: 80%만 준비되면 바로 출시하세요'
            ],
            'marketSuccess': [
                '⚠️ 빠른 성과만 쫓다 지속성을 놓칠 수 있습니다',
                '💡 Tip: 고객 관계에도 시간을 투자하세요'
            ],
            'sustainability': [
                '⚠️ 너무 신중해서 기회를 놓칠 수 있습니다',
                '💡 Tip: "작게 시작하고 빠르게 실패하기"를 연습하세요'
            ],
            'structure': [
                '⚠️ 시스템에 집착하면 유연성을 잃을 수 있습니다',
                '💡 Tip: 초기에는 프로세스보다 고객에 집중하세요'
            ]
        };

        return tips[topPowerbase] || tips['communication'];
    }

    /**
     * 🎯 메인 함수: 개인화된 로드맵 생성
     */
    static getPersonalizedRoadmap(profile: UserProfile): PersonalizedRoadmap {
        const businessType = this.matchBusinessType(profile);
        const ceoInfo = this.getCeoTypeDescription(profile, businessType);
        const strategy = this.getRecommendedStrategy(businessType);

        return {
            businessType,
            ceoType: ceoInfo.type,
            ceoDescription: ceoInfo.description,
            primaryFormulas: this.getRecommendedFormulas(businessType),
            recommendedStrategy: strategy,
            growthTactics: this.getGrowthTactics(profile),
            roadmapSteps: this.generateRoadmapSteps(businessType, strategy),
            strengthsHighlight: this.getStrengthsHighlight(profile),
            warningsAndTips: this.getWarningsAndTips(profile)
        };
    }
}
