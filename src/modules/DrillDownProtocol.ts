/**
 * DrillDownProtocol.ts - 아이콘 확장 및 심층 탐색 프로토콜
 * 
 * 목적: Progressive Disclosure (점진적 공개) 패턴 구현
 * 특징:
 *  - 메인 아이콘 6개로 단순함 유지
 *  - 터치 시 서브메뉴 펼침 (Bottom Sheet)
 *  - 사용자 사주 데이터 기반 추천 배지
 *  - 뇌과학/심리학 기반 호기심 자극 문구
 */

// ============== 타입 정의 ==============

export interface SubMenuItem {
    id: string;
    label: string;
    desc?: string;
    intent: string;
    icon?: string;
    isPremium?: boolean;
}

export interface MainIcon {
    id: string;
    label: string;
    icon: string;
    neuro_trigger: string;  // 호기심 자극 문구 (뇌과학)
    style?: 'default' | 'premium_gold' | 'premium_purple' | 'healing_green';
    sub_menus: SubMenuItem[];
}

export interface IconRecommendation {
    id: string;
    badge: string;
    priority?: number;
}

// ============== 메인 아이콘 맵 (최종 정리본) ==============

export const ICON_DRILL_DOWN_MAP: Record<string, MainIcon> = {

    // 1. 💰 부의 그릇 (가장 대중적인 니즈)
    WEALTH: {
        id: 'WEALTH',
        label: "부의 그릇",
        icon: "💰",
        neuro_trigger: "왜 벌어도 모이지 않을까?",
        style: 'default',
        sub_menus: [
            {
                id: "w_1",
                label: "💸 돈이 새는 구멍",
                desc: "무의식에 심어진 결핍 패턴",
                intent: "shadow_exhaustion"
            },
            {
                id: "w_2",
                label: "💎 나만의 부자 코드",
                desc: "타고난 재물 운용 방식",
                intent: "gift_divine_will"
            },
            {
                id: "w_3",
                label: "📈 올해 재물 흐름",
                desc: "월별 재운 분석",
                intent: "fortune_wealth_year"
            },
            {
                id: "w_4",
                label: "🧪 재물운 강화 코칭",
                desc: "AI 맞춤 실천 과제",
                intent: "coaching_wealth_action",
                isPremium: true
            }
        ]
    },

    // 2. ⌚ 바이오싱크 (특허 기술 강조 - 위치 이동 및 통합 완료)
    BIO_SYNC: {
        id: 'BIO_SYNC',
        label: "생체 연동",
        icon: "⌚",
        neuro_trigger: "실시간 운명 동기화",
        style: 'default',
        sub_menus: [
            {
                id: "b_1",
                label: "⚡ Bio-Sync 대시보드",
                desc: "웨어러블 연결 및 데이터 확인",
                intent: "bio_sync_dashboard_view"
            },
            // [New] Integral Check-in (Myeongshim Engine)
            {
                id: "b_checkin",
                label: "🩺 통합 체크인",
                desc: "Saju + 4분면 정밀 분석",
                intent: "integral_checkin_view"
            },
            {
                id: "b_2",
                label: "🧘 생체 리듬 명상",
                desc: "심박수에 맞춘 호흡 가이드",
                intent: "bio_rhythm_meditation"
            },
            // [특허 핵심 기능 배치]
            {
                id: "b_patent_1",
                label: "🚨 [특허] 위기 개입",
                desc: "급성 스트레스 차단 (S-C-A-R)",
                intent: "demo_patent_features",
                isPremium: true
            },
            {
                id: "b_patent_2",
                label: "🛡️ [특허] 선제적 예방",
                desc: "스트레스 패턴 예측 및 알림",
                intent: "demo_preventive_care",
                isPremium: true
            },
            {
                id: "b_patent_recovery",
                label: "📉 [특허] 실시간 진정",
                desc: "심박수 안정화 시각화",
                intent: "demo_realtime_recovery",
                isPremium: true
            },
            // [융합 아이디어]
            {
                id: "b_idea_1",
                label: "🧬 Neuro-Saju",
                desc: "오행-신경계 공명 테스트",
                intent: "demo_neuro_saju",
                isPremium: true
            },
            // [Smart Context - 상황 인식형 코칭]
            {
                id: "b_context",
                label: "🌅 오늘의 에너지 분석",
                desc: "BPM + 사주 + 바이오리듬 통합",
                intent: "smart_context_card"
            },
            {
                id: "b_golden",
                label: "⏰ 골든타임 알림",
                desc: "지금 뭐하면 좋을까?",
                intent: "golden_time_analysis"
            },
            // [중독 회복 - 심리치료 기반]
            {
                id: "b_quit_smoke",
                label: "🚭 금연 알아차림",
                desc: "ACT 기반 흡연 욕구 대처",
                intent: "quit_smoking_act"
            },
            {
                id: "b_quit_drink",
                label: "🍺 금주 알아차림",
                desc: "CBT 기반 음주 충동 관리",
                intent: "quit_drinking_cbt"
            },
            {
                id: "b_addiction",
                label: "🎮 중독 탈출",
                desc: "DBT 기반 디지털/도박 대처",
                intent: "addiction_escape_dbt"
            }
        ]
    },

    // 3. ❤️ 관계의 멍
    RELATIONSHIP: {
        id: 'RELATIONSHIP',
        label: "관계의 멍",
        icon: "❤️",
        neuro_trigger: "반복되는 상처 끊어내기",
        style: 'healing_green',
        sub_menus: [
            {
                id: "r_1",
                label: "💔 이별의 진짜 원인",
                desc: "관계 패턴 심층 분석",
                intent: "shadow_conflict"
            },
            {
                id: "r_2",
                label: "👩‍❤️‍👨 내게 맞는 인연",
                desc: "배우자상 / 궁합 분석",
                intent: "saju_compatibility"
            },
            {
                id: "r_3",
                label: "🛡️ 감정 방어기제 해제",
                desc: "친밀감 회피 패턴 치유",
                intent: "venus_sequence_defense"
            },
            {
                id: "r_4",
                label: "💞 인연 유형 테스트",
                desc: "나의 관계 스타일은?",
                intent: "relationship_type_quiz"
            }
        ]
    },

    // 4. 🚀 천직 발견
    CAREER: {
        id: 'CAREER',
        label: "천직 발견",
        icon: "🚀",
        neuro_trigger: "나는 이 일을 하려고 태어났다",
        style: 'default',
        sub_menus: [
            {
                id: "c_1",
                label: "🎯 타고난 재능 분석",
                desc: "사주로 보는 핵심 강점",
                intent: "innate_talent_analysis"
            },
            {
                id: "c_2",
                label: "💼 직장 vs 사업",
                desc: "어떤 길이 맞을까?",
                intent: "career_path_direction"
            },
            {
                id: "c_3",
                label: "🔥 번아웃 탈출 코칭",
                desc: "일에서 의미 찾기",
                intent: "burnout_escape_coaching"
            },
            {
                id: "c_4",
                label: "📊 커리어 타이밍",
                desc: "이직/승진 최적 시기",
                intent: "career_timing_analysis",
                isPremium: true
            }
        ]
    },

    // 5. 🧬 성격분석 (명심코칭 시그니처)
    PERSONALITY_ANALYSIS: {
        id: 'PERSONALITY_ANALYSIS',
        label: "성격분석",
        icon: "🧬",
        neuro_trigger: "나만의 본질 에너지 코드",
        style: 'premium_purple',
        sub_menus: [
            {
                id: "g_1",
                label: "🌟 핵심 코드 분석",
                desc: "천직(天職) / 성장 과제",
                intent: "core_myeongsim_codes"
            },
            {
                id: "g_neural",
                label: "🧬 뉴럴 프로필 분석",
                desc: "Life's Work, Evolution, Radiance, Purpose",
                intent: "neural_profile_analysis"
            },
            {
                id: "g_2",
                label: "⚡ 다크코드 → 뉴럴코드",
                desc: "아픔을 힘으로 바꾸는 법",
                intent: "dark_to_neural"
            },
            {
                id: "g_3",
                label: "💫 번영 열쇠",
                desc: "재물운 핵심 코드",
                intent: "prosperity_key_analysis"
            },
            {
                id: "g_4",
                label: "❤️ 인연 코드",
                desc: "관계운 핵심 코드",
                intent: "connection_code_analysis"
            },
            {
                id: "g_5",
                label: "🧠 심리 치유 아키타입",
                desc: "DBT/ACT/MBCT 통합 처방",
                intent: "therapy_archetype_view"
            },
            {
                id: "g_strength",
                label: "📊 강점/재능 리포트",
                desc: "인적자원 역량 분석",
                intent: "strength_talent_report",
                isPremium: true
            },
            {
                id: "g_startup_1",
                label: "🚀 무실패 스타트업 설계",
                desc: "사주 기반 창업 전략",
                intent: "startup_design_analysis",
                isPremium: true
            },
            {
                id: "g_startup_2",
                label: "💡 사업 아이디어 검증",
                desc: "내 사주에 맞는 업종",
                intent: "startup_idea_validation",
                isPremium: true
            }
        ]
    },

    // 6. 💊 데일리 미션 (실천)
    DAILY_MISSION: {
        id: 'DAILY_MISSION',
        label: "데일리 미션",
        icon: "💊",
        neuro_trigger: "오늘 뭘 해야 운이 트일까?",
        style: 'default',
        sub_menus: [
            {
                id: "d_0",
                label: "⚡ 에너지 대시보드",
                desc: "오늘의 에너지 & 골든 타임",
                intent: "energy_dashboard_view"
            },
            {
                id: "d_1",
                label: "☀️ 오늘의 운세",
                desc: "일진 분석 + 조언",
                intent: "daily_fortune"
            },
            {
                id: "d_2",
                label: "🎯 3일 실천 플랜",
                desc: "뇌과학 기반 미션",
                intent: "action_plan_3day"
            },
            {
                id: "d_3",
                label: "🧘 명상 가이드",
                desc: "5분 마음 정화",
                intent: "meditation_guide"
            },
            {
                id: "d_4",
                label: "✅ 미션 기록",
                desc: "실천 이력 확인",
                intent: "mission_history"
            }
        ]
    },

    // 7. 정밀 사주 (Restored)
    SAJU_ANALYSIS: {
        id: 'SAJU_ANALYSIS',
        label: "사주분석",
        icon: "🔮",
        neuro_trigger: "운명의 설계도 확인",
        style: 'premium_purple', // 프리미엄 느낌 강조
        sub_menus: [
            {
                id: "s_0",
                label: "💎 사주 원국 분석",
                desc: "나의 타고난 설계도",
                intent: "saju_basic_analysis"
            },
            {
                id: "s_1",
                label: "🌊 대운의 흐름",
                desc: "10년 단위 인생 날씨",
                intent: "saju_daewoon_flow"
            },
            {
                id: "s_2",
                label: "💼 직업/사업운",
                desc: "성공을 부르는 타이밍",
                intent: "saju_career_detail"
            },
            {
                id: "s_3",
                label: "❤️ 결혼/연애운",
                desc: "나의 인연과 시기",
                intent: "saju_marriage_timing"
            }
        ]
    }
};

