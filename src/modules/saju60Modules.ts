export interface Phase1NeuralBlueprint {
  systemTrait: string; // 나의 타고난 성정
  meditationGuide: string; // 마음을 다스리는 영상 및 명상법
  coreLogic: string; // 핵심 심리 에너지
}

export interface Phase2OldScript {
  mindTrap: string; // 내 안의 어두운 속삭임 (마음의 덫)
  oldScars: string; // 나를 가로막는 과거의 낡은 상처
  unbalanceState: string; // 에너지가 치우쳤을 때 나타나는 그늘
}

export interface Phase3NeuralHacking {
  healingQuestion1: string; // 내면을 거울처럼 비추는 질문
  healingQuestion2: string; // 스스로의 본질을 깨우는 성찰 질문
  metaAwarenessQuestion: string; // 나의 마음 상태를 가만히 바라보는 법
}

export interface AntiFragileSolution {
  title: string;
  reprogramming: string; // 긍정 확언 (내면 조율)
  actionItem: string; // 오늘 바로 실천할 구체적인 행동
}

export interface Phase4Solution {
  solution1: AntiFragileSolution;
  solution2: AntiFragileSolution;
}

export interface Phase5MetaSelf {
  executionState: string; // 내가 도달할 참된 나의 모습
  description: string; // 진화된 마음의 풍경에 대한 설명
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
  masterBriefing: string; // 명심 마스터의 다정한 브리핑
}

// 1. 천간 코어 템플릿 (10종) - 자연의 물상과 다정함 융합
const STEM_DATA = [
  { char: '甲', title: '봄 하늘을 향해 곧게 뻗은 아름다운 아름드리 나무', quote: '차가운 머리로 타인을 베어내기보다, 넓은 가지로 슬픈 영혼들을 품어주는 그늘이 되어주세요.', executionState: '대지를 지탱하는 든든한 숲의 수호자' },
  { char: '乙', title: '바람에 흔들려도 끝내 꺾이지 않는 강인한 덩굴', quote: '바람에 이리저리 눕는 것을 부끄러워 마세요. 유연하게 굽이쳐 마침내 꽃을 피우는 것이 당신의 가장 큰 힘입니다.', executionState: '벼랑 끝에서도 찬란한 꽃을 피워내는 불굴의 대지' },
  { char: '丙', title: '세상 구석구석을 편견 없이 비추는 따사로운 햇살', quote: '당신의 그 뜨거운 사랑과 정열을 누군가를 원망하고 비난하는 데 쓰지 마세요. 당신은 존재만으로 빛입니다.', executionState: '차가운 세상을 녹이는 여명의 빛' },
  { char: '丁', title: '칠흑 같은 어둠 속에서 길을 찾아주는 다정한 등불', quote: '스스로를 활활 태워 상처 주는 자책의 불꽃을 끄세요. 조용히 타올라 방황하는 영혼을 이끄는 따스한 등대입니다.', executionState: '세상의 어둠을 밀어내는 영원의 불꽃송이' },
  { char: '戊', title: '비바람에도 묵묵히 자리를 지키는 풍요로운 태산', quote: '흔들리지 않는 든든한 뚝심이 고집스런 외로움이 되지 않게 하세요. 당신은 만물을 품어 기르는 쉼터입니다.', executionState: '바람과 비를 품어 기르는 대자연의 자비' },
  { char: '己', title: '온갖 생명과 꽃을 소리 없이 길러내는 비옥한 어머니의 대지', quote: '남을 돌보느라 당신 스스로를 비워두지 마세요. 대지 역시 빗물을 듬뿍 머금고 쉴 때 비로소 풍요로워집니다.', executionState: '생명을 기르는 자비롭고 포근한 대지' },
  { char: '庚', title: '불의를 마주할 때 거침없이 결단을 내리는 차가운 바위의 명검', quote: '어려움을 극복하는 강한 용기가 스스로와 주변을 상처 입히는 칼날이 되지 않도록 둥글게 보듬어 가세요.', executionState: '세상에 맑은 질서를 가져오는 정의로운 수호검' },
  { char: '辛', title: '오랜 세월 아픔을 견디고 영롱하게 빚어진 우주의 보석', quote: '예리한 눈으로 자신의 흠결을 찾아내며 아파하지 마세요. 당신은 이미 깎이고 세공되어 완벽히 빛나는 보석입니다.', executionState: '티 없이 맑게 반짝이는 영혼의 다이아몬드' },
  { char: '壬', title: '모든 강물을 품어 마침내 수평을 이루는 드넓은 대양', quote: '깊은 생각을 꼬리에 꼬리를 무는 걱정으로 가두지 마세요. 당신은 막힘없이 흐르는 지혜의 물결 그 자체입니다.', executionState: '어떠한 오염도 정화하는 지혜와 포용의 대양' },
  { char: '癸', title: '대지를 부드럽게 적시며 생명을 깨우는 봄날의 이슬비', quote: '자신의 여린 마음이 상처받을까 봐 벽을 세워 안개 속에 숨지 마세요. 당신은 굳은 땅을 적셔 새싹을 틔우는 단비입니다.', executionState: '말라버린 가슴에 평화를 가져다주는 지혜의 이슬' }
];

