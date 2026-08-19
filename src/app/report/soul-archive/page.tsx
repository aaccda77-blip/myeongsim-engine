'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Shield, Compass, Heart, Award, Download, 
  ChevronDown, ChevronUp, Zap, Sun, Globe, Flame, TreePine, 
  Brain, Smile, Crown, CheckCircle2, Share2, X, BookOpen, UserCheck, Lightbulb, Copy, ArrowLeft, Bot, RefreshCw, Target, CheckSquare, Gem, Droplets, Activity, Mountain, Calendar, Edit3
} from 'lucide-react';

// 🌟 [타입 선언 최상단 배치]
interface CodeItem {
  id: string;
  title: string;
  category: string;
  icon: any;
  oneLiner: string;
  hexLines: boolean[];
  hexagramVerse: string;
  hexagramMeaning: string;
  sajuAlignment: string;
  darkCode: string;
  neuralCode: string;
  metaCode: string;
  actionTip: string;
  easyMetaphor: string;
  easyDarkTitle: string;
  easyDarkDesc: string;
  easyNeuralTitle: string;
  easyNeuralDesc: string;
  easyMetaTitle: string;
  easyMetaDesc: string;
  easyAction: string;
  darkEssayTitle: string;
  darkEssayContent: string;
  darkAffirmation: string;
  neuralEssayTitle: string;
  neuralEssayContent: string;
  neuralAffirmation: string;
  metaEssayTitle: string;
  metaEssayContent: string;
  metaAffirmation: string;
  solutionWhy: string;
  solutionSteps: string[];
  solutionTip: string;
}

