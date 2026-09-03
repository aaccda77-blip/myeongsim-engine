'use client';

import React from 'react';
import { SimpleCard } from '../design-system/SimpleCard';
import { SimpleBadge } from '../design-system/SimpleBadge';

interface SimpleInsightCardProps {
    pointTitle: string;
    pointDesc: string;
    keywords: string[];
    dailyGanji: string;
}

export function SimpleInsightCard({
    pointTitle,
    pointDesc,
    keywords,
    dailyGanji
}: SimpleInsightCardProps) {
    return (
        <SimpleCard className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9AA7B7]">
                    {pointTitle} ({dailyGanji})
                </span>
                <div className="flex items-center gap-1.5">
                    {keywords.map((kw, i) => (
                        <SimpleBadge key={i} variant="neutral">
                            {kw}
                        </SimpleBadge>
                    ))}
                </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e1726] border border-white/[0.05]">
                <p className="text-sm font-medium text-[#F4F6F8] leading-relaxed">
                    “{pointDesc}”
                </p>
            </div>
        </SimpleCard>
    );
}
