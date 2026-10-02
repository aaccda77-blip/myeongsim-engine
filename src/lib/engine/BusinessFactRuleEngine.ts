/**
 * BusinessFactRuleEngine.ts
 * 
 * [명심 비즈니스 아키텍트 v0.1 판정 엔진]
 * 1. Business Fact Extractor: 사용자 입력/답변 ➔ 표준 JSON Fact 구조화
 * 2. Deterministic Rule Engine: Fact 기반 공식 Master DB 필터링 및 점수화
 * 3. Verification Gate: DB_VALUE_ONLY 덮어쓰기 & 미존재 코드 원천 차단
 * 4. 사주와 업종코드의 완전한 분리 원칙 보장
 */

import {
    OFFICIAL_INDUSTRY_MASTER_DATA,
    OFFICIAL_MASTER_META,
    OfficialIndustryCodeRecord,
    verifyOfficialCodeExists,
    getOfficialIndustryRecord,
    enforceOfficialMasterData,
    MasterDbMetaInfo
} from '@/data/OfficialIndustryMasterDB';

// ============================================================================
// 1. 단일 입력 인터페이스 (Single Intake Input)
// ============================================================================
export interface SingleIntakeInput {
    birth: {
        calendar: 'solar' | 'lunar';
        date: string;          // "YYYY-MM-DD"
        time: string;          // "HH:mm"
        time_known: boolean;   // 출생시간 모름 방어
        birth_region?: string;
    };
    business_description: string; // 예: "AI가 사용자의 생년월일과 고민을 받아 분석하고 맞춤 리포트를 제공합니다."
    customer: string;             // 예: "개인 및 기업"
    revenue_description: string;  // 예: "AI 리포트 건별 결제와 월 구독, 기업 컨설팅"
    future_plan?: string;         // 예: "전자책과 교육 과정도 판매 예정"
}

// ============================================================================
// 2. 사주 결정론적 계산 결과 인터페이스 (LLM 임의생성 금지)
// ============================================================================
export interface SajuCalculationProfile {
    saju_engine_version: string;
    birth_time_assumption: 'exact' | 'approximate' | 'unknown';
    interpretation_limit?: string; // "hour_pillar_not_used"
    pillars: {
        year: string;
        month: string;
        day: string;
        hour?: string;
    };
    saju_summary_text: string;
    business_coaching_tags: string[]; // ["knowledge_structuring", "systemization", "one_to_many", "specialist_positioning"]
    guidance: {
        role: 'coaching_personalization';
        summary: string;
        recommended_model_archetype: string;
    };
}

// ============================================================================
// 3. Business Fact Extractor Schema (가장 중요한 사업 실질 구조)
// ============================================================================
export interface BusinessProductItem {
    type: 'saas' | 'generated_report' | 'human_consulting' | 'digital_download' | 'physical_goods' | 'training_seminar';
    description: string;
    paid: boolean;
}

export interface BusinessFactSchema {
    primary_value: string;               // 예: "AI 자동 맞춤 분석"
    products: BusinessProductItem[];
    customer_types: ('B2C' | 'B2B' | 'B2G')[];
    delivery_modes: ('web' | 'online_report' | 'human_consulting' | 'digital_download' | 'delivery')[];
    revenue_models: ('subscription' | 'one_time_payment' | 'consulting_fee' | 'goods_sale')[];
    software_is_product: boolean;        // 소프트웨어 사용권 자체가 유료 상품인가?
    human_service: boolean;              // 사람이 직접 자문/용역을 제공하는가?
    consulting_revenue_share_percent?: number; // 컨설팅 예상 매출 비중 (%)
    physical_goods: boolean;             // 실물 택배 배송 상품이 있는가?
    publishing: boolean;                 // 정식 출판(도서/전자책 ISBN 등록) 활동이 있는가? (계획 단계는 false)
    education: boolean;                  // 기업 출강, 세미나, 교육 훈련 활동이 있는가?
    fortune_telling_claim: boolean;      // 사주/명리 프레임을 서비스 구성에 활용하는가?
    future_prediction_claim: boolean;    // "올해 재물운·사업 성공시기·길흉화복 미래 예측"으로 판매 표방하는가?
}

