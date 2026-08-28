'use client';

import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full bg-[#070C16]/90 border-t border-white/10 py-8 px-5 text-gray-400 text-xs leading-relaxed mt-10 rounded-b-2xl">
            <div className="max-w-md mx-auto flex flex-col gap-4 text-left">
                
                {/* 브랜드명 & 대표자 / 사업자 / 통신판매 정보 */}
                <div className="space-y-1.5">
                    <h3 className="text-sm font-black text-gray-100">명심코칭 (마인드플로우랩)</h3>
                    <div className="space-y-0.5 text-gray-400 text-xs">
                        <p>대표 <strong className="text-gray-300 font-normal">이경윤</strong></p>
                        <p>사업자등록번호 <strong className="text-gray-300 font-normal">838-03-03892</strong></p>
                        <p>통신판매업신고번호 <strong className="text-gray-300 font-normal">2026-세종-0576</strong></p>
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

                {/* 약관 및 개인정보처리방침 */}
                <div className="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-white/5">
                    <a href="/terms" className="hover:text-white transition-colors cursor-pointer">이용약관</a>
                    <span>|</span>
                    <a href="/privacy" className="hover:text-white transition-colors cursor-pointer font-bold text-gray-200">개인정보처리방침</a>
                </div>

                {/* Copyright */}
                <div className="text-[11px] text-gray-500 pt-1">
                    © 2026 MindFlow Lab LLC. All rights reserved.
                </div>

            </div>
        </footer>
    );
}

