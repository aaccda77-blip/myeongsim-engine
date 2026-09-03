'use client';

import { useMemo } from 'react';
import { useReportStore } from '@/store/useReportStore';
import { useSubscription } from '@/hooks/useSubscription';
import { getTodayDailyPillar } from '@/utils/SajuCalculator';

export interface DashboardViewModel {
    user: {
        name: string;
        birthDate: string;
        hasProfile: boolean;
        dayMaster: string;
    };
    flow: {
        score: number;
        stateTitle: string;
        shortDesc: string;
        advice: string;
        levelLabel: string;
    };
    dailyInsight: {
        pointTitle: string;
        pointDesc: string;
        keywords: string[];
        dailyGanji: string;
    };
    coaching: {
        question: string;
        actionText: string;
        prompt: string;
    };
    coreTraits: {
        summary: string;
        strengths: string[];
        cautions: string[];
        recommendation: string;
    };
    vip: {
        isVip: boolean;
    };
    action: {
        title: string;
        description: string;
    };
    streak: {
        days: number;
        weekStatus: boolean[];
    };
    quickCoach: {
        question: string;
        options: string[];
    };
}

export function useDashboardViewModel(): DashboardViewModel {
    const { reportData } = useReportStore();
    const { isExpired } = useSubscription();

    // 1. 사용자 정보
    const user = useMemo(() => {
        const name = reportData?.userName || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : null) || '명심가';
        const birthDate = reportData?.birthDate || '';
        const hasProfile = Boolean(birthDate);
        
        // 일간 추출
        const dayMaster = (reportData?.saju as any)?.dayMaster || (reportData?.saju as any)?.fourPillars?.day?.gan || '금(金)';

        return { name, birthDate, hasProfile, dayMaster };
    }, [reportData]);

    // 2. 일진 기반 FLOW 데이터 (기존 SajuCalculator 일진 계산 공유)
    const dailyPillar = useMemo(() => {
        try {
            return getTodayDailyPillar();
        } catch (e) {
            return { gan: '기', zhi: '묘', ganElement: '토', zhiElement: '목' };
        }
    }, []);

    // 3. FLOW 수치 및 상태 (절대 로직을 중복 계산하지 않고 정적인 규칙과 일진 오행으로 단순 매핑)
    const flow = useMemo(() => {
        // 일진 기반 점수 산출
        const zhi = dailyPillar.zhi || '묘';
        const scoreMap: Record<string, { score: number; title: string; desc: string; advice: string }> = {
            '자': { score: 72, title: '새로운 영감이 피어나는 날', desc: '마음의 수면이 고요해지며 깊은 통찰이 찾아옵니다.', advice: '중요한 결정을 서두르지 말고 차분히 정리해 보세요.' },
            '축': { score: 65, title: '단단한 내실을 다지는 날', desc: '주변의 소음보다 내면의 기준에 집중하기 좋습니다.', advice: '작은 일도 정성껏 마무리하며 에너지를 비축하세요.' },
            '인': { score: 84, title: '추진력과 용기가 솟는 날', desc: '새로운 아이디어를 구체적인 행동으로 옮기기 좋습니다.', advice: '망설였던 계획에 첫 발걸음을 가볍게 내디뎌 보세요.' },
            '묘': { score: 88, title: '새로운 아이디어가 잘 떠오르는 날', desc: '기존의 틀을 벗어나 새로운 방식으로 생각하기 좋습니다.', advice: '머릿속 아이디어를 한 줄 메모로 남겨두세요.' },
            '진': { score: 78, title: '변화의 흐름을 타는 날', desc: '상황의 변수를 유연하게 받아들이면 성과가 커집니다.', advice: '계획이 조금 틀어져도 흐름에 가볍게 맡겨보세요.' },
            '사': { score: 82, title: '열정과 집중력이 빛나는 날', desc: '핵심 과제에 몰입하여 결과를 내기에 가장 적합합니다.', advice: '주변의 시선보다 내 목표 하나에만 집중하세요.' },
            '오': { score: 85, title: '에너지가 정점에 달하는 날', desc: '사람들과의 소통과 표현이 자연스럽게 확장됩니다.', advice: '밝고 따뜻한 말 한마디로 주변을 북돋워 주세요.' },
            '미': { score: 70, title: '부드러운 조화와 포용의 날', desc: '마찰을 줄이고 협력과 공감을 이끌어내기 좋습니다.', advice: '내 주장을 내세우기 전에 상대방의 말을 먼저 경청하세요.' },
            '신': { score: 80, title: '명확한 결단이 쉬워지는 날', desc: '복잡했던 생각의 매듭을 깔끔하게 정리할 수 있습니다.', advice: '미뤄두었던 정리와 결정을 오늘 시도해 보세요.' },
            '유': { score: 86, title: '결실과 성취의 기운이 깃든 날', desc: '그동안 노력해 온 일의 의미와 성과가 뚜렷해집니다.', advice: '나 자신에게 수고했다는 진심 어린 칭찬을 건네보세요.' },
            '술': { score: 68, title: '마음의 중심축을 확인하는 날', desc: '외부 유혹에 흔들리지 않고 원칙을 지키기에 좋습니다.', advice: '나만의 소신과 우선순위를 다시금 점검해 보세요.' },
            '해': { score: 75, title: '깊은 사색과 회복의 날', desc: '정신의 배터리를 충전하고 내일을 준비하기 좋습니다.', advice: '오늘 밤은 스마트폰을 내려놓고 일찍 휴식을 취하세요.' },
        };

        const target = scoreMap[zhi] || { score: 78, title: '균형 잡힌 평정심의 날', desc: '내면의 중심이 든든하게 유지됩니다.', advice: '있는 그대로의 나를 따뜻하게 인정해 주세요.' };

        return {
            score: target.score,
            stateTitle: target.title,
            shortDesc: target.desc,
            advice: target.advice,
            levelLabel: target.score >= 80 ? 'HIGH FLOW' : 'STABLE FLOW'
        };
    }, [dailyPillar]);

    // 4. 오늘의 핵심 인사이트
    const dailyInsight = useMemo(() => {
        return {
            pointTitle: '오늘의 포인트',
            pointDesc: flow.shortDesc,
            keywords: ['관점 전환', '아이디어', '차분한 실행'],
            dailyGanji: `${dailyPillar.gan}${dailyPillar.zhi}일`
        };
    }, [flow, dailyPillar]);

    // 5. 오늘의 코칭 질문
    const coaching = useMemo(() => {
        return {
            question: '오늘 하나만 바꾼다면, 무엇을 가장 먼저 바꾸고 싶나요?',
            actionText: '코칭 시작하기',
            prompt: `${user.name}님의 오늘 FLOW 지수(${flow.score}점, ${flow.stateTitle})를 바탕으로, 오늘 하루를 가장 차분하고 주체적으로 보낼 수 있는 1:1 맞춤 코칭을 시작합니다.`
        };
    }, [user.name, flow]);

    // 6. 핵심 성향 리포트 요약
    const coreTraits = useMemo(() => {
        return {
            summary: `${user.name}님은 본질을 빠르게 꿰뚫어 보고, 소음 속에서도 새로운 구조를 만들어내는 유형입니다.`,
            strengths: ['01 새로운 관점 포착', '02 신속하고 명확한 판단', '03 구조화 및 실행력'],
            cautions: ['과도한 생각과 인지 과열', '완벽주의로 인한 시작 지연'],
            recommendation: '결정을 내리기 전에 심호흡 한 번으로 시야를 넓혀보세요.'
        };
    }, [user.name]);

    const vip = useMemo(() => {
        let isVip = false;
        if (typeof window !== 'undefined') {
            const isPaid = localStorage.getItem('myeongsim_paid_user') === 'true';
            const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true';
            const isBookVerified = localStorage.getItem('myeongsim_book_verified') === 'true';
            isVip = Boolean((isPaid || isSmartVip || isBookVerified) && !isExpired);
        }
        return { isVip };
    }, [isExpired]);

    // 7. 오늘 추천 행동 (Wearable Action)
    const action = useMemo(() => {
        return {
            title: '오늘 하나만 한다면',
            description: '익숙한 방법 대신 한 가지 새로운 방법을 시도해보세요.'
        };
    }, []);

    // 8. 연속 기록 (Wearable Streak)
    const streak = useMemo(() => {
        return {
            days: 7,
            weekStatus: [true, true, true, true, true, false, false]
        };
    }, []);

    // 9. 퀵 코칭 (Wearable Quick Coach)
    const quickCoach = useMemo(() => {
        return {
            question: '지금 가장 바꾸고 싶은 것은?',
            options: ['일', '관계', '마음', '건강']
        };
    }, []);

    return {
        user,
        flow,
        dailyInsight,
        coaching,
        coreTraits,
        vip,
        action,
        streak,
        quickCoach
    };
}