export const DEFAULT_BUSINESS_FACT: BusinessFactSchema = {
    primary_value: 'AI 자동 맞춤 분석 리포트 및 비즈니스 아키텍처',
    products: [
        { type: 'saas', description: '웹 기반 AI 진단 서비스', paid: true },
        { type: 'generated_report', description: '자동 생성 맞춤 리포트', paid: true },
        { type: 'human_consulting', description: '창업자 대상 경영 자문', paid: true }
    ],
    customer_types: ['B2C', 'B2B'],
    delivery_modes: ['web', 'online_report', 'human_consulting'],
    revenue_models: ['subscription', 'one_time_payment', 'consulting_fee'],
    software_is_product: true,
    human_service: true,
    consulting_revenue_share_percent: 20,
    physical_goods: false,
    publishing: false,
    education: false,
    fortune_telling_claim: true,
    future_prediction_claim: false
};

// ============================================================================
// 4. 7대 핵심 문진 정의 (인터랙션용)
// ============================================================================
export interface SevenQuestionItem {
    id: number;
    title: string;
    question: string;
    description: string;
    options: { label: string; value: any; factPatch: Partial<BusinessFactSchema> }[];
}

export const SEVEN_CORE_QUESTIONS: SevenQuestionItem[] = [
    {
        id: 1,
        title: '핵심 과금 대상',
        question: '고객이 돈을 내는 핵심 대상은 무엇인가요?',
        description: '소프트웨어/플랫폼 이용권인지, 자동 분석 결과물인지, 아니면 전문가의 직접 자문인지 선택합니다.',
        options: [
            {
                label: 'AI 플랫폼 이용권 & 자동 분석 결과물 (SaaS/리포트)',
                value: 'software_report',
                factPatch: { software_is_product: true, primary_value: 'AI 자동 맞춤 분석' }
            },
            {
                label: '전문가 직접 1:1 자문 & 전략 컨설팅',
                value: 'human_consulting',
                factPatch: { human_service: true, primary_value: '전문 경영·전략 자문 용역' }
            },
            {
                label: '실물 제품 또는 교구재·다이어리',
                value: 'physical_goods',
                factPatch: { physical_goods: true, primary_value: '실물 웰니스 제품 소매' }
            }
        ]
    },
    {
        id: 2,
        title: '소프트웨어 vs 결과물',
        question: '서비스가 AI/프로그램 사용권인가요, 결과물 파일인가요?',
        description: '고객이 웹 사이트/앱에서 직접 시스템을 이용하는지, 완성된 리포트 파일을 다운받는지 확인합니다.',
        options: [
            {
                label: '웹/앱 접속형 온라인 자동 서비스 (SaaS/웹)',
                value: 'web_saas',
                factPatch: { software_is_product: true, delivery_modes: ['web', 'online_report'] }
            },
            {
                label: '이메일/다운로드용 전자책 및 파일 (디지털 콘텐츠)',
                value: 'download_only',
                factPatch: { software_is_product: false, delivery_modes: ['online_report', 'digital_download'] }
            }
        ]
    },
    {
        id: 3,
        title: '사람의 직접 개입 여부',
        question: '사람(전문가)이 직접 컨설팅/코칭 서비스를 제공하나요?',
        description: '100% 자동 시스템인지, 아니면 대표/전문가의 직접 상담 및 기업 자문이 포함되는지 여부입니다.',
        options: [
            {
                label: '아니오 (100% 알고리즘 자동 시스템)',
                value: 'fully_automated',
                factPatch: { human_service: false, consulting_revenue_share_percent: 0 }
            },
            {
                label: '예, 1:1 맞춤 자문이 일부 포함됨 (예상 매출 10~30%)',
                value: 'partial_consulting',
                factPatch: { human_service: true, consulting_revenue_share_percent: 25 }
            },
            {
                label: '예, 고단가 기업 자문이 핵심 매출임 (예상 매출 50% 이상)',
                value: 'major_consulting',
                factPatch: { human_service: true, consulting_revenue_share_percent: 60 }
            }
        ]
    },
    {
        id: 4,
        title: '주 타겟 고객',
        question: '주된 고객은 개인인가요, 기업인가요?',
        description: '일반 소비자(B2C)와 기업/스타트업(B2B) 비중을 파악합니다.',
        options: [
            {
                label: '개인 고객 중심 (B2C)',
                value: 'b2c',
                factPatch: { customer_types: ['B2C'] }
            },
            {
                label: '개인과 기업 동시 타겟 (B2C + B2B)',
                value: 'hybrid',
                factPatch: { customer_types: ['B2C', 'B2B'] }
            },
            {
                label: '기업/공공기관 전문 타겟 (B2B / B2G)',
                value: 'b2b',
                factPatch: { customer_types: ['B2B', 'B2G'] }
            }
        ]
    },
    {
        id: 5,
        title: '수익 모델 형태',
        question: '월 정기 구독인가요, 건별 1회성 결제인가요?',
        description: '수익의 지속 형태를 판별합니다.',
        options: [
            {
                label: '월 정기 구독 + 건별 리포트 결제 복합',
                value: 'sub_and_onetime',
                factPatch: { revenue_models: ['subscription', 'one_time_payment'] }
            },
            {
                label: '1회성 열람/다운로드 건별 결제 위주',
                value: 'onetime_only',
                factPatch: { revenue_models: ['one_time_payment'] }
            },
            {
                label: '프로젝트 단위 고단가 자문료 (용역비)',
                value: 'consulting_fee',
                factPatch: { revenue_models: ['consulting_fee'] }
            }
        ]
    },
    {
        id: 6,
        title: '출판 및 부가 판매 계획',
        question: '전자책·단행본(출판) 또는 강의·실물상품을 판매하나요?',
        description: '“앞으로 책을 낼 생각”은 배제하고 현재 실제 영위 중인 활동만 체크합니다.',
        options: [
            {
                label: '현재는 온라인 자동 진단 및 리포트에 집중',
                value: 'none_yet',
                factPatch: { publishing: false, physical_goods: false, education: false }
            },
            {
                label: '오프라인/온라인 세미나 및 교육 강의 진행 중',
                value: 'education_active',
                factPatch: { education: true, publishing: false, physical_goods: false }
            },
            {
                label: '출판사 신고 완료 및 ISBN 도서/전자책 정식 발행 중',
                value: 'publishing_active',
                factPatch: { publishing: true }
            },
            {
                label: '실물 다이어리/굿즈 온라인 판매 및 배송 중',
                value: 'goods_active',
                factPatch: { physical_goods: true }
            }
        ]
    },
    {
        id: 7,
        title: '사주 프레임 표방 방식',
        question: '사주를 자기이해·코칭에 사용하나요, 미래 예측으로 판매하나요?',
        description: '점술업(930921, 창업감면 제외)과 온라인정보제공업(724000, 감면 적격)을 가르는 결정적 법적 기준입니다.',
        options: [
            {
                label: '자기이해·인지행동·HR 역량 코칭 프레임으로 활용 (미래 예측 판매 안 함)',
                value: 'coaching_framework',
                factPatch: { fortune_telling_claim: true, future_prediction_claim: false }
            },
            {
                label: '사주를 전혀 사용하지 않는 순수 비즈니스/창업 진단 솔루션',
                value: 'pure_business',
                factPatch: { fortune_telling_claim: false, future_prediction_claim: false }
            },
            {
                label: '올해 사업운·재물운·미래 성공시기를 사주로 예측하여 판매',
                value: 'prediction_sales',
                factPatch: { fortune_telling_claim: true, future_prediction_claim: true }
            }
        ]
    }
];

