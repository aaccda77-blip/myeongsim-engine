'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Activity, ArrowLeft, Sparkles, Zap, Shield, Eye, Compass, 
    Cpu, Key, Orbit, Rocket, Layers, Radio, Volume2, VolumeX,
    CheckCircle2, RefreshCw, MessageSquare, AlertCircle, ArrowUpRight,
    TrendingUp, Award, BarChart3, ChevronRight, Sliders, Play, Atom,
    Calendar, User, Edit3, Check, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateSaju } from '@/utils/SajuCalculator';

// ── 6대 핵심 진단 탭 정의 ──
type DiagnosticTab = 'full_scan' | 'x_axis' | 'y_axis' | 'z_axis' | 'decoder' | 'action_3s';

const TAB_CONFIG: { id: DiagnosticTab; label: string; icon: string; badge: string }[] = [
    { id: 'full_scan', label: '3D 종합 스캔', icon: '🧬', badge: 'XYZ 좌표' },
    { id: 'x_axis', label: 'X축: 의식 코드', icon: '⚡', badge: 'Dark·Meta' },
    { id: 'y_axis', label: 'Y축: 주파수(Hz)', icon: '📡', badge: '528Hz' },
    { id: 'z_axis', label: 'Z축: 에너지 벡터', icon: '🧭', badge: '영점 밸런스' },
    { id: 'decoder', label: '64 뉴럴 DNA', icon: '🔑', badge: '원형 해독' },
    { id: 'action_3s', label: '3S 솔루션 실행', icon: '🚀', badge: 'Scan-Shift' }
];

// 오행 및 일간별 코어 정보 맵
const DAY_MASTER_INFO: Record<string, { name: string; title: string; element: string; color: string; ringColor: string }> = {
    '甲': { name: '甲木 (갑목)', title: '창조적 개척 리더 코어', element: '목(木)', color: 'from-emerald-400 to-teal-300', ringColor: 'border-emerald-400/60' },
    '乙': { name: '乙木 (을목)', title: '유연한 적응 네트워크 코어', element: '목(木)', color: 'from-teal-400 to-cyan-300', ringColor: 'border-teal-400/60' },
    '丙': { name: '丙火 (병화)', title: '뜨거운 태양 비전 코어', element: '화(火)', color: 'from-rose-500 to-amber-400', ringColor: 'border-rose-400/60' },
    '丁': { name: '丁火 (정화)', title: '섬세한 등불 통찰 코어', element: '화(火)', color: 'from-purple-400 to-rose-300', ringColor: 'border-purple-400/60' },
    '戊': { name: '戊土 (무토)', title: '포용적 수용 닻 코어', element: '토(土)', color: 'from-amber-400 to-yellow-300', ringColor: 'border-amber-400/60' },
    '己': { name: '己土 (기토)', title: '조용히 경작하는 결실 코어', element: '토(土)', color: 'from-yellow-500 to-amber-400', ringColor: 'border-yellow-400/60' },
    '庚': { name: '庚金 (경금)', title: '용맹한 결단 무쇠 코어', element: '금(金)', color: 'from-slate-200 to-cyan-200', ringColor: 'border-slate-300/60' },
    '辛': { name: '辛金 (신금)', title: '초정밀 관찰자 다이아몬드 코어', element: '금(金)', color: 'from-cyan-300 via-indigo-300 to-amber-200', ringColor: 'border-cyan-400/60' },
    '壬': { name: '壬水 (임수)', title: '무한 침잠 지혜 바다 코어', element: '수(水)', color: 'from-blue-500 to-indigo-400', ringColor: 'border-blue-400/60' },
    '癸': { name: '癸水 (계수)', title: '깊은 단비 감성 시뮬레이터 코어', element: '수(水)', color: 'from-indigo-400 to-sky-300', ringColor: 'border-indigo-400/60' }
};

