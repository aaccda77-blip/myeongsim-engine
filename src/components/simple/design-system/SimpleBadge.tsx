'use client';

import React from 'react';

interface SimpleBadgeProps {
    children: React.ReactNode;
    variant?: 'amber' | 'cyan' | 'green' | 'neutral';
    className?: string;
}

export function SimpleBadge({ children, variant = 'amber', className = '' }: SimpleBadgeProps) {
    const style = {
        amber: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
        cyan: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30',
        green: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
        neutral: 'bg-white/[0.06] text-gray-300 border-white/10'
    }[variant];

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border ${style} ${className}`}>
            {children}
        </span>
    );
}
