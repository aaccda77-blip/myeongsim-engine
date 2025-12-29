import React from 'react';
import { motion } from 'framer-motion';

// Five Elements Color Mapping
const ELEMENT_COLORS: Record<string, { bg: string, text: string, border: string }> = {
    'wood': { bg: 'bg-green-900/40', text: 'text-green-400', border: 'border-green-700/50' },
    'fire': { bg: 'bg-red-900/40', text: 'text-red-400', border: 'border-red-700/50' },
    'earth': { bg: 'bg-yellow-900/40', text: 'text-yellow-400', border: 'border-yellow-700/50' },
    'metal': { bg: 'bg-gray-800/80', text: 'text-gray-300', border: 'border-gray-600/50' },
    'water': { bg: 'bg-blue-900/40', text: 'text-cyan-400', border: 'border-blue-700/50' },
};

// Zodiac Icons
const ZODIAC_ICONS: Record<string, string> = {
    '자': '🐭', '축': '🐮', '인': '🐯', '묘': '🐰',
    '진': '🐉', '사': '🐍', '오': '🐴', '미': '🐑',
    '신': '🐵', '유': '🐔', '술': '🐕', '해': '🐷'
};

interface PillarData {
    gan: string; // Heavenly Stem (e.g., "갑")
    ji: string;  // Earthly Branch (e.g., "인")
    gan_element: string; // wood, fire, etc.
    ji_element: string;
    ten_god_gan: string; // e.g., "비견"
    ten_god_ji: string;  // e.g., "편관"
}

interface SajuMatrixProps {
    pillars: {
        year: PillarData;
        month: PillarData;
        day: PillarData;
        hour: PillarData;
    };
}

// [Fix] Strict Character-to-Element Mapping
const getSajuElement = (char: string): string => {
    const map: Record<string, string> = {
        '갑': 'wood', '을': 'wood', '인': 'wood', '묘': 'wood',
        '병': 'fire', '정': 'fire', '사': 'fire', '오': 'fire',
        '무': 'earth', '기': 'earth', '진': 'earth', '술': 'earth', '축': 'earth', '미': 'earth',
        '경': 'metal', '신': 'metal', '유': 'metal', '신(申)': 'metal', // 신(monkey) distinction might be needed if char is ambiguous, but usually context or unique char used
        '임': 'water', '계': 'water', '해': 'water', '자': 'water',
    };
    // Handle Hanja/Hangul ambiguity if necessary, but assuming Chat returns Hangul
    return map[char] || 'earth'; // Default to earth if unknown
};

const PillarColumn = ({ label, data }: { label: string, data: PillarData }) => {
    // [Fix] Derive element purely from the character to prevent AI color hallucination
    const derivedGanElement = getSajuElement(data.gan);
    const derivedJiElement = getSajuElement(data.ji);

    const ganColor = ELEMENT_COLORS[derivedGanElement] || ELEMENT_COLORS['earth'];
    const jiColor = ELEMENT_COLORS[derivedJiElement] || ELEMENT_COLORS['earth'];

    return (
        <div className="flex flex-col items-center gap-2">
            {/* [Fix] Fixed height label container to align all pillars perfectly */}
            <div className="h-5 flex items-end">
                <span className="text-[10px] text-gray-500 tracking-widest uppercase text-center leading-none">{label}</span>
            </div>

            {/* Heavenly Stem */}
            <div className={`w-14 h-14 shrink-0 rounded-lg flex flex-col items-center justify-center border ${ganColor.bg} ${ganColor.border} relative overflow-hidden group shadow-sm`}>
                <span className={`text-[8px] absolute top-1 ${ganColor.text} opacity-70`}>{data.ten_god_gan}</span>
                <span className={`text-2xl font-serif font-bold ${ganColor.text} z-10 leading-none mt-1`}>{data.gan}</span>
                <div className={`absolute inset-0 bg-current opacity-5 group-hover:opacity-10 transition-opacity ${ganColor.text}`} />
            </div>

            {/* Earthly Branch */}
            <div className={`w-14 h-14 shrink-0 rounded-lg flex flex-col items-center justify-center border ${jiColor.bg} ${jiColor.border} relative overflow-hidden group shadow-sm`}>
                <span className={`text-[8px] absolute top-1 ${jiColor.text} opacity-70`}>{data.ten_god_ji}</span>
                <span className={`text-xl font-serif font-bold ${jiColor.text} z-10 flex items-center gap-1 leading-none mt-1`}>
                    {data.ji}
                    <span className="text-[10px] opacity-80">{ZODIAC_ICONS[data.ji]}</span>
                </span>
                <div className={`absolute inset-0 bg-current opacity-5 group-hover:opacity-10 transition-opacity ${jiColor.text}`} />
            </div>
        </div>
    );
};

export const SajuMatrixCard: React.FC<SajuMatrixProps> = ({ pillars }) => {
    // Layout: Hour - Day - Month - Year (Left to Right visually corresponds to traditional Right-to-Left reading)
    // Actually user asked "Right side = Year", so visual order L->R should be: [Hour] [Day] [Month] [Year]

    return (
        <div className="w-full bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 p-4 mb-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                    🔮 사주 원국 (Four Pillars)
                </h3>
                <span className="text-[10px] text-gray-600 bg-gray-900/50 px-2 py-1 rounded">Visual Matrix</span>
            </div>

            <div className="flex justify-between items-start gap-1">
                <PillarColumn label="시주 (Hour)" data={pillars.hour} />
                <PillarColumn label="일주 (Day)" data={pillars.day} />
                <PillarColumn label="월주 (Month)" data={pillars.month} />
                <PillarColumn label="연주 (Year)" data={pillars.year} />
            </div>

            <div className="mt-4 flex justify-center gap-3 text-[10px] text-gray-500">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500/50"></div>목(Wood)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500/50"></div>화(Fire)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>토(Earth)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400/50"></div>금(Metal)</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500/50"></div>수(Water)</div>
            </div>
        </div>
    );
};
