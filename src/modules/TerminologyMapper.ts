/**
 * TerminologyMapper.ts
 * 명심코칭 과학적 용어 변환 모듈
 * 
 * 전통 명리학 용어 → 뇌과학/심리학/코칭/CBT/MBCT 용어로 변환
 * 기존 챗봇 시스템에 영향 없는 독립 모듈
 * 
 * ⚠️ 저작권 안전: 모든 변환 용어는 학술 공용 용어 또는 명심코칭 고유 용어
 */

export interface TermMapping {
    traditional: string;         // 전통 명리 용어
    traditionalHanja: string;    // 한자
    myeongsimTerm: string;       // 명심코칭 고유 용어
    englishTerm: string;         // 영문 용어
    neuroscience: string;        // 뇌과학 근거
    psychology: string;          // 심리학 개념
    cbtFraming: string;          // CBT/MBCT 프레이밍
    description: string;         // AI 설명용 한 줄 정의
}

export class TerminologyMapper {

    // ========================================================================
    // 십신(十神) 과학적 용어 매핑 테이블
    // ========================================================================
    static readonly TERM_MAP: TermMapping[] = [
        {
            traditional: '편관',
            traditionalHanja: '偏官',
            myeongsimTerm: '프레셔 코드',
            englishTerm: 'Pressure Code',
            neuroscience: '편도체(Amygdala) 과잉 활성화로 인한 위협 탐지 모드',
            psychology: '과잉경계 시스템 (Hyper-Vigilance System)',
            cbtFraming: '자동적 사고(Automatic Thought) 중 위험 과대평가 패턴',
            description: '외부 압력에 민감하게 반응하는 내면의 경보 시스템'
        },
        {
            traditional: '칠살',
            traditionalHanja: '七殺',
            myeongsimTerm: '프레셔 코드',
            englishTerm: 'Pressure Code',
            neuroscience: '편도체(Amygdala) 과잉 활성화로 인한 위협 탐지 모드',
            psychology: '과잉경계 시스템 (Hyper-Vigilance System)',
            cbtFraming: '자동적 사고(Automatic Thought) 중 위험 과대평가 패턴',
            description: '외부 압력에 민감하게 반응하는 내면의 경보 시스템'
        },
        {
            traditional: '정관',
            traditionalHanja: '正官',
            myeongsimTerm: '사회적 규범 센서',
            englishTerm: 'Social Norm Sensor',
            neuroscience: '전전두엽(Prefrontal Cortex) 억제 기능',
            psychology: '초자아(Superego) 기반 자기 조절 시스템',
            cbtFraming: '당위적 사고("~해야 한다") 패턴의 내면화',
            description: '규칙과 질서를 통해 안정감을 추구하는 내면의 관리자'
        },
        {
            traditional: '겁재',
            traditionalHanja: '劫財',
            myeongsimTerm: '비교 알고리즘',
            englishTerm: 'Comparison Algorithm',
            neuroscience: '사회적 비교 시 전대상피질(ACC) 활성화',
            psychology: '사회적 비교 편향 (Social Comparison Bias)',
            cbtFraming: '인지 왜곡: 부당한 비교(Unfair Comparison)',
            description: '타인과의 경쟁·비교를 통해 자신의 가치를 측정하려는 패턴'
        },
        {
            traditional: '비견',
            traditionalHanja: '比肩',
            myeongsimTerm: '자기 확장 드라이브',
            englishTerm: 'Self-Expansion Drive',
            neuroscience: '도파민 보상 회로 기반 자아 강화 동기',
            psychology: '자기효능감(Self-Efficacy) 추동 시스템',
            cbtFraming: '핵심 신념: "나는 스스로 해낼 수 있다"',
            description: '독립적 추진력과 자기 주장을 담당하는 내면의 엔진'
        },
        {
            traditional: '식신',
            traditionalHanja: '食神',
            myeongsimTerm: '창의 출력 모드',
            englishTerm: 'Creative Output Mode',
            neuroscience: '디폴트 모드 네트워크(DMN) 활성화',
            psychology: '몰입(Flow State) 및 자기표현 욕구',
            cbtFraming: '건강한 자기표현 및 정서 방출 채널',
            description: '여유롭고 자연스러운 창작·표현 에너지'
        },
        {
            traditional: '상관',
            traditionalHanja: '傷官',
            myeongsimTerm: '반항 루틴',
            englishTerm: 'Rebel Routine',
            neuroscience: '전전두엽-편도체 갈등 시 반동 형성(Reaction Formation)',
            psychology: '권위에 대한 저항 및 자유 추구 기제',
            cbtFraming: '인지 왜곡: 흑백 논리(All-or-Nothing Thinking)',
            description: '기존 틀을 깨고 새로운 방식을 추구하는 도전적 에너지'
        },
        {
            traditional: '편재',
            traditionalHanja: '偏財',
            myeongsimTerm: '기회 스캐너',
            englishTerm: 'Opportunity Scanner',
            neuroscience: '보상 회로(Reward Circuit) 활성화 및 도파민 서지',
            psychology: '감각추구 성향(Sensation Seeking)',
            cbtFraming: '행동 활성화: 새로운 경험에 대한 접근 동기',
            description: '다양한 기회를 포착하고 빠르게 행동하는 에너지'
        },
        {
            traditional: '정재',
            traditionalHanja: '正財',
            myeongsimTerm: '안정화 프로토콜',
            englishTerm: 'Stabilization Protocol',
            neuroscience: '세로토닌 안정 시스템 기반 항상성 유지',
            psychology: '안전 기지(Secure Base) 유지 욕구',
            cbtFraming: '핵심 신념: "꾸준함이 안전을 보장한다"',
            description: '안정적 자산 관리와 꾸준한 축적을 추구하는 에너지'
        },
        {
            traditional: '편인',
            traditionalHanja: '偏印',
            myeongsimTerm: '비관습 학습 코드',
            englishTerm: 'Unconventional Learning Code',
            neuroscience: '신경가소성(Neuroplasticity) 회로 활성화',
            psychology: '발산적 사고(Divergent Thinking)',
            cbtFraming: '인지 유연성: 대안적 관점 탐색',
            description: '틀에 얽매이지 않는 독창적 사고와 직관적 학습 방식'
        },
        {
            traditional: '정인',
            traditionalHanja: '正印',
            myeongsimTerm: '지식 수용 모드',
            englishTerm: 'Knowledge Receptor Mode',
            neuroscience: '해마(Hippocampus) 기반 학습·기억 패턴',
            psychology: '수용적 학습(Receptive Learning) 및 돌봄 욕구',
            cbtFraming: '핵심 신념: "배움은 나를 성장시킨다"',
            description: '학습과 보호를 통해 내면의 안정감을 구축하는 에너지'
        },
    ];

