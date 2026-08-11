// src/components/coaching/MicroPassModal.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Compass, Clock, Key, ShieldCheck, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface MicroPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    userSajuData?: any;
    onUpgradeToFullPass?: () => void;
}

export const MicroPassModal: React.FC<MicroPassModalProps> = ({
    isOpen,
    onClose,
    userSajuData,
    onUpgradeToFullPass
}) => {
    const [step, setStep] = useState<'OFFER' | 'PAYING' | 'UNLOCKED'>('OFFER');

    if (!isOpen) return null;

    // Calculate dynamic 890 KRW analysis content based on user's Saju
    const dayGan = userSajuData?.saju?.fourPillars?.day?.gan || '신';
    
    // Elemental prescriptions
    const elementPrescriptions: Record<string, { element: string; color: string; direction: string; time: string; metaphor: string }> = {
        '갑': { element: '목(木)', color: '🟢 에메랄드 그린', direction: '동쪽(East)', time: '오전 07시 ~ 09시', metaphor: '단단한 소나무 기운이 생명력을 일으키는 상승 기류' },
        '을': { element: '목(木)', color: '🌿 라임 / 민트', direction: '동남쪽(East-South)', time: '오전 09시 ~ 11시', metaphor: '유연한 덩굴이 태양을 향해 담장을 넘어가는 번영' },
        '병': { element: '화(火)', color: '🔴 스카렛 레드', direction: '남쪽(South)', time: '정오 11시 ~ 13시', metaphor: '어둠을 환히 밝히는 광명 태양의 귀인 조우' },
        '정': { element: '화(火)', color: '🟧 루비 핑크', direction: '남서쪽(South-West)', time: '오후 13시 ~ 15시', metaphor: '마음을 온화하게 안아주는 따뜻한 촛불의 치유' },
        '무': { element: '토(土)', color: '🟡 앰버 골드', direction: '중앙(Center)', time: '오후 15시 ~ 17시', metaphor: '흔들림 없이 모든 만물을 감싸 안는 황금 대지' },
        '기': { element: '토(土)', color: '🟤 베이지 / 실크', direction: '북서쪽(North-West)', time: '오후 17시 ~ 19시', metaphor: '비옥한 옥토가 숨겨진 보석들을 적립해 내는 창고' },
        '경': { element: '금(金)', color: '⚪ 은빛 화이트', direction: '서쪽(West)', time: '오후 19시 ~ 21시', metaphor: '결단력을 다지는 명검의 서늘하고 명확한 자각' },
        '신': { element: '금(金)', color: '💎 다이아몬드 크리스탈', direction: '서북쪽(West-North)', time: '밤 21시 ~ 23시', metaphor: '압력을 이겨내고 스스로 완성된 눈부신 원석의 아우라' },
        '임': { element: '수(水)', color: '🔵 딥 네이비', direction: '북쪽(North)', time: '자정 23시 ~ 01시', metaphor: '광활한 대해가 사방의 거친 물길을 조용히 품는 순응' },
        '계': { element: '수(水)', color: '💧 맑은 아쿠아', direction: '북동쪽(North-East)', time: '새벽 03시 ~ 05시', metaphor: '메마른 영혼에 스며들어 싹을 틔우는 은혜로운 단비' },
    };

    const prescription = elementPrescriptions[dayGan] || elementPrescriptions['신'];

    const handleSimulatePayment = () => {
        setStep('PAYING');
        setTimeout(() => {
            setStep('UNLOCKED');
        }, 1200);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-sm bg-[#0a0a14] border border-amber-500/40 rounded-[28px] p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden text-white"
                >
                    {/* Background Neon Glow */}
                    <div className="absolute top-[-20%] right-[-20%] w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[70px] pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20"
                    >
                        <X size={16} />
                    </button>

                    {/* Step 1: OFFER (890원 특가 제안) */}
                    {step === 'OFFER' && (
                        <div className="space-y-5 text-left">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/30 animate-pulse flex items-center gap-1">
                                    <Zap size={11} className="fill-amber-400 text-amber-400" />
                                    90% 초특가 타임딜
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl font-black tracking-tight text-white leading-tight">
                                    오늘의 우주 오행<br />
                                    <span className="text-amber-400">890원 핀포인트 솔루션</span> ⚡
                                </h3>
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                    부담 없는 커피 한 잔 값 미만! 오늘 나를 돕는 오행 귀인 기운과 핵심 코드 1개를 3초 만에 해독하세요.
                                </p>
                            </div>

                            {/* Included Features */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-2.5">
                                <div className="flex items-center gap-2 text-xs">
                                    <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                                    <div>
                                        <span className="font-bold text-gray-200 block">오늘의 귀인 오행 솔루션</span>
                                        <span className="text-[10px] text-gray-400">행운의 오행 컬러 / 행운의 방위 / 귀인 시간대</span>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex items-center gap-2 text-xs">
                                    <Key className="w-4 h-4 text-pink-400 shrink-0" />
                                    <div>
                                        <span className="font-bold text-gray-200 block">64코드 대표 보석 락 1개 해제</span>
                                        <span className="text-[10px] text-gray-400">나의 무의식 본질 핵심 잠금 해제</span>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex items-center gap-2 text-xs">
                                    <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                                    <div>
                                        <span className="font-bold text-gray-200 block">대운 교운기 연도 핀포인트</span>
                                        <span className="text-[10px] text-gray-400">내 인생의 획기적 전환점 연도 및 지침</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & CTA */}
                            <div className="space-y-3 pt-1">
                                <div className="flex justify-between items-baseline px-1">
                                    <span className="text-xs text-gray-400 line-through">정가 890원</span>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-amber-400 mr-1.5">[90% OFF]</span>
                                        <span className="text-2xl font-black font-mono text-white">890</span>
                                        <span className="text-xs font-bold text-gray-300 ml-0.5">원</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSimulatePayment}
                                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>890원 3초 간편결제 해독하기</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: PAYING (결제 처리 중 애니메이션) */}
                    {step === 'PAYING' && (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-sm font-bold text-amber-200">
                                890원 전자 서명 및 결제 처리 중...
                            </p>
                            <p className="text-xs text-gray-400">
                                우주 오행 핀포인트 코드를 정밀하게 해독하고 있습니다.
                            </p>
                        </div>
                    )}

                    {/* Step 3: UNLOCKED (890원 해독 결과 + 환급 업셀링 팝업) */}
                    {step === 'UNLOCKED' && (
                        <div className="space-y-4 text-left">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                                    <CheckCircle2 size={15} />
                                    <span>890원 핀포인트 해독 완료</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono">ID: MP-890-SAFE</span>
                            </div>

                            {/* 1. 오늘의 오행 솔루션 */}
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 space-y-2">
                                <span className="text-[10px] font-extrabold text-amber-300 block">⚡ 오늘의 귀인 오행 솔루션</span>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">본질 오행:</span>
                                        <span className="font-bold text-white">{prescription.element}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">행운의 컬러:</span>
                                        <span className="font-bold text-white">{prescription.color}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">귀인 조우 시간:</span>
                                        <span className="font-bold text-amber-300">{prescription.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">행운의 방위:</span>
                                        <span className="font-bold text-white">{prescription.direction}</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-amber-200/90 leading-relaxed pt-1 border-t border-amber-500/20">
                                    💡 {prescription.metaphor}
                                </p>
                            </div>

                            {/* 2. 890원 핀포인트 솔루션 완충 완료 메세지 */}
                            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/90 to-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-2.5 relative overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                                        <Sparkles size={14} className="text-amber-400 animate-pulse" />
                                        ✨ 890원 핀포인트 솔루션 해독 완료!
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-[10px]">
                                        ✓ 결제 완료
                                    </span>
                                </div>

                                <p className="text-[11px] text-gray-200 leading-relaxed">
                                    <strong>{userSajuData?.userName || '명심가'}</strong> 님의 생년월일 사주 원국 오행 주파수와 1:1 맞춤 연결된 <b>오늘의 귀인 핀포인트 가이드</b>입니다. <br />
                                    명심 AI 코치와의 심층 1:1 코칭을 통해 인지 신경망을 빛으로 정렬해 보세요!
                                </p>

                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                                >
                                    <span>명심 AI 코칭 시작하기</span>
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MicroPassModal;
