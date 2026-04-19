'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ADVANCED_COACHING_DB, AdvancedCoachingData } from '../../data/AdvancedCoachingDB';

interface Props {
  dayStem?: string;
  userName?: string;
}

export default function SocialAntiPatternAnalysis({ dayStem, userName = '사용자' }: Props) {
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
              <div className="p-5 rounded-xl border border-slate-700 bg-slate-800/40 relative overflow-hidden group">
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
              <div className="p-5 rounded-xl border border-slate-700 bg-slate-800/40 relative overflow-hidden group">
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
              <div className="p-5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-transparent relative overflow-hidden group">
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
                <div className="bg-slate-800/60 border border-indigo-500/30 rounded-xl p-6">
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
                <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-6">
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
                <div className="bg-slate-800/50 border border-blue-500/20 p-5 rounded-xl hover:border-blue-500/50 transition-colors">
                  <h4 className="text-blue-400 font-bold mb-2 flex items-center">
                    <span className="bg-blue-900/70 text-xs px-2 py-1 rounded mr-2">CBT</span>
                    인지행동 코칭
                  </h4>
                  <div className="mb-2 text-sm font-semibold text-slate-200">{coachingData.psychology.cbt.title}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{coachingData.psychology.cbt.desc}</p>
                </div>

                {/* MBCT */}
                <div className="bg-slate-800/50 border border-teal-500/20 p-5 rounded-xl hover:border-teal-500/50 transition-colors">
                  <h4 className="text-teal-400 font-bold mb-2 flex items-center">
                    <span className="bg-teal-900/70 text-xs px-2 py-1 rounded mr-2">MBCT</span>
                    마음챙김 인지 코칭
                  </h4>
                  <div className="mb-2 text-sm font-semibold text-slate-200">{coachingData.psychology.mbct.title}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{coachingData.psychology.mbct.desc}</p>
                </div>

                {/* DBT */}
                <div className="bg-slate-800/50 border border-orange-500/20 p-5 rounded-xl hover:border-orange-500/50 transition-colors">
                  <h4 className="text-orange-400 font-bold mb-2 flex items-center">
                    <span className="bg-orange-900/70 text-xs px-2 py-1 rounded mr-2">DBT</span>
                    변증법적 행동 코칭
                  </h4>
                  <div className="mb-2 text-sm font-semibold text-slate-200">{coachingData.psychology.dbt.title}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{coachingData.psychology.dbt.desc}</p>
                </div>

                {/* ACT */}
                <div className="bg-slate-800/50 border border-purple-500/20 p-5 rounded-xl hover:border-purple-500/50 transition-colors">
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
    </div>
  );
}
