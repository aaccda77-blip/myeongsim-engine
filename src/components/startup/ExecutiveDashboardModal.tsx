'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExecutiveDashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyName?: string;
    ceoName?: string;
    onStartChat?: (prompt: string) => void;
}

export default function ExecutiveDashboardModal({
    isOpen,
    onClose,
    companyName = '(주)명심코칭',
    ceoName = '이경윤 대표님',
    onStartChat
}: ExecutiveDashboardModalProps) {
    const [isScanning, setIsScanning] = useState(true);
    const [scanProgress, setScanProgress] = useState(0);
    const [activeNode, setActiveNode] = useState<any>(null);
    const [copiedToast, setCopiedToast] = useState(false);

    // Timeline Node Data
    const timelineNodes = [
        { quarter: '2026.Q1', label: '기틀 마련', score: 68, zone: 'neutral', status: '🟢 순항', desc: '초기 핵심 IP 특허 출원 및 B2B 타당성 검증 완료' },
        { quarter: '2026.Q3', label: '공식 승인 ★', score: 86, zone: 'expansion', status: '🟢 Expansion Zone (피크)', desc: '특허 승인 및 법인 자격 인정, B2B 신뢰도 극대화 골든 타임' },
        { quarter: '2027.Q2', label: '시장 확장', score: 74, zone: 'expansion', status: '🟢 Expansion Zone', desc: 'B2B / B2G 자금 조달(IR) 및 대형 제휴 계약 추진 최적기' },
        { quarter: '2027.Q4', label: '조직 정비', score: 59, zone: 'consolidation', status: '🟡 Consolidation Zone', desc: '고정비 증대 억제 및 내실 내실화, 유동성 현금 비축 필요' },
        { quarter: '2028.Q2', label: '자본 재구조화 ★', score: 32, zone: 'defense', status: '🔴 Defense Zone (경고)', desc: '세운 비겁 중첩 구간 — 현금 유통 압박 대비 보수적 운용' },
        { quarter: '2028.Q4', label: '시스템 완성', score: 82, zone: 'expansion', status: '🟢 Recovery Zone', desc: '재성 기운 재활성화, 차세대 BM 시장 안착 및 2차 도약' }
    ];

    useEffect(() => {
        if (isOpen) {
            setIsScanning(true);
            setScanProgress(0);
            const interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setIsScanning(false), 300);
                        return 100;
                    }
                    return prev + 25;
                });
            }, 180);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const handleCopyBoardReport = () => {
        const summaryText = `[이사회 보고용 경영 모멘텀 브리핑]
기업명: ${companyName} | 대상: ${ceoName}
----------------------------------------
■ 종합 모멘텀 지수: 86 / 100점 (상위 5% 최상위 - 정관합 승인기)
■ 주요 리스크: 군겁쟁재 (2028년 자금 유통 압박 대비 필요)

■ 3대 핵심 경영 지침:
1. 2026년 하반기: 특허(IP) 및 법인 공식 자격 승인을 통한 B2B 신뢰도 극대화
2. 2027년 상반기: 자금 조달(IR) 및 B2B/B2G 계약 체결 적극 추진
3. 2028년 세운 방어: 2027년 하반기부터 현금 유동성 사전 확보

(출처: 명심코칭 Enterprise Solution)`;

        navigator.clipboard.writeText(summaryText);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-6xl bg-[#131022] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                >
                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2839] bg-[#181526]">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-[#3211d4] flex items-center justify-center text-white shadow-lg shadow-[#3211d4]/30">
                                <span className="material-symbols-outlined text-xl">insights</span>
                            </div>
                            <div>
                                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                    <span>[Enterprise Report] {companyName} · 경영 모멘텀 정밀 분석 대시보드</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                        CONFIDENTIAL
                                    </span>
                                </h2>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    Target: {ceoName} | Engine: CAFE Rule-Engine v4.2 & B2B Pipeline
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopyBoardReport}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all border border-white/10"
                            >
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                                <span>이사회 요약 복사</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="size-9 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Copied Toast Alert */}
                    {copiedToast && (
                        <div className="absolute top-16 right-6 z-50 px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-lg flex items-center gap-2 animate-bounce">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span>이사회 보고용 요약문이 클립보드에 복사되었습니다!</span>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {isScanning ? (
                            /* Scanning Animation Screen */
                            <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="relative size-24 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                                    <span className="material-symbols-outlined text-4xl text-indigo-400">equalizer</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">엔터프라이즈 알고리즘 분석 중...</h3>
                                    <p className="text-xs text-indigo-300 font-mono">
                                        [ 사주 명식 × 2026-2028 세운 파이프라인 매핑 진행 중 ({scanProgress}%) ]
                                    </p>
                                </div>
                                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                                        style={{ width: `${scanProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            /* Dashboard View */
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                                {/* Top KPI Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* KPI 1 */}
                                    <div className="bg-[#181526] border border-[#2b2839] rounded-xl p-5 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-indigo-400 text-base">bar_chart</span>
                                                종합 모멘텀 지수
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300">
                                                상위 5% 최상위
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-white font-mono">86</span>
                                            <span className="text-sm font-bold text-slate-400">/ 100 점</span>
                                        </div>
                                        <p className="text-[11px] text-emerald-400 font-bold mt-2 flex items-center gap-1">
                                            <span>✨</span>
                                            <span>올해는 명예와 공식 시스템 승인의 해</span>
                                        </p>
                                    </div>

                                    {/* KPI 2 */}
                                    <div className="bg-[#181526] border border-[#2b2839] rounded-xl p-5 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-emerald-400 text-base">rocket_launch</span>
                                                현재 경영 단계
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                정관합 승인기
                                            </span>
                                        </div>
                                        <div className="text-xl font-black text-white truncate">
                                            공식 자산 / IP 승인
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-2">
                                            특허 자산화 및 B2B/B2G 계약 수주 적기
                                        </p>
                                    </div>

                                    {/* KPI 3 */}
                                    <div className="bg-[#181526] border border-[#2b2839] rounded-xl p-5 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-amber-400 text-base">warning</span>
                                                주요 리스크 모듈
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                군겁쟁재 경고
                                            </span>
                                        </div>
                                        <div className="text-xl font-black text-white truncate">
                                            자금 유통 압박 방어
                                        </div>
                                        <p className="text-[11px] text-amber-300/80 font-bold mt-2">
                                            2028년 세운 비겁 중첩 대비 현금 유동성 확보 필요
                                        </p>
                                    </div>
                                </div>

                                {/* Main Chart 1: 연간 모멘텀 타임라인 파동 그래프 */}
                                <div className="bg-[#181526] border border-[#2b2839] rounded-xl p-6 relative">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                                        <div>
                                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-indigo-400 text-lg">show_chart</span>
                                                2026 - 2028 연간 경영 모멘텀 타임라인 파동 그래프 (Momentum Wave)
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                노드를 클릭/호버하면 분기별 핵심 경영 과제와 분기별 가이드라인이 표시됩니다.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] font-bold">
                                            <span className="flex items-center gap-1 text-emerald-400"><span className="size-2 rounded-full bg-emerald-400"></span> Expansion</span>
                                            <span className="flex items-center gap-1 text-amber-400"><span className="size-2 rounded-full bg-amber-400"></span> Consolidation</span>
                                            <span className="flex items-center gap-1 text-red-400"><span className="size-2 rounded-full bg-red-400"></span> Defense</span>
                                        </div>
                                    </div>

                                    {/* Timeline Wave Interactive SVG */}
                                    <div className="relative h-64 w-full pt-4">
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                                            {/* Grid Lines */}
                                            <line x1="0" y1="40" x2="800" y2="40" stroke="#2b2839" strokeDasharray="4,4" />
                                            <line x1="0" y1="100" x2="800" y2="100" stroke="#2b2839" strokeDasharray="4,4" />
                                            <line x1="0" y1="160" x2="800" y2="160" stroke="#2b2839" opacity="0.5" />

                                            {/* Gradient Definition */}
                                            <defs>
                                                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>

                                            {/* Area Path */}
                                            <path
                                                d="M 50,104 Q 200,28 350,72 T 500,118 T 650,172 T 750,56 L 750,160 L 50,160 Z"
                                                fill="url(#waveGradient)"
                                            />

                                            {/* Main Curve Line */}
                                            <path
                                                d="M 50,104 Q 200,28 350,72 T 500,118 T 650,172 T 750,56"
                                                fill="none"
                                                stroke="#818cf8"
                                                strokeWidth="3.5"
                                            />
                                        </svg>

                                        {/* Interactive Nodes Overlay */}
                                        <div className="absolute inset-0 flex justify-between items-end px-6 pb-2">
                                            {timelineNodes.map((node, index) => {
                                                const isPeak = node.score >= 80;
                                                const isRisk = node.score < 40;
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => setActiveNode(node)}
                                                        onMouseEnter={() => setActiveNode(node)}
                                                        className="flex flex-col items-center group cursor-pointer relative"
                                                        style={{ height: `${node.score}%` }}
                                                    >
                                                        {/* Node Tooltip Score */}
                                                        <div className={`
                                                            px-2 py-0.5 rounded font-mono text-[11px] font-black mb-2 shadow-md transition-all
                                                            ${isPeak ? 'bg-emerald-500 text-white scale-110' : isRisk ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'}
                                                        `}>
                                                            {node.score}점
                                                        </div>

                                                        {/* Node Point */}
                                                        <div className={`
                                                            size-4 rounded-full border-2 transition-all group-hover:scale-150
                                                            ${isPeak ? 'bg-emerald-400 border-white shadow-lg shadow-emerald-500/50' : isRisk ? 'bg-red-500 border-white shadow-lg shadow-red-500/50' : 'bg-indigo-500 border-white'}
                                                        `} />

                                                        {/* Node Label */}
                                                        <div className="mt-3 text-center">
                                                            <p className="text-xs font-bold text-white whitespace-nowrap">{node.quarter}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{node.label}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Active Node Detail Popover */}
                                    {activeNode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-4 rounded-xl bg-white/5 border border-indigo-500/30 flex items-start gap-4"
                                        >
                                            <div className="size-10 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-sm flex-shrink-0">
                                                {activeNode.quarter}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-white">{activeNode.label}</span>
                                                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                                                        {activeNode.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-300 leading-relaxed">{activeNode.desc}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Main Chart 2 & Action Decision Matrix Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                                    {/* Left: 4대 경영 축 레이더 차트 */}
                                    <div className="lg:col-span-5 bg-[#181526] border border-[#2b2839] rounded-xl p-6 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-indigo-400 text-lg">radar</span>
                                                4대 경영 축 레이더 차트
                                            </h3>
                                            <p className="text-xs text-slate-400 mb-4">
                                                기업의 선천적 4대 밸류체인 분석 지수
                                            </p>
                                        </div>

                                        {/* Radar SVG Visual */}
                                        <div className="relative size-60 mx-auto flex items-center justify-center my-2">
                                            <svg className="w-full h-full text-indigo-500/30" viewBox="0 0 100 100">
                                                {/* Polygons Grid */}
                                                <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" />
                                                <polygon points="50,25 75,50 50,75 25,50" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />

                                                {/* Axes */}
                                                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
                                                <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />

                                                {/* Radar Data Polygon */}
                                                <polygon points="50,15 82,50 50,78 22,50" fill="rgba(99,102,241,0.3)" stroke="#818cf8" strokeWidth="2" />

                                                {/* Data Nodes */}
                                                <circle cx="50" cy="15" r="2.5" fill="#a78bfa" />
                                                <circle cx="82" cy="50" r="2.5" fill="#6366f1" />
                                                <circle cx="50" cy="78" r="2.5" fill="#38bdf8" />
                                                <circle cx="22" cy="50" r="2.5" fill="#34d399" />
                                            </svg>

                                            {/* Axis Labels */}
                                            <span className="absolute top-0 text-[10px] font-bold text-indigo-300 bg-black/60 px-1.5 py-0.5 rounded">자금조달 (88점)</span>
                                            <span className="absolute right-0 text-[10px] font-bold text-indigo-300 bg-black/60 px-1.5 py-0.5 rounded">조직인재 (75점)</span>
                                            <span className="absolute bottom-0 text-[10px] font-bold text-indigo-300 bg-black/60 px-1.5 py-0.5 rounded">법률리스크 (62점)</span>
                                            <span className="absolute left-0 text-[10px] font-bold text-indigo-300 bg-black/60 px-1.5 py-0.5 rounded">BM적합도 (84점)</span>
                                        </div>

                                        <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 text-center font-mono">
                                            자금 조달 및 BM 적합성 우수 • 법률 관성 보완 권장
                                        </div>
                                    </div>

                                    {/* Right: ACTION DECISION MATRIX (Go / Caution / Hold) */}
                                    <div className="lg:col-span-7 bg-[#181526] border border-[#2b2839] rounded-xl p-6 space-y-4">
                                        <div>
                                            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-emerald-400 text-lg">traffic</span>
                                                ACTION DECISION MATRIX (경영 의사결정 신호등)
                                            </h3>
                                            <p className="text-xs text-slate-400">
                                                경영진(CEO/C-Level) 전용 3단계 의사결정 실행 판정
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {/* 🟢 GO */}
                                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                                                <div className="size-7 rounded-lg bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    GO
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-emerald-300 mb-0.5">🟢 과감한 추진 권장 (2026.Q3 ~ 2027.Q2)</p>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        특허/IP 자산화, B2B 대형 제휴 계약 수주, 정부지원사업 신청 및 자금 조달(IR) 라운드 오픈
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 🟡 CAUTION */}
                                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                                                <div className="size-7 rounded-lg bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    CAUTION
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-amber-300 mb-0.5">🟡 신중 기조 유지 (2027.Q3 ~ 2027.Q4)</p>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        무리한 고정비 인건비 증대, 성급한 지분 분배 및 과도한 사무실 확장 억제
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 🔴 HOLD */}
                                            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                                                <div className="size-7 rounded-lg bg-red-500 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    HOLD
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-red-300 mb-0.5">🔴 즉시 보류/방어 (2028.Q1 ~ 2028.Q2)</p>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        현금성 고위험 공격 투자, 무리한 단기 고금리 차입 및 파트너십 무리한 지분 분쟁 방어
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Executive Summary (3줄 핵심 경영 지침) */}
                                <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/30 rounded-xl p-6 relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="material-symbols-outlined text-amber-400 text-xl">lightbulb</span>
                                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                                            Executive Summary (3줄 핵심 경영 지침)
                                        </h3>
                                    </div>

                                    <div className="space-y-2.5 text-xs text-slate-200 leading-relaxed">
                                        <div className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold">1.</span>
                                            <p>
                                                <strong className="text-white">2026년 하반기:</strong> 특허(IP) 및 법인 공식 자격 승인을 통한 B2B 신뢰도 극대화 적기입니다.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold">2.</span>
                                            <p>
                                                <strong className="text-white">2027년 상반기:</strong> 자금 조달(IR) 및 B2B/B2G 대형 계약 체결을 적극 추진하십시오.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold">3.</span>
                                            <p>
                                                <strong className="text-white">2028년 세운 방어:</strong> 비겁 중첩(자금 묶임)에 대비해 2027년 하반기부터 현금 유동성을 사전에 확보하십시오.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Buttons */}
                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2b2839]">
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={handleCopyBoardReport}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">content_copy</span>
                                            <span>📋 이사회/공동창업자 보고용 요약 복사</span>
                                        </button>
                                    </div>

                                    {onStartChat && (
                                        <button
                                            onClick={() => {
                                                onClose();
                                                onStartChat('올해 우리 회사의 사업 경영 모멘텀과 주요 전략적 타이밍을 분석해주세요.');
                                            }}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3211d4] hover:bg-[#3211d4]/90 text-white font-extrabold text-xs shadow-lg shadow-[#3211d4]/30 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">chat_bubble</span>
                                            <span>💬 수석 AI 경영 자문관과 1:1 디프리핑</span>
                                        </button>
                                    )}
                                </div>

                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
