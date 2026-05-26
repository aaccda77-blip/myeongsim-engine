/**
 * ReportContentGenerator.ts - 80페이지 소울 아카이브 리포트 콘텐츠 생성기
 * 
 * StaticTextDB의 일주 데이터를 기반으로 다차원 분석 콘텐츠를 생성합니다.
 * 각 섹션은 개인화된 데이터를 활용하여 상세한 분석 텍스트를 제공합니다.
 */

import { SAJU_ILJU } from '@/data/StaticTextDB';

// ============== 타입 정의 ==============
export interface ReportSection {
    id: string;
    title: string;
    subtitle: string;
    pageRange: string; // e.g., "1-10"
    content: string[];
}

export interface FullReportContent {
    userName: string;
    iljuKey: string;
    generatedAt: string;
    totalPages: number;
    sections: ReportSection[];
}

// ============== 오행 매핑 ==============
const ELEMENT_MAP: Record<string, { name: string; desc: string; color: string }> = {
    '갑': { name: '목(木)', desc: '성장, 창의성, 새로운 시작', color: '#2E7D32' },
    '을': { name: '목(木)', desc: '유연성, 적응력, 협력', color: '#4CAF50' },
    '병': { name: '화(火)', desc: '열정, 표현력, 카리스마', color: '#F44336' },
    '정': { name: '화(火)', desc: '섬세함, 직관력, 영감', color: '#E91E63' },
    '무': { name: '토(土)', desc: '안정, 신뢰, 포용력', color: '#795548' },
    '기': { name: '토(土)', desc: '실용성, 헌신, 배려', color: '#8D6E63' },
    '경': { name: '금(金)', desc: '결단력, 정의, 완벽주의', color: '#9E9E9E' },
    '신': { name: '금(金)', desc: '예민함, 분석력, 섬세함', color: '#BDBDBD' },
    '임': { name: '수(水)', desc: '지혜, 유연성, 깊은 사고', color: '#2196F3' },
    '계': { name: '수(水)', desc: '직관, 감성, 영적 능력', color: '#03A9F4' },
};

// ============== 천간/지지 한자-한글 매핑 ==============
const CHEONGAN_MAP: Record<string, string> = {
    '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
    '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계',
    '갑': '갑', '을': '을', '병': '병', '정': '정', '무': '무',
    '기': '기', '경': '경', '신': '신', '임': '임', '계': '계',
};

const JIJI_MAP: Record<string, string> = {
    '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
    '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해',
    '자': '자', '축': '축', '인': '인', '묘': '묘', '진': '진', '사': '사',
    '오': '오', '미': '미', '신': '신', '유': '유', '술': '술', '해': '해',
};

// ============== 일주 키 찾기 ==============
export function findIljuKey(dayMaster: string, dayBranch?: string): string | null {
    // 한자를 한글로 변환
    const hangeulGan = CHEONGAN_MAP[dayMaster] || dayMaster;
    const hangeulJi = dayBranch ? (JIJI_MAP[dayBranch] || dayBranch) : '';

    // 일주 이름 조합 (예: '신사')
    const searchName = hangeulGan + hangeulJi;

    console.log('[findIljuKey] Searching for:', { dayMaster, dayBranch, hangeulGan, hangeulJi, searchName });

    // 정확한 이름 매칭 (우선순위 1)
    for (const [key, value] of Object.entries(SAJU_ILJU)) {
        if (value.name === searchName) {
            console.log('[findIljuKey] Found exact match:', key);
            return key;
        }
    }

    // 한자로 검색 (우선순위 2)
    const hanjaSearch = dayMaster + (dayBranch || '');
    for (const [key, value] of Object.entries(SAJU_ILJU)) {
        if (value.hanja === hanjaSearch || value.hanja?.includes(hanjaSearch)) {
            console.log('[findIljuKey] Found hanja match:', key);
            return key;
        }
    }

    // 일간만으로 첫 번째 매칭 (우선순위 3)
    const firstCharMatches = Object.entries(SAJU_ILJU).find(([_, v]) =>
        v.name?.startsWith(hangeulGan) || v.title?.includes(hangeulGan)
    );

    if (firstCharMatches) {
        console.log('[findIljuKey] Found partial match:', firstCharMatches[0]);
        return firstCharMatches[0];
    }

    console.log('[findIljuKey] No match found, returning GAP_JA');
    return 'GAP_JA';
}