const HEXAGRAM_TITLES: Record<number, { title: string; shadow: string; gift: string; siddhi: string }> = {
    1: { title: '중건천 (The Creator)', shadow: '독선적 고립', gift: '창조적 시작', siddhi: '순수 현존' },
    2: { title: '중곤지 (The Mother)', shadow: '무기력한 순응', gift: '무한한 수용', siddhi: '일체화' },
    14: { title: '화천대유 (The Abundance)', shadow: '소유욕과 집착', gift: '풍요의 나눔', siddhi: '영적 부' },
    15: { title: '지산겸 (The Humility)', shadow: '자기 비하', gift: '당당한 겸양', siddhi: '완전한 조화' },
    28: { title: '택풍대과 (The Overload)', shadow: '과부하와 독박', gift: '불굴의 돌파력', siddhi: '불멸의 창조' },
    29: { title: '감위수 (The Deep Diver)', shadow: '끝없는 두려움', gift: '깊은 헌신과 몰입', siddhi: '순수 헌신' },
    30: { title: '이위화 (The Visionary)', shadow: '타오르는 갈망', gift: '명석한 통찰력', siddhi: '영적 광명' },
    64: { title: '화수미제 (Before Completion)', shadow: '혼란과 미완성', gift: '끝없는 가능성', siddhi: '영원한 시작' }
};

function NeuralDiagnosisContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab') as DiagnosticTab;

    const [activeTab, setActiveTab] = useState<DiagnosticTab>(
        TAB_CONFIG.some(t => t.id === tabParam) ? tabParam : 'full_scan'
    );

    // 528Hz 사운드 상태
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);

    // 사용자 정보 및 생년월일 상태
    const [userName, setUserName] = useState<string>('이경윤');
    const [birthDate, setBirthDate] = useState<string>('1980-07-07');
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [tempBirth, setTempBirth] = useState<string>('1980-07-07');
    const [tempName, setTempName] = useState<string>('이경윤');
    const [syncAlert, setSyncAlert] = useState<string | null>(null);

    // 동적 계산된 사주 스펙
    const [sajuSpecs, setSajuSpecs] = useState<any>(null);

    // 실시간 스캔 시뮬레이션 상태
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(100);

    // 3D 좌표 상태
    const [xVal, setXVal] = useState(78);
    const [yVal, setYVal] = useState(528);
    const [zVal, setZVal] = useState(12);

    // 3S 퀘스트 완료 상태
    const [is3SCompleted, setIs3SCompleted] = useState(false);

    // ── 핵심: 모든 로컬스토리지 소스로부터 실제 사용자 생년월일 자동 감지 ──
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // 1. 모든 알려진 프로필 키에서 순차 탐색
            let detectedBirth = '';
            let detectedName = '';

            const rawKeys = [
                'myeongsim_user_profile',
                'saju_input_data',
                'user_profile',
                'user_onboarding_data',
                'user_saju_info',
                'report-storage',
                'myeongsim_user_info'
            ];

            for (const key of rawKeys) {
                const raw = localStorage.getItem(key);
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        const b = parsed?.birthDate || parsed?.birth_date || parsed?.birthInfo || 
                                  parsed?.birthDay || parsed?.birth_day ||
                                  (parsed?.year ? `${parsed.year}-${String(parsed.month || 1).padStart(2, '0')}-${String(parsed.day || 1).padStart(2, '0')}` : '');
                        const n = parsed?.userName || parsed?.name || parsed?.user_name || '';
                        if (b && !detectedBirth) detectedBirth = b;
                        if (n && !detectedName) detectedName = n;
                    } catch (e) {}
                }
            }

            // 단일 문자열 키 확인
            if (!detectedBirth) {
                detectedBirth = localStorage.getItem('saju_user_birth') || 
                                localStorage.getItem('user_birth_date') || 
                                localStorage.getItem('myeongsim_user_birth') || 
                                '1980-07-07';
            }
            if (!detectedName) {
                detectedName = localStorage.getItem('saju_user_name') || 
                               localStorage.getItem('user_name') || 
                               localStorage.getItem('myeongsim_user_name') || 
                               '이경윤';
            }

            setBirthDate(detectedBirth);
            setUserName(detectedName);
            setTempBirth(detectedBirth);
            setTempName(detectedName);

            calculateAndSetSaju(detectedBirth, detectedName);
        }
    }, []);

    // 생년월일 기반 사주 4주 8자 & 3D 좌표 동적 계산 함수
    const calculateAndSetSaju = (bDateStr: string, nameStr: string) => {
        try {
            const cleanBirth = bDateStr.trim() || '1980-07-07';
            const saju = calculateSaju(cleanBirth, '14:00');
            
            const fourPillarsStr = `${saju.year.gan.hanja}${saju.year.ji.hanja}년 ${saju.month.gan.hanja}${saju.month.ji.hanja}월 ${saju.day.gan.hanja}${saju.day.ji.hanja}일 ${saju.time.gan.hanja}${saju.time.ji.hanja}시`;
            const dayGanHanja = saju.day.gan.hanja;
            
            const parts = cleanBirth.split('-');
            const y = parseInt(parts[0]) || 1980;
            const m = parseInt(parts[1]) || 7;
            const d = parseInt(parts[2]) || 7;
            
            // 64괘 뉴럴 코드 산출
            const codeNum = ((y + m * 3 + d * 7) % 64) + 1;
            const hexInfo = HEXAGRAM_TITLES[codeNum] || {
                title: `Code ${String(codeNum).padStart(2, '0')}. 64비트 뉴럴 코드 (Hexagram ${codeNum})`,
                shadow: '내면의 저항과 두려움',
                gift: '독창적인 잠재 역량의 발현',
                siddhi: '우주적 지혜의 초월 현존'
            };

            const masterInfo = DAY_MASTER_INFO[dayGanHanja] || {
                name: `${dayGanHanja}金`,
                title: '초정밀 관찰자 코어',
                element: '금(金)',
                color: 'from-cyan-300 via-indigo-300 to-amber-200',
                ringColor: 'border-cyan-400/60'
            };

            // 생년월일에 따른 맞춤 X·Y·Z 좌표 도출
            const dynamicX = Math.min(95, Math.max(65, 60 + ((d * 3 + m * 5) % 35)));
            const dynamicZ = ((d * 7 + y) % 25) - 8; // -8 ~ +17 사이의 안정 영점
            
            setXVal(dynamicX);
            setZVal(dynamicZ);

            setSajuSpecs({
                dayMaster: dayGanHanja,
                fourPillarsStr,
                codeNum,
                codeTitle: `Code ${String(codeNum).padStart(2, '0')}. ${hexInfo.title}`,
                shadowDesc: hexInfo.shadow,
                giftDesc: hexInfo.gift,
                siddhiDesc: hexInfo.siddhi,
                coreName: masterInfo.name,
                coreTitle: masterInfo.title,
                element: masterInfo.element,
                coreColor: masterInfo.color,
                ringColor: masterInfo.ringColor
            });
        } catch (e) {
            console.error('Saju calculation error:', e);
        }
    };

    // 생년월일 수동 변경 저장 처리
    const handleSaveProfile = () => {
        if (!tempBirth) return;
        setBirthDate(tempBirth);
        setUserName(tempName || '사용자');
        setIsEditingProfile(false);

        calculateAndSetSaju(tempBirth, tempName);

        if (typeof window !== 'undefined') {
            const updated = {
                userName: tempName || '사용자',
                name: tempName || '사용자',
                birthDate: tempBirth,
                birth_date: tempBirth,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('myeongsim_user_profile', JSON.stringify(updated));
            localStorage.setItem('saju_input_data', JSON.stringify(updated));
            localStorage.setItem('saju_user_birth', tempBirth);
            localStorage.setItem('saju_user_name', tempName);
        }

        setSyncAlert(`🟢 ${tempName}님의 생년월일(${tempBirth}) 1:1 맞춤 사주 좌표 연동 완료!`);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setSyncAlert(null), 4000);
    };

    // 528Hz 주파수 사운드 토글
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
            
            {/* 🌌 Deep Cyber Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[360px] bg-gradient-to-b from-cyan-600/15 via-purple-700/15 to-transparent rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute top-1/2 right-[-60px] w-64 h-64 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-16 left-[-60px] w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* ── 1. Top Header Navigation ── */}
            <header className="relative z-30 flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.08] bg-[#080514]/85 backdrop-blur-xl">
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
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isPlayingSound 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse' 
                            : 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 border-white/[0.08]'
                    }`}
                    title="실시간 주파수 튜닝"
                >
                    {isPlayingSound ? <VolumeX size={14} className="text-slate-950" /> : <Volume2 size={14} className="text-cyan-400" />}
                    <span className="text-[10px] font-mono font-bold">{isPlayingSound ? `${yVal}Hz` : `${yVal}Hz`}</span>
                </button>
            </header>

            {/* ── 2. 사용자 맞춤 사주 동기화 바 (User Birth Date & Day Master Bar) ── */}
            <div className="relative z-20 px-4 pt-3 space-y-2">
                
                {/* 실시간 알림 */}
                {syncAlert && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-300 text-center"
                    >
                        {syncAlert}
                    </motion.div>
                )}

                {/* 프로필 및 생년월일 카드 */}
                <div className="p-3 rounded-2xl bg-[#0f0a22]/90 border border-indigo-400/30 shadow-xl backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                            <User size={15} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-white">
                                    {userName}님 <span className="text-cyan-300 font-mono text-[11px]">({sajuSpecs?.coreName || '辛金'})</span>
                                </p>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                    {birthDate}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                {sajuSpecs?.fourPillarsStr || '庚申년 癸未월 辛巳일 乙未시'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cyan-300 border border-cyan-400/30 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                    >
                        <Edit3 size={12} />
                        <span>{isEditingProfile ? '닫기' : '변경'}</span>
                    </button>
                </div>

                {/* 생년월일 인라인 수정 폼 */}
                <AnimatePresence>
                    {isEditingProfile && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3.5 rounded-2xl bg-[#140c2e] border border-cyan-400/40 shadow-xl space-y-3"
                        >
                            <p className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                                <Calendar size={13} />
                                <span>사주 맞춤 생년월일 직접 변경하기</span>
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">이름</label>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        placeholder="이름"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">생년월일 (YYYY-MM-DD)</label>
                                    <input
                                        type="date"
                                        value={tempBirth}
                                        onChange={(e) => setTempBirth(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                                <Check size={14} />
                                <span>이 생년월일로 3D 좌표 즉시 재계산 및 동기화</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── 3. Official Patent Authority Badge ── */}
            <div className="relative z-20 px-4 pt-2">
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-[#100c28] to-slate-950/90 border border-cyan-400/30 flex items-center justify-between shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="size-7 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
                            <Cpu size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-cyan-300 font-mono tracking-wide">
                                🔬 대한민국 특허출원 제10-2025-0166877호
                            </p>
                            <p className="text-[10px] text-gray-200 font-black">
                                심리·생체데이터 기반 스트레스 관리 솔루션
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono font-black text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-lg border border-cyan-400/30">
                            X·Y·Z 스캔
                        </span>
                    </div>
                </div>
            </div>

            {/* ── 4. 6대 탭 2x3 럭셔리 그리드 스위처 ── */}
            <div className="relative z-20 px-4 pt-2.5">
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0d091e]/90 border border-white/[0.08] shadow-inner">
                    {TAB_CONFIG.map((tab) => {
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 rounded-xl font-black transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer text-center relative overflow-hidden ${
                                    isSelected
                                        ? 'bg-gradient-to-b from-cyan-500 to-indigo-600 text-white shadow-lg border border-cyan-300/40 scale-[1.02]'
                                        : 'bg-white/[0.03] text-gray-400 border border-white/[0.05] hover:bg-white/[0.06] hover:text-gray-200'
                                }`}
                            >
                                <span className="text-xs">{tab.icon}</span>
                                <span className="text-[10px] font-bold tracking-tight whitespace-nowrap leading-tight">{tab.label}</span>
                                <span className={`text-[8px] font-mono opacity-80 ${isSelected ? 'text-cyan-100' : 'text-gray-500'}`}>
                                    {tab.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── 5. Main Diagnostic Interactive Body ── */}
            <main className="relative z-20 px-4 pt-3.5 space-y-4">

                {/* ══════════════════════════════════════════════════════
                    MODULE 1: 3D 종합 좌표 스캔 (Full Scan) + 리얼 3D 홀로그램
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'full_scan' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        
                        {/* 🌟 3D 입체 홀로그램 자이로스코프 챔버 카드 🌟 */}
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#150f33] via-[#0c0822] to-[#060312] border border-cyan-400/40 shadow-2xl space-y-4 relative overflow-hidden">
                            
                            {/* 헤더 */}
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Orbit size={16} className="text-cyan-400 animate-spin" />
                                        <span>3D 내면 에너지 좌표계 (Hologram)</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                        {userName}님 사주: {sajuSpecs?.fourPillarsStr || '庚申년 癸未월 辛巳일 乙未시'}
                                    </p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                    스캔 지수 94.8%
                                </span>
                            </div>

                            {/* 🛸 3D 네온 자이로스코프 홀로그램 비주얼 */}
                            <div className="relative h-48 w-full flex items-center justify-center bg-black/40 rounded-2xl border border-cyan-500/20 overflow-hidden">
                                
                                {/* 배경 레이더 원형 링 */}
                                <div className="absolute size-44 rounded-full border border-cyan-500/10 animate-pulse" />
                                <div className="absolute size-36 rounded-full border border-dashed border-indigo-500/20" />
                                <div className="absolute size-28 rounded-full border border-purple-500/20" />

                                {/* 3D X축 회전 링 */}
                                <motion.div 
                                    className={`absolute size-36 rounded-full border-2 ${sajuSpecs?.ringColor || 'border-cyan-400/40'} border-t-cyan-300`}
                                    animate={{ rotate: 360, rotateX: [45, 60, 45], rotateY: [20, 45, 20] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />

                                {/* 3D Y축 회전 링 */}
                                <motion.div 
                                    className="absolute size-32 rounded-full border-2 border-purple-400/40 border-r-purple-300"
                                    animate={{ rotate: -360, rotateY: [40, 70, 40], rotateX: [30, 50, 30] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />

                                {/* 3D Z축 회전 링 */}
                                <motion.div 
                                    className="absolute size-28 rounded-full border border-emerald-400/50 border-b-emerald-300"
                                    animate={{ rotate: 360, rotateZ: [15, 45, 15] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />

                                {/* 중앙 다이아몬드 코어 (사용자 사주 일간 동적 반영) */}
                                <motion.div 
                                    className={`relative z-10 size-12 rounded-xl bg-gradient-to-tr ${sajuSpecs?.coreColor || 'from-cyan-400 via-indigo-400 to-amber-300'} flex flex-col items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.8)]`}
                                    animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 180, 270, 360] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <span className="text-xs font-black text-slate-950 leading-none">
                                        {sajuSpecs?.dayMaster || '辛'}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-900 leading-none mt-0.5">
                                        {sajuSpecs?.element || '金'}
                                    </span>
                                </motion.div>

                                {/* 홀로그램 타깃 태그 오버레이 */}
                                <div className="absolute top-2 left-3 text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
                                    X: Meta ({xVal}%)
                                </div>
                                <div className="absolute top-2 right-3 text-[9px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/30">
                                    Y: {yVal}Hz Solfeggio
                                </div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-400/30">
                                    Z: Vector {zVal > 0 ? `+${zVal}` : zVal} (Zero Equilibrium)
                                </div>
                            </div>

                            {/* 3차원 축 인포그래픽 수치 카드 */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-1.5">
                                    <p className="text-[10px] font-mono text-cyan-300 font-bold">X축 (의식)</p>
                                    <p className="text-sm font-black text-white leading-tight">Meta 3.0</p>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${xVal}%` }} />
                                    </div>
                                    <p className="text-[9px] text-cyan-400/80 font-mono">레벨: {xVal}%</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 space-y-1.5">
                                    <p className="text-[10px] font-mono text-amber-300 font-bold">Y축 (주파수)</p>
                                    <p className="text-sm font-black text-amber-300 leading-tight">{yVal} Hz</p>
                                    <div className="flex items-center justify-center gap-0.5 h-1.5">
                                        {[40, 70, 100, 60, 80].map((h, i) => (
                                            <div key={i} className="w-1 bg-amber-400 rounded-full" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-amber-400/80 font-mono">사랑의 주파수</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1.5">
                                    <p className="text-[10px] font-mono text-emerald-300 font-bold">Z축 (벡터)</p>
                                    <p className="text-sm font-black text-emerald-200 leading-tight">
                                        {zVal > 0 ? `+${zVal}` : zVal} (안정)
                                    </p>
                                    <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-emerald-400 z-10" />
                                        <div className="h-full bg-emerald-400" style={{ width: `${50 + zVal}%` }} />
                                    </div>
                                    <p className="text-[9px] text-emerald-400/80 font-mono">영점 밸런스</p>
                                </div>
                            </div>

                            {/* 종합 에너지 진단 리포트 */}
                            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
                                <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Activity size={13} />
                                    <span>{userName}님 맞춤 에너지 진단 리포트</span>
                                </p>
                                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                                    {userName}님의 고유 코어인 <strong>{sajuSpecs?.coreTitle || '초정밀 관찰자 코어'}</strong>가 높은 주파수({yVal}Hz) 영역에서 작동 중입니다. 외부 잡음을 0(Zero)으로 차단하고 본질적 창조성을 발현하기에 최적화된 상태입니다.
                                </p>
                            </div>

                            {/* 액션 버튼 2종 */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={handleRunFullScan}
                                    disabled={isScanning}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <RefreshCw size={15} className={isScanning ? 'animate-spin' : ''} />
                                    <span>{isScanning ? `3D 뉴럴 스캐닝 중... (${scanProgress}%)` : '⚡ 3D 좌표 정밀 재스캔 실행하기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI(`${userName}님의 생년월일(${birthDate}, 사주: ${sajuSpecs?.fourPillarsStr}) 기반 3D 에너지 좌표(X: Meta 3.0, Y: ${yVal}Hz 솔페지오, Z: ${zVal} 영점)를 정밀 분석하여, 오늘 필요한 최적의 웰니스 및 사업 실행 전략 코칭을 해주세요.`)}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-cyan-400" />
                                    <span>이 맞춤 좌표로 AI 코치와 1:1 심층 상담하기 ➔</span>
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

                            <div className="space-y-2.5">
                                <div className="p-3 rounded-2xl bg-black/40 border border-rose-500/30 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-rose-300">Level 1. Dark Code (결핍/생존)</span>
                                        <span className="text-[9px] font-mono text-gray-400">0 ~ 35%</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        타인의 인정에 목마르고, 상처받지 않으려 과도한 방어기제와 불안에 사로잡힌 상태.
                                    </p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-indigo-300">Level 2. Neural Code (자각/균형)</span>
                                        <span className="text-[9px] font-mono text-gray-400">36 ~ 70%</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        자신의 감정과 패턴을 객관적으로 관찰하고, 0(Zero)의 기준점으로 되돌아오는 힘을 갖춘 상태.
                                    </p>
                                </div>

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
                                onClick={() => handleConsultAI(`${userName}님의 생년월일(${birthDate})과 현재 의식 코드 위치인 [X축 ${xVal}% Meta Code]를 연결하여 Dark Code의 무의식적 습관을 완전히 디버깅하는 맞춤 코칭을 해주세요.`)}
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
                                🎵 <strong>{userName}님 맞춤 주파수 처방:</strong> {sajuSpecs?.coreName} 기질에 가장 공명하는 {yVal}Hz 파동으로 뇌파 안정과 영점 회복을 유도합니다.
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
                                    영점 오차: {zVal > 0 ? `+${zVal}` : zVal} (우수)
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-3">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-blue-300">← 내면 함몰 (고립)</span>
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
                                ⚖️ <strong>{userName}님 벡터 처방:</strong> {sajuSpecs?.coreName}의 균형점으로, 에너지가 바깥으로 과도하게 누수되지 않는 안정권입니다.
                            </p>

                            <button
                                onClick={() => handleConsultAI(`${userName}님의 에너지 벡터(Z축 ${zVal}) 상태를 바탕으로, 에너지 누수를 방지하고 사업적 돌파구를 여는 1:1 맞춤 코칭을 진행해주세요.`)}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                                <MessageSquare size={14} />
                                <span>Z축 에너지 벡터 리포트 상담하기 ➔</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 5: 64 뉴럴 DNA 디코더 (Decoder) - 맞춤 연동
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
                                    <p className="text-[10px] text-gray-400">생년월일({birthDate}) 기반 맞춤 해독</p>
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
                                        🌑 <strong>그림자(Shadow):</strong> {sajuSpecs?.shadowDesc || '과부하(Overload) - 모든 짐을 혼자 지려는 부담'}
                                    </p>
                                    <p className="text-amber-200 font-bold">
                                        🎁 <strong>선물(Gift):</strong> {sajuSpecs?.giftDesc || '불굴의 추진력(Endurance) - 어떤 위기도 돌파하는 실행력'}
                                    </p>
                                    <p className="text-cyan-200 font-bold">
                                        ✨ <strong>초월(Siddhi):</strong> {sajuSpecs?.siddhiDesc || '불멸의 창조(Immortality) - 시대를 초월하는 독보적 유산'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleConsultAI(`${userName}님의 생년월일(${birthDate}, 사주: ${sajuSpecs?.fourPillarsStr})과 연결된 [${sajuSpecs?.codeTitle}]의 그림자를 극복하고 천재적 선물([${sajuSpecs?.giftDesc}])을 100% 발현하는 심층 디코딩 코칭을 해주세요.`)}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                                <MessageSquare size={14} />
                                <span>이 맞춤 뉴럴 코드로 AI 1:1 심층 디코딩 받기 ➔</span>
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
                                    <p className="text-[10px] text-gray-400">{userName}님 전용 실행 코드</p>
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
                                        <p className="text-[11px] text-gray-300">{userName}님의 3D 좌표 왜곡과 에너지 누수 포인트를 실시간 파악.</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        2S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-white">SYNC (528Hz 영점 동기화)</p>
                                        <p className="text-[11px] text-gray-300">과열된 감정과 불안을 0(Zero)의 중심축에 일치시킴.</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-400/40 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        3S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-amber-200">SHIFT (주권자 의식 전환)</p>
                                        <p className="text-[11px] text-gray-200">{sajuSpecs?.coreTitle}의 힘으로 최고의 창조적 사업 실행력 발휘.</p>
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
                                    onClick={() => handleConsultAI(`${userName}님의 Sovereign 3S 프로토콜(Scan-Sync-Shift)을 오늘 사업 프로젝트와 라이프스타일에 적용하여 즉각 성과를 낼 수 있는 1:1 맞춤 실행 지침을 주세요.`)}
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
