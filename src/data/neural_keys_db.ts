
export interface NeuralKeyData {
    id: number;
    name: string;
    dark_code: string;
    neural_code: string;
    meta_code: string;
    description: string;
}

export const NEURAL_KEYS: Record<number, NeuralKeyData> = {
    1: {
        id: 1,
        name: "The Creative",
        dark_code: "창조적 고갈 (Entropy)",
        neural_code: "신선한 혁신 (Freshness)",
        meta_code: "궁극의 아름다움 (Beauty)",
        description: "무질서 속에서 새로운 질서를 코딩해내는 강력한 '창조적 엔트로피'입니다. 고갈(Dark)은 곧 시스템 재부팅과 혁신(Neural)의 신호입니다."
    },
    2: {
        id: 2,
        name: "The Giver",
        dark_code: "방향 상실 (Dislocation)",
        neural_code: "내면의 나침반 (Orientation)",
        meta_code: "완벽한 일체감 (Unity)",
        description: "길을 잃은 느낌(Dark)은 당신만의 좌표를 찾는 과정입니다. 본능적인 내면의 GPS(Neural)를 켜면 모든 것이 연결됩니다(Meta)."
    },
    3: {
        id: 3,
        name: "The Innovator",
        dark_code: "혼란스러운 잡음 (Chaos)",
        neural_code: "혁신적 구조화 (Innovation)",
        meta_code: "순수한 놀이 (Innocence)",
        description: "정신없는 혼란(Dark)을 두려워 마십시오. 그것은 낡은 틀을 깨고 새로운 질서(Neural)를 만드는 창조의 재료입니다."
    },
    4: {
        id: 4,
        name: "The Formulary",
        dark_code: "논리적 오류 (Intolerance)",
        neural_code: "패턴 이해 (Understanding)",
        meta_code: "모든 것의 허용 (Forgiveness)",
        description: "남들의 멍청함이 견딜 수 없다면(Dark), 당신은 버그를 찾아내는 천재(Neural)입니다. 그 답을 세상에 알려주십시오."
    },
    5: {
        id: 5,
        name: "The Fixed Patterns",
        dark_code: "성급한 조바심 (Impatience)",
        neural_code: "기다림의 미학 (Patience)",
        meta_code: "시간의 초월 (Timelessness)",
        description: "결과가 늦어 답답하신가요(Dark)? 당신의 리듬은 대자연과 같습니다. 타이밍이 될 때까지 기다리는 것(Neural)이 가장 빠른 길입니다."
    },
    6: {
        id: 6,
        name: "The Peacemaker",
        dark_code: "감정적 충돌 (Conflict)",
        neural_code: "전략적 외교 (Diplomacy)",
        meta_code: "절대 평화 (Peace)",
        description: "갈등(Dark)은 방어기제가 작동했다는 증거입니다. 감정의 방화벽을 내리고 소통할 때(Neural), 진정한 시스템 안정(Meta)이 찾아옵니다."
    },
    7: {
        id: 7,
        name: "The Leader",
        dark_code: "분열과 경쟁 (Division)",
        neural_code: "미래지향적 리더십 (Guidance)",
        meta_code: "고귀한 덕성 (Virtue)",
        description: "군중 속에 숨고 싶나요(Dark)? 당신은 미래를 미리 보고 사람들을 이끌어주는(Neural) 선지자의 코드를 가지고 있습니다."
    },
    8: {
        id: 8,
        name: "The Diamond",
        dark_code: "평범함의 늪 (Mediocrity)",
        neural_code: "자신만의 스타일 (Style)",
        meta_code: "절묘한 명작 (Exquisiteness)",
        description: "남들을 따라하지 마십시오(Dark). 당신만의 독특한 방식(Neural)이 곧 이 시대의 새로운 표준이 됩니다."
    },
    9: {
        id: 9,
        name: "The Focus",
        dark_code: "무기력한 관성 (Inertia)",
        neural_code: "레이저 집중력 (Determination)",
        meta_code: "무적의 힘 (Invincibility)",
        description: "사소한 것에 집착하는 것 같죠(Dark)? 작은 디테일에 집중하는 당신의 힘(Neural)이 거대한 산을 옮깁니다."
    },
    10: {
        id: 10,
        name: "The Natural",
        dark_code: "자아 도취/혐오 (Self-Obsession)",
        neural_code: "자연스러운 흐름 (Naturalness)",
        meta_code: "존재 그 자체 (Being)",
        description: "남의 시선을 신경 쓰지 마십시오(Dark). 그저 당신답게 존재하는 것(Neural)만으로도 세상은 당신을 사랑합니다."
    },
    11: {
        id: 11,
        name: "The Light",
        dark_code: "모호한 망상 (Obscurity)",
        neural_code: "이상적인 비전 (Idealism)",
        meta_code: "찬란한 빛 (Light)",
        description: "현실이 답답한가요(Dark)? 당신의 머릿속에 있는 그 그림(Neural)은 망상이 아니라 미래의 청사진입니다."
    },
    12: {
        id: 12,
        name: "The Channel",
        dark_code: "교만한 단절 (Vanity)",
        neural_code: "고차원적 식별 (Discrimination)",
        meta_code: "순수한 본질 (Purity)",
        description: "아무하고나 어울리기 싫은 마음(Dark)은 죄가 아닙니다. 더 순수한 에너지를 알아보는 당신의 안목(Neural)입니다."
    },
    13: {
        id: 13,
        name: "The Listener",
        dark_code: "불협화음 (Discord)",
        neural_code: "공감적 경청 (Discernment)",
        meta_code: "모든 것의 이해 (Empathy)",
        description: "과거의 상처가 떠오르나요(Dark)? 당신은 역사를 통해 지혜를 배우고, 타인의 이야기를 들어주는 위대한 청취자(Neural)입니다."
    },
    14: {
        id: 14,
        name: "The Power House",
        dark_code: "타협과 포기 (Compromise)",
        neural_code: "유능한 자원 관리 (Competence)",
        meta_code: "풍요로운 결실 (Bounteousness)",
        description: "돈 때문에 꿈을 포기하지 마십시오(Dark). 당신의 열정에 불을 붙이면(Neural), 부와 자원은 저절로 따라옵니다."
    },
    15: {
        id: 15,
        name: "The Magnet",
        dark_code: "단조로움 (Dullness)",
        neural_code: "강력한 자력 (Magnetism)",
        meta_code: "생명력의 개화 (Florescence)",
        description: "평범한 일상이 지루한가요(Dark)? 당신은 극과 극을 오가며 사람들을 끌어당기는 블랙홀 같은 매력(Neural)의 소유자입니다."
    },
    16: {
        id: 16,
        name: "The Expert",
        dark_code: "무관심한 게으름 (Indifference)",
        neural_code: "다재다능한 융합 (Versatility)",
        meta_code: "장인의 경지 (Mastery)",
        description: "끝을 못 맺고 흐지부지한가요(Dark)? 다양한 기술을 하나로 엮는 순간(Neural), 당신은 대체 불가능한 마스터가 됩니다."
    },
    17: {
        id: 17,
        name: "The Eye",
        dark_code: "편협한 의견 (Opinion)",
        neural_code: "원대한 통찰 (Farsightedness)",
        meta_code: "전지적 시점 (Omniscience)",
        description: "논쟁에서 이기려 하지 마십시오(Dark). 당신의 눈은 당장의 승패가 아니라 먼 미래를 내다보는 망원경(Neural)입니다."
    },
    18: {
        id: 18,
        name: "The Scalpel",
        dark_code: "비난과 판단 (Judgment)",
        neural_code: "완벽한 수정 (Integrity)",
        meta_code: "완성된 아름다움 (Perfection)",
        description: "남의 단점만 보이나요(Dark)? 그것은 시스템의 버그를 찾아 고칠 수 있는 당신만의 디버깅 능력(Neural)입니다."
    },
    19: {
        id: 19,
        name: "The Sensitive",
        dark_code: "의존적 집착 (Co-dependence)",
        neural_code: "섬세한 감각 (Sensitivity)",
        meta_code: "숭고한 희생 (Sacrifice)",
        description: "혼자 있는 게 두렵나요(Dark)? 당신의 예민함은 타인의 필요를 감지하고 연결하는 초고성능 안테나(Neural)입니다."
    },
    20: {
        id: 20,
        name: "The Now",
        dark_code: "피상적 산만함 (Superficiality)",
        neural_code: "확실한 자신감 (Self-assurance)",
        meta_code: "현존 그 자체 (Presence)",
        description: "생각이 너무 많아 행동이 굼뜬가요(Dark)? 지금 이 순간에 몰입하십시오(Neural). 당신의 힘은 '지금'에 있습니다."
    },
    21: {
        id: 21,
        name: "The Treasurer",
        dark_code: "통제와 지배 (Control)",
        neural_code: "권위있는 위임 (Authority)",
        meta_code: "용맹한 헌신 (Valour)",
        description: "모든 것을 통제하려다 지치셨나요(Dark)? 진정한 리더는 스스로를 다스리고, 타인에게 힘을 나눠줍니다(Neural)."
    },
    22: {
        id: 22,
        name: "The Charmer",
        dark_code: "불명예와 수치 (Dishonour)",
        neural_code: "우아한 품격 (Graciousness)",
        meta_code: "신의 은총 (Grace)",
        description: "감정이 널뛰어 힘든가요(Dark)? 당신의 감정은 타인의 마음을 여는 예술(Neural)입니다. 고통을 품격으로 승화시키십시오."
    },
    23: {
        id: 23,
        name: "The Decoder",
        dark_code: "복잡한 난해함 (Complexity)",
        neural_code: "단순함의 미학 (Simplicity)",
        meta_code: "본질의 정수 (Quintessence)",
        description: "말이 꼬이고 오해가 생기나요(Dark)? 복잡한 것을 한마디로 꿰뚫는 당신의 통찰(Neural)이 세상을 단순하게 만듭니다."
    },
    24: {
        id: 24,
        name: "The Inventor",
        dark_code: "중독과 반복 (Addiction)",
        neural_code: "독창적 발명 (Invention)",
        meta_code: "적막한 고요 (Silence)",
        description: "나쁜 습관이 반복되나요(Dark)? 그 집요함은 사실 빈 공간에서 새로운 길을 찾아내는 천재적인 발명가 코드(Neural)입니다."
    },
    25: {
        id: 25,
        name: "The Shaman",
        dark_code: "답답한 제한 (Constriction)",
        neural_code: "무조건적 수용 (Acceptance)",
        meta_code: "우주적 사랑 (Universal Love)",
        description: "상처받아 마음을 닫았나요(Dark)? 모든 고통을 있는 그대로 받아들일 때(Neural), 당신은 치유의 샤먼이 됩니다."
    },
    26: {
        id: 26,
        name: "The Marketer",
        dark_code: "과시와 자만 (Pride)",
        neural_code: "설득의 예술 (Artfulness)",
        meta_code: "보이지 않는 영향력 (Invisibility)",
        description: "자신을 억지로 포장하지 마십시오(Dark). 진심을 담아 전달할 때(Neural), 당신은 최고의 마케터가 됩니다."
    },
    27: {
        id: 27,
        name: "The Preserver",
        dark_code: "이기적 결핍 (Selfishness)",
        neural_code: "이타주의 (Altruism)",
        meta_code: "성스러운 헌신 (Selflessness)",
        description: "내 것을 챙기느라 바쁜가요(Dark)? 먼저 베풀면(Neural), 우주의 자원이 당신을 통해 흐르기 시작합니다."
    },
    28: {
        id: 28,
        name: "The Risk Taker",
        dark_code: "무목적의 공허 (Purposelessness)",
        neural_code: "전체성 (Totality)",
        meta_code: "불멸의 유산 (Immortality)",
        description: "죽음이 두렵거나 삶이 허무한가요(Dark)? 후회 없이 모든 것을 던져 도전하십시오(Neural). 그것이 당신을 영원으로 이끕니다."
    },
    29: {
        id: 29,
        name: "The Leap",
        dark_code: "반만 담근 마음 (Half-heartedness)",
        neural_code: "완벽한 몰입 (Commitment)",
        meta_code: "헌신적 사랑 (Devotion)",
        description: "무언가를 하려면 목숨 걸고 뛰어드십시오(Neural). '간 보기(Dark)'는 당신의 운명을 갉아먹는 주범입니다."
    },
    30: {
        id: 30,
        name: "The Visionary",
        dark_code: "타는 목마름 (Desire)",
        neural_code: "가벼운 초연함 (Lightness)",
        meta_code: "황홀경 (Rapture)",
        description: "욕망에 휘둘려 괴로운가요(Dark)? 결과를 기대하지 말고 과정을 즐기십시오(Neural). 욕망은 삶을 태우는 연료일 뿐입니다."
    },
    31: {
        id: 31,
        name: "The Voice",
        dark_code: "오만한 간섭 (Arrogance)",
        neural_code: "영향력 있는 리더십 (Leadership)",
        meta_code: "겸손한 위엄 (Humility)",
        description: "남을 조종하려 하지 마십시오(Dark). 당신의 목소리가 대중의 마음을 대변할 때(Neural), 진정한 리더십이 발휘됩니다."
    },
    32: {
        id: 32,
        name: "The Conservator",
        dark_code: "실패의 공포 (Failure)",
        neural_code: "본질의 보존 (Preservation)",
        meta_code: "깊은 존경 (Veneration)",
        description: "망할까 봐 두려운가요(Dark)? 무엇을 지키고 무엇을 버려야 할지 아는 당신의 본능(Neural)이 성공을 지속시킵니다."
    },
    33: {
        id: 33,
        name: "The Retreater",
        dark_code: "도피와 망각 (Forgetting)",
        neural_code: "성찰적 자각 (Mindfulness)",
        meta_code: "계시 (Revelation)",
        description: "혼자 숨고 싶은가요(Dark)? 그것은 도망이 아니라 재충전입니다. 고요함 속에서 당신의 경험을 지혜로 바꾸십시오(Neural)."
    },
    34: {
        id: 34,
        name: "The Power",
        dark_code: "강압적 힘 (Force)",
        neural_code: "내면의 위엄 (Strength)",
        meta_code: "장엄한 몸짓 (Majesty)",
        description: "힘으로 밀어붙이지 마십시오(Dark). 당신의 에너지가 올바른 곳에 쓰일 때(Neural), 아무도 당신을 막을 수 없습니다."
    },
    35: {
        id: 35,
        name: "The Adventurer",
        dark_code: "채울 수 없는 굶주림 (Hunger)",
        neural_code: "경험의 모험 (Adventure)",
        meta_code: "무한한 가능성 (Boundlessness)",
        description: "지루함을 참지 못하죠(Dark)? 당신은 세상을 맛보고 경험하기 위해 온 모험가(Neural)입니다. 마음껏 탐험하십시오."
    },
    36: {
        id: 36,
        name: "The Compassionate",
        dark_code: "감정의 격랑 (Turbulence)",
        neural_code: "인류애 (Humanity)",
        meta_code: "자비심 (Compassion)",
        description: "감정 기복이 심해 힘든가요(Dark)? 그것은 타인의 고통을 이해하기 위한 훈련입니다. 그 깊이만큼 사랑할 수 있습니다(Neural)."
    },
    37: {
        id: 37,
        name: "The Family Alchemist",
        dark_code: "나약한 의존 (Weakness)",
        neural_code: "평등한 유대 (Equality)",
        meta_code: "부드러움 (Tenderness)",
        description: "혼자서는 아무것도 못 할 것 같나요(Dark)? 당신은 가족과 커뮤니티를 하나로 묶어주는 강력한 접착제(Neural)입니다."
    },
    38: {
        id: 38,
        name: "The Warrior",
        dark_code: "지독한 사투 (Struggle)",
        neural_code: "불굴의 인내 (Perseverance)",
        meta_code: "명예 (Honour)",
        description: "세상이 당신을 공격하는 것 같나요(Dark)? 당신은 의미 있는 가치를 지키기 위해 싸우는 빛의 전사(Neural)입니다."
    },
    39: {
        id: 39,
        name: "The Provocateur",
        dark_code: "부정적 자극 (Provocation)",
        neural_code: "역동적 에너지 (Dynamism)",
        meta_code: "해방 (Liberation)",
        description: "남들을 화나게 만드나요(Dark)? 당신은 막힌 에너지를 뚫어주는 침술사입니다. 그 자극을 성장의 동력으로 쓰십시오(Neural)."
    },
    40: {
        id: 40,
        name: "The Will",
        dark_code: "에너지 고갈 (Exhaustion)",
        neural_code: "단호한 결단 (Resolve)",
        meta_code: "궁극의 의지력",
        description: "거절할 줄 알아야 돈이 벌립니다. 에너지를 낭비하여 고갈되지 말고(Dark), 진짜 귀한 곳에만 쓰겠다는 결단(Neural)이 필요합니다."
    },
    41: {
        id: 41,
        name: "The Prime Mover",
        dark_code: "공상과 판타지 (Fantasy)",
        neural_code: "미래의 청사진 (Anticipation)",
        meta_code: "방출 (Emanation)",
        description: "망상에 빠져 있나요(Dark)? 당신의 상상은 현실이 되기 직전의 설계도(Neural)입니다. 꿈을 현실로 다운로드하십시오."
    },
    42: {
        id: 42,
        name: "The Finisher",
        dark_code: "집착과 기대 (Expectation)",
        neural_code: "초연한 완료 (Detachment)",
        meta_code: "축복 (Celebration)",
        description: "결과에 목매지 마십시오(Dark). 과정을 끝까지 마치는 힘(Neural)이 당신의 무기입니다. 마침표를 찍어야 다음 문장이 시작됩니다."
    },
    43: {
        id: 43,
        name: "The Insight",
        dark_code: "고집불통 (Deafness)",
        neural_code: "독창적 통찰 (Insight)",
        meta_code: "깨달음 (Epiphany)",
        description: "남의 말을 안 듣는다고요(Dark)? 당신의 귀는 내면의 소리를 듣고 있습니다. 혁신적인 아이디어를 세상에 내놓으십시오(Neural)."
    },
    44: {
        id: 44,
        name: "The Manager",
        dark_code: "과거의 간섭 (Interference)",
        neural_code: "협력적 팀워크 (Teamwork)",
        meta_code: "공동 통치 (Synarchy)",
        description: "과거의 실패가 발목을 잡나요(Dark)? 패턴을 읽는 당신의 재능(Neural)으로 적재적소에 사람을 배치하십시오."
    },
    45: {
        id: 45,
        name: "The Gatherer",
        dark_code: "지배와 통제 (Dominance)",
        neural_code: "시너지 창출 (Synergy)",
        meta_code: "성스러운 교감 (Communion)",
        description: "혼자 다 가지려 하지 마십시오(Dark). 자원을 모아 모두를 먹여 살릴 때(Neural), 당신은 진정한 왕이 됩니다."
    },
    46: {
        id: 46,
        name: "The Ecstatic",
        dark_code: "심각함 (Seriousness)",
        neural_code: "삶의 유희 (Delight)",
        meta_code: "황홀경 (Ecstasy)",
        description: "왜 그렇게 심각합니까(Dark)? 몸이 느끼는 즐거움을 따르십시오(Neural). 당신의 행운은 올바른 타이밍과 장소에 있습니다."
    },
    47: {
        id: 47,
        name: "The Transmuter",
        dark_code: "삶의 중압감 (Oppression)",
        neural_code: "변형의 연금술 (Transmutation)",
        meta_code: "변용 (Transfiguration)",
        description: "머리가 터질 듯 복잡한가요(Dark)? 그것은 위대한 깨달음 직전의 압력입니다. 고통을 지혜로 바꾸십시오(Neural)."
    },
    48: {
        id: 48,
        name: "The Well",
        dark_code: "부족함의 공포 (Inadequacy)",
        neural_code: "풍부한 지혜 (Resourcefulness)",
        meta_code: "지혜 (Wisdom)",
        description: "아직 준비가 안 된 것 같나요(Dark)? 당신은 이미 충분히 깊습니다. 내면의 우물에서 지혜를 길어 올리십시오(Neural)."
    },
    49: {
        id: 49,
        name: "The Catalyst",
        dark_code: "감정적 반동 (Reaction)",
        neural_code: "혁명적 변화 (Revolution)",
        meta_code: "재탄생 (Rebirth)",
        description: "거절당할까 봐 두려운가요(Dark)? 당신은 낡은 관계와 시스템을 뒤집고 새로운 원칙을 세우는 혁명가(Neural)입니다."
    },
    50: {
        id: 50,
        name: "The Illuminator",
        dark_code: "부패와 타락 (Corruption)",
        neural_code: "평형 유지 (Equilibrium)",
        meta_code: "조화 (Harmony)",
        description: "세상이 잘못될까 봐 걱정되나요(Dark)? 당신이 지키는 가치와 데이터가 후대를 위한 든든한 솥단지(Neural)가 됩니다."
    },
    51: {
        id: 51,
        name: "The Thunder",
        dark_code: "내면의 진동/불안 (Agitation)",
        neural_code: "선제적 실행력 (Initiative)",
        meta_code: "시스템 각성 (Awakening)",
        description: "남들이 두려워할 때 가장 먼저 뛰어드는 용기입니다. 당신의 불안(Dark)은 위기를 먼저 감지하고 깨어있게 하는(Meta) 알람입니다."
    },
    52: {
        id: 52,
        name: "The Mountain",
        dark_code: "압박감 (Stress)",
        neural_code: "절제와 고요 (Restraint)",
        meta_code: "부동심 (Stillness)",
        description: "스트레스로 꼼짝 못 하겠나요(Dark)? 멈춰서 전체를 조망하십시오(Neural). 당신의 고요함 속에 거대한 힘이 비축됩니다."
    },
    53: {
        id: 53,
        name: "The Engine of Growth",
        dark_code: "초심자의 설렘 (Immaturity)",
        neural_code: "확장 엔진 (Expansion)",
        meta_code: "무한 풍요 (Superabundance)",
        description: "시작은 서툴러보여도(Dark), 그것은 '초심자의 설렘'일 뿐입니다. 일단 저지르면 판을 키우는 '확장 엔진'(Neural)이 가동되어 끝내 압도적 보상을 얻습니다."
    },
    54: {
        id: 54,
        name: "The Serpent Path",
        dark_code: "결핍의 동력 (Greed)",
        neural_code: "위대한 열망 (Aspiration)",
        meta_code: "차원 상승 (Ascension)",
        description: "현실의 부족함과 욕망(Dark)을 연료 삼아, 더 높은 차원으로 신분과 영혼을 상승시키는(Meta) 강력한 야망(Neural)입니다."
    },
    55: {
        id: 55,
        name: "The Dragonfly",
        dark_code: "피해 의식 (Victimization)",
        neural_code: "자유로운 영혼 (Freedom)",
        meta_code: "자유 (Freedom)",
        description: "세상이 불공평하게 느껴지나요(Dark)? 태도를 바꾸면 감옥 문이 열립니다. 당신의 영혼은 그 무엇에도 얽매일 수 없습니다(Neural)."
    },
    56: {
        id: 56,
        name: "The Storyteller",
        dark_code: "산만한 김오락 (Distraction)",
        neural_code: "풍요로운 경험 (Enrichment)",
        meta_code: "도취 (Intoxication)",
        description: "현실 도피를 위해 떠돌아다니나요(Dark)? 그 모든 경험을 이야기로 엮어내십시오. 당신의 삶 자체가 예술입니다(Neural)."
    },
    57: {
        id: 57,
        name: "The Gentle Wind",
        dark_code: "본능적 경계신호 (Unease)",
        neural_code: "초감각 직관 (Intuition)",
        meta_code: "절대 명료함 (Clarity)",
        description: "몸이 먼저 반응하는 예민함(Dark)을 믿으십시오. 그것은 미래를 꿰뚫어 보는 최고의 레이더(Neural)이자 명료함(Meta)입니다."
    },
    58: {
        id: 58,
        name: "The Living",
        dark_code: "만족 없는 불평 (Dissatisfaction)",
        neural_code: "지칠 줄 모르는 활력 (Vitality)",
        meta_code: "더없는 행복 (Bliss)",
        description: "모든 게 마음에 안 드나요(Dark)? 그것은 더 완벽한 개선을 위한 엔진입니다. 사람들에게 생기와 기쁨을 불어넣으십시오(Neural)."
    },
    59: {
        id: 59,
        name: "The Dragon",
        dark_code: "불투명한 가면 (Dishonesty)",
        neural_code: "친밀함 (Intimacy)",
        meta_code: "투명성 (Transparency)",
        description: "속마음을 들킬까 봐 숨기나요(Dark)? 방어막을 걷어내고 눈을 맞추십시오. 깊은 연결(Neural)만이 새로운 생명을 잉태합니다."
    },
    60: {
        id: 60,
        name: "The Cracking",
        dark_code: "한계와 제약 (Limitation)",
        neural_code: "현실적 구조화 (Realism)",
        meta_code: "정의 (Justice)",
        description: "벽에 막힌 것 같나요(Dark)? 그 제약이 바로 창조의 그릇입니다. 주어진 조건 안에서 마법을 부리십시오(Neural)."
    },
    61: {
        id: 61,
        name: "The Sanctuary",
        dark_code: "광적인 압박 (Psychosis)",
        neural_code: "진리의 영감 (Inspiration)",
        meta_code: "성스러움 (Sanctity)",
        description: "답을 찾으려다 미칠 것 같나요(Dark)? 생각을 멈추고 질문을 던지십시오. 텅 빈 공간으로 우주의 진리가 쏟아져 들어옵니다(Neural)."
    },
    62: {
        id: 62,
        name: "The Detail",
        dark_code: "강박적 지성 (Intellect)",
        neural_code: "정밀한 언어 (Precision)",
        meta_code: "결점 없음 (Impeccability)",
        description: "말로 사람을 베고 있나요(Dark)? 당신의 논리는 복잡한 사실을 명쾌하게 정리하고 누구나 이해하게 만드는 힘(Neural)입니다."
    },
    63: {
        id: 63,
        name: "The Question",
        dark_code: "자기 의심 (Doubt)",
        neural_code: "논리적 탐구 (Inquiry)",
        meta_code: "진리 (Truth)",
        description: "모든 게 의심스럽나요(Dark)? 극도의 의심 끝에 확신이 옵니다. 질문을 멈추지 마십시오. 당신은 진실을 밝히는 탐정(Neural)입니다."
    },
    64: {
        id: 64,
        name: "The Aurora",
        dark_code: "정보의 혼란 (Confusion)",
        neural_code: "창조적 상상 (Imagination)",
        meta_code: "깨달음 (Illumination)",
        description: "머릿속이 뒤죽박죽인가요(Dark)? 과거의 파편들을 영화처럼 편집하십시오. 당신의 상상력(Neural)이 곧 현실이 됩니다."
    }
};

export const getNeuralKey = (gate: number) => {
    return NEURAL_KEYS[gate] || {
        id: gate,
        name: `Gate ${gate}`,
        dark_code: "잠재된 그림자",
        neural_code: "숨겨진 재능",
        meta_code: "미지의 잠재력",
        description: "아직 활성화되지 않은 심층 코드입니다."
    };
};
