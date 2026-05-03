'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────
interface TenGods {
  resource: number;  // 인성
  self: number;      // 비겁
  output: number;    // 식상
  wealth: number;    // 재성
  power: number;     // 관성
}

interface Gongmang {
  labels: string[];
  hasYear: boolean;
  hasMonth: boolean;
  hasTime: boolean;
  isActive: boolean;
}

interface Props {
  tenGods?: TenGods;
  ohaeng?: { wood: number; fire: number; earth: number; metal: number; water: number };
  gongmang?: Gongmang;
  dayStem?: string;
  userName?: string;
}

// ─────────────────────────────────────────────
// 5대 흐름 패턴 전체 정의
// ─────────────────────────────────────────────
interface FlowDef {
  key: string;
  korName: string;
  engName: string;
  tags: [keyof TenGods, keyof TenGods, keyof TenGods];
  label: [string, string, string];
  mode: [string, string, string];
  color: string;
  archetype: string;
  summary: string;
  bottleneckKey: keyof TenGods;
  bottleneckDesc: string;
  coachingStrength: string;
  coachingShadow: string;
  activationQ: string;
  careers: string[];
  neuroAnalysis: string;
  behavioralTactic: string;
}

const FLOW_DEFS: FlowDef[] = [
  {
    key: 'InBiSik',
    korName: '인비식 (印比食)',
    engName: 'RESOURCE → SELF → OUTPUT',
    tags: ['resource', 'self', 'output'],
    label: ['인성(印星)', '비겁(比劫)', '식상(食傷)'],
    mode: ['SCAN', 'SYNC', 'SHIFT'],
    color: '#a78bfa',
    archetype: '지적 통찰형 크리에이터 (Intellectual Creator)',
    summary: '외부의 방대한 지식과 에너지(인성)를 스펀지처럼 흡수하고, 이를 자신만의 단단한 주관(비겁)으로 필터링하여 세상에 없던 매력적인 결과물(식상)로 뿜어내는 "지적 창조의 마스터" 구조입니다.',
    bottleneckKey: 'output',
    bottleneckDesc: '출력(식상) 채널이 막혀있다면 심각한 "지식 과식증"에 걸릴 수 있습니다. "아직 완벽하지 않아, 더 배워야 해"라는 함정에 빠져 평생 고품질의 재료만 모아두고 시도조차 못 하는 완벽주의의 늪을 가장 경계해야 합니다.',
    coachingStrength: '당신의 가장 위대한 무기는 멈추지 않는 호기심과 남들이 보지 못하는 이면을 꿰뚫어 보는 통찰력입니다. 타인의 이론을 그대로 답습하지 않고, 자신만의 오리지널리티(Originality)로 정제해 내는 능력이 탁월합니다.',
    coachingShadow: '머릿속 아이디어가 세상 밖으로 속 시원하게 나오지 못할 때 극심한 번아웃이 찾아옵니다. 또한 다른 사람의 처리 방식을 쉽게 신뢰하지 못해, 모든 책임을 온전히 혼자 짊어지려다 스스로 고립의 길을 택하는 경향이 있습니다.',
    activationQ: '"완벽하지 않아도 좋습니다. 오늘 당장 세상에 배포할 수 있는 단 1%짜리 초안(Draft)은 무엇입니까?"',
    careers: ['작가·집필', '강의·코칭', '학문 연구', '플랫폼 구축', '컨설턴트'],
    neuroAnalysis: "전두엽의 정보 수집(SCAN)과 통합 시냅스가 극도로 발달해 있습니다. 방대한 데이터를 자아(Self)라는 필터를 통해 압축한 후, 운동 피질을 자극해 창조적 결과물(SHIFT)로 출력하는 고속 뉴럴 하이웨이가 구축되어 있습니다.",
    behavioralTactic: "완벽한 100을 만들기 위해 고민하는 '지식 과식증'을 끊어내십시오. 타이머를 15분으로 맞추고 퀄리티에 상관없이 초안을 강제로 뱉어내는 마이크로 해빗(Micro-Habit) 훈련이 뇌의 병목을 뚫어줍니다."
  },
  {
    key: 'BiSikJae',
    korName: '비식재 (比食財)',
    engName: 'SELF → OUTPUT → WEALTH',
    tags: ['self', 'output', 'wealth'],
    label: ['비겁(比劫)', '식상(食傷)', '재성(財星)'],
    mode: ['SYNC', 'SHIFT', 'GAIN'],
    color: '#34d399',
    archetype: '자아 발현형 비즈니스 아티스트 (Self-Driven Artist)',
    summary: '전통 명리학의 **식상생재(食傷生財)** 원리를 극대화하여, 넘치는 에너지와 강력한 자아(비겁)를 바탕으로 자신만의 고유한 재능(식상)을 거침없이 발산해 즉각적인 부와 결과물(재성)로 연결짓는 "1인 기업가이자 인플루언서" 구조입니다.',
    bottleneckKey: 'wealth',
    bottleneckDesc: '표현력(식상)은 화려하지만 수익 모델(재성)이 부실하면, 아무리 바쁘게 움직여도 주머니에 남는 것이 없는 허무함을 느낍니다. 매 순간 "이 움직임이 실질적인 성과로 이어지는가?"를 날카롭게 점검해야 합니다.',
    coachingStrength: '당신이라는 사람 자체가 곧 강력한 브랜드이자 가장 비싼 자산입니다. 타인의 시선을 전혀 의식하지 않고 직관적인 아이디어를 즉시 행동으로 옮기는 실행력이 타의 추종을 불허하며 무에서 유를 창조하는 힘이 넘칩니다.',
    coachingShadow: '본인의 끓어오르는 영감에 지나치게 취해 있다 보면 현실적인 시장 요구(수익성, 데이터)를 간과하게 됩니다. 또한 타인의 지시를 극도로 꺼려 장기적인 파트너십 구축이나 안정적인 자산 축적에 어려움을 겪을 수 있습니다.',
    activationQ: '"화려한 구상을 멈추고 질문해 봅시다. 오늘 내 재능을 곧장 구체적인 수익(데이터)으로 환산해 줄 한 가지 행동은 무엇입니까?"',
    careers: ['프리랜서 크리에이터', '스타트업 창업', '예술가·디자이너', '유튜버·인플루언서', '개인 사업'],
    neuroAnalysis: "뇌의 보상 회로(도파민 시스템)가 '직접적인 성취와 수익 창출'에 가장 즉각적으로 반응합니다. 중간 단계의 의심이나 망설임을 건너뛰고 자아의 욕망을 행동으로 즉각 전환시키는 행동주의적 신경망이 지배적입니다.",
    behavioralTactic: "행동이 앞서다 디테일(비용, 리스크)을 놓치는 인지적 맹점이 있습니다. 새로운 아이디어를 행동에 옮기기 직전, 단 3개의 체크리스트(투입 리소스, 마진율, 출구 전략)를 거치는 인지적 브레이크를 강제로 설치하십시오."
  },
  {
    key: 'SikJaeGwan',
    korName: '식재관 (食財官)',
    engName: 'OUTPUT → WEALTH → POWER',
    tags: ['output', 'wealth', 'power'],
    label: ['식상(食傷)', '재성(財星)', '관성(官星)'],
    mode: ['SHIFT', 'GAIN', 'CTRL'],
    color: '#fbbf24',
    archetype: '결과 증명형 마스터마인드 (Execution Mastermind)',
    summary: '**식상생재(食傷生財)**를 거쳐 **재생관(財生官)**으로 이어지는 가장 치열하고 실전적인 구조입니다. 끊임없는 실행력(식상)으로 자원(재성)을 거침없이 끌어모으고, 축적된 자본을 바탕으로 시스템과 권력(관성)마저 기필코 장악해 내는 궁극의 "현실 지배자"입니다.',
    bottleneckKey: 'power',
    bottleneckDesc: '돈을 벌어들이는 능력(재성)은 차고 넘치지만, 그것을 지킬 담장(관성)이 설계되지 않으면 번 만큼 빠져나가는 "밑 빠진 독"이 됩니다. 개인의 무한 노동을 멈추고, 자고 있을 때도 돌아가는 자동화 시스템 구축이 절실합니다.',
    coachingStrength: '어떤 압박에도 굴하지 않고 실패마저 비료로 써먹는 극강의 현실 감각을 지녔습니다. 추상적인 철학보다는 "숫자와 성과"로 확실히 증명해 내는 실전형 리더로, 폭발적인 투지로 반드시 목표를 달성해 내는 타의 추종을 불허하는 재능이 있습니다.',
    coachingShadow: '지나치게 목적 지향적으로 폭주하다 보면 자신을 혹사시켜 돌이킬 수 없는 번아웃을 맞이하거나, 가장 가까운 관계들의 감정을 무심하게 메마르게 할 수 있습니다. 모든 것을 득실로만 평가하는 차가운 함정을 주의하세요.',
    activationQ: '"당신의 피나는 노동 없이도 톱니바퀴처럼 저절로 굴러가도록, 오늘 당장 위임하거나 자동화할 수 있는 업무는 무엇입니까?"',
    careers: ['사업가·기업인', '세일즈·마케팅', '투자자', '프로젝트 매니저', '공직·행정가'],
    neuroAnalysis: "결과 중심의 목표 달성을 지시하는 대뇌기저핵이 폭발적으로 동기화됩니다. 에너지를 분산시키지 않고 권력과 자원을 쟁취하는 데 모든 시냅스 전위를 집중시키는 궁극의 포식자 뇌(Predator Brain) 구조입니다.",
    behavioralTactic: "자원을 내 통제하에 둬야 한다는 '통제 환상(Illusion of Control)'이 번아웃을 유발합니다. 내가 직접 모든 것을 쥐고 있는 대신, 시스템과 타인에게 권한의 80%를 위임하고 결과만 모니터링하는 위임 훈련을 시작하십시오."
  },
  {
    key: 'JaeGwanIn',
    korName: '재관인 (財官印)',
    engName: 'WEALTH → POWER → RESOURCE',
    tags: ['wealth', 'power', 'resource'],
    label: ['재성(財星)', '관성(官星)', '인성(印星)'],
    mode: ['GAIN', 'CTRL', 'SCAN'],
    color: '#f97316',
    archetype: '전략적 제국의 통치자 (Strategic Emperor)',
    summary: '**재생관(財生官)**과 **관인상생(官印相生)**의 원리가 결합된 구조입니다. 탁월한 성과(재성)로 사회적 지위(관성)를 획득한 뒤, 대중의 인정과 철학적 정통성(인성)까지 완벽히 거머쥐는 "완성형 권력자"의 구조입니다.',
    bottleneckKey: 'resource',
    bottleneckDesc: '부와 권력은 손에 넣었으나, 그것을 지탱할 내면의 철학(인성)이 비어있다면 한순간에 모래성처럼 무너집니다. 물질적 최정상에서 밀려오는 "내가 왜 이렇게 살아왔나?"라는 허무함을 막아줄 흔들림 없는 인생의 신념이 시급합니다.',
    coachingStrength: '냉철한 상황 판단력, 거대한 조직을 거시적으로 통제하는 리더십, 얽힌 이해관계를 날카롭게 꿰뚫는 비즈니스 감각까지. 세상 생태계의 룰을 그 누구보다 잘 파악하고 있으며 숭고한 큰 그림 위에서 판을 짜는 능력은 타의 추종을 불허합니다.',
    coachingShadow: '승리하는 것(수단)에 매몰되어 삶의 진정한 의미(목적)를 잃어버리기 매우 쉽습니다. 철저히 계산된 관계망 속에서 늘 긴장하고 타인을 의심하다 보니 깊고 솔직한 나눔을 하지 못해 고독하고 방어적인 태도로 굳어질 위험이 큽니다.',
    activationQ: '"만약 지금 가진 타이틀과 자산을 내일 모두 내려놓아야 한다면, 세상에 남겨둘 당신만의 오리지널한 진짜 이름과 가치는 무엇입니까?"',
    careers: ['경영자·CEO', '정치인·행정가', '법조인', '금융·투자 전문가', '조직 리더'],
    neuroAnalysis: "거시적 메타인지(Meta-Cognition)와 사회적 서열을 파악하는 전두극 피질(Frontopolar Cortex)이 고도로 활성화되어 있습니다. 파편화된 사실들 속에서 시스템의 룰과 권력의 흐름을 읽어내는 시냅스 패턴 매칭이 압도적입니다.",
    behavioralTactic: "모든 상황을 전략과 손익으로만 계산하려는 인지적 편향이 감정적 고립을 부릅니다. 하루에 단 10분, 철저히 목적과 계산이 배제된 '무용한 일'(산책, 명상, 예술 감상)에 뇌의 디폴트 모드 네트워크(DMN)를 개방하십시오."
  },
  {
    key: 'GwanInBi',
    korName: '관인비 (官印比)',
    engName: 'POWER → RESOURCE → SELF',
    tags: ['power', 'resource', 'self'],
    label: ['관성(官星)', '인성(印星)', '비겁(比劫)'],
    mode: ['CTRL', 'SCAN', 'SYNC'],
    color: '#60a5fa',
    archetype: '외유내강형 신뢰의 기둥 (Resilient Guardian)',
    summary: '명리학 최고의 방어 기제인 **관인상생(官印相生)**을 통해, 외부의 엄격한 압박과 책임감(관성)을 부드럽게 수용하여 지혜(인성)로 승화시킨 후, 흔들리지 않는 굳건한 내면(비겁)을 완성해 내는 "성숙한 멘토"의 구조입니다.',
    bottleneckKey: 'self',
    bottleneckDesc: '남들의 기대와 잣대(관성)에 짓눌려 주체성(비겁)을 잃어버리는 순간, "착한 사람 증후군"에 빠져 스스로를 무한대 희생하게 됩니다. 겉으로는 평온해도 속으로는 분노가 곪아가므로 고품격 거절의 기술을 갖추는 것이 핵심 생존 무기입니다.',
    coachingStrength: '당신의 가장 대체 불가능한 매력은 타인에게 안도를 주는 엄청난 "신뢰감"과 흔들림 없는 "품격"입니다. 어느 무리에서도 크게 부딪히지 않으면서 특유의 인내심과 깊은 통찰력으로 사람들의 마음을 얻어, 결국 소리 없이 조직의 핵심 권력을 움켜쥐는 진정한 실세입니다.',
    coachingShadow: '조직과 규칙의 안전망 안에만 머무르다 보면 도전을 지나치게 두려워하고 변화에 무감각해집니다. 지나치게 타인의 평가와 체면을 중시하여 정작 본인이 진정으로 무엇을 원하는지 가슴 뛰는 설렘을 잊고 무기력하게 순응할 위험이 큽니다.',
    activationQ: '"아무도 당신에게 기대하지 않거나 평가하지 않는다면, 오늘 하루 당신의 내면이 미치도록 저지르고 싶은 유쾌한 일탈은 무엇입니까?"',
    careers: ['공무원·행정직', '전문직(의사·변호사)', '학자·연구원', '대기업 관리직', '컴플라이언스 전문가'],
    neuroAnalysis: "외부의 압력을 방어하고 심리적 안전을 도모하는 부교감 신경계가 매우 섬세하게 세팅되어 있습니다. 타인의 위협이나 기대를 지혜로 완충한 뒤 자신의 에너지로 변환시키는 회복탄력성 회로(Resilience Circuit)가 강력합니다.",
    behavioralTactic: "타인의 기대치(관성)에 짓눌려 진짜 자아(비겁)가 침묵하면 무기력과 수동적 공격성이 폭발합니다. 타인을 배제한 채 오직 '나의 1차원적인 원초적 욕구'만을 솔직하게 적어내는 저널링(Journaling)으로 자아 피질을 매일 깨우십시오."
  },
];

