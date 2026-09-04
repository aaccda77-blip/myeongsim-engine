'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AwarenessQuestDashboard from '@/components/coaching/AwarenessQuestDashboard';

export default function AwarenessQuestPage() {
    const router = useRouter();

    const handleStartChatCoaching = (prompt: string, intent?: string) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('myeongsim_pending_prompt', prompt);
            if (intent) sessionStorage.setItem('myeongsim_pending_intent', intent);
        }
        router.push('/report');
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <AwarenessQuestDashboard
                isOpen={true}
                onClose={() => router.push('/report')}
                onStartChatCoaching={handleStartChatCoaching}
                initialPhaseId="all"
            />
        </main>
    );
}