// ============================================================================
// 5. 최종 API 반환 형식 계약 (Final API Contract)
// ============================================================================
export type EvaluationStatus = 'VERIFIED' | 'CLARIFICATION_REQUIRED' | 'MANUAL_REVIEW';

export interface FinalCandidateCode {
    tax_code: string;            // DB 공식 6자리 코드
    tax_name: string;            // DB 공식 명칭 (DB_VALUE_ONLY)
    ksic_code: string;           // 제11차 KSIC 5자리 (DB_VALUE_ONLY)
    ksic_name: string;           // 제11차 KSIC 명칭 (DB_VALUE_ONLY)
    main_business_type: string;  // 업태
    match_level: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;              // 포함 근거
    conditions: string[];        // 확인 필요 조건
    source: {
        agency: string;
        version: string;
        effective_date: string;
    };
    tax_benefit: {
        applicable: boolean;
        notes: string;
    };
}

export interface ExcludedCandidateCode {
    tax_code: string;
    tax_name: string;
    ksic_code: string;
    exclusion_reason: string;    // 제외 사유
}

export interface FinalBusinessArchitectureResponse {
    status: EvaluationStatus;
    status_reason?: string;
    clarification_question?: string; // 정보 부족 시 사용자에게 던질 구체적 질문
    business_summary: {
        core_business: string;
        secondary_business: string[];
        automation_level: string;
    };
    primary_candidates: FinalCandidateCode[];
    secondary_candidates: FinalCandidateCode[];
    excluded_candidates: ExcludedCandidateCode[];
    saju_business_guidance: {
        role: 'coaching_personalization';
        summary: string;
        recommended_model_archetype: string;
    };
    rule_engine_audit: {
        total_master_codes_scanned: number;
        verified_count: number;
        suppressed_count: number;
        verification_gate_passed: boolean;
    };
    final_notice: string;
}

