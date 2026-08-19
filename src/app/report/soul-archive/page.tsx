'use client';

import React, { useState } from 'react';

/* ═══════════════════════════════════════════════════════
   MYEONGSIM SOUL VAULT · 2026 OFFICIAL ARCHIVE
   소울 아카이브 - 80P VIP Report
   (2026 럭셔리 다크 에메랄드 & 골드 에디션)
   ═══════════════════════════════════════════════════════ */

// 주역 6효선 바 그래픽 (양효: 이어진 선, 음효: 가운데 끊어진 선)
// lines: 6개 배열 (1: 양효, 0: 음효) 위에서 아래(효6 -> 효1)
interface HexagramGraphicProps {
  lines: number[]; // [효6, 효5, 효4, 효3, 효2, 효1]
  isActive?: boolean;
}

function HexagramGraphic({ lines = [1, 1, 0, 1, 0, 0], isActive = true }: HexagramGraphicProps) {
  return (
    <div className="flex flex-col gap-[3px] py-1">
      {lines.map((isYang, idx) => (
        <div key={idx} className="flex items-center justify-center gap-[3px]">
          {isYang === 1 ? (
            // 양효 (─)
            <div
              className={`h-[3px] w-[26px] rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                  : 'bg-emerald-800/50'
              }`}
            />
          ) : (
            // 음효 (-- --)
            <>
              <div
                className={`h-[3px] w-[11px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                    : 'bg-emerald-800/50'
                }`}
              />
              <div
                className={`h-[3px] w-[11px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                    : 'bg-emerald-800/50'
                }`}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// 괘 카드 데이터 인터페이스
interface HexagramCardData {
  code: string;
  name: string;
  hanja: string;
  subtitle: string;
  subtitleEn?: string;
  icon: string;
  quote: string;
  hexLines: number[];
  darkCode: {
    title: string;
    description: string;
  };
  neuralCode: {
    description: string;
  };
  metaCode: {
    label: string;
    title: string;
    titleEn: string;
    description: string;
  };
  solution: string;
  deepAnalysis: {
    essence: string;
    sajuAlignment: string;
    alchemicalKey: string;
  };
}

interface SequenceSection {
  id: string;
  stepNum: string;
  title: string;
  titleEn: string;
  subtitle: string;
  codesActiveCount: number;
  cards: HexagramCardData[];
}

const SEQUENCE_DATA: SequenceSection[] = [
  {
    id: 'seq-1',
    stepNum: '1단계',
    title: '본질 각성 시퀀스',
    titleEn: 'Essence Awakening',
    subtitle: '나의 본질 · 성장 계기 · 내면 동력 · 근본 뿌리를 관통하는 4대 축',
    codesActiveCount: 4,
    cards: [
      {
        code: '53.1',
        name: '풍산점',
        hanja: '風山漸',
        subtitle: '의식의 태양 · 천명 방향',
        subtitleEn: 'Solar Consciousness',
        icon: '☀️',
        quote: '"차근차근 계단을 밟아가는 점진적 완성의 미학"',
        hexLines: [1, 1, 0, 1, 0, 0], // 손상간하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '조급증, 단숨에 결과를 보려는 완벽주의 강박',
        },
        neuralCode: {
          description: '작은 성취를 벽돌처럼 차곡차곡 쌓아올려 흔들리지 않는 거대한 제국을 완성하는 점진적 지혜',
        },
        metaCode: {
          label: '점진적 완성의 미학',
          title: '점진적 완성',
          titleEn: 'Gradual Mastery',
          description: '서두르지 않고 한 걸음씩 쌓아가는 당신만의 속도가 곧 우주에서 가장 빠르고 견고한 천명의 리듬입니다.',
        },
        solution: '오늘 완성할 수 있는 가장 작은 단위의 성취에 집중하고, 그 과정 자체의 완결성을 온전히 자축하세요.',
        deepAnalysis: {
          essence: '점(漸)은 점진적으로 나아감을 뜻합니다. 기러기가 물가에서 바위로, 언덕으로, 마침내 하늘 높이 날아오르듯 순서와 절차를 밟아 최고봉에 오르는 형상입니다.',
          sajuAlignment: '신금(辛金) 일간의 정교한 보석 같은 심미안과 미월(未月) 토생금(土生金)의 단단한 지지 기반이 결합하여, 한 번 뿌리내리면 결코 무너지지 않는 명품 성취를 이룹니다.',
          alchemicalKey: '조급함을 내려놓는 순간, 시간은 당신을 쫓기는 자에서 가장 우아한 지배자로 변환시킵니다.',
        },
      },
      {
        code: '54.1',
        name: '뇌택귀매',
        hanja: '雷澤歸妹',
        subtitle: '의식의 지구 · 성장 도약대',
        subtitleEn: 'Growth Catalyst',
        icon: '🌐',
        quote: '"순리와 분수를 지키며 내 자리를 다질 때 일어나는 도약"',
        hexLines: [0, 0, 1, 0, 1, 1], // 진상태하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '타인의 인정과 시선에 얽매여 내 진짜 가치를 증명하려는 피로한 애씀',
        },
        neuralCode: {
          description: '주어진 위치에서 묵묵히 내공을 채우며, 결정적 타이밍에 세상의 중심부로 도약하는 지혜',
        },
        metaCode: {
          label: '내실의 도약대',
          title: '자리매김의 도약',
          titleEn: 'Positional Sovereignty',
          description: '남의 속도나 기준에 휘둘리지 않고 내 고유한 자리를 지킬 때 우주의 모든 조력이 나를 향해 정렬합니다.',
        },
        solution: '외부 평가에 반응하는 에너지를 즉시 회수하여 오직 나의 본질적 역량을 연마하는 데 재투자하세요.',
        deepAnalysis: {
          essence: '귀매(歸妹)는 뜻을 품고 새로운 터전으로 들어가는 여정입니다. 초기의 겸양과 분수를 지키는 지혜가 훗날 가장 강력한 주권으로 환원됩니다.',
          sajuAlignment: '신사(辛巳) 일주의 정관(巳火)과 사화 속 병화(丙火)의 빛이 당신을 언제나 품격 있는 리더의 자리에 세웁니다.',
          alchemicalKey: '스스로를 증명하려 하지 않아도 이미 당신은 완전한 가치를 품고 있습니다.',
        },
      },
      {
        code: '51.3',
        name: '중뢰진',
        hanja: '重雷震',
        subtitle: '의식의 번개 · 각성 트리거',
        subtitleEn: 'Awakening Thunder',
        icon: '⚡',
        quote: '"충격과 진동 속에서 깨어나는 각성의 번개"',
        hexLines: [0, 0, 1, 0, 0, 1], // 진상진하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '예기치 못한 돌발 상황이나 위기 앞에서 지나치게 방어적으로 움츠러드는 관성',
        },
        neuralCode: {
          description: '외부의 충격을 낡은 시스템을 단숨에 부수고 새로운 차원으로 도약하는 각성의 기폭제로 전환',
        },
        metaCode: {
          label: '각성의 벼락',
          title: '천둥의 각성',
          titleEn: 'Thunder Awakening',
          description: '과거 나를 흔들었던 수많은 시련들은 파괴가 아니라 오직 내 안의 거인을 깨우기 위한 우주의 거대한 알람이었습니다.',
        },
        solution: '불안이 엄습할 때 가슴에 손을 얹고 깊은 호흡으로 "이것은 내 영혼의 새로운 차원 도약 신호다"라고 선언하세요.',
        deepAnalysis: {
          essence: '진(震)은 우레와 천둥의 에너지를 의미합니다. 백 리 밖까지 진동이 울려 퍼지지만, 군자는 제사를 지낼 때 술잔을 떨어뜨리지 않는 평정심을 유지합니다.',
          sajuAlignment: '신금의 날카롭고 명민한 직관이 벼락의 순간에 가장 명확한 판단과 돌파구를 찾아냅니다.',
          alchemicalKey: '진동의 한가운데서 고요를 유지할 때 세상 모든 혼란이 당신의 권능 앞에 정렬합니다.',
        },
      },
      {
        code: '57.3',
        name: '손위풍',
        hanja: '巽爲風',
        subtitle: '의식의 바람 · 침투력',
        subtitleEn: 'Gentle Infiltration',
        icon: '🍃',
        quote: '"바람처럼 스며드는 부드럽지만 강력한 영향력"',
        hexLines: [1, 1, 0, 1, 1, 0], // 손상손하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '생각의 과부하로 결정을 망설이며 바람에 흔들리는 나뭇잎처럼 에너지를 소진하는 정체',
        },
        neuralCode: {
          description: '강압적인 통제가 아닌, 부드러운 침투와 감화력으로 상대의 무의식까지 변화시키는 유연한 리더십',
        },
        metaCode: {
          label: '부드러운 영향력',
          title: '유연한 침투',
          titleEn: 'Gentle Mastery',
          description: '바람은 형태가 없으나 모든 틈새를 채우듯, 당신의 선한 의도와 지혜는 세상의 모든 저항을 자연스럽게 녹여냅니다.',
        },
        solution: '힘으로 밀어붙이지 말고, 상대의 마음에 따뜻한 질문과 공감의 바람으로 조용히 다가가세요.',
        deepAnalysis: {
          essence: '손(巽)은 엎드림과 바람의 스며듦을 상징합니다. 끊임없이 불어오는 부드러운 바람이 바위마저 깎아내듯 끈기 있는 영향력을 나타냅니다.',
          sajuAlignment: '미월의 조열함을 식혀주는 서늘한 금풍(金風)처럼, 당신의 존재는 사람들에게 맑은 쉼과 해답을 제공합니다.',
          alchemicalKey: '부드러움은 약함이 아니며, 가장 깊은 곳까지 닿을 수 있는 최고의 지혜입니다.',
        },
      },
    ],
  },
  {
    id: 'seq-2',
    stepNum: '2단계',
    title: '심신 공명 시퀀스',
    titleEn: 'Mind-Body Resonance',
    subtitle: '감정 · 건강 · 관계 · 에너지의 균형을 회복하는 4대 주파수',
    codesActiveCount: 4,
    cards: [
      {
        code: '11.6',
        name: '지천태',
        hanja: '地天泰',
        subtitle: '최고의 평화 · 소통과 조화',
        subtitleEn: 'Supreme Harmony',
        icon: '🏔️',
        quote: '"하늘과 땅이 완벽하게 소통하는 최고의 태평성대"',
        hexLines: [0, 0, 0, 1, 1, 1], // 곤상건하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '현재의 안락함에 갇혀 다가오는 변화의 신호를 감지하지 못하는 안주',
        },
        neuralCode: {
          description: '음과 양, 높은 곳과 낮은 곳이 막힘없이 순환하며 일궈내는 무결점의 조화와 번영',
        },
        metaCode: {
          label: '태평성대의 조화',
          title: '태평 공명',
          titleEn: 'Grand Harmony',
          description: '내면의 생각과 감정이 완벽하게 합치될 때 삶의 모든 영역에서 저절로 풍요가 넘쳐흐릅니다.',
        },
        solution: '지금 누리고 있는 일상의 평안에 깊은 감사를 보내며, 열린 마음으로 새로운 성장의 흐름을 맞이하세요.',
        deepAnalysis: {
          essence: '태(泰)는 하늘의 기운은 내려오고 땅의 기운은 올라가 서로 만나 교합하는 최고의 길상입니다. 만물이 번성하고 생명력이 극대화됩니다.',
          sajuAlignment: '신사일주의 지장간 병화와 무토가 일간 신금과 균형을 이루어 심신의 안정을 완벽히 뒷받침합니다.',
          alchemicalKey: '조화는 만들어내는 것이 아니라, 내면의 저항을 내려놓을 때 자연스럽게 흐르는 본래의 상태입니다.',
        },
      },
      {
        code: '35.6',
        name: '화지진',
        hanja: '火地晉',
        subtitle: '태양의 약진 · 명덕의 승진',
        subtitleEn: 'Solar Ascendance',
        icon: '🌅',
        quote: '"태양이 대지 위로 떠오르듯 밝고 당당한 전진"',
        hexLines: [1, 0, 1, 0, 0, 0], // 리상곤하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '성과를 서두르다 주변 사람들의 보폭을 배려하지 못하는 독주의 위험',
        },
        neuralCode: {
          description: '맑은 덕성을 세상에 비추며, 주변 사람들을 함께 이끌고 당당하게 승진하는 지도자의 길',
        },
        metaCode: {
          label: '광명의 전진',
          title: '밝은 전진',
          titleEn: 'Luminous Advance',
          description: '빛을 감추지 않고 온전히 드러낼 때 세상은 당신에게 마땅한 보상과 명예를 선사합니다.',
        },
        solution: '당신의 지혜와 성과를 아낌없이 공유하여 주변 동료들의 성공을 돕는 멘토가 되어주세요.',
        deepAnalysis: {
          essence: '진(晉)은 나아감과 번영을 뜻합니다. 밝은 해가 대지 위로 높이 솟아올라 온 세상을 따스하게 비추는 제왕의 상입니다.',
          sajuAlignment: '미월의 열기를 지혜로운 빛으로 승화시켜 사회적 권위와 영향력을 극대화합니다.',
          alchemicalKey: '참된 전진은 나 혼자의 승리가 아니라, 모두를 환하게 비추는 태양의 자애로움입니다.',
        },
      },
      {
        code: '6.6',
        name: '천수송',
        hanja: '天水訟',
        subtitle: '갈등 해결 · 지혜의 중재',
        subtitleEn: 'Wise Mediation',
        icon: '⚖️',
        quote: '"갈등을 지혜로 풀어내는 최고의 화해 기술"',
        hexLines: [1, 1, 1, 0, 1, 0], // 건상감하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '시시비비를 가리느라 소중한 인간관계와 에너지를 소모시키는 논쟁의 늪',
        },
        neuralCode: {
          description: '승패의 게임을 초월하여 모두가 윈윈(Win-Win)할 수 있는 솔로몬의 중재 지혜 발휘',
        },
        metaCode: {
          label: '갈등의 연금술',
          title: '화해와 중재',
          titleEn: 'Conflict Alchemy',
          description: '갈등은 관계의 파괴가 아니라, 서로의 다름을 이해하고 더 깊은 신뢰를 쌓기 위한 축복의 전환점입니다.',
        },
        solution: '옳고 그름을 증명하려 하지 말고, "상대방의 진짜 두려움과 욕구는 무엇인가"를 먼저 경청하세요.',
        deepAnalysis: {
          essence: '송(訟)은 다툼과 소송을 뜻하지만, 지혜로운 자는 끝까지 다투지 않고 중도를 지켜 화해로 이끕니다.',
          sajuAlignment: '신금의 정밀한 분석력과 사화의 명석함이 복잡하게 얽힌 이해관계를 명쾌하게 풀어냅니다.',
          alchemicalKey: '이기는 것보다 위대한 것은 상대를 품어 다툼 자체를 녹여버리는 포용력입니다.',
        },
      },
      {
        code: '40.2',
        name: '뇌수해',
        hanja: '雷水解',
        subtitle: '최종 퀀텀 보상',
        subtitleEn: 'Quantum Reward',
        icon: '👑',
        quote: '"사람들을 속박에서 해방시키는 솔루션으로 얻는 최고의 풍요"',
        hexLines: [0, 0, 1, 0, 1, 0], // 진상감하
        darkCode: {
          title: '1. 다크코드',
          description: '돈과 성과에 집착하다 정작 내 건강과 영혼의 평화를 잃는 위험',
        },
        neuralCode: {
          description: '물질적 번영과 영적 자유가 완벽하게 일치하는 풍요의 완성',
        },
        metaCode: {
          label: '부와 번영의 완성',
          title: '퀀텀풍요',
          titleEn: 'Quantum Abundance',
          description: '영적 대자유와 현실적 번영이 완전한 일치를 이루는 축복',
        },
        solution: '확보된 부와 에너지를 다시 나만의 불가침 안식처에 보관하세요.',
        deepAnalysis: {
          essence: '해(解)는 매듭이 풀리고 봄눈이 녹아내리듯 모든 난관이 해소되는 해방의 괘입니다. 봄비와 천둥이 함께 쳐 대지가 소생합니다.',
          sajuAlignment: '신사일주의 긴장감이 완전히 풀리며 편안한 상태에서 자연스러운 재물과 명예가 샘솟습니다.',
          alchemicalKey: '해방된 영혼만이 진정한 무한 번영을 누릴 수 있는 우주의 자격을 갖춥니다.',
        },
      },
    ],
  },
  {
    id: 'seq-3',
    stepNum: '3단계',
    title: '천명 번영 시퀀스',
    titleEn: 'Destiny Prosperity',
    subtitle: '부 · 성공 · 사명 · 유산의 최종 통합과 번영의 4대 열쇠',
    codesActiveCount: 4,
    cards: [
      {
        code: '29.2',
        name: '중수감',
        hanja: '重水坎',
        subtitle: '깊은 용기 · 위험 돌파',
        subtitleEn: 'Courageous Breakthrough',
        icon: '🌊',
        quote: '"깊은 물을 두 번 건너는 담대한 용기의 여정"',
        hexLines: [0, 1, 0, 0, 1, 0], // 감상감하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '위험을 두려워하여 안전지대에만 머물다 소중한 천명의 기회를 흘려보내는 방어벽',
        },
        neuralCode: {
          description: '어떤 험난한 고난도 물처럼 유연하게 형태를 바꾸며 바위를 뚫고 바다로 나아가는 돌파력',
        },
        metaCode: {
          label: '담대한 심연의 용기',
          title: '용기의 심연',
          titleEn: 'Abyss of Courage',
          description: '가장 깊은 어둠과 두려움을 직면할 때 당신의 영혼은 가장 찬란한 황금을 캐낼 수 있습니다.',
        },
        solution: '지금 망설이고 있는 가장 중요한 한 가지 결정을 용기 있게 실행으로 옮기세요.',
        deepAnalysis: {
          essence: '감(坎)은 험난함과 물의 흐름입니다. 멈추지 않고 흘러 웅덩이를 채우고 마침내 대해(大海)에 이르는 끊임없는 정진을 뜻합니다.',
          sajuAlignment: '조열한 사주 원국에 감수(坎水)의 시원한 생명수가 흘러들어 완벽한 수화기제(水火旣濟)를 완성합니다.',
          alchemicalKey: '두려움의 바닥을 칠 때 당신은 그 어떤 시련도 당신을 삼킬 수 없음을 깨닫게 됩니다.',
        },
      },
      {
        code: '59.1',
        name: '풍수환',
        hanja: '風水渙',
        subtitle: '막힘 해소 · 새 흐름',
        subtitleEn: 'Flow Liberation',
        icon: '💨',
        quote: '"막힌 기운을 흩어 새로운 흐름을 여는 해방의 바람"',
        hexLines: [1, 1, 0, 0, 1, 0], // 손상감하
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '과거의 집착과 미련을 놓지 못해 새로운 운의 유입을 가로막는 에너지 정체',
        },
        neuralCode: {
          description: '묵은 감정과 낡은 관계의 매듭을 시원하게 흩어버리고 맑은 생명력을 회복하는 해소의 힘',
        },
        metaCode: {
          label: '새로운 흐름의 개척',
          title: '흐름의 해방',
          titleEn: 'Flow Liberation',
          description: '비워내고 흩어버릴 때 비로소 더 거대하고 새로운 번영의 기회가 당신의 삶으로 쏟아집니다.',
        },
        solution: '더 이상 내 영혼을 살리지 못하는 낡은 물건, 생각, 관계 중 하나를 오늘 명쾌하게 정리하세요.',
        deepAnalysis: {
          essence: '환(渙)은 흩어짐과 해소입니다. 얼어붙은 얼음이 봄바람을 만나 녹아내려 넓은 바다로 흘러가는 시원한 형상입니다.',
          sajuAlignment: '신금의 예리한 결단력으로 불필요한 군더더기를 털어내어 가벼운 몸과 마음으로 비상합니다.',
          alchemicalKey: '비움은 상실이 아니라, 더 웅장한 채움을 맞이하기 위한 성스러운 공간 창조입니다.',
        },
      },
      {
        code: '53.1',
        name: '풍산점',
        hanja: '風山漸',
        subtitle: '순환적 완성 · 나선형 상승',
        subtitleEn: 'Spiral Mastery',
        icon: '🔄',
        quote: '"다시 한번 점진적 완성의 순환이 시작되는 새벽"',
        hexLines: [1, 1, 0, 1, 0, 0],
        darkCode: {
          title: '다크코드 (과거의 낡은 보디가드)',
          description: '끝없는 성장의 압박감에 스스로를 다그치며 번아웃을 부르는 무리한 가속',
        },
        neuralCode: {
          description: '삶은 원형의 반복이 아니라 한 차원 더 높은 곳을 향해 올라가는 나선형 상승임을 신뢰',
        },
        metaCode: {
          label: '영원한 나선형 상승',
          title: '나선형 상승',
          titleEn: 'Spiral Evolution',
          description: '당신이 지나온 모든 발자국은 단 하나도 헛되지 않았으며, 모두 위대한 통합의 계단이었습니다.',
        },
        solution: '지금까지 걸어온 길을 돌아보며 나 자신의 끈기와 성숙함에 깊은 경의를 표하세요.',
        deepAnalysis: {
          essence: '점(漸)의 재등장은 완성이 끝이 아니라 더 큰 세상과의 합일로 나아가는 새로운 시작임을 알립니다.',
          sajuAlignment: '신금의 완벽함이 시간의 흐름과 만나 영원히 퇴색하지 않는 다이아몬드로 완성됩니다.',
          alchemicalKey: '당신의 여정은 영원한 나선형 축복 속에서 나날이 깊어지고 빛납니다.',
        },
      },
      {
        code: '40.2',
        name: '뇌수해',
        hanja: '雷水解',
        subtitle: '최종 해방 · 천명의 완성',
        subtitleEn: 'Destiny Fulfilled',
        icon: '🏆',
        quote: '"모든 속박으로부터의 최종 해방, 천명의 완성"',
        hexLines: [0, 0, 1, 0, 1, 0],
        darkCode: {
          title: '1. 다크코드',
          description: '돈과 성과에 집착하다 정작 내 건강과 영혼의 평화를 잃는 위험',
        },
        neuralCode: {
          description: '물질적 번영과 영적 자유가 완벽하게 일치하는 풍요의 완성',
        },
        metaCode: {
          label: '부와 번영의 완성',
          title: '퀀텀풍요',
          titleEn: 'Quantum Abundance',
          description: '영적 대자유와 현실적 번영이 완전한 일치를 이루는 축복',
        },
        solution: '확보된 부와 에너지를 다시 나만의 불가침 안식처에 보관하세요.',
        deepAnalysis: {
          essence: '해(解)의 완성은 내면의 모든 의심과 결핍감이 눈 녹듯 사라지고 순수한 주권자로 거듭남을 뜻합니다.',
          sajuAlignment: '신사일주 강미숙 님의 사주 원국이 품은 최상의 잠재력이 현실의 물질적 풍요와 정신적 자유로 100% 실현됩니다.',
          alchemicalKey: '축하합니다. 당신은 이제 당신 삶의 명실상부한 마스터이자 연금술사입니다.',
        },
      },
    ],
  },
];