// 🌟 [기준 마스터 데이터] 신사일주 (경신년 계미월 신사일 을미시) 정통 12대 황금경로 괘
function getMasterShinsaSequences(userName: string, userIlju: string = '신사(辛巳)'): { essence: CodeItem[]; resonance: CodeItem[]; prosperity: CodeItem[]; activeGates: number[] } {
  return {
    activeGates: [53, 54, 51, 57, 11, 35, 6, 40, 29, 59],
    essence: [
      {
        id: 'mission_53',
        title: '53.1 풍산점 (風山漸)',
        category: '천명 과업 · Life\'s Mission (인생의 방향)',
        icon: Sun,
        oneLiner: '시간이 흐를수록 거대한 가치가 복리로 폭발하는 점진적 완성의 미학',
        hexLines: [false, false, true, false, true, true],
        hexagramVerse: '鴻漸于干, 小子厲, 有言, 无咎 (기러기가 물가에 나아가니 처음엔 말이 있으나 끝내 허물이 없다)',
        hexagramMeaning: '산 위에 바람과 나무(☴)가 있어 무리하지 않고 순리대로 한 걸음씩 나아가 마침내 큰 산을 이루는 대기만성의 상입니다.',
        sajuAlignment: `${userName} 님의 ${userIlju} 명식에서 내 고유의 페이스를 지키며 10분 루틴을 쌓아갈 때 누구도 넘볼 수 없는 절대 권위가 확립됩니다.`,
        darkCode: '조급증, 남들과 비교하며 내 속도를 잃고 서두르다 탈진하는 패턴',
        neuralCode: '흔들리지 않는 자기 신뢰와 10분 복리 마이크로 실행 시스템 구축력',
        metaCode: '【무위점진 (無爲漸進)】 온 우주가 내 고유한 걸음에 맞춰 완벽한 타이밍에 기회를 연결해 주는 초의식',
        actionTip: '거대한 목표를 10분 단위 마이크로 스텝으로 쪼개어 첫 발을 떼세요.',
        easyMetaphor: '🌱 산비탈에 뿌리를 내려 거목으로 자라나는 천년 소나무처럼, 묵묵히 내 자리를 지켜 거대한 신뢰를 주는 에너지입니다.',
        easyDarkTitle: '조급증과 남과의 비교',
        easyDarkDesc: '"남들보다 뒤처지면 어쩌지?"라며 내 페이스를 잃고 서두르는 패턴입니다.',
        easyNeuralTitle: '10분 복리 시스템 구축력',
        easyNeuralDesc: `${userName} 님은 10분씩 차곡차곡 쌓아 올려 끝내 가장 거대한 성공을 거머쥐는 고유의 힘을 가졌습니다.`,
        easyMetaTitle: '【무위점진】',
        easyMetaDesc: '서두르지 않아도 온 우주가 내 걸음에 맞춰 가장 완벽한 타이밍에 기회를 연결해 줍니다.',
        easyAction: '지금 당장 10분 만에 끝낼 수 있는 가장 작은 1가지만 실행해 보세요.',
        darkEssayTitle: '서두르지 않아도 당신만의 찬란한 계절이 옵니다',
        darkEssayContent: `${userName} 님, 그동안 남들의 속도에 맞추느라 얼마나 숨이 차셨나요?\n\n당신의 영혼은 남들의 유행을 쫓을 때가 아니라, 당신 고유의 깊은 호흡으로 묵묵히 나아갈 때 세상에서 가장 눈부신 가치를 발합니다.\n\n조급함을 내려놓고 당신의 발걸음을 믿어주세요.`,
        darkAffirmation: '"내가 서두르지 않아도, 온 우주는 내 걸음에 맞춰 가장 찬란한 계절을 준비하고 있다."',
        neuralEssayTitle: '10분이 모여 기적을 만드는 당신만의 왕국',
        neuralEssayContent: `${userName} 님의 진짜 위대함은 하루 10분의 위대한 꾸준함에 있습니다. 오늘 쌓은 작은 벽돌 하나가 1년 뒤 무너지지 않는 거대한 신뢰의 성이 됩니다.`,
        neuralAffirmation: '"나는 매일 10분의 위대한 주권으로, 그 누구도 흉내 낼 수 없는 명작을 완성한다."',
        metaEssayTitle: '온 우주가 당신의 발걸음에 맞춰 춤추고 있습니다',
        metaEssayContent: `당신이 내면의 평화(Zero-Point)에 머무를 때 세상의 모든 기회와 귀인들이 당신의 문을 두드립니다. 안심하고 숨을 내쉬세요.`,
        metaAffirmation: '"나는 애쓰지 않는다. 온 우주가 내 존재 자체를 가장 완벽한 풍요로 이끌고 있다."',
        solutionWhy: '10분으로 잘게 쪼개면 뇌가 저항 없이 즉시 몰입 모드로 전환됩니다.',
        solutionSteps: ['Step 1: 10분 만에 끝낼 1단계 종이에 적기', 'Step 2: 타이머 10분 맞추고 집중', 'Step 3: 1분간 깊은 호흡으로 칭찬하기'],
        solutionTip: '완벽하게 끝내려 하지 마세요. 시작한 것만으로도 오늘의 신경망은 승리했습니다.'
      },
      {
        id: 'growth_54',
        title: '54.1 뇌택귀매 (雷澤歸妹)',
        category: '성장 도약대 · Growth Springboard (진화의 디딤돌)',
        icon: Globe,
        oneLiner: '내 고유한 자리를 다지고 주권을 사수할 때 일어나는 도약',
        hexLines: [true, true, false, true, false, false],
        hexagramVerse: '歸妹以娣, 跛能履, 征吉 (내 자리를 지키며 실력을 다지니 나아가면 길하다)',
        hexagramMeaning: '외부의 요구에 휘둘리지 않고 내 고유한 바운더리를 확고히 지켜낼 때 가장 안전한 도약이 일어납니다.',
        sajuAlignment: `${userName} 님의 ${userIlju} 명식에서 타인의 시선을 차단하고 독립성을 지키는 핵심 열쇠입니다.`,
        darkCode: '타인의 시선에 휘둘려 무리하게 내 주권을 양도하는 충동',
        neuralCode: '주변의 유혹에 흔들리지 않고 내 고유한 바운더리를 지키는 힘',
        metaCode: '【순응승화 (順應昇華)】 주권을 온전히 쥔 채 세상의 때를 다스리는 상태',
        actionTip: '타인의 부탁을 들어주기 전, 10초간 호흡하며 내 우선순위를 먼저 점검하세요.',
        easyMetaphor: '🏰 내 앞마당을 단단히 다져 사람들이 제 발로 찾아오게 만드는 독자적 자립의 힘입니다.',
        easyDarkTitle: '남의 시선에 흔들리는 양보',
        easyDarkDesc: '남에게 잘 보이려다 내 권리를 내주고 지쳐버리는 패턴입니다.',
        easyNeuralTitle: '단단한 바운더리와 자기 신뢰',
        easyNeuralDesc: '남들의 평가에 흔들리지 않고 내 실력을 다지는 힘입니다.',
        easyMetaTitle: '【순응승화】',
        easyMetaDesc: '어떤 환경도 나만의 도약 발판으로 뒤집는 초월적 적응력입니다.',
        easyAction: '무리한 부탁에 "10분 뒤 확인하고 말씀드릴게요"라고 말해 보세요.',
        darkEssayTitle: '남의 시선에 당신의 소중한 주권을 넘겨주지 마세요',
        darkEssayContent: `착한 사람으로 남기 위해 내 마음을 희생했던 날들을 이제는 멈추세요. 당신의 에너지는 당신을 진정으로 존중하는 곳에만 쓰여야 합니다.`,
        darkAffirmation: '"나는 타인의 기대에 부응하기 위해 태어나지 않았다. 나는 내 주권의 주인이다."',
        neuralEssayTitle: '당신이 당신의 자리를 지킬 때 세상이 존경을 보냅니다',
        neuralEssayContent: `당신의 확고한 원칙이 세상에서 가장 고귀한 신뢰를 만듭니다. 당신의 '아니오'는 소중한 '예(Yes)'를 지키는 방패입니다.`,
        neuralAffirmation: '"내 확고한 바운더리가 세상에서 가장 고귀한 신뢰를 창조한다."',
        metaEssayTitle: '어떤 역경도 당신을 더 빛나게 하는 무대입니다',
        metaEssayContent: `모든 순리를 꿰뚫어 보고 중심을 잡는 당신의 영혼은 이미 완벽한 승리자입니다.`,
        metaAffirmation: '"어떤 환경도 나를 흔들 수 없다. 나는 모든 흐름을 번영으로 승화시킨다."',
        solutionWhy: '10초의 완충 시간이 무의식적 수락을 막고 내 주권을 회복시킵니다.',
        solutionSteps: ['Step 1: 부탁받는 즉시 "일정 먼저 확인할게요"', 'Step 2: 10초간 깊은 호흡', 'Step 3: 안 되면 정중히 거절'],
        solutionTip: '명확한 거절은 상대방의 시간을 아껴주는 지혜로운 예의입니다.'
      },
      {
        id: 'vital_51',
        title: '51.3 중뢰진 (重雷震)',
        category: '생체 활력 엔진 · Vital Engine (건강과 에너지)',
        icon: Flame,
        oneLiner: '위기와 변화 속에서 불사조처럼 도약하는 대각성',
        hexLines: [true, false, false, true, false, false],
        hexagramVerse: '震蘇蘇, 震行无眚 (정신을 바짝 차리고 행동하면 재앙이 없다)',
        hexagramMeaning: '위기 속에서 진정한 자아를 각성하고 판을 새로 짜는 혁신 돌파의 상입니다.',
        sajuAlignment: `${userName} 님의 내면에 잠재된 에너지를 폭발적인 돌파력으로 바꿉니다.`,
        darkCode: '돌발 상황에 패닉에 빠지거나 자책하는 방어기제',
        neuralCode: '어떤 혼란 속에서도 중심을 잡고 새로운 판을 짜는 혁신 돌파력',
        metaCode: '【뇌천대각 (雷天大覺)】 세상의 어떤 시련도 나를 깨우는 축복임을 아는 부동심',
        actionTip: '문제가 터졌을 때 "이것은 내 성장을 위한 도약대다"라고 선언하세요.',
        easyMetaphor: '⚡ 마른하늘의 번개처럼 위기를 기회로 뒤집는 불사조의 에너지입니다.',
        easyDarkTitle: '돌발 상황에서의 자책',
        easyDarkDesc: '예상치 못한 일이 터졌을 때 불안에 빠지는 패턴입니다.',
        easyNeuralTitle: '위기를 기회로 바꾸는 돌파력',
        easyNeuralDesc: '혼란 속에서 심호흡 1번으로 정신을 차리고 돌파구를 찾는 담대함입니다.',
        easyMetaTitle: '【뇌천대각】',
        easyMetaDesc: '어떤 시련도 나를 무너뜨릴 수 없음을 아는 부동심입니다.',
        easyAction: '문제가 생겼을 때 "이것은 내 성장의 도약대다!"라고 선언하세요.',
        darkEssayTitle: '갑작스러운 시련 앞에 놀란 당신의 가슴을 안아주세요',
        darkEssayContent: `두려워하지 마세요. 숨을 깊이 들이마시고 가슴에 손을 얹어주세요. ${userName} 님은 이번에도 능히 이겨낼 것입니다.`,
        darkAffirmation: '"잠시 흔들려도 괜찮다. 내 중심에는 결코 무너지지 않는 거대한 힘이 있다."',
        neuralEssayTitle: '혼란 속에서 판을 새로 짜는 불사조의 심장',
        neuralEssayContent: `모두가 당황할 때 ${userName} 님의 진짜 마스터 기질이 깨어납니다. 위기를 기회로 리셋하세요.`,
        neuralAffirmation: '"어떤 혼란도 나를 삼킬 수 없다. 나는 위기를 최고의 기회로 리셋한다."',
        metaEssayTitle: '거룩한 번개는 신성한 자아를 깨우는 축복입니다',
        metaEssayContent: `모든 충격과 변화는 당신 안에 잠들어 있던 거인을 깨우기 위한 우주의 북소리였습니다.`,
        metaAffirmation: '"세상의 모든 시련은 나를 더 위대하게 각성시키는 축복이다."',
        solutionWhy: '긍정적 재프레이밍 언어가 코르티솔 분비를 멈추고 전두엽을 켭니다.',
        solutionSteps: ['Step 1: "이것은 도약대다!" 선언', 'Step 2: 통제 가능한 1가지만 적기', 'Step 3: 10분 즉시 실행'],
        solutionTip: '통제할 수 없는 것에 에너지를 쓰지 마세요.'
      },
      {
        id: 'roots_57',
        title: '57.3 손위풍 (巽爲風)',
        category: '영혼의 뿌리 · Soul Roots (천명의 근원)',
        icon: TreePine,
        oneLiner: '말하지 않아도 본질을 꿰뚫어 보는 바람 같은 직관',
        hexLines: [false, true, true, false, true, true],
        hexagramVerse: '頻巽, 吝 (첫 직관을 따르고 의심을 거두어라)',
        hexagramMeaning: '바람처럼 유연하게 스며들어 사람과 상황의 본질을 꿰뚫어 보는 통찰입니다.',
        sajuAlignment: `${userName} 님의 맑은 직관이 가장 안전한 영적 나침반입니다.`,
        darkCode: '미래에 대한 막연한 불안과 과도한 의심',
        neuralCode: '복잡한 상황의 이면을 1초 만에 감지하고 결정하는 통찰',
        metaCode: '【무애명료 (無碍明瞭)】 만물의 이치를 투명하게 꿰뚫는 초감각',
        actionTip: '머리로 계산하기보다 몸이 느끼는 첫 번째 직관을 신뢰하세요.',
        easyMetaphor: '🍃 문틈 사이로 스며드는 부드러운 바람 같은 타고난 직관입니다.',
        easyDarkTitle: '미래에 대한 불안과 계산',
        easyDarkDesc: '머리로 너무 많이 따지다 결정을 미루는 패턴입니다.',
        easyNeuralTitle: '1초 만에 꿰뚫는 투명한 직관',
        easyNeuralDesc: '본능적으로 옳고 그름을 알아차리고 지혜로운 길을 선택하는 힘입니다.',
        easyMetaTitle: '【무애명료】',
        easyMetaDesc: '모든 상황의 인과관계가 유리알처럼 맑게 보이는 초감각입니다.',
        easyAction: '머리로 따지기 전 내 몸의 첫 느낌을 믿으세요.',
        darkEssayTitle: '머리의 끝없는 계산을 멈추고 고요한 가슴으로 돌아오세요',
        darkEssayContent: `계산기를 내려놓고 ${userName} 님의 가슴이 들려주는 고요한 첫 목소리에 귀를 기울여주세요.`,
        darkAffirmation: '"나는 미래를 통제하려 하지 않는다. 나는 지금 완벽하게 안전하다."',
        neuralEssayTitle: '설명할 수 없지만 정확한 당신의 신비로운 감각',
        neuralEssayContent: `남들의 조언보다 당신 몸이 느끼는 첫 감각을 100% 신뢰하세요. 그것이 가장 안전한 나침반입니다.`,
        neuralAffirmation: '"내 내면의 맑은 직관이 나를 가장 안전한 길로 이끈다."',
        metaEssayTitle: '어디에도 걸림 없는 바람처럼 세상을 관통합니다',
        metaEssayContent: `걸림 없는 대자유와 명료함이 언제나 당신의 영혼과 함께합니다.`,
        metaAffirmation: '"나는 걸림 없는 바람이다. 만물의 이치가 내 안에서 밝아진다."',
        solutionWhy: '몸의 신경계(Gut/Heart)는 뇌보다 먼저 순수한 진실을 감지합니다.',
        solutionSteps: ['Step 1: 가슴과 배에 손 얹기', 'Step 2: 몸이 편안한지 3초 관찰', 'Step 3: 이완되는 방향 선택'],
        solutionTip: '몸의 신경계는 절대 거짓말을 하지 않습니다.'
      }
    ],
    resonance: [
      {
        id: 'magnetic_11', title: '11.6 지천태 (地天泰)', category: '공명 자력 · Magnetic Resonance (인연의 자석)', icon: Heart,
        oneLiner: '사람들에게 평화와 깊은 신뢰를 선물하는 조화의 매력', hexLines: [true, true, true, false, false, false],
        hexagramVerse: '하늘과 땅이 하나 되어 태평성대를 이룬다', hexagramMeaning: '위아래가 소통하고 절대 화합을 이루는 상입니다.',
        sajuAlignment: `${userName} 님이 내 중심을 지킬 때 사람을 끌어당기는 자력이 극대화됩니다.`, darkCode: '갈등 회피와 억지 미소', neuralCode: '온화한 포용력과 진솔한 소통', metaCode: '【천지대동 (天地大同)】', actionTip: '따뜻한 경청 후 내 의견 전하기',
        easyMetaphor: '🌸 봄날의 따스한 햇살입니다.', easyDarkTitle: '억지 미소', easyDarkDesc: '불편한 상황을 피하는 것', easyNeuralTitle: '무장해제 포용력', easyNeuralDesc: '절대적 신뢰', easyMetaTitle: '【천지대동】', easyMetaDesc: '평화의 중심', easyAction: '다정하게 내 기준 말하기',
        darkEssayTitle: '평화를 위해 진심을 숨기지 마세요', darkEssayContent: '당신의 솔직한 생각도 존중받아야 합니다.', darkAffirmation: '"나는 내 진실을 편안하게 표현한다."', neuralEssayTitle: '사람의 마음을 녹이는 봄바람', neuralEssayContent: '당신의 포용력이 상생의 생태계를 만듭니다.', neuralAffirmation: '"내 따뜻한 공명이 안식처가 된다."', metaEssayTitle: '하늘과 땅의 축복', metaEssayContent: '온 세상이 당신과 하나 되어 춤춥니다.', metaAffirmation: '"내 존재 자체가 세상의 평화다."',
        solutionWhy: '공감 후 전달이 방어기제를 해제합니다.', solutionSteps: ['끝까지 듣기', '공감하기', '내 기준 전달'], solutionTip: '공감이 먼저입니다.'
      },
      {
        id: 'mindset_35', title: '35.6 화지진 (火地晉)', category: '명철 지성 · IQ Mindset (통찰과 지혜)', icon: Brain,
        oneLiner: '태양이 대지 위로 솟아오르듯 빠른 지적 통찰과 학습력', hexLines: [false, false, false, true, false, true],
        hexagramVerse: '불이 땅 위로 솟아올라 온 세상을 비춘다', hexagramMeaning: '방대한 정보를 핵심 1줄로 압축하는 명쾌한 지혜입니다.',
        sajuAlignment: `${userName} 님의 아이디어가 1줄 매뉴얼이 될 때 10배 번영합니다.`, darkCode: '지루함과 일 벌이기', neuralCode: '1줄 압축 지혜와 시스템화', metaCode: '【광명진보 (光明進步)】', actionTip: '스파크 메모로 1줄 기록하기',
        easyMetaphor: '💡 어둠을 밝히는 조명입니다.', easyDarkTitle: '일 벌이기', easyDarkDesc: '마무리 없이 딴짓', easyNeuralTitle: '1줄 압축력', easyNeuralDesc: '명쾌한 핵심 파악', easyMetaTitle: '【광명진보】', easyMetaDesc: '무한한 지혜', easyAction: '1줄 메모 작성',
        darkEssayTitle: '복잡한 생각을 비우고 1가지에 집중하세요', darkEssayContent: '가장 본질적인 1가지 보석만 남기세요.', darkAffirmation: '"나는 본질 1가지에 집중한다."', neuralEssayTitle: '세상을 꿰뚫는 명쾌한 지혜', neuralEssayContent: '당신의 1줄 메모가 사람들을 이끕니다.', neuralAffirmation: '"내 통찰력이 세상을 밝힌다."', metaEssayTitle: '대지 위의 태양', metaEssayContent: '당신의 발걸음마다 광명이 가득합니다.', metaAffirmation: '"나는 세상을 밝히는 지혜다."',
        solutionWhy: '외부 메모가 뇌의 과열을 막아줍니다.', solutionSteps: ['메모 앱 열기', '60자 1줄 적기', '원래 일 복귀'], solutionTip: '기록이 자산입니다.'
      },
      {
        id: 'compassion_6', title: '6.6 천수송 (天水訟)', category: '자비 감성 · EQ Compassion (공감과 감정 연금술)', icon: Smile,
        oneLiner: '갈등과 억압을 풀고 진솔한 바운더리를 맺는 중재자', hexLines: [false, true, false, true, true, true],
        hexagramVerse: '분쟁을 멈추고 자비로 감싸라', hexagramMeaning: '옳고 그름의 싸움을 내려놓고 평화를 택하는 상입니다.',
        sajuAlignment: `${userName} 님의 신경계 안정화와 번영의 기초입니다.`, darkCode: '억울함 폭발과 참기', neuralCode: '상생의 윈윈 대화와 중재', metaCode: '【대원화해 (大圓和解)】', actionTip: '1분 자비 호흡으로 식히기',
        easyMetaphor: '🕊️ 평화의 중재자입니다.', easyDarkTitle: '억울함 삼키기', easyDarkDesc: '참다가 폭발', easyNeuralTitle: '성숙한 대화법', easyNeuralDesc: '윈윈 합의 도출', easyMetaTitle: '【대원화해】', easyMetaDesc: '절대 자비', easyAction: '심호흡 5회',
        darkEssayTitle: '내면의 억울함을 씻어내세요', darkEssayContent: '승자 없는 싸움에서 벗어나 평화를 지키세요.', darkAffirmation: '"나는 마음의 평화를 선택한다."', neuralEssayTitle: '매듭을 푸는 마법의 언어', neuralEssayContent: '당신의 말이 상처를 치유합니다.', neuralAffirmation: '"내 대화가 상생을 연다."', metaEssayTitle: '자비의 바다', metaEssayContent: '모든 분쟁이 녹아내렸습니다.', metaAffirmation: '"나는 완전한 평화다."',
        solutionWhy: '날숨 호흡이 미주신경을 자극해 진정시킵니다.', solutionSteps: ['잠시 피하기', '4-2-6 호흡 5회', '평화로운 길 선택'], solutionTip: '호흡이 먼저입니다.'
      },
      {
        id: 'sovereignty_40', title: '40.2 뇌수해 (雷水解)', category: '영적 주권 · SQ Sovereignty (코어 상처 완전 해방)', icon: Sparkles,
        oneLiner: '과거의 죄책감을 눈 녹듯 풀어내어 자유를 주는 해방', hexLines: [false, true, false, true, false, false],
        hexagramVerse: '세 마리 여우를 잡고 황금 화살을 얻는다', hexagramMeaning: '모든 속박을 풀고 순수한 영적 중심에 이른 대자유입니다.',
        sajuAlignment: `${userName} 님의 ${userIlju} 명식에서 막힌 기운을 뚫어냅니다.`, darkCode: '과잉 책임감과 자책', neuralCode: '온전한 주권 회복과 자유', metaCode: '【억압해탈 (抑壓解脫)】', actionTip: '무자책 선언 되새기기',
        easyMetaphor: '🔓 쇠사슬을 끊는 열쇠입니다.', easyDarkTitle: '남 짐 떠안기', easyDarkDesc: '혼자 탈진', easyNeuralTitle: '당당한 주권', easyNeuralDesc: '안식처 사수', easyMetaTitle: '【억압해탈】', easyMetaDesc: '대자유', easyAction: '무자책 선언하기',
        darkEssayTitle: '세상을 구하느라 지친 당신, 짐을 내려놓으세요', darkEssayContent: '당신이 먼저 행복해야 세상도 구원받습니다.', darkAffirmation: '"나는 세상을 다 구하지 않아도 괜찮다."', neuralEssayTitle: '황금 화살을 쥔 대결단', neuralEssayContent: '단호한 결의가 진짜 자유를 줍니다.', neuralAffirmation: '"나는 온전히 자유롭다."', metaEssayTitle: '영적 대자유의 축제', metaEssayContent: '깃털처럼 가벼운 평화가 함께합니다.', metaAffirmation: '"나는 온전히 해방되었다."',
        solutionWhy: '무자책 선언이 뇌의 낡은 처벌 루프를 끊습니다.', solutionSteps: ['자책했던 일 떠올리기', '무자책 선언', '10분 편히 눕기'], solutionTip: '쉼은 에너지 충전입니다.'
      }
    ],
    prosperity: [
      {
        id: 'core_mission_29', title: '29.2 중수감 (重水坎)', category: '코어 미션 · Core Mission (1순위 폭발력)', icon: Zap,
        oneLiner: '험난한 물살도 뚫고 끝까지 파고드는 1순위 초몰입', hexLines: [false, true, false, false, true, false],
        hexagramVerse: '정성을 다하면 험난함 속에서도 얻는다', hexagramMeaning: '잔가지를 쳐내고 1순위에 집중하여 명작을 짓는 상입니다.',
        sajuAlignment: `${userName} 님의 부의 물길을 여는 몰입입니다.`, darkCode: '잡무 분산과 미루기', neuralCode: '1순위 초몰입 장인정신', metaCode: '【심해몰입 (深海沒入)】', actionTip: '아침 10분 1순위 과업 완수',
        easyMetaphor: '🌊 바위를 뚫는 거대한 강물입니다.', easyDarkTitle: '잡무에 치임', easyDarkDesc: '중요한 일 미룸', easyNeuralTitle: '1순위 장인정신', easyNeuralDesc: '명작 완성', easyMetaTitle: '【심해몰입】', easyMetaDesc: '고요한 성취', easyAction: '1순위 먼저 하기',
        darkEssayTitle: '남들의 불 끄느라 내 집을 태우지 마세요', darkEssayContent: '당신의 시간은 최고 명작을 만드는 데 쓰여야 합니다.', darkAffirmation: '"나는 1순위 과업에 몰입한다."', neuralEssayTitle: '바위를 뚫는 초집중력', neuralEssayContent: '당신의 집중력이 거대한 부를 끌어당깁니다.', neuralAffirmation: '"내 몰입이 성취를 만든다."', metaEssayTitle: '심해의 절대적 고요', metaEssayContent: '모든 성취가 저절로 이루어집니다.', metaAffirmation: '"나는 깊은 바다처럼 고요하다."',
        solutionWhy: '아침 첫 1시간 뇌가 가장 맑습니다.', solutionSteps: ['1순위 과제 펼치기', '10분 차단 몰입', '일상 업무 시작'], solutionTip: '내 일이 언제나 먼저입니다.'
      },
      {
        id: 'ecosystem_59', title: '59.1 풍수환 (風水渙)', category: '협력 생태계 · Cooperation Ecosystem (상생 네트워크)', icon: Globe,
        oneLiner: '닫힌 마음을 녹여내고 하나로 묶는 따뜻한 리더십', hexLines: [false, true, false, false, true, true],
        hexagramVerse: '굳센 말처럼 힘차게 구원하여 번영하라', hexagramMeaning: '얼음을 녹여 대양으로 흐르는 상생의 네트워크입니다.',
        sajuAlignment: `${userName} 님이 매뉴얼로 위임할 때 10배 성장합니다.`, darkCode: '불신과 고립 강박', neuralCode: '신뢰와 시스템 위임', metaCode: '【만유융합 (萬有融合)】', actionTip: '반복 업무 매뉴얼 만들기',
        easyMetaphor: '🚢 얼음을 깨는 쇄빙선 리더십입니다.', easyDarkTitle: '불신과 고립', easyDarkDesc: '혼자 다 하려다 지침', easyNeuralTitle: '시스템 위임', easyNeuralDesc: '10배 레버리지', easyMetaTitle: '【만유융합】', easyMetaDesc: '우주적 연대', easyAction: '체크리스트 작성',
        darkEssayTitle: '혼자서 모든 것을 다 짊어지지 마세요', darkEssayContent: '닫힌 손을 펴고 시스템을 믿어보세요.', darkAffirmation: '"나는 시스템과 신뢰로 위임한다."', neuralEssayTitle: '오케스트라 지휘자', neuralEssayContent: '당신의 매뉴얼이 팀을 춤추게 합니다.', neuralAffirmation: '"내 신뢰가 시너지를 만든다."', metaEssayTitle: '온 우주가 함께 일합니다', metaEssayContent: '모든 이가 당신의 번영을 돕습니다.', metaAffirmation: '"우리는 하나 되어 번영한다."',
        solutionWhy: '매뉴얼 위임이 시간을 무한대로 늘립니다.', solutionSteps: ['반복 업무 선정', '3단계 체크리스트 작성', '위임하기'], solutionTip: '체크리스트가 자유를 줍니다.'
      },
      {
        id: 'signature_brand_53', title: '53.1 풍산점 (風山漸)', category: '시그니처 권위 · Signature Brand (독보적 VIP 신뢰)', icon: Award,
        oneLiner: '시간이 흐를수록 가치가 복리로 폭발하는 절대 브랜드', hexLines: [false, false, true, false, true, true],
        hexagramVerse: '차츰 나아가 큰 결실을 맺는다', hexagramMeaning: '타협 없는 퀄리티로 VIP를 사로잡는 브랜드 파워입니다.',
        sajuAlignment: `시간이 흐를수록 빛을 발하는 ${userName} 님의 고결함입니다.`, darkCode: '반짝 유행 집착', neuralCode: '타협 없는 퀄리티', metaCode: '【무위점진】', actionTip: '장기 평판에 집중하기',
        easyMetaphor: '💎 대를 잇는 100년 명품입니다.', easyDarkTitle: '유행 쫓기', easyDarkDesc: '품격 낮추기', easyNeuralTitle: '타협 없는 신뢰', easyNeuralDesc: 'VIP가 줄을 섬', easyMetaTitle: '【무위점진】', easyMetaDesc: '절대 권위', easyAction: '고객 감동 주기',
        darkEssayTitle: '유행에 당신의 품격을 팔지 마세요', darkEssayContent: '진짜 보석은 세월이 흘러도 가치가 올라갑니다.', darkAffirmation: '"나는 영원히 빛나는 명품이다."', neuralEssayTitle: 'VIP들이 줄을 서는 절대 권위', neuralEssayContent: '당신의 정성이 VIP 고객을 모읍니다.', neuralAffirmation: '"내 브랜드는 복리로 폭발한다."', metaEssayTitle: '그윽한 향기의 권위', metaEssayContent: '광고하지 않아도 온 세상이 당신을 찾습니다.', metaAffirmation: '"내 향기가 풍요를 끌어당긴다."',
        solutionWhy: 'VIP는 일관성과 품격에 지갑을 엽니다.', solutionSteps: ['1명에게 100% 정성', '5% 감동 디테일', '품격 지키기'], solutionTip: '팬 1명이 100명을 이깁니다.'
      },
      {
        id: 'quantum_abundance_40', title: '40.2 뇌수해 (雷水解)', category: '퀀텀 풍요 결실 · Quantum Abundance (영적 자유와 부의 합일)', icon: Crown,
        oneLiner: '사람들을 속박에서 해방시킨 대가로 얻는 최고의 풍요', hexLines: [false, true, false, true, false, false],
        hexagramVerse: '황금 화살을 얻고 풍요의 축복을 누려라', hexagramMeaning: '영적 대자유와 물질적 부가 완벽히 일치하는 풍요입니다.',
        sajuAlignment: `${userName} 님의 ${userIlju} 명식의 궁극적 풍요 결실입니다.`, darkCode: '성과 집착과 탈진', neuralCode: '영적 자유와 부의 일치', metaCode: '【퀀텀풍요 (Quantum Abundance)】', actionTip: '부와 에너지를 안식처에 보관하기',
        easyMetaphor: '🏆 황금빛 열매입니다.', easyDarkTitle: '몸 상해가며 일하기', easyDarkDesc: '건강 손실', easyNeuralTitle: '자유롭고 부유함', easyNeuralDesc: '선순환 완성', easyMetaTitle: '【퀀텀풍요】', easyMetaDesc: '축복의 완성', easyAction: '안식처 시간 떼어놓기',
        darkEssayTitle: '돈을 위해 당신의 건강을 태우지 마세요', darkEssayContent: '당신이 편안할 때 진짜 황금빛 풍요가 옵니다.', darkAffirmation: '"나는 건강하고 평화롭게 번영한다."', neuralEssayTitle: '자유를 선물한 거룩한 대가', neuralEssayContent: '당신이 버는 돈은 세상의 감사입니다.', neuralAffirmation: '"우주는 내게 최고의 풍요를 준다."', metaEssayTitle: '통장과 영혼의 일치', metaEssayContent: '당신은 가장 축복받은 풍요의 완성자입니다.', metaAffirmation: '"내 통장과 영혼에 번영이 가득하다."',
        solutionWhy: '안식처가 단단해야 부를 지킵니다.', solutionSteps: ['하루 30분 안식처 시간', '업무 연락 끄기', '감사 기도 올리기'], solutionTip: '안식이 부를 지킵니다.'
      }
    ]
  };
}

