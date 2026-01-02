/**
 * ReportGenerator.ts - 80페이지 프리미엄 리포트 조립 엔진
 * 
 * 목적: StaticTextDB의 텍스트 블록을 레고처럼 조립하여 
 *       구조화된 리포트 데이터(JSON)를 생성
 * 
 * 특징:
 *  - Lego Assembly Logic: 미리 준비된 텍스트 조립
 *  - AI Bridge: 블록 사이 연결은 AI가 채울 공간 확보
 *  - 확장성: 데이터 추가 시 로직 변경 불필요
 */

import type {
    ReportStructure,
    ReportSection,
    UserReportProfile,
    IljuData,
    TenGodData,
    MyungsimCode
} from '@/types/ReportTypes';

import {
    getIljuData,
    getTenGodData,
    getMyungsimCode,
    SAJU_ILJU,
    TEN_GODS,
    MYUNGSIM_CODES
} from '@/data/StaticTextDB';

// ============== 리포트 생성 엔진 ==============

/**
 * 프리미엄 리포트 생성
 * @param userProfile - 사용자 프로필 (사주/진키 분석 결과 포함)
 * @returns ReportStructure - 조립된 리포트 데이터
 */
export function generatePremiumReport(userProfile: UserReportProfile): ReportStructure {
    const now = new Date().toISOString();

    // 1. 일주 데이터 가져오기
    const iljuData = getIljuData(userProfile.saju.ilju) || getDefaultIlju();

    // 2. 주요 십성 데이터 가져오기 (점수 높은 순 2개)
    const topTenGods = userProfile.saju.ten_gods
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map(tg => getTenGodData(tg.name))
        .filter(Boolean) as TenGodData[];

    // 3. 명심코드 데이터 가져오기
    const geneKeyCodes = {
        lifeWork: getMyungsimCode(userProfile.gene_keys.life_work),
        pearl: getMyungsimCode(userProfile.gene_keys.pearl),
        attraction: getMyungsimCode(userProfile.gene_keys.attraction)
    };

    // 4. 리포트 구조 조립
    const report: ReportStructure = {
        metadata: {
            created_at: now,
            user_name: userProfile.name,
            birth_date: userProfile.birth_date,
            birth_time: userProfile.birth_time,
            gender: userProfile.gender,
            report_tier: 'PREMIUM'
        },

        sections: {
            // 표지 (1페이지)
            cover: buildCoverSection(userProfile),

            // 사주 원국 (2-4페이지)
            saju_chart: buildSajuChartSection(userProfile),

            // 일주 분석 (5-12페이지)
            ilju_analysis: buildIljuSection(iljuData),

            // 십성 분석 (13-22페이지)
            ten_gods_analysis: buildTenGodsSection(topTenGods),

            // 오행 분석 (23-28페이지)
            five_elements: buildFiveElementsSection(userProfile.saju.five_elements),

            // 대운 흐름 (29-38페이지)
            daewoon_flow: buildDaewoonSection(userProfile.saju.daewoon),

            // 세운 분석 (39-44페이지)
            yearly_fortune: buildYearlyFortuneSection(userProfile),

            // 명심코드 분석 (45-58페이지)
            myungsim_codes: buildMyungsimCodesSection(geneKeyCodes),

            // 직업/재물운 (59-66페이지)
            career_wealth: buildCareerWealthSection(iljuData, topTenGods, geneKeyCodes.pearl),

            // 관계/결혼운 (67-72페이지)
            relationship: buildRelationshipSection(iljuData, geneKeyCodes.attraction),

            // 실천 가이드 (73-78페이지)
            action_guide: buildActionGuideSection(geneKeyCodes),

            // 마무리 (79-80페이지)
            outro: buildOutroSection(userProfile)
        },

        workbook: {
            reflection_prompts: generateReflectionPrompts(geneKeyCodes.lifeWork),
            action_checklist: generateActionChecklist(geneKeyCodes),
            notes_space: true
        }
    };

    return report;
}

