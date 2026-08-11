'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ADVANCED_COACHING_DB, AdvancedCoachingData } from '../../data/AdvancedCoachingDB';

interface Props {
  dayStem?: string;
  userName?: string;
}

export default function SocialAntiPatternAnalysis({ dayStem, userName = '사용자' }: Props) {
  const [selectedModalItem, setSelectedModalItem] = useState<{
    key: string;
    title: string;
    category: string;
    introMetaphor: string;
    essayParagraphs: string[];
    actionSteps: string[];
  } | null>(null);

  const [isModalUnlocked, setIsModalUnlocked] = useState(false);
  const [isAllPassUnlocked, setIsAllPassUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

    const openCoachingModal = (key: string, title: string) => {
    const isMok = dayStem === '甲' || dayStem === '乙';
    const name = dayStem === '甲' ? '甲木(갑목) 선구자' : dayStem === '乙' ? '乙木(을목) 연결자' : '명심 아키텍트';

    let category = '3단계 각성 코드';
    let introMetaphor = `"${name} 대표님, 홀로 모든 바람을 막아서던 가뭄 속 거목의 지친 잎사귀를 기억하십니까? 초보자도 1초 만에 깨닫는 자연 물상 메타포로 명확하게 풀어드립니다."`;
    let essayParagraphs: string[] = [];
    let actionSteps: string[] = [];

    if (key === 'CBT') {
      category = 'CBT 인지행동 코칭 (생각의 유연함 회복)';
      introMetaphor = `"${name} 대표님, '나 혼자 올바르고 나만 잘해야 한다'는 외로운 완벽주의에 가슴이 답답했던 순간을 기억하십니까?"`;
      essayParagraphs = [
        `혼자 모든 것을 도맡아 해야만 안심되던 마음은 대표님이 부족해서가 아니라, 스스로를 안전하게 보호하려 애쓰던 따뜻한 내면의 파수꾼이 만든 생각입니다.`,
        `하지만 '내 방식만이 100% 정답이다'라는 엄격한 틀을 내려놓을 때, 비로소 주변 사람들의 지혜와 헌신이 당신의 비전을 가꾸는 맑은 샘물처럼 흘러 들어옵니다.`,
        `이제 '내가 다 해결해야 해'라는 무거운 부담 내려놓기를 허용해 주세요. 세상의 다른 방식도 당신의 꿈을 훌륭하게 완성해 줄 수 있습니다.`
      ];
      actionSteps = [
        `1단계 [알아차림]: "나 혼자 다 해야 해"라는 생각이 들 때 3초간 깊이 호흡하며 마음 가다듬기`,
        `2단계 [수용]: "상대방의 방식도 80% 이상 훌륭할 수 있다"고 따뜻하게 인정해주기`,
        `3단계 [실천]: 작은 역할 하나를 주변 파트너에게 웃으며 기꺼이 부탁해보기`
      ];
    } else if (key === 'MBCT') {
      category = 'MBCT 마음챙김 인지 코칭 (가슴 쉼과 현존)';
      introMetaphor = `"${name} 대표님, 앞만 보고 정신없이 달리다 가슴이 턱 막히고 가쁘게 숨이 차오르던 날이 있지 않으셨나요?"`;
      essayParagraphs = [
        `속도를 잠시 줄이는 것은 지연이나 실패가 아닙니다. 폭풍우 속을 항해할 때 배의 키를 가만히 고정하고 고요를 되찾는 쉼의 시간입니다.`,
        `질주하려는 순간 3초 동안 숨을 크게 내쉬며 발바닥이 대지에 닿아있는 온기를 가만히 느껴보세요. 거친 소음이 꺼지고 우아한 영점의 정적이 찾아옵니다.`,
        `당신이 고요해질 때, 비로소 당신의 영혼은 세상에서 가장 단단하고 명료한 판단을 내리는 우아한 주권자로 귀환합니다.`
      ];
      actionSteps = [
        `1단계 [알아차림]: 마음이 조급해질 때 즉시 가던 걸음을 멈추고 멈춤 스위치 켜기`,
        `2단계 [수용]: 3초간 깊게 숨을 들이쉬고 내쉬며 발바닥에 닿는 대지의 온기 느끼기`,
        `3단계 [실천]: 차가운 물 한 잔을 조용히 음미하며 뇌를 시원하게 식혀주기`
      ];
    } else if (key === 'DBT') {
      category = 'DBT 변증법적 행동 코칭 (뜨거운 감정 조율)';
      introMetaphor = `"${name} 대표님, 가슴속에서 뜨거운 조급함이나 억울함이 솟구쳐 말이 날카롭게 나가려 할 때가 있으셨지요?"`;
      essayParagraphs = [
        `치밀어 오르는 감정은 당신을 해치려는 버그가 아니라, 내 안의 에너지가 너무도 간절하게 잘해보고 싶어 뿜어낸 뜨거운 온기입니다.`,
        `그러나 열기가 가득 찼을 때 즉각 반응하면 소중한 사람들과의 관계에 금이 갈 수 있습니다. 즉각 행동하지 말고 잠시 3분간 타임아웃을 선언해 보세요.`,
        `감정의 온도가 시원하게 식어 내릴 때 비로소 지혜롭고 자비로운 언어로 소통할 수 있는 현명한 마음(Wise Mind)이 열립니다.`
      ];
      actionSteps = [
        `1단계 [알아차림]: 가슴이 달아오를 때 즉시 "잠시 3분만 쿨링 타임을 가질게요"라고 자비롭게 말하기`,
        `2단계 [수용]: 차가운 물로 손을 씻거나 시원한 공기를 마시며 뇌를 식혀주기`,
        `3단계 [실천]: 마음이 평온해진 후 따뜻하고 온화한 언어로 상대에게 내 뜻을 나누기`
      ];
    } else if (key === 'ACT') {
      category = 'ACT 수용전념 코칭 (내려놓기와 가치 행동)';
      introMetaphor = `"${name} 대표님, '나는 항상 잘해야 하고 1등이어야 한다'는 무거운 왕관에 목과 어깨가 아파오지 않으셨나요?"`;
      essayParagraphs = [
        `내가 만든 완벽이라는 무거운 울타리는 당신의 영혼을 보호하기보다 오히려 당신의 자유를 가두던 상자였습니다.`,
        `'내가 항상 앞서가야 한다'는 무거운 짐을 살포시 내려놓으세요. 조금 뒤에 서 있어도 당신의 빛은 결코 바래지 않습니다.`,
        `부족한 모습조차 사랑스럽게 인정하고, 내가 진정 가치 있게 여기는 소중한 사람들과의 행복을 향해 전념하여 한 걸음 나아가세요.`
      ];
      actionSteps = [
        `1단계 [알아차림]: "완벽해야 해"라는 생각이 떠오를 때 "아, 내 마음이 또 나를 지키려 애쓰는구나" 바라보기`,
        `2단계 [수용]: 80%의 결실도 충분히 훌륭함을 스스로에게 다정하게 칭찬해 주기`,
        `3단계 [실천]: 내가 진정 사랑하는 가치를 위해 오늘 1분 작은 실천 하나를 이루기`
      ];
    } else     if (key === 'CBT') {
      category = 'CBT (인지행동 코칭) 1:1 감동 해설';
      introMetaphor = `"${name} 대표님, '내 생각만 옳다'는 단단한 이분법을 내려놓을 때 세상의 모든 지혜와 조력자가 나에게 흐르기 시작합니다."`;
      essayParagraphs = [
        `내 방식만이 유일한 정답이라는 이분법적 생각은 폭풍우 속에서 나를 보호하려던 생존 방어 외투였습니다. 하지만 상대의 생각 속에도 나를 도울 50%의 소중한 지혜가 숨겨져 있습니다.`,
        `나와 다른 타인의 조언을 나에 대한 공격이 아니라, 내가 미처 보지 못한 맹점을 비춰주는 고마운 돋보기로 여겨보세요.`,
        `내 주장을 100% 관철하려 애쓰지 않을 때, 비로소 마음의 과열이 꺼지고 거대한 협력의 기회가 열립니다.`
      ];
      actionSteps = [
        `1단계 [Scan]: "내 생각이 틀릴 수도 있지 않을까?" 가만히 질문해 보기`,
        `2단계 [Sync]: 상대방 의견에서 배울 점 1가지를 메모에 담아보기`,
        `3단계 [Shift]: 상대방의 멋진 제안을 기꺼이 채택하고 손잡기`
      ];
    } else if (key === 'MBCT') {
      category = 'MBCT (마음챙김 인지 코칭) 1:1 감동 해설';
      introMetaphor = `"${name} 대표님, 거친 폭풍우 속에서도 바닷속 깊은 제로포인트의 알아차림은 언제나 고요합니다."`;
      essayParagraphs = [
        `마음이 조급하여 무작정 앞으로 돌진하고 싶을 때, 가만히 멈추어 3초간 숨을 내쉬며 발바닥이 대지에 닿아있는 안도감을 느껴보세요.`,
        `머릿속을 맴도는 조급함과 불안은 나를 스쳐 지나가는 구름일 뿐, 하늘 자체인 내 영혼의 본성은 온전히 평온합니다.`,
        `지금 이 순간의 현존으로 돌아올 때, 내 삶을 흔들던 모든 조급함은 연기처럼 사라집니다.`
      ];
      actionSteps = [
        `1단계 [Scan]: 가슴이 답답할 때 3초간 천천히 깊은 호흡하기`,
        `2단계 [Sync]: 발바닥에 닿는 대지의 시원한 촉각에 뇌 집중하기`,
        `3단계 [Shift]: 조급함을 내려놓고 편안한 온기로 다음 행동 시작하기`
      ];
    } else if (key === 'DBT') {
      category = 'DBT (변증법적 행동 코칭) 1:1 감동 해설';
      introMetaphor = `"${name} 대표님, 감정의 폭주를 가라앉히고 차가운 지혜와 따뜻한 감성이 만나는 현명한 마음(Wise Mind)을 회복하세요."`;
      essayParagraphs = [
        `분노나 서운함이 솟구칠 때 즉각 반응하지 마세요. 마음의 열기가 서서히 잦아들 때까지 3분의 시원한 타임아웃을 나에게 선물해 보세요.`,
        `뜨거운 감정도, 차가운 논리도 아닙니다. 그 둘이 부드럽게 융합되어 만나는 '현명한 마음(Wise Mind)'이 당신의 진짜 통치권입니다.`,
        `감정의 파도에 휘말리지 않고 파도를 타는 우아한 서퍼처럼, 나 자신을 온전히 안아주고 자유를 얻으십시오.`
      ];
      actionSteps = [
        `1단계 [Scan]: 감정이 가빠질 때 3분간 차가운 물을 마시며 멈추기`,
        `2단계 [Sync]: 감정과 논리가 조화를 이루는 현명한 지혜 선택하기`,
        `3단계 [Shift]: 가장 온화하고 우아한 언어로 내 진심 전하기`
      ];
    } else if (key === 'ACT') {
      category = 'ACT (수용전념 코칭) 1:1 감동 해설';
      introMetaphor = `"${name} 대표님, 완벽해야 한다는 불안은 나를 지켜주려 애쓰던 다정한 내면의 생존 보호자(Protector)였습니다."`;
      essayParagraphs = [
        `완벽해야 한다는 불안은 나를 해치려는 적이 아닙니다. 내 영혼을 안전하게 지켜주려 애쓰던 다정한 내면의 파수꾼입니다.`,
        `불안을 억지로 없애려 싸우지 마세요. '불안아, 와줘서 고마워. 하지만 난 내가 진정 사랑하는 일을 하러 갈게' 하고 다정하게 인정해 주세요.`,
        `80%의 결실도 충분히 훌륭함을 수용하고, 내가 가치 있게 여기는 소중한 사람들과의 행복을 향해 전념하여 한 걸음 내디디십시오.`
      ];
      actionSteps = [
        `1단계 [Scan]: "완벽해야 해" 생각이 들 때 내면의 파수꾼에게 감사 인사하기`,
        `2단계 [Sync]: 80%의 결실도 충분히 훌륭함을 스스로 다정하게 인정하기`,
        `3단계 [Shift]: 내가 진정 사랑하는 가치를 위해 오늘 1분 실천 행동하기`
      ];
    } else if (key === 'DARK') {
      category = 'DARK CODE (생존 방어 스키마) 자비 수용';
      introMetaphor = `"${name} 대표님, 타협을 패배라 여기며 홀로 모든 폭풍을 막아서던 가뭄 속 거목의 지친 잎사귀를 기억하십니까?"`;
      essayParagraphs = [
        `타협을 패배로 여겨 나 홀로 전쟁을 치르려 했던 모습은 당신의 결함이 아니라, 폭풍우 속에서 스스로를 지키려 옷깃을 꼭 잡았던 생존 보호자의 외투입니다.`,
        `이제 혼자 모든 부담을 안고 고립된 전쟁을 치르던 낡은 왕관을 내려놓으십시오. 당신의 조급한 돌진을 멈추고 타인의 헌신을 수용할 때, 당신의 비전은 비로소 세상 전체가 안심하고 밟고 설 수 있는 견고한 울타리로 진화합니다.`,
        `당신은 혼자가 아닙니다. 주변의 따뜻한 조력자들과 손잡을 때 당신의 숲은 비로소 무성해집니다.`
      ];
      actionSteps = [
        `1단계 [Scan]: 반대 의견을 만났을 때 3초간 호흡하며 "저 사람의 말 중 나를 도울 부분은 무엇인가?" 바라보기`,
        `2단계 [Sync]: "이 조언은 나를 공격하는 것이 아니라 내 숲을 가꿔주는 단비다" 마음속으로 말하기`,
        `3단계 [Shift]: 상대의 의견 중 좋은 점 1가지를 웃으며 채택해 주기`
      ];
    } else if (key === 'NEURAL') {
      category = 'NEURAL CODE (신경망 역량) 재배선';
      introMetaphor = `"${name} 대표님, 수직으로만 치솟던 강철 깃대를 내려놓고, 대지 밑으로 뻗어나가는 뿌리의 융합 지혜를 결합할 때입니다."`;
      essayParagraphs = [
        `모든 세부 실무를 혼자 직접 처리하려 애쓰지 마세요. 대표님은 가장 우아하고 날카로운 '비전 설정과 최종 검수'에만 마음을 사용해야 합니다.`,
        `초안 작성과 단순 업무는 믿을 수 있는 팀원이나 AI 도구에게 기꺼이 위임해 보세요. 이것이 바로 혼자 일하다 지치던 개척자에서 100명이 함께 달리는 숲의 리더로 격상되는 지혜입니다.`,
        `당신의 여유 있는 마음에 비로소 세상의 거대한 자본과 귀인이 흘러 들어옵니다.`
      ];
      actionSteps = [
        `1단계 [Scan]: 내가 잡고 있던 업무 중 가장 번거로운 것 1가지 고르기`,
        `2단계 [Sync]: 파트너나 AI에게 100% 믿고 부탁하기`,
        `3단계 [Shift]: 80%만 훌륭해도 기꺼이 통과를 선언하고 다음 비전에 집중하기`
      ];
    } else if (key === 'META') {
      category = 'META CODE (ZERO-POINT) 영점 각성';
      introMetaphor = `"${name} 대표님, 나는 숲을 이끄는 가장 높은 나무이나, 숲 전체의 흙과 바람과 연결되어 있을 때만 우뚝 서 있을 수 있습니다."`;
      essayParagraphs = [
        `'내가 항상 옳아야 한다'는 짐스러운 왕관을 내려놓는 순간, 당신은 비로소 모든 사람의 경험과 지혜를 내 것으로 흡수하는 우주적 유연함을 얻게 됩니다.`,
        `세상에서 가장 강력한 거목은 가장 단단한 나무가 아니라, 어떤 폭풍에도 부러지지 않고 유연하게 흔들리는 뿌리 깊은 숲 그 자체입니다.`,
        `당신이 마음을 열고 숲 전체와 연결될 때, 세상의 모든 기회와 조력자는 당신의 숲으로 흘러 들어옵니다.`
      ];
      actionSteps = [
        `1단계 [Scan]: 매일 아침 "오늘 나는 주변의 지혜를 흡수할 준비가 되어 있는가?" 질문하기`,
        `2단계 [Sync]: 타인의 조언을 담아낼 수 있는 여유 3초 확보하기`,
        `3단계 [Shift]: 팀원의 좋은 아이디어를 채택하여 현실로 이뤄내기`
      ];
    } else if (key.startsWith('Q_')) {
      category = '재귀적 1:1 심층 질문 코칭';
      introMetaphor = `"${name} 대표님, 상대방을 논리로 제압한 직후 당신의 가슴속에 남는 것은 승리의 쾌감입니까, 아니면 썰물처럼 빠져나가는 적막함입니까?"`;
      essayParagraphs = [
        `논리로 이기는 것보다 소중한 것은 사람의 따뜻한 마음과 온전한 에너지를 얻는 것입니다. 상대를 꺾으려 하지 말고 경청으로 상대의 마음을 안아주세요.`,
        `상대를 제압하려 하지 않고 상대의 잠재력을 깨워주는 질문을 던질 때, 당신의 말 한마디는 사람의 마음을 얻는 거대한 열쇠가 됩니다.`,
        `사람의 마음을 얻을 때, 당신의 일과 비즈니스는 가장 든든한 조력자를 얻게 됩니다.`
      ];
      actionSteps = [
        `1단계 [Scan]: 상대방의 말이 끝나기 전까지 3분간 따뜻하게 경청하기`,
        `2단계 [Sync]: 상대의 핵심 마음을 한 문장으로 다정하게 짚어주기`,
        `3단계 [Shift]: "내가 무엇을 도와주면 좋겠습니까?" 따뜻한 질문 던지기`
      ];
    } else {
      category = '1:1 맞춤 영혼 코칭 프로토콜';
      introMetaphor = `"${name} 대표님, 솟구치는 마음의 조급함을 차가운 우물물 한 잔으로 다정하게 식혀줄 시간입니다."`;
      essayParagraphs = [
        `마음이 조급하거나 불안할 때 즉각 반응하지 말고, 차가운 물 한 잔을 마시며 발바닥이 땅에 닿아있는 안도감을 3초간 가만히 인지해 보세요.`,
        `'나는 항상 앞서가야 한다'는 무거운 짐을 내려놓고, 기꺼이 뒤로 물러나 타인을 세워주는 경험을 허용할 때 당신은 비로소 평온하고 우아한 주권자의 삶을 살게 됩니다.`
      ];
      actionSteps = [
        `1단계 [Scan]: 마음이 가빠질 때 가만히 멈추고 타임아웃 갖기`,
        `2단계 [Sync]: 차가운 물을 음미하며 뇌를 시원하게 식히기`,
        `3단계 [Shift]: 온화한 언어로 내 진심을 전하기`
      ];
    }

    setSelectedModalItem({
      key,
      title,
      category,
      introMetaphor,
      essayParagraphs,
      actionSteps
    });
  };
  const [activeTab, setActiveTab] = useState<'AWAKENING' | 'QUESTIONS' | 'PSYCHOLOGY'>('AWAKENING');

  // fallback to 甲 if undefined or not found
  const safeStem = dayStem && ADVANCED_COACHING_DB[dayStem] ? dayStem : '甲';
  const coachingData: AdvancedCoachingData = ADVANCED_COACHING_DB[safeStem];

  if (!coachingData) {
    return <div className="p-4 text-gray-400">데이터를 불러올 수 없습니다.</div>;
  }

  const tabClass = (tabName: string) => 
    `flex-1 py-3 text-center text-sm font-bold border-b-2 transition-colors duration-300 cursor-pointer ${
      activeTab === tabName 
        ? 'border-cyan-400 text-cyan-400' 
        : 'border-slate-800 text-slate-500 hover:text-slate-300'
    }`;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden font-sans text-slate-200 mt-8 mb-8 shadow-2xl">
      {/* Header Section */}
      <div className="bg-slate-950 p-6 md:p-8 border-b border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">다차원 심층 각성</span> 시스템
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          다크코드 분석부터 심층 코칭(CBT/ACT) 프레임워크까지, {coachingData.name}의 주권 회복을 위한 퀀텀 코칭
        </p>
        
        {/* Old Scenario Card */}
        <div className="mt-6 p-5 bg-slate-900/50 rounded-xl border border-rose-900/30 text-left">
          <h3 className="text-rose-400 font-bold mb-2 flex items-center">
            <span className="mr-2">⚠️</span> 낡은 시나리오 (Old Scenario): {coachingData.oldScenario.title}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {coachingData.oldScenario.description}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950 px-4">
        <div className={tabClass('AWAKENING')} onClick={() => setActiveTab('AWAKENING')}>
          3단계 각성 코드
        </div>
        <div className={tabClass('QUESTIONS')} onClick={() => setActiveTab('QUESTIONS')}>
          재귀적 산파술
        </div>
        <div className={tabClass('PSYCHOLOGY')} onClick={() => setActiveTab('PSYCHOLOGY')}>
          심층 코칭 프로토콜
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'AWAKENING' && (
            <motion.div
              key="AWAKENING"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Dark Code */}
              <div onClick={() => openCoachingModal("DARK", coachingData.darkCode.name)} className="p-5 rounded-xl border border-slate-700 bg-slate-800/40 relative overflow-hidden group cursor-pointer hover:border-rose-500/50 hover:bg-slate-800/60 transition-all shadow-md">
                <div className="absolute left-0 top-0 h-full w-1 bg-rose-500 rounded-l-xl"></div>
                <h4 className="text-lg font-bold text-rose-400 mb-1 flex items-center">
                  <span className="bg-rose-900/50 text-rose-300 text-xs px-2 py-1 rounded mr-3 border border-rose-700/50">DARK CODE</span>
                  {coachingData.darkCode.name}
                </h4>
                <p className="text-xs text-slate-500 mb-3 font-mono opacity-60">ID: {coachingData.darkCode.id}</p>
                <ul className="space-y-2 mt-3">
                  {coachingData.darkCode.symptoms.map((sym, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start">
                      <span className="text-rose-500 mr-2 mt-0.5">▪</span> {sym}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Neural Code */}
              <div onClick={() => openCoachingModal("NEURAL", coachingData.neuralCode.name)} className="p-5 rounded-xl border border-slate-700 bg-slate-800/40 relative overflow-hidden group cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all shadow-md">
                <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 rounded-l-xl opacity-80"></div>
                <h4 className="text-lg font-bold text-cyan-400 mb-1 flex items-center">
                  <span className="bg-cyan-900/50 text-cyan-300 text-xs px-2 py-1 rounded mr-3 border border-cyan-700/50">NEURAL CODE</span>
                  {coachingData.neuralCode.name}
                </h4>
                <p className="text-xs text-slate-500 mb-3 font-mono opacity-60">ID: {coachingData.neuralCode.id}</p>
                <p className="text-sm text-cyan-100/80 leading-relaxed bg-cyan-950/30 p-3 rounded-lg border border-cyan-900/30">
                  {coachingData.neuralCode.mechanism}
                </p>
              </div>

              {/* Meta Code */}
              <div onClick={() => openCoachingModal("META", coachingData.metaCode.description)} className="p-5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-transparent relative overflow-hidden group cursor-pointer hover:border-amber-400/60 hover:bg-amber-900/30 transition-all shadow-md">
                <div className="absolute left-0 top-0 h-full w-1 bg-amber-400 rounded-l-xl"></div>
                <h4 className="text-lg font-bold text-amber-400 mb-3 flex items-center">
                  <span className="bg-amber-900/50 text-amber-200 text-xs px-2 py-1 rounded mr-3 border border-amber-600/50">META CODE (AWAKENING)</span>
                </h4>
                <p className="text-md font-medium text-amber-100 mb-4 italic">
                  "{coachingData.metaCode.description}"
                </p>
                <div className="flex items-center text-sm font-bold text-amber-300/80">
                  <span className="mr-2">SHIFT ➜</span>
                  <span className="underline decoration-amber-500/50 underline-offset-4">{coachingData.metaCode.shift}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'QUESTIONS' && (
            <motion.div
              key="QUESTIONS"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-5">
                {/* Lv.1 소크라테스식 질문 — 행동/결과 층위 */}
                <div onClick={() => openCoachingModal("Q_SOCRATIC", "LV.1 소크라테스식 산파술 질문")} className="bg-slate-800/60 border border-indigo-500/30 rounded-xl p-6 cursor-pointer hover:border-indigo-400/60 hover:bg-slate-800/80 transition-all shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black bg-indigo-700/60 text-indigo-200 px-2 py-0.5 rounded tracking-widest">LV.1 소크라테스식 질문</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">행동과 결과의 층위 · 타당성 검증</span>
                  </div>
                  <h4 className="text-indigo-400 font-bold mb-4 flex items-center uppercase text-sm tracking-wider">
                    <span className="mr-2">⚔️</span> Socratic Questioning
                  </h4>
                  <div className="bg-slate-900/80 p-4 rounded-lg mb-4 border-l-2 border-indigo-500/50">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-widest">Trigger Situation</p>
                    <p className="text-sm text-slate-300">{coachingData.sopaSul.trigger}</p>
                  </div>
                  <p className="text-base text-indigo-100 font-semibold italic text-center p-4 bg-indigo-950/40 rounded-lg shadow-inner leading-relaxed">
                    {coachingData.sopaSul.question}
                  </p>
                </div>

                {/* Lv.2 메타인지 질문 — 생각 층위 [SCAN] */}
                <div onClick={() => openCoachingModal("Q_META", "LV.2 메타인지 산파술 질문")} className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-6 cursor-pointer hover:border-cyan-400/60 hover:bg-slate-800/80 transition-all shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black bg-cyan-700/60 text-cyan-200 px-2 py-0.5 rounded tracking-widest">LV.2 메타인지 질문</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">생각의 층위 · 에러 스캔 [SCAN]</span>
                  </div>
                  <h4 className="text-cyan-400 font-bold mb-4 flex items-center uppercase text-sm tracking-wider">
                    <span className="mr-2">🔍</span> Meta-Cognitive Questioning
                  </h4>
                  <p className="text-base text-cyan-100 font-semibold italic text-center p-6 bg-cyan-950/40 rounded-lg shadow-inner leading-relaxed">
                    {coachingData.metaCognitionQuestion}
                  </p>
                </div>

                {/* Lv.3 재귀적 질문 — 정체성 층위 [SYNC] */}
                <div className="bg-slate-800/60 border border-fuchsia-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black bg-fuchsia-700/60 text-fuchsia-200 px-2 py-0.5 rounded tracking-widest">LV.3 재귀적 질문</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">정체성의 층위 · 캐릭터 동기화 [SYNC]</span>
                  </div>
                  <h4 className="text-fuchsia-400 font-bold mb-4 flex items-center uppercase text-sm tracking-wider">
                    <span className="mr-2">🔄</span> Recursive Questioning
                  </h4>
                  <p className="text-base text-fuchsia-100 font-semibold italic text-center p-6 bg-fuchsia-950/40 rounded-lg shadow-inner leading-relaxed">
                    {coachingData.recursiveQuestion}
                  </p>
                </div>

                {/* Lv.4 알아차림의 알아차림 — 근원 층위 [SHIFT] */}
                <div className="bg-slate-800/60 border border-emerald-500/50 rounded-xl p-6 relative overflow-hidden">
                  {/* 배경 광원 */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: '#34d399', filter: 'blur(32px)' }} />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black bg-emerald-700/60 text-emerald-200 px-2 py-0.5 rounded tracking-widest">LV.4 알아차림의 알아차림</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">근원의 층위 · 순수 자각(Pure Awareness) [SHIFT 정점]</span>
                  </div>
                  <h4 className="text-emerald-400 font-bold mb-3 flex items-center uppercase text-sm tracking-wider">
                    <span className="mr-2">👁️</span> Meta-Awareness Questioning
                  </h4>
                  {/* 층위 구분 설명 박스 */}
                  <div className="mb-4 p-3 rounded-lg bg-slate-900/70 border border-emerald-900/60">
                    <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest mb-1">WHY THIS IS DIFFERENT FROM LV.2</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      LV.2(메타인지)는 <span className="text-cyan-300">"감독이 배우를 모니터링"</span>하는 단계 — 여전히 대상(감정·생각)을 바라보는 관찰자가 존재합니다.<br/>
                      LV.4(순수 자각)는 <span className="text-emerald-300">"관찰자조차 사라지고 오직 알아차림만 남는"</span> 단계 — 주체와 객체의 이분법이 소멸됩니다. 이 질문에 도달하면 사용자는 운명(사주)을 '유희'로 다루는 주권자가 됩니다.
                    </p>
                  </div>
                  <p className="text-base text-emerald-100 font-semibold italic text-center p-6 bg-emerald-950/40 rounded-lg shadow-inner leading-relaxed border border-emerald-800/30">
                    {coachingData.awarenessQuestion}
                  </p>
                  <p className="text-[10px] text-emerald-600/70 text-center mt-3 italic">
                    * 이 질문에서 '나'가 사라지는 순간, 운명은 더 이상 굴레가 아니라 유희가 됩니다.
                  </p>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'PSYCHOLOGY' && (
            <motion.div
              key="PSYCHOLOGY"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CBT */}
                <div onClick={() => openCoachingModal("CBT", "CBT 인지행동 코칭")} className="bg-slate-800/50 border border-blue-500/30 p-5 rounded-2xl hover:border-blue-400 transition-all cursor-pointer shadow-md group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-blue-400 font-black text-sm flex items-center">
                      <span className="bg-blue-900/70 text-blue-300 text-xs px-2 py-0.5 rounded mr-2 border border-blue-700/50">CBT</span>
                      인지행동 코칭
                    </h4>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span>👆 클릭 시 AI 감동 에세이</span>
                    </span>
                  </div>
                  <div className="mb-2 text-xs sm:text-sm font-bold text-slate-100">{coachingData.psychology.cbt.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">"내 생각만 옳다"는 경직된 마음을 부드럽게 풀고, 타인의 다른 생각 속에 숨겨진 지혜의 불빛을 따뜻하게 발견합니다.</p>
                </div>

                {/* MBCT */}
                <div onClick={() => openCoachingModal("MBCT", "MBCT 마음챙김 인지 코칭")} className="bg-slate-800/50 border border-teal-500/30 p-5 rounded-2xl hover:border-teal-400 transition-all cursor-pointer shadow-md group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-teal-400 font-black text-sm flex items-center">
                      <span className="bg-teal-900/70 text-teal-300 text-xs px-2 py-0.5 rounded mr-2 border border-teal-700/50">MBCT</span>
                      마음챙김 인지 코칭
                    </h4>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span>👆 클릭 시 AI 감동 에세이</span>
                    </span>
                  </div>
                  <div className="mb-2 text-xs sm:text-sm font-bold text-slate-100">{coachingData.psychology.mbct.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">돌진하려는 조급함이 올라올 때 가만히 멈추어 3초간 호흡하며 대지의 시원한 안도감으로 뇌를 보살핍니다.</p>
                </div>

                {/* DBT */}
                <div onClick={() => openCoachingModal("DBT", "DBT 변증법적 행동 코칭")} className="bg-slate-800/50 border border-orange-500/30 p-5 rounded-2xl hover:border-orange-400 transition-all cursor-pointer shadow-md group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-orange-400 font-black text-sm flex items-center">
                      <span className="bg-orange-900/70 text-orange-300 text-xs px-2 py-0.5 rounded mr-2 border border-orange-700/50">DBT</span>
                      변증법적 행동 코칭
                    </h4>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span>👆 클릭 시 AI 감동 에세이</span>
                    </span>
                  </div>
                  <div className="mb-2 text-xs sm:text-sm font-bold text-slate-100">{coachingData.psychology.dbt.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">분노나 서운함의 열기가 식어 고요해질 때까지 3분의 휴식을 주고 현명한 마음(Wise Mind)의 중심을 회복합니다.</p>
                </div>

                {/* ACT */}
                <div onClick={() => openCoachingModal("ACT", "ACT 수용전념 코칭")} className="bg-slate-800/50 border border-purple-500/30 p-5 rounded-2xl hover:border-purple-400 transition-all cursor-pointer shadow-md group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-purple-400 font-black text-sm flex items-center">
                      <span className="bg-purple-900/70 text-purple-300 text-xs px-2 py-0.5 rounded mr-2 border border-purple-700/50">ACT</span>
                      수용전념 코칭
                    </h4>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span>👆 클릭 시 AI 감동 에세이</span>
                    </span>
                  </div>
                  <div className="mb-2 text-xs sm:text-sm font-bold text-slate-100">{coachingData.psychology.act.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">"완벽해야 해"라는 불안을 생존 보호자로 감사히 인정하고, 내가 진짜 사랑하는 가치에 전념하여 1분 실천을 만듭니다.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ── 890원 블러(Blur) AI 코치 감동 에세이 팝업 모달 ── */}
      <AnimatePresence>
        {selectedModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#121022] border border-cyan-500/40 w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                    {selectedModalItem.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    {selectedModalItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedModalItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Free Preview (초보자 맞춤 현실 메타포) */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-sm leading-relaxed mb-4 italic">
                {selectedModalItem.introMetaphor}
              </div>

              {/* Paywall Locked Section */}
              {!isModalUnlocked && !isAllPassUnlocked ? (
                <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 p-6 bg-[#181526]/90 shadow-2xl mt-4">
                  <div className="filter blur-[6px] select-none text-slate-400 text-xs space-y-3 opacity-50 pointer-events-none">
                    <p>▒▒▒▒▒▒ {selectedModalItem.essayParagraphs[0]} ▒▒▒▒▒▒</p>
                    <p>▒▒▒▒▒▒ {selectedModalItem.actionSteps[0]} ▒▒▒▒▒▒</p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-[#131022]/70 via-[#131022]/95 to-[#131022] flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black shadow-xl shadow-amber-500/30 animate-bounce">
                      🔒
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">AI 코치의 초보자 맞춤 감동 에세이 해설서</h4>
                      <p className="text-xs text-slate-400 mt-1">단품 890원 또는 1,900원 ALL-PASS로 해설서 전체를 열람하세요.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                      <button
                        disabled={isUnlocking}
                        onClick={() => {
                          setIsUnlocking(true);
                          setTimeout(() => {
                            setIsModalUnlocked(true);
                            setIsUnlocking(false);
                          }, 700);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <span>🔓 890원 단품 해제 (890원)</span>
                      </button>

                      <button
                        disabled={isUnlocking}
                        onClick={() => {
                          setIsUnlocking(true);
                          setTimeout(() => {
                            setIsAllPassUnlocked(true);
                            setIsModalUnlocked(true);
                            setIsUnlocking(false);
                          }, 700);
                        }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-500/90 hover:to-amber-600/90 text-black px-6 py-3 rounded-xl font-black text-xs shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <span>⚡ ALL-PASS 전체 통합 해제 (1,900원)</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-amber-300/80 font-medium">* ALL-PASS 선택 시 리포트 내 전체 감동 에세이가 즉시 해제됩니다.</p>
                  </div>
                </div>
              ) : (
                /* Unlocked Essay Content */
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <span>✓</span> {isAllPassUnlocked ? '1,900원 ALL-PASS 결제 완료' : '890원 단품 결제 완료'} • AI 코치 1:1 감동 해설서
                  </div>

                  <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                    <h5 className="font-bold text-cyan-300 text-sm">📖 초보자 맞춤 1:1 감동 에세이</h5>
                    <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed break-keep font-normal">
                      {selectedModalItem.essayParagraphs.map((para, idx) => (
                        <p key={idx} className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                    <h5 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      💡 오늘 당장 실행하는 마이크로 실천 지침
                    </h5>
                    <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed font-medium">
                      {selectedModalItem.actionSteps.map((act, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-cyan-950/40 p-2 rounded border border-cyan-500/30">
                          <span className="text-cyan-400 font-bold shrink-0">▪</span>
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
