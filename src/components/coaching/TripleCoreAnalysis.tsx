'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────
interface Ohaeng {
  wood: number; fire: number; earth: number; metal: number; water: number;
}
interface Props {
  ohaeng?: Ohaeng;
  dayStem?: string;      // 일간 한자
  monthPillar?: string;  // 월주 (예: "甲子")
  tenGods?: { resource: number; self: number; output: number; wealth: number; power: number };
  userName?: string;
}

type StatusLevel = 'CRITICAL' | 'WARNING' | 'NORMAL' | 'OPTIMAL';

interface CoreResult {
  score: number;        // 0~100
  status: StatusLevel;
  title: string;        // e.g. "조열(燥熱) 감지"
  diagnosis: string;    // 한 줄 진단
  prescription: string; // 처방
  logLine: string;      // 터미널 한 줄
}

// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusLevel, { color: string; bg: string; border: string; badge: string; icon: string }> = {
  CRITICAL: { color: '#f87171', bg: 'bg-red-950/30', border: 'border-red-500/40', badge: 'bg-red-700/70 text-red-100', icon: '🚨' },
  WARNING:  { color: '#fbbf24', bg: 'bg-yellow-950/30', border: 'border-yellow-500/40', badge: 'bg-yellow-700/70 text-yellow-100', icon: '⚠️' },
  NORMAL:   { color: '#60a5fa', bg: 'bg-blue-950/30', border: 'border-blue-500/40', badge: 'bg-blue-700/70 text-blue-100', icon: '✅' },
  OPTIMAL:  { color: '#34d399', bg: 'bg-emerald-950/30', border: 'border-emerald-500/40', badge: 'bg-emerald-700/70 text-emerald-100', icon: '⚡' },
};

// 월지별 계절 오행 (조후 기준)
const MONTH_SEASON: Record<string, { season: string; need: string }> = {
  '子': { season: '동(冬)', need: '화(火) 가열 필요' },
  '丑': { season: '동(冬)', need: '화(火) 가열 필요' },
  '寅': { season: '춘(春)', need: '균형 조절' },
  '卯': { season: '춘(春)', need: '균형 조절' },
  '辰': { season: '춘(春)', need: '균형 조절' },
  '巳': { season: '하(夏)', need: '수(水) 냉각 필요' },
  '午': { season: '하(夏)', need: '수(水) 냉각 필요' },
  '未': { season: '하(夏)', need: '수(水) 냉각 필요' },
  '申': { season: '추(秋)', need: '균형 조절' },
  '酉': { season: '추(秋)', need: '균형 조절' },
  '戌': { season: '추(秋)', need: '균형 조절' },
  '亥': { season: '동(冬)', need: '화(火) 가열 필요' },
};

// 격국(社會的 OS) 추론
function calcSocialCore(
  tenGods: Props['tenGods'],
  dayStem: string
): CoreResult {
  if (!tenGods) {
    return {
      score: 50, status: 'NORMAL',
      title: '格局 분석 중',
      diagnosis: '십성 데이터가 부족하여 격국 추론을 진행합니다.',
      prescription: '사주 데이터를 정확히 입력하면 OS 유형이 확정됩니다.',
      logLine: '● Social Core: Analyzing... 格局 연산 중.',
    };
  }
  const { resource, self, output, wealth, power } = tenGods;
  const total = resource + self + output + wealth + power || 1;
  const dominant = Object.entries({ resource, self, output, wealth, power })
    .sort(([, a], [, b]) => b - a)[0][0];

  const osMap: Record<string, { os: string; role: string; score: number; status: StatusLevel; advice: string }> = {
    power:    { os: '정관격(行政 OS)', role: '질서·규율·조직 최적화형', score: 82, status: 'OPTIMAL', advice: '제도권 안에서 기여하는 역할이 최대 성능을 냅니다. 리더십과 책임감을 발휘하세요.' },
    resource: { os: '인수격(學術 OS)', role: '지식·학습·철학 최적화형', score: 76, status: 'NORMAL', advice: '지식 축적과 전달로 사회를 이끕니다. 강의·집필·컨설팅 분야가 배포 채널입니다.' },
    output:   { os: '식신격(創造 OS)', role: '창작·표현·생산 최적화형', score: 85, status: 'OPTIMAL', advice: '창의적 아이디어를 세상에 꺼내는 것이 생존 전략입니다. 출력(식상)을 막지 마세요.' },
    wealth:   { os: '재성격(實戰 OS)', role: '현실·결과·자원 최적화형', score: 72, status: 'NORMAL', advice: '현실적 실행과 자원 관리가 핵심입니다. 전략적 실행력이 강점입니다.' },
    self:     { os: '비겁격(主權 OS)', role: '자아·독립·개척 최적화형', score: 65, status: 'WARNING', advice: '강한 자아가 경쟁 또는 협력으로 분기됩니다. 소버린 스탠스를 유지하되 연대하세요.' },
  };

  const cfg = osMap[dominant] || osMap['self'];
  return {
    score: cfg.score,
    status: cfg.status,
    title: cfg.os,
    diagnosis: `${cfg.role} — ${dominant} 계열이 ${Math.round((tenGods[dominant as keyof typeof tenGods] / total) * 100)}%를 점유`,
    prescription: cfg.advice,
    logLine: `● Social Core: ${cfg.status}. ${cfg.os} 구동 중. ${cfg.role}.`,
  };
}

