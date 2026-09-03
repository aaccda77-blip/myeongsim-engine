'use client';

import React from 'react';
import { ViewModeSwitcher } from '../ViewModeSwitcher';
import { User, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SimpleHeaderProps {
    userName: string;
    onOpenProfile?: () => void;
}

export function SimpleHeader({ userName, onOpenProfile }: SimpleHeaderProps) {
    const router = useRouter();

    return (
        <header className="flex items-center justify-between pb-2 pt-1">
            <div className="space-y-0.5 text-left">
                <h1 className="text-xl sm:text-2xl font-black text-[#F4F6F8] tracking-tight">
                    안녕하세요, {userName}님
                </h1>
                <p className="text-xs sm:text-sm text-[#9AA7B7] font-medium">
                    오늘의 나를 차분히 확인해보세요.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <ViewModeSwitcher />
                <button
                    onClick={() => router.push('/settings')}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-all border border-white/10"
                    title="프로필 및 설정"
                >
                    <User size={16} />
                </button>
            </div>
        </header>
    );
}
