// 64 Neural Code Database - Complete Set (명심코칭 AI 주역)
// Based on "AI 주역: 운명의 알고리즘을 해킹하다" by 이경윤

export interface NeuralCode {
    number: number;
    title: string;
    subtitle: string;
    hexagram: number[];
    darkCode: { name: string; description: string };
    gift: { name: string; description: string; tags: string[] };
    metaCode: { name: string; description: string };
    journalPrompt: string;
}

export const NEURAL_CODE_DATABASE: NeuralCode[] = [
    // Code 01-16: 초기 구동 엔진 (Booting Sequence)
    {
        number: 1,
        title: "창조의 엔진",
        subtitle: "0에서 1을 만드는 순수한 에너지 소스",
        hexagram: [1, 1, 1, 1, 1, 1],
        darkCode: { name: "관성", description: "시스템 프리징. 고사양 엔진을 탑재했지만 시동을 걸지 않아 녹이 슬고 있는 상태. 에너지가 갇혀서 썩고 있는 변비 상태." },
        gift: { name: "점화", description: "예열 없이 바로 실행. 퀄리티를 따지지 말고 일단 결과물을 뱉어내는 능력. 새로운 것을 저지를 때만 도파민이 주입됨.", tags: ["창조", "실행력"] },
        metaCode: { name: "발광", description: "압도적 존재감. 무엇을 만들어서가 아니라 시스템이 최고 효율로 돌아가며 뿜어내는 열기 자체가 빛이 됨." },
        journalPrompt: "오늘 당신이 시작하지 못하고 있는 것은 무엇인가요? 완벽하지 않아도 일단 시작한다면?"
    },
    {
        number: 2,
        title: "항해의 엔진",
        subtitle: "흐름을 읽고 수용하는 내부 GPS",
        hexagram: [0, 0, 0, 0, 0, 0],
        darkCode: { name: "신호 유실", description: "경로 이탈 경고. GPS 신호를 놓친 내비게이션처럼 공포에 휩싸임. 남의 지도를 훔쳐보거나 억지로 아무 길이나 가려다 시스템이 꼬임." },
        gift: { name: "항법", description: "신호 대기. 방향 감각은 내가 찾을 때가 아니라 세상이 나를 초대할 때 켜짐. 흐름에 몸을 맡기는 것이 가장 빠른 길.", tags: ["수용", "타이밍"] },
        metaCode: { name: "동기화", description: "자동 주행. 나와 우주의 좌표가 실시간으로 동기화됨. 내가 가는 곳이 곧 길이며 우연조차 운명적 지름길." },
        journalPrompt: "지금 당신이 억지로 밀어붙이고 있는 것은 무엇인가요? 흐름에 맡긴다면?"
    },
    {
        number: 3,
        title: "혁신의 엔진",
        subtitle: "기존 질서를 깨고 새 판을 짜는 돌연변이 코드",
        hexagram: [0, 1, 0, 0, 1, 0],
        darkCode: { name: "글리치", description: "초기화 오류. 변화가 시작될 때 발생하는 노이즈를 견디지 못함. 정돈되지 않은 데이터들로 머리가 터질 것 같음." },
        gift: { name: "디버깅", description: "난세의 영웅. 혼란을 즐기며 기존 질서가 무너진 틈이야말로 새로운 코드를 심을 기회로 활용.", tags: ["혁신", "용기"] },
        metaCode: { name: "유희", description: "플레이어. 심각함을 버리고 아이처럼 즐김. 인생이라는 게임의 룰을 자유자재로 바꾸며 혁신을 놀이하듯 일으킴." },
        journalPrompt: "완벽하지 않아도 시작할 수 있는 것은 무엇인가요? 불완전함이 주는 선물은?"
    },
    {
        number: 4,
        title: "논리의 엔진",
        subtitle: "불확실한 것을 명확한 공식으로 만드는 코드",
        hexagram: [1, 0, 0, 0, 1, 0],
        darkCode: { name: "논리 오류", description: "강박적 의심. 이해되지 않는 것을 참지 못함. 정답을 찾을 때까지 뇌를 혹사시켜 편두통 유발." },
        gift: { name: "알고리즘", description: "판단 중지. 논리는 타인을 찌르는 칼이 아니라 혼란을 정리해 주는 가위. 모든 질문에 답할 필요는 없다는 변수 인정.", tags: ["분석", "이해"] },
        metaCode: { name: "허용", description: "버그 수용. 세상에는 논리로 설명되지 않는 오류조차 필요함을 깨달음. 바보 같은 행동조차 웃으며 넘기는 여유." },
        journalPrompt: "당신이 모른다고 인정하기 두려운 것은 무엇인가요? 진정한 질문은?"
    },
    {
        number: 5,
        title: "리듬의 엔진",
        subtitle: "생체 리듬과 타이밍의 코드",
        hexagram: [0, 1, 1, 1, 1, 0],
        darkCode: { name: "버퍼링", description: "타이밍 엇박자. 로딩 시간을 견디지 못해 클릭을 난타하다가 시스템 다운. 밥이 뜸도 들기 전에 솥뚜껑을 엶." },
        gift: { name: "충전", description: "대기 모드. 기다림은 정지가 아니라 에너지 충전 구간. 씨앗이 싹트기를 기다리듯 자연의 리듬과 조화.", tags: ["인내", "타이밍"] },
        metaCode: { name: "영원", description: "절대 시간. 시간의 환상을 초월. 과거도 미래도 없이 오직 지금 이 순간만 존재함을 아는 깨달음." },
        journalPrompt: "지금 당신이 조급하게 서두르고 있는 것은 무엇인가요? 기다림이 주는 선물은?"
    },
    {
        number: 6,
        title: "해결의 엔진",
        subtitle: "충돌을 통해 더 나은 합의를 도출하는 마찰 에너지",
        hexagram: [1, 1, 1, 0, 1, 0],
        darkCode: { name: "마찰열", description: "끝없는 시비. 모든 관계를 승패 게임으로 봄. 이기더라도 시스템 과열로 본인도 망가짐." },
        gift: { name: "프로토콜", description: "안전거리 확보. 감정을 섞지 말고 규칙대로 처리. 갈등의 에너지를 생산적인 협상 테이블로 가져옴.", tags: ["소통", "협상"] },
        metaCode: { name: "평화 조약", description: "경계의 미학. 싸우지 않고 이김. 평소 기준이 명확하기에 불필요한 분쟁이 끼어들 틈이 없음." },
        journalPrompt: "당신이 회피하고 있는 갈등은 무엇인가요? 진실을 말한다면 어떤 평화가?"
    },
    {
        number: 7,
        title: "지휘의 엔진",
        subtitle: "대중을 하나의 목표로 결집시키는 강력한 리더십",
        hexagram: [0, 0, 0, 1, 0, 0],
        darkCode: { name: "폭주", description: "무질서한 떼법. 목적 없는 분노 표출. 리더십이 오작동하여 조직을 와해시킴." },
        gift: { name: "규율", description: "원칙 수립. 감정이 아닌 원칙으로 움직임. 명확한 목표와 엄격한 가이드라인이 있을 때 불안은 추진력이 됨.", tags: ["리더십", "통솔"] },
        metaCode: { name: "수호자", description: "진정한 리더. 무력이 아닌 덕으로 통솔. 힘은 시스템 전체를 보호하고 정의를 수호하는 데 쓰임." },
        journalPrompt: "당신이 이끌어야 할 영역은 어디인가요? 리더십을 두려워하는 이유는?"
    },
    {
        number: 8,
        title: "연결의 엔진",
        subtitle: "사람과 사람이 자연스럽게 섞이는 친화력 코드",
        hexagram: [0, 0, 0, 0, 1, 0],
        darkCode: { name: "접속 불량", description: "기회주의. 계산기를 두드리며 간을 봄. 손해 볼 것 같으면 접속을 끊어버림." },
        gift: { name: "핸드쉐이크", description: "선접속. 계산하지 말고 먼저 손을 내밈. 내가 먼저 좋은 노드가 되면 맞는 주파수의 사람들이 저절로 모임.", tags: ["협력", "네트워크"] },
        metaCode: { name: "융합", description: "자석 같은 매력. 서로 다른 개성을 가진 사람들을 하나의 플랫폼 위에서 융합시킴." },
        journalPrompt: "당신이 공동체에 기여할 수 있는 고유한 재능은 무엇인가요?"
    },
    {
        number: 9,
        title: "집적의 엔진",
        subtitle: "폭발 직전의 압축 상태. 디테일과 복리의 마법",
        hexagram: [1, 1, 1, 0, 1, 1],
        darkCode: { name: "노이즈", description: "끓지 않는 냄비. 작은 성과를 무시하고 대박만 쫓음. 에너지가 산만하게 흩어짐." },
        gift: { name: "초점", description: "마이크로 해빗. 하루 10분 같은 작은 데이터를 쌓는 것에 집중. 티끌이 모여 빅데이터가 됨.", tags: ["집중", "디테일"] },
        metaCode: { name: "레이저", description: "장인의 경지. 작은 것이 아름다움. 1mm의 오차를 잡아내는 디테일이 평범함과 위대함을 가름." },
        journalPrompt: "당신의 에너지를 흩뜨리는 것들은 무엇인가요? 진정으로 집중해야 할 한 가지는?"
    },
    {
        number: 10,
        title: "자존의 엔진",
        subtitle: "호랑이 꼬리를 밟는 위험 속에서도 나를 지키는 태도",
        hexagram: [1, 1, 0, 1, 1, 1],
        darkCode: { name: "방어 기제", description: "대인기피. 세상이 온통 지뢰밭 같음. 타인의 반응에 과민하게 반응하며 스스로를 감옥에 가둠." },
        gift: { name: "인터페이스", description: "예절이라는 갑옷. 정중한 인사와 깔끔한 복장은 가장 강력한 방화벽. 예의를 갖추면 호랑이도 친구로 인식.", tags: ["예의", "품격"] },
        metaCode: { name: "고유성", description: "위기 속의 왈츠. 가장 위험한 순간에 가장 우아함. 남들의 시선에 굴하지 않고 나만의 스텝으로 춤을 춤." },
        journalPrompt: "당신이 숨기고 있는 진짜 모습은 무엇인가요? 자연스러워진다면?"
    },
    {
        number: 11,
        title: "번영의 엔진",
        subtitle: "모든 것이 순조롭게 교류하는 최상의 상태",
        hexagram: [0, 0, 0, 1, 1, 1],
        darkCode: { name: "정체", description: "현실 안주. 평화에 취해 게을러짐. 시스템 내부에서 엔트로피가 증가하여 썩어가기 시작." },
        gift: { name: "배양", description: "정원사 마인드. 평화로울 때 더 부지런히 잡초를 뽑음. 끊임없이 새로운 아이디어를 심고 가꿈.", tags: ["성장", "창조"] },
        metaCode: { name: "청사진", description: "역동적 균형. 아이디어가 멈춰있지 않고 현실이 됨. 꿈꾸는 이상향이 주변을 풍요롭게 만듦." },
        journalPrompt: "당신이 꿈꾸는 이상적인 미래는 무엇인가요? 그 비전을 현실로 만들 첫걸음은?"
    },
    {
        number: 12,
        title: "고독의 엔진",
        subtitle: "소통이 차단된 상태. 멈춤을 통해 본질을 여과하는 필터링 코드",
        hexagram: [1, 1, 1, 0, 0, 0],
        darkCode: { name: "차단", description: "피해 망상. 세상이 나를 왕따시킨다고 느낌. 마음의 방화벽을 높게 세우고 동굴 속으로 숨음." },
        gift: { name: "필터링", description: "노이즈 캔슬링. 영혼이 요청한 방해 금지 모드. 외부 소음을 차단하고 내면의 소리에 집중.", tags: ["고독", "정화"] },
        metaCode: { name: "본질", description: "은둔의 고수. 섞이지 않아도 불안하지 않음. 침묵은 웅변보다 큰 무게감. 순수한 본질만 남음." },
        journalPrompt: "지금 당신에게 필요한 고독의 시간은 무엇인가요?"
    },
    {
        number: 13,
        title: "동지의 엔진",
        subtitle: "뜻을 같이하는 사람들과 연합",
        hexagram: [1, 1, 1, 1, 0, 1],
        darkCode: { name: "종속", description: "관계 중독. 혼자 있는 것을 견디지 못함." },
        gift: { name: "수신", description: "WHY로 연결. 미래의 비전을 공유하는 사람들을 식별.", tags: ["연대", "비전"] },
        metaCode: { name: "원 네트워크", description: "시대를 이끄는 커뮤니티의 리더." },
        journalPrompt: "당신과 진정으로 비전을 공유하는 사람은 누구인가요?"
    },
    {
        number: 14,
        title: "소유의 엔진",
        subtitle: "만물을 비추는 태양처럼 크게 소유",
        hexagram: [1, 0, 1, 1, 1, 1],
        darkCode: { name: "누수", description: "갑질과 낭비. 에너지를 펑펑 씀." },
        gift: { name: "자산 관리", description: "돈과 재능을 흐르는 물처럼 관리.", tags: ["관리", "순환"] },
        metaCode: { name: "무한 저장소", description: "소유가 세상의 축복이 됨." },
        journalPrompt: "당신이 가진 것을 어떻게 흘려보낼 수 있을까요?"
    },
    {
        number: 15,
        title: "균형의 엔진",
        subtitle: "극단을 피하고 균형을 잡는 힘",
        hexagram: [0, 0, 1, 0, 0, 0],
        darkCode: { name: "회색 지대", description: "가면 증후군. 자기를 깎아내림." },
        gift: { name: "밸런싱", description: "자신의 성취를 팩트대로 인정.", tags: ["겸손", "균형"] },
        metaCode: { name: "아우라", description: "애쓰지 않아도 저절로 존경받는 경지." },
        journalPrompt: "당신이 과소평가하고 있는 자신의 능력은 무엇인가요?"
    },
    {
        number: 16,
        title: "열광의 엔진",
        subtitle: "미래를 미리 기뻐하며 준비하는 열정",
        hexagram: [0, 0, 1, 0, 0, 0],
        darkCode: { name: "지연", description: "망상 모드. 시작은 요란하나 끝이 없음." },
        gift: { name: "루틴", description: "매일 정해진 시간에 반복하는 훈련.", tags: ["열정", "규칙"] },
        metaCode: { name: "마에스트로", description: "시대를 연주하고 심장을 울리는 예술." },
        journalPrompt: "당신의 열정을 담을 규칙은 무엇인가요?"
    },
    {
        number: 17,
        title: "공감의 엔진",
        subtitle: "주도권을 쥐기 위한 전략적 팔로잉",
        hexagram: [0, 1, 1, 1, 0, 0],
        darkCode: { name: "종속", description: "자아 상실. 타인의 감정에 쉽게 감염됨." },
        gift: { name: "미러링", description: "상대의 주파수를 복사하여 접속 권한을 얻음.", tags: ["공감", "전략"] },
        metaCode: { name: "서핑", description: "파도를 통제하지 않고 파도에 올라탐." },
        journalPrompt: "당신이 진정으로 따르고 싶은 사람은 누구인가요?"
    },
    {
        number: 18,
        title: "치유의 엔진",
        subtitle: "썩은 부위를 도려내고 새 살을 돋게 함",
        hexagram: [1, 0, 0, 0, 1, 1],
        darkCode: { name: "바이러스", description: "과거의 오류를 방치하여 시스템 전체를 오염." },
        gift: { name: "디버깅", description: "환부를 정확히 찾아내어 도려냄.", tags: ["치유", "변화"] },
        metaCode: { name: "업그레이드", description: "겪은 오류들이 타인을 치유하는 데이터베이스가 됨." },
        journalPrompt: "당신이 끊어야 할 악순환은 무엇인가요?"
    },
    {
        number: 19,
        title: "접근의 엔진",
        subtitle: "윗사람이 아랫사람에게 다가가는 따뜻한 접근",
        hexagram: [0, 0, 0, 0, 1, 1],
        darkCode: { name: "간섭", description: "도움이라는 명목으로 타인의 영역을 침범." },
        gift: { name: "접속", description: "주파수를 상대의 눈높이로 낮출 때 연결됨.", tags: ["소통", "배려"] },
        metaCode: { name: "공명", description: "존재 자체가 곁에 있는 사람들의 영혼을 울림." },
        journalPrompt: "당신이 진정으로 다가가고 싶은 사람은 누구인가요?"
    },
    {
        number: 20,
        title: "통찰의 엔진",
        subtitle: "세상 만물을 높은 곳에서 내려다보는 관찰자의 눈",
        hexagram: [1, 1, 0, 0, 0, 0],
        darkCode: { name: "랙", description: "분석 마비. 생각만 길어지고 실행이 안 됨." },
        gift: { name: "줌 아웃", description: "복잡한 미로의 전체 지도를 그려내는 참모.", tags: ["통찰", "전략"] },
        metaCode: { name: "현존", description: "시선이 닿는 곳마다 진실이 드러남." },
        journalPrompt: "당신이 높은 곳에서 바라봐야 할 문제는 무엇인가요?"
    },
    {
        number: 21,
        title: "결단의 엔진",
        subtitle: "장애물을 씹어서 부수는 강력한 집행관",
        hexagram: [1, 0, 0, 1, 0, 1],
        darkCode: { name: "통제 오류", description: "내 뜻대로 안 되면 시스템을 부숨." },
        gift: { name: "편집", description: "감정을 섞지 말고 시스템의 오류만 정확하게 제거.", tags: ["결단", "정의"] },
        metaCode: { name: "정의", description: "칼은 썩은 것을 도려내어 모두를 살리는 수술칼." },
        journalPrompt: "당신이 결단해야 할 것은 무엇인가요?"
    },
    {
        number: 22,
        title: "미학의 엔진",
        subtitle: "본질을 아름답게 꾸미는 디자인과 형식",
        hexagram: [1, 0, 1, 0, 0, 0],
        darkCode: { name: "글리치", description: "내실은 없는데 껍데기만 화려함." },
        gift: { name: "디자인", description: "본질을 가장 잘 드러낼 수 있는 UI/UX 구축.", tags: ["미학", "디자인"] },
        metaCode: { name: "백색광", description: "내면의 광원이 너무 밝아 겉치장이 필요 없음." },
        journalPrompt: "당신의 본질을 가장 잘 드러내는 형식은 무엇인가요?"
    },
    {
        number: 23,
        title: "정리의 엔진",
        subtitle: "낡은 것이 무너지고 떨어져 나가는 박탈과 정리",
        hexagram: [1, 0, 0, 0, 0, 0],
        darkCode: { name: "파편화", description: "무너지는 것을 붙잡으려다 시스템이 다운." },
        gift: { name: "단순화", description: "불필요한 캐시 파일들을 삭제하고 시스템을 가볍게.", tags: ["정리", "단순화"] },
        metaCode: { name: "코어", description: "모든 장식이 떨어져 나가고 오직 핵심만 남음." },
        journalPrompt: "당신이 내려놓아야 할 것은 무엇인가요?"
    },
    {
        number: 24,
        title: "회복의 엔진",
        subtitle: "긴 겨울 끝에 다시 돌아오는 봄",
        hexagram: [0, 0, 0, 0, 0, 1],
        darkCode: { name: "무한 루프", description: "똑같은 실수를 반복. 중독의 굴레." },
        gift: { name: "재부팅", description: "작은 사이클부터 다시 돌림. 회복 탄력성.", tags: ["회복", "재시작"] },
        metaCode: { name: "사이클", description: "시련 뒤에 반드시 반등이 옴을 알기에 두려워하지 않음." },
        journalPrompt: "당신이 다시 시작해야 할 것은 무엇인가요?"
    },
    {
        number: 25,
        title: "진실의 엔진",
        subtitle: "거짓과 망령됨이 없는 순수",
        hexagram: [1, 0, 0, 1, 1, 1],
        darkCode: { name: "버그", description: "충동적 오류. 무계획을 순수함으로 착각." },
        gift: { name: "로우 데이터", description: "가공되지 않은 날것의 데이터를 그대로 전송.", tags: ["진실", "순수"] },
        metaCode: { name: "자연", description: "하늘의 알고리즘과 나의 알고리즘이 일치." },
        journalPrompt: "당신이 말하지 못하고 있는 진실은 무엇인가요?"
    },
    {
        number: 26,
        title: "축적의 엔진",
        subtitle: "큰 에너지를 안으로 모아 기르는 힘",
        hexagram: [1, 0, 0, 1, 1, 1],
        darkCode: { name: "압축", description: "에너지를 쓰지 못해 속에서 열불이 남." },
        gift: { name: "캐싱", description: "폭발적인 구동을 위한 사전 로딩.", tags: ["축적", "준비"] },
        metaCode: { name: "클라우드", description: "거대한 지혜의 서버. 입을 열면 솔루션이 다운로드됨." },
        journalPrompt: "당신이 지금 축적해야 할 것은 무엇인가요?"
    },
    {
        number: 27,
        title: "양육의 엔진",
        subtitle: "입을 통해 먹고 말하며 기르는 에너지",
        hexagram: [1, 0, 0, 0, 0, 1],
        darkCode: { name: "배드 인풋", description: "몸에 나쁜 음식을 넣고 입으로 나쁜 말을 뱉음." },
        gift: { name: "필터링", description: "건강한 음식, 정보, 언어만 통과시킴.", tags: ["양육", "관리"] },
        metaCode: { name: "소스", description: "굶주린 자에게 밥을, 영혼이 고픈 자에게 지혜를 주는 공급원." },
        journalPrompt: "당신이 섭취하고 있는 것들은 건강한가요?"
    },
    {
        number: 28,
        title: "과부하의 엔진",
        subtitle: "기둥이 휘어질 정도로 무거운 짐",
        hexagram: [0, 1, 1, 1, 1, 0],
        darkCode: { name: "번아웃", description: "감당할 수 없는 트래픽으로 서버가 다운." },
        gift: { name: "피벗", description: "과감하게 불필요한 프로세스를 종료.", tags: ["전환", "용기"] },
        metaCode: { name: "독립", description: "누구에게도 의존하지 않고 홀로 서도 두렵지 않음." },
        journalPrompt: "당신이 내려놓아야 할 짐은 무엇인가요?"
    },
    {
        number: 29,
        title: "심연의 엔진",
        subtitle: "첩첩산중의 물. 인생의 가장 깊은 어둠",
        hexagram: [0, 1, 0, 0, 1, 0],
        darkCode: { name: "싱크홀", description: "감정의 늪에 빠져 허우적거림." },
        gift: { name: "플로우", description: "고통을 피하지 말고 그 안으로 깊이 다이빙.", tags: ["몰입", "극복"] },
        metaCode: { name: "마스터리", description: "인생의 쓴맛을 다 보았기에 타인의 고통을 깊이 이해." },
        journalPrompt: "당신이 빠져있는 늪은 무엇인가요?"
    },
    {
        number: 30,
        title: "열정의 엔진",
        subtitle: "불이 거듭 타오르는 형국",
        hexagram: [1, 0, 1, 1, 0, 1],
        darkCode: { name: "과열", description: "사랑, 성공, 인정에 집착하여 시스템 온도가 위험 수위." },
        gift: { name: "분석", description: "감정을 쏟아붓지 말고 열정을 지성으로 승화.", tags: ["열정", "이성"] },
        metaCode: { name: "광명", description: "세상을 비추는 빛. 길 잃은 자들을 인도." },
        journalPrompt: "당신의 열정을 어떻게 지혜롭게 사용할 수 있을까요?"
    },
    {
        number: 31,
        title: "공명의 엔진",
        subtitle: "마음 없이 다하는 직관적 감응",
        hexagram: [0, 0, 1, 1, 1, 0],
        darkCode: { name: "스팸", description: "진심 없이 찔러봄. 인스턴트 관계에 중독." },
        gift: { name: "공명", description: "머리가 아닌 가슴으로 신호를 보낼 때 강력한 페어링.", tags: ["공명", "연결"] },
        metaCode: { name: "합일", description: "수많은 사람을 하나로 연결하는 거대한 허브." },
        journalPrompt: "당신과 진정으로 공명하는 사람은 누구인가요?"
    },
    {
        number: 32,
        title: "지속의 엔진",
        subtitle: "변하지 않는 마음. 지속성과 루틴",
        hexagram: [0, 1, 1, 1, 1, 0],
        darkCode: { name: "정체", description: "반복을 견디지 못하고 끊임없이 새로운 자극만 찾음." },
        gift: { name: "지속성", description: "매일 똑같은 코드를 반복. 꾸준함이 신경망을 튼튼하게.", tags: ["지속", "루틴"] },
        metaCode: { name: "영원", description: "변하는 세상 속에서 변하지 않는 가치를 지킴." },
        journalPrompt: "당신이 꾸준히 지속해야 할 것은 무엇인가요?"
    },
    {
        number: 33,
        title: "은둔의 엔진",
        subtitle: "물러나서 때를 기다리는 전략적 후퇴",
        hexagram: [1, 1, 1, 0, 0, 1],
        darkCode: { name: "도피", description: "책임을 회피하고 도망침." },
        gift: { name: "전략적 후퇴", description: "싸워서 이길 수 없으면 물러나 힘을 기름.", tags: ["전략", "타이밍"] },
        metaCode: { name: "초연", description: "세상의 소음에서 벗어나 본질에 집중." },
        journalPrompt: "당신이 물러나야 할 곳은 어디인가요?"
    },
    {
        number: 34,
        title: "대력의 엔진",
        subtitle: "큰 힘. 강력한 에너지의 폭발",
        hexagram: [0, 0, 1, 1, 1, 1],
        darkCode: { name: "폭주", description: "힘을 통제하지 못하고 난폭하게 휘두름." },
        gift: { name: "파워", description: "강력한 힘을 올바른 방향으로 사용.", tags: ["힘", "통제"] },
        metaCode: { name: "위엄", description: "힘은 과시가 아닌 보호를 위해 존재." },
        journalPrompt: "당신의 힘을 어떻게 사용하고 있나요?"
    },
    {
        number: 35,
        title: "진보의 엔진",
        subtitle: "해가 땅 위로 떠오르는 형국. 발전과 진보",
        hexagram: [0, 0, 0, 1, 0, 1],
        darkCode: { name: "조급함", description: "빨리 성공하려고 조급하게 서두름." },
        gift: { name: "진보", description: "한 걸음씩 착실하게 앞으로 나아감.", tags: ["성장", "발전"] },
        metaCode: { name: "계몽", description: "어둠을 밝히는 빛. 시대를 앞서가는 선구자." },
        journalPrompt: "당신이 나아가야 할 방향은 무엇인가요?"
    },
    {
        number: 36,
        title: "명이의 엔진",
        subtitle: "빛이 땅 속으로 들어간 형국. 어둠 속의 지혜",
        hexagram: [0, 0, 0, 1, 0, 1],
        darkCode: { name: "상처", description: "어둠 속에서 절망하고 포기함." },
        gift: { name: "인내", description: "어둠 속에서도 빛을 잃지 않고 견딤.", tags: ["인내", "지혜"] },
        metaCode: { name: "내면의 빛", description: "외부의 빛이 없어도 내면의 빛으로 길을 찾음." },
        journalPrompt: "당신의 내면의 빛은 무엇인가요?"
    },
    {
        number: 37,
        title: "가족의 엔진",
        subtitle: "집안 사람들. 가족과 공동체",
        hexagram: [1, 0, 1, 0, 1, 1],
        darkCode: { name: "통제", description: "가족을 통제하려 하거나 가족에게 통제당함." },
        gift: { name: "조화", description: "각자의 역할을 존중하며 조화를 이룸.", tags: ["가족", "조화"] },
        metaCode: { name: "사랑", description: "무조건적인 사랑으로 가족을 품음." },
        journalPrompt: "당신의 가족 관계에서 필요한 것은 무엇인가요?"
    },
    {
        number: 38,
        title: "대립의 엔진",
        subtitle: "서로 등지고 있는 형국. 갈등과 대립",
        hexagram: [1, 1, 0, 0, 1, 1],
        darkCode: { name: "분열", description: "차이를 인정하지 못하고 갈등만 키움." },
        gift: { name: "다양성", description: "차이를 인정하고 다양성 속에서 조화를 찾음.", tags: ["다양성", "조화"] },
        metaCode: { name: "통합", description: "대립을 넘어 더 큰 통합을 이룸." },
        journalPrompt: "당신이 인정해야 할 차이는 무엇인가요?"
    },
    {
        number: 39,
        title: "난관의 엔진",
        subtitle: "발이 절뚝거리는 형국. 장애와 어려움",
        hexagram: [0, 0, 1, 0, 1, 0],
        darkCode: { name: "좌절", description: "장애물 앞에서 포기하고 주저앉음." },
        gift: { name: "돌파", description: "장애물을 우회하거나 돌파하는 지혜.", tags: ["극복", "지혜"] },
        metaCode: { name: "초월", description: "모든 장애를 넘어서는 초월적 힘." },
        journalPrompt: "당신 앞의 장애물은 무엇이며, 어떻게 넘을 수 있을까요?"
    },
    {
        number: 40,
        title: "해방의 엔진",
        subtitle: "매듭이 풀리는 형국. 해방과 자유",
        hexagram: [0, 1, 0, 0, 1, 0],
        darkCode: { name: "집착", description: "과거에 집착하여 자유롭지 못함." },
        gift: { name: "용서", description: "과거를 용서하고 놓아줌으로써 자유를 얻음.", tags: ["용서", "자유"] },
        metaCode: { name: "해탈", description: "모든 집착에서 벗어난 완전한 자유." },
        journalPrompt: "당신이 용서하고 놓아줘야 할 것은 무엇인가요?"
    },
    {
        number: 41,
        title: "감소의 엔진",
        subtitle: "줄이고 덜어내는 형국. 단순화",
        hexagram: [1, 0, 0, 0, 1, 1],
        darkCode: { name: "결핍", description: "부족함에 집착하고 불안해함." },
        gift: { name: "미니멀리즘", description: "불필요한 것을 덜어내고 본질에 집중.", tags: ["단순화", "본질"] },
        metaCode: { name: "충만", description: "적은 것이 더 많은 것임을 깨달음." },
        journalPrompt: "당신이 덜어내야 할 것은 무엇인가요?"
    },
    {
        number: 42,
        title: "증가의 엔진",
        subtitle: "더하고 늘리는 형국. 확장과 성장",
        hexagram: [0, 1, 1, 1, 0, 0],
        darkCode: { name: "탐욕", description: "끝없이 더 많은 것을 원함." },
        gift: { name: "성장", description: "지속 가능한 방식으로 성장하고 확장.", tags: ["성장", "확장"] },
        metaCode: { name: "풍요", description: "나눌수록 더 풍요로워지는 무한한 풍요." },
        journalPrompt: "당신이 성장시켜야 할 것은 무엇인가요?"
    },
    {
        number: 43,
        title: "결단의 엔진",
        subtitle: "단호하게 결정하는 형국. 결단력",
        hexagram: [0, 1, 1, 1, 1, 1],
        darkCode: { name: "우유부단", description: "결정을 미루고 망설임." },
        gift: { name: "결단력", description: "명확하게 결정하고 실행에 옮김.", tags: ["결단", "실행"] },
        metaCode: { name: "정의", description: "올바른 결정으로 정의를 실현." },
        journalPrompt: "당신이 내려야 할 결정은 무엇인가요?"
    },
    {
        number: 44,
        title: "조우의 엔진",
        subtitle: "우연히 만나는 형국. 만남과 인연",
        hexagram: [1, 1, 1, 1, 1, 0],
        darkCode: { name: "유혹", description: "잘못된 만남에 이끌림." },
        gift: { name: "인연", description: "의미 있는 만남을 알아보고 소중히 함.", tags: ["만남", "인연"] },
        metaCode: { name: "운명", description: "모든 만남이 운명적 의미를 가짐." },
        journalPrompt: "당신에게 의미 있는 만남은 무엇인가요?"
    },
    {
        number: 45,
        title: "모임의 엔진",
        subtitle: "사람들이 모이는 형국. 집합과 연대",
        hexagram: [0, 0, 0, 1, 1, 0],
        darkCode: { name: "파벌", description: "배타적인 집단을 형성하고 다른 이를 배척." },
        gift: { name: "연대", description: "공통의 목표를 위해 힘을 모음.", tags: ["연대", "협력"] },
        metaCode: { name: "공동체", description: "모두를 포용하는 따뜻한 공동체를 만듦." },
        journalPrompt: "당신이 속한 공동체에 어떻게 기여할 수 있을까요?"
    },
    {
        number: 46,
        title: "상승의 엔진",
        subtitle: "위로 올라가는 형국. 성장과 발전",
        hexagram: [0, 0, 0, 0, 1, 1],
        darkCode: { name: "조급함", description: "빨리 올라가려고 조급하게 서두름." },
        gift: { name: "성장", description: "한 단계씩 착실하게 올라감.", tags: ["성장", "발전"] },
        metaCode: { name: "정상", description: "최고의 경지에 도달." },
        journalPrompt: "당신이 올라가야 할 다음 단계는 무엇인가요?"
    },
    {
        number: 47,
        title: "곤궁의 엔진",
        subtitle: "곤경에 처한 형국. 시련과 고난",
        hexagram: [0, 1, 0, 1, 1, 0],
        darkCode: { name: "절망", description: "곤경 속에서 희망을 잃음." },
        gift: { name: "인내", description: "곤경 속에서도 희망을 잃지 않고 견딤.", tags: ["인내", "희망"] },
        metaCode: { name: "지혜", description: "고난을 통해 깊은 지혜를 얻음." },
        journalPrompt: "당신의 곤경이 가르쳐주는 것은 무엇인가요?"
    },
    {
        number: 48,
        title: "우물의 엔진",
        subtitle: "우물. 변하지 않는 자원과 지혜",
        hexagram: [0, 1, 0, 0, 1, 1],
        darkCode: { name: "고갈", description: "자원이 고갈되고 메마름." },
        gift: { name: "자원", description: "끊임없이 샘솟는 내면의 자원.", tags: ["자원", "지혜"] },
        metaCode: { name: "생명수", description: "모든 이에게 생명을 주는 샘." },
        journalPrompt: "당신의 내면에서 샘솟는 자원은 무엇인가요?"
    },
    {
        number: 49,
        title: "혁명의 엔진",
        subtitle: "가죽을 바꾸는 형국. 변혁과 혁명",
        hexagram: [1, 0, 1, 1, 1, 0],
        darkCode: { name: "저항", description: "변화를 거부하고 저항함." },
        gift: { name: "변혁", description: "과감하게 변화를 받아들이고 주도함.", tags: ["변혁", "혁신"] },
        metaCode: { name: "재탄생", description: "완전히 새로운 존재로 거듭남." },
        journalPrompt: "당신이 변화시켜야 할 것은 무엇인가요?"
    },
    {
        number: 50,
        title: "솥의 엔진",
        subtitle: "솥. 변화와 양육의 그릇",
        hexagram: [0, 1, 1, 1, 0, 1],
        darkCode: { name: "오염", description: "그릇이 더러워져 음식을 오염시킴." },
        gift: { name: "양육", description: "깨끗한 그릇으로 영양을 공급.", tags: ["양육", "변화"] },
        metaCode: { name: "연금술", description: "평범한 것을 귀한 것으로 변화시킴." },
        journalPrompt: "당신이 양육하고 있는 것은 무엇인가요?"
    },
    {
        number: 51,
        title: "진동의 엔진",
        subtitle: "우레. 충격과 각성",
        hexagram: [0, 0, 1, 0, 0, 1],
        darkCode: { name: "공포", description: "충격에 압도되어 마비됨." },
        gift: { name: "각성", description: "충격을 통해 깨어남.", tags: ["각성", "변화"] },
        metaCode: { name: "계시", description: "번개 같은 깨달음." },
        journalPrompt: "당신을 깨우는 충격은 무엇인가요?"
    },
    {
        number: 52,
        title: "정지의 엔진",
        subtitle: "산. 멈춤과 고요",
        hexagram: [1, 0, 0, 1, 0, 0],
        darkCode: { name: "경직", description: "두려움으로 얼어붙어 움직이지 못함." },
        gift: { name: "명상", description: "의도적으로 멈추고 고요 속에서 쉼.", tags: ["고요", "명상"] },
        metaCode: { name: "평정", description: "어떤 상황에서도 흔들리지 않는 평정심." },
        journalPrompt: "당신에게 필요한 고요의 시간은 언제인가요?"
    },
    {
        number: 53,
        title: "점진의 엔진",
        subtitle: "점진적 발전. 한 걸음씩 나아감",
        hexagram: [0, 0, 1, 1, 0, 0],
        darkCode: { name: "조급함", description: "빠른 결과를 원하며 조급해함." },
        gift: { name: "점진", description: "한 걸음씩 꾸준히 나아감.", tags: ["점진", "꾸준함"] },
        metaCode: { name: "완성", description: "시간이 걸려도 완벽하게 완성." },
        journalPrompt: "당신이 꾸준히 나아가야 할 길은 무엇인가요?"
    },
    {
        number: 54,
        title: "귀매의 엔진",
        subtitle: "시집가는 여동생. 관계와 역할",
        hexagram: [0, 0, 1, 1, 1, 0],
        darkCode: { name: "종속", description: "관계 속에서 자신을 잃음." },
        gift: { name: "역할", description: "관계 속에서 자신의 역할을 다함.", tags: ["관계", "역할"] },
        metaCode: { name: "상생", description: "서로를 살리는 관계." },
        journalPrompt: "당신의 관계에서 어떤 역할을 하고 있나요?"
    },
    {
        number: 55,
        title: "풍성의 엔진",
        subtitle: "풍성함. 절정과 충만",
        hexagram: [0, 0, 1, 1, 0, 1],
        darkCode: { name: "과잉", description: "너무 많아서 오히려 문제가 됨." },
        gift: { name: "충만", description: "적절한 풍요를 누림.", tags: ["풍요", "충만"] },
        metaCode: { name: "찬란함", description: "가장 빛나는 순간." },
        journalPrompt: "당신의 삶에서 가장 풍요로운 부분은 무엇인가요?"
    },
    {
        number: 56,
        title: "나그네의 엔진",
        subtitle: "나그네. 여행과 변화",
        hexagram: [1, 0, 1, 0, 0, 1],
        darkCode: { name: "방황", description: "목적 없이 떠돌며 방황함." },
        gift: { name: "여행", description: "새로운 경험을 통해 성장.", tags: ["여행", "성장"] },
        metaCode: { name: "자유", description: "어디에도 얽매이지 않는 자유." },
        journalPrompt: "당신이 떠나야 할 여행은 무엇인가요?"
    },
    {
        number: 57,
        title: "손의 엔진",
        subtitle: "바람. 부드러운 침투",
        hexagram: [0, 1, 1, 0, 1, 1],
        darkCode: { name: "우유부단", description: "방향을 정하지 못하고 흔들림." },
        gift: { name: "침투", description: "부드럽게 스며들어 변화를 일으킴.", tags: ["침투", "영향력"] },
        metaCode: { name: "무위", description: "애쓰지 않고 자연스럽게 영향을 미침." },
        journalPrompt: "당신이 부드럽게 영향을 미칠 수 있는 곳은 어디인가요?"
    },
    {
        number: 58,
        title: "기쁨의 엔진",
        subtitle: "못. 기쁨과 즐거움",
        hexagram: [0, 1, 1, 0, 1, 1],
        darkCode: { name: "쾌락", description: "일시적 쾌락에 중독됨." },
        gift: { name: "기쁨", description: "진정한 기쁨을 누림.", tags: ["기쁨", "즐거움"] },
        metaCode: { name: "환희", description: "존재 자체가 기쁨." },
        journalPrompt: "당신에게 진정한 기쁨을 주는 것은 무엇인가요?"
    },
    {
        number: 59,
        title: "흩어짐의 엔진",
        subtitle: "바람이 물 위를 지나감. 흩어짐과 해산",
        hexagram: [0, 1, 0, 0, 1, 1],
        darkCode: { name: "분산", description: "에너지가 흩어져 힘을 잃음." },
        gift: { name: "확산", description: "좋은 영향력을 널리 퍼뜨림.", tags: ["확산", "영향력"] },
        metaCode: { name: "보편성", description: "모든 곳에 스며드는 보편적 사랑." },
        journalPrompt: "당신이 퍼뜨려야 할 좋은 영향력은 무엇인가요?"
    },
    {
        number: 60,
        title: "절제의 엔진",
        subtitle: "마디. 절제와 한계",
        hexagram: [0, 1, 0, 1, 1, 0],
        darkCode: { name: "억압", description: "과도하게 억압하여 고통받음." },
        gift: { name: "절제", description: "적절한 한계를 설정하고 지킴.", tags: ["절제", "균형"] },
        metaCode: { name: "자유", description: "절제를 통해 진정한 자유를 얻음." },
        journalPrompt: "당신이 절제해야 할 것은 무엇인가요?"
    },
    {
        number: 61,
        title: "중부의 엔진",
        subtitle: "중심의 진실. 내면의 확신",
        hexagram: [1, 1, 0, 0, 1, 1],
        darkCode: { name: "의심", description: "자신과 타인을 끊임없이 의심함." },
        gift: { name: "확신", description: "내면의 진실을 확신함.", tags: ["확신", "진실"] },
        metaCode: { name: "진리", description: "절대적 진리를 체득." },
        journalPrompt: "당신이 확신하는 내면의 진실은 무엇인가요?"
    },
    {
        number: 62,
        title: "소과의 엔진",
        subtitle: "작은 것이 지나침. 디테일의 힘",
        hexagram: [0, 0, 1, 1, 0, 0],
        darkCode: { name: "사소함", description: "작은 것에 집착하여 큰 그림을 놓침." },
        gift: { name: "디테일", description: "작은 것에 정성을 다함.", tags: ["디테일", "정성"] },
        metaCode: { name: "완벽", description: "디테일의 완벽함이 전체의 완벽함을 만듦." },
        journalPrompt: "당신이 신경 써야 할 작은 디테일은 무엇인가요?"
    },
    {
        number: 63,
        title: "기제의 엔진",
        subtitle: "이미 건넌 상태. 완성과 새로운 시작",
        hexagram: [0, 1, 0, 1, 0, 1],
        darkCode: { name: "안주", description: "완성에 안주하여 게을러짐." },
        gift: { name: "완성", description: "한 단계를 완성하고 다음을 준비.", tags: ["완성", "준비"] },
        metaCode: { name: "순환", description: "끝은 새로운 시작." },
        journalPrompt: "당신이 완성한 것과 새로 시작해야 할 것은 무엇인가요?"
    },
    {
        number: 64,
        title: "미제의 엔진",
        subtitle: "아직 건너지 못한 상태. 가능성과 잠재력",
        hexagram: [1, 0, 1, 0, 1, 0],
        darkCode: { name: "혼란", description: "끝나지 않은 상태에 좌절함." },
        gift: { name: "가능성", description: "무한한 가능성을 품고 있음.", tags: ["가능성", "잠재력"] },
        metaCode: { name: "무한", description: "모든 것이 가능한 무한한 잠재력." },
        journalPrompt: "당신 안에 잠들어 있는 가능성은 무엇인가요?"
    }
];