// 기후 코어 (조후 기반)
function calcClimateCore(ohaeng: Ohaeng, monthBranch: string): CoreResult {
  const total = ohaeng.wood + ohaeng.fire + ohaeng.earth + ohaeng.metal + ohaeng.water || 1;
  const firePct  = Math.round(((ohaeng.fire)  / total) * 100);
  const waterPct = Math.round(((ohaeng.water) / total) * 100);
  const heatIdx  = firePct - waterPct; // 양수: 과열, 음수: 과냉
  const season   = MONTH_SEASON[monthBranch] || { season: '미상', need: '균형 조절' };

  let score: number, status: StatusLevel, title: string, diagnosis: string, prescription: string, logLine: string;

  if (heatIdx > 20) {
    score = 25; status = 'CRITICAL';
    title = '조열(燥熱) — 시스템 과열';
    diagnosis = `화(火) ${firePct}% vs 수(水) ${waterPct}%. 냉각수 긴급 투입 필요. 현재 계절: ${season.season}`;
    prescription = '수(壬·癸) 에너지 보충: 물 마시기, 수영, 밤 명상, 북향 거주. CBT로 감정 과열 회로 차단.';
    logLine = `● Climate Core: CRITICAL! 조열(燥熱) 감지. 냉각수(壬水) 투입 권장.`;
  } else if (heatIdx > 10) {
    score = 50; status = 'WARNING';
    title = '온열(溫熱) — 경미한 과열';
    diagnosis = `화(火) ${firePct}% vs 수(水) ${waterPct}%. 수분 보충으로 안정 가능. 계절: ${season.season}`;
    prescription = '수분 보충과 함께 정기적인 명상·수면으로 내부 열기를 냉각하세요.';
    logLine = `● Climate Core: WARNING. 온열 감지. 수분 보충 권장.`;
  } else if (heatIdx < -20) {
    score = 25; status = 'CRITICAL';
    title = '습한(濕寒) — 시스템 저온 마비';
    diagnosis = `수(水) ${waterPct}% vs 화(火) ${firePct}%. 에너지 히터(火) 긴급 투입 필요. 계절: ${season.season}`;
    prescription = '화(丙·丁) 에너지 보충: 남향 거주, 햇빛 노출, 심장·열정 자극 루틴 확립.';
    logLine = `● Climate Core: CRITICAL! 습한(濕寒) 감지. 가열원(丙火) 투입 권장.`;
  } else if (heatIdx < -10) {
    score = 55; status = 'WARNING';
    title = '냉습(冷濕) — 에너지 저하';
    diagnosis = `수(水) ${waterPct}% vs 화(火) ${firePct}%. 경미한 냉각. 활동량 증가로 보완 가능.`;
    prescription = '운동, 사교 활동 증가로 내부 화기를 활성화하세요.';
    logLine = `● Climate Core: WARNING. 냉습 감지. 활동량 증가 권장.`;
  } else {
    score = 88; status = 'OPTIMAL';
    title = '중화(中和) — 최적 기후';
    diagnosis = `화(火) ${firePct}% vs 수(水) ${waterPct}%. 온도·습도 밸런스 최적. 계절: ${season.season}`;
    prescription = '현재 환경 루틴을 유지하세요. 계절 변화에 따른 미세 조정만 필요합니다.';
    logLine = `● Climate Core: OPTIMAL. 중화(中和) 측정. 현 루틴 유지 권장.`;
  }

  return { score, status, title, diagnosis, prescription, logLine };
}

