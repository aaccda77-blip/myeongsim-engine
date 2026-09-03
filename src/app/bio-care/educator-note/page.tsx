/**
 * /bio-care/educator-note/page.tsx
 * 전문가의 한마디 - 보건교육사 칼럼
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Article {
    id: string;
    title: string;
    subtitle: string;
    content: string[];
    author: string;
    date: string;
    category: '칼럼' | '바이오해킹';
}

const ARTICLES: Article[] = [
    {
        id: 'genre-not-error',
        title: '오류가 아니라 장르입니다',
        subtitle: '질병 관리를 삶의 과정으로 승화하기',
        content: [
            '당뇨, 고혈압, 비만... 이런 분석을 받으면 많은 분들이 "내 몸이 고장났다"고 생각합니다.',
            '하지만 보건교육사로서 수많은 분들을 만나며 깨달은 것이 있습니다. 질병은 오류가 아니라, 당신 삶의 새로운 "장르"라는 것입니다.',
            '소설에 로맨스, 스릴러, 판타지가 있듯이, 우리 삶에도 다양한 장르가 있습니다. 당뇨 관리라는 장르, 혈압 조절이라는 장르를 살아가는 것입니다.',
            '중요한 것은 이 장르를 어떻게 "잘" 살아가느냐입니다. 약물 복용, 식단 조절, 운동... 이 모든 것이 당신만의 스토리를 만들어가는 과정입니다.',
            '오늘도 약을 챙겨 드신 당신, 혈당을 체크한 당신, 계단을 오른 당신... 모두 자신의 장르를 성실히 살아가는 주인공입니다. 👏'
        ],
        author: '보건교육사 명심',
        date: '2026.02.02',
        category: '칼럼'
    },
    {
        id: 'sglt2-hydration',
        title: 'SGLT-2 억제제와 수분 섭취',
        subtitle: '당을 버리는 약, 물은 채워야 합니다',
        content: [
            'SGLT-2 억제제(자디앙, 포시가 등)는 신장에서 당을 소변으로 배출하는 약물입니다.',
            '문제는 당과 함께 수분도 함께 빠져나간다는 점입니다. 이로 인해 탈수, 어지러움, 요로감염 위험이 높아질 수 있습니다.',
            '보건교육 관점에서 권장하는 생활 습관:',
            '• 하루 2L 이상 물 섭취 (커피/차 제외)',
            '• 소변 색깔 체크 (진한 노란색이면 수분 부족)',
            '• 운동 전후 충분한 수분 보충',
            '• 탈수 증상(심한 갈증, 어지러움) 발생 시 즉시 의료진 상담',
            '약물 복용만큼 중요한 것이 생활 습관 관리입니다. 물 한 잔이 약의 효과를 높이고 부작용을 줄입니다.'
        ],
        author: '보건교육사 명심',
        date: '2026.02.01',
        category: '바이오해킹'
    }
];

export default function EducatorNotePage() {
    const router = useRouter();
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
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

    if (selectedArticle) {
        return (
            <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
                <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                    <button
                        onClick={() => setSelectedArticle(null)}
                        className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                        {selectedArticle.category}
                    </h2>
                </header>

                <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                    <div>
                        <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full mb-3">
                            {selectedArticle.category}
                        </span>
                        <h1 className="text-white text-2xl font-bold mb-2 font-serif leading-tight">
                            {selectedArticle.title}
                        </h1>
                        <p className="text-gray-400 text-sm mb-4">{selectedArticle.subtitle}</p>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <span>{selectedArticle.author}</span>
                            <span>•</span>
                            <span>{selectedArticle.date}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {selectedArticle.content.map((paragraph, idx) => (
                            <p key={idx} className="text-gray-300 text-sm leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* 의료법 준수 안내 */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mt-6">
                        <p className="text-purple-200 text-xs leading-relaxed">
                            📚 <strong>보건교육 목적 콘텐츠</strong><br />
                            본 글은 일반적인 건강 증진 정보 제공을 목적으로 하며, 개인별 의학적 분석이나 코칭 계획을 대신할 수 없습니다.
                            구체적인 건강 문제는 반드시 의사, 약사 등 의료 전문가와 상담하세요.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
            <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                <button
                    onClick={() => router.back()}
                    className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                    전문가의 한마디
                </h2>
            </header>

            <div className="p-6 text-center border-b border-gray-800">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <span className="material-symbols-outlined text-purple-400 text-3xl">school</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2 font-serif">
                    보건교육사의 인사이트
                </h3>
                <p className="text-gray-400 text-sm">
                    전문 지식과 따뜻한 격려를<br />함께 전합니다.
                </p>
            </div>

            <main className="flex-1 p-6 space-y-4 pb-8 overflow-y-auto">
                {ARTICLES.map((article) => (
                    <button
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] group"
                    >
                        <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded mb-2">
                            {article.category}
                        </span>
                        <h4 className="text-white font-bold text-lg mb-1 font-serif">
                            {article.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                            {article.subtitle}
                        </p>
                        <div className="flex items-center justify-between text-gray-500 text-xs">
                            <span>{article.date}</span>
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
