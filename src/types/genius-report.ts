/**
 * Genius Report 전용 타입 정의
 * 지니어스 리포트의 5가지 핵심 시각화를 위한 데이터 구조
 */

// 8각 레이더 차트용 축 데이터
export interface ForceFieldData {
    axisLabels: string[];
    outward: number[];  // 외부 표출 에너지 (타인이 보는 나)
    inward: number[];   // 내면 수용 에너지 (내가 느끼는 나)
}

// 재능 프로필 (6가지 역량)
export interface TalentProfileData {
    transformation: number;  // 변혁 (Transformation)
    dissemination: number;   // 전파 (Dissemination)
    contact: number;         // 접촉 (Contact)
    realization: number;     // 실현 (Realization)
    development: number;     // 개발 (Development)
    analysis: number;        // 분석 (Analysis)
}

// 협력 프로필 (6가지 협력 환경)
export interface CooperationProfileData {
    largeOrganization: number;  // 대조직
    networks: number;           // 네트워크
    communities: number;        // 커뮤니티
    partnership: number;        // 파트너십
    autonomous: number;         // 자율
    flexible: number;           // 유연
}

// 파워베이스 (6가지 조직 기여 에너지)
export interface PowerbaseData {
    communication: number;   // 소통 촉진
    innovation: number;      // 혁신 추진
    management: number;      // 관리/운영
    marketSuccess: number;   // 시장 성공
    sustainability: number;  // 지속가능성
    structure: number;       // 구조화
}

// 팀 역할 유형
export type TeamRoleType =
    | 'TEAM_SUPPORTER'      // 팀 서포터
    | 'STRATEGIC_LEADER'    // 전략적 리더
    | 'CREATIVE_INNOVATOR'  // 창의적 혁신가
    | 'ANALYTICAL_EXPERT'   // 분석 전문가
    | 'RELATIONSHIP_BUILDER' // 관계 구축자
    | 'EXECUTION_DRIVER';   // 실행 추진자

// 지니어스 리포트 전체 데이터
export interface GeniusReportData {
    forceField: ForceFieldData;
    talentProfile: TalentProfileData;
    cooperationProfile: CooperationProfileData;
    powerbase: PowerbaseData;
    teamRole: TeamRoleType;
    teamRoleDescription: string;
    specificTalents: string[];
    leadershipStyle: string;
    motivation: string;
}

// 기본 8각형 축 라벨 (하이브리드 버전: 오행 + 음양 + 핵심)
export const DEFAULT_AXIS_LABELS = [
    '의지력/주장',      // Willpower & Assertion
    '감정/느낌',        // Feelings & Emotions
    '생명력/활동',      // Life Force & Activity
    '추진력/스트레스',  // Drive & Stress Mode
    '직관/신체자각',    // Intuitive Body Awareness
    '설계/방향성',      // Design & Orientation
    '정신적 영감',      // Mental Inspiration
    '개념/아이디어',    // Concepts & Ideas
];

// 파워베이스 색상 매핑
export const POWERBASE_COLORS: Record<keyof PowerbaseData, string> = {
    communication: '#92400E',   // 갈색 (소통)
    innovation: '#0891B2',      // 청록색 (혁신)
    management: '#059669',      // 녹색 (관리)
    marketSuccess: '#DC2626',   // 빨간색 (시장성공)
    sustainability: '#7C3AED',  // 보라색 (지속가능성)
    structure: '#4B5563',       // 회색 (구조화)
};

// 파워베이스 한글 라벨
export const POWERBASE_LABELS: Record<keyof PowerbaseData, string> = {
    communication: '소통과 상호작용 촉진',
    innovation: '혁신과 변화 추진',
    management: '관리 및 운영 강화',
    marketSuccess: '경쟁 우위 확보',
    sustainability: '지속가능성 유지',
    structure: '구조와 체계 구축',
};