    // ========================================================================
    // 추가 용어 매핑 (비 십신 용어)
    // ========================================================================
    static readonly EXTRA_TERMS: Record<string, string> = {
        '공망': '에너지 공백 구간 (Void Phase)',
        '형충': '내면 갈등 포인트 (Inner Conflict Point)',
        '삼합': '시너지 결합 (Synergy Bond)',
        '육합': '조화 연결 (Harmony Link)',
        '원진': '에너지 부조화 (Energy Dissonance)',
        '파': '패턴 균열 (Pattern Fracture)',
        '해': '연결 해제 (Disconnection Signal)',
        '역마': '이동 에너지 (Mobility Drive)',
        '화개': '내면 탐구 모드 (Introspection Mode)',
        '도화': '대인 매력 코드 (Charisma Code)',
        '괴강': '극단적 집중 모드 (Hyper-Focus Mode)',
        '양인': '날카로운 결단력 (Sharp Decision Engine)',
        '관살혼잡': '다중 압력 과부하 (Multi-Pressure Overload)',
        '재다신약': '에너지 분산 경고 (Energy Dispersion Alert)',
        '신강': '자아 에너지 과잉 (High Self-Energy)',
        '신약': '자아 에너지 부족 (Low Self-Energy)',
    };

    // ========================================================================
    // API: 용어 변환
    // ========================================================================

    /** 전통 용어 → 명심코칭 용어 변환 */
    static convert(traditional: string): string {
        const found = this.TERM_MAP.find(t => t.traditional === traditional);
        if (found) return found.myeongsimTerm;
        return this.EXTRA_TERMS[traditional] || traditional;
    }

    /** 전통 용어 → 풀 설명 (AI 프롬프트용) */
    static getFullDescription(traditional: string): string | null {
        const found = this.TERM_MAP.find(t => t.traditional === traditional);
        if (!found) return null;
        return `${found.myeongsimTerm}(${found.englishTerm}): ${found.description}. 뇌과학적으로는 ${found.neuroscience}. 심리학에서는 ${found.psychology}. CBT 관점에서는 ${found.cbtFraming}.`;
    }

    // ========================================================================
    // AI 프롬프트 주입용 변환 사전 생성
    // ========================================================================
    static generatePromptDictionary(): string {
        let dict = `\n[명심코칭 과학적 용어 변환 프로토콜]\n`;
        dict += `**절대 규칙**: 아래 전통 명리 용어를 사용자에게 직접 노출하지 마십시오. 반드시 '명심코칭 용어'로 변환하여 사용하십시오.\n\n`;

        // 십신 매핑
        dict += `**[십신 변환 테이블]**\n`;
        for (const t of this.TERM_MAP) {
            if (t.traditional === '칠살') continue; // 편관과 동일
            dict += `- "${t.traditional}(${t.traditionalHanja})" → **"${t.myeongsimTerm}"** (${t.englishTerm})\n`;
            dict += `  뇌과학: ${t.neuroscience}\n`;
            dict += `  심리학: ${t.psychology}\n`;
            dict += `  CBT: ${t.cbtFraming}\n`;
        }

        // 추가 용어
        dict += `\n**[추가 용어 변환]**\n`;
        for (const [k, v] of Object.entries(this.EXTRA_TERMS)) {
            dict += `- "${k}" → **"${v}"**\n`;
        }

        dict += `\n**[변환 예시]**\n`;
        dict += `- ❌ "당신의 사주에 칠살이 있어서 위험합니다" → 절대 금지!\n`;
        dict += `- ✅ "당신의 프레셔 코드(Pressure Code)가 활성화 상태입니다. 이는 편도체의 과잉 경계 모드로, 위협을 과대평가하는 자동적 사고 패턴입니다. 이 코드를 인식하는 것만으로도 뇌의 전전두엽이 개입하여 경보를 해제할 수 있습니다."\n`;

        return dict;
    }
}
