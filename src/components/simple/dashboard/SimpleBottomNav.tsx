'use client';

import React from 'react';
import { Home, MessageSquare, FileText, Menu } from 'lucide-react';

interface SimpleBottomNavProps {
    activeTab: 'home' | 'coaching' | 'report' | 'all';
    onTabChange: (tab: 'home' | 'coaching' | 'report' | 'all') => void;
}

export function SimpleBottomNav({ activeTab, onTabChange }: SimpleBottomNavProps) {
    const tabs = [
        { id: 'home', label: '홈', icon: <Home size={18} /> },
        { id: 'coaching', label: '코칭', icon: <MessageSquare size={18} /> },
        { id: 'report', label: '리포트', icon: <FileText size={18} /> },
        { id: 'all', label: '전체', icon: <Menu size={18} /> }
    ] as const;

    const handleTabClick = (tabId: 'home' | 'coaching' | 'report' | 'all') => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
        onTabChange(tabId);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c1422]/95 border-t border-white/10 backdrop-blur-2xl max-w-md mx-auto pt-1.5 pb-[max(10px,env(safe-area-inset-bottom))] px-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleTabClick(tab.id)}
                            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer min-w-[60px] relative ${
                                isActive
                                    ? 'text-amber-400 font-black scale-105'
                                    : 'text-gray-400 hover:text-white font-medium'
                            }`}
                        >
                            {/* 활성 탭 상단 네온 인디케이터 바 */}
                            {isActive && (
                                <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                            )}
                            <span className={isActive ? 'drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : ''}>
                                {tab.icon}
                            </span>
                            <span className="text-[10px] tracking-tight">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