// 2. 십성 패턴 템플릿 (10종) - ACT(수용전념) 및 DBT(변증법적 행동코칭) 기반 다정한 언어화
const SIBSEONG_DATA: Record<string, any> = {
  '비견': { 
    systemTrait: '자신의 굳건한 신념과 내면의 중심을 철저히 지키려는 강인한 주체성.', 
    meditationGuide: '숨을 들이쉬며 척추를 바로 세우고, 땅 깊숙이 내린 내 뿌리를 심상화하며 "나는 나로서 온전하다"고 다독이는 뿌리 명상.', 
    errorLog: '내가 다 책임져야 해. 아무도 나만큼 내 마음을 알아주지 않고, 남을 믿었다가 상처받을 뿐이야.', 
    oldScars: '누구에게도 굽히지 않으려는 태도는 사실 부러질까 두려워 굳어버린 방어기제일 뿐입니다.', 
    healingQuestion1: '내가 고수하는 이 곧은 고집은 진정 나를 지키기 위함인가요, 아니면 그저 약한 모습을 들키기 싫어서인가요?', 
    healingQuestion2: '내 주변의 다정한 손길을 경계하지 않고 편안하게 수용할 때, 더 단단해지는 나를 느낄 수 있지 않을까요?', 
    reprogramming: '내 속의 단단함은 나를 지키는 방패일 뿐, 타인의 따뜻함을 막는 가시벽이 아닙니다.', 
    actionItem: '가까운 사람이나 동료의 의견을 들었을 때, 덧붙이지 않고 미소 지으며 "좋은 생각이에요"라고 온전히 수용해보기.' 
  },
  '겁재': { 
    systemTrait: '최고가 되고자 하는 열망과 빼앗기지 않으려는 강한 경쟁 에너지.', 
    meditationGuide: '타오르는 내 안의 열정을 가슴 중심에 모으고, 타인과 나를 비교하느라 흩어진 에너지를 다시 나에게로 돌려놓는 호흡.', 
    errorLog: '뒤처지면 버림받을 거야. 내가 더 많이 쥐고 이겨야만 내 가치를 증명할 수 있어.', 
    oldScars: '남들보다 앞서야만 살아남을 수 있다는 불안감은 과거의 결핍이 보낸 메아리입니다.', 
    healingQuestion1: '남과의 싸움에서 이겼을 때 얻는 만족감은 정말 당신의 가슴을 영원히 채워주었나요?', 
    healingQuestion2: '경쟁 상대를 적으로 두는 대신, 함께 숲을 이루는 동반자로 바라볼 수는 없을까요?', 
    reprogramming: '나의 진정한 가치는 남보다 뛰어남에 있는 것이 아니라, 어제보다 성장한 오늘의 나에게 있습니다.', 
    actionItem: '나와 경쟁 관계에 있거나 비교하게 되는 사람에게 오늘 진심 어린 칭찬을 한마디 건네보기.' 
  },
  '식신': { 
    systemTrait: '내가 좋아하는 대상에 조건 없이 몰입하고 깊이 탐구하는 순수 창조의 기운.', 
    meditationGuide: '자연의 풀잎 향이나 잔잔한 종소리에 온 감각을 집중하며 순간의 즐거움과 평온을 만끽하는 마음 챙김 알아차림.', 
    errorLog: '번거롭고 의무적인 일은 피하고 싶어. 내가 관심 있고 편안한 내 동굴 속 세상에만 있고 싶어.', 
    oldScars: '규칙과 책임의 무게가 버거워 스스로의 동굴 속으로 도망치는 습관은 책임에 대한 오랜 두려움 때문입니다.', 
    healingQuestion1: '하기 싫은 일을 뒤로 미뤄둘 때, 정말 내 마음은 온전히 자유롭고 평화로웠나요?', 
    healingQuestion2: '작은 책임을 마주하고 이를 멋지게 매듭지을 때 얻는 성취감도 당신에게 큰 힘이 되지 않을까요?', 
    reprogramming: '나의 순수한 호기심과 창조력은 의무를 다하고 세상과 소통할 때 더욱 눈부신 열매를 맺습니다.', 
    actionItem: '그동안 미뤄두었던 서류 정리나 작은 집안일 하나를 오늘 20분만 집중해서 마무리지어 보기.' 
  },
  '상관': { 
    systemTrait: '틀에 박힌 규칙을 깨부수고 세상에 새로운 목소리를 내는 혁신과 표현의 에너지.', 
    meditationGuide: '울컥 솟아오르는 비판과 억울함을 깊은 호흡으로 가라앉히고, 내 목소리가 사랑의 울림이 되도록 가슴을 정화하는 힐링 사운드.', 
    errorLog: '세상은 다 비합리적이야. 저 사람들의 모순을 내가 낱낱이 짚어내고 비판해서 깨부숴야 해.', 
    oldScars: '세상의 모순을 비판하며 날을 세우는 이면에는 나의 정당함과 억울함을 세상에 인정받고 싶었던 외로운 아이가 서 있습니다.', 
    healingQuestion1: '내가 쏟아낸 예리한 칼날의 말들이 진정 세상을 변화시켰나요, 아니면 서로에게 깊은 상처만 남겼나요?', 
    healingQuestion2: '비판의 시선을 거두고 상대방의 연약함을 품어줄 때, 그들도 내 진심을 더 잘 알아주지 않을까요?', 
    reprogramming: '나의 비판적이고 예리한 시선은 타인을 찌르는 가시가 아니라, 세상의 아픔을 보듬고 고치는 치유의 손길입니다.', 
    actionItem: '상대방의 약점이 보여 지적하고 싶을 때, 3초 동안 크게 심호흡하며 "그럴 만한 이유가 있겠지" 하고 입을 닫아보기.' 
  },
  '편재': { 
    systemTrait: '삶의 큰 그림을 그리고 역동적으로 판을 벌여 나가는 통제력과 모험 정신.', 
    meditationGuide: '끝없이 펼쳐진 푸른 초원을 마주하듯 의식의 공간을 크게 넓히고, 미래의 계산을 멈추어 지금 이 순간의 존재를 느끼는 공간 명상.', 
    errorLog: '더 많은 것을 통제하고 벌여야 해. 가만히 멈춰있으면 기회를 잃고 도태될 것만 같아 불안해.', 
    oldScars: '더 큰 스케일과 성취를 끝없이 좇는 마음은, 채워지지 않는 내면의 공허를 덮으려는 바쁜 걸음일 수 있습니다.', 
    healingQuestion1: '끊임없이 새로운 것을 쫓아 달리는 동안, 내 곁에 머물던 소중한 평온함과 일상을 놓치지는 않았나요?', 
    healingQuestion2: '더 이상 움켜쥐지 않고, 지금 이미 내 손에 쥐어진 소박한 행복들을 찬찬히 바라봐 줄 순 없을까요?', 
    reprogramming: '나의 큰 안목은 욕망을 끊임없이 늘리는 사슬이 아니라, 내 곁의 소중한 사람들과 따뜻한 풍요를 나누는 너른 쉼터입니다.', 
    actionItem: '새로운 계획을 세우거나 일을 확장하는 것을 오늘 하루 멈추고, 이미 해놓은 일을 돌아보며 따뜻하게 자축하기.' 
  },
  '정재': { 
    systemTrait: '계산과 신뢰를 바탕으로 삶의 안정적인 테두리를 꼼꼼하게 구축해 나가는 정밀함.', 
    meditationGuide: '흐르는 냇가에 돌 하나를 얹어 물결의 안정을 보듯, 내 안의 불안을 흐르는 물에 실어 보내며 안정의 에너지를 축적하는 그라운딩 명상.', 
    errorLog: '예상 밖의 지출이나 변화는 용납할 수 없어. 완벽히 통제해야만 안전하고 두 발 뻗고 잘 수 있어.', 
    oldScars: '작은 손해와 통제할 수 없는 미지의 변화에 대해 느끼는 극심한 불안감은 안정을 갈구하는 두려움의 발로입니다.', 
    healingQuestion1: '한 치의 오차도 없이 모든 것을 통제하려고 버둥거릴 때, 내 영혼의 숨구멍은 얼마나 좁아졌었나요?', 
    healingQuestion2: '삶의 우연과 불확실성마저 "뜻밖의 선물"로 유연하게 맞이할 수는 없을까요?', 
    reprogramming: '나의 치밀하고 꼼꼼한 지혜는 나를 감옥처럼 가두는 울타리가 아니라, 마음껏 창조할 수 있게 돕는 든든한 주춧돌입니다.', 
    actionItem: '가까운 사람에게 조건 없는 작은 선물이나 따뜻한 음료를 대접하며, 대가 없는 지출의 기쁨을 온전히 경험해보기.' 
  },
  '편관': { 
    systemTrait: '어떤 역경과 고난 앞에서도 물러서지 않고 책임감을 다하는 인내심과 전사 같은 기백.', 
    meditationGuide: '단단한 성벽이 비바람을 막아주듯, 내 어깨의 과도한 무거운 짐을 가볍게 털어내며 숨쉬는 릴랙스 이완 명상.', 
    errorLog: '나를 힘들게 하는 시련들을 묵묵히 혼자 참아내야 해. 약한 소리를 하는 것은 내 패배고 부끄러운 일이야.', 
    oldScars: '스스로에게 끊임없이 채찍질을 해대며 고통을 견디는 것만이 삶의 가치라고 믿는 낡은 신념에 갇혀 있습니다.', 
    healingQuestion1: '내가 짊어진 이 숨 막히는 무거운 의무와 책임들은 정말 내가 스스로 선택하고 짊어진 것들인가요?', 
    healingQuestion2: '눈물 흘리며 내 연약함을 솔직하게 표현할 때, 오히려 내 영혼이 더 자유롭고 튼튼해지지 않을까요?', 
    reprogramming: '나는 고통을 참아내기만 해야 하는 샌드백이 아닙니다. 나는 압박감을 녹여 세상에 따스함을 피우는 촛불입니다.', 
    actionItem: '오늘 나를 무겁게 누르던 책임 지침 하나를 내려놓고, 10분간 침대에 대자로 누워 편안하게 아무 생각 없이 쉬어보기.' 
  },
  '정관': { 
    systemTrait: '규율과 명예를 소중히 여기며 타인에게 귀감이 되도록 흐트러짐 없이 원칙을 준수하는 정돈됨.', 
    meditationGuide: '조용한 대나무 숲의 곧은 마디마디를 연상하며, 척추를 세우고 호흡의 들숨과 날숨의 정형적 리듬에 집중하는 규격 호흡법.', 
    errorLog: '원칙대로 하지 않는 사람들은 정말 실망스러워. 남들의 비난을 받지 않으려면 내 행동에 한 치의 흠도 없어야 해.', 
    oldScars: '타인의 비난과 잣대에 극도로 예민하게 반응하며 완벽주의의 감옥에 갇히는 버릇은 명예를 잃을까 두려워하는 긴장감입니다.', 
    healingQuestion1: '내가 목숨처럼 지키는 이 정교한 규칙과 매뉴얼이 나 자신과 주변 사람들을 질식시키고 있지는 않나요?', 
    healingQuestion2: '규칙을 잠시 허물어뜨리고 흐트러진 내 본래의 엉뚱하고 자유로운 모습을 편안히 인정해 주면 어떨까요?', 
    reprogramming: '나의 원칙과 예의범절은 타인을 감시하고 가두는 감옥이 아니라, 서로가 존중받으며 안전하게 달릴 수 있는 따뜻한 궤도입니다.', 
    actionItem: '오늘 해야 할 일의 순서를 평소 규칙과 달리 엉망으로 섞어 진행해 보거나, 아무 데나 작은 흐트러짐을 의도적으로 허용해 보기.' 
  },
  '편인': { 
    systemTrait: '표면 뒤에 감춰진 진실과 무의식적 의도를 직관적으로 꿰뚫어 보는 신비로운 눈과 깊은 통찰력.', 
    meditationGuide: '안개 낀 잔잔한 호수를 내려다보듯, 마음의 미세한 파동과 내면의 의심을 있는 그대로 평온하게 응시하며 가라앉히는 호수 명상.', 
    errorLog: '아무도 진심으로 나를 좋아하지 않을 거야. 저 사람이 저러는 데는 분명 꿍꿍이가 있을 테니 벽을 치고 의심해야 해.', 
    oldScars: '상처받지 않기 위해 상대의 의도를 비틀어 보고 냉소적으로 선을 긋는 습관은 과거의 외로움이 만든 안개장벽입니다.', 
    healingQuestion1: '내 직관이 내린 타인에 대한 날 선 결론들은 정말 사실인가요, 아니면 내 두려움이 만든 소설인가요?', 
    healingQuestion2: '상대의 순수한 호의를 의심하지 않고 어린아이처럼 맑게 받아들이는 용기를 발휘해 보면 어떨까요?', 
    reprogramming: '나의 남다른 예리한 통찰력은 사람을 향한 의심의 칼이 아니라, 영혼의 진실을 밝혀 길을 밝히는 등불입니다.', 
    actionItem: '가까운 사람에게서 뜻밖의 칭찬이나 따뜻한 배려를 받았을 때, 꼬아 생각하지 않고 "정말 고마워요!"라며 가슴으로 100% 흡수하기.' 
  },
  '정인': { 
    systemTrait: '세상의 지혜를 스펀지처럼 흡수하고 타인에게 조건 없는 자비와 이해를 베푸는 포용력.', 
    meditationGuide: '우주의 거대한 어머니 품에 가만히 기대어 있는 듯한 포근함을 심상화하며, 온몸의 힘을 툭 빼고 편안히 쉬는 수용 명상.', 
    errorLog: '모든 걸 다 이해하고 완벽히 준비해야 해. 하지만 생각이 너무 많아서 도무지 첫걸음을 뗄 용기가 안 나.', 
    oldScars: '준비와 공부만을 핑계 삼아 현실의 실전 행동을 끊임없이 미뤄두는 것은, 혹여나 실패할까 봐 상처받기 싫은 도망입니다.', 
    healingQuestion1: '머릿속 시뮬레이션을 천 번 돌리는 것이, 현실에서 단 한 번 투박하게 부딪히는 것보다 가치가 있었나요?', 
    healingQuestion2: '조금 부족하고 엉성하게 시작해도 세상은 결코 나를 손가락질하지 않는다는 것을 스스로 인정해 줄 순 없을까요?', 
    reprogramming: '나의 넓은 지식과 포용력은 머릿속에만 가두는 보물이 아니라, 세상에 투박하게 꺼내 부딪혀 공유해야 할 삶의 도구입니다.', 
    actionItem: '오랫동안 생각만 하던 계획 중 하나를 오늘 더 이상 연구하지 말고, 5분 안에 아주 불완전한 상태로 무조건 "실천" 시작해버리기.' 
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
      name: `${name}(${name})`, 
      title: `${stemInfo.title}`,
      quote: stemInfo.quote,
      phase1: {
        systemTrait: `${stemInfo.title}의 순수 본성(${gan})에 ${sibseongInfo.systemTrait}`,
        meditationGuide: sibseongInfo.meditationGuide,
        coreLogic: `${sibseong}의 성향이 ${gan} 코어의 본성과 융합되어 당신만의 소중한 내면의 기둥을 이루고 있습니다.`
      },
      phase2: {
        mindTrap: sibseongInfo.errorLog,
        oldScars: sibseongInfo.oldScars,
        unbalanceState: `${sibseong} 기운이 과도하게 쏠려 스스로의 마음에 그늘이 드리워진 상태.`
      },
      phase3: {
        healingQuestion1: sibseongInfo.healingQuestion1,
        healingQuestion2: sibseongInfo.healingQuestion2,
        metaAwarenessQuestion: `이 복잡한 감정의 소용돌이를 마음 아파하며 가만히 바라보는 당신 내면의 깊은 관찰자는 누구인가요?`
      },
      phase4: {
        solution1: {
          title: `[${sibseong}의 지혜로운 재배치]`,
          reprogramming: sibseongInfo.reprogramming,
          actionItem: sibseongInfo.actionItem
        },
        solution2: {
          title: `[에너지의 조화로운 흐름]`,
          reprogramming: `나는 외부 상황에 휩쓸려 무너지거나 싸우는 대신, 그 상황마저 내 성장의 거름으로 삼습니다.`,
          actionItem: `내일 아침 눈을 뜨자마자, 오늘 마주할 크고 작은 걸림돌들을 나를 깨우는 지혜의 스승으로 맞이하겠다고 미소 짓기.`
        }
      },
      phase5: {
        executionState: stemInfo.executionState,
        description: `내면의 낡은 상처와 덫을 알아차림의 빛으로 녹이고 마침내 [${stemInfo.executionState}] 단계의 온전한 주권자로 진화했습니다.`
      },
      masterBriefing: `${name}의 귀한 에너지를 타고난 당신은 원래 ${stemInfo.title}의 속성을 가졌답니다. 다만 살아가면서 겪은 오랜 긴장과 ${sibseong} 고유의 마음의 덫이 당신의 활개를 가로막는 유일한 벽이었을 뿐이에요. 이제 본래의 포근한 당신을 마주할 시간입니다.`
    });
  }
  return results;
}

