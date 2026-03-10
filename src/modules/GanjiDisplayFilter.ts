/**
 * [MODULE] GanjiDisplayFilter — 60갑자 UI 표시 필터
 * 
 * 내부 로직(계산/데이터)은 그대로 유지하고,
 * UI에 표시될 때만 갑자 용어를 뇌과학/심리학/코칭 용어로 변환합니다.
 * 
 * 기존 챗봇 시스템 영향: 0 (순수 Display Utility)
 */

// ============== 천간(10 Stems) → 코칭 용어 ==============
const STEM_MAP: Record<string, string> = {
    // 한글
    '갑': '창조적 리더', '을': '유연한 전략가', '병': '비전 메이커',
    '정': '섬세한 감성가', '무': '안정의 중심축', '기': '포용의 조율가',
    '경': '결단의 실행가', '신': '예리한 분석가', '임': '자유로운 탐험가',
    '계': '직관적 통찰가',
    // 한자
    '甲': '창조적 리더', '乙': '유연한 전략가', '丙': '비전 메이커',
    '丁': '섬세한 감성가', '戊': '안정의 중심축', '己': '포용의 조율가',
    '庚': '결단의 실행가', '辛': '예리한 분석가', '壬': '자유로운 탐험가',
    '癸': '직관적 통찰가',
};

// ============== 지지(12 Branches) → 코칭 용어 ==============
const BRANCH_MAP: Record<string, string> = {
    '자': '잠재력', '축': '축적', '인': '성장', '묘': '개화',
    '진': '변혁', '사': '집중', '오': '정점', '미': '결실',
    '신': '수확', '유': '정제', '술': '전환', '해': '재생',
    '子': '잠재력', '丑': '축적', '寅': '성장', '卯': '개화',
    '辰': '변혁', '巳': '집중', '午': '정점', '未': '결실',
    '申': '수확', '酉': '정제', '戌': '전환', '亥': '재생',
};

// ============== 60갑자 → 코칭 키워드 ==============
const GANJI_MAP: Record<string, string> = {
    '갑자': '창조적 잠재력', '을축': '유연한 축적', '병인': '비전의 성장',
    '정묘': '섬세한 개화', '무진': '안정된 변혁', '기사': '포용적 집중',
    '경오': '결단의 정점', '신미': '정밀한 결실', '임신': '탐험적 수확',
    '계유': '통찰의 정제', '갑술': '창조적 전환', '을해': '유연한 재생',
    '병자': '비전의 잠재력', '정축': '섬세한 축적', '무인': '안정의 성장',
    '기묘': '포용의 개화', '경진': '결단의 변혁', '신사': '정밀한 집중',
    '임오': '탐험의 정점', '계미': '통찰의 결실', '갑신': '창조적 수확',
    '을유': '유연한 정제', '병술': '비전의 전환', '정해': '섬세한 재생',
    '무자': '안정의 잠재력', '기축': '포용의 축적', '경인': '결단의 성장',
    '신묘': '정밀한 개화', '임진': '탐험의 변혁', '계사': '통찰의 집중',
    '갑오': '창조의 정점', '을미': '유연한 결실', '병신': '비전의 수확',
    '정유': '섬세한 정제', '무술': '안정의 전환', '기해': '포용의 재생',
    '경자': '결단의 잠재력', '신축': '정밀한 축적', '임인': '탐험의 성장',
    '계묘': '통찰의 개화', '갑진': '창조적 변혁', '을사': '유연한 집중',
    '병오': '비전의 정점', '정미': '섬세한 결실', '무신': '안정의 수확',
    '기유': '포용의 정제', '경술': '결단의 전환', '신해': '정밀한 재생',
    '임자': '탐험의 잠재력', '계축': '통찰의 축적', '갑인': '창조의 성장',
    '을묘': '유연한 개화', '병진': '비전의 변혁', '정사': '섬세한 집중',
    '무오': '안정의 정점', '기미': '포용의 결실', '경신': '결단의 수확',
    '신유': '정밀한 정제', '임술': '탐험의 전환', '계해': '통찰의 재생',
};

// ============== 용어 치환 맵 ==============
const LABEL_MAP: Record<string, string> = {
    '일간': '코어 타입',
    '천간': '의식 코드',
    '지지': '무의식 코드',
    '天干': '의식 코드',
    '地支': '무의식 코드',
    '일주': '기질 코드',
    '월지': '환경 코드',
    '십신': '관계 패턴',
    '오행': '에너지 스펙트럼',
    '사주': '기질 프로필',
    '원국': '기질 설계도',
    '대운': '라이프 웨이브',
    '공망': '잠재 영역',
};

// ============== Public API ==============

/** 60갑자 2글자 → 코칭 키워드 (없으면 원본 반환) */
export function ganjiToCoaching(ganji: string): string {
    return GANJI_MAP[ganji] || ganji;
}

/** 천간 1글자 → 코칭 타입 */
export function stemToCoaching(stem: string): string {
    return STEM_MAP[stem] || stem;
}

/** 지지 1글자 → 코칭 키워드 */
export function branchToCoaching(branch: string): string {
    return BRANCH_MAP[branch] || branch;
}

/** 명리학 레이블 → 코칭 레이블 */
export function labelToCoaching(label: string): string {
    return LABEL_MAP[label] || label;
}

/**
 * 텍스트 안의 모든 60갑자·명리학 용어를 코칭 용어로 자동 치환.
 * AI 응답 텍스트, 시스템 메시지 등에 적용할 수 있음.
 */
export function filterGanjiFromText(text: string): string {
    let result = text;

    // 60갑자 치환 (긴 것부터)
    for (const [ganji, coaching] of Object.entries(GANJI_MAP)) {
        result = result.replaceAll(ganji, coaching);
    }

    // 레이블 치환
    for (const [label, coaching] of Object.entries(LABEL_MAP)) {
        result = result.replaceAll(label, coaching);
    }

    return result;
}

/** 기둥 타이틀에서 갑자 부분 제거 ("🚀 지향점: 을미 (Future Vision)" → "🚀 지향점 (Future Vision)") */
export function cleanPillarTitle(title: string): string {
    // Remove ": 갑자" pattern
    return title.replace(/:\s*[가-힣]{2}\s*/, ' ');
}

export default {
    ganjiToCoaching,
    stemToCoaching,
    branchToCoaching,
    labelToCoaching,
    filterGanjiFromText,
    cleanPillarTitle,
};
