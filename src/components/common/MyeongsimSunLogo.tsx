'use client';

import React from 'react';

interface MyeongsimSunLogoProps {
    className?: string;
    size?: number;
}

/**
 * [AURO 럭셔리 마인드풀니스 햇살 태양 로고]
 * 떠오르는 곡선 대지와 우아한 골드 햇살선이 조합된 마스터 로고 심볼
 */
export default function MyeongsimSunLogo({ className = '', size = 64 }: MyeongsimSunLogoProps) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_4px_12px_rgba(234,179,8,0.4)] transition-transform duration-300 hover:scale-105"
            >
                {/* 1. 떠오르는 골드 반양(Sun Half-Circle) */}
                <path
                    d="M 28 48 A 22 22 0 0 1 72 48"
                    stroke="url(#auroGoldGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                />

                {/* 2. 대지 Horizon 곡선 */}
                <path
                    d="M 12 55 Q 50 48 88 55"
                    stroke="url(#auroGoldGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                />

                {/* 3. 방사형 7개 골드 햇살 선들 (Sun Rays) */}
                {/* 12 o'clock */}
                <line x1="50" y1="14" x2="50" y2="27" stroke="url(#auroGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
                {/* 1:30 o'clock */}
                <line x1="68" y1="18" x2="59" y2="29" stroke="url(#auroGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
                {/* 10:30 o'clock */}
                <line x1="32" y1="18" x2="41" y2="29" stroke="url(#auroGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
                {/* 3 o'clock */}
                <line x1="77" y1="42" x2="66" y2="43" stroke="url(#auroGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
                {/* 9 o'clock */}
                <line x1="23" y1="42" x2="34" y2="43" stroke="url(#auroGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
                {/* 2 o'clock */}
                <line x1="76" y1="28" x2="64" y2="35" stroke="url(#auroGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
                {/* 10 o'clock */}
                <line x1="24" y1="28" x2="36" y2="35" stroke="url(#auroGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />

                {/* Gradient Definitions */}
                <defs>
                    <linearGradient id="auroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FEF08A" />
                        <stop offset="50%" stopColor="#EAB308" strokeWidth="1.5" />
                        <stop offset="100%" stopColor="#CA8A04" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
