/**
 * MyeongsimData.ts
 * 
 * 명심코칭 앱의 핵심 데이터베이스 (Combinatorial Logic Base)
 * 51만 가지 사주 조합을 생성하기 위한 4가지 기본 '레고 블록'
 */

// 1. 타입 정의 (Interfaces)

export interface Stem {
    id: string;
    code: string;     // 한자 (甲)
    alias: string;    // 별명 (큰 나무)
    shadow_trigger: string; // 그림자 질문
    light_action: string;   // 명심 미션
}

export interface Branch {
    id: string;
    code: string;     // 한자 (子)
    animal: string;   // 동물 (쥐)
    time: string;     // 시간대 (23:30~01:30)
    advice: string;   // 특징 및 조언
}

export interface TenGod {
    id: string;
    name: string;     // 명칭 (비견)
    keyword: string;  // 키워드 (자존감)
    shadow_mind: string;    // 심리 상태 (Shadow)
    light_action: string;   // 행동 지침 (Light)
}

export interface Pillar {
    id: number;       // 순번 (1~60)
    name: string;     // 일주 (갑자)
    image: string;    // 물상 (물 위에 뜬 나무)
    summary: string;  // 성격 요약
}

// 2. 데이터 상수 (Constants)

// ------------------------------------------------------------------
// Sheet 1: 10천간 (Master_Stems) - 생각 DNA
// ------------------------------------------------------------------
export const Stems: Stem[] = [
    {
        id: 'gap',
        code: '甲',
        alias: '큰 나무',
        shadow_trigger: "남에게 굽히기 싫어 혼자 끙끙 앓고 있나요?",
        light_action: "오늘 하루, 타인의 조언에 '네, 맞습니다'라고 대답하기"
    },
    {
        id: 'eul',
        code: '乙',
        alias: '덩굴',
        shadow_trigger: "주변 눈치를 보느라 내 주관을 잃어버렸나요?",
        light_action: "점심 메뉴만큼은 남에게 묻지 말고 내가 결정하기"
    },
    {
        id: 'byeong',
        code: '丙',
        alias: '태양',
        shadow_trigger: "주목받지 못하면 우울하고 조바심이 나나요?",
        light_action: "오늘 하루, 주인공 자리를 양보하고 경청하는 조연 되기"
    },
    {
        id: 'jeong',
        code: '丁',
        alias: '촛불',
        shadow_trigger: "겉으론 웃지만 속으로 예민하게 타오르고 있나요?",
        light_action: "감정 일기에 속마음을 솔직하게 적고 덮어버리기"
    },
    {
        id: 'mu',
        code: '戊',
        alias: '큰 산',
        shadow_trigger: "변화가 두려워 무조건 '안 돼'라고 버티나요?",
        light_action: "평소 안 가던 낯선 길로 퇴근하거나 산책하기"
    },
    {
        id: 'gi',
        code: '己',
        alias: '텃밭',
        shadow_trigger: "너무 많은 생각과 의심 때문에 타이밍을 놓치나요?",
        light_action: "이유 따지지 말고 직관적으로 3초 안에 결정하기"
    },
    {
        id: 'gyeong',
        code: '庚',
        alias: '도끼',
        shadow_trigger: "나의 직설적인 말이 상대를 베어버렸나요?",
        light_action: "말 끝에 무조건 쿠션 언어('그럴 수도 있지') 붙이기"
    },
    {
        id: 'sin',
        code: '辛',
        alias: '보석',
        shadow_trigger: "완벽하지 않으면 시작조차 안 하고 있나요?",
        light_action: "60점짜리 결과물이라도 일단 내놓고 '완료' 외치기"
    },
    {
        id: 'im',
        code: '壬',
        alias: '바다',
        shadow_trigger: "머릿속으로 거대한 계획만 세우다 하루가 갔나요?",
        light_action: "계획표 덮고 당장 몸을 움직여 땀 흘리기"
    },
    {
        id: 'gye',
        code: '癸',
        alias: '봄비',
        shadow_trigger: "작은 자극에도 불안해서 숨고 싶나요?",
        light_action: "따뜻한 차를 마시며 '나는 지금 안전해'라고 3번 말하기"
    }
];