// ============== 섹션별 콘텐츠 생성 ==============
function generateCoreSection(iljuData: typeof SAJU_ILJU[string], userName: string): ReportSection {
    const elementInfo = ELEMENT_MAP[iljuData.name?.[0] || '갑'];

    return {
        id: 'core',
        title: '제1장: 당신의 본질',
        subtitle: '타고난 기질과 운명 코드 분석',
        pageRange: '1-20',
        content: [
            `## ${userName}님의 영혼 설계도`,
            '',
            iljuData.title || '당신만의 특별한 일주입니다.',
            '',
            '### 🧬 일주(日柱)의 의미',
            iljuData.main_text || '당신의 일주는 고유한 에너지 패턴을 가지고 있습니다.',
            '',
            `### 🌿 ${elementInfo.name} 에너지`,
            `당신의 일간 에너지: **${elementInfo.desc}**`,
            '',
            '### 💪 타고난 강점',
            ...(iljuData.strengths || ['추진력', '창의성']).map(s => `- ${s}`),
            '',
            '### ⚠️ 주의해야 할 약점',
            ...(iljuData.weaknesses || ['조급함', '독단']).map(w => `- ${w}`),
            '',
            '### 🖼️ 이미지 메타포',
            iljuData.image_metaphor || '당신은 고유한 에너지를 가진 존재입니다.',
        ]
    };
}

function generateLifeCodeSection(iljuData: typeof SAJU_ILJU[string]): ReportSection {
    const darkCode = iljuData.dark_code;
    const neuralCode = iljuData.neural_code;
    const metaCode = iljuData.meta_code;

    return {
        id: 'lifecode',
        title: '제2장: 라이프 코드',
        subtitle: '다크코드 → 뉴럴코드 → 메타코드',
        pageRange: '21-40',
        content: [
            '## 의식의 3단계 스펙트럼',
            '',
            '당신의 내면에는 세 가지 코드가 존재합니다. 다크코드를 깊이 품어 안아 인식하고, 뉴럴코드로 아름답게 변환하여, 최종적으로 메타코드에 도달하는 것이 성장의 눈물겨운 여정입니다.',
            '',
            '---',
            '',
            '### 🌑 다크 코드 (Dark Code) — 그림자를 빚는 아름다운 연금술',
            `**${darkCode?.name || '미지'}**`,
            '',
            darkCode?.desc || '무의식 속에 숨겨진 패턴입니다.',
            '',
            '#### 💡 Coach\'s Note (관점의 전환)',
            '시스템의 깊은 역설은, 내면에 드리운 ⚠️ **[다크 코드(그림자)]**를 억지로 도려내어 삭제하거나 부정하려 발버둥 칠수록 오히려 마음의 충돌과 오류(Error)가 더 잦아진다는 점입니다.',
            '',
            '나의 예민함, 고집, 불안조차 **"나라는 소중한 존재를 보호하기 위해 가동되던 신성한 초기 설정(Default)"**이었음을 있는 그대로 온전히 **승인(Accept)**하는 것부터 시작해야 합니다.',
            '',
            '그림자는 파괴해야 할 적이 아니며, 그렇다고 그 차가운 어둠에 영혼을 빼앗긴 채 동일시하여 끌려다닐 감옥도 아닙니다.',
            '',
            '오히려 진정한 내 삶의 주체(Subject)로 우뚝 서기 위해 내면에 늘 넓게 펼쳐져 있는 **"가장 눈부시고 고귀한 창조의 밑거름이자 최고의 재료"**입니다. 이 그림자라는 재료를 기쁘게 수용하여 내 삶의 새로운 연료로 삼아 잘 써 내려갈 때, 비로소 진정한 나로서 살아갈 수 있는 거대한 우주적 원동력이 깨어납니다.',
            '',
            '#### 신체 증상',
            darkCode?.body_symptom || '스트레스가 신체로 표현될 수 있습니다.',
            '',
            '---',
            '',
            '### 🧬 뉴럴 코드 (Neural Code)',
            `**${neuralCode?.name || '각성'}**`,
            '',
            neuralCode?.desc || '다크코드를 넘어설 때 드러나는 재능입니다.',
            '',
            '#### 실천 액션',
            neuralCode?.action || '일상에서 작은 변화를 시작하세요.',
            '',
            '---',
            '',
            '### ✨ 메타 코드 (Meta Code)',
            `**${metaCode?.name || '완성'}**`,
            '',
            metaCode?.desc || '당신이 도달할 궁극의 의식 상태입니다.',
        ]
    };
}

