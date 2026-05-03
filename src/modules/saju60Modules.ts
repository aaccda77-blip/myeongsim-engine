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

// 1. 천간 코어 템플릿 (10종)
const STEM_DATA = [
  { char: '甲', title: '시대를 여는 최초의 거목', quote: '당신의 그 얼어붙을 듯 차가운 이성을 타인을 베어내는 칼로 쓰지 마라.', executionState: '만물의 봄을 여는 거목' },
  { char: '乙', title: '강인한 생명력의 덩굴', quote: '바람에 흔들리는 것을 두려워하지 마라. 당신의 유연함이 곧 가장 강력한 생존 무기다.', executionState: '대지를 뒤덮는 불멸의 숲' },
  { char: '丙', title: '세상을 비추는 맹렬한 태양', quote: '당신의 그 타오르는 거대한 열정을 불평불만으로 소모하지 마라.', executionState: '무한한 여명의 태양' },
  { char: '丁', title: '어둠을 밝히는 은은한 촛불', quote: '당신의 온기를 스스로를 태우는 자책으로 쓰지 마라. 당신은 어둠 속의 유일한 길잡이다.', executionState: '영혼을 치유하는 영원의 불꽃' },
  { char: '戊', title: '만물을 품은 풍요로운 태산', quote: '당신의 거대한 포용력을 변화를 거부하는 무거운 고집으로 쓰지 마라.', executionState: '살아있는 태산의 주권자' },
  { char: '己', title: '만물을 기르는 비옥한 대지', quote: '당신의 희생을 당연하게 여기지 마라. 당신은 모든 생명이 자라나는 절대적 기반이다.', executionState: '모든 생명을 잉태하는 만물의 어머니' },
  { char: '庚', title: '질서를 베어내는 무자비한 명검', quote: '당신의 그 강력한 추진력을 핑계 없는 파괴로 몰아가지 마라.', executionState: '새 시대를 바로 세우는 엑스칼리버' },
  { char: '辛', title: '세밀하게 세공된 완벽한 보석', quote: '당신의 예리함을 타인을 찌르는 가시로 쓰지 마라. 당신은 완성된 절대적 가치다.', executionState: '결점 없는 우주의 다이아몬드' },
  { char: '壬', title: '압도적인 심연의 대해', quote: '당신의 무한한 지혜를 음모를 꾸미는 데 쓰지 마라.', executionState: '완전한 진실의 대양' },
  { char: '癸', title: '소리 없이 스며드는 안개', quote: '당신의 그 섬세한 침투력을 스스로를 가두는 감옥으로 만들지 마라.', executionState: '마른 대지를 적시는 생명의 단비' }
];

