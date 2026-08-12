/**
 * TextSanitizer.ts
 * 명심코칭 용어 메타포 새니타이저 (Updated Version)
 * 
 * 딱딱하고 기계적인 학술 용어를 배제하고,
 * 초보자도 쉽게 이해할 수 있는 따뜻하고 감동적인 메타포 에세이 어조로 런타임 변환합니다.
 */

export class TextSanitizer {

    /** 치환 맵: [전통/학술 용어, 명심코칭 따뜻한 메타포 용어] */
    private static readonly REPLACEMENT_MAP: [RegExp, string][] = [
                // === 0. IT/개발자 용어 100% 따뜻한 초보자 마음 언어로 정제 (사용자 직지 요청 반영) ===

        
        // === 0.2 Asterisk **** Bug Clean ===
        [/\*\*\*\*/g, '내면의'],
        [/\*\*\*/g, '내면의'],
        [/\(Karmic Loop\)/gi, ''],
        [/카르마적 패턴\(Karmic Loop\)/gi, '반복되는 마음의 습관'],
        [/아카식 레코드\(Akashic Records\)/gi, '지혜의 내면 기록함'],

        // === 0.1 ALL English Code Tags Wildcard Catch & Clean ===
        [/\[Victim_Ending\]/gi, '피해 의식과 억울함'],
        [/\[Peter_Pan_Bug\]/gi, '미성숙한 기대'],
        [/\[Thirst_Anxiety\]/gi, '생존 불안'],
        [/\[[A-Z][a-zA-Z0-9_]+\]/g, ''], // Strips any remaining [English_Code_Tags]


        [/당신의 내면에서 어떤 답이 들려오고 있나요?/g, '결론부터 말씀드리면, 지금 당장 무주로 전면 이주하시는 것은 권해드리지 않습니다.'],
        [/내부 코어 시스템의 최종 분석에 달려 있습니다/g, '현실적인 에너지 상태와 안전성을 최우선으로 고려해야 할 때입니다.'],


        [/\[Caretaker_Burnout\]/gi, '지친 마음의 상태(과잉 헌신과 소진)'],
        [/Caretaker_Burnout/gi, '지친 마음의 상태(과잉 헌신과 소진)'],
        [/Refusal of the Call/gi, '새로운 변화를 앞둔 마음의 망설임'],
        [/Eco_Optimizer_Solution/gi, '조직 힐러형 에너지'],
        [/\[Suspicion_OS\]/gi, '마음속 의심과 불안'],
        [/Suspicion_OS/gi, '마음속 의심과 불안'],

        [/\[Caretaker_Burnout\]/gi, '지친 마음의 상태(과잉 헌신과 소진)'],
        [/Caretaker_Burnout/gi, '지친 마음의 상태(과잉 헌신과 소진)'],
        [/피드백\s*루프\s*파이프라인/gi, '마음을 열고 주변의 소중한 조언과 다른 의견을 따뜻하게 경청하는 대화의 장'],
        [/피드백루프\s*파이프라인/gi, '마음을 열고 주변의 소중한 조언과 다른 의견을 따뜻하게 경청하는 대화의 장'],
        [/신경망\s*베이스라인\s*과부하/gi, '지친 마음의 상태(그동안 홀로 짊어져 온 무게와 책임감이 커서 에너지가 소진된 상태)'],
        [/신경망\s*베이스라인/gi, '지친 마음의 조화로운 리듬'],
        [/프레셔\s*코드\(Pressure\s*Code\)/gi, '어깨 위의 보이지 않는 무게와 책임감'],
        [/프레셔\s*코드/gi, '어깨 위의 보이지 않는 무게와 책임감'],
        [/프레셔코드/gi, '어깨 위의 보이지 않는 무게와 책임감'],
        [/제로-지\s*샌드박스\s*\(Zero-G\s*Sandbox\s*\/\s*공망\)/gi, '자유로운 준비 기간(중압감에서 벗어나 나만의 새로운 꿈에 집중하는 기회의 시간)'],
        [/제로-지\s*샌드박스/gi, '자유로운 준비 기간'],
        [/Zero-G\s*Sandbox/gi, '자유로운 준비 기간'],
        [/레거시\s*다크\s*코드\s*&\s*프로토콜/gi, '반복되는 마음의 습관과 오랫동안 붙잡고 있던 상처'],
        [/레거시\s*다크\s*코드/gi, '반복되는 오랫동안의 마음의 습관'],
        [/레거시\s*다크코드/gi, '반복되는 오랫동안의 마음의 습관'],
        [/디버깅\s*파라미터/gi, '따뜻한 마음 조율 지침'],
        [/알고리즘\s*최적화/gi, '마음의 평온을 찾는 3단계 흐름'],
        [/스케일러블\s*인프라/gi, '사람들의 마음을 얻는 든든한 내면 울타리'],
        // === 1. 영문 코드어 및 개발자/IT 태그 -> 정갈한 한글 메타포 정제 ===
        [/\[Suspicion_OS\s*\(의심\s*운영체제\)\]/gi, "마음속 스스로를 의심하는 먹구름"],
        [/Suspicion_OS/gi, '스스로를 의심하는 마음'],
        [/창의\s*출력\s*모드\(Creative\s*Output\s*Mode\)/gi, '창의력을 꽃피우는 마음'],
        [/Creative\s*Output\s*Mode/gi, '창의력을 꽃피우는 마음'],
        [/기회\s*스캐너\(Opportunity\s*Scanner\)/gi, '행운을 발견하는 내면의 안테나'],
        [/Opportunity\s*Scanner/gi, '행운을 발견하는 내면의 안테나'],
        [/Core\s*Identity/gi, '영혼의 본질 기질'],
        [/Potential\s*Drive/gi, '미래의 꿈과 희망 에너지'],
        [/Precision_Leadership_Engine/g, '정밀 분석 리더'],
        [/Logic Crystal\(결단\/분석 로직\)/gi, '투명하고 예리한 보석 기질'],
        [/Logic Crystal/gi, '투명한 보석 기질'],
        [/Cold_Cut_Rel/gi, '냉정하게 단절하려는 아픔'],
        [/Knife_Word/gi, '상처가 되는 날카로운 말'],
        [/Growth\s*Algorithm/gi, '성장의 씨앗'],
        [/Growth\s*Algo/gi, '성장의 씨앗'],
        [/Suspicion\s*Loop/gi, '스스로를 의심하는 마음'],
        [/Background\s*DNA/gi, '뿌리 내면 에너지'],
        [/Titanium_Frame/gi, '견고한 철갑 기질'],
        [/\[RELATIONSHIP_SKILL\]/gi, '🌱 [관계 기술 코칭]'],
        [/Debugging/gi, '조율과 치유'],
        [/Akashic\s*Recorder\s*\(아카식\s*레코드\)/gi, '지혜의 내면 기록관'],
        [/Akashic\s*Recorder/gi, '지혜의 내면 기록관'],
        [/Social\s*Interface/gi, '사회적 무대의 소통 창구'],
        [/Energy\s*Output/gi, '내면 에너지를 세상에 펼치는 힘'],
        [/핀포인트\s*수다/gi, '깊은 명심 대화'],
        [/핀포인트\s*혜택/gi, '명심 지혜 혜택'],
        [/핀포인트/gi, '핵심 지혜'],

        // === 2. IT / 기계적 어휘 정제 (로직, 루틴, 코드) ===
        [/정밀\s*분석\s*로직/g, '예리한 통찰의 지혜'],
        [/분석\s*로직/g, '통찰의 지혜'],
        [/반항\s*루틴/g, '새로운 길을 찾으려는 내면의 용기'],
        [/루틴/g, '마음의 습관'],
        [/로직/g, '지혜'],

        // === 3. 학술/전통 용어 메타포 정제 (중복 치환 방지를 위해 단일 문구로 고정) ===
        [/연간 스트레스-대처 사이클\(Annual Stress-Coping Cycle\)/g, '올해 찾아오는 마음의 조수 리듬'],
        [/연간 스트레스-대처 사이클/g, '올해 찾아오는 마음의 조수 리듬'],
        [/사회적 규범 센서/g, "마음속 예의 바른 수호자"],
        [/사회적규범센서/g, "마음속 예의 바른 수호자"],
        [/프레셔 코드/g, "어깨 위의 보이지 않는 배낭"],
        [/프레셔코드/g, "어깨 위의 보이지 않는 배낭"],
        [/유전자 기반 스키마\(Genetic Schema\)/g, '조상과 뿌리의 무의식 유산'],
        [/사회화 신경망\(Social Neural Network\)/g, '사회적 무대 에너지'],
        [/핵심 자아 패턴\(Core Self Pattern\)/g, '영혼의 본질적 자아'],
        [/잠재 가소성\(Potential Plasticity\)/g, '미래의 숨겨진 잠재력'],
        [/초기 스키마\(Early Schema\)/g, '타고난 기질의 지도'],
        [/인지행동 프로필\(CBT Profile\)/g, '마음 상태 지도'],
        [/급성 스트레스 요인\(Acute Stressor\)/g, '마음의 긴장 파도'],
        [/초자아 규율 모듈\(Superego Regulation\)/g, '내면의 바른 안테나'],

        // === 4기둥 구조 (Neural Architecture) ===
        [/년주/g, '뿌리 에너지(년주)'],
        [/월주/g, '사회적 무대 에너지(월주)'],
        [/일주/g, '본질 자아 에너지(일주)'],
        [/시주/g, '꿈과 미래 에너지(시주)'],
        [/사주\s*명식/g, '타고난 마음의 지도'],
        [/사주\s*팔자/g, '타고난 8가지 생명 에너지'],
        [/원국/g, '내면의 타고난 바탕'],

        // === 핵심 시스템 (Core Systems) ===
        [/명리학/g, '동서양 마음학'],
        [/주역/g, '변화와 순환의 지혜'],
        [/점괘/g, '마음의 상징 청사진'],
        [/운세/g, '인생의 흐름과 계절'],
        [/만세력/g, '시간의 에너 지 지도'],

        // === 진키 / Gene Keys ===
        [/Gene\s*Keys?/gi, '무의식 보석 코드'],
        [/진\s*키/g, '무의식 보석 코드'],
        [/Shadow/gi, '마음의 먹구름(다크 코드)'],
        [/Gift/gi, 'DNA 속 숨은 보석(뉴럴 코드)'],
        [/Siddhi/gi, '맑은 영혼의 빛(메타 코드)'],

        // === 오행 (Neurotransmitter/Energy Modalities) ===
        [/음양/g, '조화와 균형의 두 기운'],
        [/오행/g, '5가지 생명 에너지(나무🌲·불🔥·흙🌍·쇠⚙️·물💧)'],
        [/목\s*\(木\)/g, '새싹처럼 피어나는 나무 기운🌲'],
        [/화\s*\(火\)/g, '따뜻하게 밝히는 불 기운🔥'],
        [/토\s*\(土\)/g, '포근하게 안아주는 흙 기운🌍'],
        [/금\s*\(金\)/g, '명확하고 정교한 쇠 기운⚙️'],
        [/수\s*\(水\)/g, '지혜롭고 깊은 물 기운💧'],

        // === 십성 → 따뜻한 메타포 ===
        [/비견/g, '당당한 나 자신(비견)'],
        [/겁재/g, '열정적인 열망의 힘(겁재)'],
        [/식신/g, '마음을 표현하는 풍요의 붓(식신)'],
        [/상관/g, '자유로운 창의의 샘(상관)'],
        [/편재/g, '넓은 세상을 끌어당기는 힘(편재)'],
        [/정재/g, '소중한 가치를 결실 맺는 힘(정재)'],
        [/편관/g, '세상의 도전을 이겨내는 전사 기질(편관)'],
        [/칠살/g, '강렬한 변혁의 에너지(칠살)'],
        [/정관/g, '규칙을 지키는 모범생 기질(정관)'],
        [/편인/g, '깊은 직관과 마법 같은 지혜(편인)'],
        [/정인/g, '어머니처럼 따뜻하게 감싸주는 힘(정인)'],

        // === 용신/운 (Coping & Cycles) ===
        [/대운/g, '인생의 큰 10년 계절(대운)'],
        [/세운/g, '올해의 계절 흐름(세운)'],
        [/월운/g, '이달의 마음 리듬(월운)']
    ];

