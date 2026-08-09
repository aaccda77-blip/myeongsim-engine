import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Lock, Sparkles, Gift, ChevronRight, Crown, Unlock, CheckCircle2, RefreshCw } from 'lucide-react';

const DailyNeuralMissionCard = dynamic(() => import('@/components/coaching/DailyNeuralMissionCard'), { ssr: false });
const MonthlyMindReport = dynamic(() => import('@/components/coaching/MonthlyMindReport'), { ssr: false });
const MicroPassModal = dynamic(() => import('@/components/coaching/MicroPassModal').then(m => m.MicroPassModal || m.default), { ssr: false });
const GeniusExplainModal = dynamic(() => import('@/components/coaching/GeniusExplainModal'), { ssr: false });

export type BlueprintLevel = 'dark' | 'neural' | 'meta';

export interface CodeData {
    id: string;
    title: string;                 // 예: "지향점: 을미"
    subtitle: string;              // 예: "척박한 땅에서도 결국 꽃을 피우는 끈기"
    darkCode: { name: string; desc: string };
    neuralCode: { name: string; desc: string };
    metaCode: { name: string; desc: string };
}

const mockData: CodeData[] = [
    {
        id: 'vision',
        title: "🚀 지향점 (Future Vision)",
        subtitle: "자신을 엄격히 관리하며 목표를 달성하는 의지",
        darkCode: { name: "[생존 강박]", desc: "미래가 불안하여 쉴 새 없이 일만 하거나, 결과가 당장 나오지 않으면 초조해하는 무의식 상태." },
        neuralCode: { name: "철두철미한 원칙주의자", desc: "자신을 엄격히 관리하며 목표를 달성하는 굳건한 의지와 추진력." },
        metaCode: { name: "[생태계 건축가]", desc: "나 혼자 살아남는 것을 넘어, 죽어있는 땅을 개척하여 모두가 살 수 있는 옥토로 바꾸는 위대한 결실." },
    },
    {
        id: 'identity',
        title: "👤 핵심 자아 (Core Identity)",
        subtitle: "끊임없이 배우고 성장하려는 욕구가 강한 리더",
        darkCode: { name: "[예민한 면도날]", desc: "완벽주의에 갇혀 자신과 타인을 날카롭게 비판하거나, 작은 실수에도 밤잠을 설치는 상태." },
        neuralCode: { name: "지적 탐구자", desc: "끊임없이 배우고 성장하려는 욕구가 강하며, 지식으로 리더십을 발휘하는 학자형 리더." },
        metaCode: { name: "[고귀한 권위]", desc: "힘으로 누르지 않아도 저절로 고개가 숙여지는 인격적 권위를 완성하여, 세상의 기준이 되는 존재." },
    },
    {
        id: 'social',
        title: "💼 사회적 환경 (Social Interface)",
        subtitle: "메마른 세상에 생기를 불어넣는 치유의 힘",
        darkCode: { name: "[희생의 늪]", desc: "남을 챙기느라 정작 자신은 고갈되거나, 타인의 감정 쓰레기통이 되어 우울감에 빠진 상태." },
        neuralCode: { name: "[치유의 단비]", desc: "삭막한 조직이나 프로젝트에 꼭 필요한 활력을 불어넣고, 사람들의 마음을 움직이는 기획자." },
        metaCode: { name: "[생명 소생자]", desc: "실패한 사람, 망해가는 프로젝트, 죽어가는 가치를 다시 살려내어 기적을 만드는 구원 투수." },
    },
    {
        id: 'base',
        title: "🌳 배경 에너지 (Base Energy)",
        subtitle: "타협하지 않는 뚝심과 거대한 스케일",
        darkCode: { name: "[고집불통 독재자]", desc: "내 방식만 옳다고 우기며 주변과 소통을 단절하거나, 힘으로 모든 것을 통제하려다 고립된 상태." },
        neuralCode: { name: "[강철의 사령관]", desc: "흔들리지 않는 주관과 강력한 추진력으로 조직을 장악하고 목표를 향해 돌진하는 리더." },
        metaCode: { name: "[제국의 건설자]", desc: "개인의 성공을 넘어, 후대까지 이어질 거대한 시스템과 유산을 남기는 역사의 주역." },
    }
];

