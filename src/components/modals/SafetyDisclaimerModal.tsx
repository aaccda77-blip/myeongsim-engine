'use client';

import React, { useState, useEffect } from 'react';
import { LEGAL_NOTICES } from '@/constants/LegalNotices';
import { ShieldAlert, CheckCircle, Scale, X, ExternalLink, BookOpen, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SafetyDisclaimerModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [viewTab, setViewTab] = useState<'summary' | 'full'>('summary');
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

    useEffect(() => {
        setHasMounted(true);
        // Check if user has already agreed on first visit
        const hasAgreed = localStorage.getItem('myeongsim_legal_agreed');
        if (!hasAgreed) {
            setIsVisible(true);
        }

        // Global Event Listener to open modal from anywhere (Footer, Chat, Navbar, etc.)
        const handleOpen = () => {
            setIsVisible(true);
        };
        window.addEventListener('open-safety-modal', handleOpen);
        return () => {
            window.removeEventListener('open-safety-modal', handleOpen);
        };
    }, []);

    const handleAgree = () => {
        localStorage.setItem('myeongsim_legal_agreed', 'true');
        setIsVisible(false);
    };

    const toggleSection = (id: number) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (!hasMounted || !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-slate-950 px-5 sm:px-6 py-4 border-b border-amber-500/20 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                    <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                                        {LEGAL_NOTICES.title}
                                    </h2>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        보건복지부 비의료 가이드라인 및 의료법·표시광고법 준수 고지
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="닫기"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* View Tabs */}
                        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 sm:px-6 pt-2 shrink-0 gap-2">
                            <button
                                onClick={() => setViewTab('summary')}
                                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
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
                                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                                    viewTab === 'full'
                                        ? 'border-amber-400 text-amber-300'
                                        : 'border-transparent text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>10대 항목 전문 상세 보기</span>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar text-left">
                            
                            {/* 서두 긴급 고지 (모든 탭 공통 상단) */}
                            <div className="bg-gradient-to-r from-red-500/20 via-orange-500/15 to-amber-500/15 border border-red-500/40 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-red-200 leading-relaxed shadow-lg">
                                <span className="font-black text-white text-sm sm:text-base block mb-2 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-red-400" />
                                    {LEGAL_NOTICES.alertTitle}
                                </span>
                                <div className="space-y-1.5 text-xs sm:text-sm text-gray-200 font-medium">
                                    {LEGAL_NOTICES.preamble.map((p, idx) => (
                                        <p key={idx} className="leading-relaxed">
                                            • {p}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* TAB 1: 요약 보기 */}
                            {viewTab === 'summary' && (
                                <div className="space-y-4">
                                    <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-amber-500/30 space-y-3 shadow-md">
                                        <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                                            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                                            <span>{LEGAL_NOTICES.shortNotice.title}</span>
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-line font-normal">
                                            {LEGAL_NOTICES.shortNotice.content}
                                        </p>
                                    </div>

                                    {/* 특허출원 사실 및 한계 명시 카드 */}
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                                        <div className="flex items-center gap-2 text-amber-300 font-bold">
                                            <span>💡 특허출원 기술 구조 참고</span>
                                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-[10px] text-amber-300 font-mono">
                                                제10-2025-0166877호 (특허출원 중)
                                            </span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">
                                            명심코칭의 일부 프로세스는 「심리 및 생체데이터 기반 스트레스 관리 솔루션 제공 장치 및 방법」 특허출원 구조를 참고하거나 기반으로 설계될 수 있습니다. <strong>특허출원 사실은 의료적 효과 인정, 정부기관 인증 또는 과학적 검증을 의미하지 않습니다.</strong>
                                        </p>
                                    </div>

                                    {/* 긴급 연락처 카드 */}
                                    <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-2 text-xs">
                                        <h4 className="font-black text-red-300 flex items-center gap-1.5">
                                            <ShieldAlert className="w-4 h-4" />
                                            <span>전문 의료 도움 및 24시간 긴급 연락처</span>
                                        </h4>
                                        <p className="text-gray-300 leading-relaxed">
                                            신체적·정신적 질환이 의심되거나 위기 상황에서는 즉시 전문의의 진료를 받으시기 바랍니다.
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                                            <div className="p-2 rounded-lg bg-black/40 text-gray-200">자살예방상담: <strong>109</strong></div>
                                            <div className="p-2 rounded-lg bg-black/40 text-gray-200">정신건강상담: <strong>1577-0199</strong></div>
                                            <div className="p-2 rounded-lg bg-black/40 text-gray-200">보건복지상담: <strong>129</strong></div>
                                            <div className="p-2 rounded-lg bg-black/40 text-gray-200">응급/위급신고: <strong>119 / 112</strong></div>
                                        </div>
                                    </div>

                                    {/* 상세 보기 안내 버튼 */}
                                    <div className="text-center pt-2">
                                        <button
                                            onClick={() => setViewTab('full')}
                                            className="text-xs text-amber-300 hover:text-amber-200 underline underline-offset-4 font-bold"
                                        >
                                            10대 항목 전문 상세 보기 & 법률 근거 확인 →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: 10대 조항 전문 상세 보기 */}
                            {viewTab === 'full' && (
                                <div className="space-y-4">
                                    {LEGAL_NOTICES.sections.map((section) => {
                                        const isExpanded = expandedSections[section.id] ?? true;
                                        return (
                                            <div
                                                key={section.id}
                                                className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 shadow-md"
                                            >
                                                <div
                                                    onClick={() => toggleSection(section.id)}
                                                    className="flex items-center justify-between cursor-pointer group"
                                                >
                                                    <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2 group-hover:text-amber-200">
                                                        <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                                                        <span>{section.title}</span>
                                                    </h3>
                                                    <button className="text-gray-400 group-hover:text-white p-1">
                                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </button>
                                                </div>

                                                {section.subTitle && (
                                                    <h4 className="text-xs font-bold text-amber-200/90 pl-6">
                                                        {section.subTitle}
                                                    </h4>
                                                )}

                                                {isExpanded && (
                                                    <div className="space-y-3 pt-1 text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                                                        <p className="whitespace-pre-line font-medium">
                                                            {section.content}
                                                        </p>

                                                        {section.bullets && (
                                                            <ul className="space-y-1.5 pl-4 list-disc text-gray-300 text-xs">
                                                                {section.bullets.map((b, bIdx) => (
                                                                    <li key={bIdx} className="leading-relaxed">
                                                                        {b}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}

                                                        {section.protocol3S && (
                                                            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-2 my-2">
                                                                <span className="text-xs font-black text-amber-300 block">
                                                                    {section.protocol3S.title} ({section.protocol3S.subtitle})
                                                                </span>
                                                                <div className="space-y-2 pt-1">
                                                                    {section.protocol3S.steps.map((st, sIdx) => (
                                                                        <div key={sIdx} className="text-xs border-l-2 border-amber-400/60 pl-2.5">
                                                                            <strong className="text-amber-200">{st.step} - {st.title}:</strong>{' '}
                                                                            <span className="text-gray-300">{st.desc}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {section.subItems && (
                                                            <div className="space-y-2 my-2">
                                                                {section.subItems.map((item, iIdx) => (
                                                                    <div key={iIdx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                                                        <span className="text-xs font-black text-amber-300 block">
                                                                            ◈ {item.name}
                                                                        </span>
                                                                        <p className="text-xs text-gray-300 leading-relaxed">
                                                                            {item.desc}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {section.quoteBox && (
                                                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs text-amber-200">
                                                                <span className="font-black text-amber-300 block">
                                                                    📌 {section.quoteBox.title}
                                                                </span>
                                                                {section.quoteBox.quotes.map((q, qIdx) => (
                                                                    <p key={qIdx} className="italic text-gray-200 whitespace-pre-line font-medium">
                                                                        {q}
                                                                    </p>
                                                                ))}
                                                                {section.quoteBox.conclusion && (
                                                                    <p className="pt-1 text-amber-300 font-bold whitespace-pre-line border-t border-amber-500/20">
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
                                                            <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] sm:text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                                                                {section.extraNotice}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* 공식 법률 근거 링크 */}
                                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                                        <h4 className="font-bold text-gray-300">⚖️ 관련 법령 및 정부 가이드라인 출처</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                                            {LEGAL_NOTICES.legalReferences.map((ref, rIdx) => (
                                                <a
                                                    key={rIdx}
                                                    href={ref.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 text-gray-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors"
                                                >
                                                    <span className="truncate">[{ref.org}] {ref.title}</span>
                                                    <ExternalLink className="w-3 h-3 shrink-0 ml-1 opacity-70" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer / Agree Button */}
                        <div className="bg-slate-950 px-5 sm:px-6 py-4 border-t border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-[11px] text-gray-400 text-center sm:text-left leading-tight">
                                {LEGAL_NOTICES.footerCaption}
                            </p>
                            <button
                                onClick={handleAgree}
                                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0 flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>{LEGAL_NOTICES.buttonText}</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