// 균형 코어 (억부 기반)
function calcBalanceCore(
  ohaeng: Ohaeng,
  tenGods: Props['tenGods'],
  dayStem: string
): CoreResult {
  const total = ohaeng.wood + ohaeng.fire + ohaeng.earth + ohaeng.metal + ohaeng.water || 1;
  const tg = tenGods || { resource: 1, self: 1, output: 1, wealth: 1, power: 1 };
  const tgTotal = tg.resource + tg.self + tg.output + tg.wealth + tg.power || 1;

  // 일간 강도: 비겁(self) + 인성(resource) = 身強 지수
  const strongness = Math.round(((tg.self + tg.resource) / tgTotal) * 100);
  // 부하: 관성(power) + 재성(wealth) + 식상(output) = 부하 지수
  const loadness   = Math.round(((tg.power + tg.wealth + tg.output) / tgTotal) * 100);
  // 전원 잉여/부족
  const balance    = strongness - loadness;

  let score: number, status: StatusLevel, title: string, diagnosis: string, prescription: string, logLine: string;

  if (balance > 30) {
    score = 40; status = 'WARNING';
    title = '신강(身强) — 전원 과잉 공급';
    diagnosis = `자아 에너지 ${strongness}% vs 부하 ${loadness}%. 출력 채널(식상·재성)이 좁아 답답함·번아웃 위험.`;
    prescription = '식상(출력: 글쓰기, 코칭, 제품 개발)과 재성(현실 실행)의 채널을 의도적으로 확대하세요.';
    logLine = `● Balance Core: WARNING. 신강(身强) 감지. 출력 채널 확장 권장.`;
  } else if (balance > 15) {
    score = 75; status = 'NORMAL';
    title = '중강(中强) — 안정적 출력';
    diagnosis = `자아 에너지 ${strongness}% vs 부하 ${loadness}%. 자아 독립성이 강하나 협력으로 증폭 가능.`;
    prescription = '현재 상태는 안정적입니다. 생산적 출력에 집중하면 최적 성능을 냅니다.';
    logLine = `● Balance Core: NORMAL. 중강(中强) 측정. 출력 집중 권장.`;
  } else if (balance < -30) {
    score = 35; status = 'CRITICAL';
    title = '신약(身弱) — 저전력 모드';
    diagnosis = `자아 에너지 ${strongness}% vs 부하 ${loadness}%. 외부 압박(관성·재성)이 과도. 에너지 방전 위험!`;
    prescription = '인성(학습·멘토링·충전 루틴)과 비겁(독립 공간·선택권 확보)으로 자아를 충전하세요.';
    logLine = `● Balance Core: CRITICAL! 저전력(身弱) 감지. 자아 충전 긴급 권장.`;
  } else if (balance < -15) {
    score = 58; status = 'WARNING';
    title = '신약(身弱) 경계 — 충전 권장';
    diagnosis = `자아 에너지 ${strongness}% vs 부하 ${loadness}%. 경미한 방전 상태. 정기적 충전 필요.`;
    prescription = '규칙적인 학습, 명상, 독립 공간 확보로 내면 배터리를 충전하세요.';
    logLine = `● Balance Core: WARNING. 신약 경계 감지. 충전 루틴 수립 권장.`;
  } else {
    score = 92; status = 'OPTIMAL';
    title = '중화(中和) — 최적 전원 밸런스';
    diagnosis = `자아 에너지 ${strongness}% vs 부하 ${loadness}%. 내외부 에너지가 균형. 최고 성능 구동 가능!`;
    prescription = '현재 리듬을 유지하세요. 새로운 도전 과제를 추가해 성장 속도를 올릴 최적의 타이밍입니다.';
    logLine = `● Balance Core: OPTIMAL. 중화(中和) 측정. 신규 도전 과제 추가 권장.`;
  }

  return { score, status, title, diagnosis, prescription, logLine };
}

