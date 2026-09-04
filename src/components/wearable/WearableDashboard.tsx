'use client';

import React, { useState } from 'react';
import { useDashboardViewModel } from '@/hooks/useDashboardViewModel';
import { useViewMode } from '@/hooks/useViewMode';
import { useSubscription } from '@/hooks/useSubscription';
import UnifiedSubscriptionModal from '@/components/modals/UnifiedSubscriptionModal';
import { Lock, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { WearableAppShell } from './WearableAppShell';
import { WearableQuantumRadar } from './WearableQuantumRadar';
import { WearableDailyAffirmation } from './WearableDailyAffirmation';
import { WearableBioPulse } from './WearableBioPulse';
import { WearableBreathingPacer } from './WearableBreathingPacer';
import { WearableBrainwaveAudio } from './WearableBrainwaveAudio';
import { WearableZeroPointCapsule } from './WearableZeroPointCapsule';
import { WearableDarkCodeEmergency } from './WearableDarkCodeEmergency';
import { WearableFlowRing } from './WearableFlowRing';
import { WearableCheckIn } from './WearableCheckIn';

export function WearableDashboard() {
    const vm = useDashboardViewModel();
    const { setViewMode } = useViewMode();
    const { isMonthlyVip, isBookZeroPoint } = useSubscription();
    const [page, setPage] = useState(0);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);

    const totalPages = 9;
    const pageTitles = [
        '👑 퀀텀 킬러 레이더',
        '⭐ 1:1 일진 선언문',
        '1. 바이오 펄스',
        '2. 박스 호흡',
        '3. 손목 사운드',
        '4. 영점 리셋',
        '5. 긴급 SOS',
        '6. 몰입 플로우',
        '7. 감정 체크'
    ];

    const renderPage = () => {
        // 책 구매 고객은 기본 제로포인트(리포트/일진)까지만 승인되며,
        // 워치 심화 다이얼(1~8: 1:1 선언문, 엠씨스퀘어 뇌파 사운드, 박스 호흡, 바이오 펄스 등)은 월정액 전용 잠금 처리
        if (!isMonthlyVip && page > 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center space-y-3 py-6 animate-fade-in select-none">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                        <Lock size={22} className="animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30">
                            특허출원 기념 VIP 전용
                        </span>
                        <h3 className="text-sm font-black text-white">
                            {pageTitles[page]} 잠금
                        </h3>
                        <p className="text-[11px] text-gray-300 leading-snug px-2">
                            {isBookZeroPoint 
                                ? '도서 구매 회원은 기본 제로포인트 코칭이 영구 제공되며, 워치 9대 킬러 다이얼은 월정액 전용입니다.'
                                : '123개 전 서비스 무제한 올패스 정액권으로 즉시 해금할 수 있습니다.'
                            }
                        </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/60 border border-amber-400/30 text-center w-full max-w-[220px]">
                        <span className="text-[10px] text-gray-500 line-through font-mono block">
                            정가 월 289,000원
                        </span>
                        <div className="text-sm font-black text-amber-300">
                            월 98,000원 <span className="text-[10px] text-amber-200 font-medium">(66% OFF)</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full max-w-[220px]">
                        <button
                            onClick={() => setIsSubModalOpen(true)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Sparkles size={13} />
                            <span>월 98,000원 올패스 해금</span>
                        </button>
                        <button
                            onClick={() => setPage(0)}
                            className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold transition-all"
                        >
                            ← 퀀텀 레이더 무료 미리보기
                        </button>
                    </div>
                </div>
            );
        }

        switch (page) {
            case 0:
                return (
                    <WearableQuantumRadar
                        onGoToBreath={() => setPage(3)}
                        onGoToSoundLab={() => setPage(4)}
                    />
                );
            case 1:
                return (
                    <WearableDailyAffirmation
                        onGoToSoundLab={() => setPage(4)}
                    />
                );
            case 2:
                return (
                    <WearableBioPulse
                        onGoToBreath={() => setPage(3)}
                        onGoToEmergency={() => setPage(6)}
                    />
                );
            case 3:
                return (
                    <WearableBreathingPacer
                        onNext={() => setPage(4)}
                    />
                );
            case 4:
                return (
                    <WearableBrainwaveAudio
                        onNext={() => setPage(5)}
                    />
                );
            case 5:
                return (
                    <WearableZeroPointCapsule
                        onNext={() => setPage(6)}
                    />
                );
            case 6:
                return (
                    <WearableDarkCodeEmergency
                        onComplete={() => setPage(0)}
                    />
                );
            case 7:
                return (
                    <WearableFlowRing
                        score={vm.flow.score}
                        stateTitle={vm.flow.stateTitle}
                        levelLabel={vm.flow.levelLabel}
                        onNext={() => setPage(8)}
                    />
                );
            case 8:
                return (
                    <WearableCheckIn
                        onNext={() => setPage(0)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <WearableAppShell
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageTitles={pageTitles}
            >
                {renderPage()}
            </WearableAppShell>

            <UnifiedSubscriptionModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                featureName={pageTitles[page] || '워치 9대 킬러 다이얼'}
            />
        </>
    );
}



