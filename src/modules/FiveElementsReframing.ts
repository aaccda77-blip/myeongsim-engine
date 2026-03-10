/**
 * FiveElementsReframing.ts
 * 오행(Five Elements) 기능적 과학 리프레이밍 모듈
 * 
 * 목화토금수(木火土金水)를 에너지의 '작동 방식(Function)'으로 정의
 * 뇌과학/심리학/시스템 설계 관점으로 재정의
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface ElementDefinition {
    id: string;
    traditional: string;
    hanja: string;
    systemName: string;
    systemNameEn: string;
    varName: string;
    icon: string;
    keywords: string[];
    neuroscience: string;
    darkPattern: string;
    lightPattern: string;
    activationTip: string;
}

export class FiveElementsReframing {

    static readonly ELEMENTS: ElementDefinition[] = [
        {
            id: 'WOOD',
            traditional: '목',
            hanja: '木',
            systemName: '성장/창의 알고리즘',
            systemNameEn: 'Growth Algorithm',
            varName: 'Growth_Algo',
            icon: '🌱',
            keywords: ['시작', '기획', '신경망 확장', '호기심', '학습', '창의성'],
            neuroscience: '해마(Hippocampus)의 신경가소성 — 새로운 신경망 연결을 형성하는 학습 회로',
            darkPattern: '우유부단, 분산, 과잉 기획 — 항상 "시작"만 하고 완성하지 못하는 패턴',
            lightPattern: '빠른 학습력, 기획력, 적응적 성장 — 어떤 상황에서도 새로운 가능성을 발견',
            activationTip: '매일 새로운 것을 하나씩 배우세요. 뇌의 수상돌기가 새 연결을 만들어 [Growth Algo]가 강화됩니다.'
        },
        {
            id: 'FIRE',
            traditional: '화',
            hanja: '火',
            systemName: '발산/표현 에너지',
            systemNameEn: 'Energy Output',
            varName: 'Energy_Output',
            icon: '🔥',
            keywords: ['열정', '확산', '쇼맨십', '가시화', '리더십', '동기'],
            neuroscience: '도파민 보상 회로 — 목표 달성과 사회적 인정에 반응하는 동기 시스템',
            darkPattern: '번아웃, 과잉 표현, 충동성 — 에너지가 폭발하여 다 소모되는 패턴',
            lightPattern: '강력한 표현력, 설득력, 영감 — 주변 사람들을 이끄는 카리스마',
            activationTip: '당신의 아이디어를 밖으로 표현하세요. 발표, 글쓰기, 창작 — [Energy Output]이 활성화됩니다.'
        },
        {
            id: 'EARTH',
            traditional: '토',
            hanja: '土',
            systemName: '중재/저장 플랫폼',
            systemNameEn: 'Stabilizer',
            varName: 'Stabilizer',
            icon: '⛰️',
            keywords: ['수용', '연결', '신뢰', '데이터 축적', '안정', '중재'],
            neuroscience: '기저핵(Basal Ganglia) — 루틴, 습관, 패턴 저장을 담당하는 안정화 회로',
            darkPattern: '우유부단, 지나친 의존, 과잉 수용 — 모든 것을 받아들이다 자신을 잃음',
            lightPattern: '뛰어난 중재력, 신뢰성, 포용력 — 다양한 요소를 통합하는 플랫폼 역할',
            activationTip: '규칙적인 루틴을 유지하세요. 기저핵이 패턴을 저장할 때 [Stabilizer]가 강화됩니다.'
        },
        {
            id: 'METAL',
            traditional: '금',
            hanja: '金',
            systemName: '결단/분석 로직',
            systemNameEn: 'Logic Crystal',
            varName: 'Logic_Crystal',
            icon: '💎',
            keywords: ['이성', '규칙', '분류', '최적화', '정밀', '결단'],
            neuroscience: '전두엽 집행 기능 — 논리적 분석, 의사결정, 불필요한 요소 제거',
            darkPattern: '완벽주의, 경직성, 냉담함 — 감정을 차단하고 규칙에만 집착하는 패턴',
            lightPattern: '예리한 분석력, 객관성, 효율성 — 핵심을 정확히 파악하고 최적화',
            activationTip: '매일 아침 오늘의 우선순위 TOP 3을 적으세요. [Logic Crystal]이 활성화됩니다.'
        },
        {
            id: 'WATER',
            traditional: '수',
            hanja: '水',
            systemName: '유연/지혜 스트림',
            systemNameEn: 'Flow Stream',
            varName: 'Flow_Stream',
            icon: '🌊',
            keywords: ['적응', '통찰', '침투', '회복탄력성', '지혜', '직관'],
            neuroscience: '디폴트 모드 네트워크(DMN) — 내성, 직관, 창의적 통찰을 생성하는 회로',
            darkPattern: '우울, 반추, 고립 — 깊이 생각하다가 부정적 시나리오에 빠지는 패턴',
            lightPattern: '깊은 통찰력, 적응력, 지혜 — 어떤 환경에서도 흘러가며 살아남는 힘',
            activationTip: '명상, 산책, 샤워 중 아이디어를 기록하세요. DMN이 활성화될 때 [Flow Stream]이 최고조에 달합니다.'
        },
    ];

    /** 두 원소의 상호작용 분석 */
    static analyzeInteraction(elem1: string, elem2: string): string {
        const GENERATE: Record<string, string> = {
            'WOOD-FIRE': '🌱→🔥: [Growth Algo]가 [Energy Output]을 점화 — 아이디어가 표현으로 발산됨',
            'FIRE-EARTH': '🔥→⛰️: [Energy Output]이 [Stabilizer]를 강화 — 열정이 안정적 플랫폼을 만듦',
            'EARTH-METAL': '⛰️→💎: [Stabilizer]가 [Logic Crystal]을 형성 — 축적된 데이터가 정밀 분석으로',
            'METAL-WATER': '💎→🌊: [Logic Crystal]이 [Flow Stream]을 생성 — 분석이 깊은 통찰로 흐름',
            'WATER-WOOD': '🌊→🌱: [Flow Stream]이 [Growth Algo]에 영양 공급 — 지혜가 새 성장을 촉진',
        };
        const key1 = `${elem1}-${elem2}`;
        const key2 = `${elem2}-${elem1}`;
        return GENERATE[key1] || GENERATE[key2] || `두 에너지의 복합 상호작용 — 개인 분석 필요`;
    }

    /** AI 프롬프트 주입용 오행 리프레이밍 사전 */
    static generatePromptDictionary(): string {
        let dict = `\n[⚡ 에너지 모달리티 시스템 (Five Energy Modality System)]\n`;
        dict += `**절대 규칙**: 사용자에게 "목화토금수", "오행"이라는 전통 용어를 직접 사용하지 마십시오.\n`;
        dict += `반드시 아래의 에너지 모달리티 명칭으로 변환하여 설명하십시오.\n\n`;
        dict += `**예시:**\n`;
        dict += `"당신의 화(火)가 강합니다" (❌)\n`;
        dict += `→ "당신의 🔥 [Energy Output] 모달리티가 높게 측정되었습니다" (✅)\n\n`;

        for (const el of this.ELEMENTS) {
            dict += `### ${el.icon} ${el.traditional}(${el.hanja}) → **"${el.systemName}" (${el.systemNameEn})** \`${el.varName}\`\n`;
            dict += `  키워드: ${el.keywords.join(', ')}\n`;
            dict += `  뇌과학: ${el.neuroscience}\n`;
            dict += `  🔴 다크 패턴: ${el.darkPattern}\n`;
            dict += `  🟢 라이트 패턴: ${el.lightPattern}\n`;
            dict += `  💡 활성화 팁: ${el.activationTip}\n\n`;
        }

        dict += `### 에너지 분석 출력 형식\n`;
        dict += `사용자의 오행 분포를 분석할 때 아래 포맷으로 출력하십시오:\n\n`;
        dict += `**[에너지 모달리티 스캔 결과]**\n`;
        dict += `- 🌱 Growth Algo (목): {강도} / 특성: {설명}\n`;
        dict += `- 🔥 Energy Output (화): {강도} / 특성: {설명}\n`;
        dict += `- ⛰️ Stabilizer (토): {강도} / 특성: {설명}\n`;
        dict += `- 💎 Logic Crystal (금): {강도} / 특성: {설명}\n`;
        dict += `- 🌊 Flow Stream (수): {강도} / 특성: {설명}\n`;
        dict += `→ **주요 활성 모달리티:** {가장 강한 원소} — **보완 필요 모달리티:** {가장 약한 원소}\n`;

        return dict;
    }
}
