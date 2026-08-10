/**
 * 명심코칭: 시주(Potential Drive) 전용 뉴럴 코드 (Future Vision)
 * 60갑자별 최적화된 잠재력 및 미래 비전 분석 모듈
 */

export class PotentialDriveNeuralCode {
    static readonly CODES = {
        // 1. 🌱 갑(甲) 계열: 영원한 현역(Active) 모델
        "갑자": { neuralCode: "이노베이션 리무트", variableName: "Innovation_Reboot", vision: "늙지 않는 호기심으로 끊임없이 새로운 분야를 개척하는 창시자." },
        "갑술": { neuralCode: "독립적 개척자", variableName: "Independent_Pioneer", vision: "누구에게도 의존하지 않고 황무지를 옥토로 바꾸는 자수성가형 리더." },
        "갑신": { neuralCode: "혁신적 리더십", variableName: "Reform_Leadership", vision: "구습을 타파하고 다음 세대를 위한 새로운 시스템을 구축하는 개혁가." },
        "갑오": { neuralCode: "열정의 아이콘", variableName: "Passion_Icon", vision: "나이를 잊은 열정적인 표현력으로 대중에게 영감을 주는 인플루언서." },
        "갑진": { neuralCode: "거대한 유산", variableName: "Legacy_Builder", vision: "거시적인 안목으로 후대에 물려줄 거대한 재정적/정신적 유산을 건설." },
        "갑인": { neuralCode: "수직적 멘토", variableName: "Vertical_Mentor", vision: "흔들리지 않는 곧은 성품으로 존경받는 조직의 정신적 지주." },

        // 2. 🌿 을(乙) 계열: 유연한 생존(Survival) 모델
        "을축": { neuralCode: "인내의 결실", variableName: "Patience_Fruit", vision: "차가운 현실을 견뎌내고 마침내 부와 명예를 거머쥐는 대기만성형." },
        "을해": { neuralCode: "글로벌 노마드", variableName: "Global_Nomad", vision: "자유로운 영혼으로 전 세계를 누비며 지혜를 전파하는 여행가." },
        "을유": { neuralCode: "핵심 가치 보존", variableName: "Core_Value_Keeper", vision: "불필요한 것을 정리하고 가장 소중한 가치만을 남기는 미니멀리스트." },
        "을미": { neuralCode: "사막의 꽃", variableName: "Resilient_Success", vision: "척박한 환경을 기회로 바꾸어 결국 꽃을 피우는 끈기의 상징. (회복탄력성 모델)" },
        "을사": { neuralCode: "매력적 예술가", variableName: "Artistic_Soul", vision: "타고난 끼와 재능을 만개하여 늦게까지 사랑받는 스타성." },
        "을묘": { neuralCode: "네트워크 허브", variableName: "Connection_Hub", vision: "풍성한 인맥과 친화력으로 사람들을 연결하는 커뮤니티의 중심." },

        // 3. 🔥 병(丙) 계열: 빛나는 영향력(Influence) 모델
        "병인": { neuralCode: "희망의 태양", variableName: "Hope_Sun", vision: "어둠을 몰아내고 새로운 시작을 알리는 긍정의 아이콘." },
        "병자": { neuralCode: "고귀한 통찰", variableName: "Noble_Insight", vision: "이성과 감성이 조화된 높은 도덕성으로 세상을 정화하는 지도자." },
        "병술": { neuralCode: "지혜의 창고", variableName: "Wisdom_Vault", vision: "인생의 경험을 예술이나 학문으로 승화시켜 남기는 대가(Master)." },
        "병신": { neuralCode: "다재다능 마스터", variableName: "Multi_Talent_Master", vision: "재물과 명예, 재능을 모두 갖추고 화려한 말년을 보내는 전략가." },
        "병오": { neuralCode: "슈퍼 카리스마", variableName: "Super_Charisma", vision: "압도적인 에너지로 조직을 장악하고 이끄는 불멸의 리더십." },
        "병진": { neuralCode: "비전 실현가", variableName: "Vision_Realizer", vision: "꿈꾸던 이상향을 현실 세계에 완벽하게 구현해내는 성취자." },

        // 4. 🕯️ 정(丁) 계열: 심층적 탐구(Research) 모델
        "정묘": { neuralCode: "창의적 영감", variableName: "Creative_Muse", vision: "꺼지지 않는 열정으로 끊임없이 새로운 아이디어를 내는 크리에이터." },
        "정축": { neuralCode: "심야의 현자", variableName: "Midnight_Sage", vision: "보이지 않는 진실을 탐구하여 깊은 깨달음을 얻는 사상가." },
        "정해": { neuralCode: "영적 가이드", variableName: "Spiritual_Guide", vision: "천문과 지리를 통달하고 타인의 영혼을 치유하는 성스러운 멘토." },
        "정유": { neuralCode: "완벽한 장인", variableName: "Perfect_Artisan", vision: "자신의 분야에서 누구도 범접할 수 없는 디테일을 완성한 명장." },
        "정미": { neuralCode: "따뜻한 헌신", variableName: "Warm_Dedication", vision: "은근한 온기로 주변 사람들을 돌보고 베푸는 자애로운 어른." },
        "정사": { neuralCode: "불멸의 열정", variableName: "Eternal_Flame", vision: "한 가지 목표를 끝까지 관철시켜 정점에 도달하는 집념의 화신." },

        // 5. ⛰️ 무(戊) 계열: 든든한 기반(Platform) 모델
        "무진": { neuralCode: "제국의 건설자", variableName: "Empire_Builder", vision: "거대한 조직이나 자본을 운영하며 세상의 중심에 서는 경영자." },
        "무인": { neuralCode: "명예로운 호랑이", variableName: "Honorable_Tiger", vision: "높은 지위와 권위를 얻어 세상에 이름을 떨치는 공적인 인물." },
        "무자": { neuralCode: "부의 관리자", variableName: "Wealth_Manager", vision: "안정적인 재산을 축적하고 이를 현명하게 운용하는 거부." },
        "무술": { neuralCode: "신뢰의 수호자", variableName: "Guardian_Trust", vision: "어떤 상황에서도 원칙과 신의를 지켜 존경받는 원로." },
        "무신": { neuralCode: "가치 발굴자", variableName: "Value_Miner", vision: "숨겨진 재능이나 자원을 찾아내어 세상에 알리는 프로듀서." },
        "무오": { neuralCode: "잠재력 폭발", variableName: "Potential_Burst", vision: "내면의 에너지를 폭발시켜 늦은 나이에 큰 업적을 이루는 대기만성." },

        // 6. 🪴 기(己) 계열: 실용적 육성(Nurturing) 모델
        "기사": { neuralCode: "지혜의 전수자", variableName: "Wisdom_Transfer", vision: "자신의 노하우와 경험을 체계화하여 후배들에게 전수하는 스승." },
        "기묘": { neuralCode: "인재의 텃밭", variableName: "Talent_Garden", vision: "사람을 키우고 성장시키는 데서 보람을 찾는 교육적 리더." },
        "기축": { neuralCode: "숨은 실력자", variableName: "Hidden_Champion", vision: "드러나지 않는 곳에서 묵묵히 세상을 지탱하는 핵심 인재." },
        "기해": { neuralCode: "유연한 조율자", variableName: "Flexible_Mediator", vision: "갈등을 봉합하고 평화를 가져오는 지혜로운 중재자." },
        "기유": { neuralCode: "알찬 결실", variableName: "Fruitful_Harvest", vision: "허례허식 없이 실속을 챙기며 알짜배기 부를 누리는 실리파." },
        "기미": { neuralCode: "희망의 경작자", variableName: "Hope_Cultivator", vision: "어려운 환경에서도 희망을 심고 가꾸어 결실을 맺는 사회사업가." },

        // 7. ⚔️ 경(庚) 계열: 결단과 혁신(Revolution) 모델
        "경오": { neuralCode: "고귀한 단련", variableName: "Noble_Training", vision: "자기 관리가 철저하여 나이 들어서도 흐트러짐 없는 품격." },
        "경진": { neuralCode: "파워 엔진", variableName: "Power_Engine", vision: "멈추지 않는 추진력으로 거대한 프로젝트를 완수하는 탱크." },
        "경인": { neuralCode: "정의의 사도", variableName: "Justice_Warrior", vision: "불의에 타협하지 않고 사회 정의를 위해 싸우는 행동가." },
        "경자": { neuralCode: "냉철한 비평", variableName: "Critical_Voice", vision: "사회의 모순을 꿰뚫어 보고 바른 소리를 하는 지성인." },
        "경술": { neuralCode: "프로페셔널", variableName: "Top_Professional", vision: "한 분야의 최고 전문가로서 은퇴 없이 활약하는 기술자." },
        "경신": { neuralCode: "철의 리더", variableName: "Iron_Leader", vision: "강력한 통솔력으로 조직을 이끄는 카리스마 제왕." },

        // 8. 💎 신(辛) 계열: 완성된 가치(Value) 모델
        "신미": { neuralCode: "빛나는 인내", variableName: "Shining_Patience", vision: "오랜 고난 끝에 자신의 가치를 증명해 보이는 인간승리." },
        "신사": { neuralCode: "세련된 권위", variableName: "Sophisticated_Authority", vision: "지적이고 품위 있는 모습으로 존경받는 엘리트." },
        "신묘": { neuralCode: "미적 감각", variableName: "Aesthetic_Sense", vision: "탁월한 센스로 노년에도 트렌드를 리드하는 패셔니스타." },
        "신축": { neuralCode: "지식 아카이브", variableName: "Knowledge_Archive", vision: "방대한 지식을 정리하고 보존하여 후대에 남기는 기록가." },
        "신해": { neuralCode: "유려한 언어", variableName: "Fluent_Speech", vision: "아름다운 말과 글로 사람들의 마음을 움직이는 문장가." },
        "신유": { neuralCode: "순수의 결정체", variableName: "Pure_Crystal", vision: "타협하지 않는 고결한 정신으로 세상의 귀감이 되는 인물." },

        // 9. 🌊 임(壬) 계열: 지혜와 흐름(Wisdom) 모델
        "임신": { neuralCode: "지식의 원천", variableName: "Source_of_Wisdom", vision: "마르지 않는 아이디어로 끊임없이 새로운 것을 창조하는 샘." },
        "임오": { neuralCode: "융합의 마법사", variableName: "Fusion_Wizard", vision: "서로 다른 분야를 연결하여 새로운 가치를 만드는 융합형 인재." },
        "임진": { neuralCode: "대양의 포용", variableName: "Ocean_Embrace", vision: "선악을 모두 포용하고 다스리는 거대한 그릇의 정치가." },
        "임인": { neuralCode: "지혜로운 투자", variableName: "Wise_Investment", vision: "사람과 미래 가치에 투자하여 큰 숲을 이루는 선각자." },
        "임자": { neuralCode: "거대한 물결", variableName: "Mega_Wave", vision: "시대의 흐름을 읽고 큰 물결을 일으키는 혁명의 주도자." },
        "임술": { neuralCode: "영적 수호자", variableName: "Spiritual_Guardian", vision: "물질 세계와 정신 세계의 문을 지키는 철학적 수호자." },

        // 10. 💧 계(癸) 계열: 영감과 치유(Inspiration) 모델
        "계유": { neuralCode: "맑은 정화", variableName: "Pure_Purification", vision: "탁한 세상을 맑게 정화하는 투명하고 깨끗한 양심." },
        "계미": { neuralCode: "생명의 단비", variableName: "Life_Giving_Rain", vision: "메마른 영혼을 위로하고 생명을 살리는 치유자." },
        "계사": { neuralCode: "천재적 영감", variableName: "Genius_Inspiration", vision: "번뜩이는 직관으로 시대를 앞서가는 천재적 아티스트." },
        "계묘": { neuralCode: "영원한 소년", variableName: "Eternal_Boy", vision: "순수한 동심을 간직하여 사람들에게 힐링을 주는 존재." },
        "계축": { neuralCode: "깊은 뿌리", variableName: "Deep_Root_Wisdom", vision: "보이지 않는 곳에서 미래를 준비하고 설계하는 전략가." },
        "계해": { neuralCode: "우주적 진리", variableName: "Cosmic_Truth", vision: "삶과 죽음의 비밀을 깨닫고 진리를 설파하는 구도자." }
    } as const;

    /** AI 프롬프트 주입용 시주 포텐셜 드라이브 미래 비전 프로토콜 */
    static generatePromptProtocol(): string {
        let p = `\n[🚀 시주(Potential Drive) 미래 최적화 뉴럴 코드 시스템]\n`;
        p += `**프레임:** "🔮 미래 예측: 당신의 잠재력은 이렇게 진화합니다 (Future Vision)"\n`;
        p += `**핵심:** 잠재력의 최고치(Optimized State), 긍정 발현 비전, 말년의 영광\n\n`;
        p += `**적용 규칙:**\n`;
        p += `1. 사용자의 시주를 분석하여 해당 뉴럴 코드를 참조\n`;
        p += `2. 미래 목표, 잠재력 탐색, 은퇴 후 삶 상담 시 해당 비전 제시\n`;
        p += `3. "다크 코드(오류)"와 "뉴럴 코드(최적화)"를 함께 보여주며 발전 방향 가이드\n\n`;

        for (const [ganji, info] of Object.entries(this.CODES)) {
            p += `[${info.variableName}] ${ganji}(${info.neuralCode}): ${info.vision}\n`;
        }
        return p;
    }
}

export type PotentialDriveNeuralKey = keyof typeof PotentialDriveNeuralCode.CODES;