// ============== 추천 엔진 ==============

/**
 * 사용자 맞춤형 아이콘 추천 엔진
 * 사주 데이터를 분석해 가장 필요한 아이콘에 '추천' 배지를 달아줍니다.
 */
export function getRecommendedIcons(userProfile: any): IconRecommendation[] {
    const recommendations: IconRecommendation[] = [];

    if (!userProfile?.saju) return recommendations;

    // 1. 재성(돈)이 깨져있는 경우 -> 부의 그릇 추천
    if (userProfile.saju?.wealth_status === 'broken' || userProfile.saju?.wealth_status === 'weak') {
        recommendations.push({
            id: 'WEALTH',
            badge: '🔥 지금 필요',
            priority: 1
        });
    }

    // 2. 대운이 바뀌는 시기(교운기) -> 정밀 사주 추천
    if (userProfile.saju?.is_changing_period) {
        recommendations.push({
            id: 'SAJU_ANALYSIS',
            badge: '⏳ 중요 시기',
            priority: 1
        });
    }

    // 3. 관성(관계)이 충돌하는 경우 -> 관계의 멍 추천
    if (userProfile.saju?.relationship_clash) {
        recommendations.push({
            id: 'RELATIONSHIP',
            badge: '💔 치유 필요',
            priority: 2
        });
    }

    // 4. 식상(표현)이 막혀있는 경우 -> 천직 발견 추천
    if (userProfile.saju?.expression_blocked) {
        recommendations.push({
            id: 'CAREER',
            badge: '🔓 잠재력 해방',
            priority: 2
        });
    }

    // 5. 신경성이 높은 경우 (PersonalityProfiler 연동) -> 데일리 미션 추천
    if (userProfile.personality?.neuroticism > 60) {
        recommendations.push({
            id: 'DAILY_MISSION',
            badge: '🧘 마음 정화',
            priority: 3
        });
    }

    // 6. 대운 시작 첫 해 -> 성격분석 추천
    if (userProfile.saju?.daewoon_first_year) {
        recommendations.push({
            id: 'PERSONALITY_ANALYSIS',
            badge: '✨ 새로운 시작',
            priority: 2
        });
    }

    // [NEW] 바이오싱크는 항상 최우선 추천 (특허 기능 강조)
    recommendations.push({
        id: 'BIO_SYNC',
        badge: 'NEW',
        // priority 제거 -> DEFAULT_PRIORITY(11)을 따라 2번째 위치
    });

    // 우선순위로 정렬
    return recommendations.sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

/**
 * 메인 아이콘 목록 가져오기 (추천 배지 포함)
 */
export function getMainIconsWithRecommendations(userProfile?: any): (MainIcon & { badge?: string })[] {
    const icons = Object.values(ICON_DRILL_DOWN_MAP);
    const recommendations = userProfile ? getRecommendedIcons(userProfile) : [];

    // 1. 배지와 우선순위 매핑
    const mappedIcons = icons.map(icon => {
        const rec = recommendations.find(r => r.id === icon.id);
        return {
            ...icon,
            badge: rec?.badge,
            _priority: rec?.priority ?? 99 // 추천 없으면 뒤로 보냄
        };
    });

    // 2. 우선순위 정렬 (낮은 숫자가 먼저)
    // 추천된 것은 priority값 사용 (0~3), 추천 안 된 것은 기본 순서 유지

    const DEFAULT_PRIORITY: Record<string, number> = {
        'WEALTH': 10,              // 1. 부의 그릇
        'BIO_SYNC': 11,            // 2. 생체 연동 (New)
        'RELATIONSHIP': 12,        // 3. 관계의 멍
        'CAREER': 13,              // 4. 천직 발견
        'PERSONALITY_ANALYSIS': 14,// 5. 성격분석
        'DAILY_MISSION': 15,       // 6. 데일리 미션
        'SAJU_ANALYSIS': 16        // 7. 사주분석 (Restored)
    };

    return mappedIcons.sort((a, b) => {
        // 1. 추천 아이콘이면 우선순위 사용 (추천 우선순위는 보통 1~3, BIO_SYNC는 0)
        // 추천 안 된 것은 99였는데, 이걸 기본 우선순위로 대체

        const priorityA = a._priority !== 99 ? a._priority : (DEFAULT_PRIORITY[a.id] || 99);
        const priorityB = b._priority !== 99 ? b._priority : (DEFAULT_PRIORITY[b.id] || 99);

        return priorityA - priorityB;
    });
}

/**
 * 서브메뉴 아이템으로 AI 대화 시작 프롬프트 생성
 */
export function generateChatPromptFromIntent(intent: string, userProfile?: any): string {
    const prompts: Record<string, string> = {
        // 부의 그릇
        'shadow_exhaustion': '내가 돈을 벌어도 모이지 않는 이유가 뭘까요? 무의식적인 돈에 대한 패턴을 분석해주세요.',
        'gift_divine_will': '내 사주에서 재물을 모으는 가장 좋은 방법은 뭔가요?',
        'fortune_wealth_year': '올해 나의 재물운은 어떤가요? 월별로 알려주세요.',
        'coaching_wealth_action': '재물운을 높이기 위한 실천 과제를 주세요.',

        // 관계의 멍
        'shadow_conflict': '나는 왜 연애가 잘 안될까요? 반복되는 패턴이 있나요?',
        'saju_compatibility': '나에게 잘 맞는 이성의 사주 유형은 어떤 건가요?',
        'venus_sequence_defense': '나의 감정 방어기제가 뭔지 분석해주세요.',
        'relationship_type_quiz': '나의 연애 스타일을 분석해주세요.',

        // 천직 발견
        'innate_talent_analysis': '내 사주로 볼 때 타고난 재능과 강점은 뭔가요?',
        'career_path_direction': '나는 직장생활이 맞을까요, 사업이 맞을까요?',
        'burnout_escape_coaching': '일에 대한 의미를 잃었어요. 어떻게 해야 할까요?',
        'career_timing_analysis': '이직이나 승진하기 좋은 시기는 언제인가요?',

        // 성격분석 (명심코칭)
        'core_myeongsim_codes': '내 핵심 명심코드(천직/성장과제)를 분석해주세요. 다크코드, 뉴럴코드, 메타코드로 설명해주세요.',
        'dark_to_neural': '내 다크코드를 뉴럴코드로 바꾸는 행동 처방을 알려주세요.',
        'prosperity_key_analysis': '번영 열쇠(재물운 핵심 코드)로 내 재물 패턴을 분석해주세요.',
        'connection_code_analysis': '인연 코드(관계운 핵심 코드)로 내 관계 패턴을 분석해주세요.',

        // 데일리 미션
        'daily_fortune': '오늘 나의 운세는 어때요?',
        'action_plan_3day': '3일 실천 플랜을 만들어주세요.',
        'meditation_guide': '5분 명상 가이드를 해주세요.',
        'mission_history': '내가 완료한 미션들을 보여주세요.',

        // 정밀 사주
        'saju_basic_analysis': '내 사주 원국을 상세히 분석해주세요.',
        'saju_daewoon_flow': '내 대운의 흐름을 10년 단위로 분석해주세요.',
        'saju_career_detail': '내 직업운과 사업운을 심층 분석해주세요.',
        'saju_marriage_timing': '결혼 적령기와 배우자상을 분석해주세요.',
        'saju_yearly_monthly': '올해와 이달의 운세를 분석해주세요.',
        'premium_report_full': '80페이지 프리미엄 리포트를 생성해주세요.',

        // 통합 체크인 (System)
        'integral_checkin_view': '오늘의 통합 체크인을 시작합니다.'
    };

    return prompts[intent] || '이 주제에 대해 분석해주세요.';
}

/**
 * 스타일에 따른 CSS 클래스 반환 (프론트엔드용)
 */
export function getIconStyleClasses(style?: MainIcon['style']): string {
    switch (style) {
        case 'premium_gold':
            return 'border-2 border-amber-400 shadow-lg shadow-amber-400/20 bg-gradient-to-br from-amber-500/10 to-yellow-500/10';
        case 'premium_purple':
            return 'border-2 border-purple-400 shadow-lg shadow-purple-400/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10';
        case 'healing_green':
            return 'border-2 border-emerald-400 shadow-lg shadow-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10';
        default:
            return 'border border-white/10 bg-white/5';
    }
}
