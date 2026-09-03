'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Activity, ArrowLeft, Sparkles, Zap, Shield, Eye, Compass, 
    Cpu, Key, Orbit, Rocket, Layers, Radio, Volume2, VolumeX,
    CheckCircle2, RefreshCw, MessageSquare, AlertCircle, ArrowUpRight,
    TrendingUp, Award, BarChart3, ChevronRight, Sliders, Play, Atom,
    Calendar, User, Edit3, Check, X, AlertTriangle, ShieldCheck, Flame, Clock, Dna
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateSaju } from '@/utils/SajuCalculator';

// ── 6대 핵심 진단 탭 정의 ──
type DiagnosticTab = 'full_scan' | 'x_axis' | 'y_axis' | 'z_axis' | 'decoder' | 'action_3s';

const TAB_CONFIG: { id: DiagnosticTab; label: string; icon: string; badge: string }[] = [
    { id: 'full_scan', label: '3D 종합 스캔', icon: '🧬', badge: 'XYZ 좌표' },
    { id: 'x_axis', label: 'X축: 의식 코드', icon: '⚡', badge: 'Dark·Meta' },
    { id: 'y_axis', label: 'Y축: 주파수(Hz)', icon: '📡', badge: '파동 측정' },
    { id: 'z_axis', label: 'Z축: 에너지 벡터', icon: '🧭', badge: '위험도 진단' },
    { id: 'decoder', label: '64 뉴럴 DNA', icon: '🔑', badge: '원형 해독' },
    { id: 'action_3s', label: '3S 솔루션 실행', icon: '🚀', badge: '긴급 처방' }
];

// 오행 매핑 헬퍼
const GAN_OHAENG: Record<string, string> = {
    '甲': '목', '乙': '목', '丙': '화', '丁': '화',
    '戊': '토', '己': '토', '庚': '금', '辛': '금',
    '壬': '수', '癸': '수'
};
const JI_OHAENG: Record<string, string> = {
    '寅': '목', '卯': '목',
    '巳': '화', '午': '화',
    '辰': '토', '戌': '토', '丑': '토', '未': '토',
    '申': '금', '酉': '금',
    '亥': '수', '子': '수'
};

const DAY_MASTER_INFO: Record<string, { name: string; title: string; element: string; color: string; ringColor: string }> = {
    '甲': { name: '갑목(甲木)', title: '창조적 개척 리더 코어', element: '목(木)', color: 'from-emerald-400 to-teal-300', ringColor: 'border-emerald-400/60' },
    '乙': { name: '을목(乙木)', title: '유연한 적응 네트워크 코어', element: '목(木)', color: 'from-teal-400 to-cyan-300', ringColor: 'border-teal-400/60' },
    '丙': { name: '병화(丙火)', title: '뜨거운 태양 비전 코어', element: '화(火)', color: 'from-rose-500 to-amber-400', ringColor: 'border-rose-400/60' },
    '丁': { name: '정화(丁火)', title: '섬세한 등불 통찰 코어', element: '화(火)', color: 'from-purple-400 to-rose-300', ringColor: 'border-purple-400/60' },
    '戊': { name: '무토(戊土)', title: '포용적 수용 대지 코어', element: '토(土)', color: 'from-amber-400 to-yellow-300', ringColor: 'border-amber-400/60' },
    '己': { name: '기토(己土)', title: '조용히 경작하는 결실 코어', element: '토(土)', color: 'from-yellow-500 to-amber-400', ringColor: 'border-yellow-400/60' },
    '庚': { name: '경금(庚金)', title: '용맹한 결단 무쇠 코어', element: '금(金)', color: 'from-slate-200 to-cyan-200', ringColor: 'border-slate-300/60' },
    '辛': { name: '신금(辛金)', title: '초정밀 관찰자 다이아몬드 코어', element: '금(金)', color: 'from-cyan-300 via-indigo-300 to-amber-200', ringColor: 'border-cyan-400/60' },
    '壬': { name: '임수(壬水)', title: '무한 침잠 지혜 바다 코어', element: '수(水)', color: 'from-blue-500 to-indigo-400', ringColor: 'border-blue-400/60' },
    '癸': { name: '계수(癸水)', title: '깊은 단비 감성 시뮬레이터 코어', element: '수(水)', color: 'from-indigo-400 to-sky-300', ringColor: 'border-indigo-400/60' }
};