// 2. 십성 패턴 템플릿 (10종)
const SIBSEONG_DATA: Record<string, any> = {
  '비견': { 
    systemTrait: '강력한 주체성과 자기 확신(비견)이 결합된 독립형 시스템.', 
    computationMethod: 'Self_Reliance = Core_Ego x Independence^t : 누구에게도 기대지 않고 스스로 돌파하는 마이웨이 알고리즘.', 
    errorLog: '나는 내 방식대로 한다. 남들의 간섭은 필요 없다.', 
    oldScript: '타협은 굴복이다. 내가 틀렸음을 인정하는 것은 죽기보다 싫다.', 
    socraticQuestion: '내가 고집하는 이 길이 진정 나를 위한 길인가, 아니면 단지 남에게 꺾이기 싫은 자존심인가?', 
    recursiveQuestion: '타인의 도움을 철저히 밀어내는 이 꼿꼿한 자아의 이면에는 어떤 나약함이 숨어있는가?', 
    reprogramming: '내 속의 뚝심은 나를 세우는 뼈대지, 타인을 밀어내는 가시벽이 아니다.', 
    actionItem: '하루 한 번, 타인의 의견에 무조건 "그 방법도 좋네요"라고 동의해보기.' 
  },
  '겁재': { 
    systemTrait: '강렬한 승부욕과 경쟁심(겁재)이 결합된 투쟁형 시스템.', 
    computationMethod: 'Zero_Sum_Win = Ambition x Competitiveness^t : 타인을 딛고서라도 기어이 목표를 탈환하는 서바이벌 알고리즘.', 
    errorLog: '저 사람에게 지는 것은 참을 수 없다. 내가 다 뺏길 것만 같다.', 
    oldScript: '세상은 약육강식이다. 남을 이기지 못하면 내가 죽는다. 양보는 곧 패배다.', 
    socraticQuestion: '이 쓸데없는 경쟁에서 이기면 남는 것은 무엇인가? 승리의 쾌감인가, 텅 빈 상처인가?', 
    recursiveQuestion: '항상 뺏길까 봐 두려워하는 이 날 선 시스템은 대체 무엇이 결핍되어 있는가?', 
    reprogramming: '나의 강한 승부욕은 남을 짓밟기 위함이 아니라, 나의 한계를 넘어서기 위함이다.', 
    actionItem: '나와 경쟁하는 동료나 라이벌에게 오늘 진심으로 칭찬 한마디 건네기.' 
  },
  '식신': { 
    systemTrait: '순수한 탐구심과 창조력(식신)이 결합된 크리에이터 시스템.', 
    computationMethod: 'Creative_Flow = Curiosity x Expressiveness^t : 자기가 좋아하는 것에 깊이 몰입하여 장인정신을 발휘하는 몰입 알고리즘.', 
    errorLog: '내가 좋아하는 것만 하고 싶다. 귀찮은 규칙이나 사람들은 질색이다.', 
    oldScript: '현실적인 제약은 내 자유를 억압할 뿐이다. 나는 내 맘대로 살아야 행복하다.', 
    socraticQuestion: '현실을 회피하고 내 동굴로 도망치는 것을 과연 "자유"라고 부를 수 있는가?', 
    recursiveQuestion: '귀찮은 것을 극도로 혐오하는 이 시스템은, 현실에 상처받는 것을 얼마나 두려워하고 있는가?', 
    reprogramming: '나의 창의성은 현실과 단절되었을 때가 아니라, 현실과 타협할 때 비로소 가치를 얻는다.', 
    actionItem: '하기 싫은 의무적인 일 딱 하나를 오늘 30분만 꾹 참고 처리해보기.' 
  },
  '상관': { 
    systemTrait: '기존의 룰을 깨부수는 혁신과 언변(상관)이 결합된 반역형 시스템.', 
    computationMethod: 'Rule_Breaker = Rebel_Energy x Eloquence^t : 답답한 관습을 파괴하고 새로운 패러다임을 제시하는 탈옥 알고리즘.', 
    errorLog: '이 시스템은 썩었다. 다 뒤엎고 내가 맞는다는 것을 증명하겠다.', 
    oldScript: '권위자들은 다 무능하다. 내 비판이 가장 예리하며, 내 말이 정답이다.', 
    socraticQuestion: '내가 내뱉는 이 날 선 비판은 세상을 바꾸기 위함인가, 아니면 그저 내 우월감을 뽐내기 위함인가?', 
    recursiveQuestion: '항상 엇나가고 반항하려는 이 날카로운 자아는, 사실 누구에게 가장 인정받고 싶어 하는가?', 
    reprogramming: '나의 예리한 칼날은 남을 찌르기 위함이 아니라, 부패한 환부를 정밀하게 도려내는 수술용 메스다.', 
    actionItem: '비판하고 싶은 상황이 오면, 즉각 입을 닫고 3가지 대안을 먼저 노트에 적어보기.' 
  },
  '편재': { 
    systemTrait: '거대한 영역 확장과 통제욕(편재)이 결합된 지휘관형 시스템.', 
    computationMethod: 'Space_Control = Expansion x Risk_Taking^t : 불규칙한 환경 속에서 흐름을 읽고 단번에 큰 그림을 완성하는 전략 알고리즘.', 
    errorLog: '이 정도 스케일로는 만족할 수 없다. 더 큰 자극과 통제권이 필요하다.', 
    oldScript: '내 손아귀에서 벗어나는 것은 참을 수 없다. 한탕으로 모든 것을 끝내야 한다.', 
    socraticQuestion: '내가 통제하려는 이 거대한 판이 정말 내 것인가, 아니면 내가 욕망의 노예가 된 것인가?', 
    recursiveQuestion: '항상 밖으로만 돌며 무언가를 손에 쥐려 하는 이 공허한 시스템은, 내부의 어떤 텅 빈 공간을 채우고 싶은 것인가?', 
    reprogramming: '나의 확장력은 내 욕망을 채우기 위함이 아니라, 타인과 세상을 널리 이롭게 하는 공유지다.', 
    actionItem: '오늘은 새로운 일을 벌이지 말고, 이미 벌여놓은 일 중 하나를 완벽하게 마무리하기.' 
  },
  '정재': { 
    systemTrait: '치밀한 계산과 안정성(정재)이 결합된 관리자형 시스템.', 
    computationMethod: 'Micro_Manage = Precision x Stability^t : 한 치의 오차도 허용하지 않고 데이터를 축적하여 결과를 내는 최적화 알고리즘.', 
    errorLog: '손해 보는 짓은 절대 안 한다. 모든 것이 내 계산대로 돌아가야 안전하다.', 
    oldScript: '새로운 시도는 너무 위험하다. 확실한 보상이 없으면 1mm도 움직이지 않겠다.', 
    socraticQuestion: '내가 이렇게 1원 하나까지 계산하며 아끼는 삶이 진정 풍요로운 삶인가?', 
    recursiveQuestion: '단 한 번의 손해도 용납하지 못하는 이 쫀쫀한 자아는, 무엇을 잃는 것을 그토록 두려워하는가?', 
    reprogramming: '나의 치밀함은 구두쇠처럼 웅크리기 위함이 아니라, 더 큰 미래에 베팅하기 위한 든든한 탄약고다.', 
    actionItem: '오늘 하루, 나를 위해 또는 남을 위해 아무런 조건 없이 작은 비용(커피 등) 지출해보기.' 
  },
  '편관': { 
    systemTrait: '극단적인 압박과 인내심(편관)이 결합된 전사형 시스템.', 
    computationMethod: 'Extreme_Endurance = Pressure x Resilience^t : 어떠한 고난과 타격도 묵묵히 버텨내고 카리스마로 승화시키는 방벽 알고리즘.', 
    errorLog: '세상은 항상 나를 힘들게 한다. 이 고통을 악으로 깡으로 버텨야 한다.', 
    oldScript: '편안함은 죄악이다. 남들보다 더 빡세게 구르고 고생해야만 내가 가치 있는 사람이다.', 
    socraticQuestion: '내가 짊어진 이 무거운 십자가는 누군가 강요한 것인가, 아니면 내 스스로 영웅이 되기 위해 짊어진 것인가?', 
    recursiveQuestion: '항상 고통받고 억압받는 상황을 무의식적으로 끌어당기는 이 가학적인 시스템의 본질은 무엇인가?', 
    reprogramming: '나는 고통을 견디기 위해 태어난 샌드백이 아니다. 나는 압박을 다이아몬드로 바꾸는 연금술사다.', 
    actionItem: '오늘 나에게 주어진 무거운 책임감 중 하나를 과감하게 타인에게 위임하거나 포기하기.' 
  },
  '정관': { 
    systemTrait: '합리적인 원칙과 보수성(정관)이 결합된 모범생형 시스템.', 
    computationMethod: 'Standard_Protocol = Rule_Compliance x Honor^t : 정해진 매뉴얼과 규칙을 완벽하게 수행하며 체제를 수호하는 무결점 알고리즘.', 
    errorLog: '왜 사람들은 규칙을 안 지키는가? 정해진 대로만 하면 되는데 너무 답답하다.', 
    oldScript: '틀을 벗어나는 것은 위험하다. 남들에게 흠잡힐 일은 절대 해서는 안 된다.', 
    socraticQuestion: '내가 목숨처럼 지키는 이 "원칙"이 사람을 위한 것인가, 아니면 내가 욕먹기 싫은 방패막이인가?', 
    recursiveQuestion: '남들의 시선과 잣대에 스스로를 옭아매는 이 경직된 자아는, 일탈의 자유를 얼마나 갈망하고 있는가?', 
    reprogramming: '나의 원칙은 사람을 옭아매는 족쇄가 아니라, 모두가 안전하게 달릴 수 있는 튼튼한 레일이다.', 
    actionItem: '오늘 하루, 정해진 루틴이나 규칙을 아주 작게 하나 어겨보고 자유로움 느껴보기 (예: 평소 안 가던 길로 가기).' 
  },
  '편인': { 
    systemTrait: '비상한 눈치와 직관력(편인)이 결합된 통찰자형 시스템.', 
    computationMethod: 'Intuitive_Scan = Suspicion x Sixth_Sense^t : 겉으로 드러난 정보 이면의 숨겨진 의도까지 꿰뚫어 보는 딥러닝 알고리즘.', 
    errorLog: '세상에 공짜는 없다. 저 사람이 나한테 왜 잘해주지? 분명 속셈이 있을 것이다.', 
    oldScript: '아무도 믿을 수 없다. 내가 먼저 상처받기 전에 철벽을 치고 의심해야 한다.', 
    socraticQuestion: '내 직관이 정말로 타인의 악의를 꿰뚫어 본 것인가, 아니면 내 안의 불안이 만들어낸 망상인가?', 
    recursiveQuestion: '모든 호의를 밀어내고 혼자만의 세계로 숨어버리려는 이 예민한 시스템은, 사실 누구보다 사랑받고 싶어 하지 않는가?', 
    reprogramming: '나의 예리한 통찰력은 남을 의심하기 위함이 아니라, 보이지 않는 진리를 발견하는 안테나다.', 
    actionItem: '오늘 나에게 들어오는 타인의 칭찬이나 호의를 꼬아서 듣지 말고 그냥 "감사합니다"라고 100% 흡수하기.' 
  },
  '정인': { 
    systemTrait: '무한한 수용력과 사유(정인)가 결합된 학자형 시스템.', 
    computationMethod: 'Deep_Absorption = Acceptance x Contemplation^t : 외부의 지식을 스펀지처럼 빨아들이고 깊이 생각하는 인풋 최적화 알고리즘.', 
    errorLog: '생각이 너무 많아서 행동으로 옮길 수가 없다. 누군가 나를 좀 이끌어줬으면 좋겠다.', 
    oldScript: '아직 준비가 덜 됐다. 완벽하게 알기 전까지는 움직일 수 없다. 남들이 나를 챙겨주는 것이 당연하다.', 
    socraticQuestion: '내가 완벽한 준비를 핑계로 행동을 미루는 것은, 실패에 대한 뼈아픈 두려움 때문이 아닌가?', 
    recursiveQuestion: '계속해서 머릿속으로 시뮬레이션만 돌리는 이 과부하 시스템은 현실의 물리적 충돌을 얼마나 회피하고 있는가?', 
    reprogramming: '나의 방대한 지식은 머릿속에 가둬둘 때가 아니라, 세상에 꺼내어 부딪힐 때 진짜 지혜가 된다.', 
    actionItem: '생각이 꼬리를 물기 전에, 오늘 해야 할 일 하나를 5분 안에 무조건 "시작" 해버리기.' 
  }
};