// ─────────────────────────────────────────────
// 점수 계산 엔진
// ─────────────────────────────────────────────
function calcFlowScores(tg: TenGods): { def: FlowDef; score: number; pcts: [number, number, number]; active: boolean }[] {
  const total = tg.resource + tg.self + tg.output + tg.wealth + tg.power || 1;

  return FLOW_DEFS.map(def => {
    const [t0, t1, t2] = def.tags;
    const v0 = tg[t0], v1 = tg[t1], v2 = tg[t2];
    const flowSum = v0 + v1 + v2;

    // 흐름 강도 점수: 합산 비율 × 흐름 균형(표준편차 보정)
    const avg = flowSum / 3;
    const stdDev = Math.sqrt(((v0 - avg) ** 2 + (v1 - avg) ** 2 + (v2 - avg) ** 2) / 3);
    const balanceBonus = Math.max(0, 1 - stdDev / (avg + 0.001)); // 균형잡힐수록 보너스

    // t0→t1 순방향 우선 보정 (첫 번째가 두 번째보다 클 때)
    const flowBonus = v0 >= v1 ? 1.1 : 0.9;

    const rawScore = (flowSum / total) * 100 * balanceBonus * flowBonus;
    const score = Math.min(99, Math.round(rawScore));

    const pcts: [number, number, number] = [
      Math.round((v0 / total) * 100),
      Math.round((v1 / total) * 100),
      Math.round((v2 / total) * 100),
    ];

    // 활성 기준 수정: 최종 계산된 score 기준(35점 이상) 및 3개 노드 모두 존재할 것
    const active = score >= 35 && v0 > 0 && v1 > 0 && v2 > 0;

    return { def, score, pcts, active, isBroken: v0 === 0 || v1 === 0 || v2 === 0 };
  }).sort((a, b) => b.score - a.score);
}

