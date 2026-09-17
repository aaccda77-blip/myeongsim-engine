'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ExternalLink, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function LibraryPage() {
    const router = useRouter();
    const YES24_URL = 'https://www.yes24.com/Product/Goods/195946431';

    useEffect(() => {
        // 자체 전자책 리더 시스템 미제공 정책에 따라 YES24 공식 서점 페이지로 부드럽게 자동 연결
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined') {
                window.location.href = YES24_URL;
            }
        }, 2500);
        return () => clearTimeout(timer);
    }, [YES24_URL]);

    return (
        <div className="min-h-screen w-full bg-[#05030b] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-md w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-indigo-500/40 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mx-auto text-indigo-300 shadow-lg">
                    <BookOpen size={32} />
                </div>

                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
                        <ShieldAlert size={14} />
                        <span>전자책 리더 시스템 미운영 안내</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                        도서 《ZERO POINT》 공식 안내
                    </h2>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm text-gray-300 leading-relaxed text-left space-y-2">
                    <p>
                        🚫 <strong>본 앱에서는 자체적인 전자책 리더 시스템 및 전자책 열람을 제공하지 않습니다.</strong>
                    </p>
                    <p>
                        도서 《ZERO POINT》의 전체 내용은 대한민국 대표 서점 <strong>YES24</strong>에서 정식 출판 도서(종이책 및 전자책)로 만나보실 수 있습니다.
                    </p>
                    <p className="text-[11px] text-amber-300 pt-1">
                        ⚡ 잠시 후 YES24 공식 도서 페이지로 자동 이동합니다...
                    </p>
                </div>

                <div className="space-y-2.5 pt-2">
                    <a
                        href={YES24_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
                    >
                        <BookOpen size={18} />
                        <span>📗 YES24 공식 도서 구매하기</span>
                        <ExternalLink size={16} />
                    </a>

                    <button
                        type="button"
                        onClick={() => router.push('/report')}
                        className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                        <ArrowLeft size={14} />
                        <span>대시보드로 돌아가기</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
