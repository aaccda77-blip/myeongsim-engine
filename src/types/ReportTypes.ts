/**
 * ReportTypes.ts - 프리미엄 리포트 타입 정의
 * 
 * 80페이지 리포트 생성을 위한 데이터 구조 정의
 */

// ============== 일주(日柱) 관련 타입 ==============

export interface IljuData {
    id: string;
    name?: string;              // 예: "신사" (legacy)
    hanja?: string;             // 예: "辛巳" (legacy)
    title: string;             // 예: "✨ 용광로 속에서 빛나는 보석"
    keywords?: string[];        // 예: ["#완벽주의", "#예리한_직관"] (legacy)
    element?: string;           // 오행 예: "금" (legacy)
    yin_yang?: '음' | '양' | 'Active' | 'Deep' | string;    // (legacy & rebranded terms)
    image_metaphor?: string;    // 물상 이미지 예: "용광로 위에서 제련되고 있는 보석" (legacy)
    main_text?: string;         // 본문 (500자 이상) (legacy)
    strengths?: string[];       // 강점 리스트 (legacy)
    weaknesses?: string[];      // 약점 리스트 (legacy)
    career_fit?: string[];      // 적합 직업 (legacy)
    relationship_style?: string; // 관계 스타일 (legacy)
    health_warning?: string;    // 건강 주의점 (legacy)
    lucky_elements?: {
        color: string;
        number: string;
        direction: string;
    };

    // === NEW BATCH FORMAT FIELDS ===
    visual_token?: string;      // 예: "❄️"
    color_code?: string;        // 예: "#2E86C1"
    image_prompt?: string;      // AI 이미지 생성용 프롬프트
    dark_code?: {
        name: string;
        body_symptom: string;
        desc: string;
    };
    neural_code?: {
        name: string;
        desc: string;
        action: string;
    };
    meta_code?: {
        name: string;
        desc: string;
    };
}

// ============== 십성(十星) 관련 타입 ==============

export interface TenGodData {
    id: string;
    name: string;              // 예: "편관"
    hanja: string;             // 예: "偏官"
    title: string;             // 예: "⚔️ 세상을 개혁하는 칼"
    keywords: string[];
    main_text: string;
    positive_traits: string[];
    negative_traits: string[];
    career_tendency: string;
    relationship_pattern: string;
    coaching_approach: string; // 이 십성을 가진 사람에게 맞는 코칭 방법

    // [NEW] Enhanced multi-dimensional fields
    code_type?: string;        // 예: "Authority Profile"
    dark_code?: {
        name: string;
        body_symptom: string;
        desc: string;
    };
    neural_code?: {
        name: string;
        desc: string;
        action: string;
    };
    meta_code?: {
        name: string;
        desc: string;
    };
}

// ============== 명심코드(진키) 관련 타입 ==============

export interface CodeLevel {
    name: string;
    description?: string;       // 기존 필드 (desc로도 사용 가능)
    desc?: string;             // 새 필드 (description과 동일 의미)
    coaching_tip?: string;
    body_symptom?: string;     // 다크코드에서 사용: 신체 증상
    action?: string;           // 뉴럴코드에서 사용: 실천 행동
}

export interface MyungsimCode {
    id: string;
    number: number;            // 1-64
    title: string;             // 예: "🧬 운명 코드 40번: 의지의 연금술"
    keywords: string[];

    // Optional enhanced fields
    original_key?: string;     // 예: "Gene Key 2"
    visual_token?: string;     // 예: "🧭"
    color_code?: string;       // 예: "#5DADE2"
    archetype?: string;        // 예: "The Peacemaker"
    image_prompt?: string;     // AI 이미지 생성용 프롬프트

    // Core code levels
    dark_code: CodeLevel;      // 그림자 상태
    neural_code: CodeLevel;    // 성장 상태
    meta_code: CodeLevel;      // 초월 상태

