'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Activity, Brain, Moon, Zap, HeartPulse, Check, Copy } from 'lucide-react';

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
    const [activeBioHack, setActiveBioHack] = useState<string | null>(null);

    // 🌟 6대 분기 듀얼 모멘텀 데이터셋 (경영 파동 × 뇌신경 웰니스 바이오 실드)
    const timelineNodes = [
        {
            quarter: '2026.Q1',
            label: '기틀 마련',
            score: 68,
            bioScore: 82,
            zone: 'neutral',
            status: '🟢 순항',
            desc: '초기 핵심 IP 특허 출원 및 B2B 타당성 검증 완료',
            bioWellness: '기상 직후 15분 자연광 쬐기로 세로토닌 합성 & 전두엽 기획력 부스팅',
            bioTip: '🔬 아침 햇빛 노출로 서카디안 수면 리듬을 100% 동기화하세요.'
        },
        {
            quarter: '2026.Q3',
            label: '공식 승인 ★',
            score: 86,
            bioScore: 95,
            zone: 'expansion',
            status: '🟢 Expansion Zone (최고 피크)',
            desc: '특허 승인 및 법인 자격 인정, B2B 신뢰도 극대화 골든 타임',
            bioWellness: '90분 울트라디안(Ultradian) 집중 사이클 가동 ➔ 고단가 계약 체결력 극대화',
            bioTip: '⚡ 오전 09:00~11:30 최고 몰입 시간에 핵심 의사결정을 100% 완결하세요.'
        },
        {
            quarter: '2027.Q2',
            label: '시장 확장',
            score: 74,
            bioScore: 88,
            zone: 'expansion',
            status: '🟢 Expansion Zone',
            desc: 'B2B / B2G 자금 조달(IR) 및 대형 제휴 계약 추진 최적기',
            bioWellness: '스케일업 스트레스 방어: 주 1회 30분 삼림욕 & 찬물 세안으로 미주신경 활성',
            bioTip: '🌿 미주신경을 자극하여 심박변이도(HRV)를 높이고 흥분된 신경계를 안정시키세요.'
        },
        {
            quarter: '2027.Q4',
            label: '조직 정비',
            score: 59,
            bioScore: 78,
            zone: 'consolidation',
            status: '🟡 Consolidation Zone',
            desc: '고정비 증대 억제 및 내실화, 유동성 현금 비축 필요',
            bioWellness: '조직 관리 피로 완화: 4-7-8 부교감 호흡법 & 저녁 9시 이후 블루라이트 차단',
            bioTip: '🌙 수면 중 델타파를 유도하여 뇌척수액의 노폐물 청소(Glymphatic)를 가동하세요.'
        },
        {
            quarter: '2028.Q2',
            label: '자본 재구조화 ★',
            score: 32,
            bioScore: 86,
            zone: 'defense',
            status: '🔴 Defense Zone (신경계 방어 락다운)',
            desc: '시장 경쟁 심화 구간 — 현금 유통 압박 대비 보수적 운용',
            bioWellness: '🛡️ 군겁쟁재 신경계 방패: [생리학적 한숨 1분] + [대표 실무 80% 위임 방어]',
            bioTip: '⚠️ 코르티솔 스파이크를 막기 위해 급박한 투자를 보류하고 뇌신경 쿨다운을 실행하세요.'
        },
        {
            quarter: '2028.Q4',
            label: '시스템 완성',
            score: 82,
            bioScore: 96,
            zone: 'expansion',
            status: '🟢 Recovery Zone (2차 도약)',
            desc: '자본 회전율 회복, 차세대 BM 시장 안착 및 2차 퀀텀점프',
            bioWellness: '자율신경계 황금 밸런스 달성: 지속 가능한 성장 시스템과 뇌파 안정화',
            bioTip: '👑 신체와 사업이 완벽하게 정렬되어 번아웃 없는 자동화 흑자 궤도에 진입합니다.'
        }
    ];

    useEffect(() => {
        if (isOpen) {
            setIsScanning(true);
            setScanProgress(0);
            const interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setIsScanning(false);
                            setActiveNode(timelineNodes[1]);
                        }, 300);
                        return 100;
                    }
                    return prev + 25;
                });
            }, 180);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const handleCopyBoardReport = () => {
        const summaryText = `[이사회 및 경영진 브리핑: 경영 모멘텀 × 뇌신경 웰니스 융합 보고서]
기업명: ${companyName} | 대상: ${ceoName}
--------------------------------------------------
■ 종합 경영 모멘텀: 86 / 100점 (상위 5% 최상위 - 공적 승인의 해)
■ 창업가 뇌신경 회복력(HRV): 94% (초몰입 Flow 상태)
■ 바이오 피크 타임: 09:00 ~ 11:30 (서카디안 수면 동기화 92점)

■ 3대 핵심 경영 & 바이오해킹 전략:
1. 2026년 하반기: 특허(IP) 자산화 및 B2B 신뢰도 극대화 (90분 울트라디안 집중 사이클)
2. 2027년 상반기: 자금 조달(IR) 및 대형 제휴 추진 (주 1회 뇌신경 쿨다운)
3. 2028년 리스크 방어: 유동성 확보 + 군겁쟁재 바이오 락다운(코르티솔 방어)

(출처: 명심코칭 Enterprise Wellness Solution)`;

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
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141024]">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                    <span>[Enterprise] {companyName} · 경영 모멘텀 & 웰니스 정밀 분석</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                        CONFIDENTIAL
                                    </span>
                                </h2>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    Target: {ceoName} | Engine: 108 Matrix × Neuro-BioWellness v5.0
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopyBoardReport}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all border border-white/10 cursor-pointer active:scale-95"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                <span>이사회 요약 복사</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="size-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Copied Toast Alert */}
                    {copiedToast && (
                        <div className="absolute top-16 right-6 z-50 px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-xs shadow-lg flex items-center gap-2 animate-bounce">
                            <Check className="w-4 h-4" />
                            <span>이사회 보고용 융합 요약문이 클립보드에 복사되었습니다!</span>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar text-xs sm:text-sm">
                        {isScanning ? (
                            /* Scanning Screen */
                            <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="relative size-24 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                                    <Brain className="w-10 h-10 text-indigo-400 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black text-white">경영 모멘텀 & 뇌신경 웰니스 융합 분석 중...</h3>
                                    <p className="text-xs text-indigo-300 font-mono">
                                        [ 사주 108 매트릭스 × Whoop·Huberman 신경계 알고리즘 매핑 ({scanProgress}%) ]
                                    </p>
                                </div>
                                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-300"
                                        style={{ width: `${scanProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            /* Dashboard View */
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                
                                {/* 🌟 Top 4 융합 KPI Cards (경영 × 뇌신경 웰니스) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                    {/* Card 1: 종합 모멘텀 */}
                                    <div className="bg-[#181526] border border-indigo-500/30 rounded-2xl p-4 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                                                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                                종합 경영 모멘텀
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300">
                                                상위 5%
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-white font-mono">86</span>
                                            <span className="text-xs font-bold text-slate-400">/ 100점</span>
                                        </div>
                                        <p className="text-[11px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                                            <span>✨</span>
                                            <span>공식 시스템 승인 골든타임</span>
                                        </p>
                                    </div>

                                    {/* Card 2: 현재 경영 단계 */}
                                    <div className="bg-[#181526] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                                                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                                                현재 경영 단계
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                정관합 승인기
                                            </span>
                                        </div>
                                        <div className="text-base font-black text-white truncate">
                                            공식 자산 / IP 승인
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-1.5">
                                            특허 자산화 및 B2B 계약 수주 적기
                                        </p>
                                    </div>

                                    {/* Card 3: [NEW] 뇌신경 회복탄력성 (HRV) */}
                                    <div className="bg-[#181526] border border-purple-500/30 rounded-2xl p-4 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                                <Brain className="w-3.5 h-3.5 text-purple-400" />
                                                뇌신경 회복탄력성 (HRV)
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300">
                                                최상급 Flow
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-purple-300 font-mono">94%</span>
                                            <span className="text-xs text-slate-400 font-medium">부교감신경 활성</span>
                                        </div>
                                        <p className="text-[11px] text-purple-200 font-bold mt-1.5 flex items-center gap-1">
                                            <span>🧬</span>
                                            <span>인지 피로도 최저 • 결단력 극대화</span>
                                        </p>
                                    </div>

                                    {/* Card 4: [NEW] 바이오 피크타임 */}
                                    <div className="bg-[#181526] border border-amber-500/30 rounded-2xl p-4 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                                <Moon className="w-3.5 h-3.5 text-amber-400" />
                                                바이오 피크 & 수면
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300">
                                                동기화 92점
                                            </span>
                                        </div>
                                        <div className="text-base font-black text-amber-300 font-mono">
                                            09:00 ~ 11:30
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-1.5">
                                            도파민·세로토닌 황금 분비 시간대
                                        </p>
                                    </div>
                                </div>

                                {/* 🌟 Main Chart 1: 듀얼 모멘텀 파동 그래프 (Business Wave × Bio-Wellness Shield Wave) */}
                                <div className="bg-[#181526] border border-white/10 rounded-2xl p-5 sm:p-6 relative">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                                        <div>
                                            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-indigo-400" />
                                                <span>2026 - 2028 연간 경영 모멘텀 × 뇌신경 웰니스 듀얼 파동 그래프</span>
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                노드를 클릭하면 분기별 핵심 경영 과제와 앤드류 후버만 기준 [1분 바이오해킹 처방]이 열립니다.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] font-bold">
                                            <span className="flex items-center gap-1 text-indigo-400"><span className="size-2 rounded-full bg-indigo-400"></span> 📈 경영 파동</span>
                                            <span className="flex items-center gap-1 text-emerald-400"><span className="size-2 rounded-full bg-emerald-400"></span> 🛡️ 신경계 방어선</span>
                                        </div>
                                    </div>

                                    {/* Timeline Wave Interactive SVG */}
                                    <div className="relative h-64 w-full pt-4">
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                                            <line x1="0" y1="40" x2="800" y2="40" stroke="#2b2839" strokeDasharray="4,4" />
                                            <line x1="0" y1="100" x2="800" y2="100" stroke="#2b2839" strokeDasharray="4,4" />
                                            <line x1="0" y1="160" x2="800" y2="160" stroke="#2b2839" opacity="0.5" />

                                            <defs>
                                                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>

                                            {/* Business Wave Path */}
                                            <path d="M 50,104 Q 200,28 350,72 T 500,118 T 650,172 T 750,56 L 750,160 L 50,160 Z" fill="url(#waveGradient)" />
                                            <path d="M 50,104 Q 200,28 350,72 T 500,118 T 650,172 T 750,56" fill="none" stroke="#818cf8" strokeWidth="3" />

                                            {/* Bio-Wellness Shield Wave Path (신경계 방어선) */}
                                            <path d="M 50,70 Q 200,35 350,50 T 500,65 T 650,55 T 750,30" fill="none" stroke="#34d399" strokeWidth="2.5" strokeDasharray="6,3" />
                                        </svg>

                                        {/* Interactive Nodes Overlay */}
                                        <div className="absolute inset-0 flex justify-between items-end px-6 pb-2">
                                            {timelineNodes.map((node, index) => {
                                                const isPeak = node.score >= 80;
                                                const isRisk = node.score < 40;
                                                const isSelected = activeNode?.quarter === node.quarter;
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => setActiveNode(node)}
                                                        className="flex flex-col items-center group cursor-pointer relative"
                                                        style={{ height: `${node.score}%` }}
                                                    >
                                                        {/* Node Tooltip Score */}
                                                        <div className={`
                                                            px-2 py-0.5 rounded font-mono text-[10px] sm:text-[11px] font-black mb-2 shadow-md transition-all
                                                            ${isSelected ? 'ring-2 ring-amber-400 scale-125' : ''}
                                                            ${isPeak ? 'bg-emerald-500 text-white' : isRisk ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'}
                                                        `}>
                                                            {node.score}점
                                                        </div>

                                                        {/* Node Point */}
                                                        <div className={`
                                                            size-4 sm:size-5 rounded-full border-2 transition-all group-hover:scale-150 flex items-center justify-center
                                                            ${isPeak ? 'bg-emerald-400 border-white shadow-lg shadow-emerald-500/50' : isRisk ? 'bg-red-500 border-white shadow-lg shadow-red-500/50' : 'bg-indigo-500 border-white'}
                                                        `}>
                                                            <div className="size-1.5 bg-white rounded-full" />
                                                        </div>

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

                                    {/* 🌟 Active Node Detail Popover with Bio-Wellness Prescription */}
                                    {activeNode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/50 to-emerald-950/40 border border-indigo-400/40 space-y-3"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="size-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center font-bold text-indigo-300 text-xs">
                                                        {activeNode.quarter}
                                                    </span>
                                                    <div>
                                                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                                                            <span>{activeNode.label}</span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                                                                {activeNode.status}
                                                            </span>
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-mono">
                                                    <span className="text-indigo-300">경영 모멘텀: <strong>{activeNode.score}점</strong></span>
                                                    <span className="text-emerald-400">신경계 방어력: <strong>{activeNode.bioScore}%</strong></span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-indigo-300 flex items-center gap-1">
                                                        <span>📊 핵심 경영 과제:</span>
                                                    </p>
                                                    <p className="text-slate-300 leading-relaxed pl-1">{activeNode.desc}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-emerald-300 flex items-center gap-1">
                                                        <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span>후버만 뇌신경 웰니스 처방:</span>
                                                    </p>
                                                    <p className="text-emerald-200 leading-relaxed pl-1">{activeNode.bioWellness}</p>
                                                </div>
                                            </div>

                                            {/* Action Buttons inside Node */}
                                            <div className="pt-1 flex flex-wrap items-center gap-2">
                                                <button
                                                    onClick={() => setActiveBioHack('sigh')}
                                                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                                >
                                                    <span>🫁 1분 생리학적 한숨(호흡법) 실행</span>
                                                </button>
                                                <button
                                                    onClick={() => setActiveBioHack('dopamine')}
                                                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                                >
                                                    <span>☕ 도파민 고갈 방패 룰 확인</span>
                                                </button>
                                            </div>

                                            {/* Instant Bio-hack Alert */}
                                            {activeBioHack === 'sigh' && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-[11px] text-emerald-200 space-y-1">
                                                    <p className="font-bold">🫁 [앤드류 후버만 생리학적 한숨 (Physiological Sigh) 프로토콜]</p>
                                                    <p>1. 코로 숨을 깊게 2번 연속 들이마십니다 (첫 번째 깊게 ➔ 두 번째 살짝 더 채우기).</p>
                                                    <p>2. 입으로 길게 천천히 끝까지 내쉽니다 (폐포를 펴서 심박수를 30초 내로 급속 안정화).</p>
                                                    <p>👉 3회 반복 시 코르티솔이 즉시 감소하고 전두엽 명료도가 회복됩니다.</p>
                                                </motion.div>
                                            )}

                                            {activeBioHack === 'dopamine' && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-amber-950/80 border border-amber-400/50 text-[11px] text-amber-200 space-y-1">
                                                    <p className="font-bold">☕ [창업가 도파민 번아웃 방지 90분 지연 섭취 룰]</p>
                                                    <p>• 기상 후 90~120분 동안은 커피(카페인)를 마시지 않고 물 500ml와 자연광을 쬡니다.</p>
                                                    <p>• 아데노신(피로물질)이 자연적으로 분해된 후 카페인을 섭취하면 오후 2시 크래시(급격한 피로)가 100% 방지됩니다.</p>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Main Chart 2 & Action Decision Matrix Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                    {/* Left: 4대 경영 축 레이더 차트 */}
                                    <div className="lg:col-span-5 bg-[#181526] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-sm sm:text-base font-black text-white mb-1 flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-indigo-400" />
                                                <span>4대 경영 & 멘탈 밸류체인 레이더</span>
                                            </h3>
                                            <p className="text-xs text-slate-400 mb-3">
                                                기업의 선천적 4대 자산 및 멘탈 밸런스
                                            </p>
                                        </div>

                                        {/* Radar SVG Visual */}
                                        <div className="relative size-56 mx-auto flex items-center justify-center my-2">
                                            <svg className="w-full h-full text-indigo-500/30" viewBox="0 0 100 100">
                                                <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" />
                                                <polygon points="50,25 75,50 50,75 25,50" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
                                                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
                                                <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
                                                <polygon points="50,15 82,50 50,78 22,50" fill="rgba(99,102,241,0.3)" stroke="#818cf8" strokeWidth="2" />
                                                <circle cx="50" cy="15" r="2.5" fill="#a78bfa" />
                                                <circle cx="82" cy="50" r="2.5" fill="#6366f1" />
                                                <circle cx="50" cy="78" r="2.5" fill="#38bdf8" />
                                                <circle cx="22" cy="50" r="2.5" fill="#34d399" />
                                            </svg>
                                            <span className="absolute top-0 text-[9px] font-bold text-indigo-300 bg-black/70 px-1.5 py-0.5 rounded">자금조달 (88점)</span>
                                            <span className="absolute right-0 text-[9px] font-bold text-indigo-300 bg-black/70 px-1.5 py-0.5 rounded">조직인재 (75점)</span>
                                            <span className="absolute bottom-0 text-[9px] font-bold text-indigo-300 bg-black/70 px-1.5 py-0.5 rounded">법률리스크 (62점)</span>
                                            <span className="absolute left-0 text-[9px] font-bold text-indigo-300 bg-black/70 px-1.5 py-0.5 rounded">BM적합도 (84점)</span>
                                        </div>

                                        <div className="pt-2.5 border-t border-white/10 text-[11px] text-slate-400 text-center font-mono">
                                            자금 조달 & BM 최상 • 뇌신경 쿨다운으로 법률 관성 방어
                                        </div>
                                    </div>

                                    {/* Right: ACTION DECISION MATRIX */}
                                    <div className="lg:col-span-7 bg-[#181526] border border-white/10 rounded-2xl p-5 space-y-3.5">
                                        <div>
                                            <h3 className="text-sm sm:text-base font-black text-white mb-1 flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-emerald-400" />
                                                <span>ACTION DECISION MATRIX (의사결정 신호등)</span>
                                            </h3>
                                            <p className="text-xs text-slate-400">
                                                경영진 전용 3단계 실행 판정 & 바이오해킹 행동 강령
                                            </p>
                                        </div>

                                        <div className="space-y-2.5">
                                            {/* 🟢 GO */}
                                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                                                <div className="size-6 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                                                    GO
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-emerald-300 mb-0.5">🟢 과감한 확장 추진 (2026.Q3 ~ 2027.Q2)</p>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        특허/IP 자산화, B2B 대형 제휴 수주 • 90분 몰입 사이클로 생산성 200% 극대화
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 🟡 CAUTION */}
                                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                                                <div className="size-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                                                    !
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-amber-300 mb-0.5">🟡 신중 기조 유지 (2027.Q3 ~ 2027.Q4)</p>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        무리한 고정비 증대 억제 및 유동성 비축 • 수면 8시간 확보로 인지 피로 누적 차단
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 🔴 HOLD */}
                                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                                                <div className="size-6 rounded-lg bg-red-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                                                    ✕
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-red-300 mb-0.5">🔴 즉시 보류/방어 (2028.Q1 ~ 2028.Q2)</p>
                                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                                        고위험 공격 투자 차단 • 1일 15분 미세 단식 및 뇌신경 락다운으로 코르티솔 스파이크 방어
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Executive Summary */}
                                <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-emerald-500/15 border border-amber-400/40 rounded-2xl p-5 relative">
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                                        <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">
                                            Executive Summary (경영 & 바이오해킹 3대 결론)
                                        </h3>
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-200 leading-relaxed">
                                        <div className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold">1.</span>
                                            <p><strong className="text-white">2026년 하반기 (골든타임):</strong> 특허(IP) 자산화와 B2B 공적 승인을 완료하고, 오전 09:00~11:30 바이오 피크타임에 결단을 집중하세요.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold">2.</span>
                                            <p><strong className="text-white">2027년 상반기 (스케일업):</strong> 대형 제휴 계약을 추진하되 주 1회 미주신경 쿨다운으로 창업자 번아웃을 사전 예방하세요.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-amber-400 font-bold">3.</span>
                                            <p><strong className="text-white">2028년 상반기 (신경계 방어):</strong> 현금 유동성을 보수적으로 운용하고 [1분 생리학적 한숨] 프로토콜로 멘탈을 85% 이상 유지하세요.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Action Buttons */}
                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                                    <button
                                        onClick={handleCopyBoardReport}
                                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>📋 이사회 보고용 융합 요약문 복사</span>
                                    </button>

                                    {onStartChat && (
                                        <button
                                            onClick={() => {
                                                onClose();
                                                onStartChat('올해 우리 회사의 경영 모멘텀과 창업가 바이오 웰니스 융합 전략을 심층 브리핑해주세요.');
                                            }}
                                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                        >
                                            <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                                            <span>💬 수석 AI 경영 웰니스 자문관과 1:1 디프리핑 ➔</span>
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
