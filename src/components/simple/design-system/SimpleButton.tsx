'use client';

import React from 'react';

interface SimpleButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    icon?: React.ReactNode;
}

export function SimpleButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    icon
}: SimpleButtonProps) {
    const baseStyle = 'inline-flex items-center justify-center font-bold transition-all rounded-xl cursor-pointer active:scale-[0.98]';
    
    const sizeStyle = {
        sm: 'px-3 py-1.5 text-xs gap-1',
        md: 'px-4 py-2.5 text-xs gap-1.5',
        lg: 'px-5 py-3.5 text-sm gap-2 w-full'
    }[size];

    const variantStyle = {
        primary: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-md shadow-amber-500/10',
        secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-gray-200 border border-white/10',
        ghost: 'bg-transparent text-cyan-300 hover:text-cyan-200 hover:underline p-0'
    }[variant];

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`}
        >
            {icon && <span>{icon}</span>}
            <span>{children}</span>
        </button>
    );
}
