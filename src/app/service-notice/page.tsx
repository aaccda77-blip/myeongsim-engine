'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LEGAL_NOTICES } from '@/constants/LegalNotices';
import { 
    ShieldAlert, 
    Scale, 
    BookOpen, 
    Sparkles, 
    CheckCircle, 
    ExternalLink, 
    ArrowLeft, 
    ChevronDown, 
    ChevronUp 
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function ServiceNoticePage() {
    const router = useRouter();
    const [viewTab, setViewTab] = useState<'summary' | 'full'>('full');
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
        1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true
    });
    const [agreed, setAgreed] = useState(false);

    const toggleSection = (id: number) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleAgree = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_legal_agreed', 'true');
        }
        setAgreed(true);
        setTimeout(() => {
            router.push('/report');
        }, 300);
    };

    return (
        <main className="min-h-screen bg-[#070A12] text-gray-200 font-sans flex flex-col justify-between">
            {/* Main Container */}
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
                
                {/* Back Button */}
                <a
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/';
                    }}
                    className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 mb-6 cursor-pointer shadow-lg shadow-amber-500/5"
                >
                    <ArrowLeft size={16} />
                    <span>명심코칭 메인으로 돌아가기</span>
                </a>

                {/* Header Title */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-xs font-bold text-amber-400 tracking-wider">LEGAL & COMPLIANCE</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {LEGAL_NOTICES.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 border-b border-white/10 pb-4">
                        {LEGAL_NOTICES.subtitle}
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-800 bg-black/40 rounded-t-2xl px-4 pt-3 gap-3 mb-6">
                    <button
                        onClick={() => setViewTab('summary')}
                        className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                            viewTab === 'summary'
                                ? 'border-amber-400 text-amber-300'
                                : 'border-transparent text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>요약 안내 (한눈에 보기)</span>
                    </button>
                    <button
                        onClick={() => setViewTab('full')}
                        className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                            viewTab === 'full'
                                ? 'border-amber-400 text-amber-300'
                                : 'border-transparent text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>10대 항목 전문 상세 보기</span>
                    </button>
                </div>

                {/* Top Alert Notice: "먼저 알려드립니다" */}
                <div className="bg-gradient-to-r from-red-500/20 via-orange-500/15 to-amber-500/15 border border-red-500/40 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-red-200 leading-relaxed shadow-lg mb-6">
                    <span className="font-black text-white text-sm sm:text-base block mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                        {LEGAL_NOTICES.alertTitle}
                    </span>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-200 font-medium">
                        {LEGAL_NOTICES.preamble.map((p, idx) => (
                            <p key={idx} className="leading-relaxed">
                                • {p}
                            </p>
                        ))}
                    </div>
                </div>

                {/* TAB 1: 요약 안내 (한눈에 보기) */}
                {viewTab === 'summary' && (
                    <div className="space-y-6 mb-8">
                        <div className="p-5 sm:p-6 rounded-2xl bg-black/50 border border-amber-500/30 space-y-3 shadow-md">
                            <h2 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                                <Scale className="w-5 h-5 text-amber-400 shrink-0" />
                                <span>{LEGAL_NOTICES.shortNotice.title}</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line font-normal">
                                {LEGAL_NOTICES.shortNotice.content}
                            </p>
                        </div>

                        {/* 특허출원 사실 및 한계 명시 카드 */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 text-amber-300 font-bold">
                                <span>💡 특허출원 기술 구조 참고</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[11px] text-amber-300 font-mono">
                                    제10-2025-0166877호 (특허출원 중)
                                </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                명심코칭의 일부 프로세스는 「심리 및 생체데이터 기반 스트레스 관리 솔루션 제공 장치 및 방법」 특허출원 구조를 참고하거나 기반으로 설계될 수 있습니다. <strong>특허출원 사실은 의료적 효과 인정, 정부기관 인증 또는 과학적 검증을 의미하지 않습니다.</strong>
                            </p>
                        </div>

                        {/* 긴급 연락처 카드 */}
                        <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-3 text-xs sm:text-sm">
                            <h3 className="font-black text-red-300 flex items-center gap-2 text-sm sm:text-base">
                                <ShieldAlert className="w-4 h-4 text-red-400" />
                                <span>전문 의료 도움 및 24시간 긴급 연락처</span>
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                신체적·정신적 질환이 의심되거나 위기 상황에서는 즉시 전문의의 진료를 받으시기 바랍니다.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                                <div className="p-2.5 rounded-lg bg-black/40 text-gray-200">자살예방상담전화: <strong>109</strong> (24시간)</div>
                                <div className="p-2.5 rounded-lg bg-black/40 text-gray-200">정신건강 위기상담전화: <strong>1577-0199</strong> (24시간)</div>
                                <div className="p-2.5 rounded-lg bg-black/40 text-gray-200">보건복지상담센터: <strong>129</strong></div>
                                <div className="p-2.5 rounded-lg bg-black/40 text-gray-200">생명의 전화: <strong>1588-9191</strong></div>
                                <div className="p-2.5 rounded-lg bg-black/40 text-gray-200 sm:col-span-2">위급 상황 신고: <strong>112 (경찰청) / 119 (소방청)</strong></div>
                            </div>
                        </div>

                        <div className="text-center pt-2">
                            <button
                                onClick={() => setViewTab('full')}
                                className="text-xs sm:text-sm text-amber-300 hover:text-amber-200 underline underline-offset-4 font-bold cursor-pointer"
                            >
                                10대 항목 전문 상세 보기 & 관련 법령 확인하기 →
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB 2: 10대 항목 전문 상세 보기 */}
                {viewTab === 'full' && (
                    <div className="space-y-5 mb-8">
                        {LEGAL_NOTICES.sections.map((section) => {
                            const isExpanded = expandedSections[section.id] ?? true;
                            return (
                                <section
                                    key={section.id}
                                    className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3 shadow-md transition-colors"
                                >
                                    <div
                                        onClick={() => toggleSection(section.id)}
                                        className="flex items-center justify-between cursor-pointer group select-none"
                                    >
                                        <h2 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2 group-hover:text-amber-200">
                                            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                                            <span>{section.title}</span>
                                        </h2>
                                        <button 
                                            type="button" 
                                            className="text-gray-400 group-hover:text-white p-1"
                                            aria-label="펼치기/접기"
                                        >
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {section.subTitle && (
                                        <h3 className="text-xs font-bold text-amber-200/90 pl-6">
                                            {section.subTitle}
                                        </h3>
                                    )}

                                    {isExpanded && (
                                        <div className="space-y-3 pt-2 text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                                            <p className="whitespace-pre-line font-medium">
                                                {section.content}
                                            </p>

                                            {section.bullets && (
                                                <ul className="space-y-1.5 pl-4 list-disc text-gray-300 text-xs sm:text-[13px]">
                                                    {section.bullets.map((b, bIdx) => (
                                                        <li key={bIdx} className="leading-relaxed">
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {section.protocol3S && (
                                                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/20 space-y-2.5 my-2">
                                                    <span className="text-xs font-black text-amber-300 block">
                                                        {section.protocol3S.title} ({section.protocol3S.subtitle})
                                                    </span>
                                                    <div className="space-y-2 pt-1">
                                                        {section.protocol3S.steps.map((st, sIdx) => (
                                                            <div key={sIdx} className="text-xs sm:text-[13px] border-l-2 border-amber-400/60 pl-3">
                                                                <strong className="text-amber-200">{st.step} - {st.title}:</strong>{' '}
                                                                <span className="text-gray-300">{st.desc}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {section.subItems && (
                                                <div className="space-y-2.5 my-2">
                                                    {section.subItems.map((item, iIdx) => (
                                                        <div key={iIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                                                            <span className="text-xs sm:text-sm font-black text-amber-300 block">
                                                                ◈ {item.name}
                                                            </span>
                                                            <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed whitespace-pre-line font-normal">
                                                                {item.desc}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {section.quoteBox && (
                                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs sm:text-[13px] text-amber-200">
                                                    <span className="font-black text-amber-300 block">
                                                        📌 {section.quoteBox.title}
                                                    </span>
                                                    {section.quoteBox.quotes.map((q, qIdx) => (
                                                        <p key={qIdx} className="italic text-gray-200 whitespace-pre-line font-medium">
                                                            {q}
                                                        </p>
                                                    ))}
                                                    {section.quoteBox.conclusion && (
                                                        <p className="pt-2 text-amber-300 font-bold whitespace-pre-line border-t border-amber-500/20">
                                                            {section.quoteBox.conclusion}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {section.patentBadge && (
                                                <div className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                                                    {section.patentBadge}
                                                </div>
                                            )}

                                            {section.extraNotice && (
                                                <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-[11px] sm:text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                                                    {section.extraNotice}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>
                            );
                        })}

                        {/* 관련 법령 및 정부 가이드라인 출처 */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs sm:text-sm">
                            <h3 className="font-bold text-gray-200 flex items-center gap-2">
                                <Scale className="w-4 h-4 text-amber-400" />
                                <span>⚖️ 관련 법령 및 정부 가이드라인 출처</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                                {LEGAL_NOTICES.legalReferences.map((ref, rIdx) => (
                                    <a
                                        key={rIdx}
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-gray-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors"
                                    >
                                        <span className="truncate">[{ref.org}] {ref.title}</span>
                                        <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1.5 opacity-70" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Consent & Confirmation Box */}
                <div className="p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)] space-y-4 mb-10 text-center">
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        {LEGAL_NOTICES.footerCaption}
                    </p>
                    <button
                        onClick={handleAgree}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span>[{LEGAL_NOTICES.buttonText}]</span>
                    </button>
                    {agreed && (
                        <p className="text-xs text-emerald-400 font-bold animate-pulse">
                            ✓ 서비스 안내를 확인하셨습니다. 리포트 화면으로 이동합니다...
                        </p>
                    )}
                </div>

            </div>

            {/* Global Footer */}
            <Footer />
        </main>
    );
}
