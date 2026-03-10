'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, BookOpen } from 'lucide-react';
import { UserSoulProfile } from '@/types/akashic_records';

interface MindTotemButtonProps {
    targetId?: string; // Legacy support
    content?: string;  // Chat content for PDF
    profile?: UserSoulProfile;
    label?: string;
    tier?: 'DELUXE' | 'PREMIUM';
}

export default function MindTotemButton({
    targetId,
    content,
    profile,
    label = "마인드 토템 리포트 열기",
    tier = 'DELUXE'
}: MindTotemButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');
    const router = useRouter();

    const generatePremiumReport = async (): Promise<any> => {
        setStatus('AI가 당신의 영혼을 기록하는 중... (약 20초)');

        const response = await fetch('/api/report/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profile: {
                    name: (profile as any)?.name || '회원',
                    birthDate: (profile as any)?.nativity?.birth_date || '',
                    birthTime: (profile as any)?.nativity?.birth_time || '',
                    gender: (profile as any)?.nativity?.gender || 'male',
                    dayMaster: (profile as any)?.nativity?.dayMaster || '',
                },
                tier: 'PREMIUM',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '리포트 생성 실패');
        }

        const data = await response.json();
        return data; // Returns JSON object with 'content' and 'parsed' logic
    };

    const handleClick = async () => {
        setIsProcessing(true);
        setStatus('');

        try {
            let reportPayload: any = {
                profile: profile,
                timestamp: new Date().toISOString(),
                content: {},
                chatHistory: [] // Add chat history
            };

            // For Premium tier, generate deep analysis
            if (tier === 'PREMIUM') {
                const apiResult = await generatePremiumReport();
                reportPayload.content = {
                    full_text: apiResult.content,
                    saju_analysis: apiResult.content,
                    action_now: "지금 바로 심호흡 3번을 하세요.",
                    action_today: "오늘 하늘을 한 번 올려다보세요.",
                    action_week: "이번 주는 나를 위한 차 한잔의 여유를 가지세요."
                };
            } else {
                // Deluxe (Legacy) - Just pass chat content
                reportPayload.content = {
                    saju_analysis: content || "대화 내용이 없습니다."
                };
            }

            // [NEW] Store the content passed from ChatInterface as well
            if (content) {
                reportPayload.content.saju_analysis = content;
            }

            // [Storage Strategy] Save to LocalStorage
            localStorage.setItem('mind_totem_report_data', JSON.stringify(reportPayload));

            // Navigate
            setStatus('비밀의 서재로 이동합니다...');
            await new Promise(resolve => setTimeout(resolve, 800));
            router.push(`/report/view/${Date.now()}`);

        } catch (error: any) {
            console.error("Report Error:", error);
            alert(`리포트 생성 중 오류: ${error.message || error}`);
        } finally {
            setIsProcessing(false);
            setStatus('');
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isProcessing}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group disabled:opacity-70 disabled:cursor-wait text-white border ${tier === 'PREMIUM'
                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#5A3FD4] border-[#9F85FF]'
                : 'bg-gradient-to-r from-[#9F85FF] to-[#7C5CFF] border-[#C4B5FD]'
                }`}
        >
            {isProcessing ? (
                <>
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                    <span className="text-sm font-medium">
                        {status || '처리 중...'}
                    </span>
                </>
            ) : (
                <>
                    <BookOpen className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-bold">
                        {tier === 'PREMIUM' ? '📚 마인드 토템 리포트 열기 (Web)' : label}
                    </span>
                    <Sparkles className="w-4 h-4 text-blue-100 group-hover:text-white transition-colors" />
                </>
            )}
        </button>
    );
}