// ============== 섹션 빌더 함수들 ==============

function buildCoverSection(profile: UserReportProfile): ReportSection {
    return {
        id: 'cover',
        title: '표지',
        page_start: 1,
        content: {
            user_name: profile.name,
            report_title: `${profile.name}님의 운명 보고서`,
            subtitle: '당신의 영혼이 기록한 삶의 설계도',
            birth_info: `${profile.birth_date} ${profile.birth_time} ${profile.gender === '남' ? '男' : '女'}`,
            ilju_summary: `${profile.saju.day_master}일간 | ${profile.saju.ilju}일주`
        }
    };
}

function buildSajuChartSection(profile: UserReportProfile): ReportSection {
    return {
        id: 'saju_chart',
        title: '사주 원국',
        page_start: 2,
        content: {
            four_pillars: {
                year: profile.saju.year_pillar,
                month: profile.saju.month_pillar,
                day: profile.saju.day_pillar,
                hour: profile.saju.hour_pillar
            },
            five_elements: profile.saju.five_elements,
            element_chart_data: calculateElementBalance(profile.saju.five_elements),
            ten_gods_chart_data: profile.saju.ten_gods
        },
        ai_bridge_text: '' // AI가 채울 연결 문장
    };
}

function buildIljuSection(ilju: IljuData): ReportSection {
    return {
        id: 'ilju_analysis',
        title: '일주 분석 - 나의 핵심 기질',
        page_start: 5,
        content: {
            title: ilju.title,
            hanja: ilju.hanja,
            keywords: ilju.keywords,
            image_metaphor: ilju.image_metaphor,
            main_text: ilju.main_text,
            strengths: ilju.strengths,
            weaknesses: ilju.weaknesses,
            career_fit: ilju.career_fit,
            relationship_style: ilju.relationship_style,
            health_warning: ilju.health_warning,
            lucky_elements: ilju.lucky_elements
        },
        ai_bridge_text: '' // AI가 일주 특성을 사용자 상황에 맞게 연결
    };
}

function buildTenGodsSection(tenGods: TenGodData[]): ReportSection {
    return {
        id: 'ten_gods_analysis',
        title: '십성 분석 - 나의 성격과 운명 패턴',
        page_start: 13,
        content: {
            primary_ten_god: tenGods[0] ? {
                name: tenGods[0].name,
                title: tenGods[0].title,
                main_text: tenGods[0].main_text,
                positive_traits: tenGods[0].positive_traits,
                negative_traits: tenGods[0].negative_traits,
                career_tendency: tenGods[0].career_tendency,
                relationship_pattern: tenGods[0].relationship_pattern
            } : null,
            secondary_ten_god: tenGods[1] ? {
                name: tenGods[1].name,
                title: tenGods[1].title,
                main_text: tenGods[1].main_text
            } : null
        },
        ai_bridge_text: ''
    };
}

function buildFiveElementsSection(elements: Record<string, number>): ReportSection {
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    const percentages = {
        wood: Math.round((elements.wood / total) * 100),
        fire: Math.round((elements.fire / total) * 100),
        earth: Math.round((elements.earth / total) * 100),
        metal: Math.round((elements.metal / total) * 100),
        water: Math.round((elements.water / total) * 100)
    };

    // 가장 강한 오행과 약한 오행 분석
    const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];

    return {
        id: 'five_elements',
        title: '오행 분석 - 나의 에너지 균형',
        page_start: 23,
        content: {
            percentages,
            radar_chart_data: percentages,
            strongest_element: {
                name: translateElement(strongest[0]),
                percentage: strongest[1],
                meaning: getElementMeaning(strongest[0], 'strong')
            },
            weakest_element: {
                name: translateElement(weakest[0]),
                percentage: weakest[1],
                meaning: getElementMeaning(weakest[0], 'weak')
            },
            balance_advice: getBalanceAdvice(strongest[0], weakest[0])
        },
        ai_bridge_text: ''
    };
}

