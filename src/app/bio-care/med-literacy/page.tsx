/**
 * /bio-care/med-literacy/page.tsx
 * 약물 리터러시 - 내 약 가이드
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MEDICATIONS, type MedicationInfo } from '@/data/BioCareData';

export default function MedLiteracyPage() {
    const router = useRouter();
    const [selectedMed, setSelectedMed] = useState<MedicationInfo | null>(null);
    const [isLocked, setIsLocked] = useState(true);
    const [isCheckingApproval, setIsCheckingApproval] = useState(false);

    const checkLockStatus = () => {
        if (typeof window !== 'undefined') {
            const isApproved = localStorage.getItem('myeongsim_server_approved') === 'true';
            const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true';
            const isPaidUser = localStorage.getItem('myeongsim_paid_user') === 'true';
            const isMonthlyVip = localStorage.getItem('myeongsim_monthly_vip') === 'true';
            if (isApproved && (isSmartVip || isPaidUser || isMonthlyVip)) {
                setIsLocked(false);
            }
        }
    };

    useEffect(() => {
        checkLockStatus();
        window.addEventListener('myeongsim_auth_change', checkLockStatus);
        return () => window.removeEventListener('myeongsim_auth_change', checkLockStatus);
    }, []);

    const handleCheckApprovalStatus = async () => {
        setIsCheckingApproval(true);
        try {
            const storedName = localStorage.getItem('myeongsim_depositor_name') || '';
            const storedUserId = localStorage.getItem('myeongsim_user_id') || localStorage.getItem('myeongsim_phone') || '';
            const params = new URLSearchParams();
            if (storedUserId) params.set('userId', storedUserId);
            if (storedName) params.set('name', storedName);

            const res = await fetch(`/api/payment/check-approval?${params.toString()}&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.approved) {
                    localStorage.setItem('myeongsim_server_approved', 'true');
                    localStorage.setItem('myeongsim_monthly_vip', 'true');
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    setIsLocked(false);
                    alert('🎉 [승인 완료] 관리자 승인이 확인되었습니다! 바이오케어가 해금되었습니다.');
                } else {
                    alert('⏳ 아직 관리자 승인 대기 중입니다. 잠시 후 다시 [승인 확인]을 눌러주세요.\n(관리자가 입금/주문 확인 후 승인합니다)');
                }
            } else {
                alert('⏳ 승인 상태 확인 중입니다. 잠시 후 다시 시도해 주세요.');
            }
        } catch {
            alert('승인 확인 중 오류가 발생했습니다.');
        } finally {
            setIsCheckingApproval(false);
        }
    };

    if (isLocked) {
        return (
            <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans items-center justify-center p-6">
                <div className="max-w-sm w-full bg-[#181526] border border-amber-400/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400/10 to-amber-500/10 rounded-2xl flex items-center justify-center mx-auto border border-amber-400/20">
                        <span className="material-symbols-outlined text-amber-400 text-4xl">lock</span>
                    </div>
                    <h2 className="text-xl font-black text-white">바이오케어 VIP 전용 콘텐츠</h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        이 콘텐츠는 <strong className="text-amber-300">청류스마트스토어 구매자 단독 VIP 혜택</strong>으로 제공됩니다.
                    </p>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-left">
                        <p className="text-[11px] text-amber-200 leading-relaxed">
                            👑 <strong>청류스마트스토어</strong>에서 도서를 구매하시면 <span className="text-white font-bold">스타트업 리포트 + 다크코드 디버거 + 바이오케어 + 힐링송 + 20회 코칭</span> 올인원 슈퍼패키지가 전면 무료 해금됩니다!
                        </p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <button
                            onClick={handleCheckApprovalStatus}
                            disabled={isCheckingApproval}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>{isCheckingApproval ? '승인 상태 확인 중...' : '⚡ 관리자 승인 완료 확인 (새로고침)'}</span>
                        </button>
                        <a
                            href="https://smartstore.naver.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            📖 청류스마트스토어에서 구매하기
                        </a>
                        <button
                            onClick={() => router.push('/bio-care')}
                            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold transition-all cursor-pointer"
                        >
                            ← 뒤로 가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedMed) {
        return (
            <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
                {/* Header */}
                <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                    <button
                        onClick={() => setSelectedMed(null)}
                        className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                        {selectedMed.name}
                    </h2>
                </header>

                <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                    {/* 약물 기본 정보 */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-400 text-2xl">
                                    {selectedMed.icon}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xl font-serif">{selectedMed.name}</h3>
                                <p className="text-blue-300 text-sm">{selectedMed.genericName}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {selectedMed.mechanism}
                            </p>
                        </div>
                    </div>

                    {/* 일반적인 부작용 */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-yellow-400">info</span>
                            일반적인 부작용
                        </h4>
                        <ul className="space-y-2">
                            {selectedMed.commonSideEffects.map((effect, idx) => (
                                <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                    <span className="text-yellow-400 mt-1">•</span>
                                    {effect}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 위험 신호 */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                        <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">warning</span>
                            즉시 병원 방문 필요
                        </h4>
                        <ul className="space-y-2">
                            {selectedMed.warningSignals.map((signal, idx) => (
                                <li key={idx} className="text-red-200 text-sm flex items-start gap-2">
                                    <span className="text-red-400 mt-1">⚠️</span>
                                    {signal}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 영양 팁 */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                        <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">restaurant</span>
                            영양 관리 팁
                        </h4>
                        <ul className="space-y-2">
                            {selectedMed.nutritionTips.map((tip, idx) => (
                                <li key={idx} className="text-green-200 text-sm flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 심화 가이드 (삭센다 전용) */}
                    {selectedMed.id === 'saxenda' && (
                        <button
                            onClick={() => router.push('/bio-care/med-literacy/saxenda-guide')}
                            className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-5 hover:from-blue-500/30 hover:to-purple-500/30 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-400">school</span>
                                        담낭 건강 심화 가이드
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        왜 '잘 먹는 것'이 중요한지 알아보세요
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-blue-400">arrow_forward</span>
                            </div>
                        </button>
                    )}

                    {/* 수분 트래커 (자디앙 전용) */}
                    {selectedMed.id === 'jardiance' && (
                        <>
                            <button
                                onClick={() => router.push('/bio-care/med-literacy/jardiance-guide')}
                                className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-5 hover:from-blue-500/30 hover:to-purple-500/30 transition-all active:scale-[0.98] mb-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-blue-400">school</span>
                                            수분 관리 & 케톤산증 가이드
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            생명 안전을 위한 필수 교육
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-blue-400">arrow_forward</span>
                                </div>
                            </button>

                            <button
                                onClick={() => router.push('/bio-care/med-literacy/jardiance-hydration')}
                                className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-5 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-cyan-400">water_drop</span>
                                            수분 섭취 트래커
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            매일 목표 달성하고 탈수 예방하세요
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-cyan-400">arrow_forward</span>
                                </div>
                            </button>
                        </>
                    )}

                    {/* 심화 가이드 (메트포르민 전용) */}
                    {selectedMed.id === 'metformin' && (
                        <button
                            onClick={() => router.push('/bio-care/med-literacy/metformin-guide')}
                            className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-5 hover:from-green-500/30 hover:to-emerald-500/30 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-400">school</span>
                                        B12 고갈 & 젖산산증 가이드
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        장기 복용 시 필수 영양소 관리법
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-green-400">arrow_forward</span>
                            </div>
                        </button>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                <button
                    onClick={() => router.back()}
                    className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                    라이프 영양 리터러시
                </h2>
            </header>

            {/* Intro */}
            <div className="p-6 text-center border-b border-gray-800">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                    <span className="material-symbols-outlined text-blue-400 text-3xl">medication</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2 font-serif">
                    영양소 밸런스 가이드
                </h3>
                <p className="text-gray-400 text-sm">
                    일상에서 섭취하는 영양 요소를 선택하여<br />기질별 반응과 영양 밸런스 수치를 확인하세요.
                </p>
            </div>

            {/* Medication List */}
            <main className="flex-1 p-6 space-y-3 pb-8">
                {MEDICATIONS.map((med) => (
                    <button
                        key={med.id}
                        onClick={() => setSelectedMed(med)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-blue-400">
                                    {med.icon}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold mb-1">{med.name}</h4>
                                <p className="text-gray-500 text-xs">{med.genericName}</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-600 group-hover:text-[#658c42] transition-colors">
                                chevron_right
                            </span>
                        </div>
                    </button>
                ))}
            </main>
        </div>
    );
}
