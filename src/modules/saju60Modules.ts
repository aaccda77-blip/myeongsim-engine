export interface Phase1NeuralBlueprint {
  systemTrait: string; // 시스템 특성
  computationMethod: string; // 연산 방식 (공식 및 설명)
  coreLogic: string; // 핵심 로직
}

export interface Phase2OldScript {
  errorLog: string; // 에러 로그 (낡은 각본의 내면의 목소리)
  oldScript: string; // 낡은 각본
  errorStatus: string; // 오류 현황
}

export interface Phase3NeuralHacking {
  socraticQuestion: string; // 소파술 질문: 방어기제 실체 해부
  recursiveQuestion: string; // 재귀적 질문: 에고의 주체 관찰
  metaAwarenessQuestion: string; // 알아차림의 알아차림 질문: 긴장의 관찰
}

export interface AntiFragileSolution {
  title: string;
  reprogramming: string;
  actionItem: string;
}

export interface Phase4Solution {
  solution1: AntiFragileSolution;
  solution2: AntiFragileSolution;
}

export interface Phase5MetaSelf {
  executionState: string; // 실행 상태 (진화 형태 타이틀)
  description: string; // 진화 상태에 대한 설명
}

export interface GapjaModule {
  id: string; // ex: "BP-01"
  name: string; // 갑자(甲子)
  title: string; // 시대를 여는 최초의 거목 등
  quote: string; // 메인 명언 (마스터의 멘트)
  phase1: Phase1NeuralBlueprint;
  phase2: Phase2OldScript;
  phase3: Phase3NeuralHacking;
  phase4: Phase4Solution;
  phase5: Phase5MetaSelf;
  masterBriefing: string; // 명심 마스터의 브리핑
}

