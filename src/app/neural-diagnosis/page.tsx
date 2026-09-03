'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Activity, ArrowLeft, Sparkles, Zap, Shield, Eye, Compass, 
    Cpu, Key, Orbit, Rocket, Layers, Radio, Volume2, VolumeX,
    CheckCircle2, RefreshCw, MessageSquare, AlertCircle, ArrowUpRight,
    TrendingUp, Award, BarChart3, ChevronRight, Sliders, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateSaju } from '@/utils/SajuCalculator';

// ── 6대 핵심 진단 탭 정의 ──
type DiagnosticTab = 'full_scan' | 'x_axis' | 'y_axis' | 'z_axis' | 'decoder' | 'action_3s';

const TAB_CONFIG: { id: DiagnosticTab; label: string; icon: string; shortDesc: string }[] = [
    { id: 'full_scan', label: '3D 종합 스캔', icon: '🧬', shortDesc: 'XYZ 3차원 에너지 통합 진단' },
    { id: 'x_axis', label: 'X축: 의식 코드', icon: '⚡', shortDesc: 'Dark vs Neural vs Meta' },
    { id: 'y_axis', label: 'Y축: 주파수(Hz)', icon: '📡', shortDesc: '행동 주파수 이퀄라이저' },
    { id: 'z_axis', label: 'Z축: 에너지 벡터', icon: '🧭', shortDesc: '폭발 vs 함몰 밸런스' },
    { id: 'decoder', label: '64 뉴럴 DNA', icon: '🔑', shortDesc: 'DNA 64 원형 디코더' },
    { id: 'action_3s', label: '3S 솔루션 실행', icon: '🚀', shortDesc: 'Scan-Sync-Shift 실행' }
];

function NeuralDiagnosisContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab') as DiagnosticTab;

    const [activeTab, setActiveTab] = useState<DiagnosticTab>(
        TAB_CONFIG.some(t => t.id === tabParam) ? tabParam : 'full_scan'
    );

    // 528Hz 솔페지오 주파수 사운드 상태
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);

    // 사용자 정보 및 사주 데이터
    const [userName, setUserName] = useState('이경윤');
    const [birthDate, setBirthDate] = useState('1980-07-07');
    const [sajuSpecs, setSajuSpecs] = useState<any>(null);

    // 실시간 스캔 시뮬레이션 상태
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(100);

    // 3D 좌표 상태
    const [xVal, setXVal] = useState(78); // X: 0 (Dark) ~ 50 (Neural) ~ 100 (Meta)
    const [yVal, setYVal] = useState(528); // Y: 100Hz ~ 963Hz
    const [zVal, setZVal] = useState(12); // Z: -50 (함몰) ~ 0 (영점) ~ +50 (폭발)

    // 3S 퀘스트 완료 상태
    const [is3SCompleted, setIs3SCompleted] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedName = localStorage.getItem('myeongsim_user_name') || '이경윤';
            const savedBirth = localStorage.getItem('myeongsim_user_birth') || '1980-07-07';
            setUserName(savedName);
            setBirthDate(savedBirth);

            // 사주 스펙 계산
            try {
                const saju = calculateSaju(savedBirth, '14:00');
                const fourPillarsStr = `${saju.year.gan.hanja}${saju.year.ji.hanja}년 ${saju.month.gan.hanja}${saju.month.ji.hanja}월 ${saju.day.gan.hanja}${saju.day.ji.hanja}일 ${saju.time.gan.hanja}${saju.time.ji.hanja}시`;
                const dayGanHanja = saju.day.gan.hanja;
                
                const parts = savedBirth.split('-');
                const y = parseInt(parts[0]) || 1980;
                const m = parseInt(parts[1]) || 7;
                const d = parseInt(parts[2]) || 7;
                const codeNum = ((y + m * 3 + d * 7) % 64) + 1;

                setSajuSpecs({
                    dayMaster: dayGanHanja,
                    fourPillarsStr,
                    codeNum,
                    codeTitle: `Code ${String(codeNum).padStart(2, '0')}. ${codeNum === 28 ? '택풍대과 (The Overload)' : '64비트 뉴럴 코드'}`,
                    coreDesc: `${dayGanHanja}金 초정밀 관찰자 다이아몬드 코어`,
                    engineDesc: '정관(巳火) 시스템 질서 & 식신(癸水) 자율 창조 엔진'
                });
            } catch (e) {
                setSajuSpecs({
                    dayMaster: '辛',
                    fourPillarsStr: '庚申년 癸未월 辛巳일 乙未시',
                    codeNum: 28,
                    codeTitle: 'Code 28. 택풍대과 (The Overload)',
                    coreDesc: '辛金 초정밀 관찰자 다이아몬드 코어',
                    engineDesc: '정관(巳火) 시스템 질서 & 식신(癸水) 자율 창조 엔진'
                });
            }
        }
    }, []);

    // 528Hz 주파수 토글
    const toggleFrequency = () => {
        if (isPlayingSound) {
            if (oscRef.current) {
                try { oscRef.current.stop(); } catch (e) {}
            }
            setIsPlayingSound(false);
        } else {
            try {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioCtx();
                audioCtxRef.current = ctx;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(yVal, ctx.currentTime);

                gain.gain.setValueAtTime(0.001, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.5);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                oscRef.current = osc;
                setIsPlayingSound(true);
            } catch (e) {
                console.error('Audio frequency error:', e);
                setIsPlayingSound(false);
            }
        }
    };

    const handleRunFullScan = () => {
        setIsScanning(true);
        setScanProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsScanning(false);
                confetti({
                    particleCount: 70,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }
        }, 120);
    };

    const handleExecute3S = () => {
        setIs3SCompleted(true);
        confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.7 },
            colors: ['#6366f1', '#a855f7', '#f59e0b', '#38bdf8']
        });
    };

    const handleConsultAI = (prompt: string) => {
        router.push(`/myeongsim-chat?intent=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#05030b] max-w-md mx-auto shadow-2xl overflow-hidden font-sans pb-28 text-white">
            
            {/* 🌌 Neural Hologram Cyber Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[350px] bg-gradient-to-b from-cyan-600/15 via-purple-700/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 right-[-60px] w-64 h-64 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-16 left-[-60px] w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* ── 1. Top Header Navigation ── */}
            <header className="relative z-30 flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.08] bg-[#080514]/80 backdrop-blur-xl">
                <button
                    onClick={() => router.push('/report')}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs font-bold transition-all px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] active:scale-95 cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    <span>명심 리포트</span>
                </button>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-indigo-100 to-purple-200">
                        3D 정밀 진단 코어
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        Neural 3.0
                    </span>
                </div>

                <button
                    onClick={toggleFrequency}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isPlayingSound 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse' 
                            : 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 border-white/[0.08]'
                    }`}
                    title="실시간 주파수 튜닝"
                >
                    {isPlayingSound ? <VolumeX size={14} className="text-slate-950" /> : <Volume2 size={14} className="text-cyan-400" />}
                    <span className="text-[10px] font-mono font-bold">{isPlayingSound ? `${yVal}Hz ON` : `${yVal}Hz`}</span>
                </button>
            </header>

            {/* ── 2. Official Patent Authority Badge ── */}
            <div className="relative z-20 px-4 pt-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-[#100c28] to-slate-950/90 border border-cyan-400/30 flex items-center justify-between shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
                            <Cpu size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-cyan-300 font-mono tracking-wide">
                                🔬 대한민국 특허출원 제10-2025-0166877호
                            </p>
                            <p className="text-[11px] text-gray-200 font-black">
                                심리·생체데이터 기반 스트레스 관리 솔루션
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-black text-cyan-300 bg-cyan-400/10 px-2 py-1 rounded-lg border border-cyan-400/30">
                            X·Y·Z 스캔
                        </span>
                    </div>
                </div>
            </div>

            {/* ── 3. 6-Tab Interactive Horizontal Switcher ── */}
            <div className="relative z-20 px-4 pt-3">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {TAB_CONFIG.map((tab) => {
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 rounded-2xl font-bold text-xs transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105'
                                        : 'bg-[#0e0a1e]/80 text-gray-400 border-white/[0.08] hover:bg-white/[0.06] hover:text-gray-200'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span className="tracking-tight">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── 4. Main Diagnostic Display Body ── */}
            <main className="relative z-20 px-4 pt-3.5 space-y-4">

                {/* ══════════════════════════════════════════════════════
                    MODULE 1: 3D 종합 좌표 스캔 (Full Scan)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'full_scan' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        {/* 3D Coordinate Hologram Card */}
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#140e30] via-[#0c0820] to-[#060312] border border-cyan-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Orbit size={16} className="text-cyan-400 animate-spin" />
                                        <span>3D 내면 에너지 좌표계 (Hologram)</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                        {sajuSpecs?.fourPillarsStr || '辛巳일주 辛金 다이아몬드 코어'}
                                    </p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                    스캔 지수 94.8%
                                </span>
                            </div>

                            {/* 3차원 축 실시간 스펙트럼 뷰 */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-1">
                                    <p className="text-[10px] font-mono text-cyan-300 font-bold">X축 (의식)</p>
                                    <p className="text-base font-black text-white">Meta 3.0</p>
                                    <p className="text-[9px] text-cyan-400/80 font-mono">지수: {xVal}/100</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 space-y-1">
                                    <p className="text-[10px] font-mono text-purple-300 font-bold">Y축 (주파수)</p>
                                    <p className="text-base font-black text-amber-300">{yVal} Hz</p>
                                    <p className="text-[9px] text-purple-400/80 font-mono">솔페지오 사랑</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1">
                                    <p className="text-[10px] font-mono text-emerald-300 font-bold">Z축 (벡터)</p>
                                    <p className="text-base font-black text-emerald-200">+{zVal} (안정)</p>
                                    <p className="text-[9px] text-emerald-400/80 font-mono">영점 밸런스</p>
                                </div>
                            </div>

                            {/* 레이더 진단 요약 */}
                            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
                                <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Activity size={13} />
                                    <span>종합 에너지 진단 리포트</span>
                                </p>
                                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                                    대표님의 고유 코어인 <strong>{sajuSpecs?.coreDesc || '辛金 초정밀 관찰자 코어'}</strong>가 높은 주파수({yVal}Hz) 영역에서 작동 중입니다. 외부 잡음을 0(Zero)으로 차단하고 독창적 창조성을 발현하기에 최적화된 상태입니다.
                                </p>
                            </div>

                            {/* 스캔 리프레시 버튼 */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={handleRunFullScan}
                                    disabled={isScanning}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <RefreshCw size={15} className={isScanning ? 'animate-spin' : ''} />
                                    <span>{isScanning ? `3D 뉴럴 스캐닝 중... (${scanProgress}%)` : '⚡ 3D 좌표 정밀 재스캔 실행하기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI('제 3D 에너지 좌표(X: Meta 3.0, Y: 528Hz 솔페지오, Z: +12 안정 영점)를 기반으로, 현재 사업 추진과 웰니스 전략에 대한 초정밀 1:1 진단 코칭을 진행해주세요.')}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-cyan-400" />
                                    <span>이 좌표로 AI 코치와 1:1 심층 상담하기 ➔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 2: X축 의식 코드 (Dark vs Neural vs Meta)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'x_axis' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181135] via-[#100a24] to-[#070412] border border-cyan-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Zap size={16} className="text-cyan-400" />
                                        <span>X축: 의식 코드 스펙트럼</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">Dark ➔ Neural ➔ Meta 3단계</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                    현위치: Meta Code
                                </span>
                            </div>

                            {/* 3단계 의식 스펙트럼 카드 */}
                            <div className="space-y-2.5">
                                {/* 1. Dark Code */}
                                <div className="p-3 rounded-2xl bg-black/40 border border-rose-500/30 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-rose-300">Level 1. Dark Code (결핍/생존)</span>
                                        <span className="text-[9px] font-mono text-gray-400">0 ~ 35%</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        타인의 인정에 목마르고, 상처받지 않으려 과도한 방어기제와 불안에 사로잡힌 상태.
                                    </p>
                                </div>

                                {/* 2. Neural Code */}
                                <div className="p-3 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-indigo-300">Level 2. Neural Code (자각/균형)</span>
                                        <span className="text-[9px] font-mono text-gray-400">36 ~ 70%</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        자신의 감정과 패턴을 객관적으로 관찰하고, 0(Zero)의 기준점으로 되돌아오는 힘을 갖춘 상태.
                                    </p>
                                </div>

                                {/* 3. Meta Code */}
                                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 space-y-1 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-cyan-200 flex items-center gap-1">
                                            <Sparkles size={13} className="text-amber-300" />
                                            <span>Level 3. Meta Code (초월/주권자)</span>
                                        </span>
                                        <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-400/20 px-1.5 py-0.5 rounded border border-cyan-400/30">
                                            ACTIVE
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-cyan-100 font-bold leading-relaxed">
                                        외부 환경에 휘둘리지 않고 내 삶의 완벽한 창조자이자 주권자로서 가치를 창출하는 최고조 상태.
                                    </p>
                                </div>
                            </div>

                            {/* 슬라이더 컨트롤러 */}
                            <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.08] space-y-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-gray-400 font-bold">의식 레벨 조정</span>
                                    <span className="text-cyan-300 font-bold">{xVal}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={xVal}
                                    onChange={(e) => setXVal(parseInt(e.target.value))}
                                    className="w-full accent-cyan-400 cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={() => handleConsultAI(`제 현재 의식 코드 위치인 [X축 ${xVal}% Meta Code 영역]을 더욱 확고히 다지고 Dark Code의 무의식적 습관을 완전히 디버깅하는 맞춤형 1:1 코칭을 해주세요.`)}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                                <MessageSquare size={14} />
                                <span>X축 의식 코드 최적화 솔루션 받기 ➔</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 3: Y축 주파수 측정 (Freq Equalizer)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'y_axis' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#191036] via-[#100924] to-[#070412] border border-purple-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Radio size={16} className="text-purple-400" />
                                        <span>Y축: 행동 주파수 측정계 (Freq)</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">파괴적 저주파 vs 생산적 고주파</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">
                                    {yVal} Hz 타겟
                                </span>
                            </div>

                            {/* 솔페지오 주파수 프리셋 버튼 */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { hz: 432, name: '432Hz 자연평화' },
                                    { hz: 528, name: '528Hz 기적·사랑' },
                                    { hz: 963, name: '963Hz 우주각성' }
                                ].map((p) => (
                                    <button
                                        key={p.hz}
                                        onClick={() => setYVal(p.hz)}
                                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                            yVal === p.hz
                                                ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-md'
                                                : 'bg-white/[0.04] text-gray-300 border-white/[0.08] hover:bg-white/[0.08]'
                                        }`}
                                    >
                                        <p className="text-xs font-mono font-bold">{p.hz}Hz</p>
                                        <p className="text-[9px] truncate">{p.name}</p>
                                    </button>
                                ))}
                            </div>

                            {/* 주파수 파동 이퀄라이저 비주얼 */}
                            <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 flex items-center justify-center gap-1.5 h-20">
                                {[40, 65, 85, 95, 70, 90, 60, 80, 100, 75, 55, 85].map((h, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="w-1.5 bg-gradient-to-t from-purple-500 to-amber-400 rounded-full"
                                        animate={{ height: isPlayingSound ? [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] : `${h * 0.5}%` }}
                                        transition={{ repeat: Infinity, duration: 0.8 + (idx % 3) * 0.2 }}
                                    />
                                ))}
                            </div>

                            <p className="text-xs text-indigo-200 bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-500/30 leading-relaxed font-medium">
                                🎵 <strong>주파수 진단 처방:</strong> 현재 {yVal}Hz는 세포 재생 및 불안 완화, 직관력 극대화에 가장 강력한 변환 주파수입니다.
                            </p>

                            <button
                                onClick={toggleFrequency}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                                {isPlayingSound ? <VolumeX size={15} /> : <Volume2 size={15} />}
                                <span>{isPlayingSound ? '528Hz 주파수 사운드 끄기' : '🔊 528Hz 치유 사운드 실시간 청취하기'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 4: Z축 에너지 벡터 (Vector Balance)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'z_axis' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#161132] via-[#0e0922] to-[#070412] border border-emerald-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Compass size={16} className="text-emerald-400" />
                                        <span>Z축: 에너지 벡터 밸런서</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">내면 함몰(-50) vs 외면 폭발(+50)</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                    영점 오차: +{zVal} (우수)
                                </span>
                            </div>

                            {/* 벡터 게이지 바 */}
                            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-3">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-blue-300">← 내면 함몰 (고립/침체)</span>
                                    <span className="text-emerald-300 font-mono font-black">0 (Zero Point)</span>
                                    <span className="text-rose-300">외면 폭발 (번아웃) →</span>
                                </div>
                                
                                <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-emerald-400 z-10" />
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                                        style={{ width: `${Math.min(100, Math.max(0, 50 + zVal))}%` }}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-emerald-200/90 bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-500/30 leading-relaxed font-medium">
                                ⚖️ <strong>벡터 처방:</strong> 에너지가 바깥으로 과도하게 쏠리지 않고 완벽한 영점 중심(0)에 머물고 있습니다. 번아웃 위험도가 극히 낮습니다.
                            </p>

                            <button
                                onClick={() => handleConsultAI(`제 에너지 벡터(Z축) 상태인 [${zVal > 0 ? '약간의 외향 추진형' : '내면 침잠형'}]을 바탕으로, 에너지 누수를 막고 최적의 사업 실행력을 유지하는 코칭을 해주세요.`)}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                                <MessageSquare size={14} />
                                <span>Z축 에너지 벡터 리포트 상담하기 ➔</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 5: 64 뉴럴 DNA 디코더 (Decoder)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'decoder' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#1a1038] via-[#110926] to-[#070412] border border-amber-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Key size={16} className="text-amber-400" />
                                        <span>64 뉴럴 DNA 원형 디코더</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">휴먼 뉴럴 코드 & 유전자 열쇠</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    Code #{sajuSpecs?.codeNum || 28}
                                </span>
                            </div>

                            {/* 3단계 DNA 디코딩 카드 */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-400/40 space-y-2">
                                <h4 className="text-xs font-black text-amber-300">
                                    {sajuSpecs?.codeTitle || 'Code 28. 택풍대과 (The Overload)'}
                                </h4>
                                <div className="space-y-1.5 text-xs">
                                    <p className="text-gray-300">
                                        🌑 <strong>그림자(Shadow):</strong> 과부하(Overload) - 혼자 모든 책임을 짊어지려는 부담
                                    </p>
                                    <p className="text-amber-200 font-bold">
                                        🎁 <strong>선물(Gift):</strong> 불굴의 추진력(Endurance) - 어떤 위기도 돌파하는 실행력
                                    </p>
                                    <p className="text-cyan-200 font-bold">
                                        ✨ <strong>초월(Siddhi):</strong> 불멸의 창조(Immortality) - 시대를 초월하는 독보적 유산
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleConsultAI(`제 사주 일주와 연결된 [${sajuSpecs?.codeTitle || 'Code 28. 택풍대과'}]의 그림자(과부하)를 극복하고 천재적 선물(불굴의 추진력)을 사업에서 100% 발현하는 1:1 심층 디코딩 코칭을 해주세요.`)}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                                <MessageSquare size={14} />
                                <span>이 뉴럴 코드로 AI 1:1 심층 디코딩 받기 ➔</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 6: 3S 솔루션 실행 (Scan-Sync-Shift)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'action_3s' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181138] via-[#100a26] to-[#070412] border border-cyan-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Rocket size={16} className="text-cyan-400" />
                                        <span>Sovereign 3S 실행 프로토콜</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">Scan ➔ Sync ➔ Shift 3단계</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                    {is3SCompleted ? '✅ 실행 완료' : '대기 중'}
                                </span>
                            </div>

                            {/* 3S Step Cards */}
                            <div className="space-y-2">
                                <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        1S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-white">SCAN (내면 왜곡 인지)</p>
                                        <p className="text-[11px] text-gray-300">내 안의 3D 좌표 왜곡과 에너지 누수 포인트를 실시간 파악.</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        2S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-white">SYNC (528Hz 영점 동기화)</p>
                                        <p className="text-[11px] text-gray-300">과열된 화(火)와 불안을 0(Zero)의 중심축에 일치시킴.</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-400/40 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        3S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-amber-200">SHIFT (주권자 의식 전환)</p>
                                        <p className="text-[11px] text-gray-200">생존 모드에서 벗어나 최고의 창조적 사업 실행력으로 도약.</p>
                                    </div>
                                </div>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={handleExecute3S}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <CheckCircle2 size={16} />
                                    <span>{is3SCompleted ? '✨ 3S 솔루션 재실행하기' : '⚡ Sovereign 3S 솔루션 지금 즉시 실행하기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI('Sovereign 3S 프로토콜(Scan-Sync-Shift)을 오늘 제 일정과 사업 프로젝트에 적용하여 즉각적인 성과를 낼 수 있는 1:1 맞춤 실행 가이드를 제시해주세요.')}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-cyan-400" />
                                    <span>AI 코치와 3S 솔루션 1:1 실시간 실행하기 ➔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default function NeuralDiagnosisPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#05030b] flex items-center justify-center text-cyan-300 font-mono text-xs">
                <span>🧬 3D 정밀 진단 시스템 동기화 중...</span>
            </div>
        }>
            <NeuralDiagnosisContent />
        </Suspense>
    );
}
