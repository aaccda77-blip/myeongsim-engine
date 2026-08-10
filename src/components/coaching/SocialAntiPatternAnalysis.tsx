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
    essayContent: string;
    actionGuide: string;
  } | null>(null);

  const [isModalUnlocked, setIsModalUnlocked] = useState(false);
  const [isAllPassUnlocked, setIsAllPassUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const openCoachingModal = (key: string, title: string) => {
    const isMok = dayStem === '甲' || dayStem === '乙';
    const name = dayStem === '甲' ? '甲木(갑목) 선구자' : dayStem === '乙' ? '乙木(을목) 연결자' : '명심 아키텍트';

    let category = '3단계 각성 코드';
    let introMetaphor = `"${name} 대표님, 홀로 모든 바람을 막아서던 가뭄 속 거목의 지친 잎사귀를 기억하십니까? 초보자도 1초 만에 깨닫는 자연 물상 메타포로 명확하게 풀어드립니다."`;
    let essayContent = `모든 것을 혼자 힘으로 개척해야 한다는 강박은 당신의 열정이 아닌, 뇌의 고독한 조급함(Root Lock)이 만들어낸 환상입니다. 거목은 혼자 숲을 이룰 수 없듯, 타인의 의견과 피드백은 당신의 비전을 위협하는 공격이 아니라 거대한 숲을 함께 가꾸는 단비와 같습니다. 이제 모든 짐을 홀로 짊어지려 하지 마십시오. 당신의 독단적인 돌진을 멈추고 타인의 헌신을 수용할 때, 당신의 비전은 비로소 세상 전체가 밟고 설 수 있는 견고한 인프라로 전환됩니다.`;
    let actionGuide = `오늘 누군가 반대 의견을 내었을 때 즉각 반박하지 말고, 3초간 호흡하며 "이 피드백이 내 시스템을 보완해 줄 수 있는가?"를 수치화(%)하여 기록해보세요.`;

    if (key === 'DARK') {
      category = 'DARK CODE (Root Lock) AI 심층 해독';
      introMetaphor = `"${name} 대표님, 타협을 패배라 여기며 홀로 모든 파도를 막아서던 가뭄 속 거목의 지친 잎사귀를 기억하십니까?"`;
      essayContent = `타협을 패배로 인지하고 조언을 공격으로 받아들이는 현상은 당신이 나빠서가 아니라, 뇌 전두엽의 독단적 과부하(Root Lock) 회로가 구동했기 때문입니다. 홀로 모든 책임을 지려다 뿌리가 뽑히는 번아웃을 방지하려면, 타인의 피드백을 내 시스템을 키워주는 단비로 받아들여야 합니다.`;
      actionGuide = `반대 의견을 만났을 때 3초간 호흡하며 "저 사람의 말 중 10%라도 내 시스템을 결함 없이 보완할 수 있는 부분은 무엇인가?"를 기록하십시오.`;
    } else if (key === 'NEURAL') {
      category = 'NEURAL CODE (Resonance Net) 신경망 리셋';
      introMetaphor = `"${name} 대표님, 수직으로만 치솟던 강철 깃대를 내려놓고, 땅 밑으로 수평하게 뻗어나가는 뿌리의 융합 지혜를 결합할 때입니다."`;
      essayContent = `수직적 돌파 에너지는 초기에 거대한 영토를 개척하지만, 끝내 혼자 남아 외로워집니다. 공명 네트워크(Resonance Net)는 당신의 폭발적인 추진력을 '타인과 함께 굴러가는 자동화 시스템'으로 승화시키는 최적의 회로입니다.`;
      actionGuide = `내가 직접 들고 있던 업무 중 1가지를 선정하여 AI 또는 파트너에게 외주·위임하고 그 결과를 경청하십시오.`;
    } else if (key === 'META') {
      category = 'META CODE (AWAKENING) 퀀텀 깨달음';
      introMetaphor = `"${name} 대표님, 나는 숲을 이끄는 가장 높은 나무이나, 숲 전체의 흙과 바람과 연결되어 있을 때만 우뚝 서 있을 수 있습니다."`;
      essayContent = `에고(Ego)의 고집은 당신을 지켜주는 갑옷이 아니라 감옥이었습니다. '내가 항상 옳아야 한다'는 짐스러운 왕관을 내려놓는 순간, 당신은 비로소 모든 사람의 경험과 지혜를 내 것으로 흡수하는 우주적 유연함을 얻게 됩니다.`;
      actionGuide = `매일 아침 "오늘 나는 틀릴 준비가 되어 있는가? 타인의 지혜를 내 숲으로 흡수할 준비가 되었는가?"를 저널에 기록하십시오.`;
    } else if (key.startsWith('Q_')) {
      category = '재귀적 산파술 1:1 심층 질문';
      introMetaphor = `"${name} 대표님, 상대방을 논리로 제압한 직후 당신의 가슴속에 남는 것은 승리의 쾌감입니까, 아니면 썰물처럼 빠져나가는 적막함입니까?"`;
      essayContent = `논리로 승리하는 것은 쉽지만 사람의 마음을 얻는 것은 오직 경청과 산파술 질문으로만 가능합니다. 끓어오르는 조급함은 객관적 사실이 아니라, 머릿속 '거목의 에고'가 만들어낸 하나의 데이터일 뿐이라는 것을 분리해서 바라보십시오.`;
      actionGuide = `다음 미팅에서 상대의 말이 끝나기 전까지 3분간 절대 개입하지 말고, 상대의 핵심 욕구를 1문장으로 요약해 짚어주십시오.`;
    } else {
      category = '심층 코칭 프로토콜 (CBT/MBCT/DBT/ACT)';
      introMetaphor = `"${name} 대표님, 솟구치는 분수 입구를 손바닥으로 막는 대신, 차가운 샘물(子水)의 수분으로 뇌를 쿨링다운 시켜야 합니다."`;
      essayContent = `CBT, MBCT, DBT, ACT 프로토콜은 당신의 인지 왜곡과 감정 과열 회로를 정밀 디버깅하는 최첨단 뇌과학 지침입니다. '나만 옳다'는 이분법적 사고가 발동할 때 3초간 호흡하며 발바닥 감각을 인지하고, 감정 온도가 내려갈 때까지 타임아웃을 선언하십시오.`;
      actionGuide = `감정 온도가 솟구칠 때 즉각 행동하지 말고 '타임아웃'을 선언한 뒤 차가운 물을 마시며 3분간 깊은 호흡을 진행하십시오.`;
    }

    setSelectedModalItem({ key, title, category, introMetaphor, essayContent, actionGuide });
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
                <div onClick={() => openCoachingModal("CBT", "CBT 인지행동 코칭")} className="bg-slate-800/50 border border-blue-500/20 p-5 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer shadow-md">
                  <h4 className="text-blue-400 font-bold mb-2 flex items-center">
                    <span className="bg-blue-900/70 text-xs px-2 py-1 rounded mr-2">CBT</span>
                    인지행동 코칭
                  </h4>
                  <div className="mb-2 text-sm font-semibold text-slate-200">{coachingData.psychology.cbt.title}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{coachingData.psychology.cbt.desc}</p>
                </div>

                {/* MBCT */}
                <div onClick={() => openCoachingModal("MBCT", "MBCT 마음챙김 인지 코칭")} className="bg-slate-800/50 border border-teal-500/20 p-5 rounded-xl hover:border-teal-500/50 transition-colors cursor-pointer shadow-md">
                  <h4 className="text-teal-400 font-bold mb-2 flex items-center">
                    <span className="bg-teal-900/70 text-xs px-2 py-1 rounded mr-2">MBCT</span>
                    마음챙김 인지 코칭
                  </h4>
                  <div className="mb-2 text-sm font-semibold text-slate-200">{coachingData.psychology.mbct.title}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{coachingData.psychology.mbct.desc}</p>
                </div>

                {/* DBT */}
                <div onClick={() => openCoachingModal("DBT", "DBT 변증법적 행동 코칭")} className="bg-slate-800/50 border border-orange-500/20 p-5 rounded-xl hover:border-orange-500/50 transition-colors cursor-pointer shadow-md">
                  <h4 className="text-orange-400 font-bold mb-2 flex items-center">
                    <span className="bg-orange-900/70 text-xs px-2 py-1 rounded mr-2">DBT</span>
                    변증법적 행동 코칭
                  </h4>
                  <div className="mb-2 text-sm font-semibold text-slate-200">{coachingData.psychology.dbt.title}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{coachingData.psychology.dbt.desc}</p>
                </div>

                {/* ACT */}
                <div onClick={() => openCoachingModal("ACT", "ACT 수용전념 코칭")} className="bg-slate-800/50 border border-purple-500/20 p-5 rounded-xl hover:border-purple-500/50 transition-colors cursor-pointer shadow-md">
                  <h4 className="text-purple-400 font-bold mb-2 flex items-center">
                    <span className="bg-purple-900/70 text-xs px-2 py-1 rounded mr-2">ACT</span>
                    수용전념 코칭
                  </h4>
                  <div className="mb-2 text-sm font-semibold text-slate-200">{coachingData.psychology.act.title}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{coachingData.psychology.act.desc}</p>
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
                    <p>▒▒▒▒▒▒ {selectedModalItem.essayContent} ▒▒▒▒▒▒</p>
                    <p>▒▒▒▒▒▒ {selectedModalItem.actionGuide} ▒▒▒▒▒▒</p>
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
                        <span>🔓 890원 단품 해제 (890pt)</span>
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
                    <span>✓</span> {isAllPassUnlocked ? '1,900pt ALL-PASS 결제 완료' : '890pt 단품 결제 완료'} • AI 코치 1:1 감동 해설서
                  </div>

                  <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                    <h5 className="font-bold text-cyan-300 text-sm">📖 초보자 맞춤 1:1 감동 에세이</h5>
                    <p className="text-xs text-slate-200 leading-relaxed break-keep font-normal">
                      {selectedModalItem.essayContent}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                    <h5 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      💡 오늘 당장 실행하는 마이크로 실천 지침
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                      {selectedModalItem.actionGuide}
                    </p>
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