    /**
     * AI 프롬프트에 주입할 마스터 새니타이제이션 지시문
     */
    static generateSanitizationPrompt(): string {
        return `
[🛡️ 명심코칭 감동 에세이 & 용어 메타포 프로토콜]

사용자와 대화할 때 학술적이고 딱딱한 영어 용어나 어려운 한자어를 던지지 마십시오.
모든 원리와 기질은 초등학생도 읽고 마음이 따뜻해지는 감동적인 동화/에세이 메타포로 풀어서 이야기해야 합니다.

1. "사회적규범센서" -> "마음속 예의 바른 수호자" (세상의 눈치와 규칙을 살피는 마음)
2. "프레셔코드" -> "어깨 위의 보이지 않는 배낭" (책임감과 의무감의 무게)
3. "편도체" -> "뇌 속의 작은 비상 경보 종"
4. "전두엽" -> "현명한 마음 사령관"
5. 모든 사주/심리 개념은 먼저 따뜻한 예시와 비유를 든 뒤, 필요시 괄호 안에 용어를 적어주세요.
`;
    }

    /**
     * AI 응답 텍스트에서 모델의 사고 과정(Chain of Thought)이나 영문 가이드 텍스트 제거 (안전 모드)
     */
    static sanitizeThoughtProcess(text: string): string {
        if (!text) return '';
        let cleaned = text;
        
        // 영문 내부 분석 태그 단독 삭제 (안전한 단순 패턴)
        cleaned = cleaned.replace(/silence\s+The\s+user\s+is\s+asking[^\n]*/gi, '');
        cleaned = cleaned.replace(/The\s+Episodic\s+Memory\s+shows[^\n]*/gi, '');
        cleaned = cleaned.replace(/Analysis\s+for\s+Karmic\s+Loop:[^\n]*/gi, '');
        cleaned = cleaned.replace(/GaugeData\s*&\s*Action\s*Plan:[^\n]*/gi, '');

        return cleaned;
    }

