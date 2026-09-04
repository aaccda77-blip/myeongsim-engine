'use client';

import React, { useState } from 'react';
import { useDashboardViewModel } from '@/hooks/useDashboardViewModel';
import { useViewMode } from '@/hooks/useViewMode';
import { useSubscription } from '@/hooks/useSubscription';
import UnifiedSubscriptionModal from '@/components/modals/UnifiedSubscriptionModal';
import { Lock, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { WearableAppShell } from './WearableAppShell';
import { WearableQuantumRadar } from './WearableQuantumRadar';
import { WearableIljinEnergy } from './WearableIljinEnergy';
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

    const totalPages = 10;
    const pageTitles = [
        '👑 퀀텀 킬러 레이더',
        '🔮 사주 일진 에너지',
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
        // [3-Tier 권한 체크]
        // 1. 월정액(isMonthlyVip): 전 페이지 완전 무제한 프리패스
        // 2. 도서 구매자(isBookZeroPoint): 기본 제로포인트 코칭(0: 퀀텀 레이더, 1: 사주 일진 에너지, 2: 1:1 일진 선언문) 영구 해금,
        //    그 외 심화 기능(3~9: 바이오 펄스, 박스 호흡, 손목 사운드, 긴급 SOS 등)은 월정액 전용 잠금장치 작동
        // 3. 비구매 일반 고객: 0~1페이지 미리보기 제공, 2페이지부터 잠금
        const isLocked = !isMonthlyVip && (isBookZeroPoint ? page >= 3 : page >= 2);

        if (isLocked) {
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
                                ? '도서 구매 회원은 기본 제로포인트(사주 일진 & 선언문)가 영구 제공되며, 바이오 펄스 및 사운드랩 등 심화 다이얼은 월정액 전용입니다.'
                                : '124개 전 서비스 무제한 올패스 정액권으로 즉시 해금할 수 있습니다.'
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
                            onClick={() => setPage(1)}
                            className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] font-bold transition-all"
                        >
                            ← 사주 일진 에너지 보기
                        </button>
                    </div>
                </div>
            );
        }

        switch (page) {
            case 0:
                return (
                    <WearableQuantumRadar
                        onGoToBreath={() => setPage(4)}
                        onGoToSoundLab={() => setPage(5)}
                    />
                );
            case 1:
                return (
                    <WearableIljinEnergy
                        onGoToAffirmation={() => setPage(2)}
                        onGoToSoundLab={() => setPage(5)}
                    />
                );
            case 2:
                return (
                    <WearableDailyAffirmation
                        onGoToSoundLab={() => setPage(5)}
                    />
                );
            case 3:
                return (
                    <WearableBioPulse
                        onGoToBreath={() => setPage(4)}
                        onGoToEmergency={() => setPage(7)}
                    />
                );
            case 4:
                return (
                    <WearableBreathingPacer
                        onNext={() => setPage(5)}
                    />
                );
            case 5:
                return (
                    <WearableBrainwaveAudio
                        onNext={() => setPage(6)}
                    />
                );
            case 6:
                return (
                    <WearableZeroPointCapsule
                        onNext={() => setPage(7)}
                    />
                );
            case 7:
                return (
                    <WearableDarkCodeEmergency
                        onComplete={() => setPage(0)}
                    />
                );
            case 8:
                return (
                    <WearableFlowRing
                        score={vm.flow.score}
                        stateTitle={vm.flow.stateTitle}
                        levelLabel={vm.flow.levelLabel}
                        onNext={() => setPage(9)}
                    />
                );
            case 9:
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



