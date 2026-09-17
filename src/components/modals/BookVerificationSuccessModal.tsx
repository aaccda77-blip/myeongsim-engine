'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, BookOpen, Music, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookVerificationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    buyerName: string;
    serialKey: string;
    onStartReading: () => void;
    onOpenHealingSong: () => void;
}

const VERIFY_SUCCESS_I18N = {
    kr: {
        badge: '정품 인증 성공',
        congrats: (name: string) => `축하합니다, ${name}님!`,
        license: '라이선스:',
        benefit1: '📗 YES24 정품 독자 인증 완료',
        benefit2: '🎵 1:1 헌정 힐링송 작곡 무료 신청권 자동 지급',
        benefit3: '💬 명심 AI 수석 코치 20회 VIP 대화권 즉시 활성화',
        btnStartReading: '📗 YES24 도서 바로가기 ➔',
        btnHealingSong: '🎵 1:1 헌정 힐링송 작곡 무료 신청하기'
    },
    en: {
        badge: 'Official License Verified',
        congrats: (name: string) => `Congratulations, ${name}!`,
        license: 'License:',
        benefit1: '📗 YES24 Official Reader Verified',
        benefit2: '🎵 1:1 Custom Dedicated Healing Song Composition Pass Included',
        benefit3: '💬 Myeongsim AI Head Coach 20 VIP Coaching Sessions Activated',
        btnStartReading: '📗 Go to YES24 Book Page ➔',
        btnHealingSong: '🎵 Apply for Free 1:1 Healing Song'
    },
    jp: {
        badge: '正規認証成功',
        congrats: (name: string) => `おめでとうございます、${name}様！`,
        license: 'ライセンス:',
        benefit1: '📗 YES24 正規読者認証完了',
        benefit2: '🎵 1:1 献呈ヒーリングソング無料作曲権 自動付与',
        benefit3: '💬 明心AI首席コーチ 20回VIP対話権 即時有効化',
        btnStartReading: '📗 YES24 書籍ページへ移動 ➔',
        btnHealingSong: '🎵 1:1 献呈ヒーリングソング無料作曲を申し込む'
    },
    cn: {
        badge: '正版认证成功',
        congrats: (name: string) => `恭喜您，${name}！`,
        license: '授权许可:',
        benefit1: '📗 YES24 正版读者验证完成',
        benefit2: '🎵 1:1 专属疗愈歌曲免费定制申请权 自动发放',
        benefit3: '💬 明心AI首席教练 20次VIP对话权限 立即激活',
        btnStartReading: '📗 前往 YES24 图书购买页面 ➔',
        btnHealingSong: '🎵 免费申请1:1专属疗愈歌曲'
    }
};

export default function BookVerificationSuccessModal({
    isOpen,
    onClose,
    buyerName,
    serialKey,
    onStartReading,
    onOpenHealingSong
}: BookVerificationSuccessModalProps) {
    const { language } = useLanguage();
    const t = VERIFY_SUCCESS_I18N[language as keyof typeof VERIFY_SUCCESS_I18N] || VERIFY_SUCCESS_I18N.kr;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-sm bg-gradient-to-b from-[#182338] via-[#111C2F] to-[#0d1524] border-2 border-amber-400/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl relative overflow-hidden"
            >
                {/* 상단 골드 글로우 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

                {/* 엠블럼 */}
                <div className="size-16 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/30 border border-amber-200">
                    <Sparkles size={32} />
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                        {t.badge}
                    </span>
                    <h3 className="text-xl font-black text-white">
                        {t.congrats(buyerName || '독자')}
                    </h3>
                    <p className="text-xs text-gray-300 font-mono">
                        {t.license} <span className="text-amber-300">{serialKey}</span>
                    </p>
                </div>

                {/* 3대 해금 혜택 박스 */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 text-left space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-200">
                        <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                        <span>{t.benefit1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                        <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                        <span>{t.benefit2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                        <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                        <span>{t.benefit3}</span>
                    </div>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-2">
                    <a
                        href="https://www.yes24.com/Product/Goods/195946431"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                    >
                        <BookOpen size={16} />
                        <span>{t.btnStartReading}</span>
                        <ExternalLink size={14} />
                    </a>

                    <button
                        onClick={() => {
                            onClose();
                            onOpenHealingSong();
                        }}
                        className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                        <Music size={13} />
                        <span>{t.btnHealingSong}</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
