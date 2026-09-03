'use client';

import React from 'react';

interface RefinedButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

export function RefinedButton({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
    icon
}: RefinedButtonProps) {
    const base = 'w-full h-14 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] select-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[#FFAA00] hover:bg-[#ffb71a] text-slate-950 font-black shadow-md shadow-amber-500/15 border border-amber-300/30',
        secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-gray-200 border border-white/10',
        ghost: 'bg-transparent text-cyan-400 hover:underline border-none'
    }[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants} ${className}`}
        >
            {icon && <span>{icon}</span>}
            <span>{children}</span>
        </button>
    );
}