function buildDaewoonSection(daewoon: UserReportProfile['saju']['daewoon']): ReportSection {
    return {
        id: 'daewoon_flow',
        title: '대운 흐름 - 인생의 계절',
        page_start: 29,
        content: {
            periods: daewoon.map(period => ({
                age_range: `${period.age_start}세 ~ ${period.age_end}세`,
                pillar: `${period.heavenly_stem}${period.earthly_branch}`,
                theme: period.theme,
                opportunities: period.opportunities,
                challenges: period.challenges,
                advice: period.advice
            })),
            timeline_chart_data: daewoon
        },
        ai_bridge_text: ''
    };
}

function buildYearlyFortuneSection(profile: UserReportProfile): ReportSection {
    const currentYear = new Date().getFullYear();

    return {
        id: 'yearly_fortune',
        title: `${currentYear}년 세운 분석`,
        page_start: 39,
        content: {
            year: currentYear,
            summary: `${profile.name}님의 ${currentYear}년은...`,
            monthly_overview: generateMonthlyOverview(profile),
            key_months: {
                best: ['4월', '8월'],
                caution: ['2월', '10월']
            },
            focus_areas: ['재물운', '관계운', '건강운']
        },
        ai_bridge_text: '' // AI가 세운 분석 내용 작성
    };
}

function buildMyungsimCodesSection(codes: {
    lifeWork: MyungsimCode | null;
    pearl: MyungsimCode | null;
    attraction: MyungsimCode | null;
}): ReportSection {
    return {
        id: 'myungsim_codes',
        title: '명심코드 분석 - 영혼의 설계도',
        page_start: 45,
        content: {
            life_work: codes.lifeWork ? {
                number: codes.lifeWork.number,
                title: codes.lifeWork.title,
                keywords: codes.lifeWork.keywords,
                dark_code: codes.lifeWork.dark_code,
                neural_code: codes.lifeWork.neural_code,
                meta_code: codes.lifeWork.meta_code,
                main_insight: codes.lifeWork.main_insight,
                life_lesson: codes.lifeWork.life_lesson
            } : null,
            pearl: codes.pearl ? {
                number: codes.pearl.number,
                title: codes.pearl.title,
                focus: '재물과 풍요의 코드',
                dark_code: codes.pearl.dark_code,
                neural_code: codes.pearl.neural_code
            } : null,
            attraction: codes.attraction ? {
                number: codes.attraction.number,
                title: codes.attraction.title,
                focus: '관계와 끌림의 코드',
                dark_code: codes.attraction.dark_code,
                neural_code: codes.attraction.neural_code
            } : null
        },
        ai_bridge_text: ''
    };
}

function buildCareerWealthSection(
    ilju: IljuData,
    tenGods: TenGodData[],
    pearlCode: MyungsimCode | null
): ReportSection {
    return {
        id: 'career_wealth',
        title: '직업/재물운 심층 분석',
        page_start: 59,
        content: {
            career_from_ilju: {
                fit_jobs: ilju.career_fit,
                work_style: ilju.main_text?.substring(0, 200) + '...' || '일주 분석을 통해 확인됩니다.'
            },
            career_from_ten_gods: tenGods.map(tg => ({
                name: tg.name,
                tendency: tg.career_tendency
            })),
            wealth_pattern: pearlCode ? {
                code_number: pearlCode.number,
                dark_pattern: pearlCode.dark_code,
                growth_pattern: pearlCode.neural_code,
                daily_practice: pearlCode.daily_practice
            } : null,
            actionable_advice: [
                '직장 vs 사업 적합도 분석',
                '재물 누수 방지 전략',
                '풍요를 끌어당기는 마인드셋'
            ]
        },
        ai_bridge_text: ''
    };
}

