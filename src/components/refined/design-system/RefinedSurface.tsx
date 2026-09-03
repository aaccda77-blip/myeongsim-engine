'use client';

import React from 'react';

interface RefinedSurfaceProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    elevated?: boolean;
}

export function RefinedSurface({
    children,
    className = '',
    onClick,
    elevated = false
}: RefinedSurfaceProps) {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border transition-all text-left ${
                elevated
                    ? 'bg-[#152238] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
                    : 'bg-[#101B2E] border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
            } ${onClick ? 'cursor-pointer hover:border-white/20 active:scale-[0.99]' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