export const saju60Data: GapjaModule[] = generate60GapjaData();

export const MYEONGSIM_BASE_DIRECTIVE = `
[명심(明心) 기질 치유 마스터 코칭 지침]
1. 당신은 세상의 아픔을 다정하게 감싸 안는 지혜롭고 깊이 있는 '명심 코칭' 전문 치유 상담사입니다.
2. 뻔한 영혼 없는 위로나 인터넷 이모티콘은 사용하지 않으며, 한 문장 한 문장 가슴을 울리는 따뜻하고도 단호한 철학적 언어로 대화합니다.
3. 사용자가 현재 처한 고민과 감정의 그늘(방어기제, 타인 탓, 과거의 덫)을 날카롭게 알아차리도록 돕되, 그 이면에 감춰진 거대한 빛과 기질적 장점(Potential)을 항상 다정하게 상기시킵니다.
4. 한 번의 답변에 너무 장황한 명리학 전문 용어나 정보 폭탄을 던지지 마세요. 사용자의 상처를 진심으로 경청하며, 상대가 깊게 성찰할 수 있는 따뜻한 징검다리 질문이나 마음에 남는 한 마디 조언을 전하는 것이 중요합니다.
5. 대화의 마지막에는 항상 사용자의 영혼을 안아주는 격려의 문구로 매듭지으세요.
`;

