'use client';

import React from 'react';

interface SimpleCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    highlight?: boolean;
}

export function SimpleCard({ children, className = '', onClick, highlight = false }: SimpleCardProps) {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl p-5 transition-all text-left ${
                highlight 
                    ? 'bg-[#152338] border border-amber-400/30 shadow-[0_8px_24px_rgba(0,0,0,0.3)]' 
                    : 'bg-[#111C2F] border border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.25)]'
            } ${onClick ? 'cursor-pointer hover:border-white/20 active:scale-[0.99]' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