export default function MultiDimensionalBlueprint({ 
    data = mockData,
    showActionButton = true,
    onActionClick,
    userName = '명심가',
    saju,
    locale = 'ko'
}: { 
    data?: CodeData[];
    showActionButton?: boolean;
    onActionClick?: () => void;
    userName?: string;
    saju?: any;
    locale?: string;
}) {
    const [globalLevel, setGlobalLevel] = useState<BlueprintLevel>('neural');
    
    // 탭별 인플레이스(In-Place) 해독 해제 상태 관리
    const [unlockedLevels, setUnlockedLevels] = useState<Record<BlueprintLevel, boolean>>({
        dark: false,
        neural: false,
        meta: false,
    });

    const [microPassOpen, setMicroPassOpen] = useState(false);
    const [explainModalOpen, setExplainModalOpen] = useState(false);
    const [selectedIndicator, setSelectedIndicator] = useState<{ name: string; score: string } | null>(null);

    const triggerHaptic = () => {
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(60);
        }
    };

    const handleLevelChange = (level: BlueprintLevel) => {
        triggerHaptic();
        setGlobalLevel(level);
    };

    // 지질 카드 클릭 시 1:1 생년월일 맞춤 감동 에세이 모달 오픈!
    const handleCardClick = (item: CodeData) => {
        triggerHaptic();
        const activeCodeName = globalLevel === 'dark' ? item.darkCode.name : globalLevel === 'neural' ? item.neuralCode.name : item.metaCode.name;
        setSelectedIndicator({
            name: item.title,
            score: `${activeCodeName} (${globalLevel.toUpperCase()} 주파수)`
        });
        setExplainModalOpen(true);
    };

    // 다른 메뉴나 모달로 이동하지 않고 바로 그 자리에서 기존 컨텐츠 70% 블러를 해제 및 100% 해독 출력!
    const handleInPlaceUnlock = () => {
        triggerHaptic();
        setUnlockedLevels(prev => ({
            ...prev,
            [globalLevel]: true
        }));
    };

    const handleFullPassClick = () => {
        triggerHaptic();
        setMicroPassOpen(true);
    };

    // 현재 탭이 해독 완료되었는지 확인
    const isCurrentTabUnlocked = unlockedLevels[globalLevel];

    // 맛보기 30% 공개 카드 (1st & 2nd)
    const freePreviewCards = data.slice(0, 2);
    // 70% 정밀 해독 카드 (3rd & 4th)
    const blurCards = data.slice(2);

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-700">

            {/* 배경 파티클 요소 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                {/* 헤더 타이틀 */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-amber-200 to-purple-400 mb-1 font-serif">
                        나의 기질 설계도
                    </h2>
                    <p className="text-slate-400 text-xs tracking-widest uppercase font-mono">MULTI-DIMENSIONAL BLUEPRINT</p>
                </div>

                {/* 차원 선택 컨트롤러 (Haptic Toggle) */}
                <div className="flex justify-center space-x-2 mb-6 bg-slate-800/60 p-1.5 rounded-full border border-slate-700/60 backdrop-blur-sm shadow-inner">
                    <button
                        onClick={() => handleLevelChange('dark')}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 w-1/3 flex items-center justify-center space-x-1.5 relative
                            ${globalLevel === 'dark' ? 'bg-rose-900/80 text-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.4)] ring-1 ring-rose-500/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                    >
                        <span>⚠️</span> <span>Dark</span>
                        {unlockedLevels.dark && <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-400" />}
                    </button>
                    <button
                        onClick={() => handleLevelChange('neural')}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 w-1/3 flex items-center justify-center space-x-1.5 relative
                            ${globalLevel === 'neural' ? 'bg-blue-900/80 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.4)] ring-1 ring-blue-500/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                    >
                        <span>✨</span> <span>Neural</span>
                        {unlockedLevels.neural && <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-400" />}
                    </button>
                    <button
                        onClick={() => handleLevelChange('meta')}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 w-1/3 flex items-center justify-center space-x-1.5 relative
                            ${globalLevel === 'meta' ? 'bg-amber-700/80 text-amber-100 shadow-[0_0_15px_rgba(217,119,6,0.4)] ring-1 ring-amber-500/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                    >
                        <span>👑</span> <span>Meta</span>
                        {unlockedLevels.meta && <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-400" />}
                    </button>
                </div>

                {/* ==========================================
                    1. [무료 맛보기 30%] 영역 (1st & 2nd 카드)
                    ========================================== */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                                🔓 기질 핵심 30% 무료 열람 중
                            </span>
                        </div>
                        {isCurrentTabUnlocked && (
                            <span className="text-[10px] font-black text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-amber-400" /> {globalLevel.toUpperCase()} 해독 완료
                            </span>
                        )}
                    </div>

                    {freePreviewCards.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => handleCardClick(item)}
                            className="group bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 hover:border-amber-400/50 rounded-2xl p-5 backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors">{item.title}</h3>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm mb-3 font-medium">"{item.subtitle}"</p>

                            <div className="transform transition-all duration-300">
                                {globalLevel === 'dark' && (
                                    <div className="bg-rose-950/40 border-l-4 border-rose-500 p-3.5 rounded-r-xl">
                                        <p className="font-bold text-rose-300 text-xs sm:text-sm mb-1">{item.darkCode.name}</p>
                                        <p className="text-rose-100/80 text-xs sm:text-sm leading-relaxed">{item.darkCode.desc}</p>
                                    </div>
                                )}
                                {globalLevel === 'neural' && (
                                    <div className="bg-blue-950/40 border-l-4 border-blue-400 p-3.5 rounded-r-xl">
                                        <p className="font-bold text-blue-300 text-xs sm:text-sm mb-1">{item.neuralCode.name}</p>
                                        <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">{item.neuralCode.desc}</p>
                                    </div>
                                )}
                                {globalLevel === 'meta' && (
                                    <div className="bg-amber-900/30 border-l-4 border-amber-500 p-3.5 rounded-r-xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                                        <p className="font-bold text-amber-400 text-xs sm:text-sm mb-1 relative z-10">{item.metaCode.name}</p>
                                        <p className="text-amber-100/90 text-xs sm:text-sm leading-relaxed relative z-10">{item.metaCode.desc}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-300 font-bold group-hover:text-amber-200 transition-colors">
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    클릭하여 생년월일 맞춤 상세 감동 에세이 보기
                                </span>
                                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ==========================================
                    2. [70% 정밀 해독 파트] 영역 (잠금 VS 인플레이스 해제)
                    ========================================== */}
                <div className="relative rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl my-6">
                    
                    {/* 해독 영역 컨텐츠 (해제 시 blur 제거 및 100% 선명하게 그대로 출력) */}
                    <div className={`transition-all duration-700 p-5 space-y-4 bg-slate-950/80 ${
                        isCurrentTabUnlocked 
                            ? 'filter-none opacity-100 select-text pointer-events-auto' 
                            : 'filter blur-md opacity-40 select-none pointer-events-none'
                    }`}>
                        {blurCards.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => isCurrentTabUnlocked && handleCardClick(item)}
                                className={`bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 shadow-md transition-all duration-200 ${
                                    isCurrentTabUnlocked ? 'cursor-pointer hover:bg-slate-800/80 hover:border-amber-400/50 group' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors">{item.title}</h3>
                                </div>
                                <p className="text-slate-400 text-xs sm:text-sm mb-3 font-medium">"{item.subtitle}"</p>
                                
                                {globalLevel === 'dark' && (
                                    <div className="bg-rose-950/40 border-l-4 border-rose-500 p-3.5 rounded-r-xl">
                                        <p className="font-bold text-rose-300 text-xs sm:text-sm mb-1">{item.darkCode.name}</p>
                                        <p className="text-rose-100/90 text-xs sm:text-sm leading-relaxed">{item.darkCode.desc}</p>
                                    </div>
                                )}
                                {globalLevel === 'neural' && (
                                    <div className="bg-blue-950/40 border-l-4 border-blue-400 p-3.5 rounded-r-xl">
                                        <p className="font-bold text-blue-300 text-xs sm:text-sm mb-1">{item.neuralCode.name}</p>
                                        <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">{item.neuralCode.desc}</p>
                                    </div>
                                )}
                                {globalLevel === 'meta' && (
                                    <div className="bg-amber-900/30 border-l-4 border-amber-500 p-3.5 rounded-r-xl">
                                        <p className="font-bold text-amber-400 text-xs sm:text-sm mb-1">{item.metaCode.name}</p>
                                        <p className="text-amber-100/90 text-xs sm:text-sm leading-relaxed">{item.metaCode.desc}</p>
                                    </div>
                                )}

                                {isCurrentTabUnlocked && (
                                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-300 font-bold group-hover:text-amber-200 transition-colors">
                                        <span className="flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                            클릭하여 3단계 주파수 연금술 체험
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Coach Note: 기존 컨텐츠 그대로 선명하게 출력 */}
                        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/40 p-5 rounded-2xl text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-indigo-400 text-lg">💡</span>
                                <h4 className="font-bold text-indigo-200 text-sm sm:text-base">Coach's Note (제로포인트 각성 연금술)</h4>
                            </div>
                            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-2.5">
                                가슴 속 ⚠️ <strong>[{globalLevel.toUpperCase()} 코드]</strong>의 억압을 도려내려 애쓰지 마세요. 내면에 드리운 고통이야말로 가장 눈부신 창조의 밑거름입니다.
                            </p>
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                내 예민함과 불안조차 나를 보호하기 위한 초기 설정이었음을 온전히 <strong>승인(Accept)</strong>할 때, 비로소 진정한 주체로서 나답게 타오르는 거대한 원동력이 깨어납니다.
                            </p>
                        </div>
                    </div>

                    {/* 잠금 상태일 때만 표시되는 오버레이 & 핀포인트 락 해제 버튼 */}
                    {!isCurrentTabUnlocked && (
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/90 to-slate-950 flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_20px_rgba(252,211,77,0.5)] mb-3 animate-pulse">
                                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-amber-400" />
                                </div>
                            </div>

                            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full mb-2">
                                🔒 핵심 70% 정밀 해독 파트 잠금
                            </span>

                            <h4 className="text-base sm:text-lg font-black text-white mb-1 font-serif">
                                {globalLevel === 'dark' && '⚠️ 무의식 인지 오류 & 생존 억압 70% 해독'}
                                {globalLevel === 'neural' && '✨ 뇌신경 재설계 & 파워베이스 70% 해독'}
                                {globalLevel === 'meta' && '👑 3단계 제로포인트 각성 솔루션 70% 해독'}
                            </h4>
                            
                            <p className="text-xs text-slate-300 mb-5 max-w-sm leading-relaxed">
                                클릭 시 다른 메뉴로 이동하지 않고 <strong>이 자리에서 즉시 100% 전체 해독</strong>되어 출력됩니다.
                            </p>

                            {/* 👉 황금빛 글로우 핀포인트 락 해제 버튼 (클릭 시 인플레이스 해제) */}
                            <button
                                onClick={handleInPlaceUnlock}
                                className="w-full max-w-md py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(252,211,77,0.6)] flex items-center justify-center gap-2 animate-pulse"
                            >
                                <span>
                                    {globalLevel === 'dark' && '👉 [ 🔓 890원에 이 자리에서 즉시 해독 출력하기 ]'}
                                    {globalLevel === 'dark' && '👉 [ 🔓 890원에 70% 정밀 해독 이 자리에서 출력하기 ]'}
                                    {globalLevel === 'neural' && '👉 [ 🔓 890원에 70% 정밀 해독 이 자리에서 출력하기 ]'}
                                    {globalLevel === 'meta' && '👉 [ 🔓 3,900원에 명심 마스터코어 정밀 해독 이 자리에서 출력하기 ]'}
                                </span>
                            </button>
                        </div>
                    )}
                </div>

                {/* ==========================================
                    3. [특허 출원 한정 이벤트] 3,900원 명심 마스터코어 정밀 해독 배너 (무제한 ALL-PASS 무효화)
                    ========================================== */}
                <div 
                    onClick={handleFullPassClick}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-indigo-950/90 border border-amber-400/50 p-4 shadow-xl cursor-pointer hover:border-amber-300 transition-all mb-6 text-left"
                >
                    <div className="flex items-center justify-between z-10 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                                <Crown className="w-5 h-5 text-amber-300" />
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black text-amber-300">📜 특허출원중 한정특가 명심 마스터코어</span>
                                    <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded">86% OFF</span>
                                </div>
                                <p className="text-[10px] text-amber-100/90 mt-0.5">
                                    특허출원중 번호: 제 10-2025-0166877 호 (출원인: 이경윤) | 심리 및 생체데이터 기반 스트레스 관리 솔루션
                                </p>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-black text-white flex items-center gap-0.5 font-mono">
                                3,900원 <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="text-[9px] text-gray-400 line-through block">29,000원</span>
                        </div>
                    </div>
                </div>

                {/* 하단 기본 코칭받기 버튼 (Show Action Button) */}
                {showActionButton && (
                    <button 
                        onClick={onActionClick}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm sm:text-base hover:from-indigo-600 hover:to-purple-700 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex justify-center items-center group active:scale-95 mb-4"
                    >
                        <span>🚀 나의 강점 활용법 코칭받기</span>
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                )}

                {/* [MODULE] 액션 플랜 & 리포트 */}
                <DailyNeuralMissionCard data={data} />
                <MonthlyMindReport />
            </div>

            {/* 풀패스 모달 연동 */}
            <MicroPassModal
                isOpen={microPassOpen}
                onClose={() => setMicroPassOpen(false)}
            />

            {/* 지질 카드 클릭 시 1:1 생년월일 맞춤 감동 에세이 코칭 모달 */}
            {selectedIndicator && (
                <GeniusExplainModal
                    isOpen={explainModalOpen}
                    onClose={() => setExplainModalOpen(false)}
                    userName={userName}
                    saju={saju}
                    indicatorName={selectedIndicator.name}
                    score={selectedIndicator.score}
                    locale={locale}
                />
            )}

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shimmer {
                    100% { transform: translateX(150%); }
                }
            `}</style>
        </div>
    );
}