function buildRelationshipSection(
    ilju: IljuData,
    attractionCode: MyungsimCode | null
): ReportSection {
    return {
        id: 'relationship',
        title: '관계/결혼운 심층 분석',
        page_start: 67,
        content: {
            relationship_style: ilju.relationship_style,
            ideal_partner: {
                description: '당신에게 맞는 파트너는...',
                compatible_elements: ilju.lucky_elements
            },
            attraction_pattern: attractionCode ? {
                code_number: attractionCode.number,
                dark_pattern: attractionCode.dark_code,
                growth_pattern: attractionCode.neural_code
            } : null,
            marriage_timing_hint: '결혼/연애 최적 시기는 대운 분석을 참고하세요.',
            relationship_healing: [
                '과거 관계 패턴 인식하기',
                '감정 방어벽 내려놓기',
                '건강한 경계 설정하기'
            ]
        },
        ai_bridge_text: ''
    };
}

function buildActionGuideSection(codes: {
    lifeWork: MyungsimCode | null;
    pearl: MyungsimCode | null;
    attraction: MyungsimCode | null;
}): ReportSection {
    const practices: string[] = [];

    if (codes.lifeWork?.daily_practice) practices.push(codes.lifeWork.daily_practice);
    if (codes.pearl?.daily_practice) practices.push(codes.pearl.daily_practice);
    if (codes.attraction?.daily_practice) practices.push(codes.attraction.daily_practice);

    return {
        id: 'action_guide',
        title: '실천 가이드 - 오늘부터의 변화',
        page_start: 73,
        content: {
            now_action: {
                title: '지금 당장 (30초)',
                action: '눈을 감고 심호흡 3번. "나는 변화할 준비가 되었다"고 선언하세요.'
            },
            today_action: {
                title: '오늘 하루',
                action: practices[0] || '하늘을 한 번 올려다보고, 감사한 것 하나를 떠올려보세요.'
            },
            week_action: {
                title: '이번 주',
                action: practices[1] || '일주일간 감사 일기를 써보세요. 매일 3가지씩.'
            },
            month_action: {
                title: '이번 달',
                action: practices[2] || '한 달 동안 나를 가장 빛나게 하는 한 가지에 집중하세요.'
            },
            habit_building: [
                '작은 성공 경험 쌓기',
                '실천 기록으로 동기부여',
                '완벽하지 않아도 괜찮아요'
            ]
        },
        ai_bridge_text: ''
    };
}

