import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const IconClose = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const IconShare = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
);

const IconDownload = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

interface BioEnergyBlueprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayMaster: string; // e.g., "갑목", "병화"
    energyType?: 'HEAT' | 'COOL' | 'BALANCED'; // Derived from simplistic logic for now
}

const BioEnergyBlueprintModal: React.FC<BioEnergyBlueprintModalProps> = ({ isOpen, onClose, dayMaster, energyType = 'HEAT' }) => {
    // For demo purposes, we can toggle between the two designs user provided
    const [currentView, setCurrentView] = useState<'HEAT' | 'COOL'>(energyType === 'COOL' ? 'COOL' : 'HEAT');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
            >
                {/* Mobile Frame Container */}
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-[420px] bg-[#fdfdfb] dark:bg-[#0a0f0d] rounded-[32px] shadow-2xl overflow-hidden min-h-[800px] max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className={`flex items-center justify-between p-5 sticky top-0 z-50 backdrop-blur-md border-b ${currentView === 'HEAT' ? 'bg-[#fdfdfb]/80 border-gray-100' : 'bg-[#0a0f0d]/80 border-white/5 text-white'}`}>
                        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <IconClose />
                        </button>
                        <h1 className="text-xs font-bold tracking-widest uppercase opacity-80">BIO-SYNC ENGINE REPORT</h1>
                        <button className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <IconShare />
                        </button>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto pb-24">

                        {/* COMMERCIAL MODE: View Switcher Removed */}
                        {/* The view is now strictly determined by the user's analyzed energy type */}

                        {currentView === 'HEAT' ? (
                            /* --- HEAT TYPE DESIGN (Modified for Legal Safety & System Identity) --- */
                            <div className="p-6 space-y-6 text-slate-800">
                                {/* Blobs */}
                                <div className="absolute top-20 -left-20 w-64 h-64 bg-[#FF7E67] rounded-full filter blur-[60px] opacity-15 pointer-events-none"></div>
                                <div className="absolute top-80 -right-20 w-64 h-64 bg-[#64B5F6] rounded-full filter blur-[60px] opacity-15 pointer-events-none"></div>

                                {/* Step 1. System Scan */}
                                <div className="space-y-1 relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold tracking-wider">STEP 1</span>
                                        <p className="text-xs font-bold text-[#4FD1C5] uppercase tracking-widest">System Scan</p>
                                    </div>
                                    <h2 className="text-3xl font-bold leading-tight font-serif text-slate-900">바이오 에너지<br />경향성 분석</h2>
                                </div>

                                {/* Main Card */}
                                <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-lg border border-gray-100 p-8 z-10">
                                    <div className="flex flex-col items-center text-center gap-2 mb-8">
                                        <div className="flex gap-2 mb-2">
                                            <span className="inline-block px-3 py-1 bg-[#FF7E67]/10 text-[#FF7E67] text-[10px] font-bold rounded-full">#High_Heat</span>
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">#Low_Moisture</span>
                                        </div>
                                        <h3 className="text-2xl font-bold italic font-serif">"건조 주의보 감지"</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed px-2 break-keep">
                                            시스템 스캔 결과, <strong>화(Fire) 에너지 과다</strong> 및 <strong>수(Water) 밸런스 저하</strong> 패턴이 확인되었습니다.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50 text-center border border-gray-100">
                                        <p className="text-xs leading-relaxed text-gray-600 break-keep">
                                            <span className="font-bold text-[#FF7E67]">과열(Overheating)</span> 경향과 함께 체내 수분이 빠르게 소모될 수 있는 모드입니다. <br />
                                            <strong>냉각(Cooling)</strong> 및 <strong>수분 충전</strong> 중심의 에너지 밸런싱이 권장됩니다.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2. Optimization Protocol */}
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold tracking-wider">STEP 2</span>
                                        <h3 className="text-xs font-bold text-[#4FD1C5] uppercase tracking-widest">Optimization Protocol</h3>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">생활 습관 엔지니어링</h3>

                                    <div className="space-y-3">
                                        {/* 07:00 Start-up */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4">
                                            <div className="flex flex-col items-center gap-1 min-w-[50px] border-r border-gray-100 pr-4">
                                                <span className="text-[10px] font-bold text-gray-400">SYNC</span>
                                                <span className="text-lg font-black text-slate-900">07:00</span>
                                                <span className="text-[9px] text-[#4FD1C5] font-bold bg-[#4FD1C5]/10 px-1.5 rounded">Start-up</span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-sm text-slate-800">수분 채널 개방</h4>
                                                </div>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <span>💧</span> 미온수 + 소금 한 꼬집
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span>💊</span> 유산균 섭취
                                                    </li>
                                                </ul>
                                                <p className="text-[10px] text-gray-400 leading-tight pt-1 border-t border-gray-50">
                                                    [Logic] 밤새 소모된 수분을 보충하는 프라이밍(Priming) 단계
                                                </p>
                                            </div>
                                        </div>

                                        {/* 13:00 Defense */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4">
                                            <div className="flex flex-col items-center gap-1 min-w-[50px] border-r border-gray-100 pr-4">
                                                <span className="text-[10px] font-bold text-gray-400">SYNC</span>
                                                <span className="text-lg font-black text-slate-900">13:00</span>
                                                <span className="text-[9px] text-orange-400 font-bold bg-orange-400/10 px-1.5 rounded">Defense</span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-sm text-slate-800">보호막 레이어링</h4>
                                                </div>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <span>🐟</span> 오메가-3 (식후)
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span>🌿</span> 밀크씨슬 추출물
                                                    </li>
                                                </ul>
                                                <p className="text-[10px] text-gray-400 leading-tight pt-1 border-t border-gray-50">
                                                    [Logic] 에너지 소모가 많은 시간, 대사 흐름 지원(Support)
                                                </p>
                                            </div>
                                        </div>

                                        {/* 22:00 Reset */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4">
                                            <div className="flex flex-col items-center gap-1 min-w-[50px] border-r border-gray-100 pr-4">
                                                <span className="text-[10px] font-bold text-gray-400">SYNC</span>
                                                <span className="text-lg font-black text-slate-900">22:00</span>
                                                <span className="text-[9px] text-indigo-400 font-bold bg-indigo-400/10 px-1.5 rounded">Reset</span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-sm text-slate-800">이완 모드 전환</h4>
                                                </div>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <span>🌙</span> 마그네슘
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span>✨</span> 글루타치온(필름)
                                                    </li>
                                                </ul>
                                                <p className="text-[10px] text-gray-400 leading-tight pt-1 border-t border-gray-50">
                                                    [Logic] 긴장된 시스템 이완 및 회복(Recovery) 프로세스 가동
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3. Safety Advice */}
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-[#4FD1C5]/20 flex items-center justify-center text-[#4FD1C5]">
                                            🛡️
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900">보건교육사의 안전 가이드</h3>
                                    </div>
                                    <div className="rounded-2xl bg-[#fbfbf2] border-l-4 border-[#4FD1C5] p-5">
                                        <p className="text-sm font-bold text-slate-800 mb-2">
                                            "이것은 '치료약'이 아니라 '운영체제 업그레이드'입니다."
                                        </p>
                                        <p className="text-[12px] leading-relaxed text-gray-600 text-justify">
                                            본 가이드는 귀하의 타고난 에너지 성향(사주)을 분석하여, 부족한 기운을 생활 습관(영양, 타이밍)으로 보완하기 위한 <strong>건강 증진(Health Promotion) 프로그램</strong>입니다.
                                        </p>
                                        <ul className="mt-3 text-[11px] text-gray-500 list-disc pl-4 space-y-1">
                                            <li>추천 영양 성분은 의약품이 아니며, 질병의 예방 및 치료를 위한 의학적 효능을 담보하지 않습니다.</li>
                                            <li>현재 기저질환으로 병원 진료 중이거나 복용 중인 의약품이 있다면, 반드시 담당 의사와 상담 후 섭취하십시오.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* --- COOL TYPE DESIGN (Modified for Legal Safety & System Identity) --- */
                            <div className="text-slate-100">
                                {/* Hero Card */}
                                <div className="mx-4 mt-4 relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10" style={{ background: 'linear-gradient(145deg, rgba(20, 30, 26, 0.8), rgba(10, 15, 13, 0.9))' }}>
                                    <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
                                    <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                                        <div className="mb-4 flex gap-2">
                                            <span className="inline-block px-3 py-1 bg-primary-gold/10 text-primary-gold text-[10px] font-bold rounded-full border border-primary-gold/20">#High_Cold</span>
                                            <span className="inline-block px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full border border-white/10">#Low_Fire</span>
                                        </div>
                                        <h1 className="text-4xl font-black leading-none tracking-tighter mb-2 text-white">
                                            냉체질 <span className="text-primary-gold">ICE</span>
                                        </h1>
                                        <p className="text-slate-400 text-xs font-medium tracking-tight mt-2">
                                            시스템 스캔: 수(Water) 과다 / 화(Fire) 부족
                                        </p>

                                        <div className="absolute top-6 right-6 text-right">
                                            <p className="text-[10px] text-primary-gold/60 font-mono tracking-tighter uppercase mb-0.5">Core Temp</p>
                                            <p className="text-2xl font-light text-white font-mono">35.8<span className="text-sm">°C</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 1. System Scan Report */}
                                <div className="px-4 py-3 mt-2">
                                    <h3 className="text-xs font-bold text-primary-gold tracking-widest uppercase mb-3 flex items-center gap-2">
                                        <span className="h-1 w-4 bg-primary-gold rounded-full"></span>
                                        시스템 스캔 리포트
                                    </h3>
                                    <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden p-4 flex items-center gap-4">
                                        <div className="flex-1">
                                            <p className="text-white text-base font-bold tracking-tight mb-2">에너지 과부하 패턴 감지 (Cold)</p>
                                            <p className="text-slate-400 text-[11px] leading-relaxed break-keep">
                                                시스템 내 열 에너지 부족으로 인한 순환 지연이 감지되었습니다. <strong>'한파 주의보'</strong>와 유사하며, 예열(Warming) 및 순환 개선 프로토콜이 필요합니다.
                                            </p>
                                        </div>
                                        <div className="w-16 h-16 rounded-xl bg-gray-800 animate-pulse flex items-center justify-center">
                                            <span className="text-2xl">❄️</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2. Optimization Protocol (Timeline) */}
                                <div className="px-4 py-3 pb-8">
                                    <h3 className="text-xs font-bold text-primary-gold tracking-widest uppercase mb-3 flex items-center gap-2">
                                        <span className="h-1 w-4 bg-primary-gold rounded-full"></span>
                                        최적화 프로토콜 (Optimization)
                                    </h3>

                                    <div className="space-y-3">
                                        {/* 07:00 Warm-up */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 backdrop-blur-sm">
                                            <div className="flex flex-col items-center gap-1 min-w-[50px] border-r border-white/10 pr-4">
                                                <span className="text-[10px] font-bold text-gray-500">SYNC</span>
                                                <span className="text-lg font-black text-white">07:00</span>
                                                <span className="text-[9px] text-orange-400 font-bold bg-orange-400/10 px-1.5 rounded">Warm-up</span>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="font-bold text-sm text-white">코어 예열 가동</h4>
                                                <div className="text-xs text-slate-300">
                                                    ☕ 따뜻한 생강차 or 계피차
                                                </div>
                                                <p className="text-[10px] text-gray-500 leading-tight pt-1">
                                                    [Logic] 심부 온도 상승 및 대사율 확보
                                                </p>
                                            </div>
                                        </div>

                                        {/* 13:00 Boost */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 backdrop-blur-sm">
                                            <div className="flex flex-col items-center gap-1 min-w-[50px] border-r border-white/10 pr-4">
                                                <span className="text-[10px] font-bold text-gray-500">SYNC</span>
                                                <span className="text-lg font-black text-white">13:00</span>
                                                <span className="text-[9px] text-primary-gold font-bold bg-primary-gold/10 px-1.5 rounded">Boost</span>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="font-bold text-sm text-white">에너지 생산 촉진</h4>
                                                <div className="text-xs text-slate-300">
                                                    💊 코엔자임 Q10 + 비타민 B군
                                                </div>
                                                <p className="text-[10px] text-gray-500 leading-tight pt-1">
                                                    [Logic] 세포 내 미토콘드리아 활성 지원
                                                </p>
                                            </div>
                                        </div>

                                        {/* 22:00 Circulation */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 backdrop-blur-sm">
                                            <div className="flex flex-col items-center gap-1 min-w-[50px] border-r border-white/10 pr-4">
                                                <span className="text-[10px] font-bold text-gray-500">SYNC</span>
                                                <span className="text-lg font-black text-white">22:00</span>
                                                <span className="text-[9px] text-indigo-400 font-bold bg-indigo-400/10 px-1.5 rounded">Circulation</span>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="font-bold text-sm text-white">말초 순환 개선</h4>
                                                <div className="text-xs text-slate-300">
                                                    🛀 반신욕 or 족욕 (20분)
                                                </div>
                                                <p className="text-[10px] text-gray-500 leading-tight pt-1">
                                                    [Logic] 수승화강(수분 상승, 열기 하강) 유도
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3. Safety Advice */}
                                <div className="px-4 py-3 mt-2">
                                    <div className="rounded-2xl bg-primary-gold/5 border border-primary-gold/20 p-5">
                                        <p className="text-primary-gold text-xs font-bold mb-2">🛡️ 안전 가이드</p>
                                        <p className="text-slate-300 text-[11px] leading-relaxed text-justify">
                                            본 리포트는 <strong>건강 증진(Health Promotion)</strong>을 위한 생활 습관 가이드이며, 의학적 진단이 아닙니다. 질병 치료는 반드시 전문 의료진과 상담하십시오.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Common Footer Disclaimer - Updated for Safety & Authority */}
                        <div className="p-8 mt-4 border-t border-gray-100 dark:border-white/5 mx-4">
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed text-center opacity-60 break-keep">
                                <strong>Myeongsim Bio-Sync Engine v1.0</strong><br />
                                본 서비스는 <strong>보건복지부 비의료 건강관리서비스 가이드라인(2차, 2022)</strong>을 준수합니다. <br />
                                제공되는 건강 정보는 <strong>대한영양사협회</strong> 및 공신력 있는 기관의 영양 권장사항을 참고하여 작성되었습니다.
                            </p>
                        </div>
                    </div>

                    {/* Fixed Bottom Action Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black z-50">
                        <button className={`w-full h-14 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all ${currentView === 'HEAT' ? 'bg-[#4FD1C5] text-white shadow-[#4FD1C5]/30' : 'bg-primary-gold text-[#0a0f0d] shadow-primary-gold/30'}`}>
                            프로토콜 저장하기 <IconDownload />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BioEnergyBlueprintModal;
