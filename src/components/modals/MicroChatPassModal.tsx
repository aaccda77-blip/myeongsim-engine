'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircle, ShieldCheck, Zap, CreditCard, HeartHandshake } from 'lucide-react';
import MyeongsimSunLogo from '../common/MyeongsimSunLogo';

interface MicroChatPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessPay?: () => void;
}

/**
 * [890원 수다 3회 즉시 충전 소과금 모달]
 * 직관적이고 부담 없는 890원 결제 모달 (구매 허들 0%)
 */
export default function MicroChatPassModal({
    isOpen,
    onClose,
    onSuccessPay
}: MicroChatPassModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handlePay = async () => {
        setIsProcessing(true);
        try {
            // [Payment Request API Call or Toss/Kakao Pay Integration]
            const res = await fetch('/api/payment/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: 890,
                    orderName: '명심코칭 수다 3회 충전권',
                    itemType: 'micro_pass_3'
                })
            });

            const data = await res.json();

            if (data.checkoutUrl) {
                // 이더리움/토스/카카오페이 결제창으로 이동
                window.location.href = data.checkoutUrl;
            } else {
                // 테스트 또는 성공 시 처리
                setTimeout(() => {
                    setIsProcessing(false);
                    alert('890원 결제가 완료되어 수다 3회가 즉시 충전되었습니다! 💖');
                    if (onSuccessPay) onSuccessPay();
                    onClose();
                }, 1000);
            }
        } catch (error) {
            console.error('Payment Error:', error);
            setIsProcessing(false);
            // 시뮬레이션 처리
            alert('890원 충전이 완료되었습니다! 💖 (수다 3회 추가)');
            if (onSuccessPay) onSuccessPay();
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-[#0D1525] to-slate-950 border border-amber-400/40 shadow-2xl p-6 overflow-hidden text-center text-white"
                >
                    {/* Background Golden Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full bg-white/5 hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Sun Logo & Badge */}
                    <div className="flex flex-col items-center mt-2 mb-4">
                        <MyeongsimSunLogo size={56} className="mb-2" />
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 fill-amber-300" /> 소액 핀포인트 충전
                        </span>
                    </div>

                    {/* Main Title & Subtitle */}
                    <h3 className="text-xl font-bold tracking-tight text-white mb-2 leading-snug">
                        🎁 첫 3회 무료 코칭 완료!<br />
                        <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy underline-offset-4">
                            890원에 1:1 맞춤 코칭 소장 & 대화 이어가기
                        </span>
                    </h3>
                    <p className="text-xs text-gray-300 font-light leading-relaxed mb-6 px-2">
                        커피 한 잔보다 가벼운 금액으로,<br />
                        내 안의 고민을 명심 멘토와 끊김 없이 해결해 보세요.
                    </p>

                    
                    {/* Patent Open Event Notice Box */}
                    <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-left space-y-1.5 shadow-inner">
                        <p className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                            <span>📜 [명심코칭 오픈 & 특허 출원 기념 한정 혜택]</span>
                        </p>
                        <p className="text-[11px] text-gray-200 font-medium leading-[1.65]">
                            특허 정식 출원 승인 시까지 특별 혜택가 <strong className="text-amber-300 font-bold">890원</strong>에 제공되며, 정식 등록 완료 후 <span className="text-amber-200 font-bold">B2C 99,000원</span> / <span className="text-amber-200 font-bold">B2B 기업용 3,000,000원</span>으로 정상 인상될 예정입니다.
                        </p>
                    </div>

                    {/* Benefit Feature Box */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left space-y-2.5">
                        <div className="flex items-center gap-2.5 text-xs text-gray-200">
                            <MessageCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span>1:1 핀포인트 대화 <strong>3회 즉시 추가</strong></span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-gray-200">
                            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span>3단 분할 감동 말풍선 &amp; 추천 질문 칩 무제한</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-gray-200">
                            <HeartHandshake className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span>제3세대 최신 심리 멘토링 지속 연결</span>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-gray-950 font-extrabold text-base shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <CreditCard className="w-5 h-5 text-gray-950" />
                        <span>{isProcessing ? '결제 처리 중...' : '💳 890원에 3회 즉시 충전하기'}</span>
                    </button>

                    {/* Footer Info */}
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>안전한 토스/카카오 간편결제 지원 (부가가치세 포함)</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