function buildOutroSection(profile: UserReportProfile): ReportSection {
    return {
        id: 'outro',
        title: '마무리 - 당신의 이야기는 이제 시작입니다',
        page_start: 79,
        content: {
            closing_message: `
${profile.name}님,

이 리포트는 단지 지도일 뿐입니다.
진짜 여행은 당신의 발걸음으로 완성됩니다.

당신의 운명은 정해진 것이 아닙니다.
오늘의 선택이 내일의 운명을 만듭니다.

작은 시작이 큰 변화를 만듭니다.
오늘, 한 발자국만 내딛어 보세요.

명심코칭이 당신의 여정을 응원합니다.
            `.trim(),
            signature: '명심코칭 AI Coach',
            date: new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
    };
}

// ============== 헬퍼 함수들 ==============

function getDefaultIlju(): IljuData {
    return Object.values(SAJU_ILJU)[0] || {
        id: 'default',
        name: '미정',
        hanja: '',
        title: '기본 일주 분석',
        keywords: [],
        element: '',
        yin_yang: '양' as const,
        image_metaphor: '',
        main_text: '일주 분석 데이터를 불러오지 못했습니다.',
        strengths: [],
        weaknesses: [],
        career_fit: [],
        relationship_style: '',
        health_warning: '',
        lucky_elements: { color: '', number: '', direction: '' }
    };
}

function calculateElementBalance(elements: Record<string, number>) {
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    return Object.entries(elements).map(([name, value]) => ({
        name: translateElement(name),
        value,
        percentage: Math.round((value / total) * 100)
    }));
}

function translateElement(element: string): string {
    const map: Record<string, string> = {
        wood: '목(木)',
        fire: '화(火)',
        earth: '토(土)',
        metal: '금(金)',
        water: '수(水)'
    };
    return map[element] || element;
}

function getElementMeaning(element: string, state: 'strong' | 'weak'): string {
    const meanings: Record<string, Record<string, string>> = {
        wood: {
            strong: '성장과 창의성이 넘칩니다. 새로운 시작을 두려워하지 마세요.',
            weak: '새로운 도전에 소극적일 수 있습니다. 작은 것부터 시작해보세요.'
        },
        fire: {
            strong: '열정과 표현력이 뛰어납니다. 그 에너지를 긍정적으로 발산하세요.',
            weak: '열정이 식기 쉽습니다. 당신을 설레게 하는 것을 찾아보세요.'
        },
        earth: {
            strong: '안정감과 신뢰를 줍니다. 그 기반 위에 더 큰 것을 쌓을 수 있습니다.',
            weak: '변화에 불안해질 수 있습니다. 작은 루틴으로 중심을 잡으세요.'
        },
        metal: {
            strong: '결단력과 실행력이 뛰어납니다. 그 칼날을 올바른 곳에 사용하세요.',
            weak: '결정을 미루는 경향이 있습니다. 완벽하지 않아도 시작하세요.'
        },
        water: {
            strong: '지혜와 직관이 뛰어납니다. 그 통찰력을 믿으세요.',
            weak: '깊이 생각하다 행동이 늦을 수 있습니다. 가끔은 직관을 따르세요.'
        }
    };
    return meanings[element]?.[state] || '';
}

function getBalanceAdvice(strongest: string, weakest: string): string {
    return `${translateElement(strongest)}의 에너지가 강하고, ${translateElement(weakest)}의 에너지가 부족합니다. 
${translateElement(weakest)}의 색상(${getElementColor(weakest)})이나 방향(${getElementDirection(weakest)})을 활용하면 균형을 맞출 수 있습니다.`;
}

function getElementColor(element: string): string {
    const colors: Record<string, string> = {
        wood: '녹색/청색', fire: '빨간색/주황색', earth: '노란색/갈색',
        metal: '흰색/금색', water: '검은색/파란색'
    };
    return colors[element] || '';
}

function getElementDirection(element: string): string {
    const directions: Record<string, string> = {
        wood: '동쪽', fire: '남쪽', earth: '중앙',
        metal: '서쪽', water: '북쪽'
    };
    return directions[element] || '';
}

function generateMonthlyOverview(profile: UserReportProfile) {
    // 간략한 월별 개요 (실제로는 더 정교한 계산 필요)
    return Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        luck_score: Math.floor(Math.random() * 40) + 60, // 60-100 범위
        focus: i % 3 === 0 ? '재물' : i % 3 === 1 ? '관계' : '건강'
    }));
}

function generateReflectionPrompts(lifeWorkCode: MyungsimCode | null): string[] {
    const basePrompts = [
        '나의 가장 큰 강점은 무엇인가요?',
        '반복되는 삶의 패턴이 있다면 무엇인가요?',
        '3년 후의 나는 어떤 모습이길 바라나요?'
    ];

    if (lifeWorkCode?.life_lesson) {
        basePrompts.push(lifeWorkCode.life_lesson);
    }

    return basePrompts;
}

function generateActionChecklist(codes: {
    lifeWork: MyungsimCode | null;
    pearl: MyungsimCode | null;
    attraction: MyungsimCode | null;
}): string[] {
    const checklist: string[] = [
        '□ 매일 아침 감사한 것 3가지 적기',
        '□ 주 1회 나를 위한 시간 갖기',
        '□ 한 달에 한 번 새로운 것 시도하기'
    ];

    if (codes.lifeWork?.daily_practice) {
        checklist.push(`□ ${codes.lifeWork.daily_practice}`);
    }
    if (codes.pearl?.daily_practice) {
        checklist.push(`□ ${codes.pearl.daily_practice}`);
    }

    return checklist;
}