// ------------------------------------------------------------------
// Sheet 2: 12지지 (Master_Branches) - 환경/시간
// ------------------------------------------------------------------
export const Branches: Branch[] = [
    {
        id: 'ja',
        code: '子',
        animal: '쥐',
        time: '23~01시',
        advice: "생각이 꼬리를 무는 밤입니다. 어둠 속 고민을 멈추세요."
    },
    {
        id: 'chuk',
        code: '丑',
        animal: '소',
        time: '01~03시',
        advice: "묵묵히 견디는 힘이 있습니다. 하지만 고집은 내려놓으세요."
    },
    {
        id: 'in',
        code: '寅',
        animal: '호랑이',
        time: '03~05시',
        advice: "새벽을 여는 기운입니다. 지금 당장 시작하세요."
    },
    {
        id: 'myo',
        code: '卯',
        animal: '토끼',
        time: '05~07시',
        advice: "부지런히 움직일 때입니다. 한 우물만 파는 집중력이 필요해요."
    },
    {
        id: 'jin',
        code: '辰',
        animal: '용',
        time: '07~09시',
        advice: "이상과 현실 사이에서 갈등하나요? 현실적인 목표 하나만 잡으세요."
    },
    {
        id: 'sa',
        code: '巳',
        animal: '뱀',
        time: '09~11시',
        advice: "열정이 뜨겁습니다. 변덕 부리지 말고 하나만 끝까지 하세요."
    },
    {
        id: 'o',
        code: '午',
        animal: '말',
        time: '11~13시',
        advice: "가장 화려한 시간입니다. 겉모습보다 내실을 다지세요."
    },
    {
        id: 'mi',
        code: '未',
        animal: '양',
        time: '13~15시',
        advice: "희생하고 참기만 하지 마세요. 내 몫을 챙겨도 됩니다."
    },
    {
        id: 'sin',
        code: '申',
        animal: '원숭이',
        time: '15~17시',
        advice: "재주가 넘칩니다. 잔머리 굴리지 말고 정공법으로 가세요."
    },
    {
        id: 'yu',
        code: '酉',
        animal: '닭',
        time: '17~19시',
        advice: "날카롭고 예리합니다. 그 칼날을 남이 아닌 나를 다듬는 데 쓰세요."
    },
    {
        id: 'sul',
        code: '戌',
        animal: '개',
        time: '19~21시',
        advice: "지키고 보호하는 힘입니다. 오늘은 방어막을 내리고 쉬세요."
    },
    {
        id: 'hae',
        code: '亥',
        animal: '돼지',
        time: '21~23시',
        advice: "풍요롭지만 생각이 많습니다. 단순하게 생각하고 푹 주무세요."
    }
];

// ------------------------------------------------------------------
// Sheet 3: 10십성 (Master_TenGods) - 사회적 관계 심리
// ------------------------------------------------------------------
export const TenGods: TenGod[] = [
    {
        id: 'bi',
        name: '비견',
        keyword: '자존감',
        shadow_mind: "남과 비교하며 내 존재감을 잃을까 두려운가요?",
        light_action: "비교 멈춤! 거울을 보고 '나는 나다'라고 선언하기"
    },
    {
        id: 'geop',
        name: '겁재',
        keyword: '승부욕',
        shadow_mind: "빼앗길까 봐, 질까 봐 조바심이 나나요?",
        light_action: "경쟁자를 적으로 두지 말고, 밥 한 끼 사며 내 편 만들기"
    },
    {
        id: 'sik',
        name: '식신',
        keyword: '연구/몰입',
        shadow_mind: "하고 싶은 것만 하느라 해야 할 일을 미뤘나요?",
        light_action: "싫지만 해야 하는 일(숙제, 설거지)부터 딱 10분만 하기"
    },
    {
        id: 'sang',
        name: '상관',
        keyword: '반항심',
        shadow_mind: "꼰대 같은 사람들에게 독설을 날리고 싶나요?",
        light_action: "입을 닫고 스마트폰 메모장에 분노를 글로 배설하기"
    },
    {
        id: 'pyun_jae',
        name: '편재',
        keyword: '통제/결과',
        shadow_mind: "과정은 무시하고 빨리 결과만 얻으려 하나요?",
        light_action: "효율성 따지지 말고, 그냥 즐거움을 위해 1시간 쓰기"
    },
    {
        id: 'jeong_jae',
        name: '정재',
        keyword: '소유/집착',
        shadow_mind: "작은 손해에도 벌벌 떨며 인색하게 굴었나요?",
        light_action: "나와 남을 위해 기분 좋게 '만원' 써보기"
    },
    {
        id: 'pyun_gwan',
        name: '편관',
        keyword: '압박감',
        shadow_mind: "나를 죽일 듯한 스트레스와 책임감에 눌려있나요?",
        light_action: "거절하기! 오늘은 무조건 나를 보호하는 날로 선포하기"
    },
    {
        id: 'jeong_gwan',
        name: '정관',
        keyword: '규칙/체면',
        shadow_mind: "남의 시선 때문에 융통성 없이 굴고 있나요?",
        light_action: "넥타이 풀기. 오늘은 일부러 조금 흐트러져 보기"
    },
    {
        id: 'pyun_in',
        name: '편인',
        keyword: '의심/고독',
        shadow_mind: "세상이 나를 속이는 것 같아 동굴로 숨었나요?",
        light_action: "생각 끊기! 밖으로 나가 햇볕을 쬐며 30분 걷기"
    },
    {
        id: 'jeong_in',
        name: '정인',
        keyword: '인정욕구',
        shadow_mind: "누군가 알아서 챙겨주길 바라며 징징대나요?",
        light_action: "기다리지 말고 내가 먼저 부모님(멘토)께 안부 전하기"
    }
];