// ============================================================================
// 6. Deterministic Rule Engine 구현
// ============================================================================

export function evaluateDeterministicRules(
    facts: BusinessFactSchema,
    sajuProfile?: SajuCalculationProfile
): FinalBusinessArchitectureResponse {
    const primaryCandidates: FinalCandidateCode[] = [];
    const secondaryCandidates: FinalCandidateCode[] = [];
    const excludedCandidates: ExcludedCandidateCode[] = [];

    let status: EvaluationStatus = 'VERIFIED';
    let clarificationQuestion: string | undefined = undefined;
    let statusReason: string | undefined = undefined;

    // -------------------------------------------------------------
    // RULE 1: 점술 vs 인지 코칭 판정 (930921)
    // -------------------------------------------------------------
    const rec930921 = getOfficialIndustryRecord('930921');
    if (rec930921) {
        if (facts.fortune_telling_claim && facts.future_prediction_claim) {
            // 미래 예측을 판매 표방하면 930921 후보 추가
            primaryCandidates.push({
                tax_code: rec930921.tax_code,
                tax_name: rec930921.tax_name,
                ksic_code: rec930921.ksic_code,
                ksic_name: rec930921.ksic_name,
                main_business_type: rec930921.main_business_type,
                match_level: 'HIGH',
                reason: '서비스 화면 및 마케팅에서 사주를 통한 미래 길흉화복/사업운 예측을 직접 상품 가치로 판매하고 있으므로 실질과세 원칙상 점술 및 유사서비스업 적용 대상입니다.',
                conditions: ['조특법 제6조 창업중소기업 세액감면(청년 100%) 적용 불가 업종임을 인지해야 함'],
                source: {
                    agency: rec930921.source_agency,
                    version: rec930921.source_version,
                    effective_date: rec930921.effective_from
                },
                tax_benefit: {
                    applicable: rec930921.tax_benefit_applicable,
                    notes: rec930921.tax_benefit_notes
                }
            });
        } else {
            // 미래 예측을 표방하지 않는 경우 (자기이해 코칭 프레임이거나 순수 비즈니스)
            excludedCandidates.push({
                tax_code: rec930921.tax_code,
                tax_name: rec930921.tax_name,
                ksic_code: rec930921.ksic_code,
                exclusion_reason: facts.fortune_telling_claim
                    ? '생년월일을 활용하나 미래 길흉화복 예언이 아닌 자기이해·HR 코칭 프레임워크로 운영되므로 930921(점술업)을 배제하고 정보서비스업/전문컨설팅업으로 분류합니다.'
                    : '점술이나 사주 요소를 전혀 사용하지 않는 일반 비즈니스 모델이므로 배제.'
            });
        }
    }

    // -------------------------------------------------------------
    // RULE 2: 소프트웨어 & 온라인 정보제공업 판정 (724000, 722000)
    // -------------------------------------------------------------
    const rec724000 = getOfficialIndustryRecord('724000');
    const rec722000 = getOfficialIndustryRecord('722000');

    const hasGeneratedReport = facts.products.some(p => p.type === 'generated_report') || facts.delivery_modes.includes('online_report');
    const isSaaSOrWeb = facts.software_is_product || facts.delivery_modes.includes('web');

    if (rec724000 && (hasGeneratedReport || isSaaSOrWeb) && !facts.future_prediction_claim) {
        const isSubscription = facts.revenue_models.includes('subscription');
        const isDominantOverConsulting = (facts.consulting_revenue_share_percent || 0) < 50;

        if (isDominantOverConsulting) {
            primaryCandidates.push({
                tax_code: rec724000.tax_code,
                tax_name: rec724000.tax_name,
                ksic_code: rec724000.ksic_code,
                ksic_name: rec724000.ksic_name,
                main_business_type: rec724000.main_business_type,
                match_level: 'HIGH',
                reason: `온라인 웹/앱 플랫폼을 통해 AI 알고리즘 기반 맞춤 진단 정보 및 리포트를 실시간 제공하며(${isSubscription ? '정기구독 포함' : '건별결제'}), 자동화 매출이 직접 자문보다 우세합니다.`,
                conditions: ['실제 주 수익원이 온라인 플랫폼 이용 및 리포트 열람 수수료여야 함'],
                source: {
                    agency: rec724000.source_agency,
                    version: rec724000.source_version,
                    effective_date: rec724000.effective_from
                },
                tax_benefit: {
                    applicable: rec724000.tax_benefit_applicable,
                    notes: rec724000.tax_benefit_notes
                }
            });
        } else {
            secondaryCandidates.push({
                tax_code: rec724000.tax_code,
                tax_name: rec724000.tax_name,
                ksic_code: rec724000.ksic_code,
                ksic_name: rec724000.ksic_name,
                main_business_type: rec724000.main_business_type,
                match_level: 'MEDIUM',
                reason: '온라인 자동 리포트 기능이 존재하나, 고단가 1:1 컨설팅 매출 비중이 더 높으므로 부업종으로 권장합니다.',
                conditions: ['향후 플랫폼 자동화 매출이 50%를 초과할 경우 주업종 변경 검토'],
                source: {
                    agency: rec724000.source_agency,
                    version: rec724000.source_version,
                    effective_date: rec724000.effective_from
                },
                tax_benefit: {
                    applicable: rec724000.tax_benefit_applicable,
                    notes: rec724000.tax_benefit_notes
                }
            });
        }
    }

    // 722000 (응용 소프트웨어 개발 및 공급업)
    if (rec722000 && facts.software_is_product && !facts.future_prediction_claim) {
        if (facts.customer_types.includes('B2B') && facts.delivery_modes.includes('web')) {
            // B2B 대상 클라우드 솔루션 공급인 경우
            const targetList = primaryCandidates.length === 0 ? primaryCandidates : secondaryCandidates;
            targetList.push({
                tax_code: rec722000.tax_code,
                tax_name: rec722000.tax_name,
                ksic_code: rec722000.ksic_code,
                ksic_name: rec722000.ksic_name,
                main_business_type: rec722000.main_business_type,
                match_level: 'HIGH',
                reason: '자체 개발한 AI 비즈니스 솔루션 또는 웹 애플리케이션(SaaS)을 B2B 기업 고객에게 직접 공급/라이선스 판매하는 사업 활동입니다.',
                conditions: ['자체 소프트웨어 개발 저작권 또는 소스코드 유지 관리 필요'],
                source: {
                    agency: rec722000.source_agency,
                    version: rec722000.source_version,
                    effective_date: rec722000.effective_from
                },
                tax_benefit: {
                    applicable: rec722000.tax_benefit_applicable,
                    notes: rec722000.tax_benefit_notes
                }
            });
        } else {
            secondaryCandidates.push({
                tax_code: rec722000.tax_code,
                tax_name: rec722000.tax_name,
                ksic_code: rec722000.ksic_code,
                ksic_name: rec722000.ksic_name,
                main_business_type: rec722000.main_business_type,
                match_level: 'MEDIUM',
                reason: '자체 소프트웨어 IP 자산화 및 기업 솔루션 납품을 위한 병기 권장 부업종입니다.',
                conditions: [],
                source: {
                    agency: rec722000.source_agency,
                    version: rec722000.source_version,
                    effective_date: rec722000.effective_from
                },
                tax_benefit: {
                    applicable: rec722000.tax_benefit_applicable,
                    notes: rec722000.tax_benefit_notes
                }
            });
        }
    }

    // -------------------------------------------------------------
    // RULE 3: 경영컨설팅업 판정 (741400)
    // -------------------------------------------------------------
    const rec741400 = getOfficialIndustryRecord('741400');
    if (rec741400 && !facts.future_prediction_claim) {
        const hasHumanConsulting = facts.human_service || facts.products.some(p => p.type === 'human_consulting');
        const consultingShare = facts.consulting_revenue_share_percent || 0;

        if (hasHumanConsulting && consultingShare >= 50) {
            primaryCandidates.push({
                tax_code: rec741400.tax_code,
                tax_name: rec741400.tax_name,
                ksic_code: rec741400.ksic_code,
                ksic_name: rec741400.ksic_name,
                main_business_type: rec741400.main_business_type,
                match_level: 'HIGH',
                reason: `전문가가 직접 개입하는 1:1 창업·경영 전략 자문 매출 비중이 ${consultingShare}%로 전체의 절반 이상을 차지하므로 경영컨설팅업이 주업종으로 가장 적합합니다.`,
                conditions: ['대표자 본인의 전문 경력 또는 자문 계약서 증빙 구비 권장'],
                source: {
                    agency: rec741400.source_agency,
                    version: rec741400.source_version,
                    effective_date: rec741400.effective_from
                },
                tax_benefit: {
                    applicable: rec741400.tax_benefit_applicable,
                    notes: rec741400.tax_benefit_notes
                }
            });
        } else if (hasHumanConsulting) {
            secondaryCandidates.push({
                tax_code: rec741400.tax_code,
                tax_name: rec741400.tax_name,
                ksic_code: rec741400.ksic_code,
                ksic_name: rec741400.ksic_name,
                main_business_type: rec741400.main_business_type,
                match_level: 'HIGH',
                reason: `1:1 심층 자문 및 기업 경영 컨설팅 서비스(매출 비중 약 ${consultingShare}%)를 제공하므로 세금계산서 발행 및 B2B 용역 계약을 위해 필수 부업종으로 등록합니다.`,
                conditions: [],
                source: {
                    agency: rec741400.source_agency,
                    version: rec741400.source_version,
                    effective_date: rec741400.effective_from
                },
                tax_benefit: {
                    applicable: rec741400.tax_benefit_applicable,
                    notes: rec741400.tax_benefit_notes
                }
            });
        } else {
            excludedCandidates.push({
                tax_code: rec741400.tax_code,
                tax_name: rec741400.tax_name,
                ksic_code: rec741400.ksic_code,
                exclusion_reason: '사람이 직접 개입하는 전문 자문/용역 활동이 전혀 없는 100% 자동 시스템이므로 배제.'
            });
        }
    }

    // -------------------------------------------------------------
    // RULE 4: 통신판매업 / 전자상거래 판정 (525101)
    // -------------------------------------------------------------
    const rec525101 = getOfficialIndustryRecord('525101');
    if (rec525101) {
        if (facts.physical_goods) {
            // 실물 상품 택배 배송이 있으면
            primaryCandidates.push({
                tax_code: rec525101.tax_code,
                tax_name: rec525101.tax_name,
                ksic_code: rec525101.ksic_code,
                ksic_name: rec525101.ksic_name,
                main_business_type: rec525101.main_business_type,
                match_level: 'HIGH',
                reason: '실물 제품(웰니스 굿즈, 다이어리, 교구재 등)을 온라인 주문받아 실물 배송하는 전자상거래 실질이 명확합니다.',
                conditions: ['정부24 통신판매업 신고 필수', '에스크로(구매안전서비스) 가입 필수'],
                source: {
                    agency: rec525101.source_agency,
                    version: rec525101.source_version,
                    effective_date: rec525101.effective_from
                },
                tax_benefit: {
                    applicable: rec525101.tax_benefit_applicable,
                    notes: rec525101.tax_benefit_notes
                }
            });
        } else if (facts.delivery_modes.includes('digital_download')) {
            // 디지털 파일 다운로드 판매
            secondaryCandidates.push({
                tax_code: rec525101.tax_code,
                tax_name: rec525101.tax_name,
                ksic_code: rec525101.ksic_code,
                ksic_name: rec525101.ksic_name,
                main_business_type: rec525101.main_business_type,
                match_level: 'MEDIUM',
                reason: '오픈마켓(스마트스토어, 크몽 등)을 통한 전자책 PDF, 노션 템플릿 등 디지털 다운로드 파일의 온라인 판매 수납을 위한 권장 부업종입니다.',
                conditions: ['통신판매업 신고 필요'],
                source: {
                    agency: rec525101.source_agency,
                    version: rec525101.source_version,
                    effective_date: rec525101.effective_from
                },
                tax_benefit: {
                    applicable: rec525101.tax_benefit_applicable,
                    notes: rec525101.tax_benefit_notes
                }
            });
        } else {
            // 실물 배송 및 오픈마켓 소매가 전혀 없는 경우: SUPPRESS
            excludedCandidates.push({
                tax_code: rec525101.tax_code,
                tax_name: rec525101.tax_name,
                ksic_code: rec525101.ksic_code,
                exclusion_reason: '실물 택배 배송 상품이 없고 순수 웹 SaaS/온라인 자동 정보제공이므로 통신판매업 주업종 등록은 부적합하여 억제(Suppress).'
            });
        }
    }

    // -------------------------------------------------------------
    // RULE 5: 출판업 판정 (581101) - "앞으로 책 낼 생각" 배제 규칙
    // -------------------------------------------------------------
    const rec581101 = getOfficialIndustryRecord('581101');
    if (rec581101) {
        if (facts.publishing) {
            secondaryCandidates.push({
                tax_code: rec581101.tax_code,
                tax_name: rec581101.tax_name,
                ksic_code: rec581101.ksic_code,
                ksic_name: rec581101.ksic_name,
                main_business_type: rec581101.main_business_type,
                match_level: 'HIGH',
                reason: '지자체 출판사 신고 후 워크북, 단행본, ISBN 등록 전자책 출판 활동을 영위하므로 부가가치세 면세 혜택을 위한 부업종으로 등록합니다.',
                conditions: ['시·군·구청 문화체육과 출판사 등록신고 필증 필요'],
                source: {
                    agency: rec581101.source_agency,
                    version: rec581101.source_version,
                    effective_date: rec581101.effective_from
                },
                tax_benefit: {
                    applicable: rec581101.tax_benefit_applicable,
                    notes: rec581101.tax_benefit_notes
                }
            });
        } else {
            // 출판 활동 미영위 시 AI가 임의로 추가하지 않도록 원천 배제 (do_not_add)
            excludedCandidates.push({
                tax_code: rec581101.tax_code,
                tax_name: rec581101.tax_name,
                ksic_code: rec581101.ksic_code,
                exclusion_reason: '현재 정식 출판사 신고 및 ISBN 도서 출판 활동이 없으므로(계획 단계 포함) 출판업 등록을 배제합니다.'
            });
        }
    }

    // -------------------------------------------------------------
    // RULE 6: 기타 교육지원 서비스업 판정 (809003)
    // -------------------------------------------------------------
    const rec809003 = getOfficialIndustryRecord('809003');
    if (rec809003) {
        if (facts.education) {
            secondaryCandidates.push({
                tax_code: rec809003.tax_code,
                tax_name: rec809003.tax_name,
                ksic_code: rec809003.ksic_code,
                ksic_name: rec809003.ksic_name,
                main_business_type: rec809003.main_business_type,
                match_level: 'MEDIUM',
                reason: '오프라인 세미나, 기업 출강, 창업 멘토링 워크숍 등 교육지원 활동에 따른 강의료 및 프로그램 수수료 수수를 위한 부업종입니다.',
                conditions: ['학원법상 학원/교습소 형태가 아닌 일반 기업 대상 세미나/워크숍 한정'],
                source: {
                    agency: rec809003.source_agency,
                    version: rec809003.source_version,
                    effective_date: rec809003.effective_from
                },
                tax_benefit: {
                    applicable: rec809003.tax_benefit_applicable,
                    notes: rec809003.tax_benefit_notes
                }
            });
        } else {
            excludedCandidates.push({
                tax_code: rec809003.tax_code,
                tax_name: rec809003.tax_name,
                ksic_code: rec809003.ksic_code,
                exclusion_reason: '강의/세미나 등 교육지원 활동이 없으므로 배제.'
            });
        }
    }

    // -------------------------------------------------------------
    // 7. 상태값(Status) 판정: VERIFIED / CLARIFICATION_REQUIRED / MANUAL_REVIEW
    // -------------------------------------------------------------
    if (primaryCandidates.length === 0) {
        status = 'CLARIFICATION_REQUIRED';
        statusReason = '제공된 사업 내용만으로는 주된 수익원을 단일 코드로 확정하기 어렵습니다.';
        clarificationQuestion = '현재 설명으로는 온라인 자동 리포트(724000)와 1:1 컨설팅(741400) 중 어느 활동이 주된 매출인지 명확하지 않습니다. 예상 매출 비중을 선택해 주세요.';
    } else if (primaryCandidates.length > 1) {
        // 복수의 주업종 후보가 팽팽하게 경합하는 경우
        status = 'MANUAL_REVIEW';
        statusReason = `복수의 주업종 후보([${primaryCandidates.map(c => c.tax_name).join(', ')}])가 식별되었습니다. 실제 주 매출 비중에 따라 세무서 등록 시 주업종 1개를 확정하고 나머지는 부업종으로 등록하세요.`;
    } else {
        status = 'VERIFIED';
        statusReason = `공식 Master DB(제11차 KSIC / 국세청 고시) 및 실질 사업 Fact와의 100% 매칭 검증을 통과했습니다.`;
    }

    // -------------------------------------------------------------
    // 8. [Verification Gate & DB_VALUE_ONLY 덮어쓰기]
    // -------------------------------------------------------------
    const verifiedPrimary = enforceOfficialMasterData(primaryCandidates);
    const verifiedSecondary = enforceOfficialMasterData(secondaryCandidates);

    // 사주 맞춤 코칭 가이드 (업종코드와는 엄격히 분리된 개인화 가이드)
    const sajuGuidance = sajuProfile?.guidance || {
        role: 'coaching_personalization' as const,
        summary: '전문지식의 구조화 및 시스템화 사업모델을 우선 탐색하는 전략이 선천적 인지 스타일에 부합합니다.',
        recommended_model_archetype: '1인 지식 IP ➔ 시스템화 SaaS ➔ B2B 고단가 자문 융합 모델'
    };

    return {
        status,
        status_reason: statusReason,
        clarification_question: clarificationQuestion,
        business_summary: {
            core_business: facts.primary_value || 'AI 기반 맞춤 진단 및 비즈니스 아키텍처 솔루션',
            secondary_business: secondaryCandidates.map(s => s.tax_name),
            automation_level: facts.software_is_product ? '웹 플랫폼 기반 자동화' : '전문가 직접 자문'
        },
        primary_candidates: verifiedPrimary,
        secondary_candidates: verifiedSecondary,
        excluded_candidates: excludedCandidates,
        saju_business_guidance: sajuGuidance,
        rule_engine_audit: {
            total_master_codes_scanned: Object.keys(OFFICIAL_INDUSTRY_MASTER_DATA).length,
            verified_count: verifiedPrimary.length + verifiedSecondary.length,
            suppressed_count: excludedCandidates.length,
            verification_gate_passed: true
        },
        final_notice: '실제 사업 내용과 주 매출 비중에 따라 사업자등록 시 관할 세무서(또는 전문 세무사)의 최종 확인을 거치시기 바랍니다.'
    };
}