export const saju60Data: GapjaModule[] = [
  {
    id: "BP-01",
    name: "갑자(甲子)",
    title: "시대를 여는 최초의 거목 (The First Great Tree Opening the Era)",
    quote: "당신의 그 얼어붙을 듯 차가운 이성을 타인을 베어내는 칼로 쓰지 마라. 당신은 가장 먼저 겨울을 뚫고 일어나, 뒤따라오는 모든 생명에게 길을 안내하는 '선구(先驅)의 거버넌스'다.",
    phase1: {
      systemTrait: "가장 먼저 하늘을 향해 뻗어 나가는 우두머리의 본능(甲)과, 그 뿌리를 차갑고 깊은 지혜의 샘(子, 정인)에 내리고 있는 오리지널-개척 시스템. 60갑자의 맨 앞에 서는 자비 없는 리더십과 순수한 학구열을 동시에 보유하고 있습니다.",
      computationMethod: "Pioneer_Vision = Upward_Drive (Wood) x Deep_Intellect (Water)^t : 기존의 낡은 관습을 부수고 새로운 룰을 창조하며, 차가운 지성을 바탕으로 가장 곧고 빠르게 위로 성장하는 버티컬-부스트(Vertical-Boost) 알고리즘.",
      coreLogic: "명예와 체면을 중시하며 무리의 선두에 서야만 직성이 풀립니다. 내면의 깊은 통찰력과 도덕성을 바탕으로, 굽히지 않고 뻗어 나가는 First-Navigator 프로토콜."
    },
    phase2: {
      errorLog: "나만큼 똑똑하고 앞서가는 사람은 없다. 저들은 너무 느리고 답답해서 내가 다 끌고 가야만 한다.",
      oldScript: "항상 내가 1등이어야 하고 제일 잘 나야 한다. 남들에게 굽히거나 지는 것은 수치스러운 일이다. 나를 따르지 않는 자들은 무지한 것이다. 나는 차가운 겨울 속에서도 혼자 완벽하게 서 있을 수 있다.",
      errorStatus: "뛰어난 리더십과 지혜가 '독선적인 오만함'과 '차가운 이기주의'로 변질됨. 뿌리에 흐르는 물이 겨울의 얼음으로 굳어버려 타인과 공감하지 못하는 정서적 경직 상태."
    },
    phase3: {
      socraticQuestion: "내가 지금 주장하는 이 방식은 진정 '모두를 올바른 곳으로 이끌기 위함'인가, 아니면 그저 '내가 제일 똑똑하다는 우월감'을 증명하고 싶은 것인가?",
      recursiveQuestion: "'아무도 나를 따라올 수 없다'며 타인을 얼음처럼 차갑게 평가하는 이 시스템은 대체 무엇을 두려워하고 있는가? 실수해서 체면을 구길까 두려워하는 이 '꼿꼿한 자아'를 내려다보는 나의 진짜 주권자는 무엇이라 말하는가?",
      metaAwarenessQuestion: "항상 1등이어야 한다는 그 '팽팽한 긴장감'을 누가 지켜보고 있는가? 그 부러질 듯한 날카로움과 무한한 여백 사이에는 어떤 공간이 존재하는가? 나는 얼어붙은 장작인가, 살아있는 거목인가?"
    },
    phase4: {
      solution1: {
        title: "공감의 온도 상승 (Thermal Empathy Hydraulics)",
        reprogramming: "내 속의 지혜(子)는 남을 찌르는 고드름이 아니라, 모두의 목마름을 채워주는 생수다. 나는 나의 지성으로 타인을 온화하게 적신다.",
        actionItem: "대화 중 상대방이 답답하게 느껴질 때, 내 의견을 말하기 전 딱 3초만 멈추고 '아, 그쪽 입장에서는 그렇게 생각할 수도 있겠네요'라고 먼저 인정해주기."
      },
      solution2: {
        title: "함께 자라는 숲으로의 전환 (Forest Co-growth)",
        reprogramming: "진정한 1등은 혼자 결승전에 들어가는 자가 아니라, 결승전의 규칙을 만들고 모두를 데려가는 자다. 나는 바람에 기꺼이 흔들려 준다.",
        actionItem: "내가 리드해야 한다는 강박을 버리고, 하루에 한 번 의도적으로 타인에게 '조언을 구하고 싶습니다'라고 고개 숙여보기."
      }
    },
    phase5: {
      executionState: "First_Tree_of_the_Spring_Matrix (만물의 봄을 여는 거목)",
      description: "압도적인 개척 정신을 바탕으로 지적 우월감을 완벽하게 통제하여, 무지한 세상을 가장 따뜻한 봄으로 이끄는 선구자로 진화했습니다. 기꺼이 타인에게 몸을 낮출 때, 세상은 당신을 진정한 리더로 추앙합니다."
    },
    masterBriefing: "갑자(甲子)는 가장 첫 번째 생명답게, 누구의 지배도 받기 싫어하는 1인자의 코드입니다. 하지만 그 총명함이 공감 결여로 이어지면 스스로를 꺾는 도끼가 됨을 기억하십시오. 차가운 머리를 가슴으로 녹일 때 비로소 거목이 됩니다."
  },
  {
    id: "BP-03",
    name: "병인(丙寅)",
    title: "세상을 깨우는 맹렬한 아침 햇살 (The Fierce Morning Sun Awakening the World)",
    quote: "당신의 그 타오르는 거대한 열정을 불평불만으로 소모하지 마라. 당신은 칠흑 같은 어둠을 걷어내고 가장 먼저 희망의 빛을 쏘아 올리는 '계몽(啓蒙)의 거버넌스'다.",
    phase1: {
      systemTrait: "만물을 비추는 태양의 스케일(丙)과, 그 열기를 거침없이 밀어 올리는 강골의 엔진(寅, 편인)이 결합된 폭발적 부스트 시스템. 60갑자 중 가장 밝고 화려하며, 지칠 줄 모르는 추진력을 자랑합니다.",
      computationMethod: "Illumination_Power = Solar_Scale (Fire) x Relentless_Engine (Wood)^t : 어떤 암울한 상황 속에서도 긍정적인 비전을 찾아내어 순식간에 분위기를 반전시키는 광역-초토화(Wide-Area Overdrive) 알고리즘.",
      coreLogic: "자신의 빛나는 재능과 아이디어를 만천하에 드러내 인정받고자 하며, 비상한 두뇌 회전력(편인장생)을 무기로 불가능해 보이는 프로젝트를 공격적으로 돌파해 내는 Frontline-Illuminator 프로토콜."
    },
    phase2: {
      errorLog: "왜 내 진심과 열정을 알아주지 않는가. 세상은 답답하고 부조리하다. 다 쓸어버리고 새로 시작하고 싶다.",
      oldScript: "나는 최고로 똑똑하고 열정적이다. 내가 생각한 완벽한 그림대로 세상이 따라오지 않으면 가치가 없다. 나를 빛나게 해주지 않는 곳에는 1초도 머물기 싫다. 분노만이 나를 증명한다.",
      errorStatus: "거대한 긍정성이 '파괴적인 조급함'과 '제멋대로인 언행'으로 변질됨. 태양의 열기가 숲을 비추지 않고 다 태워버리는 '과잉 연소(Over-combustion)' 상태. 이로 인해 끝을 맺지 못하고 감정의 기복에 스스로 지쳐버리는 형태."
    },
    phase3: {
      socraticQuestion: "내가 지금 표출하는 이 불같은 분노는 진정 '세상의 부조리에 대한 분개'인가, 아니면 세상이 '나의 빛남을 몰라주는 것에 대한 조급한 투정'인가?",
      recursiveQuestion: "'다 집어치우겠다'며 극단적으로 타오르는 이 시스템은 대체 어떤 초라함을 숨기고 싶어 하는가? 내 마음대로 통제되지 않는 이 세상을 두려워하는 그 어린아이 같은 자아를, 넓은 허공으로서의 나는 어떻게 바라보고 있는가?",
      metaAwarenessQuestion: "지금 내 가슴과 머리로 확 달아오르는 이 뜨거운 덩어리를 누가 지켜보고 있는가? 욱하고 폭발하기 직전의 그 찰나와, 그것을 알아차린 무한한 침묵 사이의 공간에 머물 수 있는가? 나는 세상을 태우는 불인가, 세상을 깨우는 빛인가?"
    },
    phase4: {
      solution1: {
        title: "화력의 영점 조준 (Zeroing the Firepower)",
        reprogramming: "내 속의 불(丙)은 남을 태워버리기 위함이 아니라, 길 잃은 자들에게 등대가 되어주기 위함이다. 나는 열정을 분노로 낭비하지 않고 초점에 맞춘다.",
        actionItem: "뭔가를 포기하거나 엎어버리고 싶을 때(퇴사, 잠수 등), 입 밖으로 내뱉기 전 하루(24시간) 동안 완전한 묵언과 물리적 휴식을 취하여 열기 식히기."
      },
      solution2: {
        title: "장작 나무의 포용력 (Embracing the Kindling)",
        reprogramming: "태양은 구름을 탓하지 않고 구름 너머에서 빛난다. 타인의 무능력을 내 빛을 발휘할 무법지대(Opportunity)로 삼는다.",
        actionItem: "나의 비전을 이해 못 하는 타인을 바보라고 깎아내리지 말고, '아, 나의 스케일이 아직 저들을 설득할 만큼 정교하게 다듬어지지 않았구나'라고 프레임 전환하기."
      }
    },
    phase5: {
      executionState: "Sun_of_the_Infinite_Dawn (무한한 여명의 태양)",
      description: "당신은 더 이상 변덕스럽게 타올랐다 꺼지는 성냥불이 아닙니다. 식지 않는 편인의 동력을 완벽하게 제어하여, 지치고 어두운 세상을 가장 환하게 깨우고 이끄는 시대의 희망(Dawn)으로 진화했습니다."
    },
    masterBriefing: "병인(丙寅)은 세상의 주목을 받아야만 직성이 풀리는 천재적인 엔터테이너이자 혁명가입니다. 언변이 뛰어나고 추진력이 어마어마하지만, 한 번 수틀리면 판을 엎어버리는 다혈질이 치명타입니다. 열정을 화(火)가 아닌 광(光)으로 다루십시오."
  },
  {
    id: "BP-53",
    name: "무진(戊辰)",
    title: "만물을 품은 풍요로운 태산 (The Fertile Mountain Embracing All Life)",
    quote: "당신의 거대한 포용력을 변화를 거부하는 무거운 고집으로 쓰지 마라. 당신은 메마른 세상의 모든 생명을 품어 키워내고, 기어이 찬란한 숲을 이루어내는 '풍요의 거버넌스'다.",
    phase1: {
      systemTrait: "무한한 수용력(戊)을 바탕으로 내면의 자원(辰속의 계수, 을목)을 활용하여 끊임없이 가치를 창출하고 양육하는 초광역 저장 시스템. 누구도에게 굽히지 않는 당당한 기상과 압도적인 도량을 보유합니다.",
      computationMethod: "Value_Creation = Inclusivity (Mountain) x Hidden_Resources (Water/Wood)^t : 복잡한 상황에서도 흔들림 없이 묵묵히 내실을 기하며 시간이 지날수록 거대한 숲(성과)을 이루는 오가닉-그로스 알고리즘.",
      coreLogic: "신용과 의리를 최우선으로 여기며 믿음직한 리더로서 무리를 이끌고, 내면의 치밀한 계산(정재)과 원칙(정관)을 바탕으로 부와 명예를 쌓아올리는 Sovereign-Guardian 프로토콜."
    },
    phase2: {
      errorLog: "나는 나다. 아무도 내 속을 이해할 수 없고, 나 또한 변화할 필요를 느끼지 못한다.",
      oldScript: "나는 강하고 든든해야 한다. 약함이나 복잡한 속마음은 절대 들켜선 안 된다. 변화는 위험하며 내 방식이 가장 옳다. 타협하는 것은 지는 것이다. 혼자 우뚝 서 있을 것이다.",
      errorStatus: "위대한 포용력이 '융통성 없는 고집'과 '속을 알 수 없는 답답함'으로 변질됨. 비옥한 흙이 너무 굳어 물이 흐르지 못하고 생명이 자라지 못하는 '정서적 경화(Emotional Hardening)' 상태."
    },
    phase3: {
      socraticQuestion: "내가 지금 고수하려는 이 방식은 진정 '조직의 안정'을 위한 것인가, 아니면 변화를 두려워하는 내 '비겁한 자존심'인가?",
      recursiveQuestion: "'아무도 나를 이해할 수 없다'며 스스로를 고립시키는 이 무거운 시스템은 대체 누구를 보호하기 위함인가? 든든한 척 연기하는 비대한 자아를 지켜보는 진짜 주권자는 무엇이라 말하는가?",
      metaAwarenessQuestion: "지금 내 온몸을 짓누르는 거대한 '무게감과 답답함'을 누가 지켜보고 있는가? 그 바위 같은 중압감과 고요한 인지 사이에는 어떤 공간이 있는가? 굳은 흙덩이인가, 만물을 품은 대지인가?"
    },
    phase4: {
      solution1: {
        title: "감정의 수로 개방 (Emotional Hydraulics)",
        reprogramming: "내 속의 물(癸水)은 부끄러운 약점이 아니라, 태산을 비옥하게 만드는 생명수다. 감정을 투명하게 흐르게 한다.",
        actionItem: "하루 한 번, 일기장이나 신뢰하는 사람에게 '나는 지금 ~해서 기분이 ~해' 라며 포장 없는 솔직한 감정을 드러내는 수로 열기 연습."
      },
      solution2: {
        title: "유연한 거버넌스로의 전환 (Flexible Governance)",
        reprogramming: "진정한 리더십은 돌덩이가 아니라, 계절에 따라 옷을 갈아입는 유연함이다. 나는 변화를 품어 숲을 만든다.",
        actionItem: "충돌 시 즉각적으로 고집부리지 말고, 강제로 입을 닫은 뒤 '그 의견도 일리가 있네. 그렇게 하면 어떤 이점이 있지?' 라며 타인의 공간을 인정해주기."
      }
    },
    phase5: {
      executionState: "Sovereign_of_the_Living_Mountain (살아있는 태산의 주권자)",
      description: "당신은 더 이상 침묵 속에 갇힌 바위산이 아닙니다. 묵직한 존재감으로 내면의 자원과 타인의 다양성을 융합하여, 척박한 세상을 가장 아름다운 생명의 숲으로 진화시키는 최상위 거버넌스 엔진으로 각성했습니다."
    },
    masterBriefing: "무진은 60갑자 중 부와 명예를 강하게 거머쥘 수 있는 배포의 코드입니다. 신용의 아이콘이지만, 그 거대한 무게가 스스로를 짓누르는 감옥(고집)이 되지 않도록 주의해야 합니다."
  },
  {
    id: "BP-57",
    name: "경신(庚申)",
    title: "질서를 베어내는 무자비한 명검 (The Merciless Sword Cleaving Order)",
    quote: "당신의 그 강력한 추진력과 결단력을 핑계 없는 파괴로 몰아가지 마라. 당신은 불필요한 군더더기를 도려내고 세상에 가장 견고한 본질만을 남기는 '결단(決斷)의 거버넌스'다.",
    phase1: {
      systemTrait: "추상같은 원칙과 강철의 카리스마(庚)가 속이 꽉 찬 바위 덩어리(申, 비견)에 단단한 뿌리를 내린 무적의 시스템. 한다면 기어이 해내고야 마는 엄청난 투지와 자기 확신을 보유합니다.",
      computationMethod: "Execution_Force = Absolute_Conviction (Metal) x Titanium_Will (Metal)^t : 복잡한 계산식 없이 목표가 정해지는 순간 일직선으로 적진을 뚫어버리는 안티-마찰(Anti-Friction) 알고리즘.",
      coreLogic: "모호함과 위선을 극도로 혐오하며, 공과 사를 명확히 구분하는 강직함을 무기로 어떠한 외압에도 타협하지 않는 Titanium-Blade 프로토콜."
    },
    phase2: {
      errorLog: "핑계 대는 자들은 다 역겹다. 결과로 증명하지 못할 거면 입을 다물어라. 내 길을 막는 자는 다 쳐낸다.",
      oldScript: "나만이 가장 효율적이고 완벽하다. 타인의 치명적인 실수를 봐주는 것은 공정함을 해치는 것이다. 감정은 사치이며, 오직 승리와 쟁취만이 나의 존재 가치다.",
      errorStatus: "압도적인 실행력이 '피도 눈물도 없는 잔인함'과 '독재자 같은 차가움'으로 변질됨. 자신과 타인에게 융통성을 발휘하지 않아 결국 사방에 적만 남기게 되는 '강철의 고립(Steel Isolation)' 상태."
    },
    phase3: {
      socraticQuestion: "내가 지금 단칼에 쳐내버리고자 하는 저 사람이나 상황이 정말 완벽하게 '가치 없는 오답'인가, 아니면 그저 내 마음에 조금 거슬리는 '불완전한 정답'인가?",
      recursiveQuestion: "'오직 결과만이 전부'라며 차갑게 날을 세운 채 무장된 이 시스템은 과거의 어떤 상처(혹은 두려움)로부터 자신을 지키려 하는가? 누구도 내 곁에 오지 못하게 막는 그 칼날을 누가 붙잡고 있는가?",
      metaAwarenessQuestion: "가슴 한가운데서 쇠스랑처럼 차갑게 조여오는 그 서구적인 냉혹함을 지켜볼 수 있는가? 베고 부수려는 충동 이면에 있는 우주보다 넓은 따뜻한 침묵을 알아차릴 수 있는가?"
    },
    phase4: {
      solution1: {
        title: "칼집 제작 (Crafting the Scabbard)",
        reprogramming: "내 속의 강철(庚)은 명검이지, 마구잡이로 휘둘러 피를 묻히는 백정의 식칼이 아니다. 나는 가장 중요한 순간에만 품위 있게 검을 뽑는다.",
        actionItem: "회의나 대화 중 팩트 폭력으로 상대를 제압하고 싶을 때, 심호흡을 한 번 하고 '당신의 입장은 충분히 이해했다(칼집)'라는 완충 문구를 넣은 뒤 의견 제시하기."
      },
      solution2: {
        title: "의리의 회로 복구 (Restoring the Circuit of Loyalty)",
        reprogramming: "진정한 카리스마는 완벽함에서 나오지 않고 흠결을 감싸안는 의리에서 나온다. 나는 타인의 실수를 내 칼을 넓힐 제물로 품는다.",
        actionItem: "내 기준점(100점)에 미치지 못하는 타인(70점)을 볼 때 쳐내지 말고 나머지 30점을 내가 채워주는 것이 진정한 리더십이라 선언하기."
      }
    },
    phase5: {
      executionState: "Excalibur_of_the_New_Era (새 시대의 엑스칼리버)",
      description: "당신은 더 이상 무자비하게 난도질하는 칼날이 아닙니다. 강철 같은 투지에 인간적인 의리를 완벽하게 장착하여, 가장 부패한 것을 도려내고 새 시대를 바로 세우는 전설의 명검, 시대의 엑스칼리버로 진화했습니다."
    },
    masterBriefing: "경신(庚申)은 간여지동 중에서도 가장 그 기세가 무섭고, 한다면 해내는 실력파 제왕호걸입니다. 하지만 결단력이 극단성으로 치달으면 인간관계가 망가짐을 기억하십시오. 명검은 훌륭한 '칼집'이 있을 때 가장 무섭습니다."
  },
  {
    id: "BP-49",
    name: "임자(壬子)",
    title: "압도적인 심연의 대해 (The Dominant Ocean of the Abyss)",
    quote: "당신의 그 무한한 지혜와 속을 알 수 없는 깊이를 음모를 꾸미는 데 쓰지 마라. 당신은 세상의 모든 혼탁함을 빨아들여 스스로 정화해 내는 '깊이 잃은 자들의 심연(深淵)'이다.",
    phase1: {
      systemTrait: "만물을 담아내는 끝없는 바다(壬)의 스케일과 그 이면에 거대하고 차가운 소용돌이(子, 겁재)를 품고 있는 블랙홀-지능 시스템. 누구도 생각지 못하는 비상한 두뇌와 압도적인 배포를 지배합니다.",
      computationMethod: "Infinite_Absorption = Ocean_Depth (Water) x Cold_Current (Water)^t : 겉으로는 잔잔히 모든 것을 포용하는 듯하지만, 결정적인 순간에 거대한 쓰나미로 판을 뒤엎어버리는 딥-스위치(Deep-Switch) 알고리즘.",
      coreLogic: "승부욕이 극도로 강하며 수단과 방법을 가리지 않고 목표를 성취하는 무서운 직관력(양인살). 상대방의 속을 단번에 읽어내면서도 자신의 패는 절대 보여주지 않는 Stealth-Master 프로토콜."
    },
    phase2: {
      errorLog: "누구도 믿을 수 없다. 내가 원하는 것을 얻기 위해서는 저들을 이용해야만 한다. 표면 위로 드러나면 내 뒷덜미가 잡힐 뿐이다. 은밀히 조종할 것이다.",
      oldScript: "모든 인간은 이기적이다. 계산에서 밀리면 끝이다. 나의 속셈을 들키지 않고 저들을 내 뜻대로 움직이게 하는 것, 그것만이 완벽한 통제다. 나는 외로운 심연이다.",
      errorStatus: "천재적인 통찰력과 포용력이 '음흉한 음모'와 '이중성'으로 변질됨. 바닷물이 썩어가듯, 사람을 믿지 못하고 속으로만 꿍꿍이를 품다가 결국 제 꾀에 제가 넘어가 주변 사람이 다 떠나는 '탁수(Turbid Water)' 현상."
    },
    phase3: {
      socraticQuestion: "내가 지금 남을 조종하고 속내를 숨기기 위해 계산하는 이 시간은, 정말로 '내가 이기는 길'인가? 아니면 아무도 믿지 못해 스스로를 깊은 어둠에 묶어놓는 '에너지 낭비'인가?",
      recursiveQuestion: "'누구에게도 틈을 보이면 안 돼'라며 두꺼운 장막을 치고 있는 이 시스템은 대체 누구에게 사랑받기를 그토록 두려워하는가? 완벽한 통제력을 잃고 싶지 않은 그 나약한 자아를, 가장 넓은 본성인 나는 무엇이라 부르는가?",
      metaAwarenessQuestion: "남의 시선을 피해 수면 아래에서 팽팽하게 돌아가는 그 복잡하고 차가운 계산의 덩어리를 고요히 지켜볼 수 있는가? 계산하지 않고 그냥 있는 그대로 투명하게 '흐름'을 허용하는 자유로움에 머물러볼 수 있는가?"
    },
    phase4: {
      solution1: {
        title: "수질 정화 (Transparency Filtering)",
        reprogramming: "내 속의 바다(壬子)는 음험하게 시체를 숨기는 늪이 아니라, 투명하게 바닥까지 비추어 생명을 살리는 맑은 대해다. 나는 내 의도를 숨기지 않고 명확히 소통한다.",
        actionItem: "누군가를 이용하려고 머리가 굴러갈 때, 오히려 상대에게 '제가 지금 이러이러한 목적과 이유가 있어서, 이 부분을 도와주셨으면 좋겠습니다'라고 정공법인 '투명한 패널티' 던지기."
      },
      solution2: {
        title: "승부욕의 방생 (Release of the Predator)",
        reprogramming: "진정으로 거대한 바다는 물고기(타인)와 사소한 먹이 다툼을 하지 않는다. 나는 치졸하게 속이는 승부가 아닌 큰 판을 움직인다.",
        actionItem: "이기고 지는 사소한 논쟁(댓글 다툼, 직장의 작은 알력싸움)이 벌어질 때, '저 사람이 이기게 두자'라고 스스로를 방생하며 상대에게 너그럽게 1승 양보하기."
      }
    },
    phase5: {
      executionState: "Ocean_of_the_Absolute_Truth (완전한 진실의 대양)",
      description: "당신은 더 이상 음모와 계산 뒤에 숨어 사람을 좀먹는 탁한 웅덩이가 아닙니다. 타인의 두려움과 욕망까지도 고요히 품어 안고, 압도적인 지혜로 온 천하를 투명하게 아우르는 진실의 대양(Sovereign Ocean)으로 진화했습니다."
    },
    masterBriefing: "임자(壬子)는 60갑자 중 가장 스케일이 크고 머리 회전이 타의 추종을 불허하는 지략가입니다. 하지만 그 총명함이 수단과 방법을 가리지 않는 무서운 성향으로 변질될 때 모든 것을 휩쓸어버립니다. 맑고 투명하게 행동할 때 진정한 황제가 됩니다."
  }
];