// 🌟 60갑자 사주별 12대 괘 동적 생성 엔진
function generateDynamicSequences(dob: string, userName: string, iljuKo: string, gan: string): { essence: CodeItem[]; resonance: CodeItem[]; prosperity: CodeItem[]; activeGates: number[] } {
  // 신사(辛巳)일주일 때는 기준 마스터 데이터 100% 복구 반환!
  if (iljuKo.includes('신사') || gan === '신') {
    return getMasterShinsaSequences(userName, '신사(辛巳)');
  }

  // 다른 사주 일주에 대한 맞춤형 12대 괘 생성
  const baseMaster = getMasterShinsaSequences(userName, `${iljuKo}일주`);
  
  // 천간별 1단계 대표 괘 매핑
  let customMain = { num: 53, line: 1, title: '53.1 풍산점 (風山漸)', dark: '조급증과 완벽주의', neural: '10분 복리 시스템', meta: '무위점진' };
  if (gan === '갑') customMain = { num: 1, line: 1, title: '1.1 중천건 (重天乾)', dark: '조급함과 독선', neural: '시대를 여는 개척 리더십', meta: '천행건 순수창조' };
  else if (gan === '을') customMain = { num: 32, line: 1, title: '32.1 뇌풍항 (雷風恒)', dark: '변덕과 포기', neural: '유연한 적응과 지속력', meta: '영원한 항상성' };
  else if (gan === '병') customMain = { num: 14, line: 1, title: '14.1 화천대유 (火天大有)', dark: '소유욕과 통제', neural: '모두를 비추는 광명 번영', meta: '대유번영' };
  else if (gan === '정') customMain = { num: 30, line: 1, title: '30.1 중화리 (重火麗)', dark: '불안과 집착', neural: '어둠을 밝히는 등불 지혜', meta: '광명조화' };
  else if (gan === '무') customMain = { num: 15, line: 1, title: '15.1 지산겸 (地山謙)', dark: '체면과 위축', neural: '태산의 겸손과 중후함', meta: '겸덕무적' };
  else if (gan === '기') customMain = { num: 2, line: 1, title: '2.1 중지곤 (重地坤)', dark: '방향상실과 고립', neural: '만물을 품는 옥토 포용력', meta: '후덕재물' };
  else if (gan === '경') customMain = { num: 49, line: 1, title: '49.1 택화혁 (澤火革)', dark: '독단과 과격함', neural: '낡은 것을 쳐내는 결단 혁신', meta: '천명혁신' };
  else if (gan === '임') customMain = { num: 29, line: 1, title: '29.1 중수감 (重水坎)', dark: '에너지 분산', neural: '심해의 초몰입과 유연함', meta: '심해무애' };
  else if (gan === '계') customMain = { num: 63, line: 1, title: '63.1 수화기제 (水火旣濟)', dark: '안주와 불안', neural: '완벽한 조화와 마감력', meta: '기제완성' };

  // 1단계 첫 번째 카드 커스텀 교체
  baseMaster.essence[0] = {
    ...baseMaster.essence[0],
    title: customMain.title,
    oneLiner: `${iljuKo}일주의 기운으로 ${customMain.neural}을 꽃피우는 천명 과업`,
    darkCode: `[다크코드] ${customMain.dark}`,
    neuralCode: `[뉴럴코드] ${customMain.neural}`,
    metaCode: `【메타코드】 ${customMain.meta}`
  };

  return baseMaster;
}

