/**
 * /app/demo/neural-scan/page.tsx
 * 명심코칭 — 동서양 융합 뉴럴 스캔 데모 페이지 (PSST 심사관용)
 * 4 Tabs: 시스템 청사진 / 뉴럴 해킹 / 바이오-싱크 / 실전 시나리오
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NeuralArchitectureBlueprint from '@/components/chat/NeuralArchitectureBlueprint';
import NeuralHackingReportCard from '@/components/chat/NeuralHackingReportCard';
import BioSyncDashboard from '@/components/dashboard/BioSyncDashboard';

type TabType = 'architecture' | 'hacking' | 'biosync' | 'scenario';

// ─── 실전 시나리오 데이터 ─────────────────────────────
interface ScenarioStep {
    id: number;
    time: string;
    icon: string;
    title: string;
    subtitle: string;
    type: 'bio' | 'alert' | 'analysis' | 'coaching' | 'result';
    color: string;
    bioData?: { bpm: number; hrv: number; stress: string };
    details: string[];
    coachingMsg?: string;
}

const SCENARIO_STEPS: ScenarioStep[] = [
    {
        id: 1,
        time: '오전 10:23',
        icon: '⌚',
        title: '생체 신호 정상 수집 중',
        subtitle: '스마트워치 → 명심코칭 서버 실시간 싱크',
        type: 'bio',
        color: 'emerald',
        bioData: { bpm: 68, hrv: 52, stress: 'LOW' },
        details: [
            '심박수 68 BPM — 안정 범위',
            'HRV 52ms — 자율신경 균형 양호',
            '스트레스 지수: LOW',
            '코칭 트리거: 비활성 (대기 모드)',
        ],
    },
    {
        id: 2,
        time: '오후 2:15',
        icon: '⚡',
        title: '스트레스 스파이크 감지!',
        subtitle: '생체 신호 급격한 변화 포착',
        type: 'alert',
        color: 'red',
        bioData: { bpm: 98, hrv: 28, stress: 'HIGH' },
        details: [
            '심박수 급등: 68 → 98 BPM (+44%)',
            'HRV 급락: 52 → 28ms (-46%)',
            '스트레스 지수: LOW → HIGH 전환',
            '⚠️ 위험 임계치 돌파 — 코칭 트리거 활성화',
        ],
    },
    {
        id: 3,
        time: '오후 2:15',
        icon: '💬',
        title: 'AI가 상황을 먼저 확인',
        subtitle: '명심 마스터 → 사용자에게 상황 질문',
        type: 'coaching',
        color: 'blue',
        coachingMsg: '안녕하세요, 대표님.\n\n지금 심박수가 평소보다 44% 높고, 자율신경 균형(HRV)이 급격히 떨어졌어요.\n\n혹시 지금 어떤 상황에 계신가요?\n\n① 회의/미팅 중 의견 충돌\n② 업무 마감 압박\n③ 대인관계 갈등\n④ 기타 (직접 입력)',
        details: [
            '📌 기질 데이터를 먼저 꺼내지 않음',
            '📌 사용자의 현재 상황을 먼저 파악',
            '📌 선택지 + 자유 입력 모두 가능',
        ],
    },
    {
        id: 4,
        time: '오후 2:16',
        icon: '👤',
        title: '사용자 응답 수신',
        subtitle: '대표님 → AI에게 상황 공유',
        type: 'bio',
        color: 'emerald',
        coachingMsg: '① 회의 중 의견 충돌이요.\n팀원이 제 기획안을 정면으로 반박했는데, 너무 화가 나서 참기 힘들어요.',
        details: [
            '✅ 상황 카테고리: 회의/미팅 중 의견 충돌',
            '✅ 감정 키워드 추출: "화가 남", "참기 힘듦"',
            '✅ 맥락 데이터 수집 완료 → 교차 분석 시작',
        ],
    },
    {
        id: 5,
        time: '오후 2:16',
        icon: '🔍',
        title: '상황 × 기질 교차 분석',
        subtitle: 'Bio-Neural Fusion Engine — 3축 교차 분석',
        type: 'analysis',
        color: 'purple',
        details: [
            '📊 생체 데이터 (Y축): HRV 28ms / BPM 98 → 교감신경 과활성',
            '🧠 기질 신경망 (Z축): 배경 신경망 "주도성 엔진" 활성',
            '💬 상황 컨텍스트 (X축): 의견 충돌 + "통제 욕구" 감정 패턴',
            '',
            '⚙️ 교차 분석 결과:',
            '● 다크코드 매칭: "고집불통 독재자" 모드 (89.2% 일치)',
            '● 핵심 루프: 반박 인식 → 통제권 위협 → 분노 폭주',
            '● 위험도: ████████░░ 80%',
            '',
            '💡 최적 개입 전략 산출 중...',
        ],
    },
    {
        id: 6,
        time: '오후 2:17',
        icon: '🛡️',
        title: 'AI 맞춤 코칭 솔루션 제시',
        subtitle: '상황 + 기질 기반 최적화된 3단계 개입',
        type: 'coaching',
        color: 'blue',
        coachingMsg: '대표님, 상황을 파악했습니다.\n\n지금 팀원의 반박이 "내 기획안에 대한 공격"처럼 느껴지실 수 있어요. 대표님의 주도성 엔진은 "통제권이 위협받으면 강하게 밀어붙이는" 패턴이 있거든요.\n\n하지만 지금 필요한 건 이기는 것이 아니라 상황을 장악하는 것입니다.\n\n🔷 지금 즉시 실행할 3가지:\n\n① 🫁 긴급 냉각 (10초)\n→ 양손을 책상 위에 펴고, 손바닥의 온도를 느끼세요.\n→ 코로 4초 들이쉬고, 입으로 6초 내쉬세요.\n→ "지금 통제 욕구가 올라오고 있구나" 라고 속으로 명명하세요.\n\n② 💭 관점 전환 질문 (산파술)\n→ "팀원이 반박한 것은 나를 공격한 건가, 아니면 기획을 더 좋게 만들려는 건가?"\n→ "내가 지금 지키고 싶은 건 기획안의 품질인가, 내 자존심인가?"\n\n③ 🤝 전략적 대응 스크립트\n→ 이렇게 말해보세요: "좋은 지적이네요. 그 부분은 제가 다시 검토해볼게요. 다른 의견 더 있으신가요?"\n→ 이 한 마디가 당신의 리더십을 오히려 강화합니다.',
        details: [
            '✅ 긴급 냉각 프로토콜 (MBCT 기반 10초 호흡)',
            '✅ 산파술 관점 전환 질문 2개 전달',
            '✅ 실전 사용 대응 스크립트 제공',
            '✅ 호흡 타이머 (10초) 자동 시작',
            '',
            '🧬 개입 근거:',
            '· 생체 데이터 → 교감신경 과활성 → 먼저 신체 안정화',
            '· 상황 맥락 → 의견 충돌 → 방어적 공격이 아닌 수용적 리더십 유도',
            '· 기질 특성 → 주도성 엔진 → "통제"가 아닌 "장악" 프레이밍',
        ],
    },
    {
        id: 7,
        time: '오후 2:24',
        icon: '📊',
        title: '코칭 효과 실시간 검증',
        subtitle: '개입 후 7분 경과 — 바이오 피드백 확인',
        type: 'result',
        color: 'emerald',
        bioData: { bpm: 74, hrv: 45, stress: 'MODERATE' },
        details: [
            '심박수 복원: 98 → 74 BPM (▼24.5%)',
            'HRV 회복: 28 → 45ms (▲60.7%)',
            '스트레스 지수: HIGH → MODERATE 하향',
            '',
            '✅ 코칭 효과 수치 검증 완료',
            '📝 성공 패턴 → AI 자가 학습 모델에 피드백',
            '🔄 다음 유사 상황 시 → 더 정밀한 개입 가능',
        ],
    },
];

const colorStyles: Record<string, { border: string; bg: string; text: string; badge: string; glow: string }> = {
    emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/20', text: 'text-emerald-300', badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/40', glow: '' },
    red:     { border: 'border-red-500/50',     bg: 'bg-red-950/20',     text: 'text-red-300',     badge: 'bg-red-900/50 text-red-300 border-red-700/40',         glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' },
    purple:  { border: 'border-purple-500/40',  bg: 'bg-purple-950/20',  text: 'text-purple-300',  badge: 'bg-purple-900/50 text-purple-300 border-purple-700/40', glow: '' },
    blue:    { border: 'border-blue-500/40',    bg: 'bg-blue-950/20',    text: 'text-blue-300',    badge: 'bg-blue-900/50 text-blue-300 border-blue-700/40',       glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
};

// ─── Main Component ────────────────────────────────────
export default function NeuralScanDemoPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('architecture');

    // 바이오-싱크 데모용 시뮬레이션 데이터
    const [demoBioData, setDemoBioData] = useState({
        bpm: 72, hrv: 48, steps: 6842, stressLevel: 'MODERATE' as string,
    });

    useEffect(() => {
        if (activeTab !== 'biosync') return;
        const interval = setInterval(() => {
            setDemoBioData(prev => ({
                ...prev,
                bpm: Math.max(60, Math.min(95, prev.bpm + Math.floor(Math.random() * 7) - 3)),
                hrv: Math.max(30, Math.min(65, prev.hrv + Math.floor(Math.random() * 5) - 2)),
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, [activeTab]);

    // 시나리오 타임라인 상태
    const [visibleSteps, setVisibleSteps] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const playScenario = useCallback(() => {
        setVisibleSteps(1);
        setIsPlaying(true);
    }, []);

    useEffect(() => {
        if (!isPlaying || visibleSteps >= SCENARIO_STEPS.length) {
            if (visibleSteps >= SCENARIO_STEPS.length) setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setVisibleSteps(v => v + 1), 2200);
        return () => clearTimeout(timer);
    }, [isPlaying, visibleSteps]);

    // 탭 전환 시 시나리오 리셋
    useEffect(() => {
        if (activeTab === 'scenario') {
            setVisibleSteps(1);
            setIsPlaying(false);
        }
    }, [activeTab]);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#070A12] max-w-2xl mx-auto shadow-xl overflow-hidden font-sans">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-purple-600/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#070A12]/90 backdrop-blur-xl px-4 py-3 border-b border-blue-900/30">
                <button onClick={() => router.back()} className="text-blue-400 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <h2 className="text-white text-base font-bold leading-tight flex-1 text-center pr-10">동서양 융합 뉴럴 스캔</h2>
            </header>

            <main className="flex-1 overflow-y-auto relative z-10">
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="px-6 pt-10 pb-8 text-center border-b border-blue-900/20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/30 mb-5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-blue-400 text-[10px] font-mono tracking-widest uppercase">Myeongsim Neural Scan Engine v2.0</span>
                    </div>
                    <h1 className="text-white text-2xl md:text-3xl font-black mb-3 leading-tight">🌐 명심(明心) 뉴럴 아키텍처</h1>
                    <p className="text-gray-400 text-sm md:text-base mb-4 break-keep leading-relaxed max-w-md mx-auto">
                        2천 년 시계열 기질 데이터를 현대 <strong className="text-blue-300">뇌과학·심리학·사이버네틱스</strong> 관점으로 재구조화한 동서양 융합 코칭 엔진
                    </p>
                    <div className="mt-6 mx-auto max-w-sm p-4 bg-black/40 rounded-2xl border border-blue-900/30 backdrop-blur-md">
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-2">Sovereign State Equation</p>
                        <p className="text-sm text-blue-200 font-mono leading-relaxed">
                            <span className="text-blue-400">Sovereign</span> = <span className="text-emerald-400">OS</span>(기질) × <span className="text-indigo-400">App</span>(인지) × <span className="text-green-400">Power</span>(에너지) ÷ <span className="text-red-400">Glitch</span>(변수)
                        </p>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-full">
                        <span className="text-[10px] text-purple-300 font-mono">🔒 특허 기반 바이오-싱크 기술 (출원번호: 10-2025-0166877)</span>
                    </div>
                </motion.div>

                {/* 4 Tabs */}
                <div className="sticky top-[52px] z-40 bg-[#070A12]/95 backdrop-blur-xl border-b border-blue-900/20 px-2 py-2.5">
                    <div className="flex gap-1 max-w-xl mx-auto overflow-x-auto scrollbar-hide">
                        {([
                            { key: 'architecture' as TabType, icon: '🌐', label: '청사진', activeColor: 'bg-blue-950/40 border-blue-500/50 text-blue-300' },
                            { key: 'hacking' as TabType, icon: '🔥', label: '뉴럴해킹', activeColor: 'bg-red-950/40 border-red-500/50 text-red-300' },
                            { key: 'biosync' as TabType, icon: '⌚', label: '바이오싱크', activeColor: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' },
                            { key: 'scenario' as TabType, icon: '🎬', label: '실전시나리오', activeColor: 'bg-amber-950/40 border-amber-500/50 text-amber-300' },
                        ]).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                                    activeTab === tab.key
                                        ? `${tab.activeColor} border-2 shadow-lg`
                                        : 'bg-black/20 border border-gray-800 text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="px-2 md:px-4 py-6">
                    <AnimatePresence mode="wait">
                        {/* ── Tab 1: Architecture ── */}
                        {activeTab === 'architecture' && (
                            <motion.div key="arch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                <div className="text-center mb-6 px-4">
                                    <p className="text-xs text-gray-400 break-keep leading-relaxed max-w-md mx-auto">
                                        인간의 기질을 <strong className="text-blue-300">OS(운영체제)</strong>, <strong className="text-indigo-300">App(소프트웨어)</strong>, <strong className="text-emerald-300">배터리(에너지 위상)</strong>, <strong className="text-red-300">다크코드(변이 변수)</strong> 4개의 Layer로 해체합니다.
                                        <br/>각 Layer마다 <span className="text-purple-300">산파술</span> → <span className="text-purple-300">재귀적 질문</span> → <span className="text-pink-300">알아차림의 알아차림</span>으로 낡은 각본을 소각합니다.
                                    </p>
                                </div>
                                <NeuralArchitectureBlueprint />
                            </motion.div>
                        )}

                        {/* ── Tab 2: Hacking ── */}
                        {activeTab === 'hacking' && (
                            <motion.div key="hack" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                <div className="text-center mb-6 px-4">
                                    <p className="text-xs text-gray-400 break-keep leading-relaxed max-w-md mx-auto">
                                        개인의 기질 코드에 맞춤 설계된 <strong className="text-red-300">3단계 뉴럴 해킹 프로토콜</strong>입니다.
                                        <br/>낡은 각본(Old Script)을 식별하고, 5단계 코칭 시퀀스로 신경 회로를 <span className="text-blue-300">재배선(Rewiring)</span>합니다.
                                    </p>
                                </div>
                                <NeuralHackingReportCard />
                            </motion.div>
                        )}

                        {/* ── Tab 3: Bio-Sync ── */}
                        {activeTab === 'biosync' && (
                            <motion.div key="bio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                <div className="text-center mb-6 px-4">
                                    <p className="text-xs text-gray-400 break-keep leading-relaxed max-w-md mx-auto">
                                        <strong className="text-emerald-300">Apple HealthKit / Google Health Connect</strong>와 연동하여
                                        <br/>실시간 생체 데이터로 코칭 트리거를 자동 활성화하는 <span className="text-purple-300">특허 기반 바이오-싱크 기술</span>입니다.
                                    </p>
                                </div>
                                <div className="px-2 md:px-4"><BioSyncDashboard data={demoBioData} /></div>

                                {/* Architecture Diagram */}
                                <div className="mx-4 md:mx-6 mt-6 p-5 bg-[#0B0F19] rounded-2xl border border-emerald-900/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-sm">⌚</div>
                                        <div>
                                            <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Patent-Based Technology</div>
                                            <div className="text-sm text-white font-bold">바이오-싱크 아키텍처</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { n: 1, c: 'blue', t: '생체 신호 수집', d: '스마트워치에서 심박수(BPM), HRV, 수면, 활동량 실시간 수집', tags: ['Apple HealthKit', 'Health Connect', 'Samsung Health'] },
                                            { n: 2, c: 'purple', t: '기질 × 생체 융합 분석', d: '생체 데이터와 기질 신경망(Z축)을 교차 분석하여 다크코드 활성화 예측', tags: [] },
                                            { n: 3, c: 'emerald', t: '맞춤형 코칭 자동 트리거', d: '3단계 질문 + 4대 심리치료 코칭을 위험 감지 시 자동 푸시', tags: ['번아웃 알림', '분노 감지', '수면 부채 경고'] },
                                            { n: 4, c: 'amber', t: '효과 검증 피드백 루프', d: '코칭 전후 HRV·심박수 변화를 수치 기록하여 과학적 검증', tags: [] },
                                        ].map((s, i) => (
                                            <React.Fragment key={s.n}>
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-7 h-7 rounded-full bg-${s.c}-900/40 border border-${s.c}-500/30 flex items-center justify-center text-[10px] font-bold text-${s.c}-300 shrink-0 mt-0.5`}>{s.n}</div>
                                                    <div className={`bg-${s.c}-950/20 border border-${s.c}-900/30 rounded-xl p-3 flex-1`}>
                                                        <div className={`text-xs text-${s.c}-300 font-bold mb-1`}>{s.t}</div>
                                                        <p className="text-[11px] text-gray-400 leading-relaxed break-keep">{s.d}</p>
                                                        {s.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                                {s.tags.map(t => <span key={t} className={`text-[9px] px-2 py-0.5 rounded bg-${s.c}-900/40 text-${s.c}-300 border border-${s.c}-700/30 font-mono`}>{t}</span>)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {i < 3 && <div className="flex justify-center"><span className="text-gray-700 text-xs">▼</span></div>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="mt-5 p-3 bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-purple-500/20 rounded-xl">
                                        <p className="text-[10px] text-gray-400 leading-relaxed break-keep">
                                            <strong className="text-gray-300">🔒 특허명:</strong> 심리 및 생체데이터 기반 스트레스 관리 솔루션 · <strong className="text-gray-300">출원번호:</strong> 10-2025-0166877
                                        </p>
                                    </div>
                                </div>

                                {/* SDK Grid */}
                                <div className="mx-4 md:mx-6 mt-4 p-4 bg-black/30 rounded-2xl border border-gray-800/50">
                                    <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-3">Integration SDKs</div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { icon: '🍎', name: 'Apple HealthKit', desc: 'iOS 심박/HRV/수면' },
                                            { icon: '🤖', name: 'Health Connect', desc: 'Android 생체 데이터' },
                                            { icon: '⌚', name: 'WearOS / watchOS', desc: '실시간 워치 싱크' },
                                        ].map(sdk => (
                                            <div key={sdk.name} className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-center">
                                                <div className="text-lg mb-1">{sdk.icon}</div>
                                                <div className="text-[10px] text-gray-300 font-bold">{sdk.name}</div>
                                                <div className="text-[9px] text-gray-500 mt-0.5">{sdk.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── Tab 4: 실전 시나리오 ── */}
                        {activeTab === 'scenario' && (
                            <motion.div key="scenario" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                {/* Scenario Header */}
                                <div className="text-center mb-4 px-4">
                                    <p className="text-xs text-gray-400 break-keep leading-relaxed max-w-md mx-auto">
                                        <strong className="text-amber-300">실제 사용 시나리오</strong>: 회의 중 의견 충돌이 발생했을 때,
                                        <br/>웨어러블 생체 데이터 + 기질 신경망이 <span className="text-blue-300">자동으로 연동</span>되어 코칭이 트리거되는 전체 프로세스
                                    </p>
                                </div>

                                {/* Play Button */}
                                <div className="flex justify-center mb-6">
                                    <button
                                        onClick={playScenario}
                                        disabled={isPlaying}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                                            isPlaying
                                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-[0_0_25px_rgba(245,158,11,0.3)] active:scale-[0.97]'
                                        }`}
                                    >
                                        {isPlaying ? (
                                            <><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> 시뮬레이션 진행 중...</>
                                        ) : (
                                            <><span>▶️</span> 시나리오 시뮬레이션 시작</>
                                        )}
                                    </button>
                                </div>

                                {/* Scenario User Profile */}
                                <div className="mx-4 md:mx-6 mb-5 p-4 bg-[#0B0F19] rounded-2xl border border-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-lg font-bold text-white">K</div>
                                        <div className="flex-1">
                                            <div className="text-sm text-white font-bold">대표님 (Demo User)</div>
                                            <div className="text-[10px] text-gray-500">주 활성 신경망: 주도성 엔진 · 다크코드: 고집불통 독재자</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-900/30 border border-emerald-700/30">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                            <span className="text-[9px] text-emerald-300 font-mono">WATCH SYNCED</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="mx-4 md:mx-6 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500/30 via-red-500/30 to-emerald-500/30"></div>

                                    <div className="space-y-4">
                                        {SCENARIO_STEPS.slice(0, visibleSteps).map((step, idx) => {
                                            const cs = colorStyles[step.color] || colorStyles.emerald;
                                            return (
                                                <motion.div
                                                    key={step.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: idx === visibleSteps - 1 ? 0.1 : 0 }}
                                                    className={`relative pl-12 ${cs.glow}`}
                                                >
                                                    {/* Timeline Node */}
                                                    <div className={`absolute left-[7px] top-3 w-6 h-6 rounded-full ${cs.bg} ${cs.border} border-2 flex items-center justify-center text-[12px] z-10 bg-[#070A12]`}>
                                                        {step.icon}
                                                    </div>

                                                    {/* Card */}
                                                    <div className={`${cs.bg} ${cs.border} border rounded-2xl p-4 relative overflow-hidden`}>
                                                        {/* Alert pulse for danger */}
                                                        {step.type === 'alert' && (
                                                            <motion.div animate={{ opacity: [0, 0.15, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                                                                className="absolute inset-0 bg-red-500/20 pointer-events-none"
                                                            />
                                                        )}

                                                        {/* Head */}
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <div className={`text-[10px] ${cs.text} font-mono tracking-widest mb-0.5`}>{step.time}</div>
                                                                <div className="text-sm text-white font-bold break-keep">{step.title}</div>
                                                                <div className="text-[11px] text-gray-500">{step.subtitle}</div>
                                                            </div>
                                                            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${cs.badge}`}>
                                                                {step.type === 'bio' ? 'BIO DATA' : step.type === 'alert' ? '⚠ ALERT' : step.type === 'analysis' ? 'ANALYSIS' : step.type === 'coaching' ? 'COACHING' : '✅ RESULT'}
                                                            </span>
                                                        </div>

                                                        {/* Bio Data Mini Dashboard */}
                                                        {step.bioData && (
                                                            <div className="grid grid-cols-3 gap-2 my-3">
                                                                <div className="bg-black/30 rounded-xl p-2.5 text-center border border-white/5">
                                                                    <div className="text-lg font-black text-white">{step.bioData.bpm}</div>
                                                                    <div className="text-[9px] text-gray-500">BPM</div>
                                                                </div>
                                                                <div className="bg-black/30 rounded-xl p-2.5 text-center border border-white/5">
                                                                    <div className="text-lg font-black text-white">{step.bioData.hrv}<span className="text-[9px] text-gray-500 ml-0.5">ms</span></div>
                                                                    <div className="text-[9px] text-gray-500">HRV</div>
                                                                </div>
                                                                <div className="bg-black/30 rounded-xl p-2.5 text-center border border-white/5">
                                                                    <div className={`text-sm font-black ${step.bioData.stress === 'HIGH' ? 'text-red-400' : step.bioData.stress === 'MODERATE' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                                                        {step.bioData.stress}
                                                                    </div>
                                                                    <div className="text-[9px] text-gray-500">STRESS</div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Coaching Message Bubble */}
                                                        {step.coachingMsg && (
                                                            <div className="my-3 bg-blue-950/30 border border-blue-900/30 rounded-xl p-3.5">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-6 h-6 rounded-full bg-blue-700/50 flex items-center justify-center text-[10px]">🧠</div>
                                                                    <span className="text-[10px] text-blue-300 font-bold">명심 AI 코칭 메시지</span>
                                                                </div>
                                                                <p className="text-[11px] text-blue-100/80 leading-relaxed whitespace-pre-line break-keep">{step.coachingMsg}</p>
                                                            </div>
                                                        )}

                                                        {/* Detail Items */}
                                                        <div className="space-y-1.5">
                                                            {step.details.map((d, i) => (
                                                                <div key={i} className="text-[11px] text-gray-300 leading-relaxed break-keep flex items-start gap-1.5">
                                                                    <span className="text-gray-600 mt-0.5 shrink-0">›</span>
                                                                    <span>{d}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Result comparison */}
                                                        {step.type === 'result' && (
                                                            <div className="mt-3 p-3 bg-gradient-to-r from-emerald-900/20 to-transparent rounded-xl border border-emerald-500/20">
                                                                <div className="text-[10px] text-emerald-400 font-bold mb-2">📈 코칭 전후 비교</div>
                                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                                    <div>
                                                                        <div className="text-[9px] text-gray-500 mb-1">심박수</div>
                                                                        <div className="text-xs"><span className="text-red-400">98</span> → <span className="text-emerald-400 font-bold">74</span></div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[9px] text-gray-500 mb-1">HRV</div>
                                                                        <div className="text-xs"><span className="text-red-400">28ms</span> → <span className="text-emerald-400 font-bold">45ms</span></div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[9px] text-gray-500 mb-1">스트레스</div>
                                                                        <div className="text-xs"><span className="text-red-400">HIGH</span> → <span className="text-yellow-400 font-bold">MOD</span></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Scenario Complete */}
                                    <AnimatePresence>
                                        {visibleSteps >= SCENARIO_STEPS.length && !isPlaying && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center py-6 bg-gradient-to-b from-emerald-900/10 to-transparent rounded-2xl border border-emerald-500/20">
                                                <div className="text-2xl mb-2">✅</div>
                                                <div className="text-sm text-emerald-300 font-bold mb-1">시나리오 시뮬레이션 완료</div>
                                                <p className="text-[11px] text-gray-400 break-keep max-w-sm mx-auto leading-relaxed px-4">
                                                    웨어러블 생체 신호 → 기질 다크코드 교차 분석 → 자동 코칭 개입 → 효과 검증까지<br/><strong className="text-gray-300">전 과정이 6분 이내</strong>에 자동으로 완료됩니다.
                                                </p>
                                                <button onClick={playScenario} className="mt-4 px-5 py-2 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition-all">
                                                    🔄 다시 재생
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom CTA */}
                <div className="px-6 py-10 text-center border-t border-blue-900/20">
                    <div className="max-w-sm mx-auto">
                        <p className="text-gray-500 text-xs mb-4 break-keep">
                            위 분석은 <strong className="text-gray-300">1980년 7월 7일 13:40</strong> 데이터 기반 샘플입니다.
                            <br/>실제 서비스에서는 사용자의 고유 데이터로 개인화됩니다.
                        </p>
                        <button onClick={() => router.push('/myeongsim-chat')} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                            🧬 AI 코칭 체험하기
                        </button>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="px-6 py-6 bg-black/30 border-t border-gray-800/50">
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-gray-400 text-[10px] leading-relaxed break-keep">
                            ⚠️ 본 서비스는 보건복지부의 '비의료 건강관리 서비스 가이드라인'을 준수합니다.
                            제공되는 정보는 자기 주도적 건강 관리(Self-Care)를 위한 보조 수단이며, 의학적 진단·치료·처방을 대체할 수 없습니다.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