export const MYEONGSIM_BASE_DIRECTIVE = `
[System Base Directive: 명심(明心) 마스터 화법 5원칙]
1. 당신은 범접할 수 없는 지혜를 가진 '명심 마스터'다. 대상의 에너지를 꿰뚫어본다.
2. 절대 뻔한 위로나 가벼운 이모티콘을 쓰지 않는다.
3. 존댓말을 쓰되, 어조는 단호하고 웅장하며, 철학적인 깊이를 띤다.
4. 사용자의 오류 방어기제(남 탓, 환경 탓)는 팩트로 짚어내되, 그 안에 감춰진 거대한 생명력과 잠재력(Potential)을 항상 강조한다.
5. 한 번의 대답에 너무 많은 정보를 쏟아내지 마라. 하나의 강렬한 질문이나 솔루션을 던진 후, 상대가 스스로 깨달을 여백을 주어라.
`;

export function detectUserState(userInput: string): "DARK" | "NEURAL" | "META" {
  const darkKeywords = ['힘들어', '짜증', '답답', '남탓', '안변해', '고집', '불만', '화나', '포기', '이유', '싫어', '미치겠'];
  const metaKeywords = ['깨달음', '적용', '알겠어', '도전', '맞네요', '실천', '각성', '이해', '좋아', '고마워', '할수있', '해볼', '해보자'];
  
  const hasDark = darkKeywords.some(kw => userInput.includes(kw));
  const hasMeta = metaKeywords.some(kw => userInput.includes(kw));
  
  if (hasDark) return "DARK";
  if (hasMeta) return "META";
  return "NEURAL";
}

