'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Cpu, Compass, Grid } from 'lucide-react';
import LiveSyncSection from '@/components/coaching/LiveSyncSection';

interface Sovereign3SProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: any;
}

export default function Sovereign3SProtocolModal({ isOpen, onClose, userProfile }: Sovereign3SProtocolModalProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    if (!isOpen) return null;

    // 모달을 닫고, Live Sync Pro 섹션으로 강제 전환하기 위한 임시 연결 로직
    const handleTemporaryLink = () => {
        // 실제로는 해당 모듈을 열거나 라우팅해야 하지만, 
        // 유저 요청에 따라 임시로 Live Sync Pro 컴포넌트를 모달 안에서 열어주거나 
        // 혹은 특정 플래그를 통해 보여줍니다.
        setActiveSection('live_sync_pro');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-gray-900 border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(6,182,212,0.15)] relative custom-scrollbar"
                >
                    {/* 닫기 버튼 */}
                    <div className="sticky top-0 right-0 p-4 flex justify-end z-10">
                        <button
                            onClick={() => {
                                if (activeSection) setActiveSection(null);
                                else onClose();
                            }}
                            className="bg-gray-800/80 p-2 rounded-full text-gray-400 hover:text-white border border-gray-700/50 backdrop-blur-sm transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {activeSection === 'live_sync_pro' ? (
                        <div className="p-4 pb-12">
                            <h2 className="text-2xl font-bold text-center text-white mb-6 tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                    [임시 연결] Live Sync Pro
                                </span>
                            </h2>
                            <p className="text-gray-400 text-sm text-center mb-8">
                                선택하신 모듈은 현재 기획 중이므로, <br />
                                <strong>SCAN-SYNC-SHIFT</strong> 엔진이 적용된 <span className="text-cyan-400">Live Sync Pro</span> 화면으로 임시 연결되었습니다.
                            </p>
                            <LiveSyncSection 
                                sajuData={userProfile?.saju || {}} 
                                harmony={{}} 
                                biorhythm={{}} 
                            />
                        </div>
                    ) : activeSection === 'academy' ? (
                        <div className="p-8 pb-12">
                            <h2 className="text-2xl font-bold text-center text-white mb-6 tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                                    라이프스타일 리빌딩 아카데미
                                </span>
                            </h2>
                            <div className="bg-gray-800/50 border border-amber-500/30 rounded-2xl p-6 mb-6">
                                <h3 className="text-lg font-semibold text-amber-400 mb-4">📚 아카데미 커리큘럼 안내</h3>
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    자연치유 식이요법 및 해부생리학적 근거를 바탕으로, 대사증후군과 생활습관 질병을 스스로 예방할 수 있도록 보건교육사가 정밀하게 설계한 VOD 및 인터랙티브 교육 코스입니다.
                                </p>
                                <div className="mt-6 flex items-center justify-center p-4 bg-black/40 rounded-xl">
                                    <span className="text-gray-500 text-sm font-medium">현재 VOD 콘텐츠 및 커리큘럼 준비 중입니다. 🚀</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActiveSection(null)}
                                className="w-full py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors"
                            >
                                뒤로 가기
                            </button>
                        </div>
                    ) : (
                        <div className="px-6 pb-12 pt-2">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-white mb-3 tracking-tighter">
                                    Sovereign <span className="text-cyan-400">3S</span> Protocol
                                </h1>
                                <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                                    DMN 회로를 차단하고 ECN을 가동하여,<br />
                                    당신의 생체 신호와 기질을 동기화하는 초고도화 보건 아키텍처
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 1. SCAN */}
                                <div className="bg-black/40 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                            <Activity size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">I. SIGNAL SCAN</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <button onClick={handleTemporaryLink} className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-cyan-900/30 border border-transparent hover:border-cyan-500/30 rounded-xl transition-all">
                                            <div className="text-sm font-semibold text-gray-200">DMN 오버로드 모니터</div>
                                            <div className="text-xs text-gray-500 mt-1">실시간 뇌과부하 신호 스캔</div>
                                        </button>
                                        <button onClick={handleTemporaryLink} className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-cyan-900/30 border border-transparent hover:border-cyan-500/30 rounded-xl transition-all">
                                            <div className="text-sm font-semibold text-gray-200">습관성 버그 로그</div>
                                            <div className="text-xs text-gray-500 mt-1">만성질환 트리거 태깅 적재</div>
                                        </button>
                                    </div>
                                </div>

                                {/* 2. SYNC */}
                                <div className="bg-black/40 border border-gray-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                            <Cpu size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">II. SPEC SYNC</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <button onClick={handleTemporaryLink} className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-emerald-900/30 border border-transparent hover:border-emerald-500/30 rounded-xl transition-all">
                                            <div className="text-sm font-semibold text-gray-200">잠재력 드라이브 매트릭스</div>
                                            <div className="text-xs text-gray-500 mt-1">하드웨어 기질 기반 질병 예측</div>
                                        </button>
                                        <button onClick={handleTemporaryLink} className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-emerald-900/30 border border-transparent hover:border-emerald-500/30 rounded-xl transition-all">
                                            <div className="text-sm font-semibold text-gray-200">뉴럴 방하착 오디오 룸</div>
                                            <div className="text-xs text-gray-500 mt-1">저항을 내려놓는 심리 버퍼링</div>
                                        </button>
                                    </div>
                                </div>

                                {/* 3. SHIFT */}
                                <div className="bg-black/40 border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition-colors md:col-span-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                            <Compass size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">III. VECTOR SHIFT</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <button onClick={handleTemporaryLink} className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-purple-900/30 border border-transparent hover:border-purple-500/30 rounded-xl transition-all">
                                            <div className="text-sm font-semibold text-gray-200">용신(用神) 가치 전념행동</div>
                                            <div className="text-xs text-gray-500 mt-1">궁극적 가치 기반 건강 퀘스트</div>
                                        </button>
                                        <button onClick={handleTemporaryLink} className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-purple-900/30 border border-transparent hover:border-purple-500/30 rounded-xl transition-all">
                                            <div className="text-sm font-semibold text-gray-200">기질 맞춤형 '코드 패치'</div>
                                            <div className="text-xs text-gray-500 mt-1">CBT/DBT 기반 우회 행동 규칙</div>
                                        </button>
                                    </div>
                                </div>

                                {/* 4. ARCHITECTURE */}
                                <div className="bg-black/40 border border-gray-800 rounded-2xl p-5 hover:border-amber-500/50 transition-colors md:col-span-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                            <Grid size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">IV. ARCHITECTURE</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <button onClick={handleTemporaryLink} className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-amber-900/30 border border-transparent hover:border-amber-500/30 rounded-xl transition-all">
                                            <div className="text-sm font-semibold text-gray-200">공간 디버깅 가이드</div>
                                            <div className="text-xs text-gray-500 mt-1">만성질환 유발 자극 제거 프로세스</div>
                                        </button>
                                        <button onClick={() => setActiveSection('academy')} className="w-full text-left px-4 py-3 bg-gray-800/50 hover:bg-amber-900/30 border border-transparent hover:border-amber-500/30 rounded-xl transition-all">
                                            <div className="text-sm font-semibold text-gray-200">라이프스타일 리빌딩 아카데미</div>
                                            <div className="text-xs text-gray-500 mt-1">예방의학 기반 인터랙티브 코스</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