// ============== 테스트/데모 함수 ==============

/**
 * 테스트용 가상 사용자 프로필 생성
 */
export function createDemoUserProfile(): UserReportProfile {
    return {
        name: '이경윤',
        birth_date: '1990-05-15',
        birth_time: '14:30',
        gender: '여',
        saju: {
            year_pillar: { stem: '경', branch: '오' },
            month_pillar: { stem: '신', branch: '사' },
            day_pillar: { stem: '신', branch: '사' },
            hour_pillar: { stem: '을', branch: '미' },
            ilju: 'SIN_SA',
            day_master: '신',
            ten_gods: [
                { name: 'PYEONGWAN', score: 85 },
                { name: 'JAESUNG', score: 72 },
                { name: 'SIKSANG', score: 68 },
                { name: 'INSUNG', score: 45 },
                { name: 'BIGYEON', score: 30 }
            ],
            five_elements: {
                wood: 2,
                fire: 4,
                earth: 2,
                metal: 5,
                water: 1
            },
            daewoon: [
                {
                    age_start: 1,
                    age_end: 10,
                    heavenly_stem: '임',
                    earthly_branch: '오',
                    theme: '성장의 시기',
                    opportunities: ['학습 능력 향상', '창의성 발현'],
                    challenges: ['건강 관리 필요'],
                    advice: '기초를 튼튼히 다지세요.'
                },
                {
                    age_start: 11,
                    age_end: 20,
                    heavenly_stem: '계',
                    earthly_branch: '미',
                    theme: '정체성 확립',
                    opportunities: ['진로 탐색', '인맥 형성'],
                    challenges: ['감정 기복'],
                    advice: '다양한 경험을 쌓으세요.'
                },
                {
                    age_start: 21,
                    age_end: 30,
                    heavenly_stem: '갑',
                    earthly_branch: '신',
                    theme: '도약의 시기',
                    opportunities: ['커리어 성장', '재물 운 상승'],
                    challenges: ['과로 주의'],
                    advice: '기회를 잡되, 건강을 챙기세요.'
                },
                {
                    age_start: 31,
                    age_end: 40,
                    heavenly_stem: '을',
                    earthly_branch: '유',
                    theme: '안정과 결실',
                    opportunities: ['결혼/가정 형성', '전문성 확립'],
                    challenges: ['관계 갈등'],
                    advice: '균형 잡힌 삶을 추구하세요.'
                }
            ]
        },
        gene_keys: {
            life_work: 40,
            evolution: 22,
            radiance: 55,
            purpose: 1,
            pearl: 40,
            attraction: 22,
            iq: 55,
            eq: 1,
            sq: 40
        }
    };
}

/**
 * 데모 리포트 생성 및 콘솔 출력
 */
export function runDemoReport(): void {
    const demoProfile = createDemoUserProfile();
    const report = generatePremiumReport(demoProfile);

    console.log('='.repeat(60));
    console.log('📚 프리미엄 리포트 생성 완료');
    console.log('='.repeat(60));
    console.log(`사용자: ${report.metadata.user_name}`);
    console.log(`생성일: ${report.metadata.created_at}`);
    console.log(`티어: ${report.metadata.report_tier}`);
    console.log('');
    console.log('📑 섹션 목록:');
    Object.entries(report.sections).forEach(([key, section]) => {
        console.log(`  - ${section.title} (Page ${section.page_start})`);
    });
    console.log('');
    console.log('📋 워크북 포함:', report.workbook?.reflection_prompts.length, '개 성찰 질문');
    console.log('='.repeat(60));

    // JSON 출력 (디버깅용)
    // console.log(JSON.stringify(report, null, 2));
}