function generateCareerSection(iljuData: typeof SAJU_ILJU[string]): ReportSection {
    return {
        id: 'career',
        title: '제3장: 커리어 & 재물',
        subtitle: '적성 직무와 부의 그릇',
        pageRange: '41-55',
        content: [
            '## 당신에게 맞는 커리어 경로',
            '',
            '### 💼 추천 직업군',
            ...(iljuData.career_fit || ['창업가', '프로젝트 매니저', '기획자']).map(c => `- **${c}**`),
            '',
            '### 🎯 성공 전략',
            '당신의 강점을 살려 차별화된 가치를 제공하세요.',
            '',
            '### 💰 부의 그릇',
            iljuData.lucky_elements ?
                `행운의 색상: ${iljuData.lucky_elements.color}\n행운의 숫자: ${iljuData.lucky_elements.number}\n행운의 방향: ${iljuData.lucky_elements.direction}` :
                '당신만의 고유한 부의 에너지를 탐색하세요.',
        ]
    };
}

function generateRelationshipSection(iljuData: typeof SAJU_ILJU[string]): ReportSection {
    return {
        id: 'relationship',
        title: '제4장: 관계 & 사랑',
        subtitle: '연애 스타일과 이상적 파트너',
        pageRange: '56-65',
        content: [
            '## 당신의 관계 패턴',
            '',
            '### ❤️ 연애 스타일',
            iljuData.relationship_style || '당신은 주도적인 관계를 선호합니다.',
            '',
            '### 👥 이상적인 파트너',
            '당신의 에너지와 조화로운 파트너십을 찾으세요.',
            '',
            '### 🤝 관계 성장 포인트',
            '상대방의 관점을 이해하고 소통하세요.',
        ]
    };
}

function generateHealthSection(iljuData: typeof SAJU_ILJU[string]): ReportSection {
    return {
        id: 'health',
        title: '제5장: 건강 & 바이오리듬',
        subtitle: '신체 취약점과 웰니스 전략',
        pageRange: '66-75',
        content: [
            '## 당신의 건강 설계도',
            '',
            '### 🏥 건강 주의사항',
            iljuData.health_warning || '스트레스 관리와 규칙적인 운동이 필요합니다.',
            '',
            '### 🧘 추천 운동',
            '- 요가 또는 명상',
            '- 자연 속 산책',
            '- 규칙적인 유산소 운동',
            '',
            '### 🍎 식이 권장사항',
            '당신의 오행 에너지에 맞는 음식을 섭취하세요.',
        ]
    };
}

function generateChronosSection(): ReportSection {
    const currentYear = new Date().getFullYear();

    return {
        id: 'chronos',
        title: '제6장: 시간의 흐름',
        subtitle: '10년 대운과 월별 리듬',
        pageRange: '76-80',
        content: [
            '## 사용자의 기질 데이터 분석',
            '',
            '### 📅 10년 대운 (Decade Flow)',
            ...Array.from({ length: 10 }, (_, i) =>
                `- **${currentYear + i}년**: ${i % 3 === 0 ? '성장기' : i % 3 === 1 ? '수양기' : '도약기'}`
            ),
            '',
            '### 🗓️ 12개월 월운 패턴',
            '각 월별로 고유한 에너지 흐름이 있습니다.',
            '',
            '### ⏰ 황금 시간대',
            '하루 중 당신에게 가장 유리한 시간대를 활용하세요.',
        ]
    };
}

// ============== 메인 생성 함수 ==============
export function generateFullReport(userName: string, iljuKey: string): FullReportContent {
    const iljuData = SAJU_ILJU[iljuKey] || SAJU_ILJU['GAP_JA'];

    const sections: ReportSection[] = [
        generateCoreSection(iljuData, userName),
        generateLifeCodeSection(iljuData),
        generateCareerSection(iljuData),
        generateRelationshipSection(iljuData),
        generateHealthSection(iljuData),
        generateChronosSection(),
    ];

    return {
        userName,
        iljuKey,
        generatedAt: new Date().toISOString(),
        totalPages: 80,
        sections,
    };
}

// ============== 마크다운 변환 ==============
export function reportToMarkdown(report: FullReportContent): string {
    const lines: string[] = [
        `# 소울 아카이브 리포트`,
        ``,
        `**수신인:** ${report.userName}님`,
        `**발행일:** ${new Date(report.generatedAt).toLocaleDateString('ko-KR')}`,
        `**총 페이지:** ${report.totalPages}페이지`,
        ``,
        `---`,
        ``,
    ];

    for (const section of report.sections) {
        lines.push(`# ${section.title}`);
        lines.push(`*${section.subtitle}* (${section.pageRange}페이지)`);
        lines.push('');
        lines.push(...section.content);
        lines.push('');
        lines.push('---');
        lines.push('');
    }

    return lines.join('\n');
}
