/**
 * SmartContextCard.tsx - 상황 인식형 에너지 분석 카드
 * 
 * 특징:
 * - 실시간 BPM + 사주 일진 + 바이오리듬 통합 분석
 * - 대화 연결 칩 (클릭 시 챗봇으로 질문 전달)
 * - 사용자 상태별 맞춤 추천
 */

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// ============== 타입 정의 ==============
interface SmartContextCardProps {
    bpm?: number;
    birthDate?: string; // YYYY-MM-DD
    onChatTopic?: (message: string) => void;
    onClose?: () => void;
}

interface ContextAnalysis {
    energyLevel: 'low' | 'normal' | 'high' | 'stress';
    energyEmoji: string;
    energyText: string;
    dayElement: string; // 오행
    dayElementEmoji: string;
    goldenTime: string;
    recommendation: string;
    conversationStarters: string[];
}

// ============== 일진 계산 (간단 버전) ==============
const getDayElement = (date: Date): { element: string; emoji: string; desc: string } => {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const elements = [
        { element: '木', emoji: '🌳', desc: '새로운 시작, 성장' },
        { element: '火', emoji: '🔥', desc: '열정, 활동적 에너지' },
        { element: '土', emoji: '🏔️', desc: '안정, 신중함' },
        { element: '金', emoji: '⚔️', desc: '결단력, 정리' },
        { element: '水', emoji: '💧', desc: '지혜, 유연함' }
    ];
    return elements[dayOfYear % 5];
};

// ============== 골든타임 계산 ==============
const getGoldenTime = (hour: number, element: string): string => {
    // 오행 + 시간대 조합
    if (element === '木') return '오전 9시~11시 (창의적 작업)';
    if (element === '火') return '오후 2시~4시 (중요한 결정)';
    if (element === '土') return '오전 10시~12시 (안정적 업무)';
    if (element === '金') return '오후 4시~6시 (정리/마무리)';
    if (element === '水') return '오후 7시~9시 (학습/명상)';
    return '오후 3시~5시';
};

// ============== 메인 컴포넌트 ==============
export default function SmartContextCard({
    bpm = 72,
    birthDate,
    onChatTopic,
    onClose
}: SmartContextCardProps) {

    const analysis = useMemo<ContextAnalysis>(() => {
        const now = new Date();
        const hour = now.getHours();
        const dayInfo = getDayElement(now);

        // 에너지 레벨 판단
        let energyLevel: ContextAnalysis['energyLevel'] = 'normal';
        let energyEmoji = '💚';
        let energyText = '안정';

        if (bpm < 60) {
            energyLevel = 'low';
            energyEmoji = '💙';
            energyText = '저에너지 (휴식 필요)';
        } else if (bpm > 100) {
            energyLevel = 'stress';
            energyEmoji = '❤️‍🔥';
            energyText = '고에너지 (과활성)';
        } else if (bpm > 85) {
            energyLevel = 'high';
            energyEmoji = '💛';
            energyText = '활발';
        }

        // 상황별 추천
        let recommendation = '';
        if (energyLevel === 'low') {
            recommendation = '가벼운 스트레칭이나 산책이 도움됩니다';
        } else if (energyLevel === 'stress') {
            recommendation = '잠시 멈추고 호흡에 집중해보세요';
        } else if (hour >= 9 && hour <= 11) {
            recommendation = '지금은 창의적 작업의 골든타임!';
        } else if (hour >= 14 && hour <= 16) {
            recommendation = '중요한 결정을 내리기 좋은 시간대입니다';
        } else {
            recommendation = '현재 에너지 상태가 좋습니다';
        }

        // 대화 유도 질문
        const conversationStarters = [
            `왜 지금이 ${dayInfo.element}의 기운인지 더 알고 싶어`,
            energyLevel === 'stress' ? '지금 긴장되는데 어떻게 하면 좋을까?' : '오늘 뭘 하면 가장 좋을까?',
            '나의 기질 에너지로 볼 때 지금 가장 필요한 건 뭐야?',
            hour >= 18 ? '오늘 하루 마무리 어떻게 하면 좋을까?' : '남은 하루 어떻게 보내면 좋을까?'
        ];

        return {
            energyLevel,
            energyEmoji,
            energyText,
            dayElement: dayInfo.element,
            dayElementEmoji: dayInfo.emoji,
            goldenTime: getGoldenTime(hour, dayInfo.element),
            recommendation,
            conversationStarters
        };
    }, [bpm]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        🌅 오늘의 에너지 분석
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Energy Status */}
                <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">현재 상태</p>
                            <p className="text-white text-lg font-semibold">
                                {analysis.energyEmoji} {analysis.energyText} (BPM {bpm})
                            </p>
                        </div>
                        <div className="text-4xl">{analysis.energyEmoji}</div>
                    </div>
                </div>

                {/* Day Element */}
                <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">오늘의 기운</p>
                            <p className="text-white text-lg font-semibold">
                                {analysis.dayElementEmoji} {analysis.dayElement}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-sm mb-1">골든타임</p>
                            <p className="text-cyan-400 font-medium">
                                {analysis.goldenTime}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-4 mb-6 border border-cyan-500/30">
                    <p className="text-white text-center font-medium">
                        💡 {analysis.recommendation}
                    </p>
                </div>

                {/* Conversation Starters */}
                <div className="space-y-2">
                    <p className="text-slate-400 text-sm mb-3">💬 이 주제로 대화하기</p>
                    {analysis.conversationStarters.slice(0, 3).map((starter, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                onChatTopic?.(starter);
                                onClose?.();
                            }}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-xl px-4 py-3 text-left text-white text-sm transition-all hover:translate-x-1"
                        >
                            "{starter}"
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
