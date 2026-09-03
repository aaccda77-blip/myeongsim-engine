'use client';

import React from 'react';
import { SimpleCard } from '../design-system/SimpleCard';
import { SimpleButton } from '../design-system/SimpleButton';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SimpleCoachingCardProps {
    question: string;
    actionText: string;
    prompt: string;
}

export function SimpleCoachingCard({
    question,
    actionText,
    prompt
}: SimpleCoachingCardProps) {
    const router = useRouter();

    const handleStartCoaching = () => {
        router.push('/myeongsim-chat');
    };

    return (
        <SimpleCard className="space-y-3.5 bg-gradient-to-br from-[#121e33] to-[#0f1726]">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9AA7B7] flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-[#18C5D9]" />
                    <span>오늘의 코칭 질문</span>
                </span>
            </div>

            <p className="text-sm sm:text-base font-bold text-[#F4F6F8] leading-relaxed">
                “{question}”
            </p>

            <SimpleButton
                onClick={handleStartCoaching}
                variant="primary"
                size="md"
                className="w-full justify-between"
            >
                <span>{actionText}</span>
                <ArrowRight size={14} />
            </SimpleButton>
        </SimpleCard>
    );
}
