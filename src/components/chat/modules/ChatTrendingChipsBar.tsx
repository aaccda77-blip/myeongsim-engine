'use client';

import React from 'react';

interface ChatTrendingChipsBarProps {
    selectedMood: string;
    handleChipClick: (prompt: string) => void;
    setShowTrendingTopicModal: (show: boolean) => void;
}

export const MOOD_CHIP_MAP: Record<string, string[]> = {
    '불안·완벽주의': [
        '💰 "내 사주로 돈 벌 수 있어? 2026년 사업·재물운 정밀 분석"',
        '🧠 "완벽주의와 조급증 다크코드 뇌 쿨링(ACT) 해줘"',
        '🌙 "밤/새벽에 일해야 해, 낮에 해야 해? 내 맞춤 시간대"',
        '🔮 "올해 대박 날 3S 마이크로 실천 지침 알려줘"'
    ],
    '조바심·스트레스': [
        '🔥 "속도만 내다 번아웃 올 것 같은데 메타인지로 정밀 교정해줘"',
        '⚡ "108 매트릭스 ➔ B2B 스케일업 수익화 구조 사주 풀이해줘"',
        '🧘 "조급함이 솟구칠 때 뇌 편도체 리셋 1분 3S 스위치 알려줘"',
        '📜 "내 사주에 수(水) 냉각수 부족한지 4D 풀 스캔해줘"'
    ],
    '무기력·혼란': [
        '🌧️ "에너지가 고갈되었는데 2026년 병오년 활력 기운 재배선해줘"',
        '🌱 "내 가슴속 창의적 영감을 재물(木)로 바꾸는 방법 풀이해줘"',
        '🛡️ "자책과 무기력감 생존 보호자(IFS) 자비 수용 에세이 부탁해"',
        '👑 "흔들리는 내 영혼의 군주 통치권 회복하는 명상 가이드"'
    ],
    '평온·영점 각성': [
        '✨ "오늘 432Hz 제로포인트 순수 자각 명상 가이드 알려줘"',
        '💎 "60갑자 중 내 일간 기질에 맞는 80% 미학 실천법"',
        '🚀 "2026년 정식 특허 출원 후 B2B 30만원 스케일업 운세"',
        '💖 "내 영혼을 따뜻하게 안아주는 3S 감동 에세이 리포트"'
    ]
};

export default function ChatTrendingChipsBar({
    selectedMood,
    handleChipClick,
    setShowTrendingTopicModal
}: ChatTrendingChipsBarProps) {
    const chips = MOOD_CHIP_MAP[selectedMood] || MOOD_CHIP_MAP['불안·완벽주의'];

    return (
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1.5 shrink-0">
                {chips.map((chip, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => handleChipClick(chip)}
                        className="text-[10px] sm:text-xs font-extrabold px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-slate-900 hover:from-indigo-900 hover:to-purple-900 border border-indigo-400/40 hover:border-amber-400/70 text-indigo-100 hover:text-amber-200 transition-all whitespace-nowrap shrink-0 shadow-md hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 cursor-pointer flex items-center gap-1.5 min-h-[36px]"
                    >
                        {chip}
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={() => setShowTrendingTopicModal(true)}
                className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-400/40 text-purple-200 text-[10px] sm:text-xs font-black transition-all shrink-0 active:scale-95 cursor-pointer flex items-center gap-1 shadow-md whitespace-nowrap ml-auto"
            >
                🔥 핫이슈 주제 8선 ➔
            </button>
        </div>
    );
}
