/**
 * StaticTextDB.ts - 프리미엄 리포트용 정적 텍스트 데이터베이스
 * 
 * 목적: AI가 매번 새로 쓰지 않고, 미리 준비된 텍스트 블록을 레고처럼 조립
 * 구조:
 *  - SAJU_ILJU: 60갑자 일주 데이터
 *  - TEN_GODS: 10가지 십성 데이터
 *  - MYUNGSIM_CODES: 64가지 명심코드 데이터
 * 
 * 확장 방법: 이 파일에 데이터만 추가하면 됨 (로직 변경 불필요)
 */

import type { IljuData, TenGodData, MyungsimCode } from '@/types/ReportTypes';

// ============== 일주(日柱) 데이터베이스 ==============
// 60갑자 중 대표적인 일주들 (추후 확장)

export const SAJU_ILJU: Record<string, IljuData> = {

    // ===== 갑(甲) 일간 =====
    GAP_JA: {
        id: "ilju_gapja",
        name: "갑자",
        hanja: "甲子",
        title: "🌲 얼음 호수 위에 우뚝 선 거목, 갑자(甲子)일주",
        visual_token: "❄️",
        color_code: "#2E86C1",
        image_prompt: "A giant pine tree standing firmly on a frozen lake under the moonlight",
        keywords: ["#리더십", "#창의성", "#시작의_에너지", "#큰_그림"],
        element: "목",
        yin_yang: "양",
        image_metaphor: "한겨울 밤하늘 아래 우뚝 선 큰 나무, 그 아래 영리한 쥐 한 마리가 씨앗을 품고 있습니다.",
        main_text: `갑자(甲子)일주는 60갑자의 첫 번째로, '시작과 창조의 에너지'를 상징합니다. 
        
큰 나무(甲)가 생명의 근원인 물(子) 위에 뿌리를 내리고 있는 형상으로, 타고난 성장 본능과 리더십을 가지고 있습니다. 마치 씨앗이 땅을 뚫고 하늘을 향해 솟아오르듯, 어떤 환경에서도 성장하려는 강인한 의지가 있습니다.

💧 당신의 장점: 
새로운 일을 시작하는 데 두려움이 없습니다. 남들이 "불가능하다"고 하는 일에서 가능성을 봅니다. 큰 그림을 그리는 능력이 탁월하며, 조직을 이끌 때 빛을 발합니다.

⚡ 주의할 점:
너무 앞서 나가다 보면 주변 사람들이 따라오지 못할 수 있습니다. 세부적인 것보다 전체적인 것에 집중하느라 디테일을 놓치는 경향이 있습니다. 인내심을 기르면 더 큰 성취를 이룰 수 있습니다.`,
        strengths: ["강한 추진력", "창의적 사고", "리더십", "긍정적 마인드", "빠른 판단력"],
        weaknesses: ["조급함", "디테일 부족", "독단적 결정", "타인 배려 부족"],
        career_fit: ["CEO/창업가", "프로젝트 매니저", "투자자", "정치인", "기획자"],
        relationship_style: "연애에서도 주도적인 역할을 선호합니다. 자신이 이끌어갈 수 있는 파트너와 잘 맞으며, 너무 수동적인 상대에게는 답답함을 느낍니다.",
        health_warning: "스트레스를 받으면 간과 담에 영향이 옵니다. 규칙적인 운동과 충분한 수면이 필요합니다.",
        lucky_elements: {
            color: "녹색, 청색",
            number: "3, 8",
            direction: "동쪽"
        },
        dark_code: {
            name: "부유 (Floating)",
            body_symptom: "발이 시리고 하체가 차가움, 뿌리 내리지 못한 듯한 불안감",
            desc: "차가운 물(子) 위에 뜬 나무(甲)처럼, 능력은 출중하지만 마음 둘 곳이 없어 외로우신가요? 겉으로는 자존심이 세고 당당해 보이지만, 속으로는 '내가 여기서 밀려나면 끝'이라는 생존 불안에 시달리고 있습니다."
        },
        neural_code: {
            name: "착근 (Rooting)",
            desc: "차가운 이성이 아닌 따뜻한 감성으로 세상과 연결되어 뿌리 내리는 힘",
            action: "혼자 모든 짐을 지려 하지 말고, 당신의 약한 모습을 믿을 수 있는 사람에게 털어놓으세요. 그리고 햇볕을 쬐며 걷는 산책을 하세요. 당신에게 필요한 건 차가운 지성이 아니라 따뜻한 온기(Fire)입니다."
        },
        meta_code: {
            name: "시원 (Origin)",
            desc: "60갑자의 첫 번째 리더로서, 새로운 역사를 시작하는 창조적 에너지. 당신은 얼음을 깨고 생명을 틔우는 봄의 전령사입니다."
        }
    },

    // 을축(乙丑) 일주 - NEW BATCH_1
    EUL_CHUK: {
        id: "ilju_eulchuk",
        title: "🌱 동토를 뚫고 나온 끈기의 새싹, 을축(乙丑)일주",
        visual_token: "🪨",
        color_code: "#5D6D7E",
        image_prompt: "Small green sprouts breaking through frozen rocky soil",
        dark_code: {
            name: "억압 (Suppression)",
            body_symptom: "어깨가 굽고 위장 장애, 화를 속으로 삭히느라 명치가 답답함",
            desc: "밟혀도 죽지 않는 잡초처럼 끈질기게 버티고 계신가요? '참는 게 이기는 거다'라고 생각하지만, 속으로는 억눌린 분노와 서러움이 마그마처럼 끓고 있습니다. 너무 오래 참으면 병이 됩니다."
        },
        neural_code: {
            name: "발산 (Release)",
            desc: "미래를 위해 현재를 희생하지 않고, 지금 이 순간의 욕구를 표현하는 용기",
            action: "오늘 하루, 당신이 번 돈을 저축하지 말고 오직 '나를 위한 사치'에 써보세요. 꽁꽁 얼어붙은 땅을 녹이는 건 당신의 따뜻한 자기 사랑입니다."
        },
        meta_code: {
            name: "생명력 (Vitality)",
            desc: "어떤 척박한 환경에서도 기어코 꽃을 피워내는 기적 같은 생존력. 당신은 고난을 거름으로 삼아 가장 아름다운 결실을 맺는 대기만성형 거인입니다."
        }
    },

    // 병인(丙寅) 일주 - UPDATED WITH NEW FORMAT
    BIN_YIN: {
        id: "ilju_binyin",
        title: "☀️ 숲 위로 떠오르는 태양, 병인(丙寅)일주",
        visual_token: "🌅",
        color_code: "#FF5733",
        image_prompt: "A bright sun rising over a dense green forest",
        dark_code: {
            name: "성급함 (Impatience)",
            body_symptom: "얼굴이 쉽게 달아오르고 목소리가 큼, 심장이 빨리 뜀",
            desc: "아이디어는 샘솟는데 끈기가 부족해 용두사미로 끝나나요? '나 좀 봐줘!'라고 외치고 싶은데, 아무도 알아주지 않으면 금방 시무룩해지시나요? 당신은 너무 뜨거워서 스스로를 태워버릴 위험이 있습니다."
        },
        neural_code: {
            name: "지속성 (Consistency)",
            desc: "순간의 폭발력이 아닌, 은근하게 오래 타오르는 빛으로 변환하는 힘",
            action: "말하는 시간보다 듣는 시간을 2배로 늘리세요. 그리고 일을 벌이기 전에 '마무리할 수 있는가?'를 먼저 자문하세요. 속도를 늦출 때 당신의 빛은 더 멀리 퍼져나갑니다."
        },
        meta_code: {
            name: "계몽 (Enlightenment)",
            desc: "어둠을 몰아내고 만물에게 공평하게 빛을 나누어주는 태양 같은 존재. 당신이 웃으면 세상도 따라 웃습니다."
        }
    },

    // 정묘(丁卯) 일주 - NEW BATCH_1
    JEONG_MYO: {
        id: "ilju_jeongmyo",
        title: "🕯️ 밤을 밝히는 신비로운 촛불, 정묘(丁卯)일주",
        visual_token: "🏮",
        color_code: "#C0392B",
        image_prompt: "A candle lantern glowing warmly in a mysterious garden",
        dark_code: {
            name: "불안 (Anxiety)",
            body_symptom: "작은 소리에도 깜짝 놀라고, 신경성 두통이나 불면증",
            desc: "바람 앞의 촛불처럼 마음이 늘 조마조마하고 예민하신가요? 사람을 의심하고, '혹시 나를 싫어하나?'라며 촉을 곤두세우느라 에너지가 방전되고 있습니다. 당신을 태우는 건 장작이 아니라 걱정입니다."
        },
        neural_code: {
            name: "직관 (Intuition)",
            desc: "의심을 멈추고, 내면의 영적인 목소리를 있는 그대로 신뢰하는 태도",
            action: "불안할 때마다 향초를 켜거나 따뜻한 차를 마시며 '나는 안전하다'고 말해주세요. 당신의 예민함은 사실 남들의 아픔을 감지하는 뛰어난 '치유 레이더'입니다."
        },
        meta_code: {
            name: "헌신 (Devotion)",
            desc: "자신을 태워 주위를 밝히는 성스러운 불꽃. 당신의 따뜻한 말 한마디가 절망에 빠진 누군가에게는 구원의 등불이 됩니다."
        }
    },

    // 무진(戊辰) 일주 - NEW BATCH_1
    MU_JIN: {
        id: "ilju_mujin",
        title: "⛰️ 거대한 태산과 숨겨진 용, 무진(戊辰)일주",
        visual_token: "🐲",
        color_code: "#795548",
        image_prompt: "A massive mountain range with a dragon sleeping underneath",
        dark_code: {
            name: "고집 (Stubbornness)",
            body_symptom: "몸이 굳고 유연성이 떨어짐, 소화가 느리고 더부룩함",
            desc: "속을 알 수 없는 거대한 산처럼, 비밀을 간직한 채 누구에게도 마음을 열지 않고 계신가요? '내 뜻대로 되어야 해'라는 황소고집으로 주변 사람들을 숨 막히게 할 수도 있습니다. 혼자서는 산이 될 수 없습니다."
        },
        neural_code: {
            name: "개방 (Openness)",
            desc: "단단한 흙을 갈아엎어 그 안에 숨겨진 보물을 세상과 나누는 유연함",
            action: "당신의 완벽한 계획을 헝클어뜨리세요. 남의 의견을 듣고 '그것도 좋네'라며 궤도를 수정해보세요. 당신이 문을 열 때, 산속에 숨겨진 용(잠재력)이 비로소 승천합니다."
        },
        meta_code: {
            name: "신뢰 (Trustworthiness)",
            desc: "모든 생명이 기대어 쉴 수 있는 듬직한 피난처. 당신의 묵직한 존재감은 세상의 중심을 잡아주는 기둥입니다."
        }
    },

    // 기사(己巳) 일주 - NEW BATCH_1
    GI_SA: {
        id: "ilju_gisa",
        title: "🌋 용암을 품은 비옥한 대지, 기사(己巳)일주",
        visual_token: "🌋",
        color_code: "#D35400",
        image_prompt: "Fertile field with cracks revealing glowing lava underneath",
        dark_code: {
            name: "집착 (Obsession)",
            body_symptom: "의심이 많아 눈동자가 흔들림, 갑작스러운 감정 폭발",
            desc: "겉으로는 조용해 보이지만, 속에는 끓어오르는 용암 같은 욕망과 의심을 품고 계신가요? 내 사람에 대한 소유욕이 강해 집착하거나, 한순간에 화산처럼 폭발하여 관계를 망칠 수 있습니다."
        },
        neural_code: {
            name: "순환 (Circulation)",
            desc: "내면의 뜨거운 에너지를 억누르지 않고, 여행이나 활동으로 건전하게 배출하는 것",
            action: "한곳에 머물지 마세요. 짐을 싸서 어디론가 떠나거나(역마), 새로운 배움을 시작하세요. 에너지가 흐르지 않고 고이면 마그마가 되어 당신을 태웁니다."
        },
        meta_code: {
            name: "풍요 (Abundance)",
            desc: "불을 품은 흙이 만물을 길러내듯, 잠재된 열정으로 놀라운 결실을 맺는 상태. 당신은 걸어 다니는 보물창고입니다."
        }
    },

    // 경오(庚午) 일주 - NEW BATCH_1
    GYEONG_O: {
        id: "ilju_gyeongo",
        title: "🦄 불 속에서 단련된 백마, 경오(庚午)일주",
        visual_token: "⚔️",
        color_code: "#F4F6F7",
        image_prompt: "A white horse running through flames, shining like polished steel",
        dark_code: {
            name: "결벽 (Perfectionism)",
            body_symptom: "피부가 예민하고 신경이 곤두섬, 옷에 얼룩 묻는 걸 못 참음",
            desc: "항상 단정하고 바르게 살아야 한다는 강박 때문에 숨이 막히시나요? 조금만 흐트러져도 견디지 못하고, 타인의 무례함을 보면 참지 못해 지적해야 직성이 풀리시나요? 당신은 지금 너무 팽팽하게 당겨진 활시위 같습니다."
        },
        neural_code: {
            name: "이완 (Relaxation)",
            desc: "뜨거운 불 속에서 쇠가 녹듯, 원칙을 내려놓고 부드러워지는 지혜",
            action: "오늘 하루, '망가짐'을 허락하세요. 흐트러진 옷을 입거나 늦잠을 자보세요. 당신이 부드러워질 때, 사람들은 당신의 날카로운 칼이 아닌 따뜻한 리더십을 따르게 됩니다."
        },
        meta_code: {
            name: "정화 (Purification)",
            desc: "불순물이 완전히 제거된 순수한 양심과 기개. 당신은 세상의 부정부패를 씻어내는 정의로운 검입니다."
        }
    },

    // 신미(辛未) 일주 - NEW BATCH_1
    SIN_MI: {
        id: "ilju_sinmi",
        title: "🌵 메마른 땅에 떨어진 바늘, 신미(辛未)일주",
        visual_token: "📌",
        color_code: "#E59866",
        image_prompt: "A sharp silver needle lying on dry desert sand",
        dark_code: {
            name: "예민 (Sharpness)",
            body_symptom: "입이 바짝 마르고 히스테리, 찌르는 듯한 말투",
            desc: "뜨겁고 건조한 땅(未) 위에 놓인 보석(辛)이라, 항상 목이 마르고 신경이 곤두서 있습니다. 내가 상처받지 않으려고 먼저 남을 찌르는 독설을 내뱉고 있지는 않나요? 당신의 날카로움은 사실 살려달라는 비명입니다."
        },
        neural_code: {
            name: "해갈 (Quenching)",
            desc: "메마른 감정에 물을 주어, 날카로운 바늘을 부드러운 붓으로 바꾸는 과정",
            action: "물을 많이 마시고, 수영이나 반신욕을 즐기세요. 논리적인 말싸움 대신 감성적인 영화 한 편을 보고 우세요. 물기(수분)가 채워지면 당신은 누구보다 섬세한 예술가가 됩니다."
        },
        meta_code: {
            name: "연금술 (Alchemy)",
            desc: "고통과 시련이라는 열기를 견뎌내고 탄생한 영롱한 사리. 당신의 아픔은 예술로 승화되어 세상을 위로합니다."
        }
    },

    // 임신(壬申) 일주 - NEW BATCH_1
    IM_SIN: {
        id: "ilju_imsin",
        title: "🌊 바위에서 솟아나는 거대한 물줄기, 임신(壬申)일주",
        visual_token: "🌊",
        color_code: "#21618C",
        image_prompt: "A massive waterfall cascading down from a high rocky cliff",
        dark_code: {
            name: "범람 (Flooding)",
            body_symptom: "생각이 너무 많아 머리가 무거움, 냉소적인 태도와 차가운 눈빛",
            desc: "머리가 너무 비상하여 남들이 발 아래로 보이고, 세상만사가 다 시시해 보이시나요? 끊임없이 솟아나는 생각 때문에 뇌가 쉴 틈이 없고, 자칫하면 자기만의 세계에 빠져 교만해질 수 있습니다."
        },
        neural_code: {
            name: "겸손 (Humility)",
            desc: "넘쳐흐르는 지식을 지혜로 바꾸어, 낮은 곳으로 흐르게 하는 미덕",
            action: "아는 체하고 싶을 때 입을 다무세요. 그리고 당신의 지식을 남을 가르치는 데 쓰지 말고, 남을 돕는 데(봉사) 쓰세요. 물은 낮은 곳으로 흐를 때 가장 넓은 바다가 됩니다."
        },
        meta_code: {
            name: "지혜 (Wisdom)",
            desc: "마르지 않는 생명수처럼 끊임없이 새로운 문명을 창조하는 원동력. 당신은 시대를 앞서가는 선지자입니다."
        }
    },

    // 계유(癸酉) 일주 - NEW BATCH_1
    GYE_YU: {
        id: "ilju_gyeyu",
        title: "💎 맑은 물에 씻긴 보석, 계유(癸酉)일주",
        visual_token: "💧",
        color_code: "#AED6F1",
        image_prompt: "Crystal clear water dripping onto a shiny gemstone",
        dark_code: {
            name: "결벽 (Cleanliness)",
            body_symptom: "차가운 손발, 남의 결점이 보이면 참지 못하고 잘라냄(손절)",
            desc: "너무 맑아서 물고기가 살 수 없는 물과 같습니다. 옳고 그름을 너무 따지느라 주변 사람들을 차갑게 내치고 있지는 않나요? 겉으로는 웃고 있어도 속은 얼음장처럼 차가워, 아무도 당신의 깊은 곳에 들어오지 못합니다."
        },
        neural_code: {
            name: "포용 (Embrace)",
            desc: "맑은 물에 흙탕물도 섞일 수 있음을 인정하고, 탁한 것을 끌어안는 자비",
            action: "완벽하지 않은 사람, 실수투성인 사람을 비난하지 말고 그냥 안아주세요. '그럴 수도 있지'라는 말이 당신을 따뜻하게 녹입니다. 당신의 차가운 지성에 온기가 더해질 때 기적이 일어납니다."
        },
        meta_code: {
            name: "거울 (Mirror)",
            desc: "세상의 모든 것을 있는 그대로 투영하는 맑고 투명한 영혼. 당신은 거짓을 비추어 진실을 드러내는 성스러운 거울입니다."
        }
    },

    // ===== BATCH_2 ENTRIES =====

    // 갑술(甲戌) 일주 - NEW BATCH_2
    GAP_SUL: {
        id: "ilju_gapsul",
        title: "🍂 가을 들판의 외로운 거목, 갑술(甲戌)일주",
        visual_token: "🌳",
        color_code: "#D35400",
        image_prompt: "A solitary tree standing on a dry autumn field at sunset",
        dark_code: {
            name: "고독 (Solitude)",
            body_symptom: "피부가 건조하고 목이 칼칼함, 군중 속에서도 느끼는 뼈저린 외로움",
            desc: "메마른 땅(戌) 위에 홀로 선 나무(甲)라, 아무리 사람들과 어울려도 채워지지 않는 근원적인 고독을 느끼시나요? 내가 다 짊어져야 한다는 가장의 무게감 때문에 어깨가 항상 무겁습니다."
        },
        neural_code: {
            name: "독립 (Independence)",
            desc: "타인의 인정이나 도움을 바라지 않고, 고독을 성장의 시간으로 즐기는 태도",
            action: "외로움을 피하려고 억지로 모임에 나가지 마세요. 오히려 혼자만의 시간을 갖고 책을 읽거나 명상을 하세요. 당신의 뿌리는 고독 속에서 더 깊고 단단하게 내려갑니다."
        },
        meta_code: {
            name: "수호자 (Guardian)",
            desc: "황량한 들판을 지키는 등대처럼, 힘든 사람들에게 그늘을 내어주는 영적인 리더. 당신의 고독은 누군가의 쉼터가 됩니다."
        }
    },

    // 을해(乙亥) 일주 - NEW BATCH_2
    EUL_HAE: {
        id: "ilju_eulhae",
        title: "🌊 물 위에 떠다니는 연꽃, 을해(乙亥)일주",
        visual_token: "🪷",
        color_code: "#5DADE2",
        image_prompt: "A beautiful lotus flower floating on a deep blue ocean",
        dark_code: {
            name: "방랑 (Drifting)",
            body_symptom: "발이 땅에 닿지 않는 부유감, 쉽게 붓고 냉증이 있음",
            desc: "한곳에 정착하지 못하고 마음이 늘 둥둥 떠다니는 기분인가요? 낯선 환경에 잘 적응하지만, 내 집이 없는 것 같은 불안감 때문에 끊임없이 무언가를 찾아 헤매고 계신가요?"
        },
        neural_code: {
            name: "유연성 (Flexibility)",
            desc: "정착하려 애쓰지 않고, 흐르는 물결에 몸을 맡기는 자유로운 삶의 방식",
            action: "계획대로 안 된다고 불안해하지 마세요. '어디로 가든 길이다'라고 생각하고 여행하듯 사세요. 당신은 땅에 뿌리내리는 나무가 아니라, 물 위를 여행하는 꽃입니다."
        },
        meta_code: {
            name: "정화 (Purification)",
            desc: "더러운 물을 맑게 정화하며 피어나는 연꽃. 당신이 가는 곳마다 탁한 기운이 씻겨나가고 평화가 찾아옵니다."
        }
    },

    // 병자(丙子) 일주 - NEW BATCH_2
    BYEONG_JA: {
        id: "ilju_byeongja",
        title: "🌑 한밤중에 뜬 태양, 병자(丙子)일주",
        visual_token: "🌞",
        color_code: "#8E44AD",
        image_prompt: "A glowing sun reflected on a dark midnight lake",
        dark_code: {
            name: "양면성 (Duality)",
            body_symptom: "조울증처럼 기분 기복이 심함, 심장은 뜨겁고 아랫배는 차가움",
            desc: "겉으로는 세상 밝고 명랑해 보이지만, 혼자 있을 때는 깊은 우울감에 빠지시나요? 빛(丙)과 어둠(子)이 공존하고 있어, 남들은 모르는 내면의 갈등과 불안이 심합니다."
        },
        neural_code: {
            name: "조율 (Tuning)",
            desc: "빛과 어둠을 싸우게 두지 않고, 두 에너지를 예술적으로 섞는 창조력",
            action: "우울함이 찾아오면 억지로 밝은 척하지 마세요. 그 어둠을 이용해 글을 쓰거나 창작을 하세요. 당신의 우울은 가장 훌륭한 예술적 재료입니다."
        },
        meta_code: {
            name: "고귀함 (Nobility)",
            desc: "어둠 속에서도 길을 잃지 않고 만물을 비추는 성스러운 빛. 당신은 밤바다의 등대입니다."
        }
    },

    // 정축(丁丑) 일주 - NEW BATCH_2
    JEONG_CHUK: {
        id: "ilju_jeongchuk",
        title: "🏮 창고 속을 비추는 등불, 정축(丁丑)일주",
        visual_token: "🕯️",
        color_code: "#D4AC0D",
        image_prompt: "A warm lantern illuminating a hidden treasure chest in a cave",
        dark_code: {
            name: "비관 (Pessimism)",
            body_symptom: "속이 자주 쓰리고 소화 불량, 가슴에 화가 쌓여 답답함",
            desc: "재능은 많은데 세상이 알아주지 않는 것 같아 억울하신가요? 꽁꽁 얼어붙은 땅(丑) 위에 촛불(丁) 하나 켜고 있는 형상이라, 현실이 춥고 외롭게 느껴져 자꾸만 안으로 숨고 싶어집니다."
        },
        neural_code: {
            name: "발굴 (Excavation)",
            desc: "숨겨진 재능을 묵묵히 갈고닦아, 결국 세상 밖으로 꺼내놓는 장인정신",
            action: "남들이 보든 말든 당신의 작업실(창고)에서 묵묵히 무언가를 만드세요. 당신의 불꽃은 화려한 불꽃놀이가 아니라, 쇠를 녹이는 용접 불꽃입니다. 결과물로 증명하세요."
        },
        meta_code: {
            name: "예술 (Artistry)",
            desc: "어둠 속에서 피어난 가장 아름다운 영혼의 빛. 당신의 고뇌가 예술이 되어 사람들의 영혼을 울립니다."
        }
    },

    // 무인(戊寅) 일주 - NEW BATCH_2
    MU_IN: {
        id: "ilju_muin",
        title: "🐯 호랑이가 사는 거대한 산, 무인(戊寅)일주",
        visual_token: "⛰️",
        color_code: "#1B4F72",
        image_prompt: "A majestic tiger standing on top of a high mountain peak",
        dark_code: {
            name: "위압 (Intimidation)",
            body_symptom: "목과 어깨가 항상 긴장되어 있음, 남들이 나를 어려워함",
            desc: "가만히 있어도 사람들이 나를 무서워하거나 어려워하나요? 거대한 산에 호랑이까지 있으니 다가가기 힘든 카리스마가 있습니다. 본의 아니게 고립되거나 독선적으로 변할 수 있습니다."
        },
        neural_code: {
            name: "수양 (Cultivation)",
            desc: "거친 야성을 다스리고, 산을 깎아 사람들이 오갈 수 있는 길을 내는 덕",
            action: "힘을 빼고 먼저 웃어주세요. 당신이 먼저 '안녕하세요'라고 부드럽게 말 걸어줄 때, 사람들은 비로소 당신이라는 산에 안기러 옵니다. 강함보다 부드러움이 당신을 살립니다."
        },
        meta_code: {
            name: "군주 (Monarch)",
            desc: "모든 생명을 품고 기르는 웅장한 태산. 당신의 존재감만으로도 세상의 질서가 잡힙니다."
        }
    },

    // 기묘(己卯) 일주 - NEW BATCH_2
    GI_MYO: {
        id: "ilju_gimyo",
        title: "🌾 들판을 뛰어다니는 토끼, 기묘(己卯)일주",
        visual_token: "🐇",
        color_code: "#ABEBC6",
        image_prompt: "A rabbit running across a green field full of crops",
        dark_code: {
            name: "예민 (Sensitivity)",
            body_symptom: "신경성 위염, 작은 일에도 소스라치게 놀람, 스트레스에 취약함",
            desc: "겉으로는 유순해 보이지만 속은 늘 긴장 상태이신가요? 밭(己)에 심은 작물(卯)이 다칠까 봐 노심초사하는 농부처럼, 작은 변화에도 예민하게 반응하고 걱정을 사서 하고 있습니다."
        },
        neural_code: {
            name: "가꿈 (Gardening)",
            desc: "불안해하는 대신, 내 영역(밭)을 예쁘게 가꾸는 데 집중하는 몰입",
            action: "걱정이 들 때마다 손을 움직이세요. 청소, 요리, 식물 키우기 등 내 주변을 정리하세요. 당신의 손길이 닿는 곳마다 질서와 아름다움이 피어날 때 불안은 사라집니다."
        },
        meta_code: {
            name: "치유 (Healing)",
            desc: "척박한 땅을 비옥한 정원으로 바꾸는 생명의 손길. 당신은 사람들의 마음 밭을 경작하는 치유사입니다."
        }
    },

    // 경진(庚辰) 일주 - NEW BATCH_2
    GYEONG_JIN: {
        id: "ilju_gyeongjin",
        title: "🐉 바위를 뚫고 나오는 용, 경진(庚辰)일주",
        visual_token: "🗡️",
        color_code: "#85929E",
        image_prompt: "A silver dragon holding a sword emerging from a rock",
        dark_code: {
            name: "투쟁 (Conflict)",
            body_symptom: "근육이 단단하게 뭉침, 욱하는 성질과 함께 폭력적인 언행",
            desc: "자신감이 넘치다 못해 오만해 보일 수 있습니다. '나를 따르라'는 강한 리더십이 있지만, 뜻대로 안 되면 불같이 화를 내고 주변을 초토화시킵니다. 당신의 칼이 아군을 베고 있지는 않나요?"
        },
        neural_code: {
            name: "수련 (Discipline)",
            desc: "거친 원석을 갈고닦아 명검을 만드는 인내의 시간",
            action: "화가 날 때 10번을 세세요. 당신의 에너지는 핵폭탄급이라 잘못 쓰면 파괴가 되지만, 잘 쓰면 세상을 구합니다. 힘자랑하지 말고 약자를 보호하는 데 그 힘을 쓰세요."
        },
        meta_code: {
            name: "개혁 (Reform)",
            desc: "낡은 세상을 단칼에 베어내고 정의를 세우는 위대한 장군. 당신은 난세의 영웅입니다."
        }
    },

    // 신사(辛巳) 일주 V2 - NEW BATCH_2 FORMAT
    SIN_SA_V2: {
        id: "ilju_sinsa_v2",
        title: "✨ 용광로 속에서 빛나는 보석, 신사(辛巳)일주",
        visual_token: "💎",
        color_code: "#D5D8DC",
        image_prompt: "A glowing diamond floating inside a mystical furnace",
        dark_code: {
            name: "자기학대 (Self-Torment)",
            body_symptom: "피부가 예민하고 편두통이 잦음, 가슴에 열이 차올라 숨이 얕아짐",
            desc: "뜨거운 불길(巳)이 예리한 보석(辛)을 계속 달구고 있어, '이 정도로는 부족해'라며 스스로를 끝없이 채찍질하고 계신가요? 당신의 예민함은 남을 향한 게 아니라, 완벽하지 못한 자신을 찌르는 칼날입니다."
        },
        neural_code: {
            name: "냉각 (Cooling)",
            desc: "뜨거운 열기를 식혀줄 '휴식'과 '수용'의 에너지를 받아들이는 것",
            action: "지금 당장 하던 일을 멈추고 차가운 물 한 잔을 마시세요. 그리고 거울을 보며 '이만하면 충분해'라고 말하세요. 당신에게 필요한 건 더 완벽해지는 노력이 아니라 열기를 식혀줄 휴식입니다."
        },
        meta_code: {
            name: "광채 (Radiance)",
            desc: "제련이 끝난 보석이 스스로 빛을 내뿜어 어둠을 몰아내는 상태. 이제 당신은 누구의 인정도 필요 없는, 그 자체로 완벽한 빛입니다."
        }
    },

    // 임오(壬午) 일주 - NEW BATCH_2
    IM_O: {
        id: "ilju_imo",
        title: "🎠 호수 위에 비친 달빛과 흑마, 임오(壬午)일주",
        visual_token: "🌗",
        color_code: "#283747",
        image_prompt: "A black horse running on water reflecting the moon",
        dark_code: {
            name: "변덕 (Caprice)",
            body_symptom: "감정이 롤러코스터를 탐, 쉽게 달아올랐다 쉽게 식음",
            desc: "물(壬)과 불(午)이 만나 끊임없이 끓어오르는 형상입니다. 매력적이고 다재다능하지만, 변덕이 심해 한 가지 일을 꾸준히 하지 못하고 마무리가 약합니다. 스스로도 자기 마음을 모를 때가 많습니다."
        },
        neural_code: {
            name: "균형 (Balance)",
            desc: "물과 불의 에너지를 조절하여, 폭발적인 추진력으로 승화시키는 지혜",
            action: "즉흥적으로 결정하지 말고, 하루만 더 생각하세요. 당신의 뜨거운 열정과 차가운 지성이 조화를 이룰 때, 당신은 불가능을 가능으로 만드는 연금술사가 됩니다."
        },
        meta_code: {
            name: "신비 (Mysticism)",
            desc: "음과 양이 하나로 합쳐져 새로운 우주를 창조하는 신비로운 힘. 당신은 영감의 원천입니다."
        }
    },

    // 계미(癸未) 일주 - NEW BATCH_2
    GYE_MI: {
        id: "ilju_gyemi",
        title: "🌧️ 메마른 정원에 내리는 단비, 계미(癸未)일주",
        visual_token: "☂️",
        color_code: "#5499C7",
        image_prompt: "Soft rain falling on a dry, thirsty garden",
        dark_code: {
            name: "소심 (Timidity)",
            body_symptom: "일어나지 않은 일을 미리 걱정함, 남의 눈치를 보느라 목소리가 작음",
            desc: "뜨거운 흙(未)에 스며드는 빗물(癸)이라, 항상 수분이 부족하고 갈증을 느낍니다. 남을 배려하느라 정작 내 속은 타들어가고, 싫은 소리 한마디 못 하고 속앓이만 하고 계신가요?"
        },
        neural_code: {
            name: "자애 (Self-Love)",
            desc: "남을 적시는 희생을 멈추고, 나 자신을 먼저 촉촉하게 채우는 사랑",
            action: "오늘 하루, 아무도 챙기지 마세요. 오직 당신만을 위해 맛있는 것을 먹고 좋은 옷을 입으세요. 당신이 충분히 채워져야 세상에 내릴 비도 생깁니다."
        },
        meta_code: {
            name: "생명수 (Living Water)",
            desc: "죽어가는 생명을 살리는 기적의 치유 에너지. 당신의 존재는 세상의 가뭄을 해결하는 단비입니다."
        }
    },

    // ===== BATCH_3 ENTRIES =====

    // 갑신(甲申) 일주 - NEW BATCH_3
    GAP_SIN: {
        id: "ilju_gapsin",
        title: "🪨 바위 절벽에 뿌리 내린 소나무, 갑신(甲申)일주",
        visual_token: "🌲",
        color_code: "#1E8449",
        image_prompt: "A resilient pine tree growing on a steep rocky cliff",
        dark_code: {
            name: "불안정 (Instability)",
            body_symptom: "편두통, 어깨와 목의 만성 통증, 항상 긴장해서 쥐가 잘 남",
            desc: "흙이 아닌 바위(申) 위에 뿌리를 내리느라 삶이 늘 위태롭고 고단하게 느껴지시나요? 한 곳에 정착하지 못하고, 내가 짤리거나 버려질까 봐 미리 선수 쳐서 이동하거나 일을 벌이고 계신가요?"
        },
        neural_code: {
            name: "적응력 (Adaptability)",
            desc: "척박한 환경을 탓하지 않고, 바위를 뚫고 들어가는 강인한 생존력",
            action: "환경이 바뀌는 것을 두려워하지 마세요. 당신은 온실 속의 화초가 아니라, 절벽에서도 살아남는 독야청청한 소나무입니다. 지금 겪는 시련은 당신을 더 단단하게 만드는 훈련일 뿐입니다."
        },
        meta_code: {
            name: "절개 (Integrity)",
            desc: "어떤 고난에도 굴하지 않고 푸르게 빛나는 고고한 기상. 당신은 세상을 내려다보는 고독한 리더입니다."
        }
    },

    // 을유(乙酉) 일주 - NEW BATCH_3
    EUL_YU: {
        id: "ilju_eulyu",
        title: "⚔️ 칼날 위에서 피어난 꽃, 을유(乙酉)일주",
        visual_token: "🌹",
        color_code: "#884EA0",
        image_prompt: "A delicate flower blooming on top of a sharp silver sword",
        dark_code: {
            name: "자학 (Self-Harm)",
            body_symptom: "신경통, 온몸이 쑤시고 아픔, 예민해서 잠을 깊게 못 잠",
            desc: "바위도 모자라 날카로운 칼(酉) 위에 앉은 꽃(乙)이라, 가만히 있어도 발이 베이는 듯한 통증을 느낍니다. 내가 다치기 싫어서 남들에게 가시 돋친 말을 내뱉거나, 반대로 스스로를 너무 괴롭히고 있지 않나요?"
        },
        neural_code: {
            name: "생존 (Survival)",
            desc: "강한 칼날조차 휘감고 올라가는 부드러움의 승리",
            action: "강한 것과 싸우려 하지 말고, 부드럽게 감싸 안으세요. 당신의 무기는 '힘'이 아니라 '유연함'입니다. 고통을 예술이나 기술로 승화시킬 때, 당신은 바위를 뚫는 꽃이 됩니다."
        },
        meta_code: {
            name: "강인함 (Resilience)",
            desc: "베이고 잘려나가도 다시 자라나는 불멸의 생명력. 당신은 세상에서 가장 강한 꽃입니다."
        }
    },

    // 병술(丙戌) 일주 - NEW BATCH_3
    BYEONG_SUL: {
        id: "ilju_byeongsul",
        title: "🌇 산 너머로 저무는 석양, 병술(丙戌)일주",
        visual_token: "🌄",
        color_code: "#E67E22",
        image_prompt: "A magnificent sunset glowing over a lonely mountain peak",
        dark_code: {
            name: "허무 (Emptiness)",
            body_symptom: "가슴이 텅 빈 듯한 공허함, 갑작스러운 무기력증",
            desc: "해가 산으로 넘어가는 시간(戌)이라, 화려한 하루를 보내고 집에 돌아오면 밀려오는 짙은 허무함을 감당하기 힘드신가요? 겉으로는 밝고 명랑하지만, 속으로는 '인생 뭐 있나'라는 생각에 깊은 고독을 느낍니다."
        },
        neural_code: {
            name: "여운 (Afterglow)",
            desc: "사라지는 것을 슬퍼하지 않고, 아름다운 여운으로 남기는 예술적 감성",
            action: "그 공허함을 사람으로 채우려 하지 말고, 창작으로 채우세요. 글을 쓰거나 그림을 그리세요. 당신의 쓸쓸함은 사람들의 심금을 울리는 최고의 예술이 됩니다."
        },
        meta_code: {
            name: "헌신 (Sacrifice)",
            desc: "자신을 태워 마지막까지 세상을 붉게 물들이는 숭고한 사랑. 당신은 어둠이 오기 전 세상을 위로하는 마지막 빛입니다."
        }
    },

    // 정해(丁亥) 일주 - NEW BATCH_3
    JEONG_HAE: {
        id: "ilju_jeonghae",
        title: "🛶 밤바다를 비추는 등불, 정해(丁亥)일주",
        visual_token: "✨",
        color_code: "#F1C40F",
        image_prompt: "A glowing lantern floating gently on the dark ocean",
        dark_code: {
            name: "불안 (Fragility)",
            body_symptom: "심장이 두근거리고 깜짝깜짝 놀람, 시력 저하",
            desc: "망망대해(亥) 위에 떠 있는 촛불(丁)이라, 파도가 조금만 쳐도 꺼질까 봐 늘 조마조마합니다. 타고난 영감이 뛰어나지만, 그 예민함 때문에 현실 세계가 너무 거칠고 두렵게 느껴질 수 있습니다."
        },
        neural_code: {
            name: "인도 (Guidance)",
            desc: "어둠 속에서도 길을 잃지 않는 제3의 눈, 영적인 나침반",
            action: "두려움이 밀려올 때 눈을 감고 내면의 빛에 집중하세요. 당신은 약해 보이지만, 어둠 속에서 길을 찾는 유일한 빛입니다. 당신의 직관을 믿고 나아가세요."
        },
        meta_code: {
            name: "성광 (Starlight)",
            desc: "가장 어두운 곳에서 가장 밝게 빛나는 별. 당신은 길 잃은 영혼들을 집으로 인도하는 등대입니다."
        }
    },

    // 무자(戊子) 일주 - NEW BATCH_3
    MU_JA: {
        id: "ilju_muja",
        title: "⛰️ 비밀을 간직한 호수 품은 산, 무자(戊子)일주",
        visual_token: "💰",
        color_code: "#566573",
        image_prompt: "A misty mountain hiding a deep, clear lake full of treasures",
        dark_code: {
            name: "탐욕 (Greed)",
            body_symptom: "소화 불량, 돈에 대한 집착으로 인한 긴장성 두통",
            desc: "산속 깊은 곳에 물(재물)을 숨겨둔 형상이라, 남모르는 욕심과 비밀이 많습니다. 겉으로는 점잖아 보이지만, 속으로는 계산기를 두드리느라 바쁘지 않나요? 너무 움켜쥐려고만 하면 사람이 떠납니다."
        },
        neural_code: {
            name: "신용 (Credit)",
            desc: "욕심을 신뢰로 바꾸어, 사람들이 믿고 맡길 수 있는 듬직한 관리자",
            action: "당신의 비밀 중 하나를 공개하거나, 가진 것을 조금 베푸세요. 산이 물을 흘려보내야 숲이 삽니다. 당신이 투명해질 때 더 큰 부가 찾아옵니다."
        },
        meta_code: {
            name: "저수지 (Reservoir)",
            desc: "가뭄이 들어도 마르지 않는 생명수. 당신은 세상의 목마름을 해결해 줄 거대한 부의 그릇입니다."
        }
    },

    // 기축(己丑) 일주 V2 - NEW BATCH_3 FORMAT
    GI_CHUK_V2: {
        id: "ilju_gichuk_v2",
        title: "❄️ 겨울을 견디는 언 땅, 기축(己丑)일주",
        visual_token: "🚜",
        color_code: "#808B96",
        image_prompt: "A frozen field covered in snow, waiting for spring",
        dark_code: {
            name: "고립 (Isolation)",
            body_symptom: "손발이 차갑고 관절염, 마음의 문을 닫아버린 냉담함",
            desc: "꽁꽁 얼어붙은 논밭이라, 누구도 들어올 수 없게 마음의 벽을 쌓고 혼자 견디고 계신가요? 묵묵히 일은 잘하지만, '어차피 인생은 혼자야'라는 생각에 주변을 차갑게 대하고 있을 수 있습니다."
        },
        neural_code: {
            name: "인내 (Endurance)",
            desc: "봄이 오기를 기다리며 땅속의 씨앗을 지키는 끈기",
            action: "지금 당장 성과가 없다고 실망하지 마세요. 당신은 대기만성형입니다. 언 땅을 녹이는 건 당신의 따뜻한 말 한마디입니다. 먼저 인사하고 먼저 웃으세요."
        },
        meta_code: {
            name: "기반 (Foundation)",
            desc: "모든 건물을 지탱하는 단단한 기초. 당신의 묵묵한 희생 덕분에 세상이 무너지지 않고 서 있습니다."
        }
    },

    // 경인(庚寅) 일주 - NEW BATCH_3
    GYEONG_IN: {
        id: "ilju_gyeongin",
        title: "🐅 숲속을 포효하는 백호, 경인(庚寅)일주",
        visual_token: "⚡",
        color_code: "#F5B7B1",
        image_prompt: "A white tiger roaring in a dense green forest with lightning",
        dark_code: {
            name: "독단 (Dogmatism)",
            body_symptom: "목에 핏대가 서고 혈압 상승, 욱하는 성질을 참지 못함",
            desc: "도끼로 나무를 찍어버리는 강한 에너지입니다. 내 뜻대로 안 되면 다 엎어버리고 싶고, 타협보다는 힘으로 제압하려 하시나요? 당신의 정의감은 훌륭하지만, 지나친 강함은 부러지기 쉽습니다."
        },
        neural_code: {
            name: "정의 (Justice)",
            desc: "사사로운 감정이 아닌, 공공의 이익을 위해 칼을 드는 영웅의 마음",
            action: "힘을 쓰기 전에 3번 심호흡하세요. 당신의 칼은 사람을 베는 게 아니라, 썩은 환부를 도려내는 수술칼이어야 합니다. 약자를 위해 싸울 때 당신은 진정한 리더가 됩니다."
        },
        meta_code: {
            name: "개척 (Pioneering)",
            desc: "아무도 가지 않은 길을 가장 먼저 뚫고 나가는 선구자. 당신의 발자국이 곧 길이 됩니다."
        }
    },

    // 신묘(辛卯) 일주 - NEW BATCH_3
    SIN_MYO: {
        id: "ilju_sinmyo",
        title: "✂️ 풀밭에 떨어진 예리한 가위, 신묘(辛卯)일주",
        visual_token: "🧶",
        color_code: "#A9DFBF",
        image_prompt: "Shiny silver scissors lying on soft green grass",
        dark_code: {
            name: "강박 (Obsession)",
            body_symptom: "신경쇠약, 편두통, 정리 정돈에 집착함",
            desc: "보석이 흙이 아닌 풀(卯) 위에 있어 불안정합니다. 그래서 끊임없이 주변을 정리하고, 남의 결점을 찾아내어 잘라내려 합니다. 예민한 신경줄이 팽팽하게 당겨져 있어 언제 끊어질지 모릅니다."
        },
        neural_code: {
            name: "정밀 (Precision)",
            desc: "날카로움을 파괴가 아닌, 디테일을 살리는 섬세한 기술로 승화",
            action: "비판하고 싶을 때 그 에너지를 '분석'이나 '디자인'에 쓰세요. 남을 지적하는 대신 당신의 작품을 다듬으세요. 당신의 꼼꼼함은 명품을 만드는 장인의 손길입니다."
        },
        meta_code: {
            name: "세련 (Refinement)",
            desc: "거친 원석을 깎아 최고의 보석으로 만드는 미적 감각. 당신의 손끝에서 세상은 더 아름다워집니다."
        }
    },

    // 임진(壬辰) 일주 - NEW BATCH_3
    IM_JIN: {
        id: "ilju_imjin",
        title: "🐉 승천하는 흑룡, 임진(壬辰)일주",
        visual_token: "🌊",
        color_code: "#1A5276",
        image_prompt: "A dark blue dragon rising from a stormy ocean causing a tsunami",
        dark_code: {
            name: "폭주 (Outburst)",
            body_symptom: "주체할 수 없는 에너지 과잉, 불면증, 분노 조절 장애",
            desc: "거대한 물의 감옥(괴강)에 갇힌 용입니다. 평소에는 과묵하지만, 한 번 화가 나면 쓰나미처럼 모든 것을 쓸어버리는 파괴력이 있습니다. 당신의 에너지는 너무 거대해서 스스로도 감당하기 힘들 때가 있습니다."
        },
        neural_code: {
            name: "비전 (Vision)",
            desc: "파괴적인 에너지를 큰 목표를 향한 추진력으로 바꾸는 배포",
            action: "작은 일에 목숨 걸지 마세요. 당신은 큰물에서 놀아야 합니다. 시시비비를 가리는 대신, 원대한 꿈(프로젝트)에 에너지를 쏟아붓으세요. 용은 개울가에서 싸우지 않습니다."
        },
        meta_code: {
            name: "창조 (Creation)",
            desc: "혼돈 속에서 새로운 세상을 빚어내는 태초의 에너지. 당신의 힘은 세상을 뒤집는 혁명의 파도입니다."
        }
    },

    // 계사(癸巳) 일주 - NEW BATCH_3
    GYE_SA: {
        id: "ilju_gyesa",
        title: "🌈 아지랑이 피어오르는 봄비, 계사(癸巳)일주",
        visual_token: "☁️",
        color_code: "#D7BDE2",
        image_prompt: "Soft mist rising from a warm ground forming a rainbow",
        dark_code: {
            name: "변덕 (Moodiness)",
            body_symptom: "이명, 어지럼증, 기분이 안개처럼 수시로 바뀜",
            desc: "비가 내리자마자 증발해 버리는 안개와 같습니다. 감수성이 풍부하고 천재적이지만, 끈기가 부족하고 싫증을 잘 냅니다. 잡힐 듯 잡히지 않는 당신의 마음 때문에 주변 사람들이 혼란스러워합니다."
        },
        neural_code: {
            name: "감성 (Sensibility)",
            desc: "변화무쌍함을 무기가 아닌 매력으로, 타인의 마음을 적시는 공감 능력",
            action: "당신의 변덕을 '다양성'으로 인정하세요. 한 가지 길만 고집하지 말고, 다양한 모습을 보여주세요. 당신은 형태가 없는 물이기에 어떤 그릇에도 담길 수 있습니다."
        },
        meta_code: {
            name: "분위기 (Atmosphere)",
            desc: "존재만으로 공간의 공기를 바꾸는 신비로운 아우라. 당신은 메마른 세상에 무지개를 띄우는 마법사입니다."
        }
    },

    // ===== BATCH_4 ENTRIES =====

    // 갑오(甲午) 일주 - NEW BATCH_4
    GAP_O: {
        id: "ilju_gapo",
        title: "🐎 불타오르는 들판의 청마, 갑오(甲午)일주",
        visual_token: "🔥",
        color_code: "#E74C3C",
        image_prompt: "A blue horse galloping through a field of burning red flowers",
        dark_code: {
            name: "탈진 (Burnout)",
            body_symptom: "얼굴이 붉어지고 숨이 가쁨, 급한 성격으로 인한 심장 압박감",
            desc: "자신을 태워서 꽃을 피우는 형상이라 열정이 넘치지만, 브레이크가 없어 재가 될 때까지 달립니다. '빨리빨리'가 안 되면 화를 내고, 남들에게 독설을 퍼부은 뒤 혼자 탈진해버리지는 않나요?"
        },
        neural_code: {
            name: "표현 (Expression)",
            desc: "내면의 폭발적인 에너지를 말과 예술로 시원하게 배출하는 것",
            action: "참지 말고 표현하세요. 단, 화를 내는 대신 노래를 부르거나, 춤을 추거나, 발표를 하세요. 당신은 무대 체질입니다. 에너지를 밖으로 쇼맨십 있게 분출할 때 운이 풀립니다."
        },
        meta_code: {
            name: "헌신 (Devotion)",
            desc: "자신의 몸을 태워 세상을 밝히는 등불. 당신의 열정은 어둠 속에 있는 사람들에게 희망의 불씨를 옮겨줍니다."
        }
    },

    // 을미(乙未) 일주 - NEW BATCH_4
    EUL_MI: {
        id: "ilju_eulmi",
        title: "🌵 사막에서도 꽃피우는 선인장, 을미(乙未)일주",
        visual_token: "🏜️",
        color_code: "#D4AC0D",
        image_prompt: "A green cactus blooming with pink flowers in a hot desert",
        dark_code: {
            name: "고난 (Hardship)",
            body_symptom: "피부가 건조하고 목이 탐, 신경성 위장병, 만성 피로",
            desc: "뜨겁고 메마른 땅(未)에 뿌리내린 탓에 삶이 고단하고 늘 목마릅니다. 살아남기 위해 안간힘을 쓰느라 예민해졌고, 나도 모르게 가시 돋친 말을 하거나 잔소리가 많아졌을 수 있습니다."
        },
        neural_code: {
            name: "생존 (Survival)",
            desc: "최악의 환경을 탓하지 않고, 그 안에서 기어코 꽃을 피워내는 생명력",
            action: "환경을 탓하지 마세요. 당신은 물 한 방울 없는 곳에서도 살아남는 기적의 존재입니다. 지금 겪는 시련은 당신을 죽이는 게 아니라, 더 깊고 단단한 뿌리를 내리게 하는 훈련입니다."
        },
        meta_code: {
            name: "인내 (Endurance)",
            desc: "모든 고통을 견뎌내고 마침내 피워낸 생명의 신비. 당신의 삶 자체가 위대한 승리의 증거입니다."
        }
    },

    // 병신(丙申) 일주 - NEW BATCH_4
    BYEONG_SIN: {
        id: "ilju_byeongsin",
        title: "🌇 도시를 비추는 화려한 석양, 병신(丙申)일주",
        visual_token: "🌆",
        color_code: "#F39C12",
        image_prompt: "Golden sunset reflecting on a modern glass city skyline",
        dark_code: {
            name: "허세 (Vanity)",
            body_symptom: "겉으로는 웃지만 속은 공허함, 남의 시선을 의식해 씀씀이가 헤픔",
            desc: "화려한 조명 아래 있고 싶고, 남들에게 인정받지 못하면 우울해지시나요? 재주가 너무 많아 이것저것 벌려놓지만, 실속 없이 겉만 번지르르할 수 있습니다. 화려함 뒤에 오는 짙은 고독을 두려워하지 마세요."
        },
        neural_code: {
            name: "다재다능 (Versatility)",
            desc: "여러 가지 재능을 융합하여 현실적인 결과물(돈, 성과)로 만들어내는 연금술",
            action: "보여주기 위한 일이 아니라, 진짜 '결과'가 남는 일에 집중하세요. 당신의 천재적인 두뇌와 끼를 현실 감각(申)과 연결할 때, 당신은 부와 명예를 다 거머쥘 수 있습니다."
        },
        meta_code: {
            name: "광명 (Radiance)",
            desc: "해가 지기 직전 온 세상을 황금빛으로 물들이는 찬란함. 당신은 세상에 영감을 주는 뮤즈입니다."
        }
    },

    // 정유(丁酉) 일주 - NEW BATCH_4
    JEONG_YU: {
        id: "ilju_jeongyu",
        title: "💎 별빛 아래 빛나는 보석, 정유(丁酉)일주",
        visual_token: "💍",
        color_code: "#E6B0AA",
        image_prompt: "A perfectly cut ruby glowing under the starlight",
        dark_code: {
            name: "집착 (Obsession)",
            body_symptom: "시력이 약하고 밤에 잠을 못 이룸, 작은 흠집도 견디지 못하는 결벽증",
            desc: "너무나 섬세하고 예리해서, 남들이 무심코 던진 말에도 심장이 베이는 듯 아픕니다. 상처받지 않으려고 날카롭게 반응하거나, 완벽함에 집착하여 스스로를 볶아치고 있지는 않나요?"
        },
        neural_code: {
            name: "심미안 (Aesthetic)",
            desc: "예민함을 신경질이 아닌, 보이지 않는 아름다움을 발견하는 예술적 눈으로 승화",
            action: "당신의 예민함을 무기가 아닌 '도구'로 쓰세요. 촛불로 쇠를 녹여 귀금속을 만들듯, 당신의 집중력을 디테일한 작업에 쏟으세요. 당신의 손끝에서 명품이 탄생합니다."
        },
        meta_code: {
            name: "성광 (Starlight)",
            desc: "어두운 밤하늘을 수놓는 별처럼, 차갑지만 가장 순수한 영혼의 빛. 당신은 어둠 속의 이정표입니다."
        }
    },

    // 무술(戊戌) 일주 - NEW BATCH_4
    MU_SUL: {
        id: "ilju_musul",
        title: "⛰️ 첩첩산중의 거대한 바위산, 무술(戊戌)일주",
        visual_token: "🏔️",
        color_code: "#5D4037",
        image_prompt: "Massive rocky mountains stretching endlessly under a gray sky",
        dark_code: {
            name: "고립 (Isolation)",
            body_symptom: "몸이 굳고 융통성이 없음, 고집이 세서 남의 말을 튕겨냄",
            desc: "산 넘어 산이라, 속을 알 수 없고 타협을 모르는 옹고집이 있습니다. '내가 법이다'라는 생각으로 주변을 통제하려다 보면, 결국 아무도 없는 산꼭대기에 홀로 남게 됩니다. 당신의 고독은 자초한 것일 수 있습니다."
        },
        neural_code: {
            name: "신의 (Faith)",
            desc: "한번 뱉은 말은 목숨을 걸고 지키는 무거움과 우직함",
            action: "고집을 꺾고 먼저 손을 내미세요. 당신이 마음의 빗장을 열고 사람들을 품어줄 때, 당신은 단순한 돌덩이가 아니라 만물이 깃들어 사는 영산(靈山)이 됩니다. 포용이 곧 힘입니다."
        },
        meta_code: {
            name: "수호 (Guardianship)",
            desc: "세상의 풍파를 온몸으로 막아주는 든든한 방패. 당신은 믿음 하나로 세상을 지탱하는 기둥입니다."
        }
    },

    // 기해(己亥) 일주 - NEW BATCH_4
    GI_HAE: {
        id: "ilju_gihae",
        title: "🌊 바다 밑의 부드러운 흙, 기해(己亥)일주",
        visual_token: "🏖️",
        color_code: "#2E86C1",
        image_prompt: "Soft sand under clear shallow ocean water",
        dark_code: {
            name: "혼란 (Confusion)",
            body_symptom: "생각이 너무 많아 결정 장애, 겉과 속이 달라서 오는 내적 갈등",
            desc: "물속의 흙이라 형체가 불분명합니다. 겉으로는 웃고 맞춰주지만 속으로는 딴생각을 하거나, 내 진짜 모습을 들킬까 봐 전전긍긍하시나요? 중심을 잡지 못하고 이리저리 휩쓸리기 쉽습니다."
        },
        neural_code: {
            name: "적응 (Adaptability)",
            desc: "어떤 그릇에도 담기는 물처럼, 상황에 맞춰 유연하게 대처하는 처세술",
            action: "당신의 이중성을 죄책감 갖지 말고 '다양성'으로 받아들이세요. 겉과 속이 다른 게 아니라, 상황에 맞는 가면을 잘 쓰는 능력자일 뿐입니다. 그 유연함으로 사람과 사람을 연결하세요."
        },
        meta_code: {
            name: "포용 (Embrace)",
            desc: "모든 것을 받아들여 생명을 키워내는 비옥한 갯벌. 당신의 품 안에서 수많은 가능성이 자라납니다."
        }
    },

    // 경자(庚子) 일주 - NEW BATCH_4
    GYEONG_JA: {
        id: "ilju_gyeongja",
        title: "🗡️ 차가운 물에 씻긴 칼, 경자(庚子)일주",
        visual_token: "❄️",
        color_code: "#D6EAF8",
        image_prompt: "A sharp steel sword being washed in an icy waterfall",
        dark_code: {
            name: "냉소 (Cynicism)",
            body_symptom: "몸이 차갑고 대화 중 표정이 굳음, 말로 상대의 뼈를 때림",
            desc: "너무 맑고 차가워서 곁에 사람이 없습니다. 남들의 멍청한 실수나 모순이 보이면 참지 못하고 날카롭게 지적해야 직성이 풀리시나요? 당신의 정의로운 비판이 때로는 사랑하는 사람의 마음을 베는 칼이 됩니다."
        },
        neural_code: {
            name: "청명 (Clarity)",
            desc: "사사로운 감정을 배제하고, 논리적이고 명쾌하게 본질을 꿰뚫는 힘",
            action: "비판하기 전에 '이 말이 저 사람에게 도움이 될까?' 한 번만 생각하세요. 그리고 칼날을 밖이 아닌 당신의 내면을 닦는 데 쓰세요. 당신의 말이 따뜻해질 때, 세상은 당신의 지혜를 경청합니다."
        },
        meta_code: {
            name: "공명 (Resonance)",
            desc: "진리를 깨우는 종소리처럼, 맑은 울림으로 세상을 깨우는 소리. 당신은 잠든 영혼을 깨우는 자명종입니다."
        }
    },

    // 신축(辛丑) 일주 - NEW BATCH_4
    SIN_CHUK: {
        id: "ilju_sinchuk",
        title: "🌾 얼어붙은 땅속의 씨앗, 신축(辛丑)일주",
        visual_token: "🌱",
        color_code: "#85929E",
        image_prompt: "A shiny seed buried deep inside frozen soil waiting for spring",
        dark_code: {
            name: "비관 (Pessimism)",
            body_symptom: "속이 냉하고 소화 불량, 과거의 상처를 곱씹으며 우울해함",
            desc: "차디찬 동토(丑) 속에 묻힌 보석(辛)이라, 아무리 노력해도 세상이 나를 알아주지 않는 것 같아 서러우신가요? 과거의 아픈 기억을 창고에 저장해 두고 꺼내 보며 스스로를 괴롭히고 있지는 않나요?"
        },
        neural_code: {
            name: "숙성 (Maturation)",
            desc: "어둠 속에서 묵묵히 실력을 갈고닦아, 때가 되었을 때 폭발시키는 잠재력",
            action: "과거를 파먹지 말고 미래를 준비하세요. 지금 당신이 겪는 고난은 당신을 더 단단한 다이아몬드로 만드는 압력입니다. 묵묵히 버티세요. 봄은 반드시 옵니다."
        },
        meta_code: {
            name: "보물 (Treasure)",
            desc: "진흙 속에서도 빛을 잃지 않는 고귀한 진주. 당신의 가치는 시련 속에서 증명됩니다."
        }
    },

    // 임인(壬寅) 일주 - NEW BATCH_4
    IM_IN: {
        id: "ilju_imin",
        title: "🐯 숲을 가로지르는 큰 강, 임인(壬寅)일주",
        visual_token: "🏞️",
        color_code: "#1ABC9C",
        image_prompt: "A wide blue river flowing through a vibrant green jungle",
        dark_code: {
            name: "방관 (Spectating)",
            body_symptom: "현실 감각 저하, 실천은 안 하고 머리로만 시뮬레이션 돌림",
            desc: "똑똒하고 어질지만, 생각이 너무 많아 실행력이 떨어집니다. '언젠간 잘 되겠지'라며 흐르는 물처럼 대책 없이 낙관하거나, 힘든 일을 피해 요리조리 도망 다니고 있지는 않나요?"
        },
        neural_code: {
            name: "양육 (Nurturing)",
            desc: "지혜의 물로 생명(나무)을 길러내고, 아이디어를 현실로 만드는 기획력",
            action: "생각을 멈추고 저지르세요. 당신은 물을 주기만 하면 쑥쑥 자라는 나무(寅)를 깔고 앉아 있습니다. 당신의 지혜가 행동으로 이어질 때, 거대한 숲이 탄생합니다."
        },
        meta_code: {
            name: "지혜 (Wisdom)",
            desc: "만물을 살리는 생명의 강. 당신이 흐르는 곳마다 메마른 땅이 옥토로 변합니다."
        }
    },

    // 계묘(癸卯) 일주 - NEW BATCH_4
    GYE_MYO: {
        id: "ilju_gyemyo",
        title: "🌿 풀잎에 맺힌 아침 이슬, 계묘(癸卯)일주",
        visual_token: "💧",
        color_code: "#AED6F1",
        image_prompt: "Morning dew drops sparkling on fresh green grass leaves",
        dark_code: {
            name: "유약 (Fragility)",
            body_symptom: "작은 스트레스에도 몸이 아픔, 의지박약, 현실 도피",
            desc: "너무 맑고 순수해서 거친 세상을 견디기 힘드신가요? 힘든 일이 생기면 숨어버리고 싶고, 누군가 나를 대신 지켜줬으면 하는 의존심이 들 수 있습니다. 이슬은 아름답지만 금방 사라질까 두렵습니다."
        },
        neural_code: {
            name: "심미 (Aesthetic)",
            desc: "섬세한 감수성으로 세상을 아름답게 꾸미고 치유하는 예술성",
            action: "당신의 약함을 부끄러워하지 마세요. 당신의 섬세함은 세상의 삭막함을 적시는 단비입니다. 예술, 요리, 가꾸기 등 당신의 손길로 주변을 아름답게 만드세요. 그것이 당신의 힘입니다."
        },
        meta_code: {
            name: "순수 (Purity)",
            desc: "세상의 때가 묻지 않은 태초의 맑음. 당신은 영혼을 정화하는 성수(Holy Water)입니다."
        }
    },

    // ===== MISSING ILJUS (누락 일주 보완) =====

    // 을묘(乙卯) 일주 - MISSING
    EUL_MYO: {
        id: "ilju_eulmyo",
        title: "🌿 들판을 뒤덮는 푸른 넝쿨, 을묘(乙卯)일주",
        visual_token: "🌱",
        color_code: "#2ECC71",
        image_prompt: "Green vines rapidly covering a wall with vibrant life",
        dark_code: {
            name: "집착 (Tenacity)",
            body_symptom: "손발 저림, 신경 예민, 질투심에 밤잠을 설침",
            desc: "바람이 불면 눕지만 절대 꺾이지 않는 잡초 같은 끈기가 있습니다. 하지만 그 끈기가 '집착'으로 변하면, 주변 사람을 숨 막히게 옥죄거나 경쟁심에 불타 스스로를 태워버릴 수 있습니다. 이기고 싶어 안달이 나셨나요?"
        },
        neural_code: {
            name: "상생 (Symbiosis)",
            desc: "혼자 돋보이려 하지 않고, 숲의 일부가 되어 함께 자라는 지혜",
            action: "옆 사람을 경쟁자가 아니라 '내 지지대'라고 생각하세요. 나무를 감고 올라가는 넝쿨처럼, 타인의 성공에 편승하고 협력하세요. 함께할 때 당신의 생명력은 무한히 확장됩니다."
        },
        meta_code: {
            name: "활력 (Vitality)",
            desc: "겨울을 이겨내고 온 세상을 초록으로 물들이는 봄의 생명력. 당신은 희망 그 자체입니다."
        }
    },

    // 병진(丙辰) 일주 - MISSING
    BYEONG_JIN: {
        id: "ilju_byeongjin",
        title: "🌥️ 구름 사이로 비치는 햇살, 병진(丙辰)일주",
        visual_token: "🌤️",
        color_code: "#F39C12",
        image_prompt: "Sunlight beaming through majestic clouds over a damp valley",
        dark_code: {
            name: "변덕 (Fickleness)",
            body_symptom: "습진, 피부 트러블, 기분이 좋았다가 급격히 우울해짐",
            desc: "하늘에는 태양(丙), 땅에는 습한 흙(辰)이 있어 밝음과 어두움이 교차합니다. 겉으로는 화려해 보이지만 속으로는 말 못 할 고민이 많고, 감정 기복이 심해 주변 사람들이 당신의 눈치를 살피게 만듭니다."
        },
        neural_code: {
            name: "자비 (Mercy)",
            desc: "자신의 감정을 솔직하게 인정하고, 습한 마음을 햇살로 말리는 과정",
            action: "우울해질 때 숨지 말고 햇볕을 쬐러 나가세요. 그리고 당신의 따뜻한 에너지로 사람들을 먹이고 입히세요(봉사). 당신은 만물을 기르는 태양입니다. 베풀수록 우울함은 사라집니다."
        },
        meta_code: {
            name: "양육 (Nurturing)",
            desc: "모든 생명을 차별 없이 비추고 기르는 위대한 어머니. 당신의 빛 아래서 만물이 자라납니다."
        }
    },

    // 정사(丁巳) 일주 - MISSING
    JEONG_SA: {
        id: "ilju_jeongsa",
        title: "🔥 활활 타오르는 횃불, 정사(丁巳)일주",
        visual_token: "🧨",
        color_code: "#E74C3C",
        image_prompt: "A blazing torch illuminating a dark cave with intense light",
        dark_code: {
            name: "고란 (Loneliness)",
            body_symptom: "심장 박동이 빠름, 화병, 독한 말로 상처 주고 후회함",
            desc: "불 위에서 또 불이 타오르니 열정이 지나쳐 폭주하기 쉽습니다. 내 마음을 몰라주면 욱하는 성질을 참지 못해 관계를 끊어버리고, 결국 잿더미 위에 혼자 남아 외로워하고 있지는 않나요?"
        },
        neural_code: {
            name: "조절 (Regulation)",
            desc: "파괴적인 불길을 다스려, 어둠을 밝히는 문명의 빛으로 쓰는 힘",
            action: "말하기 전에 3초만 멈추세요. 당신의 언어는 레이저 같습니다. 그 예리함을 남을 비난하는 데 쓰지 말고, 본질을 꿰뚫어 보는 '통찰'에 쓰세요. 당신은 시대를 밝히는 선구자입니다."
        },
        meta_code: {
            name: "광명 (Enlightenment)",
            desc: "스스로 타올라 세상의 무지를 태워버리는 지혜의 등불. 당신은 영적인 지도자입니다."
        }
    },

    // 무오(戊午) 일주 - MISSING
    MU_O: {
        id: "ilju_muo",
        title: "🌋 마그마가 끓는 화산, 무오(戊午)일주",
        visual_token: "🌋",
        color_code: "#C0392B",
        image_prompt: "A dormant volcano with red lava glowing in the crater",
        dark_code: {
            name: "독단 (Self-Will)",
            body_symptom: "변비, 혈압 상승, 남의 말을 전혀 듣지 않는 귀막힘",
            desc: "겉은 흙이지만 속은 불덩어리인 화산입니다. 고집이 세고 주관이 너무 뚜렷해서 타협을 모릅니다. '나를 따르라'고 외치지만, 정작 사람들과 소통하지 않아 고립된 제왕처럼 살 수 있습니다."
        },
        neural_code: {
            name: "수양 (Discipline)",
            desc: "뜨거운 열기를 식혀서 비옥한 화산재(거름)로 만드는 인격 수양",
            action: "책을 읽거나 명상을 하여 내면의 불을 끄세요. 그리고 힘자랑 대신 덕을 베푸세요. 화산이 폭발하지 않고 온천이 될 때, 사람들은 당신에게 치유받으러 모여듭니다."
        },
        meta_code: {
            name: "성산 (Sacred Mountain)",
            desc: "신비로운 힘을 간직한 영산. 당신의 깊은 내공은 세상을 정화하는 힘이 됩니다."
        }
    },

    // 경신(庚申) 일주 - MISSING
    GYEONG_SIN: {
        id: "ilju_gyeongsin",
        title: "🔨 단단한 강철 바위, 경신(庚申)일주",
        visual_token: "🛡️",
        color_code: "#566573",
        image_prompt: "A massive iron monolith standing untouched for centuries",
        dark_code: {
            name: "냉혹 (Ruthlessness)",
            body_symptom: "관절통, 근육 경직, 한번 돌아서면 피도 눈물도 없음",
            desc: "하늘과 땅이 모두 쇠(Metal)로 된 가장 강력한 에너지입니다. 의리가 있고 강인하지만, 융통성이 없어 적을 만들기 쉽습니다. 내 뜻대로 세상을 개조하려다 부러질 수 있으니 힘을 빼야 합니다."
        },
        neural_code: {
            name: "혁명 (Revolution)",
            desc: "파괴적인 힘을 세상을 뜯어고치는 개혁의 에너지로 승화",
            action: "당신의 힘을 약자를 억누르는 데 쓰지 말고, 불의와 싸우는 데 쓰세요. 강한 자에게 강하고 약한 자에게 약할 때, 당신은 존경받는 영웅이 됩니다."
        },
        meta_code: {
            name: "권위 (Authority)",
            desc: "흔들리지 않는 정의와 원칙의 상징. 당신은 세상을 바르게 세우는 척도입니다."
        }
    },

    // 임술(壬戌) 일주 - MISSING
    IM_SUL: {
        id: "ilju_imsul",
        title: "🌊 바다를 품은 거대한 산, 임술(壬戌)일주",
        visual_token: "🏝️",
        color_code: "#2E4053",
        image_prompt: "A vast ocean reservoir surrounded by high mountains at dusk",
        dark_code: {
            name: "고독 (Solitude)",
            body_symptom: "신장 방광 약함, 군중 속의 고독, 속마음을 알 수 없음",
            desc: "백호대살을 가진 괴강이라 에너지가 엄청납니다. 산속에 바다를 숨겨둔 형상이라 스케일이 크고 꿈이 원대하지만, 비밀이 많고 감정 기복이 심해 주변 사람들이 당신을 어려워할 수 있습니다."
        },
        neural_code: {
            name: "지혜 (Wisdom)",
            desc: "감정의 파도를 잠재우고, 깊은 물속의 지혜를 길어 올리는 영성",
            action: "마음을 가두지 말고 흐르게 하세요. 당신의 거대한 에너지를 종교, 철학, 사업 등 큰 그릇에 담으세요. 웅덩이에 머물지 말고 바다로 나아갈 때 당신의 운명이 풀립니다."
        },
        meta_code: {
            name: "대양 (Ocean)",
            desc: "모든 강물을 받아들이는 넓고 깊은 마음. 당신은 세상을 품는 거인입니다."
        }
    },

    // ===== BATCH_5 ENTRIES =====


    // 갑진(甲辰) 일주 - NEW BATCH_5
    GAP_JIN: {
        id: "ilju_gapjin",
        title: "🐉 비옥한 땅에 뿌리 내린 청룡, 갑진(甲辰)일주",
        visual_token: "🌲",
        color_code: "#117A65",
        image_prompt: "A giant tree growing rapidly on fertile land with a dragon coiled around",
        dark_code: {
            name: "독선 (Self-Righteousness)",
            body_symptom: "목이 뻣뻣하고 고혈압 주의, 남의 말을 들으면 속이 답답함",
            desc: "비옥한 땅(辰)에 뿌리를 깊게 내린 나무라, 자신감이 넘치다 못해 오만해지기 쉽습니다. '내가 제일 잘났어'라는 생각에 주변을 무시하거나, 성격이 급해 욱하는 기질(백호)로 관계를 망칠 수 있습니다."
        },
        neural_code: {
            name: "경영 (Management)",
            desc: "강한 추진력을 내 이익이 아닌, 숲 전체를 키우는 리더십으로 전환",
            action: "당신의 고집을 '뚝심'으로 바꾸세요. 남과 싸우는 데 힘을 쓰지 말고, 돈을 벌거나 프로젝트를 완성하는 현실적인 목표에 에너지를 쏟으세요. 당신은 숲을 지배하는 왕이 될 자질이 있습니다."
        },
        meta_code: {
            name: "개척 (Pioneering)",
            desc: "황무지를 개간하여 거대한 왕국을 건설하는 창조주. 당신의 손에서 새로운 문명이 시작됩니다."
        }
    },

    // 을사(乙巳) 일주 - NEW BATCH_5
    EUL_SA: {
        id: "ilju_eulsa",
        title: "🕊️ 바람 타고 날아가는 꽃씨, 을사(乙巳)일주",
        visual_token: "🌸",
        color_code: "#F1948A",
        image_prompt: "Flower petals dancing in the warm wind under the sun",
        dark_code: {
            name: "산만 (Distraction)",
            body_symptom: "말이 많아 입이 마름, 가만히 있지 못하고 손발을 계속 움직임",
            desc: "꽃이 활짝 피어 자신을 뽐내는 형상입니다. 남들에게 주목받고 싶어 안달이 나거나, 실속 없이 겉치장에만 신경 쓰고 있지는 않나요? 너무 가벼워서 바람 부는 대로 이리저리 휩쓸릴 수 있습니다."
        },
        neural_code: {
            name: "표현 (Expression)",
            desc: "관종 끼를 예술적 퍼포먼스나 말솜씨로 승화시키는 능력",
            action: "당신의 끼를 숨기지 마세요. 무대에 서거나, 방송을 하거나, 글을 쓰세요. 당신은 사람들에게 즐거움을 주기 위해 태어났습니다. 당신이 웃으면 세상도 웃습니다."
        },
        meta_code: {
            name: "자유 (Freedom)",
            desc: "어디에도 얽매이지 않고 세상을 여행하며 희망을 퍼트리는 파랑새. 당신은 자유 그 자체입니다."
        }
    },

    // 병오(丙午) 일주 - NEW BATCH_5
    BYEONG_O: {
        id: "ilju_byeongo",
        title: "☀️ 한낮의 뜨거운 태양, 병오(丙午)일주",
        visual_token: "🔥",
        color_code: "#C0392B",
        image_prompt: "A blazing sun at high noon with intense heat rays",
        dark_code: {
            name: "폭발 (Explosion)",
            body_symptom: "얼굴이 붉고 다혈질, 화가 나면 눈앞이 하얘짐",
            desc: "60갑자 중 가장 뜨거운 불덩어리입니다. 열정이 넘치지만, 참을성이 없어 한순간에 폭발하면 모든 것을 재로 만들어버립니다. '뒤끝은 없다'고 하지만, 이미 주변 사람들은 당신의 불길에 화상을 입었습니다."
        },
        neural_code: {
            name: "지속 (Sustainment)",
            desc: "순간의 폭발력을 은근하게 오래가는 온기로 조절하는 힘",
            action: "화가 날 때 찬물을 마시고 '잠깐'을 외치세요. 당신의 에너지는 핵융합 발전소와 같습니다. 통제만 되면 세상을 비추는 거대한 빛이 되지만, 통제 못 하면 재앙이 됩니다."
        },
        meta_code: {
            name: "광명 (Illumination)",
            desc: "세상의 모든 어둠을 몰아내고 공평하게 비추는 절대적인 빛. 당신은 태양 같은 리더입니다."
        }
    },

    // 정미(丁未) 일주 - NEW BATCH_5
    JEONG_MI: {
        id: "ilju_jeongmi",
        title: "🏜️ 뜨거운 사막 위의 촛불, 정미(丁未)일주",
        visual_token: "🕯️",
        color_code: "#D68910",
        image_prompt: "A candle burning steadily in the middle of a hot red desert",
        dark_code: {
            name: "희생 (Sacrifice)",
            body_symptom: "속이 타들어가고 갈증, 화병으로 인한 가슴 통증",
            desc: "뜨거운 흙(未) 위에서 촛불(丁)을 켜고 기도하는 형상이라, 겉으로는 온화해 보이지만 속은 까맣게 타들어 가고 있습니다. 남을 위해 헌신하다가 배신당하거나, 억눌린 감정이 한 번에 터질 수 있습니다."
        },
        neural_code: {
            name: "승화 (Sublimation)",
            desc: "내면의 열기를 종교, 철학, 예술적 영감으로 바꾸는 연금술",
            action: "남을 챙기기 전에 당신의 영혼부터 챙기세요. 명상이나 요가로 내면의 열기를 식히세요. 당신의 타는 목마름은 진리를 찾는 원동력입니다."
        },
        meta_code: {
            name: "인도 (Guidance)",
            desc: "어두운 사막길을 밝혀주는 영적인 등대. 당신의 헌신은 헛되지 않고 별처럼 빛나게 됩니다."
        }
    },

    // 무신(戊申) 일주 - NEW BATCH_5
    MU_SIN: {
        id: "ilju_musin",
        title: "🚂 철로가 깔린 거대한 산, 무신(戊申)일주",
        visual_token: "🛤️",
        color_code: "#707B7C",
        image_prompt: "A mountain with a railway track leading to a bustling city",
        dark_code: {
            name: "고독 (Solitude)",
            body_symptom: "소화 불량, 군중 속에서도 느끼는 쓸쓸함",
            desc: "산속에 묻힌 광물(申)이라 재능은 많지만, 누가 캐주지 않으면 묻혀버릴까 봐 불안합니다. 겉으로는 뚝심 있어 보이지만, 속으로는 사람을 그리워하며 끊임없이 인정받고 싶어 합니다."
        },
        neural_code: {
            name: "연결 (Connection)",
            desc: "고립된 산이 아니라, 사람들이 오가는 길을 내어 소통하는 개방성",
            action: "당신의 재능을 혼자만 알지 말고 세상에 알리세요. SNS든 모임이든 밖으로 나가세요. 당신은 산이지만, 길이 뚫려 있어 누구나 찾아올 수 있는 '관광 명소'가 되어야 합니다."
        },
        meta_code: {
            name: "문명 (Civilization)",
            desc: "자연과 문명이 조화를 이루는 풍요로운 터전. 당신은 세상을 연결하는 다리입니다."
        }
    },

    // 기유(己酉) 일주 - NEW BATCH_5
    GI_YU: {
        id: "ilju_giyu",
        title: "🌾 가을 들판의 황금 닭, 기유(己酉)일주",
        visual_token: "🐓",
        color_code: "#F7DC6F",
        image_prompt: "A golden chicken walking on a harvest field filled with grain",
        dark_code: {
            name: "잔소리 (Nagging)",
            body_symptom: "입안이 헐거나 위산 과다, 예민해서 살이 잘 안 찜",
            desc: "비옥한 땅에 결실(酉)이 가득하니 먹을 복은 타고났지만, 너무 꼼꼼하고 계산적이라 피곤하게 삽니다. 남의 티끌만 한 실수도 그냥 넘기지 못하고 콕 집어내야 직성이 풀리시나요?"
        },
        neural_code: {
            name: "완성 (Completion)",
            desc: "예리한 눈썰미를 남을 지적하는 데 쓰지 않고, 내 일의 완성도를 높이는 데 쓰는 것",
            action: "입은 닫고 지갑을 여세요. 그리고 당신의 그 완벽주의를 '요리'나 '기술'에 쏟으세요. 당신의 손끝에서 만들어진 결과물은 타의 추종을 불허하는 명품이 됩니다."
        },
        meta_code: {
            name: "결실 (Harvest)",
            desc: "노력한 만큼 반드시 거두어들이는 풍요의 법칙. 당신은 사람들을 배불리 먹이는 대지의 어머니입니다."
        }
    },

    // 경술(庚戌) 일주 - NEW BATCH_5
    GYEONG_SUL: {
        id: "ilju_gyeongsul",
        title: "🛡️ 광산을 지키는 백구, 경술(庚戌)일주",
        visual_token: "⚔️",
        color_code: "#ABB2B9",
        image_prompt: "A white dog guarding a hidden mine full of gems",
        dark_code: {
            name: "투쟁 (Conflict)",
            body_symptom: "근육통, 피부 트러블, 타협을 모르는 강한 아집",
            desc: "괴강살의 기운을 타고나 자존심이 하늘을 찌릅니다. 한번 믿으면 끝까지 가지만, 한번 틀어지면 뒤도 안 돌아보는 냉혹함이 있습니다. '내 편 아니면 적'이라는 흑백논리가 당신을 외롭게 만듭니다."
        },
        neural_code: {
            name: "수호 (Protection)",
            desc: "사나운 투쟁심을 내 편을 지키는 든든한 방패로 바꾸는 의리",
            action: "싸우려 하지 말고 지키려 하세요. 당신의 강한 힘은 약자를 보호할 때 빛납니다. 운동이나 무도(수련)로 몸 안의 살기를 빼내면, 당신은 존경받는 리더가 됩니다."
        },
        meta_code: {
            name: "정의 (Justice)",
            desc: "불의를 보면 참지 않고 바로잡는 시대의 심판관. 당신은 정의를 수호하는 기사입니다."
        }
    },

    // 신해(辛亥) 일주 - NEW BATCH_5
    SIN_HAE: {
        id: "ilju_sinhae",
        title: "💍 맑은 물에 씻긴 보석, 신해(辛亥)일주",
        visual_token: "🧼",
        color_code: "#D4E6F1",
        image_prompt: "A diamond being washed in crystal clear flowing water",
        dark_code: {
            name: "허영 (Vanity)",
            body_symptom: "몸이 차갑고 신장 방광 주의, 겉치레에 신경 쓰느라 피곤함",
            desc: "물에 씻긴 보석이라 반짝반짝 빛나고 인기가 많습니다. 하지만 남들의 시선을 너무 의식해 허세를 부리거나, 차가운 말로 상대방에게 상처를 주고 돌아서서 후회할 수 있습니다."
        },
        neural_code: {
            name: "총명 (Brilliance)",
            desc: "뛰어난 언변과 지혜로 사람들을 가르치고 깨우치는 교육자적 자질",
            action: "당신의 말솜씨를 자랑하는 데 쓰지 말고, 지식을 나누는 데 쓰세요. 당신의 차가운 머리와 따뜻한 가슴이 만날 때, 당신은 세상을 정화하는 맑은 물이 됩니다."
        },
        meta_code: {
            name: "순수 (Purity)",
            desc: "티끌 하나 없이 맑고 투명한 영혼. 당신은 세상의 탁함을 씻어내는 정화수입니다."
        }
    },

    // 임자(壬子) 일주 - NEW BATCH_5
    IM_JA: {
        id: "ilju_imja",
        title: "🌊 끝을 알 수 없는 깊은 바다, 임자(壬子)일주",
        visual_token: "🐋",
        color_code: "#17202A",
        image_prompt: "Deep dark ocean at night with immense power underneath",
        dark_code: {
            name: "범람 (Overflow)",
            body_symptom: "우울증, 알코올 중독 주의, 속을 알 수 없는 음흉함(?)",
            desc: "위아래가 모두 큰물이라 에너지가 엄청납니다. 도량이 넓어 보이지만, 속에는 야망과 비밀이 가득합니다. 한 번 화가 나면 쓰나미처럼 덮치거나, 반대로 너무 깊은 우울의 바다로 침잠해 버릴 수 있습니다."
        },
        neural_code: {
            name: "지혜 (Wisdom)",
            desc: "깊은 바다속에 감춰진 무한한 잠재력과 세상을 품는 포용력",
            action: "고이지 말고 흐르세요. 혼자만의 생각에 갇히지 말고 세상 밖으로 나와 소통하세요. 당신의 에너지는 댐으로 막을 수 없습니다. 큰 목표를 향해 흐를 때 당신은 위대한 항해사가 됩니다."
        },
        meta_code: {
            name: "근원 (Source)",
            desc: "모든 생명이 태어나는 태초의 바다. 당신은 무한한 가능성의 원천입니다."
        }
    },

    // 계축(癸丑) 일주 - NEW BATCH_5
    GYE_CHUK: {
        id: "ilju_gyechuk",
        title: "❄️ 얼음장 밑으로 흐르는 물, 계축(癸丑)일주",
        visual_token: "🧊",
        color_code: "#2C3E50",
        image_prompt: "Cold water flowing silently underneath a thick layer of ice",
        dark_code: {
            name: "억압 (Suppression)",
            body_symptom: "몸이 잘 붓고 냉증, 분노를 참다가 홧병이 됨",
            desc: "백호대살을 품은 겨울비입니다. 겉으로는 조용하고 순종적으로 보이지만, 속에는 시퍼런 칼날(분노)을 숨기고 있습니다. 참고 참다가 한 번에 폭발하면 누구도 말릴 수 없습니다. 억누르면 병이 됩니다."
        },
        neural_code: {
            name: "인내 (Patience)",
            desc: "겨울을 견디고 봄을 기다리는 끈기, 장애물을 돌아가는 물의 지혜",
            action: "감정을 얼리지 말고 녹이세요. 따뜻한 말, 따뜻한 음식, 따뜻한 사람을 가까이하세요. 당신의 인내심은 세상 어떤 장애물도 뚫고 바다로 나가는 힘이 됩니다."
        },
        meta_code: {
            name: "생명 (Life)",
            desc: "죽은 땅을 살려내는 기적의 생명수. 당신의 희생 덕분에 세상에 봄이 옵니다."
        }
    },

    // ===== LEGACY ENTRIES (기존 일주 데이터 유지) =====


    // 신사(辛巳) 일주
    SIN_SA: {
        id: "ilju_sinsa",
        name: "신사",
        hanja: "辛巳",
        title: "✨ 용광로 속에서 빛나는 보석",
        keywords: ["#완벽주의", "#예리한_직관", "#외유내강", "#숨은_야망"],
        element: "금",
        yin_yang: "음",
        image_metaphor: "뜨거운 용광로(巳) 속에서 제련되고 있는 섬세한 보석(辛)",
        main_text: `신사(辛巳)일주는 '불 속에서 빛나는 보석'을 상징합니다.

섬세한 금속(辛)이 뱀의 불(巳) 위에 놓여 있는 형상으로, 외적으로는 부드러워 보이지만 내면에는 강한 야망과 집념을 품고 있습니다. 마치 보석이 고열의 제련 과정을 거쳐야 빛을 발하듯, 인생의 시련을 통해 더욱 빛나는 사람입니다.

💎 당신의 장점:
예리한 관찰력과 직관으로 상황을 정확히 파악합니다. 겉으로는 온화해 보이지만, 목표를 향한 집념은 누구보다 강합니다. 미적 감각이 뛰어나고, 세련된 취향을 가지고 있습니다.

🔥 주의할 점:
완벽주의 성향이 강해 스스로를 몰아붙이는 경향이 있습니다. 때로는 속마음을 드러내지 않아 오해를 받기도 합니다. 자신에게 좀 더 관대해질 필요가 있습니다.`,
        strengths: ["예리한 직관", "미적 감각", "집중력", "인내심", "전략적 사고"],
        weaknesses: ["완벽주의", "감정 억제", "섬세한 스트레스", "비밀주의"],
        career_fit: ["디자이너", "분석가", "변호사", "예술가", "컨설턴트", "주얼리/패션업"],
        relationship_style: "겉으로 표현하지 않지만 사랑하는 사람에게 깊은 헌신을 합니다. 신뢰를 쌓기까지 시간이 걸리지만, 한번 마음을 열면 진심을 다합니다.",
        health_warning: "폐와 대장이 약할 수 있습니다. 스트레스 관리와 호흡 운동이 도움됩니다.",
        lucky_elements: {
            color: "흰색, 금색",
            number: "4, 9",
            direction: "서쪽"
        }
    },

    // 병인(丙寅) 일주 - LEGACY
    BYEONG_IN: {
        id: "ilju_byeongin",
        name: "병인",
        hanja: "丙寅",
        title: "🔥 숲을 밝히는 태양",
        keywords: ["#카리스마", "#열정", "#정의감", "#당당함"],
        element: "화",
        yin_yang: "양",
        image_metaphor: "울창한 숲(寅) 위로 떠오르는 강렬한 태양(丙)",
        main_text: `병인(丙寅)일주는 '숲을 밝히는 태양'을 상징합니다.

밝은 태양(丙)이 호랑이의 숲(寅) 위에서 빛나는 형상으로, 타고난 카리스마와 열정을 가지고 있습니다. 어디를 가든 존재감이 드러나며, 주변 사람들에게 영감과 활력을 줍니다.

☀️ 당신의 장점:
밝고 따뜻한 에너지로 사람들을 끌어당깁니다. 정의감이 강하고, 약자를 보호하려는 의협심이 있습니다. 무엇이든 열정적으로 임하며, 그 열정이 주변에 전염됩니다.

🌙 주의할 점:
너무 강한 열정이 때로는 '과욕'이 될 수 있습니다. 다른 사람의 영역을 존중하고, 한 발 물러서서 기다리는 지혜가 필요합니다.`,
        strengths: ["카리스마", "강한 열정", "정의감", "리더십", "밝은 에너지"],
        weaknesses: ["과욕", "참을성 부족", "자기중심적", "번아웃 위험"],
        career_fit: ["연예인", "정치인", "사업가", "교육자", "스포츠 선수", "마케터"],
        relationship_style: "연애할 때도 뜨겁게 표현합니다. 자신의 매력을 잘 알고 있으며, 상대방에게 올인하는 스타일입니다.",
        health_warning: "심장과 소장에 주의가 필요합니다. 과로를 피하고 충분한 휴식을 취하세요.",
        lucky_elements: {
            color: "빨간색, 주황색",
            number: "2, 7",
            direction: "남쪽"
        }
    },

    // 임술(壬戌) 일주
    IM_SOOL: {
        id: "ilju_imsool",
        name: "임술",
        hanja: "壬戌",
        title: "🌊 산 위의 큰 호수",
        keywords: ["#지혜", "#포용력", "#고독", "#통찰력"],
        element: "수",
        yin_yang: "양",
        image_metaphor: "높은 산(戌) 위에 고요히 자리한 깊은 호수(壬)",
        main_text: `임술(壬戌)일주는 '산 위의 큰 호수'를 상징합니다.

큰 물(壬)이 개의 산(戌) 위에 있는 형상으로, 깊은 지혜와 통찰력을 가지고 있습니다. 겉으로는 고요해 보이지만, 그 안에는 방대한 지식과 감정의 바다가 있습니다.

🌊 당신의 장점:
남들이 보지 못하는 것을 꿰뚫어 봅니다. 어떤 상황에서도 냉정함을 잃지 않으며, 현명한 판단을 내립니다. 다양한 분야에 관심이 많고, 지적 호기심이 강합니다.

🏔️ 주의할 점:
너무 높은 곳에서 세상을 바라보다 보면 외로워질 수 있습니다. 가끔은 산에서 내려와 사람들과 어울리는 시간이 필요합니다.`,
        strengths: ["깊은 통찰력", "냉철한 판단", "지적 호기심", "포용력", "인내심"],
        weaknesses: ["고독감", "감정 표현 부족", "우유부단", "현실 도피"],
        career_fit: ["학자", "연구원", "철학자", "상담사", "작가", "종교인"],
        relationship_style: "마음을 여는 데 시간이 걸리지만, 한번 사랑에 빠지면 깊이 헌신합니다. 내면을 이해해주는 파트너를 원합니다.",
        health_warning: "신장과 방광에 주의가 필요합니다. 수분 섭취와 하체 운동이 도움됩니다.",
        lucky_elements: {
            color: "검은색, 파란색",
            number: "1, 6",
            direction: "북쪽"
        }
    },

    // 기축(己丑) 일주
    GI_CHUK: {
        id: "ilju_gichuk",
        name: "기축",
        hanja: "己丑",
        title: "🌍 비옥한 대지의 황소",
        keywords: ["#안정감", "#신뢰", "#끈기", "#소박함"],
        element: "토",
        yin_yang: "음",
        image_metaphor: "비옥한 논밭(己)에서 묵묵히 일하는 황소(丑)",
        main_text: `기축(己丑)일주는 '비옥한 대지의 황소'를 상징합니다.

부드러운 흙(己)이 소의 논밭(丑) 위에 있는 형상으로, 묵묵한 끈기와 안정감을 가지고 있습니다. 화려함보다 실속을 추구하며, 천천히 그러나 확실하게 목표를 향해 나아갑니다.

🌱 당신의 장점:
믿음직스러운 사람입니다. 한번 맡은 일은 끝까지 해내며, 주변 사람들에게 안정감을 줍니다. 물질적 풍요를 만드는 능력이 뛰어납니다.

🐂 주의할 점:
지나치게 보수적이 되지 않도록 주의하세요. 변화를 두려워하면 성장의 기회를 놓칠 수 있습니다.`,
        strengths: ["신뢰감", "끈기", "실용성", "안정감", "재물복"],
        weaknesses: ["보수적", "융통성 부족", "고집", "변화 거부"],
        career_fit: ["금융업", "부동산", "농업", "요리사", "회계사", "공무원"],
        relationship_style: "안정적인 관계를 원합니다. 급격한 감정 변화보다 꾸준한 애정 표현을 선호합니다.",
        health_warning: "위장과 비장에 주의가 필요합니다. 규칙적인 식사와 소화 관리가 중요합니다.",
        lucky_elements: {
            color: "노란색, 갈색",
            number: "5, 10",
            direction: "중앙"
        }
    }
};


