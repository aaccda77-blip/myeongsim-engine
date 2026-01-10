
// [Module] Personalized Talent Analysis based on Saju
// Maps Day Master (Ilgan), Element Balance, and Ten Gods (SipSeong) to modern Career/Talent keywords

interface TalentProfile {
    coreStrength: {
        title: string;
        description: string;
    };
    keywords: string[];
    jobAptitude: string[];
    detailedAnalysis: string;
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
        // 1. Extract Basic Params with Robust Fallbacks
        let rawDayMaster =
            sajuData?.dayMaster ||
            sajuData?.day_master ||
            sajuData?.dayPillar?.stem ||
            sajuData?.day_pillar?.stem ||
            sajuData?.ilju?.[0] || // Handle "GAP_JA" -> G? No, "SIN_SA" -> S? Better rely on stem.
            '갑';

        // Normalize Day Master (Take first char, trim)
        // Example: "경금" -> "경", " 甲 " -> "甲"
        const dayMaster = String(rawDayMaster).trim().charAt(0);

        // Extract Elements with Robust Fallbacks
        const rawElements =
            sajuData?.elements ||
            sajuData?.five_elements ||
            sajuData?.ohaeng ||
            { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };

        const elements = {
            wood: rawElements.wood || 0,
            fire: rawElements.fire || 0,
            earth: rawElements.earth || 0,
            metal: rawElements.metal || 0,
            water: rawElements.water || 0
        };

        // 2. Determine Core Archetype based on Day Master (Ilgan)
        // Default values
        let coreStrength = { title: "잠재된 거인", description: "아직 발견되지 않은 무한한 가능성을 품고 있습니다." };
        let keywords: string[] = ["가능성", "잠재력"];
        let jobAptitude: string[] = ["탐색 중"];
        let detailedAnalysis = "사주 데이터를 분석하는 중입니다. 곧 당신만의 잠재력이 드러납니다.";