function calcPercentages(tg: TenGods): TenGods {
  const total = tg.resource + tg.self + tg.output + tg.wealth + tg.power || 1;
  return {
    resource: Math.round((tg.resource / total) * 100),
    self: Math.round((tg.self / total) * 100),
    output: Math.round((tg.output / total) * 100),
    wealth: Math.round((tg.wealth / total) * 100),
    power: Math.round((tg.power / total) * 100),
  };
}

// ─────────────────────────────────────────────
// 미니 바 그래프 (개별 노드용)
// ─────────────────────────────────────────────
const MiniGauge = ({ label, pct, color, isBottleneck }: {
  label: string; pct: number; color: string; isBottleneck: boolean;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-slate-400 w-14 shrink-0">{label}</span>
    <div className="flex-1 h-2 bg-slate-700/60 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: isBottleneck ? '#ef4444' : color }}
      />
    </div>
    <span className="text-[10px] font-bold w-8 text-right" style={{ color: isBottleneck ? '#f87171' : color }}>
      {pct}%
    </span>
    {isBottleneck && <span className="text-[8px] text-red-400">🚨</span>}
  </div>
);

// ─────────────────────────────────────────────
// 메인 패턴 점수 바
// ─────────────────────────────────────────────
const PatternBar = ({
  result, rank, isSelected, onClick
}: {
  result: { def: FlowDef; score: number; active: boolean };
  rank: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const { def, score, active } = result;
  const rankColors = ['#fbbf24', '#9ca3af', '#cd7c32', '#60a5fa', '#a78bfa'];
  const rankColor = rankColors[rank] || '#6b7280';

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'border-white/20 bg-slate-800/80 shadow-lg scale-[1.01]'
          : 'border-slate-700/40 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center text-black" style={{ background: rankColor }}>
            {rank + 1}
          </span>
          <span className="text-sm font-bold text-white">{def.korName}</span>
          {active ? (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-700/60 text-emerald-200">ACTIVE</span>
          ) : (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded border border-slate-600/50 bg-slate-800/80 text-slate-400">
              {(result as any).isBroken ? '연결 단절' : '에너지 미달'}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-black leading-none" style={{ color: active ? def.color : '#4b5563' }}>
            {score}<span className="text-xs font-medium opacity-70">%</span>
          </span>
          <span className="text-[8px] font-mono tracking-widest uppercase opacity-60 mt-1" style={{ color: active ? def.color : '#4b5563' }}>
            Synaptic Sync
          </span>
        </div>
      </div>

      <div className="flex gap-1 mb-2">
        {def.label.map((l, i) => (
          <React.Fragment key={i}>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
              style={{ background: active ? `${def.color}20` : '#1e293b', color: active ? def.color : '#4b5563', border: `1px solid ${active ? def.color + '40' : '#334155'}` }}>
              {def.mode[i]}
            </span>
            {i < 2 && <span className="text-[9px] text-slate-600 self-center">›</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: rank * 0.12 }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${def.color}80, ${def.color})`,
            opacity: active ? 1 : 0.6,
            filter: active ? 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' : 'none'
          }}
        />
      </div>

      {isSelected && (
        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
          {def.summary}
        </p>
      )}
    </motion.button>
  );
};

// ─────────────────────────────────────────────
// 상세 코칭 패널
// ─────────────────────────────────────────────
const DetailPanel = ({ result, pcts, gongmang }: {
  result: { def: FlowDef; score: number; pcts: [number, number, number]; active: boolean };
  pcts: TenGods;
  gongmang?: Gongmang;
}) => {
  const { def, score, active } = result;

  return (
    <motion.div
      key={def.key}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: `${def.color}30` }}
    >
      {/* 헤더 */}
      <div className="p-5" style={{ background: `linear-gradient(135deg, ${def.color}12, transparent)` }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] tracking-widest font-mono text-slate-400 uppercase">{def.engName}</span>
          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${active ? 'text-emerald-200 bg-emerald-800/60' : 'text-slate-400 bg-slate-700/60'}`}>
            {active ? '✅ 활성화됨' : '⬜ 비활성'}
          </span>
        </div>
        <h3 className="text-xl font-extrabold mb-0.5" style={{ color: def.color }}>{def.korName}</h3>
        <p className="text-xs text-slate-400">{def.archetype}</p>
      </div>

      <div className="p-5 space-y-5">
        {/* 3노드 게이지 */}
        <div className="space-y-2.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">パイプライン 현황</p>
          {def.tags.map((tag, i) => (
            <MiniGauge
              key={tag}
              label={def.label[i]}
              pct={pcts[tag]}
              color={def.color}
              isBottleneck={tag === def.bottleneckKey && pcts[tag] < 12}
            />
          ))}
        </div>

        {/* 시스템 분석 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
            <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">CORE STRENGTH</p>
            <p className="text-xs text-slate-300 leading-relaxed">{def.coachingStrength}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
            <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-2">SHADOW PATTERN</p>
            <p className="text-xs text-slate-300 leading-relaxed">{def.coachingShadow}</p>
          </div>
        </div>

        {/* 병목 경고 */}
        {pcts[def.bottleneckKey] < 12 && (
          <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
            <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-1">🚨 BOTTLENECK DETECTED</p>
            <p className="text-xs text-red-200/80 leading-relaxed">{def.bottleneckDesc}</p>
          </div>
        )}

        {/* 공망 감지 */}
        {gongmang?.isActive && (
          <div className="p-3.5 rounded-xl bg-yellow-950/30 border border-yellow-500/30">
            <p className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold mb-1">
              ⚡ 공망(Quantum Void) 감지 — {gongmang.labels.join('·')}
            </p>
            <p className="text-xs text-yellow-100/80 leading-relaxed">
              공망 기둥의 에너지는 체감보다 현실화가 어렵습니다. 이 흐름 패턴의 특정 노드에서 레이턴시(실행 지연)가 발생할 수 있습니다.
            </p>
          </div>
        )}

        {/* 커리어 */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">OPTIMAL ROLES</p>
          <div className="flex flex-wrap gap-1.5">
            {def.careers.map(c => (
              <span key={c} className="text-[10px] px-2 py-1 rounded-full font-bold"
                style={{ background: `${def.color}18`, color: def.color, border: `1px solid ${def.color}40` }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* 심층 뇌과학 코칭 (Deep Neuro-Analysis) */}
        <div className="p-4 rounded-xl border relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${def.color}10, transparent)`, borderColor: `${def.color}30` }}>
          <div className="absolute top-0 left-0 w-1 h-full" style={{ background: def.color }}></div>
          <div className="space-y-4 ml-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-mono font-bold mb-1.5 flex items-center gap-1.5" style={{ color: def.color }}>
                <span className="text-sm">🧠</span> Deep Neuro-Analysis
              </p>
              <h4 className="text-sm font-bold text-white mb-1.5">뇌과학적 행동 기전</h4>
              <p className="text-xs text-slate-300 leading-relaxed break-keep">{def.neuroAnalysis}</p>
            </div>
            <div className="w-full h-px bg-slate-700/50"></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-mono font-bold mb-1.5 flex items-center gap-1.5 text-amber-400">
                <span className="text-sm">⚔️</span> Cognitive Tactic
              </p>
              <h4 className="text-sm font-bold text-amber-100 mb-1.5">행동 교정 전술</h4>
              <p className="text-xs text-amber-200/80 leading-relaxed break-keep">{def.behavioralTactic}</p>
            </div>
          </div>
        </div>

        {/* 활성화 질문 */}
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
          <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-2">❓ ACTIVATION QUESTION</p>
          <p className="text-sm font-bold text-cyan-100 italic leading-relaxed">{def.activationQ}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// 레이더 차트 (5각형 SVG)
// ─────────────────────────────────────────────
const RadarChart = ({ scores }: { scores: { def: FlowDef; score: number; active: boolean }[] }) => {
  const size = 120;
  const cx = size / 2, cy = size / 2;
  const R = size / 2 - 16;

  const angles = scores.map((_, i) => (i / scores.length) * 2 * Math.PI - Math.PI / 2);
  const pts = (r: number) => angles.map((a, i) => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
    score: scores[i].score,
    active: scores[i].active,
    color: scores[i].def.color,
  }));

  const valuePts = pts(R).map((p, i) => ({
    ...p,
    x: cx + (R * scores[i].score / 100) * Math.cos(angles[i]),
    y: cy + (R * scores[i].score / 100) * Math.sin(angles[i]),
  }));

  const gridPts = (frac: number) => pts(R * frac);
  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* 배경 그리드 */}
        {[0.25, 0.5, 0.75, 1].map((f, i) => (
          <path key={i} d={toPath(gridPts(f))} fill="none" stroke="#334155" strokeWidth="0.5" />
        ))}
        {/* 축선 */}
        {angles.map((a, i) => (
          <line key={i} x1={cx} y1={cy}
            x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)}
            stroke="#334155" strokeWidth="0.5" />
        ))}
        {/* 값 영역 */}
        <motion.path
          d={toPath(valuePts)}
          fill="rgba(167,139,250,0.15)"
          stroke="#a78bfa"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* 꼭짓점 점 */}
        {valuePts.map((p, i) => (
          <motion.circle
            key={i} cx={p.x} cy={p.y} r={3}
            fill={scores[i].active ? scores[i].def.color : '#4b5563'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        ))}
      </svg>
      {/* 범례 */}
      <div className="mt-3 space-y-1 w-full">
        {scores.map((s, i) => (
          <div key={s.def.key} className="flex items-center justify-between text-[9px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: s.active ? s.def.color : '#4b5563' }} />
              <span className="text-slate-400">{s.def.korName.split(' ')[0]}</span>
            </div>
            <span className="font-bold" style={{ color: s.active ? s.def.color : '#4b5563' }}>{s.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export default function SajuArchitectureFlow({
  tenGods, ohaeng, gongmang, dayStem, userName = '사용자'
}: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const tg = useMemo<TenGods>(() => {
    if (tenGods && (tenGods.resource + tenGods.self + tenGods.output + tenGods.power + tenGods.wealth) > 0) return tenGods;
    if (ohaeng) {
      const metalStems = ['庚', '辛'];
      if (metalStems.includes(dayStem || '')) return { resource: ohaeng.earth, self: ohaeng.metal, output: ohaeng.water, wealth: ohaeng.wood, power: ohaeng.fire };
      return { resource: ohaeng.water, self: ohaeng.wood, output: ohaeng.fire, wealth: ohaeng.earth, power: ohaeng.metal };
    }
    return { resource: 2, self: 3, output: 1, wealth: 1, power: 1 };
  }, [tenGods, ohaeng, dayStem]);

  const flowResults = useMemo(() => calcFlowScores(tg), [tg]);
  const pcts = useMemo(() => calcPercentages(tg), [tg]);

  const activeCount = flowResults.filter(r => r.active).length;
  const topFlow = flowResults[0];
  const selectedResult = flowResults[selectedIdx];

  const lowestCoaching = useMemo(() => {
    const keys: (keyof TenGods)[] = ['resource', 'self', 'output', 'wealth', 'power'];
    const lowestKey = keys.reduce((a, b) => pcts[a] < pcts[b] ? a : b);
    
    const adviceMap: Record<keyof TenGods, { title: string, text: string }> = {
      resource: { title: '인성 부족 (수용력/지혜)', text: '인풋(휴식과 학습)이 고갈된 상태입니다. 무조건 멈추고 멍때리거나 책을 읽어 마음 내면을 채우는 "단절의 휴식"을 확보해야 인생을 롱런할 수 있습니다.' },
      self: { title: '비겁 부족 (자아/주체성)', text: '타인의 시선이나 거절에 쉽게 휘둘릴 수 있습니다. 남의 불편한 부탁을 쿨하게 거절하는 미움받을 용기를 내어, 나만의 물리적/심리적 시간을 지키는 훈련이 시급합니다.' },
      output: { title: '식상 부족 (표현/실행력)', text: '머릿속 생각만 많고 진짜 첫발을 떼지 못합니다. 완벽한 구상만 하려 들지 말고, 아주 하찮은 것이라도 오늘 당장 "눈에 보이는 결과물" 하나를 세상에 배포해 보세요.' },
      wealth: { title: '재성 부족 (현실감각/수익화)', text: '이리저리 열심히 움직이지만 결국 내 손에 쥐어지는 결실(수치)이 흩어지고 있습니다. 지금 당신이 하는 행동이 "명시적인 이익(수치화된 데이터)"으로 이어지는지 냉정하게 점검해야 합니다.' },
      power: { title: '관성 부족 (통제력/시스템)', text: '틀에 얽매이길 싫어해 시작은 빠르고 자유롭지만 지루한 마무리가 늘 엉성해집니다. 개인의 노동력에만 의지하지 말고, 반복되는 일을 규칙 기반의 "자동화 패턴"으로 묶어 시스템화 하세요.' }
    };
    return adviceMap[lowestKey];
  }, [pcts]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-sans">
      {/* 헤더 */}
      <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-cyan-400 font-mono uppercase">
              MYEONGSIM ARCHITECTURE ENGINE — FLOW PATTERN MATRIX
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">
              {userName}의 사주{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                시스템 흐름 전체 분석
              </span>
            </h2>
            <div className="text-slate-400 text-xs mt-2 space-y-1">
              <p>5대 뉴럴 네트워크(흐름 패턴) 스캔 — {activeCount > 0 ? `${activeCount}개 네트워크 활성화됨` : '단일 집중 구조'}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed max-w-lg mt-1 break-keep">
                * 퍼센트(%)는 해당 행동 패턴이 뇌 구조에서 얼마나 빠르고 강력하게 발현되는지를 나타내는 <strong className="text-slate-300">시냅스 동기화율(Synaptic Sync Rate)</strong>입니다. 점수가 높을수록 무의식적으로 즉각 발동되는 당신의 강력한 무기입니다.
              </p>
            </div>
          </div>
          {/* 핵심 패턴 뱃지 */}
          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">DOMINANT PATTERN</span>
            <span className="font-black text-sm px-3 py-1.5 rounded-full" style={{ background: `${topFlow.def.color}20`, color: topFlow.def.color, border: `1px solid ${topFlow.def.color}40` }}>
              {topFlow.def.korName}
            </span>
            <span className="text-[10px] text-slate-400">{topFlow.def.archetype}</span>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-6">
        {/* 전체 점수 바 + 레이더 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 왼쪽: 순위 바 (2/3) */}
          <div className="md:col-span-2 space-y-2.5">
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              📊 5대 흐름 패턴 점수 랭킹 — 탭하면 상세 코칭 열람
            </p>
            {flowResults.map((r, i) => (
              <PatternBar
                key={r.def.key}
                result={r}
                rank={i}
                isSelected={selectedIdx === i}
                onClick={() => setSelectedIdx(i)}
              />
            ))}
          </div>

          {/* 오른쪽: 레이더 차트 (1/3) */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3 text-center">
                PATTERN RADAR
              </p>
              <RadarChart scores={flowResults} />
            </div>

            {/* 십성 분포 원형 */}
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">
                십성(十星) 분포
              </p>
              <div className="space-y-2">
                {([
                  { key: 'resource' as const, label: '인성(印星)', color: '#a78bfa' },
                  { key: 'self'     as const, label: '비겁(比劫)', color: '#60a5fa' },
                  { key: 'output'   as const, label: '식상(食傷)', color: '#34d399' },
                  { key: 'wealth'   as const, label: '재성(財星)', color: '#fbbf24' },
                  { key: 'power'    as const, label: '관성(官星)', color: '#f87171' },
                ] as const).map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 w-14">{label}</span>
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pcts[key]}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                    <span className="text-[9px] font-bold w-7 text-right" style={{ color }}>{pcts[key]}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 초보자 관전 포인트 & 밸런스 개선 전략 */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 shadow-inner space-y-3">
              <div>
                <p className="text-[10px] text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                  💡 초보자 관전 포인트
                </p>
                <p className="text-[11px] text-emerald-100/90 leading-[1.6] break-keep">
                  오각형 그래프가 한 쪽으로 찌그러져 있나요? 전혀 나쁜 것이 아닙니다! 어느 한 분야의 에너지를 폭발적으로 쓸 수 있는 <strong>당신만의 '명확한 무기'</strong>가 있다는 뜻입니다. 가장 튀어나온 에너지를 무기 삼아 돌파하세요.
                </p>
              </div>
              <div className="pt-3 border-t border-emerald-500/10">
                <p className="text-[10px] text-red-400 font-bold mb-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                  🚨 시스템 밸런스 점검
                </p>
                <h4 className="text-[11px] font-bold text-slate-200 mb-1">
                  가장 취약한 에러(병목): <span className="text-red-300">{lowestCoaching.title}</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-[1.6] break-keep">
                  {lowestCoaching.text}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 코칭 패널 */}
        <div>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">
            🔬 선택된 패턴 상세 코칭 — {selectedResult.def.korName}
          </p>
          <AnimatePresence mode="wait">
            <DetailPanel
              key={selectedResult.def.key}
              result={selectedResult}
              pcts={pcts}
              gongmang={gongmang}
            />
          </AnimatePresence>
        </div>

        {/* 비활성 패턴 요약 */}
        {flowResults.some(r => !r.active) && (
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-3">
              ⬜ 비활성 패턴 (단절 또는 미달)
            </p>
            <div className="flex flex-wrap gap-2">
              {flowResults.filter(r => !r.active).map(r => (
                <button
                  key={r.def.key}
                  onClick={() => setSelectedIdx(flowResults.indexOf(r))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 hover:border-slate-600 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: r.def.color, opacity: 0.4 }} />
                  <span className="text-[10px] text-slate-400 font-medium">{r.def.korName}</span>
                  <span className="text-[9px] text-slate-500 font-bold">{r.score}% ({(r as any).isBroken ? '단절' : '미달'})</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-3 leading-relaxed break-keep">
              비활성 패턴은 현재 뇌 구조에서 필수 신경망(노드) 하나가 완전히 끊겨 있거나(연결 단절), 발동 에너지가 부족해(에너지 미달) 현실에서 온전히 쓰이지 못하는 흐름입니다. 클릭하여 원인과 교정 전술을 확인하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
