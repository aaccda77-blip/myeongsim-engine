"use client";

import React from 'react';

// Color Mapping
const COLOR_MAP: Record<string, string> = {
    'green': '#10B981', // Wood
    'red': '#EF4444',   // Fire
    'yellow': '#F59E0B',// Earth
    'white': '#9CA3AF', // Metal (Grayish white for visibility)
    'black': '#3B82F6'  // Water (Blue representation for black)
};

// Mock Data structure for visual grid (since real calculation is complex to pass atm)
// In real app, props would be { pillars: FourPillarsData } from SajuCalculator
interface PillarProps {
    gan: { char: string; color: string; label: string };
    ji: { char: string; color: string; label: string };
    tenGods: { gan: string; ji: string };
    label: string; // "Year", "Month" ...
}

const PillarCard = ({ gan, ji, tenGods, label }: PillarProps) => (
    <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-2xl border border-white/10 items-center min-w-[70px]">
        <span className="text-gray-400 text-xs font-bold uppercase">{label}</span>

        {/* Gan (Stem) */}
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg mb-1"
            style={{ backgroundColor: gan.color }}
        >
            {gan.char}
        </div>
        <span className="text-[10px] text-gray-300">{tenGods.gan}</span>

        {/* Ji (Branch) */}
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg mb-1"
            style={{ backgroundColor: ji.color }}
        >
            {ji.char}
        </div>
        <span className="text-[10px] text-gray-300">{tenGods.ji}</span>
    </div>
);

interface SajuVisualGridProps {
    userProfile?: any;
}

export default function SajuVisualGrid({ userProfile }: SajuVisualGridProps) {
    // [Saju 연동] Extract pillars from userProfile or use fallback demo data
    const pillars = userProfile?.saju?.pillars;

    const data = pillars ? [
        {
            label: "Hour",
            gan: { char: pillars.hour?.stem || '?', color: getElementColor(pillars.hour?.stemElement), label: pillars.hour?.stemElement || '' },
            ji: { char: pillars.hour?.branch || '?', color: getElementColor(pillars.hour?.branchElement), label: pillars.hour?.branchElement || '' },
            tenGods: { gan: pillars.hour?.stemTenGod || '', ji: pillars.hour?.branchTenGod || '' }
        },
        {
            label: "Day",
            gan: { char: pillars.day?.stem || '?', color: getElementColor(pillars.day?.stemElement), label: pillars.day?.stemElement || '' },
            ji: { char: pillars.day?.branch || '?', color: getElementColor(pillars.day?.branchElement), label: pillars.day?.branchElement || '' },
            tenGods: { gan: '본원', ji: pillars.day?.branchTenGod || '' }
        },
        {
            label: "Month",
            gan: { char: pillars.month?.stem || '?', color: getElementColor(pillars.month?.stemElement), label: pillars.month?.stemElement || '' },
            ji: { char: pillars.month?.branch || '?', color: getElementColor(pillars.month?.branchElement), label: pillars.month?.branchElement || '' },
            tenGods: { gan: pillars.month?.stemTenGod || '', ji: pillars.month?.branchTenGod || '' }
        },
        {
            label: "Year",
            gan: { char: pillars.year?.stem || '?', color: getElementColor(pillars.year?.stemElement), label: pillars.year?.stemElement || '' },
            ji: { char: pillars.year?.branch || '?', color: getElementColor(pillars.year?.branchElement), label: pillars.year?.branchElement || '' },
            tenGods: { gan: pillars.year?.stemTenGod || '', ji: pillars.year?.branchTenGod || '' }
        }
    ] : [
        // Fallback demo data
        {
            label: "Hour",
            gan: { char: '정', color: '#EF4444', label: '화' },
            ji: { char: '미', color: '#F59E0B', label: '토' },
            tenGods: { gan: '식신', ji: '편재' }
        },
        {
            label: "Day",
            gan: { char: '을', color: '#10B981', label: '목' },
            ji: { char: '축', color: '#F59E0B', label: '토' },
            tenGods: { gan: '본원', ji: '편재' }
        },
        {
            label: "Month",
            gan: { char: '병', color: '#EF4444', label: '화' },
            ji: { char: '인', color: '#10B981', label: '목' },
            tenGods: { gan: '상관', ji: '겁재' }
        },
        {
            label: "Year",
            gan: { char: '갑', color: '#10B981', label: '목' },
            ji: { char: '자', color: '#3B82F6', label: '수' },
            tenGods: { gan: '겁재', ji: '편인' }
        }
    ];

    // Helper to get color from element name
    function getElementColor(element: string | undefined): string {
        const colorMap: Record<string, string> = {
            '목': '#10B981', 'wood': '#10B981',
            '화': '#EF4444', 'fire': '#EF4444',
            '토': '#F59E0B', 'earth': '#F59E0B',
            '금': '#9CA3AF', 'metal': '#9CA3AF',
            '수': '#3B82F6', 'water': '#3B82F6'
        };
        return colorMap[element || ''] || '#6B7280';
    }

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex justify-between gap-2 min-w-max px-2">
                {/* Standard Right-to-Left order for Saju? No, app usually Left-to-Right Year->Hour or Right-to-Left? 
                   Traditional is Year (Right) -> Hour (Left). 
                   Images show Year on Right. Let's reverse the array or render specifically.
                   Image 1: Hour (Left) ... Year (Right). 
                */}
                {data.map((p, i) => <PillarCard key={i} {...p} />)}
            </div>

            <div className="mt-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-sm text-gray-300">
                    <span className="text-green-400 font-bold">오행 분석:</span> 목2 화2 토2 금0 수2
                </p>
                <div className="flex h-2 w-full mt-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 w-[25%]" />
                    <div className="bg-red-500 w-[25%]" />
                    <div className="bg-yellow-500 w-[25%]" />
                    <div className="bg-gray-400 w-[0%]" />
                    <div className="bg-blue-500 w-[25%]" />
                </div>
            </div>
        </div>
    );
}
