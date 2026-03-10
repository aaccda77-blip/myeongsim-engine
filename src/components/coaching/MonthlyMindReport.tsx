"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * [MODULE] 월간 명심 리포트 — 나의 마음 변화 리포트
 * - coaching_logs 테이블에서 데이터를 자동으로 읽어 시각화
 * - 기존 챗봇 시스템 영향 0 (순수 View Component)
 */

interface CoachingLog {
    id: string;
    created_at: string;
    pillar_type: string;
    pillar_id: string;
    base_code: string;
    start_state: string;
    end_state: string;
    code_name: string;
    scan_input: string | null;
    sync_input: string | null;
    shift_input: string | null;
    completed: boolean;
    session_duration_ms: number | null;
}

// ============== Color Config ==============
const STATE_COLORS: Record<string, { bg: string; text: string; label: string; icon: string }> = {
    dark: { bg: 'bg-red-500', text: 'text-red-400', label: '다크 코드', icon: '⚠️' },
    neural: { bg: 'bg-emerald-500', text: 'text-emerald-400', label: '뉴럴 코드', icon: '✨' },
    meta: { bg: 'bg-purple-500', text: 'text-purple-400', label: '메타 코드', icon: '👑' },
};

export default function MonthlyMindReport() {
    const [logs, setLogs] = useState<CoachingLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const today = new Date();
    const monthName = `${today.getFullYear()}년 ${today.getMonth() + 1}월`;

    useEffect(() => {
        const fetchLogs = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            // 이번 달 시작~끝
            const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
            const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

            const { data, error } = await supabase
                .from('coaching_logs')
                .select('*')
                .eq('user_id', user.id)
                .gte('created_at', start)
                .lte('created_at', end)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ [Report] Fetch error:', error.message);
            } else {
                setLogs(data || []);
            }
            setLoading(false);
        };
        if (isOpen) fetchLogs();
    }, [isOpen]);

    // ============== 통계 계산 ==============
    const totalSessions = logs.length;
    const darkStarts = logs.filter(l => l.start_state === 'dark').length;
    const neuralShifts = logs.filter(l => l.end_state === 'neural').length;
    const metaShifts = logs.filter(l => l.end_state === 'meta').length;

    const darkPercent = totalSessions > 0 ? Math.round((darkStarts / totalSessions) * 100) : 0;
    const neuralPercent = totalSessions > 0 ? Math.round((neuralShifts / totalSessions) * 100) : 0;
    const metaPercent = totalSessions > 0 ? Math.round((metaShifts / totalSessions) * 100) : 0;

    // 가장 많이 켜진 코드
    const codeFrequency: Record<string, number> = {};
    logs.forEach(l => {
        const key = `${l.pillar_type}: ${l.code_name}`;
        codeFrequency[key] = (codeFrequency[key] || 0) + 1;
    });
    const topCode = Object.entries(codeFrequency).sort((a, b) => b[1] - a[1])[0];

    // Shift 입력 아카이브 (내가 나에게 건넨 문장들)
    const shiftArchives = logs
        .filter(l => l.shift_input && l.shift_input.trim().length > 0)
        .map(l => ({
            date: new Date(l.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
            text: l.shift_input!,
            pillar: l.pillar_type,
            state: l.start_state,
        }));

    // Summary message
    const summaryText = totalSessions === 0
        ? "아직 이번 달 코칭 기록이 없습니다. 기질 설계도에서 카드를 터치해 첫 코칭을 시작해보세요!"
        : `이번 달, 당신은 총 ${totalSessions}번의 셀프 코칭을 진행했습니다. ${neuralShifts + metaShifts}번의 상태 전환(Shift)에 성공했으며, 내면의 관찰자가 점점 깨어나고 있습니다.`;

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-base hover:from-violet-600 hover:to-purple-700 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] flex justify-center items-center gap-2 group"
            >
                <span>📊</span>
                <span>월간 명심 리포트 보기</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">

            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-400">
                        📊 {monthName}, 당신이 당신을 안아준 시간들
                    </h2>
                    <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-sm">닫기</button>
                </div>
                <p className="text-slate-500 text-xs tracking-widest mb-4">MONTHLY MIND REPORT</p>

                {/* Summary */}
                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
                    <p className="text-indigo-200 text-sm leading-relaxed">{summaryText}</p>
                </div>
            </div>

            {loading ? (
                <div className="px-6 pb-6 text-center">
                    <p className="text-slate-500 text-sm animate-pulse">데이터를 불러오는 중...</p>
                </div>
            ) : totalSessions > 0 ? (
                <>
                    {/* 전환 온도계 (Donut-style bar) */}
                    <div className="px-6 pb-4">
                        <h3 className="text-sm font-bold text-slate-300 mb-3">🌡️ 상태 전환율</h3>
                        <div className="flex gap-2 h-4 rounded-full overflow-hidden bg-slate-700/50">
                            {darkPercent > 0 && <div className="bg-red-500/80 transition-all" style={{ width: `${darkPercent}%` }} />}
                            {neuralPercent > 0 && <div className="bg-emerald-500/80 transition-all" style={{ width: `${neuralPercent}%` }} />}
                            {metaPercent > 0 && <div className="bg-purple-500/80 transition-all" style={{ width: `${metaPercent}%` }} />}
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                            <span className="text-red-400">⚠️ 다크 {darkPercent}%</span>
                            <span className="text-emerald-400">✨ 뉴럴 {neuralPercent}%</span>
                            <span className="text-purple-400">👑 메타 {metaPercent}%</span>
                        </div>
                    </div>

                    {/* 이달의 주파수 */}
                    {topCode && (
                        <div className="px-6 pb-4">
                            <div className="bg-amber-900/15 border border-amber-500/20 rounded-xl p-4">
                                <p className="text-amber-200 text-sm leading-relaxed">
                                    🔔 이번 달 가장 많이 작동한 코드: <strong>{topCode[0]}</strong> (총 {topCode[1]}회)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 핵심 아카이브: 내가 나에게 건넨 문장들 */}
                    {shiftArchives.length > 0 && (
                        <div className="px-6 pb-4">
                            <h3 className="text-sm font-bold text-slate-300 mb-3">💌 내가 나에게 건넨 문장들</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {shiftArchives.map((archive, i) => {
                                    const stateConfig = STATE_COLORS[archive.state] || STATE_COLORS.dark;
                                    return (
                                        <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-slate-500 text-xs">{archive.date}</span>
                                                <span className="text-slate-600">·</span>
                                                <span className={`text-xs ${stateConfig.text}`}>{archive.pillar}</span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed italic">
                                                "{archive.text}"
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 코치의 코멘트 */}
                    <div className="px-6 pb-4">
                        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-4 border border-indigo-500/20">
                            <p className="text-slate-400 text-xs leading-relaxed text-center italic">
                                🧠 "당신을 가장 완벽하게 치유할 수 있는 명의는, 바로 당신 안에 있는 '관찰자'입니다."
                            </p>
                        </div>
                    </div>
                </>
            ) : null}

            {/* CTA 버튼 */}
            <div className="px-6 pb-6">
                <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg"
                >
                    🧠 다음 달의 뉴럴 코드 세팅하기
                </button>
            </div>
        </div>
    );
}
