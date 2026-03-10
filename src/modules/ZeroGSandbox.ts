/**
 * ZeroGSandbox.ts
 * 공망(空亡) → 제로-지 샌드박스 (Zero-G Sandbox) 리브랜딩 모듈
 * 
 * 핵심: "비어있는 구멍이 아니라, 우주의 지혜를 다운로드하는 초고속 안테나"
 * 뇌과학: 디폴트 모드 네트워크(DMN) 과활성화 → 창의성 폭발
 * 
 * ⚠️ 독립 모듈 — 기존 챗봇 시스템에 영향 없음
 */

export interface VoidZoneInterpretation {
    pillar: string;
    pillarEn: string;
    legacyName: string;
    myeongsimName: string;
    systemCode: string;
    icon: string;
    oldInterpretation: string;
    newInterpretation: string;
    meaning: string;
    advantage: string;
}

export class ZeroGSandbox {

    static readonly SYSTEM_NAME = '제로-지 샌드박스 (Zero-G Sandbox)';
    static readonly SYSTEM_CODE = 'Null_Space_Potential';
    static readonly ICON = '👩‍🚀';
    static readonly SLOGAN = '중력을 거스르는 상상력의 해방구';

    static readonly DEFINITION =
        '현실의 중력(제약)이 작동하지 않는 무중력 창의 구역. ' +
        '일반적인 노력(Input) 대비 결과(Output)의 효율은 떨어질 수 있으나, ' +
        '기존의 틀을 깨는 혁신적인 아이디어와 영적인 성장이 폭발하는 가상 테스트 베드.';

    static readonly PILLAR_VOIDS: VoidZoneInterpretation[] = [
        {
            pillar: '년주', pillarEn: 'Year',
            legacyName: '조상덕이 없다, 고향을 떠난다',
            myeongsimName: '레거시 코드 리셋 구역',
            systemCode: 'Legacy_Reset_Zone',
            icon: '⚠️',
            oldInterpretation: '조상의 도움 없음, 고향을 떠남',
            newInterpretation: '부모/조상의 기존 시스템(Legacy)을 물려받지 않고, 완전히 새로운 포맷으로 초기화하여 스스로 OS를 구축하는 자수성가형 개발자',
            meaning: '가문의 업(Karma)이나 제약에서 완전히 해방된 상태. 과거의 유산에 묶이지 않고 독자적인 시스템을 설계할 수 있는 자유.',
            advantage: '가문의 업(Karma)이나 제약으로부터 자유로움'
        },
        {
            pillar: '월주', pillarEn: 'Month',
            legacyName: '부모형제 덕이 없다, 사회 적응이 어렵다',
            myeongsimName: '소셜 다이슨 스피어 - 독자 생태계',
            systemCode: 'Social_Dyson_Sphere',
            icon: '📡',
            oldInterpretation: '부모형제 도움 없음, 사회 부적응',
            newInterpretation: '기존의 사회적 규격이나 조직 논리가 통하지 않는 아웃사이더 혁신가. 자신만의 중력장을 만드는 독자적인 생태계에서 성공.',
            meaning: '일반적인 직장 생활보다는 프리랜서, 창업, 예술 등 독자적인 영역에서 능력 발휘.',
            advantage: '사회적 통념에 얽매이지 않는 파격적인 시도 가능'
        },
        {
            pillar: '일주', pillarEn: 'Day',
            legacyName: '배우자 덕이 없다, 마음이 늘 허전하다',
            myeongsimName: '뉴럴 디커넥트 - 영적 자각 모드',
            systemCode: 'Avatar_Disconnect',
            icon: '🧘',
            oldInterpretation: '배우자 덕 없음, 내면 공허',
            newInterpretation: '자아(Ego)와 현실의 연결이 느슨하여, 현실감보다는 이상적인 가치나 영적인 세계에 깊이 몰입. 자신 내면의 결핍을 스스로 채우며 완성되는 홀로서기 알고리즘.',
            meaning: '배우자나 파트너에게 의존하기보다 내면의 성장으로 자기 완성을 이루는 경로.',
            advantage: '고도의 정신적 성취, 종교/철학/심리 분야의 탁월함'
        },
        {
            pillar: '시주', pillarEn: 'Hour',
            legacyName: '자식 덕이 없다, 말년이 고독하다',
            myeongsimName: '오픈 엔딩 시나리오 - 무한 가능성',
            systemCode: 'Open_Ending_Future',
            icon: '🚀',
            oldInterpretation: '자식 덕 없음, 말년 고독',
            newInterpretation: '정해진 결말(Close Ending)이 없는 열린 미래. 죽는 순간까지 꿈을 꾸고 도전하는 영원한 현역. 말년은 정신적 유산(Legacy)을 남기는 데 최적화.',
            meaning: '자식이나 세속적 결과물에 집착하기보다 끝없이 성장하는 삶의 방식.',
            advantage: '나이가 들어도 늙지 않는 호기심과 꿈'
        }
    ];

    static readonly NEUROSCIENCE_EXPLANATION =
        '뇌과학적으로 공망은 디폴트 모드 네트워크(DMN)가 과활성화된 상태와 같습니다. ' +
        '현실적인 과제에 집중할 때는 효율이 떨어지지만(멍때리기), 이 순간 뇌는 ' +
        '서로 관련 없는 기억들을 연결하여 창의적인 아이디어를 생성해냅니다. ' +
        '당신의 공망은 비어있는 구멍이 아니라, 우주의 지혜를 다운로드하는 초고속 안테나입니다. ' +
        '현실의 욕심을 조금만 비워내면(Empty), 그곳은 무한한 잠재력(Potential)으로 채워질 것입니다.';

    static getPillarVoid(pillarEn: string): VoidZoneInterpretation | undefined {
        return this.PILLAR_VOIDS.find(p => p.pillarEn === pillarEn);
    }

    /** AI 프롬프트 주입용 공망 리브랜딩 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[🌌 공망(空亡) → 제로-지 샌드박스 리브랜딩 프로토콜]\n`;
        p += `**절대 규칙**: "공망"이라는 단어를 절대 직접 사용하지 마십시오.\n`;
        p += `반드시 "${this.SYSTEM_NAME}"으로 변환하여 설명하십시오.\n`;
        p += `시스템 코드: \`${this.SYSTEM_CODE}\`\n\n`;
        p += `**정의:** ${this.DEFINITION}\n\n`;
        p += `**뇌과학 설명:** ${this.NEUROSCIENCE_EXPLANATION}\n\n`;

        p += `### 위치별 해석 가이드\n`;
        for (const v of this.PILLAR_VOIDS) {
            p += `\n#### ${v.icon} ${v.pillar} 공망 → **[${v.myeongsimName}]** \`${v.systemCode}\`\n`;
            p += `  ❌ 기존: "${v.oldInterpretation}"\n`;
            p += `  ✅ 명심: "${v.newInterpretation}"\n`;
            p += `  💡 장점: ${v.advantage}\n`;
        }

        p += `\n### 챗봇 출력 예시\n`;
        p += `"대표님, 시스템 로그에 Null_Space(제로-지 샌드박스)가 감지되었습니다.\n`;
        p += ` 이것은 오류가 아니라 특별한 기능입니다.\n`;
        p += ` 당신의 ${this.SYSTEM_NAME}은 비어있는 구멍이 아니라,\n`;
        p += ` 우주의 지혜를 다운로드하는 초고속 안테나입니다."\n`;

        return p;
    }
}
