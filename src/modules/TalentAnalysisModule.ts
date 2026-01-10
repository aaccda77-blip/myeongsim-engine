
// [Module] Personalized Talent Analysis based on Saju
// Maps Day Master (Ilgan), Element Balance, and Ten Gods (SipSeong) to modern Career/Talent keywords

interface TalentProfile {
    coreStrength: {
        title: string;
        description: string;
    };
    keywords: string[];
    jobAptitude: string[];
    elements: {
        wood: number;
        fire: number;
        earth: number;
        metal: number;
        water: number;
    };
}

export const TalentAnalysisModule = {
    analyze: (sajuData: any): TalentProfile => {
        // 1. Extract Basic Params
        const dayMaster = sajuData?.dayMaster || '갑'; // Default
        // If element counts are missing, assume balanced or random for demo fallback
        // In real app, these come from SajuEngine
        const elements = sajuData?.elements || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };

        // 2. Determine Core Archetype based on Day Master (Ilgan)
        let coreStrength = { title: "잠재된 거인", description: "아직 발견되지 않은 무한한 가능성을 품고 있습니다." };
        let keywords: string[] = [];
        let jobAptitude: string[] = [];

        switch (dayMaster) {
            case '갑': // Big Tree
            case '甲':
                coreStrength = { title: "비전 있는 개척자 (The Pioneer)", description: "곧게 뻗어나가는 추진력과 리더십이 탁월합니다. 시작하는 힘이 강합니다." };
                keywords = ["추진력", "리더십", "성장", "교육"];
                jobAptitude = ["창업가", "교육자", "기획자", "팀 리더"];
                break;
            case '을': // Flower/Vine
            case '乙':
                coreStrength = { title: "유연한 적응가 (The Networker)", description: "어떤 환경에서도 살아남는 끈기와 유연한 대인관계 능력을 가졌습니다." };
                keywords = ["적응력", "끈기", "네트워킹", "표현력"];
                jobAptitude = ["마케터", "로비스트", "작가", "예술가"];
                break;
            case '병': // Sun
            case '丙':
                coreStrength = { title: "열정적인 확성기 (The Influencer)", description: "자신을 드러내고 대중에게 영향을 미치는 에너지가 강력합니다." };
                keywords = ["열정", "카리스마", "공개", "확산"];
                jobAptitude = ["방송인", "정치인", "영업", "엔터테이너"];
                break;
            case '정': // Candle/Star
            case '丁':
                coreStrength = { title: "섬세한 헌신자 (The Guide)", description: "어둠을 밝히는 등불처럼, 타인을 이끄는 따뜻한 통찰력이 있습니다." };
                keywords = ["통찰", "헌신", "집중력", "따뜻함"];
                jobAptitude = ["상담가", "연구원", "종교인", "특수 기술직"];
                break;
            case '무': // Mountain
            case '戊':
                coreStrength = { title: "신뢰받는 중재자 (The Guardian)", description: "흔들리지 않는 무게감으로 조직의 중심을 잡고 신뢰를 줍니다." };
                keywords = ["신뢰", "포용력", "중심", "부동산"];
                jobAptitude = ["부동산업", "관리자", "중개인", "농업/환경"];
                break;
            case '기': // Garden/Soil
            case '己':
                coreStrength = { title: "실용적인 육성가 (The Nurturer)", description: "현실적인 감각으로 대상을 키워내고 구체적인 성과를 만듭니다." };
                keywords = ["실용성", "육성", "디테일", "현실감"];
                jobAptitude = ["교사", "요식업", "비서", "회계"];
                break;
            case '경': // Raw Ore/Axe
            case '庚':
                coreStrength = { title: "단호한 결단가 (The Reformer)", description: "옳고 그름을 가르는 명확한 판단력과 강력한 의리를 가졌습니다." };
                keywords = ["결단력", "정의", "혁신", "의리"];
                jobAptitude = ["군인/경찰", "법조인", "엔지니어", "운동선수"];
                break;
            case '신': // Gem/Knife
            case '辛':
                coreStrength = { title: "예리한 분석가 (The Perfectionist)", description: "날카로운 분석력과 반짝이는 감각으로 완벽을 추구합니다." };
                keywords = ["분석력", "예민함", "정밀", "세련됨"];
                jobAptitude = ["의사", "보석상", "데이터분석", "비평가"];
                break;
            case '임': // Ocean
            case '壬':
                coreStrength = { title: "지혜로운 전략가 (The Strategist)", description: "깊은 바다처럼 속을 알 수 없지만, 거대한 흐름을 읽는 지혜가 있습니다." };
                keywords = ["지혜", "유동성", "글로벌", "정보"];
                jobAptitude = ["무역/유통", "기획", "외교관", "정보요원"];
                break;
            case '계': // Rain/Mist
            case '癸':
                coreStrength = { title: "창의적인 기획자 (The Planner)", description: "어디든 스며드는 친화력과 남들이 못 보는 섬세한 아이디어가 뛰어납니다." };
                keywords = ["아이디어", "친화력", "감수성", "기획"];
                jobAptitude = ["기획자", "심리학자", "디자이너", "교육"];
                break;
        }

        // 3. Adjust keywords based on dominant element (Simplified Logic)
        // Find max element
        const maxVal = Math.max(...Object.values(elements) as number[]);
        const dominantKey = Object.keys(elements).find(key => (elements as any)[key] === maxVal);

        if (dominantKey === 'wood') keywords.push("성장지향");
        if (dominantKey === 'fire') keywords.push("표현욕구");
        if (dominantKey === 'earth') keywords.push("안정추구");
        if (dominantKey === 'metal') keywords.push("원칙주의");
        if (dominantKey === 'water') keywords.push("유연성");


        return {
            coreStrength,
            keywords: keywords.slice(0, 5), // Top 5
            jobAptitude: jobAptitude.slice(0, 4), // Top 4
            elements: {
                wood: elements.wood || 20,
                fire: elements.fire || 20,
                earth: elements.earth || 20,
                metal: elements.metal || 20,
                water: elements.water || 20
            }
        };
    }
};