// ============== 십성(十神) 데이터베이스 - ENHANCED VERSION ==============

export const TEN_GODS: Record<string, TenGodData> = {

    BIGYEON: {
        id: "ten_gods_bigyeon",
        name: "비견",
        hanja: "比肩",
        title: "🤝 나를 지키는 든든한 아군, 비견(比肩)",
        keywords: ["#주체성", "#독립심", "#경쟁", "#동료"],
        code_type: "Identity Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '비견(比肩)'은 나와 같은 존재, 어깨를 나란히 하는 동료의 에너지입니다.

비견은 강한 자존심과 독립심을 상징합니다. 남에게 지기 싫어하고, 홀로 서려는 의지가 강합니다.`,
        positive_traits: ["강한 자존심", "독립심", "경쟁력", "동료애", "끈기"],
        negative_traits: ["고집", "재물 손실", "갈등", "타협 어려움"],
        career_tendency: "프리랜서, 1인 기업, 스포츠 선수 등 개인 역량이 중요한 분야에서 성공합니다.",
        relationship_pattern: "평등한 관계를 원합니다. 상대방과 경쟁하거나 비교하는 경향이 있습니다.",
        coaching_approach: "자존감 강화와 협력의 가치 인식. 경쟁이 아닌 협동의 관점 제공.",
        dark_code: {
            name: "고립 (Isolation)",
            body_symptom: "어깨와 목이 뻣뻣하게 굳음, 타인의 조언이 소음처럼 들림",
            desc: "세상에 나 혼자뿐인 것 같고, 남들에게 지기 싫어서 억지로 버티고 계신가요? '내 방식이 아니면 안 돼'라고 고집을 부릴수록 외로움이라는 감옥에 갇히게 됩니다."
        },
        neural_code: {
            name: "주체성 (Independence)",
            desc: "남을 경쟁자가 아닌 동반자로 인식하고, 건강하게 홀로 서는 힘",
            action: "오늘 하루, '내가 맞다'는 생각을 내려놓고 친구나 동료의 의견에 무조건 '그럴 수도 있네'라고 맞장구쳐주세요."
        },
        meta_code: {
            name: "주권 (Sovereignty)",
            desc: "누구에게도 의존하지 않지만, 모든 사람과 연결되어 있는 완전한 자유인. 당신은 흔들리지 않는 산입니다."
        }
    },

    GEOPJAE: {
        id: "ten_gods_geopjae",
        name: "겁재",
        hanja: "劫財",
        title: "🔥 승부사의 심장, 겁재(劫財)",
        keywords: ["#승부욕", "#야망", "#대담함", "#반전매력"],
        code_type: "Ambition Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '겁재(劫財)'는 재물을 빼앗는다는 뜻으로, 강렬한 승부욕과 야망의 에너지입니다.

겁재는 한방을 노리는 대담함과 반전 매력을 상징합니다. 이기고 싶은 욕망이 강렬합니다.`,
        positive_traits: ["대담함", "승부욕", "반전 능력", "행동력", "결단력"],
        negative_traits: ["질투심", "재물 손실", "무리한 도전", "감정 기복"],
        career_tendency: "사업가, 투자자, 도박사, 스포츠 선수 등 하이리스크 하이리턴 분야에서 빛납니다.",
        relationship_pattern: "경쟁적인 관계를 즐깁니다. 상대방을 정복하려는 경향이 있습니다.",
        coaching_approach: "목표 설정과 도전 정신 자극. 승부욕을 긍정적으로 활용하도록 유도.",
        dark_code: {
            name: "질투 (Jealousy)",
            body_symptom: "속이 쓰리고 배가 아픔, 타인의 성공을 보면 화가 남",
            desc: "남의 것을 빼앗고 싶거나, 내 것을 뺏길까 봐 항상 긴장 상태이신가요? 강한 승부욕이 잘못된 방향으로 흐르면, 가진 것마저 잃게 됩니다."
        },
        neural_code: {
            name: "도약 (Leap)",
            desc: "질투심을 성장의 연료로 태워, 불가능한 목표에 도전하는 에너지",
            action: "당신이 질투하는 그 사람을 찾아가서 칭찬하거나, 밥을 한 끼 사세요. 경쟁자를 내 편으로 만드는 대담함이 당신의 그릇을 폭발적으로 키웁니다."
        },
        meta_code: {
            name: "혁명 (Revolution)",
            desc: "개인의 욕망을 넘어 세상을 뒤집고 새로운 질서를 만드는 영웅의 기백. 당신의 야망이 세상을 진보시킵니다."
        }
    },

    SIKSIN: {
        id: "ten_gods_siksin",
        name: "식신",
        hanja: "食神",
        title: "🎨 순수한 창조자, 식신(食神)",
        keywords: ["#표현력", "#먹을복", "#연구", "#순수함"],
        code_type: "Expression Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '식신(食神)'은 밥을 먹는 신이라는 뜻으로, 풍요롭고 순수한 창조의 에너지입니다.

식신은 먹을복, 표현력, 재능을 상징합니다. 순수한 열정으로 무언가에 몰입할 때 빛납니다.`,
        positive_traits: ["뛰어난 창의력", "예술적 감각", "먹을복", "유머", "순수함"],
        negative_traits: ["나태함", "게으름", "폭식", "현실 도피"],
        career_tendency: "예술가, 요리사, 연구원, 작가 등 창작과 연구 분야에서 성공합니다.",
        relationship_pattern: "평화로운 관계를 원합니다. 싸우기보다 편안함을 추구합니다.",
        coaching_approach: "창의성 자극과 순수한 동기 부여. 놀이처럼 접근하면 효과적.",
        dark_code: {
            name: "나태 (Laziness)",
            body_symptom: "몸이 물에 젖은 듯 무겁고, 계속 눕고 싶거나 폭식함",
            desc: "재능은 많은데 시작할 엄두가 안 나고, '좋은 게 좋은 거지'라며 현실에 안주하고 계신가요? 편안함에 중독되면 당신의 천재적인 창의성은 빛을 잃습니다."
        },
        neural_code: {
            name: "몰입 (Flow)",
            desc: "결과를 계산하지 않고, 순수한 즐거움으로 무언가에 미쳐있는 상태",
            action: "거창한 목표 대신, 오늘 당장 당신을 즐겁게 하는 작은 창작(요리, 낙서, 조립)을 하나 하세요. 당신이 웃으면서 할 때 운이 뚫립니다."
        },
        meta_code: {
            name: "천진난만 (Innocence)",
            desc: "아이처럼 삶을 놀이로 즐기며, 존재만으로 주변에 복을 나눠주는 상태. 당신은 세상의 요리사입니다."
        }
    },

    SANGGWAN: {
        id: "ten_gods_sanggwan",
        name: "상관",
        hanja: "傷官",
        title: "⚡ 낡은 틀을 깨는 천재, 상관(傷官)",
        keywords: ["#언변", "#개혁", "#순발력", "#비판적_사고"],
        code_type: "Revolution Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '상관(傷官)'은 관을 상하게 한다는 뜻으로, 권위에 도전하는 개혁의 에너지입니다.

상관은 뛰어난 언변, 날카로운 비판력, 창의적 파괴를 상징합니다. 기존 질서를 무너뜨리고 새것을 만듭니다.`,
        positive_traits: ["뛰어난 언변", "순발력", "창의성", "개혁 정신", "날카로운 지성"],
        negative_traits: ["반항심", "오만", "입화", "관재구설"],
        career_tendency: "변호사, 언론인, 혁신가, 코미디언 등 말과 기존 질서에 도전하는 분야에서 빛납니다.",
        relationship_pattern: "자극적인 관계를 원합니다. 가르치려 들거나 비판할 수 있습니다.",
        coaching_approach: "지적 자극과 논쟁. 틀을 깨는 질문을 던지면 효과적.",
        dark_code: {
            name: "오만 (Arrogance)",
            body_symptom: "말이 빨라지고 턱에 힘이 들어감, 상대의 말을 끊고 싶음",
            desc: "세상 모든 게 멍청해 보이고, 촌철살인으로 남을 찔러야 직성이 풀리시나요? 당신의 뛰어난 언변이 상처 입히는 흉기가 되고 있습니다."
        },
        neural_code: {
            name: "개혁 (Reform)",
            desc: "비판을 위한 비판이 아니라, 더 나은 세상을 만들기 위한 건설적인 제안",
            action: "지적하고 싶은 말이 목구멍까지 차오를 때 3초만 참으세요. 그리고 '어떻게 하면 우리가 더 좋아질까?'라고 부드럽게 제안하세요."
        },
        meta_code: {
            name: "변화 (Transformation)",
            desc: "낡고 썩은 것을 도려내고 새 생명을 불어넣는 치유의 힘. 당신의 말 한마디가 시대를 바꿉니다."
        }
    },

    PYEONJAE: {
        id: "ten_gods_pyeonjae",
        name: "편재",
        hanja: "偏財",
        title: "🌍 넓은 세상을 경영하는 사업가, 편재(偏財)",
        keywords: ["#사업수완", "#확장", "#유머", "#통제력"],
        code_type: "Business Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '편재(偏財)'는 편향된 재물로, 불로소득이나 사업으로 얻는 큰 돈의 에너지입니다.

편재는 넓은 시야, 사업 수완, 사교성을 상징합니다. 돈을 굴려서 돈을 버는 재능이 있습니다.`,
        positive_traits: ["사업 수완", "사교성", "넓은 시야", "유머", "대범함"],
        negative_traits: ["돈을 흩뿌림", "바람기", "한탕주의", "불안정"],
        career_tendency: "사업가, 무역상, 투자자, 마케터 등 돈을 굴리는 분야에서 성공합니다.",
        relationship_pattern: "다양한 이성과 교류합니다. 한 사람에게 정착하기 어려울 수 있습니다.",
        coaching_approach: "비전 제시와 확장 전략. 돈과 관계에 대한 가치관 정립.",
        dark_code: {
            name: "탐욕 (Greed)",
            body_symptom: "가슴이 두근거리고 조급함, 사람을 돈이나 도구로 보게 됨",
            desc: "한방을 노리며 무리한 확장을 하거나, 결과를 통제하려고 주변 사람들을 쥐잡듯이 잡고 계신가요? 돈을 쫓아다니면 돈은 더 빨리 도망갑니다."
        },
        neural_code: {
            name: "경영 (Management)",
            desc: "돈이 아니라 사람의 마음을 얻어, 더 큰 가치를 만들어내는 안목",
            action: "오늘 돈을 쓸 때 '아깝다'고 생각하지 말고 '이 돈이 저 사람을 행복하게 했으면 좋겠다'고 축복하며 쓰세요."
        },
        meta_code: {
            name: "풍요 (Abundance)",
            desc: "내가 가진 것을 나눌수록 더 채워지는 우주의 역설을 깨달은 상태. 당신은 흐르는 강물 같은 부자입니다."
        }
    },

    JEONGJAE: {
        id: "ten_gods_jeongjae",
        name: "정재",
        hanja: "正財",
        title: "🐜 성실함이 만든 황금성, 정재(正財)",
        keywords: ["#성실함", "#절약", "#꼼꼼함", "#신뢰"],
        code_type: "Manager Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '정재(正財)'는 바른 재물로, 땀 흘려 정직하게 번 돈의 에너지입니다.

정재는 성실함, 절약, 계획성을 상징합니다. 차곡차곡 쌓아 안정적인 부를 만듭니다.`,
        positive_traits: ["성실함", "절약 정신", "계획성", "신뢰성", "안정 추구"],
        negative_traits: ["인색함", "융통성 부족", "소심함", "변화 두려움"],
        career_tendency: "회계사, 은행원, 공무원, 관리자 등 안정적인 수입이 보장되는 분야에서 성공합니다.",
        relationship_pattern: "안정적인 관계를 원합니다. 경제적 조건을 중시합니다.",
        coaching_approach: "구체적인 숫자와 계획 제시. 안정감을 주면서 작은 변화 유도.",
        dark_code: {
            name: "인색 (Stinginess)",
            body_symptom: "몸이 뻣뻣하고 변비가 생김, 작은 손해에도 밤잠을 설침",
            desc: "100원 하나 틀리는 것도 용납 못 하고, 변화가 두려워 움켜쥐고만 계신가요? 너무 계산적인 태도는 당신의 그릇을 간장 종지만 하게 만듭니다."
        },
        neural_code: {
            name: "성실 (Diligence)",
            desc: "요행을 바라지 않고, 벽돌을 한 장씩 쌓아 올리는 꾸준함의 미학",
            action: "계산기를 내려놓고, 당신이 사랑하는 사람을 위해 '의미 없는' 작은 선물을 사보세요. 통제할 수 없는 기쁨을 느껴보세요."
        },
        meta_code: {
            name: "신뢰 (Trust)",
            desc: "세상 어떤 풍파에도 무너지지 않는 단단한 믿음의 성. 당신의 존재 자체가 사람들에게 안식처가 됩니다."
        }
    },

    PYEONGWAN: {
        id: "ten_gods_pyeongwan",
        name: "편관",
        hanja: "偏官",
        title: "⚔️ 난세의 영웅, 편관(偏官)",
        keywords: ["#카리스마", "#책임감", "#희생", "#권위"],
        code_type: "Authority Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '편관(偏官)'은 칠살(七殺)이라고도 불리며, 세상을 바꾸려는 개혁의 에너지입니다.

편관은 거친 환경을 헤쳐나가는 강인함, 카리스마, 책임감을 상징합니다.`,
        positive_traits: ["강한 결단력", "빠른 실행력", "도전정신", "위기 대처 능력", "리더십"],
        negative_traits: ["공격성", "조급함", "타협 어려움", "외로움"],
        career_tendency: "군인, 경찰, 변호사, 사업가, 스포츠 선수 등 경쟁이 치열한 분야에서 두각을 나타냅니다.",
        relationship_pattern: "연애에서도 주도적이며, 자신을 존중해주는 강한 파트너와 잘 맞습니다.",
        coaching_approach: "목표 지향적 코칭이 효과적. 구체적인 행동 계획과 성취감을 느낄 수 있는 미션 제공.",
        dark_code: {
            name: "강박 (Obsession)",
            body_symptom: "편두통, 어깨 결림, 항상 쫓기는 듯한 불안감",
            desc: "자신을 너무 혹사하고, 남들에게도 완벽함을 강요하고 있지 않나요? '내가 아니면 안 돼'라는 생각이 당신의 영혼을 갉아먹고 있습니다."
        },
        neural_code: {
            name: "책임 (Responsibility)",
            desc: "두려움을 용기로 바꾸어, 어려운 상황에서 앞장서는 리더십",
            action: "오늘 하루, 당신에게 주어진 짐 중 하나를 과감하게 내려놓거나 남에게 부탁하세요. 약한 모습을 보일 때 사람들은 당신의 인간미에 매료됩니다."
        },
        meta_code: {
            name: "위엄 (Majesty)",
            desc: "자신을 희생하여 대의를 지키는 숭고한 기사도 정신. 당신은 고통을 권위로 바꾸는 연금술사입니다."
        }
    },

    JEONGGWAN: {
        id: "ten_gods_jeonggwan",
        name: "정관",
        hanja: "正官",
        title: "⚖️ 바른 생활의 표본, 정관(正官)",
        keywords: ["#명예", "#원칙", "#합리성", "#안정"],
        code_type: "Honor Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '정관(正官)'은 바른 관직으로, 질서와 책임의 에너지입니다.

정관은 사회적 규범, 명예, 원칙을 상징합니다. 남에게 인정받고 싶은 욕구가 있습니다.`,
        positive_traits: ["책임감", "신뢰성", "도덕성", "계획성", "사회적 성공"],
        negative_traits: ["경직성", "체면 의식", "스트레스에 약함", "융통성 부족"],
        career_tendency: "공무원, 대기업, 법조계, 교육계 등 안정적이고 명예로운 직종에서 성공합니다.",
        relationship_pattern: "안정적이고 신뢰할 수 있는 관계를 원합니다. 사회적으로 인정받는 결혼을 중시합니다.",
        coaching_approach: "명확한 목표와 체계적인 로드맵 제공. 사회적 인정과 성취감을 연결.",
        dark_code: {
            name: "경직 (Rigidity)",
            body_symptom: "허리가 뻣뻣하고 소화 불량, 타인의 시선에 과민 반응",
            desc: "체면 때문에 하고 싶은 말을 참고, '남들이 어떻게 볼까' 눈치 보느라 인생을 낭비하고 계신가요? 규칙의 노예가 되지 마세요."
        },
        neural_code: {
            name: "원칙 (Principle)",
            desc: "타인의 시선 때문이 아니라, 나의 양심에 따라 행동하는 당당함",
            action: "오늘 딱 한 번, 소소한 일탈(넥타이 풀기, 길거리 음식 먹기)을 해보세요. 그리고 '이래도 괜찮네'라고 말하세요."
        },
        meta_code: {
            name: "명예 (Honor)",
            desc: "누가 보든 안 보든 한결같은 고결함. 당신은 세상의 기준이자 척도가 됩니다."
        }
    },

    PYEONIN: {
        id: "ten_gods_pyeonin",
        name: "편인",
        hanja: "偏印",
        title: "🔮 신비로운 직관, 편인(偏印)",
        keywords: ["#직관", "#의심", "#철학", "#비주류"],
        code_type: "Intuition Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '편인(偏印)'은 도식(倒食)이라고도 불리며, 비주류적 지혜와 직관의 에너지입니다.

편인은 독창성, 철학적 사고, 직관력을 상징합니다. 남들과 다른 시각으로 세상을 봅니다.`,
        positive_traits: ["직관력", "독창성", "철학적 사고", "신비로움", "탐구심"],
        negative_traits: ["의심", "고독", "현실 도피", "불안정"],
        career_tendency: "철학자, 예술가, 점술가, 연구원 등 비주류 분야에서 빛납니다.",
        relationship_pattern: "깊은 정신적 교류를 원합니다. 피상적인 관계는 피합니다.",
        coaching_approach: "철학적 질문과 통찰 제공. 현실과 이상의 균형 유도.",
        dark_code: {
            name: "망상 (Delusion)",
            body_symptom: "손발이 차갑고 불면증, 현실 감각이 없어 자주 부딪힘",
            desc: "혼자만의 생각에 갇혀 세상을 삐딱하게 보거나, 일어날 리 없는 일을 걱정하며 밤을 새우시나요? 당신의 뇌는 휴식이 필요합니다."
        },
        neural_code: {
            name: "통찰 (Insight)",
            desc: "남들이 보지 못하는 이면을 꿰뚫어 보고, 독창적인 해답을 내놓는 힘",
            action: "생각을 멈추고 몸을 쓰세요. 청소를 하거나 산책을 하세요. 머리를 비우고 몸을 움직일 때, 당신의 망상은 천재적인 아이디어로 바뀝니다."
        },
        meta_code: {
            name: "지혜 (Wisdom)",
            desc: "보이는 것 너머의 진실을 읽어내는 제3의 눈. 당신은 세상을 치유하는 영적 스승입니다."
        }
    },

    JEONGIN: {
        id: "ten_gods_jeongin",
        name: "정인",
        hanja: "正印",
        title: "📚 사랑받는 지혜, 정인(正印)",
        keywords: ["#수용", "#학문", "#자비", "#문서운"],
        code_type: "Wisdom Profile",
        main_text: `당신의 사주에서 강하게 작용하는 '정인(正印)'은 바른 도장으로, 정통 지혜와 어머니의 사랑 같은 에너지입니다.

정인은 학습 능력, 배려심, 수용력을 상징합니다. 남을 돌보려는 본능이 있습니다.`,
        positive_traits: ["높은 학습 능력", "지적 호기심", "배려심", "인내심", "전문성"],
        negative_traits: ["우유부단", "의존성", "비현실적", "행동력 부족"],
        career_tendency: "학자, 교육자, 연구원, 의사, 상담사 등 전문 지식이 필요한 분야에서 성공합니다.",
        relationship_pattern: "정서적 교감을 중시합니다. 자신을 이해해주고 성장시켜주는 파트너를 원합니다.",
        coaching_approach: "깊은 대화와 통찰 제공. 지적 자극과 성찰 유도.",
        dark_code: {
            name: "의존 (Dependence)",
            body_symptom: "쉽게 피로해지고 어리광 부리고 싶음, 결정 장애",
            desc: "받는 것에만 익숙해져서 스스로 결정하지 못하고 누군가에게 기대려 하시나요? 당신은 영원히 자라지 않는 아이로 남게 됩니다."
        },
        neural_code: {
            name: "수용 (Acceptance)",
            desc: "배운 것을 내 안에서 소화하여, 타인에게 베풀고 가르치는 성숙함",
            action: "오늘 당신이 배운 지식이나 받은 도움을, 반드시 다른 사람에게 전달하세요. 고인 물을 흘려보낼 때 더 맑은 물이 채워집니다."
        },
        meta_code: {
            name: "자비 (Compassion)",
            desc: "조건 없는 어머니의 사랑으로 세상을 품는 마음. 당신의 지혜는 머리가 아니라 가슴에서 나옵니다."
        }
    }
};

// ============== 십이운성(十二運星) 데이터베이스 - MULTIDIMENSIONAL ==============

export interface TwelveStarData {
    id: string;
    name: string;
    hanja: string;
    title: string;
    keywords: string[];
    stage_type: string;
    energy_level: number; // 1-12 에너지 레벨
    main_text: string;
    dark_code: {
        name: string;
        body_symptom: string;
        desc: string;
    };
    neural_code: {
        name: string;
        desc: string;
        action: string;
    };
    meta_code: {
        name: string;
        desc: string;
    };
}

export const TWELVE_STARS: Record<string, TwelveStarData> = {

    JANGSEANG: {
        id: "twelve_stars_jangseang",
        name: "장생",
        hanja: "長生",
        title: "🌱 생명의 시작, 장생(長生)",
        keywords: ["#시작", "#탄생", "#희망", "#가능성"],
        stage_type: "Birth Cycle",
        energy_level: 7,
        main_text: `장생(長生)은 생명이 막 태어나는 단계입니다. 새로운 시작, 무한한 가능성, 성장의 에너지를 상징합니다.

이 운성이 강하면 낙천적이고 희망적이며, 새로운 일을 시작하는 능력이 뛰어납니다.`,
        dark_code: {
            name: "미숙 (Immaturity)",
            body_symptom: "불안정하고 의존적, 작은 실패에도 쉽게 좌절함",
            desc: "새로운 시작이 두렵고, 경험이 없어 불안하신가요? 아직 어린 싹처럼 연약하지만, 그것이 바로 성장의 출발점입니다."
        },
        neural_code: {
            name: "시작의 용기 (Initiation)",
            desc: "완벽하지 않아도 일단 시작하는 초심자의 에너지",
            action: "오늘 새로운 것을 하나 시작하세요. 결과는 신경 쓰지 마세요. 시작 그 자체가 이미 성공입니다."
        },
        meta_code: {
            name: "무한 가능성 (Infinite Potential)",
            desc: "빈 캔버스 위에 무엇이든 그릴 수 있는 창조자의 상태. 당신의 시작은 우주의 새 아침입니다."
        }
    },

    MOKYOK: {
        id: "twelve_stars_mokyok",
        name: "목욕",
        hanja: "沐浴",
        title: "🚿 정화와 성장통, 목욕(沐浴)",
        keywords: ["#정화", "#도화살", "#연약함", "#성장통"],
        stage_type: "Purification Cycle",
        energy_level: 5,
        main_text: `목욕(沐浴)은 갓 태어난 아기가 목욕하는 단계입니다. 연약하지만 정화되고 있는 시기입니다.

이 운성이 강하면 매력적이지만 불안정할 수 있으며, '도화살'로도 불려 이성운이 강합니다.`,
        dark_code: {
            name: "유혹 (Temptation)",
            body_symptom: "감정 기복이 심하고, 유혹에 약해 충동적인 선택을 함",
            desc: "외모나 매력에 집착하거나, 순간의 쾌락에 빠지기 쉬운 상태이신가요? 정화의 과정에서 잠시 흔들리고 있을 뿐입니다."
        },
        neural_code: {
            name: "정화 (Purification)",
            desc: "낡은 것을 씻어내고 새롭게 태어나는 변화의 에너지",
            action: "오늘 몸을 깨끗이 씻으며, 마음의 때까지 씻어내세요. 물이 흘러내리며 과거가 사라집니다."
        },
        meta_code: {
            name: "순수한 매력 (Pure Charisma)",
            desc: "억지로 꾸미지 않아도 자연스럽게 빛나는 본연의 아름다움. 당신의 존재가 곧 매력입니다."
        }
    },

    GWANDAE: {
        id: "twelve_stars_gwandae",
        name: "관대",
        hanja: "冠帶",
        title: "🎓 성인식의 각오, 관대(冠帶)",
        keywords: ["#책임감", "#성인식", "#각오", "#의지"],
        stage_type: "Initiation Cycle",
        energy_level: 8,
        main_text: `관대(冠帶)는 관을 쓰고 띠를 두르는 성인식 단계입니다. 사회적 책임을 지기 시작하는 시기입니다.

이 운성이 강하면 책임감이 강하고, 자신의 역할을 명확히 인식합니다.`,
        dark_code: {
            name: "허세 (Pretense)",
            body_symptom: "어깨에 힘이 들어가고, 남들 앞에서 과도하게 폼을 잡음",
            desc: "아직 준비가 안 됐는데 다 된 척하고 계신가요? 내면의 부족함을 감추려고 껍데기로 포장하고 있다면, 그 무게에 짓눌리게 됩니다."
        },
        neural_code: {
            name: "책임 (Responsibility)",
            desc: "자신의 역할을 인식하고, 그에 맞는 행동을 하려는 의지",
            action: "오늘 당신에게 주어진 역할 중 하나를 진심으로 수행하세요. 작은 책임부터 완벽히 해내면 큰 책임이 주어집니다."
        },
        meta_code: {
            name: "진정한 성숙 (True Maturity)",
            desc: "나이가 아니라 마음이 어른이 된 상태. 당신의 존재가 주변에 신뢰를 줍니다."
        }
    },

    GEONNOK: {
        id: "twelve_stars_geonnok",
        name: "건록",
        hanja: "建祿",
        title: "💼 안정과 확립, 건록(建祿)",
        keywords: ["#안정", "#수입", "#확립", "#자립"],
        stage_type: "Establishment Cycle",
        energy_level: 10,
        main_text: `건록(建祿)은 녹봉을 받는 단계, 즉 자립하여 안정적인 수입을 얻는 시기입니다.

이 운성이 강하면 경제적으로 안정되고, 자신만의 기반을 확실히 구축합니다.`,
        dark_code: {
            name: "안주 (Complacency)",
            body_symptom: "배가 나오고 나태해짐, 현재에 만족하여 도전을 피함",
            desc: "먹고살 만하니까 더 이상 노력하기 싫으신가요? 안정에 안주하면 성장은 멈추고, 천천히 퇴보하게 됩니다."
        },
        neural_code: {
            name: "자립 (Independence)",
            desc: "누구에게도 의존하지 않고 스스로 삶을 꾸려나가는 힘",
            action: "오늘 당신의 수입원이나 기반을 점검하세요. 더 튼튼하게 할 수 있는 방법을 하나 찾아 실행하세요."
        },
        meta_code: {
            name: "풍요의 터전 (Foundation of Abundance)",
            desc: "흔들리지 않는 기반 위에서 더 큰 가치를 창조하는 상태. 당신은 풍요의 중심입니다."
        }
    },

    JEWANG: {
        id: "twelve_stars_jewang",
        name: "제왕",
        hanja: "帝旺",
        title: "👑 최고의 정점, 제왕(帝旺)",
        keywords: ["#정점", "#권력", "#전성기", "#카리스마"],
        stage_type: "Peak Cycle",
        energy_level: 12,
        main_text: `제왕(帝旺)은 에너지가 가장 왕성한 정점의 단계입니다. 인생의 전성기, 최고의 권위를 상징합니다.

이 운성이 강하면 카리스마가 넘치고, 리더십이 뛰어나며, 정상에 서는 힘이 있습니다.`,
        dark_code: {
            name: "독선 (Tyranny)",
            body_symptom: "목소리가 커지고 고집이 세짐, 아래를 내려다보는 시선",
            desc: "정상에 오르니 남들이 모두 작아 보이시나요? '내가 왕인데'라는 생각이 들 때, 당신은 고독한 폭군이 되어갑니다."
        },
        neural_code: {
            name: "왕도 (Kingship)",
            desc: "높은 자리에서 아래를 섬기는 진정한 리더십",
            action: "오늘 당신보다 지위가 낮은 사람에게 먼저 인사하고, 진심으로 감사를 표하세요. 왕은 섬기는 자입니다."
        },
        meta_code: {
            name: "선왕 (Benevolent King)",
            desc: "권력을 휘두르지 않아도 모두가 따르는 덕의 정치. 당신의 존재가 곧 질서입니다."
        }
    },

    SWOE: {
        id: "twelve_stars_swoe",
        name: "쇠",
        hanja: "衰",
        title: "🍂 내려놓음의 시작, 쇠(衰)",
        keywords: ["#쇠퇴", "#내려놓음", "#지혜", "#관조"],
        stage_type: "Decline Cycle",
        energy_level: 6,
        main_text: `쇠(衰)는 정점을 지나 에너지가 줄어드는 단계입니다. 쇠퇴가 아닌 성숙과 지혜의 시기입니다.

이 운성이 강하면 욕심을 버리고 관조하는 지혜가 있습니다.`,
        dark_code: {
            name: "집착 (Attachment)",
            body_symptom: "몸이 예전 같지 않고, 과거의 영광에 매달림",
            desc: "전성기가 그리워서 놓지 못하고 계신가요? 지나간 것을 붙잡으면 새로운 것이 들어올 자리가 없습니다."
        },
        neural_code: {
            name: "내려놓음 (Letting Go)",
            desc: "과거의 영광에 집착하지 않고, 변화를 받아들이는 지혜",
            action: "오늘 당신이 붙들고 있던 것 중 하나를 과감히 내려놓으세요. 빈손이 될 때 새것을 잡을 수 있습니다."
        },
        meta_code: {
            name: "지혜의 황혼 (Wisdom of Twilight)",
            desc: "해질녘의 아름다움을 아는 자만이 느끼는 깊은 평화. 당신의 경험이 빛나기 시작합니다."
        }
    },

    BYEONG: {
        id: "twelve_stars_byeong",
        name: "병",
        hanja: "病",
        title: "🤒 쉼과 치유, 병(病)",
        keywords: ["#휴식", "#치유", "#약함", "#재충전"],
        stage_type: "Rest Cycle",
        energy_level: 3,
        main_text: `병(病)은 몸과 마음이 쉬어야 하는 단계입니다. 병이라고 해서 나쁜 것이 아니라, 재충전의 시기입니다.

이 운성이 강하면 민감하고 섬세하며, 휴식의 중요성을 알고 있습니다.`,
        dark_code: {
            name: "나약 (Weakness)",
            body_symptom: "기력이 없고 우울함, 모든 게 귀찮고 힘듦",
            desc: "세상이 너무 무겁게 느껴지고, 아무것도 하기 싫으신가요? 당신은 지금 충전이 필요한 배터리 방전 상태입니다."
        },
        neural_code: {
            name: "치유 (Healing)",
            desc: "억지로 버티지 않고, 몸과 마음이 회복될 시간을 주는 지혜",
            action: "오늘은 아무것도 하지 마세요. 그냥 쉬세요. 죄책감 없이 푹 쉬는 것이 지금 당신에게 가장 생산적인 일입니다."
        },
        meta_code: {
            name: "고요한 회복 (Silent Recovery)",
            desc: "멈춤 속에서 일어나는 깊은 치유. 당신의 약함이 겸손함으로 바뀔 때, 진정한 강함이 됩니다."
        }
    },

    SA: {
        id: "twelve_stars_sa",
        name: "사",
        hanja: "死",
        title: "💀 변화의 문턱, 사(死)",
        keywords: ["#변화", "#끝", "#재탄생준비", "#포기"],
        stage_type: "Death Cycle",
        energy_level: 1,
        main_text: `사(死)는 죽음이 아닌 변화의 단계입니다. 낡은 자아가 끝나고 새로운 존재로 다시 태어나기 직전입니다.

이 운성이 강하면 극적인 변화를 경험하며, 페이크 죽음 후 부활하는 힘이 있습니다.`,
        dark_code: {
            name: "절망 (Despair)",
            body_symptom: "숨 쉬기도 힘들고, 모든 것이 끝난 것 같은 암흑",
            desc: "더 이상 희망이 없고, 모든 게 끝난 것 같으신가요? 가장 어두운 밤이 지나야 새벽이 옵니다. 지금 당신은 밤의 끝자락에 있습니다."
        },
        neural_code: {
            name: "변용 (Transformation)",
            desc: "낡은 자아를 완전히 죽이고, 새로운 존재로 다시 태어나는 용기",
            action: "오늘 더 이상 필요 없는 습관, 관계, 물건 하나를 장례를 치르듯 보내세요. 작별 인사를 하고 완전히 놓아주세요."
        },
        meta_code: {
            name: "불사조 (Phoenix)",
            desc: "재에서 다시 태어나는 불멸의 새. 당신의 죽음은 더 위대한 부활의 전주곡입니다."
        }
    },

    MYO: {
        id: "twelve_stars_myo",
        name: "묘",
        hanja: "墓",
        title: "⚰️ 축적과 잠복, 묘(墓)",
        keywords: ["#잠복", "#축적", "#창고", "#잠재력"],
        stage_type: "Storage Cycle",
        energy_level: 4,
        main_text: `묘(墓)는 무덤이 아닌 창고의 의미입니다. 에너지가 땅속에 축적되어 때를 기다리는 단계입니다.

이 운성이 강하면 겉으로 드러나지 않지만, 내면에 거대한 잠재력을 품고 있습니다.`,
        dark_code: {
            name: "매장 (Burial)",
            body_symptom: "답답하고 갇힌 느낌, 재능이 있는데 발휘를 못함",
            desc: "빛을 보지 못하고 묻혀 있는 느낌이신가요? 당신의 재능이 아직 세상에 알려지지 않아 답답하시군요."
        },
        neural_code: {
            name: "축적 (Accumulation)",
            desc: "보이지 않는 곳에서 조용히 힘을 모으는 지혜",
            action: "오늘은 드러내려 하지 마세요. 대신 배움, 저축, 연습 등 눈에 안 보이는 축적에 집중하세요. 때가 되면 폭발합니다."
        },
        meta_code: {
            name: "잠든 보물 (Sleeping Treasure)",
            desc: "땅속의 금맥처럼, 발굴되기를 기다리는 무한한 가치. 당신은 자신도 모르는 보물을 품고 있습니다."
        }
    },

    JEOL: {
        id: "twelve_stars_jeol",
        name: "절",
        hanja: "絕",
        title: "✖️ 완전한 끝, 절(絕)",
        keywords: ["#단절", "#절망", "#완전한끝", "#새시작직전"],
        stage_type: "Void Cycle",
        energy_level: 0,
        main_text: `절(絶)은 에너지가 완전히 끊어진 상태, 완전한 공백입니다. 하지만 이것은 새 시작 직전의 무(無)입니다.

이 운성이 강하면 극적인 단절을 경험하지만, 그 후에 완전히 새로운 시작이 옵니다.`,
        dark_code: {
            name: "허무 (Nihilism)",
            body_symptom: "아무 느낌도 없고, 존재 자체가 무의미하게 느껴짐",
            desc: "아무것도 의미가 없고, 텅 빈 것 같으신가요? 당신은 지금 제로 포인트, 새 우주가 시작되기 직전의 빅뱅 직전입니다."
        },
        neural_code: {
            name: "무(無) (Void)",
            desc: "모든 것을 비워 완전한 백지 상태로 돌아가는 용기",
            action: "오늘 하루, 모든 생각을 비우고 그냥 '있으세요'. 생각하지 말고, 판단하지 말고, 텅 빈 상태를 경험하세요."
        },
        meta_code: {
            name: "창조 이전 (Before Creation)",
            desc: "아무것도 없는 곳에서 모든 것이 탄생하는 신비. 당신의 공백은 우주의 씨앗입니다."
        }
    },

    TAE: {
        id: "twelve_stars_tae",
        name: "태",
        hanja: "胎",
        title: "🤰 씨앗의 잉태, 태(胎)",
        keywords: ["#잉태", "#씨앗", "#시작준비", "#비전"],
        stage_type: "Conception Cycle",
        energy_level: 2,
        main_text: `태(胎)는 생명이 수태되는 단계입니다. 아직 보이지 않지만, 새로운 가능성이 잉태된 상태입니다.

이 운성이 강하면 비전을 품고, 새로운 시작을 준비하는 힘이 있습니다.`,
        dark_code: {
            name: "공상 (Fantasy)",
            body_symptom: "현실보다 꿈에 빠져 있음, 실행력이 없음",
            desc: "머릿속으로만 계획하고, 실제로는 시작을 못 하고 계신가요? 아이디어만 가득하고 행동이 없으면 유산됩니다."
        },
        neural_code: {
            name: "비전 (Vision)",
            desc: "아직 보이지 않는 미래를 마음속에 품고 키워가는 힘",
            action: "오늘 당신의 꿈을 글로 쓰거나 그림으로 그려보세요. 마음속의 씨앗에 형태를 부여하면 발아가 시작됩니다."
        },
        meta_code: {
            name: "신성한 잉태 (Sacred Conception)",
            desc: "우주가 당신을 통해 새로운 존재를 탄생시키려는 순간. 당신의 꿈은 우주의 뜻입니다."
        }
    },

    YANG: {
        id: "twelve_stars_yang",
        name: "양",
        hanja: "養",
        title: "🍼 성장과 양육, 양(養)",
        keywords: ["#양육", "#성장", "#보호", "#준비"],
        stage_type: "Nurturing Cycle",
        energy_level: 4,
        main_text: `양(養)은 뱃속에서 자라거나 어린 생명이 양육되는 단계입니다. 보호받으며 성장하는 시기입니다.

이 운성이 강하면 성장 잠재력이 크고, 좋은 환경에서 크게 빛날 수 있습니다.`,
        dark_code: {
            name: "과보호 (Overprotection)",
            body_symptom: "세상이 무섭고, 안전한 곳에서만 있고 싶음",
            desc: "편안한 곳에서 나오기 싫고, 세상이 두려우신가요? 엄마 뱃속에서 나오지 않으면 아이는 영원히 태어날 수 없습니다."
        },
        neural_code: {
            name: "양육 (Nurturing)",
            desc: "자신을 스스로 보살피고 성장시키는 자기 돌봄의 지혜",
            action: "오늘 자신에게 좋은 음식, 좋은 환경, 좋은 생각을 선물하세요. 당신 안의 씨앗에 영양을 주세요."
        },
        meta_code: {
            name: "자기 양육 (Self-Parenting)",
            desc: "스스로의 부모가 되어 자신을 완전히 사랑하는 상태. 당신은 당신 자신의 가장 좋은 부모입니다."
        }
    }
};

// ============== 명심코드(Gene Keys) 데이터베이스 ==============
// 64개 코드 중 대표적인 것들 (추후 확장)

export const MYUNGSIM_CODES: Record<string, MyungsimCode> = {

    CODE_1: {
        id: "code_1",
        number: 1,
        title: "🌅 운명 코드 1번: 창조의 시작",
        keywords: ["#창조성", "#신선함", "#새로운시작"],
        dark_code: {
            name: "엔트로피",
            description: "혼란과 무질서 속에서 방향을 잃은 상태. 에너지가 분산되어 창조적 힘이 발휘되지 못합니다.",
            coaching_tip: "지금은 정리와 집중이 필요한 시기입니다. 작은 것부터 하나씩 시작해보세요."
        },
        neural_code: {
            name: "신선함",
            description: "매 순간을 새롭게 바라보는 능력. 과거의 패턴에서 벗어나 창조적 가능성을 봅니다.",
            coaching_tip: "익숙한 것을 새로운 눈으로 바라보세요. 당연하게 여겼던 것에서 기회를 발견할 수 있습니다."
        },
        meta_code: {
            name: "아름다움",
            description: "모든 것에서 아름다움을 발견하는 상태. 창조의 근원과 연결되어 삶 자체가 예술이 됩니다.",
            coaching_tip: "당신의 존재 자체가 이미 창조적입니다. 그냥 당신답게 살면 됩니다."
        },
        main_insight: "모든 창조는 '무(無)'에서 시작합니다. 빈 캔버스를 두려워하지 마세요.",
        life_lesson: "시작하는 용기가 있다면, 결과는 따라옵니다.",
        daily_practice: "매일 아침 '오늘 새롭게 시도할 것 하나'를 정해보세요."
    },

    CODE_40: {
        id: "code_40",
        number: 40,
        title: "🔥 운명 코드 40번: 의지의 연금술",
        keywords: ["#의지력", "#결단", "#에너지관리"],
        dark_code: {
            name: "고갈",
            description: "남을 위해 너무 많이 퍼주다가 자신의 에너지가 바닥난 상태. 번아웃과 무기력함이 찾아옵니다.",
            coaching_tip: "지금 가장 중요한 것은 '나'를 먼저 채우는 것입니다. 죄책감 없이 쉬세요."
        },
        neural_code: {
            name: "결단적 의지",
            description: "자신의 에너지를 보호하기 위해 '아니오'라고 말할 줄 아는 힘. 진정한 의지력은 거절에서 시작됩니다.",
            coaching_tip: "원치 않는 것에 '아니오'라고 말해보세요. 그것이 진정한 의지력의 시작입니다."
        },
        meta_code: {
            name: "신성한 의지",
            description: "개인의 의지가 우주의 의지와 하나가 된 상태. 노력 없이 모든 것이 알맞은 때에 이루어집니다.",
            coaching_tip: "힘을 빼세요. 당신이 억지로 하지 않아도 될 일들이 있습니다."
        },
        main_insight: "진정한 힘은 '밀어붙이는 것'이 아니라 '적절히 쉬는 것'에서 나옵니다.",
        life_lesson: "에너지 관리 = 인생 관리. 나를 고갈시키는 것을 정리하세요.",
        daily_practice: "하루에 한 번, 진심으로 원하지 않는 부탁에 '아니오'라고 말하기."
    },

    CODE_22: {
        id: "code_22",
        number: 22,
        title: "🎭 운명 코드 22번: 우아함의 비밀",
        keywords: ["#우아함", "#품위", "#내면의빛"],
        dark_code: {
            name: "불명예",
            description: "체면에 집착하여 진정한 자신을 숨기는 상태. 남의 시선에 갇혀 자유를 잃습니다.",
            coaching_tip: "완벽해 보이려 하지 마세요. 진짜 우아함은 불완전함을 인정할 때 나옵니다."
        },
        neural_code: {
            name: "우아함",
            description: "어떤 상황에서도 품위를 잃지 않는 능력. 내면의 고요함이 외면의 아름다움으로 발현됩니다.",
            coaching_tip: "급할수록 천천히. 우아함은 여유에서 나옵니다."
        },
        meta_code: {
            name: "은총",
            description: "노력 없이 흘러나오는 자연스러운 아름다움. 존재 자체가 축복이 되는 상태.",
            coaching_tip: "당신은 이미 충분히 아름답습니다. 그냥 빛나세요."
        },
        main_insight: "진정한 품위는 남을 높이는 것이 아니라, 나를 낮추지 않는 것입니다.",
        life_lesson: "당신의 가치는 타인의 평가와 무관합니다.",
        daily_practice: "거울을 보며 자신에게 따뜻한 말 한마디 건네기."
    },

    CODE_55: {
        id: "code_55",
        number: 55,
        title: "🌙 운명 코드 55번: 자유의 날개",
        keywords: ["#자유", "#해방", "#무한가능성"],
        dark_code: {
            name: "희생자 의식",
            description: "환경이나 타인 탓을 하며 자신의 힘을 포기한 상태. 스스로를 피해자로 여깁니다.",
            coaching_tip: "모든 상황에는 당신의 선택이 있었습니다. 책임을 되찾으세요."
        },
        neural_code: {
            name: "자유",
            description: "어떤 상황에서도 선택의 자유가 있음을 아는 상태. 외부 환경에 구속받지 않습니다.",
            coaching_tip: "당신은 언제든 다르게 선택할 수 있습니다. 무엇을 바꾸고 싶으세요?"
        },
        meta_code: {
            name: "해방",
            description: "모든 조건과 제한에서 완전히 자유로운 상태. 무한한 가능성 그 자체.",
            coaching_tip: "가장 큰 감옥은 마음속에 있습니다. 문은 이미 열려 있습니다."
        },
        main_insight: "자유는 찾는 것이 아니라, 이미 가진 것을 깨닫는 것입니다.",
        life_lesson: "당신을 가두는 것은 환경이 아니라 믿음입니다.",
        daily_practice: "하루에 한 번, '나는 자유롭게 선택할 수 있다'고 선언하기."
    },

    // ============== 새로운 명심코드 (CODE_2 ~ CODE_10) ==============

    CODE_2: {
        id: "code_2",
        number: 2,
        original_key: "Gene Key 2",
        visual_token: "🧭",
        color_code: "#5DADE2",
        title: "🧭 운명 코드 2번: 귀환의 나침반",
        archetype: "The Peacemaker",
        image_prompt: "A golden compass floating in a calm ocean under a starry night",
        keywords: ["#방향", "#귀환", "#내면의나침반"],
        dark_code: {
            name: "방향 상실 (Dislocation)",
            body_symptom: "가슴이 답답하고 발이 땅에 닿지 않는 듯한 붕 뜬 느낌",
            desc: "선생님, 지금 망망대해에 혼자 떠 있는 것처럼 막막하신가요? 내가 어디로 가야 할지 모르겠고, 세상과 나만 동떨어진 것 같은 그 외로움... 하지만 이것은 길을 잃은 게 아닙니다. 내면의 나침반을 다시 '진북(True North)'으로 맞추기 위해 잠시 멈춰 선 소중한 시간입니다."
        },
        neural_code: {
            name: "방향 잡기 (Orientation)",
            desc: "머리의 계산을 멈추고, 몸의 자석이 이끄는 대로 흐르는 상태",
            action: "지금 당장 생각하는 것을 멈추세요. 눈을 감고 왼손을 심장에 얹으세요. 그리고 자신에게 물어보세요. '지금 내 몸이 편안한가?' 머리가 아닌 몸이 'YES'라고 하는 쪽으로 딱 한 걸음만 움직이세요."
        },
        meta_code: {
            name: "통합 (Unity)",
            desc: "나와 너, 시작과 끝의 경계가 사라지고 모든 것이 하나의 거대한 춤임을 깨닫는 경지. 당신은 우주라는 오케스트라의 지휘자입니다. 우연처럼 보이는 모든 만남이 필연적인 악보였음을 알게 될 것입니다."
        }
    },

    CODE_3: {
        id: "code_3",
        number: 3,
        original_key: "Gene Key 3",
        visual_token: "🎢",
        color_code: "#F5B041",
        title: "🎢 운명 코드 3번: 혁신의 놀이터",
        archetype: "The Innovator",
        image_prompt: "Colorful building blocks falling and reassembling into a futuristic castle",
        keywords: ["#혼란속창조", "#혁신", "#놀이"],
        dark_code: {
            name: "혼란 (Chaos)",
            body_symptom: "머릿속이 뒤죽박죽이고 무엇부터 해야 할지 몰라 손발이 차가워짐",
            desc: "변화가 너무 빠르고 예측할 수 없어 어지러우시죠? 계획대로 되는 게 하나도 없어서 화가 날 수도 있어요. 하지만 이 혼란은 낡은 껍질을 깨고 새로운 것이 태어나기 위한 '산통(産痛)'과 같습니다. 지금 당신의 시스템은 대규모 업데이트 중입니다."
        },
        neural_code: {
            name: "혁신 (Innovation)",
            desc: "무질서 속에서 기존에 없던 새로운 패턴을 찾아내는 창조적 적응력",
            action: "정리하려는 강박을 버리세요. 지금의 엉망진창인 책상, 뒤죽박죽인 스케줄을 그냥 놔두고 '와, 진짜 엉망이네!'라고 소리 내어 웃어보세요. 그리고 가장 눈에 띄는 엉뚱한 것 하나를 골라 그냥 가지고 노세요. 거기서 아이디어가 나옵니다."
        },
        meta_code: {
            name: "천진난만 (Innocence)",
            desc: "삶을 심각한 전투가 아닌, 신나는 놀이터로 바라보는 아이의 눈. 당신이 웃음을 터뜨리는 순간, 복잡하게 얽혀있던 문제들이 마법처럼 스르르 풀립니다. 당신은 세상을 바꾸는 아이입니다."
        }
    },

    CODE_4: {
        id: "code_4",
        number: 4,
        original_key: "Gene Key 4",
        visual_token: "🧩",
        color_code: "#AF7AC5",
        title: "🧩 운명 코드 4번: 논리의 해방",
        archetype: "The Judge",
        image_prompt: "A prism converting a single beam of light into a rainbow",
        keywords: ["#이해", "#용서", "#편견해방"],
        dark_code: {
            name: "편협함 (Intolerance)",
            body_symptom: "미간에 힘이 들어가고, 상대방의 말꼬리를 잡고 싶은 충동",
            desc: "지금 누군가가 너무 답답하고 멍청해 보이나요? '왜 저렇게밖에 못하지?'라는 생각에 짜증이 솟구친다면, 그것은 당신의 뛰어난 두뇌가 과열되었다는 신호입니다. 답을 찾으려는 욕구가 오히려 당신의 시야를 좁히고 있습니다."
        },
        neural_code: {
            name: "이해 (Understanding)",
            desc: "논리의 칼날을 거두고, 가슴으로 전체의 맥락을 꿰뚫어 보는 통찰",
            action: "분석을 멈추세요. 지금 답답해 보이는 그 사람의 눈동자를 3초만 지그시 바라보세요. 그리고 마음속으로 주문을 외우세요. '그럴 수도 있겠다.' 판단을 멈추는 순간, 놀랍게도 상대방의 의도가 보이기 시작합니다."
        },
        meta_code: {
            name: "용서 (Forgiveness)",
            desc: "모든 실수와 오류마저도 완성을 위한 필수 과정이었음을 인정하는 상태. 당신의 지성은 상대를 찌르는 칼이 아니라, 어둠을 밝히는 등불이 됩니다. 모든 것을 용서할 때, 당신은 비로소 자유로워집니다."
        }
    },

    CODE_5: {
        id: "code_5",
        number: 5,
        original_key: "Gene Key 5",
        visual_token: "⏳",
        color_code: "#52BE80",
        title: "⏳ 운명 코드 5번: 시간의 마법사",
        archetype: "The Timeless One",
        image_prompt: "A turtle swimming peacefully in a galaxy filled with clocks",
        keywords: ["#인내", "#시간초월", "#신성한타이밍"],
        dark_code: {
            name: "조급함 (Impatience)",
            body_symptom: "다리를 떨거나 손톱을 물어뜯음, 심장이 이유 없이 빨리 뜀",
            desc: "마음은 이미 저만치 가 있는데 현실은 느리게 굴러가니 미칠 것 같죠? 불안하고 초조한 그 느낌... 그건 당신 잘못이 아닙니다. 당신의 고유한 생체 리듬과 세상의 속도가 잠시 '엇박자'가 났을 뿐이에요."
        },
        neural_code: {
            name: "인내 (Patience)",
            desc: "모든 생명은 각자의 계절에 꽃이 핌을 알고, 느긋하게 신뢰하는 태도",
            action: "물리적인 속도를 강제로 늦추세요. 지금부터 10분 동안, 평소 걷는 속도의 '절반' 속도로 천천히 걸으세요. 물도 아주 천천히 씹어서 마시세요. 몸의 속도를 늦추면, 꼬였던 시간의 매듭이 풀립니다."
        },
        meta_code: {
            name: "시간 초월 (Timelessness)",
            desc: "과거의 후회도, 미래의 걱정도 사라진 영원한 '지금'에 머무는 경지. 당신은 시간을 쫓는 자가 아니라, 시간을 지배하는 자입니다. 서두르지 않아도, 당신은 가장 완벽한 타이밍에 그곳에 도착해 있습니다."
        }
    },

    CODE_6: {
        id: "code_6",
        number: 6,
        original_key: "Gene Key 6",
        visual_token: "🕊️",
        color_code: "#EC7063",
        title: "🕊️ 운명 코드 6번: 평화의 메신저",
        archetype: "The Peacemaker",
        image_prompt: "A shield turning into a flock of white doves",
        keywords: ["#평화", "#외교", "#감정조절"],
        dark_code: {
            name: "갈등 (Conflict)",
            body_symptom: "배가 아프거나 소화가 안 됨, 주변 소음이 유난히 거슬림",
            desc: "세상이 너무 시끄럽고 사람들의 감정이 당신을 찌르는 것 같나요? 그래서 방어벽을 세우고 공격적으로 변했나요? 사실 당신은 너무 예민하고 섬세한 피부를 가진 사람이라, 자신을 보호하려고 가시를 세운 것뿐입니다."
        },
        neural_code: {
            name: "외교 (Diplomacy)",
            desc: "나의 경계를 지키면서도 부드러운 대화로 상대의 무장을 해제시키는 힘",
            action: "대화 중 감정이 격해지면 '잠깐만요'라고 말하고 1분간 침묵하세요. 그리고 '당신이 틀렸어' 대신 '나는 지금 조금 당황스러워요'라고 내 감정 상태만 건조하게 전달하세요. 솔직함이 최고의 방패입니다."
        },
        meta_code: {
            name: "평화 (Peace)",
            desc: "내면의 전쟁이 완전히 끝나, 존재만으로 주변을 고요하게 만드는 성스러운 상태. 당신의 몸이 곧 평화의 성전입니다. 당신이 머무는 곳에서는 다툼조차 저절로 멈추게 됩니다."
        }
    },

    CODE_7: {
        id: "code_7",
        number: 7,
        original_key: "Gene Key 7",
        visual_token: "👑",
        color_code: "#F4D03F",
        title: "👑 운명 코드 7번: 왕좌 뒤의 빛",
        archetype: "The Leader",
        image_prompt: "A lantern illuminating a path for many people in the dark",
        keywords: ["#리더십", "#섬김", "#인도"],
        dark_code: {
            name: "분열 (Division)",
            body_symptom: "목소리가 커지거나, 반대로 입을 꾹 다물고 냉소적으로 변함",
            desc: "내 뜻대로 사람들을 움직이고 싶거나, 반대로 권위적인 사람에게 맹목적으로 반항하고 싶으신가요? 이것은 당신 안에 잠든 거대한 '리더십의 에너지'가 갈 곳을 잃고 겉돌고 있다는 신호입니다."
        },
        neural_code: {
            name: "인도 (Guidance)",
            desc: "앞에서 명령하는 것이 아니라, 뒤에서 묵묵히 받쳐주며 타인의 잠재력을 깨우는 힘",
            action: "오늘 하루, '나를 따르라'는 마음을 버리세요. 대신 만나는 사람에게 '제가 무엇을 도와주면 당신이 더 편할까요?'라고 딱 한 번만 물어보세요. 진정한 왕은 가장 낮은 곳에서 섬기는 자입니다."
        },
        meta_code: {
            name: "미덕 (Virtue)",
            desc: "어떤 보상도 바라지 않고 그저 세상의 흐름을 올바르게 잡아주는 숭고한 영향력. 당신은 왕관을 쓰지 않은 왕입니다. 당신의 헌신이 역사의 물줄기를 바꿉니다."
        }
    },

    CODE_8: {
        id: "code_8",
        number: 8,
        original_key: "Gene Key 8",
        visual_token: "💎",
        color_code: "#A569BD",
        title: "💎 운명 코드 8번: 스타일의 아이콘",
        archetype: "The Diamond",
        image_prompt: "A uniquely shaped diamond glowing with its own light",
        keywords: ["#개성", "#스타일", "#유일무이"],
        dark_code: {
            name: "평범함 (Mediocrity)",
            body_symptom: "무채색 옷만 입고 싶음, 남들 눈에 띄는 것이 두려워 위축됨",
            desc: "혹시 '튀면 안 돼', '남들만큼만 하자'라고 스스로를 억누르고 계신가요? 당신 안의 야수가 좁은 우리에 갇혀 답답해하고 있습니다. 당신의 영혼은 평범함이라는 감옥을 가장 견디기 힘들어합니다."
        },
        neural_code: {
            name: "스타일 (Style)",
            desc: "남들의 시선을 신경 쓰지 않고, 나만의 고유한 괴짜성을 당당하게 드러내는 태도",
            action: "소심한 반란을 일으키세요. 남들이 '좀 이상한데?'라고 할 만한 액세서리를 하거나, 혼자서 노래를 흥얼거리며 걸으세요. 당신이 당신다워질 때, 세상은 비로소 당신을 주목합니다."
        },
        meta_code: {
            name: "절묘함 (Exquisiteness)",
            desc: "숨 쉬는 것, 걷는 것, 말하는 것 모든 순간이 예술이 되는 경지. 당신은 깎이지 않은 원석 그 자체로 완벽합니다. 존재 자체가 하나의 브랜드이자 장르가 됩니다."
        }
    },

    CODE_9: {
        id: "code_9",
        number: 9,
        original_key: "Gene Key 9",
        visual_token: "🔍",
        color_code: "#E74C3C",
        title: "🔍 운명 코드 9번: 집중의 마법사",
        archetype: "The Magician",
        image_prompt: "A magnifying glass focusing sunlight to start a fire",
        keywords: ["#집중", "#결단", "#작은실천"],
        dark_code: {
            name: "타성 (Inertia)",
            body_symptom: "하품이 계속 나고, 중요하지 않은 일(청소, 정리)에 집착함",
            desc: "해야 할 일은 산더미인데, 자꾸 딴짓만 하고 싶고 몸이 천근만근 무거우신가요? 사소한 디테일에 에너지를 뺏겨 정작 중요한 일은 시작도 못 하는 상태... 이것은 당신의 엄청난 집중력이 흩어져서 생기는 현상입니다."
        },
        neural_code: {
            name: "결단력 (Determination)",
            desc: "거창한 목표 대신, 아주 작은 행위 하나를 끝까지 완수하여 에너지를 뚫는 힘",
            action: "큰 계획은 다 잊으세요. 지금 당장 눈앞에 있는 '5분짜리 아주 작은 일'(예: 컵 씻기, 영수증 버리기) 하나만 끝까지 해치우세요. 그 작은 성취감이 막혀있던 댐을 무너뜨립니다."
        },
        meta_code: {
            name: "천하무적 (Invincibility)",
            desc: "작은 행위 하나하나에 우주의 의도가 실려, 그 누구도 당신의 전진을 막을 수 없는 상태. 당신은 낙숫물로 바위를 뚫는 위대한 힘을 가졌습니다. 꾸준함이 곧 신성(神性)입니다."
        }
    },

    CODE_10: {
        id: "code_10",
        number: 10,
        original_key: "Gene Key 10",
        visual_token: "🌿",
        color_code: "#58D68D",
        title: "🌿 운명 코드 10번: 존재의 사랑",
        archetype: "The Self",
        image_prompt: "A person sitting comfortably in nature, merging with the surroundings",
        keywords: ["#자연스러움", "#존재", "#자기사랑"],
        dark_code: {
            name: "자의식 과잉 (Self-Obsession)",
            body_symptom: "거울을 강박적으로 보거나, 타인의 반응을 살피느라 목이 뻣뻣해짐",
            desc: "'사람들이 나를 어떻게 볼까?' 이 생각 때문에 행동이 부자연스럽고 긴장되시나요? 혹은 나 자신에게만 너무 빠져 주변이 보이지 않나요? 이것은 당신이 '진짜 나'를 사랑하는 법을 잊어버리고, '보여지는 나'에 집착하고 있다는 신호입니다."
        },
        neural_code: {
            name: "자연스러움 (Naturalness)",
            desc: "타인의 시선이라는 감옥에서 걸어 나와, 힘을 빼고 가장 편안한 나로 존재하는 것",
            action: "지금 입고 있는 불편한 옷이나 꾸밈을 가능한 한 느슨하게 하세요. 그리고 거울을 보며 말하세요. '나는 그냥 나다.' 아무것도 더하지 않은 당신의 민낯이 가장 아름답습니다."
        },
        meta_code: {
            name: "존재 (Being)",
            desc: "무엇을 하려(Doing) 하지 않고, 그저 존재(Being)하는 것만으로 사랑 그 자체가 되는 상태. 당신은 삶을 살아가는 것이 아닙니다. 삶이 당신을 통해 흐르고 있을 뿐입니다. 그저 거기 있어 주세요."
        }
    },

    // ============== 명심코드 BATCH 2 (CODE_11 ~ CODE_20) ==============

    CODE_11: {
        id: "code_11",
        number: 11,
        original_key: "Gene Key 11",
        visual_token: "💡",
        color_code: "#F1C40F",
        title: "💡 운명 코드 11번: 이상의 빛",
        archetype: "The Idealist",
        image_prompt: "A pure white light breaking through dark clouds",
        keywords: ["#이상", "#빛", "#비전"],
        dark_code: {
            name: "모호함 (Obscurity)",
            body_symptom: "눈앞이 뿌옇게 흐려지는 느낌, 현실이 답답해서 자꾸 멍해짐",
            desc: "머릿속에 수만 가지 생각과 이미지가 떠오르는데, 정작 현실에서는 무엇 하나 뚜렷하게 잡히지 않아 답답하신가요? 그것은 당신이 길을 잃은 게 아니라, 내면의 빛이 너무 강해서 잠시 '현실의 초점'이 나간 상태일 뿐입니다."
        },
        neural_code: {
            name: "이상주의 (Idealism)",
            desc: "회색빛 현실 속에서도 보이지 않는 꿈과 희망을 믿고 나아가는 힘",
            action: "논리적으로 따지지 말고, 지금 당장 당신을 설레게 하는 '비현실적인 이미지' 하나를 종이에 그리거나 사진을 찾아 휴대폰 배경화면으로 바꾸세요. 그 이미지가 당신의 등대입니다."
        },
        meta_code: {
            name: "빛 (Light)",
            desc: "어둠과 빛의 경계가 사라지고, 당신 자체가 세상의 어둠을 밝히는 순수한 광원이 되는 상태. 당신이 눈을 뜨면 세상이 밝아지고, 당신이 꿈을 꾸면 그것이 곧 현실이 됩니다."
        }
    },

    CODE_12: {
        id: "code_12",
        number: 12,
        original_key: "Gene Key 12",
        visual_token: "🎤",
        color_code: "#E91E63",
        title: "🎤 운명 코드 12번: 순수의 목소리",
        archetype: "The Channel",
        image_prompt: "A crystal clear throat chakra glowing with pink light",
        keywords: ["#진실", "#순수", "#표현"],
        dark_code: {
            name: "허영심 (Vanity)",
            body_symptom: "목에 무언가 걸린 듯한 이물감, 목소리가 부자연스럽게 떨림",
            desc: "남들에게 잘 보이고 싶어서 마음에도 없는 말을 하거나, 반대로 사랑받지 못할까 봐 입을 꾹 다물고 계신가요? 이것은 당신의 영혼이 '거짓말'을 견디지 못해서 보내는 신호입니다."
        },
        neural_code: {
            name: "식별력 (Discrimination)",
            desc: "거짓과 진실을 본능적으로 구분하고, 오직 진실한 마음만을 표현하는 용기",
            action: "지금 누군가에게 하려던 말 중, 타인의 시선을 의식해서 꾸며낸 말은 전부 지우세요. 그리고 조금 투박하더라도 당신의 '진심' 딱 한 문장만 담백하게 말해보세요."
        },
        meta_code: {
            name: "순수 (Purity)",
            desc: "어떤 의도나 계산도 없이, 어린아이의 눈동자처럼 맑고 투명해진 영혼의 상태. 당신의 말은 노래가 되고, 당신의 침묵은 기도가 되어 타인의 영혼을 정화합니다."
        }
    },

    CODE_13: {
        id: "code_13",
        number: 13,
        original_key: "Gene Key 13",
        visual_token: "👂",
        color_code: "#8E44AD",
        title: "👂 운명 코드 13번: 공감의 귀",
        archetype: "The Listener",
        image_prompt: "A giant ear listening to the whispers of the forest",
        keywords: ["#경청", "#공감", "#치유"],
        dark_code: {
            name: "불화 (Discord)",
            body_symptom: "가슴이 꽉 막힌 듯한 답답함, 과거의 상처가 자꾸 떠올라 울컥함",
            desc: "사람들과 섞이지 못하고 겉도는 느낌, 혹은 과거의 아픈 기억 때문에 마음의 문을 닫고 싶으신가요? 그것은 당신이 타인의 감정을 너무 깊이 흡수하기 때문에, 본능적으로 자신을 보호하려고 차단막을 내린 것입니다."
        },
        neural_code: {
            name: "분별력 (Discernment)",
            desc: "감정에 휩쓸리지 않고, 상대방의 말 뒤에 숨겨진 진심을 듣는 깊은 청취력",
            action: "오늘 누군가와 대화할 때, 대답하려고 하지 말고 그저 '듣기'만 하세요. 상대방의 눈을 보고 고개만 끄덕여주세요. 당신이 온전히 들어주는 순간, 불화는 눈 녹듯 사라집니다."
        },
        meta_code: {
            name: "감정이입 (Empathy)",
            desc: "너와 나의 경계가 사라지고, 우주의 모든 슬픔과 기쁨을 내 것처럼 끌어안는 거대한 사랑. 당신은 세상의 모든 비밀을 들어주는 대나무 숲이자, 치유의 성소입니다."
        }
    },

    CODE_14: {
        id: "code_14",
        number: 14,
        original_key: "Gene Key 14",
        visual_token: "🔥",
        color_code: "#D35400",
        title: "🔥 운명 코드 14번: 풍요의 엔진",
        archetype: "The Fire",
        image_prompt: "A golden chariot running on wheels of fire",
        keywords: ["#풍요", "#열정", "#부"],
        dark_code: {
            name: "타협 (Compromise)",
            body_symptom: "아랫배가 차갑고 힘이 없음, 일을 해도 성취감이 없고 노예가 된 기분",
            desc: "돈 때문에, 혹은 현실적인 이유 때문에 정말 하고 싶은 일을 미루고 '이 정도면 됐어'라며 시시한 일에 매달리고 있나요? 당신 안의 거대한 엔진은 시시한 연료(타협)로는 절대 돌아가지 않습니다."
        },
        neural_code: {
            name: "유능함 (Competence)",
            desc: "내가 사랑하는 일에 미친 듯이 몰입할 때 뿜어져 나오는 폭발적인 생산성",
            action: "지금 하고 있는 일 중에서, 당신을 가장 지루하게 만드는 부분을 딱 잘라내거나 다른 방식으로 바꿔보세요. 그리고 가슴 뛰는 일에 딱 10분만 온전히 집중하세요."
        },
        meta_code: {
            name: "풍요 (Bounteousness)",
            desc: "내가 움직이는 모든 것이 황금으로 변하고, 쓰는 만큼 더 채워지는 무한한 창조의 에너지. 당신은 걸어 다니는 보물창고입니다."
        }
    },

    CODE_15: {
        id: "code_15",
        number: 15,
        original_key: "Gene Key 15",
        visual_token: "🌸",
        color_code: "#2ECC71",
        title: "🌸 운명 코드 15번: 야생의 꽃",
        archetype: "The Wild One",
        image_prompt: "Wildflowers blooming in diverse colors across a vast meadow",
        keywords: ["#자유", "#다양성", "#매력"],
        dark_code: {
            name: "단조로움 (Dullness)",
            body_symptom: "온몸이 뻣뻣하게 굳음, 반복되는 일상이 숨 막히게 지루함",
            desc: "똑같은 패턴, 반복되는 일상 속에서 영혼이 시들어가는 느낌을 받으시나요? 당신은 규격화된 화분에서는 살 수 없는 '야생화'입니다."
        },
        neural_code: {
            name: "자성 (Magnetism)",
            desc: "자연의 리듬에 몸을 맡길 때, 사람과 기회를 자석처럼 끌어당기는 매력",
            action: "당장 꽉 짜인 스케줄 표를 덮어버리세요. 그리고 밖으로 나가 흙을 밟거나, 아무 버스나 타고 낯선 곳에 내려보세요."
        },
        meta_code: {
            name: "개화 (Florescence)",
            desc: "모든 인류와 자연을 차별 없이 사랑하며, 존재만으로 세상을 다채롭게 꽃피우는 상태. 당신은 봄 그 자체입니다."
        }
    },

    CODE_16: {
        id: "code_16",
        number: 16,
        original_key: "Gene Key 16",
        visual_token: "🎻",
        color_code: "#F39C12",
        title: "🎻 운명 코드 16번: 마스터의 손길",
        archetype: "The Expert",
        image_prompt: "A glowing violin playing itself with magical energy",
        keywords: ["#숙달", "#장인정신", "#융합"],
        dark_code: {
            name: "무관심 (Indifference)",
            body_symptom: "눈에 생기가 없고, 무엇을 해도 '대충 하고 치우자'는 마음이 듦",
            desc: "재능은 많은데 끈기가 없어 이것저것 찔러보기만 하고, 깊이 들어가는 게 귀찮으신가요? 이것은 당신의 재능이 갈 곳을 잃어 방황하는 상태입니다."
        },
        neural_code: {
            name: "다재다능 (Versatility)",
            desc: "여러 가지 기술을 융합하여 누구도 따라 할 수 없는 나만의 장르를 만드는 힘",
            action: "새로운 것을 배우려 하지 말고, 당신이 이미 할 줄 아는 것 두 가지를 섞어보세요. 그 융합의 지점에서 당신만의 마법이 시작됩니다."
        },
        meta_code: {
            name: "장인정신 (Mastery)",
            desc: "기술을 넘어 예술의 경지에 도달하여, 손끝 하나로 사람들의 영혼을 울리는 상태. 당신 자체가 신의 도구가 되어 기적을 연주합니다."
        }
    },

    CODE_17: {
        id: "code_17",
        number: 17,
        original_key: "Gene Key 17",
        visual_token: "👁️",
        color_code: "#3498DB",
        title: "👁️ 운명 코드 17번: 천리안",
        archetype: "The Seer",
        image_prompt: "A third eye opening in the vast galaxy seeing everything",
        keywords: ["#통찰", "#비전", "#선구안"],
        dark_code: {
            name: "의견 (Opinion)",
            body_symptom: "목에 핏대가 서고, 남의 말을 끊고 내 주장을 펼치고 싶음",
            desc: "내 생각이 맞고 남들은 틀렸다는 생각에 화가 나시나요? 논쟁에서 이겨야 직성이 풀리시나요? 그것은 당신의 뛰어난 통찰력이 '에고'에 갇혀있다는 신호입니다."
        },
        neural_code: {
            name: "원대함 (Far-sightedness)",
            desc: "당장의 옳고 그름을 넘어, 먼 미래의 큰 그림을 내다보는 선구안",
            action: "논쟁을 멈추고 고개를 들어 먼 지평선이나 하늘을 바라보세요. 그리고 스스로에게 물어보세요. '10년 뒤에도 이 문제가 중요할까?'"
        },
        meta_code: {
            name: "전지 (Omniscience)",
            desc: "과거, 현재, 미래를 한눈에 꿰뚫어 보며 신의 눈으로 세상을 바라보는 상태. 당신의 눈에는 판단이 없습니다."
        }
    },

    CODE_18: {
        id: "code_18",
        number: 18,
        original_key: "Gene Key 18",
        visual_token: "🩹",
        color_code: "#95A5A6",
        title: "🩹 운명 코드 18번: 치유의 손길",
        archetype: "The Healer",
        image_prompt: "Golden kintsugi repairing a broken ceramic bowl",
        keywords: ["#치유", "#회복", "#완전함"],
        dark_code: {
            name: "판단 (Judgment)",
            body_symptom: "미간이 찌푸려지고, 남들의 단점이나 실수가 유독 눈에 거슬림",
            desc: "세상이 온통 불완전하고 뜯어고칠 것투성이로 보이나요? 그것은 당신이 세상을 더 완벽하게 만들고 싶은 '사랑'이 왜곡되어 표현된 것입니다."
        },
        neural_code: {
            name: "진정성 (Integrity)",
            desc: "남을 비판하는 대신, 내 주변의 작은 것부터 고치고 치유하는 실천력",
            action: "비판하고 싶은 에너지를 '고치는 에너지'로 바꾸세요. 삐뚤어진 액자를 바로잡거나, 고장 난 물건을 수리하세요."
        },
        meta_code: {
            name: "완벽함 (Perfection)",
            desc: "망가지고 상처 입은 것조차 그 자체로 아름다운 과정임을 깨닫는 자애로운 상태. 당신은 모든 아픔을 안아주어 온전하게 만드는 치유 그 자체입니다."
        }
    },

    CODE_19: {
        id: "code_19",
        number: 19,
        original_key: "Gene Key 19",
        visual_token: "🤲",
        color_code: "#E67E22",
        title: "🤲 운명 코드 19번: 감각의 제국",
        archetype: "The Sensitive",
        image_prompt: "Hands gently holding a glowing heart, connecting souls",
        keywords: ["#민감성", "#교감", "#희생"],
        dark_code: {
            name: "의존 (Co-dependence)",
            body_symptom: "혼자 있으면 가슴이 텅 빈 것처럼 시리고, 끊임없이 관심을 갈구함",
            desc: "누군가가 옆에 없으면 불안하고, 사랑받기 위해 나를 희생하고 계신가요? 당신은 너무나 민감한 영혼이라, 세상과 단절되는 것을 죽음처럼 두려워합니다."
        },
        neural_code: {
            name: "민감성 (Sensitivity)",
            desc: "사람뿐만 아니라 동물, 식물, 공간의 에너지와 깊게 교감하는 능력",
            action: "사람에게서 관심을 찾지 말고, 자연과 교감하세요. 부드러운 담요를 만지거나, 반려동물을 쓰다듬거나, 화분에 물을 주세요."
        },
        meta_code: {
            name: "희생 (Sacrifice)",
            desc: "나의 작은 자아를 버리고, 인류 전체를 위한 기도가 되는 숭고한 상태. 당신의 민감함은 신과 대화하는 안테나입니다."
        }
    },

    CODE_20: {
        id: "code_20",
        number: 20,
        original_key: "Gene Key 20",
        visual_token: "🧘",
        color_code: "#1ABC9C",
        title: "🧘 운명 코드 20번: 지금의 현존",
        archetype: "The Now",
        image_prompt: "A person meditating in the center of a busy city, perfectly still",
        keywords: ["#현존", "#집중", "#명료함"],
        dark_code: {
            name: "피상성 (Superficiality)",
            body_symptom: "머릿속이 붕 떠 있고, 방금 뭘 했는지 기억이 안 나는 '자동 조종' 상태",
            desc: "하루 종일 바쁘게 움직였는데 남는 게 없는 느낌, 깊이 없이 겉만 훑고 지나가는 느낌이 드시나요? 당신은 '지금 여기'에 있지 않고, 생각 속의 과거와 미래를 헤매고 있습니다."
        },
        neural_code: {
            name: "자기확신 (Self-Assurance)",
            desc: "외부 상황에 흔들리지 않고, 매 순간 깨어서 명료하게 행동하는 힘",
            action: "지금 하던 모든 동작을 멈추고 심호흡을 한 번 하세요. 그리고 눈앞에 있는 사물 하나를 5초간 뚫어지게 바라보세요. '나는 지금 여기에 있다'라고 말하세요."
        },
        meta_code: {
            name: "현존 (Presence)",
            desc: "생각이 사라지고, 오직 순수한 의식으로 영원한 현재에 머무는 신성한 상태. 당신이 존재하는 그 자리가 곧 우주의 중심입니다."
        }
    },

    // ============== 명심코드 BATCH 3 (CODE_21 ~ CODE_30) ==============

    CODE_21: {
        id: "code_21",
        number: 21,
        original_key: "Gene Key 21",
        visual_token: "⚔️",
        color_code: "#800000",
        title: "⚔️ 운명 코드 21번: 용맹한 지휘관",
        archetype: "The Commander",
        image_prompt: "A noble knight putting down his sword to shake hands",
        keywords: ["#권위", "#용맹", "#솔선수범"],
        dark_code: {
            name: "통제 (Control)",
            body_symptom: "어깨와 턱에 잔뜩 힘이 들어가고, 이를 꽉 깨무는 습관",
            desc: "내가 다 확인하지 않으면 불안하고, 남들이 내 방식대로 움직이지 않으면 화가 나시나요? 그것은 상황을 장악해야만 안전하다고 느끼는 두려움 때문입니다."
        },
        neural_code: {
            name: "권위 (Authority)",
            desc: "억지로 시키는 힘이 아니라, 내가 먼저 솔선수범할 때 저절로 따르게 만드는 리더십",
            action: "오늘 하루, 당신이 통제하려던 일 중 하나를 다른 사람에게 완전히 맡기세요. '당신을 믿습니다'라는 말 한마디가 당신의 진짜 권위를 세워줍니다."
        },
        meta_code: {
            name: "용맹 (Valour)",
            desc: "모든 것을 희생해서라도 사랑과 정의를 지키려는 기사도 정신. 당신은 군림하는 왕이 아니라, 가장 앞장서서 세상을 구하는 영웅입니다."
        }
    },

    CODE_23: {
        id: "code_23",
        number: 23,
        original_key: "Gene Key 23",
        visual_token: "🗝️",
        color_code: "#F0E68C",
        title: "🗝️ 운명 코드 23번: 연금술사",
        archetype: "The Alchemist",
        image_prompt: "A complex maze transforming into a straight golden path",
        keywords: ["#단순함", "#핵심", "#연금술"],
        dark_code: {
            name: "복잡함 (Complexity)",
            body_symptom: "편두통, 말이 꼬이거나 횡설수설하게 됨",
            desc: "머릿속이 엉킨 실타래처럼 복잡하고, 불안해서 말이 자꾸 많아지나요? 그것은 당신이 본질을 보지 못하고 껍데기(잡념)에 갇혀 있기 때문입니다."
        },
        neural_code: {
            name: "단순함 (Simplicity)",
            desc: "군더더기를 다 쳐내고, 문제의 핵심을 단 한 줄로 꿰뚫는 명쾌함",
            action: "지금 고민하고 있는 문제를 종이에 적어보세요. 그리고 가장 중요한 단어 3개만 남기고 다 지우세요."
        },
        meta_code: {
            name: "정수 (Quintessence)",
            desc: "납을 금으로 바꾸듯, 혼란스러운 세상 속에서 변하지 않는 진리를 추출해내는 힘. 당신의 입에서 나오는 말은 그냥 말이 아니라 보석입니다."
        }
    },

    CODE_24: {
        id: "code_24",
        number: 24,
        original_key: "Gene Key 24",
        visual_token: "🔄",
        color_code: "#000080",
        title: "🔄 운명 코드 24번: 침묵의 발명가",
        archetype: "The Inventor",
        image_prompt: "A spiral staircase leading up into a starry void",
        keywords: ["#발명", "#침묵", "#돌파"],
        dark_code: {
            name: "중독 (Addiction)",
            body_symptom: "같은 행동을 무의식적으로 반복함, 공허함을 채우려 폭식이나 쇼핑",
            desc: "나쁜 습관인 줄 알면서도 멈출 수가 없고, 같은 고민을 다람쥐 쳇바퀴 돌듯 반복하고 계신가요? 이것은 당신의 뇌가 '오래된 길'로 도피하고 있는 상태입니다."
        },
        neural_code: {
            name: "발명 (Invention)",
            desc: "반복되는 패턴의 틈새를 찾아내어 전혀 새로운 방식으로 삶을 재창조하는 힘",
            action: "습관을 아주 조금만 비트세요. 오른손잡이라면 왼손으로 양치질을 하고, 늘 가던 길 말고 다른 골목으로 집에 가세요."
        },
        meta_code: {
            name: "침묵 (Silence)",
            desc: "생각과 생각 사이, 완벽한 고요 속에서 우주의 소리를 듣는 상태. 당신의 침묵은 비어있는 것이 아니라, 무한한 가능성으로 꽉 차 있습니다."
        }
    },

    CODE_25: {
        id: "code_25",
        number: 25,
        original_key: "Gene Key 25",
        visual_token: "❤️‍🩹",
        color_code: "#DC143C",
        title: "❤️‍🩹 운명 코드 25번: 보편적 사랑",
        archetype: "The Mythic Heart",
        image_prompt: "A rose blooming in the middle of a snowy field",
        keywords: ["#사랑", "#수용", "#치유"],
        dark_code: {
            name: "수축 (Constriction)",
            body_symptom: "호흡이 얕아지고, 어깨가 앞으로 굽으며 가슴을 보호하려는 자세",
            desc: "상처받는 게 두려워 마음의 문을 닫고, 매사에 숨이 턱 막히는 기분이 드시나요? 당신의 심장은 더 크게 뛰고 싶은데, 두려움이 그 박동을 누르고 있습니다."
        },
        neural_code: {
            name: "수용 (Acceptance)",
            desc: "좋은 일이든 나쁜 일이든, 내게 오는 모든 것을 '손님'처럼 맞아들이는 태도",
            action: "오늘 하루, 당신에게 일어나는 모든 일(심지어 불운조차)에 '네, 알겠습니다'라고 말해보세요."
        },
        meta_code: {
            name: "보편적 사랑 (Universal Love)",
            desc: "나를 찌르는 가시조차 꽃의 일부임을 알고 사랑하는 성자의 마음. 당신의 피에는 우주의 사랑이 흐르고 있습니다."
        }
    },

    CODE_26: {
        id: "code_26",
        number: 26,
        original_key: "Gene Key 26",
        visual_token: "🦁",
        color_code: "#FFD700",
        title: "🦁 운명 코드 26번: 빛의 상인",
        archetype: "The Trickster",
        image_prompt: "A magician pulling infinite light out of a hat",
        keywords: ["#재능", "#영리함", "#겸손"],
        dark_code: {
            name: "자만심 (Pride)",
            body_symptom: "가슴을 과하게 펴고 목소리가 커짐, 인정받지 못하면 분노함",
            desc: "내가 이만큼 대단하다는 걸 증명하고 싶어 안달이 나거나, 남들을 조종해서 이득을 취하고 싶으신가요? 이것은 당신의 위대한 능력이 '에고'를 채우는 데에만 쓰이고 있다는 신호입니다."
        },
        neural_code: {
            name: "기교 (Artfulness)",
            desc: "자신의 재능을 이용하여 적은 노력으로 최대의 행복을 만들어내는 영리함",
            action: "자랑하고 싶은 마음을 '감사하는 마음'으로 바꾸세요. '나 이거 샀어!' 대신 '이걸 갖게 되어 정말 감사해'라고 말해보세요."
        },
        meta_code: {
            name: "보이지 않음 (Invisibility)",
            desc: "자신을 드러내지 않아도 세상이 알아서 움직이는 신의 경지. 당신은 바람과 같습니다. 보이지 않지만 모든 곳에 존재하며 영향을 미칩니다."
        }
    },

    CODE_27: {
        id: "code_27",
        number: 27,
        original_key: "Gene Key 27",
        visual_token: "🤱",
        color_code: "#FFCC00",
        title: "🤱 운명 코드 27번: 자애로운 어머니",
        archetype: "The Nurturer",
        image_prompt: "Hands cuping water to feed a thirsty plant",
        keywords: ["#돌봄", "#이타심", "#무아"],
        dark_code: {
            name: "이기심 (Selfishness)",
            body_symptom: "배가 차갑고 소화 불량, 줬는데 못 받았다는 생각에 억울함",
            desc: "남을 챙겨주면서도 속으로는 '나한테는 뭐 안 해주나?'라고 계산하거나, 내 잇속만 챙기느라 주변을 보지 못하고 계신가요?"
        },
        neural_code: {
            name: "이타주의 (Altruism)",
            desc: "나를 돌보는 힘으로 타인도 함께 돌보는 건강한 베풂",
            action: "오늘 누군가에게 작은 친절(커피 한 잔, 따뜻한 문자)을 베푸세요. 단, '익명'으로 하세요."
        },
        meta_code: {
            name: "무아 (Selflessness)",
            desc: "나와 남의 구분이 사라져, 타인을 돌보는 것이 곧 나를 돌보는 것임을 아는 상태. 당신은 세상의 어머니입니다."
        }
    },

    CODE_28: {
        id: "code_28",
        number: 28,
        original_key: "Gene Key 28",
        visual_token: "😈",
        color_code: "#2C3E50",
        title: "😈 운명 코드 28번: 불멸의 영웅",
        archetype: "The Hero",
        image_prompt: "A warrior standing fearless on the edge of a cliff",
        keywords: ["#용기", "#전체성", "#불멸"],
        dark_code: {
            name: "무목적 (Purposelessness)",
            body_symptom: "극심한 무기력증, 혹은 죽을 것 같은 공포감에 식은땀이 남",
            desc: "삶이 아무 의미가 없는 것 같고, '이렇게 살다 죽으면 끝인데'라는 생각에 허무하신가요? 당신은 죽음이 두려운 게 아니라, '제대로 살지 못하는 것'이 두려운 것입니다."
        },
        neural_code: {
            name: "전체성 (Totality)",
            desc: "내일 죽을 것처럼 오늘을 뜨겁게 사랑하고, 두려움 속으로 뛰어드는 용기",
            action: "평소라면 절대 하지 않았을, 당신을 약간 두렵게 만드는 일을 저지르세요. 두려움을 마주하고 통과할 때, 당신은 비로소 살아있음을 느낍니다."
        },
        meta_code: {
            name: "불멸 (Immortality)",
            desc: "삶과 죽음은 옷을 갈아입는 것일 뿐, 나의 영혼은 영원히 빛남을 깨닫는 상태. 당신은 죽지 않습니다."
        }
    },

    CODE_29: {
        id: "code_29",
        number: 29,
        original_key: "Gene Key 29",
        visual_token: "🌊",
        color_code: "#00CED1",
        title: "🌊 운명 코드 29번: 헌신의 파도",
        archetype: "The Devotee",
        image_prompt: "A diver jumping confidently into the deep blue ocean",
        keywords: ["#헌신", "#몰입", "#결단"],
        dark_code: {
            name: "반심 (Half-heartedness)",
            body_symptom: "다리가 천근만근 무거움, 자꾸 한숨을 쉬고 딴생각을 함",
            desc: "입으로는 '할게'라고 해놓고 마음은 콩밭에 가 있나요? 어중간한 태도는 실패보다 더 나쁩니다. 그것은 당신의 운명을 늪에 빠뜨립니다."
        },
        neural_code: {
            name: "몰입 (Commitment)",
            desc: "이왕 하기로 한 거라면, 뒤돌아보지 않고 온몸을 던져 뛰어드는 태도",
            action: "지금 하고 있는 일에 100%를 던지거나, 아니면 지금 당장 그만두세요. '예' 아니면 '아니오' 둘 중 하나만 선택하세요."
        },
        meta_code: {
            name: "헌신 (Devotion)",
            desc: "나의 심장을 바칠 만큼 사랑하는 대상을 만나, 그 안에서 완전히 녹아드는 황홀경. 당신의 삶은 거대한 사랑의 고백입니다."
        }
    },

    CODE_30: {
        id: "code_30",
        number: 30,
        original_key: "Gene Key 30",
        visual_token: "🔥",
        color_code: "#FF4500",
        title: "🔥 운명 코드 30번: 천상의 희열",
        archetype: "The Visionary",
        image_prompt: "A fire burning brightly but casting no smoke",
        keywords: ["#열정", "#희열", "#가벼움"],
        dark_code: {
            name: "욕망 (Desire)",
            body_symptom: "명치가 뜨겁게 타오르는 느낌, 갈증이 나고 안절부절못함",
            desc: "원하는 것을 갖지 못해 미칠 것 같고, 세상이 마음대로 안 돼서 괴로우신가요? 욕망에 목숨을 걸고 너무 심각해지는 순간 당신은 지옥불에 갇히게 됩니다."
        },
        neural_code: {
            name: "가벼움 (Lightness)",
            desc: "욕망을 억누르지 않되, 결과에 집착하지 않고 과정을 게임처럼 즐기는 유머 감각",
            action: "당신의 그 강렬한 욕망을 보며 한바탕 웃어버리세요. '와, 나 이거 진짜 갖고 싶구나!' 하고 인정하되, 심각해지지 마세요."
        },
        meta_code: {
            name: "황홀경 (Rapture)",
            desc: "모든 욕망이 신을 향한 사랑으로 승화되어, 숨 쉬는 것만으로도 쾌락을 느끼는 상태. 당신은 타오르는 불꽃입니다."
        }
    },

    // ============== 명심코드 BATCH 4 (CODE_31 ~ CODE_40) ==============

    CODE_31: {
        id: "code_31",
        number: 31,
        original_key: "Gene Key 31",
        visual_token: "🗣️",
        color_code: "#8E44AD",
        title: "🗣️ 운명 코드 31번: 리더의 목소리",
        archetype: "The Leader",
        image_prompt: "A person speaking to a crowd, their voice turning into birds",
        keywords: ["#리더십", "#겸손", "#영향력"],
        dark_code: {
            name: "오만 (Arrogance)",
            body_symptom: "턱을 치켜들고 상대를 내려다보게 됨, 목소리에 과한 힘이 들어감",
            desc: "남들이 내 말을 듣지 않으면 화가 나고, '내가 다 아는데'라며 상대를 무시하고 싶으신가요? 이것은 당신의 영향력이 올바른 통로를 찾지 못해, 에고를 방어하는 데에만 쓰이고 있다는 신호입니다."
        },
        neural_code: {
            name: "리더십 (Leadership)",
            desc: "내가 돋보이려는 마음을 버리고, 대중이 원하는 바를 대신 말해주는 대변자의 태도",
            action: "오늘 누군가를 설득하려 하지 마세요. 대신 '우리가 정말 원하는 게 뭘까?'라고 묻고, 그들의 마음을 당신의 입으로 정리해서 말해주세요."
        },
        meta_code: {
            name: "겸손 (Humility)",
            desc: "나는 그저 우주의 뜻을 전달하는 파이프일 뿐임을 아는 상태. 당신이 자신을 낮출수록 당신의 목소리는 천둥처럼 울려 퍼집니다."
        }
    },

    CODE_32: {
        id: "code_32",
        number: 32,
        original_key: "Gene Key 32",
        visual_token: "🌳",
        color_code: "#27AE60",
        title: "🌳 운명 코드 32번: 조상의 지혜",
        archetype: "The Steward",
        image_prompt: "An ancient tree grafting a new branch onto its trunk",
        keywords: ["#보존", "#지혜", "#뿌리"],
        dark_code: {
            name: "실패 (Failure)",
            body_symptom: "돈이나 지위를 잃을까 봐 위장이 조여오는 긴장감",
            desc: "성공하지 못할까 봐, 혹은 지금 가진 것을 잃을까 봐 전전긍긍하고 계신가요? 그것은 당신이 '진짜 소중한 것'이 무엇인지 잊어버렸기 때문입니다."
        },
        neural_code: {
            name: "보존 (Preservation)",
            desc: "오래된 지혜 위에 새로운 기술을 접목하여 더 가치 있는 것을 만들어내는 안목",
            action: "당장 눈앞의 이익을 쫓지 말고, '10년 뒤에도 남을 가치'가 무엇인지 생각하세요. 옛것에 새것을 딱 하나만 더해보세요."
        },
        meta_code: {
            name: "숭배 (Veneration)",
            desc: "모든 생명 속에 흐르는 조상의 숨결과 신성함을 알아보고 고개 숙이는 상태. 당신은 과거와 미래를 잇는 거대한 다리입니다."
        }
    },

    CODE_33: {
        id: "code_33",
        number: 33,
        original_key: "Gene Key 33",
        visual_token: "🧘‍♂️",
        color_code: "#34495E",
        title: "🧘‍♂️ 운명 코드 33번: 은둔의 현자",
        archetype: "The Sage",
        image_prompt: "A quiet cave filled with scrolls and glowing crystals",
        keywords: ["#침묵", "#마음챙김", "#계시"],
        dark_code: {
            name: "망각 (Forgetting)",
            body_symptom: "정신이 산만하고, 같은 실수를 반복하며 빙빙 도는 느낌",
            desc: "과거의 교훈을 잊어버리고 또다시 불 속에 뛰어드는 불나방처럼 살고 계신가요? 멈추지 않으면 길을 잃습니다."
        },
        neural_code: {
            name: "마음챙김 (Mindfulness)",
            desc: "세상과 단절하고 홀로 침묵 속에 머물며, 경험을 지혜로 숙성시키는 시간",
            action: "지금 당장 모든 알림을 끄고 20분만 혼자 있으세요. 아무것도 하지 말고 멍하니 지난 일을 영화처럼 되감기 해보세요."
        },
        meta_code: {
            name: "계시 (Revelation)",
            desc: "침묵의 끝에서 우주의 비밀이 섬광처럼 터져 나오는 깨달음의 순간. 당신이 입을 다물 때, 우주가 당신에게 말을 건넸습니다."
        }
    },

    CODE_34: {
        id: "code_34",
        number: 34,
        original_key: "Gene Key 34",
        visual_token: "🦍",
        color_code: "#C0392B",
        title: "🦍 운명 코드 34번: 야수의 힘",
        archetype: "The Giant",
        image_prompt: "A gentle giant lifting a heavy rock with one finger",
        keywords: ["#힘", "#효율", "#장엄"],
        dark_code: {
            name: "강제 (Force)",
            body_symptom: "온몸의 근육이 긴장되고, 억지로 밀어붙이느라 진이 빠짐",
            desc: "내 뜻대로 안 되면 힘으로라도 밀어붙이려 하시나요? 힘을 쓰면 쓸수록 상황이 꼬인다면, 당신은 지금 자연의 흐름을 거스르고 있는 것입니다."
        },
        neural_code: {
            name: "힘 (Strength)",
            desc: "불필요한 동작을 없애고, 정확한 타이밍에 최소한의 힘으로 움직이는 효율성",
            action: "애쓰지 마세요. 몸이 저절로 움직일 때까지 기다리세요. 진짜 힘은 힘을 뺄 때 나옵니다. 춤추듯이 부드럽게 행동하세요."
        },
        meta_code: {
            name: "장엄 (Majesty)",
            desc: "존재하는 것만으로도 주변을 압도하는 고요하고 거대한 산 같은 기운. 당신이 곧 힘이기 때문입니다."
        }
    },

    CODE_35: {
        id: "code_35",
        number: 35,
        original_key: "Gene Key 35",
        visual_token: "🚀",
        color_code: "#E67E22",
        title: "🚀 운명 코드 35번: 위대한 모험가",
        archetype: "The Adventurer",
        image_prompt: "A portal opening to a new world in the middle of a desert",
        keywords: ["#모험", "#경험", "#무한"],
        dark_code: {
            name: "굶주림 (Hunger)",
            body_symptom: "가슴에 구멍이 뚫린 듯한 공허함, 안절부절못하며 서성거림",
            desc: "새로운 것을 찾아 헤매지만, 막상 얻고 나면 금방 시들해져 또 다른 것을 찾아 떠나시나요? 당신은 지금 경험이 아니라 '도파민'을 쫓고 있을 뿐입니다."
        },
        neural_code: {
            name: "모험 (Adventure)",
            desc: "결과에 상관없이, 그 일을 하는 과정 자체를 가슴 뛰는 여행으로 즐기는 태도",
            action: "무엇을 얻으려 하지 말고, 누구와 함께할지를 생각하세요. 경험을 소유하지 말고 공유하세요."
        },
        meta_code: {
            name: "무한 (Boundlessness)",
            desc: "삶이라는 모험에는 끝이 없음을 알고, 날개를 활짝 펴고 우주를 유영하는 자유. 모든 순간이 기적 같은 여행입니다."
        }
    },

    CODE_36: {
        id: "code_36",
        number: 36,
        original_key: "Gene Key 36",
        visual_token: "⛈️",
        color_code: "#5D6D7E",
        title: "⛈️ 운명 코드 36번: 감정의 치유사",
        archetype: "The Human",
        image_prompt: "A dark storm clearing to reveal a brilliant rainbow",
        keywords: ["#감정", "#인류애", "#연민"],
        dark_code: {
            name: "격동 (Turbulence)",
            body_symptom: "롤러코스터를 탄 듯 감정 기복이 심하고, 속이 울렁거림",
            desc: "갑자기 밀려오는 슬픔이나 불안 때문에 일상생활이 힘드신가요? 당신은 고장 난 게 아니라 너무 깊게 느끼는 것입니다."
        },
        neural_code: {
            name: "인류애 (Humanity)",
            desc: "어두운 감정을 피하지 않고, 그것을 끌어안아 타인을 이해하는 재료로 쓰는 마음",
            action: "우울하거나 화가 날 때 도망치지 마세요. 그 감정에게 '어서 와, 많이 아팠지?'라고 말을 걸어주세요."
        },
        meta_code: {
            name: "연민 (Compassion)",
            desc: "타인의 고통을 내 것처럼 느끼며 함께 울어주는 보살의 마음. 당신의 눈물은 세상을 씻어내는 성수입니다."
        }
    },

    CODE_37: {
        id: "code_37",
        number: 37,
        original_key: "Gene Key 37",
        visual_token: "👨‍👩‍👧‍👦",
        color_code: "#F1948A",
        title: "👨‍👩‍👧‍👦 운명 코드 37번: 가족의 수호자",
        archetype: "The Family",
        image_prompt: "A warm hearth fire with people gathering around holding hands",
        keywords: ["#가족", "#평등", "#다정함"],
        dark_code: {
            name: "나약함 (Weakness)",
            body_symptom: "어깨가 처지고 에너지가 고갈됨, 피해자가 된 듯한 억울함",
            desc: "가족이나 조직을 위해 희생만 하다가 지쳐버렸나요? 당신의 따뜻함은 약점이 아니라 가장 큰 무기입니다."
        },
        neural_code: {
            name: "평등 (Equality)",
            desc: "누구도 희생하지 않고, 서로 부족한 점을 채워주며 둥글게 어우러지는 조화",
            action: "당신이 다 하려고 하지 마세요. '내가 할게' 대신 '우리 같이 할까?'라고 말하세요."
        },
        meta_code: {
            name: "다정함 (Tenderness)",
            desc: "강한 것이 살아남는 게 아니라, 부드러운 것이 세상을 품는다는 진리. 당신의 따뜻한 포옹 한 번이 백 마디 훈계보다 강합니다."
        }
    },

    CODE_38: {
        id: "code_38",
        number: 38,
        original_key: "Gene Key 38",
        visual_token: "🛡️",
        color_code: "#17202A",
        title: "🛡️ 운명 코드 38번: 빛의 전사",
        archetype: "The Warrior",
        image_prompt: "A lone warrior standing firm against a dark tide",
        keywords: ["#인내", "#명예", "#전사"],
        dark_code: {
            name: "투쟁 (Struggle)",
            body_symptom: "온몸에 아드레날린이 솟구쳐 싸우고 싶거나, 반대로 녹초가 됨",
            desc: "세상이 온통 적으로 보이고, 살아남기 위해 매일 전쟁을 치르는 기분인가요? 당신의 소중한 에너지를 쉐도우 복싱 하는 데 낭비하지 마세요."
        },
        neural_code: {
            name: "인내 (Perseverance)",
            desc: "사소한 싸움은 피하고, 내 영혼이 옳다고 믿는 단 하나의 목표를 위해 끝까지 버티는 힘",
            action: "지금 싸우고 있는 대상이 당신의 인생을 걸만큼 중요한가요? 아니라면 뒤로 물러나세요."
        },
        meta_code: {
            name: "명예 (Honour)",
            desc: "승패와 상관없이 자신의 신념을 지킨 자에게 주어지는 영광. 당신은 사랑을 위해 칼을 든 성스러운 기사입니다."
        }
    },

    CODE_39: {
        id: "code_39",
        number: 39,
        original_key: "Gene Key 39",
        visual_token: "🌋",
        color_code: "#C0392B",
        title: "🌋 운명 코드 39번: 해방의 다이너마이트",
        archetype: "The Liberator",
        image_prompt: "A volcano erupting, breaking chains of rock",
        keywords: ["#역동성", "#해방", "#활력"],
        dark_code: {
            name: "도발 (Provocation)",
            body_symptom: "가만히 있지 못하고 누군가를 쿡쿡 찌르고 싶은 충동, 턱에 힘이 들어감",
            desc: "심심해서 남을 놀리거나, 말로 상처를 줘서 반응을 보고 싶으신가요? 당신의 에너지는 꽉 막힌 곳을 뚫어주는 폭탄인데, 지금은 아무 데나 던지고 있습니다."
        },
        neural_code: {
            name: "역동성 (Dynamism)",
            desc: "정체된 상황에 파문을 일으켜 새로운 에너지의 흐름을 만들어내는 활력",
            action: "남을 자극하지 말고, 정체된 당신의 몸을 자극하세요. 춤을 추거나 전력 질주를 하거나 노래를 부르세요."
        },
        meta_code: {
            name: "해방 (Liberation)",
            desc: "자신과 타인을 옥죄던 모든 사슬을 끊어내고, 완전한 자유를 선물하는 구원자. 당신이 지나간 자리에는 자유의 바람이 봅니다."
        }
    },

    CODE_40_FULL: {
        id: "code_40_full",
        number: 40,
        original_key: "Gene Key 40",
        visual_token: "⛩️",
        color_code: "#F4D03F",
        title: "⛩️ 운명 코드 40번: 의지의 연금술",
        archetype: "The Father",
        image_prompt: "A person sitting peacefully on a throne, putting down a heavy burden",
        keywords: ["#의지", "#휴식", "#단호함"],
        dark_code: {
            name: "고갈 (Exhaustion)",
            body_symptom: "눈이 퀭하고 온몸이 물에 젖은 솜처럼 무거움, 억울한 마음이 듦",
            desc: "거절을 못 해서 남의 일까지 떠맡다가 완전히 방전되셨나요? 지금 당신에게 필요한 건 '노력'이 아니라 '멈춤'입니다."
        },
        neural_code: {
            name: "결단적 의지 (Resolve)",
            desc: "나의 에너지를 보호하기 위해 단호하게 선을 긋고 '아니오'라고 말하는 용기",
            action: "오늘 부탁받는 일 중 하나는 반드시 거절하세요. '오늘은 쉬고 싶어요'라고 말하세요. 휴식도 일입니다."
        },
        meta_code: {
            name: "신성한 의지 (Divine Will)",
            desc: "내가 애쓰지 않아도, 우주가 나를 통해 완벽하게 일하는 무위(無爲)의 경지. 펜을 내려놓으세요. 당신이 쉬는 동안 신이 일합니다."
        }
    },

    // ============== 명심코드 BATCH 5 (CODE_41 ~ CODE_50) ==============

    CODE_41: {
        id: "code_41",
        number: 41,
        original_key: "Gene Key 41",
        visual_token: "🎬",
        color_code: "#8E44AD",
        title: "🎬 운명 코드 41번: 꿈의 기원",
        archetype: "The Prime Mover",
        image_prompt: "A single drop of ink falling into water, creating infinite ripples",
        keywords: ["#시작", "#기대", "#창조"],
        dark_code: {
            name: "판타지 (Fantasy)",
            body_symptom: "현실 감각이 없고 붕 뜬 느낌, 자꾸 딴생각을 하느라 눈의 초점이 흐려짐",
            desc: "지금 있는 곳이 아닌 다른 곳에 가면 행복할 것 같고, '이것만 아니면 될 텐데'라며 끊임없이 현실 도피를 하고 계신가요? 당신은 꿈을 꾸는 게 아니라 꿈에 갇힌 것입니다."
        },
        neural_code: {
            name: "기대 (Anticipation)",
            desc: "막연한 망상을 멈추고, 에너지를 한곳으로 모아 '시작'하는 설렘",
            action: "머릿속의 수만 가지 시나리오를 다 지우세요. 지금 당장 할 수 있는 가장 작은 '첫 번째 스텝' 하나만 실행하세요. 시작이 전부입니다."
        },
        meta_code: {
            name: "방사 (Emanation)",
            desc: "당신이 상상하는 즉시 현실이 창조되는 신성한 상태. 당신은 우주의 펜 끝입니다. 당신이 움직이면 새로운 역사가 쓰입니다."
        }
    },

    CODE_42: {
        id: "code_42",
        number: 42,
        original_key: "Gene Key 42",
        visual_token: "🔚",
        color_code: "#2ECC71",
        title: "🔚 운명 코드 42번: 끝맺음의 미학",
        archetype: "The Finisher",
        image_prompt: "Leaves falling gracefully from a tree in autumn to make way for spring",
        keywords: ["#마무리", "#초연함", "#축제"],
        dark_code: {
            name: "기대 (Expectation)",
            body_symptom: "위장이 꽉 막힌 듯 답답하고, 한숨이 계속 나옴",
            desc: "이미 끝난 인연이나 일을 놓지 못해 질질 끌고 계신가요? '이렇게 되어야만 해'라는 기대가 클수록 실망은 커집니다."
        },
        neural_code: {
            name: "초연함 (Detachment)",
            desc: "결과를 통제하려는 마음을 버리고, 과정의 끝을 축복하며 보내주는 태도",
            action: "지금 당신을 힘들게 하는 것과 의식적인 작별 인사를 하세요. '그동안 고마웠어, 이제 안녕'이라고 소리 내어 말하세요."
        },
        meta_code: {
            name: "축제 (Celebration)",
            desc: "삶과 죽음, 만남과 헤어짐의 모든 순환을 웃으며 즐기는 상태. 당신의 삶은 끝없는 축제입니다."
        }
    },

    CODE_43: {
        id: "code_43",
        number: 43,
        original_key: "Gene Key 43",
        visual_token: "💡",
        color_code: "#F1C40F",
        title: "💡 운명 코드 43번: 돌파하는 통찰",
        archetype: "The Rebel",
        image_prompt: "A lightning bolt striking a rock, cracking it open to reveal gold",
        keywords: ["#통찰", "#독창성", "#현현"],
        dark_code: {
            name: "귀머거리 (Deafness)",
            body_symptom: "귀가 먹먹하거나 이명 현상, 두통, 남의 말이 소음처럼 들림",
            desc: "남들이 내 말을 못 알아듣는 것 같아 답답하고, 세상이 나를 왕따시키는 기분이 드시나요? 당신의 주파수가 남들과 너무 달라서 생기는 잡음일 뿐입니다."
        },
        neural_code: {
            name: "통찰 (Insight)",
            desc: "남들의 이해를 구하지 않고, 내 내면에서 들려오는 독창적인 목소리를 신뢰하는 힘",
            action: "설명하려 하지 마세요. 당신의 엉뚱하고 기발한 아이디어를 그냥 혼자서 기록하거나 만들어보세요."
        },
        meta_code: {
            name: "현현 (Epiphany)",
            desc: "생각하지 않아도 그냥 '아는' 상태. 당신의 존재 자체가 세상에 충격을 주는 깨달음의 번개입니다."
        }
    },

    CODE_44: {
        id: "code_44",
        number: 44,
        original_key: "Gene Key 44",
        visual_token: "🧬",
        color_code: "#E67E22",
        title: "🧬 운명 코드 44번: 카르마의 패턴",
        archetype: "The Weaver",
        image_prompt: "Intricate geometric patterns connecting different people like a web",
        keywords: ["#카르마", "#팀워크", "#인연"],
        dark_code: {
            name: "간섭 (Interference)",
            body_symptom: "목덜미가 뻣뻣하고, 특정 사람만 보면 이유 없이 화가 나거나 불안함",
            desc: "자꾸만 비슷한 유형의 '나쁜 사람'이 꼬이거나, 과거의 실패했던 인간관계 패턴이 반복되고 있나요? 아직 풀지 못한 과거의 숙제(카르마)가 신호를 보내는 것입니다."
        },
        neural_code: {
            name: "팀워크 (Teamwork)",
            desc: "나쁜 인연은 정리하고, 나를 알아봐 주는 영혼의 단짝을 알아보는 눈",
            action: "휴대폰 연락처에서 당신을 힘들게 하거나 에너지를 뺏는 사람의 번호를 지금 당장 차단하세요. 빈자리를 만들어야 진짜 내 편이 들어옵니다."
        },
        meta_code: {
            name: "공동통치 (Synarchy)",
            desc: "모든 인류가 거대한 퍼즐 조각처럼 완벽하게 맞물려 돌아가는 우주의 질서. 당신을 돕기 위해 우주가 보낸 어벤져스 팀이 기다리고 있습니다."
        }
    },

    CODE_45: {
        id: "code_45",
        number: 45,
        original_key: "Gene Key 45",
        visual_token: "💰",
        color_code: "#D4AF37",
        title: "💰 운명 코드 45번: 우주의 제왕",
        archetype: "The King/Queen",
        image_prompt: "A king distributing gold coins to the people with open hands",
        keywords: ["#풍요", "#시너지", "#베풂"],
        dark_code: {
            name: "지배 (Dominance)",
            body_symptom: "가슴이 답답하고 숨이 참, 돈을 쓸 때마다 손이 떨림",
            desc: "가진 것을 잃을까 봐 두려워 꽉 쥐고 있거나, 사람들을 내 마음대로 조종해야 안심이 되시나요? 당신은 왕이 아니라 감옥에 갇힌 간수일 뿐입니다."
        },
        neural_code: {
            name: "시너지 (Synergy)",
            desc: "나 혼자 다 갖는 게 아니라, 자원을 순환시켜 더 큰 파이를 만드는 지혜",
            action: "오늘 당신이 가진 것을 주변 사람들에게 조건 없이 쏘세요. '내가 낼게!'라고 말해보세요. 베풀 때 당신의 '그릇'이 커집니다."
        },
        meta_code: {
            name: "성찬 (Communion)",
            desc: "모든 재화와 에너지가 막힘없이 흐르는 풍요의 바다. 돈이 당신을 따르게 만드는 주인입니다."
        }
    },

    CODE_46: {
        id: "code_46",
        number: 46,
        original_key: "Gene Key 46",
        visual_token: "💃",
        color_code: "#FF69B4",
        title: "💃 운명 코드 46번: 육체의 축복",
        archetype: "The Ecstatic",
        image_prompt: "A person dancing in the rain, water droplets glowing",
        keywords: ["#기쁨", "#황홀경", "#몸"],
        dark_code: {
            name: "심각함 (Seriousness)",
            body_symptom: "관절이 뻣뻣하고 얼굴 표정이 굳어짐, 이유 없는 만성 통증",
            desc: "인생을 너무 진지한 숙제처럼 풀고 계신가요? 당신의 영혼은 지금 메마르고 있습니다. 몸을 무시하면 운도 막힙니다."
        },
        neural_code: {
            name: "기쁨 (Delight)",
            desc: "머리의 걱정을 끄고, 지금 이 순간 내 몸이 느끼는 감각을 만끽하는 태도",
            action: "아무도 없는 곳에서 좋아하는 음악을 틀고 미친 사람처럼 춤을 추세요. 당신의 세포가 깨어날 때, 행운이 찾아옵니다."
        },
        meta_code: {
            name: "황홀경 (Ecstasy)",
            desc: "살아있음 그 자체에 감전된 듯 전율하는 상태. 당신의 몸은 신이 거주하는 사원입니다."
        }
    },

    CODE_47: {
        id: "code_47",
        number: 47,
        original_key: "Gene Key 47",
        visual_token: "🏺",
        color_code: "#5D6D7E",
        title: "🏺 운명 코드 47번: 연금술의 항아리",
        archetype: "The Alchemist",
        image_prompt: "A dark lead mask cracking to reveal a golden face underneath",
        keywords: ["#변형", "#변용", "#연금술"],
        dark_code: {
            name: "억압 (Oppression)",
            body_symptom: "머리를 짓누르는 듯한 압박감, 명치가 꽉 막혀 소화가 안 됨",
            desc: "과거의 끔찍한 기억이나 실패가 유령처럼 따라다니며 당신을 괴롭히나요? 당신은 지금 거대한 변화를 앞두고, 낡은 자아를 태우는 용광로 속에 들어와 있는 것입니다."
        },
        neural_code: {
            name: "변형 (Transmutation)",
            desc: "고통을 피하지 않고 정면으로 마주하여, 그것을 성장의 연료로 태워버리는 용기",
            action: "괴로운 감정이 들 때 그 감정을 그림으로 그리거나 글로 마구 휘갈겨 쓰세요. 고통을 밖으로 꺼내서 바라보는 순간, 그것은 예술이 됩니다."
        },
        meta_code: {
            name: "변용 (Transfiguration)",
            desc: "납이 금으로 변하듯, 당신의 가장 깊은 상처가 가장 빛나는 훈장이 되는 기적. 당신은 고통을 빛으로 바꾸는 마법사입니다."
        }
    },

    CODE_48: {
        id: "code_48",
        number: 48,
        original_key: "Gene Key 48",
        visual_token: "🕳️",
        color_code: "#283747",
        title: "🕳️ 운명 코드 48번: 지혜의 우물",
        archetype: "The Well",
        image_prompt: "A bucket being lowered into a deep, dark well with sparkling water",
        keywords: ["#지혜", "#임기응변", "#깊이"],
        dark_code: {
            name: "부적절함 (Inadequacy)",
            body_symptom: "손발이 차갑고 식은땀이 남, 대중 앞에서 머리가 하얘짐",
            desc: "아직 준비가 덜 된 것 같고, '나 같은 게 뭘'이라며 자꾸 뒤로 물러나시나요? 당신은 부족한 게 아니라, 자신의 깊이를 모르는 것입니다."
        },
        neural_code: {
            name: "임기응변 (Resourcefulness)",
            desc: "준비되지 않아도, 닥치면 내 안에서 답이 나올 거라 믿고 뛰어드는 배짱",
            action: "완벽하게 준비될 때까지 기다리지 마세요. 그냥 저지르세요. 당신을 믿으세요."
        },
        meta_code: {
            name: "지혜 (Wisdom)",
            desc: "배워서 아는 것이 아니라, 샘물처럼 저절로 솟아나는 태초의 앎. 당신의 내면에는 마르지 않는 지혜의 바다가 있습니다."
        }
    },

    CODE_49: {
        id: "code_49",
        number: 49,
        original_key: "Gene Key 49",
        visual_token: "🌪️",
        color_code: "#C0392B",
        title: "🌪️ 운명 코드 49번: 혁명의 불꽃",
        archetype: "The Catalyst",
        image_prompt: "Old chains breaking apart, revealing glowing skin underneath",
        keywords: ["#혁명", "#재탄생", "#변화"],
        dark_code: {
            name: "반동 (Reaction)",
            body_symptom: "얼굴이 붉어지고 욱하는 성질, 가슴이 두근거리며 거부 반응",
            desc: "내 뜻에 맞지 않으면 즉각적으로 손절하거나, 감정적으로 폭발해서 판을 엎어버리고 싶으신가요? 당신은 변화를 만드는 게 아니라 단지 화풀이를 하고 있을 뿐입니다."
        },
        neural_code: {
            name: "혁명 (Revolution)",
            desc: "감정적인 반발을 멈추고, 낡은 규칙을 뜯어고쳐 모두를 위한 새로운 질서를 만드는 힘",
            action: "화가 날 때 사람을 공격하지 말고, '시스템'을 공격하세요. 파괴가 아닌 개선이 진짜 혁명입니다."
        },
        meta_code: {
            name: "재탄생 (Rebirth)",
            desc: "낡은 세상은 가고, 사랑과 조화에 기초한 새로운 세상이 열리는 순간. 당신은 세상을 정화하는 거룩한 불꽃입니다."
        }
    },

    CODE_50: {
        id: "code_50",
        number: 50,
        original_key: "Gene Key 50",
        visual_token: "⚖️",
        color_code: "#AF7AC5",
        title: "⚖️ 운명 코드 50번: 우주의 조화",
        archetype: "The Weaver",
        image_prompt: "A perfectly balanced scale floating in the cosmos",
        keywords: ["#조화", "#평형", "#균형"],
        dark_code: {
            name: "부패 (Corruption)",
            body_symptom: "소화 불량, 배에 가스가 차고 몸의 밸런스가 무너짐",
            desc: "평화를 깨기 싫어서 알면서도 눈감아주거나, 남들의 비위를 맞추느라 내 원칙을 어기고 있나요? 조화는 무조건 참는 게 아니라, 틀린 것을 바로잡는 용기에서 옵니다."
        },
        neural_code: {
            name: "평형 (Equilibrium)",
            desc: "어느 한쪽으로 치우치지 않고, 냉철하게 중심을 잡아 그룹의 질서를 세우는 힘",
            action: "오늘 당신의 '핵심 가치' 하나를 정하세요. 그리고 무슨 일이 있어도 그것만큼은 타협하지 마세요."
        },
        meta_code: {
            name: "조화 (Harmony)",
            desc: "모든 악기 소리가 어우러져 완벽한 교향곡을 연주하는 상태. 당신은 우주의 지휘자입니다. 당신의 존재가 세상의 균형을 맞춥니다."
        }
    },

    // ============== 명심코드 BATCH 6 (CODE_51 ~ CODE_64) - FINAL ==============

    CODE_51: {
        id: "code_51",
        number: 51,
        original_key: "Gene Key 51",
        visual_token: "⚡",
        color_code: "#F1C40F",
        title: "⚡ 운명 코드 51번: 번개의 각성",
        archetype: "The Thunderbolt",
        image_prompt: "A lightning bolt striking the ground, waking up a sleeping giant",
        keywords: ["#각성", "#주도권", "#충격"],
        dark_code: {
            name: "동요 (Agitation)",
            body_symptom: "가만히 있지 못하고 안절부절못함, 심장이 불규칙하게 뜀",
            desc: "갑작스러운 사건이나 변화 때문에 충격을 받고, 마음이 진정되지 않아 불안하신가요? 당신의 영혼이 잠에서 깨어나려고 '알람'을 울리고 있는 중입니다."
        },
        neural_code: {
            name: "주도권 (Initiative)",
            desc: "남이 시켜서 하는 게 아니라, 내가 먼저 판을 흔들고 앞장서는 용기",
            action: "충격을 두려워하지 말고, 당신이 먼저 충격을 주세요. 기다리지 말고 먼저 전화하고, 먼저 제안하고, 먼저 시작하세요."
        },
        meta_code: {
            name: "각성 (Awakening)",
            desc: "마른하늘의 날벼락처럼, 에고의 잠에서 깨어나 진정한 나를 만나는 순간. 당신은 잠든 세상을 깨우는 알람시계입니다."
        }
    },

    CODE_52: {
        id: "code_52",
        number: 52,
        original_key: "Gene Key 52",
        visual_token: "⛰️",
        color_code: "#2E4053",
        title: "⛰️ 운명 코드 52번: 고요한 산",
        archetype: "The Mountain",
        image_prompt: "A massive mountain standing still amidst a swirling storm",
        keywords: ["#고요", "#자제력", "#멈춤"],
        dark_code: {
            name: "스트레스 (Stress)",
            body_symptom: "아드레날린 과다로 몸이 굳음, 숨이 가쁘고 압박감이 심함",
            desc: "할 일은 많은데 몸이 따라주지 않아 답답하고, 쫓기는 기분 때문에 숨이 막히시나요? 이것은 당신이 멈춰야 할 때 움직이려 하기 때문입니다."
        },
        neural_code: {
            name: "자제력 (Restraint)",
            desc: "조급함을 누르고, 올바른 때가 올 때까지 태산처럼 멈춰 서 있는 힘",
            action: "모든 활동을 멈추고 5분만 바닥에 누우세요. '나는 산이다'라고 세 번 말하세요. 멈춤이 곧 전진입니다."
        },
        meta_code: {
            name: "고요 (Stillness)",
            desc: "세상의 모든 움직임이 멈추고, 오직 존재만이 남은 완벽한 정적. 당신의 침묵 속에서 우주의 심장 소리가 들립니다."
        }
    },

    CODE_53: {
        id: "code_53",
        number: 53,
        original_key: "Gene Key 53",
        visual_token: "🚂",
        color_code: "#C0392B",
        title: "🚂 운명 코드 53번: 성장의 엔진",
        archetype: "The Starter",
        image_prompt: "A steam engine breaking through a wall, leaving flowers behind",
        keywords: ["#확장", "#성장", "#풍요"],
        dark_code: {
            name: "미성숙 (Immaturity)",
            body_symptom: "시작만 하고 끝을 못 냄, 금방 싫증을 느끼고 산만함",
            desc: "의욕적으로 시작했다가 금방 시들해져서 '난 끈기가 없어'라고 자책하시나요? 당신은 너무 많은 시작을 동시에 하느라 에너지가 분산된 것입니다."
        },
        neural_code: {
            name: "확장 (Expansion)",
            desc: "결과에 연연하지 않고, 성장하는 과정 자체를 즐기며 뻗어 나가는 힘",
            action: "'성공해야지'라고 생각하지 말고 '이걸 하면 내가 얼마나 더 커질까?'라고 질문하세요. 성공이 아닌 성장을 목표로 삼으세요."
        },
        meta_code: {
            name: "초월적 풍요 (Superabundance)",
            desc: "존재만으로도 주변을 풍요롭게 만들고, 끝없이 넘쳐흐르는 생명력. 당신이 지나간 자리마다 생명의 꽃이 핍니다."
        }
    },

    CODE_54: {
        id: "code_54",
        number: 54,
        original_key: "Gene Key 54",
        visual_token: "🐍",
        color_code: "#27AE60",
        title: "🐍 운명 코드 54번: 야망의 사다리",
        archetype: "The Serpent Path",
        image_prompt: "A serpent transforming into a dragon and flying to heaven",
        keywords: ["#열망", "#승천", "#야망"],
        dark_code: {
            name: "탐욕 (Greed)",
            body_symptom: "목이 마르고, 아무리 가져도 채워지지 않는 허기짐",
            desc: "성공하고 싶고, 돈을 벌고 싶은 욕망이 부끄러우신가요? 당신의 야망은 죄가 아닙니다. 단지 그 에너지가 '나 혼자'만을 향해 흐르고 있어서 막힌 것뿐입니다."
        },
        neural_code: {
            name: "열망 (Aspiration)",
            desc: "개인의 성공을 넘어, 더 높은 가치와 공동체를 위해 에너지를 쓰는 상태",
            action: "당신의 성공 목표에 '타인'을 포함시키세요. '돈을 벌어 우리 팀을 살리자'로 주어만 바꿔보세요. 탐욕은 거룩한 비전이 됩니다."
        },
        meta_code: {
            name: "승천 (Ascension)",
            desc: "물질적 욕망이 영적인 깨달음으로 승화되어 하늘에 닿는 경지. 당신은 뱀이 용이 되어 날아오르는 순간입니다."
        }
    },

    CODE_55_FULL: {
        id: "code_55_full",
        number: 55,
        original_key: "Gene Key 55",
        visual_token: "🦋",
        color_code: "#AF7AC5",
        title: "🦋 운명 코드 55번: 자유의 날개",
        archetype: "The Dragonfly",
        image_prompt: "A dragonfly breaking out of a muddy cocoon into iridescent light",
        keywords: ["#자유", "#창조자", "#해방"],
        dark_code: {
            name: "피해의식 (Victimization)",
            body_symptom: "가슴이 답답하고 억울해서 자꾸 눈물이 남",
            desc: "세상이 나를 괴롭히는 것 같고, 내 힘으로는 아무것도 할 수 없다는 무력감에 빠져 계신가요? 당신은 스스로 감옥을 짓고 열쇠를 밖으로 던진 셈입니다."
        },
        neural_code: {
            name: "자유 (Freedom)",
            desc: "외부 상황은 바꿀 수 없어도, 내 태도는 바꿀 수 있음을 아는 진정한 자유",
            action: "지금 당장 불평을 멈추고 '나는 피해자가 아니다, 나는 창조자다'라고 선언하세요. 상황을 탓하는 것을 멈추는 순간, 감옥 문이 열립니다."
        },
        meta_code: {
            name: "자유 (Freedom)",
            desc: "어떤 것에도 얽매이지 않고 바람처럼 자유롭게 춤추는 영혼의 상태. 당신은 진흙 속에서 피어난 연꽃입니다."
        }
    },

    CODE_56: {
        id: "code_56",
        number: 56,
        original_key: "Gene Key 56",
        visual_token: "🎭",
        color_code: "#E67E22",
        title: "🎭 운명 코드 56번: 신성한 이야기꾼",
        archetype: "The Storyteller",
        image_prompt: "A jester juggling colorful balls that turn into stars",
        keywords: ["#풍요로움", "#이야기", "#취함"],
        dark_code: {
            name: "산만함 (Distraction)",
            body_symptom: "눈동자가 흔들리고, 오감을 자극하는 것에 과도하게 집착함",
            desc: "잠시도 가만히 있지 못하고, 스마트폰이나 자극적인 재미를 찾아 계속 헤매고 계신가요? 그것은 즐거움이 아니라 마취제일 뿐입니다."
        },
        neural_code: {
            name: "풍요로움 (Enrichment)",
            desc: "모든 경험을 삶을 풍요롭게 만드는 이야기 재료로 삼는 태도",
            action: "지루함이나 고통을 '재미있는 이야기'로 만들어보세요. '옛날에 산만한 남자가 살았는데...'라고 시작해 보세요. 삶은 고통이 아니라 예능입니다."
        },
        meta_code: {
            name: "취함 (Intoxication)",
            desc: "술이 아니라 삶 그 자체에 취해, 매 순간을 축복으로 여기는 상태. 당신의 웃음소리가 세상을 정화합니다."
        }
    },

    CODE_57: {
        id: "code_57",
        number: 57,
        original_key: "Gene Key 57",
        visual_token: "🌬️",
        color_code: "#85C1E9",
        title: "🌬️ 운명 코드 57번: 직관의 바람",
        archetype: "The Wind",
        image_prompt: "A gentle breeze guiding a feather through a storm",
        keywords: ["#직관", "#명료함", "#본능"],
        dark_code: {
            name: "불안 (Unease)",
            body_symptom: "이유 없이 몸이 떨리거나 소리에 예민해짐, 막연한 공포감",
            desc: "미래에 무슨 일이 일어날까 봐 끊임없이 걱정하고 계신가요? 이 불안은 당신이 너무 예민해서 미래의 진동을 미리 감지하기 때문입니다."
        },
        neural_code: {
            name: "직관 (Intuition)",
            desc: "생각하지 않고, 찰나의 순간에 몸이 알려주는 느낌을 믿는 야생의 본능",
            action: "머리로 계산하지 말고 귀를 기울이세요. '이건 아니다' 혹은 '이거다' 하는 그 느낌을 믿으세요. 직관은 설명하지 않습니다."
        },
        meta_code: {
            name: "명료함 (Clarity)",
            desc: "두려움의 안개가 걷히고, 모든 것의 본질을 투명하게 꿰뚫어 보는 상태. 당신의 눈은 진실만을 봅니다."
        }
    },

    CODE_58: {
        id: "code_58",
        number: 58,
        original_key: "Gene Key 58",
        visual_token: "😄",
        color_code: "#F7DC6F",
        title: "😄 운명 코드 58번: 기쁨의 샘",
        archetype: "The Joyous",
        image_prompt: "A fountain overflowing with golden water",
        keywords: ["#활력", "#환희", "#기쁨"],
        dark_code: {
            name: "불만족 (Dissatisfaction)",
            body_symptom: "입이 튀어나오고 한숨을 쉼, 모든 게 마음에 안 들어 짜증이 남",
            desc: "막상 도달하면 '이게 다야?'라며 허무해지시나요? 당신의 불만족은 세상을 더 완벽하게 만들고 싶어 하는 '개선 본능'이 고장 난 상태입니다."
        },
        neural_code: {
            name: "활력 (Vitality)",
            desc: "불만을 불평으로 끝내지 않고, 세상을 개선하는 에너지로 바꾸는 생명력",
            action: "불평하는 대신 '어떻게 하면 더 좋게 만들까?'라고 질문을 바꾸세요. 당신의 까칠한 시선이 문제를 해결하는 레이저 빔이 됩니다."
        },
        meta_code: {
            name: "환희 (Bliss)",
            desc: "이유 없이 그냥 좋은 상태. 숨 쉬는 것만으로도 너무 좋아서 웃음이 터져 나오는 순수한 기쁨. 당신은 걸어 다니는 행복 바이러스입니다."
        }
    },

    CODE_59: {
        id: "code_59",
        number: 59,
        original_key: "Gene Key 59",
        visual_token: "🐉",
        color_code: "#CB4335",
        title: "🐉 운명 코드 59번: 친밀감의 용",
        archetype: "The Dragon",
        image_prompt: "Two dragons dancing and merging into one DNA helix",
        keywords: ["#친밀감", "#투명성", "#진정성"],
        dark_code: {
            name: "부정직 (Dishonesty)",
            body_symptom: "눈을 마주치지 못하고, 속마음을 들킬까 봐 긴장함",
            desc: "사람들과 어울리면서도 진짜 내 모습은 숨기고, '괜찮은 척' 연기하고 계신가요? 비밀이 많을수록 고독해집니다."
        },
        neural_code: {
            name: "친밀감 (Intimacy)",
            desc: "방어막을 걷어내고, 나의 가장 취약한 부분까지 보여주는 용기",
            action: "오늘 딱 한 사람에게 당신의 비밀이나 약점을 털어놓으세요. '사실 나 이런 게 힘들어'라고 말해보세요."
        },
        meta_code: {
            name: "투명성 (Transparency)",
            desc: "나와 너 사이에 아무런 벽이 없어, 속마음이 그대로 비치는 수정 같은 상태. 당신은 투명해서 더 아름답습니다."
        }
    },

    CODE_60: {
        id: "code_60",
        number: 60,
        original_key: "Gene Key 60",
        visual_token: "🚧",
        color_code: "#34495E",
        title: "🚧 운명 코드 60번: 한계 돌파",
        archetype: "The Cracking",
        image_prompt: "A concrete dam cracking and releasing a massive river",
        keywords: ["#현실주의", "#한계", "#정의"],
        dark_code: {
            name: "제한 (Limitation)",
            body_symptom: "가슴이 답답하고 사방이 벽으로 막힌 듯한 폐쇄 공포",
            desc: "돈도 없고, 시간도 없고, 능력도 부족해서 아무것도 못 한다고 느끼시나요? 이 한계는 당신의 에너지를 압축시켜 폭발시키기 위한 댐입니다."
        },
        neural_code: {
            name: "현실주의 (Realism)",
            desc: "한계를 인정하고 받아들이되, 그 제한된 조건 안에서 최선을 찾는 지혜",
            action: "없는 것을 세지 말고, 있는 것만 세어보세요. 이 좁은 감옥 안에서 내가 할 수 있는 게 딱 하나 있다면 무엇일까요?"
        },
        meta_code: {
            name: "정의 (Justice)",
            desc: "모든 장벽이 무너지고, 에너지가 자유롭게 흐르는 해방의 순간. 당신의 마법은 한계 속에서 피어납니다."
        }
    },

    CODE_61: {
        id: "code_61",
        number: 61,
        original_key: "Gene Key 61",
        visual_token: "⛩️",
        color_code: "#F4D03F",
        title: "⛩️ 운명 코드 61번: 내면의 성소",
        archetype: "The Holy of Holies",
        image_prompt: "A golden temple floating in deep space",
        keywords: ["#영감", "#신성", "#성소"],
        dark_code: {
            name: "정신병 (Psychosis)",
            body_symptom: "머리가 깨질 듯이 아프고, '왜?'라는 질문이 꼬리를 물어 잠을 못 잠",
            desc: "세상의 이치를 다 알아야 직성이 풀리고, 풀리지 않는 문제 때문에 미칠 것 같으신가요? 머리로 신을 이해하려는 것은 개미가 우주를 이해하려는 것과 같습니다."
        },
        neural_code: {
            name: "영감 (Inspiration)",
            desc: "생각하기를 멈추고, 텅 빈 공간에 우주가 채워주는 진리를 받는 상태",
            action: "질문을 멈추세요. '왜?'라고 묻지 말고, 그냥 음악을 듣거나 그림을 그리세요. 논리가 멈춘 곳에서 신성이 깃듭니다."
        },
        meta_code: {
            name: "신성 (Sanctity)",
            desc: "모든 것이 신성함을 깨닫고, 그저 경이로움에 눈물 흘리는 상태. 당신의 내면이 곧 우주의 성소입니다."
        }
    },

    CODE_62: {
        id: "code_62",
        number: 62,
        original_key: "Gene Key 62",
        visual_token: "📏",
        color_code: "#85929E",
        title: "📏 운명 코드 62번: 빛의 언어",
        archetype: "The Language of Light",
        image_prompt: "Geometric shapes forming a precise grid of light",
        keywords: ["#정밀함", "#명쾌함", "#언어"],
        dark_code: {
            name: "지성 (Intellect)",
            body_symptom: "목소리가 날카롭고, 남의 말꼬리를 잡으며 따지고 싶음",
            desc: "사소한 사실관계나 디테일에 집착하느라 정작 중요한 감정을 놓치고 계신가요? 팩트는 진실의 아주 작은 조각일 뿐입니다."
        },
        neural_code: {
            name: "정밀함 (Precision)",
            desc: "복잡한 세상을 명쾌한 언어로 정리하여 사람들에게 이해시키는 능력",
            action: "비판하기 위해 분석하지 말고, 돕기 위해 분석하세요. 복잡한 상황을 세 줄로 요약해서 알려주세요."
        },
        meta_code: {
            name: "결점 없음 (Impeccability)",
            desc: "말과 행동에 한 치의 오차도 없이, 우주의 질서를 완벽하게 구현하는 상태. 당신의 언어는 빛입니다."
        }
    },

    CODE_63: {
        id: "code_63",
        number: 63,
        original_key: "Gene Key 63",
        visual_token: "❓",
        color_code: "#1A5276",
        title: "❓ 운명 코드 63번: 진리의 탐구자",
        archetype: "The Source",
        image_prompt: "A spiral staircase made of question marks leading to a bright sun",
        keywords: ["#탐구", "#진실", "#호기심"],
        dark_code: {
            name: "의심 (Doubt)",
            body_symptom: "눈초리가 매섭고, 누구도 믿지 못해 항상 긴장 상태",
            desc: "모든 게 의심스럽고, 저 사람이 나를 속이지 않을까 불안하신가요? 당신의 뛰어난 논리력이 당신을 갉아먹고 있는 중입니다."
        },
        neural_code: {
            name: "탐구 (Inquiry)",
            desc: "의심을 사람에게 돌리지 않고, 진리를 찾는 도구로 쓰는 건강한 호기심",
            action: "사람을 의심하지 말고 '문제'를 의심하세요. '저 사람은 왜 저럴까?' 대신 '이 상황의 원인이 뭘까?'라고 물으세요."
        },
        meta_code: {
            name: "진실 (Truth)",
            desc: "의심이 끝난 자리에서 만나는 절대적인 앎. 당신은 진실을 찾는 자가 아니라, 진실 그 자체입니다."
        }
    },

    CODE_64: {
        id: "code_64",
        number: 64,
        original_key: "Gene Key 64",
        visual_token: "🌌",
        color_code: "#8E44AD",
        title: "🌌 운명 코드 64번: 여명의 서광",
        archetype: "The Aurora",
        image_prompt: "A night sky filled with colorful aurora borealis",
        keywords: ["#상상력", "#깨달음", "#여명"],
        dark_code: {
            name: "혼란 (Confusion)",
            body_symptom: "머리가 멍하고 꿈과 현실이 구분되지 않음, 편두통",
            desc: "과거의 기억들이 뒤죽박죽 떠오르고, 미래가 보이지 않아 막막하신가요? 당신은 지금 방대한 우주의 데이터를 다운로드받느라 과부하가 걸린 상태입니다."
        },
        neural_code: {
            name: "상상력 (Imagination)",
            desc: "논리로 풀 수 없는 문제를 예술적 이미지로 풀어내는 창조의 힘",
            action: "이해하려 하지 말고 그냥 상상하세요. 혼란스러운 머릿속을 그림으로 그리거나 시로 써보세요."
        },
        meta_code: {
            name: "깨달음 (Illumination)",
            desc: "어둠이 걷히고 찬란한 여명이 밝아오는 순간. 당신의 머릿속이 곧 우주의 도서관입니다. 모든 혼란은 빛을 위한 준비였습니다."
        }
    }
};

// ============== 헬퍼 함수 ==============

/**
 * 일주 키로 일주 데이터 가져오기
 */
export function getIljuData(iljuKey: string): IljuData | null {
    return SAJU_ILJU[iljuKey.toUpperCase()] || null;
}

/**
 * 십성 키로 십성 데이터 가져오기
 */
export function getTenGodData(tenGodKey: string): TenGodData | null {
    return TEN_GODS[tenGodKey.toUpperCase()] || null;
}

/**
 * 코드 번호로 명심코드 데이터 가져오기
 */
export function getMyungsimCode(codeNumber: number): MyungsimCode | null {
    return MYUNGSIM_CODES[`CODE_${codeNumber}`] || null;
}

/**
 * 모든 일주 목록
 */
export function getAllIljuKeys(): string[] {
    return Object.keys(SAJU_ILJU);
}

/**
 * 모든 명심코드 번호 목록
 */
export function getAllMyungsimCodeNumbers(): number[] {
    return Object.values(MYUNGSIM_CODES).map(code => code.number);
}

// ============== 리포트 자산 (프롤로그, 에필로그, 면책조항) ==============

export interface ReportAsset {
    title?: string;
    subtitle?: string;
    text: string;
}

export const REPORT_ASSETS: Record<string, ReportAsset> = {
    PROLOGUE: {
        title: "운명의 지도를 펼치며",
        subtitle: "당신은 고장 난 것이 아니라, 아직 발견되지 않은 것입니다.",
        text: `안녕하세요. 명심코칭입니다.

이 리포트를 펼치신 당신은 아마도 지금 인생의 어느 길목에서 서성이고 계실지도 모르겠습니다. '나는 왜 이럴까?', '내 인생은 어디로 흘러가는 걸까?' 수많은 물음표들이 당신을 괴롭히고 있을지도 모릅니다.

하지만 걱정하지 마세요. 당신이 겪고 있는 혼란과 아픔은 당신이 잘못되어서가 아닙니다. 단지 당신이라는 우주가 얼마나 거대하고 복잡한지, 그 사용설명서를 아직 받아보지 못했기 때문입니다.

이 리포트는 점을 치는 예언서가 아닙니다. 당신의 영혼에 새겨진 고유한 패턴(Code)을 분석하여, 당신이 가진 '진짜 힘'을 되찾아드리는 내비게이션입니다.

어떤 페이지는 당신을 아프게 찌를 수도 있고(Dark), 어떤 페이지는 가슴 뛰는 희망(Meta)을 줄 수도 있습니다. 그 모든 것이 당신입니다. 부디 이 여정의 끝에서, 당신이 세상에서 가장 사랑해야 할 존재가 바로 '나 자신'임을 깨닫기를 바랍니다.

자, 이제 당신만의 운명 코드를 만나러 가볼까요?`
    },
    EPILOGUE: {
        title: "여정을 마치며",
        subtitle: "이제 펜은 당신의 손에 있습니다.",
        text: `긴 여정을 함께해 주셔서 감사합니다.

지금까지 읽은 이 방대한 내용들은 당신의 '가능성'일 뿐, '결정된 미래'가 아닙니다. 사주(Saju)와 명심코드는 당신이 타고난 재료입니다. 이 재료로 맛있는 요리를 만들지, 아니면 재료를 썩힐지는 오직 주방장인 당신의 손에 달려 있습니다.

명심코칭이 드린 '뉴럴 코드(행동 지침)'들을 기억하세요. 매일 조금씩 실천하고, 의식적으로 깨어있으려 노력한다면, 당신의 운명은 이 리포트에 적힌 것보다 훨씬 더 아름답게 쓰일 것입니다.

당신은 빛나는 보석입니다. 단지 잠시 흙먼지가 묻었을 뿐입니다. 이제 그 먼지를 털어내고 세상 밖으로 당당하게 걸어 나가세요.

명심코칭이 당신의 찬란한 앞날을 항상 응원하겠습니다.`
    },
    DISCLAIMER: {
        text: "[안내] 본 리포트는 사주명리학과 주역(I Ching), 현대 심리학을 기반으로 한 코칭 자료입니다. 제공되는 정보는 개인의 성향 파악과 자기 계발을 돕기 위한 조언이며, 절대적인 미래 예언이나 의학적/법적 효력을 갖지 않습니다. 중요한 인생의 결정은 본인의 자유 의지와 책임하에 신중하게 판단하시기 바랍니다."
    }
};

/**
 * 프롤로그 가져오기
 */
export function getPrologue(): ReportAsset {
    return REPORT_ASSETS.PROLOGUE;
}

/**
 * 에필로그 가져오기
 */
export function getEpilogue(): ReportAsset {
    return REPORT_ASSETS.EPILOGUE;
}

/**
 * 면책조항 가져오기
 */
export function getDisclaimer(): ReportAsset {
    return REPORT_ASSETS.DISCLAIMER;
}

// ============== 12운성 (Energy Cycle) 데이터베이스 ==============
// 영혼의 에너지가 지금 '몇 살'인지, 어떤 상태인지를 진단

export interface EnergyCycleData {
    id: string;
    title: string;
    visual_token: string;
    color_code: string;
    dark_code: {
        name: string;
        desc: string;
    };
    neural_code: {
        name: string;
        desc: string;
        action: string;
    };
    meta_code: {
        name: string;
        desc: string;
    };
}

export const ENERGY_CYCLE: Record<string, EnergyCycleData> = {
    JANG_SAENG: {
        id: "cycle_jangsaeng",
        title: "👶 탄생의 에너지, 장생(長生)",
        visual_token: "🍼",
        color_code: "#F9E79F",
        dark_code: {
            name: "의존 (Dependence)",
            desc: "갓 태어난 아기처럼 혼자서는 불안하고, 누군가 계속 챙겨주길 바랍니다. 힘든 일이 생기면 책임을 회피하고 어리광을 부리거나 징징댈 수 있습니다."
        },
        neural_code: {
            name: "습득 (Learning)",
            desc: "모르는 것을 부끄러워하지 않고, 스펀지처럼 흡수하는 순수한 호기심",
            action: "어른인 척하지 말고 멘토를 찾으세요. 당신은 가르쳐주면 누구보다 빨리 배우는 천재성이 있습니다. 예쁘게 도움을 요청하는 법을 배우세요."
        },
        meta_code: {
            name: "축복 (Blessing)",
            desc: "존재만으로 주변의 사랑을 독차지하고, 위기 때마다 귀인이 나타나는 행운의 아이콘."
        }
    },
    MOK_YOUK: {
        id: "cycle_mokyouk",
        title: "🛁 씻고 단장하는, 목욕(沐浴)",
        visual_token: "✨",
        color_code: "#F1948A",
        dark_code: {
            name: "방종 (Indulgence)",
            desc: "발가벗고 씻는 형상이라 남의 시선을 즐기지만, 실수가 잦고 구설수에 오르기 쉽습니다. 유흥이나 멋 부리는 데 빠져 본분을 잊을 수 있습니다."
        },
        neural_code: {
            name: "매력 (Charm)",
            desc: "실수를 두려워하지 않는 시행착오 끝에 만들어진 세련된 감각",
            action: "당신의 끼를 숨기지 마세요. 단, 그 에너지를 유흥이 아닌 '디자인', '패션', '무대'로 돌리세요. 당신은 트렌드를 만드는 사람입니다."
        },
        meta_code: {
            name: "정화 (Purification)",
            desc: "세상의 때를 씻어내고 가장 아름다운 모습으로 다시 태어나는 변신의 귀재."
        }
    },
    GWAN_DAE: {
        id: "cycle_gwandae",
        title: "🥋 제복을 입은 청년, 관대(冠帶)",
        visual_token: "🔥",
        color_code: "#E67E22",
        dark_code: {
            name: "오만 (Arrogance)",
            desc: "이제 막 사회에 나온 청년처럼 의욕은 앞서지만 경험이 부족합니다. 고집이 세고 독단적이라, 남의 조언을 무시하다가 큰 코 다칠 수 있습니다."
        },
        neural_code: {
            name: "용기 (Courage)",
            desc: "실패를 두려워하지 않고 무모할 정도로 밀어붙이는 돌파력",
            action: "실수를 인정하는 법을 배우세요. 당신의 추진력에 '겸손'이라는 브레이크만 달면, 당신은 최단기간에 성공할 수 있습니다."
        },
        meta_code: {
            name: "출세 (Success)",
            desc: "시련을 뚫고 시험에 합격하여 만인의 인정을 받는 영광의 순간."
        }
    },
    GEOL_LOK: {
        id: "cycle_geollok",
        title: "💼 독립한 전문가, 건록(建祿)",
        visual_token: "🏗️",
        color_code: "#2ECC71",
        dark_code: {
            name: "경직 (Rigidity)",
            desc: "너무 반듯하고 원칙적이라 융통성이 없습니다. 일 중독에 빠지기 쉽고, 타인에게도 완벽함을 강요하다가 관계가 소원해질 수 있습니다."
        },
        neural_code: {
            name: "자립 (Self-Made)",
            desc: "누구에게도 기대지 않고 내 실력으로 당당하게 일어서는 프로정신",
            action: "일과 휴식의 균형을 잡으세요. 당신은 이미 충분히 훌륭합니다. 스스로를 그만 채찍질하고, 가끔은 빈틈을 보여주세요."
        },
        meta_code: {
            name: "번영 (Prosperity)",
            desc: "흔들리지 않는 기반 위에서 꾸준히 쌓아 올린 튼튼한 부와 명예."
        }
    },
    JE_WANG: {
        id: "cycle_jewang",
        title: "👑 정점의 제왕, 제왕(帝旺)",
        visual_token: "🤴",
        color_code: "#C0392B",
        dark_code: {
            name: "독단 (Tyranny)",
            desc: "에너지가 가장 강한 상태라 남의 말을 듣지 않습니다. '내가 왕이다'라는 생각에 주변을 무시하다가, 결국 아무도 없는 고독한 왕좌에 홀로 남게 됩니다."
        },
        neural_code: {
            name: "수용 (Embrace)",
            desc: "강한 힘을 과시하는 게 아니라, 약한 자들을 품어주는 너그러움",
            action: "고개를 숙이고 권한을 위임하세요. 당신이 먼저 굽힐 때 사람들은 비로소 당신을 진정한 리더로 인정합니다. 힘은 감출 때 더 빛납니다."
        },
        meta_code: {
            name: "통치 (Governance)",
            desc: "자신의 제국을 넘어 세상을 이롭게 경영하는 위대한 지도자."
        }
    },
    SOE: {
        id: "cycle_soe",
        title: "👴 지혜로운 원로, 쇠(衰)",
        visual_token: "🍵",
        color_code: "#797D7F",
        dark_code: {
            name: "소극 (Passivity)",
            desc: "정점에서 내려와 힘이 빠진 상태라, 의욕이 없고 보수적입니다. 도전하기보다는 가진 것을 지키려 하고, 옛날 생각만 하며 현실에 안주할 수 있습니다."
        },
        neural_code: {
            name: "노련 (Experience)",
            desc: "힘으로 밀어붙이지 않고, 경험과 연륜으로 문제를 해결하는 지혜",
            action: "직접 뛰기보다 후배를 키우세요. 당신의 실패와 성공 경험은 돈으로 살 수 없는 자산입니다. 멘토가 되어줄 때 당신은 다시 빛납니다."
        },
        meta_code: {
            name: "현자 (Sage)",
            desc: "물러날 때를 알고 아름답게 마무리하는 인생의 스승."
        }
    },
    BYEONG: {
        id: "cycle_byeong",
        title: "🏥 아픈 환자, 병(病)",
        visual_token: "💊",
        color_code: "#A569BD",
        dark_code: {
            name: "염려 (Worry)",
            desc: "몸과 마음이 약해져 쓸데없는 걱정이 많습니다. 건강 염려증이 있거나, 남의 눈치를 보느라 결정을 내리지 못하고 우유부단합니다."
        },
        neural_code: {
            name: "공감 (Compassion)",
            desc: "내가 아파봤기에 남의 아픔을 누구보다 깊게 이해하는 치유력",
            action: "당신의 예민함을 '배려'로 쓰세요. 당신은 사람들의 마음을 읽는 엑스레이 같은 눈을 가졌습니다. 상담이나 봉사 활동이 당신을 건강하게 합니다."
        },
        meta_code: {
            name: "치유자 (Healer)",
            desc: "자신의 고통을 승화시켜 세상을 위로하는 영적인 간호사."
        }
    },
    SA: {
        id: "cycle_sa",
        title: "🧘 멈춰있는 정신, 사(死)",
        visual_token: "🕯️",
        color_code: "#2C3E50",
        dark_code: {
            name: "비관 (Pessimism)",
            desc: "육체의 활동이 멈춘 상태라 매사에 의욕이 없고 부정적입니다. 행동하지 않고 생각만 하다가 기회를 놓치거나, 허무주의에 빠질 수 있습니다."
        },
        neural_code: {
            name: "통찰 (Insight)",
            desc: "움직이지 않고 깊게 생각하여 본질을 꿰뚫어 보는 철학적 사고",
            action: "몸을 쓰는 일보다 머리를 쓰는 일을 하세요. 기획, 연구, 종교 등 정신적인 분야에서 당신은 누구도 따라올 수 없는 깊이를 가집니다."
        },
        meta_code: {
            name: "철학자 (Philosopher)",
            desc: "삶과 죽음의 경계를 넘어 우주의 진리를 탐구하는 구도자."
        }
    },
    MYO: {
        id: "cycle_myo",
        title: "⚰️ 창고에 저장함, 묘(墓)",
        visual_token: "📦",
        color_code: "#566573",
        dark_code: {
            name: "단절 (Isolation)",
            desc: "무덤 속에 들어간 듯 답답하고 세상과 단절된 느낌입니다. 돈이든 마음이든 꽁꽁 숨겨두고 절대 꺼내주지 않는 구두쇠가 될 수 있습니다."
        },
        neural_code: {
            name: "탐구 (Research)",
            desc: "고립을 '집중'으로 바꾸어, 한 분야를 깊게 파고드는 전문가 정신",
            action: "답답해하지 말고 그 좁은 공간을 '연구실'로 만드세요. 밖으로 나가지 말고 안으로 파고드세요. 당신이 캐낸 보물은 훗날 세상을 놀라게 할 것입니다."
        },
        meta_code: {
            name: "금고 (Treasury)",
            desc: "세상의 모든 지혜와 재물을 갈무리해 둔, 마르지 않는 비밀 창고."
        }
    },
    JEOL: {
        id: "cycle_jeol",
        title: "✂️ 끊어지고 다시 시작, 절(絶)",
        visual_token: "⚡",
        color_code: "#17202A",
        dark_code: {
            name: "불안 (Instability)",
            desc: "모든 것이 끊어진 상태라 삶의 기복이 심합니다. 끈기가 부족해 싫증을 잘 내고, 사람에게 쉽게 배신당하거나 고립될 수 있습니다."
        },
        neural_code: {
            name: "전환 (Reset)",
            desc: "과거에 얽매이지 않고 언제든 새롭게 시작할 수 있는 쿨한 결단력",
            action: "오래가는 것보다 '반전'에 집중하세요. 당신은 판을 뒤집는 능력이 있습니다. 위기의 순간에 당신의 과감한 결단이 빛을 발합니다."
        },
        meta_code: {
            name: "불사조 (Phoenix)",
            desc: "완전한 무(無)에서 유(有)를 창조해내는 기적의 에너지."
        }
    },
    TAE: {
        id: "cycle_tae",
        title: "🤰 잉태된 생명, 태(胎)",
        visual_token: "🌱",
        color_code: "#AED6F1",
        dark_code: {
            name: "미약 (Fragility)",
            desc: "이제 막 잉태되어 형체가 없습니다. 현실 감각이 떨어지고 꿈만 꾸거나, 겁이 많아 시작을 주저하며 남에게 의존하려 합니다."
        },
        neural_code: {
            name: "비전 (Vision)",
            desc: "현실에 없는 것을 상상하여 미래의 청사진을 그리는 기획력",
            action: "실행은 남에게 맡기고 당신은 '설계도'를 그리세요. 당신의 머릿속에 있는 아이디어는 미래를 바꿀 씨앗입니다. 자유롭게 상상하세요."
        },
        meta_code: {
            name: "잠재력 (Potential)",
            desc: "무한한 가능성을 품고 있는 우주의 씨앗. 무엇이든 될 수 있는 상태."
        }
    },
    YANG: {
        id: "cycle_yang",
        title: "🤱 뱃속에서 자람, 양(養)",
        visual_token: "🏠",
        color_code: "#F9E79F",
        dark_code: {
            name: "안주 (Complacency)",
            desc: "엄마 뱃속처럼 안전한 곳만 찾습니다. 온실 속 화초처럼 자라 시련에 약하고, 조금만 힘들어도 포기하거나 누군가 해결해 주길 기다립니다."
        },
        neural_code: {
            name: "준비 (Preparation)",
            desc: "세상에 나가기 위해 차분하게 실력을 쌓고 준비하는 과정",
            action: "조급해하지 마세요. 지금은 때가 아닙니다. 보호받는 환경 속에서 묵묵히 공부하고 자격증을 따세요. 잘 준비된 자에게 기회는 반드시 옵니다."
        },
        meta_code: {
            name: "계승자 (Inheritor)",
            desc: "선대의 유산을 물려받아 더 크게 키워내는 복 받은 후계자."
        }
    }
};

// ============== 공망 (Void Theory) 데이터베이스 ==============
// 살면서 내가 유독 집착하지만 뜻대로 안 되는 영역을 진단

export interface VoidData {
    id: string;
    title: string;
    visual_token: string;
    dark_code: {
        name: string;
        desc: string;
    };
    neural_code: {
        name: string;
        desc: string;
        action: string;
    };
    meta_code: {
        name: string;
        desc: string;
    };
}

export const VOID_THEORY: Record<string, VoidData> = {
    JA_CHUK: {
        id: "void_jachuk",
        title: "🕳️ 윗사람의 부재, 자축(子丑)공망",
        visual_token: "👴",
        dark_code: {
            name: "결핍 (Lack)",
            desc: "부모님이나 상사, 윗사람의 덕이 없다고 느껴 평생 '인정받고 싶은 욕구'에 시달립니다. 멘토를 찾아 헤매지만 결국 실망하고 상처받기를 반복합니다."
        },
        neural_code: {
            name: "자립 (Self-Reliance)",
            desc: "누군가에게 기대려는 마음을 버리고, 스스로가 누군가의 멘토가 되는 길",
            action: "스승을 찾지 말고 당신이 스승이 되세요. 당신의 빈 구멍은 남이 채워주는 게 아니라, 당신이 후배들에게 내리사랑을 베풀 때 채워집니다."
        },
        meta_code: {
            name: "선구자 (Pioneer)",
            desc: "아무도 가지 않은 길을 홀로 개척하여, 스스로 가문과 역사를 세우는 시조(始祖)."
        }
    },
    IN_MYO: {
        id: "void_inmyo",
        title: "🕳️ 형제/동료의 부재, 인묘(寅卯)공망",
        visual_token: "👥",
        dark_code: {
            name: "고독 (Solitude)",
            desc: "형제나 친구, 동료와 인연이 박합니다. 사람을 좋아해서 퍼주지만 돌아오는 건 배신이거나 무관심일 때가 많아 인간관계에 회의감을 느낍니다."
        },
        neural_code: {
            name: "독립 (Independence)",
            desc: "사람에게 의지하지 않고, 혼자서도 세상을 살아가는 강인한 생존력",
            action: "사람에게 기대하지 마세요. 대신 활동 무대를 해외나 넓은 세상으로 옮기세요. 당신의 인연은 가까운 곳이 아니라 아주 먼 곳에 있습니다."
        },
        meta_code: {
            name: "글로벌 리더 (Global Leader)",
            desc: "혈연과 지연을 넘어 전 세계를 무대로 활동하는 자유로운 영혼."
        }
    },
    JIN_SA: {
        id: "void_jinsa",
        title: "🕳️ 결과의 부재, 진사(辰巳)공망",
        visual_token: "🏃",
        dark_code: {
            name: "허무 (Futility)",
            desc: "열심히 뛰었는데 결승선이 없는 기분입니다. 과정은 화려한데 실속(세속적 결과)이 없고, 마무리가 안 되어 늘 허탈감을 느낍니다."
        },
        neural_code: {
            name: "과정 (Process)",
            desc: "눈에 보이는 결과에 집착하지 않고, 달리는 과정 자체를 즐기는 무심(無心)",
            action: "목표를 세우되 결과는 하늘에 맡기세요. 세속적인 성공보다 정신적인 만족이나 명예를 추구할 때, 오히려 더 큰 성취가 따라옵니다."
        },
        meta_code: {
            name: "초월 (Transcendence)",
            desc: "물질세계를 넘어 영적인 세계에서 진정한 보물을 찾아내는 구도자."
        }
    },
    O_MI: {
        id: "void_omi",
        title: "🕳️ 아랫사람의 부재, 오미(午未)공망",
        visual_token: "👶",
        dark_code: {
            name: "불화 (Discord)",
            desc: "후배나 제자, 자식 등 아랫사람과 뜻이 맞지 않습니다. 내가 키워줘도 고마워하지 않거나, 내 뜻을 거스르는 경우가 많아 속이 상합니다."
        },
        neural_code: {
            name: "장인 (Artisan)",
            desc: "누구에게 물려주려 하지 않고, 내 대에서 끝장을 보는 장인정신",
            action: "남에게 맡기지 말고 직접 하세요. 그리고 기대를 접으세요. 당신은 누군가를 키우는 사람이 아니라, 당신 자신의 역작을 남기는 예술가입니다."
        },
        meta_code: {
            name: "마스터 (Master)",
            desc: "오직 실력 하나로 정상에 올라, 역사에 이름을 남기는 독보적인 존재."
        }
    },
    SIN_YU: {
        id: "void_sinyu",
        title: "🕳️ 공간의 부재, 신유(申酉)공망",
        visual_token: "🏠",
        dark_code: {
            name: "방랑 (Wandering)",
            desc: "집이나 고향에 정이 안 가고, 한곳에 정착하지 못해 붕 뜬 기분입니다. 이사를 자주 다니거나 직장을 자주 옮기며 안정을 찾기 힘듭니다."
        },
        neural_code: {
            name: "유목 (Nomad)",
            desc: "정착에 대한 강박을 버리고, 세상을 집으로 삼는 디지털 노마드",
            action: "역마를 쓰세요. 여행하듯 사세요. 한곳에 머물지 않는 것이 당신에게는 오히려 축복입니다. 변화무쌍한 환경이 당신에게 영감을 줍니다."
        },
        meta_code: {
            name: "자유인 (Free Spirit)",
            desc: "어디에도 얽매이지 않고 바람처럼 자유롭게 세상을 누비는 여행자."
        }
    },
    SUL_HAE: {
        id: "void_sulhae",
        title: "🕳️ 현실의 부재, 술해(戌亥)공망",
        visual_token: "🌌",
        dark_code: {
            name: "몽상 (Daydream)",
            desc: "현실 감각이 떨어지고 뜬구름 잡는 소리를 잘합니다. 돈이나 물질보다 이상적인 세계를 동경하여, 남들에게 '특이하다'는 소리를 듣습니다."
        },
        neural_code: {
            name: "영성 (Spirituality)",
            desc: "보이지 않는 세계(마음, 종교, 예술)에서 답을 찾는 능력",
            action: "현실에 적응하려 애쓰지 마세요. 당신의 무대는 물질세계가 아닙니다. 영적이고 정신적인 가치를 추구할 때 당신은 누구보다 강력해집니다."
        },
        meta_code: {
            name: "선지자 (Prophet)",
            desc: "미래를 내다보고 인류에게 새로운 비전을 제시하는 영적인 지도자."
        }
    }
};

/**
 * 12운성 데이터 가져오기
 */
export function getEnergyCycleData(key: string): EnergyCycleData | undefined {
    return ENERGY_CYCLE[key];
}

/**
 * 공망 데이터 가져오기
 */
export function getVoidData(key: string): VoidData | undefined {
    return VOID_THEORY[key];
}

/**
 * 모든 12운성 키 목록
 */
export function getAllEnergyCycleKeys(): string[] {
    return Object.keys(ENERGY_CYCLE);
}

/**
 * 모든 공망 키 목록
 */
export function getAllVoidKeys(): string[] {
    return Object.keys(VOID_THEORY);
}

// ============== 명심 코칭 에너지 시그니처 (구 성격분석) ==============
export const MYEONGSIM_TRAIT_DESCRIPTIONS: Record<string, { title: string, desc: string, advice: string }> = {
    creativity: {
        title: "Expression (표현 에너지)",
        desc: "내면의 생각과 감정을 세상 밖으로 드러내는 창조적 힘입니다. 식상(Output)의 기운과 관련이 깊으며, 당신의 독창성을 증명하는 도구입니다.",
        advice: "당신의 아이디어는 세상에 나올 자격이 있습니다. 완벽하지 않아도 좋으니 일단 표현하세요."
    },
    logic: {
        title: "Structure (구조화 에너지)",
        desc: "복잡한 현상에서 패턴을 찾아내고 체계화하는 지적인 힘입니다. 금(Metal)의 예리함과 인성(Resource)의 깊이가 결합된 능력입니다.",
        advice: "당신의 논리는 혼란스러운 상황에서 길잡이가 됩니다. 다만, 너무 차가운 이성보다는 따뜻한 합리성을 추구하세요."
    },
    empathy: {
        title: "Connection (연결 에너지)",
        desc: "타인의 감정을 감지하고 유대감을 형성하는 따뜻한 힘입니다. 재성(Wealth)의 현실 감각과 수(Water)의 유연함이 어우러진 능력입니다.",
        advice: "당신의 공감 능력은 사람을 끌어당기는 자석과 같습니다. 하지만 타인의 감정에 휩쓸리지 않도록 경계를 지키는 것도 중요합니다."
    },
    leadership: {
        title: "Drive (추진 에너지)",
        desc: "목표를 향해 거침없이 나아가고 무리를 이끄는 힘입니다. 관성(Power)의 책임감과 목(Wood)의 성장 본능이 만들어낸 에너지입니다.",
        advice: "당신의 리더십은 주변 사람들에게 등불이 됩니다. 하지만 가끔은 뒤따라오는 사람들의 속도도 맞춰주세요."
    },
    resilience: {
        title: "Grounding (기반 에너지)",
        desc: "어떤 시련에도 흔들리지 않고 중심을 잡는 단단한 힘입니다. 토(Earth)의 포용력과 인성(Resource)의 인내심이 결합된 능력입니다.",
        advice: "당신은 태산처럼 든든한 사람입니다. 힘들 때는 잠시 멈춰서 대지(Earth)의 기운을 받으며 충전하세요."
    },
    intuition: {
        title: "Insight (통찰 에너지)",
        desc: "눈에 보이지 않는 본질을 꿰뚫어 보는 제3의 눈입니다. 화개살의 영성과 수(Water)의 지혜가 결합된 신비로운 능력입니다.",
        advice: "당신의 직감을 믿으세요. 논리로 설명되지 않는 그 느낌이 때로는 가장 정확한 정답일 수 있습니다."
    },
    communication: {
        title: "Flow (소통 에너지)",
        desc: "서로 다른 생각과 마음을 흐르게 하여 연결하는 힘입니다. 수(Water)의 유동성과 화(Fire)의 확산력이 조화를 이룬 능력입니다.",
        advice: "당신의 말 한마디가 누군가에게는 큰 위로가 되고, 누군가에게는 새로운 영감이 됩니다. 진심을 담아 소통하세요."
    },
    execution: {
        title: "Action (실행 에너지)",
        desc: "생각을 현실로 구현해내는 구체적인 힘입니다. 금(Metal)의 결단력과 목(Wood)의 행동력이 만난 실천적 에너지입니다.",
        advice: "고민만 하다가 기회를 놓치지 마세요. 작은 한 걸음이 위대한 여정의 시작입니다. Just do it."
    }
};
