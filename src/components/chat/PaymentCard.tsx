// @ts-nocheck
import React from 'react';
import { CreditCard, Copy, ExternalLink, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentCardProps {
    onCopy?: () => void;
    onDetailedReport?: () => void; // [Added] To trigger report generation
}

export default function PaymentCard({ onCopy, onDetailedReport }: PaymentCardProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('농협 351-0733-820813');
        setCopied(true);
        if (onCopy) onCopy();
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenForm = () => {
        window.open('https://forms.google.com/example', '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-xl border border-white/10 shadow-xl overflow-hidden my-2"
        >
            {/* ... Header & Body ... */}
            <div className="bg-white/5 px-5 py-3 border-b border-white/5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white tracking-wide">Beta 멤버십 신청</span>
                <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Limited
                </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
                {/* Price Section */}
                <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-gray-400 text-sm line-through mb-1">정상가 19,000원</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">3,000</span>
                        <span className="text-lg text-gray-300">원</span>
                    </div>
                </div>

                {/* Bank Info */}
                <div className="bg-black/30 rounded-lg p-3 border border-white/5 flex items-center justify-between group">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 mb-0.5">입금 계좌 (농협)</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-200 font-mono tracking-wide">351-0733-820813</span>
                            <span className="text-xs text-gray-400">이경윤</span>
                        </div>
                    </div>
                    <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-md">
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleOpenForm}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg"
                    >
                        📝 신청서 작성 (필수)
                    </button>

                    {/* [Added] Report Button */}
                    {onDetailedReport && (
                        <button
                            onClick={onDetailedReport}
                            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors border border-gray-600"
                        >
                            🔓 입금 완료 / 리포트 해금 (Demo)
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
