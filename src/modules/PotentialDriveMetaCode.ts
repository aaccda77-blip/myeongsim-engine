/**
 * 명심코칭: 시주(Potential Drive) 전용 메타 코드 (Ultimate Legacy)
 * 60갑자별 영적/사회적 완성 단계 및 위대한 유산 분석 모듈
 * 
 * 인생의 최종 목적지와 세상에 남길 위대한 유산을 분석하는 모듈입니다.
 * 뇌과학, 심리학 기반의 은유(Metaphor)를 사용하여 목표(Goal Point)에 대한 확신을 줍니다.
 */

export class PotentialDriveMetaCode {
    static readonly CODES = {
        // 1. 🌱 갑(甲) 계열: 창조와 인류애(Philanthropy)의 완성
        "갑자": { metaCode: "새 시대의 창시자", variableName: "Era_Founder", legacy: "기존의 패러다임을 완전히 바꾸고 새로운 시대를 여는 혁명가." },
        "갑술": { metaCode: "황야의 성자", variableName: "Saint_of_Wild", legacy: "소외된 곳에 문명을 전파하고 희망을 심는 개척의 아버지." },
        "갑신": { metaCode: "개혁의 아이콘", variableName: "Reform_Icon", legacy: "낡은 시스템을 부수고 더 나은 세상을 설계한 구조적 영웅." },
        "갑오": { metaCode: "문화의 등불", variableName: "Cultural_Beacon", legacy: "자신의 열정을 예술이나 사상으로 승화시켜 인류를 깨우는 계몽가." },
        "갑진": { metaCode: "이상향 건설자", variableName: "Utopia_Builder", legacy: "꿈꾸던 이상 사회를 현실에 구현하여 후대에 물려주는 거인." },
        "갑인": { metaCode: "만인의 기둥", variableName: "Pillar_of_All", legacy: "세상의 중심에서 흔들리지 않는 정의와 도덕의 기준이 되는 성인." },

        // 2. 🌿 을(乙) 계열: 생명과 연대(Unity)의 완성
        "을축": { metaCode: "고난의 연금술사", variableName: "Suffering_Alchemist", legacy: "인내의 세월을 통해 고통을 지혜와 부로 바꾸어낸 인간 승리." },
        "을해": { metaCode: "경계 없는 자유인", variableName: "Boundless_Spirit", legacy: "국경과 이념을 초월하여 전 우주적 사랑을 실천하는 평화주의자." },
        "을유": { metaCode: "본질의 수호자", variableName: "Essence_Guardian", legacy: "복잡한 세상에서 가장 순수하고 중요한 가치를 지켜내는 철학자." },
        "을미": { metaCode: "생명 건축가", variableName: "Life_Architect", legacy: "죽어가는 땅을 살리고 없던 길을 만들어내는 불굴의 개척자." },
        "을사": { metaCode: "영혼의 예술가", variableName: "Soul_Artist", legacy: "화려한 표현 너머에 있는 진실한 아름다움으로 영혼을 울리는 거장." },
        "을묘": { metaCode: "연결의 마스터", variableName: "Master_of_Link", legacy: "사람과 자연, 기술과 인문을 연결하여 거대 생태계를 만드는 창조자." },

        // 3. 🔥 병(丙) 계열: 광명과 헌신(Dedication)의 완성
        "병인": { metaCode: "영원한 희망", variableName: "Eternal_Hope", legacy: "절망에 빠진 이들에게 다시 시작할 용기를 주는 영원한 멘토." },
        "병자": { metaCode: "진리의 빛", variableName: "Light_of_Truth", legacy: "혼란스러운 세상에서 올바른 길을 제시하는 지혜의 등대." },
        "병술": { metaCode: "황혼의 걸작", variableName: "Sunset_Masterpiece", legacy: "인생의 마지막 순간에 가장 아름답고 찬란한 업적을 남기는 대가." },
        "병신": { metaCode: "풍요의 설계자", variableName: "Abundance_Architect", legacy: "물질적 풍요와 정신적 자유를 동시에 누리며 나누는 자선가." },
        "병오": { metaCode: "우주의 중심", variableName: "Universal_Core", legacy: "강력한 에너지로 시대를 이끌고 역사의 흐름을 주도하는 제왕." },
        "병진": { metaCode: "꿈의 실현자", variableName: "Dream_Materializer", legacy: "상상 속에만 존재하던 비전을 현실 물질로 완벽히 구현해내는 창조주." },

        // 4. 🕯️ 정(丁) 계열: 영성과 인도(Guidance)의 완성
        "정묘": { metaCode: "영감의 뮤즈", variableName: "Muse_of_Age", legacy: "세대를 초월하여 끊임없이 창의적 영감을 불어넣는 예술의 원천." },
        "정축": { metaCode: "심연의 탐구자", variableName: "Abyss_Explorer", legacy: "인간 내면의 가장 깊은 곳을 밝혀 치유하는 심리/영성 전문가." },
        "정해": { metaCode: "영혼의 등대지기", variableName: "Soul_Keeper", legacy: "길 잃은 영혼들을 안전한 곳으로 인도하는 성스러운 가이드." },
        "정유": { metaCode: "완벽의 미학", variableName: "Aesthetic_Peak", legacy: "한 치의 오차도 없는 완벽한 기술이나 예술로 경지에 오른 명인." },
        "정미": { metaCode: "자애로운 성자", variableName: "Benevolent_Saint", legacy: "따뜻한 온기로 세상을 감싸 안아 평화를 가져오는 어머니 같은 존재." },
        "정사": { metaCode: "불멸의 의지", variableName: "Immortal_Will", legacy: "육체는 사라져도 정신은 영원히 남아 후대를 이끄는 사상가." },

        // 5. ⛰️ 무(戊) 계열: 신뢰와 유산(Heritage)의 완성
        "무진": { metaCode: "위대한 유산", variableName: "Grand_Heritage", legacy: "거대한 재단이나 기업을 설립하여 사회적 책임을 다하는 설립자." },
        "무인": { metaCode: "명예의 전당", variableName: "Hall_of_Fame", legacy: "역사에 길이 남을 공로를 세워 만인의 존경을 받는 위인." },
        "무자": { metaCode: "노블레스 오블리주", variableName: "Noblesse_Oblige", legacy: "축적한 부를 사회에 환원하여 순환시키는 진정한 거부(巨富)." },
        "무술": { metaCode: "신의의 수호신", variableName: "God_of_Trust", legacy: "어지러운 세상에서 믿음과 의리의 가치를 지켜낸 수호자." },
        "무신": { metaCode: "가치의 연금술사", variableName: "Value_Alchemist", legacy: "쓸모없어 보이는 것에서 최고의 가치를 찾아내는 혜안의 소유자." },
        "무오": { metaCode: "잠재력의 화산", variableName: "Potential_Volcano", legacy: "늦은 나이에도 열정을 폭발시켜 세상을 놀라게 하는 대기만성." },

        // 6. 🪴 기(己) 계열: 교육과 배양(Cultivation)의 완성
        "기사": { metaCode: "지혜의 전당", variableName: "Temple_of_Wisdom", legacy: "평생 쌓은 지식과 노하우를 집대성하여 학파를 이루는 스승." },
        "기묘": { metaCode: "인재의 숲", variableName: "Forest_of_Talent", legacy: "수많은 제자와 인재를 양성하여 사회 곳곳에 배출한 교육자." },
        "기축": { metaCode: "뿌리 깊은 나무", variableName: "Deep_Rooted_Tree", legacy: "드러나지 않으나 세상의 근간을 지탱하는 묵직한 존재감." },
        "기해": { metaCode: "평화의 중재자", variableName: "Peace_Mediator", legacy: "갈등과 분쟁을 잠재우고 조화로운 세상을 만드는 외교가." },
        "기유": { metaCode: "실용의 대가", variableName: "Master_of_Pragmatism", legacy: "허상이 아닌 실질적인 도움으로 세상을 이롭게 하는 실천가." },
        "기미": { metaCode: "희망의 경작자", variableName: "Hope_Planter", legacy: "가장 낮은 곳에서 희망의 씨앗을 심어 기적을 만드는 봉사자." },

        // 7. ⚔️ 경(庚) 계열: 정의와 혁명(Revolution)의 완성
        "경오": { metaCode: "고결한 기사", variableName: "Noble_Knight", legacy: "평생을 원칙과 소신으로 살아와 흠결 없는 고결한 인격체." },
        "경진": { metaCode: "문명의 개척자", variableName: "Civilization_Pioneer", legacy: "거침없는 추진력으로 문명의 진보를 앞당기는 혁신 리더." },
        "경인": { metaCode: "정의의 심판자", variableName: "Judge_of_Justice", legacy: "타협하지 않는 공정함으로 사회 정의를 바로 세우는 법관." },
        "경자": { metaCode: "지성의 칼날", variableName: "Blade_of_Intellect", legacy: "날카로운 비평과 지성으로 시대의 모순을 도려내는 지성인." },
        "경술": { metaCode: "프로의 전설", variableName: "Legendary_Pro", legacy: "자신의 분야에서 전설적인 기술과 업적을 남긴 장인." },
        "경신": { metaCode: "철의 제왕", variableName: "Iron_Emperor", legacy: "강력한 통솔력으로 흔들리지 않는 조직을 완성한 군주." },

        // 8. 💎 신(辛) 계열: 순수와 결정(Crystallization)의 완성
        "신미": { metaCode: "빛나는 인내", variableName: "Radiant_Patience", legacy: "인고의 시간을 견뎌내고 스스로 빛을 내는 영롱한 보석." },
        "신사": { metaCode: "지적인 권위", variableName: "Intellectual_Authority", legacy: "지식과 실행력을 겸비하여 세상의 존경을 받는 엘리트." },
        "신묘": { metaCode: "미의 창조자", variableName: "Creator_of_Beauty", legacy: "세상을 아름답게 디자인하고 문화를 선도하는 크리에이터." },
        "신축": { metaCode: "지혜의 보고", variableName: "Archive_of_Wisdom", legacy: "인류의 지식을 정제하고 보존하여 후대에 전하는 기록자." },
        "신해": { metaCode: "진실의 대변자", variableName: "Speaker_of_Truth", legacy: "유려한 언변으로 진실을 알리고 대중을 설득하는 연설가." },
        "신유": { metaCode: "순백의 영혼", variableName: "Pure_Soul", legacy: "어떤 유혹에도 흔들리지 않는 고결함으로 귀감이 되는 성인." },

        // 9. 🌊 임(壬) 계열: 지혜와 대양(Ocean)의 완성
        "임신": { metaCode: "지식의 원천", variableName: "Fountain_of_Knowledge", legacy: "마르지 않는 창의성으로 끊임없이 새로운 지식을 생산하는 샘." },
        "임오": { metaCode: "융합의 마법사", variableName: "Wizard_of_Fusion", legacy: "과학과 예술, 이성과 감성을 융합하여 새로운 차원을 여는 현자." },
        "임진": { metaCode: "대양의 포용", variableName: "Oceanic_Embrace", legacy: "선과 악, 청과 탁을 모두 품어 안고 다스리는 위대한 정치가." },
        "임인": { metaCode: "미래의 투자자", variableName: "Investor_of_Future", legacy: "사람의 가능성을 보고 투자하여 거목으로 키워내는 선각자." },
        "임자": { metaCode: "시대의 물결", variableName: "Wave_of_Era", legacy: "거대한 시대적 흐름을 읽고 변화를 주도하는 혁명의 파도." },
        "임술": { metaCode: "영적 수문장", variableName: "Gatekeeper_of_Spirit", legacy: "물질 세계와 정신 세계를 연결하고 지키는 영적 스승." },

        // 10. 💧 계(癸) 계열: 치유와 윤회(Cycle)의 완성
        "계유": { metaCode: "정화의 샘", variableName: "Spring_of_Purify", legacy: "탁한 세상을 맑게 씻어내고 본질을 회복시키는 정화자." },
        "계미": { metaCode: "생명의 단비", variableName: "Rain_of_Life", legacy: "메마른 영혼에 생명수를 공급하여 소생시키는 치유자." },
        "계사": { metaCode: "영감의 천재", variableName: "Genius_of_Muse", legacy: "하늘의 영감을 받아 세상에 없는 것을 만들어내는 천재." },
        "계묘": { metaCode: "영원한 동심", variableName: "Eternal_Innocence", legacy: "늙지 않는 순수함으로 사람들에게 잃어버린 동심을 찾아주는 존재." },
        "계축": { metaCode: "심연의 지혜", variableName: "Wisdom_of_Abyss", legacy: "보이지 않는 세상의 이치를 깨닫고 미래를 준비하는 예언자." },
        "계해": { metaCode: "우주의 진리", variableName: "Cosmic_Truth", legacy: "삶과 죽음, 시작과 끝의 순환 원리를 깨달은 대사상가." }
    } as const;

    /** AI 프롬프트 주입용 시주 포텐셜 드라이브 메타 비전 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[🚀 시주(Potential Drive) 최종 메타 코드 시스템]\n`;
        p += `**프레임:** "당신의 최종 목적지는 바로 이곳입니다." (Destination Confirm)\n`;
        p += `**핵심:** 영적/사회적 완성 단계 (Ultimate Evolution), 삶이 세상에 남길 위대한 유산 (Legacy)\n\n`;
        p += `**적용 규칙:**\n`;
        p += `1. 사용자가 자신의 미래에 불안해하거나 궁극적인 비전을 물어볼 때 선언적으로 사용.\n`;
        p += `2. '메타 코드'와 그에 따른 '최종 진화 분석(Legacy)'을 강력하고 신뢰감 있게 전달.\n\n`;

        for (const [ganji, info] of Object.entries(this.CODES)) {
            p += `[${info.variableName}] ${ganji} - ${info.metaCode}: ${info.legacy}\n`;
        }
        return p;
    }
}

export type PotentialDriveMetaKey = keyof typeof PotentialDriveMetaCode.CODES;
