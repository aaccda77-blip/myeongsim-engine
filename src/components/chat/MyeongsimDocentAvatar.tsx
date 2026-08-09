'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Moon, Sun, Feather, Compass, Eye } from 'lucide-react';

export type OhaengType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

interface MyeongsimDocentAvatarProps {
    ohaeng?: OhaengType | string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showTitle?: boolean;
    className?: string;
}

/**
 * [세계적 마스터 장인 & 심리 에세이 작가의 손끝 디자인 아바타]
 * 동화적 아늑함, 인공지능 느낌 0%, 최고급 수공예 아우라 감성 렌더링
 */
export default function MyeongsimDocentAvatar({
    ohaeng = 'wood',
    size = 'md',
    showTitle = false,
    className = ''
}: MyeongsimDocentAvatarProps) {
    const normalizedOhaeng = (ohaeng?.toLowerCase() || 'wood') as OhaengType;

    // 장인 손끝 디자인의 5대 동화 캐릭터 컨셉
    const avatarSpecs: Record<OhaengType, {
        name: string;
        title: string;
        quote: string;
        gradient: string;
        borderColor: string;
        glowColor: string;
        icon: React.ReactNode;
        bgSvg: React.ReactNode;
    }> = {
        wood: {
            name: "숲의 파수꾼 '솔아'",
            title: "영원한 생명력을 품은 서정의 수호자",
            quote: "모든 시련은 당신이라는 유일한 나무가 깊게 뿌리내리는 과정입니다.",
            gradient: "from-[#0F382C] via-[#1B5E4B] to-[#0A261D]",
            borderColor: "border-emerald-400/40",
            glowColor: "rgba(52, 211, 153, 0.35)",
            icon: <Feather className="w-1/2 h-1/2 text-emerald-300 drop-shadow-[0_2px_8px_rgba(52,211,153,0.8)]" />,
            bgSvg: (
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="url(#woodGrad)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
                    <path d="M50 15 Q65 40 50 85 Q35 40 50 15 Z" fill="url(#woodGrad)" opacity="0.4" />
                    <defs>
                        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                    </defs>
                </svg>
            )
        },
        fire: {
            name: "태양의 등불 '아란'",
            title: "따뜻한 온기로 영혼을 감싸는 빛의 파수꾼",
            quote: "당신의 가슴속 붉은 온도는 세상을 가장 아름답게 밝히는 등불입니다.",
            gradient: "from-[#4A151B] via-[#7F1D1D] to-[#2A080C]",
            borderColor: "border-rose-400/40",
            glowColor: "rgba(251, 113, 133, 0.35)",
            icon: <Sun className="w-1/2 h-1/2 text-rose-300 drop-shadow-[0_2px_8px_rgba(251,113,133,0.8)]" />,
            bgSvg: (
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                    <polygon points="50,12 62,38 90,50 62,62 50,88 38,62 10,50 38,38" fill="url(#fireGrad)" opacity="0.35" />
                    <circle cx="50" cy="50" r="25" stroke="#F43F5E" strokeWidth="1" fill="none" />
                    <defs>
                        <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FB7185" />
                            <stop offset="100%" stopColor="#E11D48" />
                        </linearGradient>
                    </defs>
                </svg>
            )
        },
        earth: {
            name: "대지의 오아시스 '다온'",
            title: "모든 불안을 안아주는 황금 오아시스",
            quote: "흔들려도 괜찮습니다. 대지는 언제나 당신의 발밑을 단단히 지켜주고 있으니까요.",
            gradient: "from-[#3B260F] via-[#784617] to-[#1F1206]",
            borderColor: "border-amber-400/40",
            glowColor: "rgba(251, 191, 36, 0.35)",
            icon: <Heart className="w-1/2 h-1/2 text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />,
            bgSvg: (
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                    <rect x="20" y="20" width="60" height="60" rx="15" stroke="url(#earthGrad)" strokeWidth="1.5" fill="none" transform="rotate(45 50 50)" />
                    <defs>
                        <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                    </defs>
                </svg>
            )
        },
        metal: {
            name: "달빛 나침반 '은율'",
            title: "선명한 통찰과 결단을 벼리는 달빛 아키텍트",
            quote: "가장 맑은 거울은 깊은 고요 속에서 자신의 참모습을 비추어냅니다.",
            gradient: "from-[#1A2332] via-[#2D3A4F] to-[#0D131D]",
            borderColor: "border-cyan-300/40",
            glowColor: "rgba(103, 232, 249, 0.35)",
            icon: <Moon className="w-1/2 h-1/2 text-cyan-200 drop-shadow-[0_2px_8px_rgba(103,232,249,0.8)]" />,
            bgSvg: (
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" stroke="url(#metalGrad)" strokeWidth="1.5" fill="none" />
                    <path d="M50 15 L50 85 M15 50 L85 50" stroke="#67E8F9" strokeWidth="0.8" opacity="0.6" />
                    <defs>
                        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#67E8F9" />
                            <stop offset="100%" stopColor="#0284C7" />
                        </linearGradient>
                    </defs>
                </svg>
            )
        },
        water: {
            name: "깊은 심해의 항해자 '모람'",
            title: "지혜의 깊은 호수를 항해하는 유연한 영혼",
            quote: "바다는 어떠한 그릇에도 자신을 담을 수 있는 세상에서 가장 유연한 지혜를 가졌습니다.",
            gradient: "from-[#0F1B38] via-[#1E3A8A] to-[#070D1E]",
            borderColor: "border-indigo-400/40",
            glowColor: "rgba(129, 140, 248, 0.35)",
            icon: <Compass className="w-1/2 h-1/2 text-indigo-300 drop-shadow-[0_2px_8px_rgba(129,140,248,0.8)]" />,
            bgSvg: (
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                    <path d="M10 50 Q 25 30, 50 50 T 90 50 T 130 50" fill="none" stroke="url(#waterGrad)" strokeWidth="1.5" />
                    <path d="M10 65 Q 25 45, 50 65 T 90 65 T 130 65" fill="none" stroke="url(#waterGrad)" strokeWidth="1" opacity="0.5" />
                    <defs>
                        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#818CF8" />
                            <stop offset="100%" stopColor="#4F46E5" />
                        </linearGradient>
                    </defs>
                </svg>
            )
        }
    };

    const spec = avatarSpecs[normalizedOhaeng] || avatarSpecs.wood;

    // Size Classes
    const sizeMap = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-base',
        xl: 'w-20 h-20 text-xl'
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Master Avatar Frame */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className={`relative rounded-full bg-gradient-to-br ${spec.gradient} border ${spec.borderColor} flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden shadow-xl ${sizeMap[size]}`}
                style={{
                    boxShadow: `0 0 20px ${spec.glowColor}, inset 0 0 12px rgba(255, 255, 255, 0.15)`
                }}
            >
                {/* SVG Artistic Background Pattern */}
                {spec.bgSvg}

                {/* Sparkling Aura Effect */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
                />

                {/* Handcrafted Center Symbol Icon */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                    {spec.icon}
                </div>

                {/* Fairy-tale Star Badge */}
                <div className="absolute top-0 right-0 bg-amber-400 text-gray-950 p-0.5 rounded-full border border-black shadow-sm">
                    <Sparkles className="w-2.5 h-2.5 fill-amber-400" />
                </div>
            </motion.div>

            {/* Optional Title Badge (For Header & Profile) */}
            {showTitle && (
                <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-white tracking-tight">{spec.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                            명심 AI 코치
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-light mt-0.5 line-clamp-1">
                        {spec.title}
                    </p>
                </div>
            )}
        </div>
    );
}