const HEXAGRAM_TITLES: Record<number, { title: string; shadow: string; gift: string; siddhi: string }> = {
    1: { title: '중건천 (The Creator)', shadow: '독선적 고립과 오만', gift: '창조적 돌파력', siddhi: '순수 현존' },
    2: { title: '중곤지 (The Mother)', shadow: '무기력한 수동성', gift: '무한한 수용', siddhi: '일체화' },
    14: { title: '화천대유 (The Abundance)', shadow: '소유욕과 집착', gift: '풍요의 나눔', siddhi: '영적 부' },
    15: { title: '지산겸 (The Humility)', shadow: '자기 비하와 위축', gift: '당당한 겸양', siddhi: '완전한 조화' },
    28: { title: '택풍대과 (The Overload)', shadow: '과부하와 독박 책임감', gift: '불굴의 돌파력', siddhi: '불멸의 창조' },
    29: { title: '감위수 (The Deep Diver)', shadow: '끝없는 두려움과 심연', gift: '깊은 헌신과 몰입', siddhi: '순수 헌신' },
    30: { title: '이위화 (The Visionary)', shadow: '타오르는 조급증과 갈망', gift: '명석한 통찰력', siddhi: '영적 광명' },
    64: { title: '화수미제 (Before Completion)', shadow: '혼란과 미완성의 불안', gift: '끝없는 가능성', siddhi: '영원한 시작' }
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
    const [userName, setUserName] = useState<string>('강미숙');
    const [birthDate, setBirthDate] = useState<string>('2003-01-25');
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [tempBirth, setTempBirth] = useState<string>('2003-01-25');
    const [tempName, setTempName] = useState<string>('강미숙');
    const [syncAlert, setSyncAlert] = useState<string | null>(null);

    // 동적 계산된 사주 및 오행 분석 스펙
    const [sajuSpecs, setSajuSpecs] = useState<any>(null);

    // 실시간 스캔 상태
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(100);

    // 3D 좌표 상태
    const [xVal, setXVal] = useState(65);
    const [yVal, setYVal] = useState(285);
    const [zVal, setZVal] = useState(-18);

    // 3S 퀘스트 완료 상태
    const [is3SCompleted, setIs3SCompleted] = useState(false);

    // ── 사주 4주 8자 & 5대 오행 비율 정밀 연산 엔진 (2-Layer Blueprint vs Real-time) ──
    const analyzeSajuDetail = (bDateStr: string, nameStr: string) => {
        try {
            const cleanBirth = bDateStr.trim() || '2003-01-25';
            const saju = calculateSaju(cleanBirth, '14:00');

            const ohaengCounts: Record<string, number> = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
            const gans = [saju.year.gan.hanja, saju.month.gan.hanja, saju.day.gan.hanja, saju.time.gan.hanja];
            const jis = [saju.year.ji.hanja, saju.month.ji.hanja, saju.day.ji.hanja, saju.time.ji.hanja];

            gans.forEach(g => {
                const oh = GAN_OHAENG[g];
                if (oh) ohaengCounts[oh] = (ohaengCounts[oh] || 0) + 1;
            });
            jis.forEach(j => {
                const oh = JI_OHAENG[j];
                if (oh) ohaengCounts[oh] = (ohaengCounts[oh] || 0) + 1;
            });

            const ohaengPercent: Record<string, number> = {
                '목': Math.round((ohaengCounts['목'] / 8) * 100),
                '화': Math.round((ohaengCounts['화'] / 8) * 100),
                '토': Math.round((ohaengCounts['토'] / 8) * 100),
                '금': Math.round((ohaengCounts['금'] / 8) * 100),
                '수': Math.round((ohaengCounts['수'] / 8) * 100)
            };

            const sortedOhaeng = Object.entries(ohaengPercent).sort((a, b) => b[1] - a[1]);
            const dominantOh = sortedOhaeng[0];
            const deficientOh = sortedOhaeng.filter(item => item[1] === 0).map(item => item[0]);

            const fourPillarsKor = `${saju.year.gan.char}${saju.year.ji.char}(${saju.year.gan.hanja}${saju.year.ji.hanja})년 ${saju.month.gan.char}${saju.month.ji.char}(${saju.month.gan.hanja}${saju.month.ji.hanja})월 ${saju.day.gan.char}${saju.day.ji.char}(${saju.day.gan.hanja}${saju.day.ji.hanja})일 ${saju.time.gan.char}${saju.time.ji.char}(${saju.time.gan.hanja}${saju.time.ji.hanja})시`;
            const dayGanHanja = saju.day.gan.hanja;
            const dayGanKor = saju.day.gan.char;

            const parts = cleanBirth.split('-');
            const y = parseInt(parts[0]) || 2003;
            const m = parseInt(parts[1]) || 1;
            const d = parseInt(parts[2]) || 25;
            
            const codeNum = ((y + m * 3 + d * 7) % 64) + 1;
            const hexInfo = HEXAGRAM_TITLES[codeNum] || {
                title: `Code ${String(codeNum).padStart(2, '0')}. 64비트 뉴럴 코드`,
                shadow: '내면의 정체와 두려움',
                gift: '독창적인 잠재 역량',
                siddhi: '우주적 지혜의 초월 현존'
            };

            const masterInfo = DAY_MASTER_INFO[dayGanHanja] || {
                name: `${dayGanKor}토(${dayGanHanja}土)`,
                title: '포용적 수용 대지 코어',
                element: '토(土)',
                color: 'from-amber-400 to-yellow-300',
                ringColor: 'border-amber-400/60'
            };

            // ── 2-Layer 분리 연산: 평생 선천 체질 vs 2026년 실시간 운 ──
            let statusBadge = '안정권';
            let statusColor = 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30';
            let lifetimeBlueprint = '';
            let realtimeFlow = '';
            let calcX = 70;
            let calcY = 528;
            let calcZ = 0;

            if (dominantOh[1] >= 45) {
                if (dominantOh[0] === '토') {
                    statusBadge = '⚠️ 2026 실시간: 내면 압축 주의군';
                    statusColor = 'text-amber-300 bg-amber-500/20 border-amber-400/40 animate-pulse';
                    calcX = 65;
                    calcY = 285;
                    calcZ = -18;
                    
                    // 1계층: 평생 타고난 체질 (하드웨어 Blueprint)
                    lifetimeBlueprint = `${nameStr}님은 평생 사주 원국에 흙(土)이 ${dominantOh[1]}%로 비대한 【우직한 대지(戊土)형】 하드웨어 체질입니다. 어떤 풍파도 묵묵히 혼자 짊어지고 버텨내지만, 감정과 스트레스를 밖으로 표출하지 않고 속으로 삭히는 성향이 평생의 기저에 깔려 있습니다.`;
                    
                    // 2계층: 2026년 丙午년 & 오늘 실시간 상태 (현재 흐름)
                    realtimeFlow = `현재 2026년(병오년 붉은 말의 해)은 매우 뜨거운 불(火)의 기운이 지배합니다. 이미 많은 흙(土)에 뜨거운 불이 쏟아져 들어오니(화생토), 안 그래도 무거운 에너지가 바짝 굳어 【지금 이 시기】에 유독 내면 압축과 가슴 답답함, 소화기 피로(Z: -18 함몰, Y: 285Hz 저주파)가 극대화되는 타이밍입니다!`;
                } else if (dominantOh[0] === '화') {
                    statusBadge = '🔥 2026 실시간: 과열·번아웃 폭발 주의';
                    statusColor = 'text-rose-300 bg-rose-500/20 border-rose-400/40 animate-pulse';
                    calcX = 58;
                    calcY = 190;
                    calcZ = +28;
                    lifetimeBlueprint = `${nameStr}님은 평생 사주에 불(火)이 ${dominantOh[1]}%로 활활 타오르는 【열정적 태양형】 체질입니다. 행동력이 폭발적이나 쉽게 조급해지는 성향을 타고났습니다.`;
                    realtimeFlow = `2026년 丙午년의 강력한 화(火) 기운이 겹치면서, 화(火) 에너지가 한계치를 초과하여 【지금 이 시기】에 극심한 번아웃과 충동적 분노 노이즈(Z: +28 폭발)가 위험 수준에 달해 있습니다.`;
                } else {
                    statusBadge = '⚡ 2026 실시간: 에너지 편중 주의군';
                    statusColor = 'text-purple-300 bg-purple-500/20 border-purple-400/40';
                    calcX = 68;
                    calcY = 340;
                    calcZ = -12;
                    lifetimeBlueprint = `${nameStr}님은 평생 사주 원국에 ${dominantOh[0]} 기운이 ${dominantOh[1]}%로 편중된 고유 체질을 지니고 있습니다.`;
                    realtimeFlow = `2026년의 기운과 맞물려 특정 에너지 회로에 체증이 발생하고 있으므로 528Hz 정화 튜닝이 요구됩니다.`;
                }
            } else {
                statusBadge = '✨ 2026 실시간: 영점 균형 안정권';
                statusColor = 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30';
                calcX = 82;
                calcY = 528;
                calcZ = +4;
                lifetimeBlueprint = `${nameStr}님은 평생 사주 원국에 5대 오행이 골고루 분산된 【오행 조화형】 체질입니다.`;
                realtimeFlow = `2026년 세운의 흐름 속에서도 큰 왜곡 없이 영점(0)의 평정심을 원활하게 유지하고 있습니다.`;
            }

            setXVal(calcX);
            setYVal(calcY);
            setZVal(calcZ);

            setSajuSpecs({
                dayMaster: dayGanHanja,
                dayMasterKor: dayGanKor,
                fourPillarsKor,
                codeNum,
                codeTitle: `Code ${String(codeNum).padStart(2, '0')}. ${hexInfo.title}`,
                shadowDesc: hexInfo.shadow,
                giftDesc: hexInfo.gift,
                siddhiDesc: hexInfo.siddhi,
                coreName: masterInfo.name,
                coreTitle: masterInfo.title,
                element: masterInfo.element,
                coreColor: masterInfo.color,
                ringColor: masterInfo.ringColor,
                ohaengPercent,
                dominantOh: dominantOh[0],
                dominantPercent: dominantOh[1],
                deficientOh: deficientOh.length > 0 ? deficientOh.join(', ') : '없음(조화)',
                statusBadge,
                statusColor,
                lifetimeBlueprint,
                realtimeFlow
            });
        } catch (e) {
            console.error('Saju detail calculation error:', e);
        }
    };

    // 로컬스토리지 자동 감지
    useEffect(() => {
        if (typeof window !== 'undefined') {
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

            if (!detectedBirth) {
                detectedBirth = localStorage.getItem('saju_user_birth') || 
                                localStorage.getItem('user_birth_date') || 
                                localStorage.getItem('myeongsim_user_birth') || 
                                '2003-01-25';
            }
            if (!detectedName) {
                detectedName = localStorage.getItem('saju_user_name') || 
                               localStorage.getItem('user_name') || 
                               localStorage.getItem('myeongsim_user_name') || 
                               '강미숙';
            }

            setBirthDate(detectedBirth);
            setUserName(detectedName);
            setTempBirth(detectedBirth);
            setTempName(detectedName);

            analyzeSajuDetail(detectedBirth, detectedName);
        }
    }, []);

    // 생년월일 수동 저장
    const handleSaveProfile = () => {
        if (!tempBirth) return;
        setBirthDate(tempBirth);
        setUserName(tempName || '사용자');
        setIsEditingProfile(false);

        analyzeSajuDetail(tempBirth, tempName);

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

        setSyncAlert(`🟢 ${tempName}님의 생년월일(${tempBirth}) 오행 분석 및 2-Layer 3D 좌표 1:1 동기화 완료!`);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setSyncAlert(null), 4000);
    };

    // 528Hz 사운드 토글
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
                osc.frequency.setValueAtTime(528, ctx.currentTime);

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
                    title="528Hz 솔페지오 주파수 사운드"
                >
                    {isPlayingSound ? <VolumeX size={14} className="text-slate-950" /> : <Volume2 size={14} className="text-cyan-400" />}
                    <span className="text-[10px] font-mono font-bold">{isPlayingSound ? '528Hz ON' : '528Hz'}</span>
                </button>
            </header>

            {/* ── 2. 사용자 프로필 & 사주 연동 카드 ── */}
            <div className="relative z-20 px-4 pt-3 space-y-2">
                {syncAlert && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-300 text-center"
                    >
                        {syncAlert}
                    </motion.div>
                )}

                <div className="p-3.5 rounded-2xl bg-[#0f0a22]/90 border border-indigo-400/30 shadow-xl backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                            <User size={15} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-white">
                                    {userName}님 <span className="text-amber-300 font-mono text-[11px]">({sajuSpecs?.coreName || '무토(戊土)'})</span>
                                </p>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                    {birthDate}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-300 font-mono mt-0.5">
                                {sajuSpecs?.fourPillarsKor || '임오(壬午)년 계축(癸丑)월 무술(戊戌)일 기미(己未)시'}
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

                {/* 생년월일 수정 폼 */}
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
                                <span>생년월일 변경 ➔ 실시간 2-Layer 3D 좌표 재계산</span>
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
                                    <label className="text-[10px] text-gray-400 block mb-1">생년월일</label>
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
                                <span>이 생년월일로 오행 분석 및 2-Layer 좌표 즉시 동기화</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── 3. 특허 뱃지 바 ── */}
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

            {/* ── 4. 6대 탭 2x3 럭셔리 그리드 ── */}
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

            {/* ── 5. Main Diagnostic Body ── */}
            <main className="relative z-20 px-4 pt-3.5 space-y-4">

                {/* ══════════════════════════════════════════════════════
                    MODULE 1: 3D 종합 좌표 스캔 + [2-Layer 평생 vs 2026실시간]
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
                                        {userName}님: {sajuSpecs?.fourPillarsKor || '임오(壬午)년 계축(癸丑)월 무술(戊戌)일 기미(己未)시'}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-full border ${sajuSpecs?.statusColor || 'text-amber-300 bg-amber-500/20 border-amber-400/40'}`}>
                                    {sajuSpecs?.statusBadge || '⚠️ 2026 실시간: 내면 압축 주의'}
                                </span>
                            </div>

                            {/* 🛸 3D 네온 자이로스코프 홀로그램 비주얼 */}
                            <div className="relative h-48 w-full flex items-center justify-center bg-black/40 rounded-2xl border border-cyan-500/20 overflow-hidden">
                                <div className="absolute size-44 rounded-full border border-cyan-500/10 animate-pulse" />
                                <div className="absolute size-36 rounded-full border border-dashed border-indigo-500/20" />
                                <div className="absolute size-28 rounded-full border border-purple-500/20" />

                                <motion.div 
                                    className={`absolute size-36 rounded-full border-2 ${sajuSpecs?.ringColor || 'border-amber-400/60'} border-t-cyan-300`}
                                    animate={{ rotate: 360, rotateX: [45, 60, 45], rotateY: [20, 45, 20] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />

                                <motion.div 
                                    className="absolute size-32 rounded-full border-2 border-purple-400/40 border-r-purple-300"
                                    animate={{ rotate: -360, rotateY: [40, 70, 40], rotateX: [30, 50, 30] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                />

                                <motion.div 
                                    className="absolute size-28 rounded-full border border-emerald-400/50 border-b-emerald-300"
                                    animate={{ rotate: 360, rotateZ: [15, 45, 15] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />

                                {/* 중앙 코어 */}
                                <motion.div 
                                    className={`relative z-10 size-13 rounded-xl bg-gradient-to-tr ${sajuSpecs?.coreColor || 'from-amber-400 to-yellow-300'} flex flex-col items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.8)]`}
                                    animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 180, 270, 360] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <span className="text-xs font-black text-slate-950 leading-none">
                                        {sajuSpecs?.dayMaster || '戊'}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-900 leading-none mt-0.5">
                                        {sajuSpecs?.element || '土(토)'}
                                    </span>
                                </motion.div>

                                <div className="absolute top-2 left-3 text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
                                    X: Meta ({xVal}%)
                                </div>
                                <div className="absolute top-2 right-3 text-[9px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/30">
                                    Y: {yVal}Hz 파동
                                </div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-400/30">
                                    Z: Vector {zVal > 0 ? `+${zVal}` : zVal} {zVal < 0 ? '(내면 함몰)' : '(안정)'}
                                </div>
                            </div>

                            {/* 5대 오행 분포도 바 */}
                            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.08] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-gray-300 flex items-center gap-1">
                                        <BarChart3 size={13} className="text-cyan-400" />
                                        <span>사주 8자 5대 오행 분포도</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-amber-300">
                                        지배: {sajuSpecs?.dominantOh}({sajuSpecs?.dominantPercent}%) / 결핍: {sajuSpecs?.deficientOh}
                                    </span>
                                </div>

                                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-white/10">
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['목'] || 0}%` }} className="bg-emerald-500" title="목" />
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['화'] || 0}%` }} className="bg-rose-500" title="화" />
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['토'] || 0}%` }} className="bg-amber-400" title="토" />
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['금'] || 0}%` }} className="bg-slate-300" title="금" />
                                    <div style={{ width: `${sajuSpecs?.ohaengPercent?.['수'] || 0}%` }} className="bg-blue-500" title="수" />
                                </div>

                                <div className="flex justify-between text-[9px] font-mono pt-1 text-gray-400">
                                    <span className="text-emerald-400">목(木) {sajuSpecs?.ohaengPercent?.['목'] || 0}%</span>
                                    <span className="text-rose-400">화(火) {sajuSpecs?.ohaengPercent?.['화'] || 0}%</span>
                                    <span className="text-amber-300 font-bold">토(土) {sajuSpecs?.ohaengPercent?.['토'] || 0}%</span>
                                    <span className="text-slate-300">금(金) {sajuSpecs?.ohaengPercent?.['금'] || 0}%</span>
                                    <span className="text-blue-400">수(水) {sajuSpecs?.ohaengPercent?.['수'] || 0}%</span>
                                </div>
                            </div>

                            {/* 3차원 축 인포그래픽 수치 카드 */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-1.5">
                                    <p className="text-[10px] font-mono text-cyan-300 font-bold">X축 (의식)</p>
                                    <p className="text-sm font-black text-white leading-tight">자각 {xVal}%</p>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${xVal}%` }} />
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-mono">생각 과부하</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 space-y-1.5">
                                    <p className="text-[10px] font-mono text-amber-300 font-bold">Y축 (주파수)</p>
                                    <p className="text-sm font-black text-amber-300 leading-tight">{yVal} Hz</p>
                                    <div className="flex items-center justify-center gap-0.5 h-1.5">
                                        {[40, 55, 30, 60, 45].map((h, i) => (
                                            <div key={i} className="w-1 bg-amber-400 rounded-full" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                    <p className="text-[9px] text-rose-400 font-mono font-bold">528Hz 정화필요</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1.5">
                                    <p className="text-[10px] font-mono text-emerald-300 font-bold">Z축 (벡터)</p>
                                    <p className="text-sm font-black text-rose-300 leading-tight">
                                        {zVal > 0 ? `+${zVal}` : zVal} {zVal < 0 ? '(함몰)' : '(안정)'}
                                    </p>
                                    <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-emerald-400 z-10" />
                                        <div className="h-full bg-rose-400" style={{ width: `${50 + zVal}%` }} />
                                    </div>
                                    <p className="text-[9px] text-rose-300 font-mono font-bold">속앓이/고립</p>
                                </div>
                            </div>

                            {/* 🌟 2-LAYER 정밀 리포트: 평생 선천 체질 vs 2026년 실시간 흐름 🌟 */}
                            <div className="space-y-3 pt-1">
                                
                                {/* 🧬 1계층: 평생 선천 체질 (하드웨어 Blueprint) */}
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-950 border border-indigo-500/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-indigo-300 flex items-center gap-1.5">
                                            <Dna size={14} className="text-indigo-400" />
                                            <span>[1계층] 평생 선천 체질 (하드웨어 Blueprint)</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-indigo-200 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-400/30">
                                            평생 사주 원국
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                                        {sajuSpecs?.lifetimeBlueprint}
                                    </p>
                                </div>

                                {/* ⚡ 2계층: 2026년 丙午년 & 오늘 실시간 진단 (현재 에너지 상태) */}
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-purple-950/40 to-slate-950 border border-amber-400/40 space-y-2 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                                            <Clock size={14} className="text-amber-400 animate-pulse" />
                                            <span>[2계층] 2026년 丙午년 & 오늘 실시간 상태 (현재 흐름)</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                                            실시간 세운·일진
                                        </span>
                                    </div>
                                    <p className="text-xs text-white font-bold leading-relaxed">
                                        {sajuSpecs?.realtimeFlow}
                                    </p>
                                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed font-medium">
                                        💡 <strong>지금 필요한 솔루션:</strong> 현재 과열된 흙(土)의 기운을 식히고 528Hz로 파동을 조율한 뒤, 결핍된 목(木) 에너지를 순환시키는 <strong>Sovereign 3S 처방(Shift)</strong>이 시급합니다.
                                    </div>
                                </div>
                            </div>

                            {/* 액션 버튼 2종 */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveTab('action_3s')}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <Rocket size={15} />
                                    <span>🚀 2026년 실시간 체증을 해결할 3S 솔루션 실행하기 ➔</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI(`${userName}님의 [평생 사주 원국: 토 62% 과다, 목 0% 결핍]과 [2026년 병오년 세운 화생토 과열로 인한 실시간 Z축 -18 함몰 정체] 상태를 정밀 분석하여, 지금 당장 가슴 답답함과 에너지 체증을 뚫어낼 수 있는 1:1 맞춤형 솔루션을 코칭해주세요.`)}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-cyan-400" />
                                    <span>AI 코치와 2026 실시간 완충 1:1 심층 상담하기 ➔</span>
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
                                    현위치: Meta 진입단계 ({xVal}%)
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                <div className="p-3 rounded-2xl bg-black/40 border border-rose-500/30 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-rose-300">Level 1. Dark Code (결핍/생존)</span>
                                        <span className="text-[9px] font-mono text-gray-400">0 ~ 35%</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        과도한 책임감과 타인의 시선에 묶여 속으로 삭히고 방어기제를 세우는 상태.
                                    </p>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-indigo-300">Level 2. Neural Code (자각/균형)</span>
                                        <span className="text-[9px] font-mono text-gray-400">36 ~ 70%</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        자신의 감정 억압을 객관적으로 인지하고, 0(Zero)의 기준점으로 되돌아오는 단계.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 space-y-1 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-cyan-200 flex items-center gap-1">
                                            <Sparkles size={13} className="text-amber-300" />
                                            <span>Level 3. Meta Code (초월/주권자)</span>
                                        </span>
                                        <span className="text-[9px] font-mono font-bold text-cyan-300 bg-cyan-400/20 px-1.5 py-0.5 rounded border border-cyan-400/30">
                                            GOAL
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-cyan-100 font-bold leading-relaxed">
                                        혼자 떠안던 무거운 짐을 내려놓고, 우주의 흐름 속에서 자유롭게 가치를 창출하는 주권자 상태.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleConsultAI(`${userName}님의 현재 의식 코드(${xVal}%)를 Dark Code의 무거운 책임감에서 벗어나 Meta Code 3.0으로 완벽히 승화시키는 1:1 맞춤 코칭을 해주세요.`)}
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
                                    <p className="text-[10px] text-gray-400">현재 측정치: {yVal}Hz (가라앉은 파동)</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">
                                    528Hz 정화 권장
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { hz: 285, name: '285Hz 현재측정' },
                                    { hz: 528, name: '528Hz 기적·정화' },
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

                            <p className="text-xs text-indigo-200 bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-500/30 leading-relaxed font-medium">
                                🎵 <strong>주파수 진단 처방:</strong> 현재 {userName}님의 행동 주파수는 {yVal}Hz로 무겁게 침잠되어 있습니다. 528Hz 솔페지오 치유 사운드를 통해 세포 활성도를 정상화하세요.
                            </p>

                            <button
                                onClick={toggleFrequency}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                                {isPlayingSound ? <VolumeX size={15} /> : <Volume2 size={15} />}
                                <span>{isPlayingSound ? '528Hz 주파수 사운드 끄기' : '🔊 528Hz 솔페지오 사랑의 파동 청취하기'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    MODULE 4: Z축 에너지 벡터 (Vector Balance)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'z_axis' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#161132] via-[#0e0922] to-[#070412] border border-rose-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                                        <Compass size={16} className="text-rose-400" />
                                        <span>Z축: 에너지 벡터 밸런서</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">내면 함몰(-50) vs 외면 폭발(+50)</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                                    현재: {zVal} (내면 함몰 위험)
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-3">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-rose-300">← 내면 함몰 (속앓이/고립)</span>
                                    <span className="text-emerald-300 font-mono font-black">0 (Zero Point)</span>
                                    <span className="text-blue-300">외면 폭발 (번아웃) →</span>
                                </div>
                                
                                <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-emerald-400 z-10" />
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-rose-500 to-amber-400"
                                        style={{ width: `${Math.min(100, Math.max(0, 50 + zVal))}%` }}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-rose-200/90 bg-rose-950/30 p-3.5 rounded-2xl border border-rose-500/30 leading-relaxed font-medium">
                                ⚖️ <strong>벡터 처방:</strong> 에너지가 바깥으로 순환하지 못하고 내면에 축적되어 감정 체증(Z: {zVal})이 발생했습니다. 3S 솔루션으로 0(Zero)의 균형점을 회복하세요.
                            </p>

                            <button
                                onClick={() => handleConsultAI(`${userName}님의 에너지 벡터(Z축 ${zVal} 내면 함몰 상태)를 해소하고, 속앓이와 감정 체증을 풀어내는 1:1 맞춤 코칭을 진행해주세요.`)}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
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
                                    <p className="text-[10px] text-gray-400">생년월일({birthDate}) 기반 맞춤 해독</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    Code #{sajuSpecs?.codeNum || 28}
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-400/40 space-y-2">
                                <h4 className="text-xs font-black text-amber-300">
                                    {sajuSpecs?.codeTitle}
                                </h4>
                                <div className="space-y-1.5 text-xs">
                                    <p className="text-gray-300">
                                        🌑 <strong>그림자(Shadow):</strong> {sajuSpecs?.shadowDesc}
                                    </p>
                                    <p className="text-amber-200 font-bold">
                                        🎁 <strong>선물(Gift):</strong> {sajuSpecs?.giftDesc}
                                    </p>
                                    <p className="text-cyan-200 font-bold">
                                        ✨ <strong>초월(Siddhi):</strong> {sajuSpecs?.siddhiDesc}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleConsultAI(`${userName}님의 생년월일(${birthDate}) 기반 [${sajuSpecs?.codeTitle}]의 그림자를 극복하고 천재적 선물을 100% 발현하는 심층 디코딩 코칭을 해주세요.`)}
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
                                        <span>Sovereign 3S 긴급 처방 프로토콜</span>
                                    </h3>
                                    <p className="text-[10px] text-gray-400">{userName}님 오행 불균형 해소 솔루션</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                    {is3SCompleted ? '✅ 처방 완료' : '처방 대기'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/30 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        1S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-white">SCAN (과밀집 에너지 인지)</p>
                                        <p className="text-[11px] text-gray-300">토(土) {sajuSpecs?.dominantPercent || 50}% 과밀집으로 인한 2026년 실시간 내면 압축과 피로 직시.</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        2S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-white">SYNC (528Hz 파동 정화)</p>
                                        <p className="text-[11px] text-gray-300">285Hz로 가라앉은 신경계를 528Hz 기적의 사랑 주파수로 정화.</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-400/40 flex items-start gap-2.5">
                                    <span className="size-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                                        3S
                                    </span>
                                    <div>
                                        <p className="text-xs font-black text-amber-200">SHIFT (결핍 에너지 완충 및 순환)</p>
                                        <p className="text-[11px] text-gray-200">결핍된 {sajuSpecs?.deficientOh} 에너지를 채워 2026년 막힌 기운을 뚫어냄.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={handleExecute3S}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <CheckCircle2 size={16} />
                                    <span>{is3SCompleted ? '✨ 3S 처방 재실행하기' : '⚡ Sovereign 3S 처방 지금 즉시 실행하기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI(`${userName}님의 Sovereign 3S 긴급 처방을 오늘 일상에 적용하여 2026년 막힌 오행 에너지를 시원하게 순환시키는 1:1 맞춤 실행 가이드를 제시해주세요.`)}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-cyan-400" />
                                    <span>AI 코치와 3S 긴급 처방 1:1 실시간 실행하기 ➔</span>
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
