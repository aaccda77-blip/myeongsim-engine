'use client';

import React from 'react';
import { RefinedSurface } from '../design-system/RefinedSurface';
import { Compass } from 'lucide-react';

interface RefinedInsightSectionProps {
    pointTitle: string;
    pointDesc: string;
    keywords: string[];
    dailyGanji: string;
}

export function RefinedInsightSection({ pointTitle, pointDesc, keywords, dailyGanji }: RefinedInsightSectionProps) {
    return (
        <RefinedSurface className="p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9AA7B7] flex items-center gap-1.5">
                    <Compass size={13} className="text-[#18C5D9]" />
                    <span>{pointTitle} ({dailyGanji})</span>
                </span>
                <div className="flex items-center gap-1.5">
                    {keywords.map((kw, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-300 font-mono text-[11px]"
                        >
                            {kw}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0e1726] border border-white/[0.05] text-left">
                <p className="text-sm sm:text-base font-medium text-[#F4F6F8] leading-relaxed">
                    “{pointDesc}”
                </p>
            </div>
        </RefinedSurface>
    );
}
