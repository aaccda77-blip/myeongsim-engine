'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NEURAL_CODE_DATABASE } from '@/data/NeuralCodeDB';

export default function NeuralCodeListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'dark' | 'gift' | 'meta'>('all');

    const filteredCodes = NEURAL_CODE_DATABASE.filter(code => {
        const matchesSearch =
            code.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            code.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            code.darkCode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            code.gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            code.metaCode.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const renderHexagram = (lines: number[]) => {
        return (
            <div className="flex flex-col gap-0.5">
                {lines.map((line, idx) => (
                    <div
                        key={idx}
                        className={`h-1 w-8 rounded-sm ${line === 1 ? 'bg-current' : 'flex justify-between'
                            }`}
                    >
                        {line === 0 && (
                            <>
                                <div className="h-full w-3.5 bg-current rounded-sm"></div>
                                <div className="h-full w-3.5 bg-current rounded-sm"></div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="relative w-full max-w-md mx-auto bg-gradient-to-b from-[#0a0e1a] to-[#101922] min-h-screen flex flex-col text-white">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Header */}
            <div className="relative z-10 sticky top-0 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between p-4 pt-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg font-bold tracking-tight">THE 64 코드</h1>
                        <p className="text-xs text-gray-400">Neural Code Library</p>
                    </div>
                    <div className="w-10"></div>
                </div>

                {/* Search Bar */}
                <div className="px-4 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="코드 검색..."
                            className="w-full bg-[#1C252E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
                    {[
                        { key: 'all', label: '전체', color: 'purple' },
                        { key: 'dark', label: '다크코드', color: 'red' },
                        { key: 'gift', label: '뉴럴코드', color: 'purple' },
                        { key: 'meta', label: '메타코드', color: 'indigo' }
                    ].map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setSelectedFilter(filter.key as any)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all ${selectedFilter === filter.key
                                ? `bg-${filter.color}-500/20 text-${filter.color}-400 border border-${filter.color}-500/30`
                                : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Code List */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
                {filteredCodes.map((code) => (
                    <button
                        key={code.number}
                        onClick={() => router.push(`/iching/code?code=${code.number}`)}
                        className="w-full bg-[#1C252E] hover:bg-[#222b36] border border-white/5 hover:border-purple-500/30 rounded-xl p-4 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            {/* Hexagram */}
                            <div className="text-purple-400/70 group-hover:text-purple-400 transition-colors pt-1">
                                {renderHexagram(code.hexagram)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                                        {String(code.number).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-base font-bold text-white">{code.title}</h3>
                                </div>
                                <p className="text-xs text-gray-400 mb-2 line-clamp-1">{code.subtitle}</p>

                                {/* Tags */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                        {code.darkCode.name}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                        {code.gift.name}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        {code.metaCode.name}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow */}
                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors shrink-0 mt-2" />
                        </div>
                    </button>
                ))}

                {filteredCodes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#101922] to-transparent pointer-events-none z-10"></div>
        </div>
    );
}
