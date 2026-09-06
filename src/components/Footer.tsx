'use client';

import React from 'react';
import { LEGAL_NOTICES } from '@/constants/LegalNotices';
import { ShieldCheck, Scale, FileText, ExternalLink } from 'lucide-react';

export default function Footer() {
    const handleOpenLegalModal = (e: React.MouseEvent) => {
        e.preventDefault();
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-safety-modal'));
        }
    };

    return (
        <footer className="w-full bg-[#070C16]/95 border-t border-white/10 py-8 px-5 text-gray-400 text-xs leading-relaxed mt-10 rounded-b-2xl">
            <div className="max-w-xl mx-auto flex flex-col gap-5 text-left">
                
                {/* 🛡️ 근거 기반 접근 및 비의료 건강관리 고지 (홈페이지 상시 요약 버전) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-gray-300 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{LEGAL_NOTICES.shortNotice.title}</span>
                        </div>
                        <button
                            onClick={handleOpenLegalModal}
                            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer shrink-0"
                        >
                            <span>10대 조항 전문 보기</span>
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line font-normal">
                        {LEGAL_NOTICES.shortNotice.content}
                    </p>
                    <div className="pt-1 text-[11px] text-gray-400 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
                        <span>※ 본 서비스는 의료인의 진료 및 의학적 진단을 대체하지 않습니다.</span>
                        <span className="text-gray-400">위기상담전화: <strong>109</strong> (24시간)</span>
                    </div>
                </div>

                {/* 브랜드명 & 대표자 / 사업자 / 통신판매 정보 */}
                <div className="space-y-1.5 pt-1">
                    <h3 className="text-sm font-black text-gray-100">명심코칭 (마인드플로우랩)</h3>
                    <div className="space-y-0.5 text-gray-400 text-xs">
                        <p>대표 <strong className="text-gray-300 font-normal">이경윤</strong></p>
                        <p>사업자등록번호 <strong className="text-gray-300 font-normal">838-03-03892</strong></p>
                        <p>통신판매업신고번호 <strong className="text-gray-300 font-normal">2026-세종-0576</strong></p>
                        <p className="leading-relaxed">
                            특허출원번호 <strong className="text-amber-300 font-mono font-normal">제10-2025-0166877호</strong>
                            <span className="text-gray-400 text-[11px] ml-1.5 block sm:inline">
                                (발명의 명칭: 심리 및 생체데이터 기반 스트레스 관리 솔루션 제공 장치 및 방법 / 특허출원 중이며 의료적 효과나 정부인증을 의미하지 않습니다)
                            </span>
                        </p>
                    </div>
                </div>

                {/* 고객센터 정보 */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                    <h4 className="text-xs font-bold text-gray-200">고객센터</h4>
                    <div className="text-gray-300 font-mono text-xs">
                        support@myeongsimcoaching.com
                    </div>
                    <p className="text-gray-400 text-[11px] leading-normal">
                        전화 상담은 제공하지 않습니다. 문의하기 게시판을 이용해주세요.
                    </p>
                    <div className="pt-1">
                        <a 
                            href="/support" 
                            className="inline-block px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-medium border border-white/10 transition-colors"
                        >
                            문의하기
                        </a>
                    </div>
                </div>

                {/* 약관 및 개인정보처리방침 & 서비스 안내 */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 pt-3 border-t border-white/5">
                    <a href="/terms" className="hover:text-white transition-colors cursor-pointer">이용약관</a>
                    <span>|</span>
                    <a href="/privacy" className="hover:text-white transition-colors cursor-pointer font-bold text-gray-200">개인정보처리방침</a>
                    <span>|</span>
                    <button
                        onClick={handleOpenLegalModal}
                        className="hover:text-amber-300 text-amber-400/90 transition-colors cursor-pointer font-bold inline-flex items-center gap-1"
                    >
                        <span>근거 기반 접근 및 서비스 안내 (전문)</span>
                    </button>
                </div>

                {/* Copyright */}
                <div className="text-[11px] text-gray-500 pt-1 leading-normal">
                    © 2026 마인드플로우랩 (MindFlow Lab). All rights reserved. 본 서비스에서 제공하는 3S Protocol, Dark Code, Neural Code, Meta Code는 자체적인 비의료 코칭 프레임워크입니다.
                </div>

            </div>
        </footer>
    );
}