const GAN_LIST = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const GAN_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI_LIST = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const ZHI_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function calculateIljuFromDate(dateStr: string): { iljuKo: string; iljuHanja: string; gan: string; zhi: string; ganName: string } {
  try {
    const parts = dateStr.replace(/[^0-9]/g, '-').split('-').filter(Boolean);
    if (parts.length >= 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      const baseDate = Date.UTC(2000, 0, 1);
      const targetDate = Date.UTC(year, month - 1, day);
      const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
      
      const iljuIndex = ((54 + (diffDays % 60)) % 60 + 60) % 60;
      const ganIdx = iljuIndex % 10;
      const zhiIdx = iljuIndex % 12;

      const gan = GAN_LIST[ganIdx];
      const zhi = ZHI_LIST[zhiIdx];
      const ganHanja = GAN_HANJA[ganIdx];
      const zhiHanja = ZHI_HANJA[zhiIdx];

      return {
        iljuKo: `${gan}${zhi}`,
        iljuHanja: `${ganHanja}${zhiHanja}`,
        gan,
        zhi,
        ganName: `${gan} (${gan === '갑' || gan === '을' ? '목' : gan === '병' || gan === '정' ? '화' : gan === '무' || gan === '기' ? '토' : gan === '경' || gan === '신' ? '금' : '수'})`
      };
    }
  } catch (e) {}

  return { iljuKo: '신사', iljuHanja: '辛巳', gan: '신', zhi: '사', ganName: '신 (금)' };
}

