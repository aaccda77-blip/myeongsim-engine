"use client";

import React, { useState } from 'react';
import { CodeData } from '@/components/chat/MultiDimensionalBlueprint';

/**
 * [MODULE] 오늘의 뉴럴 코드 액션 플랜
 * - 기존 챗봇 시스템 영향 0 (순수 View Component)
 * - MultiDimensionalBlueprint의 CodeData를 그대로 사용
 * - 게이미피케이션: 미션 완료 체크, 레벨 프로그레스
 */

// ============== 미션 데이터 (4 기둥별 액션 플랜) ==============
interface MissionData {
    pillarId: string;
    icon: string;
    pillarLabel: string;
    codeName: string;
    missionTitle: string;
    actionPlan: string;
    eveningCheckin: string;
}

function generateMissions(data: CodeData[]): MissionData[] {
    // Map each pillar to a specific mission based on the neural code
    return data.map((item) => {
        const pillarIcon = item.title.match(/^([\u{2600}-\u{FFFF}])/u)?.[0] || '🧠';
        const labelMatch = item.title.match(/^.+?[:：]\s*(.+?)[\s(]/);
        const pillarLabel = labelMatch ? labelMatch[1] : item.title;
        const neuralName = item.neuralCode.name.replace(/[\[\]]/g, '');

        // Generate contextual missions based on neural code keywords
        let missionTitle = '';
        let actionPlan = '';
        let eveningCheckin = '';

        if (item.id === 'vision') {
            missionTitle = '플랜 B의 마법, 기꺼이 궤도 수정하기';
            actionPlan = '오늘 예상치 못한 변수나 계획의 틀어짐을 마주했을 때, 짜증을 내는 대신 "오히려 좋아, 더 나은 결실을 위한 세팅이야"라고 소리 내어 말해보세요. 그리고 즉시 대안(플랜 B)을 기획하여 실행에 옮기세요.';
            eveningCheckin = '상황에 꺾이지 않고 유연하게 물 흐르듯 대처한 오늘, 나는 어떤 새로운 결과를 손에 쥐었나요?';
        } else if (item.id === 'identity') {
            missionTitle = '따뜻한 메스, 품격 있는 피드백 건네기';
            actionPlan = '오늘 타인의 업무나 상황에서 개선점을 발견했다면, 날카로운 지적을 잠시 멈추세요. 이성적이고 예리한 분석에 상대를 향한 진심 어린 응원 한 스푼(열정)을 더해, 가장 우아하고 세련된 언어로 피드백을 건네보세요.';
            eveningCheckin = '나의 따뜻하고 날카로운 조언을 받은 상대방의 눈빛은 어떻게 변했나요? 그 순간 나의 리더십은 얼마나 더 빛났나요?';
        } else if (item.id === 'social') {
            missionTitle = '1도의 틈새, 익숙한 무대 살짝 비틀기';
            actionPlan = '오늘 반복되는 지루한 일상이나 정체된 회의 속에서, 분위기를 전환할 아주 작은 아이디어(1도의 변화) 하나를 제안해 보세요. 거창하지 않아도 좋습니다. 환경에 생명력을 불어넣는 촉촉한 기획을 현실 무대에 올려보세요.';
            eveningCheckin = '나의 작은 아이디어가 굳어있던 사람들과 상황을 어떻게 유연하게 움직였나요? 그 무대를 기획한 전략가로서 어떤 성취감이 드나요?';
        } else if (item.id === 'base') {
            missionTitle = '결단의 마침표, 뒤돌아보지 않고 전진하기';
            actionPlan = '그동안 눈치 보거나 망설이느라 미뤄두었던 결정 한 가지를 오늘 단호하게 내리세요. 타협하지 않는 뚝심으로 "이 방향이 맞다"고 선언하고, 조직이나 주변 사람들을 이끌고 강력하게 첫발을 내디뎌 보세요.';
            eveningCheckin = '내가 흔들림 없이 앞장섰을 때, 내 뒤를 따르는 사람들에게서 어떤 안정감과 에너지를 느꼈나요?';
        } else {
            // Fallback for dynamic data
            missionTitle = `${neuralName} 에너지 활성화하기`;
            actionPlan = `오늘 하루, ${item.neuralCode.desc.replace(/\.$/, '')}의 에너지를 의식적으로 발현해 보세요. 일상의 작은 순간에서 이 코드가 어떻게 작동하는지 관찰하세요.`;
            eveningCheckin = `${neuralName} 코드가 활성화된 오늘, 내가 경험한 가장 의미 있는 순간은 무엇이었나요?`;
        }

        return {
            pillarId: item.id,
            icon: pillarIcon,
            pillarLabel,
            codeName: neuralName,
            missionTitle,
            actionPlan,
            eveningCheckin,
        };
    });
}

// ============== Color Config ==============
const PILLAR_COLORS: Record<string, { gradient: string; border: string; bg: string; text: string; glow: string }> = {
    vision: { gradient: 'from-emerald-500 to-teal-600', border: 'border-emerald-500/30', bg: 'bg-emerald-900/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    identity: { gradient: 'from-violet-500 to-purple-600', border: 'border-violet-500/30', bg: 'bg-violet-900/20', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
    social: { gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-500/30', bg: 'bg-blue-900/20', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    base: { gradient: 'from-amber-500 to-orange-600', border: 'border-amber-500/30', bg: 'bg-amber-900/20', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
};

// ============== Main Component ==============
interface DailyNeuralMissionCardProps {
    data?: CodeData[];
}

export default function DailyNeuralMissionCard({ data }: DailyNeuralMissionCardProps) {
    const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());
    const [expandedMission, setExpandedMission] = useState<string | null>(null);
    const [checkinNotes, setCheckinNotes] = useState<Record<string, string>>({});

    if (!data || data.length === 0) return null;

    const missions = generateMissions(data);
    const completedCount = completedMissions.size;
    const totalCount = missions.length;
    const progressPercent = (completedCount / totalCount) * 100;

    const toggleMission = (id: string) => {
        setExpandedMission(expandedMission === id ? null : id);
    };

    const completeMission = (id: string) => {
        const next = new Set(completedMissions);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setCompletedMissions(next);
    };

    // Get current date in Korean
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayStr = dayNames[today.getDay()];

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">

            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                            오늘의 미션
                        </h2>
                        <p className="text-slate-500 text-xs mt-1">NEURAL CODE ACTION PLAN</p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-sm font-medium">{dateStr}</p>
                        <p className="text-slate-500 text-xs">{dayStr}요일</p>
                    </div>
                </div>

                {/* Intro Quote */}
                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 mb-4">
                    <p className="text-indigo-200 text-sm leading-relaxed italic">
                        💡 "생각과 관점의 전환(Shift)을 일상의 구체적인 행동(Action)으로 연결할 때, 뉴럴 코드는 가장 강력한 현실 창조의 무기가 됩니다."
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-amber-400 text-sm font-bold">{completedCount}/{totalCount}</span>
                    {completedCount === totalCount && completedCount > 0 && (
                        <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                            🎉 ALL CLEAR!
                        </span>
                    )}
                </div>
            </div>

            {/* Mission Cards */}
            <div className="px-6 pb-6 space-y-4">
                {missions.map((mission) => {
                    const colors = PILLAR_COLORS[mission.pillarId] || PILLAR_COLORS.vision;
                    const isExpanded = expandedMission === mission.pillarId;
                    const isCompleted = completedMissions.has(mission.pillarId);

                    return (
                        <div
                            key={mission.pillarId}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isCompleted
                                    ? 'border-emerald-500/40 bg-emerald-950/20'
                                    : `${colors.border} ${colors.bg}`
                                }`}
                        >
                            {/* Mission Header — Clickable */}
                            <div
                                onClick={() => toggleMission(mission.pillarId)}
                                className="p-4 cursor-pointer active:scale-[0.99] transition-transform"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-2xl">{mission.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold ${colors.text}`}>
                                                    {mission.pillarLabel}
                                                </span>
                                                <span className="text-slate-600 text-xs">·</span>
                                                <span className="text-slate-400 text-xs">
                                                    {mission.codeName}
                                                </span>
                                            </div>
                                            <p className="text-white font-bold text-sm truncate">
                                                {isCompleted && '✅ '}{mission.missionTitle}
                                            </p>
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="px-4 pb-4 space-y-4">
                                    {/* Action Plan */}
                                    <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm">🎯</span>
                                            <span className={`text-xs font-bold ${colors.text} uppercase tracking-wider`}>
                                                Action Plan
                                            </span>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {mission.actionPlan}
                                        </p>
                                    </div>

                                    {/* Evening Check-in */}
                                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm">🌙</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                저녁의 알아차림 (Check-in)
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed italic mb-3">
                                            "{mission.eveningCheckin}"
                                        </p>

                                        {/* Memo Input */}
                                        <textarea
                                            value={checkinNotes[mission.pillarId] || ''}
                                            onChange={(e) => setCheckinNotes({ ...checkinNotes, [mission.pillarId]: e.target.value })}
                                            placeholder="오늘의 알아차림을 기록하세요..."
                                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-amber-500/50 transition-colors"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Complete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            completeMission(mission.pillarId);
                                        }}
                                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isCompleted
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : `bg-gradient-to-r ${colors.gradient} text-white shadow-lg ${colors.glow}`
                                            }`}
                                    >
                                        {isCompleted ? '✅ 미션 완료! (다시 누르면 취소)' : '🔥 미션 수행 완료'}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Note */}
            <div className="px-6 pb-6">
                <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-slate-400 text-xs leading-relaxed text-center">
                        🧠 미션을 완수할수록 뉴럴 코드 레벨이 올라갑니다.<br />
                        꾸준한 실천이 메타 코드로의 진화를 앞당깁니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
