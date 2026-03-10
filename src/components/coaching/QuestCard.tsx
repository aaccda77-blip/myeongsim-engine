import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function QuestCard({ text, logId, onComplete }: { text: string; logId?: string; onComplete?: () => void }) {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = async () => {
        if (logId) {
            setIsCompleting(true);
            try {
                await fetch('/api/coaching/log', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ logId })
                });
            } catch (err) {
                console.error("Failed to update quest status", err);
            } finally {
                setIsCompleting(false);
            }
        }

        if (onComplete) onComplete();
    };

    return (
        <motion.div
            // 가볍게 톡 떨어지며 통통 튀는 애니메이션 (산소를 마시는 느낌)
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 12, // 텐션감 조절
                delay: 0.2
            }}
            className="mt-6 p-5 bg-gradient-to-br from-cyan-50 to-white border border-cyan-200 rounded-xl shadow-md text-slate-800 relative overflow-hidden"
        >
            {/* 반짝이는 산소 방울 포인트 효과 */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] opacity-70 animate-pulse" />

            <h4 className="text-sm font-bold text-cyan-700 mb-2">✨ 수면 위로 올라왔습니다</h4>
            <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
                {text}
            </p>
            <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="mt-4 w-full py-3 bg-cyan-100/50 text-cyan-800 rounded-lg font-bold border border-cyan-200 hover:bg-cyan-200 hover:text-cyan-900 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {isCompleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Shift 퀘스트 수행 완료'}
            </button>
        </motion.div>
    );
}