        switch (dayMaster) {
            case '갑': case '甲':
                coreStrength = { title: "비전 있는 개척자 (The Pioneer)", description: "곧게 뻗어나가는 추진력과 리더십이 탁월합니다. 시작하는 힘이 강합니다." };
                keywords = ["추진력", "리더십", "성장", "교육"];
                jobAptitude = ["창업가", "교육자", "기획자", "팀 리더"];
                detailedAnalysis = "당신은 '갑목(甲木)'의 기질을 타고나셨습니다. 이는 땅을 뚫고 솟아오르는 거목과 같습니다. 남들보다 앞서 시작하는 **추진력**과 사람들을 이끄는 **리더십**이 당신의 가장 큰 무기입니다. 굽히기보다는 부러지더라도 직진하는 대쪽 같은 성품이 매력이지만, 때로는 유연함이 필요할 수 있습니다. 당신의 재능은 **'새로운 일을 벌이고, 구조를 잡는 초기 단계'**에서 가장 빛을 발합니다.";
                break;
            case '을': case '乙':
                coreStrength = { title: "유연한 적응가 (The Networker)", description: "어떤 환경에서도 살아남는 끈기와 유연한 대인관계 능력을 가졌습니다." };
                keywords = ["적응력", "끈기", "네트워킹", "표현력"];
                jobAptitude = ["마케터", "로비스트", "작가", "예술가"];
                detailedAnalysis = "당신은 '을목(乙木)'의 기질을 가졌습니다. 바람에 흔들리지만 결코 꺾이지 않는 잡초나 덩굴 식물처럼, **강인한 생명력**과 **환경 적응력**이 뛰어납니다. 직접 부딪히기보다 주변을 활용하고 연결하는 능력이 탁월하여 **네트워킹**과 **협상**에 천부적인 재능이 있습니다. 당신의 힘은 부드러움 속에 숨겨진 끈기에서 나옵니다.";
                break;
            case '병': case '丙':
                coreStrength = { title: "열정적인 확성기 (The Influencer)", description: "자신을 드러내고 대중에게 영향을 미치는 에너지가 강력합니다." };
                keywords = ["열정", "카리스마", "공개", "확산"];
                jobAptitude = ["방송인", "정치인", "영업", "엔터테이너"];
                detailedAnalysis = "당신은 '병화(丙火)'의 기운, 즉 하늘에 뜬 태양입니다. 숨길 수 없는 **존재감**과 세상을 비추는 **공명정대함**이 특징입니다. 당신의 예리한 직관과 열정은 사람들의 시선을 사로잡습니다. 비밀을 담아두기보다 널리 알리고 **표현**하는 일에서 큰 성과를 낼 수 있습니다. 무대 체질이며, 당신의 에너지는 나눌수록 커집니다.";
                break;
            case '정': case '丁':
                coreStrength = { title: "섬세한 헌신자 (The Guide)", description: "어둠을 밝히는 등불처럼, 타인을 이끄는 따뜻한 통찰력이 있습니다." };
                keywords = ["통찰", "헌신", "집중력", "따뜻함"];
                jobAptitude = ["상담가", "연구원", "종교인", "특수 기술직"];
                detailedAnalysis = "당신은 '정화(丁火)'의 기질을 지녔습니다. 이는 어둠을 밝히는 촛불이나 별빛과 같습니다. 병화가 넓게 비춘다면, 당신은 한 곳을 **집중적으로 녹이거나 밝히는 전문성**이 있습니다. 섬세한 감수성과 타인을 배려하는 따뜻함, 그리고 본질을 꿰뚫는 **통찰력**이 당신의 무기입니다. **상담, 교육, 연구** 등 정신적인 가치를 다루는 일이 잘 어울립니다.";
                break;
            case '무': case '戊':
                coreStrength = { title: "신뢰받는 중재자 (The Guardian)", description: "흔들리지 않는 무게감으로 조직의 중심을 잡고 신뢰를 줍니다." };
                keywords = ["신뢰", "포용력", "중심", "부동산"];
                jobAptitude = ["부동산업", "관리자", "중개인", "농업/환경"];
                detailedAnalysis = "당신은 '무토(戊土)'의 기운, 거대한 산과 같습니다. 말수가 적어도 묵직한 **신뢰감**을 주며, 모든 것을 포용하는 **넓은 마음**을 가졌습니다. 어떤 상황에서도 흔들리지 않는 중심이 되어 조직의 기둥 역할을 합니다. 중재자로서의 능력과 **신용**을 바탕으로 하는 일, 혹은 넓은 안목이 필요한 분야에서 두각을 나타냅니다.";
                break;
            case '기': case '己':
                coreStrength = { title: "실용적인 육성가 (The Nurturer)", description: "현실적인 감각으로 대상을 키워내고 구체적인 성과를 만듭니다." };
                keywords = ["실용성", "육성", "디테일", "현실감"];
                jobAptitude = ["교사", "요식업", "비서", "회계"];
                detailedAnalysis = "당신은 '기토(己土)'의 성향, 비옥한 정원 흙입니다. 무토가 거시적이라면, 당신은 실속 있고 **구체적인 현실 감각**이 뛰어납니다. 무엇이든 심으면 길러내는 **육성 능력**이 있어 교육이나 케어 분야에 탁월합니다. 꼼꼼한 일처리와 다재다능함으로 누구에게나 환영받는 **실무형 인재**입니다.";
                break;
            case '경': case '庚':
                coreStrength = { title: "단호한 결단가 (The Reformer)", description: "옳고 그름을 가르는 명확한 판단력과 강력한 의리를 가졌습니다." };
                keywords = ["결단력", "정의", "혁신", "의리"];
                jobAptitude = ["군인/경찰", "법조인", "엔지니어", "운동선수"];
                detailedAnalysis = "당신은 '경금(庚金)'의 기질, 다듬어지지 않은 원석이나 도끼입니다. **결단력**과 **혁명성**이 강하여, 맺고 끊음이 확실합니다. 의리를 목숨처럼 여기며, 불의를 보면 참지 못하는 정의감이 있습니다. 기존의 틀을 깨고 **새로운 질서**를 만드는 일, 혹은 강력한 통제력이 필요한 분야가 천직입니다.";
                break;
            case '신': case '辛':
                coreStrength = { title: "예리한 분석가 (The Perfectionist)", description: "날카로운 분석력과 반짝이는 감각으로 완벽을 추구합니다." };
                keywords = ["분석력", "예민함", "정밀", "세련됨"];
                jobAptitude = ["의사", "보석상", "데이터분석", "비평가"];
                detailedAnalysis = "당신은 '신금(辛金)'의 기운, 이미 제련된 보석이나 날카로운 칼입니다. **섬세함**과 **예리함**은 타의 추종을 불허합니다. 깔끔하고 세련된 것을 좋아하며, 자신의 가치를 인정받고자 하는 욕구가 강합니다. 정밀한 기술, 분석, 혹은 미적 감각이 필요한 분야에서 완벽주의 성향을 발휘하면 최고의 전문가가 됩니다.";
                break;
            case '임': case '壬':
                coreStrength = { title: "지혜로운 전략가 (The Strategist)", description: "깊은 바다처럼 속을 알 수 없지만, 거대한 흐름을 읽는 지혜가 있습니다." };
                keywords = ["지혜", "유동성", "글로벌", "정보"];
                jobAptitude = ["무역/유통", "기획", "외교관", "정보요원"];
                detailedAnalysis = "당신은 '임수(壬水)'의 기질, 유유히 흐르는 큰 강이나 바다입니다. **유연한 사고**와 깊은 **지혜**를 겸비했습니다. 어디든 흘러가는 물처럼 적응력이 좋고, 거시적인 흐름을 읽는 안목이 탁월합니다. 정보를 수집하고 기획하는 전략가, 혹은 국경을 넘나드는 **글로벌 비즈니스**나 유통 분야가 잘 맞습니다.";
                break;
            case '계': case '癸':
                coreStrength = { title: "창의적인 기획자 (The Planner)", description: "어디든 스며드는 친화력과 남들이 못 보는 섬세한 아이디어가 뛰어납니다." };
                keywords = ["아이디어", "친화력", "감수성", "기획"];
                jobAptitude = ["기획자", "심리학자", "디자이너", "교육"];
                detailedAnalysis = "당신은 '계수(癸水)'의 성향, 봄비나 안개입니다. 조용히 스며드는 **친화력**과 남들은 생각지 못하는 독창적인 **아이디어**가 풍부합니다. 감수성이 예민하여 타인의 마음을 잘 읽어내고, 기획이나 디자인 등 **창의적인 분야**에서 두각을 나타냅니다. 겉으로는 여려 보여도 끈질긴 생명력을 지녔습니다.";
                break;
            default:
                // Fallback analysis if detection fails but element data exists
                detailedAnalysis = `당신의 사주 에너지는 전체적으로 조화를 이루고 있습니다. 가장 강한 에너지인 **${Object.entries(elements).sort(([, a], [, b]) => b - a)[0][0]}** 기운을 활용하면 좋습니다.`;
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

        // Ensure we don't have duplicates
        keywords = [...new Set(keywords)].slice(0, 5);

        return {
            coreStrength,
            keywords,
            jobAptitude: jobAptitude.slice(0, 4), // Top 4
            detailedAnalysis,
            elements: { // Ensure numbers
                wood: Number(elements.wood) || 20,
                fire: Number(elements.fire) || 20,
                earth: Number(elements.earth) || 20,
                metal: Number(elements.metal) || 20,
                water: Number(elements.water) || 20
            }
        };
    }
};