const TAB_ITEMS = [
  { id: 'essence', label: '당신의 본질', icon: '🧭' },
  { id: 'alchemy', label: '천명 연금술 경로', icon: '✨' },
  { id: 'neural', label: '명심 64 뉴럴코드', icon: '⚡' },
  { id: 'stars', label: '십성 · 12운성', icon: '🛡️' },
];

export default function SoulArchivePage() {
  const [activeTab, setActiveTab] = useState<string>('alchemy');
  // 기본적으로 53.1과 40.2는 펼쳐둠 (스크린샷 상태와 일치)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'seq-1-53.1-풍산점': true,
    'seq-2-40.2-뇌수해': true,
    'seq-3-40.2-뇌수해': true,
  });

  // 심층 모달 팝업 상태
  const [selectedModalCard, setSelectedModalCard] = useState<HexagramCardData | null>(null);
  // 토스트 알림 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleCard = (cardKey: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 VIP 리포트 주소가 클립보드에 복사되었습니다.');
    }
  };

  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#050912] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ── 토스트 알림 ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-sm shadow-[0_0_30px_rgba(52,211,153,0.3)] backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* ── AI Deep Alchemical Reading 모달 팝업 ── */}
      {selectedModalCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedModalCard(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#09101d] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(52,211,153,0.15)]"
            onClick={e => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedModalCard(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center text-lg transition-all"
            >
              ✕
            </button>

            {/* 모달 헤더 */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider">
                <span>🔮 AI DEEP ALCHEMICAL READING</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl">{selectedModalCard.icon}</div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {selectedModalCard.code} {selectedModalCard.name} ({selectedModalCard.hanja})
                  </h2>
                  <p className="text-emerald-400 text-sm">{selectedModalCard.subtitle}</p>
                </div>
              </div>
            </div>

            {/* 본문 3대 섹션 */}
            <div className="space-y-4">
              {/* 1. 괘의 본질 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-emerald-500/20 space-y-2">
                <div className="text-xs font-bold text-emerald-400 tracking-wider">
                  📖 주역 64괘 원문 효사 & 괘의 본질
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedModalCard.deepAnalysis.essence}
                </p>
              </div>

              {/* 2. 사주 원국 정합성 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-violet-500/20 space-y-2">
                <div className="text-xs font-bold text-violet-400 tracking-wider">
                  🧬 사주 원국 1:1 맞춤 정합성 (신사(辛巳)일주 · 未月)
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedModalCard.deepAnalysis.sajuAlignment}
                </p>
              </div>

              {/* 3. 연금술 열쇠 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/30 space-y-2">
                <div className="text-xs font-bold text-amber-400 tracking-wider">
                  👑 천명 연금술 마스터 키
                </div>
                <p className="text-sm text-amber-100/90 leading-relaxed font-medium">
                  {selectedModalCard.deepAnalysis.alchemicalKey}
                </p>
              </div>
            </div>

            {/* 모달 하단 버튼 */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedModalCard(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold hover:from-emerald-500 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          상단 마스터 헤더 (스크린샷 1과 100% 일치)
          ═══════════════════════════════════════════════════════ */}
      <header className="relative border-b border-white/[0.07] bg-[#070d18]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
          {/* 상단 뱃지 & 액션 버튼 행 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* MYONGSIM SOUL VAULT 뱃지 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] w-fit">
              <span className="text-amber-400 text-xs">👑</span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.18em] text-amber-300">
                MYONGSIM SOUL VAULT · 2026 OFFICIAL ARCHIVE
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            {/* 우측 공유 / PDF 버튼 */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/80 text-xs font-medium transition-all"
              >
                <span>🔗</span>
                <span>공유</span>
              </button>
              <button
                onClick={handlePrintPdf}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)]"
              >
                <span>📥</span>
                <span>PDF 리포트 보관</span>
              </button>
            </div>
          </div>

          {/* 소울 아카이브 타이틀 & 80P VIP Report 뱃지 */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              소울 아카이브
            </h1>
            <div className="px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-950/80 to-amber-900/60 border border-amber-500/40 text-amber-300 text-[11px] font-bold tracking-wider shadow-sm">
              80P VIP Report
            </div>
          </div>

          {/* 수신인 / 일주 / 생년월일 메타 라인 */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 flex-wrap">
            <span>
              수신인: <strong className="text-amber-300 font-semibold">강미숙</strong> 님
            </span>
            <span className="text-slate-600 font-light">|</span>
            <span>
              일주: <strong className="text-emerald-400 font-semibold">신 (금) (신사(辛巳)일주 · 未月)</strong>
            </span>
            <span className="text-slate-600 font-light">|</span>
            <span>
              생년월일: <strong className="text-cyan-400 font-semibold">1972-06-20</strong>
            </span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          4대 캡슐 탭 네비게이션
          ═══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-30 bg-[#050912]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 py-3 overflow-x-auto no-scrollbar">
            {TAB_ITEMS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]'
                      : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          메인 바디 콘텐츠
          ═══════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* ── 1. 천명 연금술 경로 / 당신의 본질 탭 ── */}
        {(activeTab === 'alchemy' || activeTab === 'essence') && (
          <div className="space-y-12">
            {SEQUENCE_DATA.map(sequence => (
              <section key={sequence.id} className="space-y-6">
                {/* 시퀀스 헤더 바 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/40 to-transparent border border-emerald-500/20">
                  <div className="flex items-center gap-3.5">
                    {/* 에메랄드 원형 아이콘 */}
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg flex-shrink-0">
                      ☀️
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                        <span>
                          {sequence.stepNum}. {sequence.title}
                        </span>
                        <span className="text-xs text-emerald-400/80 font-normal">
                          ({sequence.titleEn})
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">{sequence.subtitle}</p>
                    </div>
                  </div>

                  {/* 우측 4 Codes Active 뱃지 */}
                  <div className="px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold w-fit">
                    {sequence.codesActiveCount} Codes Active
                  </div>
                </div>

                {/* 2열 가로 카드 그리드 (스크린샷 1 & 2 100% 반영) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {sequence.cards.map(card => {
                    const cardKey = `${sequence.id}-${card.code}-${card.name}`;
                    const isExpanded = !!expandedCards[cardKey];

                    return (
                      <div
                        key={cardKey}
                        className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${
                          isExpanded
                            ? 'bg-[#080e1a] border-emerald-500/40 shadow-[0_0_30px_rgba(52,211,153,0.08)]'
                            : 'bg-[#070c16] border-white/[0.08] hover:border-white/[0.15]'
                        }`}
                      >
                        {/* ── 카드 헤더 (클릭 시 아코디언 토글) ── */}
                        <div
                          onClick={() => toggleCard(cardKey)}
                          className="p-5 sm:p-6 cursor-pointer select-none space-y-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              {/* 원형 아이콘 */}
                              <div className="w-10 h-10 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-lg flex-shrink-0">
                                {card.icon}
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                  {card.code} {card.name} ({card.hanja})
                                </h3>
                                <p className="text-xs text-emerald-400 font-medium">
                                  {card.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* 우측 6효선 그래픽 + 접기/펼치기 화살표 버튼 */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <HexagramGraphic lines={card.hexLines} isActive={isExpanded} />
                              <button
                                type="button"
                                className={`w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 text-xs transition-all ${
                                  isExpanded ? 'text-emerald-400 border-emerald-500/30' : ''
                                }`}
                              >
                                {isExpanded ? '▲' : '▼'}
                              </button>
                            </div>
                          </div>

                          {/* 인용구 */}
                          <p className="text-xs sm:text-sm text-slate-300/90 font-medium leading-relaxed italic pl-1">
                            {card.quote}
                          </p>
                        </div>

                        {/* ── 카드 펼침 상세 영역 (스크린샷 2 100% 일치) ── */}
                        {isExpanded && (
                          <div className="px-5 sm:px-6 pb-6 pt-1 space-y-3.5 border-t border-white/[0.04] animate-in fade-in duration-300">
                            {/* 1. 다크코드 (레드-버건디 박스) */}
                            <div className="p-4 rounded-xl bg-[#1b0e14] border border-red-900/40 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                                  <span>🛡️</span>
                                  <span>1. 다크코드:</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setSelectedModalCard(card);
                                  }}
                                  className="text-[11px] text-rose-300/70 hover:text-rose-200 underline flex items-center gap-1 transition-colors"
                                >
                                  <span>심층 분석 열기</span>
                                  <span>↗</span>
                                </button>
                              </div>
                              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal">
                                {card.darkCode.description}
                              </p>
                            </div>

                            {/* 2. 뉴럴코드 (앰버/브라운 박스) */}
                            <div className="p-4 rounded-xl bg-[#1a130c] border border-amber-900/40 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                                <span>✨</span>
                                <span>2. 뉴럴코드:</span>
                              </div>
                              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-normal">
                                {card.neuralCode.description}
                              </p>
                            </div>

                            {/* 3. 메타코드 (골드 앰버 박스) */}
                            <div className="p-4 rounded-xl bg-[#1b1509] border border-amber-600/40 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                                <span>✨</span>
                                <span>3. 메타코드 ({card.metaCode.label}):</span>
                              </div>
                              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                                <strong className="text-amber-300 font-bold">
                                  【{card.metaCode.title} ({card.metaCode.titleEn})】
                                </strong>{' '}
                                {card.metaCode.description}
                              </p>
                            </div>

                            {/* 4. 천명 번영 실행 솔루션 (올리브/차콜 박스) */}
                            <div className="p-4 rounded-xl bg-[#121512] border border-emerald-900/30 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                <span>👉</span>
                                <span>천명 번영 실행 솔루션:</span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {card.solution}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ── 2. 명심 64 뉴럴코드 탭 ── */}
        {activeTab === 'neural' && (
          <div className="space-y-6">
            <div className="text-center py-12 space-y-4 max-w-xl mx-auto">
              <div className="text-5xl">⚡</div>
              <h2 className="text-2xl font-bold text-white">명심 64 뉴럴코드 마스터 맵</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                주역 64괘의 고유 주파수와 현대 인지신경과학의 뇌 가소성 이론을 결합한 64차원 의식
                뉴럴 네트워크입니다.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {Array.from({ length: 64 }, (_, i) => i + 1).map(num => (
                <div
                  key={num}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all cursor-pointer group"
                >
                  <div className="text-[10px] text-slate-500 group-hover:text-emerald-400">
                    CODE {num}
                  </div>
                  <div className="text-xs font-bold text-slate-300 mt-1 group-hover:text-white">
                    {num === 53
                      ? '풍산점'
                      : num === 54
                      ? '뇌택귀매'
                      : num === 51
                      ? '중뢰진'
                      : num === 57
                      ? '손위풍'
                      : num === 11
                      ? '지천태'
                      : num === 35
                      ? '화지진'
                      : num === 6
                      ? '천수송'
                      : num === 40
                      ? '뇌수해'
                      : `괘 ${num}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. 십성 · 12운성 탭 ── */}
        {activeTab === 'stars' && (
          <div className="space-y-6">
            <div className="text-center py-12 space-y-4 max-w-xl mx-auto">
              <div className="text-5xl">🛡️</div>
              <h2 className="text-2xl font-bold text-white">십성(十星) & 12운성 에너지 매트릭스</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                강미숙 님의 사주 원국 (신사일주 · 미월)에 잠재된 10대 생명 에너지와 시기별 운성
                주기 분석표입니다.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-3">
                <div className="text-amber-400 text-sm font-bold">⭐ 주요 십성 구조</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  신금(辛金) 일간을 중심으로 일지의 정관(巳火)과 월지의 편인(未土)이 형성하는
                  관인상생(官印相生)의 고결한 품격과 학문적 깊이.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-emerald-500/20 space-y-3">
                <div className="text-emerald-400 text-sm font-bold">🌊 12운성 에너지 주기</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  사화(巳火)의 사(死)궁은 죽음이 아닌 고도의 집중과 몰입을 뜻하며, 미토(未土)의
                  쇠(衰)궁은 완숙한 원로의 지혜로 세상에 이바지함을 의미합니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════
          푸터
          ═══════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] bg-[#03060c] py-8 text-center text-xs text-slate-500 tracking-widest space-y-2">
        <div>MYEONGSIM SOUL VAULT · 2026 OFFICIAL ARCHIVE</div>
        <div className="text-[10px] text-slate-600">
          본 리포트는 명심코칭 AI 연금술 엔진에 의해 개인화 발행된 80P VIP 공식 아카이브입니다.
        </div>
      </footer>
    </div>
  );
}
