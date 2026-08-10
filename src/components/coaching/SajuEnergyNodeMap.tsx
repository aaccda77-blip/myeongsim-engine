'use client';
/**
 * SajuEnergyNodeMap.tsx
 * 사주 5대 에너지 노드 인터랙티브 맵
 * - 바디그래프 개념을 사주 데이터로 완전 대체
 * - 5개 에너지 노드(비겁/식상/재성/관성/인성)를 오각형 배치로 시각화
 * - 각 노드 크기 = 사용자 실제 데이터 비중(%)에 비례
 * - 노드 클릭 → 친절한 코칭 설명 팝업
 * - 노드 간 연결선 = 식신생재/관인상생 흐름 방향 화살표
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ───────────────────────────────────────────────
// 타입
// ───────────────────────────────────────────────
interface TenGods {
  resource: number; // 인성
  self: number;     // 비겁
  output: number;   // 식상
  wealth: number;   // 재성
  power: number;    // 관성
}

interface Props {
  tenGods?: TenGods;
  dayStem?: string; // 일간 한자 (甲,乙,...)
  userName?: string;
}

// ───────────────────────────────────────────────
// 5개 노드 메타데이터
// ───────────────────────────────────────────────
const NODE_META = [
  {
    key: 'resource' as keyof TenGods,
    hanja: '印',
    kor: '인성',
    keyword: '수용·사고',
    engLabel: 'RESOURCE',
    emoji: '📚',
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.12)',
    title: '인성 (印星) — 지혜와 수용의 에너지',
    tagline: '지식·학습·모성·보호',
    description: '다른 사람의 생각을 흡수하고 지식으로 자신을 키워 나가는 에너지입니다. 인성이 강한 사람은 자연스럽게 배움과 사유를 즐기며, 배운 것을 내면화하여 독자적 철학을 구축하는 능력이 뛰어납니다.',
    strength: '배움의 속도가 빠르고, 복잡한 이론도 곧바로 내 것으로 소화합니다. 주변에서 갈등이 생겨도 너그럽게 이해하며 품을 수 있는 \"마음의 넓이\"가 있습니다.',
    shadow: '인성이 과할 때는 의존성이 높아집니다. 어머니/기관/보호자에 대한 심리적 의존이 자립을 방해할 수 있습니다.',
    coaching: '매일 아침 15분, 당신만의 생각을 정리하는 "지혜 일기"를 써보세요. 머릿속에 쌓인 배움을 나만의 언어로 출력하는 순간, 진정한 지식이 됩니다.',
  },
  {
    key: 'self' as keyof TenGods,
    hanja: '比',
    kor: '비겁',
    keyword: '자아·독립',
    engLabel: 'SELF',
    emoji: '⚡',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.12)',
    title: '비겁 (比劫) — 자아와 주체성의 에너지',
    tagline: '독립·자존·경쟁·추진',
    description: '나다움을 지키고 독자적으로 판단하며 행동하는 에너지입니다. 비겁이 강한 사람은 강한 자존감과 독립심을 갖추고 있으며, 어떤 상황에서도 자신만의 궤도를 유지합니다.',
    strength: '타인의 시선에 흔들리지 않고 자신의 길을 걷는 배짱과 의지력이 있습니다. 어려운 환경도 혼자 돌파해 내는 강인한 자아를 갖추고 있습니다.',
    shadow: '비겁이 과할 때는 고집이 세고 협업이 어려워집니다. 경쟁 의식이 지나쳐 불필요한 마찰을 만들 수 있습니다.',
    coaching: '"오늘 나는 타인의 도움을 빌리지 않고 혼자 해낼 수 있는 것이 무엇인가?" 매일 그 한 가지를 실행하세요. 자아 근육이 두꺼워집니다.',
  },
  {
    key: 'output' as keyof TenGods,
    hanja: '食',
    kor: '식상',
    keyword: '표현·실행',
    engLabel: 'OUTPUT',
    emoji: '🎨',
    color: '#34d399',
    bgColor: 'rgba(52,211,153,0.12)',
    title: '식상 (食傷) — 표현과 창조의 에너지',
    tagline: '창의·표현·행동·재능',
    description: '내면에 품은 에너지를 밖으로 표현하고 실행하는 엔진입니다. 식상이 강한 사람은 말, 글, 예술, 아이디어 등 어떤 형태로든 자신을 강렬하게 표현하며, 이 과정에서 가장 큰 기쁨을 느낍니다.',
    strength: '누구도 생각 못 한 아이디어와 독보적인 표현 방식으로 사람들을 끌어당깁니다. 하나의 재능이 다음 재능으로 이어지는 창의적 연쇄 반응이 일어납니다.',
    shadow: '식상이 과할 때는 자기 통제가 어렵습니다. 충동적으로 말을 꺼내거나 너무 많은 일을 벌려 마무리를 못 하는 패턴이 생길 수 있습니다.',
    coaching: '"오늘 내가 세상에 내보낼 단 하나의 결과물은 무엇인가?" 완벽하지 않아도 좋습니다. 1%짜리 초안이라도 배포하는 것이 에너지를 순환시킵니다.',
  },
  {
    key: 'wealth' as keyof TenGods,
    hanja: '財',
    kor: '재성',
    keyword: '현실·결과',
    engLabel: 'WEALTH',
    emoji: '💎',
    color: '#fbbf24',
    bgColor: 'rgba(251,191,36,0.12)',
    title: '재성 (財星) — 현실과 수익의 에너지',
    tagline: '물질·현실·수익·책임',
    description: '현실 세계에서 결과물을 만들어내고 자원을 관리하는 에너지입니다. 재성이 강한 사람은 탁월한 현실 감각과 실용적 사고방식을 갖추고 있으며, 노력이 반드시 구체적인 결실로 이어지도록 만드는 능력이 있습니다.',
    strength: '현실적인 계산 능력과 자원 관리 능력이 뛰어납니다. 돈, 시간, 에너지를 낭비하지 않고 최적의 방향으로 투여하는 전략적 감각이 있습니다.',
    shadow: '재성이 과할 때는 물질적인 것에 집착하거나 지나치게 실리적으로 변할 수 있습니다. 관계를 득실로만 판단하는 냉정함이 고독함으로 이어질 수 있습니다.',
    coaching: '"오늘 내가 쏟은 시간/에너지 중, 실제 숫자(수익, 성과, 데이터)로 돌아오는 것은 무엇인가?" 이 질문을 매일 써보세요. 현실화 근육이 강해집니다.',
  },
  {
    key: 'power' as keyof TenGods,
    hanja: '官',
    kor: '관성',
    keyword: '규칙·통제',
    engLabel: 'POWER',
    emoji: '🏛️',
    color: '#f87171',
    bgColor: 'rgba(248,113,113,0.12)',
    title: '관성 (官星) — 통제와 시스템의 에너지',
    tagline: '규율·통제·명예·구조화',
    description: '외부의 규칙과 사회적 시스템 속에서 나의 위치와 역할을 규정하는 에너지입니다. 관성이 강한 사람은 책임감 있는 리더십과 조직 구조를 설계·운영하는 능력이 탁월하며, 사회적 명예와 인정을 중요하게 여깁니다.',
    strength: '어떤 혼돈 속에서도 질서를 만들어내고 조직을 체계적으로 운영하는 능력이 있습니다. 한번 세운 시스템이 혼자 돌아가도록 만들어 지속 가능한 성과를 창출합니다.',
    shadow: '관성이 과할 때는 지나치게 규칙과 통제에 집착하며 유연성을 잃습니다. 내 안의 자유로운 창의성이 억눌릴 수 있습니다.',
    coaching: '"내가 반복하는 일 중 자동화(위임/시스템화)할 수 있는 것은 무엇인가?" 이 질문이 당신의 에너지를 성장에 집중하게 만드는 열쇠입니다.',
  },
];

// ───────────────────────────────────────────────
// 5개 노드 연결선 메타데이터 (흐름 방향)
// ───────────────────────────────────────────────
const FLOW_CONNECTIONS = [
  { from: 'resource', to: 'self',    label: '인성生비겁', desc: '지식이 자아를 성장시킵니다', color: '#a78bfa' },
  { from: 'self',     to: 'output',  label: '비겁生식상', desc: '자아가 표현을 만들어냅니다', color: '#60a5fa' },
  { from: 'output',   to: 'wealth',  label: '식신생재(食傷生財)', desc: '재능이 현실적 부로 이어집니다', color: '#34d399', highlighted: true },
  { from: 'wealth',   to: 'power',   label: '재생관(財生官)', desc: '자원이 권력을 만들어냅니다', color: '#fbbf24' },
  { from: 'power',    to: 'resource', label: '관인상생(官印相生)', desc: '통제가 지혜를 길러냅니다', color: '#f87171', highlighted: true },
];

// ───────────────────────────────────────────────
// SVG 오각형 노드 좌표 계산
// ───────────────────────────────────────────────
// 상단 → 시계방향: resource(상단), self(우상), output(우하), wealth(좌하), power(좌상)
const NODE_ORDER: (keyof TenGods)[] = ['resource', 'self', 'output', 'wealth', 'power'];

function getPentagonPoints(cx: number, cy: number, R: number) {
  return NODE_ORDER.map((_, i) => {
    const angle = ((i / 5) * 2 * Math.PI) - Math.PI / 2;
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  });
}

// ───────────────────────────────────────────────
// 메인 컴포넌트
// ───────────────────────────────────────────────
export default function SajuEnergyNodeMap({ tenGods, dayStem = '?', userName = '사용자' }: Props) {
  const [selectedNode, setSelectedNode] = useState<keyof TenGods | null>(null);
  const [showFlowGuide, setShowFlowGuide] = useState(false);

  // 기본 데이터 (tenGods 없으면 샘플)
  const tg = tenGods ?? { resource: 2, self: 3, output: 1, wealth: 1, power: 1 };

  // 퍼센트 계산
  const total = Object.values(tg).reduce((a, b) => a + b, 0) || 1;
  const pcts: Record<keyof TenGods, number> = {
    resource: Math.round((tg.resource / total) * 100),
    self:     Math.round((tg.self / total) * 100),
    output:   Math.round((tg.output / total) * 100),
    wealth:   Math.round((tg.wealth / total) * 100),
    power:    Math.round((tg.power / total) * 100),
  };

  // 가장 강한 / 가장 약한 노드
  const strongestKey = (Object.keys(pcts) as (keyof TenGods)[]).reduce((a, b) => pcts[a] > pcts[b] ? a : b);
  const weakestKey   = (Object.keys(pcts) as (keyof TenGods)[]).reduce((a, b) => pcts[a] < pcts[b] ? a : b);

  // SVG 사이즈 & 여백 확장 (클리핑 방지)
  const SVG_SIZE = 320;
  const CX = SVG_SIZE / 2;
  const CY = SVG_SIZE / 2;
  const R = 78;
  const pentagons = getPentagonPoints(CX, CY, R);

  const selectedMeta = selectedNode ? NODE_META.find(n => n.key === selectedNode) : null;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-700/40 bg-slate-900/60 shadow-2xl">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono text-purple-400 tracking-widest uppercase mb-1">
              MYEONGSIM · NEURAL BEHAVIOR STATS
            </p>
            <h3 className="text-lg font-extrabold text-white break-keep">
              {userName}의 5대 행동 스탯 (오각형 능력치)
            </h3>
            <p className="text-[11px] text-slate-400 mt-1.5 break-keep leading-relaxed max-w-sm font-normal">
              * 게임 캐릭터의 능력치 스탯처럼, 당신의 뇌가 정보를 처리하는 5대 에너지 비율을 나타냅니다. 
              <strong className="text-purple-300"> 크게 튀어나온 영역이 당신의 '특화 무기'</strong>입니다. 노드를 탭해보세요.
            </p>
          </div>
          <button
            onClick={() => setShowFlowGuide(!showFlowGuide)}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-purple-500/40 text-purple-300 bg-purple-900/20 hover:bg-purple-900/40 transition-all shrink-0 ml-2"
          >
            {showFlowGuide ? '🔷 5대 스탯 지도 보기' : '⚡ 상생 흐름 보기'}
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* ── 왼쪽: SVG 에너지 맵 ── */}
          <div className="flex flex-col items-center w-full">
            <div className="relative flex flex-col items-center w-full">
              <svg viewBox="0 0 320 320" className="w-full max-w-[280px] sm:max-w-[320px] h-auto overflow-visible drop-shadow-2xl">
                {/* 배경 동심원 그리드 */}
                {[0.25, 0.5, 0.75, 1].map((f, i) => (
                  <polygon
                    key={i}
                    points={getPentagonPoints(CX, CY, R * f).map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#334155"
                    strokeWidth={0.5}
                  />
                ))}

                {/* 연결선 (흐름 방향) */}
                {FLOW_CONNECTIONS.map((conn, ci) => {
                  const fromIdx = NODE_ORDER.indexOf(conn.from as keyof TenGods);
                  const toIdx   = NODE_ORDER.indexOf(conn.to   as keyof TenGods);
                  const fp = pentagons[fromIdx];
                  const tp = pentagons[toIdx];
                  return (
                    <motion.line
                      key={ci}
                      x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
                      stroke={conn.highlighted ? conn.color : '#334155'}
                      strokeWidth={conn.highlighted ? 2 : 1}
                      strokeDasharray={conn.highlighted ? 'none' : '3 3'}
                      opacity={conn.highlighted ? 0.8 : 0.3}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: conn.highlighted ? 0.8 : 0.3 }}
                      transition={{ delay: ci * 0.1 }}
                    />
                  );
                })}

                {/* 사용자 에너지 영역 (비율로 채워진 오각형) */}
                <motion.polygon
                  points={NODE_ORDER.map((key, i) => {
                    const pct = pcts[key] / 100;
                    const angle = ((i / 5) * 2 * Math.PI) - Math.PI / 2;
                    const r = R * Math.max(0.05, pct * 2.5);
                    return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`;
                  }).join(' ')}
                  fill="rgba(167,139,250,0.15)"
                  stroke="#a78bfa"
                  strokeWidth={1.5}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ transformOrigin: `${CX}px ${CY}px` }}
                />

                {/* 각 노드 원형 버튼 */}
                {NODE_META.map((meta, i) => {
                  const pt = pentagons[i];
                  const pct = pcts[meta.key];
                  const isSelected = selectedNode === meta.key;
                  const isStrongest = meta.key === strongestKey;
                  const isWeakest   = meta.key === weakestKey;
                  const radius = Math.max(22, Math.min(34, 18 + pct * 0.45)); // 텍스트가 잘 보이도록 반경 팽창

                  return (
                    <g key={meta.key} onClick={() => setSelectedNode(isSelected ? null : meta.key)} className="cursor-pointer">
                      {/* 강점 노드 글로우 */}
                      {isStrongest && (
                        <motion.circle
                          cx={pt.x} cy={pt.y} r={radius + 8}
                          fill={`${meta.color}20`}
                          animate={{ r: [radius + 6, radius + 12, radius + 6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {/* 노드 본체 */}
                      <motion.circle
                        cx={pt.x} cy={pt.y} r={radius}
                        fill={isSelected ? meta.color : meta.bgColor}
                        stroke={meta.color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.5, type: 'spring' }}
                        whileHover={{ scale: 1.15 }}
                      />
                      {/* 취약 노드 X 표시 */}
                      {isWeakest && (
                        <text x={pt.x + radius - 4} y={pt.y - radius + 4} textAnchor="middle" fontSize={10} fill="#f87171">⚠</text>
                      )}
                      {/* 한글 직관적 네이밍 */}
                      <text x={pt.x} y={pt.y - 4} textAnchor="middle" fontSize={10} fontWeight="bold" fill={isSelected ? '#fff' : meta.color}>
                        {meta.kor}
                      </text>
                      {/* 키워드 설명 */}
                      <text x={pt.x} y={pt.y + 6} textAnchor="middle" fontSize={8} fill={isSelected ? '#e2e8f0' : '#94a3b8'}>
                        {meta.keyword}
                      </text>
                      {/* % 수치 */}
                      <text x={pt.x} y={pt.y + 15} textAnchor="middle" fontSize={8} fontWeight="bold" fill={isSelected ? '#fff' : '#64748b'}>
                        {pct}%
                      </text>
                    </g>
                  );
                })}

                {/* 중앙 일간 */}
                <circle cx={CX} cy={CY} r={22} fill="#0f172a" stroke="#334155" strokeWidth={1.5} />
                <text x={CX} y={CY - 3} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#e2e8f0">{dayStem}</text>
                <text x={CX} y={CY + 10} textAnchor="middle" fontSize={7} fill="#64748b">일간</text>
              </svg>

              {/* 강점/취약 배지 (잘림 방지 flex-wrap) */}
              <div className="flex flex-wrap justify-center gap-2 mt-4 w-full px-2">
                {[
                  { key: strongestKey, label: '최강 에너지', icon: '✨' },
                  { key: weakestKey,   label: '취약 에너지', icon: '⚠️' },
                ].map(({ key, label, icon }) => {
                  const m = NODE_META.find(n => n.key === key)!;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedNode(key)}
                      className="px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all hover:scale-105 shrink-0"
                      style={{ color: m.color, borderColor: `${m.color}50`, backgroundColor: m.bgColor }}
                    >
                      {icon} {label}: {m.kor}({pcts[key]}%)
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 오른쪽: 선택 노드 패널 or 흐름 가이드 ── */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {showFlowGuide ? (
                <motion.div
                  key="flow"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">에너지 흐름 가이드</p>
                  {FLOW_CONNECTIONS.map((conn, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border transition-all shadow-md"
                      style={{
                        borderColor: conn.highlighted ? `${conn.color}40` : '#334155',
                        backgroundColor: conn.highlighted ? `${conn.color}10` : 'rgba(15,23,42,0.4)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {conn.highlighted && <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">핵심 흐름</span>}
                        <span className="text-[11px] font-bold" style={{ color: conn.color }}>{conn.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium">{conn.desc}</p>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-900/10 mt-2">
                    <p className="text-[10px] font-bold text-cyan-400 mb-1">💡 초보자 포인트</p>
                    <p className="text-[11px] text-slate-300 break-keep leading-relaxed">
                      오각형이 한 쪽으로 찌그러져 있어도 괜찮습니다! 그건 당신의 에너지가 특정 방향으로 강하게 압축된 "특화 무기"를 갖고 있다는 뜻입니다. 가장 큰 노드를 최대한 활용하는 전략이 정답입니다.
                    </p>
                  </div>
                </motion.div>
              ) : selectedMeta ? (
                <motion.div
                  key={selectedMeta.key}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {/* 노드 헤더 */}
                  <div className="p-4 rounded-xl border relative overflow-hidden" style={{ borderColor: `${selectedMeta.color}40`, backgroundColor: selectedMeta.bgColor }}>
                    <div className="absolute top-2 right-3 text-3xl opacity-20">{selectedMeta.emoji}</div>
                    <p className="text-[10px] font-mono tracking-widest" style={{ color: selectedMeta.color }}>
                      {selectedMeta.engLabel} · {pcts[selectedMeta.key]}%
                    </p>
                    <h4 className="text-base font-extrabold text-white mt-0.5">{selectedMeta.title}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      {selectedMeta.tagline.split('·').map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ color: selectedMeta.color, backgroundColor: `${selectedMeta.color}20` }}>
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                    {/* 진행도 바 */}
                    <div className="mt-3">
                      <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pcts[selectedMeta.key]}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg,${selectedMeta.color}66,${selectedMeta.color})` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 상세 설명 */}
                  <div className="p-3.5 rounded-xl border border-white/5 bg-slate-800/50 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">이 에너지란?</p>
                      <p className="text-[12px] text-slate-200 leading-[1.6] break-keep">{selectedMeta.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-900/10">
                      <p className="text-[9px] font-bold text-emerald-400 mb-1 uppercase tracking-widest">핵심 강점</p>
                      <p className="text-[11px] text-slate-300 leading-[1.5] break-keep">{selectedMeta.strength}</p>
                    </div>
                    <div className="p-3 rounded-xl border border-red-500/20 bg-red-900/10">
                      <p className="text-[9px] font-bold text-red-400 mb-1 uppercase tracking-widest">주의 패턴</p>
                      <p className="text-[11px] text-slate-300 leading-[1.5] break-keep">{selectedMeta.shadow}</p>
                    </div>
                  </div>

                  {/* 코칭 처방 */}
                  <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-900/10">
                    <p className="text-[10px] font-bold text-cyan-400 mb-1.5 flex items-center gap-1.5">
                      ⚡ 명심 코치의 맞춤 처방
                    </p>
                    <p className="text-[12px] text-white font-semibold leading-[1.6] break-keep italic">
                      "{selectedMeta.coaching}"
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="default-strongest"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                      ✨ 당신의 최강 무기 ({NODE_META.find(n => n.key === strongestKey)?.kor} {pcts[strongestKey]}%)
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">* 다른 노드를 탭하면 해당 코칭으로 전환됩니다</span>
                  </div>
                  {(() => {
                    const defaultMeta = NODE_META.find(n => n.key === strongestKey)!;
                    return (
                      <>
                        <div className="p-4 rounded-xl border relative overflow-hidden shadow-xl" style={{ borderColor: `${defaultMeta.color}60`, backgroundColor: defaultMeta.bgColor }}>
                          <div className="absolute top-2 right-3 text-3xl opacity-25">{defaultMeta.emoji}</div>
                          <p className="text-[10px] font-mono tracking-widest font-bold" style={{ color: defaultMeta.color }}>
                            {defaultMeta.engLabel} · {pcts[defaultMeta.key]}% (최강 에너지)
                          </p>
                          <h4 className="text-base font-extrabold text-white mt-0.5">{defaultMeta.title}</h4>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {defaultMeta.tagline.split('·').map(t => (
                              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ color: defaultMeta.color, backgroundColor: `${defaultMeta.color}25` }}>
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3">
                            <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pcts[defaultMeta.key]}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg,${defaultMeta.color}66,${defaultMeta.color})` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-white/10 bg-slate-800/60 space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">이 에너지란?</p>
                          <p className="text-[12px] text-slate-200 leading-[1.6] break-keep">{defaultMeta.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                            <p className="text-[9px] font-bold text-emerald-400 mb-1 uppercase tracking-widest">핵심 강점</p>
                            <p className="text-[11px] text-slate-200 leading-[1.5] break-keep">{defaultMeta.strength}</p>
                          </div>
                          <div className="p-3 rounded-xl border border-red-500/30 bg-red-950/20">
                            <p className="text-[9px] font-bold text-red-400 mb-1 uppercase tracking-widest">주의 패턴</p>
                            <p className="text-[11px] text-slate-200 leading-[1.5] break-keep">{defaultMeta.shadow}</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 shadow-lg">
                          <p className="text-[10px] font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                            ⚡ 명심 코치의 맞춤 처방
                          </p>
                          <p className="text-[12px] text-white font-semibold leading-[1.6] break-keep italic">
                            "{defaultMeta.coaching}"
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 하단: 5개 노드 퀵 요약 바 */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">5대 에너지 분포 현황</p>
          <div className="space-y-2">
            {NODE_META.map(meta => (
              <button
                key={meta.key}
                onClick={() => setSelectedNode(meta.key === selectedNode ? null : meta.key)}
                className="w-full flex items-center gap-3 text-left group"
              >
                <span className="text-[10px] font-bold w-16 shrink-0 text-right"
                  style={{ color: meta.color }}>
                  {meta.hanja} {meta.kor}
                </span>
                <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pcts[meta.key]}%` }}
                    transition={{ duration: 0.9, delay: NODE_META.indexOf(meta) * 0.1 }}
                    className="h-full rounded-full group-hover:brightness-125 transition-all"
                    style={{ background: `linear-gradient(90deg,${meta.color}66,${meta.color})` }}
                  />
                </div>
                <span className="text-[10px] font-black w-8 text-right" style={{ color: meta.color }}>
                  {pcts[meta.key]}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