function HexagramLines({ lines, color = 'amber' }: { lines: boolean[]; color?: 'amber' | 'emerald' | 'rose' }) {
  const colorMap = {
    amber: 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    rose: 'bg-gradient-to-r from-rose-400 to-pink-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
  };

  return (
    <div className="flex flex-col gap-1 w-6 py-0.5 items-center justify-center">
      {lines.slice().reverse().map((isYang, idx) => (
        isYang ? (
          <div key={idx} className={`w-full h-1 rounded-full ${colorMap[color]}`} />
        ) : (
          <div key={idx} className="w-full flex justify-between gap-1">
            <div className={`w-[42%] h-1 rounded-full ${colorMap[color]}`} />
            <div className={`w-[42%] h-1 rounded-full ${colorMap[color]}`} />
          </div>
        )
      ))}
    </div>
  );
}

export default function SoulArchivePage() {
  const [activeTab, setActiveTab] = useState<'core' | 'alchemy' | 'neural64' | 'saju12'>('alchemy');
  const [expandedCard, setExpandedCard] = useState<string | null>('mission_53');
  const [modalItem, setModalItem] = useState<CodeItem | null>(null);
  const [modalMode, setModalMode] = useState<'expert' | 'beginner'>('expert');
  const [essayModal, setEssayModal] = useState<{ title: string; category: string; content: string; affirmation: string; icon: any; color: string } | null>(null);
  const [solutionModal, setSolutionModal] = useState<{ title: string; actionTip: string; why: string; steps: string[]; tip: string } | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 🌟 사용자 동적 프로필 상태 (기본값: 신사일주)
  const [userName, setUserName] = useState<string>("강미숙");
  const [birthDate, setBirthDate] = useState<string>("1972-06-20");
  const [userIlju, setUserIlju] = useState<string>("신사(辛巳)");
  const [dayMasterName, setDayMasterName] = useState<string>("신 (금)");

  // 🌟 천명 연금술 경로 시퀀스 상태 (기본: 신사일주 마스터 괘 복구)
  const [myeongsimSequences, setMyeongsimSequences] = useState<any>(() => getMasterShinsaSequences('강미숙', '신사(辛巳)'));

  // 🌟 퀵 날짜 변경 모달 상태
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>("강미숙");
  const [inputDob, setInputDob] = useState<string>("1972-06-20");

  const applyBirthDate = (name: string, dob: string) => {
    setUserName(name);
    setBirthDate(dob);

    const iljuResult = calculateIljuFromDate(dob);
    setUserIlju(`${iljuResult.iljuKo}(${iljuResult.iljuHanja})`);
    setDayMasterName(iljuResult.ganName);

    // 🔮 핵심: 신사일주는 기준 마스터 괘로 100% 복구, 다른 사주는 그에 맞게 변동!
    const mSeq = generateDynamicSequences(dob, name, iljuResult.iljuKo, iljuResult.gan);
    setMyeongsimSequences(mSeq);
    setExpandedCard(mSeq.essence[0]?.id || 'mission_53');

    try {
      const updatedProfile = {
        name,
        userName: name,
        birthDate: dob,
        dob,
        ilju: `${iljuResult.iljuKo}(${iljuResult.iljuHanja})`,
        dayMaster: iljuResult.ganName
      };
      localStorage.setItem('myeongsim_user_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('saju_data', JSON.stringify(updatedProfile));
      localStorage.setItem('userInput', JSON.stringify(updatedProfile));
    } catch (e) {}
  };

  const syncUserData = () => {
    try {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      const qName = params.get('name');
      const qDob = params.get('dob') || params.get('birthDate') || params.get('birth');

      const possibleKeys = [
        'myeongsim_user_profile',
        'saju_data',
        'saju_result',
        'sajuResult',
        'userInput',
        'myeongsim_user_data',
        'user_profile',
        'auth_user'
      ];

      let targetName = "강미숙";
      let targetDob = "1972-06-20";

      for (const key of possibleKeys) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed) {
              if (parsed.name || parsed.userName || parsed.userNameKo) {
                targetName = parsed.name || parsed.userName || parsed.userNameKo;
              }
              if (parsed.birthDate || parsed.dob || parsed.birth) {
                targetDob = parsed.birthDate || parsed.dob || parsed.birth;
                break;
              } else if (parsed.year && parsed.month && parsed.day) {
                targetDob = `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
                break;
              }
            }
          } catch (err) {}
        }
      }

      if (qName) targetName = qName;
      if (qDob) targetDob = qDob;

      setInputName(targetName);
      setInputDob(targetDob);
      applyBirthDate(targetName, targetDob);

    } catch (e) {
      console.log('만세력 싱크 완료');
    }
  };

  useEffect(() => {
    syncUserData();

    window.addEventListener('storage', syncUserData);
    window.addEventListener('focus', syncUserData);

    return () => {
      window.removeEventListener('storage', syncUserData);
      window.removeEventListener('focus', syncUserData);
    };
  }, []);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleGenerateLiveAiEssay = async (type: 'dark' | 'neural' | 'meta') => {
    if (!modalItem) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/soul-archive/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          dayMaster: dayMasterName,
          sajuPillars: `${userIlju}일주 · ${birthDate}`,
          codeTitle: modalItem.title,
          codeCategory: modalItem.category,
          codeType: type === 'dark' ? '다크코드 치유' : type === 'neural' ? '뉴럴코드 성장' : '메타코드 초의식'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEssayModal({
          title: json.data.essayTitle || modalItem.darkEssayTitle,
          category: `🔮 명심 AI 실시간 ${type === 'dark' ? '치유' : type === 'neural' ? '성장' : '초의식'} 리딩`,
          content: json.data.essayContent || modalItem.darkEssayContent,
          affirmation: json.data.goldenAffirmation || modalItem.darkAffirmation,
          icon: Sparkles,
          color: type === 'dark' ? 'red' : type === 'neural' ? 'emerald' : 'amber'
        });
      } else {
        openEssay(type);
      }
    } catch (e) {
      openEssay(type);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const toggleCard = (id: string) => {
    setExpandedCard(prev => prev === id ? null : id);
  };

  const openDetailModal = (item: CodeItem, mode: 'expert' | 'beginner' = 'expert') => {
    setModalItem(item);
    setModalMode(mode);
    setEssayModal(null);
    setSolutionModal(null);
  };

  const openSolutionModal = (item: CodeItem) => {
    setSolutionModal({
      title: item.title,
      actionTip: item.actionTip,
      why: item.solutionWhy,
      steps: item.solutionSteps,
      tip: item.solutionTip
    });
  };

  const openEssay = (type: 'dark' | 'neural' | 'meta') => {
    if (!modalItem) return;
    if (type === 'dark') {
      setEssayModal({
        title: modalItem.darkEssayTitle,
        category: '🛡️ 다크코드 심층 치유 에세이',
        content: modalItem.darkEssayContent,
        affirmation: modalItem.darkAffirmation,
        icon: Shield,
        color: 'red'
      });
    } else if (type === 'neural') {
      setEssayModal({
        title: modalItem.neuralEssayTitle,
        category: '✨ 뉴럴코드 성장 에세이',
        content: modalItem.neuralEssayContent,
        affirmation: modalItem.neuralAffirmation,
        icon: Zap,
        color: 'emerald'
      });
    } else {
      setEssayModal({
        title: modalItem.metaEssayTitle,
        category: '🌟 메타코드 초의식 에세이',
        content: modalItem.metaEssayContent,
        affirmation: modalItem.metaAffirmation,
        icon: Sparkles,
        color: 'amber'
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#03060c] text-slate-100 font-sans p-4 sm:p-8 flex flex-col items-center">
      {copiedToast && (
        <div className="fixed top-6 z-50 px-4 py-2 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>성공적으로 클립보드에 복사되었습니다!</span>
        </div>
      )}

      {/* 🔮 [생년월일 실시간 직접 변경 모달] */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#161f33] to-[#080d1a] border border-amber-500/60 p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.4)] space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300 text-sm font-bold font-mono">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>명심 천명 ✕ 사주 만세력 1:1 연동</span>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">이름 / 닉네임</label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">생년월일 (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={inputDob}
                  onChange={(e) => setInputDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs font-mono space-y-1">
                <div className="text-[11px] font-bold text-amber-300">⚡ 예상 연산 일주 & 천명 코드:</div>
                <div className="text-sm font-bold text-white">
                  👉 {calculateIljuFromDate(inputDob).iljuKo}({calculateIljuFromDate(inputDob).iljuHanja})일주 · {calculateIljuFromDate(inputDob).ganName}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => {
                  applyBirthDate(inputName, inputDob);
                  setShowEditModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
              >
                천명 코드 즉시 반영하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔮 [천명 번영 실행 솔루션 초보자 상세 팝업창] */}
      {solutionModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#161f33] via-[#0f172a] to-[#080d1a] border border-amber-500/60 p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.45)] space-y-5 text-left">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>천명 번영 실행 솔루션 코칭 상세 가이드</span>
                </span>
              </div>
              <button 
                onClick={() => setSolutionModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{solutionModal.title}</span>
              </h3>
              <p className="text-xs text-amber-300 font-medium font-sans">
                👉 "{solutionModal.actionTip}"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold font-mono">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>💡 왜 이 행동이 필요한가요? (초보자용 뇌과학 원리)</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-sans">
                {solutionModal.why}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-mono">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>📋 오늘 당장 따라 하는 [10분 마이크로 실천 3단계]</span>
              </div>
              <div className="space-y-2 text-xs text-gray-200 font-sans">
                {solutionModal.steps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 leading-relaxed flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 text-emerald-200 text-xs font-sans space-y-1">
              <strong className="text-emerald-400 block font-mono text-[11px]">🌿 명심 코칭 마스터 꿀팁:</strong>
              <p className="leading-relaxed">{solutionModal.tip}</p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSolutionModal(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
              >
                이해했습니다 (닫기)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔮 [2단계 감동 심층 치유 에세이 팝업 모달] */}
      {essayModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#111a2e] to-[#080d17] border border-amber-500/60 p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.4)] space-y-6 text-left">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button
                onClick={() => setEssayModal(null)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>이전 해설로 돌아가기</span>
              </button>

              <button 
                onClick={() => setEssayModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40">
                {essayModal.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {essayModal.title}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-gray-200 leading-relaxed font-serif space-y-4 whitespace-pre-line shadow-inner">
              {essayModal.content}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/50 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>🌱 가슴에 새기는 황금 앵커 확언</span>
                </span>
                <button
                  onClick={() => handleCopyText(essayModal.affirmation)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>확언 복사</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm font-black text-amber-100 font-sans leading-relaxed">
                {essayModal.affirmation}
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setEssayModal(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
              >
                가슴 깊이 간직하겠습니다 (닫기)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔮 [1차 AI 듀얼 모드 심층 팝업 모달] */}
      {modalItem && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0e1626] to-[#080d1a] border border-amber-500/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.35)] space-y-5 text-left">
            
            <button 
              onClick={() => setModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40">
                    명심 AI 심층 천명 리딩
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{modalItem.category}</span>
                </div>
                <HexagramLines lines={modalItem.hexLines} color="amber" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{modalItem.title}</span>
              </h2>
              <p className="text-xs text-emerald-400 font-medium">"{modalItem.oneLiner}"</p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setModalMode('expert')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'expert'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>📜 심층 분석 & 주역 효사</span>
                </button>

                <button
                  onClick={() => setModalMode('beginner')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalMode === 'beginner'
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md font-black'
                      : 'bg-white/5 text-emerald-300 hover:bg-white/10 border border-emerald-500/30'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>💡 초보자용 쉬운 해설</span>
                </button>
              </div>
            </div>

            {modalMode === 'expert' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
                    <BookOpen className="w-4 h-4" />
                    <span>명심 천명 효사 & 괘의 본질</span>
                  </div>
                  <p className="text-xs font-serif text-amber-100/90 leading-relaxed bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                    "{modalItem.hexagramVerse}"
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed pt-1 font-sans">
                    {modalItem.hexagramMeaning}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold font-mono">
                    <UserCheck className="w-4 h-4" />
                    <span>{userName} 님 사주 원국({userIlju}일주) 1:1 맞춤 정합성</span>
                  </div>
                  <p className="text-xs text-indigo-100/90 leading-relaxed font-sans">
                    {modalItem.sajuAlignment}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div 
                    onClick={() => openEssay('dark')}
                    className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 text-red-200 cursor-pointer hover:border-red-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-red-400 block font-mono text-[10px] mb-0.5">🛡️ 1. 다크코드 (과거의 낡은 보디가드):</strong>
                      <p>{modalItem.darkCode}</p>
                    </div>
                    <span className="text-[10px] text-red-300 underline font-sans shrink-0 ml-2">치유 에세이 ↗</span>
                  </div>

                  <div 
                    onClick={() => openEssay('neural')}
                    className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-emerald-200 cursor-pointer hover:border-emerald-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-emerald-400 block font-mono text-[10px] mb-0.5">✨ 2. 뉴럴코드 (고유의 천부적 주권 무기):</strong>
                      <p>{modalItem.neuralCode}</p>
                    </div>
                    <span className="text-[10px] text-emerald-300 underline font-sans shrink-0 ml-2">성장 에세이 ↗</span>
                  </div>

                  <div 
                    onClick={() => openEssay('meta')}
                    className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-amber-950/30 to-indigo-950/40 border border-amber-500/40 text-amber-200 cursor-pointer hover:border-amber-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-amber-300 block font-mono text-[10px] mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>3. 메타코드 (제로포인트 대자유 & 초의식):</span>
                      </strong>
                      <p className="font-serif text-amber-100/90">{modalItem.metaCode}</p>
                    </div>
                    <span className="text-[10px] text-amber-300 underline font-sans shrink-0 ml-2">초의식 에세이 ↗</span>
                  </div>
                </div>

                <div 
                  onClick={() => openSolutionModal(modalItem)}
                  className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 hover:border-amber-400 text-amber-200 text-xs font-mono cursor-pointer transition-all hover:bg-amber-500/25 flex items-center justify-between shadow-sm"
                >
                  <div>
                    👉 <strong className="text-amber-300">천명 번영 실행 솔루션 코칭:</strong> {modalItem.actionTip}
                  </div>
                  <span className="text-[10px] text-amber-300 underline font-sans shrink-0 ml-2">상세 풀이 팝업 ↗</span>
                </div>
              </div>
            )}

            {modalMode === 'beginner' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 space-y-1.5 shadow-inner">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold font-mono">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <span>💡 한눈에 쏙 들어오는 쉬운 일상 비유</span>
                  </div>
                  <p className="text-xs text-emerald-100 leading-relaxed font-sans font-medium">
                    {modalItem.easyMetaphor}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div 
                    onClick={() => openEssay('dark')}
                    className="p-3.5 rounded-2xl bg-red-950/25 border border-red-500/35 hover:border-red-400 text-red-200 space-y-1 cursor-pointer transition-all hover:bg-red-950/40 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-red-400 font-mono text-[11px] font-bold">
                      <span>🛡️ 1. 다크코드: {modalItem.easyDarkTitle}</span>
                      <span className="text-[10px] text-red-300 underline font-sans flex items-center gap-1">
                        <span>📖 감동 치유 에세이 열기</span>
                        <span>↗</span>
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-red-200/90">{modalItem.easyDarkDesc}</p>
                  </div>

                  <div 
                    onClick={() => openEssay('neural')}
                    className="p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-500/35 hover:border-emerald-400 text-emerald-200 space-y-1 cursor-pointer transition-all hover:bg-emerald-950/40 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-emerald-400 font-mono text-[11px] font-bold">
                      <span>✨ 2. 뉴럴코드: {modalItem.easyNeuralTitle}</span>
                      <span className="text-[10px] text-emerald-300 underline font-sans flex items-center gap-1">
                        <span>📖 감동 성장 에세이 열기</span>
                        <span>↗</span>
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-emerald-200/90">{modalItem.easyNeuralDesc}</p>
                  </div>

                  <div 
                    onClick={() => openEssay('meta')}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-amber-950/30 to-indigo-950/40 border border-amber-500/40 hover:border-amber-400 text-amber-200 space-y-1 cursor-pointer transition-all hover:opacity-95 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-amber-300 font-mono text-[11px] font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>3. 메타코드: {modalItem.easyMetaTitle}</span>
                      </span>
                      <span className="text-[10px] text-amber-300 underline font-sans flex items-center gap-1">
                        <span>📖 초의식 에세이 열기</span>
                        <span>↗</span>
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-100/90">{modalItem.easyMetaDesc}</p>
                  </div>
                </div>

                <div 
                  onClick={() => openSolutionModal(modalItem)}
                  className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 text-xs font-mono cursor-pointer transition-all hover:bg-cyan-950/45 flex items-center justify-between shadow-sm"
                >
                  <div>
                    👉 <strong className="text-cyan-300">오늘 당장 할 일 1가지:</strong> {modalItem.easyAction}
                  </div>
                  <span className="text-[10px] text-cyan-300 underline font-sans shrink-0 ml-2">실천 가이드 팝업 ↗</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => handleGenerateLiveAiEssay('neural')}
                disabled={isAiGenerating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 hover:from-purple-600/50 hover:to-cyan-600/50 border border-cyan-500/50 text-cyan-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>명심 AI 천명 리딩 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>🔮 명심 AI 실시간 천명 리딩</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setModalItem(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 메인 컨테이너 */}
      <div className="w-full max-w-4xl space-y-6">
        
        {/* VIP 럭셔리 볼트 헤더 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1628] via-[#090e1a] to-[#04060a] border border-amber-500/50 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2.5 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/50 text-[10px] font-extrabold text-amber-300 tracking-widest uppercase font-mono shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>MYONGSIM SOUL VAULT · 2026 OFFICIAL ARCHIVE</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>소울 아카이브</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono border border-amber-500/30">80P VIP Report</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <span className="text-gray-300">수신인: <strong className="text-amber-300 font-bold">{userName}</strong> 님</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300">사주 일주: <strong className="text-emerald-300 font-bold px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40">{userIlju}일주</strong></span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300">생년월일: <strong className="text-cyan-300 font-bold">{birthDate}</strong></span>
                
                <button
                  onClick={() => setShowEditModal(true)}
                  className="ml-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>생년월일 변경</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleCopyText(window.location.href)}
                className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>공유</span>
              </button>

              <button 
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF 리포트 보관</span>
              </button>
            </div>
          </div>
        </div>

        {/* 플로팅 글래스 캡슐 탭 바 */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-2xl shadow-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('core')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'core'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>당신의 본질</span>
          </button>

          <button
            onClick={() => setActiveTab('alchemy')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'alchemy'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>천명 연금술 경로</span>
          </button>

          <button
            onClick={() => setActiveTab('neural64')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'neural64'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>명심 64 뉴럴코드</span>
          </button>

          <button
            onClick={() => setActiveTab('saju12')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'saju12'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>십성 · 12운성</span>
          </button>
        </div>

        {/* 🌟 TAB 1: [당신의 본질 (Core Essence)] */}
        {activeTab === 'core' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#130b24] via-[#0c0818] to-[#04060a] border border-purple-500/40 space-y-6 shadow-[0_15px_40px_rgba(168,85,247,0.15)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-purple-950/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <Gem className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-purple-300 flex items-center gap-2">
                      <span>{userName} 님의 영혼 본질 원형 매트릭스</span>
                      <span className="text-[10px] text-purple-400/80 font-mono font-normal">(Core Essence Matrix)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userIlju}일주 ✕ {birthDate} 맞춤 만세력 & 천명 코드 정밀 연산
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/80 px-3 py-1 rounded-xl border border-purple-500/40">
                  {dayMasterName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 text-xs font-bold font-mono">
                    <Gem className="w-4 h-4 text-purple-400" />
                    <span>1. 영혼 기질: {myeongsimSequences.essence[0]?.title}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {myeongsimSequences.essence[0]?.easyMetaphor}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-rose-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold font-mono">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>2. 내면 성장 엔진: {userIlju}의 핵심 동력</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {myeongsimSequences.essence[0]?.sajuAlignment}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold font-mono">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>3. 천명 조후 균형: 유연한 소통과 감성 조화</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    조열하거나 차가운 기운을 부드러운 호흡과 10분의 쉼으로 조율할 때, {userName} 님의 신경계는 완벽히 안정되며 막혔던 부와 영감이 솟아납니다.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>4. 주권 방패: 불가침 안식처와 바운더리</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    타인의 시선이나 무리한 요구에 내 권리를 양도하지 않고 단단한 울타리를 칠 때, {userName} 님의 천부적 에너지가 최고 권위로 보존됩니다.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>오늘의 본질 정렬 선언문</span>
                  </div>
                  <p className="text-xs text-purple-100/90 font-serif leading-relaxed">
                    "나는 남들의 기준에 흔들리지 않는 찬란한 {dayMasterName}의 주권자다. 내 속도대로 우아하게 나아갈 때 온 우주가 나와 함께한다."
                  </p>
                </div>
                <button
                  onClick={() => handleCopyText(`나는 남들의 기준에 흔들리지 않는 찬란한 ${dayMasterName}의 주권자다. 내 속도대로 우아하게 나아갈 때 온 우주가 나와 함께한다.`)}
                  className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>선언문 복사</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 TAB 2: [천명 연금술 경로 (신사일주 100% 원형 복구 & 60갑자 동적 연동)] */}
        {activeTab === 'alchemy' && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* 1단계: 본질 각성 경로 */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#06151b] via-[#051015] to-[#03060c] border border-emerald-500/40 space-y-5 shadow-[0_10px_35px_rgba(16,185,129,0.15)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-emerald-300 flex items-center gap-2">
                      <span>1단계. 본질 각성 경로</span>
                      <span className="text-[10px] text-emerald-400/80 font-mono font-normal">(Essence Awakening Path)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님의 천명 과업 · 성장 도약대 · 생체 활력 · 영혼의 뿌리 4대 코드
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/40">
                  4 Codes Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myeongsimSequences.essence.map((card: CodeItem) => {
                  const Icon = card.icon;
                  const isExpanded = expandedCard === card.id;

                  return (
                    <div
                      key={card.id}
                      className={`p-4.5 rounded-2xl border transition-all space-y-3.5 ${
                        isExpanded
                          ? 'bg-slate-900/95 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                          : 'bg-slate-900/50 border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => toggleCard(card.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-white">
                              {card.title}
                            </div>
                            <div className="text-[10px] text-emerald-400/90 font-mono font-medium">{card.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <HexagramLines lines={card.hexLines} color="emerald" />
                          <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-gray-400">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed cursor-pointer" onClick={() => toggleCard(card.id)}>
                        "{card.oneLiner}"
                      </p>

                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-2.5 text-xs animate-fade-in">
                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 text-red-200/90 space-y-0.5 cursor-pointer hover:border-red-400 transition-colors"
                          >
                            <strong className="text-red-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>🛡️ 1. 다크코드 (과거의 낡은 보디가드):</span>
                              <span className="text-[9px] text-red-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.darkCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-emerald-200/90 space-y-0.5 cursor-pointer hover:border-emerald-400 transition-colors"
                          >
                            <strong className="text-emerald-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>✨ 2. 뉴럴코드 (천부적 주권 무기):</span>
                              <span className="text-[9px] text-emerald-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.neuralCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-amber-950/30 border border-purple-500/35 text-purple-200 space-y-1 shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <strong className="text-amber-300 block font-mono text-[10px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>3. 메타코드 (제로포인트 초의식):</span>
                              </span>
                              <span className="text-[9px] text-amber-300/80 underline font-sans">명심 효사 보기 ↗</span>
                            </strong>
                            <p className="text-xs font-serif leading-relaxed text-amber-100/90">{card.metaCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'beginner')}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] cursor-pointer hover:opacity-90 transition-all flex items-center justify-between shadow-sm"
                          >
                            <span className="flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                              <strong>💡 초보자용 쉬운 해설 & 감동 에세이 보기:</strong>
                            </span>
                            <span className="text-[9px] underline font-sans shrink-0 ml-2">터치 ↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2단계: 심신 공명 경로 */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1b0a12] via-[#14070d] to-[#03060c] border border-rose-500/40 space-y-5 shadow-[0_10px_35px_rgba(244,63,94,0.15)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-rose-950/60 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-rose-300 flex items-center gap-2">
                      <span>2단계. 심신 공명 경로</span>
                      <span className="text-[10px] text-rose-400/80 font-mono font-normal">(Heart Resonance Path)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님의 공명 자력 · 명철 지성 · 자비 감성 · 영적 주권 4대 코드
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-2.5 py-1 rounded-xl border border-rose-500/40">
                  4 Resonance Codes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myeongsimSequences.resonance.map((card: CodeItem) => {
                  const Icon = card.icon;
                  const isExpanded = expandedCard === card.id;

                  return (
                    <div
                      key={card.id}
                      className={`p-4.5 rounded-2xl border transition-all space-y-3.5 ${
                        isExpanded
                          ? 'bg-slate-900/95 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
                          : 'bg-slate-900/50 border-slate-800/90 hover:border-rose-500/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => toggleCard(card.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-white">
                              {card.title}
                            </div>
                            <div className="text-[10px] text-rose-400/90 font-mono font-medium">{card.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <HexagramLines lines={card.hexLines} color="rose" />
                          <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-gray-400">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-rose-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed cursor-pointer" onClick={() => toggleCard(card.id)}>
                        "{card.oneLiner}"
                      </p>

                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-2.5 text-xs animate-fade-in">
                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 text-red-200/90 space-y-0.5 cursor-pointer hover:border-red-400 transition-colors"
                          >
                            <strong className="text-red-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>🛡️ 1. 다크코드:</span>
                              <span className="text-[9px] text-red-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.darkCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-rose-950/25 border border-rose-500/25 text-rose-200/90 space-y-0.5 cursor-pointer hover:border-rose-400 transition-colors"
                          >
                            <strong className="text-rose-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>✨ 2. 뉴럴코드:</span>
                              <span className="text-[9px] text-rose-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.neuralCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-rose-950/40 to-amber-950/30 border border-rose-500/35 text-rose-200 space-y-1 shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <strong className="text-amber-300 block font-mono text-[10px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>3. 메타코드 (관계의 대자유):</span>
                              </span>
                              <span className="text-[9px] text-amber-300/80 underline font-sans">명심 효사 보기 ↗</span>
                            </strong>
                            <p className="text-xs font-serif leading-relaxed text-amber-100/90">{card.metaCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'beginner')}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-300 font-mono text-[11px] cursor-pointer hover:opacity-90 transition-all flex items-center justify-between shadow-sm"
                          >
                            <span className="flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-rose-400" />
                              <strong>💡 초보자용 쉬운 해설 & 감동 에세이 보기:</strong>
                            </span>
                            <span className="text-[9px] underline font-sans shrink-0 ml-2">터치 ↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3단계: 천명 번영 경로 */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1c1406] via-[#140f04] to-[#03060c] border border-amber-500/45 space-y-5 shadow-[0_10px_35px_rgba(245,158,11,0.2)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-950/60 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.35)]">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                      <span>3단계. 천명 번영 경로</span>
                      <span className="text-[10px] text-amber-400/80 font-mono font-normal">(Sovereign Prosperity Path)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님의 코어 미션 · 협력 생태계 · 시그니처 권위 · 퀀텀 풍요 4대 코드
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/40">
                  4 Wealth Codes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myeongsimSequences.prosperity.map((card: CodeItem) => {
                  const Icon = card.icon;
                  const isExpanded = expandedCard === card.id;

                  return (
                    <div
                      key={card.id}
                      className={`p-4.5 rounded-2xl border transition-all space-y-3.5 ${
                        isExpanded
                          ? 'bg-slate-900/95 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                          : 'bg-slate-900/50 border-slate-800/90 hover:border-amber-500/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => toggleCard(card.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-white">
                              {card.title}
                            </div>
                            <div className="text-[10px] text-amber-400/90 font-mono font-medium">{card.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <HexagramLines lines={card.hexLines} color="amber" />
                          <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-gray-400">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed cursor-pointer" onClick={() => toggleCard(card.id)}>
                        "{card.oneLiner}"
                      </p>

                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-2.5 text-xs animate-fade-in">
                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-red-950/25 border border-red-500/25 text-red-200/90 space-y-0.5 cursor-pointer hover:border-red-400 transition-colors"
                          >
                            <strong className="text-red-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>🛡️ 1. 다크코드:</span>
                              <span className="text-[9px] text-red-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.darkCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/25 text-amber-200/90 space-y-0.5 cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <strong className="text-amber-400 block font-mono text-[10px] flex items-center justify-between">
                              <span>✨ 2. 뉴럴코드:</span>
                              <span className="text-[9px] text-amber-400/80 underline font-sans">심층 분석 열기 ↗</span>
                            </strong>
                            <p className="text-xs">{card.neuralCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'expert')}
                            className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-indigo-950/40 border border-amber-500/40 text-amber-200 space-y-1 shadow-inner cursor-pointer hover:border-amber-400 transition-colors"
                          >
                            <strong className="text-amber-300 block font-mono text-[10px] flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>3. 메타코드 (부와 번영의 완성):</span>
                              </span>
                              <span className="text-[9px] text-amber-300/80 underline font-sans">명심 효사 보기 ↗</span>
                            </strong>
                            <p className="text-xs font-serif leading-relaxed text-amber-100/90">{card.metaCode}</p>
                          </div>

                          <div 
                            onClick={() => openDetailModal(card, 'beginner')}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] cursor-pointer hover:opacity-90 transition-all flex items-center justify-between shadow-sm"
                          >
                            <span className="flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                              <strong>💡 초보자용 쉬운 해설 & 감동 에세이 보기:</strong>
                            </span>
                            <span className="text-[9px] underline font-sans shrink-0 ml-2">터치 ↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* 🌟 TAB 3: [명심 64 뉴럴코드 (Neural 64)] */}
        {activeTab === 'neural64' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/40 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-cyan-300">
                      명심 64 천명 뉴럴코드 아틀라스
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님 ({userIlju}일주)의 12대 활성화 천명 코드(Gold Glow)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-500/40">
                  64 Soul Codes
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs font-mono">
                {Array.from({ length: 64 }, (_, i) => i + 1).map((gate) => {
                  const isActive = (myeongsimSequences.activeGates || [53, 54, 51, 57, 11, 35, 6, 40, 29, 59]).includes(gate);
                  return (
                    <div
                      key={gate}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                          : 'bg-slate-900/40 border-slate-800/80 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <div className="text-[10px]">Code</div>
                      <div className="text-sm font-black">{gate}</div>
                      {isActive && <div className="text-[8px] text-amber-400 mt-0.5">Active</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 🌟 TAB 4: [십성 · 12운성 (Saju 12)] */}
        {activeTab === 'saju12' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-amber-500/40 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-amber-300">
                      십성(十星) & 12운성(十二運星) 심층 에너지
                    </h3>
                    <p className="text-xs text-gray-400">
                      {userName} 님 ({userIlju}일주) 사주 원국의 격국과 생체 에너지 주기
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/40">
                  {userIlju} 고유 에너지
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 font-bold font-mono">🌟 주도 십성 및 천부적 재능</span>
                  <p className="text-gray-300 leading-relaxed">
                    {dayMasterName}의 본질 기운을 바탕으로 확고한 사회적 신뢰와 탁월한 전문성을 발휘하며, 타협하지 않는 깊은 인문학적·영적 지혜를 세상에 전합니다.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <span className="text-emerald-400 font-bold font-mono">🔄 12운성 생체 사이클 & 1순위 초몰입</span>
                  <p className="text-gray-300 leading-relaxed">
                    잡념을 비우고 1순위 핵심 과업에 에너지를 집중할 때 누구도 흉내 낼 수 없는 명작을 만들어내는 강력한 몰입 사이클을 타고났습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
