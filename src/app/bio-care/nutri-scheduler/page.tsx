/**
 * /app/bio-care/nutri-scheduler/page.tsx
 * 영양제 타이밍 스케줄러 메인 페이지
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Supplement, TimingCategory, calculateEfficiency, generateSuggestions, SUPPLEMENT_DATABASE } from '@/data/NutrientTimingDB';
import SupplementInput from '@/components/bio-care/SupplementInput';
import NutrientTimingCard from '@/components/bio-care/NutrientTimingCard';
import { motion } from 'framer-motion';

interface UserSupplement {
    supplement: Supplement;
    userTiming: TimingCategory;
}

export default function NutriSchedulerPage() {
    const router = useRouter();
    const [userSupplements, setUserSupplements] = useState<UserSupplement[]>([]);
    const [efficiency, setEfficiency] = useState(0);
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

    // 로컬 스토리지에서 불러오기
    useEffect(() => {
        const saved = localStorage.getItem('userSupplements');
        if (saved) {
            const savedData = JSON.parse(saved);
            // ID로 supplement 객체 복원
            const restored = savedData.map((item: any) => ({
                supplement: SUPPLEMENT_DATABASE.find(s => s.id === item.supplementId)!,
                userTiming: item.userTiming
            })).filter((item: any) => item.supplement); // 유효한 것만
            setUserSupplements(restored);
        }
    }, []);

    // 효율 계산
    useEffect(() => {
        const eff = calculateEfficiency(
            userSupplements.map(us => ({
                id: us.supplement.id,
                currentTiming: us.userTiming
            }))
        );
        setEfficiency(eff);
    }, [userSupplements]);

    // 저장
    const saveSupplements = (supplements: UserSupplement[]) => {
        setUserSupplements(supplements);
        // ID만 저장
        const toSave = supplements.map(us => ({
            supplementId: us.supplement.id,
            userTiming: us.userTiming
        }));
        localStorage.setItem('userSupplements', JSON.stringify(toSave));
    };

    const handleAdd = (supplement: Supplement, timing: TimingCategory) => {
        // 중복 체크
        if (userSupplements.some(us => us.supplement.id === supplement.id)) {
            alert('이미 등록된 영양제입니다.');
            return;
        }
        saveSupplements([...userSupplements, { supplement, userTiming: timing }]);
    };

    const handleRemove = (supplementId: string) => {
        saveSupplements(userSupplements.filter(us => us.supplement.id !== supplementId));
    };

    const suggestions = generateSuggestions(
        userSupplements.map(us => ({
            id: us.supplement.id,
            currentTiming: us.userTiming
        }))
    );

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
                <div className="flex-1 text-center pr-10">
                    <h2 className="text-white text-lg font-bold">영양제 타이밍 스케줄러</h2>
                    <p className="text-gray-400 text-xs">흡수율 최적화 시간표</p>
                </div>
            </header>

            <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                {/* 효율 점수 */}
                {userSupplements.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-white font-bold text-lg">흡수율 효율</h3>
                                <p className="text-gray-400 text-sm">현재 섭취 스케줄 평가</p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-white">{efficiency}%</div>
                                <div className="text-xs text-gray-400">
                                    {efficiency >= 80 && '🎉 최적화됨'}
                                    {efficiency >= 50 && efficiency < 80 && '⚡ 개선 가능'}
                                    {efficiency < 50 && '⚠️ 재배치 권장'}
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${efficiency}%` }}
                                className={`h-full ${efficiency >= 80
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                        : efficiency >= 50
                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                            : 'bg-gradient-to-r from-red-500 to-pink-500'
                                    }`}
                            />
                        </div>
                    </motion.div>
                )}

                {/* 개선 제안 */}
                {suggestions.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
                        <h3 className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined">lightbulb</span>
                            개선 제안
                        </h3>
                        <div className="space-y-3">
                            {suggestions.map((sug, idx) => (
                                <div key={idx} className="bg-white/5 rounded-xl p-3">
                                    <p className="text-white text-sm font-bold mb-1">
                                        {sug.supplement.name}
                                    </p>
                                    <p className="text-gray-300 text-xs mb-2">
                                        {sug.currentTiming === 'morning' && '아침'}
                                        {sug.currentTiming === 'meal' && '식사 후'}
                                        {sug.currentTiming === 'evening' && '저녁'}
                                        {' → '}
                                        <span className="text-yellow-300 font-bold">
                                            {sug.suggestedTiming === 'morning' && '아침'}
                                            {sug.suggestedTiming === 'meal' && '식사 후'}
                                            {sug.suggestedTiming === 'evening' && '저녁'}
                                        </span>
                                        으로 이동 권장
                                    </p>
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        {sug.reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 영양제 추가 버튼 */}
                <SupplementInput onAdd={handleAdd} />

                {/* 시간대별 카드 */}
                <div className="space-y-4">
                    <NutrientTimingCard
                        timing="morning"
                        supplements={userSupplements}
                        onRemove={handleRemove}
                    />
                    <NutrientTimingCard
                        timing="meal"
                        supplements={userSupplements}
                        onRemove={handleRemove}
                    />
                    <NutrientTimingCard
                        timing="evening"
                        supplements={userSupplements}
                        onRemove={handleRemove}
                    />
                </div>

                {/* 면책 조항 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="text-gray-300 font-bold text-sm mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">info</span>
                        보건교육 안내
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        본 정보는 일반적인 영양학 지식에 기반한 교육 자료입니다.
                        개인의 체질, 건강 상태, 복용 중인 약물에 따라 적합성이 다를 수 있으므로,
                        전문의약품을 복용 중이거나 특정 질환이 있는 경우 반드시 주치의와 상담하세요.
                    </p>
                </div>
            </main>
        </div>
    );
}
