// src/components/UserStatusHUD.tsx
'use client';

import React from 'react';
import { User, Clock, Sparkles } from 'lucide-react';

interface UserStatus {
    isLoggedIn: boolean;
    hasActivePass: boolean;
    remainingCredits: number;
    userName: string;
}

interface UserStatusHUDProps {
    userStatus: UserStatus;
}

export const UserStatusHUD = ({ userStatus }: UserStatusHUDProps) => {
    if (!userStatus.isLoggedIn) {
        return null; // Don't show anything if not logged in
    }

    return (
        <div className="fixed top-4 right-20 z-40 flex items-center gap-3">
            {/* User Info */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full text-sm">
                <User size={14} className="text-slate-400" />
                <span className="text-slate-300 font-medium">{userStatus.userName}</span>
            </div>

            {/* Pass Status */}
            {userStatus.hasActivePass ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/50 rounded-full text-sm">
                    <Sparkles size={14} className="text-emerald-400" />
                    <span className="text-emerald-300 font-bold">이용권 활성</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 backdrop-blur-md border border-red-500/50 rounded-full text-sm">
                    <Clock size={14} className="text-red-400" />
                    <span className="text-red-300 font-bold">이용권 만료</span>
                </div>
            )}
        </div>
    );
};

export default UserStatusHUD;