    /**
     * AI 응답 텍스트에서 남은 전통/학술 용어를 따뜻한 메타포로 최종 런타임 변환
     */
    static sanitize(text: string): string {
        let result = text;
        
        // 1. 모델 사고 과정(영어) 런타임 제거
        result = this.sanitizeThoughtProcess(result);

        // 2. 전문 용어 메타포 교체
        for (const [pattern, replacement] of this.REPLACEMENT_MAP) {
            result = result.replace(pattern, replacement);
        }

        // 3. [중복 괄호 & 겹친 문구 안전 클리닝] - 백트래킹 없는 안전한 선형 패턴
        result = result.replace(/\(본질 자아 에너지\(일주\)\)+/g, '(본질 자아 에너지(일주))');
        result = result.replace(/\(꿈과 미래 에너지\(시주\)\)+/g, '(꿈과 미래 에너지(시주))');
        result = result.replace(/어깨 위의 '보이지 않는 배낭'\(어깨 위의 '보이지 않는 배낭'\([^\)]*\)\)/g, "어깨 위의 보이지 않는 배낭");
        result = result.replace(/\[\s*자유로운 준비 기간\s*\(\s*자유로운 준비 기간\s*\)\s*\]/g, '자유로운 준비 기간');
        result = result.replace(/\(\s*자유로운 준비 기간\s*\(\s*자유로운 준비 기간\s*\)\s*\)/g, '(자유로운 준비 기간)');
        result = result.replace(/\[\s*지친 마음의 상태\s*\(\s*지친 마음의 상태[^\)]*\)\s*\]/g, '지친 마음의 상태');
        result = result.replace(/\[\s*\[/g, '[').replace(/\]\s*\]/g, ']');

        
        // [Safety Fix] Deduplicate nested terms like (자유로운 준비 기간 (자유로운 준비 기간))
        result = result.replace(/\[\s*자유로운 준비 기간\s*\(\s*자유로운 준비 기간\s*\)\s*\]/g, '자유로운 준비 기간');
        result = result.replace(/\(\s*자유로운 준비 기간\s*\(\s*자유로운 준비 기간\s*\)\s*\)/g, '(자유로운 준비 기간)');
        result = result.replace(/\[\s*지친 마음의 상태\s*\(\s*지친 마음의 상태[^\)]*\)\s*\]/g, '지친 마음의 상태');
        result = result.replace(/\(\s*지친 마음의 상태\s*\(\s*지친 마음의 상태[^\)]*\)\s*\)/g, '(지친 마음의 상태)');
        result = result.replace(/([가-힣\s]+)\(\1\)/g, '$1');
        result = result.replace(/\(([가-힣\s]+)\(\1\)\)/g, '($1)');
    
        return result;
    }
}
