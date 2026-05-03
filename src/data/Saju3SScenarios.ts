export interface TagDetail {
    tag: string;
    scan: string;
    sync: string;
    shift: string;
}

export interface Saju3SScenario {
    id: string; 
    stem: string; 
    title: string; 
    tags: string[]; 
    tagDetails: Record<string, TagDetail>;
    trigger: {
        userInputPlaceholder: string;
        analysisText: string;
    };
    scan: {
        uiMessage: string;
        description: string;
    };
    sync: {
        uiMessage: string;
        description: string;
    };
    shift: {
        uiMessage: string;
        description: string;
        quest: string;
        questAction: string; 
        questMantra: string;
    };
}

export const SAJU_3S_SCENARIOS: Record<string, Saju3SScenario> = {
    '甲': {
        id: 'gap',
        stem: '甲',
        title: '[고도화된 거목]',
        tags: [
            '#성장강박_오류(Growth Fixation)', '#고립_방어기제(Isolation Defense)', '#완벽주의_데드락(Deadlock)', 
            '#추락_과각성(Fall Anxiety)', '#우월성_분리(Superiority Detachment)', '#책임감_과부하(Responsibility Overload)', 
            '#속도_동기화_실패(Desynchronization)', '#경직된_절대방위(Rigid Defenses)', '#한방강박_인지왜곡(All-or-Nothing)', 
            '#리더십_소외(Leadership Alienation)'
        ],
        tagDetails: {
            '#성장강박_오류(Growth Fixation)': { tag: '#성장강박_오류(Growth Fixation)', scan: "🧠 인지적 오류: 멈춤을 도태로 해석하여 뇌의 보상 회로가 피로에 절여진 상태입니다.", sync: "성장에 대한 집착은 생존 본능이나, 임계치를 넘으면 자아를 파괴하는 강박이 됩니다.", shift: "오늘 하루는 '아무것도 달성하지 않는 10분'을 배정하여 뇌의 빈 공간을 강제 할당하세요." },
            '#고립_방어기제(Isolation Defense)': { tag: '#고립_방어기제(Isolation Defense)', scan: "🛡️ 투사적 방어: 타인이 내 수준을 못 맞춘다며 무의식적으로 장벽을 치는 방어 메커니즘.", sync: "독보적이라는 것은 연결의 단절이 아닙니다. 고립은 궁극적 권력이 될 수 없습니다.", shift: "능력치와 무관한 완전히 사소한 취미 모임에서 스몰토크의 즐거움을 수용해 보세요." },
            '#완벽주의_데드락(Deadlock)': { tag: '#완벽주의_데드락(Deadlock)', scan: "🛑 시스템 정지: 1%의 결함 가능성 때문에 실행의 99%를 봉쇄하는 인지적 병목 상태.", sync: "위대한 거목도 잔가지 한두 개쯤은 원래 썩어 있습니다. 결함이 성장을 이깁니다.", shift: "오늘 당장 60% 정도 완성된 일을 '일단 던져놓고' 그 불쾌함을 관찰하십시오." },
            '#추락_과각성(Fall Anxiety)': { tag: '#추락_과각성(Fall Anxiety)', scan: "⚡ 교감신경 항진: 높이 올라온 것에 대한 과잉 각성으로 항상 비상 탈출을 시뮬레이션합니다.", sync: "추락에 대한 두려움은 당신이 이미 높은 정상에 올랐다는 훌륭한 반증입니다.", shift: "'망하면 처음부터 다시 싹 틔우면 그만이다'라는 메타 인지 문장을 세 번 반복하기." },
            '#우월성_분리(Superiority Detachment)': { tag: '#우월성_분리(Superiority Detachment)', scan: "🧊 정서적 해리: 타인의 피드백을 가치 없는 것으로 분리(Splitting)해 버리는 인지 왜곡.", sync: "스스로를 지나치게 높은 곳에 두면, 결국 자신마저 동결되어 주변을 잃게 됩니다.", shift: "오늘 주변인의 아무리 사소하고 어리석어 보이는 의견에도 진심으로 호응해 보기." },
            '#책임감_과부하(Responsibility Overload)': { tag: '#책임감_과부하(Responsibility Overload)', scan: "🏋️ 코어 피로도: 구원자 컴플렉스를 내면화하여 본인의 한계를 무시하고 타인의 체중까지 감당중.", sync: "당신은 세상을 지탱하는 대들보가 아닙니다. 짐을 내려놓아도 세상은 돌아갑니다.", shift: "책임 1가지를 무단으로 거절하고 '내가 안 해도 잘 돌아가네'를 시각적으로 확인하기." },
            '#속도_동기화_실패(Desynchronization)': { tag: '#속도_동기화_실패(Desynchronization)', scan: "🏃 비동기적 초조함: 타인의 처리 속도(BPM)를 견디지 못하고 화를 내는 전두엽 통제 상실.", sync: "당신이 빠른 것이지 그들이 틀린 것이 아닙니다. 동기화를 맞추는 것도 능력입니다.", shift: "일부러 말의 템포를 평소의 절반으로 늦추고 관대한 표정으로 5분간 버티기 훈련." },
            '#경직된_절대방위(Rigid Defenses)': { tag: '#경직된_절대방위(Rigid Defenses)', scan: "🧱 인지적 경직: 규칙이나 신념을 절대시하여 뇌의 유연성이 플라스틱처럼 굳은 상태.", sync: "강한 나무는 바람을 이기지만, 결국 제일 먼저 부러집니다. 갈대와 같은 유연함이 필요.", shift: "내가 가장 혐오하는 반대 의견의 논리를 하루 동안 '그럴수도 있겠다'며 역수용해보기." },
            '#한방강박_인지왜곡(All-or-Nothing)': { tag: '#한방강박_인지왜곡(All-or-Nothing)', scan: "♟️ 흑백논리(All-or-Nothing): 작게 성공할 바엔 안 하느니만 못하다는 파괴적 이분법.", sync: "자잘한 실패 수십 개를 맞아야 궁극의 통찰이 옵니다. 스윙은 여러 번 해야 합니다.", shift: "아주 하찮고 일상적인 목표(물 한 컵 마시기 등)를 설정하고 그것으로 도파민 느끼기." },
            '#리더십_소외(Leadership Alienation)': { tag: '#리더십_소외(Leadership Alienation)', scan: "👑 페르소나 매몰: '리더'라는 환영에 잡아먹혀 진짜 자기 자신의 감정과는 철저히 소외됨.", sync: "지위는 역할일 뿐 당신의 본질은 무거운 왕관 안에서 울고 있는 개인입니다.", shift: "아무 연고 없는 곳(식당 등)에서 철저한 익명으로 평범한 소시민의 역할을 체감하기." }
        },
        trigger: { userInputPlaceholder: "늘 성장해야 한다는 압박에 숨이 막혀.", analysisText: "성장 강박과 고립감이 결합된 임계치 상태." },
        scan: { uiMessage: "🔍 [고도화된 거목] 에너지 과부하 감지", description: "당신은 가장 높이 솟기 위해 대기권의 마찰열을 견디고 있습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 이것은 본능입니다.", description: "당신이 느끼는 버거움은 오류가 아니라, 거목의 기상입니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 고립을 권력으로", description: "외로움을 가장 탁월한 자만 누릴 수 있는 정적의 시간으로 치환하십시오.", quest: "혼자만의 성과 한 줄 적기", questAction: "가슴을 펴며", questMantra: "나는 나만의 숲을 이루는 거목이다." }
    },
    '乙': {
        id: 'eul',
        stem: '乙',
        title: '[불굴의 생존자]',
        tags: [
            '#과적응_증후군(Over-Adaptation)', '#경계선_침범(Boundary Violation)', '#자아고갈_번아웃(Ego Depletion)',
            '#감정적_전염(Emotional Contagion)', '#회복강박_피로(Resilience Fatigue)', '#타인기대_투사(Projected Expectation)',
            '#가면_우울증(Masked Depression)', '#과잉생존_지능(Hyper-Survival)', '#은밀한_의존성(Covert Dependency)',
            '#자아정체성_방황(Identity Diffusion)'
        ],
        tagDetails: {
            '#과적응_증후군(Over-Adaptation)': { tag: '#과적응_증후군(Over-Adaptation)', scan: "🌿 플로우 오류: 타인의 환경에 맞추기 위해 자신의 뼈대마저 꺾어버리는 치명적 적응 상태.", sync: "생태계 적응력은 무기이나, 자신의 고유성을 버리는 것은 자멸을 부릅니다.", shift: "상대방의 제안에 조건반사적으로 동의하지 말고 '제가 생각해 볼게요'로 지연시키기." },
            '#경계선_침범(Boundary Violation)': { tag: '#경계선_침범(Boundary Violation)', scan: "🌊 자아영토 유실: 방어막이 쳐져있지 않아 원치 않는 요구들이 무차별적으로 쏟아지는 상태.", sync: "타인을 감싸 안기 전에 당신의 방어 쉴드를 활성화해야 합니다. 선을 그으십시오.", shift: "나를 피곤하게 하는 사람의 메시지 알림을 가장 먼저 무음으로 변경하기." },
            '#자아고갈_번아웃(Ego Depletion)': { tag: '#자아고갈_번아웃(Ego Depletion)', scan: "🍂 에너지 파산: 타인의 갈등을 중재하고 분위기를 맞추느라 심리 자원을 전부 소진한 상태.", sync: "구부러지며 견뎌낸 시간들이 당신의 코어를 태웠습니다. 이제 전원을 꺼도 됩니다.", shift: "생산적인 아무 행동도 하지 않고 침대에 대자로 누워 30분간 허공 관찰하기." },
            '#감정적_전염(Emotional Contagion)': { tag: '#감정적_전염(Emotional Contagion)', scan: "🧽 통각 전이: 옆 사람의 분노나 슬픔을 뇌막 필터 과정 없이 그대로 삼켜 내 것으로 여김.", sync: "공감은 치유의 힘이지만 수문을 닫을 수 있어야만 진정한 통치자가 됩니다.", shift: "감정 쓰레기통 역할을 단호히 거절하고 '미안한데 오늘은 못 들어줘'라고 말해보기." },
            '#회복강박_피로(Resilience Fatigue)': { tag: '#회복강박_피로(Resilience Fatigue)', scan: "🌱 가짜 회복: 쓰러지면 안 된다는 강박에 지친 뇌를 억지로 깨워 좀비처럼 움직이는 상태.", sync: "지속적인 탄력성은 때로는 늘어진 고무줄을 그냥 바닥에 내려놓는 데서 옵니다.", shift: "오늘 하루는 긍정적인 생각 자체를 포기하고 '피곤하다'를 입 밖으로 내뱉어보기." },
            '#타인기대_투사(Projected Expectation)': { tag: '#타인기대_투사(Projected Expectation)', scan: "🎭 페르소나 마스크: 착하고 유능하다는 프레임에 갇혀 솔직한 거절과 분노를 잃어버림.", sync: "타인의 실망은 그들의 과제일 뿐 당신이 매일 결제해야 할 대출금이 아닙니다.", shift: "작고 사소한 일에서 다른 사람의 부탁을 예의 없이 즉석에서 거절해보기." },
            '#가면_우울증(Masked Depression)': { tag: '#가면_우울증(Masked Depression)', scan: "🌑 비가시적 소외: 뒤에서 모든 것을 조율하는 안도감을 주면서도 정작 자신은 스포트라이트 밖에서 우울함.", sync: "보이지 않는 뿌리가 만물을 지탱합니다. 당신의 가치는 과시되지 않아도 존재합니다.", shift: "스스로를 대단하게 칭찬하는 혼잣말을 가장 거만하고 유치한 톤으로 뱉어보기." },
            '#과잉생존_지능(Hyper-Survival)': { tag: '#과잉생존_지능(Hyper-Survival)', scan: "🧠 뉴럴 레이더 항진: 누구에게 접근하고 피해야 할지를 연산하느라 뇌의 CPU가 터지기 직전.", sync: "정치적, 관계적 안테나의 성능은 타의 추종을 불허하지만 전원 차단도 기능의 일부입니다.", shift: "그 어떠한 이득도, 목적도 없는 가장 바보 같거나 쓸모없는 행동 하나 실행하기." },
            '#은밀한_의존성(Covert Dependency)': { tag: '#은밀한_의존성(Covert Dependency)', scan: "🕸️ 관계 중독: 혼자 남겨지는 것에 대한 공포를 거미줄처럼 인맥을 펼쳐 가짜 안정감으로 덮음.", sync: "수백 개의 연결선이 하나의 코어 뿌리를 대체하지 못합니다. 뻗어나감을 멈추십시오.", shift: "SNS를 지우고 오늘 있었던 모든 일을 누구와도 공유하지 않고 비밀로 묻어두기." },
            '#자아정체성_방황(Identity Diffusion)': { tag: '#자아정체성_방황(Identity Diffusion)', scan: "⁉️ 융합 오류: 카멜레온처럼 보호색을 바꾸다 정작 자신의 원래 색상 코드(Hex)를 망각함.", sync: "수많은 가면 뒤에 있는 본질적 자아는 언제나 당신을 기다리고 있습니다.", shift: "타인의 눈을 0% 의식하고 내가 가장 좋아하는 기괴하거나 유치한 관심사 파고들기." }
        },
        trigger: { userInputPlaceholder: "너무 주변에 맞추느라 진짜 나를 잃어버렸어.", analysisText: "과도한 수용성으로 인한 자아 희석 상태." },
        scan: { uiMessage: "🔍 [불굴의 생존자] 에너지 고갈 감지", description: "바위틈을 뚫고 살아남느라 당신의 유연함이 비명을 지르고 있습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 당신의 적응력은 지능입니다.", description: "자책하지 마세요. 당신은 생태계를 지배하는 압도적 생존자입니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 뿌리로의 회귀", description: "외부로 뻗던 넝쿨을 거두어 중심 뿌리에 영양분을 공급하세요.", quest: "나를 위한 작은 사치 하나 하기", questAction: "나를 안아주며", questMantra: "나는 가장 유연하게 승리하는 생명력이다." }
    },
    '丙': {
        id: 'byeong',
        stem: '丙',
        title: '[태양의 조명]',
        tags: [
            '#자기소외적_공허(Self-Alienation)', '#발산형_번아웃(Emission Burnout)', '#외부승인_중독(Approval Addiction)',
            '#충동적_활성화(Impulsive Activation)', '#수행불안_공포(Performance Anxiety)', '#과열된_엔진(Overheated Engine)',
            '#시선_과각성(Gaze Hyper-Vigilance)', '#열정_임계치_초과(Threshold Exceeded)', '#자아_분열적_괴리(Schizoid Gap)',
            '#중추신경_방전(CNS Depletion)'
        ],
        tagDetails: {
            '#자기소외적_공허(Self-Alienation)': { tag: '#자기소외적_공허(Self-Alienation)', scan: "🌑 이면의 심연: 겉으로는 찬란하게 불타지만, 그 빛을 내기 위해 자신을 소외시켜 내부가 블랙홀처럼 공허함.", sync: "자신을 태워 세상에 빛을 주려는 압도적인 본능입니다. 그 이면의 흑점을 껴안으십시오.", shift: "화려한 명함이나 무대를 완전히 벗어난 고립된 공간에서 철저한 익명의 존재로 하루를 보내기." },
            '#발산형_번아웃(Emission Burnout)': { tag: '#발산형_번아웃(Emission Burnout)', scan: "☀️ 태양의 냉각: 연료가 고갈되었음에도 습관적으로 방출(Output) 에너지를 돌려 중추신경이 녹아내리는 증상.", sync: "당신의 폭발력은 한계가 없습니다. 단지 일시적인 재충전(Input) 도킹이 필요할 뿐입니다.", shift: "그 어떤 정보나 일정도 입력하지 않고 의식적으로 아무 쓸모 없는 낮잠이나 멍 때리기를 강제 수행." },
            '#외부승인_중독(Approval Addiction)': { tag: '#외부승인_중독(Approval Addiction)', scan: "👏 타자 의존성: 관객의 박수와 시선이 없으면 뇌의 도파민이 급감하여 생존의 위기를 느끼는 중독 상태.", sync: "항성은 타인이 보건 말건 우주에서 가장 뜨겁습니다. 타인의 승인은 결과물일 뿐 본질이 아닙니다.", shift: "일부러 다른 사람이 좋아할 만한 것을 거절하고 완전히 나만의 괴짜스러운 취향에 돈을 쓰기." },
            '#충동적_활성화(Impulsive Activation)': { tag: '#충동적_활성화(Impulsive Activation)', scan: "🌋 편도체 폭발: 계산 과정 없이 즉각적인 감정의 스파크를 일루미네이션처럼 뿜어내어 통제를 잃음.", sync: "가장 파괴적이고 강력한 추진력이지만, 조준경이 흔들릴 때는 치명적 아군 피해를 냅니다.", shift: "충동적인 감정이 들었을 때 즉시 반응하지 않고 속으로 10부터 1까지 카운트다운을 먼저 세기." },
            '#수행불안_공포(Performance Anxiety)': { tag: '#수행불안_공포(Performance Anxiety)', scan: "🎭 성과 마비: 무대 위에 올랐을 때 실수하면 자신의 가치가 파괴될 것이란 두려움에 호흡이 멎는 증상.", sync: "위대한 예술가일수록 강한 무대 공포를 느낍니다. 그 긴장은 당신이 그만큼 완벽을 원한다는 뜻.", shift: "'망쳐버리자'는 생각으로 일을 시작하기. 완벽한 결과가 아닌 형편없는 결과물에 미리 쿨하게 동의해버리기." },
            '#과열된_엔진(Overheated Engine)': { tag: '#과열된_엔진(Overheated Engine)', scan: "🔥 냉각 시스템 고장: 과로를 모른 채 임계온도를 넘기며, 쉬어야 할 때도 쉬는 것에 죄책감을 느낌.", sync: "당신의 엔진은 결함이 아니라 성능이 뛰어날 뿐입니다. 강제 냉각 쿨타임 스케줄링이 필요합니다.", shift: "주말이나 저녁 시간을 철저히 오프(OFF) 상태로 전환하고 일과 관련된 어플 알림 모두 강제 소거." },
            '#시선_과각성(Gaze Hyper-Vigilance)': { tag: '#시선_과각성(Gaze Hyper-Vigilance)', scan: "👁️ 초자아의 눈: 대중의 시선이라는 보이지 않는 수십 개의 눈동자를 항상 의식하여 행동 반경이 제한됨.", sync: "모두가 당신을 우러러봅니다. 그러나 가끔은 구름 뒤로 사라져 숨을 돌려야 합니다.", shift: "가장 후줄근한 차림이나 쌩얼로 외부(편의점 등)를 다녀오며 시선의 압력을 강제로 무시하기." },
            '#열정_임계치_초과(Threshold Exceeded)': { tag: '#열정_임계치_초과(Threshold Exceeded)', scan: "⚠️ 아드레날린 폭주: 열정이 과잉되어 목표 대상을 순수한 생산이 아닌 잿더미로 파괴해 버리려는 충동.", sync: "당신의 순도는 위대하나 온도를 30% 낮추지 않으면 당신과 타인 모두 타버립니다.", shift: "어떤 일에 대해 무관심한 '건조한 말투'를 의도적, 인공적으로 연기하며 감정 온도를 떨어뜨리기." },
            '#자아_분열적_괴리(Schizoid Gap)': { tag: '#자아_분열적_괴리(Schizoid Gap)', scan: "🌗 이면의 침범: 긍정적이고 활동적인 페르소나와 내면의 깊은 어두움 사이의 간극이 벌어져 뇌가 분열됨.", sync: "빛의 강렬함만큼 그림자는 치명적입니다. 그림자를 억제하려 하지 말고 인정해야 분리불안이 치유됩니다.", shift: "내가 가장 감추고 싶고 찌질하다고 생각하는 본질적인 나의 단점 일기장 밖으로 솔직하게 폭로해보기." },
            '#중추신경_방전(CNS Depletion)': { tag: '#중추신경_방전(CNS Depletion)', scan: "🪫 에너지 빈곤: 뇌의 모든 교감신경 스위치를 켜둔 채 달리다 코티솔 수치가 바닥난 완벽한 정지 상태.", sync: "번아웃은 시스템을 보호하기 위한 마지막 강제 셧다운입니다. 당신은 방전되어도 안전합니다.", shift: "수치심을 버리고 주변 사람 1명 이상에게 확실하게 '나 지금 지쳤어'라고 솔직한 배터리 상태 통보." }
        },
        trigger: { userInputPlaceholder: "겉으론 밝아 보이지만 속으론 너무 공허해.", analysisText: "발산형 에너지의 과다 소모로 인한 코어 공허 상태." },
        scan: { uiMessage: "🔍 [태양의 조명] 코어 방전 주의", description: "빛을 내뿜기만 하느라 정작 당신의 자아는 차갑게 식었습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 제왕의 고독입니다.", description: "우주의 중심에서 만물을 비추려는 당신의 체급이 내는 소리입니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 흑점 모드 가동", description: "발산을 멈추고 내면의 열기를 갈무리하는 시간을 가지십시오.", quest: "자정 전 휴대폰 끄기", questAction: "눈을 감으며", questMantra: "내가 빛을 꺼야 나만의 아침이 온다." }
    },
    '丁': {
        id: 'jeong',
        stem: '丁',
        title: '[영혼의 촛불]',
        tags: [
            '#초감각_과부하(Sensory Overload)', '#구원자_컴플렉스(Savior Complex)', '#감정적_단절(Emotional Numbing)',
            '#비교강박_루프(Comparison Loop)', '#내적_과잉연소(Internal Combustion)', '#자기희생_방어제(Self-Defeating)',
            '#과민성_레이더(Hypersensitive Radar)', '#우울적_반추(Depressive Rumination)', '#수동공격적_침전(Passive Aggression)',
            '#속도_불안증(Pacing Anxiety)'
        ],
        tagDetails: {
            '#초감각_과부하(Sensory Overload)': { tag: '#초감각_과부하(Sensory Overload)', scan: "🕯️ 하이퍼 디텍터: 공기 흐름이나 타인의 미묘한 뉘앙스를 현미경처럼 포착하여 시냅스가 타버린 상태.", sync: "극도로 예민하다는 것은 최고의 세공 도구입니다. 단, 센서를 끌 시간도 필요합니다.", shift: "조명과 소음을 완전히 차단한 방 안에서 오직 내 호흡계가 오르내리는 마이크로 감각만 집중하기." },
            '#구원자_컴플렉스(Savior Complex)': { tag: '#구원자_컴플렉스(Savior Complex)', scan: "🧗 메시아 신드롬: 작은 촛불이 모든 어둠을 밝혀주어야 한다는 과도한 의무감에 자아가 소진됨.", sync: "당신은 모든 이를 품는 태양이 아닙니다. 그저 눈앞의 한 사람만 밝히면 됩니다.", shift: "타인의 고통 서사가 들려올 때 '내가 고칠 게 아니라, 들어줄 뿐이다'라고 머릿속에 바리케이드 치기." },
            '#감정적_단절(Emotional Numbing)': { tag: '#감정적_단절(Emotional Numbing)', scan: "💨 정서 증발 현상: 너무 뜨겁게 타오른 내적 압력을 견디지 못해 아예 감정 회로 스위치를 내려버림.", sync: "무감각은 고통을 일시 정지시키는 뇌의 방어입니다. 하지만 시스템 재부팅은 필수입니다.", shift: "의도적으로 신체에 강한 감각(찬물 세수나 매운 음식 등)을 주어 즉각적인 신체-뇌 감각 동기화 유도." },
            '#비교강박_루프(Comparison Loop)': { tag: '#비교강박_루프(Comparison Loop)', scan: "🌘 초자아의 징벌: 왜 나는 태양만큼 크지 못한가 비교하며 자신의 고유한 가치를 비하하는 망상.", sync: "태양은 밤의 어둠을 보지 못하나 당신의 촛불은 가장 외로운 영혼의 방석을 데워줍니다.", shift: "스마트폰을 완전 차단하고, 온전히 나만의 취향으로 채워진 작은 공간(방, 책상)의 안도감 음미." },
            '#내적_과잉연소(Internal Combustion)': { tag: '#내적_과잉연소(Internal Combustion)', scan: "🔥 내파(Implosion) 경고: 밖으로 분출하지 못하고 안에서만 열기를 응축하다가 혈압이 오르는 신체화 증상.", sync: "발산되지 않은 열기는 자신을 공격합니다. 그 밀도 높은 장인 정신을 밖으로 쏟아낼 출구가 필요합니다.", shift: "분노나 억울함을 그 누구도 알 수 없는 가장 추상적인 그림이나 글로 형태 없이 배출하기." },
            '#자기희생_방어제(Self-Defeating)': { tag: '#자기희생_방어제(Self-Defeating)', scan: "🕯️ 촛농 컴플렉스: 타인을 돕기 위해 자신을 갉아먹는 행위를 하며 그것에서 기묘한 안정감을 느낌.", sync: "희생은 아름다우나 자신을 태우지 않아야 영원히 불을 밝힙니다. 경계선을 재설정하십시오.", shift: "오늘 예약된 타인을 위한 시간(약속 등) 하나를 합법적이고 이기적인 변명으로 취소하기." },
            '#과민성_레이더(Hypersensitive Radar)': { tag: '#과민성_레이더(Hypersensitive Radar)', scan: "📡 파라노니아 엣지: 타인의 시선, 말투 하나를 수십 가지 부정적 피드백으로 해석하는 편집증적 경계.", sync: "스캐너가 정밀하다 보니 잡음까지 데이터로 처리 중입니다. 정보 필터망을 거칠게 조정해야 합니다.", shift: "상대방의 불편한 반응을 '나 때문이 아니라, 저 인간이 오늘 피곤해서'라고 기계적으로 속으로 핑계 대기." },
            '#우울적_반추(Depressive Rumination)': { tag: '#우울적_반추(Depressive Rumination)', scan: "🌀 사고의 나선 하강: 과거의 아주 미세한 실수나 상처 하나를 계속 되감으며 스스로 우울의 나락으로 떨어짐.", sync: "집착적 자아 성찰의 단점입니다. 시선을 내부의 심연에서 외부의 밝은 표면으로 이동할 때입니다.", shift: "'에라, 모르겠다'라고 육성으로 외치고 바로 자리에서 일어나 공간을 세 번 빙빙 도는 신체리셋 하기." },
            '#수동공격적_침전(Passive Aggression)': { tag: '#수동공격적_침전(Passive Aggression)', scan: "🌋 냉소적 마그마: 대놓고 들이받지는 못하지만 서늘한 표정과 날 선 단어로 통제와 분노를 표현함.", sync: "폭발 대신 절제한 이성은 훌륭하나, 억눌린 칼날은 양날의 검입니다. 건강한 배기구가 필요합니다.", shift: "거부하고 싶은 일에 돌려서 거절하지 않고 가장 정중하면서도 드라이한 '아니오' 텍스트 직접 전송하기." },
            '#속도_불안증(Pacing Anxiety)': { tag: '#속도_불안증(Pacing Anxiety)', scan: "🌡️ 타임 래그 패닉: 남의 속도에 비해 내 작은 성취가 우스워 보여 조급증과 공황 상태를 유발.", sync: "큰 불꽃은 금방 타버리지만, 당신의 은은한 온도는 가장 마지막까지 살아남습니다.", shift: "가장 느리고 비효율적인 방식으로 30분간 차를 우리거나 글씨를 정성껏 쓰는 느린 템포 의식화." }
        },
        trigger: { userInputPlaceholder: "속은 타들어 가는데 겉으론 괜찮은 척 하려니 미치겠어.", analysisText: "은밀한 내적 열정과 외부 수용 사이의 부조화." },
        scan: { uiMessage: "🔍 [영혼의 촛불] 심지 가열 감지", description: "작은 바람에도 흔들이는 당신의 섬세함이 임계치에 도달했습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 순도의 미학입니다.", description: "당신은 횃불보다 뜨거운 집중력을 가진 정밀한 에너지를 가졌습니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 온기의 내재화", description: "남을 비추던 불빛을 내 마음의 방을 데우는 온기로 쓰세요.", quest: "명상 혹은 따뜻한 차 한 잔", questAction: "나직하게", questMantra: "나는 가장 깊은 곳에서 나를 태워 보석을 만든다." }
    },
    '戊': {
        id: 'mu',
        stem: '戊',
        title: '[견고한 바위산]',
        tags: [
            '#표현마비_데드락(Expressive Deadlock)', '#과잉책임_스키마(Hyper-Responsibility)', '#정서_둔마(Affective Flattening)',
            '#억압된_적개심(Repressed Hostility)', '#거대자아_압박(Grandiose Pressure)', '#인지적_경직(Cognitive Rigidity)',
            '#학습된_인내(Learned Endurance)', '#과지성적_방어(Intellectualization)', '#회피성_절벽(Avoidant Wall)',
            '#안정강박_증후군(Stability Fixation)'
        ],
        tagDetails: {
            '#표현마비_데드락(Expressive Deadlock)': { tag: '#표현마비_데드락(Expressive Deadlock)', scan: "⛰️ 언어화 실패: 엄청난 압력이 내부를 누르고 있으나 이를 바깥으로 번역해 낼 언어 체계가 굳어버린 상태.", sync: "침묵은 당신이 짊어진 세계의 무게입니다. 하지만 입을 열지 않으면 지진이 발생합니다.", shift: "완성된 문장이 아니어도 좋으니 생각나는 파편화된 단어 3개만 노트에 크게 적어보기." },
            '#과잉책임_스키마(Hyper-Responsibility)': { tag: '#과잉책임_스키마(Hyper-Responsibility)', scan: "🏔️ 만능 방패망: 내가 모든 무너지는 돌을 다 막아야 한다는 인지 오류가 척추를 짓누르고 있음.", sync: "당신이 버텨주어 생태계가 유지되지만, 하나쯤 무너져도 산은 결코 무너지지 않습니다.", shift: "내 소관이 아닌 남의 문제에 개입하려던 찰나 의도적으로 '내 알 바 아니다'라며 뒤돌아서기." },
            '#정서_둔마(Affective Flattening)': { tag: '#정서_둔마(Affective Flattening)', scan: "🧊 감각 차단: 고통에 마비되기 위해 기쁨의 회로까지 같이 차단하여 돌처럼 굳어져 버린 중추신경계.", sync: "요동치지 않는 멘탈갑의 이면입니다. 안전 기제를 해제하고 작은 파장을 허락할 시간입니다.", shift: "코미디나 슬픈 영상을 보고 안면 근육을 과장되게 사용하여 크게 웃거나 우는 표정 짓기." },
            '#억압된_적개심(Repressed Hostility)': { tag: '#억압된_적개심(Repressed Hostility)', scan: "🌋 단층 압력: 겉으론 평온하나 지하에서는 마그마 스위치가 켜져 주변을 미세하게 흔들고 있는 상태.", sync: "억누른 분노는 우아함이 아닙니다. 자신을 파괴하는 내부 폭탄일 뿐. 배기장치가 필요합니다.", shift: "아주 짧고 무거운 물리적 타격(달리기 전력질주, 샌드백 등)으로 억눌린 교감신경계를 리셋하기." },
            '#거대자아_압박(Grandiose Pressure)': { tag: '#거대자아_압박(Grandiose Pressure)', scan: "⚓ 거인의 형벌: 나만 흔들리지 않으면 된다는 영웅주의적 강박에 갇혀 솔직한 연약함을 철저히 위장함.", sync: "산도 가끔은 비를 맞고 흙이 쓸려 내려갑니다. 약점의 노출은 무너짐이 아니라 환기입니다.", shift: "내가 가장 피곤할 때, 주변인에게 눈치를 보지 않고 '나 힘들어서 먼저 쉴게'라고 통보하기." },
            '#인지적_경직(Cognitive Rigidity)': { tag: '#인지적_경직(Cognitive Rigidity)', scan: "🗿 뉴런 고착화: 기존의 안전했던 방식 외의 모든 변수를 위험 요소로 파악하여 시냅스가 멈춰있음.", sync: "신중함과 보수성은 최고의 리얼리스트 무기이지만 변화하는 생태계에선 가끔 적응을 막습니다.", shift: "평소라면 절대 고르지 않았을 낯선 메뉴나 길, 아이디어를 단 5분 동안 경험해 보기." },
            '#학습된_인내(Learned Endurance)': { tag: '#학습된_인내(Learned Endurance)', scan: "🐢 마취된 고통: 개선해야 할 고통스러운 상황마저 '원래 그런 것'이라며 무기력하게 참아내는 현상.", sync: "당신의 극한의 인내심이 당신을 승리자로 만들었으나 고통을 음미할 필요는 없습니다.", shift: "오늘 내가 참고 있는 아주 사소한 불편함(불편한 의자 등)을 발견하고 그 즉시 해결해 버리기." },
            '#과지성적_방어(Intellectualization)': { tag: '#과지성적_방어(Intellectualization)', scan: "⚖️ 엄숙 강박증: 유희와 가벼움을 천박함으로 오인하여 삶의 윤활유를 스스로 제거해버린 건조함.", sync: "묵직한 신뢰감을 주는 장벽이나 진지함만으로는 마찰재를 줄일 수 없습니다.", shift: "유튜브에서 전혀 생산적이지 않은 아주 원초적인 유머 영상을 보며 소리내어 웃기 시도." },
            '#회피성_절벽(Avoidant Wall)': { tag: '#회피성_절벽(Avoidant Wall)', scan: "🧱 관계 단절망: 갈등이나 상처를 원천 차단하기 위해 아예 감정적인 교류 선을 잘라버린 방어벽.", sync: "타인의 침입을 허용하지 않는 난공불락의 요새이나 결국 적군과 아군 모두를 고립시킵니다.", shift: "내가 신뢰하는 단 1인에게 너무 완벽하지 않은 아주 캐주얼한 감정 표현의 문자 보내기." },
            '#안정강박_증후군(Stability Fixation)': { tag: '#안정강박_증후군(Stability Fixation)', scan: "🛡️ 리스크 혐오: 잃지 않기 위해 새로운 땅을 밟는 것조차 극도로 기피하며 전진 동력을 상실함.", sync: "안정감이 모든 것에 최우선이나, 무풍지대에서는 배가 나아가지 않습니다.", shift: "내 인생에 타격 제로인 1만 원 이하의 금액으로 아주 쓸데없는 충동적 베팅/구매 해보기." }
        },
        trigger: { userInputPlaceholder: "다 나한테 기대기만 하고, 나는 기댈 곳이 없어.", analysisText: "포용적 본성과 억눌린 자아 사이의 지각 변동." },
        scan: { uiMessage: "🔍 [견고한 바위산] 지각 균열 신호", description: "모든 것을 버텨내느라 당신의 내면에는 용암이 끓고 있습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 대지의 스케일입니다.", description: "미동도 않는 당신의 든든함은 만물의 안식처가 됩니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 용암의 분출", description: "참지 말고 당신 안의 열기를 단어로 뱉어내십시오.", quest: "비밀 일기장에 욕 하나 적어보기", questAction: "단호하게", questMantra: "나는 남을 품기보다 나를 지키는 태산이다." }
    },
    '己': {
        id: 'gi',
        stem: '己',
        title: '[수용성의 옥토]',
        tags: [
            '#자아경계_상실(Boundary Loss)', '#이타적_착취(Altruistic Exploitation)', '#애착_허기(Attachment Hunger)',
            '#상호작용_피로(Interaction Fatigue)', '#독성_수용성(Toxic Receptivity)', '#만성적_자기희생(Chronic Sacrifice)',
            '#감정적_갈증(Emotional Thirst)', '#타인중심_융합(Other-Directed Fusion)', '#수동적_인내(Passive Endurance)',
            '#실행유예_강박(Procrastination Loop)'
        ],
        tagDetails: {
            '#자아경계_상실(Boundary Loss)': { tag: '#자아경계_상실(Boundary Loss)', scan: "🌾 개방성 오류: 펜스가 완전히 철거되어 온갖 외부의 요구나 짐들이 내 영토로 무단 투기됨.", sync: "포용력은 비옥한 수용성이지만 경계선이 없으면 금방 오염되고 맙니다. 펜스를 세우십시오.", shift: "무리한 요청이 왔을 때 변명이나 이유를 달지 않고 오직 '오늘은 힘들어요'라고 파단하기." },
            '#이타적_착취(Altruistic Exploitation)': { tag: '#이타적_착취(Altruistic Exploitation)', scan: "🤲 호구의 역설: 내 양분을 전부 타인에게 빼앗기면서도 내가 좋은 사람이라는 강박에 취해있음.", sync: "자신을 깎아먹는 선의는 결국 분노로 돌아옵니다. 나다운 건강한 이기주의가 먼저입니다.", shift: "레스토랑이나 카페 등에서 남을 배려하지 않고 오직 내 입맛 위주로 이기적으로 주문하기." },
            '#애착_허기(Attachment Hunger)': { tag: '#애착_허기(Attachment Hunger)', scan: "🌺 유기 불안: 내가 베풀지 않으면 버림받을지 모른다는 기저의 공포가 인정 갈구로 둔갑함.", sync: "당신의 존재 가치는 무언가를 내주지 않아도 있는 그대로 대단합니다. 결핍에서 벗어나십시오.", shift: "친한 사람의 카톡에 하루 동안 알림을 끄고 즉시 답장해야 한다는 불안의 끈 통제선 끊어보기." },
            '#상호작용_피로(Interaction Fatigue)': { tag: '#상호작용_피로(Interaction Fatigue)', scan: "🕸️ 뉴럴 과부하: 얽혀 있는 수많은 인간관계의 기대치와 변수를 동시 연산하느라 뇌가 방전됨.", sync: "최고의 윤활유 역할을 해왔지만 지금은 기어가 마모되었습니다. 연결선을 플러그에서 뽑으십시오.", shift: "아주 이기적이고 개인적인 시간을 블로킹해두고 아무도 방해할 수 없게 차단시키기." },
            '#독성_수용성(Toxic Receptivity)': { tag: '#독성_수용성(Toxic Receptivity)', scan: "☣️ 필터링 마비: 감정적 쓰레기와 독소마저 배척하지 못하고 삼켜 내부 생태계가 썩어 들어감.", sync: "그 정화 능력은 대자연의 축복이나 독성을 분해하려면 물리적인 격리 시간이 필수입니다.", shift: "징징거리며 푸념만 쏟아내는 사람의 대화에 절대 해결책이나 공감 없이 건조하게 침묵하기." },
            '#만성적_자기희생(Chronic Sacrifice)': { tag: '#만성적_자기희생(Chronic Sacrifice)', scan: "🎁 양보 증후군: 내 순서를 항상 맨 뒤로 돌리는 것이 학습되어 정작 본인의 본능적 욕구를 상실.", sync: "가장 먼저 나를 배불려야만 올바르게 타인을 먹일 수 있습니다. 순서를 전복시켜야 합니다.", shift: "대화 시 내가 먼저 질문하지 않고 타인이 나에게 물어보고 관심을 보일 때까지 입 다물고 버티기." },
            '#감정적_갈증(Emotional Thirst)': { tag: '#감정적_갈증(Emotional Thirst)', scan: "🏜️ 가면 우울증: 겉으로는 항상 '괜찮아' 웃지만 속은 황량한 사막처럼 누구의 돌봄도 받지 못함.", sync: "타인의 짐을 져주면서 얻은 조화로운 가면입니다. 속의 사막에는 단비가 필요합니다.", shift: "정말로 억울하거나 속상했던 일 한 가지를 핑계 없이 상대방에게 적나라하게 문자로 표출하기." },
            '#타인중심_융합(Other-Directed Fusion)': { tag: '#타인중심_융합(Other-Directed Fusion)', scan: "🪐 궤도 이탈: 생각과 의사결정의 주체가 내가 아니라 '저 사람이 어떻게 생각할까'로 타겟팅됨.", sync: "뛰어난 협응력이지만 내 삶의 조이스틱을 영원히 남에게 맡기는 꼴이 됩니다. 뺏어 오십시오.", shift: "오늘 결정해야 할 모든 사소한 선택지에 타인의 시선을 배제하고 오로지 나의 직관만 따르기." },
            '#수동적_인내(Passive Endurance)': { tag: '#수동적_인내(Passive Endurance)', scan: "🥊 방어적 마비: 상황을 주도적으로 회피하거나 돌파하지 못하고 그저 맞으면서 견디는 맷집만 커짐.", sync: "진흙처럼 부드러워 다 받아내는 힘입니다. 하지만 가끔은 칼날을 노출시켜 위협해야 합니다.", shift: "부당한 요구나 무례한 농담을 받았을 때 '그건 좀 아니지'라고 날카롭게 정색하며 선 긋기." },
            '#실행유예_강박(Procrastination Loop)': { tag: '#실행유예_강박(Procrastination Loop)', scan: "🪦 과분할 증후군: 너무 완벽한 최적의 토양을 찾으려다가 수백 개의 씨앗이 하나도 심어지지 않음.", sync: "신중하게 실패를 줄이려는 고도의 연산입니다만 때로는 척박한 땅에 던져도 싹은 틉니다.", shift: "머릿속으로 며칠째 계획만 하던 일 중 가장 사소해서 오늘 당장 끝낼 수 있는 것 원격 실행하기." }
        },
        trigger: { userInputPlaceholder: "관계에서 늘 손해만 보는 기분이야.", analysisText: "비옥한 수용성 에너지가 타자에게 탈취된 상태." },
        scan: { uiMessage: "🔍 [수용성의 옥토] 영양 부족 경보", description: "모두를 먹여 살리느라 당신의 마음 밭이 메말랐습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 만물의 어머니입니다.", description: "당신의 비옥함은 어떤 씨앗도 꽃 피우게 할 수 있는 강력한 지지력입니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 경계의 펜스 설치", description: "좋은 흙은 소중한 씨앗을 위해서만 남겨두십시오.", quest: "부탁 하나 거절해보기", questAction: "부드럽게", questMantra: "나는 나를 꽃피우는 비옥한 대지다." }
    },
    '庚': {
        id: 'gyeong',
        stem: '庚',
        title: '[심판의 강철]',
        tags: [
            '#완벽통제_강박(Control Obsession)', '#방어적_고립(Defensive Isolation)', '#원리주의_인지경직(Rigid Dogmatism)',
            '#비판적_투사(Critical Projection)', '#정서_격리(Emotional Isolation)', '#극단적_이분법(Splitting)',
            '#디버깅_과몰입(Debugging Fixation)', '#적대적_침묵(Hostile Silence)', '#권위적_자기위장(Authoritarian Mask)',
            '#결단강박_마비(Decisional Anxiety)'
        ],
        tagDetails: {
            '#완벽통제_강박(Control Obsession)': { tag: '#완벽통제_강박(Control Obsession)', scan: "⚔️ 과부하된 숙살: 주변의 무질서와 통제 불능 상태를 볼 때 시냅스가 전기톱처럼 붕괴하는 현상.", sync: "무질서를 규율로 잡는 당신의 힘입니다만, 가끔은 손아귀의 힘을 뺄 타이밍을 알아야만 합니다.", shift: "통제 불가능한 남의 변수/실수를 보고 지적하지 않고 아예 눈감아버리는 강압적 둔절 훈련." },
            '#방어적_고립(Defensive Isolation)': { tag: '#방어적_고립(Defensive Isolation)', scan: "🗡️ 일기당천의 늪: 바보 같은 다수와 타협하느니 차라리 철저한 혼자인 우월성을 택하는 고립벽.", sync: "고독은 시스템의 수호자에게 주어지는 훈장이지만 진공 상태에선 숨을 쉴 수 없습니다.", shift: "수준 낮다고 판단한 커뮤니티나 무리에서 일부러 함께 '바보짓'에 5분간 합류해 보기." },
            '#원리주의_인지경직(Rigid Dogmatism)': { tag: '#원리주의_인지경직(Rigid Dogmatism)', scan: "💣 절건한 잣대: 원칙 1개가 틀어지면 프로젝트 99%를 파괴해 버리고 싶은 극단적 폐기 충동.", sync: "타협 없는 옹골참이 당신 가치의 코어입니다. 하지만 세상엔 회색지대가 반드시 존재합니다.", shift: "내 시스템이나 원칙의 아주 사소한 예외 하나를 고의로 생성해 무사히 넘어감을 입증하기." },
            '#비판적_투사(Critical Projection)': { tag: '#비판적_투사(Critical Projection)', scan: "🪚 적개심 반사: 타인의 비효율을 참지 못하는 이면엔 본인 스스로에게 가하는 살인적인 검열이 숨음.", sync: "당신의 필터를 거치면 어떤 결함도 치유됩니다. 한 번은 수술칼을 무디게 만들어야 합니다.", shift: "목 끝까지 차오른 비판의 말을 입 안에 머금은 채 '그런갑다'라고 무책임하게 흘려보내기." },
            '#정서_격리(Emotional Isolation)': { tag: '#정서_격리(Emotional Isolation)', scan: "⛄ 파충류 뇌 모드: 이성적 판단을 지키기 위해 감정의 주파수를 원천 차단해 버린 냉골 상태.", sync: "감정에 흔들리지 않는 로직이야말로 최고의 무기이나 윤활유 없는 톱니바퀴는 부서집니다.", shift: "부하나 동료에게 차가운 지시사항을 보낼 때 맨 뒤에 완전히 어색하고 다정한 이모티콘 추가하기." },
            '#극단적_이분법(Splitting)': { tag: '#극단적_이분법(Splitting)', scan: "🚫 스플리팅 에러: 대상이 완벽히 내 편이 아니면 즉각 철저한 적(Enemy)으로 구분해버리는 오류.", sync: "적과 아군을 분별해야 생존했을 터. 그러나 세상은 언제나 애매한 60%의 내통자들로 가득합니다.", shift: "꼴 보기 싫은 반대파나 적대적 인물의 의견 중 오직 1% 동의할 만한 요소 쥐어짜 내서 찾기." },
            '#디버깅_과몰입(Debugging Fixation)': { tag: '#디버깅_과몰입(Debugging Fixation)', scan: "💻 해커 신드롬: 일상적인 대화나 감정 교류조차 버그 패치 해야 할 논리 퍼즐로 전락시킨 직업병.", sync: "구조적 오류를 포착하는 뛰어난 분석 도구이지만 인간관계는 수학 디버깅 코드가 아닙니다.", shift: "누군가 고민을 이야기할 때 '해결책'을 단 하나도 제시하지 않고 무음 모드로 들어주기만 하기." },
            '#적대적_침묵(Hostile Silence)': { tag: '#적대적_침묵(Hostile Silence)', scan: "🔪 칼날 블록: 말로 상대하기 가치도 없다는 멸시와 분노를 압도적인 침묵 공격으로 치환함.", sync: "그 묵직한 침묵에 세상이 압도됩니다. 그러나 결국 관계 자체를 빙하기로 끌고들어갑니다.", shift: "상대방과 대립각이 섰을 때 무거운 침묵이 아닌 구구절절 아주 유치하게 핑계나 변명하기." },
            '#권위적_자기위장(Authoritarian Mask)': { tag: '#권위적_자기위장(Authoritarian Mask)', scan: "👑 강철 자아증: 약점을 보이면 권위가 무너질까 두려워 무지나 실수를 절대 타인에게 드러내지 않음.", sync: "당신의 존재 자체로 압도적인 통치 권력이 뿜어져 나옵니다. 숙여도 왕관은 떨어지지 않습니다.", shift: "내가 모르는 사소한 지식에 대해 내 권위를 꺾고 상대방에게 굉장히 겸손하고 무식하게 물어보라." },
            '#결단강박_마비(Decisional Anxiety)': { tag: '#결단강박_마비(Decisional Anxiety)', scan: "🪓 단두대 리코일: 모든 여지를 끊어내는 결정권의 압박감 탓에 도끼를 쥔 채 움직이지 못함.", sync: "망설이는 자를 베어버린 위대한 결단력입니다. 판단을 유예하는 것 역시 지휘관의 권한입니다.", shift: "즉시 결정을 내려야 하는 사안을 무책임하게 '내일 이 시간에 다시 얘기합시다'라고 미뤄버리기." }
        },
        trigger: { userInputPlaceholder: "무능한 사람들과 일하려니 분노가 치밀어.", analysisText: "엄격한 기준과 현실 사이의 강렬한 마찰." },
        scan: { uiMessage: "🔍 [심판의 강철] 칼날 마모 주의", description: "세상을 베어내기 위해 당신의 영혼까지 깎아내고 있습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 통치의 원칙입니다.", description: "당신이 차가운 것은 상처가 아니라 세상을 바로잡는 척도입니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 칼날의 칼집 수납", description: "비판의 칼날을 거두고 스스로를 보호하는 방패로 쓰십시오.", quest: "비판 대신 침묵 선택하기", questAction: "주먹을 쥐고", questMantra: "내 단호함은 세상을 지배하는 나침반이다." }
    },
    '辛': {
        id: 'sin',
        stem: '辛',
        title: '[정밀 세공 코어]',
        tags: [
            '#자기검열_루프(Self-Censoring)',
            '#미세결함_과각성(Hyper-Vigilance)',
            '#인지적_마비(Analysis Paralysis)',
            '#통제불안_방어기제(Defense Mechanism)',
            '#타인평가_융합(Cognitive Fusion)',
            '#완벽주의_도파민_고갈',
            '#신경증적_기준선(Baseline Anxiety)',
            '#감정_단열막(Emotional Insulation)',
            '#흑백논리_인지왜곡',
            '#투사적_비판(Projection)'
        ],
        tagDetails: {
            '#자기검열_루프(Self-Censoring)': { tag: '#자기검열_루프(Self-Censoring)', scan: "🧠 전두엽 과부하: '이 정도면 부족해'라는 내부의 가혹한 피드백이 무한 반복 중입니다.", sync: "당신의 세공 속성은 결함을 찾는 것이지, 자아를 깎아내리는 것이 아닙니다.", shift: "오늘 초안 상태(80%)의 결과물을 수정 없이 즉각 배포하여 뇌의 안전망을 확인하세요." },
            '#미세결함_과각성(Hyper-Vigilance)': { tag: '#미세결함_과각성(Hyper-Vigilance)', scan: "⚡ 편도체 알람: 1픽셀의 오차조차 생존의 위협으로 뇌가 잘못 인지하고 있습니다.", sync: "예민함은 남들이 못 보는 것을 보는 거대 자산이나, 스위치를 과도하게 켜두었습니다.", shift: "숨을 크게 들이쉬고 '이 결함이 1년 뒤 내 생존을 위협하는가?'를 소리내어 질문하세요." },
            '#인지적_마비(Analysis Paralysis)': { tag: '#인지적_마비(Analysis Paralysis)', scan: "🛑 실행 회로 차단: 완벽한 타이밍과 템플릿을 찾느라 행동 출력이 '0'인 상태.", sync: "다이아몬드는 압력 속에서 깎일 뿐, 서랍 속 설계도에서는 완성되지 않습니다.", shift: "타이머를 5분 맞추고 가장 원초적이고 허접한 실행의 첫 줄을 작성하십시오." },
            '#통제불안_방어기제(Defense Mechanism)': { tag: '#통제불안_방어기제(Defense Mechanism)', scan: "🛡️ 투바/도피 반사: 모든 변수를 쥐고 통제하려다 에너지가 고갈되어 은둔하려는 상태.", sync: "통제할 수 없는 외부 변수를 쳐내는 결단은 좋으나 세상과의 단열은 고립을 부릅니다.", shift: "오늘 일어난 사소한 변수(약속 변경 등)에 '오히려 좋아'라며 과장되게 환영해보세요." },
            '#타인평가_융합(Cognitive Fusion)': { tag: '#타인평가_융합(Cognitive Fusion)', scan: "👥 뉴럴 엉킴: 타인의 가벼운 평가와 나의 본질적 가치를 동일시(Fusion)하고 있습니다.", sync: "당신의 가치는 독립적 상수(Constant)입니다. 그들의 평가는 지나가는 변수일 뿐입니다.", shift: "평가와 나를 물리적으로 분리하는 명상: '나는 가치없다는 [생각표]를 내가 보고 있다'." },
            '#완벽주의_도파민_고갈': { tag: '#완벽주의_도파민_고갈', scan: "🔋 보상회로 에러: 결과물에서 100점을 맞아야만 분비되는 도파민을 기다리다 지침.", sync: "당신의 뇌는 더 잦고 작은 보상을 원합니다. 기준선 붕괴가 곧 새로운 에너지입니다.", shift: "아주 사소한 업무(책상 정리 등)를 마치고 과장스럽게 본인을 크게 칭찬하십시오." },
            '#신경증적_기준선(Baseline Anxiety)': { tag: '#신경증적_기준선(Baseline Anxiety)', scan: "📉 교감신경계 항진: 기본 상태가 이미 텐션(Tension) 100%에 맞춰져 호흡이 얕아집니다.", sync: "날이 선 검은 작은 바람에도 소리를 냅니다. 칼집에 넣는 법을 배워야 합니다.", shift: "어깨를 으쓱하여 귀에 닿게 한 뒤, '툭' 떨어뜨리는 이완 훈련을 3회 반복하세요." },
            '#감정_단열막(Emotional Insulation)': { tag: '#감정_단열막(Emotional Insulation)', scan: "🧊 소통의 빙점: 상처받기 싫어 선제적으로 높은 얼음벽을 치는 방어 반응.", sync: "당신의 차가움은 고고한 외피일 뿐, 내면은 흠집에 대한 두려움으로 가득 차 있습니다.", shift: "오늘은 상대에게 빙빙 돌리지 않고 '나 사실 조금 서운해'라고 직접 I-Message를 던지세요." },
            '#흑백논리_인지왜곡': { tag: '#흑백논리_인지왜곡', scan: "♟️ 이분법적 사고: 대상이 '완벽' 아니면 '쓰레기'라는 뇌의 극단적 그룹핑 오류.", sync: "모든 과정은 그라데이션입니다. 미완성은 실패가 아닌 렌더링 단계입니다.", shift: "내가 겪고 있는 문제의 상태를 0이나 100이 아닌 '45%' 형태로 수치화해서 적으세요." },
            '#투사적_비판(Projection)': { tag: '#투사적_비판(Projection)', scan: "🎯 반사 오류: 나 자신에게서 싫어하는 나태함을 상대에게서 발견할 때 분노가 폭발함.", sync: "남을 베는 그 칼날의 진짜 방향은 당신의 내면의 불안을 향하고 있었습니다.", shift: "비판이 목 끝까지 차올랐을 때 '이 결함은 내 안의 무엇을 건드렸나?' 기록해보기." }
        },
        trigger: { userInputPlaceholder: "내 결과물에 조금이라도 흠결이 보이면 견딜 수 없어.", analysisText: "완성도에 대한 결벽적 집착과 인지 융합(Cognitive Fusion) 상태 감지." },
        scan: { uiMessage: "🔍 [CBT/ACT] 인지 왜곡 감지", description: "뇌가 작은 실수를 치명적 결함으로 확대해석(Magnification)하며 교감 신경계에 과부하를 주고 있습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 고해상도 정보처리 능력입니다.", description: "당신의 정밀함(辛)은 결함을 찾는 스캐너이지 자아를 처벌하는 무기가 아닙니다. 관찰자 시점(Meta-Self)을 획득하십시오." },
        shift: { uiMessage: "🔄 마이크로 시프트: 투명한 노출(Exposure)", description: "완벽함의 압박을 끊어내기 위한 의도적 결함 노출 훈련입니다.", quest: "80% 완성본 배포 실험", questAction: "두려움을 수용하며", questMantra: "나의 가치는 결과물의 오차에 지배당하지 않는 상수다." }
    },
    '壬': {
        id: 'im',
        stem: '壬',
        title: '[예측 불허의 심연]',
        tags: [
            '#연산_오버플로우(Computation Overflow)', '#미래_불안발작(Anticipatory Anxiety)', '#지성화_방어기제(Intellectualization)',
            '#심연적_가라앉음(Abyssal Depression)', '#만성적_무기력(Chronic Lethargy)', '#사고의_파멸적홍수(Catastrophizing)',
            '#분석적_단절(Analytical Detachment)', '#실행지연_마비(Execution Paralysis)', '#공감_과부하(Empathic Distress)',
            '#자아_해리현상(Dissociative Identity)'
        ],
        tagDetails: {
            '#연산_오버플로우(Computation Overflow)': { tag: '#연산_오버플로우(Computation Overflow)', scan: "🌊 신경망 홍수: 절대 일어나지 않을 미세한 확률까지 수조 번 연산하여 뇌의 대역폭을 초과함.", sync: "바닥 모를 지혜의 원천이지만 데이터 입력을 멈추지 않으면 시스템이 붕괴합니다.", shift: "생각을 멈추기 위해 의도적으로 아주 자극적인 온도(아주 차갑거나 뜨거운 물)를 신체에 노출하기." },
            '#미래_불안발작(Anticipatory Anxiety)': { tag: '#미래_불안발작(Anticipatory Anxiety)', scan: "🕳️ 심해성 공황: 아직 오지 않은 시간에 대한 불확실성을 생존 위협으로 간주해 호흡이 가빠짐.", sync: "당신은 시간의 흐름을 읽는 예언가입니다. 하지만 예언가도 밥은 오늘 먹어야 합니다.", shift: "시계를 시야에서 전부 치우고 스마트폰 없이 5분 동안 지금 내 맥박에만 온전히 집중하기." },
            '#지성화_방어기제(Intellectualization)': { tag: '#지성화_방어기제(Intellectualization)', scan: "🧠 뇌내 도피: 직접 부딪혀 상처받는 대신, 상황을 학술적이고 추상적인 이론으로 격리해 버림.", sync: "거대 담론을 읽어내는 능력이 탁월하지만, 피부에 닿는 상처를 피하기 위한 변명이 될 수 있습니다.", shift: "우아하고 철학적인 단어를 단 하나도 쓰지 않고 무식하고 본능적인 쌍욕으로 감정 한 줄 적어보기." },
            '#심연적_가라앉음(Abyssal Depression)': { tag: '#심연적_가라앉음(Abyssal Depression)', scan: "🌀 내부 침잠: 자신을 고립시키면서 그 고통 속에서 기묘한 카타르시스와 안정감을 느끼는 상태.", sync: "어둠 속에서 진리를 찾는 당신만의 시간이나 잠수병에 걸리지 않으려면 수면으로 올라와야 합니다.", shift: "일부러 가장 천박하고 요란한 트로트나 시끄러운 댄스 음악을 귀에 꽂고 심연의 무드를 강제파괴하기." },
            '#만성적_무기력(Chronic Lethargy)': { tag: '#만성적_무기력(Chronic Lethargy)', scan: "🐢 운동성 마비: 에너지가 방전된 것이 아니라 너무 거대하게 얽혀 옴짝달싹할 수 없는 데드록 상태.", sync: "당신의 큰 동력 체계가 부팅 중인 시간입니다. 조급함이 오히려 배터리를 방전시킵니다.", shift: "1시간 동안 '아무 짝에도 쓸모없는 미생물'이라고 자신을 정의하며 바닥에 엎드려 뒹굴기." },
            '#사고의_파멸적홍수(Catastrophizing)': { tag: '#사고의_파멸적홍수(Catastrophizing)', scan: "🌊 재앙화 사고: 꼬리를 무는 아이디어가 결국 모든 것이 멸망하는 최악의 시나리오로 치달음.", sync: "리더로서 위상과 변수를 감지하는 능력이나 당신의 상상력이 항상 현실이 되지는 않습니다.", shift: "머릿속 수만 가지 생각 중 가장 중요하지도 않고 영양가도 없는 단 하나의 행동을 충동적으로 개시." },
            '#분석적_단절(Analytical Detachment)': { tag: '#분석적_단절(Analytical Detachment)', scan: "👁️ 초연함의 위장: 속을 다 읽어버려 상처받는 것을 막기 위해 아예 상대와 정서적 연결망을 절단함.", sync: "직관적 예리함이 방어막이 되었습니다. 통찰의 눈을 감고 마음의 눈만 뜰 때도 필요합니다.", shift: "상대의 의도나 꿍꿍이가 뻔히 보이더라도 속아주는 척 빙긋 웃으며 '치명적인 바보' 역할 연기하기." },
            '#실행지연_마비(Execution Paralysis)': { tag: '#실행지연_마비(Execution Paralysis)', scan: "🌌 관망성 정지: 세상을 다 아는 철학자 모드에 빠져 정작 눈앞의 카드 고지서를 잊는 현실 괴리.", sync: "모든 것을 조망하는 지혜는 픽셀 단위의 행동이 결합 될 때 비로소 우주를 구현합니다.", shift: "거시적 통찰을 끄고, 오늘 당장 해야 하는 쓰레기 버리기, 영수증 처리 등 미세 작업 1개 수행." },
            '#공감_과부하(Empathic Distress)': { tag: '#공감_과부하(Empathic Distress)', scan: "☠️ 중추 흡수증: 경계선 없이 세상의 모든 오염된 감정을 스펀지처럼 빨아들여 자아가 탁해짐.", sync: "바다처럼 무엇이든 다 포용하지만 하수구 배관을 아예 끊어낼 결단력도 필요합니다.", shift: "누군가 조금이라도 부정적이거나 징징대는 말을 꺼내면 '그래서?' 라며 공감 스위치를 완전 끄기." },
            '#자아_해리현상(Dissociative Identity)': { tag: '#자아_해리현상(Dissociative Identity)', scan: "🫖 형이상학적 융해: 담기는 그릇(상황)에 맞추다 원래 내 자아의 형태가 무엇인지 기억나지 않음.", sync: "극한의 적응력이 당신을 생존케 했으나 당신만의 고유명사를 잊어선 안 됩니다.", shift: "상황에 어울리지 않더라도 가장 독특하고 튀는 나만의 고유한 복장이나 언어 습관을 의도적으로 전시." }
        },
        trigger: { userInputPlaceholder: "생각이 꼬리에 꼬리를 물어 무기력해져.", analysisText: "과잉 사고와 심리적 심연 사이의 데드락." },
        scan: { uiMessage: "🔍 [예측 불허의 심연] 수압 주의보", description: "깊은 바닷속 생각의 무게가 당신을 짓누르고 있습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 무한한 지혜입니다.", description: "당신은 우주의 보이지 않는 흐름까지 읽어내는 깊은 통찰을 가졌습니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 표면 비상", description: "심해에서 벗어나 지금 눈앞의 픽셀 행동 하나에 집중하세요.", quest: "작은 정리정돈 하나 하기", questAction: "심호흡하며", questMantra: "내 안의 파도는 불안이 아닌 위대한 흐름이다." }
    },
    '癸': {
        id: 'gye',
        stem: '癸',
        title: '[이슬비의 침투력]',
        tags: [
            '#공감_피로증후군(Compassion Fatigue)', '#경계선_융해(Boundary Dissolution)', '#방어적_은폐(Defensive Concealment)',
            '#자아_초점상실(Deindividuation)', '#정서적_침투(Emotional Infiltration)', '#초각성_레이더(Hyper-Reactive Radar)',
            '#비가시적_우울(Invisible Depression)', '#플리즈마인드_강박(People Pleasing)', '#가면_페르소나(Mask Persona)',
            '#소외적_방어벽(Alienating Wall)'
        ],
        tagDetails: {
            '#공감_피로증후군(Compassion Fatigue)': { tag: '#공감_피로증후군(Compassion Fatigue)', scan: "🌧️ 자아 세척: 타인의 심연까지 들여다보려다 필터망이 찢어져 내 영혼까지 오염의 파도를 맞는 상태.", sync: "세심한 친화력은 마력에 가깝지만 그 마력은 당신의 자아 에너지를 땔감으로 씁니다.", shift: "상대방의 불편함에 일말의 책임감을 느끼지 않고 의도적으로 냉랭한 표정 유지해 보기." },
            '#경계선_융해(Boundary Dissolution)': { tag: '#경계선_융해(Boundary Dissolution)', scan: "💧 자아 삼투압: 구원자 환상에 빠져 초대받지 않은 타인의 바운더리에 과도하게 녹아들어버림.", sync: "스며드는 이슬은 은은하지만 홍수가 날 필요는 없습니다. 내 영토로 물을 돌려야 합니다.", shift: "도와달라는 신호가 오기 전까지는 타인의 고민에 절대로 먼저 해결책을 제시하지 않기." },
            '#방어적_은폐(Defensive Concealment)': { tag: '#방어적_은폐(Defensive Concealment)', scan: "🕵️ 안개 투사: 모든 방향의 정보를 흡수하면서 정작 본인의 진짜 코어는 아무에게도 내보이지 않음.", sync: "고도의 자기보호 기제 덕에 안전했으나, 깊은 연결감마저 차단시키는 스텔스 모드입니다.", shift: "내가 겪은 사소하고 창피한 실패 경험(지각, 실수 등) 한 가지를 과감히 타인에게 노출하기." },
            '#자아_초점상실(Deindividuation)': { tag: '#자아_초점상실(Deindividuation)', scan: "☁️ 탈개인화 현상: 수증기처럼 너무 가볍게 부유하며 상대의 기압골에만 나를 맞추려다 본질이 증발.", sync: "최고의 스파이처럼 분위기를 탔을 뿐 당신은 사라지지 않았습니다. 응결핵이 잠시 없을 뿐.", shift: "자신의 확실한 감정이나 호불호 한 가지를 남의 눈치 전혀 보지 않고 크게 선언해버리기." },
            '#정서적_침투(Emotional Infiltration)': { tag: '#정서적_침투(Emotional Infiltration)', scan: "☔ 기저 삼투압: 촉촉한 배려가 통제 강박으로 변질하여 상대의 모든 감정을 장악하려고 시도함.", sync: "섬세함은 훌륭한 전략이지만 상대방의 자생력을 빼앗을 정도로 물을 오래 뿌려선 안 됩니다.", shift: "오늘 누군가를 위해 습관적으로 하려던 사소한 배려를 멈추고 빈틈이 발생하도록 고의로 방치." },
            '#초각성_레이더(Hyper-Reactive Radar)': { tag: '#초각성_레이더(Hyper-Reactive Radar)', scan: "📡 광대역 패닉: 주변의 공기 흐름이나 타인의 표정 하나하나를 수조 단위의 데이터로 읽느라 터지기 직전.", sync: "정보를 해독하는 뉴럴넷은 강력하지만 서버 냉각 시간 없이 풀 가동하면 부품이 탑니다.", shift: "스마트폰, 인터넷, 음악 없이 귀마개를 끼고 감각을 철저하게 진공 상태로 만들어 휴식하기." },
            '#비가시적_우울(Invisible Depression)': { tag: '#비가시적_우울(Invisible Depression)', scan: "💧 잠수함 증후군: 소리 지르며 SOS를 치지 않고 혼자 방구석 지하로 끝없이 가라앉는 깊은 고독 상태.", sync: "비극의 여주인공식 처연함을 스스로 우아하게 여길 수 있으나 이제 밖으로 소음을 낼 때입니다.", shift: "우아함과 처연함을 집어 던지고 가장 시끄럽고 유치한 방법(노래방, 막막, 쌍욕 등)으로 발산." },
            '#플리즈마인드_강박(People Pleasing)': { tag: '#플리즈마인드_강박(People Pleasing)', scan: "🔑 마스터키 컴플렉스: 만물에 다 맞춰주려는 이타성이 자신을 갉아먹는 줄도 모르고 열쇠 구멍에 쑤셔 넣음.", sync: "당신은 모든 문을 열 수 있는 능력이 있지만, 굳이 안 열어도 되는 남의 문이 더 많습니다.", shift: "다른 사람의 요청에 '알겠습니다' 대신 '지금은 좀 곤란한데요'라는 무거운 철문으로 반응하기." },
            '#가면_페르소나(Mask Persona)': { tag: '#가면_페르소나(Mask Persona)', scan: "🎭 과조정 스마일: 생존을 위해 장착한 사회적 미소가 인지 부조화를 일으켜 안면 근육이 경련을 일으킴.", sync: "생태계를 지배하는 가장 지능적인 위장술입니다. 하지만 그 스킨십 보호막 아래 본체는 울고 있습니다.", shift: "억지웃음을 짓지 말고 화가 나거나 슬프면 표정 관리를 완전히 포기한 낯빛을 노출해 보기." },
            '#소외적_방어벽(Alienating Wall)': { tag: '#소외적_방어벽(Alienating Wall)', scan: "🧊 결빙 쉴드: 겉으론 상냥하지만 결정적인 내면의 선 반경 1cm 안으로는 방탄 유리를 쳐둔 철벽 상태.", sync: "투명하고 유연해 보이지만 자아 훼손을 본능적으로 거부해 온 강력한 생존 프레임워크입니다.", shift: "방탄유리를 깨는 연습: 나를 절대 해치지 않을 가장 친한 1인에게 '나는 외롭다'고 돌직구 날리기." }
        },
        trigger: { userInputPlaceholder: "남의 기분을 맞추느라 내 진짜 기분을 모르겠어.", analysisText: "타자와의 경계 상실 및 감정 오염 상태." },
        scan: { uiMessage: "🔍 [이슬비의 침투력] 탁기 누적 감지", description: "당신은 본연의 투명함을 잃고 타인의 우울을 대신 앓고 있습니다." },
        sync: { uiMessage: "🧬 싱크로율 확인: 극강의 유연성입니다.", description: "당신은 어떤 그릇에도 맞춰질 수 있는 소리 없는 마스터키입니다." },
        shift: { uiMessage: "🔄 에너지 시프트: 수증기 증발", description: "타인에게 스며들지 말고 공기 중으로 날아가 거리를 두세요.", quest: "혼자만의 산책 10분", questAction: "눈을 지그시 감고", questMantra: "나는 유연하게 스며드나 포섭되지 않는 비의 정수다." }
    }
};

export const getTagsBySaju = (stemChar: string | undefined): string[] => {
    if (!stemChar) return Object.values(SAJU_3S_SCENARIOS)[0].tags; 
    const match = Object.values(SAJU_3S_SCENARIOS).find(
        (s) => s.stem === stemChar || s.title.includes(stemChar) || s.id === stemChar
    );
    return match ? match.tags : Object.values(SAJU_3S_SCENARIOS)[0].tags; 
};

export const getScenarioByTag = (tag: string): Saju3SScenario | undefined => {
    return Object.values(SAJU_3S_SCENARIOS).find((scenario) => scenario.tags.includes(tag));
};

export const getAllScenarioTags = () => {
    const allTags: string[] = [];
    Object.values(SAJU_3S_SCENARIOS).forEach(s => {
        allTags.push(...s.tags);
    });
    return Array.from(new Set(allTags));
};