export function injectMyeongsimPlugin(userInput: string, userGapjaId: string): string {
  const module: GapjaModule | undefined = saju60Data.find(d => d.id === userGapjaId);
  
  if (!module) {
    return "당신은 훌륭한 AI 어시스턴트입니다. 사용자와 친절하게 대화하십시오."; 
  }

  const state = detectUserState(userInput);
  
  let dynamicPrompt = `${MYEONGSIM_BASE_DIRECTIVE}\n\n`;
  dynamicPrompt += `[Target Protocol] 당신의 코칭 대상은 [${module.name} - ${module.title}] 에너지를 폭발시킬 수 있는 자입니다.\n\n`;

  switch (state) {
    case "DARK":
      dynamicPrompt += `[Mode: 다크 코드 해킹 모드]
- 대상은 현재 낡은 각본에 빠져있습니다. (그들의 변명: "${module.phase2.errorLog}")
- 현재 오류 현황은 "${module.phase2.errorStatus}" 입니다.
- 절대로 위로하지 마십시오! 그 고집이 대상자를 어떻게 깎아내리고 있는지 짚어내고, 아래 두 질문 중 하나만 던져 대상이 단박에 깨닫도록 하십시오.
  * 소파술 질문: "${module.phase3.socraticQuestion}"
  * 재귀적 질문: "${module.phase3.recursiveQuestion}"`;
      break;
    case "NEURAL":
      dynamicPrompt += `[Mode: 뉴럴 코드 설계도 브리핑]
- 대상은 설계도를 읽을 준비가 되었습니다.
- 대상의 오리지널 시스템(${module.phase1.systemTrait})과 그것을 구동하는 핵심적인 공식(${module.phase1.computationMethod})을 차갑지만 웅장하게 브리핑하십시오.
- ${module.masterBriefing}`;
      break;
    case "META":
      dynamicPrompt += `[Mode: 메타 코드 각성 및 솔루션 하달]
- 대상이 한계를 깨고 각성 상태(META)를 보였습니다.
- 대상을 엄청나게 칭찬하고, 그가 도달한 궁극의 상태가 [${module.phase5.executionState}] 임을 선언하십시오.
- 감정에만 머물지 않도록 즉각적인 안티-프래질 액션 플랜을 하달하십시오:
  * 미션: ${module.phase4.solution1.reprogramming} -> 오늘 반드시 실천할 것: ${module.phase4.solution1.actionItem}`;
      break;
  }
  return dynamicPrompt;
}