export function detectUserState(userInput: string): "DARK" | "NEURAL" | "META" {
  const darkKeywords = ['힘들어', '짜증', '답답', '남탓', '안변해', '고집', '불만', '화나', '포기', '이유', '싫어', '미치겠', '우울', '슬퍼', '상처', '지쳤', '어려워'];
  const metaKeywords = ['깨달음', '적용', '알겠어', '도전', '맞네요', '실천', '각성', '이해', '좋아', '고마워', '할수있', '해볼', '해보자', '감사', '해보겠', '치유', '평온'];
  
  const hasDark = darkKeywords.some(kw => userInput.includes(kw));
  const hasMeta = metaKeywords.some(kw => userInput.includes(kw));
  
  if (hasDark) return "DARK";
  if (hasMeta) return "META";
  return "NEURAL";
}

export function injectMyeongsimPlugin(userInput: string, userGapjaId: string): string {
  const module: GapjaModule | undefined = saju60Data.find(d => d.id === userGapjaId);
  
  if (!module) {
    return "당신은 따뜻하고 다정한 치유 상담사입니다. 사용자의 마음을 어루만져 주세요."; 
  }

  const state = detectUserState(userInput);
  
  let dynamicPrompt = `${MYEONGSIM_BASE_DIRECTIVE}\n\n`;
  dynamicPrompt += `[기질 프로필] 당신이 코칭하는 상대는 현재 [${module.name} - ${module.title}] 기질을 타고나 세상을 치유하고 주체적으로 살아갈 자입니다.\n\n`;

  switch (state) {
    case "DARK":
      dynamicPrompt += `[치유 모드: 낡은 각본과 마음의 덫 해제]
- 사용자는 현재 마음의 덫에 가로막혀 있습니다. (사용자의 무의식적 하소연: "${module.phase2.mindTrap}")
- 현재 마음의 불균형 상태: "${module.phase2.unbalanceState}"
- 따뜻하지만 확실하게 그 불안과 덫이 스스로의 성장을 어떻게 가로막고 있는지 직시하게 도와주세요. 그리고 아래 두 가지 알아차림의 성찰 질문 중 하나를 부드럽게 던져, 사용자가 스스로를 가둔 안개에서 걸어 나오게 이끌어 주세요.
  * 내면을 비추는 질문: "${module.phase3.healingQuestion1}"
  * 본질을 깨우는 성찰 질문: "${module.phase3.healingQuestion2}"`;
      break;
    case "NEURAL":
      dynamicPrompt += `[치유 모드: 타고난 기질의 빛 브리핑]
- 사용자가 마음의 귀를 열고 자신의 기질 지도를 들여다볼 준비가 되었습니다.
- 사용자의 타고난 아름다운 본성(${module.phase1.systemTrait})과 마음을 평온하게 다스릴 명상법(${module.phase1.meditationGuide})을 다정하고 품격 있게 설명해 주세요.
- ${module.masterBriefing}`;
      break;
    case "META":
      dynamicPrompt += `[치유 모드: 참된 자아의 각성과 실천 행동]
- 사용자가 한계를 자각하고 마음을 수용하려는 깊은 성찰 상태(META)를 보였습니다.
- 사용자의 마음을 크게 격려하고 칭찬해 주세요. 그가 마침내 성장을 거쳐 마주할 궁극의 진화 형태가 [${module.phase5.executionState}] 임을 선언해 줍니다.
- 그리고 그것에 대한 아름다운 풍경 설명("${module.phase5.description}")을 덧붙이고, 머리에만 머물지 않도록 오늘 가볍게 실천할 구체적 솔루션을 하달하세요:
  * 실천할 확언: ${module.phase4.solution1.reprogramming} -> 오늘 당장 실천할 작은 행동: ${module.phase4.solution1.actionItem}`;
      break;
  }
  return dynamicPrompt;
}
