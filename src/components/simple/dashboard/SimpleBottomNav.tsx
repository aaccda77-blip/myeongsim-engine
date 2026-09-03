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

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0e1624]/95 border-t border-white/10 backdrop-blur-xl max-w-md mx-auto py-1 px-4">
            <div className="flex items-center justify-around">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer min-w-[56px] ${
                            activeTab === tab.id
                                ? 'text-amber-400 font-black scale-105'
                                : 'text-gray-400 hover:text-white font-medium'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span className="text-[10px] tracking-tight">{tab.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
