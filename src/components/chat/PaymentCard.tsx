// @ts-nocheck
import React, { useState } from 'react';
import { CreditCard, Shield, Sparkles, ArrowRight, CheckCircle2, Lock, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentCardProps {
    onCopy?: () => void;
    onDetailedReport?: () => void;
}

export type PaymentTierKey = 'CHAT_3' | 'REPORT_BASE' | 'SOCIAL_FIVE' | 'MASTER_CORE';

export default function PaymentCard({ onDetailedReport }: PaymentCardProps) {
    const [selectedTier, setSelectedTier] = useState<PaymentTierKey>('CHAT_3');
    const [isPaying, setIsPaying] = useState(false);

    const getSelectedPriceInfo = () => {
        switch (selectedTier) {
            case 'CHAT_3':
                return { name: '💬 챗봇 대화 3회 충전', original: '9,900원', price: '890원', numPrice: 890, badge: '91% OFF' };
            case 'REPORT_BASE':
                return { name: '📋 나의 리포트 (기본 진단 요약)', original: '9,900원', price: '890원', numPrice: 890, badge: '91% OFF' };
            case 'SOCIAL_FIVE':
                return { name: '🔬 사회적기여 / 오행상생 리포트', original: '19,000원', price: '1,900원', numPrice: 1900, badge: '90% OFF' };
            case 'MASTER_CORE':
                return { name: '🔮 명심 마스터코어 (4대 기질+3단계 제로포인트)', original: '29,000원', price: '3,900원', numPrice: 3900, badge: '86% 한정특가' };
        }
    };

    const handleTossPaymentsCheckout = () => {
        setIsPaying(true);
        // Instant Toss Payments PG Simulation
        setTimeout(() => {
            setIsPaying(false);
            if (onDetailedReport) {
                onDetailedReport();
            }
        }, 1200);
    };

    const currentInfo = getSelectedPriceInfo();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900 rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden my-3 text-left"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-indigo-950/80 px-5 py-3.5 border-b border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-black text-white tracking-wide">토스페이먼츠 안전 전자결제</span>
                </div>
                <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    실시간 자동 승인
                </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
                
                {/* 📜 Patent Official Disclosure Badge */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-[11px] text-amber-200/90 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                        <FileCheck className="w-4 h-4 text-amber-400" />
                        <span>특허 출원 기술 한정할인 이벤트</span>
                    </div>
                    <div className="text-[10px] text-amber-100/80 space-y-0.5 pt-0.5">
                        <div>• <strong>특허 출원번호</strong>: 제 10-2025-0166877 호</div>
                        <div>• <strong>특허 출원명칭</strong>: 심리 및 생체데이터 기반 스트레스 관리 솔루션 제공장치 및 이를 이용한 스트레스 관리솔루션 제공방법</div>
                        <div>• <strong>특허 출원인</strong>: 이경윤</div>
                    </div>
                </div>

                {/* Micro-Tier Options Selection */}
                <div className="flex flex-col gap-2.5">
                    <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                        <span>결제 항목 선택 (단발성 1회 해독)</span>
                        <span className="text-[10px] text-amber-400">※ 특허 출원 86%~91% OFF</span>
                    </div>

                    {/* Option 1: 챗봇 대화 3회 충전 */}
                    <div
                        onClick={() => setSelectedTier('CHAT_3')}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedTier === 'CHAT_3' ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="flex flex-col">
                            <span className={`text-xs font-black ${selectedTier === 'CHAT_3' ? 'text-amber-300' : 'text-gray-300'}`}>
                                💬 챗봇 대화 3회 추가 충전
                            </span>
                            <span className="text-[10px] text-gray-400">끊김 없는 실시간 명심 코칭</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-500 line-through mr-1.5">9,900원</span>
                            <span className="text-base font-black font-mono text-amber-400">890<span className="text-xs font-normal">원</span></span>
                        </div>
                    </div>

                    {/* Option 2: 나의 리포트 70% 잠금해제 */}
                    <div
                        onClick={() => setSelectedTier('REPORT_BASE')}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedTier === 'REPORT_BASE' ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold ${selectedTier === 'REPORT_BASE' ? 'text-amber-300' : 'text-gray-300'}`}>
                                📋 나의 리포트 (기본 진단 70% 해독)
                            </span>
                            <span className="text-[10px] text-gray-400">기본 본질 자아 및 성향 해독</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-500 line-through mr-1.5">9,900원</span>
                            <span className="text-base font-black font-mono text-amber-400">890<span className="text-xs font-normal">원</span></span>
                        </div>
                    </div>

                    {/* Option 3: 사회적기여 / 오행상생 리포트 */}
                    <div
                        onClick={() => setSelectedTier('SOCIAL_FIVE')}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedTier === 'SOCIAL_FIVE' ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold ${selectedTier === 'SOCIAL_FIVE' ? 'text-indigo-300' : 'text-gray-300'}`}>
                                🔬 사회적기여 / 오행 상생 리포트
                            </span>
                            <span className="text-[10px] text-gray-400">관계 흐름 및 심화 오행 분석</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-500 line-through mr-1.5">19,000원</span>
                            <span className="text-base font-black font-mono text-indigo-300">1,900<span className="text-xs font-normal">원</span></span>
                        </div>
                    </div>

                    {/* Option 4: 명심 마스터코어 (BEST HERO) */}
                    <div
                        onClick={() => setSelectedTier('MASTER_CORE')}
                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all relative ${selectedTier === 'MASTER_CORE' ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="absolute top-0 right-0 bg-amber-500 text-[9px] text-black px-2 py-0.5 rounded-bl-lg font-black">HERO BEST</div>
                        <div className="flex flex-col">
                            <span className={`text-xs font-black ${selectedTier === 'MASTER_CORE' ? 'text-amber-300' : 'text-gray-300'}`}>
                                🔮 명심 마스터코어 정밀 해독
                            </span>
                            <span className="text-[10px] text-amber-200/80">4대 기질 + 3단계 제로포인트 메타코드</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-400 line-through block">29,000원</span>
                            <span className="text-lg font-black font-mono text-amber-300">3,900<span className="text-xs font-normal">원</span></span>
                        </div>
                    </div>
                </div>

                {/* Toss Payments Security Badge */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-[10px] text-gray-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-300 font-bold">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>토스 페이먼츠 (Toss Payments) 3초 원클릭 결제</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 pl-5 text-[9px]">
                        <span>⚡ 카카오페이</span>
                        <span>•</span>
                        <span>⚡ 토스페이</span>
                        <span>•</span>
                        <span>⚡ 신용/체크카드</span>
                        <span>•</span>
                        <span>⚡ 네이버페이</span>
                    </div>
                </div>

                {/* Toss Direct Instant PG Payment Button */}
                <button
                    onClick={handleTossPaymentsCheckout}
                    disabled={isPaying}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    {isPaying ? (
                        <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>토스페이먼츠 승인 진행 중...</span>
                        </>
                    ) : (
                        <>
                            <span>💳 {currentInfo.price} 토스 결제 승인하기</span>
                            <ArrowRight size={15} />
                        </>
                    )}
                </button>

                {/* Legal Refund Clause (통합 법적 조항) */}
                <p className="text-[9.5px] text-gray-500 text-center leading-snug mt-1 px-1">
                    ※ 본 상품은 결제 즉시 개시되어 1회 답변 확인으로 서비스 목적이 완전 완결되는 단발성 디지털 콘텐츠 상품으로, 답변 열람 후에는 관련 법령(전자상거래법 제17조 제2항 제5호)에 따라 청약철회 및 전액 환불이 불가능합니다.
                </p>
            </div>
        </motion.div>
    );
}