// 60갑자 동적 생성기
function generate60GapjaData(): GapjaModule[] {
  const gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhis = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const zhiMainQi = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8]; // 지지 본기의 천간 인덱스
  const sibseongNames = ['비견', '식신', '편재', '편관', '편인', '겁재', '상관', '정재', '정관', '정인'];

  const results: GapjaModule[] = [];

  for (let i = 0; i < 60; i++) {
    const ganIdx = i % 10;
    const zhiIdx = i % 12;
    const gan = gans[ganIdx];
    const zhi = zhis[zhiIdx];
    const name = `${gan}${zhi}`;
    
    // 십성(일지) 계산 로직
    const eA = Math.floor(ganIdx / 2); // 0:목, 1:화, 2:토, 3:금, 4:수
    const eB = Math.floor(zhiMainQi[zhiIdx] / 2);
    const diff = (eB - eA + 5) % 5;
    const sameYinYang = (ganIdx % 2) === (zhiMainQi[zhiIdx] % 2);
    const sibseongIdx = diff + (sameYinYang ? 0 : 5);
    const sibseong = sibseongNames[sibseongIdx];

    const stemInfo = STEM_DATA[ganIdx];
    const sibseongInfo = SIBSEONG_DATA[sibseong];

    results.push({
      id: `BP-${(i + 1).toString().padStart(2, '0')}`,
      name: `${name}(${name})`, // 편의상 한자만 표시
      title: stemInfo.title,
      quote: stemInfo.quote,
      phase1: {
        systemTrait: `${stemInfo.title.split(' ')[0]} 본성(${gan})과 ${sibseongInfo.systemTrait}`,
        computationMethod: sibseongInfo.computationMethod,
        coreLogic: `${sibseong} 프로토콜의 장점과 ${gan} 코어의 본성이 융합되어 거대한 시너지를 발휘합니다.`
      },
      phase2: {
        errorLog: sibseongInfo.errorLog,
        oldScript: sibseongInfo.oldScript,
        errorStatus: `${sibseong} 에너지가 과열되어 내면의 오류 코드가 출력되는 상태.`
      },
      phase3: {
        socraticQuestion: sibseongInfo.socraticQuestion,
        recursiveQuestion: sibseongInfo.recursiveQuestion,
        metaAwarenessQuestion: `이 불편한 감정과 고집을 가만히 내려다보는 고요한 주권자는 누구인가?`
      },
      phase4: {
        solution1: {
          title: `[${sibseong} 코드 재설계]`,
          reprogramming: sibseongInfo.reprogramming,
          actionItem: sibseongInfo.actionItem
        },
        solution2: {
          title: `[에너지 순환 최적화]`,
          reprogramming: `나는 외부 환경과 투쟁하는 대신, 환경 자체를 나의 시스템으로 편입시킨다.`,
          actionItem: `내일 아침 기상 시, 나를 가장 괴롭히는 요소를 오히려 내 성장의 거름으로 삼겠다고 확언하기.`
        }
      },
      phase5: {
        executionState: stemInfo.executionState,
        description: `모든 방어기제와 낡은 스크립트를 파괴하고 마침내 [${stemInfo.executionState}] 단계에 도달했습니다. 이제 당신의 에너지는 온전히 세상을 향해 렌더링 됩니다.`
      },
      masterBriefing: `${name} 에너지를 가진 자는 기본적으로 ${stemInfo.title.split(' ')[1] || '위대한'} 속성을 타고났습니다. 그러나 ${sibseong} 특유의 맹점이 당신의 확장을 막는 유일한 버그입니다. 본질을 마주하십시오.`
    });
  }
  return results;
}

export const saju60Data: GapjaModule[] = generate60GapjaData();

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
