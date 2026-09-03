/**
 * /bio-care/nutri-synergy/page.tsx
 * 시너지 영양학 - 성분 조합 정보
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NUTRIENT_SYNERGIES, DRUG_NUTRIENT_DEPLETIONS } from '@/data/BioCareData';

type TabType = 'synergy' | 'depletion';

export default function NutriSynergyPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('synergy');
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isBioUnlocked = localStorage.getItem('myeongsim_bio_care_unlocked') === 'true';
            const isPaidUser = localStorage.getItem('myeongsim_paid_user') === 'true';
            const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true';
            if (isBioUnlocked || isSmartVip || isPaidUser) {
                setIsLocked(false);
            }
        }
    }, []);

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
                        <a
                            href="https://smartstore.naver.com/cheongryubooks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            📖 청류스마트스토어에서 구매하기
                        </a>
                        <button
                            onClick={() => router.push('/bio-care')}
                            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold transition-all"
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
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                    시너지 영양학
                </h2>
            </header>

            {/* Intro */}
            <div className="p-6 text-center border-b border-gray-800">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <span className="material-symbols-outlined text-green-400 text-3xl">nutrition</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2 font-serif">
                    영양소 상호작용 가이드
                </h3>
                <p className="text-gray-400 text-sm">
                    보충제와 약물의 조화로운 조합을<br />보건교육 관점에서 안내합니다.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('synergy')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'synergy'
                            ? 'text-[#658c42] border-b-2 border-[#658c42]'
                            : 'text-gray-500'
                        }`}
                >
                    성분 조합
                </button>
                <button
                    onClick={() => setActiveTab('depletion')}
                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'depletion'
                            ? 'text-[#658c42] border-b-2 border-[#658c42]'
                            : 'text-gray-500'
                        }`}
                >
                    영양소 고갈 주의
                </button>
            </div>

            <main className="flex-1 p-6 space-y-4 pb-8 overflow-y-auto">
                {activeTab === 'synergy' && (
                    <>
                        {NUTRIENT_SYNERGIES.map((synergy) => (
                            <div
                                key={synergy.id}
                                className={`border rounded-2xl p-5 ${synergy.effect === 'positive'
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : synergy.effect === 'negative'
                                            ? 'bg-red-500/10 border-red-500/30'
                                            : 'bg-gray-500/10 border-gray-500/30'
                                    }`}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="material-symbols-outlined text-2xl mt-1" style={{
                                        color: synergy.effect === 'positive' ? '#10b981' : synergy.effect === 'negative' ? '#ef4444' : '#6b7280'
                                    }}>
                                        {synergy.effect === 'positive' ? 'check_circle' : synergy.effect === 'negative' ? 'cancel' : 'info'}
                                    </span>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold mb-1">{synergy.combination}</h4>
                                        <p className="text-gray-400 text-xs mb-2">
                                            {synergy.components.join(' + ')}
                                        </p>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                            {synergy.description}
                                        </p>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <p className="text-gray-300 text-xs">
                                                💡 <strong>보건교육 정보:</strong> {synergy.recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'depletion' && (
                    <>
                        {DRUG_NUTRIENT_DEPLETIONS.map((depletion, idx) => (
                            <div
                                key={idx}
                                className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-orange-400 text-2xl mt-1">
                                        warning_amber
                                    </span>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold mb-1">{depletion.drugName}</h4>
                                        <p className="text-orange-300 text-sm mb-2">
                                            → {depletion.depletedNutrient} 고갈 가능성
                                        </p>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                            <strong>이유:</strong> {depletion.reason}
                                        </p>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <p className="text-gray-300 text-xs">
                                                💡 <strong>보건교육 정보:</strong> {depletion.supplementAdvice}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* 의료법 준수 안내 */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-6">
                    <p className="text-blue-200 text-xs leading-relaxed">
                        ⚕️ <strong>보건교육 목적 안내</strong><br />
                        본 정보는 일반적인 건강 증진 교육 자료이며, 개인별 의학적 분석이나 가이드을 대신할 수 없습니다.
                        구체적인 복용량이나 코칭 방법은 반드시 의사, 약사 등 의료 전문가와 상담하세요.
                    </p>
                </div>
            </main>
        </div>
    );
}
