import { SAJU_ILJU } from '@/data/StaticTextDB';

// Define the structure of the comprehensive report
export const assembleFullReport = (userName: string, iljuId: string = "GAP_JA") => {
    // 1. Fetch Data Blocks
    // Safety check: if iljuId doesn't exist, fallback to GAP_JA
    const iljuData = SAJU_ILJU[iljuId] || SAJU_ILJU["GAP_JA"];

    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    // 2. Assemble Content (LEGO Block Assembly - Mega Scale)
    let report = "";

    // --- PROLOGUE ---
    report += `# [MIND CODE] 기질 설계도 종합 리포트\n\n`;
    report += `**수신인:** ${userName} 님\n`;
    report += `**발행일:** ${today}\n`;
    report += `**문서 코드:** ${iljuData.id.toUpperCase()}-BLUEPRINT-80P\n`;
    report += `\n> "이 문서는 당신의 무의식에 각인된 기질 설계도를 64비트 정밀 코드로 분석한 80페이지 분량의 심층 기록입니다."\n\n`;
    report += `---\n\n`;

    // --- PART 1: THE CORE (20 Pages) ---
    report += `## PART 1. 당신의 본질 (The Core)\n\n`;
    report += `### 1.1 타고난 기질과 운명 코드\n`;
    report += `**[일주론 심층 분석]**\n`;
    report += `당신은 **${iljuData.title}**의 에너지를 타고났습니다.\n`;
    report += `${iljuData.main_text}\n\n`;
    report += `**이미지 메타포:** ${iljuData.image_metaphor}\n\n`;

    // Detailed Strength Analysis (Expansion)
    report += `### 1.2 핵심 강점 (Signature Strengths) 정밀 진단\n`;
    iljuData.strengths?.forEach((s, i) => {
        report += `**Strength ${i + 1}: ${s}**\n`;
        report += `- 이 강점은 당신이 위기 상황에서 본능적으로 발휘하는 힘입니다.\n`;
        report += `- 사회적 성공을 위해 이 강점을 어떻게 활용해야 하는지 구체적으로 설계해야 합니다.\n\n`;
    });

    // Detailed Weakness Analysis (Expansion)
    report += `### 1.3 그림자 (The Shadow)와 극복 전략\n`;
    iljuData.weaknesses?.forEach((w, i) => {
        report += `**Shadow ${i + 1}: ${w}**\n`;
        report += `- 이 그림자는 당신이 스트레스를 받을 때 무의식적으로 튀어나옵니다.\n`;
        report += `- 해결책: 이를 억누르려 하지 말고, '아, 내 그림자가 나왔구나'라고 알아차리는 메타인지가 필요합니다.\n\n`;
    });

    // --- PART 2: THE NEURAL KEYS (20 Pages) ---
    report += `\n---\n\n`;
    report += `## PART 2. 유전자 키와 의식의 진화 (Neural Keys)\n\n`;
    report += `당신의 DNA에 각인된 3단계 의식 수준을 해독합니다.\n\n`;

    report += `### 🌑 1단계: 그림자 (The Shadow) - ${iljuData.dark_code?.name || ''}\n`;
    report += `**"당신을 옭아매는 무의식의 공포"**\n`;
    report += `> ${iljuData.dark_code?.desc || ''}\n\n`;
    report += `**신체적 징후:** ${iljuData.dark_code?.body_symptom || ''}\n`;
    report += `이 상태에 머물 때 당신은 피해자 의식에 빠지게 됩니다. 하지만 이것은 진화를 위한 연료입니다.\n\n`;

    report += `### 🧬 2단계: 선물 (The Gift) - ${iljuData.neural_code?.name || ''}\n`;
    report += `**"그림자를 수용할 때 드러나는 천재성"**\n`;
    report += `> ${iljuData.neural_code?.desc || ''}\n\n`;
    report += `**Action Item:** ${iljuData.neural_code?.action || ''}\n\n`;

    report += `### ✨ 3단계: 시디 (The Siddhi) - ${iljuData.meta_code?.name || ''}\n`;
    report += `**"당신이 도달할 궁극의 상태"**\n`;
    report += `> ${iljuData.meta_code?.desc || ''}\n\n`;

    // --- PART 3: CHRONOS (Time Flow) - 30 Pages simulation ---
    report += `\n---\n\n`;
    report += `## PART 3. 운의 흐름 (Chronos Analysis)\n\n`;
    report += `향후 10년의 대운과 12개월의 상세 흐름을 분석합니다.\n\n`;

    report += `### 3.1 10년 대운 (The Decade Flow)\n`;
    for (let i = 1; i <= 10; i++) {
        const year = new Date().getFullYear() + i - 1;
        report += `#### [${year}년] - ${((i % 2 === 0) ? "성장과 확장" : "내실과 수양")}의 해\n`;
        report += `- **키워드:** ${((i % 2 === 0) ? "도약, 기회, 만남" : "준비, 학습, 성찰")}\n`;
        report += `- **재물운:** 흐름이 ${(i % 2 === 0) ? "상승 곡선을 그립니다." : "안정적으로 유지됩니다."}\n`;
        report += `- **조언:** ${((i % 2 === 0) ? "물 들어올 때 노 저으세요." : "다음 도약을 위해 잠시 숨을 고르세요.")}\n\n`;
    }

    report += `### 3.2 12개월 상세 월운 (The Monthly Rhythm)\n`;
    for (let m = 1; m <= 12; m++) {
        report += `#### ${m}월 (Month ${m})\n`;
        report += `- **에너지 레벨:** ${Math.floor(Math.random() * 40 + 60)}%\n`;
        report += `- **이달의 미션:** ${m}월에는 새로운 ${((m % 3 === 0) ? "사람을 만나보세요." : "지식을 쌓으세요.")}\n`;
        report += `- **주의사항:** 감정적인 소비를 조심하고, 건강 관리에 유의하세요.\n\n`;
    }

    // --- PART 4: HOLISTIC LIFE STRATEGY (10 Pages) ---
    report += `\n---\n\n`;
    report += `## PART 4. 영역별 인생 전략 (Life Strategy)\n\n`;

    report += `### 💼 Career & Wealth\n`;
    report += `- **적성 직무:** ${iljuData.career_fit?.join(", ") || '다양한 적성'}\n`;
    report += `- **성공 전략:** 당신은 주도적 성향이 강하므로, 환경을 제어하고 프로젝트를 리드할 때 최고의 성과를 냅니다.\n`;
    report += `- **부의 에너지:** 당신의 자원 관리 알고리즘은 ${iljuData.lucky_elements?.number}번 코드와 관련이 깊습니다.\n\n`;

    report += `### ❤️ Relationship & Love\n`;
    report += `- **연애 스타일:** ${iljuData.relationship_style}\n`;
    report += `- **잘 맞는 파트너:** 서로의 독립성을 존중해주는 사람.\n\n`;

    report += `### 🏥 Wellness & Bio-Rhythm\n`;
    report += `- **건강 주의보:** ${iljuData.health_warning}\n`;
    report += `- **행운의 컬러:** ${iljuData.lucky_elements?.color}\n`;
    report += `- **행운의 방향:** ${iljuData.lucky_elements?.direction}\n\n`;

    report += `\n---\n`;
    report += `### [Epilogue] 당신의 여정을 응원합니다.\n`;
    report += `... (생략된 50페이지 분량의 심층 데이터는 유료 버전에서 전체 열람 가능합니다) ...\n`;
    report += `\n*Analysis by Myeongsim Bio-Sync Engine v2.0*`;

    // --- Return Structured Data ---
    return {
        full_text: report,
        saju_analysis: report, // For backward compatibility with View
        action_now: iljuData.neural_code?.action || "잠시 눈을 감고 호흡에 집중하세요.",
        action_today: `새로운 시작의 기운(${iljuData.visual_token})을 느껴보세요.`,
        action_week: `${iljuData.lucky_elements?.direction} 방향으로 산책을 다녀오세요.`
    };
};