// ------------------------------------------------------------------
// Sheet 4: 60갑자 (Master_60Pillars) - 일주론 (Full 60)
// ------------------------------------------------------------------
export const Pillars: Pillar[] = [
    { id: 1, name: "갑자 (甲子)", image: "겨울 바다 위 나무", summary: "차가운 지성을 가졌지만, 뿌리가 불안해 부유하는 리더" },
    { id: 2, name: "을축 (乙丑)", image: "언 땅에 핀 꽃", summary: "환경이 척박해도 끈질기게 살아남는 생활력의 화신" },
    { id: 3, name: "병인 (丙寅)", image: "봄의 태양", summary: "아이처럼 순수하고 폭발적인 에너지를 가진 시작의 제왕" },
    { id: 4, name: "정묘 (丁卯)", image: "촛불 아래 토끼", summary: "섬세하고 예민하지만, 남을 따뜻하게 비추는 예술가" },
    { id: 5, name: "무진 (戊辰)", image: "거대한 태산", summary: "스케일이 크고 묵직하지만, 속을 알 수 없는 야망가" },
    { id: 6, name: "기사 (己巳)", image: "논밭 위 뱀", summary: "조용해 보이지만 내면에는 뜨거운 변혁을 꿈꾸는 전략가" },
    { id: 7, name: "경오 (庚午)", image: "불 위의 도끼", summary: "자신을 극한으로 단련하여 원칙을 지키는 고독한 장군" },
    { id: 8, name: "신미 (辛未)", image: "메마른 땅 보석", summary: "건조하고 예민하지만, 끝내 빛을 발하는 완벽주의자" },
    { id: 9, name: "임신 (壬申)", image: "솟아나는 샘물", summary: "끊임없이 지식을 흡수하고 흘려보내는 총명한 지략가" },
    { id: 10, name: "계유 (癸酉)", image: "바위 틈의 계곡물", summary: "아주 맑고 깨끗해서 작은 티끌도 용납 못 하는 결벽의 순수함" },
    { id: 11, name: "갑술 (甲戌)", image: "민둥산 위의 나무", summary: "척박한 환경에서도 홀로 우뚝 서는 고독한 리더십" },
    { id: 12, name: "을해 (乙亥)", image: "물 위에 뜬 꽃", summary: "어디든 흘러가며 적응하지만, 뿌리가 없어 늘 불안한 방랑자" },
    { id: 13, name: "병자 (丙子)", image: "한겨울의 태양", summary: "겉은 화려하게 빛나지만, 속은 근심과 걱정이 많은 이중적 매력" },
    { id: 14, name: "정축 (丁丑)", image: "얼어붙은 땅 위 촛불", summary: "자신을 태워 차가운 세상을 녹이는 따뜻한 희생정신" },
    { id: 15, name: "무인 (戊寅)", image: "산속의 호랑이", summary: "자존심이 매우 강하고, 한번 목표를 정하면 밀어붙이는 불도저" },
    { id: 16, name: "기묘 (己卯)", image: "들판의 토끼", summary: "부지런하고 예민하며, 남을 잘 챙기지만 본인은 늘 바쁜 실속파" },
    { id: 17, name: "경진 (庚辰)", image: "무쇠를 품은 용", summary: "강력한 의지와 개혁 정신으로 세상을 뒤집으려는 혁명가" },
    { id: 18, name: "신사 (辛巳)", image: "불 위에 놓인 보석", summary: "섬세하고 예민하며, 자신을 극한으로 단련해 빛을 내는 완벽주의자" },
    { id: 19, name: "임오 (壬午)", image: "호수 위의 달빛", summary: "지혜롭고 재물복이 많지만, 감정 기복이 심해 변덕스러운 전략가" },
    { id: 20, name: "계미 (癸未)", image: "메마른 땅의 단비", summary: "약해 보이지만 끈질긴 생명력을 가졌고, 남몰래 근심이 많은 몽상가" },
    { id: 21, name: "갑신 (甲申)", image: "바위 위의 나무", summary: "혁신적이고 다재다능하지만, 안정을 찾지 못해 늘 새로운 것을 찾는 모험가" },
    { id: 22, name: "을유 (乙酉)", image: "바위 틈의 꽃", summary: "환경이 혹독할수록 더 강해지는 '외유내강'의 생존 전문가" },
    { id: 23, name: "병술 (丙戌)", image: "저무는 석양", summary: "열정적이지만 어딘가 쓸쓸하고, 의리와 인정이 넘치는 로맨티스트" },
    { id: 24, name: "정해 (丁亥)", image: "밤바다의 등대", summary: "어둠 속에서 길을 밝혀주는 영적인 직관과 섬세함을 가진 예언자" },
    { id: 25, name: "무자 (戊子)", image: "산 아래의 호수", summary: "겉으로는 덤덤해 보이지만, 속으로는 치밀하게 계산하고 재물을 모으는 알부자" },
    { id: 26, name: "기축 (己丑)", image: "겨울의 논밭", summary: "말없이 묵묵히 자신의 일을 하며, 한번 믿으면 끝까지 가는 우직한 뚝심" },
    { id: 27, name: "경인 (庚寅)", image: "숲을 가르는 도끼", summary: "직선적이고 호탕하며, 큰 목표를 향해 거침없이 돌진하는 장군" },
    { id: 28, name: "신묘 (辛卯)", image: "풀을 베는 가위", summary: "치밀하고 분석적이며, 자신의 이익과 목표를 날카롭게 챙기는 실리주의자" },
    { id: 29, name: "임진 (壬辰)", image: "승천하는 흑룡", summary: "스케일이 크고 배포가 남다르며, 남들이 못하는 큰일을 저지르는 괴물 같은 능력" },
    { id: 30, name: "계사 (癸巳)", image: "햇살 아래 이슬비", summary: "천재적인 두뇌와 감각을 가졌으나, 감정의 기복 때문에 스스로 피곤한 예술가" },
    { id: 31, name: "갑오 (甲午)", image: "타오르는 장작", summary: "자신을 태워 남을 돕는 활달한 성격이지만, 뒤끝 없이 너무 솔직한 행동파" },
    { id: 32, name: "을미 (乙未)", image: "마른 땅의 잡초", summary: "어떤 어려움도 견뎌내는 끈기가 있고, 현실적인 감각이 뛰어난 생활력의 화신" },
    { id: 33, name: "병신 (丙申)", image: "제련되는 쇠", summary: "화려한 언변과 재주로 사람을 홀리며, 실속과 명예를 다 챙기는 만능 엔터테이너" },
    { id: 34, name: "정유 (丁酉)", image: "촛불에 비친 보석", summary: "아름다움을 추구하는 심미안이 있고, 작고 디테일한 것에 강한 완벽주의자" },
    { id: 35, name: "무술 (戊戌)", image: "첩첩산중 거대한 산", summary: "속을 알 수 없는 과묵함 속에 엄청난 고집과 신의를 숨기고 있는 거인" },
    { id: 36, name: "기해 (己亥)", image: "바다 옆의 모래사장", summary: "융통성이 좋고 포용력이 있으며, 겉보단 속이 꽉 찬 실속 있는 지략가" },
    { id: 37, name: "경자 (庚子)", image: "차가운 물 속의 쇠", summary: "냉철한 비판 의식과 논리로 세상을 분석하며, 한 분야의 깊은 전문가가 되는 사람" },
    { id: 38, name: "신축 (辛丑)", image: "진흙 속의 진주", summary: "재능을 숨기고 때를 기다리며, 남모르는 아픔을 예술이나 종교로 승화시키는 사람" },
    { id: 39, name: "임인 (壬寅)", image: "숲을 키우는 물", summary: "베풀기를 좋아하고 식복이 타고났으며, 미래를 내다보는 기획력이 뛰어난 리더" },
    { id: 40, name: "계묘 (癸卯)", image: "봄비 맞은 새싹", summary: "순수하고 다정다감하며, 타고난 센스와 미적 감각으로 사랑받는 귀염둥이" },
    { id: 41, name: "갑진 (甲辰)", image: "비옥한 땅의 거목", summary: "재물과 명예에 대한 욕망이 크고, 한 번 물면 놓지 않는 집념의 승부사" },
    { id: 42, name: "을사 (乙巳)", image: "꽃밭의 나비", summary: "말을 조리 있게 잘하고 표현력이 뛰어나며, 어디서나 인기를 끄는 매력덩어리" },
    { id: 43, name: "병오 (丙午)", image: "한낮의 태양", summary: "가장 강력한 불의 기운. 화끈하고 뒤끝 없으나 성격이 급해 손해를 보기도 하는 대장부" },
    { id: 44, name: "정미 (丁未)", image: "뜨거운 열기", summary: "겉은 온화해 보이나 속은 용광로처럼 뜨겁고, 희생정신과 독립심이 공존하는 사람" },
    { id: 45, name: "무신 (戊申)", image: "광산이 있는 산", summary: "재주가 비상하고 일 처리가 빠르며, 어떤 문제든 척척 해결해내는 능력자" },
    { id: 46, name: "기유 (己酉)", image: "정원석", summary: "깔끔하고 단정하며, 원칙을 중요시하고 남에게 폐 끼치는 것을 싫어하는 모범생" },
    { id: 47, name: "경술 (庚戌)", image: "쇠로 만든 창과 방패", summary: "의리와 충성심이 대단하고, 한번 맺은 인연이나 목표는 목숨 걸고 지키는 무사" },
    { id: 48, name: "신해 (辛亥)", image: "물에 씻긴 보석", summary: "머리가 비상하게 좋고 감수성이 풍부하며, 차갑지만 고귀한 기품이 흐르는 사람" },
    { id: 49, name: "임자 (壬子)", image: "깊고 넓은 바다", summary: "속을 알 수 없는 깊은 지혜와 야망을 가졌으며, 한번 화나면 쓰나미처럼 무서운 제왕" },
    { id: 50, name: "계축 (癸丑)", image: "겨울의 얼음비", summary: "인내심의 끝판왕. 겉으로는 유순해 보여도 내면에는 폭발적인 잠재력을 숨긴 사람" },
    { id: 51, name: "갑인 (甲寅)", image: "빽빽한 숲", summary: "남에게 굽히기 싫어하는 자존심 대장. 정직하고 추진력이 강해 리더가 되어야 직성이 풀림" },
    { id: 52, name: "을묘 (乙卯)", image: "들판의 꽃과 풀", summary: "부드러워 보이지만 생존 본능이 엄청나고, 동료와 함께할 때 더 큰 힘을 내는 협력자" },
    { id: 53, name: "병진 (丙辰)", image: "구름 사이의 태양", summary: "밝고 긍정적이며, 이상이 높고 베푸는 것을 좋아하는 호탕한 성품의 소유자" },
    { id: 54, name: "정사 (丁巳)", image: "활활 타는 횃불", summary: "집중력이 엄청나고 승부욕이 강하며, 질투심도 에너지로 바꿔버리는 열정적인 사람" },
    { id: 55, name: "무오 (戊午)", image: "폭발하는 화산", summary: "카리스마가 넘치고 배포가 크며, 꼼꼼함과 대범함을 동시에 갖춘 매력적인 지도자" },
    { id: 56, name: "기미 (己未)", image: "메마른 전답", summary: "누구보다 현실적이고 끈기가 있으며, 묵묵히 자신의 영역을 지켜내는 믿음직한 사람" },
    { id: 57, name: "경신 (庚申)", image: "단단한 강철 기둥", summary: "절대 꺾이지 않는 강철 같은 의지. 타협보다는 원칙을 고수하며 세상을 바꾸는 혁명가" },
    { id: 58, name: "신유 (辛酉)", image: "잘 다듬어진 칼", summary: "가장 예리하고 섬세한 감각. 냉철한 비판력과 완벽주의로 최고의 결과를 만드는 장인" },
    { id: 59, name: "임술 (壬戌)", image: "불을 품은 바다", summary: "직관력이 뛰어나고 영적인 세계에 관심이 많으며, 돈과 명예를 다루는 수완이 좋은 사업가" },
    { id: 60, name: "계해 (癸亥)", image: "쏟아지는 폭우", summary: "지혜가 넘치고 어디든 스며드는 친화력이 있지만, 때론 목적 없이 방황하기도 하는 자유로운 영혼" }
];

// 3. 유틸리티 함수 (Helpers)

export function getMyeongsimData() {
    return {
        Stems,
        Branches,
        TenGods,
        Pillars
    };
}

// 개별 조회 헬퍼
export function getStemByCode(code: string) {
    return Stems.find(s => s.code === code);
}

export function getBranchByCode(code: string) {
    return Branches.find(b => b.code === code);
}

export function getPillarById(id: number) {
    return Pillars.find(p => p.id === id);
}