// ─────────────────────────────────────────────
// 게이지 컴포넌트
// ─────────────────────────────────────────────
const CoreGauge = ({ score, color, delay }: { score: number; color: string; delay: number }) => (
  <div className="relative w-full">
    <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
      <span>0%</span>
      <span className="font-black text-sm" style={{ color }}>{score}%</span>
      <span>100%</span>
    </div>
    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1.5, delay, ease: 'easeOut' }}
        className="h-full rounded-full relative"
        style={{ background: `linear-gradient(90deg, ${color}66, ${color})` }}
      >
        <div className="absolute right-0 top-0 h-full w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      </motion.div>
    </div>
    {/* Segment markers */}
    <div className="flex justify-between mt-0.5">
      {[25, 50, 75].map(m => (
        <div key={m} className="w-px h-1.5 bg-slate-600" style={{ marginLeft: `${m}%` }} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 싱글 코어 카드
// ─────────────────────────────────────────────
const CoreCard = ({
  index, coreKey, coreName, sourceText, icon,
  result, delay
}: {
  index: number;
  coreKey: string;
  coreName: string;
  sourceText: string;
  icon: string;
  result: CoreResult;
  delay: number;
}) => {
  const cfg = STATUS_CONFIG[result.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative rounded-2xl border ${cfg.border} ${cfg.bg} p-5 overflow-hidden`}
    >
      {/* 배경 글로우 */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10" style={{ background: cfg.color, filter: 'blur(24px)' }} />

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{sourceText}</div>
            <h3 className="text-base font-extrabold text-white">{coreName}</h3>
          </div>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${cfg.badge}`}>
          {cfg.icon} {result.status}
        </span>
      </div>

      {/* 게이지 */}
      <div className="mb-4">
        <CoreGauge score={result.score} color={cfg.color} delay={delay + 0.2} />
      </div>

      {/* 진단 */}
      <div className="space-y-2.5">
        <div className={`p-3 rounded-lg`} style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}30` }}>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: cfg.color }}>
            DIAGNOSIS
          </p>
          <p className="text-sm text-white font-semibold">{result.title}</p>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{result.diagnosis}</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
          <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-1">
            PRESCRIPTION
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">{result.prescription}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// 터미널 로그
// ─────────────────────────────────────────────
const TerminalLog = ({ lines, conclusion }: { lines: string[]; conclusion: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.2, duration: 0.6 }}
    className="bg-slate-950 border border-slate-700 rounded-xl p-5 font-mono text-sm overflow-hidden"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="text-slate-500 text-xs ml-2 tracking-widest">MYEONGSIM_TRIPLE_CORE.exe</span>
    </div>

    <p className="text-cyan-400 text-xs mb-3 animate-pulse">
      {'>'} [System Check: Myeongsim Triple Core Running...]
    </p>

    <div className="space-y-2">
      {lines.map((line, i) => {
        const color = line.includes('CRITICAL') ? 'text-red-400'
          : line.includes('WARNING') ? 'text-yellow-400'
          : line.includes('OPTIMAL') ? 'text-emerald-400'
          : 'text-blue-300';
        return (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 + i * 0.15 }}
            className={`text-xs ${color}`}
          >
            {line}
          </motion.p>
        );
      })}
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.1 }}
      className="mt-4 pt-4 border-t border-slate-700"
    >
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">[CONCLUSION]</p>
      <p className="text-xs text-white leading-relaxed">{conclusion}</p>
      <span className="inline-block mt-2 w-2 h-3 bg-cyan-400 animate-pulse" />
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
export default function TripleCoreAnalysis({
  ohaeng, dayStem = '庚', monthPillar = '', tenGods, userName = '사용자'
}: Props) {
  // 월지 추출 (2번째 글자가 지지)
  const monthBranch = useMemo(() => {
    if (!monthPillar) return '子';
    return monthPillar.length >= 2 ? monthPillar[1] : monthPillar[0];
  }, [monthPillar]);

  const defaultOhaeng: Ohaeng = ohaeng || { wood: 1, fire: 1, earth: 2, metal: 3, water: 1 };

  const climateResult = useMemo(() => calcClimateCore(defaultOhaeng, monthBranch), [defaultOhaeng, monthBranch]);
  const balanceResult = useMemo(() => calcBalanceCore(defaultOhaeng, tenGods, dayStem), [defaultOhaeng, tenGods, dayStem]);
  const socialResult  = useMemo(() => calcSocialCore(tenGods, dayStem), [tenGods, dayStem]);

  const avgScore = Math.round((climateResult.score + balanceResult.score + socialResult.score) / 3);
  const overallStatus: StatusLevel = avgScore >= 80 ? 'OPTIMAL' : avgScore >= 60 ? 'NORMAL' : avgScore >= 40 ? 'WARNING' : 'CRITICAL';
  const overallCfg = STATUS_CONFIG[overallStatus];

  const conclusion = (() => {
    const issues = [
      climateResult.status === 'CRITICAL' ? `기후 과열/냉각` : null,
      balanceResult.status === 'CRITICAL' ? `전원 불균형` : null,
      socialResult.status !== 'OPTIMAL' ? `OS 설계 미스매치` : null,
    ].filter(Boolean);

    if (issues.length === 0) return `${userName}의 시스템은 최적 성능 구동 중. 지금이 새로운 도전 과제를 실행할 최적 타이밍입니다. Shift 단계로 즉시 진입하십시오.`;
    return `현재 시스템에 ${issues.join(', ')} 감지됨. ${socialResult.prescription}`;
  })();

  const logLines = [climateResult.logLine, balanceResult.logLine, socialResult.logLine];

  const cores = [
    {
      index: 0,
      coreKey: 'climate',
      coreName: 'Climate Core',
      sourceText: '📜 궁통보감(穹通寶鑑) — 조후(調候) 기반',
      icon: '🌡️',
      result: climateResult,
      delay: 0.1,
    },
    {
      index: 1,
      coreKey: 'balance',
      coreName: 'Balance Core',
      sourceText: '⚖️ 적천수(滴天髓) — 억부(抑扶) 기반',
      icon: '⚡',
      result: balanceResult,
      delay: 0.25,
    },
    {
      index: 2,
      coreKey: 'social',
      coreName: 'Social Core',
      sourceText: '🏛️ 자평진전(子平眞詮) — 격국(格局) 기반',
      icon: '🖥️',
      result: socialResult,
      delay: 0.4,
    },
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-sans">
      {/* 헤더 */}
      <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <span className="text-[10px] font-black tracking-widest text-cyan-400 font-mono uppercase">
              MYEONGSIM TRIPLE CORE SYSTEM
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">
              명심 트리플 코어{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                진단 리포트
              </span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              당신이라는 시스템을 구동하는 3가지 핵심 알고리즘 — Climate · Balance · Social
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* 종합 점수 원형 */}
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="absolute w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#1e293b" strokeWidth="6" />
                <motion.circle
                  cx="32" cy="32" r="28" fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  stroke={overallCfg.color}
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - avgScore / 100) }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-base font-black" style={{ color: overallCfg.color }}>{avgScore}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">SYSTEM SCORE</p>
              <p className="text-sm font-bold" style={{ color: overallCfg.color }}>
                {overallCfg.icon} {overallStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-6">
        {/* 3 코어 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cores.map(c => (
            <CoreCard key={c.coreKey} {...c} />
          ))}
        </div>

        {/* 종합 오행 분포 미니 바 */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-3">
            📊 SYSTEM RESOURCE MAP (오행 에너지 분포)
          </p>
          <div className="grid grid-cols-5 gap-2">
            {([
              { key: 'wood',  label: '木', kor: '목', color: '#10b981' },
              { key: 'fire',  label: '火', kor: '화', color: '#ef4444' },
              { key: 'earth', label: '土', kor: '토', color: '#f59e0b' },
              { key: 'metal', label: '金', kor: '금', color: '#9ca3af' },
              { key: 'water', label: '水', kor: '수', color: '#3b82f6' },
            ] as const).map(({ key, label, kor, color }) => {
              const val = defaultOhaeng[key] || 0;
              const t = Object.values(defaultOhaeng).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((val / t) * 100);
              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <span className="text-xs font-black" style={{ color }}>{label}</span>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">{pct}%</span>
                  <span className="text-[9px] text-slate-500">{kor}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 터미널 로그 */}
        <TerminalLog lines={logLines} conclusion={conclusion} />
      </div>
    </div>
  );
}