    // Insights
    main_insight?: string;     // 핵심 통찰
    life_lesson?: string;      // 인생 교훈
    daily_practice?: string;   // 일상 실천법
}

// ============== 대운(大運) 관련 타입 ==============

export interface DaewoonPeriod {
    age_start: number;
    age_end: number;
    heavenly_stem: string;     // 천간
    earthly_branch: string;    // 지지
    theme: string;             // 이 시기의 주제
    opportunities: string[];   // 기회
    challenges: string[];      // 도전
    advice: string;            // 조언
}

// ============== 리포트 구조 ==============

export interface ReportSection {
    id: string;
    title: string;
    page_start: number;
    content: string | object;
    ai_bridge_text?: string;   // AI가 채울 연결 문장
}

export interface ReportStructure {
    metadata: {
        created_at: string;
        user_name: string;
        birth_date: string;
        birth_time: string;
        gender: '남' | '여';
        report_tier: 'BASIC' | 'PREMIUM' | 'DELUXE';
    };

    // 섹션별 콘텐츠
    sections: {
        cover: ReportSection;                    // 표지 (1페이지)
        saju_chart: ReportSection;               // 사주 원국 (2-4페이지)
        ilju_analysis: ReportSection;            // 일주 분석 (5-12페이지)
        ten_gods_analysis: ReportSection;        // 십성 분석 (13-22페이지)
        five_elements: ReportSection;            // 오행 분석 (23-28페이지)
        daewoon_flow: ReportSection;             // 대운 흐름 (29-38페이지)
        yearly_fortune: ReportSection;           // 세운 분석 (39-44페이지)
        myungsim_codes: ReportSection;           // 명심코드 분석 (45-58페이지)
        career_wealth: ReportSection;            // 직업/재물운 (59-66페이지)
        relationship: ReportSection;             // 관계/결혼운 (67-72페이지)
        action_guide: ReportSection;             // 실천 가이드 (73-78페이지)
        outro: ReportSection;                    // 마무리 (79-80페이지)
    };

    // 워크북 (사용자가 직접 작성하는 공간)
    workbook?: {
        reflection_prompts: string[];            // 성찰 질문
        action_checklist: string[];              // 실천 체크리스트
        notes_space: boolean;                    // 메모 공간 포함 여부
    };
}

// ============== 사용자 프로필 (입력) ==============

export interface UserReportProfile {
    name: string;
    birth_date: string;        // "1990-05-15"
    birth_time: string;        // "14:30"
    gender: '남' | '여';

    // 사주 분석 결과 (SajuEngine에서 계산)
    saju: {
        year_pillar: { stem: string; branch: string };
        month_pillar: { stem: string; branch: string };
        day_pillar: { stem: string; branch: string };   // 일주
        hour_pillar: { stem: string; branch: string };

        ilju: string;           // 예: "SIN_SA"
        day_master: string;     // 일간 예: "신"

        ten_gods: {
            name: string;
            score: number;      // 점수 (높을수록 강함)
        }[];

        five_elements: {
            wood: number;
            fire: number;
            earth: number;
            metal: number;
            water: number;
        };

        daewoon: DaewoonPeriod[];
    };

    // Gene Keys 분석 결과
    gene_keys: {
        life_work: number;      // 삶의 과업 코드
        evolution: number;      // 진화 코드
        radiance: number;       // 빛남 코드
        purpose: number;        // 목적 코드
        pearl: number;          // 재물 코드
        attraction: number;     // 끌림 코드
        iq: number;             // 지성 코드
        eq: number;             // 감성 코드
        sq: number;             // 영성 코드
    };
}

// ============== PDF 렌더링 옵션 ==============

export interface PdfRenderOptions {
    theme: 'mystical' | 'modern' | 'classic';
    include_charts: boolean;
    include_workbook: boolean;
    page_size: 'A4' | 'letter';
    font_family: string;
    primary_color: string;
    secondary_color: string;
}
